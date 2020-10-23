import * as React from 'react';
import { connect } from 'react-redux';
import { store } from '../Store/store';
import { Provider } from 'react-redux';
import { Link } from 'react-router-dom';
import { withRouter } from 'react-router-dom';
import { Accordion, Button, Container, Loader, Dimmer, Divider, Advertisement, Grid, Header, Icon, Image, Item, Label, Menu,Message, Segment, Step, Table, Form, Modal } from 'semantic-ui-react';
import { bindActionCreators } from 'redux';

const loginlogo = require('../../img/demologo.png');
const loginbackground = require('../../img/loginbackground.jpg');

import { FormBuilder, FieldControl, FieldGroup } from "react-reactive-form";
import * as ReactCountdownClock from "react-countdown-clock";
import { postAuthenticate, checklogin, postusercheckpendingstatus,setload, setcurrenttransferstep,postinitiatetransaction,postusersendnotificationstatus, postusersgetcallbackstatus, postuserdeletecallbackdataaction, setsnerrtype, postusersdeletependingtransactionstatus } from "../Actions/action";

import { ToastDanger } from 'react-toastr-basic';

class Reviewtransferdetails extends React.Component<any, any>{

    constructor(props) {
        super(props);
        this.state={
            errormessage: false
        }
    }

    componentWillMount(){
        this.setState({
            username:  store.getState().username,
            transferdetails: store.getState().transferdetails
        });
    }
    validTokensList =[];

    handlestep(e) {
        this.setState({
            errormessage: false
        });
        this.props.setload(true);
        var transferAccountdetail = { userId:  this.state.username,
                                      fromAccountNo:  this.state.transferdetails.fromAcc,
                                      toAccountNo:  this.state.transferdetails.toAcc,
                                      amount:  this.state.transferdetails.amount,
                                      description:  this.state.transferdetails.reason
                                    }
                                    var senddata ={
                                        type:'EzioDemoV2_MoneyTransfer',
                                        data:transferAccountdetail
                                    }
        var self = this;
        this.props.postinitiatetransaction(senddata).then(function (response) {
            
            if(response !== undefined && response.data.responseCode === 200) {
                console.log(response);
                if(response.data.templateObject.tokenAvailable !== null)
                {
                    response.data.templateObject.tokenAvailable.map((token, key) =>{
                        console.log(token, key);
                        if(token !== "GALO" && token !== "GAOC" && token !== "GADV" && token !== "01" && token !== "00")
                        {
                          self.validTokensList.push(token)
                        }
                    });
                }
              
                if(response.data.templateObject.tokenAvailable !== null && Object.getOwnPropertyNames(response.data.templateObject).length > 0 && self.validTokensList.length > 0 || response.data.templateObject.mobileSupported == true)
                {
                    self.props.setload(false);
                    var setTransferdetails={
                        currentstep: 3,
                        transferDetail: self.state.transferdetails,
                        operationtype:'EzioDemoV2_MoneyTransfer'
                    }
                    self.props.setcurrenttransferstep(setTransferdetails);
                }
                else
                {
                    self.props.setload(false);
                    self.setState({
                        errormessage: true
                    });
                }
              
            }
            else{
                self.props.setload(false);
                ToastDanger('Server Error,Please try again later.');
              
            }
        });
       
    }
    handlechangestep(e:  React.MouseEvent<HTMLButtonElement>) {
        e.preventDefault();
        var setTransferdetails={
            currentstep: 1,
            transferDetail: this.state.transferdetails,
            operationtype:'EzioDemoV2_MoneyTransfer'
        }
        this.props.setcurrenttransferstep(setTransferdetails);
    }
    handlenavigation(e,routevalue){
        e.preventDefault();
        if(routevalue === 'mobile')
        {
            this.props.history.push('/mobileregistration');
        }
        else
        {
            this.props.history.push('/layout/tokenmanagement');
        }
        
    }
    handlemtcancel(e) {
        e.preventDefault();
        this.props.history.push('/layout/accountsummary');
    }

