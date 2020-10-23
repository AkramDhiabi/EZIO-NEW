import * as React from 'react';
import {Component} from 'react'
import {Link} from 'react-router-dom';
import {withRouter} from 'react-router-dom';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {store} from '../Store/store';
import {
    gettokenlist,
    posteziologoutaction,
    setusername,
    checklogin,
    setload,
    posttokenrelease
} from '../Actions/action';
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
    Popup,
    Divider,
    Message
} from 'semantic-ui-react';
import {ToastDanger} from 'react-toastr-basic';
import 'semantic-ui-css/semantic.min.css';

class Tokenlist extends React.Component < any,
any > {
    constructor(props) {
        super(props);
        this.state = {
            username: store
                .getState()
                .username,
            releasepass: false,
            relesefail: false
        };
    }

    componentWillMount() {
        this
            .props
            .setload(true);
        const self = this;
        var sendcredentials = {
            userId: store
                .getState()
                .username
        }
        this
            .props
            .gettokenlist(sendcredentials)
            .then(response => {
             
                if (response.data.responseCode === 200) {
            
                    self.setState({tokenlist: response.data.templateObject.tokensList});
                    self
                        .props
                        .setload(false);
                } else if (response.data.responseCode === 204) {
                  
                    self.setState({tokenlist: []});
                    self
                        .props
                        .setload(false);
                } else {
                    self
                        .props
                        .setload(false);
                }

            });

    }

    handletokenrelease(e, tokenname) {
        console.log("released");
        this.setState({releasepass: false, releasefail: false})
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
                    self.setState({releasepass: true, tokenID: tokendetail.tokenId})

                    var sendcredentials = {
                        userId: store
                            .getState()
                            .username
                    }
                    self
                        .props
                        .gettokenlist(sendcredentials)
                        .then(response => {
                            if (response.data.responseCode === 200) {
                                self.setState({tokenlist: response.data.templateObject.tokensList});
                                self
                                    .props
                                    .setload(false);
                            } else if (response.data.responseCode === 204) {
                               
                                self.setState({tokenlist: []});
                                self
                                    .props
                                    .setload(false);
                            } else {
                                self
                                    .props
                                    .setload(false);
                            }

                        });
                    self
                        .props
                        .setload(false);
                } else {
                    console.log("error in reset");
                    self.setState({releasefail: true, tokenID: tokendetail.tokenId})
                    self
                        .props
                        .setload(false);

                }
            });
    }

    handlemtcancel(e) {
        e.preventDefault();
        this
            .props
            .history
            .push('/layout/accountsummary');
    }

    render() {
        const tokens = this.state.tokenlist;
        return (

            <div>

                <Grid columns={1} stackable>
                    <Grid.Row>
                        <Grid.Column width={14}>
                            <Segment id="Summarybox">
                                <span className="accst">List of tokens</span>
                                <a href="mailto:SUPPORT-DEMO@gemalto.com">
                                <span id="helpbox">Help
                                    <Icon name='help circle' className="helpdesc"/></span>
                                </a>
                            </Segment>
                        </Grid.Column>
                    </Grid.Row>
                </Grid>

                <Grid className="contentdetail">
                    <Grid.Column width={12}>
                    {this.state.releasepass && <Message positive className="logonwarning">
                                        <div className="lwarning"><Icon id="tick" className="tlicon" name='checkmark'/></div>
                                        <div>
                                            <Message.Header>Operation done !</Message.Header>
                                            <p>The token {this.state.tokenID}
                                                has been released from your account and is no longer available. It needs to be
                                                activated again.</p>
                                        </div>
                                    </Message>
                    }
                                    {this.state.releasefail && <Message negative>
                                        <div className="twarning"><Icon color="red" name='warning sign'/>
                                        </div>
                                        <div>
                                            <Message.Header>Operation failed!</Message.Header>
                                            <p>Sorry, we could not release your token {this.state.tokenID}
                                                from your account. Please try again or contact the support.
                                            </p>
                                        </div>
                                    </Message>
                    }
                        {tokens !== undefined && tokens.length > 0 && tokens.map(token => {
                            return (
                                <Segment className="accdetailsec">
                                    <div className="tokenlistTable">
                                        {token.list.length > 0 && <div>
                                            <div className="acctitle">{token.type}</div>
                                            <Table celled>
                                                <Table.Header className="theadcls">
                                                    <Table.Row>
                                                        <Table.HeaderCell>Name or ID</Table.HeaderCell>
                                                        <Table.HeaderCell>Type</Table.HeaderCell>
                                                        <Table.HeaderCell>State</Table.HeaderCell>
                                                        {token.type !== 'Mobile tokens' && <Table.HeaderCell></Table.HeaderCell>}
                                                    </Table.Row>
                                                </Table.Header>
                                                <Table.Body>
                                                    {token
                                                        .list
                                                        .map((tokendetail, indic) => <Table.Row>

                                                            <Table.Cell>{tokendetail.name}</Table.Cell>
                                                            <Table.Cell>{tokendetail.type}</Table.Cell>
                                                            <Table.Cell textAlign='center'>{tokendetail.state == 'Activated' && <Popup
                                                                    trigger={< Icon id = "tick" name = 'checkmark' />}
                                                                    content='This token is available and activated.'
                                                                    wide/>
} {tokendetail.state == 'Initialized' && <Popup
                                                                    trigger={< Icon className = "warningicon" name = 'exclamation' />}
                                                                    content='This token is not available because it is in the initialized state. It just needs to be activated.'
                                                                    wide/>
}
                                                                {tokendetail.state !== 'Activated' && tokendetail.state !== 'Initialized' && <Popup
                                                                    trigger={< Icon className = "warningicon" name = 'x' />}
                                                                    content='This token is not available because it is either blocked, locked or revoked. Please contact the support.'
                                                                    wide/>
}
                                                            </Table.Cell>
                                                            {token.type !== 'Mobile tokens' && <Table.Cell textAlign='center'>{tokendetail.release == true && <button
                                                                    className="ui blue button"
                                                                    onClick={(e) => this.handletokenrelease(e, tokendetail.name)}>
                                                                    Release
                                                                </button>
}
                                                            </Table.Cell>
}

                                                        </Table.Row>)}
                                                </Table.Body>
                                            </Table>
                                        </div>
}
                                    </div>
                                </Segment>
                            )

                        })
}

                        {tokens !== undefined && tokens.length < 1 && <Segment className="accdetailsec">
                            <div id="ltnodevice">
                                Sorry, looks like you have no device registered yet.
                            </div>
                        </Segment>
}

                        {tokens === undefined && <Segment className="accdetailsec">
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

                    </Grid.Column>
                    <Grid.Column width={14}>
                        <div className="rtbtngroup">
                            <Divider/>
                            <button className="ui grey button" onClick={(e) => this.handlemtcancel(e)}>
                                Cancel
                            </button>
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
        gettokenlist: gettokenlist,
        posteziologoutaction: posteziologoutaction,
        setusername: setusername,
        checklogin: checklogin,
        setload: setload,
        posttokenrelease: posttokenrelease
    }, dispatch)
}

export default withRouter(connect(mapStateToProps, matchDispatchToProps)(Tokenlist));
