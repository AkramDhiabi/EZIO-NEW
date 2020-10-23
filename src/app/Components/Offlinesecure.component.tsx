import * as React from 'react';
import { connect } from 'react-redux';
import { store } from '../Store/store';
import { Provider } from 'react-redux';
import { Link } from 'react-router-dom';
import { withRouter } from 'react-router-dom';
import { Accordion, Button, Container, Loader, Dimmer, Advertisement, Grid, Header,Input, Icon, Image, Item, Label, Menu, Segment, Step, Table, Form, Modal } from 'semantic-ui-react';
import { bindActionCreators } from 'redux';

const loginlogo = require('../../img/demologo.png');
const loginbackground = require('../../img/loginbackground.jpg');

import { FormBuilder, FieldControl, FieldGroup } from "react-reactive-form";
import { postuserotpAuthenticate,postForgetdetailsAction  } from "../Actions/action";
import { checklogin } from "../Actions/action";
import { seterrtype, setload } from "../Actions/action";

function demo(qrVersion) {
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
  s.innerHTML = "window.draw_qrcode(window.hexStringToString('"+hexData+"')," + qrVersion + ",'" + errorCorrectionLevel + "')";
  document
      .body
      .appendChild(s);
}

class Offlinesecure extends React.Component<any, any>{

  constructor(props) {
    super(props);
    this.state = {
      passwordfail: true,
      otpfail: true,
      showforgot:false,
      emailnotValid:false,
      displaymessage:'',
      sQRCodeVersionUsed:store.getState().tokenQRdata.data.tempObject.sQRCodeVersionUsed
    };

  }

  offsecurefrm = FormBuilder.group({
    password: "",
    securecode: ""

  });


  handleAuthenticate(e: React.MouseEvent<HTMLButtonElement>) {

    e.preventDefault();

    this.secureAuthentication();
 
  }

  secureAuthentication(){
    this.props.setload(true);
    const sendcredentials = {
      usrnme: store.getState().username,
      otp: this.offsecurefrm.value.securecode
    }

    const self = this;

    self.props.postuserotpAuthenticate(sendcredentials).then(function (response) {
      if (self.props.authenticateotpcheck.status === 200) {
        let authenticatecheckotpresponse = self.props.authenticateotpcheck;
        if (authenticatecheckotpresponse.data.responseCode === 200) {
          self.props.checklogin(true);
          self.props.setload(false);
          if(store.getState().usercheck.hasDevice === true)
          {
            self.props.history.push(`/layout/accountsummary`);
          }
          else{
            self.props.history.push(`/layout/MFA`);
          }
          console.log(self);
        }
        else if (authenticatecheckotpresponse.data.responseCode === 401) {
          self.setState({
            passwordfail: true,
            otpfail: false
          });
          self.props.seterrtype(self.state)
          self.props.setload(false);
        }
      }
    })

  }

  handleenterAuthenticate(e: React.KeyboardEvent<HTMLButtonElement>) {
    if (e.charCode == 13) {
      e.preventDefault();
      console.log("called")
      this.secureAuthentication();
    }
  }


  componentDidMount() {
    this.state = {
      username: null
    };

    store.subscribe(() => {
      this.setState({
        username: store.getState().username
      });
    });
  }

  handlecancel(e) {
    console.log(e.target);
    this.props.history.push(`/`);
  }

  print (e: React.MouseEvent<HTMLButtonElement>,typeval) {
        
    var elementId = typeval;
    var inputElement =(document.getElementById(elementId) as HTMLInputElement).type;

    if (inputElement === "password") {
        (document.getElementById(elementId) as HTMLInputElement).type = 'text';
    } else {
        (document.getElementById(elementId) as HTMLInputElement).type = 'password';
    }
  }
  //password

