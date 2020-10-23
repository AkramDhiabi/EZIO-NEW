import * as React from 'react';
import { connect } from 'react-redux';
import { store } from '../Store/store';
import { Provider } from 'react-redux';
import { Link } from 'react-router-dom';
import { Accordion, Button, Container, Grid, Header, Dimmer, Loader, Tab, Message, Icon, Image, Item, Label, Menu, Segment, Step, Table, Form } from 'semantic-ui-react';
import 'semantic-ui-css/semantic.min.css';
import Gemaltohdr from './Gemaltohdr.component';
import { bindActionCreators } from 'redux';
import { getaccountData, postMobileregistration, setload } from '../Actions/action';
const enroll1 = require('../../img/1_light.png');
const enroll2 = require('../../img/2_light.png');
const enroll3 = require('../../img/3_light.png');
const Mobileapplogo = require('../../img/mobilelogo.jpg');
const androidicon = require('../../img/badge_icon_android.png');
const iosicon = require('../../img/badge_icon_apple.png');


const mpanes = [
  {
    menuItem: 'By QR Code',
    render: () =>
      <Tab.Pane attached={false}>
        <div className="mactalign" id="qrcodediv" data-value={store.getState().mrQrdata} ref={() => { demo() }}>
          {/* <img src={qrcode} alt="Qrcode" /> */}

        </div>

        <div className="mractdesc">
          <div>You will need this QR code for step 2</div>
          <div className="mrbold">It will expire in 5 minutes</div>
          <Button className="mrbutton" size="mini">What does this mean?<span className="artag"></span></Button>
        </div>
        <div id="pintext">Make sure you remember your associated PIN code <span className="mrbold">{store.getState().mrpincode} </span> </div>
      </Tab.Pane>
  },
  {
    menuItem: 'Manual input', render: () =>
      <div>
        <Tab.Pane attached={false}>
          <div className="mactalign" ref={() => { demo1() }}>
            <div>Activation code</div>
            <div id="manualid">{store.getState().username} - {store.getState().mrregcode}</div>
          </div>
          <div className="mractdesc">
            <div>You will need this code for step 3</div>
            <div className="mrbold">It will expire in 5 minutes</div>
            <Button className="mrbutton" size="mini">What does this mean?<span className="artag"></span></Button>
          </div>
          <div id="pintext">Make sure you remember your associated PIN code <span className="mrbold">{store.getState().mrpincode} </span> </div>
        </Tab.Pane>

      </div>
  }

]


function demo1() {
  document.getElementById("mrmanual").style.display = "flex";
  document.getElementById("mrqr").style.display = "none";

}

function demo() {
  document.getElementById("mrqr").style.display = "flex";
  document.getElementById("mrmanual").style.display = "none";
  const hexData = document.getElementById('qrcodediv').dataset.value;
  const qrVersion = 9;
  const errorCorrectionLevel = 'L';
  const script2 = document.createElement("script");

  const s = document.createElement('script');
  s.type = 'text/javascript';
  s.async = true;
  s.innerHTML = "window.draw_qrcode('" + hexData + "'," + qrVersion + ",'" + errorCorrectionLevel + "')";
  document.body.appendChild(s);
}
class Mobileregistration extends React.Component<any, any>{

  constructor(props) {
    super(props);
    this.state = {
      username: store.getState().username,
      qrCodeData: null,
      showactivatetab: false,
      regcode: null,
      showregistererror: null
    };

  }

  componentWillMount() {

    this.props.setload(true);
    this.setState({
      username: store.getState().username,
      showactivatetab: false,
      showregistererror: null
    })

    // const script = document.createElement("script");

    // script.src = "https://use.typekit.net/foobar.js";
    // script.async = true;

    // document.body.appendChild(script);

    var sendcredentials = {
      usrnme: this.state.username
    }
    const self = this;

    this.props.postMobileregistration(sendcredentials).then(function (response) {
      if (response !== undefined && response.data.responseCode === 200) {

        self.setState({
          showactivatetab: true
        })
        self.setState({
          regcode: self.props.Mobileregistrationresponse.data.templateObject.regCode,
          qrCodeData: self.props.Mobileregistrationresponse.data.templateObject.qrCodeData
        })
        self.props.setload(false);
      }
      else {
        // self.props.setload(false);
        // self.setState({
        //   showactivatetab: false,
        //   showregistererror:'undefined'
        // })


        self.setState({
          showactivatetab: true
        })
        // self.setState({
        //   regcode: self.props.Mobileregistrationresponse.data.templateObject.regCode,
        //   qrCodeData: self.props.Mobileregistrationresponse.data.templateObject.qrCodeData
        // })
        self.props.setload(false);

      }
    })

  }

  componentDidMount() {
  }


  handlecontinuecomplete(e) {
    this.props.history.push(`/layout/accountsummary`);
  }

  handlegenerate(e) {

    this.componentWillMount();
  }

