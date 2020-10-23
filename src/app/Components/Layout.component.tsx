import * as React from 'react';
import {Switch,Route} from "react-router-dom";
import routes from "../Routes/routes";
import Gemaltoheader from './Gemaltohdr.component';
const loginlogo = require('../../img/demologo.png');
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import { withRouter } from 'react-router-dom';
import DemoSidebar from './DemoSidebar.component'
import {store} from '../Store/store';
import {Grid, Icon, Segment} from 'semantic-ui-react'
import {posteziologoutaction, setusername, checklogin,setload} from '../Actions/action';
import 'semantic-ui-css/semantic.min.css';



class Layout extends React.Component<any,any>{
    componentDidMount(){
     
    }

       handleLogoff(e) {
      
        this.props.setload(true);
        const self = this;
        const logusername = store
            .getState()
            .username;
        const sendcredentials = {
            usrnme: logusername
        }
        const loginresetparam = {
            paramusrname: '',
            paramusrrescode: null
        }
        self
            .props
            .posteziologoutaction(sendcredentials)
            .then(function (response) {
                if (response.data.responseCode === 200) {
                    self
                        .props
                        .setusername(loginresetparam);
                    self
                        .props
                        .checklogin(false);
                    self
                        .props
                        .history
                        .push(`/`);
                    self.props.setload(false);
                    window.location.reload(true);
                } else {
                    console.log("error in logout");
                    self.props.setload(false);
                }
            })
    }

    render(){
        return(
            <div>
            <Grid>
               <Grid.Column width={16}>
                  <Segment  className="hdrstylcss brdrmainclass layoutheader">
                     <Gemaltoheader />
                  </Segment>
               </Grid.Column>
            </Grid>
            <Grid columns={2} stackable>
                <Grid.Row stretched>
                    <Grid.Column id="accordstyl" width={3}>
                        <Segment className="accoreditstyl"> <DemoSidebar/> </Segment>
                    </Grid.Column>
                 
                    <Grid.Column width={12}>
                            <Segment className="defaultheaderseg" id="welcomestyl">
                                <span className="rightal">Welcome {store
                                        .getState()
                                        .username}, you are logged on to internet banking
                                    <button
                                        className="ui red button btnal"
                                        role="button"
                                        onClick={(e) => this.handleLogoff(e)}>Log off</button>
                                </span>
                            </Segment>
                            <Segment  className="defaultheaderseg" id="msgstyl">
                                <Icon id="tick" className="msgtick"name='checkmark'/>
                                <span id="msgtxt">No pending transactions</span>
                            </Segment>
                            {
                                this.props.location.pathname === "/layout/accountsummary" &&

                                <Segment  className="defaultheaderseg" id="logonbox">
                                <span id="weltxt">Welcome {store
                                        .getState()
                                        .username}</span><br/>
                                <span>your last log on was successful</span>
                            </Segment>

                            }
        
                        <Segment className="contentdiv">
                            <div id="site-container">
                                <Switch>
                                    {routes.map((route,i)=>{
                                    return <Route key={i} {...route}/>})}
                                </Switch>
                                
                            </div>
                        </Segment>
                         </Grid.Column>
                
                </Grid.Row>
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
        posteziologoutaction: posteziologoutaction,
        setusername: setusername,
        checklogin: checklogin,
        setload:setload
    }, dispatch)
}
export default withRouter(connect(mapStateToProps, matchDispatchToProps)(Layout))