  handleloginNavigation(e) {
    e.preventDefault();
    this.setState({
      showforgot:false
  })
}
  forgetForm = FormBuilder.group({email: ""});
  handleForgotSubmit(e : React.MouseEvent < HTMLButtonElement >) {
      e.preventDefault();
      document
          .getElementById('forgotmain-success')
          .style
          .display = "none";
          this.setState({
              emailnotValid:false
          })
    
      this
          .props
          .setload(true);
      var sendparam = {emailAddress:this.forgetForm.value.email}
      var self = this;

      this
          .props
          .postForgetdetailsAction(sendparam)
          .then(function (response) {
              if (response !== undefined && response.data.responseCode === 200) {
                  self
                      .props
                      .setload(false);
                  document
                      .getElementById('forgotmain-sec')
                      .style
                      .display = "none";
                  document
                      .getElementById('forgotmain-success')
                      .style
                      .display = "block";
              } else {
                  self
                      .props
                      .setload(false);
                      if(response !== undefined && response.data.responseCode === 400)
                      {
                          self.setState({
                              emailnotValid:true,
                              displaymessage:'The Email address you entered does not match our records. Please try again.'
                          })
                      }
                      else{
                          self.setState({
                              emailnotValid:true,
                              displaymessage:'There is a server error. Please try again.'
                          })
                      }
              }
          })
  }
  handleForgotshow(e) {
      this.setState({showforgot: true})
  }

  
  showemail=() => this.setState({emailnotValid:true})
  closeemail=() => this.setState({emailnotValid:false})
  render() {
    return (
      <div>
        <span className="addfontsize">Use an OTP with your password to log on to Demo.</span>
        <div className="tmplbrdrcls addmargin"></div>
        <div id="lmsgreq">
                                <span>Required<label className="star">*</label></span>
                            </div>

<div className="secure_qrsec">
        <FieldGroup control={this.offsecurefrm} render={({ pristine, value }) => (
          <form onSubmit={() => this.handleAuthenticate}>
            <FieldControl name="password" render={({ handler }) => (

              <div className="input_block_sec">
                <div className="offpassformcls">
                  <div className="logonformelemcls">
                    <label className="pwdusr">Enter your password</label><br />
                    <span className="cmnfntsize">(Your password is case-sensitive)</span>
                  </div>
                  <div className="logon_in_sec">
                    <span><Input id="offlinepassword" className="custompinput" type='password' icon={<Icon name='eye' link onClick={e =>this.print(e,'offlinepassword')}/>} maxLength={40} {...handler()} onKeyPress={e => this.handleenterAuthenticate(e)} /></span><br />
                    <span onClick={(e) => this.handleForgotshow(e)}><a>Forgot your password? <span className="artag"></span> </a></span>
                  </div>
                </div>
                
              </div>


            )} />
            <FieldControl name="securecode" render={({ handler }) => (

              <div className="input_block_sec">
                <div className="offpassformcls">
                  <div className="logonformelemcls">
                    <label className="scdusr">Enter your OTP</label><label className="star">*</label><br />
                    <span className="cmnfntsize">(6-8 digits depending on your configuration)</span>
                  </div>
                  <div className="logon_in_sec">
                    <span><Input id="offlineotp" className="custompinput" type='password' icon={<Icon name='eye' link onClick={e =>this.print(e,'offlineotp')}/>} maxLength={8} {...handler()} onKeyPress={e => this.handleenterAuthenticate(e)} /></span><br />
                    
                  </div>
                </div>
                
              </div>
            )} />
          </form>
        )} />
          {store.getState().tokenQRdata.data.tempObject.sQRCodeData !== null &&
          <div className="qr_sec_block">
                    <span>Got a QR Token device? Scan it to log on!</span>
                    <div id="qrcodediv"  className="qrcls_sec"
                                  data-value={store.getState().tokenQRdata.data.tempObject.sQRCodeData}
                                  ref={() => {
                                  demo(this.state.sQRCodeVersionUsed)
                              }}></div>
                    <span id="logon_in_help"><a>Need any help?<span className="artag"></span> </a></span>

          </div>
          }
      </div>
      <div id="notifyline"></div>
        <div>
                  <button className="ui grey button" onClick={e => this.handlecancel(e)}> Cancel
                        </button>
                  <button className="ui blue button btnrightal" onClick={e => this.handleAuthenticate(e)}> Continue
                  </button>
                </div>

                                <Modal className="forgotmodal cmn-err-modal" size='mini' open={this.state.showforgot}>
                           <Modal.Content className="forgotmodal-content">
                              <div>
                                 <Grid.Row className="defaultrowclass">
                                    <Grid.Column>
                                       <Segment className="formhdr defaultsegclass">
                                          <img className="logoimage fg_logoimg" src={loginlogo} alt="Gemalto" />
                                       </Segment>
                                    </Grid.Column>
                                 </Grid.Row>
                                 <Grid.Row className="defaultrowclass">
                                    <Grid.Column className="forgot-align">
                                       <div id="forgotmain-success" className="forgot-align">
                                          <div>
                                             <Icon name='mail' size='big' />
                                             <h4 id="nw_mail_caption"><b>Check your mailbox!</b></h4>
                                             <p className="nw_success_mail">An email has been sent to {this.forgetForm.value.email} allowing you to retrieve your credentials.</p>
                                          </div>
                                       </div>
                                       <div id="forgotmain-sec">
                                          <h4  className="forgot-content-align">Forgot password?</h4>
                                          <span>If you have logged into Demo before and set up your email in your profile we can send your password</span>
                                          <FieldGroup
                                          control={this.forgetForm}
                                          render={({pristine, value}) => (
                                          <form className="forgot-content-align" onSubmit={() =>
                                             this.handleForgotSubmit}>
                                             <FieldControl
                                                name="email"
                                                render={({handler}) =>
                                             (
                                             <span><input id="fg-email-input" placeholder="Email" {...handler()}/>
                                             <button
                                                className="ui blue button btnsize continuebtn"
                                                disabled={pristine}
                                                onClick={e => this.handleForgotSubmit(e)}>
                                             Send
                                             </button>
                                             </span>
                                             )}/>
                                          </form>
                                          )}/>
                                       </div>
                                       <div className="forgot-content-align">
                                          <span onClick={(e) => this.handleloginNavigation(e)}>
                                          <a>Return to login <span className="artag"></span>
                                          </a>
                                          </span>
                                       </div>
                                       <Modal className="usrmodalmain cmn-err-modal" size='mini' open={this.state.emailnotValid}>
                                          <Modal.Header className="usrmodalhdr">
                                             Error
                                          </Modal.Header>
                                          <Modal.Content>
                                             <p>{this.state.displaymessage}</p>
                                          </Modal.Content>
                                          <Modal.Actions className="aligncent">
                                             <Button className="brdrcrct" id="my-button" negative onClick={this.closeemail}>
                                             Ok
                                             </Button>
                                          </Modal.Actions>
                                       </Modal>
                                    </Grid.Column>
                                 </Grid.Row>
                              </div>
                           </Modal.Content>
                        </Modal>
      </div>
    )
  }


}


function mapStateToProps(state) {
  return {
    authenticateotpcheck: state.authenticateotpcheck,
    passwordfail: state.passwordfail,
    otpfail: state.otpfail
  }
}
function matchDispatchToProps(dispatch) {
  return bindActionCreators({
    postuserotpAuthenticate: postuserotpAuthenticate,
    checklogin: checklogin,
    seterrtype: seterrtype,
    setload: setload,
    postForgetdetailsAction :postForgetdetailsAction 
  }, dispatch)
}

export default withRouter(connect(mapStateToProps, matchDispatchToProps)(Offlinesecure));
