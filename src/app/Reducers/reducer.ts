const initialState = {
    accounts: [],
    usercheck: [],
    authenticatecheck: [],
    authenticateotpcheck: [],
    authenticated: false,
    data: false,
    polling: false,
    username: '',
    passwordfail: true,
    otpfail: true,
    userrescode: null,
    checkpendingtransactionresponse: [],
    sendnotificationresponse: [],
    getcallbackresponse: [],
    snpending: true,
    sninvotp: true,
    sninvhashdata: true,
    snrejected: true,
    sntimeout: true,
    snnotifynotsent: true,
    deletependingtransactionresponse: [],
    loading: false,
    logoutresponse:null,
    callbackdatadeleteresponse:null,
    logon:false,
    Mobileregistrationresponse:null,
    mrpincode:'',
    mrregcode:'',
    mrQrdata:'',
    currenttransferstep:1,
    transferaccounts:null,
    transferdetails:null,
    validationconfiguration:null,
    currentbeneficiarystep: 1,
    beneficiarydetails: null,
    tokenprovisionstatus:null,
    tokenactivationstatus:null,
    tokenresyncstatus:null,
    fromAccountlist: null,
    toAccountlist:null,
    mtotpvalidationstatus:null,
    checkresetoptionstatus:null,
    DCV: true,
    TokenActResync: true,
    TokenPro: true,
    ReportBackend: true,
    UserPreference:true,
    GAH: true,
    P2P: false,
    CardIssuance:true,
    permission:null,
    tokenlist:[],
    operationtype:null,
    transactionsendnotificationresponse:null,
    mode:null,
    transactionstatus:null,
    carddetails:null,
    accountdetail:null,
    currentroute:'/',
    newbeneficiary:null,
    provisiontext:false,
    hasDevice:false,
    userEmail:'',
    tokenQRdata:null,
    currenttokenstep:1, 
    tokenDetail: null,
}

