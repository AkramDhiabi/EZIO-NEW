import * as React from 'react';
import { Component } from 'react'
import { Link } from 'react-router-dom';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { store } from '../Store/store';
import { setload,
    getcardlist,
    postusercheckpendingstatus,
    posttransactionsendnotification,
    postusersgetcallbackstatus,
    postuserdeletecallbackdataaction,
    postusersdeletependingtransactionstatus} from '../Actions/action';
import {
    Accordion,
    Button,
    Container,
    Grid,
    Header,
    Icon,
    Image,
    Item,
    Label,
    Menu,
    Segment,
    Step,
    Table,
    Message,
    Tab,
    Divider,
    Dropdown,
    Modal
} from 'semantic-ui-react';
import { FormBuilder, FieldControl, FieldGroup } from "react-reactive-form";
import { ToastDanger } from 'react-toastr-basic';
import * as ReactCountdownClock from "react-countdown-clock";
import Cards from 'react-credit-cards';

import 'semantic-ui-css/semantic.min.css';
import 'react-credit-cards/es/styles-compiled.css';
const loginlogo = require('../../img/demologo.png');

class Cardissuance extends React.Component<any, any> {
    constructor(props) {
        super(props);

        this.state={
            // username: 'mindtree001',
            username: store.getState().username,
            currentissuancestep: 1,
            selectedCard:null,
            selectedReason:null,
            carddata:null,
            reasondata:null,
            cardissuanceopen:false,
            cardissuanceSuccess:false,
            cardissuanceFailure:false,
            cardissuanceTimeout:false,
            cardissuanceLimitreached:false,
            cardissuanceRequestpending:false,
            cardissuanceMobilenotregistered:false
        }

    }
    cardOptions=[]

   
    componentWillMount() {
        this
        .props
        .setload(true);
            this.setState({
                currentissuancestep: 1
            });
           
        const senddata = {
            userId: store
                .getState()
                .username
        }
        const self = this;

        this
            .props
            .getcardlist(senddata)
            .then(function (response) {
                console.log(response);

                if (response !== undefined && response.data.responseCode === 200) {
                    response.data.templateObject.forEach(function (card) {
                        if (card.panTypeFlag === 0 && card.panType.includes("DCV") === false) {
                            if(card.panType.includes("VISA") === true)
                            {
                                card['text'] = 'VISA',
                                card['value'] = 0,
                                card['cardType']='visa'
                            }
                            else{
                                card['text'] = 'MASTERCARD',
                                card['value'] = 1,
                                card['cardType']='mastercard'
                            }
                            self.cardOptions.push(card);
                        }
                    });
                    self
                        .props
                        .setload(false);
                } else if (response !== undefined && response.data.responseCode === 204) {
                    self.setState({cardOptions: []});
                    self
                        .props
                        .setload(false);
                } else {
                    self.setState({cardOptions: []});
                    self
                        .props
                        .setload(false);
                    console.log('Error');
                }

            })
  
    }

    componentWillUnmount(){

    }
    handleuserpreferChange(e,evalue,property){
        this.setState({ [property]:evalue.value });
       
        console.log(this.state,evalue,'value');
    }

    handleissuancecancel(e) {
        e.preventDefault();
        this.props.history.push('/layout/accountsummary');
    }

    handleEnterstep(e:  React.MouseEvent<HTMLButtonElement>) {
        e.preventDefault();
        if(this.state.selectedCard !== null && this.state.selectedReason !==null)
        {
            var newcarddata = this.cardOptions.filter(card => card.value === this.state.selectedCard)[0];
            var newreason = this.reasonOptions.filter(reason => reason.value === this.state.selectedReason)[0]
            this.setState({
                carddata: newcarddata,
                reasondata:newreason,
                currentissuancestep:2
            })
        }
        else
        {
            ToastDanger('Error. (*) fields are required');
        }
    }
    handleReviewchange(e:  React.MouseEvent<HTMLButtonElement>) {
        e.preventDefault();
        this.setState({
            currentissuancestep:1
        })
    }

    handleReviewstep(e:  React.MouseEvent<HTMLButtonElement>) {
        e.preventDefault();
        this.setState({
            currentissuancestep:3
        })
    }
    handlenamemask(displayname){
        var first3 = displayname.substring(0, 4);
        var displaymask = displayname.substring(4, displayname.length).replace(/[a-z0-9]/gi,"*");
        return first3 + displaymask;
    }


    show = () => this.setState({cardissuanceopen: true})
    close = () => this.setState({cardissuanceopen: false})

