import * as React from 'react';
import { connect } from 'react-redux';
import { store } from '../Store/store';
import { Provider } from 'react-redux';
import { Link } from 'react-router-dom';
import { withRouter } from 'react-router-dom';
import { Accordion, Button, Container, Loader, Dimmer, Advertisement, Grid, Header, Icon, Image, Item, Label, Menu, Segment, Step, Table, Form, Modal } from 'semantic-ui-react';
import { bindActionCreators } from 'redux';

const loginlogo = require('../../img/demologo.png');
const loginbackground = require('../../img/loginbackground.jpg');

import { FormBuilder, FieldControl, FieldGroup } from "react-reactive-form";
import * as ReactCountdownClock from "react-countdown-clock";
import { postAuthenticate, checklogin, postusercheckpendingstatus, postusersendnotificationstatus, postusersgetcallbackstatus,postuserdeletecallbackdataaction, setsnerrtype, postusersdeletependingtransactionstatus, setload } from "../Actions/action";

import {ToastDanger} from 'react-toastr-basic';

class Sendnotification extends React.Component<any, any>{

    constructor(props) {
        super(props);

        this.state = {
            username: null,
            open: false,
            showmessage: false,
            snpending: true,
            sninvotp: true,
            sninvhashdata: true,
            snrejected: true,
            sntimeout: true,
            snnotifynotsent: true
        }

        this.notifyclose = this.notifyclose.bind(this);
        this.closeoncomplete = this.closeoncomplete.bind(this);

    }

    componentDidMount() {
        this.setState({
            username: store.getState().username
        });

        store.subscribe(() => {
            // When state will be updated(in our case, when items will be fetched), 
            // we will update local component state and force component to rerender 
            // with new data.

            this.setState({
                username: store.getState().username
            });
        });
    }
    show = () => this.setState({ open: true })
    close = () => this.setState({ open: false })

    closeoncomplete(){
        try {     window.stop(); } catch (exception) {     document.execCommand('Stop'); };
        this.close();
        const sendtransdetails = {
            usrnme: this.state.username
        } 
        this.props.setload(false);
        this.props.postuserdeletecallbackdataaction(sendtransdetails).then(function(response){
            console.log(response);         
        });
        this.setState({ sntimeout: false });
        this.props.setsnerrtype(this.state)
    }
    
    notifyclose(){
        try {     window.stop(); } catch (exception) {     document.execCommand('Stop'); };
        this.close();
        const sendtransdetails = {
            usrnme: this.state.username
        } 
        this.props.setload(false);
        this.props.postuserdeletecallbackdataaction(sendtransdetails).then(function(response){
            console.log(response);         
        });
    }

    loginanotherway(e: React.MouseEvent<HTMLButtonElement>) {
        console.log("In loginanotherway");

        const sendtransdetails = {
            usrnme: this.state.username,
            msgId:this.props.sendnotificationresponse.data.templateObject
        } 
        this.notifyclose();
        const selfval = this;
        this.props.postusersdeletependingtransactionstatus(sendtransdetails).then(function (response) {
            console.log(selfval.props.deletependingtransactionresponse)
        })
    }


