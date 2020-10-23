import * as React from 'react';
import { connect } from 'react-redux';
const queryString = require('query-string');
import {
    FormBuilder,
    AbstractControl,
    Validators,
    ValidationErrors,
    FormGroup,
    ValidatorFn,
    FieldControl,
    FieldGroup
} from "react-reactive-form";

const loginlogo = require('../../img/demologo.png');
const loginbackground = require('../../img/loginbackground.jpg');

import 'semantic-ui-css/semantic.min.css';
import { Grid, Segment, Icon, Divider, Modal, Button, Advertisement } from 'semantic-ui-react';
import { bindActionCreators } from 'redux';
import { setload, postNewpassword } from '../Actions/action';

/**
 * validators to match the passwords.
 */
const checkIfMatchingPasswords = (
    passwordKey: string,
    passwordConfirmationKey: string
): ValidatorFn => {
    return (group: FormGroup): ValidationErrors | null => {
        let passwordInput = group.controls[passwordKey],
            passwordConfirmationInput = group.controls[passwordConfirmationKey];
        if (passwordInput.value !== passwordConfirmationInput.value) {
            passwordConfirmationInput.setErrors({ notEquivalent: true });
        } else {
            passwordConfirmationInput.setErrors(null);
        }
        return null;
    };
};

const checkPasswords = (
    passwordKey: string
): ValidatorFn => {
    return (group: FormGroup): ValidationErrors | null => {
        let passwordInput = group.controls[passwordKey]
        var patt = RegExp("^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$");
        var res = patt.test(passwordInput.value);
        if (passwordInput.value === '') {
            passwordInput.setErrors({ required: true });
        }
        if (res === false) {
            passwordInput.setErrors({ notPassword: true });
        } else {
            passwordInput.setErrors(null);
        }
        return null;
    };
};

const styles: any = {
    input: {
        width: '100%',
        padding: '8px 20px 10px 10px',
        display: 'inline - block',
        border: '1px solid #ccc',
        borderRadius: '4px',
        boxSizing: 'border-box',
        margin: '0px 0px 0px 6px'
    },
    main: {
        fontFamily: 'sans-serif',
        textAlign: 'center',
        padding: '0% 3% 0% 0%'
    },
    errdivmain: {
        margin: '0% 0% 0% 0%'
    },
    error: {
        color: "red" as 'red',
        fontSize: "14px",
        float: "right",
        margin: "2% 0% 2% 0%"
    } as any
} as any;

class Recoveraccount extends React.Component<any, any> {

    public userRecoverForm: FormGroup;
    emailAddress: string;
    recoverToken: string;

    constructor(props) {
        super(props)

        let url = this.props.location.search;
        let params = queryString.parse(url);
        this.emailAddress = params.emailAddress ? params.emailAddress : ''
        this.recoverToken = params.recoverToken ? params.recoverToken : ''


        this.state = {
            passwordChanged: false,
            open: false
        };

        this.userRecoverForm = FormBuilder.group({
            password: [
                "",
                [Validators.required, Validators.minLength(8)]
            ],
            confirm_password: ["", Validators.required]
        }, {
                validators: [checkIfMatchingPasswords("password", "confirm_password"), checkPasswords("password")],
                updateOn: "submit"
            });
    }
    componentWillUnmount() {
        this
            .userRecoverForm
            .reset();
    }

    show = () => this.setState({ open: true })
    close = () => this.setState({ open: false })

    handleTologin() {
        window.location.href = "https://dbpdemo.com"
    }

    handleRecoveraccount(e: React.MouseEvent<HTMLButtonElement>) {
        e.preventDefault();
        var currentself = this;
        this.userRecoverForm.handleSubmit();
        console.log(this.userRecoverForm);

        if (this.userRecoverForm.status === 'VALID') {
            var passwordObject = {
                password: this.userRecoverForm.value.password,
                emailAddress: this.emailAddress,
                recoverToken: this.recoverToken
            }
            this.props.setload(true);
            var self = this;
            this.props.postNewpassword(passwordObject).then(function (response) {
                if (response !== undefined && response.data.responseCode === 200) {
                    self.props.setload(false);
                    self.setState({
                        passwordChanged: true
                    })
                }
                else if (response !== undefined && response.data.responseCode === 409) {
                    self.props.setload(false);
                    (document.getElementById('newusername') as HTMLInputElement).innerHTML = "Invalid username";
                }
                else {
                    self.props.setload(false);
                    self.show();
                }
            })
        }
    }

