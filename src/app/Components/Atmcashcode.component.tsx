import * as React from 'react';
import { Component } from 'react'
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { store } from '../Store/store';
import {
    posteziologoutaction,
    setload,
    postAtmQrdetails,
    getQRcodeStatus,
    setcurrentroute,
    postAtmaccesscodeDetails,
    deletaAtmDetailsaction
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
    Input
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

class Atmcashcode extends React.Component<any,
    any> {

    constructor(props) {
        super(props);
        this.state = {
            accesscode: '',
            accessviewcode: ''
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

    componentDidMount() {
        this
            .props
            .setload(false);

        document.addEventListener('keypress', event => {
            const key = Number(String.fromCharCode(event.keyCode));
            if (Number.isNaN(key)) {
                return
            }
            this.handlenumberinput(key)

        })


        document.addEventListener('keypress', event => {
            if (event.charCode === 13) {
                this.handleatmsubmit()
            }
        })

    }

    handlenumberinput(value) {
        console.log("entered input", value);
        if (this.state.accesscode.length < 6) {
            var newaccesscode = this.state.accesscode + value;
            var newaccessviewcode;
            if (this.state.accesscode.length === 3) {
                newaccessviewcode = this.state.accessviewcode + ' ' + value;
            }
            else {
                newaccessviewcode = this.state.accessviewcode + value;
            }
            this.setState({ accesscode: newaccesscode, accessviewcode: newaccessviewcode })
        }
    }



    handleatmclear() {
        this.setState({ accesscode: '', errorlabel: '', accessviewcode: '' })
    }
    handleatmcancel() {
        console.log("ATM cancel");
        try { window.stop(); } catch (exception) { document.execCommand('Stop'); };
        this
            .props
            .setcurrentroute('/atmcashcode');
        this
            .props
            .history
            .push(`/layout/loading`);
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
            .push('/atmQRcode');
    }
    handletoMobileactivation() {
        try { window.stop(); } catch (exception) { document.execCommand('Stop'); };
        this
            .props
            .history
            .push('/mobileregistration');
    }


    handleatmsubmit() {
        console.log("ATM submit access")
        if (this.state.accesscode !== '' && this.state.accesscode.length === 6) {
            var senddata = {
                userId: store
                    .getState()
                    .username,
                accesscode: this.state.accesscode
            }
            // var senddata={ userId:'mindtree001', accesscode:this.state.accesscode }
            const self = this;
            this
                .props
                .postAtmaccesscodeDetails(senddata)
                .then(function (response) {
                    if (response !== undefined && response.data.responseCode === 200) {
                        document
                            .getElementById("atm-amt-sec")
                            .classList
                            .add("removedisplay");
                        document
                            .getElementById("atm-status-success")
                            .classList
                            .remove("removedisplay");
                        document
                            .getElementById("atm-mainblock")
                            .classList
                            .add("removedisplay");
                        document
                            .getElementById("atm-mainsuccessblock")
                            .classList
                            .remove("removedisplay");
                        self
                            .slider
                            .slickNext();

                    } else {
                        if (response !== undefined) {

                            document
                                .getElementById("atm-amt-sec")
                                .classList
                                .add("removedisplay");
                            document
                                .getElementById("atm-status-failure")
                                .classList
                                .remove("removedisplay");
                            document
                                .getElementById("atm-mainblock")
                                .classList
                                .add("removedisplay");
                            document
                                .getElementById("atm-mainfailureblock")
                                .classList
                                .remove("removedisplay");
                        }
                        else {
                            document
                                .getElementById("atm-amt-sec")
                                .classList
                                .add("removedisplay");
                            document
                                .getElementById("atm-status-timeout")
                                .classList
                                .remove("removedisplay");
                            document
                                .getElementById("atm-mainblock")
                                .classList
                                .add("removedisplay");
                            document
                                .getElementById("atm-maintimeoutblock")
                                .classList
                                .remove("removedisplay");
                        }
                    }
                });
        }
    }


    render() {
        var settings = {
            dots: false,
            infinite: true,
            speed: 10,
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
                            <div>
                                <img src={atm0} alt="Gemalto" />
                            </div>
                            <div>
                                <img src={atm5} alt="Gemalto"/>
                            </div>
                        </Slider>
                        <div id="atm-amt-sec" className="atm-displaysec">
                            <div>
                                <img className="logoimage" src={loginlogo} alt="Gemalto" />
                            </div>
                            <div className="atm-cash-ins">Enter your 6 digit cash code <p className="atm-linebrk">and press <span className="atm-enter-label">ENTER</span></p></div>
                            <div className="atm-amount atm-input" >
                                {this.state.accessviewcode}
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
                                <span className="atm-status-msg">Invalid cash code!</span>
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

                        <div id="atm-mainblock" className="atm-block">
                            <div className="atm-info">
                                <span>
                                    Please generate your access code from your Ezio Mobile app and enter it on the
                                    ATM screen to withdraw cash.
                                </span>
                                <span className="atm-common atm-download-desc">
                                    Don't have the application on your mobile phone yet?
                                </span>
                                <span className="atm-common atm-download" onClick={this.handletoMobileactivation.bind(this)}>
                                    Click here to download
                                </span>
                                <button
                                    onClick={this
                                        .handleQRtoCash
                                        .bind(this)}
                                    className="ui blue button atm-common">
                                    Withdraw cash by QR code
                                </button>
                                <button
                                    onClick={this
                                        .handleatmback
                                        .bind(this)}
                                    className="ui blue button atm-common">
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
                                        <div className="atm-btn-clear col-lg-3">
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
                                        <div className="atm-btn-enter col-lg-3">
                                            <a onClick={this.handleatmsubmit.bind(this)}>ENTER</a>
                                        </div>
                                        <div className="atm-btn-left col-lg-3"><a >-</a></div>
                                        <div className="atm-btn-num0 col-lg-3" >
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
                                    Your cash code is invalid.
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
            </div>
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
        postAtmaccesscodeDetails: postAtmaccesscodeDetails,
        deletaAtmDetailsaction: deletaAtmDetailsaction
    }, dispatch)
}
export default connect(mapStateToProps, matchDispatchToProps)(Atmcashcode)

