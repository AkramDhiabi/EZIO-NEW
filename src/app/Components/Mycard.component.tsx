import * as React from 'react';
import {Component} from 'react'
import {Link} from 'react-router-dom';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {store} from '../Store/store';
import {getcardlist, posttokenrelease, posteziologoutaction,postcardfreeze, setload,setusername,setmyaccount} from '../Actions/action';
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
    Divider,
    Popup
} from 'semantic-ui-react';
import {BootstrapTable, TableHeaderColumn} from 'react-bootstrap-table';
import Cards from 'react-credit-cards';
import 'react-bootstrap-table/css/react-bootstrap-table.css'
import 'react-bootstrap-table/dist/react-bootstrap-table-all.min.css'
import 'semantic-ui-css/semantic.min.css';
import 'react-credit-cards/es/styles-compiled.css';
import {ToastDanger,ToastSuccess} from 'react-toastr-basic';
const ToggleButton = require('react-toggle-button')




class Mycard extends React.Component < any,
any > {
    constructor(props) {
        super(props);
        this.state = {
            carddata: store.getState().carddetails,
            freezevalue: store.getState().carddetails.cardFreezed
        }
    }
  
    componentWillMount() {

    
    }

    handlemtcancel(e) {
        e.preventDefault();
        this
            .props
            .history
            .push('/layout/accountsummary');
    }
    handlefreezecard(freezeval)
    {

        this.setState({
            freezevalue: !freezeval,
            })
            this.props.setload(true)
            var sendData={
            userId:store.getState().username,
            panno:this.state.carddata.panNo,
            freezevalue:!freezeval
            }
        const self = this; 
        this.props.postcardfreeze(sendData).then(function (response) {
            if(response !== undefined && response.data.responseCode === 200) {
                self.props.setload(false)
                if(sendData.freezevalue === true)
                {
                    ToastSuccess('Your card is now frozen!')
                }
                else{
                    ToastSuccess('Your card is now unfrozen!')
                }
            }
            else if(response !== undefined && response.data.responseCode === 401){
                self.props.setload(false);
                if(sendData.freezevalue === true)
                {
                    ToastDanger('Your card is not frozen, please try again later')
                }
                else{
                    ToastDanger('Your card is not unfrozen, please try again later')
                }       
            }
            else{
                self.props.setload(false)
                ToastDanger('Internal server error.');
            }

        })
    }

     handlelasttransactions(e,accountNo){
        e.preventDefault();
        this.props.history.push('/layout/cardtransactions');   
    }

    handlemanagecard(e,accountNo)
    {
        e.preventDefault();
        this.props.history.push('/layout/managecard');
    }

    handleCardlistNavigation(e){
        e.preventDefault();
        this.props.history.push('/layout/mywallet');   
    }
    
    handlemask(cardnumber){
       
        var first4 = cardnumber.substring(0, 6);
        var last5 = cardnumber.substring(cardnumber.length - 4);
        var mask = cardnumber.substring(6, cardnumber.length - 4).replace(/\d/g,"*");
        return first4 + mask + last5;
    }
 
    render() {
   
        return (
            <div>
                <Grid columns={1} stackable>
                    <Grid.Row>
                        <Grid.Column width={14}>
                            <Segment id="Summarybox">
                                {
                                   this.state.carddata.cardType === 'visa' &&
                                   <span className="accst">My VISA</span>
                                }
                                {
                                   this.state.carddata.cardType === 'mastercard' &&
                                   <span className="accst">My MASTERCARD</span>
                                }
                                <a href="mailto:SUPPORT-DEMO@gemalto.com">
                                <span id="helpbox">Help
                                    <Icon name='help circle' className="helpdesc"/></span>
                                </a>
                            </Segment>
                        </Grid.Column>
                    </Grid.Row>
                </Grid>
                <Grid className="contentdetail">
                    <Grid.Column width={12}>

                        <Segment className="accdetailsec">
                                <div className="arrow_box">
                                {
                                   this.state.carddata.cardType === 'visa' &&
                                   <h5 className="logo">My VISA { this.handlemask(this.state.carddata.panNo)}</h5>
                                }
                                {
                                   this.state.carddata.cardType === 'mastercard' &&
                                   <h5 className="logo">My MASTERCARD { this.handlemask(this.state.carddata.panNo)}</h5>
                                }
                                
                                </div>
                                <div className="arrowsection">
                                <div id="cddetail">
                                    <Table className="rttable cdtable" compact  basic='very' unstackable>
                                        <Table.Body>
                                            <Table.Row>
                                                <Table.Cell width={5}>
                                                Card holder name: 
                                            </Table.Cell>
                                                <Table.Cell><span className="cddata">{store.getState().username}</span></Table.Cell>
                                            </Table.Row>
                                            <Table.Row>
                                                <Table.Cell>
                                                    Primary linked account: 
                                            </Table.Cell>
                                                <Table.Cell><span className="cddata ebunderline">{this.state.carddata.linkedToAccount}</span></Table.Cell>
                                            </Table.Row>
                                            <Table.Row>
                                                <Table.Cell>
                                                   Expiration date: 
                                                    </Table.Cell>
                                                <Table.Cell><span className="cddata">{this.state.carddata.expDate}</span></Table.Cell>
                                            </Table.Row>
                                            <Table.Row>
                                                <Table.Cell>
                                                   Mobile registered :
                                                    </Table.Cell>
                                                <Table.Cell><span className="cddata">Yes</span></Table.Cell>
                                            </Table.Row>
                                            <Table.Row>
                                                <Table.Cell>
                                                   DCV enabled:   <Icon name='question circle' id="cdhelp"/>
                                                    </Table.Cell>
                                                <Table.Cell>
                                                {this.state.carddata.isDCV_Active === 0 &&
                                                    <span className="cddata">No</span>
                                                }
                                                 {this.state.carddata.isDCV_Active === 1 &&
                                                    <span className="cddata">Yes</span>
                                                }
                                                </Table.Cell>
                                            </Table.Row>
                                            <Table.Row>
                                                <Table.Cell>
                                                Freeze my card: <Popup
                                                trigger={<Icon name='question circle' id="cdhelp"/>}
                                                content='By freezing this card, new purchases, balance transfers and cash advances will not be allowed on this account.'
                                                wide/>
                                                </Table.Cell>
                                            <Table.Cell>
                                                <ToggleButton
                                                value={ this.state.freezevalue}
                                                onToggle={(value) => {
                                                this.handlefreezecard(value)
                                                }} />
                                            </Table.Cell>
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

                                 <div>
                                    {/* <Button className="cdbutton" onClick={(e) => this.handlefreezecard(e)}>
                                    <span>  <Icon className="cdlabel" name='angle right' /> Freeze my card</span>
                                    </Button>       */}
                                    <Button className="cdbutton" onClick={(e) => this.handlelasttransactions(e,this.state.carddata.accountNo)}>
                                    <span>
                                    <Icon className="cdlabel" name='angle right' />
                                    My last transaction</span>
                                    </Button>
                                    <Button className="cdbutton" onClick={(e) => this.handlemanagecard(e,this.state.carddata.accountNo)}>
                                    <span>
                                    <Icon className="cdlabel" name='angle right' />
                                    Manage my card</span>
                                    </Button>
                                    <Button className="cdbutton">
                                    <span>
                                    <Icon className="cdlabel" name='angle right' />
                                    Block my card</span>
                                    </Button>    
                                </div>
                        </Segment>

                    </Grid.Column>
                    <Grid.Column width={14}>
                    
                        <div className="rtbtngroup">
                            <Divider/>
                            <button
                                className="ui blue button btnrightal mtacbtn"
                                onClick={(e) => this.handlemtcancel(e)}>
                                Done
                            </button>
                            <button className="ui blue button btnrightal" onClick={(e) => this.handleCardlistNavigation(e)}>Card list
                            </button>
                        </div>
                    </Grid.Column>

                </Grid>
            </div>
        )
    }
}
function mapStateToProps(state) {
    return {}
}
function matchDispatchToProps(dispatch) {
    return bindActionCreators({
        getcardlist: getcardlist,
        setload: setload,
        posttokenrelease: posttokenrelease,
        posteziologoutaction: posteziologoutaction,
        setusername:setusername,
        postcardfreeze:postcardfreeze,
        setmyaccount:setmyaccount
    }, dispatch)
}
export default connect(mapStateToProps, matchDispatchToProps)(Mycard)
