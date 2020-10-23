import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Switch, Route, Redirect, HashRouter, Router, BrowserRouter } from "react-router-dom";
import { store } from './Store/store';
import { Provider } from 'react-redux';
import Login from './Components/Login.component';
import Newregistration from './Components/Newuserregistration.component';
import Recoveraccount from './Components/Recoveraccount.component';
import Loginsecure from './Components/Loginsecure.component';
import Layout from './Components/Layout.component';
import Ecommerce3DS from './Components/Ecommerce3DS.component';
import EcommerceDCV from './Components/EcommerceDCV.component';
import Mobileregistration from './Components/Mobileregistration.component';
import ToastrContainer from 'react-toastr-basic';
import AtmQR from './Components/AtmQRcode.component';
import Atmcash from './Components/Atmcashcode.component';
import Qrtoken from './Components/Qrtoken.component';

import "../styles/Users.css";
import {
    Loader,
    Dimmer
} from 'semantic-ui-react'

import 'semantic-ui-css/semantic.min.css';

class App extends React.Component<any,
    any> {

    constructor(props) {
        super(props);
        this.state = {
            authenticated: false,
            logon: false,
            loading: false,
            userrole: false,
            TokenActResync: true,
            DCV: true,
            TokenPro: true,
            ReportBackend: true,
            GAH: true,
            P2P: true,
            tokenmanagement: true,
            provisiontext: false,
            CardIssuance: true,
            UserPreference: false,
            hasDevice: false
        };

        store.subscribe(() => {
            // When state will be updated(in our case, when items will be fetched), we will
            // update local component state and force component to rerender with new data.
            this.setState({
                authenticated: store
                    .getState()
                    .authenticated,
                logon: store
                    .getState()
                    .logon,
                loading: store
                    .getState()
                    .loading,
                TokenActResync: store
                    .getState()
                    .TokenActResync,
                DCV: store
                    .getState()
                    .DCV,
                TokenPro: store
                    .getState()
                    .TokenPro,
                ReportBackend: store
                    .getState()
                    .ReportBackend,
                GAH: store
                    .getState()
                    .GAH,
                P2P: store
                    .getState()
                    .P2P,
                CardIssuance: store
                    .getState()
                    .CardIssuance,
                UserPreference: store
                    .getState()
                    .UserPreference,
                provisiontext: store.getState().provisiontext,
                hasDevice: store.getState().hasDevice

            });

            if (store.getState().TokenPro == false && store.getState().TokenActResync == false) {
                this.setState({
                    tokenmanagement: false
                })
            }
            else {
                this.setState({
                    tokenmanagement: true
                })
            }
        });
    }

    componentWillMount() {
        // const script1 = document.createElement("script"); script1.src =
        // "../../js/qrcode.js"; script1.async = true;
        // document.body.appendChild(script1); const script =
        // document.createElement("script"); script.src = "../../js/ezioeye.js";
        // script.async = true; document.body.appendChild(script);
    }
    componentDidMount() { }

    render() {
        return (

            <div>
                {this.state.loading && !this.state.provisiontext && <Dimmer active>
                    <Loader indeterminate>
                        Loading..</Loader>
                </Dimmer>
                }
                {this.state.loading && this.state.provisiontext && <Dimmer active>
                    <Loader indeterminate>
                        Provisioning, please wait…</Loader>
                </Dimmer>
                }
                <ToastrContainer />

                <Switch>
                    <Route exact path="/" component={Login} />
                    <Route exact path="/newregistration" component={Newregistration} />
                    <Route exact path="/recoveraccount" component={Recoveraccount} />
                    <PrivateRoutelogin
                        exact
                        path="/loginsecure"
                        userresstatus={this.state.logon}
                        component={Loginsecure} />

                    <PrivateRoute
                        authed={this.state.authenticated}
                        path="/layout/accountsummary"
                        component={Layout} />
                    <PrivateRoutepermissionMFA userpermissionstatus={this.state.hasDevice}
                        authed={this.state.authenticated}
                        path="/layout/MFA"
                        component={Layout} />
                    <PrivateRoutepermissionlogin
                        userpermissionstatus={this.state.tokenmanagement}
                        authed={this.state.authenticated}
                        path="/layout/tokenmanagement"
                        component={Layout} />
                    <PrivateRoute
                        authed={this.state.authenticated}
                        path="/layout/domestictransfer"
                        component={Layout} />
                    <PrivateRoute
                        authed={this.state.authenticated}
                        path="/layout/externaltransfer"
                        component={Layout} />
                    <PrivateRoutepermissionlogin userpermissionstatus={this.state.tokenmanagement}
                        authed={this.state.authenticated}
                        path="/layout/batchtransfer"
                        component={Layout} />
                    <PrivateRoute
                        authed={this.state.authenticated}
                        path="/layout/Resetaccount"
                        component={Layout} />
                    <PrivateRoute
                        authed={this.state.authenticated}
                        path="/Mobileregistration"
                        component={Mobileregistration} />
                    <PrivateRoute
                        authed={this.state.authenticated}
                        path="/layout/tokenlist"
                        component={Layout} />
                    <PrivateRoute
                        authed={this.state.authenticated}
                        path="/layout/personalinformation"
                        component={Layout} />
                    <PrivateRoute
                        authed={this.state.authenticated}
                        path="/layout/newbeneficiary"
                        component={Layout} />
                    <PrivateRoute
                        authed={this.state.authenticated}
                        path="/layout/accountdetail"
                        component={Layout} />
                    <PrivateRoute
                        authed={this.state.authenticated}
                        path="/layout/cardtransactions"
                        component={Layout} />
                    <PrivateRoute
                        authed={this.state.authenticated}
                        path="/layout/mywallet"
                        component={Layout} />
                    <PrivateRoute
                        authed={this.state.authenticated}
                        path="/layout/mycard"
                        component={Layout} />
                    <PrivateRoute
                        authed={this.state.authenticated}
                        path="/layout/managecard"
                        component={Layout} />
                    <PrivateRoute
                        authed={this.state.authenticated}
                        path="/layout/loading"
                        component={Layout} />
                    <PrivateRoute
                        authed={this.state.authenticated}
                        path="/ecomm3ds"
                        component={Ecommerce3DS} />
                    <PrivateRoute
                        authed={this.state.authenticated}
                        path="/ecommdcv"
                        component={EcommerceDCV} />
                    <PrivateRoute
                        authed={this.state.authenticated}
                        path="/atmQRcode"
                        component={AtmQR} />
                    <PrivateRoute
                        authed={this.state.authenticated}
                        path="/atmcashcode"
                        component={Atmcash} />
                    <PrivateRoute
                        authed={this.state.authenticated}
                        path="/layout/DCVactivation"
                        component={Layout} />
                    <PrivateRoutepermissionlogin userpermissionstatus={this.state.UserPreference}
                        authed={this.state.authenticated}
                        path="/layout/userpreference"
                        component={Layout} />
                    <PrivateRoute
                        authed={this.state.authenticated}
                        path="/layout/beneficiarylist"
                        component={Layout} />
                    <PrivateRoutepermissionlogin userpermissionstatus={this.state.CardIssuance}
                        authed={this.state.authenticated}
                        path="/layout/cardissuance"
                        component={Layout} />
                    <Route
                        exact
                        path="/qr"
                        component={Qrtoken} />
                </Switch>

            </div>

        )
    }
}

