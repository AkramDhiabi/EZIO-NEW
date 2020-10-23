import * as React from 'react';
import {Component} from 'react'
import {Link} from 'react-router-dom';
import {withRouter} from 'react-router-dom';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {store} from '../Store/store';
import {
    posteziologoutaction,
    setusername,
    checklogin,
    postcheckresetoptions,
    postresetoptions,
    setload,
    postupdatesettingsaction,
    getcardsettingsaction
} from '../Actions/action';
import {
    Accordion,
    Button,
    Container,
    Divider,
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
    Message,
    Tab
} from 'semantic-ui-react';
const ToggleButton = require('react-toggle-button')

import {ToastDanger,ToastSuccess} from 'react-toastr-basic';


class Managecard extends React.Component < any,
any > {
    constructor(props) {
        super(props);
        this.state = {
            username: store
                .getState()
                .username,
            carddata: store.getState().carddetails,
            perMonthlimit:0,
            perTransactionlimit:0,
            pertrx:false,
            permonth:false,
            disableonline:false,
            blockvalue:false,
            cardsettings:null,
            noContent:false,
            noUpdate:false, 
            noContentupdate:false
        };
    
    }

  

    componentWillMount() {
        const senddata = {     
            userId:store.getState().username,
            panNo:this.state.carddata.panNo
            }

    //         const senddata = {
    //         userId: "mindtree001",
    //         panNo: "5980547693666523"
    // }
        const self = this;
        this
            .props
            .getcardsettingsaction(senddata)
            .then(function (response) {
                console.log(response);
                if (response !== undefined && response.data.responseCode === 200) {
                    console.log(response);
                    self.setState({
                        perMonthlimit:response.data.templateObject.amountLimitPerMonth,
                        perTransactionlimit:response.data.templateObject.amountLimitPerTransaction,
                        pertrx:response.data.templateObject.spendLimitTransactionStatus === 'ON'?true:false,
                        permonth:response.data.templateObject.spendLimitMonthStatus === 'ON'?true:false,
                        disableonline:response.data.templateObject.onlineTransaction === 'ON'?false:true,
                        blockvalue:response.data.templateObject.internationalTravel === 'ON'?false:true

                    });
                    self.setState({
                        cardsettings:response.data.templateObject
                    })
                    console.log(self.state,"state");
                  
                     self
                        .props
                        .setload(false);
                } else if (response !== undefined && response.data.responseCode === 204) {
                    console.log(response);
                    self
                        .props
                        .setload(false);
                    self.setState({
                        noContent:true
                    })
                } else {
                    console.log(response);
                    self
                        .props
                        .setload(false);
                    console.log('Error');
                }
            })
    }
    handleupdatestatus(e){
        e.preventDefault();
        this.setState({
            noContentupdate:false,
            noUpdate:false
        })
        var senddata={
            "userId": this.state.cardsettings.userId,
            "panNo": this.state.cardsettings.panNo,
            "cardStatus": this.state.cardsettings.cardStatus,
            "internationalTravel": this.state.blockvalue === false?"ON":"OFF",
            "onlineTransaction": this.state.disableonline === false?"ON":"OFF",
            "spendLimitTransactionStatus": this.state.pertrx === false?"OFF":"ON",
            "amountLimitPerTransaction": this.state.perTransactionlimit,
            "spendLimitMonthStatus": this.state.permonth === false?"OFF":"ON",
            "amountLimitPerMonth": this.state.perMonthlimit,
            "status": this.state.cardsettings.status

        }
        const self=this;
        this
        .props
        .postupdatesettingsaction(senddata)
        .then(function (response) {
            console.log(response);
            if (response !== undefined && response.data.responseCode === 200) {
                console.log(response);
                ToastSuccess('Status updated successfully');
                 self
                    .props
                    .setload(false);
            } 
            else if (response !== undefined && response.data.responseCode === 204) {
                console.log(response);
                self
                    .props
                    .setload(false);
                self.setState({
                    noContentupdate:true
                })
            } 
            else if (response !== undefined && response.data.responseCode === 417) {
                console.log(response);
                self
                    .props
                    .setload(false);
                self.setState({
                    noUpdate:true
                    })
            } else {
                
                self
                    .props
                    .setload(false);
                    ToastDanger('Server error.');
                console.log('Error');
            }
        })
    }
    handlemtcancel(e) {
        e.preventDefault();
        this
            .props
            .history
            .push('/layout/mycard');
    }

    handlemask(cardnumber){
       
        var first4 = cardnumber.substring(0, 6);
        var last5 = cardnumber.substring(cardnumber.length - 4);

        var mask = cardnumber.substring(6, cardnumber.length - 4).replace(/\d/g,"*");
        return first4 + mask + last5;
    }

    render() {
     
        return (

            <div>
                <Grid columns={1} stackable>
                    <Grid.Row>
                    <Grid.Column id="ttitle" width={14}>
                            <Segment id="Summarybox" className="defaultuiseg resettitle">
                                <span className="accst">Manage my card 
                                {
                                   this.state.carddata.cardType === 'visa' &&
                                   <span> (VISA - { this.handlemask(this.state.carddata.panNo)})</span>
                                }
                                {
                                   this.state.carddata.cardType === 'mastercard' &&
                                   <span> (MASTERCARD - { this.handlemask(this.state.carddata.panNo)})</span>
                                }</span>
                                 <a href="mailto:SUPPORT-DEMO@gemalto.com">
                                <span id="helpbox">Help
                                    <Icon name='help circle' className="helpdesc"/></span>
                                </a>
                            </Segment>
                            </Grid.Column>

                        <Grid.Column id="ttitle" width={14}>
                                {this.state.noContent === true &&
                                        <Message negative>
                                                <div className="twarning"><Icon color="red" name='warning sign'/> </div>
                                                <div>
                                                <Message.Header>Card not available!</Message.Header>
                                                <p>Looks like this card is no longer valid.</p>
                                                </div>
                                        </Message>
                                }
                                {this.state.noContentupdate === true &&
                                        <Message negative>
                                                <div className="twarning"><Icon color="red" name='warning sign'/> </div>
                                                <div>
                                                <Message.Header>Update failed!</Message.Header>
                                                <p>Looks like this card number is no longer valid.</p>
                                                </div>
                                        </Message>
                                }
                                {this.state.noUpdate === true &&
                                        <Message negative>
                                                <div className="twarning"><Icon color="red" name='warning sign'/> </div>
                                                <div>
                                                <Message.Header>Update failed!</Message.Header>
                                                <p>Expectation Failed, please try again later.</p>
                                                </div>
                                        </Message>
                                }
                                
                          
                                <Header as='h5' className="rtdetailheader" attached='top'>
                                    International travel
                                </Header>
                                <Segment id="resetsection" className="mgblock" attached>

                                    <span>
                                        Any transactions performed with this card outside your home country will be blocked.
                                    </span>


                                    <div className="tgbtngroup">
                                    <span>Block my card</span>
                                    <span className="tgswitch">
                                    <ToggleButton
                                    colors={{
                                        active: {
                                          base: 'rgb(62,130,247)'
                                        }
                                      }}
                                                value={ this.state.blockvalue}
                                                onToggle={(value) => {
                                                    this.setState({
                                                        blockvalue: !value,
                                                    })
                                                }} />
                                    </span>
                                    </div>

                                </Segment>

                                 <Header as='h5' className="rtdetailheader" attached='top'>
                                    Online transaction
                                </Header>
                                <Segment id="resetsection" className="mgblock" attached>

                                    <span>
                                        Any online purchase done with this card will be denied.
                                    </span>
                                    <div className="tgbtngroup">
                                    <span>Disable my online transaction</span>
                                    <span className="tgswitch"> 
                                    <ToggleButton
                                                 colors={{
                                                    active: {
                                                      base: 'rgb(62,130,247)'
                                                    }
                                                  }}
                                                value={ this.state.disableonline}
                                                onToggle={(value) => {
                                                    this.setState({
                                                        disableonline: !value,
                                                    })
                                                }} />
                                    </span>
                                    </div>
                                    
                                  
                            
                                </Segment>

                                 <Header as='h5' className="rtdetailheader" attached='top'>
                                    Spend limits
                                </Header>
                                <Segment id="resetsection" className="mgblock" attached>
                                    <span>
                                        Any purchase exceeding the established amounts will be denied.
                                    </span>
                                    <div className="tgbtngroup">
                                    <span>Per transaction</span>
                                    <span className="tgswitch">     
                                    <ToggleButton
                                                 colors={{
                                                    active: {
                                                      base: 'rgb(62,130,247)'
                                                    }
                                                  }}
                                                value={ this.state.pertrx}
                                                onToggle={(value) => {
                                                    this.setState({
                                                        pertrx: !value,
                                                    })
                                                }} />
                                    </span>
                                    {this.state.pertrx == true &&
                                    <label id="mgtxtlbl">
                                    Deny transaction exceeding
                                    <span id="mgtxtblock">$<input id="mgtxtbox" type="text" value={this.state.perTransactionlimit} 
                                    onChange={(e) => {
                                        this.setState({
                                            perTransactionlimit: e.target.value})}} /></span>
                                    </label>}
                                    </div>



                                   
                                    <div className="tgbtngroup">
                                    <span>Per month</span>
                                    <span id="tgswitch1">
                                        
                                    <ToggleButton
                                                colors={{
                                                    active: {
                                                    base: 'rgb(62,130,247)'
                                                    }
                                                }}
                                                value={ this.state.permonth}
                                                onToggle={(value) => {
                                                    this.setState({
                                                        permonth: !value
                                                    })
                                                }} />
                                    </span> 
                                    {
                                        this.state.permonth == true &&  
                                        <label id="mgtxtlbl">
                                            Deny transaction exceeding
                                            <span id="mgtxtblock">$<input id="mgtxtbox" type="text" value={this.state.perMonthlimit} onChange={(e) => {
                                                    this.setState({
                                                        perMonthlimit: e.target.value})}} /></span>
                                        </label>
                                    } 
                                    
                                    </div>


                            
                                </Segment>
                                <div className="rtbtngroup">
                                    <Divider/>
                                    <button className="ui grey button" onClick={(e) => this.handlemtcancel(e)}>
                                        Cancel
                                    </button>
                                    <button
                                        className="ui blue button btnrightal"
                                        onClick={(e) => this.handleupdatestatus(e)}>
                                        Update
                                    </button>
                                </div>
                        </Grid.Column>

                    </Grid.Row>
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
        setusername: setusername,
        checklogin: checklogin,
        postcheckresetoptions: postcheckresetoptions,
        postresetoptions: postresetoptions,
        setload: setload,
        postupdatesettingsaction:postupdatesettingsaction,
        getcardsettingsaction:getcardsettingsaction
    }, dispatch);
}

export default withRouter(connect(mapStateToProps, matchDispatchToProps)(Managecard));
