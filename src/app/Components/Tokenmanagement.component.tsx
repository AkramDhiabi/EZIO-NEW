import * as React from 'react';
import { Component } from 'react'
import { Link } from 'react-router-dom';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { store } from '../Store/store';
import { getaccountData,posteziologoutaction,setusername,checklogin,setload } from '../Actions/action';
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
import 'semantic-ui-css/semantic.min.css';

const tokendev = require('../../img/tokendevice.png');

import Tokenactivation from './Tokenactivation.component';
import Tokenprovision from './Tokenprovision.component';
import Tokenresynchronisation from "./Tokenresynchronisation.component";


const initialpanes = [
    {
      menuItem: 'Provisioning', 
      render: () =>
        <Tab.Pane attached={false}>
          <Tokenprovision/>
        </Tab.Pane>
    },
    {
      menuItem: 'Activation', render: () =>
        <Tab.Pane attached={false}>
          <Tokenactivation/>
        </Tab.Pane>
    },
    {
      menuItem: 'Resynchronization',
      render: () =>
        <Tab.Pane attached={false}>
         <Tokenresynchronisation/>
        </Tab.Pane>
    }
  ]
const  tactsync = [
    {
      menuItem: 'Activation', render: () =>
        <Tab.Pane attached={false}>
          <Tokenactivation/>
        </Tab.Pane>
    },
    {
      menuItem: 'Resynchronization',
      render: () =>
        <Tab.Pane attached={false}>
         <Tokenresynchronisation/>
        </Tab.Pane>
    }
  ] 
  const  tpro = [
    {
      menuItem: 'Provisioning', render: () =>
        <Tab.Pane attached={false}>
          <Tokenprovision/>
        </Tab.Pane>
    }
  ] 
  
var finaltokenpanes =[];

class Tokenmanagement extends React.Component<any,any> {


   
    
    componentWillMount() {

    }
    componentDidMount() {
        this.props.setload(true);
        this.props.setload(false);
        
            if(document.getElementsByClassName('menu')[0].children.length === 3)
            {
                document.getElementsByClassName('menu')[0].children[0].className += " inactiveLink";
            }    
    }

    handleTokentabchange(event, data) {
        console.log(data);
    }
    render() {
        if(store.getState().TokenPro === false){
           
            finaltokenpanes = tactsync;
        }else if(store.getState().TokenActResync === false){
        
            finaltokenpanes = tpro;
        }
        else{
            finaltokenpanes = initialpanes;
        }

        return (

            <div>
                <Grid columns={1} stackable>
                    <Grid.Row>
                        <Grid.Column id="ttitle" width={14}>
                            <Segment id="Summarybox">
                                <span className="accst">Token management</span>
                                <a href="mailto:SUPPORT-DEMO@gemalto.com">
                                <span id="helpbox">Help
                            <Icon name='help circle' className="helpdesc" /></span>
                            </a>
                            </Segment>
                            {
                                finaltokenpanes.length < 3 &&
                                <Segment className="defaultuiseg">
                                <div id="tmselectlbl">Select operation</div>
                                <Tab id="tmtab" menu={{ pointing: true }} panes={finaltokenpanes}/>
                                </Segment>
                            }
                             {
                                finaltokenpanes.length > 2 &&
                                <Segment className="defaultuiseg">
                                <div id="tmselectlbl">Select operation</div>
                                <Tab id="tmtab"  defaultActiveIndex={1} menu={{ pointing: true }} panes={finaltokenpanes} onTabChange={this.handleTokentabchange.bind(this)}/>
                                </Segment>
                            }
                           
                            {
                                finaltokenpanes.length === 1 &&
                                <Segment className="defaultuiseg">
                                <Tokenprovision/>
                                </Segment>
                               
                            }
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
        posteziologoutaction:posteziologoutaction,
        setusername:setusername,
        checklogin:checklogin,
        setload:setload
    }, dispatch)
}
//export default connect(mapStateToProps, matchDispatchToProps)(Tokenmanagement);
export default withRouter(connect(mapStateToProps, matchDispatchToProps)(Tokenmanagement));