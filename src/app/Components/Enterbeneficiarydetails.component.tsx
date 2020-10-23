import * as React from 'react';
import {connect} from 'react-redux';
import {store} from '../Store/store';
import {Provider} from 'react-redux';
import {Link} from 'react-router-dom';
import {withRouter} from 'react-router-dom';
import {
    Accordion,
    Button,
    Container,
    Loader,
    Input,
    Dimmer,
    Dropdown,
    Advertisement,
    Grid,
    Header,
    Icon,
    Image,
    Item,
    Label,
    Menu,
    Message,
    Segment,
    Step,
    Table,
    Form,
    Modal,
    Divider
} from 'semantic-ui-react';
import {bindActionCreators} from 'redux';

const loginlogo = require('../../img/demologo.png');
const loginbackground = require('../../img/loginbackground.jpg');

import {FormBuilder, FieldControl, FieldGroup} from "react-reactive-form";
import * as ReactCountdownClock from "react-countdown-clock";
import {
    postAuthenticate,
    checklogin,
    postusercheckpendingstatus,
    posttransferaccountdetails,
    setaccountlist,
    postusersendnotificationstatus,
    setcurrentbeneficiarystep,
    postusersgetcallbackstatus,
    postuserdeletecallbackdataaction,
    setsnerrtype,
    postusersdeletependingtransactionstatus,
    setload,
    getbeneficiarystatus
} from "../Actions/action";

import {ToastDanger} from 'react-toastr-basic';

