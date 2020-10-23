import * as React from 'react';
import { Component } from 'react'
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { store } from '../Store/store';
import { getaccountData, posteziologoutaction, setusername, checklogin,posttokenresync,setload } from '../Actions/action';
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

class Tokenresynchronisation extends React.Component<any,any> {

    constructor(props) {
        super(props);
        this.handletokensync = this.handletokensync.bind(this);
        this.state ={
            successmessage:false,
            errormessage:false,
            failmessage:false,
            displaymessage:'',
            username:store.getState().username
        }
    }

    tokenresyncform = FormBuilder.group({
        serialno: "",
        totp0: "",
        totp1:""
    });

    errormessages = [
        {
          "type": "BAD_FORMAT",
          "header": "Resynchronization failed!",
          "message": "Make sure you entered the correct serial number."
        },
        {
          "type": "TOKEN_NOT_FOUND",
          "header":  "Resynchronization failed!",
          "message": "The serial number you entered does not match our records. Make sure to provision it first."
        },
        {
          "type": "TOKEN_ALREADY_ASSOCIATED",
          "header":  "Resynchronization failed!",
          "message": "The serial number you entered is already used by another user.Please contact the support."
        },
        {
          "type": "GENERAL_ERROR",
          "header":  "Resynchronization failed!",
          "message": "Server error.Please try again."
        },
        {
          "type": "TOKEN_BLOCKED_OR_REVOKED",
          "header":  "Resynchronization failed!",
          "message": "Token revoked by the bank.Please contact the support."
        }
      ]
 
    componentWillMount() {

    }
    handleKeyPressnumber = (event) => {
        var charCode = event.charCode;
        //Non-numeric character range
        if (charCode > 31 && (charCode < 48 || charCode > 57)){
        event.preventDefault();
        }
        if(charCode === 13) {
            this.handletokensync(event);
        }
    }

    handleTokenserialEnter= (event) => {
        var charCode = event.charCode;
        if(charCode === 13) {
            this.handletokensync(event);
        }
    }
    handletokensync(e) {

        e.preventDefault();

        if(this.tokenresyncform.value.serialno !==""  &&  this.tokenresyncform.value.serialno.substring(0, 4) === 'GAQT' ||
            this.tokenresyncform.value.serialno !=="" &&  this.tokenresyncform.value.totp0 !== "" && this.tokenresyncform.value.totp1 !== "" && this.tokenresyncform.value.totp0.length == 6 ||this.tokenresyncform.value.totp0.length == 8 && this.tokenresyncform.value.totp1.length == 6 ||this.tokenresyncform.value.totp1.length == 8)
        {
                this.props.setload(true);
            this.setState(
            {
                    successmessage:false,
                    errormessage:false,
                    displaymessage:''
                }
            )
            const sendtokendetail = {
                    otpValue1: this.tokenresyncform.value.totp0,
                    otpValue2: this.tokenresyncform.value.totp1,
                    tokenSerialNumber:this.tokenresyncform.value.serialno,
                    userId: this.state.username
            }
          
            const self = this;

            self.props.posttokenresync(sendtokendetail).then(function (response) {
              
                if(response !== undefined && response.data.responseCode === 200){
                    console.log("all ok")
                    self.tokenresyncform.reset();
                    if(response.data.message === "TOKEN_RESYNCHRONIZATION_DONE")
                    {
                        self.setState({
                            successmessage:true
                        })
                    }
                    else if(response.data.message === "TOKEN_RESYNCHRONIZATION_FAILED")
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
                    self.tokenresyncform.reset();
     
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
        else if(this.tokenresyncform.value.serialno =="" ||  this.tokenresyncform.value.totp0 == "" ||  this.tokenresyncform.value.totp1 == ""){
            ToastDanger('Error. (*) fields are required');
        }  
        else if(this.tokenresyncform.value.totp1.length !== 6 ||this.tokenresyncform.value.totp0.length !== 8 || this.tokenresyncform.value.totp1.length !== 6 ||this.tokenresyncform.value.totp1.length !== 8){
            ToastDanger('Error. Secure codes can be either 6 or 8 digits');
        }

    }

    handleclickontokenprocess(){
        var elements = document.getElementsByTagName('a');
        for (var i = 0; i < elements.length; i++) {
          if (elements[i].innerHTML === 'Activation') {
            elements[i].click();
          }
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
                                    <Message.Header>Resynchronization failed!</Message.Header>
                                    <p>Your token must be activated first. It can be done <span id="here" onClick={this.handleclickontokenprocess}>here.</span></p>
                                    </div>
                                </Message>
                                }

                                 {this.state.successmessage === true &&
                                <Message positive>
                                    <div className="tsuccess"><Icon id="tick" name='checkmark' /> </div>
                                    <div>
                                        <Message.Header>Resynchronization done!</Message.Header>
                                        <p>Yyour token GA… has been successfully resynchronized.</p>
                                    </div>
                                </Message>
                                }
                                {this.state.errormessage === true &&
                                <Message negative>
                                        <div className="twarning"><Icon color="red" name='warning sign'/> </div>
                                        <div>
                                        <Message.Header>Resynchronization failed!</Message.Header>
                                        <p>{this.state.displaymessage}</p>
                                        </div>
                                </Message>
                                }
                            </div>
                            <span className="addfontsize">Resynchronize one of your token.</span>
                            <div className="tmplbrdrcls addmargin"></div>
                            <div id="tmsgreq">
                                <span><label className="star">*</label>Required</span>
                            </div>
                            <FieldGroup control={this.tokenresyncform} render={({ pristine, value }) => (
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

                                    <FieldControl name="totp0" render={({ handler }) => (
                                        <div>
                                            <div id="tpcctxt">
                                                <div className="tokenfrmttl">2. Generate two consecutive security codes</div>
                                            </div>
                                            <div id="ttotp">
                                                <div className="">With your token turned on, press the <img className="tkeyimg" src={tokenkey} alt="tokendevice" /> key.It will generate your first security code.<br />
                                                    <span className="cmnfntsize">(Press the single/login button for LAVA and Display card)</span>
                                                </div>
                                                <div>
                                                    <label className="tinput">Enter your code<label className="star">*</label></label>
                                                    <span><input {...handler()} onKeyPress={this.handleKeyPressnumber}  maxLength={8} />
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    )} />
                                    <FieldControl name="totp1" render={({ handler }) => (
                                        <div>
                                            <div id="ttotp">
                                                <div className="">Then generate a second security code and click the resynchronise button.
                                                </div>
                                                <div>
                                                    <label className="tinput">Enter your code<label className="star">*</label></label>
                                                    <span><input {...handler()} onKeyPress={this.handleKeyPressnumber} maxLength={8} />
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    )} />
                                    <div>
                                        <div className="tmplbrdrcls"></div>
                                        <div>
                                            <button className="ui bluebutton btnrightal" onClick={this.handletokensync}> Done</button>
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
        tokenresyncstatus:state.tokenresyncstatus
    }
}
function matchDispatchToProps(dispatch) {
    return bindActionCreators({
        posttokenresync:posttokenresync,
        setload:setload
    }, dispatch)
}
export default connect(mapStateToProps, matchDispatchToProps)(Tokenresynchronisation)