    closeoncomplete() {
        try {     window.stop(); } catch (exception) {     document.execCommand('Stop'); };
        this.close();
        const sendtransdetails = {
            usrnme: this.state.username
        }
        this
            .props
            .setload(false);
        this.setState({ cardissuanceTimeout: true });
        this
            .props
            .postuserdeletecallbackdataaction(sendtransdetails)
            .then(function (response) {
                console.log(response);
            });
    }

    notifyclose() {
        try {     window.stop(); } catch (exception) {     document.execCommand('Stop'); };
        this.close();
        const sendtransdetails = {
            usrnme: this.state.username
        }
        this
            .props
            .setload(false);
        this
            .props
            .postuserdeletecallbackdataaction(sendtransdetails)
            .then(function (response) {
                console.log(response);
            });
          
    }
    handleTryagain(e : React.MouseEvent < HTMLButtonElement >) {
        console.log("In loginanotherway");

        const sendtransdetails = {
            usrnme: this.state.username,
            msgId: this.props.transactionsendnotificationresponse.data.templateObject
        }
        this.notifyclose();
        const selfval = this;
        this
            .props
            .postusersdeletependingtransactionstatus(sendtransdetails)
            .then(function (response) {
                console.log(selfval.props.deletependingtransactionresponse)
            })
    }

    
    handleCardissuance(e : React.MouseEvent < HTMLButtonElement >) {
        this.setState({
            cardissuanceSuccess:false,
            cardissuanceFailure:false,
            cardissuanceTimeout:false,
            cardissuanceLimitreached:false,
            cardissuanceRequestpending:false,
            cardissuanceMobilenotregistered:false
        })

        const self = this;
        self
            .props
            .setload(true)
        console.log("send notification clicked");
       
        var carddetails={
            userId: this.state.username,
            cardType: this.state.carddata.text
        }
        var sendCardissuanceData = {
            usrnme: this.state.username,
            operationtype: 'EzioDemoV2_CardIssuance',
            data: carddetails
        }

        self
            .props
            .postusercheckpendingstatus(sendCardissuanceData)
            .then(function (response) {

                //checkpendingtransactionresponse

                if (response !== undefined) {

                    if (self.props.checkpendingtransactionresponse.data.responseCode === 1) {
                        console.log("Looks like you have a pending transaction. Check your mobile first. ");
                        self
                            .props
                            .setload(false)
                        ToastDanger('Looks like you have a pending transaction. Check your mobile first. ');

                    } else {
                        self
                            .props
                            .posttransactionsendnotification(sendCardissuanceData)
                            .then(function (response) {

                                if (response !== undefined) {
                                    if (self.props.transactionsendnotificationresponse.data.responseCode === 200) {

                                        let sendnotifyresponse = self.props.transactionsendnotificationresponse;
                                        const sendcallbackdetails = {
                                            usrnme: self.state.username,
                                            msgId: sendnotifyresponse.data.templateObject

                                        }
                                        self.show();

                                        self
                                            .props
                                            .postusersgetcallbackstatus(sendcallbackdetails)
                                            .then(function (response) {

                                                if (response !== undefined && response.data.responseCode === 200 ) {


                                                        let getcallbackresponsedata = self.props.getcallbackresponse.data.templateObject;
                                                        if (getcallbackresponsedata.responseCode === 200) {
                                                            self.notifyclose();
                                                            self
                                                            .props
                                                            .setload(false);
                                                            self.setState({
                                                                cardissuanceSuccess:true
                                                            })
                                                        } else {
                                                            console.log("callback failed");
                                                            self.notifyclose();
                                                            self
                                                                .props
                                                                .setload(false)
                                                           
                                                                self.setState({
                                                                    cardissuanceFailure:true
                                                                })
                                                                
                                                        }
                                                } else {
                                                    self
                                                        .props
                                                        .setload(false);
                                                    console.log("There is a server error")
                                                    
                                                }
                                            });

                                    } else {
                                        console.log("Notification not sent error");
                                        self
                                            .props
                                            .setload(false)
                                            if(self.props.transactionsendnotificationresponse.data.message === 'MAX_CARD_LIMIT_REACHED')
                                            {
                                                self.setState({
                                                    cardissuanceLimitreached:true
                                                })
                                            }
                                            else if(self.props.transactionsendnotificationresponse.data.message === 'CARD_ISSUANCE_REQUEST_PENDING')
                                            {
                                                self.setState({
                                                    cardissuanceRequestpending:true
                                                })
                                            }
                                            else if(self.props.transactionsendnotificationresponse.data.message === 'NO_MOBILE_FOUND_IN_OOBS')
                                            {
                                                self.setState({
                                                    cardissuanceMobilenotregistered:true
                                                })
                                            }
                                            else
                                            {
                                                ToastDanger('Notification not sent, please try again later.');
                                            }
                                        
                                    }

                                } else {
                                    self
                                        .props
                                        .setload(false);
                                    console.log("there is a server error")
                                    ToastDanger('Something Went Wrong');
                                }

                            });
                    }
                } else {
                    self
                        .props
                        .setload(false);
                    console.log("there is a server error");
                    ToastDanger('Something Went Wrong');
                }

            })
    }
    handlegotoMywallet(e){
        e.preventDefault();
        this.props.history.push('/layout/mywallet');
    }