class Enterbeneficiarydetails extends React.Component < any,
any > {

    constructor(props) {
        super(props);
        this.state = {
            username: store
                .getState()
                .username,
            errormessage: false,
            beneficiaryErrormessage:false
        }
    }

    componentWillMount() {

        var userdetails = {
            userId: this.state.username
        }

        if (store.getState().beneficiarydetails !== null) {
            this
                .beneficiarydetailform
                .controls['accountname']
                .setValue(store.getState().beneficiarydetails.accountname);
            this
                .beneficiarydetailform
                .controls['accountno']
                .setValue(store.getState().beneficiarydetails.accountno);
        }

    }

    componentDidMount() {
        this.props.setload(false);
    }
    handlemtcancel(e) {
        e.preventDefault();
        this
            .props
            .history
            .push('/layout/accountsummary');
    }

    handleKeyPressnumber = (event) => {
        var charCode = event.charCode;
        //Non-numeric character range
        if (charCode > 31 && (charCode < 48 || charCode > 57)) {
            event.preventDefault();
        }
        if(charCode === 13) {
            this.handlebeneficiarysubmit(event);
        }
    }

    handleAlphaOnly= (event) => {
     
        var charCode = event.charCode;
        if ((charCode > 26 && charCode < 65) || (charCode > 90 && charCode< 97) || charCode >122) {
          event.preventDefault();
        }
        if(charCode === 13) {
            this.handlebeneficiarysubmit(event);
        }
      }
    
    handlebeneficiarysubmit(e : React.MouseEvent < HTMLButtonElement >) {
        e.preventDefault();
        this.props.setload(true);
        var currentbalance;
        this.setState({errormessage: false,
            beneficiaryErrormessage:false
        })
        if (this.beneficiarydetailform.value.accountname !== '' && this.beneficiarydetailform.value.accountno !== '' && this.beneficiarydetailform.value.accountno.length === 10) {
            var datenow = new Date().toString();
            this.beneficiarydetailform.value.date = datenow;
            var setbeneficiarydetails = {
                currentstep: 2,
                beneficiaryDetail: this.beneficiarydetailform.value,
                operationtype:'EzioDemoV2_NewBeneficiary'
            }
           
            const self=this;
            var senddata={
                userId:store.getState().username,
                accountno:this.beneficiarydetailform.value.accountno
            }
            this.props.getbeneficiarystatus(senddata).then(function (response) {
                if(response !== undefined && response.data.responseCode === 200) {
                    self.props.setload(false);
                    self
                    .props
                    .setcurrentbeneficiarystep(setbeneficiarydetails);
                }
                else if(response !== undefined && response.data.responseCode === 409){       
                    self.props.setload(false);
                    self.setState({beneficiaryErrormessage: true})
                }
                else{
                    self.props.setload(false);
                    ToastDanger('Internal server error');
                }

            })
            
        } else {

            if(this.beneficiarydetailform.value.accountno.length !== 10)
            {
                ToastDanger('Please enter valid account number');
            }
            else{
                ToastDanger('Error. (*) fields are required.');
            }

            this.props.setload(false);

          
        }

    }

    beneficiarydetailform = FormBuilder.group({accountname: "", accountno: ""});

    render() {

        return (
            <div>
                {this.state.errormessage === true && <Message negative>
                    <div className="twarning"><Icon color="red" name='warning sign'/>
                    </div>
                    <div>
                        <Message.Header>Invalid transfer details!</Message.Header>
                        <p>Overdraft not authorized</p>
                    </div>
                </Message>
}
                {this.state.beneficiaryErrormessage === true && <Message negative>
                                    <div className="twarning"><Icon color="red" name='warning sign'/>
                                    </div>
                                    <div>
                                        <Message.Header>Invalid beneficiary details!</Message.Header>
                                        <p>Beneficiary account number already exists.</p>
                                    </div>
                                </Message>
                }

                <span className="addfontsize">Step 1 of 4: Enter beneficiary details</span>
                <span className="mtrequirelabel">
                    <label className="star">*</label>indicates a required field</span>
                <div className="tmplbrdrcls addmargin"></div>

                <FieldGroup
                    control={this.beneficiarydetailform}
                    render={({pristine, value}) => (
                    <form className="etform" onSubmit={() => this.handlebeneficiarysubmit}>
                        <Table className="rttable" singleLine basic='very' unstackable>
                            <Table.Body>
                                <Table.Row>
                                    <Table.Cell>
                                        <label className="pwdusr">Account name<label className="star">*</label>
                                        </label>
                                    </Table.Cell>
                                    <Table.Cell>
                                        <FieldControl
                                            name="accountname"
                                            render={({handler}) => (
                                            <div>
                                                <input onKeyPress={this.handleAlphaOnly} {...handler()} maxLength={20} />
                                            </div>
                                        )}/>
                                    </Table.Cell>
                                </Table.Row>
                                <Table.Row>
                                    <Table.Cell id="ebdesc">
                                            Enter your <span className="ebunderline">10 digits</span> beneficiary account number
                                    </Table.Cell>
                                </Table.Row>
                                <Table.Row>
                                    <Table.Cell>
                                        <label className="pwdusr">Account number<label className="star">*</label>
                                        </label>
                                    </Table.Cell>
                                    <Table.Cell>
                                        <FieldControl
                                            name="accountno"
                                            render={({handler}) => (
                                            <div>
                                                <input {...handler()} maxLength={10} onKeyPress={this.handleKeyPressnumber}/>
                                            </div>
                                        )}/>
                                    </Table.Cell>
                                </Table.Row>
                            </Table.Body>
                        </Table>
                    </form>
                )}/>
                <div>
                    <Divider/>
                    <button className="ui grey button" onClick={(e) => this.handlemtcancel(e)}>
                        Cancel
                    </button>
                    <button
                        className="ui blue button btnrightal"
                        onClick={(e) => this.handlebeneficiarysubmit(e)}>
                        Continue
                    </button>
                </div>
            </div>
        )
    }

}

function mapStateToProps(state) {
    return {}
}
function matchDispatchToProps(dispatch) {
    return bindActionCreators({
        setcurrentbeneficiarystep: setcurrentbeneficiarystep,
        posttransferaccountdetails: posttransferaccountdetails,
        setaccountlist: setaccountlist,
        getbeneficiarystatus:getbeneficiarystatus,
        setload:setload
    }, dispatch)
}

export default withRouter(connect(mapStateToProps, matchDispatchToProps)(Enterbeneficiarydetails));
