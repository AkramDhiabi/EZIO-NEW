import * as React from 'react';
import { connect } from 'react-redux';
import { store } from '../Store/store';
import { Provider } from 'react-redux';
import { Link } from 'react-router-dom';
import { withRouter } from 'react-router-dom';
import { Accordion, Button, Container, Loader, Dimmer, Advertisement, Tab, Grid, Header, Icon, Image, Item, Label, Menu, Segment, Step, Table, Form, Modal } from 'semantic-ui-react';
import { bindActionCreators } from 'redux';

const loginlogo = require('../../img/demologo.png');
const loginbackground = require('../../img/loginbackground.jpg');

import { FormBuilder, FieldControl, FieldGroup } from "react-reactive-form";
import * as ReactCountdownClock from "react-countdown-clock";
import { postAuthenticate, checklogin, postusercheckpendingstatus, setcurrenttransferstep, postusersendnotificationstatus, postusersgetcallbackstatus, postuserdeletecallbackdataaction, setsnerrtype, postusersdeletependingtransactionstatus, setload } from "../Actions/action";

import { ToastDanger } from 'react-toastr-basic';
import Offlinevalidationmt from './Offlinevalidationmt.component';
import Sendnotificationmt from './Sendnotificationmt.component';


class Validatetransferdetails extends React.Component<any, any>{

    constructor(props) {
        super(props);
        this.state = {
            username: store.getState().username,
            validationconfiguration:store.getState().validationconfiguration
        }

    }
    mobilepanes = [
        {
            menuItem: 'Online validation', render: () =>
                <Tab.Pane attached={false}>
                    <Sendnotificationmt />
                </Tab.Pane>
        },
        {
            menuItem: 'Offline validation', render: () =>
                <Tab.Pane attached={false}>
                    <Offlinevalidationmt />
                </Tab.Pane>
        }
    ]

    componentDidMount() {
       
    }


    handlestep(e) {

        this.props.setcurrenttransferstep(4);

    }


    render() {
        return (
            <div className="mttemplatecls">
                <span className="addfontsize">Step 3 of 4: Validate</span>
                <span className="mtrequirelabel"><label className="star">*</label>indicates a required field</span>
                <div className="tmplbrdrcls addmargin"></div>
                {(this.state.validationconfiguration.data.templateObject.mobileSupported == true) &&
                     <div id="mtvalidatesection">
                         <div className="logsecfnt">Select validation mode</div>
                        <Tab id="mttab" menu={{ pointing: true }}  panes={this.mobilepanes} />
                    </div>
                }
                {(this.state.validationconfiguration.data.templateObject.mobileSupported == false) &&

                    <Offlinevalidationmt />
                }
                {/* <div>
                    <button className="ui grey button"> Cancel</button>
                    <button className="ui blue button btnrightal" onClick={(e) => this.handlestep(e)}> Continue</button>
                </div> */}
            </div>
        )
    }


}


function mapStateToProps(state) {
    return {
        username: state.username,
        validationconfiguration:state.validationconfiguration
    }
}
function matchDispatchToProps(dispatch) {
    return bindActionCreators({
        setcurrenttransferstep: setcurrenttransferstep

    }, dispatch)
}

export default withRouter(connect(mapStateToProps, matchDispatchToProps)(Validatetransferdetails));

