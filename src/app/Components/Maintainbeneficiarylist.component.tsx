import * as React from 'react';
import {Component} from 'react'
import {Link, withRouter} from 'react-router-dom';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {store} from '../Store/store';
import {posttransferaccountdetails,deleteBeneficiaryaccountaction, setload} from '../Actions/action';
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
    Popup,
    Message
} from 'semantic-ui-react';
import {BootstrapTable, TableHeaderColumn} from 'react-bootstrap-table'
import 'react-bootstrap-table/css/react-bootstrap-table.css'
import 'react-bootstrap-table/dist/react-bootstrap-table-all.min.css'
import 'semantic-ui-css/semantic.min.css';
import {ToastDanger} from 'react-toastr-basic';


class Maintainbeneficiarylist extends React.Component < any,
any > {
    constructor(props) {
        super(props);
        this.state = {
            username: store
                .getState()
                .username,
            selectedbeneficiarylist: []
        }
    }

    componentWillMount() {

        this
            .props
            .setload(true);
            
        var userdetails = {
            userId: this.state.username,
            type: "EXTERNAL_TRANSFER"
        }
        const self = this;

        this
            .props
            .posttransferaccountdetails(userdetails)
            .then(function (response) {
                console.log(response);

                if (response !== undefined && response.data.responseCode === 200) {
                    self.setState({beneficiarylist: response.data.templateObject.toAccountList})
                    self
                        .props
                        .setload(false);
                } else if (response !== undefined && response.data.responseCode === 204) {
                    self.setState({beneficiarylist: []});
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

    handlebeneficiarydelete(e) {
        e.preventDefault();
        console.log(this.state, "delete");
    if(this.state.selectedbeneficiarylist.length >0)
    {
        this
        .props
        .setload(true);
        var senddeletedetails = {
            userId: this.state.username,
            accountList: this.state.selectedbeneficiarylist   
        }
        const self = this;

    this
        .props
        .deleteBeneficiaryaccountaction(senddeletedetails)
        .then(function (response) {
            console.log(response,"delete");

            if (response !== undefined && response.data.responseCode === 200) {
                self
                    .props
                    .setload(false);
                self.setState({selectedbeneficiarylist:[]})
                self.componentWillMount();
            } else {
                self
                    .props
                    .setload(false);
                console.log('Error');
                ToastDanger('Not able to delete beneficiaries.Please try again later.');
            }

        })
    }
    else{
        ToastDanger('Please select one record atleast.');
    }
     
    }
    onRowSelect(row, isSelected, e) {
        if (isSelected) {
            this
                .state
                .selectedbeneficiarylist
                .push(row.accountNo);
        } else {
            var index = this
                .state
                .selectedbeneficiarylist
                .indexOf(row.accountNo);
            if (index > -1) {
                this
                    .state
                    .selectedbeneficiarylist
                    .splice(index, 1);
            }
        }
    }

    onSelectAll(isSelected, rows) {
        this.setState({selectedbeneficiarylist: []})
        if (isSelected) {
            var selectedaccount=[]
            for (let i = 0; i < rows.length; i++) {
                console.log(rows[i].accountNo);
                selectedaccount.push(rows[i].accountNo);
                if(i== rows.length -1)
                {
                    this.setState({selectedbeneficiarylist: selectedaccount})
                }
            }
        }
    }

    render() {

        const selectRowProp = {
            mode: 'checkbox',
            onSelect: this
                .onRowSelect
                .bind(this),
            onSelectAll: this
                .onSelectAll
                .bind(this)
        };

        const beneficiarylist = this.state.beneficiarylist;
        return (
            <div>
                <Grid columns={1} stackable>
                    <Grid.Row>
                        <Grid.Column width={14}>
                            <Segment id="Summarybox">
                                <span className="accst">Beneficiary list</span>
                                <a href="mailto:SUPPORT-DEMO@gemalto.com">
                                <span id="helpbox">Help
                                    <Icon name='help circle' className="helpdesc"/></span>
                                </a>
                            </Segment>
                        </Grid.Column>
                    </Grid.Row>
                </Grid>
                <Grid className="contentdetail">
                {  beneficiarylist !== undefined && beneficiarylist.length > 0 && <Grid.Column width={10}>

                        <Segment className="accdetailsec" attached>

                            <div>

                                <BootstrapTable tableHeaderClass='bl-header' tableContainerClass='bl-container' data={beneficiarylist} selectRow={selectRowProp}>
                                    <TableHeaderColumn dataField='accountName' columnClassName='bl-td-right'>Name</TableHeaderColumn>
                                    <TableHeaderColumn dataField='accountNo' columnClassName='bl-td-right border' isKey>Account number</TableHeaderColumn>
                                </BootstrapTable>

                            </div>


 


                        </Segment>

                    </Grid.Column>
                }
                    <Grid.Column width={14} className="mb-btn-padding">
                    {beneficiarylist !== undefined && beneficiarylist.length < 1 && <Segment className="accdetailsec">
                            <Message negative>
                                <div className="twarning"><Icon color="red" name='warning sign'/>
                                </div>
                                <div>
                                    <Message.Header>List empty!</Message.Header>
                                    <p>We could not find any external beneficiary in our records.
                                    </p>
                                </div>
                            </Message>
                        </Segment>
}

                        {beneficiarylist === undefined && <Segment className="accdetailsec">
                            <Message negative>
                                <div className="twarning"><Icon color="red" name='warning sign'/>
                                </div>
                                <div>
                                    <Message.Header>Server error!</Message.Header>
                                    <p>Sorry, something went wrong. Please try again or contact the support.
                                    </p>
                                </div>
                            </Message>
                        </Segment>
}
                        <div className="rtbtngroup mtbtngroup">
                            <Divider/>
                            <button className="ui grey button" onClick={(e) => this.handlemtcancel(e)}>
                                Cancel
                            </button>

                            {
                                beneficiarylist !== undefined && beneficiarylist.length > 0 && 
                                <button
                                className="ui blue button btnrightal mtacbtn"
                                onClick={(e) => this.handlebeneficiarydelete(e)}>
                                Delete
                                </button>
                            }
                          
                            <button
                                className="ui blue button btnrightal"
                                onClick={(e) => {
                                    this
                                    .props
                                    .history
                                    .push('/layout/newbeneficiary');
                                }}>
                                Add beneficiary
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
        setload: setload,
        posttransferaccountdetails: posttransferaccountdetails,
        deleteBeneficiaryaccountaction:deleteBeneficiaryaccountaction
    }, dispatch)
}

export default withRouter(connect(mapStateToProps, matchDispatchToProps)(Maintainbeneficiarylist));