  handleTabchange(e) {


    // var hexData = this.props.Mobileregistrationresponse.data.templateObject.qrCodeData;
    // var qrVersion = 9;
    // var errorCorrectionLevel = 'L';
    // const script2 = document.createElement("script");

    // const s = document.createElement('script');
    // s.type = 'text/javascript';
    // s.async = true;
    // s.innerHTML = "window.draw_qrcode('"+hexData +"',"+ qrVersion +",'"+ errorCorrectionLevel+"')";
    // document.body.appendChild(s);

  }
  render() {
    return (
      <div className="container">
        <div className="row justify-content-center">


          <div className="mrscrdiv">
            <Grid centered className="scrmaindiv">
              <Grid.Column id="mrmaincolumn">
                <Segment className="hdrstylcss brdrmainclass" id="mrhdr">
                  <Gemaltohdr />
                </Segment>
                <Segment className="defaultuiseg" id="mrtitle">
                  <span>Mobile Registration</span>
                </Segment>
                {
                  this.state.showregistererror !== null && this.state.showregistererror === 'undefined' &&
                  <Message negative className="mrwarning">
                    <div className="lwarning"><Icon color="red" name='warning sign' /> </div>
                    <div id="lwarnmsg">
                      <Message.Header></Message.Header>
                      <p>Unexpected server error.Please try to generate a new code or contact the support.</p>
                    </div>
                  </Message>
                }


                {this.state.showactivatetab &&
                  <div>
                    <Segment className="defaultuiseg mrcontentmainalign">
                      <div id="mractivtitle">
                        <span>Activating your mobile device</span>
                      </div>
                      <div className="tmplbrdrcls"></div>
                      <div id="mractivedesc">
                        <span>Please ensure first you have the Ezio Mobile application installed on your device before starting the activation.</span>
                        <div id="mobile-act-iconholder">
                          <a href="https://play.google.com/store/apps/details?id=com.gemalto.ezio.central" target="_blank">
                            <img id="mobile-act-android" src={androidicon} alt="android" />
                          </a>
                          <a href="https://itunes.apple.com/us/app/ezio-mobile-token/id778497238?mt=8" target="_blank">
                            <img id="mobile-act-apple" src={iosicon} alt="ios" />
                          </a>
                        </div>
                      </div>

                      <div className="col-12">

                        <div className="tabmaindiv">
                          <div className="logsecfnt">Select registration method</div>
                          <Tab className="mtab" id="mrtab" menu={{ pointing: true }} panes={mpanes} onTabChange={this.handleTabchange.bind(this)} />
                        </div>
                      </div>

                      <div className="tmplbrdrcls"></div>
                      <div id="mractdemodesc">
                        <img id="mrmlogo" src={Mobileapplogo} alt="Mobileapplogo" />
                        <span>Launch your Ezio Mobile app on you device.</span>
                      </div>
                    </Segment>
                    <Segment id="mrmanual" className="minstruct">
                      <div className="minstrimg">
                        <img src={enroll1} alt="Gemalto" />
                        <div className="mractstep">
                          <span className="mrstepno">1</span><br />
                          <span>Select <label className="scdusr">Manual input</label></span>
                        </div>

                      </div>
                      <div className="minstrimg">
                        <img src={enroll2} alt="Gemalto" />
                        <div className="mractstep">
                          <span className="mrstepno">2</span><br />
                          <span>Enter your username and activation code:<br /><label className="scdusr">{store.getState().username} - {store.getState().mrregcode}</label></span>
                        </div>
                      </div>
                      <div className="minstrimg">
                        <img src={enroll3} alt="Gemalto" />
                        <div className="mractstep">
                          <span className="mrstepno">3</span><br />
                          <span>Set your <label className="scdusr">biometrics</label> (optional) <br />to complete activation</span>
                        </div>
                      </div>
                    </Segment>
                    <Segment id="mrqr" className="minstruct">
                      <div className="minstrimg">
                        <img src={enroll1} alt="Gemalto" />
                        <div className="mractstep">
                          <span className="mrstepno">1</span><br />
                          <span>Select <label className="scdusr">BY QR code</label></span>
                        </div>

                      </div>
                      <div className="minstrimg">
                        <img src={enroll2} alt="Gemalto" />
                        <div className="mractstep">
                          <span className="mrstepno">2</span><br />
                          <span>Scan the above QR Code</span>
                        </div>
                      </div>
                      <div className="minstrimg">
                        <img src={enroll3} alt="Gemalto" />
                        <div className="mractstep">
                          <span className="mrstepno">3</span><br />
                          <span>Set your <label className="scdusr">biometrics</label> (optional) <br />to complete activation</span>
                        </div>
                      </div>
                    </Segment>
                  </div>
                }

                <Segment className="defaultuiseg mrcontentmainalign">
                  <div className="tmplbrdrcls"></div>
                  <div className="mrsubmit">
                    <button className="ui grey button" onClick={this.handlecontinuecomplete.bind(this)}> Cancel</button>
                    <button id="mrcompleted" className="ui blue button btnrightal" onClick={this.handlecontinuecomplete.bind(this)}> Completed</button>
                    <button className="ui blue button btnrightal" onClick={this.handlegenerate.bind(this)}> Generate new code</button>
                  </div>
                </Segment>
                <Segment className="bottomseg mrbottomseg">
                  <div id="logoncsecbottom">
                    <span>
                      <a href="https://www.thalesgroup.com/en/markets/digital-identity-and-security/banking-payment">THALESGROUP.COM</a>
                    </span>
                  </div>
                </Segment>
              </Grid.Column>
            </Grid>
          </div>


        </div>
      </div>
    )
  }
}

function mapStateToProps(state) {
  return {
    Mobileregistrationresponse: state.Mobileregistrationresponse,
    username: state.username,
    mrpincode: state.mrpincode,
    mrregcode: state.mrregcode,
    mrQrdata: state.mrQrdata
  }
}
function matchDispatchToProps(dispatch) {
  return bindActionCreators({
    postMobileregistration: postMobileregistration,
    setload: setload

  }, dispatch)
}

let myClassObj = new Mobileregistration({});



export default connect(mapStateToProps, matchDispatchToProps)(Mobileregistration);
