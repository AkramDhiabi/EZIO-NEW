import * as React from 'react';
import {connect} from 'react-redux';
import {store} from '../Store/store';
import {Provider} from 'react-redux';
import {Link} from 'react-router-dom';
import {
    Accordion,
    Button,
    Container,
    Grid,
    Header,
    Dropdown,
    Loader,
    Tab,
    Message,
    Icon,
    Image,
    Item,
    Label,
    Menu,
    Segment,
    Step,
    Table,
    Form,
    Modal,
    Divider,
    Input,
    List
} from 'semantic-ui-react';
import 'semantic-ui-css/semantic.min.css';
import Gemaltohdr from './Gemaltohdr.component';

import {ToastDanger} from 'react-toastr-basic';

import {bindActionCreators} from 'redux';
import {setload, getproductlist,getEcommcardlist,postecommvalidation,setcurrentroute,setusername,checklogin} from '../Actions/action';
import {
    postusercheckpendingstatus,
    posttransactionsendnotification,
    postusersgetcallbackstatus,
    postuserdeletecallbackdataaction,
    postusersdeletependingtransactionstatus,
    posteziologoutaction
} from "../Actions/action";
import * as ReactCountdownClock from "react-countdown-clock";

const logotop2 = require('../../img/logo-top-2.png');
const logotop = require('../../img/logo-top.png');
const dslogo = require('../../img/3D_secure.jpg');
const waiting = require('../../img/waiting.png');
const mybank = require('../../img/mybank.png');
class EcommerceDCV extends React.Component < any,
any > {

    constructor(props) {
        super(props);
        this.state = {
            username: store
                .getState()
                .username,
            cart:[],
            currentshopstate:1,
            selectedcard:null,
            cardno0:'',
            cardno1:'',
            cardno2:'',
            cardno3:'',
            expirymonth:'',
            expiryyear:'',
            cvv:'',
            cartPrice:0,
            cartQuantity:0,
            threeDS:false,
            myBank:false,
            cartactive:false,
            paymentsuccess:false,
            paymentfailure:false,
            paymenttimeout:false,
            ecommDescmodal:false,
            cardcvv:true,
            cardselect:true
        };

        this.handleChange = this.handleChange.bind(this);
    }

    componentWillMount() {

        this
            .props
            .setload(true);
        const self = this;
        this
            .props
            .getproductlist()
            .then(function (response) {
              console.log(response);
              // modif  dans la clause if en enlevant la contrainte && response.status === 200
                if (response !== undefined) {
                    //Modification de reponse.data par == reponse
                    self.setState({productlist: response})

                    self
                        .props
                        .setload(false);
                } else {
                    self
                        .props
                        .setload(false);
                    console.log('Error');
                }
            })
            const senddata = {
                userId: store
                    .getState()
                    .username,
                operationType:'EzioDemoV2_eCommerceDCV'
            }

        this.props.getEcommcardlist(senddata).then(function(response){

            if(response !==undefined)
            {
                var cardoptions=[];
                self.setState({
                    cardlist: response.data.templateObject
                })
                response.data.templateObject.map(function(frmobj, find){
                        var fobj = {
                            text: frmobj.panType,
                            value: frmobj.panNo
                        }
                        cardoptions.push(fobj)
                })
                self.setState({
                    carddetails:cardoptions
                })

            }

        });
    }

    componentDidMount() {}

    addproduct(e,product,prodIndex)
    {
        e.preventDefault();
        this.props.setload(true);

        this.state.cart.push(product);

        this.setState({
            cartPrice: this.state.cartPrice + product.price,
            cartQuantity: this.state.cartQuantity + 1
        })
        console.log(document.getElementsByName("addcart"+prodIndex))
        document.getElementsByName("addcart"+prodIndex)[0].classList.add("removevisiblity");
        document.getElementsByName("removecart"+prodIndex)[0].classList.remove("removevisiblity");
        console.log(this.state.cart);
        this.props.setload(false);
    }
    removeproduct(e,product,prodIndex)
    {
        this.props.setload(true);
        var array = this.state.cart.filter(function(item) {
            return item.prodId !== product.prodId
          });
          if(this.state.cartPrice !== 0 && this.state.cartQuantity !== 0 )
          {
            this.setState({
                cartPrice: this.state.cartPrice - product.price,
                cartQuantity: this.state.cartQuantity - 1
            })
          }

        this.setState({
            cart: array
        })
        document.getElementsByName("addcart"+prodIndex)[0].classList.remove("removevisiblity");
        document.getElementsByName("removecart"+prodIndex)[0].classList.add("removevisiblity");
        console.log(this.state.cart);
        this.props.setload(false);
    }

    checkvisibility(item,prodIndex){
        var presentstatus = this.state.cart.indexOf(item);
        if(presentstatus !== -1)
        {
            document.getElementsByName("addcart"+prodIndex)[0].classList.add("removevisiblity");
            document.getElementsByName("removecart"+prodIndex)[0].classList.remove("removevisiblity");
        }
    }

    removecartproduct(e,product,prodIndex)
    {
        this.props.setload(true);
        if(this.state.cart.length > 1)
        {
            var array = this.state.cart.filter(function(item) {
                return item.prodId !== product.prodId
              });
              if(this.state.cartPrice !== 0 && this.state.cartQuantity !== 0 )
              {
                this.setState({
                    cartPrice: this.state.cartPrice - product.price,
                    cartQuantity: this.state.cartQuantity - 1
                })
                this.setState({
                    cart: array
                })

              }
            }
        else{

                this.setState({
                    cartPrice: 0,
                    cartQuantity: 0
                })
                this.setState({
                    cart: []
                })
        }

        this.props.setload(false);

    }
    handlecartstate()
    {
        this.props.setload(true);
        if(this.state.cart.length >0)
        {
            this.setState({
                currentshopstate:2
            });
        }
       else{
           this.setState({
               cartactive:true
           })
       }
        this.props.setload(false);
    }

    handlecheckout()
    {
        this.props.setload(true);

        if(this.state.cart.length >0)
        {
            this.setState({
                currentshopstate:3
            });
        }
       else{
           this.setState({
               cartactive:true
           })
       }
       this.props.setload(false);

    }

    handleDCVpayment()
    {
        this.props.setload(true);
        const self=this;
        this.setState({ cardselect:true,cardcvv:true});
        if(this.state.selectedcard !== null && this.state.cvv !== '' && this.state.cvv.length === 3)
        {
        var sendcartdetails ={
            amount: this.state.cartPrice,
            cardNumber: this.state.selectedcard.panNo,
            cvv: this.state.cvv,
            expDate: this.state.selectedcard.expDate,
            transactionType: "EzioDemoV2_eCommerceDCV",
            userId: this.state.username
        }

        this.props.postecommvalidation(sendcartdetails).then(function(response){
            console.log(response);

            if(response.data.responseCode === 200)
            {
                self.setState({
                    paymentsuccess:true
                })
                self.props.setload(false);
            }
            else{
                self.setState({
                    paymentfailure:true
                })
                self.props.setload(false);
            }

        })
    }
    else{

        if(this.state.selectedcard === null)
            this.setState({ cardselect:false});
        if(this.state.cvv === '' || this.state.cvv.length === 3)
            this.setState({ cardcvv:false})

        this.props.setload(false);

        }
    }


    handleChange(e,{name,value})
    {
        console.log(e,name,value);
        const currentcard = this.state.cardlist.filter(function(item) {
            return item.panNo == value
        });
        console.log(this.state.selectedcard);
        console.log("selectedcard",currentcard[0]);
        console.log("selectedcard pan",currentcard[0].panNo.match(/.{1,4}/g))
        var demo = currentcard[0].panNo.match(/.{1,4}/g);
        this.setState({
            cardno0:demo[0],
            cardno1:demo[1],
            cardno2:demo[2],
            cardno3:demo[3]
        })

        this.setState({
            expirymonth:currentcard[0].expDate.split('/')[0],
            expiryyear:'20'+currentcard[0].expDate.split('/')[1],
            selectedcard:currentcard[0]
        })

    }

    handlehomeChange(e, { name, value}){
        console.log(e,value);
        if(value == 1)
        {
            this.props.setcurrentroute(`/ecomm3ds`);
            this.props.history.push(`/layout/loading`);
        }
        else  if(value == 2){
            this.props.setcurrentroute(`/ecommdcv`);
            this.props.history.push(`/layout/loading`);
        }
        else if(value == 3)
        {
            this.props.history.push(`/layout/accountsummary`)
        }

    }

    handleKeyPressnumber = (event) => {
        var charCode = event.charCode;
        //Non-numeric character range
        if (charCode > 31 && (charCode < 48 || charCode > 57)) {
            event.preventDefault();
        }
    }
    render() {
        const options = [
            {
                key: 1,
                text: 'Purchase goods with 3DS',
                value: 1
            }, {
                key: 2,
                text: 'Purchase goods with DCV',
                value: 2
            }, {
                key: 3,
                text: 'Logout',
                value: 3
            }
        ]

        // const DropdownExampleSimple = () => (
        //     <Menu className="shopmenu" compact>
        //         <Dropdown  id="shopdropdown" text='Dropdown' onChange={this.handlehomeChange} options={options} simple item/>
        //     </Menu>
        // )
        return (
            <div id="ecommbg">
                <Grid>
                    <Grid.Row>
                        <Grid.Column id="ecommhdrcol">
                            <div id="ecommhdr">
                                <Container id="ecommhdrcontainer">
                                    <img src={logotop2} className="logo_tales_pic" alt="Mobileapplogo"/>
                                </Container>
                            </div>
                        </Grid.Column>
                    </Grid.Row>
                    <Grid.Row>
                        <Container id="ezioshopContainer">
                            <Grid>
                                <Grid.Row>
                                    <Grid.Column floated='left' width={5}>
                                        <h1 id="shoptitle">Demo shop</h1>
                                    </Grid.Column>
                                    <Grid.Column floated='right' width={5}>

                                        <Menu className="shopmenu ecomm-dropdown" compact>
                                        <Icon className="ecomm-homeicon" onClick={()=>{this.props.history.push(`/layout/accountsummary`)}} name='home'/>
                                            <Dropdown id="shopdropdown" text={store.getState().username || 'Eziov2test001'} onChange={this.handlehomeChange.bind(this)} options={options} simple item/>
                                        </Menu>
                                    </Grid.Column>
                                </Grid.Row>
                            </Grid>
                            {
                                this.state.currentshopstate === 1 &&

                                <Grid className="shopcatalogContainer">
                                    <Grid.Row>
                                        <Grid.Column className="shoptitle">
                                            <span className="title">Purchase goods with DCV</span>
                                        </Grid.Column>
                                    </Grid.Row>
                                    <Grid className="productgrid">
                                    <Grid.Row>
                                        <Grid.Column floated='left' width={8}>
                                            <h2 className="ecomm-title">BROWSE CATALOGUE</h2>
                                        </Grid.Column>
                                        <Grid.Column floated='right' className="ecomm-breadcrum" width={8}>
                                            <List className="ecommstep" ordered horizontal link>
                                                <List.Item className="ecommstepcolor activestep">BROWSE CATALOGUE <span className="ecommstepcolor"> </span></List.Item>
                                                <List.Item className="ecommstepcolor">CHECKOUT <span className="ecommstepcolor"> </span></List.Item>
                                                <List.Item className="ecommstepcolor">PAYMENT</List.Item>
                                            </List>
                                        </Grid.Column>
                                    </Grid.Row>
                                    <Grid.Row>
                                    {this.state.productlist !== undefined && this.state.productlist.map((item, i) => (
                                    <Grid.Column  width={8}>
                                    <div className="productBox">
                                            <Item.Group className="cartItem productDetailbox">
                                            <Item className="itembox">
                                                <Item.Image size='small' src={item.productImg}/>

                                                <Item.Content>
                                                    <span className="itemname">{item.productName}</span>
                                                    <Item.Description>
                                                    <p className="prod-note">{item.productNote}</p>

                                                    </Item.Description>
                                                    <Modal className="ecommmodal ecomm-background" size="small" trigger={<span className="viewdetail">View details</span>} closeIcon centered={false}>
                                                        <Modal.Content className="ecomm-model-content">
                                                        <Image className="ecomm-modal-img" src={item.productImg} />
                                                        <Modal.Description>
                                                            <Header className="itemname">{item.productName}</Header>
                                                            <p className="prod-note">{item.productDesc}</p>
                                                        </Modal.Description>
                                                        </Modal.Content>
                                                        <Divider/>
                                                        <h2 className="ecomm-modal-price">Price: $ {item.price}.00</h2>
                                                    </Modal>
                                                </Item.Content>

                                            </Item>
                                                <div className="shopbuttonGroup">
                                                        <span className="pricecls">${item.price}.00</span>

                                                        <Button color='grey' compact name={'addcart'+i} className="ecommbutton addbtncls" onClick={(e)=>this.addproduct(e,item,i)}>Add to cart</Button>

                                                        <Button color='grey' compact name={'removecart'+i} className="ecommbutton rmvbtncls removevisiblity" onClick={(e)=>this.removeproduct(e,item,i)} ref={() => { this.checkvisibility(item,i) }}>Remove from cart</Button>
                                                    </div>
                                            </Item.Group>
                                            </div>
                                        </Grid.Column>
                                    ))
                                    }
                                    </Grid.Row>
                                    <Grid.Row>
                                        <Grid.Column>
                                            <Segment className="shopbgcls ecomm-cartdetail" textAlign='right'>
                                                <span className="ecomm-cartqty">Cart total ({this.state.cartQuantity} item(s)) </span>
                                                <span className="ecomm-cartprice">    $ {this.state.cartPrice || 0}.00</span>
                                            </Segment>
                                            <Divider/>
                                            <Segment className="shopbgcls" textAlign='center'>
                                                <Button className="ecommbutton ecomm-defaultbutton" onClick={this.handlecartstate.bind(this)}>View cart</Button>
                                            </Segment>
                                        </Grid.Column>

                                    </Grid.Row>
                                    </Grid>

                                </Grid>
                            }

                            {
                                this.state.currentshopstate == 2 &&
                                        <Grid className="shopcatalogContainer">
                                    <Grid.Row>
                                        <Grid.Column className="shoptitle">
                                            <span className="title">Purchase goods with DCV</span>
                                        </Grid.Column>
                                    </Grid.Row>
                                    <Grid className="productgrid">
                                    <Grid.Row>
                                        <Grid.Column floated='left' width={8}>
                                            <h2 className="ecomm-title">SHOPPING CART</h2>
                                        </Grid.Column>
                                        <Grid.Column floated='right' className="ecomm-breadcrum" width={8}>
                                        <List className="ecommstep" ordered horizontal link>
                                                <List.Item as='a' onClick={()=>{this.setState({currentshopstate:1})}} className="ecommstepcolor">BROWSE CATALOGUE <span className="ecommstepcolor"> </span></List.Item>
                                                <List.Item className="ecommstepcolor activestep">CHECKOUT <span className="ecommstepcolor"></span></List.Item>
                                                <List.Item className="ecommstepcolor">PAYMENT</List.Item>
                                            </List>
                                        </Grid.Column>
                                    </Grid.Row>
                                    <Grid.Row>
                                    {this.state.cart !== undefined && this.state.cart.length > 0 && this.state.cart.map((item, i) => (
                                    <Grid.Column width={16}>
                                            <Item.Group className="cartItem">
                                            <Item>
                                                <Item.Image size='small' src={item.productImg}/>
                                                <Item.Content>
                                                    <span className="itemname">{item.productName}</span>
                                                    <Item.Description className="prod-note">
                                                        <br/>
                                                    {item.productNote}
                                                    </Item.Description>

                                                </Item.Content>
                                                <div className="checkout-btngroup{">
                                                    <button name={'removecart'+i} className="checkoutrmvbutton trashbutton" onClick={(e)=>this.removecartproduct(e,item,i)}>
                                                            <Icon size='large' color='blue' name='trash'/>
                                                        </button>
                                                    <span className="pricecls">${item.price}.00</span>
                                                </div>
                                            </Item>
                                            </Item.Group>
                                        </Grid.Column>
                                    ))
                                    }
                                    </Grid.Row>
                                    <Grid.Row>
                                        <Grid.Column>
                                            <Segment className="shopbgcls ecomm-cartdetail" textAlign='right'>
                                                <span className="ecomm-cartqty">Cart total ({this.state.cartQuantity} item(s)) </span>
                                                <span className="ecomm-cartprice">    $ {this.state.cartPrice || 0}.00</span>
                                            </Segment>
                                            <Divider/>
                                            <Segment className="shopbgcls" textAlign='center'>
                                                <Button className="ecommbutton ecomm-defaultbutton" onClick={this.handlecheckout.bind(this)}>Checkout</Button>
                                            </Segment>
                                        </Grid.Column>

                                    </Grid.Row>
                                    </Grid>

                                </Grid>

                             }

                               {
                                this.state.currentshopstate == 3 &&
                                    <Grid className="shopcatalogContainer">
                                    <Grid.Row>
                                        <Grid.Column className="shoptitle">
                                            <span className="title">Purchase goods with DCV</span>
                                        </Grid.Column>
                                    </Grid.Row>
                                    <Grid className="productgrid">
                                    <Grid.Row>
                                        <Grid.Column floated='left' width={8}>
                                            <h2 className="ecomm-title">PAYMENT</h2>
                                        </Grid.Column>
                                        <Grid.Column floated='right' className="ecomm-breadcrum" width={8}>
                                        <List className="ecommstep" ordered horizontal link>
                                                <List.Item as='a' onClick={()=>{this.setState({currentshopstate:1})}} className="ecommstepcolor">BROWSE CATALOGUE <span className="ecommstepcolor"> </span></List.Item>
                                                <List.Item as='a' onClick={()=>{this.setState({currentshopstate:2})}}className="ecommstepcolor">CHECKOUT <span className="ecommstepcolor"> </span></List.Item>
                                                <List.Item className="ecommstepcolor activestep">PAYMENT</List.Item>
                                            </List>
                                        </Grid.Column>
                                    </Grid.Row>
                                    <Grid.Row>
                                        <Grid.Column className="ecomm-paymentsummary" width={16}>
                                        <span className="ecomm-ptitle">PAYMENT SUMMARY</span>
                                        <Table celled padded>
                                            <Table.Header className="ecomm-tableheader">
                                                <Table.Row>
                                                    <Table.HeaderCell>ITEM</Table.HeaderCell>
                                                    <Table.HeaderCell>PRICE</Table.HeaderCell>
                                                </Table.Row>
                                            </Table.Header>
                                            <Table.Body>
                                            {this.state.cart !== undefined && this.state.cart.length > 0 && this.state.cart.map((item, i) => (

                                                <Table.Row>
                                                    <Table.Cell>
                                                        {item.productName}
                                                    </Table.Cell>
                                                    <Table.Cell>
                                                        $ {item.price}.00
                                                    </Table.Cell>
                                                </Table.Row>
                                                ))
                                            }
                                                <Table.Row className="ecomm-tablefooter">
                                                    <Table.Cell className="ecomm-cart-right">
                                                        CART TOTAL ({this.state.cartQuantity} ITEM(S))
                                                    </Table.Cell>
                                                    <Table.Cell>
                                                        $ {this.state.cartPrice || 0}.00
                                                    </Table.Cell>
                                                </Table.Row>
                                            </Table.Body>
                                        </Table>
                                        </Grid.Column>

                                    </Grid.Row>
                                    <Grid.Row>
                                        <Grid.Column className="ecomm-billdetails" width={16}>
                                        <span className="ecomm-ptitle">BILLING INFORMATION</span>
                                        <Table className="rttable ecomm-payment-table" celled padded>

                                            <Table.Body>

                                                <Table.Row>
                                                    <Table.Cell  className="ecomm-billing-padding">
                                                        PAY WITH
                                                    </Table.Cell>
                                                    <Table.Cell className="ecomm-border">

                                                    <Dropdown placeholder='Select' name="cards" className="etdropdown ecomm-expiry ecomm-input-box ecomm-select" selection  defaultValue={this.state.selectedcard}  onChange={this.handleChange} options={this.state.carddetails} />
                                                    {this.state.cardselect === false && <span className="ecomm-error">Please select your payment account</span>}

                                                    </Table.Cell>
                                                </Table.Row>
                                                <Table.Row>
                                                    <Table.Cell  className="ecomm-billing-padding">
                                                        CARD NUMBER
                                                    </Table.Cell>
                                                    <Table.Cell className="ecomm-border">
                                                    <input className="ecomm-cardno" type='text' id="cardno0" disabled value={this.state.cardno0}/>
                                                    <input className="ecomm-cardno" type='text'id="cardno1" disabled value={this.state.cardno1}/>
                                                    <input className="ecomm-cardno" type='text' id="cardno2" disabled value={this.state.cardno2}/>
                                                    <input className="ecomm-cardno" type='text' id="cardno3" disabled value={this.state.cardno3}/>
                                                    {this.state.cardselect === false && <span className="ecomm-error">Please enter your card number</span>}
                                             </Table.Cell>
                                                </Table.Row>
                                                <Table.Row>
                                                    <Table.Cell  className="ecomm-billing-padding">
                                                        EXPIRATION DATE
                                                    </Table.Cell>
                                                    <Table.Cell className="ecomm-border">

                                                    <Dropdown placeholder={this.state.expirymonth === '' ?'Month':this.state.expirymonth} className="etdropdown expiry-sec ecomm-expiry"  disabled options={[]}/>

                                                    <Dropdown placeholder={this.state.expiryyear === '' ? 'Year' :this.state.expiryyear} className="etdropdown expiry-sec ecomm-expiry" disabled options={[]}/>
                                                    {this.state.cardselect === false && <span className="ecomm-error">Please select expiration date of your card</span>}


                                                    </Table.Cell>
                                                </Table.Row>
                                                <Table.Row>
                                                    <Table.Cell  className="ecomm-billing-padding">
                                                        SECURITY CODE
                                                    </Table.Cell>
                                                    <Table.Cell className="ecomm-border">
                                                    <input className="ecomm-cardno ecomm-input-box" maxLength={3} onKeyPress={this.handleKeyPressnumber} type='text' value={this.state.cvv} onChange={(evt) => { console.log(evt.target.value); this.setState({
                                                        cvv:evt.target.value
                                                    })}}/>
                                                     {this.state.cardcvv === false && <span className="ecomm-error">Please enter security code of your card</span>}


                                                    </Table.Cell>
                                                </Table.Row>
                                            </Table.Body>
                                        </Table>
                                        </Grid.Column>

                                    </Grid.Row>

                                    <Grid.Row>
                                        <Grid.Column>
                                            <Segment className="shopbgcls ecomm-cartdetail" textAlign='right'>
                                                <span className="ecomm-cartqty">Cart total ({this.state.cartQuantity} item(s)) </span>
                                                <span className="ecomm-cartprice">    $ {this.state.cartPrice || 0}.00</span>
                                            </Segment>
                                            <Divider/>
                                            <Segment className="shopbgcls" textAlign='center'>
                                                {/* <Button className="ecommbutton" onClick={this.handle3DSpayment.bind(this)}>Confirm payment</Button>*/}
                                                 <Button className="ecommbutton ecomm-defaultbutton"  onClick={this.handleDCVpayment.bind(this)}>Confirm payment</Button>

                                            </Segment>
                                            <Modal className="ecommmodal ecomm-cartvalid" size="tiny"  open={this.state.paymenttimeout} centered={false}>
                                                <Modal.Content className="ecomm-cartvalid">
                                                    <p className="ecomm-modal-msg-txt">Mobile authentication unsuccessful.</p>
                                                    <p className="ecomm-modal-msg-txt">Transaction has timed out. Please try again.</p>
                                                    <Button className="ecomm-defaultbutton" negative onClick={() => {this.setState({paymenttimeout:false})
                                                this.props.setcurrentroute(`/ecommdcv`);
                                                this.props.history.push(`/layout/loading`);}}>Close</Button>
                                                </Modal.Content>
                                            </Modal>

                                            <Modal className="ecommmodal ecomm-cartvalid" size="tiny"  open={this.state.paymentfailure} centered={false}>

                                                <Modal.Content className="ecomm-cartvalid">
                                                    <p className="ecomm-modal-msg-txt ecomm-red">Sorry, payment rejected. Please try again.</p>
                                                    <Button className="ecomm-defaultbutton" negative onClick={() => {this.setState({paymentfailure:false});
                                                    this.props.setcurrentroute(`/ecommdcv`);
                                                    this.props.history.push(`/layout/loading`);}}>Close</Button>
                                                </Modal.Content>
                                            </Modal>
                                            <Modal className="ecommmodal ecomm-cartvalid" size="tiny" open={this.state.paymentsuccess} centered={false}>
                                                <Modal.Content className="ecomm-cartvalid">
                                                    <p className="ecomm-modal-msg-txt ecomm-green">Your payment has been processed successfully.</p>
                                                    <Button className="ecomm-defaultbutton" negative onClick={() => {this.setState({paymentsuccess:false});
                                                 this.props.setcurrentroute(`/ecommdcv`);
                                                 this.props.history.push(`/layout/loading`);}}>Okay</Button>
                                                </Modal.Content>
                                            </Modal>
                                        </Grid.Column>
                                    </Grid.Row>
                                    </Grid>
                                </Grid>
                         }
                            <Modal className="ecommmodal ecomm-cartvalid" size="tiny" open={this.state.cartactive} centered={false}>
                                <Modal.Content className="ecomm-cartvalid">
                                    <p className="ecomm-modal-msg-txt">Please add at least one item to your shopping cart.</p>
                                    <Button className="ecomm-defaultbutton" negative onClick={() => {this.setState({cartactive:false});
                                     if(this.state.currentshopstate == 2)
                                     {
                                         this.props.setcurrentroute(`/ecommdcv`);
                                         this.props.history.push(`/layout/loading`);
                                     }
                                    }}>Browse catalogue</Button>
                                </Modal.Content>
                            </Modal>

                        </Container>
                        </Grid.Row>
                </Grid>
            </div>
        )
    }
}

