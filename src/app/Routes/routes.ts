import Accountpanel from '../Components/Accountpanel.component';
import Tokenmanagement from '../Components/Tokenmanagement.component';
import Mobileregistration from '../Components/Mobileregistration.component';
import Domestictransfer from '../Components/Domestictransfer.component';
import Resetaccount from '../Components/Resetaccount.component';
import TokenList from '../Components/Tokenlist.component';
import Newbeneficiary from '../Components/Newbeneficiary.component';
import Accountdetail from '../Components/Accountdetails.component';
import Mywallet from '../Components/Mywallet.component';
import Mycard from '../Components/Mycard.component';
import Mycardtransactions from '../Components/Mycardtransactions.component';
import Managecard from '../Components/Managecard.component';
import Externaltransfer from '../Components/Externaltransfer.component';
import Loading from '../Components/Loading.component';
import Ecommerce3DS from '../Components/Ecommerce3DS.component';
import EcommerceDCV from '../Components/EcommerceDCV.component';
import AtmQR from '../Components/AtmQRcode.component';
import Atmcash from '../Components/Atmcashcode.component';
import DCVactivation from '../Components/DCVactivation.component';
import Userpreferences from '../Components/Userpreferences.component';
import Maintainbeneficiarylist from '../Components/Maintainbeneficiarylist.component';
import Cardissuance from '../Components/Cardissuance.component';
import Multifactorauthentication from '../Components/Multifactorauthentication.component';
import Batchtransfer from '../Components/Batchtransfer.component';
import Personalinformation from '../Components/Personalinformation.component';
import Qrtoken from '../Components/Qrtoken.component';

const routes=[

    {
        path:"/layout/accountsummary",
        component:Accountpanel

    },
    {
        path:"/layout/MFA",
        component:Multifactorauthentication
    },
    {
        path:"/layout/tokenmanagement",
        component:Tokenmanagement

    },
    {
        path:"/layout/domestictransfer",
        component:Domestictransfer

    },
    ,
    {
        path:"/layout/externaltransfer",
        component:Externaltransfer

    },
    {
        path:"/layout/batchtransfer",
        component:Batchtransfer

    },
    {
        path:"/layout/resetaccount",
        component:Resetaccount

    },
    {
        path:"/layout/tokenlist",
        component:TokenList

    },
    {
        path:"/layout/personalinformation",
        component:Personalinformation

    },
    {
        path:"/layout/newbeneficiary",
        component:Newbeneficiary

    },
    {
        path:"/mobileregistration",
        component:Mobileregistration

    },
    {
        path:"/layout/accountdetail",
        component:Accountdetail

    },
    {
        path:"/layout/mywallet",
        component:Mywallet

    },
    {
        path:"/layout/mycard",
        component:Mycard
    },
    {
        path:"/layout/dcvactivation",
        component:DCVactivation
    },
    {
        path:"/layout/cardtransactions",
        component:Mycardtransactions
    }
    ,
    {
        path:"/layout/managecard",
        component:Managecard
    }
    ,
    {
        path:"/layout/userpreference",
        component:Userpreferences
    },
    {
        path:"/layout/beneficiarylist",
        component:Maintainbeneficiarylist
    },
    ,
    {
        path:"/layout/cardissuance",
        component:Cardissuance
    },
    {
        path:"/layout/loading",
        component:Loading
    },
    {
        path:"/ecomm3ds",
        component:Ecommerce3DS
    },
    {
        path:"/qrtoken"
    },
    {
        path:"/ecommdcv",
        component:EcommerceDCV
    },
    {
        path:"/atmQRcode",
        component:AtmQR
    },
    {
        path:"/atmcashcode",
        component:Atmcash
    },
    {
        path:"/qr",
        component:Qrtoken
    },

]

export default routes;
