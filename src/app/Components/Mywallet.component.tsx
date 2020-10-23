import * as React from 'react';
import {Component} from 'react'
import {Link,withRouter} from 'react-router-dom';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {store} from '../Store/store';
import {getcardlist, posttokenrelease,postCardrelease, posteziologoutaction, setload,setusername,setmycard,checklogin} from '../Actions/action';
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

class Mywallet extends React.Component < any,
any > {
    constructor(props) {
        super(props);
        this.state = {
            cardlist: null
        }
    }

    onSelectRow(row,cell, isSelected, e) {
        if (isSelected && isSelected.target.id !== 'mywallettrash') {
            if (row.panType.includes("DCV") === false) {
                console.log('not active');
                if(row.panType.includes("VISA") === true)
                {
                    row.cardType ="visa";
                }
                else
                {
                    row.cardType ="mastercard";
                }
                this.props.setmycard(row);
                this
                .props
                .history
                .push('/layout/mycard');
            } else {
                console.log('active');
            }
        }
    }
    onClickProductSelected(cell, row, rowIndex) {
        console.log('Product #',cell, row, rowIndex);
        if(row.panType.includes("DCV"))
        {
            this.handletokenrelease(row.tokenId)
        }
        else{
            this.handleCardrelease(row.panNo)
        }
        
    }

    cellButton(cell, row, enumObject, rowIndex) {
        if (row.panTypeFlag === 1 || row.panType.includes("DCV")) {
            return (

                <Popup
                trigger={<button
                    type="button"
                    className="trashbutton"
                    onClick={() => this.onClickProductSelected(cell, row, rowIndex)}>
                    <Icon size='large' id="mywallettrash"color='red' name='trash'/>
                </button>}
                content='Click here to delete the card'
                on='hover'
              />
            )
        }
    }
    componentWillMount() {

        this
            .props
            .setload(true);
        const senddata = {
            userId: store
                .getState()
                .username
        }
        const self = this;

        this
            .props
            .getcardlist(senddata)
            .then(function (response) {
                console.log(response);

                if (response !== undefined && response.data.responseCode === 200) {
                    self.setState({cardlist: response.data.templateObject})
                    self
                        .props
                        .setload(false);
                } else if (response !== undefined && response.data.responseCode === 204) {
                    self.setState({cardlist: []});
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

    handleCardrelease(panNumber) {
        console.log("released");

        this
            .props
            .setload(true);
        var panDetail = {
            userId: store
                .getState()
                .username,
            panId: panNumber
        }
        const self = this;
        this
            .props
            .postCardrelease(panDetail)
            .then(response => {
                console.log(response);
                if (response !== undefined && response.data.responseCode === 200 || response !== undefined && response.data.responseCode === 204) {
                    console.log('success');
                    self
                        .props
                        .setload(false);
                    self.componentWillMount()
                } else {
                    console.log("error in reset");
                    self
                        .props
                        .setload(false);
                    ToastDanger('Expectation Failed,card not deleted.');
                }
            });
    }


    handletokenrelease(tokenname) {
        console.log("released");

        this
            .props
            .setload(true);
        var tokendetail = {
            userId: store
                .getState()
                .username,
            tokenId: tokenname
        }
        const self = this;
        this
            .props
            .posttokenrelease(tokendetail)
            .then(response => {
                console.log(response);
                if (response !== undefined && response.data.responseCode === 200) {
                    console.log('success');
                    self
                        .props
                        .setload(false);
                    self.componentWillMount()
                } else {
                    console.log("error in reset");
                    self
                        .props
                        .setload(false);
                    ToastDanger('Expectation Failed,card not deleted.');
                }
            });
    }

    columnClassNameFormat(fieldValue, row, rowIdx, colIdx) {
        console.log(row.panType.includes("DCV"),row.panType)
        return row.panType.includes("DCV") === true
            ? 'td-column-function-even-example'
            : 'td-column-function-odd-example';
    }

    rowClassNameFormat(row, rowIdx) {
        console.log(row.panType.includes("DCV"),row.panType)
        return row.panType.includes("DCV") === true 
        ? 'td-row-function-even-example' : 'td-row-function-odd-example';
      }
  
    render() {
        const selectRowProp = {
            mode: 'checkbox',
            bgColor: function (row, isSelect) {
                return null;
            },
            clickToSelect: true,
            hideSelectColumn: true,
            onSelect: this.onSelectRow.bind(this),
            selected: []
        };

        const cardlist = this.state.cardlist;
        return (
            <div>
                <Grid columns={1} stackable>
                    <Grid.Row>
                        <Grid.Column width={14}>
                            <Segment id="Summarybox">
                                <span className="accst">My cards</span>
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

                            {cardlist !== null && <div>
                                {/* selectRow={selectRowProp} */}
                                <div id="mycard">My cards</div>
                                {/* <Header as='h5' className="rtdetailheader" attached='top'> */}
                                {/* My cards
                                </Header> */}
                                <BootstrapTable
                                    className="cardtbl"
                                    data={cardlist}
                                    selectRow={selectRowProp} trClassName={this.rowClassNameFormat}
                                    ref='cardtable'>
                                    <TableHeaderColumn
                                        width='30%'
                                        columnClassName="pantypestyl"
                                        dataField='panType'>
                                        Card
                                    </TableHeaderColumn>
                                    <TableHeaderColumn width='30%' isKey dataField='panNo'>
                                        No
                                    </TableHeaderColumn>
                                    <TableHeaderColumn
                                        width='30%'
                                        columnClassName={this.columnClassNameFormat}
                                        dataField='accountNo'>
                                        Primary linked account
                                    </TableHeaderColumn>
                                    <TableHeaderColumn
                                        width='10%'
                                        dataAlign='center'
                                        dataField='button'
                                        dataFormat={this
                                        .cellButton
                                        .bind(this)}/>
                                </BootstrapTable>
                            </div>
                        }
                          {cardlist == null &&
                         <div id="ltnodevice">
                         Sorry, looks like there is a server error.
                        </div>
                         }
                        </Segment>

                    </Grid.Column>
                    <Grid.Column width={14}>
                        <div className="rtbtngroup">
                            <Divider/>
                            {store
                            .getState()
                            .CardIssuance == true && 
                                <button
                                className="ui blue button btnrightal"
                                onClick={() =>  this
                                    .props
                                    .history
                                    .push('/layout/cardissuance')}>
                                Request new card
                                </button>
                            }
                            
                            <button
                                className="ui button btnrightal"
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
        getcardlist: getcardlist,
        setload: setload,
        posttokenrelease: posttokenrelease,
        postCardrelease:postCardrelease,
        posteziologoutaction: posteziologoutaction,
        setusername:setusername,
        setmycard:setmycard,
        checklogin:checklogin
    }, dispatch)
}

export default withRouter(connect(mapStateToProps, matchDispatchToProps)(Mywallet));