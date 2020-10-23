import * as React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { Divider, Input, Icon, Message, Table } from 'semantic-ui-react';
import { bindActionCreators } from 'redux';

import { FormBuilder, FieldControl, FieldGroup } from "react-reactive-form";
import { setcurrenttokenstep, setload } from "../Actions/action";

import { ToastDanger } from 'react-toastr-basic';

class ConfirmYourID extends React.Component<any, any>{

    constructor(props) {
        super(props);
        this.handletokensubmit = this.handletokensubmit.bind(this);
        this.keyPressed = this.keyPressed.bind(this);
        this.state ={
            userInfo: [
                {login: "DemoUser", password: "zdj552JWV"},
                {login: "DemoUser2", password: "egh472BJA"},
                {login: "Gemalto", password: "alb672BOK"},
            ],
            errormessage:false
        }
    }
   
    componentWillMount() {
        this.props.setload(false); 
    }

    tokenform = FormBuilder.group({
        login: "",
        password: "",
    });
    
    keyPressed(event) {
        if (event.key === "Enter") { 
            this.handletokensubmit(null);
        }
    }

    handletokensubmit(e: React.MouseEvent<HTMLButtonElement>) {
        if(e){e.preventDefault();} 
        this.setState({
            errormessage:false
        })

        if(this.tokenform.value.login === this.state.userInfo[0].login && this.tokenform.value.password === this.state.userInfo[0].password || 
            this.tokenform.value.login === this.state.userInfo[1].login && this.tokenform.value.password === this.state.userInfo[1].password ||
            this.tokenform.value.login === this.state.userInfo[2].login && this.tokenform.value.password === this.state.userInfo[2].password) 
        {
            var setTokendetails={
                currenttokenstep:2,
                transferDetail: this.tokenform.value,
            }
            this.props.setcurrenttokenstep(setTokendetails);
        }
        else if(this.tokenform.value.login == "" || this.tokenform.value.password == "" )
            {
                ToastDanger('Error. (*) fields are required');
            } 
        else {
            this.setState({
                errormessage:true
            })
        }    
    }

    print() {

        var elementId = "passw";
        var inputElement = (document.getElementById(elementId)as HTMLInputElement).type;

        if (inputElement === "password") {
            (document.getElementById(elementId)as HTMLInputElement).type = 'text';
        } else {
            (document.getElementById(elementId)as HTMLInputElement).type = 'password';
        }
    }

    handlemtcancel(e) {
        e.preventDefault();
        this.props.history.push('/layout/accountsummary');
    }

    render() {
        return (
            <div>
                 {this.state.errormessage === true &&
                    <Message negative>
                        <div className="twarning"><Icon color="red" name='warning sign'/> </div>
                        <div>
                        <Message.Header>Invalid login or password!</Message.Header>
                        <p>Overdraft not authorized</p>
                        </div>
                    </Message>
                }
                   
                <span className="addfontsize"><span className="font-weight-bold">Step 1</span> of 4:  Enter your login and password</span>
                <span className="mtrequirelabel"><label className="star">*</label>indicates a required field</span>
                <div className="tmplbrdrcls addmargin"></div>

                <FieldGroup control={this.tokenform} render={({ pristine, value }) => (
                    <form className="etform tokenform" onSubmit={() => this.handletokensubmit}>
                        <Table className="rttable " singleLine basic='very' unstackable>
                            <Table.Body>
                                <Table.Row>
                                    <Table.Cell>
                                        <label className="pwdusr">Login<label className="star">*</label></label>
                                    </Table.Cell>
                                    <Table.Cell>
                                        <FieldControl name="login" render={({ handler }) => (
                                            <div>
                                                <input placeholder="Enter your login" {...handler()} onKeyDown={this.keyPressed}/> 
                                            </div>
                                        )} />
                                    </Table.Cell>
                                </Table.Row>
                                <Table.Row>
                                <Table.Cell>
                                        <label className="pwdusr">Password<label className="star">*</label></label>
                                    </Table.Cell>
                                    <Table.Cell>
                                        <FieldControl name="password" render={({ handler }) => (
                                            <div>
                                                <Input placeholder="Enter your password" 
                                                  id='passw'
                                                  type='password'
                                                  icon={< Icon name = 'eye' link onClick = {this.print}/>}
                                                  maxLength={40} {...handler()}
                                                  onKeyDown={this.keyPressed}/> 
                                            </div>
                                        )} />
                                    </Table.Cell>
                                </Table.Row>
                            </Table.Body>
                        </Table>
                    </form>
                )} />
               
                <div>
                <Divider/>
                    <button className="ui grey button" onClick={(e) => this.handlemtcancel(e)}> Cancel
                        </button>
                    <button className="ui blue button btnrightal" onClick={(e) => this.handletokensubmit(e)}> Continue
                        </button>
                </div>
            </div>
        )
    }
}

function matchDispatchToProps(dispatch) {
    return bindActionCreators({
        setcurrenttokenstep: setcurrenttokenstep,
        setload:setload
    }, dispatch)
}

export default withRouter(connect(null, matchDispatchToProps)(ConfirmYourID));

