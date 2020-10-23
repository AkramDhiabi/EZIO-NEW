import AjaxService from '../Services/Ajax.service';
import {Observable} from 'rxjs/Rx';

let service = new AjaxService();

export function getaccountData(usrdata) {
    let type = 'GET_ACCOUNT'
    return function (dispatch) {
        return service
            .getaccountData(usrdata)
            .then((res) => {
                dispatch({type: type, payload: res.data})
                return res;
            })
            .catch((error) => {
                console.log("Error", error)
            })

    }
}

export function postcheckUsername(usrnme) {
    let type = 'POST_USERNAME'
    return (dispatch) => {

        return service
            .getuserstatusData(usrnme)
            .then((res) => {
                dispatch({type: type, payload: res});
                return res;
            })
            .catch((error) => {
                console.log("Error", error)
            })
    }

}

export function getCheckusernameRegistration(usrnme) {
    let type = 'POST_USERNAMEREG'
    return (dispatch) => {

        return service
            .getCheckusernameService(usrnme)
            .then((res) => {
                dispatch({type: type, payload: res});
                return res;
            })
            .catch((error) => {
                console.log("Error", error)
            })
    }

}

export function postUseraccount(usrnme) {
    let type = 'POST_USERACCOUNT'
    return (dispatch) => {

        return service
            .postUseraccountService(usrnme)
            .then((res) => {
                dispatch({type: type, payload: res});
                return res;
            })
            .catch((error) => {
                console.log("Error", error)
            })
    }

}

export function postNewpassword(password) {
    let type = 'POST_NEWPASSWORD'
    return (dispatch) => {

        return service
            .postNewPassword(password)
            .then((res) => {
                dispatch({type: type, payload: res});
                return res;
            })
            .catch((error) => {
                console.log("Error", error)
            })
    }

}

export function postAuthenticate(credential) {
    let type = 'POST_AUTHENTICATE'
    return (dispatch) => {

        return service
            .postuserstatusData(credential)
            .then((res) => {

                console.log(res.data)
                dispatch({type: type, payload: res})

            })
            .catch((error) => {
                console.log("Error", error)
            })
    }

}

export function postuserotpAuthenticate(credential) {
    let type = 'POST_USEROTPAUTHENTICATE'
    return (dispatch) => {

        return service
            .postuserotpData(credential)
            .then((res) => {

                console.log(res.data)
                dispatch({type: type, payload: res})
            })
            .catch((error) => {
                console.log("Error", error)
            })
    }

}

function setType(type, loadval) {

    return (dispatch) => {
        dispatch({type: type, payload: loadval})
    }
}

export function setHasdevice(loadval) {

    return setType('SET_HASDEVICE', loadval)
}

export function checklogin(loginval) {

    return setType('CHECK_LOGIN', loginval)
}

export function setload(loadval) {

    return setType('SET_LOAD', loadval)
}

export function setEmail(loadval) {

    return setType('SET_EMAIL', loadval)

}

export function setprovisiontext(loadval) {

    return setType('SET_PROVISIONTEXT', loadval)

}

export function setlogon(loadval) {

    return setType('SET_LOGON', loadval)

}

export function setusername(loginname) {

    return setType('SET_USERNAME', loginname)

}

export function seterrtype(errtypeval) {

    return setType('SET_ERRTYPE', errtypeval)

}

export function setsnerrtype(errtypeval) {

    return setType('SET_SNERRTYPE', errtypeval)

}

export function postusercheckpendingstatus(credential) {
    let type = 'POST_USERCHECKPENDING'
    return (dispatch) => {

        return service
            .postusercheckpendingtransaction(credential)
            .then((res) => {

                console.log(res.data)
                dispatch({type: type, payload: res})
                return res;
            })
            .catch((error) => {
                console.log("Error", error)
                setload(false);
            })
    }

}

export function postusersendnotificationstatus(credential) {
    let type = 'POST_USERSENDNOTIFICATION'
    return (dispatch) => {

        return service
            .postusersendnotification(credential)
            .then((res) => {

                console.log(res.data)
                dispatch({type: type, payload: res})
                return res;
            })
            .catch((error) => {
                console.log("Error", error)
            })
    }

}

