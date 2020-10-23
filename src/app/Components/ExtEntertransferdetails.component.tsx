import * as React from 'react';
import { connect } from 'react-redux';
import { store } from '../Store/store';
import { Provider } from 'react-redux';
import { Link } from 'react-router-dom';
import { withRouter } from 'react-router-dom';
import { Accordion, Button, Container, Divider, Loader, Input, Dimmer, Dropdown, Advertisement, Grid, Header, Icon, Image, Item, Label, Menu, Message, Segment, Step, Table, Form, Modal } from 'semantic-ui-react';
import { bindActionCreators } from 'redux';

const loginlogo = require('../../img/demologo.png');
const loginbackground = require('../../img/loginbackground.jpg');

import { FormBuilder, FieldControl, FieldGroup } from "react-reactive-form";
import * as ReactCountdownClock from "react-countdown-clock";
import { postAuthenticate, checklogin, postusercheckpendingstatus,posttransferaccountdetails,setbeneficiarydetail,setaccountlist,postusersendnotificationstatus, setcurrenttransferstep, postusersgetcallbackstatus, postuserdeletecallbackdataaction, setsnerrtype, postusersdeletependingtransactionstatus, setload } from "../Actions/action";

import { ToastDanger } from 'react-toastr-basic';



class ExtEntertransferdetails extends React.Component<any, any>{

    constructor(props) {
        super(props);
        this.state ={
            fromAcc:null,
            toAcc:null,
            fromAccselectedvalue:null,
            toAccselectedvalue:null,
            username:store.getState().username,
            errormessage:false,
            beneficiarycheck:true,
            toListd:[]
        }
    }
   
    fromList = []
    toList = []
   
    componentWillMount() {
        
        this.props.setload(true);
        if(store.getState().transferdetails !== null)
        {
            var currentvalue = store.getState().transferdetails;
            console.log(currentvalue)
            this.setState({
                fromAccselectedvalue:currentvalue.fromAccselectedvalue,
                toAccselectedvalue:currentvalue.toAccselectedvalue,
            })
            console.log(this.state);
        }
     
        var userdetails = {
            userId: this.state.username,
            type:"EXTERNAL_TRANSFER"
        }
      
        var self = this;
        if(store.getState().fromAccountlist !== null && store.getState().toAccountList!== null){
            this.fromList = store.getState().fromAccountlist;
            this.toList = store.getState().toAccountlist;
            if(store.getState().transferdetails !== null)
            {
                self.transferdetailform.controls['amount'].setValue(store.getState().transferdetails.amount);
                self.transferdetailform.controls['reason'].setValue(store.getState().transferdetails.reason);
            }
            self.props.setload(false);
        }
        else{
            this.props.posttransferaccountdetails(userdetails).then(function (response) {
         
           
                if (response !== undefined && response.data.responseCode === 200) {
                    
                    if(response.data.templateObject.toAccountList.length !== 0){
                        response.data.templateObject.fromAccountList.map(function(frmobj, find){
    
                            var fobj = {
                                text: frmobj.accountName +' ('+ frmobj.accountNo.replace(/\d(?=\d{4})/g, ".")+')',
                                value: frmobj.accountName +'-'+ frmobj.accountNo,
                                balance:frmobj.accountBalance,
                                fromaccountno:frmobj.accountNo
                            }
                            self.fromList.push(fobj)
                          
                        })
                       ;
                       
                        response.data.templateObject.toAccountList.map(function(frmobj, find){
                           
                            var fobj = {
                                text: frmobj.accountName +' ('+ frmobj.accountNo.replace(/\d(?=\d{4})/g, ".") +')',
                                value: frmobj.accountName +'-'+ frmobj.accountNo,
                                balance:frmobj.accountBalance,
                                toaccountno:frmobj.accountNo
                            }
                            self.toList.push(fobj)
                        })
                       
                       
                        self.props.setaccountlist({
                            fromList :self.fromList,
                            toList   :self.toList
                        })
                       
                        self.setState({
                            toListd:self.toList
                        })
                        console.log(self.state.toListd)
                        var newbeneficiary=store.getState().newbeneficiary;
                   
                    if(newbeneficiary !== null)
                    {
                        const result = self.toList.filter(list => list.toaccountno === newbeneficiary.accountno);
                        self.setState({
                            toAccselectedvalue:result[0].value
                        })

                        self.transferdetailform.controls['toAcc'].setValue(result[0].value);
                        var initializebeneficiarydata={
                            newbeneficiary:null
                        }
                        self.props.setbeneficiarydetail(initializebeneficiarydata);
                    }
                    console.log(self.setState);
                    console.log("in initial")
                    }
                    else{
                        self.setState({
                            beneficiarycheck:false
                        })
                    }
                   
                    self.props.setload(false);
                    

                }
                else{
                    self.props.setload(false);
                    ToastDanger('Server Error,Please try again later.');
                }
            })
        }
       


    }

