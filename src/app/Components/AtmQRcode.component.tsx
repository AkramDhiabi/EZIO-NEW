import * as React from 'react';
import { Component } from 'react'
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { store } from '../Store/store';
import { posteziologoutaction, setload, postAtmQrdetails, getQRcodeStatus, setcurrentroute, deletaAtmDetailsaction } from '../Actions/action';
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
    Popup
} from 'semantic-ui-react';
import Slider from "react-slick";
import Gemaltohdr from './Gemaltohdr.component';
import 'semantic-ui-css/semantic.min.css';


import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const atm0 = require('../../img/atm_brut_shad.png');
const atm5 = require('../../img/atm_brut_shad_5.png');
const atmpad = require('../../img/atmpad.png');

const loginlogo = require('../../img/demologo.png');

function QRcodegenerator(QRvalue) {
    const hexData = QRvalue;
    const qrVersion = 9;
    const errorCorrectionLevel = 'L';
    const script2 = document.createElement("script");

    const s = document.createElement('script');
    s.type = 'text/javascript';
    s.async = true;
    s.innerHTML = "window.draw_qrcode('" + hexData + "'," + qrVersion + ",'" + errorCorrectionLevel + "')";
    document.body.appendChild(s);
}

class AtmQRcode extends React.Component<any,
    any> {
    constructor(props) {
        super(props);
        this.state = {
            amount: '',
            viewamount: ''

        }
    }
    slider = null;
    componentWillMount() {
        this
            .props
            .setload(true);
        this
            .props
            .setload(false);
    }
    a = event => {
        if (event.key === 'Enter') {
            this.handleatmsubmit()
            return
        }

        if (isNaN(Number(event.key))) {
            this.handleatmclear();
            return 
        }
        
        this.handlenumberinput(event.key);
    }
    componentDidMount() {
        this.props.setload(false);

        document.addEventListener('keypress', this.a)
    }

    componentWillUnmount() {
        document.removeEventListener('keypress', this.a)
    }

    handlenumberinput(value: string) {
        if (this.state.errorlabel !== '' || this.state.amount.length >= 3) {
            this.setState({
                errorlabel: '',
                amount: value,
                viewamount: '$' + value
            })
            return
        }

        var newamount = this.state.amount + value
        this.setState({
            amount: newamount,
            viewamount: '$' + newamount
        })
    }

    handleatmclear() {
        this.setState({
            amount: '',
            errorlabel: '',
            viewamount: ''
        })
    }

    handleatmcancel() {
        console.log("ATM cancel");
        try { window.stop(); } catch (exception) { document.execCommand('Stop'); };
        this.props.setcurrentroute('/atmQRcode');
        this.props.history.push(`/layout/loading`);
    }
    handleatmback() {
        try { window.stop(); } catch (exception) { document.execCommand('Stop'); };
        this
            .props
            .history
            .push('/layout/accountsummary');
    }
    handleQRtoCash() {
        try { window.stop(); } catch (exception) { document.execCommand('Stop'); };
        this
            .props
            .history
            .push('/atmCashcode');
    }

    handletoMobileactivation() {
        try { window.stop(); } catch (exception) { document.execCommand('Stop'); };
        this
            .props
            .history
            .push('/mobileregistration');
    }

    handleatmsubmit() {
        console.log("ATM submit")
        if (this.state.amount !== '' && parseInt(this.state.amount, 10) !== 0 && parseInt(this.state.amount, 10) < 501 && parseInt(this.state.amount, 10) % 20 === 0) {
            var senddata = {
                userId: store.getState().username,
                amount: this.state.amount
            }

            const self = this;
            self.setState({
                amount: ''
            })
            this.props.postAtmQrdetails(senddata).then(function (response) {


                if (response !== undefined && response.data.responseCode === 200) {

                    console.log(document.getElementById('atm-qr-sec'));
                    document.getElementById("atm-amt-sec").classList.add("removevisiblity");
                    document.getElementById("atm-qr-sec").classList.remove("removevisiblity");
                    QRcodegenerator(response.data.templateObject.qrCodeForAtm);

                    var sendatmdata = {
                        userId: store.getState().username,
                        atmId: response.data.templateObject.atmId
                    }
                    self.setState({
                        amount: ''
                    })

                    self.props.getQRcodeStatus(sendatmdata).then(function (response) {
                        if (response !== undefined && response.data.responseCode === 200) {
                            document
                                .getElementById("atm-qr-sec")
                                .classList
                                .add("removedisplay");
                            document
                                .getElementById("atm-status-success")
                                .classList
                                .remove("removedisplay");
                            document
                                .getElementById("atm-qrmainblock")
                                .classList
                                .add("removedisplay");
                            document
                                .getElementById("atm-mainsuccessblock")
                                .classList
                                .remove("removedisplay");

                            self
                                .slider
                                .slickNext();

                        }
                        else if (response !== undefined && response.data.responseCode === 401) {
                            document
                                .getElementById("atm-qr-sec")
                                .classList
                                .add("removedisplay");
                            document
                                .getElementById("atm-status-failure")
                                .classList
                                .remove("removedisplay");
                            document
                                .getElementById("atm-qrmainblock")
                                .classList
                                .add("removedisplay");
                            document
                                .getElementById("atm-mainfailureblock")
                                .classList
                                .remove("removedisplay");
                        }
                        else if (response !== undefined && response.data.responseCode === 204) {
                            document
                                .getElementById("atm-qr-sec")
                                .classList
                                .add("removedisplay");
                            document
                                .getElementById("atm-status-timeout")
                                .classList
                                .remove("removedisplay");
                            document
                                .getElementById("atm-qrmainblock")
                                .classList
                                .add("removedisplay");
                            document
                                .getElementById("atm-maintimeoutblock")
                                .classList
                                .remove("removedisplay");
                        }
                        else {
                            document
                                .getElementById("atm-qr-sec")
                                .classList
                                .add("removedisplay");
                            document
                                .getElementById("atm-status-timeout")
                                .classList
                                .remove("removedisplay");
                            document
                                .getElementById("atm-qrmainblock")
                                .classList
                                .add("removedisplay");
                            document
                                .getElementById("atm-maintimeoutblock")
                                .classList
                                .remove("removedisplay");
                        }
                    });

                }
                else {
                    document.getElementById("atm-qr-sec").classList.add("removevisiblity");
                    document.getElementById("atm-status-failure").classList.remove("removevisiblity");
                }

            });
        }
        // else if( parseInt(this.state.amount, 10) !== 0 || parseInt(this.state.amount, 10) % 20 !== 0){
        //     this.setState({
        //         errorlabel:'Invalid amount'
        //     })
        // }
    }
    render() {
        var settings = {
            dots: false,
            infinite: true,
            speed: 15,
            slidesToShow: 1,
            slidesToScroll: 1,
            swipeToSlide: false,
            swipe: false,
            arrows: false
        };
        return (
            <div>
                <Grid>
                    <Grid.Column width={16}>
                        <Segment className="hdrstylcss brdrmainclass layoutheader">
                            <Gemaltohdr />
                        </Segment>
                    </Grid.Column>
                </Grid>
                <Grid>
                    <Grid.Column className="atm_bg" width={16}>

                        <Slider ref={c => (this.slider = c)} {...settings}>
                            <div className="atm-outline">
                                <img src={atm0} alt="Gemalto" />
                            </div>

                            <div className="atm-outline">
                                <img src={atm5} alt="Gemalto" />
                            </div>
                        </Slider>

                        <div id="atm-amt-sec" className="atm-displaysec">
                            <img className="logoimage" src={loginlogo} alt="Gemalto" />
                            <div className="atm-label atm-qrlabel">Please enter your withdrawal amount <p className="atm-linebrk">in multiples of $20</p></div>
                            <div className="atm-amount atm-input">{this.state.viewamount}</div>
                            <span className="atm-error-label">{this.state.errorlabel}</span>
                        </div>

                        <div id="atm-qr-sec" className="removevisiblity">
                            <span className="atm-info-icon">
                                <Popup className="atm-popup" trigger={<Icon name='info circle' />} wide>
                                    <Popup.Header>Withdraw cash by QR code</Popup.Header>
                                    <Popup.Content>
                                        <span className="atm-popup-span">Scan this QR code with your Ezio Mobile app</span>
                                        <br />
                                        <span className="atm-popup-span">ATM -{">"} Scan ATM QR code</span>
                                    </Popup.Content>
                                </Popup>
                            </span>
                            <div id="qrcodediv" className="atm-qralign">

                            </div>
                        </div>
                        <div id="atm-status-success" className="removedisplay">
                            <div className="atm-success-msg">
                                <div>
                                    <Icon className="atm-success-icon" name='check circle outline' />
                                </div>
                                <span className="atm-status-msg">Please collect your money</span>
                            </div>
                        </div>
                        <div id="atm-status-failure" className="atm-displaysec removedisplay">
                            <img className="logoimage" src={loginlogo} alt="Gemalto" />
                            <div className="atm-fail-msg">
                                <div>
                                    <Icon className="atm-fail-icon" color="red" name='warning sign' />
                                </div>
                                <span className="atm-status-msg">Authentication failed!</span>
                            </div>
                        </div>
                        <div id="atm-status-timeout" className="atm-displaysec removedisplay">
                            <img className="logoimage" src={loginlogo} alt="Gemalto" />
                            <div className="atm-fail-msg">
                                <div>
                                    <Icon className="atm-fail-icon" color="red" name='warning sign' />
                                </div>
                                <span className="atm-status-msg atm-expstatus-msg">Session expired!</span>
                            </div>
                        </div>



                        <div id="atm-qrmainblock" className="atm-block">
                            <div className="atm-info">
                                <span>
                                    Please enter your amount and scan the QR code displayed on the ATM screen with you Ezio mobile app to withdraw cash
                            </span>
                                <span className="atm-common atm-download-desc">
                                    Don't have the application on your mobile phone yet?
                            </span>
                                <span className="atm-common atm-download" onClick={this.handletoMobileactivation.bind(this)}>
                                    Click here to download
                            </span>
                                <button onClick={this.handleQRtoCash.bind(this)} className="ui blue button atm-common">
                                    Withdraw cash by code
                            </button>
                                <button onClick={this.handleatmback.bind(this)} className="ui blue button atm-common">
                                    Back to accounts
                            </button>
                            </div>


                            <div className="atm-numberpad">
                                <div className="parent col-lg-2">
                                    <div className="atmbtn-position col-lg-12">
                                        <div className="atm-btn-num1 col-lg-3" >
                                            <a onClick={() => this.handlenumberinput('1')}>1</a>
                                        </div>
                                        <div className="atm-btn-num2 col-lg-3" >
                                            <a onClick={() => this.handlenumberinput('2')}>2</a>
                                        </div>
                                        <div className="atm-btn-num3 col-lg-3" >
                                            <a onClick={() => this.handlenumberinput('3')}>3</a>
                                        </div>
                                        <div className="atm-btn-cancel col-lg-3">
                                            <a>CANCEL</a>
                                        </div>
                                        <div className="atm-btn-num4 col-lg-3" >
                                            <a onClick={() => this.handlenumberinput('4')}>4</a>
                                        </div>
                                        <div className="atm-btn-num5 col-lg-3" >
                                            <a onClick={() => this.handlenumberinput('5')}>5</a>
                                        </div>
                                        <div className="atm-btn-num6 col-lg-3" >
                                            <a onClick={() => this.handlenumberinput('6')}>6</a>
                                        </div>
                                        <div className="atm-btn-clear col-lg-3" >
                                            <a onClick={this.handleatmclear.bind(this)}>CLEAR</a>
                                        </div>
                                        <div className="atm-btn-num7 col-lg-3" >
                                            <a onClick={() => this.handlenumberinput('7')}>7</a>
                                        </div>
                                        <div className="atm-btn-num8 col-lg-3" >
                                            <a onClick={() => this.handlenumberinput('8')}>8</a>
                                        </div>
                                        <div className="atm-btn-num9 col-lg-3" >
                                            <a onClick={() => this.handlenumberinput('9')}>9</a>
                                        </div>
                                        <div className="atm-btn-enter col-lg-3" >
                                            <a onClick={this.handleatmsubmit.bind(this)}>ENTER</a>
                                        </div>
                                        <div className="atm-btn-left col-lg-3"><a >-</a></div>
                                        <div className="atm-btn-num0 col-lg-3" onClick={() => this.handlenumberinput('0')}>
                                            <a onClick={() => this.handlenumberinput('0')}>0</a>
                                        </div>
                                        <div className="atm-btn-right col-lg-3"><a >+</a></div>
                                        <div className="atm-btn col-lg-3 blank"></div>


                                    </div>
                                </div>
                            </div>
                        </div>




                        <div id="atm-mainsuccessblock" className="atm-block removedisplay">

                            <div className="atm-info">
                                <span className="atm-common atm-download-desc">
                                    Don’t forget your cash.
                            </span>
                                <button
                                    onClick={this
                                        .handleatmcancel
                                        .bind(this)}
                                    className="ui blue button atm-common">
                                    Try again
                            </button>
                                <button
                                    onClick={this
                                        .handleatmback
                                        .bind(this)}
                                    className="ui blue button atm-common">
                                    Back to accounts
                            </button>
                            </div>
                        </div>
                        <div id="atm-mainfailureblock" className="atm-block removedisplay">
                            <div className="atm-info">
                                <span className="atm-common atm-download-desc">
                                    We could not authenticate you.
                            </span>
                                <button
                                    onClick={this
                                        .handleatmcancel
                                        .bind(this)}
                                    className="ui blue button atm-common">
                                    Try again
                            </button>
                                <button
                                    onClick={this
                                        .handleatmback
                                        .bind(this)}
                                    className="ui blue button atm-common">
                                    Back to accounts
                            </button>
                            </div>
                        </div>
                        <div id="atm-maintimeoutblock" className="atm-block removedisplay">
                            <div className="atm-info">
                                <span className="atm-common atm-download-desc">
                                    Your session has expired!
                            </span>
                                <button
                                    onClick={this
                                        .handleatmcancel
                                        .bind(this)}
                                    className="ui blue button atm-common">
                                    Try again
                            </button>
                                <button
                                    onClick={this
                                        .handleatmback
                                        .bind(this)}
                                    className="ui blue button atm-common">
                                    Back to accounts
                            </button>
                            </div>
                        </div>


                    </Grid.Column>
                </Grid>
                <Grid>
                    <Grid.Column className="atm-footer" width={16}>
                        <Segment className="bottomseg">
                            <div className="atm_foot_detail">
                                <span>
                                    <a href="https://www.thalesgroup.com/en/markets/digital-identity-and-security/banking-payment">THALESGROUP.COM</a>
                                </span>
                            </div>
                        </Segment>
                    </Grid.Column>
                </Grid>

            </div >

        )
    }
}
function mapStateToProps(state) {
    return {}
}
function matchDispatchToProps(dispatch) {
    return bindActionCreators({
        posteziologoutaction: posteziologoutaction,
        setload: setload,
        postAtmQrdetails: postAtmQrdetails,
        getQRcodeStatus: getQRcodeStatus,
        setcurrentroute: setcurrentroute,
        deletaAtmDetailsaction: deletaAtmDetailsaction
    }, dispatch)
}
export default connect(mapStateToProps, matchDispatchToProps)(AtmQRcode)
