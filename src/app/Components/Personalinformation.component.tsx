import * as React from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { store } from '../Store/store';
import { setload,postPersonalinformationUpdate,setEmail } from '../Actions/action';
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
    Message,
    Tab,
    Divider,
    Input
} from 'semantic-ui-react';
import {ToastDanger,ToastSuccess} from 'react-toastr-basic';
import { FormBuilder, FieldControl, FieldGroup } from "react-reactive-form";
import 'semantic-ui-css/semantic.min.css';

class Personalinformation extends React.Component<any,any> {

    constructor(props) {
        super(props);
        this.state = {
          username: store.getState().username,
          tabData:0,
          successmessage:false,
          errormessage:false,
          displaymessage:'',
          userEmail:store.getState().userEmail
        };
    }
   
    
    componentWillMount() {
        this.props.setload(true);
    }
    componentDidMount() {
        
        this.props.setload(false);
    }

    passwordChangeform = FormBuilder.group({
        currentPassword: "",
        newPassword: "",
        confirmPassword:""
    });

    emailChangeform = FormBuilder.group({
        Password: "",
        newEmail: "",
        confirmEmail:""
    });

    handleKeypressSubmit= (event) => {
        var charCode = event.charCode;
        if(charCode === 13) {
            this.handleUpdatepersonalInfo(event);
        }
    }
 
    print (curenntId) {
         
            var elementId = curenntId;
            if((document.getElementById(elementId) as HTMLInputElement) !== null){
                var inputElement =(document.getElementById(elementId) as HTMLInputElement).type;
        
                if (inputElement === "password") {
                    (document.getElementById(elementId) as HTMLInputElement).type = 'text';
                } else {
                    (document.getElementById(elementId) as HTMLInputElement).type = 'password';
                }
            }
      }
    personalInformationTabs = [
        {
          menuItem: 'Password', render: () =>
            <Tab.Pane attached={false}>
            <div>
                <div className="pi-column">
                <FieldGroup control={this.passwordChangeform} render={({ pristine, value }) => (
                                <form>
                                    <FieldControl name="currentPassword" render={({ handler }) => (
                                        
                                                <div>
                                                    <label className="pi-input">Current password<label className="star">*</label></label>
                                                    <span><Input id="opassword" className="pinput" type='password'   icon={<Icon name='eye' link onClick={()=>this.print('opassword')}/>} maxLength={40} {...handler()}    onKeyPress={this.handleKeypressSubmit}/>
                                                    </span>
                                                </div>
                                         
                                    )} />

                                    <FieldControl name="newPassword" render={({ handler }) => (
                                       
                                                <div>
                                                    <label className="pi-input">New password<label className="star">*</label></label>
                                                    <span><Input id="npassword" className="pinput" type='password'   icon={<Icon name='eye' link onClick={()=>this.print('npassword')}/>} maxLength={40} {...handler()}    onKeyPress={this.handleKeypressSubmit}/>
                                                    </span>
                                                    <span className="pi-err" id="err-npass">
                                                       
                                                    </span>
                                                </div>
                                          
                                    )} />
                                    <FieldControl name="confirmPassword" render={({ handler }) => (
                                       
                                                <div>
                                                    <label className="pi-input">Confirm password<label className="star">*</label></label>
                                                    <span><Input id="cpassword" className="pinput" type='password'   icon={<Icon name='eye' link onClick={()=>this.print('cpassword')}/>} maxLength={40} {...handler()}    onKeyPress={this.handleKeypressSubmit}/>
                                                    </span>
                                                    <span className="pi-err" id="err-cpass">
                                                       
                                                    </span>
                                                </div>
                                        
                                    )} />
                                </form>
                            )} />
                </div>
                <div id="pi-ins-column">
                <h4>Tips for creating a new password</h4>
                <p>1- Your password should be atleast 8 characters in length.</p>
                <p>2- Include atleast one lowercase letter, one uppercase letter, one numerice digit and one special character.</p>
                <p>3- Do not include your first or last name or other obvious word.</p>
                </div>
            </div>
             
            </Tab.Pane>
        },
        {
          menuItem: 'Email',
          render: () =>
            <Tab.Pane attached={false}>
                    <div className="column pi-email-column pi-top-align">
                <FieldGroup control={this.emailChangeform} render={({ pristine, value }) => (
                                <form>
                                    <FieldControl name="Password" render={({ handler }) => (
                                        
                                                <div>
                                                    <label className="pi-input">Password<label className="star">*</label></label>
                                                    <span><Input id="epassword" className="peinput" type='password'   icon={<Icon name='eye' link onClick={()=>this.print('epassword')}/>} maxLength={40} {...handler()}    onKeyPress={this.handleKeypressSubmit}/>
                                                    </span>
                                                </div>
                                         
                                    )} />

                                    <FieldControl name="newEmail" render={({ handler }) => (
                                       
                                                <div>
                                                    <label className="pi-input">New e-mail address<label className="star">*</label></label>
                                                    <span><input  className="pi-email-input" {...handler()}    onKeyPress={this.handleKeypressSubmit}/>
                                                    
                                                    </span>
                                                    <span className="pi-err" id="err-email">
                                                       
                                                       </span>
                                                </div>
                                          
                                    )} />
                                    <FieldControl name="confirmEmail" render={({ handler }) => (
                                       
                                                <div>
                                                    <label className="pi-input">Confirm new e-mail<label className="star">*</label></label>
                                                    <span><input className="pi-email-input" {...handler()} onKeyPress={this.handleKeypressSubmit}/>
                                                    </span>
                                                    <span className="pi-err" id="err-cemail">
                                                       
                                                    </span>
                                                </div>
                                        
                                    )} />
                                </form>
                            )} />
                </div>
            
            </Tab.Pane>
        }
      ] 