    handlemtcancel(e) {
        e.preventDefault();
        this.props.history.push('/layout/accountsummary');
    }

    

    handleKeyPressnumber = (event) => {
        var charCode = event.charCode;
        //Non-numeric character range
        if (charCode > 31 && (charCode < 48 || charCode > 57)){
        event.preventDefault();
        }
        if(charCode === 13) {
            this.handletransfersubmit(event);
        }
    }
    
    handleReasonEnter= (event) => {
        var charCode = event.charCode;
        if(charCode === 13) {
            this.handletransfersubmit(event);
        }
    }
      
    handletransfersubmit(e: React.MouseEvent<HTMLButtonElement>) {
        e.preventDefault();
        var currentbalance;
        this.setState({
            errormessage:false
        })
        if(this.state.fromAccselectedvalue !== null && this.state.toAccselectedvalue !== null)
        {
            this.transferdetailform.value.fromAcc = this.state.fromAccselectedvalue.split('-')[1];
            this.transferdetailform.value.toAcc = this.state.toAccselectedvalue.split('-')[1];
            this.transferdetailform.value.fromAcctype = this.state.fromAccselectedvalue.split('-')[0];
            this.transferdetailform.value.toAcctype = this.state.toAccselectedvalue.split('-')[0];
            this.transferdetailform.value.fromAccselectedvalue = this.state.fromAccselectedvalue;
            this.transferdetailform.value.toAccselectedvalue = this.state.toAccselectedvalue;   
        }
        var datenow = new Date().toString();
        this.transferdetailform.value.date = datenow;
 
        if(this.transferdetailform.value.amount !== "" && this.transferdetailform.value.fromAcc !== "")
        {
            
            currentbalance = this.fromList.filter((item) => item.fromaccountno == this.transferdetailform.value.fromAcc)[0].balance
        }
        
        if(this.transferdetailform.value.fromAcc !== "" && this.transferdetailform.value.toAcc !== "" && this.transferdetailform.value.amount !== "" && parseInt(this.transferdetailform.value.amount) <= 5000 && parseInt(this.transferdetailform.value.amount) <= currentbalance &&  parseInt(this.transferdetailform.value.amount) !== 0 && this.transferdetailform.value.fromAcc !== this.transferdetailform.value.toAcc )
        {
            var setTransferdetails={
                currentstep:2,
                transferDetail:this.transferdetailform.value,
                operationtype:'EzioDemoV2_MoneyTransfer'
            }
            this.props.setcurrenttransferstep(setTransferdetails);
        }
        else {

            if(this.transferdetailform.value.fromAcc == "" || this.transferdetailform.value.toAcc == "" || this.transferdetailform.value.amount == "")
            {
                ToastDanger('Error. (*) fields are required');
            }
            else if(this.transferdetailform.value.fromAcc == this.transferdetailform.value.toAcc)
            {
                ToastDanger('Error.From Account and To Account cannot be same');
                if(parseInt(this.transferdetailform.value.amount) > 5000 || parseInt(this.transferdetailform.value.amount) > currentbalance || parseInt(this.transferdetailform.value.amount) === 0)
                {
                    this.setState({
                        errormessage:true
                    })
                }
            }
            else if(parseInt(this.transferdetailform.value.amount) > 5000 || parseInt(this.transferdetailform.value.amount) > currentbalance ||  parseInt(this.transferdetailform.value.amount) === 0)
            {
                this.setState({
                    errormessage:true
                })
            }
        }
    }

     transferdetailform = FormBuilder.group({
        fromAcc: "",
        toAcc: "",
        amount: "",
        currency: "USD",
        reason:"",
    });
    
    handlebeneficiarynavigation(e){
        e.preventDefault();
        this.props.history.push('/layout/newbeneficiary');
    }
    handleChange = (e, { name, value}) => this.setState({ [name]: value.split('-')[1],[name+'type']: value.split('-')[0],[name+'selectedvalue']:value })