export function postusersgetcallbackstatus(credential) {
    let type = 'POST_USERGETCALLBACK'
    return (dispatch) => {

        return service
            .postusergetcallbackresponse(credential)
            .then((res) => {

                console.log(res.data)
                dispatch({type: type, payload: res})
                return res;
            })
            .catch((error) => {
                console.log("Error", error)
            })
    }

}

export function postusersdeletependingtransactionstatus(credential) {
    let type = 'POST_USERDELTEPENDINGTRANSACTION'
    return (dispatch) => {

        return service
            .postuserdeletependingtransaction(credential)
            .then((res) => {

                console.log(res.data)
                dispatch({type: type, payload: res})
                return res;
            })
            .catch((error) => {
                console.log("Error", error)
            })
    }

}

export function posteziologoutaction(credential) {
    let type = 'POST_USERLOGOUT'
    return (dispatch) => {
        return service
            .posteziologout(credential)
            .then((res) => {
                console.log(res.data)
                dispatch({type: type, payload: res})
                return res;
            })
            .catch((error) => {
                console.log("Error", error)
            })
    }
}

export function postuserdeletecallbackdataaction(credential) {
    let type = 'POST_DELETECALLBACKDATA'
    return (dispatch) => {
        return service
            .postuserdeletecallbackdata(credential)
            .then((res) => {
                console.log(res.data)
                dispatch({type: type, payload: res})
                return res;
            })
            .catch((error) => {
                console.log("Error", error)
            })
    }
}

export function postMobileregistration(usrnme) {
    let type = 'POST_MOBILEREGISTRATION'
    return (dispatch) => {

        return service
            .postmobileregistrationData(usrnme)
            .then((res) => {

                console.log(res.data)
                dispatch({type: type, payload: res});
                return res;
            })
            .catch((error) => {
                console.log("Error", error)
            })
    }

}

export function setcurrenttransferstep(currentstep) {
    let type = 'SET_CURRENTRANSFERSTEP'
    return (dispatch) => {
        dispatch({type: type, payload: currentstep})
    }
}

export function setcurrentbeneficiarystep(currentstep) {
    let type = 'SET_CURRENTBENEFICIARYSTEP'
    return (dispatch) => {
        dispatch({type: type, payload: currentstep})
    }

}

export function setbeneficiarydetail(currentstep) {
    let type = 'SET_BENEFICIARYDETAIL'
    return (dispatch) => {
        dispatch({type: type, payload: currentstep})
    }

}


export function posttransferaccountdetails(userdetail) {
    let type = 'SET_TRANSFERACCOUNTS'
    return (dispatch) => {
        return service
            .posttransferaccountdetails(userdetail)
            .then((res) => {

                console.log(res.data)
                dispatch({type: type, payload: res});
                return res;
            })
            .catch((error) => {
                console.log("Error", error)
            })

    }

}

export function postinitiatetransaction(accountdetail) {
    let type = 'POST_INITIATETRANSACTION'
    return (dispatch) => {
        return service
            .postinitiatetransaction(accountdetail)
            .then((res) => {
                console.log(res.data)
                dispatch({type: type, payload: res});
                return res;
            })
            .catch((error) => {
                console.log("Error", error)
            })

    }

}

export function posttokenprovisoning(filedata) {
    let type = 'POST_TOKENPROVISION'
    return (dispatch) => {
        return service
            .posttokenprovision(filedata)
            .then((res) => {

                console.log(res.data)
                dispatch({type: type, payload: res});
                return res;
            })
            .catch((error) => {
                console.log("Error", error)
            })

    }

}

export function posttokenactivation(activationdata) {
    let type = 'POST_TOKENACTIVATION'
    return (dispatch) => {
        return service
            .posttokenactivate(activationdata)
            .then((res) => {

                console.log(res.data)
                dispatch({type: type, payload: res});
                return res;
            })
            .catch((error) => {
                console.log("Error", error)
            })

    }

}

export function posttokenresync(resyncdata) {
    let type = 'POST_TOKENRESYNC'
    return (dispatch) => {
        return service
            .posttokenactiveresync(resyncdata)
            .then((res) => {

                console.log(res.data)
                dispatch({type: type, payload: res});
                return res;
            })
            .catch((error) => {
                console.log("Error", error)
            })

    }

}

