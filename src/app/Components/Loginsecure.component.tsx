import * as React from 'react';
import { connect } from 'react-redux';
import { store } from '../Store/store';
import { Provider } from 'react-redux';
import { Link } from 'react-router-dom';
import { Accordion, Button, Container, Grid, Message, Header, Icon, Image, Item, Label, Loader, Dimmer, Menu, Segment, Step, Table, Form } from 'semantic-ui-react';
import { bindActionCreators } from 'redux';
import { Tab } from 'semantic-ui-react';
import Gemaltohdr from './Gemaltohdr.component';
import Offlineauth from './Offlineauth.component';
import Offlinesecure from './Offlinesecure.component';
import Sendnotification from "./Sendnotification.component";
import { setusername, setload, setsnerrtype, seterrtype, posteziologoutaction,checklogin } from "../Actions/action";


import 'semantic-ui-css/semantic.min.css';


const initialpanes = [
  {
    menuItem: 'Password', render: () =>
      <Tab.Pane attached={false}>
        <Offlineauth />
      </Tab.Pane>
  },
  {
    menuItem: 'OTP', render: () =>
      <Tab.Pane attached={false}>
        <Offlinesecure />
      </Tab.Pane>
  },
  {
    menuItem: 'Mobile notification',
    render: () =>
      <Tab.Pane attached={false}>
        <Sendnotification />
      </Tab.Pane>
  }
]

const modifiedpanes = [
  {
    menuItem: 'Password', render: () =>
      <Tab.Pane attached={false}>
        <Offlineauth />
      </Tab.Pane>
  },
  {
    menuItem: 'OTP', render: () =>
      <Tab.Pane attached={false}>
        <Offlinesecure />
      </Tab.Pane>
  }
]


let finalpane;
let panval;

class Loginsecure extends React.Component<any, any>{
  constructor(props) {
    super(props);

    this.handleSwitchuser = this.handleSwitchuser.bind(this);
    this.state = {
      passwordfail: true,
      otpfail: true,
      snpending: true,
      sninvotp: true,
      sninvhashdata: true,
      snrejected: true,
      sntimeout: true,
      snnotifynotsent: true,
      username: store.getState().username

    };

  
    if (store.getState().userrescode === 2) {
      finalpane = modifiedpanes;
    }
    else {
      finalpane = initialpanes;
    }
  }
  componentDidMount() {
    store.subscribe(() => {
      // When state will be updated(in our case, when items will be fetched), 
      // we will update local component state and force component to rerender 
      // with new data.

      this.setState({
        passwordfail: store.getState().passwordfail,
        otpfail: store.getState().otpfail,
        snpending: store.getState().snpending,
        sninvotp: store.getState().sninvotp,
        sninvhashdata: store.getState().sninvhashdata,
        snrejected: store.getState().snrejected,
        sntimeout: store.getState().sntimeout,
        snnotifynotsent: store.getState().snnotifynotsent
      });



    });



    // setTimeout(() => this.setState({ loading: false }), 1500); // simulates an async action, and hides the spinner

  }

  handleSwitchuser(e) {
    const self = this;
    const sendcredentials = {
      usrnme: self.state.username
    }

    const defaulsnerrcode = {
      snpending: true,
      sninvotp: true,
      sninvhashdata: true,
      snrejected: true,
      sntimeout: true,
      snnotifynotsent: true
    }
    const defaultautherrcode = {
      passwordfail: true,
      otpfail: true
    }
    const loginresetparam = {
      paramusrname: '',
      paramusrrescode: null
      //  paramusrrescode:2
    }

    self.props.posteziologoutaction(sendcredentials).then(function(response){
      if(response.data.responseCode === 200)
      {
        
        self.props.seterrtype(defaultautherrcode);
        self.props.setsnerrtype(defaulsnerrcode);
       
        self.props.setusername(loginresetparam);
        self.props.checklogin(false);
        self.props.history.push(`/`);
      }
      else{
        console.log("error in logout")
      }

    })
  
    
  }

