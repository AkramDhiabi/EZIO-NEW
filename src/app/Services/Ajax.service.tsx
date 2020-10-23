import axios from 'axios';

//lien vers dev api
const produrl = 'https://api.dbpdemo.com';
const json_products = require('../../Data/products.json');


//Lien ver api preprod

export default class AjaxService {
    getaccountData(param) {
        return axios.get(produrl + '/getaccounts.user.clubed?userId=' + param.usrnme);
    }
    getuserstatusData(param) {

        return axios.post(produrl + '/checkusername.user?username=' + param);
    }

    getCheckusernameService(param) {
        return axios.get(produrl + '/checkusername.userregistration.action?userId=' + param);
    }


    postUseraccountService(param) {

        return axios({
            url: produrl + '/createaccount.user.action',
            method: 'POST',
            data: param
        })

    }

    postNewPassword(param) {

        return axios({
            url: produrl + '/recoveraccount.user.action',
            method: 'POST',
            data: param
        })
    }
    postuserstatusData(param) {

        return axios.post(produrl + '/authenticate.user?username=' + param.usrnme + '&password=' + param.pswrd);

    }
    postuserotpData(param) {

        return axios.post(produrl + '/validateotplogin.action?username=' + param.usrnme + '&otpValue=' + param.otp);
    }
    postusercheckpendingtransaction(param) {

        return axios.post(produrl + '/checkpendingtransaction.action?userId=' + param.usrnme);

    }
    postusersendnotification(param) {

        return axios.post(produrl + '/senduserloginnotification.action?userId=' + param.usrnme);

    }
    posttransactionsendnotification(param) {

        return axios({
            url: produrl + '/sendonlinetransaction.notification.action/' + param.usrnme + '/' + param.operationtype,
            method: 'POST',
            data: param.data
        })

    }

    postusergetcallbackresponse(param) {

        return axios.post(produrl + '/getcallbackresponse.action?userId=' + param.usrnme + '&messageId=' + param.msgId);

    }


    postuserdeletependingtransaction(param) {

        return axios.post(produrl + '/deletependingtransaction.action?userId=' + param.usrnme + '&messageId=' + param.msgId);

    }

    postuserdeletecallbackdata(param) {

        return axios.post(produrl + '/deletecallbackdata.action?userId=' + param.usrnme);

    }

    posteziologout(param) {

        return axios.post(produrl + '/logout?userId=' + param.usrnme);

    }

    postmobileregistrationData(param) {

        return axios.post(produrl + '/mobileregistration.web.action/' + param.usrnme);
    }

    posttransferaccountdetails(param) {

        return axios.get(produrl + '/getuseraccountdetails.user.action?operationType=' + param.type + '&userId=' + param.userId);

    }

    postinitiatetransaction(param) {

        return axios({
            url: produrl + '/initiatebankingtransaction.action/' + param.type,
            method: 'POST',
            data: param.data
        })

    }

    posttokenprovision(param) {
        return axios({
            url: produrl + '/uploadprovisioningfile.action/' + param.userId,
            method: 'POST',
            data: param.formdata,
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        })

    }

    posttokenactivate(param) {

        return axios.post(produrl + '/activatetoken.user.action/' + param.userId + '/' + param.tokenSerialNumber + '/' + param.otpValue);

    }

    posttokenactiveresync(param) {

        return axios({
            url: produrl + '/tokenresync.user.action',
            method: 'POST',
            data: param
        })

    }

    postmtotpvalidation(param) {

        return axios({
            url: produrl + '/validatebankingtransaction.action',
            method: 'POST',
            data: param
        })

    }

    postcheckresetoptionService(param) {

        return axios.get(produrl + '/getuserresetaccount.options.action?userId=' + param.userId);

    }

    postresetoptionService(param) {

        return axios({
            url: produrl + '/resetuseraccount.action',
            method: 'POST',
            data: param
        })

    }