export function setaccountlist(accountlist) {
    let type = 'SET_ACCOUNTLIST'
    return (dispatch) => {
        dispatch({type: type, payload: accountlist})
    }

}

export function postmoneytransferValidation(validationdetails) {
    let type = 'POST_MTOTPVALIDATION'
    return (dispatch) => {
        return service
            .postmtotpvalidation(validationdetails)
            .then((res) => {

                console.log(res.data)
                dispatch({type: type, payload: res});
                return res;
            })
            .catch((error) => {
                console.log("Error", error)
            })

    }

}

export function postcheckresetoptions(param) {
    let type = 'POST_CHECKRESETOPTIONS'
    return (dispatch) => {

        return service
            .postcheckresetoptionService(param)
            .then((res) => {

                console.log(res.data)
                dispatch({type: type, payload: res});
                return res;
            })
            .catch((error) => {
                console.log("Error", error)
            })
    }
}

export function postresetoptions(param) {
    let type = 'POST_RESETOPTIONS'
    return (dispatch) => {

        return service
            .postresetoptionService(param)
            .then((res) => {

                console.log(res.data)
                dispatch({type: type, payload: res});
                return res;
            })
            .catch((error) => {
                console.log("Error", error)
            })
    }

}


export function gettokenlist(credential) {
    let type = 'GET_TOKENLIST'
    return (dispatch) => {
        return service
            .getListoftokensService(credential)
            .then((res) => {
                console.log(res.data)
                dispatch({type: type, payload: res})
                return res;
            })
            .catch((error) => {
                console.log("Error", error)
            })
    }
}

export function posttransactionsendnotification(credential) {
    let type = 'POST_TRANSACTIONSENDNOTIFICATION'
    return (dispatch) => {

        return service
            .posttransactionsendnotification(credential)
            .then((res) => {

                console.log(res.data)
                dispatch({type: type, payload: res})
                return res;
            })
            .catch((error) => {
                console.log("Error", error)
            })
    }

}

export function posttokenrelease(credential) {
    let type = 'POST_TOKENRELEASE'
    return (dispatch) => {

        return service
            .posttokenreleasedata(credential)
            .then((res) => {

                console.log(res.data)
                dispatch({type: type, payload: res})
                return res;
            })
            .catch((error) => {
                console.log("Error", error)
            })
    }

}


export function postCardrelease(credential) {
    return (dispatch) => {
        return service
            .postCardreleaseservice(credential)
            .then((res) => {
                return res;
            })
            .catch((error) => {
                console.log("Error", error)
            })
    }

}

export function getaccountsummaryDetails(credential) {
    return (dispatch) => {
        return service
            .getaccountsummary(credential)
            .then((res) => {
                return res;
            })
            .catch((error) => {
                console.log("Error", error)
            })
    }

}

export function getcardlist(credential) {
    return (dispatch) => {
        return service
            .getallcards(credential)
            .then((res) => {
                return res;
            })
            .catch((error) => {
                console.log("Error", error)
            })
    }

}

export function getEcommcardlist(credential) {
    return (dispatch) => {
        return service
            .getEcommcardDetails(credential)
            .then((res) => {
                return res;
            })
            .catch((error) => {
                console.log("Error", error)
            })
    }

}


export function getproductlist() {
    return (dispatch) => {
        return service
            .getproductdata()
            .then((res) => {
                return res;
            })
            .catch((error) => {
                console.log("Error", error)
            })
    }

}


export function setmycard(cardval) {
    let type = 'SET_MYCARD'
    return (dispatch) => {
        dispatch({type: type, payload: cardval})
    }

}

export function setmyaccount(cardval) {
    let type = 'SET_MYACCOUNT'
    return (dispatch) => {
        dispatch({type: type, payload: cardval})
    }

}


export function getbeneficiarystatus(credential) {
    return (dispatch) => {
        return service
            .getbeneficiarystatus(credential)
            .then((res) => {
                return res;
            })
            .catch((error) => {
                console.log("Error", error)
            })
    }

}

export function postcardfreeze(credential) {
    return (dispatch) => {

        return service
            .postcardfreezedata(credential)
            .then((res) => {

                return res;
            })
            .catch((error) => {
                console.log("Error", error)
            })
    }

}