    handlegotoMobileact(e){
        e.preventDefault();
        this.props.history.push('/mobileregistration');
    }

    reasonOptions = [
    {
         text: 'Damaged card',
         value: '00',
    },
    {
         text: 'Left in ATM',
         value: '01',
    },
    {
         text: 'Card lost/stolen',
         value: '02',
    },
    {
         text: 'New order',
         value: '03',
    }
]




    render() {

        return (

            <div>
                <Grid columns={1} stackable>
                    <Grid.Row>
                       
                        <Grid.Column id="ttitle" width={14}>
                            <Segment id="Summarybox">
                                <span className="accst">Order new card</span>
                                <a href="mailto:SUPPORT-DEMO@gemalto.com">
                                <span id="helpbox">Help
                                <Icon name='help circle' className="helpdesc" /></span>
                                </a>
                            </Segment>
                            <Segment className="defaultuiseg">
                                <Step.Group size='mini'>
                                    <Step active={this.state.currentissuancestep === 1} title='Enter card details'/>
                                    <Step active={this.state.currentissuancestep === 2} title='Review card details'/>
                                    <Step active={this.state.currentissuancestep === 3} title='Digital issuance'/>
                                </Step.Group>
                                {this.state.currentissuancestep === 1 &&
                                <Segment className="mtcontent" attached>
              
                                    <span className="addfontsize">Step 1 of 3: Enter card details</span>
                                    <span className="mtrequirelabel"><label className="star">*</label>indicates a required field</span>
                                    <div className="tmplbrdrcls addmargin"></div>

                                    <Table className="rttable" singleLine basic='very' unstackable>
                                                <Table.Body>
                                                    <Table.Row>
                                                        <Table.Cell width={3}>
                                                            <label className="pwdusr">Select type of card<label className="star">*</label></label>
                                                        </Table.Cell>
                                                        <Table.Cell key={this.state.selectedCard}>
                                                         
                                                            <Dropdown name="card" placeholder='Select Card' className="etdropdown" selection defaultValue={this.state.selectedCard}  onChange={(e,value) => this.handleuserpreferChange(e,value,'selectedCard')} options={this.cardOptions}/>
                                                    
                                                        </Table.Cell>
                                                    </Table.Row>
                                                    <Table.Row>
                                                        <Table.Cell>
                                                            <label className="pwdusr">Reason<label className="star">*</label></label>
                                                        </Table.Cell>
                                                        <Table.Cell  key={this.state.selectedReason}>
                                                          
                                                            <Dropdown name="reason" placeholder='Select Reason' className="etdropdown" selection defaultValue={this.state.selectedReason}  onChange={(e,value) => this.handleuserpreferChange(e,value,'selectedReason')} options={this.reasonOptions}/>
                                                    
                                                        </Table.Cell>
                                                    </Table.Row>
                                            
                                           
                                                </Table.Body>
                                            </Table>
                                
                                    <div>
                                        <Divider/>
                                        <button className="ui grey button"  onClick={(e) => this.handleissuancecancel(e)}> Cancel
                                        </button>
                                        <button className="ui blue button btnrightal" onClick={(e) => this.handleEnterstep(e)}> Continue
                                        </button>
                                    </div>
                                   
                                </Segment>
                                }
                                {this.state.currentissuancestep === 2 &&
                                <Segment className="mtcontent" attached>
                                    <div>
                                        <span className="addfontsize">Step 2 of 3: Review card details</span>
                                        <Divider />
                                        <Segment className="accdetailsec">
                                <div className="arrow_box">
                                {
                                   this.state.carddata.cardType === 'visa' &&
                                   <h5 className="logo">VISA credit card - order #5693256410</h5>
                                }
                                {
                                   this.state.carddata.cardType === 'mastercard' &&
                                   <h5 className="logo">MASTERCARD credit card - order #5693256410</h5>
                                }
                                
                                </div>
                                <div className="arrowsection">
                                <div id="cddetail">
                                    <Table className="rttable cdtable" compact  basic='very' unstackable>
                                        <Table.Body>
                                            <Table.Row>
                                                <Table.Cell width={5}>
                                                Name on card: 
                                            </Table.Cell>
                                                <Table.Cell><span className="cddata">{this.state.username}</span></Table.Cell>
                                            </Table.Row>
                                            <Table.Row>
                                                <Table.Cell>
                                                    Primary linked account: 
                                            </Table.Cell>
                                                <Table.Cell><span className="cddata ebunderline">{this.state.carddata.linkedToAccount}</span></Table.Cell>
                                            </Table.Row>
                                            <Table.Row>
                                                <Table.Cell>
                                                   Reason: 
                                                    </Table.Cell>
                                                <Table.Cell><span className="cddata">{this.state.reasondata.text}</span></Table.Cell>
                                            </Table.Row>
                                            <Table.Row>
                                                <Table.Cell>
                                                   Digital issuance:   <Icon name='question circle' id="cdhelp"/>
                                                    </Table.Cell>
                                                <Table.Cell><span className="cddata">Yes</span></Table.Cell>
                                            </Table.Row>
                                           
                                            <Table.Row>
                                                <Table.Cell>
                                                   DCV capability:   <Icon name='question circle' id="cdhelp"/>
                                                    </Table.Cell>
                                                <Table.Cell><span className="cddata">Yes</span></Table.Cell>
                                            </Table.Row>
                                        </Table.Body>
                                    </Table>

                                      <Cards
                                            number={this.state.carddata.panNo}
                                            name={store.getState().username}
                                            expiry={this.state.carddata.expDate}
                                            issuer={this.state.carddata.cardType}
                                            preview="true"/>
                                            </div>
                                </div>

                        </Segment>

                                        <div className="rtbtngroup">
                                            <Divider/>
                                            <button className="ui grey button" onClick={(e) => this.handleissuancecancel(e)}> Cancel
                                            </button>

                                            <button className="ui blue button btnrightal mtacbtn" onClick={(e) => this.handleReviewstep(e)}> Confirm
                                            </button>
                                            <button className="ui blue button btnrightal" onClick={(e) => this.handleReviewchange(e)}> Change
                                            </button>
                                        </div>
                                    </div>
                                    
                                </Segment>
                                }
                                {this.state.currentissuancestep === 3 &&
                                <Segment className="mtcontent" attached>
                                <div>
                                    <span className="addfontsize">Step 3 of 3: Digital issuance</span>
                                    <Divider />

                                    {this.state.cardissuanceSuccess === true &&
                                <Message positive>
                                    <div className="tsuccess"><Icon id="tick" name='checkmark' /> </div>
                                    <div>
                                        <Message.Header>Your card is ready!</Message.Header>
                                        <p>It is now available for digital issuance from personalization center.</p>
                                    </div>
                                </Message>
                                }
                                {this.state.cardissuanceFailure === true &&
                                <Message negative>
                                        <div className="twarning"><Icon color="red" name='warning sign'/> </div>
                                        <div>
                                        <Message.Header>Digital issuance failed!</Message.Header>
                                        <p>Sorry, your card request has been rejected. Please make sure to enter the correct PIN Code and try again.</p>
                                        </div>
                                </Message>
                                }
                                 {this.state.cardissuanceTimeout === true &&
                                <Message negative>
                                        <div className="twarning"><Icon color="red" name='warning sign'/> </div>
                                        <div>
                                        <Message.Header>Digital issuance failed!</Message.Header>
                                        <p>Sorry, your card request has timed out. Please try again.</p>
                                        </div>
                                </Message>
                                }
                                 {this.state.cardissuanceLimitreached === true &&
                                <Message negative>
                                        <div className="twarning"><Icon color="red" name='warning sign'/> </div>
                                        <div>
                                        <Message.Header>Digital issuance failed!</Message.Header>
                                        <p>Sorry, you have reached the maximum amount of cards in your digital wallet. You can delete a card <a id="nwhere" onClick={(e) => this.handlegotoMywallet(e)}>here </a>.</p>
                                        </div>
                                </Message>
                                }
                                 {this.state.cardissuanceMobilenotregistered === true &&
                                <Message negative>
                                        <div className="twarning"><Icon color="red" name='warning sign'/> </div>
                                        <div>
                                        <Message.Header>Online notification needed!!</Message.Header>
                                        <p>Sorry, a mobile needs to be registered first. It can be done <a id="nwhere" onClick={(e) => this.handlegotoMobileact(e)}>here </a>.</p>
                                        </div>
                                </Message>
                                }
                                 {this.state.cardissuanceRequestpending === true &&
                                <Message negative>
                                        <div className="twarning"><Icon color="red" name='warning sign'/> </div>
                                        <div>
                                        <Message.Header>Digital issuance failed!</Message.Header>
                                        <p>Sorry, your already have a pending request. Please activate your card first from your mobile.</p>
                                        </div>
                                </Message>
                                }

                                    <div>
                                        <span className="addfontsize">You will receive a notification on your mobile to initiate the process.</span><br/>
                                        <span>
                                            <Button
                                                className="snbutton"
                                                size="mini"
                                                name="snntify"
                                                onClick={(e) => this.handleCardissuance(e)}>Launch digital issuance process<span className="artag"></span>
                                            </Button>
                                        </span><br/>
                                       
                                    </div>
                                    <div id="notifyline"></div>
                                    <div>
                                        <button className="ui grey button" onClick={(e) => this.handleissuancecancel(e)}>
                                            Cancel
                                        </button>
                                        <button className="ui blue button btnrightal" onClick={(e) => this.handleissuancecancel(e)}>
                                            Done
                                        </button>
                                    </div>

                                    <Modal className="usrmodalmain cmn-sn-modal" size='mini' open={this.state.cardissuanceopen}>
                                        <Modal.Header className="snmodelhdr">
                                            <div id="snheader">
                                                <img className="logoimage" src={loginlogo} alt="Gemalto"/>
                                            </div>
                                        </Modal.Header>
                                        <Modal.Content>

                                            <div>
                                                <Grid.Row className="defaultrowclass">
                                                    <Grid.Column>

                                                        <Segment className="snsegclass">
                                                            <div id="snmaindiv">
                                                                <div id="snusername">
                                                                    <span id="logininfo"><Icon id="user" name='user'/>{this.handlenamemask(store.getState().username)}</span>
                                                                </div>
                                                                <div id="sncondiv">
                                                                    <span id="snapprove">Card issuance request</span><br/>
                                                                    <span><Icon id="lock" name='lock'/>We have sent a notification to your mobile.Please respond to continue.</span>
                                                                </div>
                                                                <div id="sncountdown">
                                                                    <ReactCountdownClock
                                                                        seconds={60}
                                                                        color="#8982ec"
                                                                        alpha={0.9}
                                                                        size={50}
                                                                        onComplete={this.closeoncomplete.bind(this)}/>
                                                                </div>
                                                            </div>

                                                            <div className="forgotsec crctlogin">
                                                                <span id="alingb">
                                                                    <button className="snbutton">Having trouble?
                                                                        <span className="artag"></span>
                                                                    </button>
                                                                </span>
                                                                <span id="alingb">
                                                                    <button className="snbutton" onClick={(e) => this.handleTryagain(e)}>Try again?
                                                                        <span className="artag"></span>
                                                                    </button>
                                                                </span>
                                                            </div>
                                                        </Segment>
                                                    </Grid.Column>
                                                </Grid.Row>
                                            </div>
                                        </Modal.Content>

                                    </Modal>

                                </div>
                                  
                                </Segment>
                                }
                        

                            </Segment>
                        </Grid.Column>
                    </Grid.Row>
                </Grid>

            </div>
        )
    }
}

function mapStateToProps(state) {
    return {
        currentissuancestep:state.currentissuancestep,
        checkpendingtransactionresponse: state.checkpendingtransactionresponse,
        transactionsendnotificationresponse: state.transactionsendnotificationresponse,
        getcallbackresponse: state.getcallbackresponse,
    }
}
function matchDispatchToProps(dispatch) {
    return bindActionCreators({
        setload:setload,
        getcardlist:getcardlist,
        postusercheckpendingstatus: postusercheckpendingstatus,
        posttransactionsendnotification: posttransactionsendnotification,
        postusersgetcallbackstatus: postusersgetcallbackstatus,
        postuserdeletecallbackdataaction: postuserdeletecallbackdataaction,
        postusersdeletependingtransactionstatus: postusersdeletependingtransactionstatus
    }, dispatch)
}

export default withRouter(connect(mapStateToProps, matchDispatchToProps)(Cardissuance));
