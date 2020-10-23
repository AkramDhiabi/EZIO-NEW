///////////////////////////////////////////////////////////////////////////////
//
// E-BANKING FUNCTIONS
//
///////////////////////////////////////////////////////////////////////////////


// Create a callback to treat the return
var onConnectionFunctionToExecute = null,
    resultCallback = {
        success: function (a_oConnection, a_sToken) {
            'use strict';

            // Preapare to message to prompt
            var message = "Result: ";
            if (onConnectionFunctionToExecute === login) {

                message = " Your login token is ";

            } else if (onConnectionFunctionToExecute === transfertSigning) {

                message = " Your signature is ";

            } else if (onConnectionFunctionToExecute === transactionBatchSigning) {

                message = " Your signature is ";

            } else if (onConnectionFunctionToExecute === freeText) {

                message = " Your signature is ";

            } else if (onConnectionFunctionToExecute === otp) {

                message = " Your OTP is ";

            } else if (onConnectionFunctionToExecute === ocracr) {

                message = " Your OTP is ";

            } else if (onConnectionFunctionToExecute === ocrasign) {

                message = " Your OTP is ";
            }

            onConnectionFunctionToExecute = null;

           // showResult("Operation succedeed", message + a_sToken);
        },

        failure: function (a_oConnection, a_oError) {

            'use strict';
            onConnectionFunctionToExecute = null;

            if (a_oError.errorCode === "69F0") {

                a_oError.message = "Transaction rejected by user";
                a_oError.errorCode = undefined;
            }
            showResult("Operation rejected", displayError(a_oError));
        }
    };



function promptForTokenConnection() {
    'use strict';
    showResult("Your token is not connected", "Press key 7 or 8 on your token to connect");
}


function promptForConfirmation() {
    'use strict';
    showResult("Confirmation required on your token", "Press OK to confirm (or C to reject) the transaction data");
}



function onConnection(a_ConnectionObject) {

    'use strict';

    if ((null !== a_ConnectionObject) && (undefined !== a_ConnectionObject)) {
        toastOpen('Device Connected');
        //        enableButtons();
        if (onConnectionFunctionToExecute !== null) {
            //hideResult();
            onConnectionFunctionToExecute();
        }
    } else {
        toastOpen('EWC failed to connect to the device !!!');
    }
}


/*
 * LOGIN
 */
function login() {
    'use strict';
    var cnx = enex.getConnection(),
        // Set the size of the Ezio Flex screen
        displaySizes = [[12, 2], [12, 2]],
        application = enex.SWYS_APPLICATION_DEVICE_CONFIGURATION,
        algo = enex.SWYS_ALGO_GEMALTO,
        data = [["FREE_TEXT", ["GEMALTO DEMO", "LOGIN ?"]]],
        message;

    try {
        if (cnx) {
            promptForConfirmation();
            cnx.swys(resultCallback, application, data, algo, displaySizes);
        }

    } catch (e) {
        message = "Caught exception";
        message += " name: " + e.name;
        message += " message: " + e.message;
    }
}

/**
 * Click on the 'login' button
 */
$('#buttonLogin').click(function () {

    'use strict';

    // Get the connection object to communicate with the device
    var cnx = enex.getConnection();

    // The device is not ready ? Perform the login later when the 'onConnection' callback will be invoked
    if ((null === cnx) || (typeof (cnx) === "undefined")) {

        // Display a message to the end-user to activate the device
        promptForTokenConnection();

        // Save the function to invoke when the device will be connected
        onConnectionFunctionToExecute = login;
        return;
    }

    // The device is ready ? Perform the login directly
    login();

});


/*
 * TRANSFERT SIGNING
 */

//$("#buttonTransactionSign").addClass("disabled");
//$("#buttonTransactionSign").prop("disabled", true);

$('#transactionSignForm input').blur(function () {
    'use strict';
    //if (!$(this).val()) {
    if (!$("#transactionSigningAmount").val() || !$("#transactionSigningToAccount").val() || !$("#transactionSigningFromAccount").val() || !$("#transactionSigningDate").val()) {

        //        $("#buttonTransactionSign").addClass("disabled");
        $("#buttonTransactionSign").prop("disabled", true);

    } else {

        //        $("#buttonTransactionSign").addClass("active");
        $("#buttonTransactionSign").prop("disabled", false);
    }
});

