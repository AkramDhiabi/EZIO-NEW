import * as React from 'react';
import {render} from "react-dom";
import {Link} from 'react-router-dom';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import {Provider} from 'react-redux';
import {setload,getCheckusernameRegistration,postUseraccount} from "../Actions/action";
import {store} from '../Store/store';
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
    Modal,
    Divider
} from 'semantic-ui-react';
const loginlogo = require('../../img/demologo.png');
const loginbackground = require('../../img/loginbackground.jpg');
const DTPFile = require('../../static/dtp_ezio_demo_portal.pdf');

import "react-datepicker/dist/react-datepicker.css";
import 'semantic-ui-css/semantic.min.css';

const sleep = (ms : number) => new Promise(resolve => setTimeout(resolve, ms));


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

const checkPasswords =(
    passwordKey: string
  ): ValidatorFn => {
    return (group: FormGroup): ValidationErrors | null => {
      let passwordInput = group.controls[passwordKey]
      var patt = RegExp("^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$");
      var res = patt.test(passwordInput.value);
      if(passwordInput.value === '')
      {
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
            color: "red",
            fontSize: "14px",
            float:"right",
            margin: "2% 0% 2% 0%"
        }
    }

    var countryarr = new Array("Afghanistan", "Albania", "Algeria",
    "American Samoa", "Angola", "Anguilla", "Antartica",
    "Antigua and Barbuda", "Argentina", "Armenia", "Aruba",
    "Ashmore and Cartier Island", "Australia", "Austria", "Azerbaijan",
    "Bahamas", "Bahrain", "Bangladesh", "Barbados", "Belarus", "Belgium",
    "Belize", "Benin", "Bermuda", "Bhutan", "Bolivia",
    "Bosnia and Herzegovina", "Botswana", "Brazil",
    "British Virgin Islands", "Brunei", "Bulgaria", "Burkina Faso",
    "Burma", "Burundi", "Cambodia", "Cameroon", "Canada", "Cape Verde",
    "Cayman Islands", "Central African Republic", "Chad", "Chile", "China",
    "Christmas Island", "Clipperton Island", "Cocos (Keeling) Islands",
    "Colombia", "Comoros", "Congo, Democratic Republic of the",
    "Congo, Republic of the", "Cook Islands", "Costa Rica",
    "Cote d'Ivoire", "Croatia", "Cuba", "Cyprus", "Czeck Republic",
    "Denmark", "Djibouti", "Dominica", "Dominican Republic", "Ecuador",
    "Egypt", "El Salvador", "Equatorial Guinea", "Eritrea", "Estonia",
    "Ethiopia", "Europa Island", "Falkland Islands (Islas Malvinas)",
    "Faroe Islands", "Fiji", "Finland", "France", "French Guiana",
    "French Polynesia", "French Southern and Antarctic Lands", "Gabon",
    "Gambia, The", "Gaza Strip", "Georgia", "Germany", "Ghana",
    "Gibraltar", "Glorioso Islands", "Greece", "Greenland", "Grenada",
    "Guadeloupe", "Guam", "Guatemala", "Guernsey", "Guinea",
    "Guinea-Bissau", "Guyana", "Haiti",
    "Heard Island and McDonald Islands", "Holy See (Vatican City)",
    "Honduras", "Hong Kong", "Howland Island", "Hungary", "Iceland",
    "India", "Indonesia", "Iran", "Iraq", "Ireland", "Ireland, Northern",
    "Israel", "Italy", "Jamaica", "Jan Mayen", "Japan", "Jarvis Island",
    "Jersey", "Johnston Atoll", "Jordan", "Juan de Nova Island",
    "Kazakhstan", "Kenya", "Kiribati", "Korea, North", "Korea, South",
    "Kuwait", "Kyrgyzstan", "Laos", "Latvia", "Lebanon", "Lesotho",
    "Liberia", "Libya", "Liechtenstein", "Lithuania", "Luxembourg",
    "Macau", "Macedonia, Former Yugoslav Republic of", "Madagascar",
    "Malawi", "Malaysia", "Maldives", "Mali", "Malta", "Man, Isle of",
    "Marshall Islands", "Martinique", "Mauritania", "Mauritius", "Mayotte",
    "Mexico", "Micronesia, Federated States of", "Midway Islands",
    "Moldova", "Monaco", "Mongolia", "Montserrat", "Morocco", "Mozambique",
    "Namibia", "Nauru", "Nepal", "Netherlands", "Netherlands Antilles",
    "New Caledonia", "New Zealand", "Nicaragua", "Niger", "Nigeria",
    "Niue", "Norfolk Island", "Northern Mariana Islands", "Norway", "Oman",
    "Pakistan", "Palau", "Panama", "Papua New Guinea", "Paraguay", "Peru",
    "Philippines", "Pitcaim Islands", "Poland", "Portugal", "Puerto Rico",
    "Qatar", "Reunion", "Romainia", "Russia", "Rwanda", "Saint Helena",
    "Saint Kitts and Nevis", "Saint Lucia", "Saint Pierre and Miquelon",
    "Saint Vincent and the Grenadines", "Samoa", "San Marino",
    "Sao Tome and Principe", "Saudi Arabia", "Scotland", "Senegal",
    "Seychelles", "Sierra Leone", "Singapore", "Slovakia", "Slovenia",
    "Solomon Islands", "Somalia", "South Africa",
    "South Georgia and South Sandwich Islands", "Spain", "Spratly Islands",
    "Sri Lanka", "Sudan", "Suriname", "Svalbard", "Swaziland", "Sweden",
    "Switzerland", "Syria", "Taiwan", "Tajikistan", "Tanzania", "Thailand",
    "Tobago", "Toga", "Tokelau", "Tonga", "Trinidad", "Tunisia", "Turkey",
    "Turkmenistan", "Tuvalu", "Uganda", "Ukraine", "United Arab Emirates",
    "United Kingdom", "Uruguay", "USA", "Uzbekistan", "Vanuatu",
    "Venezuela", "Vietnam", "Virgin Islands", "Wales", "Wallis and Futuna",
    "West Bank", "Western Sahara", "Yemen", "Yugoslavia", "Zambia","Zimbabwe");

    class Newuserregistration extends React.Component < any,
    any > {

        public userRegisterform : FormGroup;



        constructor(props) {
            super(props)

            this.state = {
                userRegistered:false,
                open:false,
                newReg:false
            }
            this.handleUsernamecheck = this.handleUsernamecheck.bind(this);

            this.userRegisterform = FormBuilder.group({
                email: [
                    "",
                    [Validators.required, Validators.email]
                ],
                firstName: [
                    "", Validators.required
                ],
                lastName: [
                    "", [Validators.required,Validators.minLength(2)]
                ],
                companyName: [
                    "", Validators.required
                ],
                country: [
                    "", Validators.required
                ],
                username: [
                    "", Validators.required
                ],
                password: [
                    "",
                    [Validators.required, Validators.minLength(8)]
                ],
                confirm_password: ["", Validators.required]
            }, {
                validators: [checkIfMatchingPasswords("password", "confirm_password"),checkPasswords("password")],
                updateOn: "submit"
            });

        }

        handleReset(e : React.MouseEvent < HTMLButtonElement >) {
            e.preventDefault();
            this
                .userRegisterform
                .reset();
        }

        componentDidMount() {

        }
        componentWillUnmount() {
            this
                .userRegisterform
                .reset();
        }
        show = () => this.setState({ open: true })
        close = () => this.setState({ open: false })

        handleUsernamecheck(e)
        {
            console.log(e.target.value);
            var self=this;
            (document.getElementById('newusername') as HTMLInputElement).innerHTML="";
            var updatedusername = e.target.value;
            this.props.getCheckusernameRegistration(updatedusername).then(function (response) {
                if(response !== undefined && response.data.responseCode === 409)
                {

                    (document.getElementById('newusername') as HTMLInputElement).innerHTML="Invalid username";
                }
            })
        }

        handleUsernameCreation(e,fieldname){
            // var shortLastName = _lastName.slice(0,14).replace(/ /g,'');

            // var username = _firstName.charAt(0).concat(shortLastName).toLowerCase();
            console.log(e,fieldname);
            var shortFirstname;
            var shortLastName;
            var currentnewusername;
            (document.getElementById('newusername') as HTMLInputElement).innerHTML="";
            (document.getElementById('formLastname') as HTMLInputElement).value ='  ';

            if(fieldname === 'firstName')
            {
                shortFirstname = e.target.value.charAt(0);
                shortLastName = (document.getElementById('nwlastName') as HTMLInputElement).value.slice(0,14).replace(/ /g,'');
                currentnewusername = (shortFirstname+shortLastName).toLowerCase();
                this.userRegisterform.patchValue({
                    username: currentnewusername
                  });
                (document.getElementById('formusername') as HTMLInputElement).value =currentnewusername;

                this.props.getCheckusernameRegistration(currentnewusername).then(function (response) {
                    if(response !== undefined && response.data.responseCode === 409)
                    {

                        (document.getElementById('formusername') as HTMLInputElement).innerHTML="Invalid username";
                    }
                })

            }
            else{
                console.log(this.userRegisterform);
                shortFirstname = (document.getElementById('nwfirstName') as HTMLInputElement).value.charAt(0);
                shortLastName = e.target.value.slice(0,14).replace(/ /g,'');
                currentnewusername = (shortFirstname+shortLastName).toLowerCase();
                this.userRegisterform.patchValue({
                    username: currentnewusername
                  });
                (document.getElementById('formusername') as HTMLInputElement).value =currentnewusername;
                this.props.getCheckusernameRegistration(currentnewusername).then(function (response) {
                    if(response !== undefined && response.data.responseCode === 409)
                    {

                        (document.getElementById('newusername') as HTMLInputElement).innerHTML="Invalid username";
                    }
                })

            }


        }

        handleTologin()
        {
            window.location.href="https://dbpdemo.com"
        }
        handleCreateaccount(e: React.MouseEvent<HTMLButtonElement>) {
            e.preventDefault();
            //console.log(this.userRegisterform);
            var currentself = this;
            this.userRegisterform.handleSubmit();
            console.log(this.userRegisterform);
            this.setState({
                newReg:!this.state.newReg
            })

                this.props.getCheckusernameRegistration( this.userRegisterform.value.username).then(function (response) {
                    if(response !== undefined && response.data.responseCode === 409)
                    {

                        (document.getElementById('newusername') as HTMLInputElement).innerHTML="Invalid username";
                    }
                })




            if(this.userRegisterform.status === 'VALID' && (document.getElementById('newusername') as HTMLInputElement).innerHTML !=="Invalid username")
            {
                var userdetailObject={
                        companyName: this.userRegisterform.value.companyName,
                        country: this.userRegisterform.value.country,
                        emailAddress: this.userRegisterform.value.email,
                        firstName: this.userRegisterform.value.firstName,
                        lastName: this.userRegisterform.value.lastName,
                        password: this.userRegisterform.value.password,
                        username: this.userRegisterform.value.username
                }
                this.props.setload(true);
                var self=this;
                this.props.postUseraccount(userdetailObject).then(function (response) {
                    if(response !== undefined && response.data.responseCode === 200)
                    {
                        self.props.setload(false);
                        self.setState({
                            userRegistered:true
                        })
                    }
                    else if(response !== undefined && response.data.responseCode === 409)
                    {
                        self.props.setload(false);
                        (document.getElementById('newusername') as HTMLInputElement).innerHTML="Invalid username";
                    }
                    else{
                        self.props.setload(false);
                        self.show();
                    }
                })
            }


          }
        render() {
            return (
                <div>

                    <Grid className="landing-image nw_img_height" centered columns={2}>
                        <Grid.Column id="nw_formgrid">
                            {!this.state.userRegistered && <Grid>
                                    <Grid.Row className="defaultrowclass">
                                        <Grid.Column>
                                            <Segment className="formhdr defaultsegclass">
                                                <img className="logoimage" id="nw_logo_form"src={loginlogo} alt="Gemalto"/>
                                            </Segment>
                                        </Grid.Column>
                                    </Grid.Row>
                                    <Grid.Row className="defaultrowclass">
                                        <Grid.Column>
                                            <Segment className="defaultsegclass">

                                                <FieldGroup
                                                    control={this.userRegisterform}
                                                    render={({
                                                    pristine,
                                                    invalid,
                                                    pending,
                                                    get,
                                                    value,
                                                    handleSubmit,
                                                    submitted
                                                } : FormGroup) => (
                                                    <div style={styles.main}>
                                                        <Icon name='user' size='huge' />
                                                        <h3 id="nw_caption">Demo account creation</h3>
                                                        <span>Already registered?  <a onClick={this.handleTologin}>Login here <span className="artag"></span> </a></span>

                                                        <Divider/>
                                                        <form onSubmit={handleSubmit} key={this.state.newReg}>

                                                             <FieldControl
                                                                name="email"
                                                                render={({handler, touched, hasError, pending} : AbstractControl) => (
                                                                <div>
                                                                    <input placeholder="Email" maxLength={50} style={styles.input} {...handler()}/>
                                                                    <div style={styles.errdivmain}>
                                                                        <span style={styles.error}>
                                                                            {(submitted && ((hasError("required") && "This field is required") || (hasError("email") && "Please enter a valid email address")))}
                                                                        </span>
                                                                    </div>
                                                                </div>
                                                            )}/>

                                                            <FieldControl
                                                                name="firstName"
                                                                render={({handler, touched, hasError, pending} : AbstractControl) => (
                                                                <div>
                                                                    <input id="nwfirstName" maxLength={25} placeholder="First Name" style={styles.input} {...handler()} onBlur={(e) =>this.handleUsernameCreation(e,'firstName')}/>
                                                                    <div style={styles.errdivmain}>
                                                                        <span style={styles.error}>
                                                                            {(submitted && this.userRegisterform.controls.email.errors === null && ((hasError("required") && "This field is required")))}
                                                                        </span>
                                                                    </div>
                                                                </div>
                                                            )}/>

                                                            <FieldControl
                                                                name="lastName"
                                                                render={({handler, touched, getError, hasError, pending} : AbstractControl) => (
                                                                <div>
                                                                    <input  id="nwlastName" maxLength={25} placeholder="Last Name" style={styles.input} {...handler()} onBlur={(e)=>this.handleUsernameCreation(e,'lastName')}/>
                                                                    <div style={styles.errdivmain}>
                                                                        <span id="formLastname" style={styles.error}>
                                                                            {(submitted && this.userRegisterform.controls.firstName.errors === null&& ((hasError("required") && "This field is required")||  (hasError("minLength") &&`Last name should be of 2 characters`))) }
                                                                        </span>
                                                                    </div>
                                                                </div>
                                                            )}/>
                                                             <FieldControl
                                                                name="companyName"
                                                                render={({handler, touched, hasError, pending} : AbstractControl) => (
                                                                <div>
                                                                    <input placeholder="Company Name" maxLength={25} style={styles.input} {...handler()} />
                                                                    <div style={styles.errdivmain}>

                                                                     <span style={styles.error}>
                                                                        {(submitted && this.userRegisterform.controls.lastName.errors === null && (hasError("required") && "This field is required"))}
                                                                        </span>
                                                                    </div>
                                                                </div>
                                                            )}/>
                                                            <FieldControl
                                                                name="country"
                                                                render={({handler,touched, hasError, pending} : AbstractControl) => (
                                                                <div>
                                                                    <select value="" style={styles.input} {...handler()} required>
                                                                    <option value="" disabled hidden>Select country</option>

                                                                    {
                                                                        countryarr.map((i,j)=>{
                                                                        return <option key={i} value={i}>{i}</option>
                                                                        })
                                                                    }
                                                                    </select>
                                                                    <div style={styles.errdivmain}>

                                                                     <span style={styles.error}>
                                                                        {(submitted && this.userRegisterform.controls.companyName.errors === null && (hasError("required") && "This field is required"))}
                                                                        </span>
                                                                    </div>
                                                                </div>
                                                            )}/>
                                                            <FieldControl
                                                                name="username"
                                                                render={({handler, touched, hasError, pending} : AbstractControl) => (
                                                                <div>
                                                                    <input  id="formusername"  maxLength={25} placeholder="Username" style={styles.input} {...handler()} onBlur={this.handleUsernamecheck} />
                                                                    <div style={styles.errdivmain}>

                                                                     <span style={styles.error} id="newusername">
                                                                        {(submitted && this.userRegisterform.controls.country.errors === null && (hasError("required") && "This field is required"))}
                                                                        </span>
                                                                    </div>
                                                                </div>
                                                            )}/>

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
                        {submitted && this.userRegisterform.controls.username.errors === null && this.userRegisterform.controls.lastName.errors === null &&  this.userRegisterform.controls.companyName.errors === null && this.userRegisterform.controls.country.errors === null &&
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
                    <input  placeholder="Confirm Password"
                      type="password"
                      style={styles.input}
                      {...handler()}
                    />
                    <div style={styles.errdivmain}>
                      <span style={styles.error}>
                        {submitted && this.userRegisterform.controls.password.errors === null &&
                          ((hasError("required") &&
                            "Please confirm your password") ||
                            (hasError("notEquivalent") &&
                              "Password does not match."))}
                      </span>
                    </div>
                  </div>
                )}
              />
{           /*
                                                            <FieldControl
                                                                name="password"
                                                                render={({handler, touched, hasError, pending} : AbstractControl) => (
                                                                <div>

                                                                    <input placeholder="Password" maxLength={20} type="password" style={styles.input} {...handler()}/>
                                                                    <div style={styles.errdivmain}>
                                                                        <span id="errpassword" style={styles.error}>
                                                                            {submitted && this.userRegisterform.controls.username.errors === null && ((hasError("required") && "This field is required"))}
                                                                        </span>
                                                                    </div>
                                                                </div>
                                                            )}/>
                                                            <FieldControl
                                                                name="confirm_password"
                                                                render={({handler, touched, hasError, pending} : AbstractControl) => (
                                                                <div>

                                                                    <input  placeholder="Confirm Password" maxLength={20} type="password" style={styles.input} {...handler()}/>
                                                                    <div style={styles.errdivmain}>
                                                                        <span id="errconfirmpassword" style={styles.error}>
                                                                            {submitted && this.userRegisterform.controls.password.errors === null && ((hasError("required") && "Please confirm your password") || (hasError("notEquivalent") && "Password does not match."))}
                                                                        </span>
                                                                    </div>
                                                                </div>
                                                            )}/> */}
                                                            <div>
                                                                <span>Please read our <a href={DTPFile} target="_blank" >Data Processing Terms before registering <span className="artag"></span> </a></span>
                                                            </div>
                                                            <div id="nw_createbtn">
                                                                <button  className="ui blue button" type="submit" onClick={this.handleCreateaccount.bind(this)}>
                                                                    Create Account
                                                                </button>
                                                            </div>
                                                        </form>
                                                    </div>
                                                )}/>

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
                            {this.state.userRegistered &&
                             <Advertisement unit='large rectangle' centered id="nw_success">
                                <Grid>
                                    <Grid.Row className="defaultrowclass">
                                        <Grid.Column>
                                            <Segment className="formhdr defaultsegclass">
                                                <img className="logoimage" id="nw_logo" src={loginlogo} alt="Gemalto"/>
                                            </Segment>
                                        </Grid.Column>
                                    </Grid.Row>
                                    <Grid.Row className="defaultrowclass">
                                        <Grid.Column>
                                            <Segment className="defaultsegclass">
                                              <div>
                                              <Icon name='mail' size='big' />
                                                <h4 id="nw_mail_caption"><b>Check your mailbox!</b></h4>
                                                <p className="nw_success_mail">An email has been sent to {this.userRegisterform.value.email} allowing you to validate your email address. It will remain valid for 3 days.</p>
                                                <p className="nw_success_mail">If you don’t receive it straightaway please look into your SPAM mailbox. If you can't find it, try to register once again using an alternative email address.</p>

                                                <button className="ui blue button btnsize" onClick={this.handleTologin}> Login
                                                </button>
                                                </div>

                                            </Segment>
                                        </Grid.Column>
                                    </Grid.Row>
                            </Grid>
                            </Advertisement>
                            }

                        </Grid.Column>

                    </Grid>
                    {/* <Segment id="nw_btmmenucontent">
                                <span>
                                    <a className="nw_btm_a"  href="https://www.gemalto.com" target="_blank">GEMALTO.COM</a>
                                </span>
                                <span>
                                    <a className="nw_btm_a" href="https://www.gemalto.com/financial/ebanking/" target="_blank">PRODUCT & SERVICES</a>
                                </span>
                                <span>
                                    <a  className="nw_btm_a" href="mailto:SUPPORT-DEMO@gemalto.com">SUPPORT</a>
                                </span>
                            </Segment> */}
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
            getCheckusernameRegistration:getCheckusernameRegistration,
            postUseraccount:postUseraccount
        }, dispatch)
    }

    export default connect(mapStateToProps, matchDispatchToProps)(Newuserregistration)
