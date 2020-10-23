/**
 * ------------------------------------------------------------------------------
 *
 *     Copyright (c) 2013  GEMALTO DEVELOPPEMENT - R&D
 *
 * ------------------------------------------------------------------------------
 * GEMALTO MAKES NO REPRESENTATIONS OR WARRANTIES ABOUT THE SUITABILITY OF
 * THE SOFTWARE, EITHER EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED
 * TO THE IMPLIED WARRANTIES OF MERCHANTABILITY, FITNESS FOR A
 * PARTICULAR PURPOSE, OR NON-INFRINGEMENT. GEMALTO SHALL NOT BE
 * LIABLE FOR ANY DAMAGES SUFFERED BY LICENSEE AS A RESULT OF USING,
 * MODIFYING OR DISTRIBUTING THIS SOFTWARE OR ITS DERIVATIVES.
 *
 * THIS SOFTWARE IS NOT DESIGNED OR INTENDED FOR USE OR RESALE AS ON-LINE
 * CONTROL EQUIPMENT IN HAZARDOUS ENVIRONMENTS REQUIRING FAIL-SAFE
 * PERFORMANCE, SUCH AS IN THE OPERATION OF NUCLEAR FACILITIES, AIRCRAFT
 * NAVIGATION OR COMMUNICATION SYSTEMS, AIR TRAFFIC CONTROL, DIRECT LIFE
 * SUPPORT MACHINES, OR WEAPONS SYSTEMS, IN WHICH THE FAILURE OF THE
 * SOFTWARE COULD LEAD DIRECTLY TO DEATH, PERSONAL INJURY, OR SEVERE
 * PHYSICAL OR ENVIRONMENTAL DAMAGE ("HIGH RISK ACTIVITIES"). GEMALTO
 * SPECIFICALLY DISCLAIMS ANY EXPRESS OR IMPLIED WARRANTY OF FITNESS FOR
 * HIGH RISK ACTIVITIES.
 *
 * ------------------------------------------------------------------------------
 */

/* JSHint configuration */
/*global $: true */
/*global enex: true */
/*global window: true */
/*global document: true */


