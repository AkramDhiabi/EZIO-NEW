import * as React from 'react';
import {Component} from 'react'
import {Link,withRouter} from 'react-router-dom';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {store} from '../Store/store';
import {getcardlist, posttokenrelease,postCardrelease, posteziologoutaction, setload,setusername,setmycard,checklogin,setHasdevice} from '../Actions/action';
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
    Divider,
    Popup
} from 'semantic-ui-react';
import {BootstrapTable, TableHeaderColumn} from 'react-bootstrap-table';
import {ToastDanger,ToastSuccess} from 'react-toastr-basic';
import 'react-bootstrap-table/css/react-bootstrap-table.css'
import 'react-bootstrap-table/dist/react-bootstrap-table-all.min.css'
import 'semantic-ui-css/semantic.min.css';

class Multifactorauthentication extends React.Component < any,
any > {
    constructor(props) {
        super(props);
        this.state = {
            cardlist: null
        }
    }

    componentWillMount() {

     }

    handlemtcancel(e) {
        e.preventDefault();
        this.props.setHasdevice(true);
        this
            .props
            .history
            .push('/layout/accountsummary');
    }
    handleTonavigation(e,npath)
    {
        e.preventDefault();
        this
            .props
            .history
            .push(npath);
    }

    render() {
        return (
            <div>
                <Grid columns={1} stackable>
                    <Grid.Row>
                        <Grid.Column width={14}>
                            <Segment id="Summarybox">
                                <span className="accst"><Icon name='lock'size='large'/>Manage security</span>
                                <a href="mailto:SUPPORT-DEMO@gemalto.com">
                                <span id="helpbox">Help
                                    <Icon name='help circle' className="helpdesc"/></span>      
                                </a>
                            </Segment>
                        </Grid.Column>
                    </Grid.Row>
                </Grid>
                <Grid className="contentdetail">
                    <Grid.Column width={9}>

                        <Segment className="accdetailsec" attached>
                        <div id="mfa_main">
                            <div className="mfa-sub">
                                <span>Multi-factor authentication</span>
                            </div>
                            <div className="mfa-sub">
                                <span>Status:</span>
                                <button id="mfa_status_off"
                                className="ui red button">
                                Off
                                </button>
                            </div>
                            <div>
                                <span>You must activate a second layer of protection for your most sensitive transactions.</span>
                            </div>

                            <div id="mfa_mobile">
                                <Button
                                    className="snbutton mfa_btnalign"
                                    size="mini"
                                    name="snntify"
                                    onClick={(e) => this.handleTonavigation(e,'/mobileregistration')}>Enroll a mobile now
                                </Button>
                                <Popup trigger={<Icon name='question circle' id="cdhelp"/>} wide>
                                    <Popup.Header>Can be also done here:</Popup.Header>
                                    <Popup.Content>
                                        <span className="atm-popup-span">Authentication -{">"} Mobile activation</span>
                                    </Popup.Content>
                                </Popup>
                            </div>
                        {(store.getState().TokenPro === true || store.getState().TokenActResync === true) && 
                            <div>
                                <Button
                                    className="snbutton mfa_btnalign"
                                    size="mini"
                                    name="snntify"
                                    onClick={(e) => this.handleTonavigation(e,'/layout/tokenmanagement')}>Activate a physical token
                                </Button>
                                <Popup trigger={<Icon name='question circle' id="cdhelp"/>} wide>
                                    <Popup.Header>Can be also done here:</Popup.Header>
                                    <Popup.Content>
                                        <span className="atm-popup-span">Authentication -{">"} Token management</span>
                                    </Popup.Content>
                                </Popup>
                            </div>
                        }

                        <div id="mf-pidesc">
                            <span>Please also make sure a valid email address is specified  in your
                            <Popup trigger={<span className="mf-piLink" onClick={(e) => this.handleTonavigation(e,'/layout/personalinformation')}> Personal information </span>} wide>
                                    <Popup.Content>
                                        <span className="atm-popup-span">Demo services -{">"} Personal information</span>
                                    </Popup.Content>
                                </Popup> section.</span>
                        </div>
                        </div>
                        
                        </Segment>

                    </Grid.Column>
                    <Grid.Column width={14}>
                        <div className="rtbtngroup">
                            <Divider/>
                            <button
                                className="ui blue button btnrightal"
                                onClick={(e) => this.handlemtcancel(e)}>
                                No, thanks
                            </button>
                        </div>

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
        getcardlist: getcardlist,
        setload: setload,
        posttokenrelease: posttokenrelease,
        postCardrelease:postCardrelease,
        posteziologoutaction: posteziologoutaction,
        setusername:setusername,
        setmycard:setmycard,
        checklogin:checklogin,
        setHasdevice:setHasdevice
    }, dispatch)
}

export default withRouter(connect(mapStateToProps, matchDispatchToProps)(Multifactorauthentication));