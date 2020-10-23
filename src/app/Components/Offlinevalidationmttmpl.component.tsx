import * as React from 'react';
import {connect} from 'react-redux';
import {store} from '../Store/store';
import {withRouter} from 'react-router-dom';
import {
    Grid,
    Divider,
    Icon,
    Segment,
} from 'semantic-ui-react';
import 'semantic-ui-css/semantic.min.css';
import Gemaltohdr from './Gemaltohdr.component';
import {bindActionCreators} from 'redux';
import {
    setload,
    postmoneytransferValidation,
    setcurrentbeneficiarystep,
    setcurrenttransferstep
} from '../Actions/action';
import {FormBuilder, FieldControl, FieldGroup} from "react-reactive-form";
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

function QRtokendemo(qrVersion) {
    const hexData = document
        .getElementById('qrcodediv')
        .dataset
        .value;
    //const qrVersion = 5;
    const errorCorrectionLevel = 'L';
    const script2 = document.createElement("script");

    const s = document.createElement('script');
    s.type = 'text/javascript';
    s.async = true;
    s.innerHTML =  "window.draw_qrcode(window.hexStringToString('"+hexData+"')," + qrVersion + ",'" + errorCorrectionLevel + "')";
    document
        .body
        .appendChild(s);
}
class Offlinevalidationmttmppl extends React.Component < any,
any > {

    constructor(props) {
        super(props);
        this.state = {
            username: store
                .getState()
                .username
        };

        this.handlemtcancel = this
            .handlemtcancel
            .bind(this);

    }
    mobilevalidateform = FormBuilder.group({validationcode: ""});
    flexvalidateform = FormBuilder.group({validationcode: ""});
    picovalidateform = FormBuilder.group({validationcode: ""});
    oncardvalidateform = FormBuilder.group({validationcode: ""});
    signervalidateform = FormBuilder.group({validationcode: ""});
    qrTokenvalidateform = FormBuilder.group({validationcode: ""});

    componentWillMount() {

        this
            .props
            .setload(true);
        this.setState({
            username: store
                .getState()
                .username
        })
    }

    componentDidMount() {
        this
            .props
            .setload(false);
    }

    handleKeyPressnumber = (event, formdetail, type, formname) => {
        var charCode = event.charCode;
        //Non-numeric character range
        if (charCode > 31 && (charCode < 48 || charCode > 57)) {
            event.preventDefault();
        }

        if(charCode === 13) {
            this.handlemtValidateotp(event, formdetail, type, formname);
        }
    }

    handlemtValidateotp(e, formdetail, type, formname) {
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
                tokenType: type,
                sHardTokenChallenge: this.props.chCode,
                otpValue: formdetail.value.validationcode,
                transactionType: "EzioDemoV2_NewBeneficiary"
            }

        } else {
            console.log(formdetail, type, "mtotp");

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
                tokenType: type,
                sHardTokenChallenge: this.props.chCode,
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
        } else if (formdetail.value.validationcode == "") {
            ToastDanger('Error. (*) fields are required.');
        } else if (formdetail.value.validationcode.length !== 6 || formdetail.value.validationcode.length !== 8) {
            ToastDanger('Error. Your secure code must be either 6 or 8 digits.');
        }

    }

    handlemtcancel(e) {
        e.preventDefault();
        this
            .props
            .history
            .push('/layout/accountsummary');
    }
    render() {

        // this.mobilevalidateform = FormBuilder.group({validationcode: ""});
        // this.flexvalidateform = FormBuilder.group({validationcode: ""});
        // this.picovalidateform = FormBuilder.group({validationcode: ""});
        // this.oncardvalidateform = FormBuilder.group({validationcode: ""});
        // this.signervalidateform = FormBuilder.group({validationcode: ""});

        if (this.props.type === 'GAOC') {
            return (
                <div>
                    <Grid>
                        <Grid.Column computer={10}>
                            <Segment className="defaultuiseg">
                                <p className="mtsteps">
                                    <span className="mrbold">Scan transaction</span>
                                    <span>
                                        <Icon name="check circle" className="customicon" color="green"></Icon>
                                        Step 1: Start the Demo Mobile app and select Online banking -{">"} Scan
                                        transaction
                                    </span>
                                    <span>
                                        <Icon name="check circle" className="customicon" color="green"></Icon>Step 2:
                                        Scan the QR code and follow the instructions to validate the transacation
                                    </span>
                                </p>
                            </Segment>
                        </Grid.Column>
                        <Grid.Column computer={6}>
                            <div
                                id="qrcodediv"
                                data-value={this.props.qrCode}
                                ref={() => {
                                demo()
                            }}></div>
                        </Grid.Column>
                    </Grid>
                    <div className="mtorseparator">-----OR-----</div>
                    <Grid>
                        <Grid.Column computer={16}>
                            <Segment className="defaultuiseg">
                                <p className="mtsteps">
                                    <span className="mrbold">Manual Signature</span>
                                    {store
                                        .getState()
                                        .operationtype !== 'EzioDemoV2_NewBeneficiary' && <div><span>
                                            <Icon name="check circle" className="customicon" color="green"></Icon>Step 1:
                                            Start the Demo Mobile app and select Online banking -{">"} Money transfer
                                        </span>

                                        <span>
                                            <Icon name="check circle" className="customicon" color="green"></Icon>Step 2: Insert the requested information</span>
                                        <div className="mrspangroup">
                                            <span>FROM ACCOUNT: {store
                                                    .getState()
                                                    .transferdetails
                                                    .fromAcc}</span>
                                            <span>TO ACCOUNT: {store
                                                    .getState()
                                                    .transferdetails
                                                    .toAcc}</span>
                                            <span>AMOUNT: {store
                                                    .getState()
                                                    .transferdetails
                                                    .amount}
                                                USD</span>
                                        </div>
                                        <span>
                                            <Icon name="check circle" className="customicon" color="green"></Icon>Step 3: Confirm and follow the instructions to validate the transaction
                                        </span>
                                        </div>}
                                    {store
                                        .getState()
                                        .operationtype === 'EzioDemoV2_NewBeneficiary' && store
                                        .getState()
                                        .beneficiarydetails !== null && <div><span>
                                            <Icon name="check circle" className="customicon" color="green"></Icon>Step 1:
                                            Start the Demo Mobile app and select Online banking -{">"}New beneficiary
                                        </span>

                                        <span><Icon name="check circle" className="customicon" color="green"></Icon>Step 2: Enter the required data:</span>
                                        <div className="mrspangroup">
                                            <span>BENEFICIARY ACCOUNT NAME: {store
                                                    .getState()
                                                    .beneficiarydetails
                                                    .accountname
}</span>
                                            <span>BENEFICIARY ACCOUNT NUMBER: {store
                                                    .getState()
                                                    .beneficiarydetails
                                                    .accountno}</span>
                                        </div>
                                        <span>
                                            <Icon name="check circle" className="customicon" color="green"></Icon>Step 3: Confirm and follow the instructions to validate the transaction
                                        </span>
                                        </div>}

                                </p>

                            </Segment>
                        </Grid.Column>
                    </Grid>
                    {this.props.validform === 'true' && <div  className="off-val-padding">
                        <FieldGroup
                            control={this.mobilevalidateform}
                            render={({pristine, value}) => (
                            <form>
                                <FieldControl
                                    name="validationcode"
                                    render={({handler}) => (
                                    <div>
                                        <label className="tinput">Enter your code<label className="star">*</label>
                                        </label>
                                        <span><input {...handler()} maxLength={8} onKeyPress={(e) => this.handleKeyPressnumber(e, this.mobilevalidateform, this.props.type, 'mobilevalidateform')}/>
                                        </span>
                                    </div>
                                )}/>
                            </form>
                        )}/>

                        <div className="devicebtngroup">
                            <Divider/>
                            <button className="ui grey button" onClick={(e) => this.handlemtcancel(e)}>
                                Cancel</button>
                            <button
                                className="ui blue button btnrightal"
                                onClick={(e) => this.handlemtValidateotp(e, this.mobilevalidateform, this.props.type, 'mobilevalidateform')}>
                                Validate</button>
                        </div>
                    </div>
}

                </div>

                ) }
                else if (this.props.type === 'GATB') {return (
                    <div>
                        <Grid>
                            <Grid.Column computer={16}>
                                <Segment className="defaultuiseg">
                                    <p className="mtsteps">
                                        <span className="mrbold">OCRA dynamic signature</span>

                                         
                                        <span>
                                            <Icon name="check circle" className="customicon" color="green"></Icon>Step 1: Keep pressed button 7
                                        </span>


                                        <span>
                                            <Icon name="check circle" className="customicon" color="green"></Icon>Step 2: Insert the requested information</span>

                                        {store
                                            .getState()
                                            .operationtype !== 'EzioDemoV2_NewBeneficiary' && <div className="mrspangroup">
                                                <span>CHALLENGE: {this.props.chCode}</span>
                                                <span>TO ACCOUNT: {store
                                                        .getState()
                                                        .transferdetails
                                                        .toAcc}</span>
                                                <span>AMOUNT: {store
                                                        .getState()
                                                        .transferdetails
                                                        .amount}
                                                    USD</span>
                                            </div>
}
                                        {store
                                            .getState()
                                            .operationtype === 'EzioDemoV2_NewBeneficiary' && store
                                            .getState()
                                            .beneficiarydetails !== null && <div className="mrspangroup">
                                                <span>CHALLENGE: {this.props.chCode}</span>
                                                <span>BENEFICIARY ACCOUNT: {store.getState().beneficiarydetails.accountno}</span>

                                                
                                            </div>
}

                                        <span>
                                            <Icon name="check circle" className="customicon" color="green"></Icon>Step 3: Enter your PIN code</span>
                                    </p>
                                </Segment>
                            </Grid.Column>
                        </Grid>
                        <div className="mtorseparator">-----OR-----</div>
                        <Grid>
                            <Grid.Column computer={16}>
                                <Segment className="defaultuiseg">
                                    <p className="mtsteps">
                                        <span className="mrbold">OCRA explicit signature</span>

                                         {store
                                            .getState()
                                            .operationtype !== 'EzioDemoV2_NewBeneficiary' &&
                                        <span>
                                            <Icon name="check circle" className="customicon" color="green"></Icon>Step 1: Press button 2
                                        </span>
                                         }

                                         {store
                                            .getState()
                                            .operationtype === 'EzioDemoV2_NewBeneficiary' &&
                                        <span>
                                            <Icon name="check circle" className="customicon" color="green"></Icon>Step 1: Press button 3
                                        </span>
                                         }
                                        <span>
                                            <Icon name="check circle" className="customicon" color="green"></Icon>Step 2:Insert the requested information</span>
                                        {store
                                            .getState()
                                            .operationtype !== 'EzioDemoV2_NewBeneficiary' && <div className="mrspangroup">
                                                <span>AMOUNT: {store
                                                        .getState()
                                                        .transferdetails
                                                        .amount}
                                                    USD</span>
                                            </div>
}
                                        {store
                                            .getState()
                                            .operationtype === 'EzioDemoV2_NewBeneficiary' && store
                                            .getState()
                                            .beneficiarydetails !== null && <div className="mrspangroup">
                                                <span>BENEFICIARY ACCOUNT: {store
                                                        .getState()
                                                        .beneficiarydetails
                                                        .accountno}</span>
                                            </div>
}
                                        <span>
                                            <Icon name="check circle" className="customicon" color="green"></Icon>Step 3: Confirm and follow the instructions to validate the transaction</span>
                                    </p>

                                </Segment>
                            </Grid.Column>
                        </Grid>
                        {this.props.validform === 'true' && <div  className="off-val-padding">
                            <FieldGroup
                                control={this.flexvalidateform}
                                render={({pristine, value}) => (
                                <form>
                                    <FieldControl
                                        name="validationcode"
                                        render={({handler}) => (
                                        <div>
                                            <label className="tinput">Enter your code<label className="star">*</label>
                                            </label>
                                            <span><input {...handler()} maxLength={8} onKeyPress={(e) => this.handleKeyPressnumber(e, this.flexvalidateform, this.props.type, 'flexvalidateform')}/>
                                            </span>
                                        </div>
                                    )}/>
                                </form>
                            )}/>

                            <div className="devicebtngroup">
                                <Divider/>
                                <button className="ui grey button" onClick={(e) => this.handlemtcancel(e)}>
                                    Cancel</button>
                                <button
                                    className="ui blue button btnrightal"
                                    onClick={(e) => this.handlemtValidateotp(e, this.flexvalidateform, this.props.type, 'flexvalidateform')}>
                                    Validate</button>
                            </div>
                        </div>
}

                    </div>
                )
}
                else if (this.props.type === 'GATZ') {return (
                    <div>
                        <Grid>
                            <Grid.Column computer={16}>
                                <Segment className="defaultuiseg">
                                    <p className="mtsteps">
                                        <span className="mrbold">OCRA dynamic signature</span>
                                        <span>
                                            <Icon name="check circle" className="customicon" color="green"></Icon>Step 1: Press button 7
                                        </span>
                                        <span>
                                            <Icon name="check circle" className="customicon" color="green"></Icon>Step 2: Enter your PIN code
                                        </span>

                                        <span>
                                            <Icon name="check circle" className="customicon" color="green"></Icon>Step 3: Insert the requested information</span>
                                        {store
                                            .getState()
                                            .operationtype !== 'EzioDemoV2_NewBeneficiary' && <div className="mrspangroup">
                                                <span>CHALLENGE: {this.props.chCode}</span>
                                                <span>TO ACCOUNT: {store
                                                        .getState()
                                                        .transferdetails
                                                        .toAcc}</span>
                                                <span>AMOUNT: {store
                                                        .getState()
                                                        .transferdetails
                                                        .amount}
                                                    USD</span>
                                            </div>
}
                                        {store
                                            .getState()
                                            .operationtype === 'EzioDemoV2_NewBeneficiary' && store
                                            .getState()
                                            .beneficiarydetails !== null && <div className="mrspangroup">
                                                <span>CHALLENGE: {this.props.chCode}</span>
                                                
                                                <span>BENEFICIARY ACCOUNT: {store
                                                        .getState()
                                                        .beneficiarydetails
                                                        .accountno}</span>
                                            </div>
}
                                    </p>
                                </Segment>
                            </Grid.Column>
                        </Grid>
                        <div className="mtorseparator">-----OR-----</div>
                        <Grid>
                            <Grid.Column computer={16}>
                                <Segment className="defaultuiseg">
                                    <div className="mtsteps">
                                        <span className="mrbold">OCRA explicit signature</span>
                                        {store
                                            .getState()
                                            .operationtype !== 'EzioDemoV2_NewBeneficiary' &&
                                        <span>
                                            <Icon name="check circle" className="customicon" color="green"></Icon>Step 1: Press button 2
                                        </span>
                                         }

                                         {store
                                            .getState()
                                            .operationtype === 'EzioDemoV2_NewBeneficiary' &&
                                        <span>
                                            <Icon name="check circle" className="customicon" color="green"></Icon>Step 1: Press button 3
                                        </span>
                                         }

                                        <span>
                                            <Icon name="check circle" className="customicon" color="green"></Icon>Step 2: Insert the requested information</span>
                                        {store
                                            .getState()
                                            .operationtype !== 'EzioDemoV2_NewBeneficiary' && <div className="mrspangroup">
                                                <span>AMOUNT: {store
                                                        .getState()
                                                        .transferdetails
                                                        .amount}
                                                    USD</span>
                                            </div>
}
                                        {store
                                            .getState()
                                            .operationtype === 'EzioDemoV2_NewBeneficiary' && store
                                            .getState()
                                            .beneficiarydetails !== null && <div className="mrspangroup">
                                             
                                                <span>BENEFICIARY ACCOUNT: {store
                                                        .getState()
                                                        .beneficiarydetails
                                                        .accountno}</span>
                                            </div>
}

                                    </div>

                                </Segment>
                            </Grid.Column>
                        </Grid>
                        {this.props.validform === 'true' && <div  className="off-val-padding">
                            <FieldGroup
                                control={this.signervalidateform}
                                render={({pristine, value}) => (
                                <form>
                                    <FieldControl
                                        name="validationcode"
                                        render={({handler}) => (
                                        <div id="signeralign">
                                            <label className="tinput">Enter your code<label className="star">*</label>
                                            </label>
                                            <span><input {...handler()} maxLength={8} onKeyPress={(e) => this.handleKeyPressnumber(e, this.signervalidateform, this.props.type, 'signervalidateform')}/>
                                            </span>
                                        </div>
                                    )}/>
                                </form>
                            )}/>

                            <div className="devicebtngroup">
                                <Divider/>
                                <button className="ui grey button" onClick={(e) => this.handlemtcancel(e)}>
                                    Cancel</button>
                                <button
                                    className="ui blue button btnrightal"
                                    onClick={(e) => this.handlemtValidateotp(e, this.signervalidateform, this.props.type, 'signervalidateform')}>
                                    Validate</button>
                            </div>
                        </div>
}

                    </div>
                )
}
                else if (this.props.type === 'GATP') {return (
                    <div>
                        <Grid>
                            <Grid.Column computer={16}>
                                <Segment className="defaultuiseg">
                                    <p className="mtsteps">
                                        <span className="mrbold">OCRA standard signature</span>
                                        <span>
                                            <Icon name="check circle" className="customicon" color="green"></Icon>Step 1: Press OK and enter your PIN
                                        </span>
                                        <span>
                                            <Icon name="check circle" className="customicon" color="green"></Icon>Step 2: Press button 3
                                        </span>

                                        <span>
                                            <Icon name="check circle" className="customicon" color="green"></Icon>Step 3: Insert the requested information</span>
                                        {store
                                            .getState()
                                            .operationtype !== 'EzioDemoV2_NewBeneficiary' && <div className="mrspangroup">
                                                <span>[Data1]: {store
                                                        .getState()
                                                        .transferdetails
                                                        .toAcc} then press OK</span>
                                                <span>[Data2]: {store
                                                        .getState()
                                                        .transferdetails
                                                        .amount} then press OK</span>
                                                <span>[Data3]: press OK</span>
                                            </div>
}
                                        {store
                                            .getState()
                                            .operationtype === 'EzioDemoV2_NewBeneficiary' && store
                                            .getState()
                                            .beneficiarydetails !== null && <div className="mrspangroup">
                                                
                                                <span>BENEFICIARY ACCOUNT: {store
                                                        .getState()
                                                        .beneficiarydetails
                                                        .accountno}</span>
                                            </div>
}

                                    </p>

                                </Segment>
                            </Grid.Column>
                        </Grid>

                        {this.props.validform === 'true' && <div  className="off-val-padding">
                            <FieldGroup
                                control={this.picovalidateform}
                                render={({pristine, value}) => (
                                <form>
                                    <FieldControl
                                        name="validationcode"
                                        render={({handler}) => (
                                        <div>
                                            <label className="tinput">Enter your code<label className="star">*</label>
                                            </label>
                                            <span><input {...handler()} maxLength={8} onKeyPress={(e) => this.handleKeyPressnumber(e, this.picovalidateform, this.props.type, 'picovalidateform')}/>
                                            </span>
                                        </div>
                                    )}/>
                                </form>
                            )}/>

                            <div className="devicebtngroup">
                                <Divider/>
                                <button className="ui grey button" onClick={(e) => this.handlemtcancel(e)}>
                                    Cancel</button>
                                <button
                                    className="ui blue button btnrightal"
                                    onClick={(e) => this.handlemtValidateotp(e, this.picovalidateform, this.props.type, 'picovalidateform')}>
                                    Validate</button>
                            </div>
                        </div>
}

                    </div>
                )
}
                else if (this.props.type === 'GADB' || this.props.type === 'GADF') {return (
                    <div>
                        <Grid>
                            <Grid.Column computer={16}>
                                <Segment className="defaultuiseg">
                                    <p className="mtsteps">
                                        <span className="mrbold">OCRA standard signature</span>
                                        <span>
                                            <Icon name="check circle" className="customicon" color="green"></Icon>Step 1: Press the START button, enter your PIN and OK
                                        </span>

                                         {store
                                            .getState()
                                            .operationtype !== 'EzioDemoV2_NewBeneficiary' &&
                                            <span>
                                            <Icon name="check circle" className="customicon" color="green"></Icon>Step 2: Press button 7(AMOUNT)
                                            </span>
                                         }

                                         {store
                                            .getState()
                                            .operationtype === 'EzioDemoV2_NewBeneficiary' &&
                                            <span>
                                            <Icon name="check circle" className="customicon" color="green"></Icon>Step 2: Press button 8(ACCOUNT)
                                            </span>
                                         }
                                       

                                        <span>
                                            <Icon name="check circle" className="customicon" color="green"></Icon>Step 3: Insert the requested information</span>
                                        {store
                                            .getState()
                                            .operationtype !== 'EzioDemoV2_NewBeneficiary' && <div className="mrspangroup">
                                                <span>Amount: {store
                                                        .getState()
                                                        .transferdetails
                                                        .amount} then press OK</span>
                                            </div>
}
                                        {store
                                            .getState()
                                            .operationtype === 'EzioDemoV2_NewBeneficiary' && store
                                            .getState()
                                            .beneficiarydetails !== null && <div className="mrspangroup">
                                                
                                                <span>BENEFICIARY ACCOUNT: {store.getState().beneficiarydetails.accountno.substr(store.getState().beneficiarydetails.accountno.length -8)}</span>
                                            </div>
}

                                    </p>

                                </Segment>
                            </Grid.Column>
                        </Grid>
                        {this.props.validform === 'true' && <div  className="off-val-padding">
                            <FieldGroup
                                control={this.oncardvalidateform}
                                render={({pristine, value}) => (
                                <form>
                                    <FieldControl
                                        name="validationcode"
                                        render={({handler}) => (
                                        <div>
                                            <label className="tinput">Enter your code<label className="star">*</label>
                                            </label>
                                            <span><input {...handler()} maxLength={8} onKeyPress={(e) => this.handleKeyPressnumber(e, this.oncardvalidateform, this.props.type, 'oncardvalidateform')}/>
                                            </span>
                                        </div>
                                    )}/>
                                </form>
                            )}/>
                            <div className="devicebtngroup">
                                <Divider/>
                                <button className="ui grey button" onClick={(e) => this.handlemtcancel(e)}>
                                    Cancel</button>
                                <button
                                    className="ui blue button btnrightal"
                                    onClick={(e) => this.handlemtValidateotp(e, this.oncardvalidateform, this.props.type, 'oncardvalidateform')}>
                                    Validate</button>
                            </div>
                        </div>
}

                    </div>
                )
}
else 
if (this.props.type === 'GAQT') {
    return (
        <div>
            <Grid>
                <Grid.Column computer={10}>
                    <Segment className="defaultuiseg">
                        <p className="mtsteps">
                            <span className="mrbold">QR SWYS Free Text</span>
                            <span>
                                <Icon name="check circle" className="customicon" color="green"></Icon>
                                Step 1: Start your device, enter your PIN Code and press "OK"
                            </span>
                            <span>
                                <Icon name="check circle" className="customicon" color="green"></Icon>
                                Step 2: Press the "SCAN" button and flash this generated QR Code
                            </span>
                            <span>
                                <Icon name="check circle" className="customicon" color="green"></Icon>
                                Step 3: Confirm the transaction with the "OK" button
                            </span>
                            <span>
                                <Icon name="check circle" className="customicon" color="green"></Icon>
                                Step 4: Enter the OTP and click "Validate"
                            </span>
                        </p>
                    </Segment>
                </Grid.Column>
                <Grid.Column computer={6}>
                    <div
                        id="qrcodediv" className="token_qr_cls"
                        data-value={this.props.qrCode}
                        ref={() => {
                        QRtokendemo(this.props.qrVersion)
                    }}></div>
                </Grid.Column>
            </Grid>

                        {this.props.validform === 'true' && <div  className="off-val-padding">
                            <FieldGroup
                                control={this.qrTokenvalidateform}
                                render={({pristine, value}) => (
                                <form>
                                    <FieldControl
                                        name="validationcode"
                                        render={({handler}) => (
                                        <div>
                                            <label className="tinput">Enter your code<label className="star">*</label>
                                            </label>
                                            <span><input {...handler()} maxLength={8} onKeyPress={(e) => this.handleKeyPressnumber(e, this.qrTokenvalidateform, this.props.type, 'qrTokenvalidateform')}/>
                                            </span>
                                        </div>
                                    )}/>
                                </form>
                            )}/>
                            <div className="devicebtngroup">
                                <Divider/>
                                <button className="ui grey button" onClick={(e) => this.handlemtcancel(e)}>
                                    Cancel</button>
                                <button
                                    className="ui blue button btnrightal"
                                    onClick={(e) => this.handlemtValidateotp(e, this.qrTokenvalidateform, this.props.type, 'qrTokenvalidateform')}>
                                Validate</button>
                            </div>
                        </div>
}

        </div>
) }

                } } 
                function mapStateToProps(state) {return {Mobileregistrationresponse: state.Mobileregistrationresponse, username: state.username}
}
                function matchDispatchToProps(dispatch) {return bindActionCreators({
                    setload: setload,
                    postmoneytransferValidation: postmoneytransferValidation,
                    setcurrentbeneficiarystep: setcurrentbeneficiarystep,
                    setcurrenttransferstep: setcurrenttransferstep

                }, dispatch)
}


export default withRouter(connect(mapStateToProps, matchDispatchToProps)(Offlinevalidationmttmppl));
