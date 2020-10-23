import * as React from 'react';
import { Component } from 'react'
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { store } from '../Store/store';
import { getaccountData, posteziologoutaction,posttokenprovisoning,setprovisiontext, setusername, checklogin,setload } from '../Actions/action';
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
Message
} from 'semantic-ui-react';
import { FormBuilder, FieldControl, FieldGroup } from "react-reactive-form";
import 'semantic-ui-css/semantic.min.css';
import {ToastDanger} from 'react-toastr-basic';
const tokendev = require('../../img/tokendevice.png');
class Tokenprovision extends React.Component<any, any> {
constructor(props) {
super(props);
this.handleSubmit = this.handleSubmit.bind(this);
this.state ={
    provisioningFile:'',
    passphraseKey:'',
    provisionsuccess:true,
    provisionfail:true,
    username:store.getState().username

}
}

componentWillMount() {
}
handleSubmit(event) {
    event.preventDefault();
   
   
    if(this.state.provisioningFile !== '' && this.state.passphraseKey !== '')
    {   
        this.props.setprovisiontext(true);
        this.props.setload(true);
        const formData = new FormData();
        formData.append('provisioningFile',this.state.provisioningFile)
        formData.append('passphraseKey ',this.state.passphraseKey)
        var sendprovisiondetails ={
            userId: this.state.username,
            formdata:formData
        }
        const self= this;
        //document.getElementsByClassName('loader')[0].innerHTML ="Provisioning, please wait…"
        this.props.posttokenprovisoning(sendprovisiondetails).then((response)=>{
           
            if(response !== undefined && response.data.responseCode == 200)
            {
                self.setState({
                    provisionsuccess:false
                })
                self.props.setload(false);
                self.props.setprovisiontext(false); 
            }
            else if(response !== undefined && response.data.responseCode == 400)
            {
                self.setState({
                    provisionfail:false
                })
                self.props.setload(false);  
                self.props.setprovisiontext(false); 
            }
            else{
                self.setState({
                    provisionfail:false
                })
                self.props.setload(false);
                self.props.setprovisiontext(false); 
            }
        })
    }
    else if(this.state.provisioningFile !== '' && this.state.passphraseKey == ''){
        ToastDanger('Please provide a passphrase file first.');
    }
    else if(this.state.provisioningFile == '' && this.state.passphraseKey !== ''){
        ToastDanger('Please provide a provisioning file first.');
    }
    else if(this.state.provisioningFile == '' && this.state.passphraseKey == ''){
        ToastDanger('Please select files first.');
    }
    
}
handleChange(selectorFiles: FileList,type)
{
    console.log(selectorFiles[0]);
    if(type === 'xml'){
        if(selectorFiles[0].type == "text/xml")
        {
            this.setState({provisioningFile:selectorFiles[0]});
        }
        else
        {
            ToastDanger('Please select .xml file');   
        }
        
    }
    if(type === 'txt')
    {
        if(selectorFiles[0].type == "text/plain")
        {
            this.setState({passphraseKey:selectorFiles[0]});
        }
        else
        {
            ToastDanger('Please select .txt file');
            
        }
       
    }
}

handleclickontokenprocess(){
    var elements = document.getElementsByTagName('a');
    for (var i = 0; i < elements.length; i++) {
      if (elements[i].innerHTML === 'Activation') {
        elements[i].click();
      }
    }
}
render() {
return (
<div>
<Grid className="tcontentdetail">
   <Grid.Column width={16}>
      <Segment className="accdetailsec tcontentdetail">
         <div id="tmsgbox">
            <Message positive hidden={this.state.provisionsuccess}>
               <div className="tsuccess">
                  <Icon id="tick" name='checkmark' />
               </div>
               <div>
                  <Message.Header>Provisioning done!</Message.Header>
                  <p>Your tokens can be new activated <span id="here" onClick={this.handleclickontokenprocess}>here.</span>.</p>
               </div>
            </Message>
            
            <Message negative hidden={this.state.provisionfail}>
               <div className="twarning">
                  <Icon color="red" name='warning sign'/>
               </div>
               <div>
                     <Message.Header>Provisioning failed!</Message.Header>
                     <p>As well as your provisioning file, make sure your passphrase file is correct.</p>
               </div>   
            </Message>
            
            </div>
            <span className="addfontsize">Provision a list of tokens in the authentication server. All the tokens in this list must have the same type.</span>
            <div className="tmplbrdrcls addmargin"></div>
            <form onSubmit={this.handleSubmit}>
               <div>
                  <div>
                     <div className="tokenfrmttl">1. Select your provisioning file</div>
                  </div>
                  <div className="tkmartop">
                     <label className="tkmargin">Choose file:</label>
                     <span className="tkmargin">
                     <input type="file" name='xml'  className="custom-file-input" accept="text/xml" onChange={ (e) => this.handleChange(e.target.files,'xml') }/>
                     </span>
                    
                  </div>
                  <div className="tkmarbottom">
                     <span className="cmnfntsize">(Only .xml file is allowed)</span>
                  </div>
               </div>
               <div>
                  <div>
                     <div className="tokenfrmttl">2. Select your passphrase file</div>
                  </div>
                  <div className="tkmartop">
                     <label className="tkmargin">Choose file:</label>
                     <span className="tkmargin">
                     <input type="file" name='txt'  className="custom-file-input" accept="text/plain" onChange={ (e) => this.handleChange(e.target.files,'txt') }/>
                    </span>
                     
                  </div>
                  <div className="tkmarbottom">
                     <span className="cmnfntsize">(Only .txt file is allowed)</span>
                  </div>
               </div>
               <div>
                  <div className="tmplbrdrcls"></div>
                  <div>
                     <button className="ui blue button btnrightal" type="submit" > Done</button>
                  </div>
               </div>
            </form>
      </Segment>
   </Grid.Column>
</Grid>
</div>
)
}
}
function mapStateToProps(state) {
return {
    tokenprovisionstatus:state.tokenprovisionstatus
}
}
function matchDispatchToProps(dispatch) {
return bindActionCreators({
    posttokenprovisoning:posttokenprovisoning,
    setload:setload,
    setprovisiontext:setprovisiontext
}, dispatch)
}
export default connect(mapStateToProps, matchDispatchToProps)(Tokenprovision)