    render() {
        return (
            <div>
                <Grid className="landing-image" centered columns={2}>
                    <Grid.Column id="nw_formgrid">
                        {!this.state.passwordChanged && <Grid>
                            <Grid.Row className="defaultrowclass">
                                <Grid.Column>
                                    <Segment className="formhdr defaultsegclass">
                                        <img className="logoimage" id="nw_logo_form" src={loginlogo} alt="Gemalto" />
                                    </Segment>
                                </Grid.Column>
                            </Grid.Row>
                            <Grid.Row className="defaultrowclass">
                                <Grid.Column>
                                    <Segment className="defaultsegclass">

                                        <FieldGroup
                                            control={this.userRecoverForm}
                                            render={({
                                                pristine,
                                                invalid,
                                                pending,
                                                get,
                                                value,
                                                handleSubmit,
                                                submitted
                                            }: FormGroup) => (
                                                    <div style={styles.main}>
                                                        <Icon name='user' size='huge' />
                                                        <h3 id="nw_caption"> Demo account recovery</h3>
                                                        <Divider />
                                                        <form onSubmit={handleSubmit}>

                                                            <FieldControl
                                                                name="password"
                                                                render={({
                                                                    handler,
                                                                    getError,
                                                                    hasError,
                                                                    touched
                                                                }: AbstractControl) => (
                                                                        <div>
                                                                            <input
                                                                                type="password" placeholder="Password"
                                                                                style={styles.input}
                                                                                {...handler()}
                                                                            />
                                                                            <div style={styles.errdivmain}>
                                                                                <span style={styles.error}>
                                                                                    {submitted &&
                                                                                        ((hasError("required") && "This field is required") ||
                                                                                            (hasError("minLength") &&
                                                                                                `Password Should Be greater than 
                    ${getError("minLength").requiredLength} character`) || hasError("notPassword") &&
                                                                                            'Password must contain at least 8 characters and at least one lowercase letter, one uppercase letter, one numeric digit, and one special character.')}
                                                                                </span>
                                                                            </div>
                                                                        </div>
                                                                    )}
                                                            />

                                                            <FieldControl
                                                                name="confirm_password"
                                                                render={({ handler, touched, hasError }: AbstractControl) => (
                                                                    <div>
                                                                        <input placeholder="Confirm Password"
                                                                            type="password"
                                                                            style={styles.input}
                                                                            {...handler()}
                                                                        />
                                                                        <div style={styles.errdivmain}>
                                                                            <span style={styles.error}>
                                                                                {submitted && this.userRecoverForm.controls.password.errors === null &&
                                                                                    ((hasError("required") &&
                                                                                        "Please confirm your password") ||
                                                                                        (hasError("notEquivalent") &&
                                                                                            "Password does not match."))}
                                                                            </span>
                                                                        </div>
                                                                    </div>
                                                                )}
                                                            />
                                                            <div id="nw_createbtn">
                                                                <button className="ui blue button" type="submit" onClick={this.handleRecoveraccount.bind(this)}>
                                                                    Change password
                                                            </button>
                                                            </div>
                                                        </form>
                                                    </div>
                                                )} />

                                        <Modal className="usrmodalmain cmn-err-modal" size='mini' open={this.state.open}>
                                            <Modal.Header className="usrmodalhdr">
                                                Error
                                                </Modal.Header>
                                            <Modal.Content>
                                                <p>Something went wrong. Please try again.</p>
                                            </Modal.Content>
                                            <Modal.Actions className="aligncent">
                                                <Button className="brdrcrct" negative onClick={this.close}>
                                                    Ok
                                                </Button>
                                            </Modal.Actions>
                                        </Modal>

                                    </Segment>
                                </Grid.Column>
                            </Grid.Row>
                        </Grid>
                        }
                        {this.state.passwordChanged &&
                            <Advertisement unit='large rectangle' centered id="nw_success">
                                <Grid>
                                    <Grid.Row className="defaultrowclass">
                                        <Grid.Column>
                                            <Segment className="formhdr defaultsegclass">
                                                <img className="logoimage" id="nw_logo" src={loginlogo} alt="Gemalto" />
                                            </Segment>
                                        </Grid.Column>
                                    </Grid.Row>
                                    <Grid.Row className="defaultrowclass">
                                        <Grid.Column>
                                            <Segment className="defaultsegclass">
                                                <div>
                                                    <Icon name='check' size='big' />
                                                    <h4 id="nw_mail_caption"><b>Your password has been changed.</b></h4>
                                                    <p className="nw_success_mail">Please login with your new password.</p>
                                                    <button className="ui blue button btnsize" onClick={this.handleTologin}>Login</button>
                                                </div>
                                            </Segment>
                                        </Grid.Column>
                                    </Grid.Row>
                                </Grid>
                            </Advertisement>
                        }

                    </Grid.Column>

                </Grid>
                <Grid centered className="nw_bottommenu" columns={2}>
                    <Grid.Column className="footer-content">
                      <Segment className="btmmenucontent">
                            <span>
                                <a href="https://www.thalesgroup.com/en/markets/digital-identity-and-security/banking-payment" target="_blank">THALESGROUP.COM</a>
                            </span>
                              <span>
                                <a href="/qr">HARDWARE DEVICE DEMO </a>
                            </span>
                            <span>
                                <a href="https://www.gemalto-qr.de/" target="_blank">GERMAN QR DEMO</a>
                            </span>
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
    return {}
}
function matchDispatchToProps(dispatch) {
    return bindActionCreators({
        setload: setload,
        postNewpassword: postNewpassword
    }, dispatch)
}

export default connect(mapStateToProps, matchDispatchToProps)(Recoveraccount)
