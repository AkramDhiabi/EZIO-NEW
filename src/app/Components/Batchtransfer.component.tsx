import * as React from 'react';
import {Component} from 'react'
import {Link} from 'react-router-dom';
import {withRouter} from 'react-router-dom';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {store} from '../Store/store';
import {setload, postDCVactivationaction, getDeviceID} from '../Actions/action';
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
    Popup,
    Divider,
    Message
} from 'semantic-ui-react';
import {ToastDanger} from 'react-toastr-basic';
import 'semantic-ui-css/semantic.min.css';

class Batchtransfer extends React.Component < any,
any > {
    constructor(props) {
        super(props);
        this.state={
            FromAccount1: '324556996633',
            ToAccount1: '121288482224',
            BAmount1:'5250.00',
            FromAccount2: '324556996634',
            ToAccount2:'121288482225',
            BAmount2:'10020.00',
            FromAccount3: '324556996634',
            ToAccount3:'121288482226',
            BAmount3:'32560.00',
            FromAccount4: '324556996636',
            ToAccount4:'121288482227',
            BAmount4:'12400.00',
            totalAmount:'60230.00',
            failmessage:false
        }

        this.handlecompute = this.handlecompute.bind(this)
    }

    handlemtcancel(e) {
        e.preventDefault();
        this
            .props
            .history
            .push('/layout/accountsummary');
    }
    componentWillMount() {
        this
        .props
        .setload(true);
        this.setState({
            failmessage:false
        })
        var sendData={
            userId:store.getState().username
        }
        var self = this;
        this.props.getDeviceID(sendData).then(function (response) {
            console.log(response);
            if (response.data ==='NO_TOKEN_FOUND') {
                console.log("NO_TOKEN_FOUND!");
                const deviceScript = document.createElement('script');
                deviceScript.type = 'text/javascript';
                deviceScript.async = true;
                var userID = store.getState().username;
                deviceScript.innerHTML = "window.initializeEzioFlex()";
                document
                    .body
                    .appendChild(deviceScript);
                self.setState({
                    failmessage:true
                })
                self
                    .props
                    .setload(false);
            }
            else {
                const deviceScript = document.createElement('script');
                deviceScript.type = 'text/javascript';
                deviceScript.async = true;
                var userID = store.getState().username;
                deviceScript.innerHTML = "window.tokenFound();window.initializeEzioFlex()";
                document
                    .body
                    .appendChild(deviceScript);
                self
                    .props
                    .setload(false);
            }

        })
        

    }
    componentDidMount() {

    }
    componentWillUnmount() {
        const finalizeScript = document.createElement('script');
        finalizeScript.type = 'text/javascript';
        finalizeScript.async = true;
        finalizeScript.innerHTML = "window.finalize()";
        document
            .body
            .appendChild(finalizeScript);
    }
    handlesubmit()
    {
        const signScript = document.createElement('script');
        signScript.type = 'text/javascript';
        signScript.async = true;
        signScript.innerHTML = "'use strict';var cnx = enex.getConnection();if ((null === cnx) || (typeof (cnx) " +
                "=== " + undefined + ")){promptForTokenConnection();onConnectionFunctionToExecute = transactionBatchSi" +
                "gning;} transactionBatchSigning();"
        document
            .body
            .appendChild(signScript);
    }

    handleBatchchange(e, statename) {
        e.preventDefault();

        this.setState({
            [statename]:e.target.value
        })
        
    }
    handlecompute(){

        var total:any = parseFloat(this.state.BAmount1);
        total += parseFloat(this.state.BAmount2);
        total += parseFloat(this.state.BAmount3);
        total += parseFloat(this.state.BAmount4);
        total = parseFloat(total).toFixed(2);
        total = total.toString()
        console.log(total);
        this.setState({
            totalAmount:total
         })
      
    }

    render() {
        return (

            <div>
                <Grid className="contentdetail">
                    <Grid.Column width={14}>
                        <Segment className="accdetailsec tcontentdetail">
                            <div id="tmsgbox">
                                {this.state.failmessage === true && <Message negative>
                                        <div className="twarning"><Icon color="red" name='warning sign'/> </div>
                                        <div>
                                        <Message.Header>Warning!</Message.Header>
                                        <p>No device was found! Please complete the provisioning first.</p>
                                        </div>
                                    </Message>
                                    }
                                </div>

                            <div className="row">
                                <div>
                                    <p className="addfontsize">This is an example how the OATH OCRA - SWYS functionality can be used for a
                                        batch transfer signing</p>
                                    <p  className="addfontsize">Press the "SIGN" button to start the transfer.</p>
                                </div>
                            </div>
                            <div>
                                <table className="table batch-table">
                                    <thead>
                                        <tr>
                                            <th>From account</th>
                                            <th>To account</th>
                                            <th>Date</th>
                                            <th>Amount (USD)</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <td><input
                                                className="form-control"
                                                id="transactionBatchSigningFromAccount1" defaultValue={this.state.FromAccount1} onChange={(e) => this.handleBatchchange(e,'FromAccount1')} maxLength={12}/></td>
                                            <td><input
                                                className="form-control"
                                                id="transactionBatchSigningToAccount1" defaultValue={this.state.ToAccount1} onChange={(e) => this.handleBatchchange(e,'ToAccount1')}
                                                maxLength={12}/></td>
                                            <td><input
                                                className="form-control"
                                                id="transactionBatchSigningDate1"
                                                value={new Date().toLocaleString().split(',')[0]} /></td>
                                            <td><input
                                                className="form-control"
                                                id="transactionBatchSigningAmount1"  defaultValue={this.state.BAmount1} onChange={(e) => this.handleBatchchange(e,'BAmount1')} onBlur={this.handlecompute}
                                                maxLength={12}/></td>
                                        </tr>
                                        <tr>
                                            <td><input
                                                className="form-control"
                                                id="transactionBatchSigningFromAccount2" defaultValue={this.state.FromAccount2} onChange={(e) => this.handleBatchchange(e,'FromAccount2')}
                                                maxLength={12}/></td>
                                            <td><input
                                                className="form-control"
                                                id="transactionBatchSigningToAccount2" defaultValue={this.state.ToAccount2} onChange={(e) => this.handleBatchchange(e,'ToAccount2')}
                                                maxLength={12}/></td>
                                            <td><input
                                                className="form-control"
                                                id="transactionBatchSigningDate2"
                                                value={new Date().toLocaleString().split(',')[0]} /></td>
                                            <td><input
                                                className="form-control"
                                                id="transactionBatchSigningAmount2" defaultValue={this.state.BAmount2} onChange={(e) => this.handleBatchchange(e,'BAmount2')} onBlur={this.handlecompute}
                                                maxLength={12}/></td>
                                        </tr>
                                        <tr>
                                            <td><input
                                                className="form-control"
                                                id="transactionBatchSigningFromAccount3" defaultValue={this.state.FromAccount3} onChange={(e) => this.handleBatchchange(e,'FromAccount3')}
                                                maxLength={12}/></td>
                                            <td><input
                                                className="form-control"
                                                id="transactionBatchSigningToAccount3" defaultValue={this.state.ToAccount3} onChange={(e) => this.handleBatchchange(e,'ToAccount3')} maxLength={12}/></td>
                                            <td><input
                                                className="form-control"
                                                id="transactionBatchSigningDate3"
                                                value={new Date().toLocaleString().split(',')[0]} /></td>
                                            <td><input
                                                className="form-control"
                                                id="transactionBatchSigningAmount3" defaultValue={this.state.BAmount3} onChange={(e) => this.handleBatchchange(e,'BAmount3')} onBlur={this.handlecompute}
                                                maxLength={12}/></td>
                                        </tr>
                                        <tr>
                                            <td><input
                                                className="form-control"
                                                id="transactionBatchSigningFromAccount4" defaultValue={this.state.FromAccount4} onChange={(e) => this.handleBatchchange(e,'FromAccount4')}/></td>
                                            <td><input
                                                className="form-control"
                                                id="transactionBatchSigningToAccount4" defaultValue={this.state.ToAccount4} onChange={(e) => this.handleBatchchange(e,'ToAccount4')}
                      
                                                maxLength={12}/></td>
                                            <td><input
                                                className="form-control"
                                                id="transactionBatchSigningDate4"
                                                value={new Date().toLocaleString().split(',')[0]} /></td>
                                            <td><input
                                                className="form-control"
                                                id="transactionBatchSigningAmount4" defaultValue={this.state.BAmount4} onChange={(e) => this.handleBatchchange(e,'BAmount4')} onBlur={this.handlecompute} maxLength={12}/></td>
                                        </tr>
                                      
                                    </tbody>
                                </table>
                                <div className="custom-total-block">
                                <span>Total amount</span>
                                <input data-readonly
                                                className="form-control custom-total"
                                                id="transactionBatchSigningTotalAmount"
                                                value={this.state.totalAmount}/>
                                </div>
                               
                                <p className="error" id="err_no_device_found"></p>
                            </div>

                        </Segment>
                    </Grid.Column>
                    <Grid.Column width={14}>
                        <div className="rtbtngroup">
                            <input
                                type="hidden"
                                id="input_userId"
                                value={store
                                .getState()
                                .username}/>
                            <input type="hidden" id="input_dataHex"/>
                            <input type="hidden" id="input_tokenName"/>
                            <input type="hidden" id="input_otp"/>
                            <Divider/>
                            <button className="ui grey button" onClick={(e) => this.handlemtcancel(e)}>
                                Cancel
                            </button>
                            <button
                                className="ui blue button btnrightal"
                                id="buttonTransactionBatchSigning"
                                onClick={() => this.handlesubmit()}>
                                Sign
                            </button>
                            
                        </div>

                        {/* <!-- modal box to display the result --> */}
                        <div
                            className="modal custom-modal-background"
                            id="sdk-modalbox"
                            role="dialog"
                            aria-labelledby="sdk-modal-title"
                            aria-hidden="true">
                            <div className="modal-dialog" role="document">
                                <div className="modal-content customcontent custom-padding">
                                    <div className="modal-header customheader">
                                        <h4 className="modal-title" id="sdk-modal-title">Modal title</h4>
                                    </div>

                                    <div>
                                        <p id="sdk-modal-result" className="customtext">Default result</p>
                                    </div>

                                    <div className="modal-footer">
                                        <button className="btn btn-danger" data-dismiss="modal">Close</button>
                                    </div>

                                </div>
                            </div>
                        </div>

                        {/* Wait Modal */}
                        <div
                            className="modal fade custom-modal-background"
                            id="modelPleaseWait"
                            data-backdrop="static"
                            data-keyboard="false"
                            role="dialog"
                            aria-labelledby="modelPleaseWaitLabel"
                            aria-hidden="true">
                            <div className="modal-dialog" role="document">
                                <div className="modal-content customcontent">
                                    <div className="modal-header">
                                        <h5 className="modal-title" id="modelPleaseWaitLabel">Please wait...</h5>
                                        <div >
                                            <img src="src/img/loader-icon.gif"/>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* <!-- OTP Validate Modal--> */}
                        <div
                            className="modal fade custom-modal-background"
                            id="modelOTP_Validate"
                            data-backdrop="static"
                            data-keyboard="false"
                            role="dialog"
                            aria-labelledby="modelOTP_ValidateLabel"
                            aria-hidden="true">
                            <div className="modal-dialog" role="document">
                                <div className="modal-content customcontent">
                                    <div className="modal-header customheader">
                                        <h4 className="modal-title" id="modelOTP_ValidateLabel">Batch transfer done!</h4>
                                        <div className="custom-img-box">
                                            <img src="src/img/icon-success.png"/>
                                        </div>
                                    </div>
                                    <div className="modal-body">

                                        <div className="customtext" id="modalOTP_Validate_BodyText"></div>

                                        <div className="modal-footer">
                                            <button
                                                className="btn btn-danger"
                                                type="button"
                                                id="modelOTP_ValidateCloseBtn"
                                                data-dismiss="modal">Close</button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* <!-- OTP Validation failed Modal--> */}
                        <div
                            className="modal fade custom-modal-background"
                            id="modelOTP_ValidationFailed"
                            data-backdrop="static"
                            data-keyboard="false"
                            role="dialog"
                            aria-labelledby="modelOTP_ValidationFailedLabel"
                            aria-hidden="true">
                            <div className="modal-dialog" role="document">
                                <div className="modal-content customcontent">
                                    <div className="modal-header customheader">
                                        <h4 className="modal-title" id="modelOTP_ValidationFailedLabel">Batch transfer failed!</h4>
                                        <div className="custom-img-box">
                                            <img src="src/img/icon-reject.png"/>
                                        </div>
                                    </div>
                                    <div className="modal-body">

                                        <div className="customtext" id="modalOTP_Validation_Failed_BodyText"></div>

                                        <div className="modal-footer">
                                            <button
                                                className="btn btn-danger"
                                                type="button"
                                                id="modelOTP_ValidationFailedCloseBtn"
                                                data-dismiss="modal">Close</button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
     
                    </Grid.Column>
                </Grid>
            </div>
            ) } } 
            
function mapStateToProps(state) {
    return {}
}
            function matchDispatchToProps(dispatch) {return bindActionCreators({
                setload: setload,
                postDCVactivationaction: postDCVactivationaction,
                getDeviceID:getDeviceID
            }, dispatch)
}

export default connect(mapStateToProps, matchDispatchToProps)(Batchtransfer)