var TOAST_IDENTIFIER = "ToastForEWC",
    g_sTitleOK = "Yes !!!",
    g_sTitleKO = "Oh no !!!",
    /**
     * @public
     * @description The bank must specify a link to its private SConnect repository.
     * If this configuration is not provided then SConnect default web site is used.
     */
    serverConfiguration = {
        // Mind to modify the URL to connect to your private web server.
        // THE "impPath", "extPath", "eulaPath", "faqPath" AND "addonPath" URLS ARE ALWAYS ABSOLUTE PATH.
        imgPath: "https://frontdev.dbpdemo.com/lib/sconnect/images/",
        extPath: "https://frontdev.dbpdemo.comlib/sconnect/extensions/",
        eulaPath: "https://frontdev.dbpdemo.com/lib/sconnect/eula/",
        faqPath: "https://frontdev.dbpdemo.com/lib/sconnect/faq/",
        addonPath: "https://frontdev.dbpdemo.com/lib/sconnect/addons/",
		licensePath: "/eziodemov2/lib/sconnect_key.lic"
		//licensePath: "/../sconnect_key.lic"
        // Mind to modify the licensePath URL if you want to deploy SConnect on a private web server
        // THE LICENSE PATH IS ALWAYS RELATIVE PATH.

    },
    /**
     * @public
     * @description The bank must specify the configuration of the reader provided to its customers.
     * The configuration is about currencies, primitives and templates used for SWYS operations.
     */
    readerConfiguration = {
        "currencies": {
            "EUR": "978",
            "USD": "840",
            "GBP": "826",
            "BRL": "986",
            "ARS": "032",
            "SEK": "752",
            "Other": "999"
        },
        "primitives": {
            "INPUT_FURTHER_INPUTS": {
                "type": "ID",
                "tag": "DF43",
                "min_length": 3,
                "max_length": 11
            },
            "INPUT_CHALLENGE": {
                "type": "IDG",
                "tag": "9F37",
                "min_length": 0,
                "max_length": 8
            },
            "INPUT_AMOUNT": {
                "type": "DID",
                "tag": "9F03",
                "min_length": 1,
                "max_length": 12
            },
            "INPUT_ACCOUNT_NUMBER": {
                "type": "ID",
                "tag": "DF03",
                "min_length": 1,
                "max_length": 17
            },
            "INPUT_TO_ACCOUNT": {
                "type": "ID",
                "tag": "DF04",
                "min_length": 1,
                "max_length": 17
            },
            "INPUT_FROM_ACCOUNT": {
                "type": "ID",
                "tag": "5A",
                "min_length": 1,
                "max_length": 17
            },
            "INPUT_PG_BG": {
                "type": "SD",
                "tag": "DF06",
                "allowed_values": {
                    "PG": "1",
                    "BG": "2"
                }
            },
            "INPUT_REF_ORDER_NUMBER": {
                "type": "ID",
                "tag": "DF07",
                "min_length": 1,
                "max_length": 28
            },
            "INPUT_REFERENCE_NUMBER": {
                "type": "ID",
                "tag": "DF08",
                "min_length": 0,
                "max_length": 28
            },
            "INPUT_NUMBER_OF_PAYMENTS": {
                "type": "NID",
                "tag": "C3",
                "min_length": 0,
                "max_length": 12
            },
            "INPUT_DATE": {
                "type": "ID",
                "tag": "9A",
                "min_length": 6,
                "max_length": 8
            },
            "INPUT_CHECKSUM": {
                "type": "ID",
                "tag": "DF64",
                "min_length": 0,
                "max_length": 17
            },
            "INPUT_TIME": {
                "type": "ID",
                "tag": "DF14",
                "min_length": 4,
                "max_length": 4
            },
            "INPUT_NOT_BEFORE": {
                "type": "ID",
                "tag": "DF15",
                "min_length": 6,
                "max_length": 8
            },
            "INPUT_CURRENCY": {
                "type": "SD",
                "tag": "5F2A",
                "allowed_values": "currencies"
            },
            "INPUT_AMOUNT_WITH_CURRENCY": {
                "type": "DID",
                "tag": "9F02",
                "min_length": 1,
                "max_length": 12
            },
            "INPUT_BUY_SELL": {
                "type": "SD",
                "tag": "DF17",
                "allowed_values": {
                    "BUY": "1",
                    "SELL": "2"
                }
            },
            "INPUT_IBAN": {
                "type": "ID",
                "tag": "DF18",
                "min_length": 6,
                "max_length": 28
            },
            "INPUT_LIMIT": {
                "type": "DID",
                "tag": "DF19",
                "min_length": 1,
                "max_length": 12
            },
            "INPUT_USER_ID": {
                "type": "ID",
                "tag": "DF20",
                "min_length": 0,
                "max_length": 17
            },
            "INPUT_UNITS": {
                "type": "DID",
                "tag": "DF21",
                "min_length": 1,
                "max_length": 12
            },
            "INPUT_IDENTITY_NUMBER": {
                "type": "ID",
                "tag": "DF23",
                "min_length": 6,
                "max_length": 17
            },
            "INPUT_EXTRA_CODE": {
                "type": "IDG",
                "tag": "DF24",
                "min_length": 2,
                "max_length": 12
            },
            "INPUT_QUANTITY": {
                "type": "NID",
                "tag": "DF25",
                "min_length": 1,
                "max_length": 11
            },
            "INPUT_PHONE_NUMBER": {
                "type": "ID",
                "tag": "DF26",
                "min_length": 5,
                "max_length": 17
            },
            "INPUT_DATA": {
                "type": "ID",
                "tag": "DF71",
                "min_length": 1,
                "max_length": 17
            },
            "INPUT_DATA_2": {
                "type": "ID",
                "tag": "DF72",
                "min_length": 1,
                "max_length": 17
            },
            "INPUT_DATA_3": {
                "type": "ID",
                "tag": "DF73",
                "min_length": 1,
                "max_length": 17
            },
            "INPUT_DATA_4": {
                "type": "ID",
                "tag": "DF74",
                "min_length": 1,
                "max_length": 17
            },
            "INPUT_DATA_5": {
                "type": "ID",
                "tag": "DF75",
                "min_length": 1,
                "max_length": 17
            },
            "INPUT_DATA_6": {
                "type": "ID",
                "tag": "DF76",
                "min_length": 1,
                "max_length": 17
            },
            "INPUT_DATA_7": {
                "type": "ID",
                "tag": "DF77",
                "min_length": 1,
                "max_length": 17
            },
            "INPUT_DATA_8": {
                "type": "ID",
                "tag": "DF78",
                "min_length": 1,
                "max_length": 17
            },
            "INPUT_DATA_9": {
                "type": "ID",
                "tag": "DF79",
                "min_length": 1,
                "max_length": 17
            },
            "INPUT_DATA_10": {
                "type": "ID",
                "tag": "DF7A",
                "min_length": 1,
                "max_length": 17
            },
            "INPUT_PASSCODE": {
                "type": "ID",
                "tag": "DF1C",
                "min_length": 0,
                "max_length": 17
            },
            "INPUT_DUE_DATE": {
                "type": "ID",
                "tag": "DF37",
                "min_length": 6,
                "max_length": 8
            },
            "INPUT_LOGIN_CODE": {
                "type": "ID",
                "tag": "DF38",
                "min_length": 0,
                "max_length": 17
            },
            "INPUT_TOTAL_AMOUNT": {
                "type": "DID",
                "tag": "DF39",
                "min_length": 1,
                "max_length": 12
            },
            "INPUT_VALID_UNTIL": {
                "type": "ID",
                "tag": "DF40",
                "min_length": 6,
                "max_length": 8
            },
            "INPUT_TO_DATE": {
                "type": "ID",
                "tag": "DF41",
                "min_length": 6,
                "max_length": 8
            },
            "INPUT_FROM_DATE": {
                "type": "ID",
                "tag": "DF42",
                "min_length": 6,
                "max_length": 8
            },

            "MESSAGE_INTERNATIONAL_PAYMENT": {
                "type": "MD",
                "tag": "BF11"
            },
            "MESSAGE_BUY_SELL_SHARES": {
                "type": "MD",
                "tag": "BF12"
            },
            "MESSAGE_NEW_PHONE_NUMBER": {
                "type": "MD",
                "tag": "BF13"
            },
            "MESSAGE_NEW_PG_BG": {
                "type": "MD",
                "tag": "BF14"
            },
            "MESSAGE_CONFIRM_PROTECT_FILE": {
                "type": "MD",
                "tag": "BF15"
            },
            "MESSAGE_CONFIRM_AGREEMENT": {
                "type": "MD",
                "tag": "BF16"
            },
            "MESSAGE_PG_BG_PAYMENT": {
                "type": "MD",
                "tag": "BF17"
            },
            "MESSAGE_NEW_BENEFICIARY": {
                "type": "MD",
                "tag": "BF18"
            },
            "MESSAGE_LOGIN": {
                "type": "MD",
                "tag": "BF19"
            },
            "MESSAGE_PAYMENT": {
                "type": "MD",
                "tag": "BF1A"
            },
            "MESSAGE_TRANSFER": {
                "type": "MD",
                "tag": "BF1B"
            },
            "MESSAGE_SIGNING": {
                "type": "MD",
                "tag": "BF1C"
            },
            "MESSAGE_AUTHENTICATE": {
                "type": "MD",
                "tag": "BF1D"
            },
            "MESSAGE_CONFIRM_ASSIGNMENT": {
                "type": "MD",
                "tag": "BF1E"
            },
            "MESSAGE_CONFIRM_ADDRESS_CHANGE": {
                "type": "MD",
                "tag": "BF1F"
            },

            "FREE_TEXT": {
                "type": "E0",
                "tag": "E0"
            },
            "HIDDEN_TEXT": {
                "type": "E1",
                "tag": "E1",
                "min_length": 1,
                "max_length": 127
            }
        },
        "templates": {
            "0": [["INPUT_FURTHER_INPUTS"], ["SIGN", "BUY", "LOGIN"]],
            "1": [["INPUT_USER_ID"], ["LOGIN"]],
            "2": [["INPUT_PASSCODE"], ["LOGIN"]],
            "3": [["INPUT_IDENTITY_NUMBER"], ["LOGIN", "SIGN"]],
            "4": [["INPUT_EXTRA_CODE"], ["LOGIN", "SIGN", "BUY"]],
            "5": [["INPUT_REFERENCE_NUMBER"], ["LOGIN", "SIGN", "BUY"]],
            "6": [["INPUT_DATA"], ["LOGIN", "SIGN", "BUY"]],
            "7": [["MESSAGE_NEW_BENEFICIARY", "INPUT_ACCOUNT_NUMBER"], ["SIGN"]],
            "8": [["MESSAGE_NEW_PHONE_NUMBER", "INPUT_PHONE_NUMBER"], ["SIGN", "BUY"]],
            "9": [["INPUT_AMOUNT"], ["SIGN", "BUY"]],
            "10": [["INPUT_TO_ACCOUNT", "INPUT_AMOUNT"], ["SIGN"]],
            "11": [["MESSAGE_NEW_BENEFICIARY"], ["SIGN"]],
            "12": [["MESSAGE_CONFIRM_ADDRESS_CHANGE"], ["SIGN"]],
            "13": [["INPUT_CURRENCY", "INPUT_AMOUNT_WITH_CURRENCY"], ["SIGN", "BUY"]],
            "14": [["INPUT_NUMBER_OF_PAYMENTS", "INPUT_TOTAL_AMOUNT"], ["SIGN"]],
            "15": [["MESSAGE_INTERNATIONAL_PAYMENT", "INPUT_IBAN", "INPUT_CURRENCY", "INPUT_AMOUNT_WITH_CURRENCY"], ["SIGN"]],
            "16": [["MESSAGE_CONFIRM_AGREEMENT", "INPUT_REFERENCE_NUMBER", "INPUT_DATE"], ["SIGN", "BUY"]],
            "17": [["MESSAGE_CONFIRM_PROTECT_FILE", "INPUT_CHECKSUM"], ["SIGN"]],
            "18": [["MESSAGE_CONFIRM_PROTECT_FILE", "INPUT_CHECKSUM", "INPUT_TOTAL_AMOUNT"], ["SIGN"]],
            "19": [["MESSAGE_BUY_SELL_SHARES", "INPUT_BUY_SELL", "INPUT_AMOUNT"], ["SIGN"]],
            "20": [["MESSAGE_BUY_SELL_SHARES", "INPUT_BUY_SELL", "INPUT_QUANTITY"], ["SIGN"]],
            "21": [["MESSAGE_BUY_SELL_SHARES", "INPUT_BUY_SELL", "INPUT_QUANTITY", "INPUT_LIMIT", "INPUT_TO_DATE"], ["SIGN"]],
            "22": [["INPUT_ACCOUNT_NUMBER"], ["SIGN"]],
            "23": [["MESSAGE_PG_BG_PAYMENT", "INPUT_ACCOUNT_NUMBER", "INPUT_REFERENCE_NUMBER", "INPUT_AMOUNT"], ["SIGN"]]
        }
    };


