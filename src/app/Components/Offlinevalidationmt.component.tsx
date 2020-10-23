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
    Grid,
    Header,
    Dimmer,
    Divider,
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
    Form
} from 'semantic-ui-react';
import 'semantic-ui-css/semantic.min.css';
import Gemaltohdr from './Gemaltohdr.component';
import {bindActionCreators} from 'redux';
import {setload, postmoneytransferValidation, setcurrentbeneficiarystep,setcurrenttransferstep} from '../Actions/action';

import {FormBuilder, FieldControl, FieldGroup} from "react-reactive-form";
import Offlinevalidationmttmpl from './Offlinevalidationmttmpl.component';
import {ToastDanger} from 'react-toastr-basic';

function demo() {
    const hexData = document
        .getElementById('qrcodediv')
        .dataset
        .value;
    const qrVersion = 9;
    const errorCorrectionLevel = 'L';
    const script2 = document.createElement("script");

    const s = document.createElement('script');
    s.type = 'text/javascript';
    s.async = true;
    s.innerHTML = "window.draw_qrcode('" + hexData + "'," + qrVersion + ",'" + errorCorrectionLevel + "')";
    document
        .body
        .appendChild(s);
}
class Offlinevalidationmt extends React.Component < any,
any > {

    constructor(props) {
        super(props);
        this.state = {
            username: store
                .getState()
                .username,
            validationconfiguration: store
                .getState()
                .validationconfiguration
        };

    }

    validpane = [];
    transactionvalidateform = FormBuilder.group({validationcode: ""});
    deviceList = [
        {
            "type": "GATP",
            "name": "Pico"
        }, {
            "type": "GATB",
            "name": "Flex"
        }, {
            "type": "GATZ",
            "name": "Signer"
        }, {
            "type": "GADB",
            "name": "Display Card Pad"
        }, {
            "type": "GADF",
            "name": "Display Card Pad"
        },
        , {
            "type": "GAQT",
            "name": "QR Token"
        }
    ]
    validTokens = [];
    cardpad = [];
   
    componentWillMount() {

        if (this.state.validationconfiguration.data.templateObject.mobileSupported == true) {
            this
                .validpane
                .push({
                    menuItem: 'Mobile',
                    render: () => <Tab.Pane attached={false}>
                            <Offlinevalidationmttmpl
                                type="GAOC"
                                qrCode={this.state.validationconfiguration.data.templateObject.qrcodeEncryptedData}/>
                        </Tab.Pane>
                })
        }
       

        this
            .state
            .validationconfiguration
            .data
            .templateObject
            .tokenAvailable
            .map((token, key) => {
                console.log(token, key);
                if (token !== "GALO" && token !== "GAOC" && token !== "GADV" && token !== "01" && token !== "00") {

                    if (token !== "GADB" && token !== "GADF") {
                        this
                            .validTokens
                            .push(token);
                        const typename = this
                            .deviceList
                            .filter((item) => item.type == token)
                        this
                            .validpane
                            .push({
                                menuItem: typename[0].name,
                                render: () => <Tab.Pane attached={false}>
                                        <Offlinevalidationmttmpl
                                            validform="false"
                                            type={token}  qrVersion={this.state.validationconfiguration.data.templateObject.tokenqrcodeEncryptedVersion}
                                            qrCode={this.state.validationconfiguration.data.templateObject.tokenqrcodeEncryptedData}
                                            chCode={this.state.validationconfiguration.data.templateObject.challengeCode}/>
                                    </Tab.Pane>
                            })
                    } else {
                        this
                            .cardpad
                            .push(token);
                    }
                }
                if (key === this.state.validationconfiguration.data.templateObject.tokenAvailable.length - 1) {
                    if (this.cardpad.length !== 0 && this.cardpad.length == 1) {
                        this
                            .validTokens
                            .push(this.cardpad[0]);
                        const typename = this
                            .deviceList
                            .filter((item) => item.type == this.cardpad[0])
                        this
                            .validpane
                            .push({
                                menuItem: typename[0].name,
                                render: () => <Tab.Pane attached={false}>
                                        <Offlinevalidationmttmpl 
                                         qrVersion={this.state.validationconfiguration.data.templateObject.tokenqrcodeEncryptedVersion}
                        qrCode={this.state.validationconfiguration.data.templateObject.tokenqrcodeEncryptedData}
                                        validform="false" type={this.cardpad[0]}/>
                                    </Tab.Pane>
                            })
                    } else if (this.cardpad.length !== 0 && this.cardpad.length > 1) {
                        this
                            .validTokens
                            .push("GADB");
                        const typename = this
                            .deviceList
                            .filter((item) => item.type == "GADB")
                        this
                            .validpane
                            .push({
                                menuItem: typename[0].name,
                                render: () => <Tab.Pane attached={false}>
                                        <Offlinevalidationmttmpl 
                                         qrVersion={this.state.validationconfiguration.data.templateObject.tokenqrcodeEncryptedVersion}
                                         qrCode={this.state.validationconfiguration.data.templateObject.tokenqrcodeEncryptedData}
                                         validform="false" type={"GADB"}/>
                                    </Tab.Pane>
                            })
                    }

                }
            });
        this
            .props
            .setload(true);

    }

    componentDidMount() {
      if (this.state.validationconfiguration.data.templateObject.mobileSupported == true) {
     
            this.setState({tokentype: 'GAOC', challengevalue: this.state.validationconfiguration.data.templateObject.challengeCode});
      } else {
        this.setState({tokentype: this.validTokens[0], challengevalue: this.state.validationconfiguration.data.templateObject.challengeCode})
      }

        this
            .props
            .setload(false);
    }

    handleKeyPressnumber = (event, formdetail, formname) => {
        var charCode = event.charCode;
        //Non-numeric character range
        if (charCode > 31 && (charCode < 48 || charCode > 57)) {
            event.preventDefault();
        }
        if(charCode === 13) {
            this.handleValidateotp(event, formdetail, formname);
        }
    }
    handleTokenchange(e, data) {
        console.log(this, "Tabchanged");
        console.log(data.activeIndex, "Tabchanged");
        this.transactionvalidateform.reset();
        var currentIndex = data.activeIndex;
        if (this.state.validationconfiguration.data.templateObject.mobileSupported === true) {
            if (currentIndex == 0) {
                this.setState({tokentype: 'GAOC', challengevalue: this.state.validationconfiguration.data.templateObject.challengeCode})
            } else {
                this.setState({tokentype: this.validTokens[currentIndex-1], challengevalue: this.state.validationconfiguration.data.templateObject.challengeCode})
            }

        } else {
            this.setState({tokentype: this.validTokens[currentIndex], challengevalue: this.state.validationconfiguration.data.templateObject.challengeCode})
        }

    }

    handlemtcancel(e) {
        e.preventDefault();
        this
            .props
            .history
            .push('/layout/accountsummary');
    }

    handleValidateotp(e, formdetail, formname) {
        e.preventDefault();
        var sendvalidationdetails;
        if (store.getState().operationtype === 'EzioDemoV2_NewBeneficiary') {
            console.log("am from beneficiary");
            sendvalidationdetails = {
                userId: this.state.username,
                beneficiaryAccount: store
                    .getState()
                    .beneficiarydetails
                    .accountno,
                beneficiaryName: store
                    .getState()
                    .beneficiarydetails
                    .accountname,
                tokenType: this.state.tokentype,
                sHardTokenChallenge: this.state.challengevalue,
                otpValue: formdetail.value.validationcode,
                transactionType: "EzioDemoV2_NewBeneficiary"
            }
        } else {
            console.log(formdetail, "mtotp");
            sendvalidationdetails = {
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
                    .amount,
                description: store
                    .getState()
                    .transferdetails
                    .reason,
                tokenType: this.state.tokentype,
                sHardTokenChallenge: this.state.challengevalue,
                otpValue: formdetail.value.validationcode,
                transactionType: "EzioDemoV2_MoneyTransfer"
            }
        }
        const self = this;
        if (formdetail.value.validationcode !== "" && formdetail.value.validationcode.length == 6 || formdetail.value.validationcode.length == 8) {
            this
                .props
                .setload(true);
            self
                .props
                .postmoneytransferValidation(sendvalidationdetails)
                .then(function (response) {
                    //console.log(self[formname])
                    self[formname].reset();
                    if (response.data.responseCode === 200) {
                        console.log("all ok");
                        //ToastSuccess('OTP Validation Success');
                        var setTransferdetails;
                        if (store.getState().operationtype !== 'EzioDemoV2_MoneyTransfer') {
                            setTransferdetails = {
                                currentstep: 4,
                                beneficiaryDetail: store
                                    .getState()
                                    .beneficiarydetails,
                                operationtype: store
                                    .getState()
                                    .operationtype,
                                mode: 'offline',
                                transactionstatus: '200'
                            }
                            self
                                .props
                                .setcurrentbeneficiarystep(setTransferdetails);
                        } else {
                            setTransferdetails = {
                                currentstep: 4,
                                transferDetail: store
                                    .getState()
                                    .transferdetails,
                                operationtype: store
                                    .getState()
                                    .operationtype,
                                mode: 'offline',
                                transactionstatus: '200'
                            }
                            self
                                .props
                                .setcurrenttransferstep(setTransferdetails);
                        }
                    } else {
                        //ToastDanger('OTP Validation Failed');
                        if (store.getState().operationtype !== 'EzioDemoV2_MoneyTransfer') {
                            setTransferdetails = {
                                currentstep: 4,
                                beneficiaryDetail: store
                                    .getState()
                                    .beneficiarydetails,
                                operationtype: store
                                    .getState()
                                    .operationtype,
                                mode: 'offline',
                                transactionstatus: '401'
                            }
                            self
                                .props
                                .setcurrentbeneficiarystep(setTransferdetails);
                        } else {
                            setTransferdetails = {
                                currentstep: 4,
                                transferDetail: store
                                    .getState()
                                    .transferdetails,
                                operationtype: store
                                    .getState()
                                    .operationtype,
                                mode: 'offline',
                                transactionstatus: '401'
                            }
                            self
                                .props
                                .setcurrenttransferstep(setTransferdetails);
                        }
                    }
                    self
                        .props
                        .setload(false);
                });
        } else if (formdetail.value.validationcode === "") {
            ToastDanger('Error. (*) fields are required.');
        } else if (formdetail.value.validationcode.length !== 6 || formdetail.value.validationcode.length !== 8) {
            ToastDanger('Error. Your secure code must be either 6 or 8 digits.');
        }
    }

    render() {
        return (
            <div className="mttemplatecls">
                {(this.state.validationconfiguration.data.templateObject.mobileSupported == true && this.validTokens.length > 0) && <div>
                    <p>Select one of your available tokens to create your one-time-password.</p>
                    <Divider/>
                    <Tab
                        id="mtoffline"
                        onTabChange={this
                        .handleTokenchange
                        .bind(this)}
                        panes={this.validpane}/>
   
                    <FieldGroup
                        control={this.transactionvalidateform}
                        render={({pristine, value}) => (
                        <form>
                            <FieldControl
                                name="validationcode"
                                render={({handler}) => (
                               
                                    <div>
                                        <label className="tinput">Enter your code<label className="star">*</label>
                                        </label>
                                        <span><input {...handler()} maxLength={8} onKeyPress={(e) => this.handleKeyPressnumber(e, this.transactionvalidateform, 'transactionvalidateform')}/>
                                        </span>
                                    </div>

                            )}/>
                        </form>
                    )}/>
                       <Divider/>
                    <div>
                     
                        <button className="ui grey button" onClick={(e) => this.handlemtcancel(e)}>
                            Cancel</button>
                        <button
                            className="ui blue button btnrightal"
                            onClick={(e) => this.handleValidateotp(e, this.transactionvalidateform, 'transactionvalidateform')}>
                            Validate</button>
                    </div>

                </div>
}
                {(this.state.validationconfiguration.data.templateObject.mobileSupported == false && this.validTokens.length > 1) && <div>
                    <p>Select one of your available tokens to create your one-time-password.</p>
                    <Divider/>
                    <Tab
                        id="mtoffline"
                        onTabChange={this
                        .handleTokenchange
                        .bind(this)}
                        panes={this.validpane}/>
                          <FieldGroup
                        control={this.transactionvalidateform}
                        render={({pristine, value}) => (
                        <form>
                            <FieldControl
                                name="validationcode"
                                render={({handler}) => (
                                    <div>
                                        <label className="tinput">Enter your code<label className="star">*</label>
                                        </label>
                                        <span><input {...handler()} maxLength={8} onKeyPress={(e) => this.handleKeyPressnumber(e, this.transactionvalidateform, 'transactionvalidateform')}/>
                                        </span>
                                    </div>
                            )}/>
                        </form>
                    )}/>
                       <Divider/>
                    <div>
                     
                        <button className="ui grey button" onClick={(e) => this.handlemtcancel(e)}>
                            Cancel</button>
                        <button
                            className="ui blue button btnrightal"
                            onClick={(e) => this.handleValidateotp(e, this.transactionvalidateform, 'transactionvalidateform')}>
                            Validate</button>
                    </div>      
                  </div>
}
                {(this.validTokens.length == 0 && this.state.validationconfiguration.data.templateObject.mobileSupported == true) && <div>
                    <p>Use your mobile device to create your one-time-password</p>
                    <Divider/>
                    <Offlinevalidationmttmpl
                        validform="true"
                        type="GAOC"
                        qrCode={this.state.validationconfiguration.data.templateObject.qrcodeEncryptedData}/>
                </div>
}
                {(this.validTokens.length == 1 && this.state.validationconfiguration.data.templateObject.mobileSupported == false) && <div>
                    {(this.validTokens[0] === 'GATP') && <div>
                        <p>Use your Pico token and one of the option below to generate your
                            one-time-password</p>
                        <Divider/>
                    </div>}
                    {(this.validTokens[0] === 'GATB') && <div>
                        <p>Use your Flex token and one of the option below to generate your
                            one-time-password</p>
                        <Divider/>
                    </div>}
                    {(this.validTokens[0] === 'GATZ') && <div>
                        <p>Use your signer token and one of the option below to generate your
                            one-time-password</p>
                        <Divider/>
                    </div>}
                    {(this.validTokens[0] === 'GADB' || this.validTokens[0] === "GADF") && <div>
                        <p>Use your OnCard Pad token and one of the option below to generate your
                            one-time-password</p>
                        <Divider/>
                    </div>}
                    {(this.validTokens[0] === 'GAQT') && <div>
                        <p>Use your QR token and follow the steps below to generate your
                            one-time-password</p>
                        <Divider/>
                    </div>}

                    <Offlinevalidationmttmpl
                        validform="true"
                        type={this.validTokens[0]}  qrVersion={this.state.validationconfiguration.data.templateObject.tokenqrcodeEncryptedVersion}
                        qrCode={this.state.validationconfiguration.data.templateObject.tokenqrcodeEncryptedData}
                        chCode={this.state.validationconfiguration.data.templateObject.challengeCode}/>
                </div>
}
            </div>
        )

    }
}

function mapStateToProps(state) {
    return {validationconfiguration: state.validationconfiguration, username: state.username}
}
function matchDispatchToProps(dispatch) {
    return bindActionCreators({
        setload: setload,
        postmoneytransferValidation :postmoneytransferValidation,
        setcurrentbeneficiarystep:setcurrentbeneficiarystep,
        setcurrenttransferstep:setcurrenttransferstep
    }, dispatch)
}

export default withRouter(connect(mapStateToProps, matchDispatchToProps)(Offlinevalidationmt));
