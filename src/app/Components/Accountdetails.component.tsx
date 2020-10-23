import * as React from 'react';
import {Component} from 'react'
import {Link} from 'react-router-dom';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {store} from '../Store/store';
import {getaccountsummaryDetails, setload} from '../Actions/action';
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
    Divider
} from 'semantic-ui-react'
import 'semantic-ui-css/semantic.min.css';

class Accoundetails extends React.Component < any,
any > {
    constructor(props) {
        super(props);
        this.state = {
            accountsummary: null,
            accountinfo: null
        }
    }

    componentWillMount() {

        // const senddata = {
        //     userId: "mindtree001",
        //     accountno: "8170272339"

        // }
        const senddata = {     
            userId:store.getState().username,
            accountno:store.getState().accountdetail 
        }
        const self = this;
        this
            .props
            .getaccountsummaryDetails(senddata)
            .then(function (response) {
        
                if (response !== undefined && response.data.responseCode === 200) {
                    self.setState({accountsummary: response.data.templateObject.transactionsData, accountinfo: response.data.templateObject.accountInfo})
                    self
                        .props
                        .setload(false);
                } else if (response !== undefined && response.data.responseCode === 204) {
                    self.setState({accountsummary: []});
                    self
                        .props
                        .setload(false);
                } else {
                    self
                        .props
                        .setload(false);
                    console.log('Error');
                }
                  })
    }

    handlemtcancel(e) {
        e.preventDefault();
        this
            .props
            .history
            .push('/layout/accountsummary');
    }
    render() {
        const {accountsummary, accountinfo} = this.state;
        return (
            <div>
                <Grid columns={1} stackable>
                    <Grid.Row>
                        <Grid.Column width={14}>
                            <Segment id="Summarybox">
                                <span className="accst">Recent transactions</span>
                                <a href="mailto:SUPPORT-DEMO@gemalto.com">
                                <span id="helpbox">Help
                                    <Icon name='help circle' className="helpdesc"/></span>
                                </a>
                            </Segment>
                        </Grid.Column>
                    </Grid.Row>
                </Grid>
                <Grid className="contentdetail">
                    <Grid.Column width={14}>

                        <Segment className="accdetailsec">

                            {accountinfo !== null && accountsummary !== null && <div>
                                <div id="addetailbox">
                                    <div className="arrow_box">
                                        <span className="logo">{accountinfo.accountName} account no {accountinfo.accountNo} - {store.getState().username}</span>
                                        <span className="trxactno">{accountinfo.accountNo}</span>
                                        <span className="adrightalign">{accountinfo.formatAccBalance}</span>

                                    </div>
                                    <div id="arrow_content">
                                        <div>
                                            <span className="pantypestyl" id="adballbl">BALANCE</span> 
                                            <span className="pantypestyl">{accountinfo.formatAccBalance}</span>
                                            <span className="adrightalign">Allowed overdraft: $0</span>
                                            <br/>As of today - {new Date().toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true })}
                                        </div> 
                                    </div>
                                </div>

                                <Table celled>
                                    <Table.Header className="theadcls">
                                        <Table.Row>
                                            <Table.HeaderCell>Date</Table.HeaderCell>
                                            <Table.HeaderCell>Operation</Table.HeaderCell>
                                            <Table.HeaderCell>Debit</Table.HeaderCell>
                                            <Table.HeaderCell>Credit</Table.HeaderCell>
                                        </Table.Row>
                                    </Table.Header>
                                    <Table.Body>
                                        {accountsummary.map((summarydata, indic) => <Table.Row>
                                            <Table.Cell>{summarydata.transactionDate}</Table.Cell>
                                            <Table.Cell>{summarydata.description === "" &&
                                                <span>No information</span> 
                                            }
                                            {summarydata.description !== "" &&
                                                <span>{summarydata.description}</span>
                                            }
                                            </Table.Cell>
                                            <Table.Cell>{summarydata.cashOut !== "$0" &&
                                            <span>{summarydata.cashOut}</span>
                                            }
                                            </Table.Cell>
                                            <Table.Cell>{summarydata.cashIn !== "$0" &&
                                            <span>{summarydata.cashIn}</span>
                                            }</Table.Cell>
                                        </Table.Row>)}
                                    </Table.Body>
                                </Table>

                                <div id="adbalancesec">
                                    <span className="logo">BALANCE</span>
                                    <span className="adrightalign">{accountinfo.formatAccBalance}</span>
                                </div>
                            </div>
}

                          { accountinfo == null && accountsummary == null &&
                             <div id="ltnodevice">
                             Sorry, looks like there is a server error.
                            </div>
                        }

                         {accountsummary !== null && accountsummary.length < 1 && accountinfo == null &&
                            <div id="ltnodevice">
                             No transaction found.
                           </div>
                        
                         }
                        </Segment>

                    </Grid.Column>

                    <Grid.Column width={14}>
                        <div className="rtbtngroup">
                            <Divider/>

                            <button
                                className="ui blue button btnrightal"
                                onClick={(e) => this.handlemtcancel(e)}>
                                Done
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
        getaccountsummaryDetails: getaccountsummaryDetails,
        setload: setload
    }, dispatch)
}
export default connect(mapStateToProps, matchDispatchToProps)(Accoundetails)
