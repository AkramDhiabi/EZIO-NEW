import * as React from 'react'; 
import {Accordion, Icon} from 'semantic-ui-react'
import 'semantic-ui-css/semantic.min.css'; 
import {NavLink} from 'react-router-dom';
import {store} from '../Store/store';
import {withRouter} from 'react-router-dom';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {posteziologoutaction, setusername, checklogin, setcurrentroute} from '../Actions/action';

class DemoSidebar extends React.Component < any > {
    state = {
        activeIndex: 0
    }
    handleClick = (e, titleProps) => {
        const {index} = titleProps
        const {activeIndex} = this.state
        const newIndex = activeIndex === index
            ? -1
            : index
        this.setState({activeIndex: newIndex})
    }
    handlenavigation(e, routev) {
        console.log("Navigation")
        e.preventDefault();
        this
            .props
            .setcurrentroute(routev);
        this
            .props
            .history
            .push(`/layout/loading`);
    }
    handleLogoff(e) {

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
                        window.location.reload(true);
                } else {
                    console.log("error in logout")
                }
            })
    }
    render() {
        const {activeIndex} = this.state
        return (
            <Accordion>
                <Accordion.Title
                    className="accortitle"
                    active={activeIndex === 0}
                    index={0}
                    onClick={this.handleClick}>
                    <Icon name='dropdown'/>
                    Accounts
                </Accordion.Title>
                <Accordion.Content
                    active={activeIndex === 0 || window.location.hash === '#/layout/accountsummary'}>
                    <NavLink
                        className="item"
                        to='/layout/accountsummary'
                        onClick={(e) => this.handlenavigation(e, '/layout/accountsummary')}
                        activeClassName="activelinkroute">
                        Account summary
                    </NavLink >

                    <a className="item isDisabled"> Open a new account</a >


                </Accordion.Content>

                <Accordion.Title
                    className="accortitle"
                    active={activeIndex === 1}
                    index={1}
                    onClick={this.handleClick}>
                    <Icon name='dropdown'/>
                    Transfers
                </Accordion.Title>
                <Accordion.Content
                    active={activeIndex === 1 || window.location.hash === '#/layout/domestictransfer' || window.location.hash === '#/layout/externaltransfer'}>
                    <NavLink
                        className="item"
                        to='/layout/domestictransfer'
                        onClick={(e) => this.handlenavigation(e, '/layout/domestictransfer')}
                        activeClassName="activelinkroute">Domestic transfer</NavLink >
                    <NavLink
                        className="item"
                        to='/layout/externaltransfer'
                        onClick={(e) => this.handlenavigation(e, '/layout/externaltransfer')}
                        activeClassName="activelinkroute">External transfer</NavLink >

                </Accordion.Content>

                <Accordion.Title
                    className="accortitle"
                    active={activeIndex === 2}
                    index={2}
                    onClick={this.handleClick}>
                    <Icon name='dropdown'/>
                    Manage beneficiaries
                </Accordion.Title>
                <Accordion.Content
                    active={activeIndex === 2 || window.location.hash === '#/layout/newbeneficiary' || window.location.hash === '#/layout/beneficiarylist'}>
                    <NavLink
                        className="item"
                        to='/layout/newbeneficiary'
                        onClick={(e) => this.handlenavigation(e, '/layout/newbeneficiary')}
                        activeClassName="activelinkroute">Add new beneficiary</NavLink >
                    <NavLink
                        className="item"
                        to='/layout/beneficiarylist'
                        onClick={(e) => this.handlenavigation(e, '/layout/beneficiarylist')}
                        activeClassName="activelinkroute">Maintain beneficiary list</NavLink >
                </Accordion.Content>

                <Accordion.Title
                    className="accortitle"
                    active={activeIndex === 3}
                    index={3}
                    onClick={this.handleClick}>
                    <Icon name='dropdown'/>
                    eCommerce
                </Accordion.Title>
                <Accordion.Content active={activeIndex === 3}>
                    <NavLink
                        className="item"
                        to='/ecomm3ds'
                        onClick={(e) => this.handlenavigation(e, '/ecomm3ds')}
                        activeClassName="activelinkroute">Purchase goods with 3DS</NavLink >
                    <NavLink
                        className="item"
                        to='/ecommdcv'
                        onClick={(e) => this.handlenavigation(e, '/ecommdcv')}
                        activeClassName="activelinkroute">Purchase goods with DCV</NavLink >
                </Accordion.Content>

                <Accordion.Title
                    className="accortitle"
                    active={activeIndex === 4}
                    index={4}
                    onClick={this.handleClick}>
                    <Icon name='dropdown'/>
                    ATM
                </Accordion.Title>
                <Accordion.Content active={activeIndex === 4}>
                    <NavLink
                        className="item"
                        to='/atmcashcode'
                        onClick={(e) => this.handlenavigation(e, '/atmcashcode')}
                        activeClassName="activelinkroute">Cash withdrawal by code</NavLink >
                    <NavLink
                        className="item"
                        to='/atmQRcode'
                        onClick={(e) => this.handlenavigation(e, '/atmQRcode')}
                        activeClassName="activelinkroute">Cash withdrawal by QR code</NavLink >
                </Accordion.Content>

                <Accordion.Title
                    className="accortitle"
                    active={activeIndex === 5}
                    index={5}
                    onClick={this.handleClick}>
                    <Icon name='dropdown'/>
                    Card management
                </Accordion.Title>
                <Accordion.Content
                    active={activeIndex === 5 || window.location.hash === '#/layout/mywallet' || window.location.hash === '#/layout/cardissuance' || window.location.hash === '#/layout/DCVactivation'}>

                    <NavLink
                        className="item"
                        to='/layout/mywallet'
                        onClick={(e) => this.handlenavigation(e, '/layout/mywallet')}
                        activeClassName="activelinkroute">My cards</NavLink >

                    {store
                        .getState()
                        .CardIssuance == true && <NavLink
                            className="item"
                            to='/layout/cardissuance'
                            onClick={(e) => this.handlenavigation(e, '/layout/cardissuance')}
                            activeClassName="activelinkroute">Card issuance</NavLink >
}
                    {store
                        .getState()
                        .CardIssuance == false && <a className="item isDisabled">Card issuance</a >
}

                    {store
                        .getState()
                        .DCV == true && <NavLink
                            className="item"
                            to='/layout/DCVactivation'
                            onClick={(e) => this.handlenavigation(e, '/layout/DCVactivation')}
                            activeClassName="activelinkroute">DCV activation</NavLink >
}
                    {store
                        .getState()
                        .DCV == false && <a className="item isDisabled">DCV activation</a >
}
                </Accordion.Content>
                <Accordion.Title
                    className="accortitle"
                    active={activeIndex === 6}
                    index={6}
                    onClick={this.handleClick}>
                    <Icon name='dropdown'/>
                    Authentication
                </Accordion.Title>
                <Accordion.Content
                    active={activeIndex === 6 || window.location.hash === '#/layout/tokenlist' || window.location.hash === '#/layout/tokenmanagement'}>
                    <NavLink
                        className="item"
                        to='/layout/tokenlist'
                        onClick={(e) => this.handlenavigation(e, '/layout/tokenlist')}
                        activeClassName="activelinkroute">
                        List of tokens</NavLink >
                    <NavLink
                        className="item"
                        to='/mobileregistration'
                        activeClassName="activelinkroute">
                        Mobile activation</NavLink >

                    {store
                        .getState()
                        .TokenPro == true &&  store.getState().TokenActResync == false && <a className="item isDisabled">Token management</a >
                        || store.getState().TokenActResync == true && <NavLink
                            className="item"
                            to='/layout/tokenmanagement'
                            onClick={(e) => this.handlenavigation(e, '/layout/tokenmanagement')}
                            activeClassName="activelinkroute">
                            Token management</NavLink >
}
                    {store
                        .getState()
                        .TokenPro == false && store
                        .getState()
                        .TokenActResync == false && <a className="item isDisabled">Token management</a >
}

                </Accordion.Content>

                <Accordion.Title
                    className="accortitle"
                    active={activeIndex === 7}
                    index={7}
                    onClick={this.handleClick}>
                    <Icon name='dropdown'/>
                    Notifications
                </Accordion.Title>

                <Accordion.Title
                    className="accortitle"
                    active={activeIndex === 8}
                    index={8}
                    onClick={this.handleClick}>
                    <Icon name='dropdown'/>
                    Demo Portal services
                </Accordion.Title>
                <Accordion.Content
                    active={activeIndex === 8 || window.location.hash === '#/layout/userpreference' || window.location.hash === '#/layout/resetaccount'}>

                    {store
                        .getState()
                        .UserPreference == true && <NavLink
                            className="item"
                            to='/layout/userpreference'
                            onClick={(e) => this.handlenavigation(e, '/layout/userpreference')}
                            activeClassName="activelinkroute">Preferences</NavLink >
}
                    {store
                        .getState()
                        .UserPreference == false && <a className="item isDisabled">Preferences</a >
}
                        <NavLink
                            className="item"
                            to='/layout/personalinformation'
                            onClick={(e) => this.handlenavigation(e, '/layout/personalinformation')}
                            activeClassName="activelinkroute">Personal information</NavLink >
                    {store
                        .getState()
                        .ReportBackend == true && <a className="item isDisabled">
                            Demo Portal configuration</a >
}
                    {store
                        .getState()
                        .ReportBackend == false && <a className="item isDisabled">Demo Portal configuration</a >
}
                    {store
                        .getState()
                        .ReportBackend == true && <a className="item isDisabled">Transaction report</a >
}
                    {store
                        .getState()
                        .ReportBackend == false && <a className="item isDisabled">Transaction report</a >
}
                    <NavLink
                        className="item"
                        to='/layout/resetaccount'
                        onClick={(e) => this.handlenavigation(e, '/layout/resetaccount')}
                        activeClassName="activelinkroute">Reset my account</NavLink >
                </Accordion.Content>

                <Accordion.Title
                    className="accortitle"
                    active={activeIndex === 9}
                    index={9}
                    onClick={this.handleClick}>
                    <Icon name='dropdown'/>
                    About
                </Accordion.Title>
                <Accordion.Content active={activeIndex === 9}>
                    <a
                        className="item"
                        href="http://www.gemalto.com/financial/ebanking"
                        target="_blank">
                        Product and services
                    </a>
                    <a
                        className="item"
                        href="http://www.gemalto.com/companyinfo/contact-us"
                        target="_blank">
                        Contact us
                    </a>
                </Accordion.Content>

                <Accordion.Title
                    className="accortitle"
                    active={activeIndex === 11}
                    index={12}
                    onClick={(e) => this.handleLogoff(e)}>
                    <Icon name='dropdown'/>
                    Log off
                </Accordion.Title>
            </Accordion>
        )
    }
}

function mapStateToProps(state) {
    return {}
}
function matchDispatchToProps(dispatch) {
    return bindActionCreators({
        posteziologoutaction: posteziologoutaction,
        checklogin: checklogin,
        setusername: setusername,
        setcurrentroute: setcurrentroute
    }, dispatch)
}

export default withRouter(connect(mapStateToProps, matchDispatchToProps)(DemoSidebar));