function hideResult() {
    'use strict';
    $('#sdk-modalbox').modal('hide');
}


function showResult(a_sTitle, a_sMessage) {
    'use strict';
    try {
        hideResult();

        document.getElementById("sdk-modal-title").innerHTML = a_sTitle;
        document.getElementById("sdk-modal-result").innerHTML = a_sMessage;

        $("#sdk-modalbox").modal({
            backdrop: false
        });
    } catch (ex) {
        window.alert(a_sMessage);
    }
}


function onLicenceVerificationFailed() {
    'use strict';
    showResult("SConnect error", "SConnect licence verification failed");
}


/**
 * @public
 * The smart card and the reader can be filtered.
 * This callback provides the reader name and the smart card ATR as incoming parameters.
 * If the reader and the smart card are acceptable then return TRUE otherwise return FALSE
 */
function hardwareFilter( /*a_ReaderName, a_SmartCardATR*/ ) {
    'use strict';
    /*
    // Here is a filter to only accept a reader with a name containing "shield"
    if (a_ReaderName.toUpperCase().search("SHIELD") >= 0) {
        return true;
    }
    return false;*/

    // Accept any reader & smartcard
    return true;
}




function log(a_sMsg) {
    'use strict';
    var e = document.getElementById("log");
    if (e) {
        e.innerHTML += a_sMsg;
    }
}