export function gemaltoaccountdata(state = initialState, action) {
    if (action.type === 'GET_ACCOUNT') {
        console.log("In reducer get users")
        return (<any>Object).assign({}, state, {
            accounts: action.payload
        })
    }
    else if (action.type === 'POST_USERNAME') {

        console.log("In reducer POST_USERNAME")
        return (<any>Object).assign({}, state, {
            usercheck: action.payload,
            tokenQRdata:action.payload,
            hasDevice:action.payload.data.templateObject.hasDevice
        })

    }
    else if (action.type === 'SET_HASDEVICE') {
        return (<any>Object).assign({}, state, {
            hasDevice: action.payload
        })
    }
    else if (action.type === 'POST_AUTHENTICATE') {

        console.log("In reducer POST_AUTHENTICATE",action.payload)
        if(action.payload.data.responseCode === 200){
            return (<any>Object).assign({}, state, {
                authenticatecheck: action.payload,
                TokenActResync: action.payload.data.templateObject.userRole.TokenActResync,
                DCV: action.payload.data.templateObject.userRole.DCV,
                TokenPro: action.payload.data.templateObject.userRole.TokenPro,
                ReportBackend: action.payload.data.templateObject.userRole.ReportBackend,
                UserPreference: action.payload.data.templateObject.userRole.UserPreference,
                GAH: action.payload.data.templateObject.userRole.GAH,
                P2P:action.payload.data.templateObject.userRole.P2P,
                permission:action.payload.data.templateObject.permission,
                CardIssuance:action.payload.data.templateObject.userRole.CardIssuance,
                userEmail:action.payload.data.templateObject.emailAddress
            })
    
        }
        else{

            return (<any>Object).assign({}, state, {
                authenticatecheck: action.payload
            })

        }
       
    }
    else if (action.type === 'CHECK_LOGIN') {
        return (<any>Object).assign({}, state, {
            authenticated: action.payload
        })
    }
    else if (action.type === 'SET_LOAD') {
        return (<any>Object).assign({}, state, {
            loading: action.payload
        })
    }
    else if(action.type === 'SET_EMAIL')
    {
        return (<any>Object).assign({}, state, {
            userEmail: action.payload
        })
    }
    else if (action.type === 'SET_PROVISIONTEXT') {
        return (<any>Object).assign({}, state, {
            provisiontext: action.payload
        })
    }
    
    else if (action.type === 'SET_ROUTE') {
        return (<any>Object).assign({}, state, {
            currentroute: action.payload
        })
    }
    else if (action.type === 'SET_LOGON') {
        return (<any>Object).assign({}, state, {
            logon: action.payload
        })
    }
    else if (action.type === 'SET_USERNAME') {
        return (<any>Object).assign({}, state, {
            username: action.payload.paramusrname,
            userrescode: action.payload.paramusrrescode
        })
    }
    else if (action.type === 'SET_ERRTYPE') {
        return (<any>Object).assign({}, state, {
            passwordfail: action.payload.passwordfail,
            otpfail: action.payload.otpfail
        })
    }
    else if (action.type === 'SET_SNERRTYPE') {
        return (<any>Object).assign({}, state, {
            snpending: action.payload.snpending,
            sninvotp: action.payload.sninvotp,
            sninvhashdata: action.payload.sninvhashdata,
            snrejected: action.payload.snrejected,
            sntimeout: action.payload.sntimeout,
            snnotifynotsent: action.payload.snnotifynotsent
        })

    }
    else if (action.type === 'POST_USEROTPAUTHENTICATE') {

        console.log("In reducer POST_USEROTPAUTHENTICATE")
        if(action.payload.data.responseCode === 200){
            return (<any>Object).assign({}, state, {
                authenticateotpcheck: action.payload,
                TokenActResync: action.payload.data.templateObject.userRole.TokenActResync,
                DCV: action.payload.data.templateObject.userRole.DCV,
                TokenPro: action.payload.data.templateObject.userRole.TokenPro,
                ReportBackend: action.payload.data.templateObject.userRole.ReportBackend,
                UserPreference: action.payload.data.templateObject.userRole.UserPreference,
                GAH: action.payload.data.templateObject.userRole.GAH,
                P2P:action.payload.data.templateObject.userRole.P2P,
                permission:action.payload.data.templateObject.permission,
                CardIssuance:action.payload.data.templateObject.userRole.CardIssuance,
                userEmail:action.payload.data.templateObject.emailAddress
            })
        }
        else{
            return (<any>Object).assign({}, state, {
                authenticateotpcheck: action.payload
            })
            
        }
    }
    else if (action.type === 'POST_USERGETCALLBACK') {

        console.log("In reducer POST_USERGETCALLBACK")
        if(action.payload.data.responseCode === 200){
            return (<any>Object).assign({}, state, {
                getcallbackresponse: action.payload,
                TokenActResync:action.payload.data.tempObject.userRole.TokenActResync,
                DCV:action.payload.data.tempObject.userRole.DCV,
                TokenPro: action.payload.data.tempObject.userRole.TokenPro,
                ReportBackend: action.payload.data.tempObject.userRole.ReportBackend,
                UserPreference: action.payload.data.tempObject.userRole.UserPreference,
                GAH: action.payload.data.tempObject.userRole.GAH,
                P2P: action.payload.data.tempObject.userRole.P2P,
                permission:action.payload.data.tempObject.permission,
                CardIssuance:action.payload.data.tempObject.userRole.CardIssuance,
                userEmail:action.payload.data.tempObject.emailAddress
            })
        }
        else{
            return (<any>Object).assign({}, state, {
                getcallbackresponse: action.payload
            })
            
        }
      

    }
    else if (action.type === 'POST_USERSENDNOTIFICATION') {

        console.log("In reducer POST_USERSENDNOTIFICATION")
        return (<any>Object).assign({}, state, {
            sendnotificationresponse: action.payload
        })

    }
    else if (action.type === 'POST_USERCHECKPENDING') {

        console.log("In reducer POST_USERCHECKPENDING")
        return (<any>Object).assign({}, state, {
            checkpendingtransactionresponse: action.payload
        })

    }
    else if (action.type === 'POST_USERDELTEPENDINGTRANSACTION') {

        console.log("In reducer POST_USERDELTEPENDINGTRANSACTION")
        return (<any>Object).assign({}, state, {
            deletependingtransactionresponse: action.payload
        })

    }

    else if (action.type === 'POST_USERLOGOUT') {
        console.log("In reducer POST_USERLOGOUT")
        return (<any>Object).assign({}, state, {
            logoutresponse: action.payload
        })
    }
    else if (action.type === 'POST_DELETECALLBACKDATA') {
        console.log("In reducer POST_DELETECALLBACKDATA")
        return (<any>Object).assign({}, state, {
            callbackdatadeleteresponse: action.payload
        })
    }
    else if (action.type === 'POST_MOBILEREGISTRATION') {
        console.log("In reducer POST_MOBILEREGISTRATION")
        return (<any>Object).assign({}, state, {
            Mobileregistrationresponse: action.payload,
            mrpincode:action.payload.data.templateObject.pin,
            mrregcode:action.payload.data.templateObject.regCode,
            mrQrdata:action.payload.data.templateObject.qrCodeData
        })
    }
    else if (action.type === 'SET_CURRENTRANSFERSTEP') {
        return (<any>Object).assign({}, state, {
            currenttransferstep: action.payload.currentstep,
            transferdetails: action.payload.transferDetail,
            operationtype:action.payload.operationtype,
            mode:action.payload.mode,
            transactionstatus:action.payload.transactionstatus

        })
    }
    else if (action.type === 'SET_CURRENTTOKENSTEP') {
        return (<any>Object).assign({}, state, {
            currenttokenstep: action.payload.currenttokenstep,
            tokenDetail: action.payload.tokenDetail,
        })
    }
    else if (action.type === 'SET_CURRENTBENEFICIARYSTEP') {
        return (<any>Object).assign({}, state, {
            currentbeneficiarystep: action.payload.currentstep,
            beneficiarydetails: action.payload.beneficiaryDetail,
            operationtype:action.payload.operationtype,
            mode:action.payload.mode,
            transactionstatus:action.payload.transactionstatus,

        })
    }
    else if (action.type === 'SET_BENEFICIARYDETAIL') {
        return (<any>Object).assign({}, state, {
           newbeneficiary:action.payload.newbeneficiary
        })
    }
    else if(action.type === 'SET_TRANSFERACCOUNTS'){
        return (<any>Object).assign({}, state, {
            transferaccounts: action.payload
        })
    }
    else if(action.type === 'POST_INITIATETRANSACTION'){
        return (<any>Object).assign({}, state, {
            validationconfiguration: action.payload
        })
    }
    else if(action.type === 'POST_TOKENPROVISION'){
        return (<any>Object).assign({}, state, {
            tokenprovisionstatus: action.payload
        })
    }
    else if(action.type === 'POST_TOKENACTIVATION'){
        return (<any>Object).assign({}, state, {
            tokenactivationstatus: action.payload
        })
    }
    else if(action.type === 'POST_TOKENRESYNC'){
        return (<any>Object).assign({}, state, {
            tokenresyncstatus: action.payload
        })
    }
    else if(action.type === 'SET_ACCOUNTLIST'){
        return (<any>Object).assign({}, state, {
            fromAccountlist: action.payload.fromList,
            toAccountlist:action.payload.toList
        })
    }
    else if(action.type === 'POST_MTOTPVALIDATION'){
        return (<any>Object).assign({}, state, {
            mtotpvalidationstatus: action.payload
        })
    } 
    else if(action.type === 'POST_CHECKRESETOPTIONS'){
        return (<any>Object).assign({}, state, {
            checkresetoptionstatus: action.payload
        })
    }  
    else if(action.type === 'GET_TOKENLIST'){
        return (<any>Object).assign({}, state, {
            tokenlist: action.payload
        })
    }
    else if(action.type === 'POST_TRANSACTIONSENDNOTIFICATION'){
        return (<any>Object).assign({}, state, {
            transactionsendnotificationresponse: action.payload
        })
    }
    else if(action.type === 'SET_MYCARD'){
        return (<any>Object).assign({}, state, {
            carddetails: action.payload
        })
    }  
    else if(action.type === 'SET_MYACCOUNT'){
        return (<any>Object).assign({}, state, {
            accountdetail: action.payload
        })
    } 
    else {
        return state
    }
}