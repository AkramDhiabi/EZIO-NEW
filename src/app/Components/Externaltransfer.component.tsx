import * as React from 'react';
import { Component } from 'react'
import { Link } from 'react-router-dom';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { store } from '../Store/store';
import { getaccountData, posteziologoutaction, setusername, checklogin,setcurrenttransferstep,setaccountlist } from '../Actions/action';
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
import ExtEntertransferdetails from './ExtEntertransferdetails.component';
import Reviewtransferdetails from './Reviewtransferdetails.component';
import Validatetransferdetails from './Validatetransferdetails.component';
import Completetransfer from "./Completetransfer.component";

import 'semantic-ui-css/semantic.min.css';

class Externaltransfer extends React.Component<any, any> {
    constructor(props) {
        super(props);

        this.state={
            currenttransferstep: store.getState().currenttransferstep
        }

    }



 
    componentWillMount() {
        store.subscribe(() => {
            this.setState({
                currenttransferstep: store.getState().currenttransferstep,
            });
        });

    }

    componentWillUnmount(){
        var setdefault={
            currentstep:1,
            transferDetail:null
        }
        this.props.setcurrenttransferstep(setdefault);

        this.props.setaccountlist({
            fromList :null,
            toList   :null
        })
    }
    render() {

        return (

            <div>
                <Grid columns={1} stackable>
                    <Grid.Row>
                      

                        <Grid.Column id="ttitle" width={14}>
                            <Segment id="Summarybox">
                                <span className="accst">External transfer</span>
                                <a href="mailto:SUPPORT-DEMO@gemalto.com">
                                <span id="helpbox">Help
                                <Icon name='help circle' className="helpdesc" /></span>
                                </a>
                            </Segment>
                            <Segment className="defaultuiseg">
                                <Step.Group size='mini'>
                                    <Step active={this.state.currenttransferstep === 1} title='Enter transfer details'/>
                                    <Step active={this.state.currenttransferstep === 2} title='Review transfer details'/>
                                    <Step active={this.state.currenttransferstep === 3} title='Validate transfer details'/>
                                    <Step active={this.state.currenttransferstep === 4} title='Complete'/>
                                </Step.Group>
                                {this.state.currenttransferstep === 1 &&
                                <Segment className="mtcontent" attached>
                                    <ExtEntertransferdetails/>
                                    
                                </Segment>
                                }
                                {this.state.currenttransferstep === 2 &&
                                <Segment className="mtcontent" attached>
                                   <Reviewtransferdetails />
                                    
                                </Segment>
                                }
                                {this.state.currenttransferstep === 3 &&
                                <Segment className="mtcontent" attached>
                                   <Validatetransferdetails /> 
                                </Segment>
                                }
                                {this.state.currenttransferstep === 4 &&
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
        currenttransferstep:state.currenttransferstep
    }
}
function matchDispatchToProps(dispatch) {
    return bindActionCreators({
        posteziologoutaction: posteziologoutaction,
        setcurrenttransferstep:setcurrenttransferstep,
        setusername:setusername,
        checklogin:checklogin,
        setaccountlist:setaccountlist
    }, dispatch)
}
//export default connect(mapStateToProps, matchDispatchToProps)(Domestictransfer)
export default withRouter(connect(mapStateToProps, matchDispatchToProps)(Externaltransfer));