import * as React from 'react';
import {Component} from 'react'
import {Link} from 'react-router-dom';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {store} from '../Store/store';
import {getaccountData, posteziologoutaction, setusername, checklogin,setmyaccount,setload} from '../Actions/action';
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
    Table
} from 'semantic-ui-react'
import 'semantic-ui-css/semantic.min.css';

class Accountpanel extends React.Component < any,
any > {
    constructor(props) {
        super(props);
        this.state = {
            accountdata: null
        }
    }
   
    handleaccountdetails(e,accountNo){
        e.preventDefault();
        this.props.setmyaccount(accountNo);
        this.props.history.push('/layout/accountdetail');
    }
    componentWillMount() {
        this.props.setload(true);
        var sendusrname = {
            usrnme: store
                .getState()
                .username
        }
        const self = this;
        this
            .props
            .getaccountData(sendusrname)
            .then(function (response) {
                
                if (response !== undefined && response.data.responseCode === 200) {
                    self.setState({accountdata: response.data.templateObject.accountdetails})
                    self.props.setload(false);
                }
                else{
                    self.props.setload(false);
                }
            })
    }
    render() {
        const accountlist = this.state.accountdata;
        return (
            <div>
                <Grid columns={1} stackable>
                    <Grid.Row>
                        <Grid.Column width={14}>
                            <Segment id="Summarybox">
                                <span className="accst">Account Summary</span>
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
                        {accountlist !== null && accountlist.map((account) => {
                            return (
                                <Segment className="accdetailsec">
                                    <div id="pcctxt">
                                        <div className="acctitle">{account.atype}</div>
                                        <Table celled>
                                            <Table.Header className="theadcls">
                                                <Table.Row>
                                                    <Table.HeaderCell>Account number</Table.HeaderCell>
                                                    <Table.HeaderCell>Type</Table.HeaderCell>
                                                    <Table.HeaderCell>Ccy</Table.HeaderCell>
                                                    <Table.HeaderCell>Balance</Table.HeaderCell>
                                                </Table.Row>
                                            </Table.Header>
                                            <Table.Body>
                                                {account
                                                    .details
                                                    .map((accountlist, indic) => <Table.Row>
                                                        <Table.Cell><a className="accnostyl" onClick={(e) => this.handleaccountdetails(e,accountlist.accountNo)}>{accountlist.accountNo}</a></Table.Cell>
                                                        <Table.Cell>{accountlist.accountType}</Table.Cell>
                                                        <Table.Cell>USD</Table.Cell>
                                                        <Table.Cell>{accountlist.accountBalance}</Table.Cell>
                                                    </Table.Row>)}
                                            </Table.Body>
                                        </Table>
                                    </div>
                                </Segment>

                            )
                        })}

                          {accountlist === null && 
                              <div id="ltnodevice">
                              Sorry, looks like there is a server error.
                             </div>
                        }
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
        getaccountData: getaccountData,
        posteziologoutaction: posteziologoutaction,
        setusername: setusername,
        checklogin: checklogin,
        setmyaccount:setmyaccount,
        setload:setload
    }, dispatch)
}
export default connect(mapStateToProps, matchDispatchToProps)(Accountpanel)
