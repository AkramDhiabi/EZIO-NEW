import * as React from 'react';
import { Component } from 'react'
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { store } from '../Store/store';
import { getaccountData,posttokenactivation,setload, setusername, checklogin } from '../Actions/action';
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
    Message
} from 'semantic-ui-react';
import { FormBuilder, FieldControl, FieldGroup } from "react-reactive-form";
import 'semantic-ui-css/semantic.min.css';
import {ToastDanger} from 'react-toastr-basic';
const tokendev = require('../../img/tokendevice.png');
const tokenkey = require('../../img/tokenkey.png');

class Tokenactivation extends React.Component<any,any> {

    constructor(props) {
        super(props);
        this.handletokenactivate = this.handletokenactivate.bind(this);
        this.state ={
            successmessage:false,
            errormessage:false,
            failmessage:false,
            displaymessage:'',
            username:store.getState().username,
            deviceserial:''
        }
    }
    tokenform = FormBuilder.group({
        serialno: "",
        totp: ""
    });

    errormessages = [{
		"type": "BAD_FORMAT",
		"header": "Activation failed!",
		"message": "Make sure you entered the correct serial number."
	},
	{
		"type": "TOKEN_NOT_FOUND",
		"header": "Activation failed!",
		"message": "The serial number you entered does not match our records. Make sure to provision it first."
	},
	{
		"type": "TOKEN_ALREADY_ASSOCIATED",
		"header": "Activation failed!",
		"message": "The serial number you entered is already used by another user. Please contact the support."
	},
	{
		"type": "GENERAL_ERROR",
		"header": "Activation failed!",
		"message": "Server error. Please try again."
	},
	{
		"type": "TOKEN_BLOCKED_OR_REVOKED",
		"header": "Activation failed!",
		"message": "Token revoked by the bank. Please contact the support."
    },
    {
		"type": "LINK_OR_ACTIVATION_FAILED",
		"header": "Activation failed!",
		"message": "Server error. Please try again."
    }
    ]

    componentWillMount() {

    }
   
    handletokenactivate(e) {
        e.preventDefault();

       
        if( this.tokenform.value.serialno !==""  &&  this.tokenform.value.serialno.substring(0, 4) === 'GAQT' ||
        this.tokenform.value.serialno !=="" &&  this.tokenform.value.totp !== "" && this.tokenform.value.totp.length == 6 ||this.tokenform.value.totp.length == 8)
        {
            this.props.setload(true);
            this.setState(
            {
                    successmessage:false,
                    errormessage:false,
                    failmessage:false,
                    displaymessage:''
                }
            )
            var sendtokendetail=null;
            if(this.tokenform.value.serialno.substring(0, 4) === 'GAQT')
            {
                sendtokendetail = {
                    userId:this.state.username,
                    tokenSerialNumber:this.tokenform.value.serialno,
                    otpValue:'12345678'
                }
            }
            else{
                sendtokendetail = {
                    userId:this.state.username,
                    tokenSerialNumber:this.tokenform.value.serialno,
                    otpValue:this.tokenform.value.totp
                }
            }
           
         
            const self = this;

            self.props.posttokenactivation(sendtokendetail).then(function (response) {
               
                if(response !== undefined && response.data.responseCode === 200){
                    self.tokenform.reset();
                    console.log("all ok");
                    
                    self.setState({
                        deviceserial:response.data.templateObject
                    })
                   
                    if(response.data.message === "ALL_OK_ACTIVATED" || response.data.message === "ALL_OK_INITIALIZED")
                    {
                        self.setState({
                            successmessage:true
                        })
                    }
                    else if(response.data.message === "ALL_OK_ACTIVATED_OTP_VALIDATION_FAILED" || response.data.message === "ALL_OK_INITIALIZED_OTP_VALIDATION_FAILED")
                    {
                        self.setState({
                            failmessage:true
                        })
                    }
                }
                else if(response !== undefined && response.data.responseCode === 500){
                   
                    ToastDanger('Internal server error');
                }
                else if(response !== undefined && response.data.responseCode !== null){
                    self.tokenform.reset();
                    var currenterrormessage = self.errormessages.filter((item) => item.type == response.data.message)
                    self.setState({
                        errormessage:true,
                        displaymessage:currenterrormessage[0].message
                    })
                }
                else{
                    
                    ToastDanger('Internal server error');
                }
                self.props.setload(false);
            }); 
        }
        else if(this.tokenform.value.serialno =="" ||  this.tokenform.value.totp == ""){
            ToastDanger('Error. (*) fields are required');
        }  
        else if(this.tokenform.value.totp.length !== 6 ||this.tokenform.value.totp.length !== 8){
            ToastDanger('Error. Secure codes can be either 6 or 8 digits');
        }

    }

