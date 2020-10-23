import * as React from 'react';
import { connect } from 'react-redux';
import { store } from '../Store/store';
import { Provider } from 'react-redux';
import { Link } from 'react-router-dom';
import {
    Accordion,
    Button,
    Container,
    Loader,
    Dimmer,
    Advertisement,
    Grid,
    Header,
    Input,
    Icon,
    Image,
    Item,
    Label,
    Menu,
    Segment,
    Step,
    Table,
    Form,
    Modal
} from 'semantic-ui-react';
import 'semantic-ui-css/semantic.min.css';
import { FormBuilder, FieldControl, FieldGroup } from "react-reactive-form";
import { bindActionCreators } from 'redux';
import { postcheckUsername } from '../Actions/action';
import { postAuthenticate } from '../Actions/action';
import { checklogin } from '../Actions/action';
import { setusername, setload, setlogon, postForgetdetailsAction } from "../Actions/action";
const loginlogo = require('../../img/demologo.png');
const loginbackground = require('../../img/loginbackground.jpg');

class Login extends React.Component<any,
    any> {

    constructor(props) {
        super(props)

        this.state = {

            open: false,
            showmessage: false,
            showpassworderror: false,
            showforgot: false,
            emailnotValid: false,
            forgetType: '',
            displaymessage: ''
        }
    }

    show() {
        this.setState({ open: true })
        const pbutton = (document.querySelector('#my-button') as HTMLInputElement)
        if (pbutton) {
            pbutton.focus()
        }
    }

    close = () => this.setState({ open: false })

    showpass = () => this.setState({ showpassworderror: true })
    closepass = () => this.setState({ showpassworderror: false })

    showemail = () => this.setState({ emailnotValid: true })
    closeemail = () => this.setState({ emailnotValid: false })

    usrform = FormBuilder.group({
        username: ""
    });
    passform = FormBuilder.group({
        password: ""
    });
    handleSubmit(e: React.MouseEvent<HTMLButtonElement>) {
        this
            .props
            .setload(true);
        e.preventDefault();

        //alert(`You submitted \n ${JSON.stringify(this.usrform.value, null, 2)}`);
        const self = this;

        this.setState({ username: this.usrform.value.username });

        this
            .props
            .postcheckUsername(this.usrform.value.username)
            .then(function (response) {

                const loginparam = {
                    paramusrname: self.usrform.value.username,
                    paramusrrescode: self.props.usercheck.data.responseCode
                    //  paramusrrescode:2
                }
                self
                    .props
                    .setusername(loginparam);
                //self.props.history.push(`/loginsecure`);
                if (self.props.usercheck.status === 200) {
                    //setTimeout(() => self.setState({ loading: false }), 1500);
                    self
                        .props
                        .setload(false);
                    let checkuserresponse = self.props.usercheck;
                    if (checkuserresponse.data.responseCode === 0) {
                        self.show();
                    } else if (checkuserresponse.data.responseCode === 1) {
                        self.setState({ showpassword: true });
                    } else if (checkuserresponse.data.responseCode === 2) {
                        self
                            .props
                            .setlogon(true);
                        self
                            .props
                            .history
                            .push(`/loginsecure`);
                    } else if (checkuserresponse.data.responseCode === 3) {
                        self
                            .props
                            .setlogon(true);
                        self
                            .props
                            .history
                            .push(`/loginsecure`);

                    }
                } else {
                    // setTimeout(() => self.setState({ loading: false }), 1500);
                    self
                        .props
                        .setload(false);
                }

            })
    }


    handleAuthenticate(e: React.MouseEvent<HTMLButtonElement>) {

        e.preventDefault();
        // setTimeout(() => self.setState({ loading: true }), 1500);
        this
            .props
            .setload(true);
        const sendcredentials = {
            usrnme: this.state.username,
            pswrd: this.passform.value.password
        }

        const self = this;

        this
            .props
            .postAuthenticate(sendcredentials)
            .then(function (response) {

                if (self.props.authenticatecheck.status === 200) {
                    let authenticatecheckresponse = self.props.authenticatecheck;
                    if (authenticatecheckresponse.data.responseCode === 200) {
                        // setTimeout(() => self.setState({ loading: false }), 1500);
                        self
                            .props
                            .setload(false);
                        self
                            .props
                            .checklogin(true);
                        if (store.getState().usercheck.hasDevice === true) {
                            self
                                .props
                                .history
                                .push(`/layout/accountsummary`);
                        } else {
                            self
                                .props
                                .history
                                .push(`/layout/MFA`);
                        }

                    } else if (authenticatecheckresponse.data.responseCode === 401) {
                        // setTimeout(() => self.setState({ loading: false }), 1500);
                        self
                            .props
                            .setload(false);
                        self.showpass();
                    }
                }
            })
            .catch(function (error) {
                console.log(error);
            });
    }

    handleSwitchuser(e) {
        this
            .props
            .setload(true);

        const loginresetparam = {
            paramusrname: '',
            paramusrrescode: null
        }
        this
            .props
            .setusername(loginresetparam);
        this.setState({ showpassword: false });
        this
            .usrform
            .reset();
        this
            .props
            .setload(false);

    }

    handleReset() {
        this
            .usrform
            .reset();
    }

    print() {

        var elementId = "lpassword";
        var inputElement = (document.getElementById(elementId) as HTMLInputElement).type;

        if (inputElement === "password") {
            (document.getElementById(elementId) as HTMLInputElement).type = 'text';
        } else {
            (document.getElementById(elementId) as HTMLInputElement).type = 'password';
        }
    }
    componentDidMount() {

    }

    handlenewuserNavigation(e) {
        e.preventDefault();
        this
            .props
            .history
            .push('/newregistration');
    }

    handleloginNavigation(e) {
        e.preventDefault();
        this.setState({
            showforgot: false
        })
    }
    forgetForm = FormBuilder.group({ email: "" });
    handleForgotSubmit(e: React.MouseEvent<HTMLButtonElement>) {
        e.preventDefault();
        document
            .getElementById('forgotmain-success')
            .style
            .display = "none";
        this.setState({
            emailnotValid: false
        })

        this
            .props
            .setload(true);
        var sendparam = { emailAddress: this.forgetForm.value.email }
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
                    if (response !== undefined && response.data.responseCode === 400) {
                        self.setState({
                            emailnotValid: true,
                            displaymessage: 'The Email address you entered does not match our records. Please try again'
                        })
                    }
                    else {
                        self.setState({
                            emailnotValid: true,
                            displaymessage: 'There is a server error. Please try again'
                        })
                    }

                }
            })
    }
    handleForgotshow(e, type) {
        this.setState({ showforgot: true, forgetType: type })
    }

    render() {
        return (
            <div>

                <Grid className="landing-image" centered columns={2}>
                    <Grid.Column>
                        <Advertisement unit='large rectangle' centered>
                            <Grid>
                                <Grid.Row className="defaultrowclass">
                                    <Grid.Column>
                                        <Segment className="formhdr defaultsegclass">
                                            <img className="logoimage" src={loginlogo} alt="Gemalto" />
                                        </Segment>
                                    </Grid.Column>
                                </Grid.Row>
                                <Grid.Row className="defaultrowclass">
                                    <Grid.Column>
                                        <Segment className="defaultsegclass">
                                            {!this.state.showpassword && (
                                                <FieldGroup
                                                    control={this.usrform}
                                                    render={({ pristine, value }) => (
                                                        <form className="logform" onSubmit={() => this.handleSubmit}>
                                                            <FieldControl
                                                                name="username"
                                                                render={({ handler }) => (
                                                                    <div className="usrnme">
                                                                        <label>Please enter your username</label>
                                                                        <span><input {...handler()} />
                                                                            <button
                                                                                className="ui blue button btnsize continuebtn login"
                                                                                disabled={pristine}
                                                                                onClick={e => this.handleSubmit(e)}>
                                                                                Continue
                                                                    </button>
                                                                        </span>
                                                                    </div>
                                                                )} />
                                                            <FieldControl
                                                                name="rememberme"
                                                                render={({ handler }) => (
                                                                    <div className="rmbrme">
                                                                        <input {...handler("checkbox")} />
                                                                        <label>
                                                                            Remember me
                                                                </label>
                                                                    </div>
                                                                )} />
                                                            <div className="forgotsec crctlogin">
                                                                <div onClick={(e) => this.handleForgotshow(e, 'username')}>
                                                                    <a>Forgot your username?
                                                                    <span className="artag"></span>
                                                                    </a>
                                                                </div>
                                                                <div onClick={(e) => this.handlenewuserNavigation(e)}>
                                                                    <a>Not registered?
                                                                    <span className="artag"></span>
                                                                    </a>
                                                                </div>
                                                            </div>
                                                        </form>)} />
                                            )}

                                            {this.state.showpassword && (
                                                <FieldGroup
                                                    control={this.passform}
                                                    render={({ pristine, value }) => (
                                                        <form className="logpassform" onSubmit={() => this.handleSubmit}>
                                                            <FieldControl
                                                                name="password"
                                                                render={({ handler }) => (
                                                                    <div>
                                                                        <label>You are logging on as {this.state.username}</label><br />
                                                                        <label>Please enter your password below</label>
                                                                        <Input
                                                                            id="lpassword"
                                                                            className="linput"
                                                                            type='password'
                                                                            icon={< Icon name='eye' link onClick={this.print} />}
                                                                            maxLength={40} {...handler()} />
                                                                        <button
                                                                            className="ui blue button btnsize continuebtn pwd"
                                                                            disabled={pristine}
                                                                            onClick={e => this.handleAuthenticate(e)}>
                                                                            Continue
                                                                    </button>

                                                                    </div>
                                                                )} />
                                                            <div className="forgotsecp crctlogin lg-align">
                                                                <div onClick={(e) => this.handleForgotshow(e, 'password')}>
                                                                    <a>Forgot your password?
                                                                    <span className="artag"></span>
                                                                    </a>
                                                                </div>
                                                                <div>
                                                                    <a
                                                                        href='javascript:void(0)'
                                                                        onClick={this
                                                                            .handleSwitchuser
                                                                            .bind(this)}>Switch User<span className="artag"></span>
                                                                    </a>
                                                                </div>
                                                            </div>
                                                        </form>)} />
                                            )}
                                            <Modal className="usrmodalmain cmn-err-modal" size='mini' open={this.state.open}>
                                                <Modal.Header className="usrmodalhdr">
                                                    Error
                                                </Modal.Header>
                                                <Modal.Content>
                                                    <p>The username you entered doesn't match our records. Please try again.</p>
                                                </Modal.Content>
                                                <Modal.Actions className="aligncent">
                                                    <Button className="brdrcrct" id="my-button" negative onClick={this.close}>
                                                        Ok
                                                    </Button>
                                                </Modal.Actions>
                                            </Modal>

                                            <Modal className="usrmodalmain cmn-err-modal" size='mini' open={this.state.showpassworderror}>
                                                <Modal.Header className="usrmodalhdr">
                                                    Error
                                                </Modal.Header>
                                                <Modal.Content>
                                                    <p>Invalid password. Please try again.</p>
                                                </Modal.Content>
                                                <Modal.Actions className="aligncent">
                                                    <Button className="brdrcrct" negative onClick={this.closepass}>
                                                        Ok
                                                    </Button>
                                                </Modal.Actions>
                                            </Modal>

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
                                                                    <h4 className="forgot-content-align">Forgot {this.state.forgetType}?</h4>
                                                                    <span>If you have logged into Demo before and set up your email in your profile we can send your {this.state.forgetType}</span>
                                                                    <FieldGroup
                                                                        control={this.forgetForm}
                                                                        render={({ pristine, value }) => (
                                                                            <form className="forgot-content-align" onSubmit={() =>
                                                                                this.handleForgotSubmit}>
                                                                                <FieldControl
                                                                                    name="email"
                                                                                    render={({ handler }) =>
                                                                                        (
                                                                                            <span><input id="fg-email-input" placeholder="Email" {...handler()} />
                                                                                                <button
                                                                                                    className="ui blue button btnsize continuebtn"
                                                                                                    disabled={pristine}
                                                                                                    onClick={e => this.handleForgotSubmit(e)}>
                                                                                                    Send
                                             </button>
                                                                                            </span>
                                                                                        )} />
                                                                            </form>
                                                                        )} />
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

                                        </Segment>
                                    </Grid.Column>
                                </Grid.Row>

                            </Grid>
                        </Advertisement>
                    </Grid.Column>
                </Grid>
                <Grid centered className="bottommenu" columns={2}>
                    <Grid.Column className="footer-content">
                        <Segment className="btmmenucontent">
                            <span>
                                <a href="https://www.thalesgroup.com/en/markets/digital-identity-and-security/banking-payment
" target="_blank">THALESGROUP.COM</a>
                            </span>
                            <span>
                                <a href="#/qr">HARDWARE DEVICE DEMO </a>
                            </span>
                            {/* <span>
                                <a href="https://www.gemalto-qr.de/" target="_blank">GERMAN QR DEMO</a>
                            </span> */}
                            <span>
                                <a href="mailto:SUPPORT-DEMO@thalesgroup.com?subject=Digital%20Banking%20and%20Payment%20Demo%20Portal">SUPPORT</a>
                            </span>
                        </Segment>
                    </Grid.Column>
                </Grid>
            </div>
        )
    }

}

function mapStateToProps(state) {
    return { usercheck: state.usercheck, authenticatecheck: state.authenticatecheck }
}
function matchDispatchToProps(dispatch) {
    return bindActionCreators({
        postcheckUsername: postcheckUsername,
        postAuthenticate: postAuthenticate,
        checklogin: checklogin,
        setusername: setusername,
        setload: setload,
        setlogon: setlogon,
        postForgetdetailsAction: postForgetdetailsAction
    }, dispatch)
}

export default connect(mapStateToProps, matchDispatchToProps)(Login)