function mapStateToProps(state) {
    return {
        username: state.username,
        checkpendingtransactionresponse: state.checkpendingtransactionresponse,
        transactionsendnotificationresponse: state.transactionsendnotificationresponse,
        getcallbackresponse: state.getcallbackresponse,
        snpending: state.snpending,
        sninvotp: state.sninvotp,
        sninvhashdata: state.sninvhashdata,
        snrejected: state.snrejected,
        sntimeout: state.sntimeout,
        snnotifynotsent: state.snnotifynotsent
    }
}
function matchDispatchToProps(dispatch) {
    return bindActionCreators({
        setload: setload,
        getproductlist: getproductlist,
        getEcommcardlist:getEcommcardlist,
        postecommvalidation:postecommvalidation,
        postusercheckpendingstatus: postusercheckpendingstatus,
        posttransactionsendnotification: posttransactionsendnotification,
        postusersgetcallbackstatus: postusersgetcallbackstatus,
        postusersdeletependingtransactionstatus: postusersdeletependingtransactionstatus,
        postuserdeletecallbackdataaction: postuserdeletecallbackdataaction,
        setcurrentroute:setcurrentroute,
        posteziologoutaction:posteziologoutaction,
        setusername:setusername,
        checklogin:checklogin

    }, dispatch)
}

export default connect(mapStateToProps, matchDispatchToProps)(EcommerceDCV);
