import * as React from 'react';
import {Component} from 'react'
import {Link} from 'react-router-dom';
import {withRouter} from 'react-router-dom';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {store} from '../Store/store';
import {
    setload,
    getUserpreferenceaction,
    postUserpreferenceaction,
    postuserriskpreferencedetailsaction
} from '../Actions/action';
import {
    Accordion,
    Button,
    Container,
    Divider,
    Grid,
    Header,
    Icon,
    Item,
    Label,
    Menu,
    Segment,
    Table,
    Message,
    Tab,
    Dropdown,
    Radio,
    Form
} from 'semantic-ui-react';
const ToggleButton = require('react-toggle-button')

import { ToastDanger, ToastSuccess } from 'react-toastr-basic';

class Userpreferences extends React.Component<any,
    any> {
    constructor(props) {
        super(props);
        this.state = {
            username: store
                .getState()
                .username,
            securityvalue: 0,
            currentmodelabel: '',
            webnotification: null,
            mobilebanking: null,
            currencychoice: null,
            domestictransfer: null,
            othertransfer: null,
            addbeneficiary: null,
            ecommerce3ds: null,
            p2pnotification: null,
            disabledmode: false
        };

    }

    componentWillMount() {

        this.props.setload(true);
        const senddata = {
            userId: store.getState().username
        }

        const self = this;
        this
            .props
            .getUserpreferenceaction(senddata)
            .then(function (response) {
                console.log(response);
                if (response !== undefined && response.data.responseCode === 200) {
                    console.log(response);
                    self.setState({
                        securityvalue: response.data.templateObject.sec_mode,
                        webnotification: response.data.templateObject.web_notification,
                        mobilebanking: response.data.templateObject.mobile_banking,
                        currencychoice: response.data.templateObject.currency_choice,
                        domestictransfer: response.data.templateObject.sec_txownacc,
                        othertransfer: response.data.templateObject.sec_txother,
                        addbeneficiary: response.data.templateObject.sec_addpayee,
                        ecommerce3ds: response.data.templateObject.sec_ecommerce3ds,
                        p2pnotification: response.data.templateObject.p2p_notification,
                        currentsetting: response.data.templateObject

                    });

                    if (response.data.templateObject.sec_mode === 0) {
                        self.setState({ currentmodelabel: "Security relaxed policy settings", disabledmode: true });
                    }
                    else {

                        self.setState({ currentmodelabel: "Security anxious policy settings", disabledmode: false });
                    }

                    self
                        .props
                        .setload(false);
                } else if (response !== undefined && response.data.responseCode === 204) {
                    console.log(response);
                    self
                        .props
                        .setload(false);
                } else {
                    console.log(response);
                    self
                        .props
                        .setload(false);
                    console.log('Server Error');
                }
            })

    }

    externaloptions = [
        {
            text: '2FA',
            value: '02',
        }
    ]

    ownoptions = [
        {
            text: '1FA',
            value: '01',
        },
        {
            text: '2FA',
            value: '02',
        }
    ]

    notificationoptions = [
        {
            text: 'OFF',
            value: '01',
        },
        {
            text: 'ON',
            value: '02',
        }
    ]

    currenciesvalue = [
        {
            text: 'AUD',
            value: '02',
        },
        {
            text: 'CAD',
            value: '03',
        },
        {
            text: 'CHF',
            value: '04',
        },
        {
            text: 'CNH',
            value: '05',
        },
        {
            text: 'EUR',
            value: '06',
        },
        {
            text: 'GBP',
            value: '07',
        },
        {
            text: 'HKD',
            value: '08',
        },
        {
            text: 'USD',
            value: '01'
        }
    ]
    webnotificationoptions = [
        {
            text: 'OFF',
            value: '01',
        }
    ]
    handlemtcancel(e) {
        e.preventDefault();
        this
            .props
            .history
            .push('/layout/accountsummary');
    }


    handleRadioChange(e, { name, value }) {
        this.setState({ securityvalue: value });
        if (value === 0) {
            // document
            // .getElementById("greyoutsection")
            // .classList
            // .remove("user-prefer-greyoutdisable");
            this.setState({
                disabledmode: true
            })
            this.setState({ currentmodelabel: "Security relaxed policy settings" });
        }
        else {
            // document
            // .getElementById("greyoutsection")
            // .classList
            // .add("user-prefer-greyoutdisable");

            this.setState({
                disabledmode: false
            })
            this.setState({ currentmodelabel: "Security anxious policy settings" });
        }
    }

    handleuserpreferChange(e, evalue, property) {
        this.setState({ [property]: evalue.value });
        console.log(this.state);
    }
    handlepreferenceupdate(e) {
        e.preventDefault();

        var senddata = {
            "uId": this.state.currentsetting.uId,
            "userId": this.state.currentsetting.userId,
            "status": this.state.currentsetting.status,
            "updated_date": this.state.currentsetting.updated_date,
            "sec_login": this.state.currentsetting.sec_login,
            "sec_mode": this.state.securityvalue,
            "sec_txownacc": this.state.domestictransfer,
            "sec_txother": this.state.othertransfer,
            "sec_addpayee": this.state.addbeneficiary,
            "sec_ecommerce3ds": this.state.ecommerce3ds,
            "p2p_notification": this.state.p2pnotification,
            "web_notification": this.state.webnotification,
            "mobile_banking": this.state.mobilebanking,
            "currency_choice": this.state.currencychoice
        }
        const self = this;
        this
            .props
            .postUserpreferenceaction(senddata)
            .then(function (response) {
                console.log(response);
                if (response !== undefined && response.data.responseCode === 200) {
                    console.log(response);
                    ToastSuccess('Status updated successfully');
                    self
                        .props
                        .setload(false);
                } else if (response !== undefined && response.data.responseCode === 417) {
                    console.log(response);
                    self
                        .props
                        .setload(false);
                    ToastDanger('Expectation Failed,status not updated.');
                } else {

                    self
                        .props
                        .setload(false);
                    ToastDanger('Internal server error.');
                    console.log('Error');
                }
            });
        this
            .props
            .postuserriskpreferencedetailsaction(senddata)
            .then(function (response) {
                console.log(response);
            });

    }
    render() {

        return (

            <div>
                <Grid columns={1} stackable>
                    <Grid.Row>
                        <Grid.Column id="ttitle" width={14}>
                            <Segment id="Summarybox" className="defaultuiseg resettitle">
                                <span className="accst">User preferences
                                </span>
                                <a href="mailto:SUPPORT-DEMO@gemalto.com">
                                    <span id="helpbox">Help
                                    <Icon name='help circle' className="helpdesc" /></span>
                                </a>
                            </Segment>
                        </Grid.Column>

                        <Grid.Column id="ttitle" width={14}>

                            <Form>
                                <Form.Field className="user-prefer-security-label">
                                    Select security mode
                                </Form.Field>
                                <div id="user-prefer-radiogroup">
                                    <Form.Field>
                                        <Radio
                                            label='Security relaxed'
                                            name='radioGroup'
                                            value={0}
                                            checked={this.state.securityvalue === 0}
                                            onChange={this.handleRadioChange.bind(this)}
                                        />
                                    </Form.Field>
                                    <Form.Field>
                                        <Radio
                                            label='Security anxious'
                                            name='radioGroup'
                                            value={1}
                                            checked={this.state.securityvalue === 1}
                                            onChange={this.handleRadioChange.bind(this)}
                                        />
                                    </Form.Field>
                                </div>
                            </Form>
                            <div>
                                <div>
                                    <span id="user-prefer-modelabel">{this.state.currentmodelabel}</span>
                                    <Header as='h5' className="rtdetailheader" attached='top'>
                                        Login security
                                </Header>
                                    <Segment id="resetsection" className="mgblock" attached>
                                        <Table className="rttable user-prefer-table" celled padded>
                                            <Table.Body>

                                                <Table.Row>
                                                    <Table.Cell className="user-prefer-labelalign">
                                                        Web notification
                                                </Table.Cell>
                                                    <Table.Cell className="ecomm-border" key={this.state.webnotification}>
                                                        <Dropdown name="webnotification" className="etdropdown user-prefer-dropdown" disabled={this.state.disabledmode} defaultValue={this.state.webnotification} selection onChange={(e, value) => this.handleuserpreferChange(e, value, 'webnotification')} options={this.webnotificationoptions} />

                                                    </Table.Cell>
                                                </Table.Row>
                                                <Table.Row>
                                                    <Table.Cell className="user-prefer-labelalign">
                                                        Mobile banking
                                                </Table.Cell>
                                                    <Table.Cell className="ecomm-border" key={this.state.mobilebanking}>
                                                        <Dropdown name="mobilebanking" className="etdropdown user-prefer-dropdown" disabled={this.state.disabledmode} defaultValue={this.state.mobilebanking} selection onChange={(e, value) => this.handleuserpreferChange(e, value, 'mobilebanking')} options={this.notificationoptions} />

                                                    </Table.Cell>
                                                </Table.Row>
                                            </Table.Body>
                                        </Table>

                                    </Segment>

                                    <Header as='h5' className="rtdetailheader" attached='top'>
                                        Money transfers
                                </Header>
                                    <Segment id="resetsection" className="mgblock" attached>

                                        <Table className="rttable user-prefer-table" celled padded>
                                            <Table.Body>

                                                <Table.Row>
                                                    <Table.Cell className="user-prefer-labelalign">
                                                        Domestic transfers
                                                </Table.Cell>
                                                    <Table.Cell className="ecomm-border" key={this.state.domestictransfer}>

                                                        <Dropdown name="domestictransfer" className="etdropdown user-prefer-dropdown" disabled={this.state.disabledmode} defaultValue={this.state.domestictransfer} selection onChange={(e, value) => this.handleuserpreferChange(e, value, 'domestictransfer')} options={this.ownoptions} />


                                                    </Table.Cell>
                                                </Table.Row>
                                                <Table.Row>
                                                    <Table.Cell className="user-prefer-labelalign">
                                                        Other transfers
                                                </Table.Cell>
                                                    <Table.Cell className="ecomm-border" key={this.state.othertransfer}>
                                                        <Dropdown name="othertransfer" className="etdropdown user-prefer-dropdown" disabled={this.state.disabledmode} defaultValue={this.state.othertransfer} selection onChange={(e, value) => this.handleuserpreferChange(e, value, 'othertransfer')} options={this.externaloptions} />

                                                    </Table.Cell>
                                                </Table.Row>
                                                <Table.Row>
                                                    <Table.Cell className="user-prefer-labelalign">
                                                        Currencies
                                                </Table.Cell>
                                                    <Table.Cell className="ecomm-border" key={this.state.currencychoice}>

                                                        <Dropdown name="currencychoice" className="etdropdown user-prefer-dropdown" disabled={this.state.disabledmode} defaultValue={this.state.currencychoice} selection onChange={(e, value) => this.handleuserpreferChange(e, value, 'currencychoice')} options={this.currenciesvalue} />


                                                    </Table.Cell>
                                                </Table.Row>
                                            </Table.Body>
                                        </Table>

                                    </Segment>

                                    <Header as='h5' className="rtdetailheader" attached='top'>
                                        Other operations
                                </Header>
                                    <Segment id="resetsection" className="mgblock" attached>

                                        <Table className="rttable user-prefer-table" celled padded>
                                            <Table.Body>

                                                <Table.Row>
                                                    <Table.Cell className="user-prefer-labelalign">
                                                        Add a new beneficiary
                                                </Table.Cell>
                                                    <Table.Cell className="ecomm-border" key={this.state.addbeneficiary}>

                                                        <Dropdown name="addbeneficiary" className="etdropdown user-prefer-dropdown" disabled={this.state.disabledmode} defaultValue={this.state.addbeneficiary} selection onChange={(e, value) => this.handleuserpreferChange(e, value, 'addbeneficiary')} options={this.externaloptions} />

                                                    </Table.Cell>
                                                </Table.Row>
                                                <Table.Row>
                                                    <Table.Cell className="user-prefer-labelalign">
                                                        eCommerce 3DS
                                                </Table.Cell>
                                                    <Table.Cell className="ecomm-border" key={this.state.ecommerce3ds}>

                                                        <Dropdown name="ecommerce3DS" className="etdropdown user-prefer-dropdown" disabled={this.state.disabledmode} defaultValue={this.state.ecommerce3ds} selection onChange={(e, value) => this.handleuserpreferChange(e, value, 'ecommerce3ds')} options={this.ownoptions} />

                                                    </Table.Cell>
                                                </Table.Row>
                                                {
                                                    store.getState().P2P == true &&

                                                    <Table.Row>
                                                        <Table.Cell className="user-prefer-labelalign">
                                                            P2P notification
                                                </Table.Cell>
                                                        <Table.Cell className="ecomm-border" key={this.state.p2pnotification}>

                                                            <Dropdown name="P2Pnotification" className="etdropdown user-prefer-dropdown" disabled={this.state.disabledmode} defaultValue={this.state.p2pnotification} selection onChange={(e, value) => this.handleuserpreferChange(e, value, 'p2pnotification')} options={this.notificationoptions} />

                                                        </Table.Cell>
                                                    </Table.Row>
                                                }

                                            </Table.Body>
                                        </Table>

                                    </Segment>
                                </div>
                            </div>
                            <div className="rtbtngroup">
                                <Divider />
                                <button className="ui grey button" onClick={(e) => this.handlemtcancel(e)}>
                                    Cancel
                                </button>
                                <button className="ui blue button btnrightal" onClick={(e) => this.handlepreferenceupdate(e)}>
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
    return {}
}
function matchDispatchToProps(dispatch) {
    return bindActionCreators({
        setload: setload,
        getUserpreferenceaction: getUserpreferenceaction,
        postUserpreferenceaction: postUserpreferenceaction,
        postuserriskpreferencedetailsaction: postuserriskpreferencedetailsaction
    }, dispatch);
}

export default withRouter(connect(mapStateToProps, matchDispatchToProps)(Userpreferences));