function transfertSigning() {

    'use strict';

    var cnx = enex.getConnection(),
        displaySizes = [[12, 2], [12, 2]],
        amount = $("#transactionSigningAmount").val(),
        toAccount = $("#transactionSigningToAccount").val(),
        fromAccount = $("#transactionSigningFromAccount").val(),
        date = $("#transactionSigningDate").val(),
        data = [
            ["FREE_TEXT", ["FROM ACCOUNT", fromAccount]],
            ["FREE_TEXT", ["TO ACCOUNT", toAccount]],
            ["FREE_TEXT", ["DATE", date]],
            ["FREE_TEXT", ["AMOUNT (USD)", amount]]
        ],
        application = enex.SWYS_APPLICATION_DEVICE_CONFIGURATION,
        algo = enex.SWYS_ALGO_GEMALTO,
        message;

    try {
        if (cnx) {
            promptForConfirmation();
            cnx.swys(resultCallback, application, data, algo, displaySizes);
        }

    } catch (e) {
        message = "Caught exception";
        message += " name: " + e.name;
        message += " message: " + e.message;
    }
}


/**
 * Click on the button
 */
$('#buttonTransactionSign').click(function () {
    'use strict';

    // Get the connection object to communicate with the device
    var cnx = enex.getConnection();

    // The device is not ready ? Perform the signing later when the 'onConnection' callback will be invoked
    if ((null === cnx) || (typeof (cnx) === "undefined")) {

        // Display a message to the end-user to activate the device
        promptForTokenConnection();

        // Save the function to invoke when the device will be connected
        onConnectionFunctionToExecute = transfertSigning;
        return;
    }

    // The device is ready ? Perform the signing directly
    transfertSigning();

});


/*
 * BATCH TRANSFERT
 */

function transactionBatchSigning() {
    'use strict';

    var cnx = enex.getConnection(),
        displaySizes = [[12, 2], [12, 2]],
        amount = $('#transactionBatchSigningTotalAmount').val(),
        data = [
            ["FREE_TEXT", ["NUMBER OF", "PAYMENTS: 4"]],
            ["FREE_TEXT", ["CURRENCY", "         EUR"]],
            ["FREE_TEXT", ["TOTAL AMOUNT", amount]]
        ],
        application = enex.SWYS_APPLICATION_DEVICE_CONFIGURATION,
        algo = enex.SWYS_ALGO_GEMALTO,
        message;

    try {
        if (cnx) {
            promptForConfirmation();
            cnx.swys(resultCallback, application, data, algo, displaySizes);
        }

    } catch (e) {
        message = "Caught exception";
        message += " name: " + e.name;
        message += " message: " + e.message;
    }
}


$('#buttonTransactionBatchSigning').click(function () {
    'use strict';

    // Get the connection object to communicate with the device
    var cnx = enex.getConnection();

    // The device is not ready ? Perform the signing later when the 'onConnection' callback will be invoked
    if ((null === cnx) || (typeof (cnx) === "undefined")) {

        // Display a message to the end-user to activate the device
        promptForTokenConnection();

        // Save the function to invoke when the device will be connected
        onConnectionFunctionToExecute = transactionBatchSigning;
        return;
    }

    // The device is ready ? Perform the signing directly
    transactionBatchSigning();
});


/*
 * FREE TEXT
 */
function freeText() {
    'use strict';

    var displaySizes = [[12, 2], [12, 2]],
        cnx = enex.getConnection(),
        sRow1 = $('#freeTextRaw1').val(),
        sRow2 = $('#freeTextRaw2').val(),
        sRow3 = $('#freeTextRaw3').val(),
        sRow4 = $('#freeTextRaw4').val(),
        data = [
            ["FREE_TEXT", [sRow1, sRow2]],
            ["FREE_TEXT", [sRow3, sRow4]]
        ],
        application = enex.SWYS_APPLICATION_DEVICE_CONFIGURATION,
        algo = enex.SWYS_ALGO_GEMALTO,
        message;

    try {
        if (cnx) {
            promptForConfirmation();
            cnx.swys(resultCallback, application, data, algo, displaySizes);
        }

    } catch (e) {
        message = "Caught exception";
        message += " name: " + e.name;
        message += " message: " + e.message;
    }
}


$('#buttonFreeText').click(function () {
    'use strict';

    // Get the connection object to communicate with the device
    var cnx = enex.getConnection();

    // The device is not ready ? Perform the signing later when the 'onConnection' callback will be invoked
    if ((null === cnx) || (typeof (cnx) === "undefined")) {

        // Display a message to the end-user to activate the device
        promptForTokenConnection();

        // Save the function to invoke when the device will be connected
        onConnectionFunctionToExecute = freeText;
        return;
    }

    // The device is ready ? Perform the signing directly
    freeText();
});


/*
 * HOTP / TOTP
 */
function otp() {
    'use strict';

    var cnx = enex.getConnection(),
        authenticationCode = $('#authenticationCode').val(),
        message;

    try {
        if (cnx) {
            promptForConfirmation();

            // Get the authnetication code

            cnx.hotp_totp(resultCallback, authenticationCode);
        }

    } catch (e) {
        message = "Caught exception";
        message += " name: " + e.name;
        message += " message: " + e.message;
        showResult("Error", message);
    }
}