export function getcardsummaryDetails(credential) {
    return (dispatch) => {
        return service
            .getcardsummary(credential)
            .then((res) => {
                return res;
            })
            .catch((error) => {
                console.log("Error", error)
            })
    }

}

export function getcardsettingsaction(credential) {
    return (dispatch) => {

        return service
            .getcardsettings(credential)
            .then((res) => {

                return res;
            })
            .catch((error) => {
                console.log("Error", error)
            })
    }

}

export function postupdatesettingsaction(credential) {
    return (dispatch) => {

        return service
            .updatecardsettings(credential)
            .then((res) => {

                return res;
            })
            .catch((error) => {
                console.log("Error", error)
            })
    }

}

export function setcurrentroute(loadval) {
    let type = 'SET_ROUTE'
    return (dispatch) => {
        dispatch({type: type, payload: loadval})
    }

}

export function postecommvalidation(credential) {
    return (dispatch) => {

        return service
            .postecommercevalidation(credential)
            .then((res) => {

                return res;
            })
            .catch((error) => {
                console.log("Error", error)
            })
    }

}


//ATM

export function postAtmQrdetails(credential) {
    return (dispatch) => {

        return service
            .postAtmQrcodeDetails(credential)
            .then((res) => {

                return res;
            })
            .catch((error) => {
                console.log("Error", error)
            })
    }

}

export function getQRcodeStatus(credential) {
    return (dispatch) => {

        return service
            .postAtmQrCallback(credential)
            .then((res) => {

                return res;
            })
            .catch((error) => {
                console.log("Error", error)
            })
    }

}

export function postAtmaccesscodeDetails(credential) {
    return (dispatch) => {

        return service
            .postAtmaccesscode(credential)
            .then((res) => {

                return res;
            })
            .catch((error) => {
                console.log("Error", error)
            })
    }
}

export function deletaAtmDetailsaction(credential) {
    return (dispatch) => {

        return service
            .deletaAtmDetails(credential)
            .then((res) => {

                return res;
            })
            .catch((error) => {
                console.log("Error", error)
            })
    }

}


export function postDCVactivationaction(credential) {
    return (dispatch) => {

        return service
            .postDCVactivationdetails(credential)
            .then((res) => {

                return res;
            })
            .catch((error) => {
                console.log("Error", error)
            })
    }
}


export function getUserpreferenceaction(credential) {
    return (dispatch) => {

        return service
            .getuserpreferencedetails(credential)
            .then((res) => {

                return res;
            })
            .catch((error) => {
                console.log("Error", error)
            })
    }

}

export function postUserpreferenceaction(credential) {
    return (dispatch) => {

        return service
            .postuserpreferencedetails(credential)
            .then((res) => {

                return res;
            })
            .catch((error) => {
                console.log("Error", error)
            })
    }
}

export function postuserriskpreferencedetailsaction(credential) {
    return (dispatch) => {

        return service
            .postuserriskpreferencedetails(credential)
            .then((res) => {

                return res;
            })
            .catch((error) => {
                console.log("Error", error)
            })
    }
}

export function postPersonalinformationUpdate(credential) {
    return (dispatch) => {

        return service
            .postPersonalinfoService(credential)
            .then((res) => {

                return res;
            })
            .catch((error) => {
                console.log("Error", error)
            })
    }
}


export function deleteBeneficiaryaccountaction(credential) {
    return (dispatch) => {

        return service
            .deleteBeneficiaryaccounts(credential)
            .then((res) => {

                return res;
            })
            .catch((error) => {
                console.log("Error", error)
            })
    }
}

export function getDeviceID(credential) {
    return (dispatch) => {

        return service
            .getDeviceIdStatus(credential)
            .then((res) => {

                return res;
            })
            .catch((error) => {
                console.log("Error", error)
            })
    }

}


export function postForgetdetailsAction(param) {
    return (dispatch) => {

        return service
            .postForgetdetailsService(param)
            .then((res) => {

                return res;
            })
            .catch((error) => {
                console.log("Error", error)
            })
    }
}

export function setcurrenttokenstep(currentstep) {
    let type = 'SET_CURRENTTOKENSTEP'
    return (dispatch) => {
        dispatch({type: type, payload: currentstep})
    }
}