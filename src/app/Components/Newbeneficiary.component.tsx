import * as React from 'react';
import { Component } from 'react'
import { Link } from 'react-router-dom';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { store } from '../Store/store';
import { posteziologoutaction, setusername, checklogin,setcurrentbeneficiarystep,setaccountlist } from '../Actions/action';
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
    Tab
} from 'semantic-ui-react';
import { FormBuilder, FieldControl, FieldGroup } from "react-reactive-form";
import Enterbeneficiarydetails from './Enterbeneficiarydetails.component';
import Reviewbeneficiarydetails from './Reviewbeneficiarydetails.component';
import Validatetransferdetails from './Validatetransferdetails.component';
import Completetransfer from "./Completetransfer.component";

import 'semantic-ui-css/semantic.min.css';

class Newbeneficiary extends React.Component<any, any> {
    constructor(props) {
        super(props);

        this.state={
            currentbeneficiarystep: store.getState().currentbeneficiarystep
        }

    }


   
    componentWillMount() {
        store.subscribe(() => {
            this.setState({
                currentbeneficiarystep: store.getState().currentbeneficiarystep,
            });
        });

    }

    componentWillUnmount(){
        var setdefault={
            currentstep:1,
            beneficiaryDetail:null
        }
        this.props.setcurrentbeneficiarystep(setdefault);

    }
    render() {

        return (

            <div>
                <Grid columns={1} stackable>
                    <Grid.Row>
                       
                        <Grid.Column id="ttitle" width={14}>
                            <Segment id="Summarybox">
                                <span className="accst">Add a new beneficiary</span>
                                <a href="mailto:SUPPORT-DEMO@gemalto.com">
                                <span id="helpbox">Help
                                <Icon name='help circle' className="helpdesc" /></span>
                                </a>
                            </Segment>
                            <Segment className="defaultuiseg">
                                <Step.Group size='mini'>
                                    <Step active={this.state.currentbeneficiarystep === 1} title='Enter beneficiary details'/>
                                    <Step active={this.state.currentbeneficiarystep === 2} title='Review beneficiary details'/>
                                    <Step active={this.state.currentbeneficiarystep === 3} title='Validate beneficiary details'/>
                                    <Step active={this.state.currentbeneficiarystep === 4} title='Complete'/>
                                </Step.Group>
                                {this.state.currentbeneficiarystep === 1 &&
                                <Segment className="mtcontent" attached>
                                    <Enterbeneficiarydetails/>
                                    
                                </Segment>
                                }
                                {this.state.currentbeneficiarystep === 2 &&
                                <Segment className="mtcontent" attached>
                                   <Reviewbeneficiarydetails />
                                    
                                </Segment>
                                }
                                {this.state.currentbeneficiarystep === 3 &&
                                <Segment className="mtcontent" attached>
                                   <Validatetransferdetails /> 
                                </Segment>
                                }
                                {this.state.currentbeneficiarystep === 4 &&
                                <Segment className="mtcontent" attached>
                                   <Completetransfer/>
                                </Segment>
                                }

                            </Segment>
                        </Grid.Column>
                    </Grid.Row>
                </Grid>

            </div>
        )
    }
}

function mapStateToProps(state) {
    return {
        currentbeneficiarystep:state.currentbeneficiarystep
    }
}
function matchDispatchToProps(dispatch) {
    return bindActionCreators({
        posteziologoutaction: posteziologoutaction,
        setcurrentbeneficiarystep:setcurrentbeneficiarystep,
        setusername:setusername,
        checklogin:checklogin
    }, dispatch)
}
//export default connect(mapStateToProps, matchDispatchToProps)(Domestictransfer)
export default withRouter(connect(mapStateToProps, matchDispatchToProps)(Newbeneficiary));