    handleclickontokenprocess(){
        var elements = document.getElementsByTagName('a');
        for (var i = 0; i < elements.length; i++) {
          if (elements[i].innerHTML === 'Resynchronization') {
            elements[i].click();
          }
        }
    }

    handleKeyPressnumber = (event) => {
        var charCode = event.charCode;
        //Non-numeric character range
        if (charCode > 31 && (charCode < 48 || charCode > 57)){
        event.preventDefault();
        }

        
		if(charCode === 13) {
            this.handletokenactivate(event);
        }
		
    }
    handleTokenserialEnter= (event) => {
        var charCode = event.charCode;
        if(charCode === 13) {
            this.handletokenactivate(event);
        }
    }
    render() {

        return (

            <div>
                <Grid className="tcontentdetail">
                    <Grid.Column width={16}>
                        <Segment className="accdetailsec tcontentdetail">
                            <div id="tmsgbox">
                            {this.state.failmessage === true && <Message negative>
                                    <div className="twarning"><Icon color="red" name='warning sign'/> </div>
                                    <div>
                                    <Message.Header>Warning!</Message.Header>
                                    <p>Your token {this.state.deviceserial} has been activated but your security code could not be verified. It may be resynchronized <span id="here" onClick={this.handleclickontokenprocess}>here.</span></p>
                                    </div>
                                </Message>
                                }
                                {this.state.successmessage === true &&
                                <Message positive>
                                    <div className="tsuccess"><Icon id="tick" name='checkmark' /> </div>
                                    <div>
                                        <Message.Header>Activation done!</Message.Header>
                                        <p>Your token {this.state.deviceserial} is ready for use.</p>
                                    </div>
                                </Message>
                                }
                                {this.state.errormessage === true &&
                                <Message negative>
                                        <div className="twarning"><Icon color="red" name='warning sign'/> </div>
                                        <div>
                                        <Message.Header>Activation Failed!</Message.Header>
                                        <p>{this.state.displaymessage}</p>
                                        </div>
                                </Message>
                                }
                            </div>
                            <span className="addfontsize">Link a token to your account and activate it.</span>
                            <div className="tmplbrdrcls addmargin"></div>
                            <div id="tmsgreq">
                                <span><label className="star">*</label>Required</span>
                            </div>
                            <FieldGroup control={this.tokenform} render={({ pristine, value }) => (
                                <form>
                                    <FieldControl name="serialno" render={({ handler }) => (
                                        <div>
                                            <div id="tpcctxt">
                                                <div className="tokenfrmttl">1. Enter your serial number</div>
                                            </div>
                                            <div id="tserial">
                                                <div className="">You will find it at the bottom of your your token.</div>
                                                <div>
                                                    <label className="tinput">Enter your serial number<label className="star">*</label></label>
                                                    <span><input {...handler()} maxLength={12} onKeyPress={this.handleTokenserialEnter}/>
                                                    </span>
                                                </div>
                                            </div>
                                            <div id="tknmar">
                                                <img className="" id="timg" src={tokendev} alt="tokendevice" />
                                            </div>
                                        </div>
                                    )} />

                                    <FieldControl name="totp" render={({ handler }) => (
                                        <div>
                                            <div id="tpcctxt">
                                                <div className="tokenfrmttl">2. Generate a TOTP</div>
                                            </div>
                                            <div id="ttotp">
                                                <div className="">With your token turned on, press the <img className="tkeyimg" src={tokenkey} alt="tokendevice" /> key. It will generate a TOTP.<br />
                                                    <span className="cmnfntsize">(Press the single/login button for LAVA and Display card)</span>
                                                </div>
                                                <div>
                                                    <label className="tinput">Enter your code<label className="star">*</label></label>
                                                    <span><input {...handler()} onKeyPress={this.handleKeyPressnumber} maxLength={8}/>
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    )} />
                                    <div>
                                        <div className="tmplbrdrcls"></div>
                                        <div>
                                            <button className="ui blue button btnrightal" onClick={this.handletokenactivate}> Done</button>
                                        </div>
                                    </div>

                                </form>
                            )} />

                        </Segment>
                    </Grid.Column>
                </Grid>
            </div>
        )
    }
}

function mapStateToProps(state) {
    return {
        tokenactivationstatus:state.tokenactivationstatus
    }
}
function matchDispatchToProps(dispatch) {
    return bindActionCreators({
        posttokenactivation:posttokenactivation,
        setload:setload

    }, dispatch)
}
export default connect(mapStateToProps, matchDispatchToProps)(Tokenactivation)