    handleFinish(e: React.MouseEvent<HTMLButtonElement>) {
        
        const self = this;
        const defaulsnerrcode = {
            snpending: true,
            sninvotp: true,
            sninvhashdata: true,
            snrejected: true,
            sntimeout: true,
            snnotifynotsent: true
          }
        self.props.setsnerrtype(defaulsnerrcode);
        self.props.setload(true)
        console.log("send notification clicked");
        const sendcredentials = {
            usrnme: self.state.username
        }

        self.props.postusercheckpendingstatus(sendcredentials).then(function (response) {

            //checkpendingtransactionresponse

            if(response !== undefined)
            {
                
                if (self.props.checkpendingtransactionresponse.data.responseCode === 1) {
                    console.log("Looks like you have a pending transaction. Check your mobile first. ");
                    self.setState({ snpending: false });
                    self.props.setsnerrtype(self.state)
                    self.props.setload(false)
    
                }
                else {
                    self.props.postusersendnotificationstatus(sendcredentials).then(function (response) {

                        if(response !== undefined)
                        {
                            if (self.props.sendnotificationresponse.data.responseCode === 200) {
    
                                let sendnotifyresponse = self.props.sendnotificationresponse;
                                const sendcallbackdetails = {
                                    usrnme: self.state.username,
                                    msgId: sendnotifyresponse.data.templateObject
        
                                }
                                self.show();
                               
                                self.props.postusersgetcallbackstatus(sendcallbackdetails).then(function (response) {

                                    if(response !== undefined)
                                    {

                                        if (self.props.getcallbackresponse.data.responseCode === 200) {
                                            let getcallbackresponsedata = self.props.getcallbackresponse.data.templateObject;
                                            if (getcallbackresponsedata.responseCode === 200) {
                                                self.props.checklogin(true);
                                                const sendtransdetails = {
                                                    usrnme: self.state.username
                                                } 
                                                self.props.postuserdeletecallbackdataaction(sendtransdetails).then(function(response){
                                                    console.log(response);         
                                                });
                                                self.props.setload(false)
                                                if(store.getState().usercheck.hasDevice === true)
                                                {
                                                    self.props.history.push(`/layout/accountsummary`);
                                                }
                                                else{
                                                    self.props.history.push(`/layout/MFA`);
                                                }
                                                console.log(self);
                                            }
                                            else {
                                                console.log(getcallbackresponsedata.responseCode, getcallbackresponsedata.callBackResult)
                                               
                                                if (getcallbackresponsedata.callBackResult === 'INVALID_OTP') {
                                                    self.setState({ sninvotp: false });
                                                }
                                                else if (getcallbackresponsedata.callBackResult === 'INVALID_HASHED_DATA') {
                                                    self.setState({ sninvhashdata: false });
                                                }
                                                else if (getcallbackresponsedata.callBackResult === 'TRANSACTION_REJECTED') {
                                                    self.setState({ snrejected: false });
                                                }
                                                self.props.setsnerrtype(self.state)
                                                self.notifyclose();
                                                self.props.setload(false)
                                            }
                                        }

                                        else{

                                            self.close();
                                            const sendtransdetails = {
                                                usrnme: self.state.username
                                            } 
                                            self.props.setload(false);
                                            self.props.postuserdeletecallbackdataaction(sendtransdetails).then(function(response){
                                                console.log(response);         
                                            });
                                            
                                            self.setState({ sntimeout: false });
                                            self.props.setsnerrtype(self.state)

                                        }

                                    }
                                    else{
                                        self.props.setload(false);
                                        console.log("there is a server error");
                                    }                      
                                });

                            
                            }
                            else {
                                console.log("Notification not sent error");
                                self.setState({ snnotifynotsent: false });
                                self.props.setsnerrtype(self.state);
                                self.props.setload(false)
                            }
                      

                        }
                        else{
                            self.props.setload(false);
                            console.log("there is a server error")
                            ToastDanger('Something Went Wrong');
                        }

          
                    });
                }
            }
            else{
                self.props.setload(false);
                console.log("there is a server error");
                ToastDanger('Something Went Wrong');
            }
            
       })
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
                    <span className="addfontsize">Use your mobile device to log on to Demo.</span><br />
                    <div className="tmplbrdrcls addmargin"></div>
                    <span><Button className="snbutton" size="mini" name="snntify" onClick={(e) => this.handleFinish(e)}>Send me a notification now<span className="artag"></span></Button></span><br />
 
                </div>
                <div id="notifyline"></div>
                <div>
                    <button className="ui grey button"> Cancel
</button>
                    <button className="ui blue button btnrightal"> Continue
</button>
                </div>

                <Modal className="usrmodalmain cmn-sn-modal" size='mini' open={this.state.open}>
                    <Modal.Header className="snmodelhdr">
                        <div id="snheader">
                            <img className="logoimage" src={loginlogo} alt="Gemalto" />
                        </div>
                    </Modal.Header>
                    <Modal.Content>

                        <div>
                            <Grid.Row className="defaultrowclass">
                                <Grid.Column>

                                    <Segment className="snsegclass">
                                        <div id="snmaindiv">
                                            <div id="snusername"><span id="logininfo"><Icon id="user" name='user' />{this.handlenamemask(store.getState().username)}</span></div>
                                            <div id="sncondiv"><span id="snapprove">Approve Sign-in request</span><br />
                                                <span><Icon id="lock" name='lock' />We have sent a notification to your mobile.Please respond to continue.</span>
                                            </div>
                                            <div id="sncountdown">
                                                <ReactCountdownClock seconds={60}
                                                    color="#8982ec"
                                                    alpha={0.9}
                                                    size={50}
                                                    onComplete={this.closeoncomplete} />
                                            </div>
                                        </div>


                                        <div className="forgotsec crctlogin">
                                            <div id="alingb"><button className="snbutton">Having trouble? <span className="artag"></span> </button></div>
                                            <div id="alingb"><button className="snbutton" onClick={(e) => this.loginanotherway(e)}>Log-in another way? <span className="artag"></span> </button></div>
                                        </div>
                                    </Segment>
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
        usercheck: state.usercheck,
        checkpendingtransactionresponse: state.checkpendingtransactionresponse,
        sendnotificationresponse: state.sendnotificationresponse,
        getcallbackresponse: state.getcallbackresponse,
        snpending: state.snpending,
        sninvotp: state.sninvotp,
        sninvhashdata: state.sninvhashdata,
        snrejected: state.snrejected,
        sntimeout: state.sntimeout,
        snnotifynotsent: state.snnotifynotsent
    }
}
function matchDispatchToProps(dispatch) {
    return bindActionCreators({
        postAuthenticate: postAuthenticate,
        checklogin: checklogin,
        postusercheckpendingstatus: postusercheckpendingstatus,
        postusersendnotificationstatus: postusersendnotificationstatus,
        postusersgetcallbackstatus: postusersgetcallbackstatus,
        setsnerrtype: setsnerrtype,
        postusersdeletependingtransactionstatus: postusersdeletependingtransactionstatus,
        setload: setload,
        postuserdeletecallbackdataaction:postuserdeletecallbackdataaction
    }, dispatch)
}


// export default connect(mapStateToProps, matchDispatchToProps)(Sendnotification)
export default withRouter(connect(mapStateToProps, matchDispatchToProps)(Sendnotification));