$('#buttonOTP').click(function () {
    'use strict';

    // Get the connection object to communicate with the device
    var cnx = enex.getConnection();

    // The device is not ready ? Perform the signing later when the 'onConnection' callback will be invoked
    if ((null === cnx) || (typeof (cnx) === "undefined")) {

        // Display a message to the end-user to activate the device
        promptForTokenConnection();

        // Save the function to invoke when the device will be connected
        onConnectionFunctionToExecute = otp;
        return;
    }

    // The device is ready ? Perform the signing directly
    otp();

});


/*
 * OCRA-1 CR
 */
function ocracr() {

    'use strict';

    var challenge = $('#otpChallenge').val(),
        authenticationCode = $('#authenticationCode').val(),
        cnx = enex.getConnection(),
        message;

    try {
        if (cnx) {
            promptForConfirmation();
            cnx.ocra1_cr(resultCallback, challenge, authenticationCode);
        }

    } catch (e) {
        message = "Caught exception";
        message += " name: " + e.name;
        message += " message: " + e.message;
        showResult("Error", message);
    }
}


$('#buttonOCRACR').click(function () {
    'use strict';

    // Get the connection object to communicate with the device
    var cnx = enex.getConnection();

    // The device is not ready ? Perform the signing later when the 'onConnection' callback will be invoked
    if ((null === cnx) || (typeof (cnx) === "undefined")) {

        // Display a message to the end-user to activate the device
        promptForTokenConnection();

        // Save the function to invoke when the device will be connected
        onConnectionFunctionToExecute = ocracr;
        return;
    }

    // The device is ready ? Perform the signing directly
    ocracr();
});


/*
 * OCRA-1 SIGN
 */
function ocrasign() {

    'use strict';

    var challenge = $('#otpData').val(),
        authenticationCode = $('#authenticationCode').val(),
        cnx = enex.getConnection(),
        message;

    try {
        if (cnx) {
            promptForConfirmation();
            cnx.ocra1_sign(resultCallback, challenge, authenticationCode);
        }

    } catch (e) {
        message = "Caught exception";
        message += " name: " + e.name;
        message += " message: " + e.message;
        showResult("Error", message);
    }
}


$('#buttonOCRASIGN').click(function () {
    'use strict';

    // Get the connection object to communicate with the device
    var cnx = enex.getConnection();

    // The device is not ready ? Perform the signing later when the 'onConnection' callback will be invoked
    if ((null === cnx) || (typeof (cnx) === "undefined")) {

        // Display a message to the end-user to activate the device
        promptForTokenConnection();

        // Save the function to invoke when the device will be connected
        onConnectionFunctionToExecute = ocrasign;
        return;
    }

    // The device is ready ? Perform the signing directly
    ocrasign();
});





/*
 * Get device challenge
 */
function getDeviceChallenge() {

    'use strict';

    var cnx = enex.getConnection(),
        message;

    try {
        if (cnx) {
            promptForConfirmation();
            cnx.getDeviceChallenge(resultCallback);
        }

    } catch (e) {
        message = "Caught exception";
        message += " name: " + e.name;
        message += " message: " + e.message;
        showResult("Error", message);
    }
}



$('#buttonGetDeviceChallenge').click(function () {
    'use strict';

    // Get the connection object to communicate with the device
    var cnx = enex.getConnection();

    // The device is not ready ? Perform the signing later when the 'onConnection' callback will be invoked
    if ((null === cnx) || (typeof (cnx) === "undefined")) {

        // Display a message to the end-user to activate the device
        promptForTokenConnection();

        // Save the function to invoke when the device will be connected
        onConnectionFunctionToExecute = getDeviceChallenge;
        return;
    }

    // The device is ready ? Perform the signing directly
    getDeviceChallenge();
});




// create a custom hardware filter
function ezioFlexHardwareFilter(a_ReaderName, a_SmartCardATR) {
    'use strict';

    // Here is a filter to only accept a reader with a name containing "GEMALTO VIRTUAL SMARTCARD READER"
    //if ((a_ReaderName.toUpperCase().search("GEMALTO VIRTUAL SMARTCARD READER") >= 0) && (a_SmartCardATR.toUpperCase().search("3B6900005A454E20544F4B454E") >= 0)) {

    // Here is a filter to only accept a reader with a fixed ATR dedicated to the Ezio Flex token
    if (a_SmartCardATR.toUpperCase().search("3B6900005A454E20544F4B454E") >= 0) {

        return true;
    }
    return false;
}

function initializeEzioFlex() {
    'use strict';

    // Initialize EWC with the custom hardware filter
    initialize(ezioFlexHardwareFilter);
}