    render() {

        const { toAccselectedvalue } = this.state;
        return (
            <div>
                 {this.state.errormessage === true &&
                    <Message negative>
                        <div className="twarning"><Icon color="red" name='warning sign'/> </div>
                        <div>
                        <Message.Header>Invalid transfer details!</Message.Header>
                        <p>Overdraft not authorized</p>
                        </div>
                    </Message>
                }
                   
                <span className="addfontsize">Step 1 of 4: Enter transfer details</span>
                <span className="mtrequirelabel"><label className="star">*</label>indicates a required field</span>
                <div className="tmplbrdrcls addmargin"></div>
                    { this.state.beneficiarycheck == false &&
                        <Segment className="defaultuiseg">
                                    <Message negative id="extwarning">
                                        <div className="twarning"><Icon color="red" name='warning sign'/>
                                        </div>
                                        <div>
                                            <Message.Header>No external beneficiary found!</Message.Header>
                                            <p>It can be added <a className="mthere" onClick={(e) => this.handlebeneficiarynavigation(e)}>here</a>.</p>      
                                        </div>
                                    </Message>
                                    <div>
                                    <Divider/>
                                        <button className="ui grey button" onClick={(e) => this.handlemtcancel(e)}> Cancel
                                            </button>
                                        <button className="ui blue button btnrightal" onClick={(e) => this.handlemtcancel(e)}> Done
                                            </button>
                                    </div>
                        </Segment>
                    }

                    { this.state.beneficiarycheck == true &&
                    <div>
                <FieldGroup control={this.transferdetailform} render={({ pristine, value }) => (
                    <form className="etform" onSubmit={() => this.handletransfersubmit}>
                        <Table className="rttable" singleLine basic='very' unstackable>
                            <Table.Body>
                                <Table.Row>
                                    <Table.Cell width={3}>
                                        <label className="pwdusr">From account<label className="star">*</label></label>
                                    </Table.Cell>
                                    <Table.Cell>
                                        <FieldControl name="fromAcc" render={({ handler }) => (
                                            <div>
                                                
                                                <Dropdown placeholder='Select Account' className="etdropdown" selection name='fromAcc' defaultValue={this.state.fromAccselectedvalue} onChange={this.handleChange} options={this.fromList} />
                                            </div>
                                        )}/>
                                    </Table.Cell>
                                </Table.Row>
                                <Table.Row>
                                    <Table.Cell>
                                        <label className="pwdusr">To account<label className="star">*</label></label>
                                    </Table.Cell>
                                    <Table.Cell>
                                        <FieldControl key={toAccselectedvalue}name="toAcc" render={({ handler }) => (
                                            <div>
                                                <Dropdown placeholder='Select Account' className="etdropdown" selection  name='toAcc'  defaultValue={toAccselectedvalue}  onChange={this.handleChange} options={this.toList}/>
                                           </div> 
                                        )} />
                                    </Table.Cell>
                                </Table.Row>
                                <Table.Row>
                                    <Table.Cell>
                                        <label className="pwdusr">Amount<label className="star">*</label></label>
                                    </Table.Cell>
                                    <Table.Cell>
                                        <FieldControl name="amount" render={({ handler }) => (
                                            <div>
                                                <input {...handler()} maxLength={4} onKeyPress={this.handleKeyPressnumber}/><span id="mtcurrency">USD</span>
                                            </div>
                                        )} />
                                    </Table.Cell>
                                </Table.Row>
                                <Table.Row>
                                    <Table.Cell>
                                        <label className="pwdusr">Reason (optional):</label>
                                    </Table.Cell>
                                    <Table.Cell>
                                        <FieldControl name="reason" render={({ handler }) => (
                                            <div>  
                                                <input {...handler()} maxLength={30} onKeyPress={this.handleReasonEnter}/>
                                            </div>
                                        )} />
                                    </Table.Cell>
                                </Table.Row>
                            </Table.Body>
                        </Table>
                    </form>
                )} />
               
                <div>
                <Divider/>
                    <button className="ui grey button" onClick={(e) => this.handlemtcancel(e)}> Cancel
                        </button>
                    <button className="ui blue button btnrightal" onClick={(e) => this.handletransfersubmit(e)}> Continue
                        </button>
                </div>
                </div>
            }
            </div>
        )
    }


}


function mapStateToProps(state) {
    return {

    }
}
function matchDispatchToProps(dispatch) {
    return bindActionCreators({
        setcurrenttransferstep: setcurrenttransferstep,
        posttransferaccountdetails:posttransferaccountdetails,
        setaccountlist:setaccountlist,
        setload:setload,
        setbeneficiarydetail:setbeneficiarydetail
    }, dispatch)
}

export default withRouter(connect(mapStateToProps, matchDispatchToProps)(ExtEntertransferdetails));

