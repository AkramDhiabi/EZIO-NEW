import * as React from 'react';
import {Component} from 'react'
import {Link} from 'react-router-dom';
import {withRouter} from 'react-router-dom';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {store} from '../Store/store';
import {
    posteziologoutaction,
    setusername,
    checklogin,
    postcheckresetoptions,
    postresetoptions,
    setload
} from '../Actions/action';
import {
    Accordion,
    Button,
    Container,
    Divider,
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

import {ToastDanger} from 'react-toastr-basic';

const CheckboxField = ({checked, onChange}) => {
    return (<input
        type="checkbox"
        checked={checked}
        className="resetcheckbox"
        onChange={ev => onChange(ev.target.checked)}/>);
};

class Resetaccount extends React.Component < any,
any > {
    constructor(props) {
        super(props);
        this.state = {
            username: store
                .getState()
                .username,
            options:null

        };
        this.handleCheckboxChange = this
            .handleCheckboxChange
            .bind(this);

    }

    resetDesc = {
        mobile: "Mobile (unregister and remove all your available mobiles)",
        dcvcards: "DCV physical card (remove all the registered card from you account)",
        physicalTokens: "Physical token (remove all the tokens from your account)",
        riskManagement: "Risk Management (erase all your data, behavioSec profile included)",
        demoData: `Data and setup (reset your preferences and clear your beneficiaries list, transactions and balances)`
    }

    componentWillMount() {
        this
            .props
            .setload(true);
        const resetparam = {
            userId: this.state.username,
            role: store
                .getState()
                .permission
        };
        const self = this;
        this
            .props
            .postcheckresetoptions(resetparam)
            .then(response => {
                console.log(response);
                if (response !== undefined && response.data.responseCode === 200) {
                    const responseResetobject = response.data.templateObject;
                    const doptions = [];
                    Object
                        .keys(responseResetobject)
                        .forEach((token, key) => {
                            console.log(token, responseResetobject[token], key);
                            const dobj = {
                                value: token,
                                checked: false,
                                desc: self.resetDesc[token]
                            };
                            if (responseResetobject[token] == true) {
                                doptions.push(dobj);
                            }
                            if (key == Object.keys(responseResetobject).length - 1) {
                                self.setState({options: doptions});
                                console.log(doptions);
                            }
                        });
                    self
                        .props
                        .setload(false);
                } else if (response !== undefined && response.data.responseCode === 204) {
                    self.setState({options: []});
                    self
                        .props
                        .setload(false);
                } else {
                    console.log("error");
                    self.setState({options: 'undefined'});
                    //ToastDanger('Server Error');
                    self
                        .props
                        .setload(false);
                }
            });
    }

    handleLogoff(e) {
        console.log(e.target);
        const self = this;
        const logusername = store
            .getState()
            .username;
        const sendcredentials = {
            usrnme: logusername
        };
        const loginresetparam = {
            paramusrname: '',
            paramusrrescode: null
        };
        self
            .props
            .posteziologoutaction(sendcredentials)
            .then(response => {
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
                        .push("/");
                    window.location.reload(true);
                } else {
                    console.log("error in logout");
                }
            });
    }

    handleCheckboxChange(checked, option) {
        const options = this.state.options;
        const rOptions = options.slice();
        for (const i in rOptions) {
            if (rOptions[i].value == option.value) {
                rOptions[i].checked = checked;
            }
        }
        this.setState({
            options: rOptions
        }, () => {
            return console.log(options);
        });
    }

    handleresetaccount(e) {
        e.preventDefault();
        this
            .props
            .setload(true);
        console.log(this.state);
        const resetobj = {};
        const trueoptions = this
            .state
            .options
            .filter(option => {
                return option.checked == true;
            });
        if (trueoptions.length > 0) {
            this
                .state
                .options
                .map(option => {
                    resetobj[option.value] = option.checked;
                });
            const self = this;
            resetobj['userId'] = self.state.username;
            console.log("reset obj", resetobj)
            this
                .props
                .postresetoptions(resetobj)
                .then(response => {
                    console.log(response);
                    if (response !== undefined && response.data.responseCode === 200) {
                        self
                            .props
                            .setload(false);
                        self.handleLogoff(e);
                    } else {
                        console.log("error in reset");
                        self
                            .props
                            .setload(false);
                        ToastDanger('Error in reset');
                    }
                });
            console.log(resetobj);
        } else {
            this
                .props
                .setload(false);
            ToastDanger('At least one item must be selected.');
        }
    }

    handlemtcancel(e) {
        e.preventDefault();
        this
            .props
            .history
            .push('/layout/accountsummary');
    }

    render() {
        const options = this.state.options;
        return (

            <div>
                <Grid columns={1} stackable>
                    <Grid.Row>
                    <Grid.Column id="ttitle" width={14}>
                            <Segment id="Summarybox" className="defaultuiseg resettitle">
                                <span className="accst">Reset Account</span>
                                <a href="mailto:SUPPORT-DEMO@gemalto.com">
                                <span id="helpbox">Help
                                    <Icon name='help circle' className="helpdesc"/></span>
                                </a>
                            </Segment>
                            </Grid.Column>
                     

                        {options && options.length > 1 && <Grid.Column id="ttitle" width={14}>
                            <Segment className="defaultuiseg">
                                <Message negative>
                                    <div className="twarning"><Icon color="red" name='warning sign'/>
                                    </div>
                                    <div>
                                        <Message.Header>Please be aware!</Message.Header>
                                        <p>This operation cannot be undone. You will be logged off once the operation is
                                            completed.</p>
                                    </div>
                                </Message>
                                <Header as='h5' className="rtdetailheader" attached='top'>
                                    Reset options
                                </Header>
                                <Segment id="resetsection" attached>
                                    <div>Select items you want to reset and click on the
                                        <span id="resettxt">Reset</span>button</div>
                                    <form id="resetform">
                                        {options.map(option => {
                                            return (
                                                <label>
                                                    <CheckboxField
                                                        key={option.value}
                                                        checked={option.checked}
                                                        onChange={value => this.handleCheckboxChange(value, option)}/> {option.desc}
                                                    <span className="inputcheckmark"></span>
                                                </label>
                                            )

                                        })
}
                                    </form>
                                </Segment>
                                <div className="rtbtngroup">
                                    <Divider/>
                                    <button className="ui grey button" onClick={(e) => this.handlemtcancel(e)}>
                                        Cancel
                                    </button>
                                    <button
                                        className="ui blue button btnrightal"
                                        onClick={(e) => this.handleresetaccount(e)}>
                                        Reset
                                    </button>
                                </div>

                            </Segment>
                        </Grid.Column>
}
                        {options !== null && options.length < 2 && <Grid.Column id="ttitle" width={14}>
                        
                        
                            <Segment className="defaultuiseg">
                                <div id="ltnodevice">
                                    Sorry, there is nothing to be reset.
                                </div>
                                <div className="rtbtngroup">
                                    <Divider/>
                                    <button className="ui grey button" onClick={(e) => this.handlemtcancel(e)}>
                                        Cancel
                                    </button>
                                </div>   
                            </Segment>
                        </Grid.Column>
}

                        {options !== null && options === 'undefined' && <Grid.Column id="ttitle" width={14}>
                       
                            <Segment className="defaultuiseg">
                                <div id="ltnodevice">
                                    Sorry, there is a server error.
                                </div>
                                <div className="rtbtngroup">
                                    <Divider/>
                                    <button className="ui grey button" onClick={(e) => this.handlemtcancel(e)}>
                                        Cancel
                                    </button>
                                </div>
                            </Segment>
                        </Grid.Column>
}

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
        postcheckresetoptions: postcheckresetoptions,
        postresetoptions: postresetoptions,
        setload: setload
    }, dispatch);
}

export default withRouter(connect(mapStateToProps, matchDispatchToProps)(Resetaccount));
