import * as React from 'react';
import {connect} from 'react-redux';
import {store} from '../Store/store';
import {Provider} from 'react-redux';
import {Link} from 'react-router-dom';
import {withRouter} from 'react-router-dom';
import {
    Accordion,
    Button,
    Container,
    Loader,
    Dimmer,
    Divider,
    Message,
    Advertisement,
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
    Form,
    Modal
} from 'semantic-ui-react';
import {bindActionCreators} from 'redux';

const loginlogo = require('../../img/demologo.png');
const loginbackground = require('../../img/loginbackground.jpg');

import {FormBuilder, FieldControl, FieldGroup} from "react-reactive-form";
import * as ReactCountdownClock from "react-countdown-clock";
import {
    postAuthenticate,
    checklogin,
    postusercheckpendingstatus,
    postusersendnotificationstatus,
    postusersgetcallbackstatus,
    postuserdeletecallbackdataaction,
    setsnerrtype,
    postusersdeletependingtransactionstatus,
    setload,
    setcurrentbeneficiarystep,
    setcurrenttransferstep,
    setaccountlist,
    setbeneficiarydetail
} from "../Actions/action";

import {ToastDanger} from 'react-toastr-basic';


class Completetransfer extends React.Component < any,
any > {

    constructor(props) {
        super(props);
    }

    componentWillMount() {
        this.setState({
            username: store
                .getState()
                .username,
                transferdetails:store.getState().transferdetails,
                beneficiarydetails: store.getState().beneficiarydetails
        });

     
    }

    handlemtcancel(e) {
        e.preventDefault();
        this.props.history.push('/layout/accountsummary');
    }
    handlegotonewbeneficiary(e){
        e.preventDefault();
        var senddata={
            newbeneficiary:store.getState().beneficiarydetails
        }
        this.props.setbeneficiarydetail(senddata);
        this.props.history.push('/layout/externaltransfer');
    }

    handleanother(e){
        e.preventDefault();
        var setdefault;
        if(store.getState().operationtype === 'EzioDemoV2_MoneyTransfer')
        {
            this.props.setaccountlist({
                fromList :null,
                toList   :null
            })
            setdefault={
                currentstep:1,
                transferDetail:null
            }
            this.props.setcurrenttransferstep(setdefault);
    
           
        }
        else{
            setdefault={
                currentstep:1,
                beneficiaryDetail:null
            }
            this.props.setcurrentbeneficiarystep(setdefault);
        }

    }

    render() {
        return (
            <div>
                <span className="addfontsize">Step 4 of 4: Transaction status</span>
                <Divider/> 
                {store
                    .getState()
                    .operationtype === 'EzioDemoV2_MoneyTransfer' && 
                    <div>
                        {
                            store.getState().transactionstatus == '200' &&
                            <Message positive className="logonwarning">
                            <div className="lwarning"><Icon id="tick" className="tlicon" name='checkmark'/></div>
                            <div>
                                <Message.Header>Transfer done!</Message.Header>
                                <p>Your transfer has been validated and credited to your benificiary's account</p>
                            </div>
                            </Message>
                        }
                          {
                            store.getState().transactionstatus == '401' && store.getState().mode == 'online' &&
                            
                            <Message negative>
                                    <div className="twarning"><Icon color="red" name='remove circle'/> </div>
                                    <div>
                                    <Message.Header>Transfer failed!</Message.Header>
                                    <p>Sorry, your transfer has been rejected. Please make sure to enter the correct PIN Code and try again.</p>
                                    </div>
                                </Message>
                        }
                        {
                            store.getState().transactionstatus == '401' && store.getState().mode == 'offline' &&
                            
                            <Message negative>
                            <div className="twarning"><Icon color="red" name='remove circle'/> </div>
                            <div>
                            <Message.Header>Transfer failed!</Message.Header>
                            <p>Sorry, your transfer has been rejected. Please make sure to follow properly the instructions and try again.</p>
                            </div>
                            </Message>
                        }
                    </div>
                    }
                {store
                    .getState()
                    .operationtype !== 'EzioDemoV2_MoneyTransfer' && 
                    <div>
                        {
                            store.getState().transactionstatus == '200' &&
                            <Message positive className="logonwarning">
                            <div className="lwarning"><Icon id="tick" className="tlicon" name='checkmark'/></div>
                            <div>
                                <Message.Header>Operation done !</Message.Header>
                                <p>Your beneficiary has been successfully added to your beneficiary list. Click <a id="abhere" onClick={(e) => this.handlegotonewbeneficiary(e)}>here </a>to make a transfer.</p>
                            </div>
                            </Message>
                        }
                          {
                            store.getState().transactionstatus == '401'  &&
                            
                            <Message negative>
                            <div className="twarning"><Icon color="red" name='remove circle'/> </div>
                            <div>
                            <Message.Header>Operation failed!</Message.Header>
                            <p>Sorry, we could not add this beneficiary to your beneficiary list.</p>
                            </div>
                            </Message>
                        }
                    </div>
                    }
                {store
                    .getState()
                    .operationtype === 'EzioDemoV2_MoneyTransfer' && store.getState().transferdetails !== undefined && <div>
                        <Segment id="logoncsecbottom">
                            <Table className="rttable" singleLine basic='very' unstackable>
                                <Table.Body>
                                    <Table.Row>
                                        <Table.Cell width={3}>Transfer from:</Table.Cell>
                                        <Table.Cell>{store.getState().transferdetails.fromAcc}</Table.Cell>
                                    </Table.Row>
                                    <Table.Row>
                                        <Table.Cell>Transfer to:</Table.Cell>
                                        <Table.Cell>{store.getState().transferdetails.toAcc}</Table.Cell>
                                    </Table.Row>
                                    <Table.Row>
                                        <Table.Cell>Transaction ID:</Table.Cell>
                                        <Table.Cell>MT5236567</Table.Cell>
                                    </Table.Row>
                                    <Table.Row>
                                        <Table.Cell>Amount:</Table.Cell>
                                        <Table.Cell>${store.getState().transferdetails.amount}</Table.Cell>
                                    </Table.Row>
                                    <Table.Row>
                                        <Table.Cell>Date:</Table.Cell>
                                        <Table.Cell>{store.getState().transferdetails.date}</Table.Cell>
                                    </Table.Row>
                                </Table.Body>
                            </Table>
                        </Segment>
                        <Divider/>
                        <div className="rtbtngroup">
                            <button className="ui grey button" onClick={(e) => this.handlemtcancel(e)}> Cancel
                            </button>

                            <button className="ui blue button btnrightal mtacbtn" onClick={(e) => this.handlemtcancel(e)}> Account Summary
                            </button>
                            <button className="ui blue button btnrightal" onClick={(e) => this.handleanother(e)}> Make another transfer
                            </button>
                        </div>
                    </div>
                }
                  {store
                    .getState()
                    .operationtype !== 'EzioDemoV2_MoneyTransfer' && store.getState().beneficiarydetails !== undefined && <div>
                        <Segment id="logoncsecbottom">
                            <Table className="rttable" singleLine basic='very' unstackable>
                                <Table.Body>
                                    <Table.Row>
                                        <Table.Cell width={3}>Account name:</Table.Cell>
                                        <Table.Cell>{store.getState().beneficiarydetails.accountname}</Table.Cell>
                                    </Table.Row>
                                    <Table.Row>
                                        <Table.Cell>Account no:</Table.Cell>
                                        <Table.Cell>{store.getState().beneficiarydetails.accountno}</Table.Cell>
                                    </Table.Row>
                                    <Table.Row>
                                        <Table.Cell>Transaction ID:</Table.Cell>
                                        <Table.Cell>NB1234567</Table.Cell>
                                    </Table.Row>
                                    <Table.Row>
                                        <Table.Cell>
                                            Date: 
                                            </Table.Cell>
                                        <Table.Cell>{store.getState().beneficiarydetails.date}</Table.Cell>
                                    </Table.Row>
                                </Table.Body>
                            </Table>
                        </Segment>
                        <Divider/>
                         <div className="rtbtngroup">
                            <button className="ui grey button" onClick={(e) => this.handlemtcancel(e)}> Cancel
                            </button>

                            <button className="ui blue button btnrightal mtacbtn" onClick={(e) => this.handlemtcancel(e)}> Account Summary
                            </button>
                            <button className="ui blue button btnrightal" onClick={(e) => this.handleanother(e)}> Add another beneficiary
                            </button>
                        </div>
                    </div>
                }
            </div>
        )
    }

}

function mapStateToProps(state) {
    return {}
}
function matchDispatchToProps(dispatch) {
    return bindActionCreators({
        setcurrenttransferstep:setcurrenttransferstep,
        setcurrentbeneficiarystep:setcurrentbeneficiarystep,
        setaccountlist:setaccountlist,
        setbeneficiarydetail:setbeneficiarydetail,
        setload:setload
    }, dispatch)
}

export default withRouter(connect(mapStateToProps, matchDispatchToProps)(Completetransfer));