      handlemtcancel(e) {
        e.preventDefault();
        this
            .props
            .history
            .push('/layout/accountsummary');
    }

    handleUpdatepersonalInfo(e){

        e.preventDefault();

        this.setState(
                {
                    successmessage:false,
                    errormessage:false,
                    displaymessage:''
                }
            )
       
    
        if(this.state.tabData === 1)
        {
            document.getElementById('err-email').innerHTML=""
            document.getElementById('err-cemail').innerHTML=""
            document.getElementById('err-email').style.display = "none";
            document.getElementById('err-cemail').style.display = "none";
            var patt = /(\w+)\@(\w+)\.[a-zA-Z]/g;
    
            if( this.emailChangeform.value.Password === '' || this.emailChangeform.value.newEmail === '' || this.emailChangeform.value.confirmEmail === '')
            {
                ToastDanger('Error. (*) fields are required');
            }
            else if(patt.test(this.emailChangeform.value.newEmail) === false)
            {
    
                document.getElementById('err-email').innerHTML="Invalid email!";
                document.getElementById('err-email').style.display = "block";
            }
            else if(this.emailChangeform.value.newEmail !== this.emailChangeform.value.confirmEmail){
                document.getElementById('err-cemail').innerHTML="Email does not match!"
                document.getElementById('err-cemail').style.display = "block";
            }
            else{
                console.log(this.emailChangeform)
                this.props.setload(true);
                const sendcredentials = 
                {
                    confirmPwd:"",
                    emailAddress: this.emailChangeform.value.newEmail,
                    newPassword:"",
                    updateField: "Update_Email",
                    username: this.state.username,
                    currPassword: this.emailChangeform.value.Password,
                };
                      
            
                const self = this;
            
                this.props.postPersonalinformationUpdate(sendcredentials).then(function (response) {
            
                    if(response !== undefined && response.data.responseCode === 200)
                    {
                        
                        self.props.setload(false);
                        self.props.setEmail(response.data.templateObject.emailAddress);
                        self.setState({
                            successmessage:true,
                            displaymessage:'Your Email has been successfully changed.',
                            userEmail:response.data.templateObject.emailAddress
                        })
                        self.passwordChangeform.reset();
                        self.emailChangeform.reset();

                    }
                    else
                    {
                        self.props.setload(false);
                        self.setState({
                            errormessage:true,
                            displaymessage:'Sorry, we could not change your email.'
                        })
                        self.passwordChangeform.reset();
                        self.emailChangeform.reset();
                    }
                })
            }
        }
        else{
            document.getElementById('err-npass').innerHTML="";
            document.getElementById('err-cpass').innerHTML="";
            document.getElementById('err-npass').style.display = "none";
            document.getElementById('err-cpass').style.display = "none";
            
    
            var passpatt = RegExp("^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$");
   
    
            if( this.passwordChangeform.value.currentPassword === '' || this.passwordChangeform.value.newPassword === '' || this.passwordChangeform.value.confirmPassword === '')
            {
                ToastDanger('Error. (*) fields are required');
            }
            else if(passpatt.test(this.passwordChangeform.value.newPassword) === false)
            {
    
                document.getElementById('err-npass').innerHTML="Invalid password format!"
                document.getElementById('err-npass').style.display = "block"
            }
            else if(this.passwordChangeform.value.newPassword !== this.passwordChangeform.value.confirmPassword){
                document.getElementById('err-cpass').innerHTML="Password does not match!"
                document.getElementById('err-cpass').style.display = "block"
            }
            else{
                this.props.setload(true);
                const sendcredentials = 
                {
                    confirmPwd:this.passwordChangeform.value.confirmPassword,
                    emailAddress: '',
                    newPassword: this.passwordChangeform.value.newPassword,
                    updateField: "Update_Password",
                    username:  this.state.username,
                    currPassword: this.passwordChangeform.value.currentPassword
                }
                      
            
                const self = this;
            
                this.props.postPersonalinformationUpdate(sendcredentials).then(function (response) {
            
                    if(response !== undefined && response.data.responseCode === 200)
                    {
                        
                        self.props.setload(false);
                        self.setState({
                            successmessage:true,
                            displaymessage:'Your password has been successfully changed.'
                        })
                        self.passwordChangeform.reset();
                        self.emailChangeform.reset();

                    }
                    else
                    {
                        self.props.setload(false);
                        self.setState({
                            errormessage:true,
                            displaymessage:'Sorry, we could not change your password.'
                        })
                        self.passwordChangeform.reset();
                        self.emailChangeform.reset();
                    }
                })
            }
        }
     
        

    }