ReactDOM.render(
    <Provider store={store}>
        <HashRouter>
            <App />
        </HashRouter>
    </Provider>, document.getElementById("app"));
function PrivateRoute({
    component: Component,
    authed,
    ...rest
}) {
    return (
        <Route
            {...rest}
            render={(props) => authed === true
                ? <Component {...props} />
                : <Redirect
                    to={{
                        pathname: '/',
                        state: {
                            from: props.location
                        }
                    }} />} />
    )
}
function PrivateRoutelogin({
    component: Component,
    userresstatus,
    ...rest
}) {
    return (
        <Route
            {...rest}
            render={(props) => userresstatus === true
                ? <Component {...props} />
                : <Redirect
                    to={{
                        pathname: '/',
                        state: {
                            from: props.location
                        }
                    }} />} />
    )
}

function PrivateRoutepermissionlogin({
    component: Component, authed,
    userpermissionstatus,
    ...rest
}) {
    return (
        <Route
            {...rest}
            render={(props) => authed === true && userpermissionstatus === true
                ? <Component {...props} />
                : <Redirect
                    to={{
                        pathname: '/layout/accountsummary',
                        state: {
                            from: props.location
                        }
                    }} />} />
    )
}
function PrivateRoutepermissionMFA({
    component: Component, authed,
    userpermissionstatus,
    ...rest
}) {
    return (
        <Route
            {...rest}
            render={(props) => authed === true && userpermissionstatus === false
                ? <Component {...props} />
                : <Redirect
                    to={{
                        pathname: '/layout/accountsummary',
                        state: {
                            from: props.location
                        }
                    }} />} />
    )
}
export default App