function onHardwareChange(a_Event, a_ReaderName, a_SmartCardATR) {
    'use strict';
    var sMsg = "";
    switch (a_Event) {

        case "CARD_IN":
            sMsg += "<p class='text-success'> A smart card with the ATR ";
            sMsg += a_SmartCardATR;
            sMsg += " is inserted in the reader ";
            sMsg += a_ReaderName;
            sMsg += "</p>";
            break;

        case "CARD_OUT":
            sMsg += "<p class='text-warning'>The smart card is withdrawn from the reader ";
            sMsg += a_ReaderName;
            sMsg += "</p>";
            break;

        case "CARD_MUTE":
            sMsg += "<p class='text-error'> The smart card inserted into the ";
            sMsg += a_ReaderName;
            sMsg += " reader is MUTE !!!</p>";
            break;

        case "READER_IN":
            sMsg += "<p class='text-success'> The reader ";
            sMsg += a_ReaderName;
            sMsg += " is inserted on your system</p>";
            break;

        case "READER_OUT":
            sMsg += "<p class='text-warning'> The reader ";
            sMsg += a_ReaderName;
            sMsg += " is withdrawn from your system</p>";
            break;

        default:
            sMsg += "<p class='text-error'><strong>UNKNOWN EVENT ";
            sMsg += a_Event;
            sMsg += " </strong></p>";
            break;
    }

    log(sMsg);
}


