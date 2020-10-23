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
    postusercheckpendingstatus,
    posttransactionsendnotification,
    postusersgetcallbackstatus,
    postuserdeletecallbackdataaction,
    postusersdeletependingtransactionstatus,
    setload,
    setcurrenttransferstep,
    setcurrentbeneficiarystep
} from "../Actions/action";

import {ToastDanger} from 'react-toastr-basic';

class Sendnotificationmt extends React.Component < any,
any > {

    constructor(props) {
        super(props);

        this.state = {
            username: null,
            open: false
        }

        this.notifyclose = this
            .notifyclose
            .bind(this);
        this.closeoncomplete = this
            .closeoncomplete
            .bind(this);

    }

    componentDidMount() {
        this.setState({
            username: store
                .getState()
                .username
        });

        store.subscribe(() => {
            // When state will be updated(in our case, when items will be fetched), we will
            // update local component state and force component to rerender with new data.

            this.setState({
                username: store
                    .getState()
                    .username
            });
        });
    }
    show = () => this.setState({open: true})
    close = () => this.setState({open: false})

    closeoncomplete() {
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
            var setTransferdetails;
            if(store.getState().operationtype !== 'EzioDemoV2_MoneyTransfer')
            {
                setTransferdetails={
                    currentstep:4,
                    beneficiaryDetail:store
                    .getState()
                    .beneficiarydetails,
                    operationtype:store.getState().operationtype,
                    mode:'online',
                    transactionstatus:'401'
                }
                
                this.props.setcurrentbeneficiarystep(setTransferdetails);
            }
            else{
                
                setTransferdetails={
                    currentstep:4,
                    transferDetail:store
                    .getState()
                    .transferdetails,
                    operationtype:store.getState().operationtype,
                    mode:'online',
                    transactionstatus:'401'
                }
                this.props.setcurrenttransferstep(setTransferdetails);
            }
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

    loginanotherway(e : React.MouseEvent < HTMLButtonElement >) {
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

    handleFinish(e : React.MouseEvent < HTMLButtonElement >) {

        const self = this;
        self
            .props
            .setload(true)
        console.log("send notification clicked");
        var accountdata;
        if(store.getState().operationtype === 'EzioDemoV2_MoneyTransfer')
        {
            accountdata = {
                userId: this.state.username,
                fromAccountNo: store
                    .getState()
                    .transferdetails
                    .fromAcc,
                toAccountNo: store
                    .getState()
                    .transferdetails
                    .toAcc,
                amount: store
                    .getState()
                    .transferdetails
                    .amount
            }
        }
        else{
            accountdata = {
                userId: this.state.username,
                beneficiaryAccount: store
                .getState()
                .beneficiarydetails
                .accountno,
                beneficiaryName: store
                .getState()
                .beneficiarydetails
                .accountname
            }
        }
        

        const sendcredentials = {
            usrnme: self.state.username,
            operationtype: store
                .getState()
                .operationtype,
            data: accountdata
        }

        self
            .props
            .postusercheckpendingstatus(sendcredentials)
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
                            .posttransactionsendnotification(sendcredentials)
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
                                                                var setTransferdetails;
                                                                if(store.getState().operationtype !== 'EzioDemoV2_MoneyTransfer')
                                                                {
                                                                    setTransferdetails={
                                                                        currentstep:4,
                                                                        beneficiaryDetail:store
                                                                        .getState()
                                                                        .beneficiarydetails,
                                                                        operationtype:store.getState().operationtype,
                                                                        mode:'online',
                                                                        transactionstatus:'200'
                                                                    }
                                                                    
                                                                    self.props.setcurrentbeneficiarystep(setTransferdetails);
                                                                }
                                                                else{
                                                                    
                                                                    setTransferdetails={
                                                                        currentstep:4,
                                                                        transferDetail:store
                                                                        .getState()
                                                                        .transferdetails,
                                                                        operationtype:store.getState().operationtype,
                                                                        mode:'online',
                                                                        transactionstatus:'200'
                                                                    }
                                                                    self.props.setcurrenttransferstep(setTransferdetails);
                                                                }
                                                               

                                                        } else {
                                                            console.log("callback failed");
                                                            self.notifyclose();
                                                            self
                                                                .props
                                                                .setload(false)
                                                              
                                                                if(store.getState().operationtype !== 'EzioDemoV2_MoneyTransfer')
                                                                {
                                                                    setTransferdetails={
                                                                        currentstep:4,
                                                                        beneficiaryDetail:store
                                                                        .getState()
                                                                        .beneficiarydetails,
                                                                        operationtype:store.getState().operationtype,
                                                                        mode:'online',
                                                                        transactionstatus:'401'
                                                                    }
                                                                    
                                                                    self.props.setcurrentbeneficiarystep(setTransferdetails);
                                                                }
                                                                else{
                                                                    
                                                                    setTransferdetails={
                                                                        currentstep:4,
                                                                        transferDetail:store
                                                                        .getState()
                                                                        .transferdetails,
                                                                        operationtype:store.getState().operationtype,
                                                                        mode:'online',
                                                                        transactionstatus:'401'
                                                                    }
                                                                    self.props.setcurrenttransferstep(setTransferdetails);
                                                                }
                                                        }
                                                   

                                                } else {
                                                    self
                                                        .props
                                                        .setload(false);
                                                    console.log("there is a server error")
                                                    
                                                }
                                            });

                                    } else {
                                        console.log("Notification not sent error");
                                        self
                                            .props
                                            .setload(false)
                                        ToastDanger('Notification not sent, please try again later.');
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

    handlemtcancel(e) {
        e.preventDefault();
        this
            .props
            .history
            .push('/layout/accountsummary');
    }

    handlenamemask(displayname){
		var first3 = displayname.substring(0, 4);
        var displaymask = displayname.substring(4, displayname.length).replace(/[a-z0-9]/gi,"*");
        return first3 + displaymask;
	}

    render() {
        return (
            <div>

                <div>
                    <span className="addfontsize">Use your mobile device to log on to Demo.</span><br/>
                    <div className="tmplbrdrcls addmargin"></div>
                    <span>
                        <Button
                            className="snbutton"
                            size="mini"
                            name="snntify"
                            onClick={(e) => this.handleFinish(e)}>Send me a notification now<span className="artag"></span>
                        </Button>
                    </span><br/>
                    
                </div>
                <div id="notifyline"></div>
                <div>
                    <button className="ui grey button" onClick={(e) => this.handlemtcancel(e)}>
                        Cancel
                    </button>
                    <button className="ui blue button btnrightal">
                        Continue
                    </button>
                </div>

                <Modal className="usrmodalmain cmn-sn-modal" size='mini' open={this.state.open}>
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
                                                <span id="snapprove">Approve transfer request</span><br/>
                                                <span><Icon id="lock" name='lock'/>We have sent a notification to your mobile.Please respond to continue.</span>
                                            </div>
                                            <div id="sncountdown">
                                                <ReactCountdownClock
                                                    seconds={60}
                                                    color="#8982ec"
                                                    alpha={0.9}
                                                    size={50}
                                                    onComplete={this.closeoncomplete}/>
                                            </div>
                                        </div>

                                        <div className="forgotsec crctlogin">
                                            <div id="alingb">
                                                <button className="snbutton">Having trouble?
                                                    <span className="artag"></span>
                                                </button>
                                            </div>
                                            <div id="alingb">
                                                <button className="snbutton" onClick={(e) => this.loginanotherway(e)}>Transfer another way?
                                                    <span className="artag"></span>
                                                </button>
                                            </div>
                                        </div>
                                    </Segment>
                                </Grid.Column>
                            </Grid.Row>
                        </div>
                    </Modal.Content>

                </Modal>
            </div>

            ) } } function mapStateToProps(state) {return {
                usercheck: state.usercheck,
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
            function matchDispatchToProps(dispatch) {return bindActionCreators({
                postusercheckpendingstatus: postusercheckpendingstatus,
                posttransactionsendnotification: posttransactionsendnotification,
                postusersgetcallbackstatus: postusersgetcallbackstatus,
                postusersdeletependingtransactionstatus: postusersdeletependingtransactionstatus,
                setload: setload,
                postuserdeletecallbackdataaction: postuserdeletecallbackdataaction,
                setcurrenttransferstep:setcurrenttransferstep,
                setcurrentbeneficiarystep:setcurrentbeneficiarystep
            }, dispatch)
}

export default withRouter(connect(mapStateToProps, matchDispatchToProps)(Sendnotificationmt));

