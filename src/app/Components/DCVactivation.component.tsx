import * as React from 'react';
import {Component} from 'react'
import {Link} from 'react-router-dom';
import {withRouter} from 'react-router-dom';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {store} from '../Store/store';
import {setload,postDCVactivationaction} from '../Actions/action';
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

class DCVactivation extends React.Component < any,
any > {
    constructor(props) {
        super(props);
        this.state = {
            username: store
                .getState()
                .username,
            successmessage:false,
            errormessage:false,
            cardvalue1: '',
            cardvalue2: '',
            cardvalue3: '',
            cardvalue4: '',
            panvalue:'',
            displaymessage:''
        };
    }

    errormessages = [
	{
		"type": "FORBIDDEN",
		"header": "Activation failed!",
		"message": "Card already associated."
	},
	{
		"type": "NOT_FOUND",
		"header": "Activation failed!",
		"message": "The card number you entered doesn't match our records. Please try again."
	},
    {
		"type": "INTERNAL_SERVER_ERROR",
		"header": "Activation failed!",
		"message": "Server error. Please try again."
    }
    ]

    componentWillMount() {}
    componentDidMount(){
        this.props.setload(false);
    }

    handlemtcancel(e) {
        e.preventDefault();
        this
            .props
            .history
            .push('/layout/accountsummary');
    }

    handleKeyPress = (event) => {
        console.log(event, 'enter press here! ')
    }

    handleNavigateTokenlist()
    {
        this
            .props
            .history
            .push('/layout/tokenlist');
    }

    handleKeyPressnumber = (event) => {
        var charCode = event.charCode;
        //Non-numeric character range
        if (charCode > 31 && (charCode < 48 || charCode > 57)) {
            event.preventDefault();
        }

        console.log(event.target.value.replace(/\W/gi, '').replace(/(.{4})/g, '$1 '))
        if(event.target.value.length<16)
        {
            var currentpanvalue=event.target.value.replace(/\W/gi, '').replace(/(.{4})/g, '$1 ');
            this.setState({
                panvalue:currentpanvalue
            })
        }
        if(charCode === 13) {
            this.handleDCVactivation(event);
        }
      
    }
    handleDCVactivation(e)
    {
        e.preventDefault();
        this.props.setload(true);
        this.setState(
            {
                    successmessage:false,
                    errormessage:false,
                    displaymessage:''
                }
            )
        const self=this;


        var currentCardNo= this.state.panvalue.replace(/\s/g,'');
        console.log(this.state.panvalue.replace(/\s/g,''))
        if(currentCardNo.length === 16)
        {
            var senddetails ={
                userId:this.state.username,
                panNo:this.state.panvalue.replace(/\s/g,'')
            }
            console.log("senddetails",senddetails);
            this.props.postDCVactivationaction(senddetails).then(function(response){
                console.log(response);
                self.setState({
                    panvalue: ''
                })
    
                if(response !== undefined && response.data.responseCode === 200)
                {
                    console.log("Success")
                    self.setState({
                        successmessage:true
                    });
                    self.props.setload(false);
                }
                else{
                    console.log("Failure");
                    if(response !== undefined)
                    {
                        var currenterrormessage = self.errormessages.filter((item) => item.type == response.data.statusCode)
                        self.setState({
                            errormessage:true,
                            displaymessage:currenterrormessage[0].message
                        })
                    }
                  
                    self.props.setload(false);
                }
              
            })
        }
        else{

                console.log("error1")
                document
                .getElementById("panfield")
                .focus();
            if(currentCardNo === "")
            {
                ToastDanger('Error. (*) fields are required');
            }
            else{
                ToastDanger('Invalid card number');
            }
            
           
            this.props.setload(false);
        }
    }
    render() {
        return (

            <div>

                <Grid columns={1} stackable>
                    <Grid.Row>
                        <Grid.Column width={14}>
                            <Segment id="Summarybox">
                                <span className="accst">DCV activation</span>
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
                        <Segment className="accdetailsec tcontentdetail">
                            
                            {this.state.successmessage === true && <div id="tmsgbox">
                                <Message positive>
                                    <div className="tsuccess"><Icon id="tick" name='checkmark' /> </div>
                                    <div>
                                        <Message.Header>Activation done!</Message.Header>
                                        <p>Card activated successfully.</p>
                                    </div>
                                </Message> </div>
                                }
                                {this.state.errormessage === true && <div id="tmsgbox">
                                <Message negative>
                                        <div className="twarning"><Icon color="red" name='warning sign'/> </div>
                                        <div>
                                        <Message.Header>Activation failed!</Message.Header>
                                        <p>{this.state.displaymessage}</p>
                                        </div>
                                </Message> </div>
                                }
                           
                            <div id="dcvmsgreq">
                                <span>
                                    <label className="star">*</label>Required</span>
                            </div>
                            <div id="dcv-height">
                                <div id="tpcctxt">
                                    <div className="tokenfrmttl">1. Enter the PAN number of your card</div>
                                </div>
                                <div className="dcv-align">
                                    <div>
                                        <label id="dcv-cardlabel">Card number<label className="star">*</label>
                                        </label>
                                        <span>
                                            <input
                                                id="panfield" className="dcv-panfield" maxLength={19}
                                                onKeyPress={this.handleKeyPressnumber}
                                                type='text'
                                                value={this.state.panvalue}
                                                onChange={(evt) => {
                                                this.setState({panvalue: evt.target.value});
                                            }}/>

                                        </span>
                                    </div>
                                    <div id="dcv-step1-ins">Click on the
                                        <span className="dcv-bold">Activate</span>
                                        button to activate and link the card to your account.</div>
                                </div>
                            </div>

                            <div>
                                <div id="tpcctxt">
                                    <div className="tokenfrmttl">2. Make sure your token is available in your list of tokens</div>
                                </div>
                                <div className="dcv-align">
                                    <div>
                                        A token name starting by
                                        <span id="dcv-gapc" className="dcv-bold">GAPC</span>
                                        must be present in your
                                        <span id="dcv-tokenlist" className="dcv-bold" onClick={this.handleNavigateTokenlist.bind(this)}>token list.</span>
                                    </div>
                                </div>
                            </div>
                        </Segment>
                    </Grid.Column>
                    <Grid.Column width={14}>
                        <div className="rtbtngroup">
                            <Divider/>
                            <button className="ui grey button" onClick={(e) => this.handlemtcancel(e)}>
                                Cancel
                            </button>
                            <button
                                className="ui blue button btnrightal"
                                onClick={(e) => this.handleDCVactivation(e)}>
                                Activate
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
        postDCVactivationaction:postDCVactivationaction
    }, dispatch)
}

export default withRouter(connect(mapStateToProps, matchDispatchToProps)(DCVactivation));