    handleInfotabchange(event, data) {
        console.log(data);
        // this.passwordChangeform.reset();
        // this.emailChangeform.reset();
        this.passwordChangeform = FormBuilder.group({
            currentPassword: "",
            newPassword: "",
            confirmPassword:""
        });
    
        this.emailChangeform = FormBuilder.group({
            Password: "",
            newEmail: "",
            confirmEmail:""
        });
        this.setState({
            successmessage:false,
            errormessage:false,
            displaymessage:'',
            tabData:data.activeIndex
        })

    }
    render() {
       

        return (

            <div>
                <Grid columns={1} stackable>
                    <Grid.Row>
                        <Grid.Column id="ttitle" width={14}>
                            <Segment id="Summarybox">
                                <span className="accst">Personal information</span>
                                <a href="mailto:SUPPORT-DEMO@gemalto.com">
                                <span id="helpbox">Help
                            <Icon name='help circle' className="helpdesc" /></span>
                            </a>
                            </Segment>

                            <div id="tmsgbox">
                                {this.state.successmessage === true &&
                                <Message positive>
                                    <div className="tsuccess"><Icon id="tick" name='checkmark' /> </div>
                                    <div>
                                        <Message.Header>Personal information updated!</Message.Header>
                                        <p>{this.state.displaymessage}</p>
                                    </div>
                                </Message>
                                }
                                {this.state.errormessage === true &&
                                <Message negative>
                                        <div className="twarning"><Icon color="red" name='warning sign'/> </div>
                                        <div>
                                        <Message.Header>Update failed!</Message.Header>
                                        <p>{this.state.displaymessage}</p>
                                        </div>
                                </Message>
                                }
                            </div>
                            <Segment className="defaultuiseg">
                                <div id="pi-msg-req" className="pi-common-align">
                                <span><label className="star">*</label>Required</span>
                                </div>
                                <div className="pi-common-align">
                                    <h5>Your current account details</h5>
                                    <div className="pi-currentinfo">
                                        <label className="pi-input">Username:</label>
                                        <span>{store.getState().username}</span>
                                    </div>
                                    <div className="pi-currentinfo">
                                        <label className="pi-input">e-mail address:</label>
 
                                        {store.getState().userEmail === ''  || store.getState().userEmail === null &&
                                                <span>Not specified yet</span> 
                                        }
                                        {store.getState().userEmail !== ''  && store.getState().userEmail !== null &&
                                                <span>{this.state.userEmail}</span>
                                        }
                                    </div>

                                </div>
                                <div id="tmselectlbl" className="pi-common-align">Select the item to be updated</div>
                                
                                <Tab id="tmtab" menu={{ pointing: true }} panes={this.personalInformationTabs} onTabChange={this.handleInfotabchange.bind(this)}/>
                            </Segment>

                                <div className="pi-btngroup">
                                    <Divider/>
                                    <button className="ui grey button" onClick={(e) => this.handlemtcancel(e)}>
                                        Cancel
                                    </button>
                                    <button className="ui blue button btnrightal" onClick={(e) => this.handleUpdatepersonalInfo(e)}>
                                        Update
                                    </button>
                                </div>
                        </Grid.Column>
                    </Grid.Row>
                </Grid>
                
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
        setload:setload,
        postPersonalinformationUpdate:postPersonalinformationUpdate,
        setEmail:setEmail
    }, dispatch)
}
//export default connect(mapStateToProps, matchDispatchToProps)(Personalinformation);
export default withRouter(connect(mapStateToProps, matchDispatchToProps)(Personalinformation));