    getListoftokensService(param) {

        return axios.get(produrl + '/getlistoftokens.user.action?userId=' + param.userId);

    }

    posttokenreleasedata(param) {

        return axios.post(produrl + '/releaseusertoken.action/' + param.userId + '/' + param.tokenId);

    }

    postCardreleaseservice(param) {

        return axios.post(produrl + '/cardIssuance.removecard.action/' + param.userId + '/' + param.panId);

    }

    getaccountsummary(param) {

        return axios.get(produrl + '/getaccountsummary.user?userId=' + param.userId + '&accountNo=' + param.accountno);

    }

    getcardsummary(param) {
        return axios.get(produrl + '/transactionhistory.card.action/' + param.userId + '/' + param.cardno + '/20');
    }


    getallcards(param) {

        return axios.get(produrl + '/getcards.wallet.actions/' + param.userId);
        //return axios.get('../../Data/card.json');
    }

    getbeneficiarystatus(param) {

        return axios.get(produrl + '/checkbeneficiary.user.action?userId=' + param.userId + '&payeeAccountNo=' + param.accountno);
    }

    postcardfreezedata(param) {

        return axios.post(produrl + '/freezeandunfreezeusercard.action/' + param.userId + '/' + param.panno + '/' + param.freezevalue);
    }

    getcardsettings(param) {
        return axios.get(produrl + '/getcardsettings.user.action/' + param.userId + '/' + param.panNo);
    }

    updatecardsettings(param) {
        return axios({
            url: produrl + '/updatecardsettings.user.action',
            method: 'POST',
            data: param
        })
    }

    getproductdata() {// A modifier
        return new Promise((resolve,reject)=>{
            console.log("json_products = ",json_products);
            resolve(json_products);
        })

         
         //return axios.get('src/Data/products.json');
    }
    postecommercevalidation(param) {

        return axios({
            url: produrl + '/validatetransaction.ecommerce.action',
            method: 'POST',
            data: param
        })

    }

    getEcommcardDetails(param) {
        return axios.get(produrl + '/getcards.ecommerce.actions/' + param.userId + '/' + param.operationType);
    }

    postAtmQrcodeDetails(param) {
        return axios.post(produrl + '/insertqrcodedetails.user/' + param.userId + '/' + param.amount);
    }

    postAtmQrCallback(param) {
        return axios.get(produrl + '/readatmqrcodestatus.user/' + param.userId + '/' + param.atmId);
    }

    postAtmaccesscode(param) {
        return axios.post(produrl + '/validateaccesscode.user/' + param.userId + '/' + param.accesscode);
    }

    deletaAtmDetails(param) {
        return axios.post(produrl + '/deleteatmqrcodedetails.user/' + param.userId);
    }

    postDCVactivationdetails(param) {
        return axios.post(produrl + '/DCVcard.activation.actions/' + param.userId + '/' + param.panNo);
    }

    getuserpreferencedetails(param) {
        return axios.get(produrl + '/getpreferences.userpreference.user/' + param.userId);
    }

    getDeviceIdStatus(param) {
        return axios.get(produrl + '/batchtransfer.checkdevice.user.action?userId=' + param.userId);
    }

    postuserpreferencedetails(param) {
        return axios({
            url: produrl + '/updatepreferences.userpreference.user',
            method: 'POST',
            data: param
        })
    }

    postuserriskpreferencedetails(param) {
        return axios({
            url: produrl + '/updatepreferences.riskpreference.user',
            method: 'POST',
            data: param
        })
    }

    deleteBeneficiaryaccounts(param) {
        return axios({
            url: produrl + '/deletebeneficiary.user.action',
            method: 'POST',
            data: param
        })

    }
    postPersonalinfoService(param) {
        return axios({
            url: produrl + '/personalInformation.update.user',
            method: 'POST',
            data: param
        })

    }

    postForgetdetailsService(param) {
        return axios({
            url: produrl + '/forgetuserdetails.user.action',
            method: 'POST',
            data: param
        })
    }
}