  handleTabchange(e) {
    const defaulsnerrcode = {
      snpending: true,
      sninvotp: true,
      sninvhashdata: true,
      snrejected: true,
      sntimeout: true,
      snnotifynotsent: true
    }
    const defaultautherrcode = {
      passwordfail: true,
      otpfail: true
    }
    this.props.seterrtype(defaultautherrcode);
    this.props.setsnerrtype(defaulsnerrcode);
  }
  render() {
    return (

      <div className="logonscrdiv">
        <Grid centered className="scrmaindiv">
          <Grid.Column>
            <Segment className="hdrstylcss brdrmainclass">
              <Gemaltohdr />
            </Segment>
            <Segment id="logonmsgclass">


              <Message negative className="logonwarning" hidden={this.state.passwordfail}>
                <div className="lwarning"><Icon color="red" name='warning sign' /> </div>
                <div id="lwarnmsg">
                  <Message.Header></Message.Header>
                  <p>Invalid password. Please try again.  </p>
                </div>
              </Message>

              <Message negative className="logonwarning" hidden={this.state.otpfail}>
                <div className="lwarning"><Icon color="red" name='warning sign' /> </div>
                <div id="lwarnmsg">
                  <Message.Header></Message.Header>
                  <p>Invalid password and/or OTP. Please try again. </p>
                </div>
              </Message>

              <Message negative className="logonwarning" hidden={this.state.snpending}>
                <div className="lwarning"><Icon color="red" name='warning sign' /> </div>
                <div id="lwarnmsg">
                  <Message.Header></Message.Header>
                  <p>Looks like you have already a pending transaction. Please check your mobile first.</p>
                </div>
              </Message>

              <Message negative className="logonwarning" hidden={this.state.snnotifynotsent}>
                <div className="lwarning"><Icon color="red" name='warning sign' /> </div>
                <div id="lwarnmsg">
                  <Message.Header></Message.Header>
                  <p>Notification not sent, please try again later..</p>
                </div>
              </Message>

              <Message negative className="logonwarning" hidden={this.state.sninvotp}>
                <div className="lwarning"><Icon color="red" name='warning sign' /> </div>
                <div id="lwarnmsg">
                  <Message.Header></Message.Header>
                  <p>Login request rejected. Make sure you entered the correct PIN code.</p>
                </div>
              </Message>
              <Message negative className="logonwarning" hidden={this.state.sninvhashdata || this.state.snrejected}>
                <div className="lwarning"><Icon color="red" name='warning sign' /> </div>
                <div id="lwarnmsg">
                  <Message.Header></Message.Header>
                  <p>Login request rejected. Please read our instructions in case of issues.</p>
                </div>
              </Message>
              <Message negative className="logonwarning" hidden={this.state.sntimeout}>
                <div className="lwarning"><Icon color="red" name='warning sign' /> </div>
                <div id="lwarnmsg">
                  <Message.Header></Message.Header>
                  <p>Sorry, your login request has timed out. Please try again.</p>
                </div>
              </Message>
              <Grid columns={2} stackable>
                <Grid.Column width={12}>
                  <Segment className="divstylcss">
                    <span id="logininfo">You are logging on as: {this.state.username}</span>
                  </Segment>
                </Grid.Column>
                <Grid.Column width={4}>
                  <Segment className="divstylcss">
                    <div className="forgotsec">
                      <span className="swttxt"><a href='javascript:void(0)' onClick={this.handleSwitchuser}>Switch User <span className="artag"></span> </a></span>
                    </div>
                  </Segment>
                </Grid.Column>
              </Grid>
            </Segment>
            <Segment className="logoncontentdiv">
              <div className="tabmaindiv">
                <div className="logsecfnt">Select log on method</div>
                <Tab id="maintabpass" menu={{ pointing: true }} panes={finalpane} onTabChange={this.handleTabchange.bind(this)} />
              </div>
            </Segment>
            <Segment className="bottomseg">
              <div id="logoncsecbottom">
                <span>
                  <a href="https://www.thalesgroup.com/en/markets/digital-identity-and-security/banking-payment">THALESGROUP.COM</a>
                </span>
              </div>
            </Segment>
          </Grid.Column>
        </Grid>
      </div>
    )
  }
}


function mapStateToProps(state) {
  return {
    passwordfail: state.passwordfail,
    otpfail: state.otpfail,
    userrescode: state.userrescode,
    snpending: state.snpending,
    sninvotp: state.sninvotp,
    sninvhashdata: state.sninvhashdata,
    snrejected: state.snrejected,
    sntimeout: state.sntimeout,
    snnotifynotsent: state.snnotifynotsent,
    username: state.username
  }
}
function matchDispatchToProps(dispatch) {
  return bindActionCreators({
    setusername: setusername,
    setload: setload,
    setsnerrtype: setsnerrtype,
    seterrtype: seterrtype,
    posteziologoutaction: posteziologoutaction,
    checklogin:checklogin
  }, dispatch)
}

export default connect(mapStateToProps, matchDispatchToProps)(Loginsecure)
