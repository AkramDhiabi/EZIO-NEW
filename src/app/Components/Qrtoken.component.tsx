import * as React from 'react'; 
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { store } from '../Store/store';
import Gemaltohdr from './Gemaltohdr.component';
import { posteziologoutaction, setusername, checklogin, setcurrenttokenstep, setaccountlist, setload } from '../Actions/action';
import {
    Container,
    Grid,
    Icon,
    Segment,
    Step,
} from 'semantic-ui-react'; 
import ConfirmYourId from './ConfirmYourId.component';
import EnterYourTransferDetails from './EnterYourTransferDetails.component';
import ScanQrCode from './ScanQrCode.component';
import CompleteQrTokenCheck from './CompleteQrTokenCheck.component'; 

import 'semantic-ui-css/semantic.min.css'; 

class Qrtoken extends React.Component<any, any> {
    constructor(props) {
        super(props);

        this.state = {
            currenttokenstep: store.getState().currenttokenstep
        }

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




    componentWillMount() {
        store.subscribe(() => {
            this.setState({
                currenttokenstep: store.getState().currenttokenstep,
            });
        });

        this.props.setload(false);
    }

    componentWillUnmount() {
        var setdefault = {
            currenttokenstep: 1,
            tokenDetail: null
        }
        this.props.setcurrenttokenstep(setdefault);

        this.props.setaccountlist({
            fromList: null,
            toList: null
        })
    }
    render() {

        return (

            <div>
                <Grid columns={1} stackable>
                    <Segment className="hdrstylcss brdrmainclass layoutheader header_singlepage">
                        <Gemaltohdr />
                    </Segment>
                    <Grid.Row>
                        <Container id="tokenContainer">
                            <Grid>
                                <Grid.Row>
                                    <Grid.Column floated='right' width={10}>
                                        <Segment className="defaultheaderseg" id="welcomestyl">
                                            <span>Welcome {store
                                                .getState()
                                                .username}, you are logged on to internet banking
                                            </span>
                                            <Icon className="ecomm-homeicon ecomm-homeicon-qr" onClick={() => { this.props.history.push(`/layout/accountsummary`) }} name='home' />

                                            <button
                                                className="ui red button btnal"
                                                role="button"
                                                onClick={(e) => this.handleLogoff(e)}>Log off</button>
                                        </Segment>
                                    </Grid.Column>
                                </Grid.Row>
                                <Grid.Row>
                                <Segment className="defaultheaderseg defaultheaderseg_singlepage" id="msgstyl">
                                        <Icon id="tick" className="msgtick" name='checkmark' />
                                        <span id="msgtxt">No pending transactions</span>
                                    </Segment>
                                </Grid.Row>
                                <Grid.Row>
                                    <Grid.Column id="ttitle">
                                        <Segment id="Summarybox">
                                            <span className="accst">International transfer</span>
                                            <a href="mailto:SUPPORT-DEMO@gemalto.com">
                                                <span id="helpbox">Help
                                <Icon name='help circle' className="helpdesc" /></span>
                                            </a>
                                        </Segment>
                                        <Segment className="defaultuiseg">
                                            <Step.Group size='mini'>
                                                <Step active={this.state.currenttokenstep === 1} title='Confirm your ID' />
                                                <Step active={this.state.currenttokenstep === 2} title='Transfer details' />
                                                <Step active={this.state.currenttokenstep === 3} title='QR code verification' />
                                                <Step active={this.state.currenttokenstep === 4} title='Complete' />
                                            </Step.Group>
                                            {this.state.currenttokenstep === 1 &&
                                                <Segment className="mtcontent" attached>
                                                    <ConfirmYourId />
                                                </Segment>
                                            }
                                            {this.state.currenttokenstep === 2 &&
                                                <Segment className="mtcontent" attached>
                                                    <EnterYourTransferDetails />
                                                </Segment>
                                            }
                                             {this.state.currenttokenstep === 3 &&
                                                <Segment className="mtcontent" attached>
                                                    <ScanQrCode />
                                                </Segment>
                                            }
                                             {this.state.currenttokenstep === 4 &&
                                                <Segment className="mtcontent" attached>
                                                    <CompleteQrTokenCheck />
                                                </Segment>
                                            }
                                        </Segment>
                                    </Grid.Column>
                                </Grid.Row>
                            </Grid>
                        </Container>
                    </Grid.Row>



                </Grid>

            </div>
        )
    }
}

function mapStateToProps(state) {
    return {
        currenttokenstep: state.currenttokenstep
    }
}
function matchDispatchToProps(dispatch) {
    return bindActionCreators({
        posteziologoutaction: posteziologoutaction,
        setcurrenttokenstep: setcurrenttokenstep,
        setusername: setusername,
        checklogin: checklogin,
        setaccountlist: setaccountlist,
        setload: setload
    }, dispatch)
}
//export default connect(mapStateToProps, matchDispatchToProps)(Domestictransfer)
export default withRouter(connect(mapStateToProps, matchDispatchToProps)(Qrtoken));