/*
 */
function toastClose() {

    'use strict';

    // Retrieve the toast element
    var toast = document.getElementById(TOAST_IDENTIFIER);

    if (toast) {

        // Hide the toast
        toast.style.opacity = 0;

        // Stop the timed execution
        window.clearInterval(toast.Counter);

        // Destroy the toast HTML element
        document.body.removeChild(toast);
    }
}



function toastOpen(a_Message) {

    'use strict';
    // Remove a previous toast if already present on screen
    toastClose();

    var d = document.createElement("div");
    d.id = TOAST_IDENTIFIER;
    d.style.cssText = "position: fixed; top: 50%; left: 50%; margin-left: -100px; border: 1px solid #666; background-color: #B1BCCF; padding: 10px 0 ; padding-top:25px; padding-bottom:25px; padding-right:50px; padding-left:50px; text-align:center; opacity: .9;" +
        "-webkit-transition: opacity 0.5s ease-out;-moz-transition: opacity 0.5s ease-out;-ms-transition: opacity 0.5s ease-out;-o-transition: opacity 0.5s ease-out;transition: opacity 0.5s ease-out;";
    d.style.opacity = 0.9;
    d.innerHTML = '<div>' + a_Message + '</div>';
    // Add the new element to the html page
    document.body.appendChild(d);
    // Show the toast and the call the close it after a few seconds
    function showAndClose() {
        // Retrieve the toast element
        var toast = document.getElementById(TOAST_IDENTIFIER);
        // Hide the toast
        toast.style.opacity = 0;
        // Stop the timed execution
        window.clearInterval(d.Counter);
        // Destroy the toast HTML element
        document.body.removeChild(toast);
    }

    d.Counter = window.setTimeout(showAndClose, 3000);
}






var onInitialization = {

    success: function () {
        'use strict';
        toastOpen('EWC initialization done');
    },

    error: function ( /*a_oError*/ ) {
        'use strict';
        toastOpen('EWC initialization failed !!!');
    }
};


function onConnection(a_ConnectionObject) {

    'use strict';

    if ((null !== a_ConnectionObject) && (undefined !== a_ConnectionObject)) {
        toastOpen('Connected to the smart card');
    } else {
        toastOpen('EWC failed to connect to the smart card !!!');
    }
}



function initialize(customHardwareFilter) {
    'use strict';
    var JSONReaderConfiguration = readerConfiguration,
        CallbackHardwareFilter = (customHardwareFilter === undefined) ? hardwareFilter : customHardwareFilter,
        CallbackConnection = onConnection,
        CallbackHardwareEventNotification = onHardwareChange,
        CallbackLicenceVerificationFailed = onLicenceVerificationFailed,
        JSONServerConfiguration = serverConfiguration,
        SkipSConnectMessages = true,
        bEnableGUI = false,
        CallbackDialogBox = null,
        callbackInitialization = onInitialization;

    try {
        enex.init(JSONReaderConfiguration,
            CallbackHardwareFilter,
            CallbackConnection,
            CallbackHardwareEventNotification,
            CallbackLicenceVerificationFailed,
            JSONServerConfiguration,
            SkipSConnectMessages,
            bEnableGUI,
            CallbackDialogBox,
            callbackInitialization);
    } catch (e) {
        window.alert("Message error: " + e.message);
    }
}



function finalize() {
    'use strict';
    enex.dispose();
}


function displayError(args) {
    'use strict';
    var message = "";
    if (args.message !== undefined) {
        message += args.message;
    }
    if (args.errorCode !== undefined) {
        message += " (" + args.errorCode + ")";
    }

    return message;
}
