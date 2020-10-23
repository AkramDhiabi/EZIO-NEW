import * as React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { Divider, Icon, Message, Table } from 'semantic-ui-react';
import { bindActionCreators } from 'redux';

import { FormBuilder, FieldControl, FieldGroup } from "react-reactive-form";
import { setcurrenttokenstep, setload } from "../Actions/action";

import { ToastDanger } from 'react-toastr-basic';


const codeImage = require('../../img/qrcode.png');
const codeImage1 = require('../../img/frame.png');
const codeImage2 = require('../../img/frame-2.png');
const codeImage3 = require('../../img/frame-3.png');
const codeImage4 = require('../../img/frame-4.png');

class ScanQrCode extends React.Component<any, any>{

    constructor(props) {
        super(props);
        this.state ={
            up:this.forceUpdateHandler.bind(this),
            r: this.generateQRCODE(1, 5),
            responseCode: null,
            errormessage: false,
        }
    }
    forceUpdateHandler() {
        this.forceUpdate();
    };

   
    componentWillMount() {
        this.props.setload(false); 
    }

    tokenform = FormBuilder.group({
        responseCode: ""
    });

    handletokensubmit(e: React.MouseEvent<HTMLButtonElement>) {
        e.preventDefault();
        this.setState({
            errormessage:false
        }) 
        if(this.tokenform.value.responseCode !== "" && this.tokenform.value.responseCode.length >= 8)
        {
            var setTokendetails={
                currenttokenstep:4,
                transferDetail: this.tokenform.value,
            }
            this.props.setcurrenttokenstep(setTokendetails);
        } else if (this.tokenform.value.responseCode !== "" && this.tokenform.value.responseCode.length < 8) {
            ToastDanger('Error. Invalid QR code');
        } else {
            ToastDanger('Error. (*) fields are required');
        }
    }

    handleKeyPressnumber = (event) => {
        var charCode = event.charCode;
        //Non-numeric character range
        if (charCode > 31 && (charCode < 48 || charCode > 57)) {
            event.preventDefault();
        }
        if (charCode === 13) {
            this.handletokensubmit(event);
        }
    }


    handlemtcancel(e) {
        e.preventDefault();
        this.props.history.push('/layout/accountsummary');
    }

     generateQRCODE(min, max) {
        this.forceUpdate();
        return parseInt(Math.random() * (max - min) + min);

    }
    displayImage(r) {

        switch (r) {
            case 1:

                return codeImage1;
                break;

            case 2:
                return codeImage2;
                break;

            case 3:
                return codeImage3;
                break;

            case 4:
                return codeImage4;
                break;

            default:
                return codeImage;
                break;

        }

    }

    render() {
        return (
            <div>
                 {this.state.errormessage === true &&
                    <Message negative>
                        <div className="twarning"><Icon color="red" name='warning sign'/> </div>
                        <div>
                        <Message.Header>Invalid login or password!</Message.Header>
                        <p>Overdraft not authorized</p>
                        </div>
                    </Message>
                }
                   
                <span className="addfontsize"><span className="font-weight-bold">Step 3</span> of 4: Scan QR code</span>
                <span className="mtrequirelabel"><label className="star">*</label>indicates a required field</span>
                <div className="tmplbrdrcls addmargin"></div>

                <FieldGroup control={this.tokenform} render={({ pristine, value }) => (
                    <form className="etform tokenform" onSubmit={() => this.handletokensubmit}>
                        <Table className="rttable " singleLine basic='very' unstackable>
                            <Table.Body>
                                <Table.Row>
                                    <Table.Cell>
                                        <label className="pwdusr">Scan QR code</label>
                                    </Table.Cell>
                                    <Table.Cell>
                                        <FieldControl name="codeImage" render={({ handler }) => (
                                            <div>
                                                <img className="codeImg" src={this.displayImage(this.state.r)} alt="qrCode" />
                                            </div>
                                        )} />
                                    </Table.Cell>
                                </Table.Row>
                                <Table.Row>
                                <Table.Cell>
                                        <label className="pwdusr">Response code<label className="star">*</label></label>
                                    </Table.Cell>
                                    <Table.Cell>
                                        <FieldControl name="responseCode" render={({ handler }) => (
                                            <div>
                                             <input 
                                               {...handler()} 
                                               onKeyPress={this.handleKeyPressnumber}
                                               /> 
                                             <div className="qr-code-notif">(The actual response code value will not be verified in this demo)</div> 
                                            </div>
                                        )} />
                                    </Table.Cell>
                                </Table.Row>
                            </Table.Body>
                        </Table>
                    </form>
                )} />
               
                <div>
                <Divider/>
                    <button className="ui grey button" onClick={(e) => this.handlemtcancel(e)}> Cancel
                        </button>
                    <button className="ui blue button btnrightal" onClick={(e) => this.handletokensubmit(e)}> Continue
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
        setcurrenttokenstep: setcurrenttokenstep,
        setload:setload
    }, dispatch)
}

export default withRouter(connect(mapStateToProps, matchDispatchToProps)(ScanQrCode));