    render() {

        const shouldRendermobile = store.getState().TokenPro == false && store.getState().TokenActResync == false;
        return (
            <div>
                <span className="addfontsize">Step 2 of 4: Review transfer details</span>
                <Divider />
                {this.state.errormessage === true &&
                                <Message negative>
                                        <div className="twarning"><Icon color="red" name='warning sign'/> </div>
                                        <div>
                                        <Message.Header>Error</Message.Header>
                                        {shouldRendermobile &&                         
                                        <p>Sorry, we could not find any way to validate your transaction securely. You must activate your <a className="mthere" onClick={(e) => this.handlenavigation(e,'mobile')}>mobile </a> first.</p>
                                               
                                        }
                                        { !shouldRendermobile &&
                                        <p>Sorry, we could not find any way to validate your transaction securely. You must activate at least your <a className="mthere" onClick={(e) => this.handlenavigation(e,'mobile')}>mobile </a> or one <a className="mthere" onClick={(e) =>this.handlenavigation(e,'token')}>physical token</a>.  </p>
                                    
                                        } 
                                        </div>
                                </Message>
                                }
                <Header as='h5'className="rtdetailheader" attached='top'>
                    Transfer from
                </Header>
                <Segment attached className="rttableclass">
                    <Table className="rttable" singleLine  basic='very' unstackable>
                        <Table.Body>
                            <Table.Row>
                                <Table.Cell width={5}>
                                    Transfer from: 
                            </Table.Cell>
                                <Table.Cell>{this.state.transferdetails.fromAcctype}</Table.Cell>
                            </Table.Row>
                            <Table.Row>
                                <Table.Cell>
                                    Account number: 
                            </Table.Cell>
                                <Table.Cell>{this.state.transferdetails.fromAcc}</Table.Cell>
                            </Table.Row>
                        </Table.Body>
                    </Table>
                </Segment>
                <Header as='h5' className="rtdetailheader" attached='top'>
                    Transfer to
                </Header>
                <Segment attached className="rttableclass">
                    <Table className="rttable" singleLine  basic='very' unstackable>
                        <Table.Body>
                            <Table.Row>
                                <Table.Cell width={5}>
                                    Transfer to: 
                                </Table.Cell>
                                <Table.Cell>{this.state.transferdetails.toAcctype}</Table.Cell>
                            </Table.Row>
                            <Table.Row>
                                <Table.Cell>
                                    Account number: 
                                </Table.Cell>
                                <Table.Cell>{this.state.transferdetails.toAcc}</Table.Cell>
                            </Table.Row>
                        </Table.Body>
                    </Table>
                </Segment>
                <Header as='h5' className="rtdetailheader" attached='top'>
                    Details
                </Header>
                <Segment attached>
                    <Table className="rttable" singleLine  basic='very' unstackable>
                        <Table.Body>
                            <Table.Row>
                                <Table.Cell width={5}>
                                   Amount: 
                                    </Table.Cell>
                                <Table.Cell>{this.state.transferdetails.amount}</Table.Cell>
                            </Table.Row>
                            <Table.Row>
                                <Table.Cell>
                                    Currency:
                                    </Table.Cell>
                                <Table.Cell>USD</Table.Cell>
                            </Table.Row>
                            <Table.Row>
                                <Table.Cell>
                                    Date: 
                                    </Table.Cell>
                                <Table.Cell>{this.state.transferdetails.date}</Table.Cell>
                            </Table.Row>
                            {(this.state.transferdetails.reason !== '') &&
                                <Table.Row>
                                    <Table.Cell>
                                        Reason:
                                        </Table.Cell>
                                    <Table.Cell>{this.state.transferdetails.reason}</Table.Cell>
                                </Table.Row>
                            }
                        </Table.Body>
                    </Table>
                </Segment>
                <div className="rtbtngroup">
                    <Divider/>
                    <button className="ui grey button" onClick={(e) => this.handlemtcancel(e)}> Cancel
                    </button>

                    <button className="ui blue button btnrightal mtacbtn" onClick={(e) => this.handlestep(e)}> Confirm
                    </button>
                    <button className="ui blue button btnrightal" onClick={(e) => this.handlechangestep(e)}> Change
                    </button>
                </div>
            </div>

        )
    }


}


function mapStateToProps(state) {
    return {
      
    }
}
function matchDispatchToProps(dispatch) {
    return bindActionCreators({
        setcurrenttransferstep: setcurrenttransferstep,
        postinitiatetransaction: postinitiatetransaction,
        setload: setload
    }, dispatch)
}

export default withRouter(connect(mapStateToProps, matchDispatchToProps)(Reviewtransferdetails));

