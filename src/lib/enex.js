/**
 * ------------------------------------------------------------------------------
 *
 *     Copyright (c) 2015  GEMALTO
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

/**
 * @file JavaScript EWC library
 * @version 3.x
 * @author Gemalto
 * @overview Ezio Web Connector (EWC) is a product that enables a web browser, on the end users PC, to communicate with a
 connectible Gemalto card device. A JavaScript API and a browser plug-in lets the browser send
 high level requests to smart cards inserted in the device.
 The connectible functions in the card device that is available though this product is for instance
 CAP Token generation and SWYS signing, depending on the functionality of the specific card
 device.
 All of the low level communication (APDU) to the card device and the smart card is taken care of
 inside this product. A customer that develops a web site that needs to utilize the connectible
 functionality of a card device only needs to understand the high level concepts.
 * @copyright Gemalto 2014
 * @license PRIVATE
 */

/* JSHint configuration */
/*jslint bitwise: true */
/*global window: false */
/*global document: false */
/*global navigator: false */
/*global XMLHttpRequest: false */
/*global SConnect: false */
/*global SConnectBrowserDetect: false */
/*global LoggingService: false */
/*global apdu_Transmit:false*/
/*global checkApduResponse:false */
/*jslint nomen: true*/

/**
 * @public
 * @property enex
 * @desc Global object exposing all functions of the EWC library
 * @namespace
 */

var enex = (function () {

    'use strict';

    // Check if the LoggingService JavaScript object is present
    if (!window.LoggingService) {

        // If the LoggingService is not present, create an empty one
        window.LoggingService = {
            debug: function () {},
            info: function () {},
            warning: function () {},
            error: function () {}
        };

        // Notify in the browser
        if (window.console && window.console.warn) {

            window.console.warn("======== EWC ======== LoggingService JavaScript not included in your page");
        }
    }

    // Check if the SConnect JavaScript object is present
    if (!window.SConnect) {

        // Notify in the browser
        if (window.console && window.console.error) {

            window.console.error("======== EWC ======== SConnect JavaScript not included in your page");
        }
    }

    /**
     * @private
     * @property ReturnedAPI
     * @desc Object exposing all public functions of the EWC library.
     */
    var ReturnedAPI = {},
        ENEX_MODALBOX_IDENTIFIER = "enexModalBox",
        g_callbackForResult = null,
        /**
         * @private
         * @property g_CallbackDialogBox
         * @desc Object providing the "open" and "close" functions to display GUI instead of the inner EWC GUI. Overwritten by "init" function.
         */
        g_CallbackDialogBox = null,
        /**
         * @private
         * @property languageDefault
         * @desc Default language used to display messages to end-user.
         */
        languageDefault = 'en',
        /**
         * @private
         * @constant
         * @property g_languageSupport
         * @desc List of supported languages.
         */
        g_languageSupport = ['fr', 'en'],
        /**
         * @private
         * @property g_bEnableGUI
         * @desc boolean flag to enable or disable the inner EWC GUI. Overwritten by "init" function.
         */
        g_bEnableGUI = true,
        asErrors = [],
        pcsc_errors = [],
        /**
         * @private
         * @function g_CallbackHardwareFilter
         * @desc Callback used to accept or reject the device or smart card when the smart card is inserted. Overwritten by "init" function.
         */
        g_CallbackHardwareFilter = null,

        /**
         * @private
         * @constant
         * @property g_languageStrings
         * @desc List of string used in the GUI.
         */
        g_languageStrings = {
            // StringId : ["french", "english"]
            AddonsInstallationFailed: ["L'installation des add-ons SConnect a échoué", "SConnect add-ons installation failed"],
            ValidationLicenseFailed: ["La license SConnect n'est pas valide", "The SConnect license is not valid"],
            SmartcardServiceNotRunning: ["Le service carte à puce ne fonctionne pas. Merci de le lancer.", "Smart card service in your computer is stopped,<br> please activate the smart card service in your control panel"],
            UnknownError: ["Erreur inconnue", "Unknown error"],
            AbortedByUser: ["Operation abandonnée par l'utilisateur", "Operation aborted by user"],
            deviceRemoved: ["Device retiré", "Device removed"],
            CardRemoved: ["Carte retirée", "Card removed"],
            CardBlocked: ["Carte bloquée", "Smart card is blocked"],
            CardMute: ["Carte muette. Retirer et ré-insérer la carte dans le lecteur", "Card mute. Remove and then re-insert the smart card into the device"],
            MoveCard: ["Retirer et ré-insérer la carte dans le lecteur", "Remove and then re-insert the smart card into the device"],
            FunctionNotSupported: ["Fonction non supportée par le lecteur", "Function not supported by the device"],
            InvalidArguments: ["Paramètre invalide", "Invalid Parameter"],
            HardwareRequired: ["Veuillez connecter un lecteur et insérer une carte à puce", "Please connect a device and insert a smart card"],
            ReaderNotCAP: ["Votre lecteur n'est pas compatible", "Your device is not compatible"],
            SeamInstall: ["Un composant doit être installé dans votre navigateur.<br>Merci de suivre la procédure ", "A component need to be installed in your browser.<br>Please follow the procedure "],
            BrowserNotSupported: ["Votre navigateur n'est pas supporté.", "Your browser is not supported."],
            ReaderReadInstructions: ["Veuillez suivre les instructions indiquées sur votre lecteur", "Please follow the instructions displayed on your device."],
            OperationSucceeded: ["Opération réussie. Votre OTP est ", "Operation succeeded. Your OTP is "],
            ConfirmPAN: ["Veuillez confirmer la lecture du PAN sur votre lecteur ", "Please confirm the PAN query on your device "],
            PcscError: ["Une erreur de communication avec le lecteur s'est produite ", "A communication error with the device occurred "],
            SConnectNotInstalled: ["SConnect non installé ", "SConnect not installed "],
            PCRInformationFailed: ["Impossible de lire les informations du PCR ", "Not able to read PCR information "],
            StringTooLong: ["Chaîne trop longue ", "String too long "],
            IncorrectTDSNumber: ["Nombre de champs TDS incorrect ", "Incorrect number of TDS data fields "],
            IncorrectTDSFormat: ["Format de champs TDS incorrect ", "Incorrect formatted TDS data input "],
            UnknownCurrency: ["Monnaie inconnue: ", "Unknown currency: "],
            UnknownSWYSPrimitive: ["Primitive SWYS inconnue: ", "Unknown SWYS primitive: "],
            FeatureNotSupported: ["Commande non supportée ", "Feature not supported "],
            InvalidSecureChannelOperationParameter: ["SecureChannel operation invalide ", "Invalid Secure Channel operation parameter "],
            InvalidINPUT_AMOUNT_WITH_CURRENCYParameter: ["Primitive INPUT_AMOUNT_WITH_CURRENCY utilisée sans INPUT_CURRENCY ", "INPUT_AMOUNT_WITH_CURRENCY primitive used without INPUT_CURRENCY "],
            InvalidPrimitiveType: ["Type de primitive inconnu ", "Unknown SWYS primitive type "],
            InvalidCurrencyWithoutAmountParameter: ["Primitive Monnaie définie sans paramètre montant", "INPUT_CURRENCY primitive used without INPUT_AMOUNT_WITH_CURRENCY "],
            MaximumSignBufferSizeExceeded: ["Taille de signature incorrect", "Maximum sign buffer size exceeded "],
            InvalidDecimalValue: ["La valeur decimale (DID) doit avoir un . ou un , comme séparateur décimal et deux chiffres aprés la virgule", "Decimal values (DID) must have a . or , as decimal separator followed by two decimal digits "],
            InvalidDataLength: ["Taille de donnée incorrecte", "Incorrect data length "],
            InputMustBeDigitsOnly: ["Les données doivent être composées seulement de digits", "Input must be digits only "],
            UnknownValue: ["Valeur inconnue", "Unknown value "]
        },
        /**
         * @private
         * @constant
         * @property DEFAULT_READER_CONFIGURATION
         * @desc Default configuration of the currencies, primitives and templates used for SWYS operations.
         */
        DEFAULT_READER_CONFIGURATION = {
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
        },
        /**
         * @private
         * @property g_CurrentConnection
         * @desc Connection object instance created when the smart card is inserted
         */
        g_CurrentConnection = null,
        /**
         * @private
         * @property g_ReaderConfiguration
         * @desc set of primitives, currencies and template needed for Dynamic Signature. Overwritten by "init" function.
         */
        g_ReaderConfiguration = null,
        /**
         * @private
         * @function g_CallbackHardwareEventNotification
         * @desc Callback used to notify reader/smart card events. Overwritten by "init" function.
         */
        g_CallbackHardwareEventNotification = null,
        /**
         * @private
         * @function g_CallbackLicenceVerificationFailed
         * @desc Callback used to notify a SConnnect licence verification failure. Overwritten by "init" function.
         */
        g_CallbackLicenceVerificationFailed = null,
        /**
         * @private
         * @function g_CallbackConnection
         * @desc Callback used to perform automatically an operation when the smart card is inserted. Overwritten by "init" function.
         */
        g_CallbackConnection = null,
        /**
         * @private
         * @property g_currentReader
         * @desc Inner property to store the name of the reader currently seen by PC/SC. If for any reason the connection is not possible
         * when the smart card is inserted (foe example another program opens an exclusive connection to the smart card at the same time
         * eNex tries to connect to), the value is used in the "getConnection" function to reconnect to the smart silently.
         */
        g_currentReader = null,
        /**
         * @private
         * @property g_currentATR
         * @desc Inner property to store the ATR of the smart-card currently seen by PC/SC. If for any reason the connection is not possible
         * when the smart card is inserted (foe example another program opens an exclusive connection to the smart card at the same time
         * eNex tries to connect to), the value is used in the "getConnection" function to reconnect to the smart silently.
         */
        g_currentATR = null,
        g_SkipSConnectMessages = true,
        g_CallbackInitialization = null,
        g_serverConfiguration = null,
        installAddOnsCallback,
        g_HardwareEventHandler,
        validateCallback;

    // Defines the errors codes & strings for eBanking operations
    asErrors["6283"] = "The Card holder Authentication Application is blocked";
    asErrors["6330"] = "More than 10 AIDs available for the selected authentication mode";
    asErrors["63C0"] = "No PIN tries remaining";
    asErrors["63C1"] = "PIN authentication failed. 1 try remaining";
    asErrors["63C2"] = "PIN authentication failed. 2 tries remaining";
    asErrors["63C3"] = "PIN authentication failed. 3 No PIN tries remaining";
    asErrors["63C4"] = "PIN authentication failed. 4 No PIN tries remaining";
    asErrors["63C5"] = "PIN authentication failed. 5 No PIN tries remaining";
    asErrors["63C6"] = "PIN authentication failed. 6 No PIN tries remaining";
    asErrors["63C7"] = "PIN authentication failed. 7 No PIN tries remaining";
    asErrors["63C8"] = "PIN authentication failed. 8 No PIN tries remaining";
    asErrors["63C9"] = "PIN authentication failed. 9 No PIN tries remaining";
    asErrors["63CA"] = "PIN authentication failed. 10 No PIN tries remaining";
    asErrors["63CB"] = "PIN authentication failed. 11 No PIN tries remaining";
    asErrors["63CC"] = "PIN authentication failed. 12 No PIN tries remaining";
    asErrors["63CD"] = "PIN authentication failed. 13 No PIN tries remaining";
    asErrors["63CE"] = "PIN authentication failed. 14 No PIN tries remaining";
    asErrors["63CF"] = "PIN authentication failed. 15 No PIN tries remaining";
    asErrors["6400"] = "Operation aborted after time-out";
    asErrors["6401"] = "Operation aborted by end-user";
    asErrors["6521"] = "Secure Channel Establishment Not able to generate a CAP Token";
    asErrors["6531"] = "Secure Channel Establishment Not able to generate AC";
    asErrors["6532"] = "Secure Channel Establishment Not able to generate AC";
    asErrors["6533"] = "Secure Channel Establishment Not able to generate AC";
    asErrors["6534"] = "Secure Channel Establishment Not able to generate AC";
    asErrors["6535"] = "Secure Channel Establishment Not able to generate AC";
    asErrors["6536"] = "Secure Channel Establishment Not able to generate AC";
    asErrors["6537"] = "Secure Channel Establishment Not able to generate AC";
    asErrors["6538"] = "Secure Channel Establishment Not able to generate AC";
    asErrors["6539"] = "Secure Channel Establishment Not able to generate AC";
    asErrors["653A"] = "Secure Channel Establishment Not able to generate AC";
    asErrors["653B"] = "Secure Channel Establishment Not able to generate AC";
    asErrors["653C"] = "Secure Channel Establishment Not able to generate AC";
    asErrors["653D"] = "Secure Channel Establishment Not able to generate AC";
    asErrors["653E"] = "Secure Channel Establishment Not able to generate AC";
    asErrors["653F"] = "Secure Channel Establishment Not able to generate AC";
    asErrors["6541"] = "Secure Channel Card Error (Communication Error, No Card response)";
    asErrors["6550"] = "If Off-line PIN is supported, no PIN entered or card holder pressed cancel";
    asErrors["6551"] = "No PIN entered (time-out) or card holder pressed cancel";
    asErrors["6552"] = "Time-out no card inserted or card holder pressed cancel";
    asErrors["6553"] = "No card holder approval or card holder pressed cancel";
    asErrors["6554"] = "No card available (Wait Card Indicator)";
    asErrors["6555"] = "Operation aborted by Card Removal";
    asErrors["6560"] = "Secure Channel User Input Timer";
    asErrors["6610"] = "Secure Channel CTRU Exceeded (SW_CTRU_Exceeded)";
    asErrors["6611"] = "Secure Channel CTRE Exceeded (SW_CTRE_Exceeded)";
    asErrors["6612"] = "Secure Channel Time-out";
    asErrors["6613"] = "Secure Channel MAC Generation Error";
    asErrors["6614"] = "Secure Channel Problem with Encryption";
    asErrors["6615"] = "Secure Channel Problem with Decryption (SW_DEC_Error)";
    asErrors["6620"] = "Secure Channel MAC Validation Error (SW_MAC_Error)";
    asErrors["6621"] = "Secure Channel MAC Validation Error (SW_MAC_Error)";
    asErrors["6622"] = "Secure Channel MAC Validation Error (SW_MAC_Error)";
    asErrors["6623"] = "Secure Channel MAC Validation Error (SW_MAC_Error)";
    asErrors["6624"] = "Secure Channel MAC Validation Error (SW_MAC_Error)";
    asErrors["6625"] = "Secure Channel MAC Validation Error (SW_MAC_Error)";
    asErrors["6626"] = "Secure Channel MAC Validation Error (SW_MAC_Error)";
    asErrors["6627"] = "Secure Channel MAC Validation Error (SW_MAC_Error)";
    asErrors["6628"] = "Secure Channel MAC Validation Error (SW_MAC_Error)";
    asErrors["6629"] = "Secure Channel MAC Validation Error (SW_MAC_Error)";
    asErrors["662A"] = "Secure Channel MAC Validation Error (SW_MAC_Error)";
    asErrors["662B"] = "Secure Channel MAC Validation Error (SW_MAC_Error)";
    asErrors["662C"] = "Secure Channel MAC Validation Error (SW_MAC_Error)";
    asErrors["662D"] = "Secure Channel MAC Validation Error (SW_MAC_Error)";
    asErrors["662E"] = "Secure Channel MAC Validation Error (SW_MAC_Error)";
    asErrors["662F"] = "Secure Channel MAC Validation Error (SW_MAC_Error)";
    asErrors["6700"] = "Corrupt input data (incorrect length)";
    asErrors["6710"] = "Secure Channel required/requested but not specified in CLA";
    asErrors["6711"] = "Secure Channel required/requested but not enabled";
    asErrors["6712"] = "Secure Channel Encryption required but not enabled";
    asErrors["6713"] = "Secure Channel already enabled";
    asErrors["6720"] = "Invalid Passcode Configuration";
    asErrors["6721"] = "Secure Channel Option (or optional feature) not supported";
    asErrors["6722"] = "Secure Channel Character Set not supported";
    asErrors["6723"] = "Secure Channel Issuer Text size error";
    asErrors["6724"] = "Secure Channel Invalid Frame Information";
    asErrors["69F0"] = "Command not allowed PIN entry cancelled (Command Filtering)";
    asErrors["69F1"] = "The card holder switched off or disconnected the PCR";
    asErrors["6987"] = "Missing data element (Mandatory)";
    asErrors["6988"] = "Missing data element (Optional IAF Amount, currency)";
    asErrors["69F2"] = "Transaction operation stopped by device (Missing mandatory card data)";
    asErrors["69F3"] = "Transaction operation stopped by device (Duplicate data elements)";
    asErrors["69F4"] = "Transaction operation stopped by device (Pb with display of TDS)";
    asErrors["69F5"] = "No (EMV) Chip Card inserted in PCR, but card presence required";
    asErrors["6982"] = "Command not allowed Security status not satisfied";
    asErrors["6983"] = "PIN Blocked";
    asErrors["6984"] = "PIN Blocked";
    asErrors["6A81"] = "The card does not support SELECT by Name";
    asErrors["6A82"] = "No Card holder Authentication application from the PCR Application Selection List is present on the card";
    asErrors["6A83"] = "Record not found";
    asErrors["6A86"] = "Invalid P1 or P2 value";
    asErrors["6B80"] = "Invalid P1 or P2 value";
    asErrors["6B00"] = "Invalid P1 or P2 value";
    asErrors["6D00"] = "Bad INS";
    asErrors["6E00"] = "Bad CLA";
    asErrors["6F00"] = "Undetermined error. Unexpected card response or data";
    asErrors["9804"] = "Invalid PIN on non-EMV card";

    // Defines the error codes & strngs for PCSC issues
    pcsc_errors["80100001"] = "An internal consistency check failed.";
    pcsc_errors["80100002"] = "The action was cancelled by an SCardCancel request.";
    pcsc_errors["80100003"] = "The supplied handle was invalid.";
    pcsc_errors["80100004"] = "One or more of the supplied parameters could not be properly interpreted.";
    pcsc_errors["80100005"] = "Registry startup information is missing or invalid.";
    pcsc_errors["80100006"] = "Not enough memory available to complete this command.";
    pcsc_errors["80100007"] = "An internal consistency timer has expired.";
    pcsc_errors["80100008"] = "The data buffer to receive returned data is too small for the returned data.";
    pcsc_errors["80100009"] = "The specified device name is not recognized.";
    pcsc_errors["8010000A"] = "The user-specified timeout value has expired.";
    pcsc_errors["8010000B"] = "The smart card cannot be accessed because of other connections outstanding.";
    pcsc_errors["8010000C"] = "The operation requires a Smart Card, but no Smart Card is currently in the device.";
    pcsc_errors["8010000D"] = "The specified smart card name is not recognized.";
    pcsc_errors["8010000E"] = "The system could not dispose of the media in the requested manner.";
    pcsc_errors["8010000F"] = "The requested protocols are incompatible with the protocol currently in use with the smart card.";
    pcsc_errors["80100010"] = "The device or smart card is not ready to accept commands.";
    pcsc_errors["80100011"] = "One or more of the supplied parameters values could not be properly interpreted.";
    pcsc_errors["80100012"] = "The action was cancelled by the system, presumably to log off or shut down.";
    pcsc_errors["80100013"] = "An internal communications error has been detected.";
    pcsc_errors["80100014"] = "An internal error has been detected, but the source is unknown.";
    pcsc_errors["80100015"] = "An ATR obtained from the registry is not a valid ATR string.";
    pcsc_errors["80100016"] = "An attempt was made to end a non-existent transaction.";
    pcsc_errors["80100017"] = "The specified device is not currently available for use.";
    pcsc_errors["80100018"] = "The operation has been aborted to allow the server application to exit.";
    pcsc_errors["80100019"] = "The PCI Receive buffer was too small.";
    pcsc_errors["8010001A"] = "The device driver does not meet minimal requirements for support.";
    pcsc_errors["8010001B"] = "The device driver did not produce a unique device name.";
    pcsc_errors["8010001C"] = "The smart card does not meet minimal requirements for support.";
    pcsc_errors["8010001D"] = "The Smart card resource manager is not running.";
    pcsc_errors["8010001E"] = "The Smart card resource manager has shut down.";
    pcsc_errors["8010001F"] = "An unexpected card error has occurred.";
    pcsc_errors["80100020"] = "No Primary Provider can be found for the smart card.";
    pcsc_errors["80100021"] = "The requested order of object creation is not supported.";
    pcsc_errors["80100022"] = "This smart card does not support the requested feature.";
    pcsc_errors["80100023"] = "The identified directory does not exist in the smart card.";
    pcsc_errors["80100024"] = "The identified file does not exist in the smart card.";
    pcsc_errors["80100025"] = "The supplied path does not represent a smart card directory.";
    pcsc_errors["80100026"] = "The supplied path does not represent a smart card file.";
    pcsc_errors["80100027"] = "Access is denied to this file.";
    pcsc_errors["80100028"] = "The smartcard does not have enough memory to store the information.";
    pcsc_errors["80100029"] = "There was an error trying to set the smart card file object pointer.";
    pcsc_errors["8010002A"] = "The supplied PIN is incorrect.";
    pcsc_errors["8010002B"] = "An unrecognized error code was returned from a layered component.";
    pcsc_errors["8010002C"] = "The requested certificate does not exist.";
    pcsc_errors["8010002D"] = "The requested certificate could not be obtained.";
    pcsc_errors["8010002E"] = "Cannot find a smart card device.";
    pcsc_errors["8010002F"] = "A communications error with the smart card has been detected.Retry the operation.";
    pcsc_errors["80100030"] = "The requested key container does not exist on the smart card.";
    pcsc_errors["80100031"] = "The Smart card resource manager is too busy to complete this operation.";
    pcsc_errors["80100065"] = "The device cannot communicate with the card, due to ATR string configuration conflicts.";
    pcsc_errors["80100066"] = "The smart card is not responding to a reset.";
    pcsc_errors["80100067"] = "Power has been removed from the smart card, so that further communication is not possible.";
    pcsc_errors["80100068"] = "The smart card has been reset, so any shared state information is invalid.";
    pcsc_errors["80100069"] = "The smart card has been removed, so further communication is not possible.";
    pcsc_errors["8010006A"] = "Access was denied because of a security violation.";
    pcsc_errors["8010006B"] = "The card cannot be accessed because the wrong PIN was presented.";
    pcsc_errors["8010006C"] = "The card cannot be accessed because the maximum number of PIN entry attempts has been reached.";
    pcsc_errors["8010006D"] = "The end of the smart card file has been reached.";
    pcsc_errors["8010006E"] = "The action was canceled by the user.";
    pcsc_errors["8010006F"] = "No PIN was presented to the Smart card.";



    /**
     * @public
     * @memberOf enex
     * @function getVersion
     * @desc Return the version of the EWC library
     * @returns {String} Version of the EWC library
     * @example var version = enex.getVersion();
     */
    function getVersion() {
        return "3.4.1";
    }
    ReturnedAPI.getVersion = getVersion;



    /**
     * @private
     */
    function getHexErrorCode(a_sErrorCode) {

        var errorCode = 0xFFFFFFFF + a_sErrorCode + 1,
            errorCodeString = "0x" + errorCode.toString(16).toUpperCase();

        LoggingService.debug("getHexErrorCode - (" + errorCode + ") - (" + errorCodeString + ")");

        return errorCode;
    }


    /**
     @private
     @desc This function closes the eNex modal box
     */
    function modalboxClose() {

        //LoggingService.debug("modalboxClose - (BEGIN)");

        if (g_CallbackDialogBox) {

            if ("function" === typeof (g_CallbackDialogBox)) {

                g_CallbackDialogBox().close();

            } else {

                g_CallbackDialogBox.close();
            }

            return;
        }

        var e = document.getElementById(ENEX_MODALBOX_IDENTIFIER);
        if (e) {
            document.body.removeChild(e);
        }

        //LoggingService.debug("modalboxClose - (END)");
    }



    /**
     @private
     @desc This function defines the CSS rules used in the EWC GUI elements
     */
    function setCSS() {
        var cssStyles = '.enexOverlay {  position: fixed; top: 0; left: 0; right: 0; bottom: 0; background:#333 none repeat scroll 0 0; opacity:0.7; -ms-filter:"progid:DXImageTransform.Microsoft.Alpha(Opacity=80)"; filter: alpha(opacity=80); }';

        cssStyles += '.enexModalBox { position: fixed; top: 0; left: 0; right: 0; bottom: 0; background:transparent; z-index:10000;-webkit-user-select: none; -khtml-user-select: none; -moz-user-select: none; -ms-user-select: none; user-select: none; outline: 1px solid #000; }';
        cssStyles += '.enexModalBox > div { opacity: 1; border: solid 8px #FFFFFF; width: 600px; position: relative; margin: 10% auto; text-align: center; padding: 30px; border-radius: 7px; box-shadow: 0 3px 20px rgba(0,0,0,0.9); background: #fff; background: -moz-linear-gradient(#fff, #ccc); background: -webkit-linear-gradient(#ffe, #ccc); background: -o-linear-gradient(#fff, #ccc); text-shadow: 0 1px 0 #fff; }';
        cssStyles += '.enexModalBox p { font-size: 20px; }';
        cssStyles += '.enexModalBox h2 { font-size: 26px; }';
        cssStyles += '.enexModalBox h2:hover { cursor: default; }';
        cssStyles += '.enexModalBox p:hover { cursor: default; }';

        // If the browser is IE8 or older then apply different styles
        if (document.all && (!document.documentMode || (document.documentMode && document.documentMode < 9))) {

            cssStyles += '.enexModalBox a { position: absolute; right: -5px; top: -5px; }';
            cssStyles += '.enexModalBox a { display: block; position: absolute; right: -10px; top: -10px; width: 1.5em; text-decoration: none; text-shadow: none; text-align: center; font-weight: bold; background-color: red; color: #fff; border: 1px solid #fff; }';
            cssStyles += '.enexModalBox a:focus, .enexModalBox a:hover { right: -14px; top: -14px; width: 2.0em; }';

        } else {

            cssStyles += '.enexModalBox a[href="#close"] { position: absolute; right: -5px; top: -5px; color: transparent; }';
            cssStyles += '.enexModalBox a[href="#close"]:focus { outline: none; }';
            cssStyles += '.enexModalBox a[href="#close"]:after { content: "X"; display: block; position: absolute; right: -10px; top: -10px; width: 1.5em; padding: 1px 1px 1px 2px; text-decoration: none; text-shadow: none; text-align: center; font-weight: bold; background: red; color: #fff; border: 3px solid #fff; border-radius: 20px; box-shadow: 0 1px 3px rgba(0,0,0,0.5); }';
            cssStyles += '.enexModalBox a[href="#close"]:focus:after, .enexModalBox a[href="#close"]:hover:after { -webkit-transform: scale(1.2,1.2); -moz-transform: scale(1.2,1.2); -ms-transform: scale(1.2,1.2); filter: progid:DXImageTransform.Microsoft.Matrix(sizingMethod="auto expand", M11=1.5320888862379554, M12=-1.2855752193730787, M21=1.2855752193730796, M22=1.5320888862379558); }';
        }

        SConnect._createStyleSheet(cssStyles);
    }



    /**
     @private
     @desc This function opens the EWC modal box
     */
    function modalboxOpen(a_Message) {

        var d, reverse, sBox;

        modalboxClose();

        //LoggingService.debug("modalboxOpen - (BEGIN)");
        //LoggingService.debug("modalboxOpen - a_Message (" + a_Message + ")");

        if (g_CallbackDialogBox) {

            if ("function" === typeof (g_CallbackDialogBox)) {

                g_CallbackDialogBox().open(a_Message);

            } else {

                g_CallbackDialogBox.open(a_Message);
            }
            return;
        }

        if (false === g_bEnableGUI) {

            //LoggingService.debug("modalboxOpen - GUI not enabled !");
            return;
        }

        setCSS();

        // Create the dialog
        d = document.createElement("div");
        d.id = ENEX_MODALBOX_IDENTIFIER;

        // Choose to display text from left to right or the contrary
        reverse = (SConnect._localize() === 'ar');
        d.dir = (reverse ? "rtl" : "ltr");

        sBox = '<div class="enexOverlay"></div>';
        sBox += '<div class="enexModalBox">';
        sBox += '<div>';
        sBox += '<p unselectable="unselectable">' + a_Message + '</p>';
        sBox += '<a href="#close" onclick="(function (){ document.body.removeChild(document.getElementById(\'' + ENEX_MODALBOX_IDENTIFIER + '\')); })();">';
        // For browser IE8 and lower add a 'X' character to close the message box
        sBox += ((document.all && (!document.documentMode || (document.documentMode && document.documentMode < 9))) ? 'x' : '');
        sBox += '</a>';
        sBox += '</div>';
        sBox += '</div>';

        d.innerHTML = sBox;

        // Add the new dialog box to the html page
        document.body.appendChild(d);

        //LoggingService.debug("modalboxOpen - (END)");
    }



    /**
     * @private
     */
    function isError(a_sStatusWord) {

        var e = asErrors[a_sStatusWord];

        LoggingService.debug("isError - Status Word (" + a_sStatusWord + ") - Description (" + e + ")");

        return e;
    }



    /**
     * @private
     */
    function languageFindString(key) {

        var lang, b, i, j, arr, s;

        if (navigator.language) {
            lang = navigator.language.substring(0, 2);
        } else {
            lang = navigator.browserLanguage.substring(0, 2);
        }

        if (!key) {

            return lang;
        }

        b = 0;
        i = -1;
        for (j = 0; j < g_languageSupport.length; j += 1) {

            if (g_languageSupport[j] === languageDefault) {

                b = j;
            }

            if (g_languageSupport[j] === lang) {

                i = j;
                break;
            }
        }

        if (i === -1) {

            i = b;
        }

        arr = [];
        if (g_languageStrings[key]) {

            return g_languageStrings[key][i];

        } else {

            for (s in g_languageStrings) {

                if (g_languageStrings.hasOwnProperty(s)) {
                    if (s.indexOf(key) !== -1) {

                        arr.push(g_languageStrings[s][i]);
                    }
                }
            }

            return (arr.length === 1 ? arr.toString() : arr);
        }
    }


    /**
     * @private
     */
    function throwException(a_sErrorMessage, a_ErrorCode) {

        var msg = "EnexException";

        if (a_sErrorMessage) {
            msg += " - ";
            msg += a_sErrorMessage;
        }

        if (a_ErrorCode) {
            msg += " - ";
            msg += a_ErrorCode;
        }
        LoggingService.error(msg);

        throw {
            name: "EnexException",
            message: a_sErrorMessage,
            errorCode: a_ErrorCode
        };
    }


    /**
     * @private
     * @memberOf Connection
     * @function checkCallback
     * @desc Check the incoming callback object exists and that the "success" and "failure" properties are declared
     * @param {Object} Callback Object containing the "success" function returning the result and "failure" function returning the error if the function fails.
     * @throws {EnexException} Thrown when the callback object is invalid
     */
    function checkCallback(a_oCallback) {

        if ((null === a_oCallback) || (undefined === a_oCallback) || (undefined === a_oCallback.success) || (undefined === a_oCallback.failure)) {

            throwException(languageFindString("InvalidArguments"));
        }
    }


    /**
     * @private
     * @function callFailure
     * @desc This function calls the "failure" function of the callback
     * @param a_oResultCallback {Object} callback object containing the "failure" function to call
     * @param a_oArguments Arguments to pass to the "failure" function
     */
    function callFailure(a_oResultCallback, a_oArguments) {

        if (a_oResultCallback) {

            if (typeof (a_oResultCallback) === "function") {

                if (a_oResultCallback().failure !== undefined) {
                    a_oResultCallback().failure(a_oArguments);
                }

            } else {

                if (a_oResultCallback.failure !== undefined) {
                    a_oResultCallback.failure(a_oArguments);
                }
            }
        }
    }


    /**
     * @private
     * @function callSuccess
     * @desc This function calls the "success" function of the callback
     * @param a_oResultCallback {Object} callback object containing the "success" function to call
     * @param a_oArguments Arguments to pass to the "success" function
     */
    function callSuccess(a_oResultCallback, a_oArguments) {

        if (a_oResultCallback) {

            if (typeof (a_oResultCallback) === "function") {

                a_oResultCallback().success(a_oArguments);

            } else {

                a_oResultCallback.success(a_oArguments);
            }
        }
    }


    function createErrorObject(a_ErrorCode, a_sMessage) {

        LoggingService.debug("createErrorObject - (BEGIN)");

        var e = {};

        e.message = ((a_sMessage !== undefined) ? a_sMessage : (checkApduResponse(null, null, a_ErrorCode) || ""));

        e.errorCode = a_ErrorCode || -1;

        LoggingService.debug("createErrorObject - (END)");

        return e;
    }




    function manageError(a_ErrorCode, a_sMessage) {
        LoggingService.debug("manageError - (BEGIN)");
        LoggingService.debug("manageError - a_ErrorCode (" + a_ErrorCode + ")");

        modalboxClose();

        if (a_ErrorCode === "6983") {

            modalboxOpen(languageFindString("MoveCard"));

        } else if (a_ErrorCode === "6982") {

            modalboxOpen(languageFindString("MoveCard"));

        }
        /*else if ((a_ErrorCode === "6550") || (a_ErrorCode === "6553") || (a_ErrorCode === "69F0")) {

               }*/

        // Create the object to send back to report the error
        LoggingService.debug("manageError - (END)");
        return createErrorObject(a_ErrorCode, a_sMessage);
    }



    /**
     * @public
     * @memberOf enex
     * @function isSmartcardServiceAvailable
     * @desc This function checks if the smart card service is running on the computer
     * @returns {Boolean} True if the service is running otherwise false
     * @example
     <pre>
     var callback = {

                success : function () {

                    alert("the smart card service is running");
                },
                error : function (code) {

                    alert("the smart card service IS NOT RUNNING");
                }
            };
      enex.isSmartcardServiceAvailable(callback);
     </pre>
     */
    function isSmartcardServiceAvailable(a_oCallback) {

        checkCallback(a_oCallback);

        g_callbackForResult = a_oCallback;

        var createCallback = {

            success: function ( /*pcsc*/ ) {

                callSuccess(g_callbackForResult, true);
            },
            error: function (code) {

                callFailure(g_callbackForResult, manageError(code, "PCSC error"));
            }
        };

        SConnect.PCSC.Create(createCallback);
    }
    ReturnedAPI.isSmartcardServiceAvailable = isSmartcardServiceAvailable;



    /**
     * @private
     * @memberOf Connection
     * @desc This function checks the response coming from the PCR.
     * @returns {boolean} true if an error is reported in the response. Otherwise false.
     */
    function checkApduResponse(aStatusWord, aDataOut, a_ErrorCode) {

        LoggingService.debug("checkApduResponse - (BEGIN)");
        LoggingService.debug("checkApduResponse - StatusWord (" + aStatusWord + ")");
        LoggingService.debug("checkApduResponse - DataOut (" + aDataOut + ")");
        LoggingService.debug("checkApduResponse - ErrorCode (" + a_ErrorCode + ")");

        var ret = null,
            errorCode, message;

        // An error is reported
        if (a_ErrorCode) {

            // Check if the error is coming from the smart card
            ret = isError(a_ErrorCode);

            if (!ret) {

                // Is it a PCSC exception ?
                errorCode = a_ErrorCode.toString(16).toUpperCase();

                message = (pcsc_errors[errorCode] + " (0x" + errorCode + ")") || "Unknown PCSC error";

                //var errorCodeInt = parseInt("0x" + errorCode);

                LoggingService.error("getErrorPCSC - code (" + errorCode + ") - message (" + message + ")");


                if (isSmartcardServiceAvailable() === false) {

                    message = languageFindString("SmartcardServiceNotRunning");
                    modalboxOpen(message);
                }

                // Report the error
                ret = message;
            }
        } else {

            if (aStatusWord === "9000") {

                // An error can be reported at return of the "GetResponse" command
                // In this case the status word is "9000" but the buffer is a 2 bytes error code
                if ((aDataOut !== null) && (aDataOut !== undefined)) {

                    if (aDataOut.length === 4) {

                        ret = isError(aDataOut);
                    }
                }
            } else {

                // An error is reported in the status word
                ret = isError(aStatusWord);
            }
        }

        LoggingService.debug("checkApduResponse - return (" + ret + ")");
        LoggingService.debug("checkApduResponse - (END)");

        return ret;
    }



    /**
     * @public
     * @memberOf enex
     * @function getSConnectVersion
     * @desc Return the version of the SConnect library
     * @param {Object} Object containing two functions "success" and "failure" as properties.<br>
        When the function succeeds, the "success" function is invoked and the SConnect version is returned as the first parameter.<br>
        When the function fails, the "failure" function is invoked and an object with two properties "errorCode" and "message" describing the issue is returned as first parameter.
    * @example
    <pre>
    var callbackSConnectVersion = {

	success:function (version) {

            alert("The SConnect version is " + version);
	},

	failure:function (error) {

            alert("An error occurred (" + error.errorCode + ") (" + error.message + ")";
	}					
    };

    enex.getSConnectVersion(callbackSConnectVersion);
</pre>
     */
    function getSConnectVersion(a_oCallback) {

        checkCallback(a_oCallback);

        g_callbackForResult = a_oCallback;

        var callback = {

            success: function (version) {
                callSuccess(g_callbackForResult, version.toString(16));
            },

            error: function (errorcode) {
                callFailure(g_callbackForResult, manageError(errorcode, "Cannot retrieve the SConnect version. Check your installation"));
            }
        };

        SConnect.GetVersion(callback);
    }
    ReturnedAPI.getSConnectVersion = getSConnectVersion;


    function getErrorPCSC(a_ErrorCode) {

        // Is it a PCSC exception ?
        var errorCode = a_ErrorCode.toString(16).toUpperCase(),
            errorCodeString = (pcsc_errors[errorCode] + " (0x" + errorCode + ")") || "Unknown PCSC error";

        //var errorCodeInt = parseInt("0x" + errorCode);

        LoggingService.error("getErrorPCSC - code (" + errorCode + ") - message (" + errorCodeString + ")");

        return createErrorObject(errorCode, errorCodeString);
    }


    ////////////////////////////////////
    // Connection object
    ////////////////////////////////////


    /**
     * @public
     * @namespace
     * @class Connection
     * @desc Object exposing the functions to communicate with the PCR and the smart card (CAP, Secure Channel, PPDU, ...).
     * <br>This object is automatically created when a valid smart card is inserted in the device. The instance is
     * reachable through the connection callback provided in the "init" function or directly by the "getConnection" function.
     * @param {String} ReaderName Reader name to connect to
     * @param {String} ATR Smart card ATR to connect to
     */
    function Connection(aReaderName, a_ATR) {

        ////////////////////////////////////
        // CONSTANTS
        ////////////////////////////////////
        var DATA_UNPREDICTABLE_NUMBER_TAG = "9F37",
            DATA_UNPREDICTABLE_NUMBER_LEN = 8,
            DATA_SECURE_CHANNEL_CONFIGURATION_TAG = "DF72",
            DATA_APPLICATION_SELECTION_LIST_TAG = "E7",
            CLA_MAC_SECURITY_NOT_ENABLED = "80",
            CLA_MAC_SECURITY_ENABLED = "84",
            INS = "12",
            P1_SECURE_CHANNEL_ESTABLISHMENT = "10",
            P1_SECURE_CHANNEL_TERMINATION = "11",
            SecureChannel_isEstablished = false,
            SecureChannel_EncryptionIndicator = null,
            SecureChannel_TerminateSecureChannelIndicator = null,
            SecureChannel_WaitCardIndicator = null,
            callbackFinal = null,
            /**
             * @private
             * @memberOf Connection
             * @property thatInstance
             * @desc Current active connection instance. Used when "this" is the in global scope.
             *
             */
            thatInstance = this,
            statusWord = null,
            gDataOut = null,
            gFinalCallback = null,
            PPDU_CLA = "FF",
            PPDU_INS = "C2",
            PPDU_P1 = "01",
            MAX_SIGN_BUFFER_BYTE_SIZE = 255;



        /**
         * @private
         * @memberOf Connection
         * @property readerName
         * @desc Current reader name connected to
         */
        this.readerName = aReaderName;


        /**
         * @private
         * @memberOf Connection
         * @property _bIsGemaltoDriverInstalled
         * @desc Flag used to store the driver state. True if the Gemalto driver is installed otherwise false.
         */
        // this._bIsGemaltoDriverInstalled = null;


        /**
         * @private
         * @memberOf Connection
         * @property atr
         * @desc Current smart card Answer To Reset (ATR) connected to
         */
        this.atr = a_ATR;


        /**
         * @private
         * @memberOf Connection
         * @property personalCardReaderInformation
         * @desc Personal Card Reader Information block. Used to read only once the PCR Information
         */
        this.personalCardReaderInformation = null;


        /**
         * @private
         * @property pan
         * @desc Primary Account Number (PAN) read from the smart card. Used to read only once the PAN.
         */
        this.pan = null;


        /**
         * @private
         * @property psn
         * @desc PSN read from the smart card. Used to read only once the PSN.
         */
        this.psn = null;


        /**
         * @private
         * @property expirationDate
         * @desc Expiration date read from the smart card. Used to read only once the date.
         */
        this.expirationDate = null;


        /**
         * @private
         * @property transactionHandle
         * @desc Used to track the number of active PCSC transactions.
         */
        this.transactionHandle = 0;


        /**
         * @private
         * @property transactionHandle
         * @desc PLA specification version supported by the PCR.
         */
        //this._VersionSpecificationPLA = null;

        this.connection = null;


        this.create = function (a_oCallback) {

            callbackFinal = a_oCallback;

            // Manage the connection to the smart card
            var connectCallback = {

                    success: function () {

                        // The connection creation process is terminated
                        // Call the final callback to warm the web application
                        // that the connection is available
                        callSuccess(callbackFinal, g_CurrentConnection);

                        /*if (g_CallbackHardwareEventNotification) {

                                g_CallbackHardwareEventNotification("CARD_IN", thatInstance.readerName, thatInstance.atr);
                            }*/

                        if (g_CallbackConnection) {

                            g_CallbackConnection(g_CurrentConnection);
                        }
                    },

                    error: function (a_Error) {
                        thatInstance.connection.dispose();
                        thatInstance.connection = null;
                        callFailure(callbackFinal, getErrorPCSC(a_Error));
                    }
                },

                // Manage the connection to PCSC
                createCallback = {

                    success: function (a_pcsc) {

                        // The PCSC layer is now initialized
                        thatInstance.connection = a_pcsc;

                        // Create the connection to the smart card
                        thatInstance.connection.connect(thatInstance.readerName, connectCallback);
                    },

                    error: function (a_Error) {

                        callFailure(callbackFinal, getErrorPCSC(a_Error));

                    }
                };

            // Create a connection to PCSC
            SConnect.PCSC.Create(createCallback);
        };

        /**
         * @private
         * @memberOf Connection
         * @method getApduResponse
         */
        function getApduResponse(a_StatusWord, aDataOut, a_oResultCallback, a_Buffer) {

            return {

                success: function (result) {

                    var aStatusWord = result.statusWord,
                        aDataOut = result.dataOut,
                        sw1 = aStatusWord.substr(0, 2),
                        getResponseAPDU = "00",
                        sw2 = aStatusWord.substr(2, 2);


                    a_Buffer += aDataOut;

                    // get response command to manage
                    if ((sw1 === "61") && (sw1 === "62")) {

                        // Build a getResponse APDU using the same CLA byte as the initial APDU.
                        // From firmware version 6.04 only class 00 is allowed to get the response
                        //getResponseAPDU = a_aArguments["sentBuffer"].substr(0, 2);
                        //var getResponseAPDU = "00";
                        getResponseAPDU += "C00000";
                        //var sw2 = aStatusWord.substr(2, 2);
                        getResponseAPDU += sw2;

                        thatInstance.connection.transmit(getResponseAPDU, getApduResponse(aStatusWord, aDataOut, a_oResultCallback, a_Buffer));

                        LoggingService.debug("getApduResponse - exchangeResponse.statusWord (" + aStatusWord + ")");
                        LoggingService.debug("getApduResponse - exchangeResponse.dataOut (" + aDataOut + ")");
                        LoggingService.debug("getApduResponse - (END)");

                    } else {

                        a_oResultCallback.success(aStatusWord, a_Buffer);
                    }
                },
                error: function (a_ErrorCode) {

                    if (a_oResultCallback.failure !== undefined) {

                        callFailure(a_oResultCallback, getErrorPCSC(a_ErrorCode));

                    } else if (a_oResultCallback.error !== undefined) {

                        a_oResultCallback.error(a_ErrorCode);
                    }
                }
            };
        }


        /**
         * @private
         * @memberOf Connection
         * @function beginTransaction
         * @desc Open a PCSC transaction
         */
        function beginTransaction(a_Callback) {

            LoggingService.debug("beginTransaction - (BEGIN)");

            if (thatInstance && thatInstance.connection) {

                var transactionBeginCallback = function (callback) {

                    return {

                        success: function (transactionNumber) {

                            thatInstance.transactionHandle = transactionNumber;
                            LoggingService.debug("beginTransaction successful (" + transactionNumber + ")");
                            LoggingService.debug("beginTransaction - (END)");
                            callSuccess(callback);
                        },

                        error: function (errorcode) {
                            LoggingService.error("beginTransaction failed");
                            LoggingService.debug("beginTransaction - (END)");
                            callFailure(callback, getErrorPCSC(errorcode));
                        }
                    };
                };

                thatInstance.connection.beginTransaction(transactionBeginCallback(a_Callback));
            }
        }


        /**
         * @private
         * @memberOf Connection
         * @function endTransaction
         * @desc Close the pending PCSC transaction
         */
        function endTransaction(callback) {

            LoggingService.debug("endTransaction - (BEGIN)");

            if (thatInstance && thatInstance.connection) {

                try {

                    var transactionEndCallback = function (func) {

                        return {

                            success: function (transactionNumber) {

                                thatInstance.transactionHandle = transactionNumber;
                                LoggingService.debug("endTransaction successful (" + transactionNumber + ")");
                                LoggingService.debug("endTransaction - (END)");
                                if (func !== undefined) {
                                    func.success();
                                }
                            },

                            error: function (errorcode) {

                                LoggingService.error("endTransaction failed (" + errorcode + ")");
                                LoggingService.debug("endTransaction - (END)");
                                if (func !== undefined) {
                                    func.error(errorcode);
                                }
                            }
                        };
                    };

                    thatInstance.connection.endTransaction(transactionEndCallback(callback));

                } catch (e) {}
            }
        }


        /**
         * @private
         * @memberOf Connection
         * @method apdu_callback_response
         * @desc This callback receives the response of an asynchronous APDU command
         */
        function apdu_callback_response(a_oResultCallback) {

            // Create a callback that calls the received callback
            return {

                success: function (aStatusWord, aDataOut) {

                    LoggingService.debug("apdu_callback_response.success - (BEGIN)");
                    LoggingService.debug("apdu_callback_response.success - status word (" + aStatusWord + ")");
                    LoggingService.debug("apdu_callback_response.success - data out (" + aDataOut + ")");

                    modalboxClose();

                    var sw1 = aStatusWord.substr(0, 2),
                        buffer = "",
                        getResponseAPDU = "00",
                        sw2 = aStatusWord.substr(2, 2),
                        endTransactionCallback;

                    try {


                        // get response command to manage
                        if ((sw1 === "61") || (sw1 === "62")) {

                            // Build a getResponse APDU using the same CLA byte as the initial APDU.
                            // From firmware version 6.04 only class 00 is allowed to get the response
                            //getResponseAPDU = a_aArguments["sentBuffer"].substr(0, 2);
                            //var getResponseAPDU = "00";
                            getResponseAPDU += "C00000";
                            //var sw2 = aStatusWord.substr(2, 2);
                            getResponseAPDU += sw2;

                            apdu_Transmit(getResponseAPDU, getApduResponse(aStatusWord, aDataOut, apdu_callback_response(a_oResultCallback), buffer));
                            return;
                        }

                    } catch (ex) {

                        endTransaction();
                        callFailure(a_oResultCallback, manageError(-1, ex.message || languageFindString("PcscError")));
                    }

                    statusWord = aStatusWord;
                    gDataOut = aDataOut;
                    gFinalCallback = a_oResultCallback;

                    endTransactionCallback = {

                        success: function () {

                            // Check the final result (with or without "getResponse" command(s) in between) of the initial command
                            var errorMessage = checkApduResponse(statusWord, gDataOut, null),
                                result = {};
                            if (errorMessage) {

                                LoggingService.error(errorMessage);
                                if (gFinalCallback.failure !== undefined) {
                                    gFinalCallback.failure(manageError(statusWord, errorMessage));
                                } else {
                                    gFinalCallback.error(statusWord, errorMessage);
                                }

                            } else {

                                result.statusWord = statusWord;
                                result.dataOut = gDataOut;
                                gFinalCallback.success(result);
                            }

                            LoggingService.debug("apdu_callback_response.success - (END)");
                        },

                        error: function (errorCode) {
                            if (gFinalCallback.failure !== undefined) {
                                gFinalCallback.failure(getErrorPCSC(errorCode));
                            } else {
                                gFinalCallback.error(errorCode);
                            }
                        }
                    };

                    endTransaction(endTransactionCallback);
                },

                error: function (a_ErrorCode) {

                    LoggingService.debug("apdu_callback_response.failure - (BEGIN)");
                    LoggingService.debug("apdu_callback_response.failure - errorCode (" + a_ErrorCode + ")");

                    var errorMessage = checkApduResponse(null, null, a_ErrorCode);
                    LoggingService.debug("apdu_callback_response.failure - errorMessage (" + errorMessage + ")");

                    modalboxClose();

                    endTransaction();

                    LoggingService.debug("apdu_callback_response.failure - (END)");

                    //callFailure(a_oResultCallback, manageError(a_ErrorCode, errorMessage));
                    callFailure(a_oResultCallback, getErrorPCSC(a_ErrorCode));
                }
            };
        }


        /**
         * @private
         * @memberOf Connection
         * @function apdu_Transmit
         * @desc Transmit an APDU asynchronously to PCSC
         * @param {String} sAPDU APDU to send asynchronously
         * @param {Object} oCallback Object containing the "success" and failure" functions to be called to return the result of the APDU command
         */
        function apdu_Transmit(a_sAPDU, a_oCallback) {

            try {

                var transactionCallback = function (finalCallback) {

                    return {

                        success: function () {

                            // Send asynchronously the APDU to PCSC
                            LoggingService.debug("apdu_Transmit (" + a_sAPDU + ")");
                            thatInstance.connection.transmit(a_sAPDU, apdu_callback_response(finalCallback));
                        },

                        failure: function (error) {
                            callFailure(finalCallback, error);
                        }
                    };
                };

                // Active the PCSC transaction
                beginTransaction(transactionCallback(a_oCallback));

            } catch (ex) {

                // End the transaction if the connection object is not
                // available or the transmit function returns directly an error
                endTransaction();

                modalboxClose();

                callFailure(a_oCallback, manageError(-1, ex.message || languageFindString("PcscError")));
            }
        }


        /**
         * @private
         * @memberOf Connection
         * @function apdu_control
         * @desc Transmit an APDU asynchronously to PCSC
         * @param {String} sAPDU APDU to send asynchronously
         * @param {Object} oCallback Object containing the "success" and failure" functions to be called to return the result of the APDU command
         */
        function apdu_control(a_oCallback, a_ControlCode, a_sTemplate, a_Raw, a_ExpectedLen) {

            var finalCallback = a_oCallback,
                finalData = null,
                finalError = null,
                endTransactionCallback,
                cardControlCallback,
                begintransactionCallback;

            try {

                endTransactionCallback = {

                    success: function () {

                        if (finalError) {

                            callFailure(finalCallback, manageError(finalError));

                        } else {

                            callSuccess(finalCallback, finalData);
                        }
                    },

                    error: function (code) {

                        callFailure(finalCallback, manageError(finalError));
                    }
                };

                cardControlCallback = {

                    success: function (aDataOut) {
                        LoggingService.debug("apdu_control - dataOut (" + aDataOut + ")");
                        finalError = null;
                        finalData = aDataOut;
                        thatInstance.connection.endTransaction(endTransactionCallback);
                    },

                    error: function (code) {
                        LoggingService.error("apdu_control - code (" + code + ")");
                        finalError = code;
                        thatInstance.connection.endTransaction(endTransactionCallback);
                    }
                };

                begintransactionCallback = function (a_ControlCode, a_sTemplate, a_Raw, a_ExpectedLen) {

                    return {

                        success: function () {

                            var r = true,
                                c = a_ControlCode;

                            if (a_Raw !== undefined) {
                                r = a_Raw;
                            }

                            if (typeof (a_ControlCode) === "string") {
                                c = parseInt(a_ControlCode, 16);
                            }

                            LoggingService.debug("apdu_control - controlCode (" + c + ")");
                            LoggingService.debug("apdu_control - template (" + a_sTemplate + ")");
                            LoggingService.debug("apdu_control - raw (" + r + ")");
                            LoggingService.debug("apdu_control - expectedLen (" + a_ExpectedLen + ")");

                            thatInstance.connection.cardControl(c, a_sTemplate, r, cardControlCallback, a_ExpectedLen);
                        },

                        failure: function (code) {
                            callFailure(finalCallback, code);
                        }
                    };
                };

                // Active the PCSC transaction
                beginTransaction(begintransactionCallback(a_ControlCode, a_sTemplate, a_Raw, a_ExpectedLen));

            } catch (ex) {

                // End the transaction if the connection object is not available or the transmit function returns directly an error
                endTransaction();

                modalboxClose();
                callFailure(a_oCallback, manageError(-1, ex.message || languageFindString("PcscError")));
            }
        }

        /**
         * @public
         * @memberOf Connection
         * @function sendAPDUAsynchronous
         * @desc Transmit an APDU asynchronously to PCSC
         * @param {String} sAPDU APDU to send asynchronously
         * @param {Object} oCallback Object containing the "success" and failure" functions to be called to return the result of the APDU command.
         * The "success" function provide an object as argument to report the status word in the property "statusWord" and the response in the property "dataOut".
         * @example: 
            <pre>
 var cnx = enex.getConnection();

  if((null == cnx) || (typeof (cnx) == "undefined")) {

    alert("no available connection to the smart card");

    return;
  }

  // Create a callback to treat the return of the get PAN asynchronous function
  var resultCallback = {

    success : function (a_oArgs) {
      alert("status word (" + a_oArgs.statusWord + ") - data (" + a_oArgs.dataOut + ")");
    },

    failure : function (a_oError) {
        var message = "Operation FAILED.";
        message += " Error (" + a_oError.errorCode + ").";
        message += " Message (" + a_oError.message + ")";
        alert(message);
    }

  };

  // Send a CAP mode 2 command (no encryption/MAC in this case)
 cnx.sendAPDUAsynchronous("8012030100", resultCallback);
            </pre>
         }
         */
        this.sendAPDUAsynchronous = function (a_sAPDU, a_oCallback) {

            checkCallback(a_oCallback);

            if ((null === a_sAPDU) || (undefined === a_sAPDU)) {

                throwException(languageFindString("InvalidArguments"));
            }

            apdu_Transmit(a_sAPDU, a_oCallback);
        };
        ReturnedAPI.sendAPDUAsynchronous = this.sendAPDUAsynchronous;


        ////////////////////////////////////
        // PCR INFORMATION
        ////////////////////////////////////

        function toString(buffer) {
            var ret = [];
            while (buffer.length >= 2) {

                ret.push(parseInt(buffer.substring(0, 2), 16));
                buffer = buffer.substring(2, buffer.length);
            }
            return String.fromCharCode.apply(String, ret);
        }

        function toInteger(buffer) {
            var ret = [];
            while (buffer.length >= 2) {

                ret.push(parseInt(buffer.substring(0, 2), 16));
                buffer = buffer.substring(2, buffer.length);
            }
            return ret;
        }


        function toHex(str) {
            var hex = '',
                i = 0;
            for (i = 0; i < str.length; i = i + 1) {
                if (str.charCodeAt(i).toString(16).length < 2) {
                    hex += '0';
                }
                hex += str.charCodeAt(i).toString(16);
            }
            return hex;
        }


        /**
         * Convert byte array to a hex string
         * e.g var array = [1,2,3] will be converted to "010203"
         * @memberOf SConnect.TypeUtils
         * @param {Array} byteArray An array of bytes
         * @return {String} Hex string representation
         */
        function byteArrayToHexString(byteArray) {
            var str = '',
                i = 0,
                tmpStr;

            for (i = 0; i < byteArray.length; i = i + 1) {
                tmpStr = byteArray[i].toString(16);
                if (tmpStr.length < 2) {
                    str += "0";
                }
                str += tmpStr;
            }
            return str;
        }


        /**
         * Convert a hex string to byte array. For eg
         * var str = "010203" will be converted to [1,2,3]
         * @memberOf SConnect.TypeUtils
         * @param {String} str2 A Hex String.
         * @return {Array} A byte array
         */
        function hexStringToByteArray(str) {
            var array = [],
                i = 0;

            for (i = 0; i < str.length / 2; i = i + 1) {
                array[i] = parseInt(str.substring(i * 2, i * 2 + 2), 16);
            }
            return array;
        }


        /** @private */
        function ascii_bytes(data, min_length) {
            var l = [],
                i,
                bytes;

            for (i = 0; i < data.length; i = i + 1) {

                l.push(data.charCodeAt(i)); // 48 is the ASCII value for "0"
            }

            bytes = byteArrayToHexString(l);

            if (min_length) {
                while (bytes.length < min_length * 2) {
                    bytes = "30" + bytes;
                }
            }
            return bytes;
        }


        /**
         * @private
         * @desc Build a Tag Length Value (TLV) buffer
         * @param {String} Tag to include in the TLV
         * @param {String} Value to include the TLV
         * @returns {String} Resulting TLV buffer
         */
        function tlv(tag, value) {
            if (!value) {
                value = "";
            }
            var len_str = byteArrayToHexString([value.length / 2]);
            return tag + len_str.toUpperCase() + value;
        }


        /** @private */
        function tlv_decode(tlv_data) {
            var ret = {},
                /** @ignore */
                toUpperHex = function (a) {
                    return byteArrayToHexString(a).toUpperCase();
                },
                data = hexStringToByteArray(tlv_data),
                i = 0,
                tag,
                len,
                len_size,
                len_bytes,
                j = 0,
                value,
                tag_hex,
                value_hex;

            while (i < data.length) {
                tag = [data[i]];
                if ((tag[0] & 0x1F) === 0x1F) {
                    i = i + 1;
                    tag[tag.length] = data[i];
                    while (tag[tag.length - 1] & 0x80) {
                        i = i + 1;
                        tag[tag.length] = data[i];
                    }
                }

                i = i + 1;
                len = data[i];
                i = i + 1;
                if (len & 0x80) {
                    len_size = len & 0x7F;
                    len_bytes = data.slice(i, i + len_size);
                    i += len_bytes.length;
                    len = 0;
                    for (j = 0; j < len_bytes.length; j = j + 1) {
                        len += len_bytes[j] << 8 * (len_bytes.length - 1 - j);
                    }
                }
                value = data.slice(i, i + len);
                i += len;
                tag_hex = toUpperHex(tag);
                value_hex = toUpperHex(value);
                ret[tag_hex] = value_hex;
            }
            return ret;
        }

        /**
         * @public
         * @memberOf Connection
         * @function _get_device_info
         * @desc Retrieve the PCR characteristics using a private Gemalto command<br>
         * <b>The function is deprecated. Use instead the "getPCRInformation" function.</b>
         * @param {Object} oCallback Object containing the "success" and failure" functions.
         * The "success" function provides the response to the proprietary Gemalto "get device info" command.
         */
        this._get_device_info = function (a_oCallback) {

            LoggingService.debug("_get_device_info - (BEGIN)");

            var apdu = "D039000000",
                response = null,
                cb = {

                    success: function (result) {

                        endTransaction();

                        var aStatusWord = result.statusWord,
                            aDataOut = result.dataOut,
                            tags = tlv_decode(aDataOut),
                            sub_tags = null,
                            error,
                            oDeviceInfo,
                            c1,
                            c2,
                            c3,
                            c4,
                            c5,
                            c6;

                        if (tags.A1) {

                            sub_tags = tlv_decode(tags.A1);
                        }

                        error = checkApduResponse(aStatusWord, aDataOut);
                        if (error || !sub_tags) {

                            LoggingService.error("_get_device_info - No device info found");
                            LoggingService.debug("_get_device_info - (END)");

                            callFailure(a_oCallback, manageError(error));
                            return;
                        }

                        oDeviceInfo = {};

                        c1 = sub_tags.C1;
                        if (c1) {

                            oDeviceInfo.C1 = toString(c1);
                        }
                        c2 = sub_tags.C2;
                        if (c2) {

                            oDeviceInfo.C2 = parseInt(c2, 16);
                        }
                        c3 = sub_tags.C3;
                        if (c3) {

                            oDeviceInfo.C3 = parseInt(c3, 16);
                        }
                        c4 = sub_tags.C4;
                        if (c4) {

                            oDeviceInfo.C4 = toInteger(c4);
                        }
                        c5 = sub_tags.C5;
                        if (c5) {

                            oDeviceInfo.C5 = toString(c5);
                        }
                        c6 = sub_tags.C6;
                        if (c6) {

                            oDeviceInfo.C6 = toString(c6);
                        }

                        LoggingService.debug("_get_device_info - C1 (" + oDeviceInfo.C1 + ")");
                        LoggingService.debug("_get_device_info - C2 (" + oDeviceInfo.C2 + ")");
                        LoggingService.debug("_get_device_info - C3 (" + oDeviceInfo.C3 + ")");
                        LoggingService.debug("_get_device_info - C4 (" + oDeviceInfo.C4 + ")");
                        LoggingService.debug("_get_device_info - C5 (" + oDeviceInfo.C5 + ")");
                        LoggingService.debug("_get_device_info - C6 (" + oDeviceInfo.C6 + ")");

                        LoggingService.info("_get_device_info succeeded");
                        callSuccess(a_oCallback, aDataOut);
                    },

                    failure: function (a_ErrorCode) {

                        endTransaction();

                        callFailure(a_oCallback, a_ErrorCode);
                    }
                };

            try {

                apdu_Transmit(apdu, cb);

            } catch (ex) {

                endTransaction();
                callFailure(a_oCallback, manageError(-1, ex.message || languageFindString("PcscError")));
            }

            LoggingService.debug("_get_device_info - (END)");
        };


        /**
         * @private
         * @memberOf Connection
         * @function decodePersonalCardReaderInformation
         * @desc Parse the PCR Information block (to retrieve the screen sizes for example)
         * @param {String} sPersonalCardReaderInformation PCR Information
         */
        function decodePersonalCardReaderInformation(a_sPersonalCardReaderInformation) {

            // Retrieve the PCR information
            // Extract the TLV with tag D0
            var tagD0 = tlv_decode(a_sPersonalCardReaderInformation).D0,
                // Get the specification name from the the PCR information
                specificationNameHex = [],
                buffer = tagD0.substring(0, 14),
                pcr_adb_byte1,
                index,
                langLen,
                lang,
                algoLen,
                algo,
                displayLen,
                display,
                characterSetsLen,
                characterSets,
                keyPadLen,
                keyPad,
                versionControlLen,
                versionControl,
                PCR_Version_Control,
                PCR_Type,
                LOC_Identifier,
                Manufacturer_Name,
                PCR_Software_Version,
                Unique_PCR_Identifier,
                cardStatusInformationLen,
                cardStatusInformation,
                pcr_adb_byte2,
                secureChannelStatusInformationLen,
                secureChannelStatusInformation,
                batteryLen,
                battery;

            while (buffer.length >= 2) {

                specificationNameHex.push(parseInt(buffer.substring(0, 2), 16));
                buffer = buffer.substring(2, buffer.length);
            }
            //thatInstance._VersionSpecificationPLA = String.fromCharCode.apply(String, specificationNameHex);
            //LoggingService.debug("decodePersonalCardReaderInformation - specificationName (" + thatInstance._VersionSpecificationPLA + ")");

            // Get the PCR additional data bitmap
            pcr_adb_byte1 = parseInt(tagD0.substr(14, 2), 16);
            LoggingService.debug("decodePersonalCardReaderInformation - pcr_adb_byte1 (" + pcr_adb_byte1 + ")");

            index = 18;
            buffer = tagD0.substr(18, tagD0.length - 18);

            if ((pcr_adb_byte1 & 0x80) === 0x80) {
                langLen = 4;
                lang = tagD0.substr(index, langLen);
                index += langLen;
                LoggingService.debug("decodePersonalCardReaderInformation - lang (" + lang + ")");
            }

            if ((pcr_adb_byte1 & 0x40) === 0x40) {
                batteryLen = 2;
                battery = tagD0.substr(index, batteryLen);
                index += batteryLen;
                LoggingService.debug("decodePersonalCardReaderInformation - battery (" + battery + ")");
            }

            if ((pcr_adb_byte1 & 0x20) === 0x20) {
                algoLen = 2;
                algo = tagD0.substr(index, algoLen);
                index += algoLen;
                LoggingService.debug("decodePersonalCardReaderInformation - algo (" + algo + ")");
            }

            if ((pcr_adb_byte1 & 0x10) === 0x10) {
                displayLen = 4;
                display = tagD0.substr(index, displayLen);
                LoggingService.debug("decodePersonalCardReaderInformation - display (" + display + ")");
                index += displayLen;
            }

            if ((pcr_adb_byte1 & 0x08) === 0x08) {
                characterSetsLen = 2;
                characterSets = tagD0.substr(index, characterSetsLen);
                index += characterSetsLen;
                LoggingService.debug("decodePersonalCardReaderInformation - characterSets (" + characterSets + ")");
            }

            if ((pcr_adb_byte1 & 0x04) === 0x04) {
                keyPadLen = 4;
                keyPad = tagD0.substr(index, keyPadLen);
                index += keyPadLen;
                LoggingService.debug("decodePersonalCardReaderInformation - keyPad (" + keyPad + ")");
            }

            if ((pcr_adb_byte1 & 0x02) === 0x02) {
                versionControlLen = 88;
                versionControl = tagD0.substr(index, versionControlLen);
                index += versionControlLen;
                LoggingService.debug("decodePersonalCardReaderInformation - versionControl (" + versionControl + ")");

                PCR_Version_Control = versionControl.substr(0, 2);
                PCR_Type = versionControl.substr(2, 2);
                LOC_Identifier = versionControl.substr(4, 20);
                Manufacturer_Name = versionControl.substr(24, 30);
                PCR_Software_Version = versionControl.substr(54, 20);
                Unique_PCR_Identifier = versionControl.substr(64, 14);
                LoggingService.debug("decodePersonalCardReaderInformation - PCR_Version_Control (" + PCR_Version_Control + ")");
                LoggingService.debug("decodePersonalCardReaderInformation - PCR_Type (" + PCR_Type + ")");
                LoggingService.debug("decodePersonalCardReaderInformation - LOC_Identifier (" + LOC_Identifier + ")");
                LoggingService.debug("decodePersonalCardReaderInformation - Manufacturer_Name (" + Manufacturer_Name + ")");
                LoggingService.debug("decodePersonalCardReaderInformation - PCR_Software_Version (" + PCR_Software_Version + ")");
                LoggingService.debug("decodePersonalCardReaderInformation - Unique_PCR_Identifier (" + Unique_PCR_Identifier + ")");
            }

            if ((pcr_adb_byte1 & 0x01) === 0x01) {
                cardStatusInformationLen = 2;
                cardStatusInformation = tagD0.substr(index, cardStatusInformationLen);
                index += cardStatusInformationLen;
                LoggingService.debug("decodePersonalCardReaderInformation - cardStatusInformation (" + cardStatusInformation + ")");
            }

            pcr_adb_byte2 = tagD0.substr(16, 2);
            LoggingService.debug("decodePersonalCardReaderInformation - pcr_adb_byte2 (" + pcr_adb_byte2 + ")");

            if ("80" === pcr_adb_byte2) {
                secureChannelStatusInformationLen = 14;
                secureChannelStatusInformation = tagD0.substr(index, secureChannelStatusInformationLen);
                index += secureChannelStatusInformationLen;
                LoggingService.debug("decodePersonalCardReaderInformation - secureChannelStatusInformation (" + secureChannelStatusInformation + ")");
            }

            LoggingService.debug("decodePersonalCardReaderInformation - (END)");
        }


        /**
         * @private
         * @memberOf Connection
         * @function getPCRInformation
         * @desc Read the PCR Information block from the PCR currently connected.
         * @param {Object} oCallback Object containing the "success" function returning the PCR Information block as first argument and failure" function returning the error if the function fails.
         * @returns {String} the PCR Information block (RAW format)
         */
        function getPCRInformation(a_oCallback) {

            LoggingService.debug("getPCRInformation - (BEGIN)");

            var apdu = "8012000100",
                response = null,
                cb = {

                    success: function (result) {

                        endTransaction();

                        var aStatusWord = result.statusWord,
                            errorMessage = checkApduResponse(aStatusWord, result.dataOut, null);

                        if (errorMessage) {

                            LoggingService.error("getPCRInformation - No PersonalCardReaderInformation found");
                            LoggingService.debug("getPCRInformation - (END)");
                            callFailure(a_oCallback, manageError(aStatusWord, errorMessage));
                            return;
                        }

                        thatInstance.personalCardReaderInformation = result.dataOut;

                        // Decode the PCRInformation response to get the display sizes
                        decodePersonalCardReaderInformation(thatInstance.personalCardReaderInformation);

                        if (thatInstance.personalCardReaderInformation) {

                            LoggingService.info("getPCRInformation succeeded");
                            LoggingService.debug("getPCRInformation - (END)");
                            callSuccess(a_oCallback, thatInstance.personalCardReaderInformation);
                            return;
                        }

                        LoggingService.error("getPCRInformation - No PersonalCardReaderInformation found");
                        callFailure(a_oCallback, manageError(aStatusWord, "No PersonalCardReaderInformation found"));
                    },

                    failure: function (a_ErrorCode) {

                        endTransaction();

                        callFailure(a_oCallback, a_ErrorCode);
                    }
                };

            try {

                apdu_Transmit(apdu, cb);

            } catch (ex) {

                endTransaction();
                callFailure(a_oCallback, manageError(-1, ex.message || languageFindString("PcscError")));
            }

            LoggingService.debug("getPCRInformation - (END)");
        }





        /**
         * @public
         * @memberof Connection
         * @function getPersonalCardReaderInformation
         * @desc Read the PCR Information block from the PCR currently connected.
         * @param {Object} oCallback The function accepts an object containing two functions "success" and "failure" as properties.<br>
            When the function succeeds, the "success" function is invoked and the PCR information is returned as the first parameter.<br>
            When the function fails, the "failure" function is invoked and an object with two properties "errorCode" and "message" describing the issue is returned as first parameter.
         * @example
         <pre>
        // Create a callback to get result
        var resultCallback = {

            success : function (a_PCR_Information) {

                alert("The PCR information block is:" + a_PCR_Information);
            },

            failure : function (a_oError) {

                alert("An error occured. Error code (" + a_oError.errorCode + "). Error message (" + a_oError.message + ")");
            }

        };

        var c = enex.getConnection();

        if(c) {
            c.getPersonalCardReaderInformation(resultCallback);
        }
         </pre>
         */
        this.getPersonalCardReaderInformation = function (a_oCallback) {

            LoggingService.debug("getPersonalCardReaderInformation - (BEGIN)");

            checkCallback(a_oCallback);

            getPCRInformation(a_oCallback);

            LoggingService.debug("getPersonalCardReaderInformation - (END)");
        };

        ReturnedAPI.getPersonalCardReaderInformation = this.getPersonalCardReaderInformation;




        /**
         * @public
         * @memberof Connection
         * @function getSecureChannelState
         * @desc Checks if the Secure Channel is established or not.
         * @param {Object} oCallback Object containing two functions "success" and "failure" as properties.<br>
                When the function succeeds, the "success" function is invoked and the boolean value of the Secure Channel state is returned as the first parameter.<br>
                When the function fails, the "failure" function is invoked and an object with two properties "errorCode" and "message" describing the issue is returned as first parameter.
	 * @example
<pre>
// Create a callback to treat the return of the getSecureChannelState function
var resultCallback = {

    success : function (a_bState) {
        alert("is Secure Channel active ? (" + a_bState + ")");
    },

    failure : function (a_oError) {

        var message = "Operation FAILED.";
        message += " Error (" + a_oError.errorCode + ").";
        message += " Message (" + a_oError.message + ")";
        alert(message);
    }
};

var cnx = enex.getConnection();

if (cnx) { 
  cnx.getSecureChannelState(resultCallback);
}
</pre>
	    */
        this.getSecureChannelState = function (a_oCallback) {

            LoggingService.debug("getSecureChannelState - (BEGIN)");

            checkCallback(a_oCallback);

            var bForceRead = true,
                PCRInformationResultCallback = {

                    success: function (a_oResult) {

                        callSuccess(a_oCallback, false);
                    },

                    failure: function (a_oError) {

                        //callSuccess(a_oCallback, true);

                        // If a Secure Channel is already established
                        if (a_oError.errorCode === "6710") {

                            callSuccess(a_oCallback, true);
                            return;
                        }

                        //if(a_oResult.statusWord !== "9000") {
                        //
                        //callFailure(a_oCallback, a_oResult);
                        //}
                        callSuccess(a_oCallback, false);
                    }
                };

            getPCRInformation(PCRInformationResultCallback);

            LoggingService.debug("getSecureChannelState - (END)");
        };

        ReturnedAPI.getSecureChannelState = this.getSecureChannelState;



        /**
         * @private
         * @memberOf Connection
         * @function dispose
         * @desc Dispose this connection.
         */
        this.dispose = function () {

            LoggingService.debug("dispose - (BEGIN)");

            endTransaction();

            this.readerName = null;
            this.atr = null;
            this.pan = null;
            this.psn = null;
            this.personalCardReaderInformation = null;

            if (this.connection) {

                this.connection.dispose();
            }

            LoggingService.debug("dispose - (END)");
        };


        ////////////////////////////////////
        // CAP support
        ////////////////////////////////////



        /**
         * @private
         * @memberOf Connection
         * @function pad_string
         * @desc Right or left padding the incoming string with a specified character
         * @param {String} String to pad
         * @param {Number} Final padded string expected length
         * @param {String} Character to use for padding
         * @param {String} 'left' for left padding, 'right' for right padding
         * @throws {EnexException} String to long when the incoming string length is greater than the final expected length
         */
        function pad_string(s, length, pad_char, pad_position) {
            if (s.length <= length) {
                while (s.length < length) {
                    if (pad_position === 'left') {
                        s = pad_char + s;
                    } else {
                        s = s + pad_char;
                    }
                }
                return s;
            }

            throwException(languageFindString("StringTooLong"));
            return null; //useless. only to be compliant with JavaScript strict mode
        }

        /**
         * @private
         * @memberOf Connection
         * @function is_all_digits
         * @desc Check if the incoming string only contains digits
         * @param {String} Character array to check
         * @returns {Boolean} true is the incoming character array contains only digits, otherwise false
         *
         */
        function is_all_digits(s) {
            var i;
            for (i = 0; i < s.length; i = i + 1) {
                if (s[i] < "0" || s[i] > "9") {
                    return false;
                }
            }
            return true;
        }



        /**
         * @private
         * @memberOf Connection
         * @function format_tds_data
         * @desc Compute a Transaction Data for MODE2 with TDS.
         * For MODE2 with TDS, the only input data is the transaction data to be signed.
         * For this function, presence of non-empty transaction data is mandatory.
         * The transaction data is a list of numeric fields, each of which must be shown
         * to the card holder for approval. In addition, the PCR generates a MAC on the
         * entire set of transaction data, using the card response.
         * The transaction data is formatted exactly as it is presented to the MAC
         * algorithm. Each field is encoded in BCD without any padding (i.e. one nibble
         * 09 per digit). The fields are separated by a single F nibble, and if this
         * leaves an incomplete byte, a single F byte is appended.
         * @param {Array} Up to 10 data strings
         * @returns {String} String containing all data separated by a 'F'
         * @throws {EnexException} Thrown when the TDS data are invalid
         */
        function format_tds_data(a_TDS) {

            var i,
                data,
                ret;

            if ((a_TDS.length < 1) || (a_TDS.length > 10)) {

                throwException(languageFindString("IncorrectTDSNumber"));
            }

            // Validate format and size of each field
            for (i = 0; i < a_TDS.length; i = i + 1) {

                data = a_TDS[i];

                if ((data.length < 1) || (data.length > 10) || !is_all_digits(data)) {

                    throwException(languageFindString("IncorrectTDSFormat"));
                }
            }

            ret = a_TDS.join("F");

            if ((ret.length % 2) !== 0) {

                ret += "F";
            }

            return ret;
        }


        /**
         * @private
         * @memberOf Connection
         * @function get_currency_code_bcd
         * @desc Retrieve the currency code as ISO-4217 specified.
         * @param {Array} Currency code table indexed by currency country
         * @returns {String} 4 digits currency code
         * @throws {EnexException} Thrown when the currency is out of the configuration
         */
        function get_currency_code_bcd(currencyList, currencyName) {

            // Find the code related to the currency in the list of the known ones
            var currencyCode = currencyList[currencyName];

            if (!currencyCode) {

                throwException(languageFindString("UnknownCurrency") + currencyName);
            }

            return pad_string(currencyCode, 4, "0", "left");
        }




        /**
         * @private
         * @memberOf Connection
         * @function format_cap_apdu
         * @desc Compute the CAP command according the CAP specification
         * @param {String} CAPMode Defines the CAP mode
         * @param {String} UnpredictableNumber Up to 8 characters string containing the unpredictable number.
         * @param {String} Amount Up to 12 characters string containing the amount.
         * @param {String} Currency A string containing the currency code as 3 letters or 2 BCD codes bytes. Example: "EUR" or "0978", "USD" or "0840"
         * @param {String} Passcode A string containing the Passcode configuration as 2 letters to code 1 byte. Example: "00"
         * @param {Array} TransactionData An array of decimal strings containing the TDS data. If used, this array must have at least 1 element and no more than 10 elements. Example: ["12345", "123"]
         * @returns {String} APDU command buffer
         */
        function format_cap_apdu(mode, un, amount, currency, Passcode, tds_data) {

            LoggingService.debug("format_cap_apdu - (BEGIN)");

            var valueOfUnpredictableNumber,
                valueOfAmount,
                valueOfCurrency,
                currencies,
                valueOfTdsData,
                valueOfPasscode,
                len,
                len_str,
                apdu;

            function valid(s) {

                if (s && s.length) {

                    return true;
                }

                return false;
            }

            // If required, compute a TLV for an unpredictable number of up
            // to 8 decimal digits, BCD encoded and left-padded with zeros
            valueOfUnpredictableNumber = "";
            if (valid(un)) {

                // As specified into the CAP specification
                // Tag : 9F37
                // Length : 8
                // Value : 00000000
                valueOfUnpredictableNumber = tlv("9F37", pad_string(un, 8, "0", "left"));
            }

            // Compute a TLV for the transaction amount, in base currency
            // units, BCD encoded
            valueOfAmount = "";
            if (valid(amount)) {

                // TAG: 9F02
                // Length: 12
                // Value: 12 bytes zero left padded amount
                valueOfAmount = tlv("9F02", pad_string(amount, 12, "0", "left"));
            }

            // Compute a TLV for the transaction currency
            valueOfCurrency = "";
            if (valid(currency)) {

                // TAG: 5F2A
                // Length: 4
                // Value: currency code as specified into the ISO-4217
                if (is_all_digits(currency)) {
                    valueOfCurrency = tlv("5F2A", pad_string(currency, 4, "0", "left"));
                } else {
                    // Retrieve the currency code from the currency country
                    currencies = g_ReaderConfiguration.currencies;
                    valueOfCurrency = tlv("5F2A", get_currency_code_bcd(currencies, currency));
                }
            }

            // Compute a TLV for the Transaction Data with Command Input Data
            // only if required
            valueOfTdsData = "";
            if (valid(tds_data)) {

                // As specified in MODE2 described in CAP specification
                // (Page 5-66., Table 5.22)
                // TAG: C2
                // Length: Variable
                // Value: BCD encoded numeric fields without padding, separated
                // with nibble.
                valueOfTdsData = tlv("C2", format_tds_data(tds_data));
            }

            valueOfPasscode = "";
            if (valid(Passcode)) {

                // As specified into the CAP specification
                // Tag : DF71
                // Length : 1
                //valueOfPasscode = tlv("DF71", "01" + Passcode);

                if (Passcode.length < 2) {

                    Passcode = "0" + Passcode;
                }
                valueOfPasscode = tlv("DF71", Passcode);

            }

            // Compute the final Perform Transaction APDU command length
            len = (valueOfUnpredictableNumber.length + valueOfAmount.length + valueOfCurrency.length + valueOfTdsData.length) / 2;

            len_str = byteArrayToHexString([len]);

            // Compute the final Perform Transaction APDU command buffer
            // CLA 80
            // INS 12
            // P1 Operation Selection (see Table 5.16)
            // P2 01
            // Lc Variable the length of the input data
            // Data Input Data for the selected function
            // Le 00

            //var apdu = "8012" + mode + "01" + len_str + valueOfUnpredictableNumber + valueOfAmount + valueOfCurrency + valueOfTdsData + "00";
            apdu = "8012" + mode + "01" + len_str + valueOfUnpredictableNumber + valueOfAmount + valueOfCurrency + valueOfTdsData + valueOfPasscode;

            //if(is_gemalto_driver_installed) {
            //
            //    apdu += "00"
            //}

            LoggingService.debug("format_cap_apdu - apdu (" + apdu + ")");
            LoggingService.debug("format_cap_apdu - (END)");

            return apdu;
        }


        /**
         * @private
         * @memberOf Connection
         * @function getTokenCAP
         * @desc Retrieve the CAP/SWYS token from the smart card answer
         * @param {String} reply The APDU response
         * @param {Boolean} is_swys True if the APDU response is related to a SWYS command. Otherwise false
         * @returns {String} CAP/SWYS token
         */
        function getTokenCAP(reply, is_swys) {

            if (!reply || ("undefined" === typeof (reply))) {

                return null;
            }

            var code = reply.C1;

            if (is_swys) {

                if (code.charAt(code.length - 1) === "F") {
                    return code.slice(0, code.length - 1);
                } else {
                    return code;
                }
            } else {
                if (!code) {

                    code = reply.DF70;
                    return code;
                }

                return parseInt(code, 10).toString();
            }
        }

        /**
         * @private
         * @memberOf Connection
         * @function innerCallbackCAP
         * @desc Inner callback used to check the answer of the CAP command
         * @param {Object} FinalCallback Object containing the "success" function returning the APDU result and "failure" function returning the error if the function fails.
         */
        function innerCallbackCAP(a_oFinalCallback) {

            return {

                success: function (result) {

                    endTransaction();

                    var aStatusWord = result.statusWord,
                        aDataOut = result.dataOut,
                        reply,
                        umpredictableNumber,
                        code;

                    LoggingService.debug("innerCallbackCAP.success - (BEGIN)");
                    LoggingService.debug("innerCallbackCAP.success - StatusWord (" + aStatusWord + ")");
                    LoggingService.debug("innerCallbackCAP.success - aDataOut (" + aDataOut + ")");

                    modalboxClose();

                    reply = tlv_decode(aDataOut);

                    // Extract the optional unpredictable number from the TLV with tag 9F37
                    umpredictableNumber = reply["9F37"];

                    // Extract the OTP value from the TLV with tag 0xC1
                    code = getTokenCAP(reply, false);

                    if (code) {

                        LoggingService.info("CAP generation succeeded");
                        LoggingService.debug("innerCallbackCAP.success - (END)");
                        if (umpredictableNumber) {

                            a_oFinalCallback.success(thatInstance, code, umpredictableNumber);

                        } else {

                            a_oFinalCallback.success(thatInstance, code);
                        }

                    } else {

                        LoggingService.error("innerCallbackCAP.success - No token found");
                        LoggingService.debug("innerCallbackCAP.success - (END)");
                        a_oFinalCallback.failure(thatInstance, manageError(aStatusWord));
                    }
                },

                failure: function (a_ErrorCode) {

                    endTransaction();

                    modalboxClose();
                    LoggingService.debug("innerCallbackCAP.failure - (BEGIN)");
                    LoggingService.debug("innerCallbackCAP.failure - a_ErrorCode (" + a_ErrorCode + ")");
                    LoggingService.error("CAP generation failed (" + a_ErrorCode + ")");

                    a_oFinalCallback.failure(thatInstance, a_ErrorCode);
                }
            };
        }


        /**
         * @private
         * @memberOf Connection
         * @function CAP_APDU_Send
         * @desc Format the CAP command and send it asynchronously to the PCR
         * @param {Object} Callback Object containing the "success" function returning the APDU result and "failure" function returning the error if the function fails.
         * @param {Number} CAPMode Defines the CAP mode (1,2,3)
         * @param {String} UnpredictableNumber Up to 8 characters string containing the unpredictable number. If the string length is less than 8 then the unpredictable number is padded to fit the valid length. Example: "11223344"
         * @param {String} Amount Up to 12 characters string containing the amount. If the string length is less than 12 characters then the amount is padded. Example: "11223344"
         * @param {String} Currency A string containing the currency code as 3 letters or 2 BCD codes bytes. Example: "EUR" or "0978", "USD" or "0840"
         * @param {String} Passcode A string containing the Passcode configuration as 2 letters to code 1 byte. Example: "00"
         * @param {Array} tds_data An optional array of decimal strings containing the TDS data. If used, this array must have at least 1 element and no more than 10 elements. Example: ["12345", "123"]
         */
        function sendCAP(a_oCallback, a_iMode, a_sUnpredictableNumber, a_sAmount, a_sCurrency, a_sPasscode, a_aTdsData) {

            LoggingService.debug("sendCAP - (BEGIN)");
            LoggingService.debug("sendCAP - a_iMode (" + a_iMode + ")");
            LoggingService.debug("sendCAP - a_sUnpredictableNumber (" + a_sUnpredictableNumber + ")");
            LoggingService.debug("sendCAP - a_sAmount (" + a_sAmount + ")");
            LoggingService.debug("sendCAP - a_sCurrency (" + a_sCurrency + ")");
            LoggingService.debug("sendCAP - a_sPasscode (" + a_sPasscode + ")");
            LoggingService.debug("sendCAP - a_aTdsData (" + a_aTdsData + ")");

            checkCallback(a_oCallback);

            // Define the apdu to send to the PCR
            switch (a_iMode) {

                case 1:
                    a_iMode = "02";
                    break;

                case 2:
                    a_iMode = (a_aTdsData) ? "04" : "03";
                    break;

                case 3:
                    a_iMode = (a_aTdsData) ? "06" : "05";
                    break;

                default:
                    return;
            }

            var apdu = null;
            try {

                apdu = format_cap_apdu(a_iMode, a_sUnpredictableNumber, a_sAmount, a_sCurrency, a_sPasscode, a_aTdsData);

            } catch (ex) {

                a_oCallback.failure(thatInstance, manageError(-1, ex.message));
                return;
            }

            modalboxOpen(languageFindString("ReaderReadInstructions"));

            // Send the apdu to the PCR asynchronously
            apdu_Transmit(apdu, innerCallbackCAP(a_oCallback));

            LoggingService.debug("sendCAP - (END)");
        }





        /**
         * @public
         * @memberof Connection
         * @function cap_mode1
         * @desc Generates a CAP Mode1 token from the incoming parameters.
         * @param {Object} Callback Object containing the "success" function returning the APDU result and "failure" function returning the error if the function fails.
         * @param {String} UnpredictableNumber Up to 8 characters string containing the unpredictable number. If the string length is less than 8 then the unpredictable number is padded to fit the valid length. Example: "11223344"
         * @param {String} Amount Up to 12 characters string containing the amount. If the string length is less than 12 characters then the amount is padded. Example: "11223344"
         * @param {String} Currency A string containing the currency code as 3 letters or 2 BCD codes bytes. Example: "EUR" or "0978", "USD" or "0840"
         * @param {String} Passcode A string containing the Passcode configuration as 2 letters to code 1 byte. Example: "00"
         * @example
         <pre>
// Create a callback to treat the return of the CAP asynchronous function
var resultCallback = {

  success : function (a_oConnection, a_sToken) {

    alert("Your token " + a_sToken + " has been successfully generated.");
  },

  failure : function (a_oConnection, a_oError) {

    var sMessage = "Your token has NOT been generated.";
    sMessage += " Error (" + a_oError.errorCode + ").";
    sMessage += " Message (" + a_oError.message + ")";

    alert(sMessage);
  }

};

// Collect the end-user information to operate the CAP
var sUnpredictableNumber = "11223344"
var sAmount = "10000"
var sCurrency = "USD"

// Retrieve the Connection object attached to the smart card inserted into the reader
var cnx = enex.getConnection();
if (!cnx) {

  return;
}
cnx.cap_mode1(resultCallback, sUnpredictableNumber, sAmount, sCurrency);
         </pre>
         */
        this.cap_mode1 = function (a_oCallback, a_sUnpredictableNumber, a_sAmount, a_sCurrency, a_sPasscode) {

            LoggingService.debug("CAPMode1 - (BEGIN)");
            LoggingService.debug("CAPMode1 - a_sUnpredictableNumber (" + a_sUnpredictableNumber + ")");
            LoggingService.debug("CAPMode1 - a_sAmount (" + a_sAmount + ")");
            LoggingService.debug("CAPMode1 - a_sCurrency (" + a_sCurrency + ")");
            LoggingService.debug("CAPMode1 - a_sPasscode (" + a_sPasscode + ")");

            sendCAP(a_oCallback, 1, a_sUnpredictableNumber, a_sAmount, a_sCurrency, a_sPasscode, null);

            LoggingService.debug("CAPMode1 - (END)");
        };


        /**
         * @public
         * @memberof Connection
         * @function cap_mode2
         * @desc Generates a CAP Mode2 (with or without TDS) token from the incoming parameters.
         * @param {Object} Callback Object containing the "success" function returning the APDU result and "failure" function returning the error if the function fails.
         *	@param {Array} tds_data An optional array of decimal strings containing the TDS data. If used, this array must have at least 1 element and no more than 10 elements. Example: ["12345", "123"]
         * @param {String} Passcode A string containing the Passcode configuration as 2 letters to code 1 byte. Example: "00"
         * @example
         <pre>
// Create a callback to treat the return of the CAP asynchronous function
var resultCallback = {

  success : function (a_oConnection, a_sToken) {

    alert("Your token " + a_sToken + " has been successfully generated.");
  },

  failure : function (a_oConnection, a_oError) {

    var sMessage = "Your token has NOT been generated.";
    sMessage += " Error (" + a_oError.errorCode + ").";
    sMessage += " Message (" + a_oError.message + ")";

    alert(sMessage);
  }

};

// Retrieve the Connection object attached to the smart card inserted into the reader
var cnx = enex.getConnection();
if (!cnx) {

  return;
}

var TDS = ["12345", "445566"];
cnx.cap_mode2(callback, TDS);
         </pre>
         */
        this.cap_mode2 = function (a_oCallback, a_aTdsData, a_sPasscode) {

            LoggingService.debug("CAPMode2 - (BEGIN)");
            LoggingService.debug("CAPMode2 - a_aTdsData (" + a_aTdsData + ")");
            LoggingService.debug("CAPMode2 - a_sPasscode (" + a_sPasscode + ")");

            sendCAP(a_oCallback, 2, null, null, null, a_sPasscode, a_aTdsData);

            LoggingService.debug("CAPMode2 - (END)");
        };


        /**
         * @public
         * @memberof Connection
         * @function cap_mode3
         * @desc Generates a CAP Mode3 (with or without TDS) token from the incoming parameters.
         * @param {Object} Callback Object containing the "success" function returning the APDU result and "failure" function returning the error if the function fails.
         * @param {String} UnpredictableNumber Up to 8 characters string containing the unpredictable number. If the string length is less than 8 then the unpredictable number is padded to fit the valid length. Example: "11223344"
         * @param {Array} tds_data An optional array of decimal strings containing the TDS data. If used, this array must have at least 1 element and no more than 10 elements. Example: ["12345", "123"]
         * @param {String} Passcode A string containing the Passcode configuration as 2 letters to code 1 byte. Example: "00"
         * @example
         <pre>
// Create a callback to treat the return of the CAP asynchronous function
var resultCallback = {

  success : function (a_oConnection, a_sToken, a_sUmpredictableNumber) {

    // Reset the token display on the HTML page
    var sMessage = "Your token " + a_sToken + " has been successfully generated.";

    // From specific PCR as Ezio Shield Branch reader the card holder can specify
    // the unpredictable number directly from the PCR (you only have to send
    // the CAP Mode3 command with a 'FFFFFFFF' template as unpredictable number).
    // In this case, the 'success' function must manage a new and last parameter to
    // get the value typed by the card holder
    if (a_sUmpredictableNumber) {

      sMessage += " The card holder has specified " + a_sUmpredictableNumber + " as unpredictable number";
    }

    alert(sMessage);

  },

  failure : function (a_oConnection, a_oError) {

    var sMessage = "Your token has NOT been generated.";
    sMessage += " Error (" + a_oError.errorCode + ").";
    sMessage += " Message (" + a_oError.message + ")";

    alert(sMessage);
  }

};

// Retrieve the Connection object attached to the smart card inserted into the reader
var cnx = enex.getConnection();
if (!cnx) {

  return;
}

// Collect the end-user information to operate the CAP
var sUnpredictableNumber = "11223344"
var TDS = ["12345", "445566"];

// Perform the operation
cnx.cap_mode3(callback, sUnpredictableNumber, TDS);
         </pre>
         */
        this.cap_mode3 = function (a_oCallback, a_sUnpredictableNumber, a_aTdsData, a_sPasscode) {

            LoggingService.debug("CAPMode3 - (BEGIN)");
            LoggingService.debug("CAPMode3 - a_sUnpredictableNumber (" + a_sUnpredictableNumber + ")");
            LoggingService.debug("CAPMode3 - a_aTdsData (" + a_aTdsData + ")");
            LoggingService.debug("CAPMode3 - a_sPasscode (" + a_sPasscode + ")");

            sendCAP(a_oCallback, 3, a_sUnpredictableNumber, null, null, a_sPasscode, a_aTdsData);

            LoggingService.debug("CAPMode3 - (END)");
        };






        ////////////////////////////////////
        // OTP support
        ////////////////////////////////////


        /**
         * @private
         * Generates different kind of OTP 
         * @param   {object} a_oCallback  Callback Object containing the "success" function returning the APDU result and "failure" function returning the error if the function fails.
         * @param   {string} a_Algo name of the OTP algorithm to apply
         * @param   {string} a_sChallenge hexa string containing the challenge required for OCRA otp
         * @returns {string} a_sAuthenticationCode hexa string containing the authentication code to add for security server verification
         */
        this.generateOTP = function (a_oCallback, a_Algo, a_sChallenge, a_sAuthenticationCode) {

            LoggingService.debug("generateOTP - (BEGIN)");

            checkCallback(a_oCallback);

            // Display a dialog box to warm the end-user
            modalboxOpen(languageFindString("ConfirmOperation"));

            var ins = '36',
                p1 = ((undefined === a_sAuthenticationCode) || ("" === a_sAuthenticationCode)) ? '00' : '01',
                p2 = '00',
                data = "",
                apdu;

            // Define the algo rithm to use for the token computation
            if (a_Algo === 'HOTP_TOTP') {
                ins = '36';
            } else if (a_Algo === 'OCRA_1_CR') {
                ins = '35';
            } else if (a_Algo === 'OCRA_1_SIGN') {
                ins = '37';
            }

            // Define the apdu to send to the PCR
            apdu = "D0" + ins + p1 + p2;

            // Add the optional authnetication code
            if (a_sAuthenticationCode) {

                // The authentication code is 'number' with an undefined length
                // But it must be left padded with blank character if the length is odd
                if (0 !== (a_sAuthenticationCode.length % 2)) {
                    a_sAuthenticationCode += "0" + a_sAuthenticationCode;
                }

                data += a_sAuthenticationCode;
            }

            // Add the optional challenge
            if ((undefined !== a_sChallenge) && (a_Algo !== 'HOTP_TOTP')) {


                data += ascii_bytes(a_sChallenge);
            }

            // Calculate the final length
            apdu += data.length ? byteArrayToHexString([data.length / 2]) : '00';

            // Add the final data
            apdu += data;

            // Define a callback to check the return of the apdu
            function innerCallback(a_oFinalCallback) {

                return {
                    success: function (result) {

                        endTransaction();
                        modalboxClose();

                        var aStatusWord = result.statusWord,
                            aDataOut = result.dataOut,
                            C1,
                            reply,
                            index;

                        LoggingService.debug("generateOTP.success - StatusWord (" + aStatusWord + ")");
                        LoggingService.debug("generateOTP.success - DataOut (" + aDataOut + ")");

                        if (aStatusWord !== "9000") {

                            a_oFinalCallback.failure(thatInstance, manageError(aStatusWord));
                            return;
                        }

                        reply = tlv_decode(aDataOut);

                        // Extract the optional unpredictable number from the TLV with tag 9F37
                        C1 = reply.C1;

                        // Remove any 'F' character at the end of the PAN
                        for (index = C1.length - 1; index !== 0; index = index - 1) {

                            if (C1[index] !== 'F') {

                                break;
                            }
                        }
                        C1 = C1.substring(0, index + 1);

                        LoggingService.info("generateOTP succeeded");
                        LoggingService.debug("generateOTP - (END)");
                        a_oFinalCallback.success(thatInstance, C1);
                        return;
                        //                    }
                        //                        }
                        //
                        //                        LoggingService.error("hotp/totp - No OTP found");
                        //                        LoggingService.debug("hotp/totp - (END)");
                        //                        if (a_oFinalCallback.failure) {
                        //                            a_oFinalCallback.failure(thatInstance, manageError(aStatusWord, "No OTP found"));
                        //                        }
                    },

                    failure: function (a_Error) {
                        endTransaction();
                        modalboxClose();
                        LoggingService.error("generateOTP failed");
                        LoggingService.debug("generateOTP.failure", a_Error);
                        LoggingService.debug("generateOTP - (END)");
                        if (a_oFinalCallback.failure) {
                            a_oFinalCallback.failure(thatInstance, a_Error);
                        }
                    }
                };
            }

            // Send the APDU to the PCR asynchronously
            apdu_Transmit(apdu, innerCallback(a_oCallback));

            LoggingService.debug("generateOTP - (END)");
        };


        /**
                 * @public
                 * @memberof Connection
                 * @function hotp_totp
                 * @desc Generates a HOTP/TOTP.
                 * @param {String} Authentication Code (optional) Hexa string containing an Authentication Code to be verified by the server.
                 * @param {Object} Callback Object containing the "success" function returning the APDU result and "failure" function returning the error if the function fails.
                 * @returns {Array} OTP generated. 
                 * @example
                 <pre>
        var cnx = enex.getConnection(),
            // Optional authentication code to add for security server verification
            authenticationCode = "36A1D4E7";

        try {
            if (cnx) {
                cnx.hotp_totp(resultCallback, authenticationCode);
            }
        } catch (e) {
            var message = "Caught exception";
            message += " name: " + e.name;
            message += " message: " + e.message;
            alert("Error", message);
        }    
                 </pre>
                 */
        this.hotp_totp = function (a_oCallback, a_sAuthenticationCode) {
            this.generateOTP(a_oCallback, 'HOTP_TOTP', undefined, a_sAuthenticationCode);
        };


        /**
         * @public
         * @memberof Connection
         * @function ocra1_cr
         * @desc Generates a OCRA1 CR otp.
         * @param {String} Challenge string containing the challenge required for otp generation.
         * @param {String} Authentication Code (optional) Hexa string containing an Authentication Code to be verified by the server.
         * @param {Object} Callback Object containing the "success" function returning the APDU result and "failure" function returning the error if the function fails.
         * @returns {Array} OTP generated. 
         * @example
         <pre>

var challenge = "12345678",
    // Optional authentication code to add for security server verification
    authenticationCode = "36A1D4E7",
    cnx = enex.getConnection();

try {
    if (cnx) {
        cnx.ocra1_cr(resultCallback, challenge, authenticationCode);
    }
} catch (e) {
    var message = "Caught exception";
    message += " name: " + e.name;
    message += " message: " + e.message;
    alert("Error", message);
}    
         </pre>
         */
        this.ocra1_cr = function (a_oCallback, a_sChallenge, a_sAuthenticationCode) {
            this.generateOTP(a_oCallback, 'OCRA_1_CR', a_sChallenge, a_sAuthenticationCode);
        };



        /**
         * @public
         * @memberof Connection
         * @function ocra1_sign
         * @desc Generates a OCRA1 SIGN otp.
         * @param {String} Challenge string containing the challenge required for otp generation.
         * @param {String} Authentication Code (optional) Hexa string containing an Authentication Code to be verified by the server.
         * @param {Object} Callback Object containing the "success" function returning the APDU result and "failure" function returning the error if the function fails.
         * @returns {Array} OTP generated. 
         * @example
         <pre>

var challenge = "1234~5678~9012",
    // Optional authentication code to add for security server verification
    authenticationCode = "36A1D4E7",
    cnx = enex.getConnection();

try {
    if (cnx) {
        cnx.ocra1_cr(resultCallback, challenge, authenticationCode);
    }
} catch (e) {
    var message = "Caught exception";
    message += " name: " + e.name;
    message += " message: " + e.message;
    alert("Error", message);
}    
         </pre>
         */
        this.ocra1_sign = function (a_oCallback, a_sChallenge, a_sAuthenticationCode) {
            this.generateOTP(a_oCallback, 'OCRA_1_SIGN', a_sChallenge, a_sAuthenticationCode);
        };



        /**
         * @public
         * @memberof Connection
         * @function getDeviceChallenge
         * @desc Asks the device to generate the Random Number that will be used to generate and validate the Command Authentication Code.
         * @param {Object} Callback Object containing the "success" function returning the APDU result and "failure" function returning the error if the function fails.
         * @returns {Array} 4 bytes challenge genereted by the PCR. 
         * @example
         <pre>
var callback = {
    success: function (result) {
        alert("getDeviceChallenge returned the following 4 bytes challenge (" + result + ")");
    },

    failure: function (error) {
        var sMessage += " Error (" + error.errorCode + ")";
        sMessage += " Message (" + error.message + ")";
        alert(sMessage);
    }
};

// Call the function
var cnx = enex.getConnection();
if (cnx) {

  cnx.getDeviceChallenge(resultCallback);
}  
         </pre>
         */
        this.getDeviceChallenge = function (a_oCallback) {

            LoggingService.debug("getDeviceChallenge - (BEGIN)");

            checkCallback(a_oCallback);

            // Display a dialog box to warm the end-user
            modalboxOpen(languageFindString("ConfirmOperation"));

            // Define a callback to check the return of the apdu
            function innerCallback(a_oFinalCallback) {

                return {
                    success: function (result) {

                        endTransaction();
                        modalboxClose();

                        var aStatusWord = result.statusWord,
                            aDataOut = result.dataOut,
                            C1,
                            reply;

                        LoggingService.debug("getDeviceChallenge - StatusWord (" + aStatusWord + ")");
                        LoggingService.debug("getDeviceChallenge - DataOut (" + aDataOut + ")");

                        // Check the status word
                        if (aStatusWord !== "9000") {

                            a_oFinalCallback.failure(thatInstance, manageError(aStatusWord));
                            return;
                        }

                        // Decode the TLV
                        reply = tlv_decode(aDataOut);

                        // Extract the C1 tlv containing the device challenge
                        C1 = reply.C1;

                        LoggingService.info("getDeviceChallenge succeeded");
                        LoggingService.debug("getDeviceChallenge - (END)");
                        a_oFinalCallback.success(thatInstance, C1);
                    },

                    failure: function (a_Error) {
                        endTransaction();
                        modalboxClose();
                        LoggingService.error("getDeviceChallenge failed");
                        LoggingService.debug("getDeviceChallenge.failure", a_Error);
                        LoggingService.debug("getDeviceChallenge - (END)");
                        if (a_oFinalCallback.failure) {
                            a_oFinalCallback.failure(thatInstance, a_Error);
                        }
                    }
                };
            }

            // Send the APDU to the PCR asynchronously
            var apdu = "D03C000000";
            apdu_Transmit(apdu, innerCallback(a_oCallback));

            LoggingService.debug("getDeviceChallenge - (END)");
        };





        ////////////////////////////////////
        // PAN support
        ////////////////////////////////////


        /**
         * @public
         * @memberof Connection
         * @function get_pan_psn
         * @desc This function collects the Primary Account Number (PAN, PSN, expiration date) from the smart card
         * @param {Object} Callback Object containing the "success" function returning the result and "failure" function returning the error if the function fails.
         * @example
         <pre>
// Create a callback to treat the return of the get PAN asynchronous function
var resultCallback = {

  success : function (a_oConnection, a_PAN, a_PSN, a_ExpirationDate) {

    var sMessage = "Your PAN is ";
    sMessage += a_PAN;
    sMessage += ".Your PSN is ";
    sMessage += a_PSN;
    sMessage += ".Your Expiration Date is ";
    sMessage += a_ExpirationDate;
    sMessage += ".";

    alert(sMessage);
  },

  failure : function (a_oConnection, a_oError) {

    var sMessage = "The PAN cannot be retrieved.";
    sMessage += " Error (" + a_oError.errorCode + ")";
    sMessage += " Message (" + a_oError.message + ")";

    alert(sMessage);
  },

};
// Call the function
var cnx = enex.getConnection();
if (cnx) {

  cnx.get_pan_psn(resultCallback);
}  
         </pre>
         */
        this.get_pan_psn = function (a_oCallback) {

            LoggingService.debug("getPrimaryAccountNumber - (BEGIN)");

            checkCallback(a_oCallback);

            if (this.pan) {
                LoggingService.info("getPrimaryAccountNumber succeeded");

                LoggingService.debug("getPrimaryAccountNumber - PAN already available (" + this.pan + ")");

                LoggingService.debug("getPrimaryAccountNumber - (END)");
                a_oCallback.success(this, this.pan, this.psn, this.expirationDate);
                return;
            }

            // Display a dialog box to warm the end-user
            modalboxOpen(languageFindString("ConfirmPAN"));

            // Define the apdu to send to the PCR
            var apdu = "D038000000";

            // Define a callback to check the return of the apdu
            function innerCallback(a_oFinalCallback) {



                return {
                    success: function (result) {

                        endTransaction();
                        modalboxClose();

                        var aStatusWord = result.statusWord,
                            aDataOut = result.dataOut,
                            tagA2,
                            tags,
                            index;

                        LoggingService.debug("getPrimaryAccountNumber.success - StatusWord (" + aStatusWord + ")");
                        LoggingService.debug("getPrimaryAccountNumber.success - DataOut (" + aDataOut + ")");

                        if (aStatusWord !== "9000") {

                            a_oFinalCallback.failure(thatInstance, manageError(aStatusWord));
                            return;
                        }

                        tagA2 = tlv_decode(aDataOut);

                        if (tagA2) {

                            tags = tlv_decode(tagA2.A2);

                            if (tags) {

                                // Extract the PAN
                                thatInstance.pan = tags["5A"];

                                // Remove any 'F' character at the end of the PAN
                                for (index = thatInstance.pan.length - 1; index !== 0; index = index - 1) {

                                    if (thatInstance.pan[index] !== 'F') {

                                        break;
                                    }
                                }
                                thatInstance.pan = thatInstance.pan.substring(0, index + 1);

                                // Extract the PSN
                                thatInstance.psn = tags["5F34"];

                                // Extract the expiration date
                                thatInstance.expirationDate = tags["5F24"];

                                LoggingService.info("getPrimaryAccountNumber succeeded");
                                LoggingService.debug("getPrimaryAccountNumber - (END)");
                                a_oFinalCallback.success(thatInstance, thatInstance.pan, thatInstance.psn, thatInstance.expirationDate);
                                return;
                            }
                        }

                        LoggingService.error("getPrimaryAccountNumber - No PAN found");
                        LoggingService.debug("getPrimaryAccountNumber - (END)");
                        if (a_oFinalCallback.failure) {
                            a_oFinalCallback.failure(thatInstance, manageError(aStatusWord, "No PAN found"));
                        }
                    },

                    failure: function (a_Error) {
                        endTransaction();
                        modalboxClose();
                        LoggingService.error("getPrimaryAccountNumber failed");
                        LoggingService.debug("getPrimaryAccountNumber.failure", a_Error);
                        LoggingService.debug("getPrimaryAccountNumber - (END)");
                        if (a_oFinalCallback.failure) {
                            a_oFinalCallback.failure(thatInstance, a_Error);
                        }
                    }
                };
            }

            // Send the APDU to the PCR asynchronously
            apdu_Transmit(apdu, innerCallback(a_oCallback));

            LoggingService.debug("getPrimaryAccountNumber - (END)");
        };



        ////////////////////////////////////
        // PPDU support
        ////////////////////////////////////

        /**
         * @private
         */
        function isInvalid(o, l) {

            // Check the consistency of the incoming first parameter
            if ((o === null) || (typeof (o) === "undefined")) {

                return true;
            }

            // If a length is provided as incoming parameter then check it
            if ((arguments.length > 1) && (l !== o.length)) {

                return true;
            }

            return false;
        }



        /**
         * @private
         * @memberOf Connection
         * @function computeStructureVerifyPIN
         * @desc Build a VERIFY PIN PPDU command from the incoming parameters
         * @param {Object} PPDUParameters This is the template to provide with the feature to compute the PPDU command.
         */
        function computeStructureVerifyPIN(a_aParameter, a_bPPDU) {

            var structure,
                len,
                cmd;

            if (isInvalid(a_aParameter)) {

                LoggingService.error("computeStructureVerifyPIN - (END)");

                return null;
            }

            if (isInvalid(a_aParameter[enex.FEATURE_PARAMETER_TIMEOUT])) {

                a_aParameter[enex.FEATURE_PARAMETER_TIMEOUT] = "00";
            }

            if (isInvalid(a_aParameter[enex.FEATURE_PARAMETER_TIMEOUT2])) {

                a_aParameter[enex.FEATURE_PARAMETER_TIMEOUT2] = "00";
            }

            if (isInvalid(a_aParameter[enex.FEATURE_PARAMETER_FORMATSTRING])) {

                a_aParameter[enex.FEATURE_PARAMETER_FORMATSTRING] = "00";
            }

            if (isInvalid(a_aParameter[enex.FEATURE_PARAMETER_PINBLOCKSTRING])) {

                a_aParameter[enex.FEATURE_PARAMETER_PINBLOCKSTRING] = "00";
            }

            if (isInvalid(a_aParameter[enex.FEATURE_PARAMETER_PINLENGTHFORMAT])) {

                a_aParameter[enex.FEATURE_PARAMETER_PINLENGTHFORMAT] = "00";
            }

            if (isInvalid(a_aParameter[enex.FEATURE_PARAMETER_PINMAXEXTRADIGIT], 4)) {

                a_aParameter[enex.FEATURE_PARAMETER_PINMAXEXTRADIGIT] = "0008";
            }

            // Conditions under which PIN entry should be considered complete
            if (isInvalid(a_aParameter[enex.FEATURE_PARAMETER_ENTRYVALIDATIONCONDITION])) {

                // The value is a bit wise OR operation. 01h Max size reached. 02h Validation key pressed. 04h Time-out occurred.
                a_aParameter[enex.FEATURE_PARAMETER_ENTRYVALIDATIONCONDITION] = "02";
            }

            // Number  of  messages  to  display  for  PIN verification
            if (isInvalid(a_aParameter[enex.FEATURE_PARAMETER_NUMBERMESSAGE])) {

                // 00h no string. 01h Message which index is indicated in bMsgIndex. FFh default CCID message.
                a_aParameter[enex.FEATURE_PARAMETER_NUMBERMESSAGE] = "00";
            }

            if (isInvalid(a_aParameter[enex.FEATURE_PARAMETER_LANGID], 4)) {

                // Default English language
                a_aParameter[enex.FEATURE_PARAMETER_LANGID] = "0409";
            }

            if (isInvalid(a_aParameter[enex.FEATURE_PARAMETER_MSGINDEX])) {

                a_aParameter[enex.FEATURE_PARAMETER_MSGINDEX] = "00";
            }

            if (isInvalid(a_aParameter[enex.FEATURE_PARAMETER_TEOPROTOCOL], 6)) {

                a_aParameter[enex.FEATURE_PARAMETER_TEOPROTOCOL] = "000000";
            }

            // Data to send to the ICC
            if (isInvalid(a_aParameter[enex.FEATURE_PARAMETER_DATA])) {

                return null;
            }

            // Prepare the data for VERIFY_PIN_DIRECT to send to the device
            // As described into the 2.5.2 PIN_VERIFIY command details, the command is a 19 bytes buffer
            // (See PCSC Part10 IFDs with Secure PIN entry Capabilities v2.02.09)

            // Set the time-out in seconds
            structure = a_aParameter[enex.FEATURE_PARAMETER_TIMEOUT];

            // Set the time-out in seconds after the first key stroke (00 = default)
            structure += a_aParameter[enex.FEATURE_PARAMETER_TIMEOUT2];

            // Set the formatting options
            structure += a_aParameter[enex.FEATURE_PARAMETER_FORMATSTRING];

            // Set The PIN length in APDU
            structure += a_aParameter[enex.FEATURE_PARAMETER_PINBLOCKSTRING];

            // Set the PIN length format
            structure += a_aParameter[enex.FEATURE_PARAMETER_PINLENGTHFORMAT];

            // Set the PIN max extra digits
            // 0x0408 = [04 08] (i.e. 2 bytes for USHORT + reversed for Big Endian)
            structure += a_aParameter[enex.FEATURE_PARAMETER_PINMAXEXTRADIGIT].charAt(2);
            structure += a_aParameter[enex.FEATURE_PARAMETER_PINMAXEXTRADIGIT].charAt(3);
            structure += a_aParameter[enex.FEATURE_PARAMETER_PINMAXEXTRADIGIT].charAt(0);
            structure += a_aParameter[enex.FEATURE_PARAMETER_PINMAXEXTRADIGIT].charAt(1);

            // Set conditions under which PIN entry should be considered complete
            structure += a_aParameter[enex.FEATURE_PARAMETER_ENTRYVALIDATIONCONDITION];

            // Set number of message to display for PIN verification
            structure += a_aParameter[enex.FEATURE_PARAMETER_NUMBERMESSAGE];

            // Set language
            // 0x0904 = [04 09] (i.e. 2 bytes for USHORT + reversed for Big Endian)
            structure += a_aParameter[enex.FEATURE_PARAMETER_LANGID].charAt(2);
            structure += a_aParameter[enex.FEATURE_PARAMETER_LANGID].charAt(3);
            structure += a_aParameter[enex.FEATURE_PARAMETER_LANGID].charAt(0);
            structure += a_aParameter[enex.FEATURE_PARAMETER_LANGID].charAt(1);

            // Set message index
            structure += a_aParameter[enex.FEATURE_PARAMETER_MSGINDEX];

            // Set prologue (3 bytes)
            structure += a_aParameter[enex.FEATURE_PARAMETER_TEOPROTOCOL].charAt(4);
            structure += a_aParameter[enex.FEATURE_PARAMETER_TEOPROTOCOL].charAt(5);
            structure += a_aParameter[enex.FEATURE_PARAMETER_TEOPROTOCOL].charAt(2);
            structure += a_aParameter[enex.FEATURE_PARAMETER_TEOPROTOCOL].charAt(2);
            structure += a_aParameter[enex.FEATURE_PARAMETER_TEOPROTOCOL].charAt(0);
            structure += a_aParameter[enex.FEATURE_PARAMETER_TEOPROTOCOL].charAt(1);

            // Set the length of the data to sent to the smart card (verify APDU length)
            // 0x0000000D = [0D 00 00 00] (i.e. 4 bytes for ULONG + reversed for Big Endian)
            len = null;
            if (isInvalid(a_aParameter[enex.FEATURE_PARAMETER_DATALENGTH])) {

                len = (a_aParameter[enex.FEATURE_PARAMETER_DATA].length / 2).toString(16).toUpperCase();
                if (len.length < 2) {

                    len = "0" + len;
                }
                structure += len;
                structure += "00";
                structure += "00";
                structure += "00";

            } else if (a_aParameter[enex.FEATURE_PARAMETER_DATALENGTH].length === 8) {

                structure += a_aParameter[enex.FEATURE_PARAMETER_DATALENGTH];

            } else {

                // The buffer exists but without the good length
                return null;
            }

            // Set the data to send to the smart card
            structure = structure.concat(a_aParameter[enex.FEATURE_PARAMETER_DATA]);

            // Compute the size of the PPDU structure
            len = (structure.length / 2).toString(16).toUpperCase();
            if (len.length < 2) {

                len = "0" + len;
            }

            // Compute the device PPDU
            cmd = "";

            if (a_bPPDU) {

                cmd = PPDU_CLA;
                cmd += PPDU_INS;
                cmd += PPDU_P1;

                // Set the feature to FEATURE_VERIFY_PIN_DIRECT
                cmd += enex.FEATURE_VERIFY_PIN_DIRECT;

                // Set the length of the feature data
                cmd += len;
            }

            // Set the the feature data
            cmd = cmd.concat(structure);

            LoggingService.debug("computeStructureVerifyPIN - cmd (" + cmd + ")");
            LoggingService.debug("computeStructureVerifyPIN - (END)");

            return cmd;
        }



        /**
         * @private
         * @memberOf Connection
         * @function computeStructureModifyPIN
         * @desc Build a MODIFY PIN PPDU command from the incoming parameters
         * @param {Object} PPDUParameters This is the template to provide with the feature to compute the PPDU command.
         */
        function computeStructureModifyPIN(a_aParameter, a_bPPDU) {

            var structure,
                len,
                cmd;

            if (isInvalid(a_aParameter)) {

                LoggingService.error("computeStructureModifyPIN - (END)");

                return null;
            }

            if (isInvalid(a_aParameter[enex.FEATURE_PARAMETER_TIMEOUT])) {

                a_aParameter[enex.FEATURE_PARAMETER_TIMEOUT] = "00";
            }

            if (isInvalid(a_aParameter[enex.FEATURE_PARAMETER_TIMEOUT2])) {

                a_aParameter[enex.FEATURE_PARAMETER_TIMEOUT2] = "00";
            }

            if (isInvalid(a_aParameter[enex.FEATURE_PARAMETER_FORMATSTRING])) {

                a_aParameter[enex.FEATURE_PARAMETER_FORMATSTRING] = "00";
            }

            if (isInvalid(a_aParameter[enex.FEATURE_PARAMETER_PINBLOCKSTRING])) {

                a_aParameter[enex.FEATURE_PARAMETER_PINBLOCKSTRING] = "00";
            }

            if (isInvalid(a_aParameter[enex.FEATURE_PARAMETER_PINLENGTHFORMAT])) {

                a_aParameter[enex.FEATURE_PARAMETER_PINLENGTHFORMAT] = "00";
            }

            if (isInvalid(a_aParameter[enex.FEATURE_PARAMETER_INSERTIONOFFSETOLD])) {

                a_aParameter[enex.FEATURE_PARAMETER_INSERTIONOFFSETOLD] = "00";
            }

            if (isInvalid(a_aParameter[enex.FEATURE_PARAMETER_INSERTIONOFFSETNEW])) {

                a_aParameter[enex.FEATURE_PARAMETER_INSERTIONOFFSETNEW] = "08";
            }

            if (isInvalid(a_aParameter[enex.FEATURE_PARAMETER_PINMAXEXTRADIGIT], 4)) {

                a_aParameter[enex.FEATURE_PARAMETER_PINMAXEXTRADIGIT] = "0008";
            }

            if (isInvalid(a_aParameter[enex.FEATURE_PARAMETER_CONFIRMPIN])) {

                a_aParameter[enex.FEATURE_PARAMETER_CONFIRMPIN] = "03";
            }

            // Conditions under which PIN entry should be considered complete
            if (isInvalid(a_aParameter[enex.FEATURE_PARAMETER_ENTRYVALIDATIONCONDITION])) {

                // The value is a bit wise OR operation. 01h Max size reached. 02h Validation key pressed. 04h Time-out occurred.
                a_aParameter[enex.FEATURE_PARAMETER_ENTRYVALIDATIONCONDITION] = "02";
            }

            // Number  of  messages  to  display  for  PIN verification
            if (isInvalid(a_aParameter[enex.FEATURE_PARAMETER_NUMBERMESSAGE])) {

                // 00h no string. 01h Message which index is indicated in bMsgIndex. FFh default CCID message.
                a_aParameter[enex.FEATURE_PARAMETER_NUMBERMESSAGE] = "00";
            }

            if (isInvalid(a_aParameter[enex.FEATURE_PARAMETER_LANGID], 4)) {

                // Default English language
                a_aParameter[enex.FEATURE_PARAMETER_LANGID] = "0409";
            }

            if (isInvalid(a_aParameter[enex.FEATURE_PARAMETER_MSGINDEX1])) {

                a_aParameter[enex.FEATURE_PARAMETER_MSGINDEX1] = "00";
            }

            if (isInvalid(a_aParameter[enex.FEATURE_PARAMETER_MSGINDEX2])) {

                a_aParameter[enex.FEATURE_PARAMETER_MSGINDEX2] = "01";
            }

            if (isInvalid(a_aParameter[enex.FEATURE_PARAMETER_MSGINDEX3])) {

                a_aParameter[enex.FEATURE_PARAMETER_MSGINDEX3] = "02";
            }

            if (isInvalid(a_aParameter[enex.FEATURE_PARAMETER_TEOPROTOCOL], 6)) {

                a_aParameter[enex.FEATURE_PARAMETER_TEOPROTOCOL] = "000000";
            }

            // Data to send to the ICC
            if (isInvalid(a_aParameter[enex.FEATURE_PARAMETER_DATA])) {

                return null;
            }

            // Prepare the data for VERIFY_PIN_DIRECT to send to the device
            // As described into the 2.5.2 PIN_VERIFIY command details, the command is a 19 bytes buffer
            // (See PCSC Part10 IFDs with Secure PIN entry Capabilities v2.02.09)

            // Set the time-out in seconds
            structure = a_aParameter[enex.FEATURE_PARAMETER_TIMEOUT];

            // Set the time-out in seconds after the first key stroke (00 = default)
            structure += a_aParameter[enex.FEATURE_PARAMETER_TIMEOUT2];

            // Set the formatting options
            structure += a_aParameter[enex.FEATURE_PARAMETER_FORMATSTRING];

            // Set The PIN length in APDU
            structure += a_aParameter[enex.FEATURE_PARAMETER_PINBLOCKSTRING];

            // Set the PIN length format
            structure += a_aParameter[enex.FEATURE_PARAMETER_PINLENGTHFORMAT];

            structure += a_aParameter[enex.FEATURE_PARAMETER_INSERTIONOFFSETOLD];
            structure += a_aParameter[enex.FEATURE_PARAMETER_INSERTIONOFFSETNEW];

            // Set the PIN max extra digits
            // 0x0408 = [04 08] (i.e. 2 bytes for USHORT + reversed for Big Endian)
            structure += a_aParameter[enex.FEATURE_PARAMETER_PINMAXEXTRADIGIT].charAt(2);
            structure += a_aParameter[enex.FEATURE_PARAMETER_PINMAXEXTRADIGIT].charAt(3);
            structure += a_aParameter[enex.FEATURE_PARAMETER_PINMAXEXTRADIGIT].charAt(0);
            structure += a_aParameter[enex.FEATURE_PARAMETER_PINMAXEXTRADIGIT].charAt(1);

            structure += a_aParameter[enex.FEATURE_PARAMETER_CONFIRMPIN];

            // Set conditions under which PIN entry should be considered complete
            structure += a_aParameter[enex.FEATURE_PARAMETER_ENTRYVALIDATIONCONDITION];

            // Set number of message to display for PIN verification
            structure += a_aParameter[enex.FEATURE_PARAMETER_NUMBERMESSAGE];

            // Set language
            // 0x0904 = [04 09] (i.e. 2 bytes for USHORT + reversed for Big Endian)
            structure += a_aParameter[enex.FEATURE_PARAMETER_LANGID].charAt(2);
            structure += a_aParameter[enex.FEATURE_PARAMETER_LANGID].charAt(3);
            structure += a_aParameter[enex.FEATURE_PARAMETER_LANGID].charAt(0);
            structure += a_aParameter[enex.FEATURE_PARAMETER_LANGID].charAt(1);

            // Set message index
            structure += a_aParameter[enex.FEATURE_PARAMETER_MSGINDEX1];
            structure += a_aParameter[enex.FEATURE_PARAMETER_MSGINDEX2];
            structure += a_aParameter[enex.FEATURE_PARAMETER_MSGINDEX3];

            // Set prologue (3 bytes)
            structure += a_aParameter[enex.FEATURE_PARAMETER_TEOPROTOCOL].charAt(4);
            structure += a_aParameter[enex.FEATURE_PARAMETER_TEOPROTOCOL].charAt(5);
            structure += a_aParameter[enex.FEATURE_PARAMETER_TEOPROTOCOL].charAt(2);
            structure += a_aParameter[enex.FEATURE_PARAMETER_TEOPROTOCOL].charAt(2);
            structure += a_aParameter[enex.FEATURE_PARAMETER_TEOPROTOCOL].charAt(0);
            structure += a_aParameter[enex.FEATURE_PARAMETER_TEOPROTOCOL].charAt(1);

            // Set the length of the data to sent to the smart card (verify APDU length)
            // 0x0000000D = [0D 00 00 00] (i.e. 4 bytes for ULONG + reversed for Big Endian)
            len = null;
            if (isInvalid(a_aParameter[enex.FEATURE_PARAMETER_DATALENGTH])) {

                len = (a_aParameter[enex.FEATURE_PARAMETER_DATA].length / 2).toString(16).toUpperCase();
                if (len.length < 2) {

                    len = "0" + len;
                }
                structure += len;
                structure += "00";
                structure += "00";
                structure += "00";

            } else if (a_aParameter[enex.FEATURE_PARAMETER_DATALENGTH].length === 8) {

                structure += a_aParameter[enex.FEATURE_PARAMETER_DATALENGTH];

            } else {

                // The buffer exists but without the good length
                return null;
            }

            // Set the data to send to the smart card
            structure = structure.concat(a_aParameter[enex.FEATURE_PARAMETER_DATA]);

            // Compute the size of the ppdu structure
            len = (structure.length / 2).toString(16).toUpperCase();
            if (len.length < 2) {

                len = "0" + len;
            }

            // Compute the device PPDU
            cmd = "";

            if (a_bPPDU) {

                cmd = PPDU_CLA;
                cmd += PPDU_INS;
                cmd += PPDU_P1;

                // Set the feature
                cmd += enex.FEATURE_MODIFY_PIN_DIRECT;

                // Set the length of the feature data
                cmd += len;
            }

            cmd = cmd.concat(structure);

            LoggingService.debug("computeStructureModifyPIN - cmd (" + cmd + ")");
            LoggingService.debug("computeStructureModifyPIN - (END)");

            return cmd;
        }



        /**
         * @private
         * @memberOf Connection
         * @function computeStructureEscapeCommand
         * @desc Build a ESC COMMAND PPDU command from the incoming parameters
         * @param {Object} PPDUParameters This is the template to provide with the feature to compute the PPDU command.
         */
        function computeStructureEscapeCommand(a_aParameter, a_bPPDU) {

            var cmd,
                len;

            LoggingService.debug("computeStructureEscapeCommand - (BEGIN)");

            if (isInvalid(a_aParameter)) {

                LoggingService.error("computeStructureEscapeCommand - Invalid parameter");
                LoggingService.debug("computeStructureEscapeCommand - (END)");

                return null;
            }

            // Compute the device PPDU
            cmd = "";

            if (a_bPPDU) {

                cmd = PPDU_CLA;
                cmd += PPDU_INS;
                cmd += PPDU_P1;

                // Set the feature
                cmd += enex.FEATURE_CCID_ESC_COMMAND;

                // Set the length of the feature data
                len = (a_aParameter.length / 2).toString(16).toUpperCase();
                if (len.length < 2) {

                    len = "0" + len;
                }
                cmd += len;
            }

            a_aParameter.toUpperCase();

            // Set the the feature data
            cmd = cmd.concat(a_aParameter);

            LoggingService.debug("computeStructureEscapeCommand - cmd (" + cmd + ")");
            LoggingService.debug("computeStructureEscapeCommand - (END)");

            return cmd;
        }

        /**
         * @public
         * @function sendPPDU
         * @memberOf Connection
         * @desc This function send a PPDU command compliant with the PCSC specification
         * @param {Object} Callback Object containing the "success" function returning the result and "failure" function returning the error if the function fails.
         * @param {enex constant} PPDUfeature This is the feature to query.
         * <br>The allowed features are:
         * <ul>
         *	<li>enex.FEATURE_VERIFY_PIN_DIRECT</li>
         *	<li>enex.FEATURE_MODIFY_PIN_DIRECT</li>
         *	<li>enex.FEATURE_CCID_ESC_COMMAND</li>
         * </ul>
         * @param {Object} PPDUParameters This is the template to provide with the feature to compute the PPDU command.
         * <br>The list of the properties allowed are:
         * <ul>
         *	<li>enex.FEATURE_PARAMETER_TIMEOUT</li>
         *	<li>enex.FEATURE_PARAMETER_TIMEOUT2</li>
         *	<li>enex.FEATURE_PARAMETER_FORMATSTRING</li>
         *	<li>enex.FEATURE_PARAMETER_PINBLOCKSTRING</li>
         *	<li>enex.FEATURE_PARAMETER_PINLENGTHFORMAT</li>
         *	<li>enex.FEATURE_PARAMETER_PINMAXEXTRADIGIT</li>
         *	<li>enex.FEATURE_PARAMETER_ENTRYVALIDATIONCONDITION</li>
         *	<li>enex.FEATURE_PARAMETER_NUMBERMESSAGE</li>
         *	<li>enex.FEATURE_PARAMETER_LANGID</li>
         *	<li>enex.FEATURE_PARAMETER_MSGINDEX</li>
         *	<li>enex.FEATURE_PARAMETER_TEOPROTOCOL</li>
         *	<li>enex.FEATURE_PARAMETER_DATALENGTH</li>
         *	<li>enex.FEATURE_PARAMETER_DATA</li>
         *	<li>enex.FEATURE_PARAMETER_INSERTIONOFFSETOLD</li>
         *	<li>enex.FEATURE_PARAMETER_INSERTIONOFFSETNEW</li>
         *	<li>enex.FEATURE_PARAMETER_CONFIRMPIN</li>
         *	<li>enex.FEATURE_PARAMETER_MSGINDEX1</li>
         *	<li>enex.FEATURE_PARAMETER_MSGINDEX2</li>
         *	<li>enex.FEATURE_PARAMETER_MSGINDEX3</li>
         * </ul>
         * @example
         <pre>
// Construct the template according the PCSC specification and the smart card configuration
var parameters = { };
parameters[enex.FEATURE_PARAMETER_TIMEOUT] = "1E";
parameters[enex.FEATURE_PARAMETER_TIMEOUT2] = "1E";
parameters[enex.FEATURE_PARAMETER_FORMATSTRING] = "82";
parameters[enex.FEATURE_PARAMETER_PINBLOCKSTRING] = "04";
parameters[enex.FEATURE_PARAMETER_PINLENGTHFORMAT] = "00";
parameters[enex.FEATURE_PARAMETER_PINMAXEXTRADIGIT] = "0408";
parameters[enex.FEATURE_PARAMETER_ENTRYVALIDATIONCONDITION] = "02";
parameters[enex.FEATURE_PARAMETER_NUMBERMESSAGE] = "00";
parameters[enex.FEATURE_PARAMETER_LANGID] = "040C";
parameters[enex.FEATURE_PARAMETER_MSGINDEX] = "00";
parameters[enex.FEATURE_PARAMETER_TEOPROTOCOL] = "000000";
parameters[enex.FEATURE_PARAMETER_DATA] = "A020000108FFFFFFFFFFFFFFFF";

var cnx = enex.getConnection();

if(!cnx) {

  showResult(g_sTitleKO, "no available connection to the smart card");

  return;
}

// Create the callbacks to receive the response  
var resultCallback = {

  success : function (dataOut) {

    alert("Operation succeeded - Data returned by the device(" + dataOut + ")");
  },

  failure : function (a_oErrorObject) {
    alert("Operation FAILED. Error code (" + a_oErrorObject.errorCode + "). Error message (" + a_oErrorObject.message + ")");
  }
};

try {

  cnx.sendPPDU(resultCallback, enex.FEATURE_PARAMETER_FEATURE_VERIFY_PIN_DIRECT, parameters);

} catch(ex) {

  // An exception has been thrown before the command was sent to the PCR.
  alert("Command transmission failed ! " + ex.message);
}
</pre>
         *
         */
        this.sendPPDU = function (a_oCallback, a_iFeature, a_oFeatureParameters, a_bNoGUI) {

            LoggingService.debug("sendPPDU - (BEGIN)");
            LoggingService.debug("sendPPDU - a_iFeature (" + a_iFeature + ")");
            LoggingService.debug("sendPPDU - a_oFeatureParameters (" + a_oFeatureParameters + ")");
            LoggingService.debug("sendPPDU - a_bNoGUI (" + a_bNoGUI + ")");

            checkCallback(a_oCallback);

            var command = null;

            switch (a_iFeature) {

                case enex.FEATURE_VERIFY_PIN_DIRECT:
                    command = computeStructureVerifyPIN(a_oFeatureParameters, true);
                    break;

                case enex.FEATURE_MODIFY_PIN_DIRECT:
                    command = computeStructureModifyPIN(a_oFeatureParameters, true);
                    break;

                case enex.FEATURE_CCID_ESC_COMMAND:
                    command = computeStructureEscapeCommand(a_oFeatureParameters, true);
                    break;

                default:
                    callFailure(a_oCallback, manageError(-1, languageFindString("FeatureNotSupported")));
            }

            if (!command) {

                callFailure(a_oCallback, manageError(-1, languageFindString("InvalidArguments")));
            }

            // Define a callback to check the return of the verify PIN command
            function innerCallback(a_oFinalCallback) {

                return {
                    success: function (result) {
                        endTransaction();

                        modalboxClose();
                        var aStatusWord = result.statusWord,
                            aDataOut = result.dataOut,
                            errorMessage;

                        LoggingService.debug("sendPPDU.success - StatusWord (" + aStatusWord + ")");
                        LoggingService.debug("sendPPDU.success - DataOut (" + aDataOut + ")");

                        if (aStatusWord !== "9000") {

                            LoggingService.error("sendPPDU.success - dataOut present to report an error (" + aDataOut + ")");
                            LoggingService.error("sendPPDU.success - one of the incoming feature structure parameters is wrong");
                            errorMessage = checkApduResponse(aStatusWord, aDataOut);
                            callFailure(a_oFinalCallback, manageError(aStatusWord, errorMessage));

                        } else {

                            LoggingService.info("sendPPDU succeeded");
                            callSuccess(a_oFinalCallback, aDataOut);
                        }
                        LoggingService.debug("sendPPDU - (END)");
                    },

                    failure: function (a_ErrorObject) {

                        endTransaction();

                        modalboxClose();
                        LoggingService.debug("sendPPDU.failure");
                        callFailure(a_oFinalCallback, a_ErrorObject);
                        LoggingService.debug("sendPPDU - (END)");
                    }
                };
            }

            if (!a_bNoGUI) {

                modalboxOpen(languageFindString("ReaderReadInstructions"));
            }

            // Send the command to the PCR asynchronously
            apdu_Transmit(command, innerCallback(a_oCallback));

            LoggingService.debug("sendPPDU - (END)");
        };




        /**
         * @public
         * @memberOf Connection
         * @function setPersonalCardReaderLanguage
         * @desc Change the PCR language with the PPDU CCID ESC_COMMAND command
         * @param {Object} Callback Object containing the "success" function returning the result and "failure" function returning the error if the function fails.
         * @param {String} USB Language identifier to set. No modification is applied if the language is not supported by the PCR. Example: "0409" for English, "040C" for French.
         * @param {Boolean} TemporaryChange Set a true value for a temporary change or false for a permanent change.
         * @param {Boolean} SmartcardLanguage A language is also defined into the smart card. Set a true value if the smart card language must be efficient when the PCR is powered on.
         * @example
         <pre>
         // Create a callback
         var resultCallback = {

         success : function (a_oArgs) { alert("Operation succeeded"); },

         failure : function (a_oError) { alert("Operation FAILED. Error message :" + a_oError.message + ". Error code : " + a_oError.errorCode); }

         };

         var cnx = enex.getConnection();

         if(cnx) {

         cnx.setPersonalCardReaderLanguage(resultCallback, "0409", true, false);

         }
         </pre>
         */
        this.setPersonalCardReaderLanguage = function (a_oCallback, a_Language, a_bTemporaryChange, a_bCardLanguage) {

            if (!a_Language || (a_Language.length !== 4)) {

                callFailure(a_oCallback, manageError(-1, languageFindString("InvalidArguments")));
            }

            if ((a_bTemporaryChange !== true) && (a_bTemporaryChange !== false)) {

                a_bTemporaryChange = true;
            }

            if ((a_bCardLanguage !== true) && (a_bCardLanguage !== false)) {

                a_bCardLanguage = true;
            }

            var oFeatureParameters = "6D";

            if (true === a_bTemporaryChange) {

                oFeatureParameters += (a_bCardLanguage ? "02" : "04");

            } else {

                oFeatureParameters += (a_bCardLanguage ? "01" : "03");
            }

            oFeatureParameters += a_Language;


            this.sendPPDU(a_oCallback, enex.FEATURE_CCID_ESC_COMMAND, oFeatureParameters, true);
        };


        /**
         * @public
         * @memberOf Connection
         * @function getPersonalCardReaderLanguage
         * @desc Gets the PCR language with the PPDU CCID ESC_COMMAND command
         * @param {Object} Callback Object containing the "success" function returning the result and "failure" function returning the error if the function fails.
         * @example
         <pre>
         // Create a callback
         var resultCallback = {

         success : function (a_oArgs) { alert("Current language is" + a_oArgs); },

         failure : function (a_oArgs) { alert("Operation FAILED !!!!"); }

         };

         var cnx = enex.getConnection();

         if(cnx) {

         cnx.getPersonalCardReaderLanguage(resultCallback);

         }
         </pre>
         */
        this.getPersonalCardReaderLanguage = function (a_oCallback) {

            var oFeatureParameters = "6D";

            this.sendPPDU(a_oCallback, enex.FEATURE_CCID_ESC_COMMAND, oFeatureParameters, true);
        };


        ////////////////////////////////////////////////////////////////
        // SECURE PIN ENTRY SUPPORT
        ////////////////////////////////////////////////////////////////

        this.featuresPCSC = [];

        // Get reader features
        function readerGetFeatures(speCallback) {

            LoggingService.info("readerGetFeatures - (BEGIN)");

            checkCallback(speCallback);

            thatInstance.featuresPCSC = [];

            var CM_IOCTL_GET_FEATURE_REQUEST = 3400,
                sendBuffer = "",
                raw = false,
                expectedLen = 19 * 6,
                cb = {

                    success: function (aDataOut) {

                        endTransaction();

                        // Check the result
                        var errorMessage = checkApduResponse(aDataOut, null, null),
                            responseLen,
                            i,
                            tag,
                            len,
                            val;

                        if (errorMessage) {

                            LoggingService.error("=============== found error " + errorMessage);
                            speCallback.failure(errorMessage);
                            return;
                        }

                        responseLen = aDataOut.length;
                        for (i = 0; i < responseLen; i += 12) {

                            tag = aDataOut.substr(i, 2);
                            len = aDataOut.substr(i + 2, 2);
                            val = aDataOut.substr(i + 4, 8);
                            LoggingService.info("readerGetFeatures - tag (" + tag + ") - len (" + len + ") - val (" + val + ")");
                            thatInstance.featuresPCSC[tag] = val;
                        }
                        LoggingService.info("readerGetFeatures - response (" + aDataOut + ")");

                        speCallback.success();
                    },

                    failure: function (a_ErrorCode) {

                        LoggingService.error("readerGetFeatures - errorCode (" + a_ErrorCode + ")");
                        speCallback.failure(a_ErrorCode);
                    }
                };

            try {

                apdu_control(cb, CM_IOCTL_GET_FEATURE_REQUEST, sendBuffer, raw, expectedLen);

            } catch (e) {

                LoggingService.error("readerGetFeatures - e (" + e + ")");
                return;
            }

            LoggingService.info("readerGetFeatures - (END)");
        }




        /**
         * @memberOf Connection
         * @function sendSPE
         * @desc This function executes Secure Pin entry operations. This function ONLY applies if the Gemalto driver is installed.
         * @param {Object} Callback Object containing the "success" function returning the result and "failure" function returning the error if the function fails.		 *
         * @param {String} Feature A string containing the SPE operation to perform (enex.FEATURE_VERIFY_PIN_DIRECT, enex.FEATURE_MODIFY_PIN_DIRECT , enex.FEATURE_CCID_ESC_COMMAND)
         * @param {String} Parameters A string containing the parameters attached to the SPE operation to perform
		 * @example
         * <pre>
      var cnx = enex.getConnection();
      if(!cnx) {

        alert("no available connection to the smart card");

        return;
      }

      var parameters = { };
      parameters[<span class="text-success">enex.FEATURE_PARAMETER_TIMEOUT</span>] = document.getElementById("verify_timeOut").value;
      parameters[<span class="text-success">enex.FEATURE_PARAMETER_TIMEOUT2</span>] = document.getElementById("verify_timeOut2").value;
      parameters[<span class="text-success">enex.FEATURE_PARAMETER_FORMATSTRING</span>] = document.getElementById("verify_formatingOptions").value;
      parameters[<span class="text-success">enex.FEATURE_PARAMETER_PINBLOCKSTRING</span>] = document.getElementById("verify_pinBlockString").value;
      parameters[<span class="text-success">enex.FEATURE_PARAMETER_PINLENGTHFORMAT</span>] = document.getElementById("verify_pinLengthFormat").value;
      parameters[<span class="text-success">enex.FEATURE_PARAMETER_PINMAXEXTRADIGIT</span>] = document.getElementById("verify_pinMaxExtraDigits").value;
      parameters[<span class="text-success">enex.FEATURE_PARAMETER_ENTRYVALIDATIONCONDITION</span>] = document.getElementById("verify_entryValidationCondition").value;
      parameters[<span class="text-success">enex.FEATURE_PARAMETER_NUMBERMESSAGE</span>] = document.getElementById("verify_numberMessage").value;
      parameters[<span class="text-success">enex.FEATURE_PARAMETER_LANGID</span>] = document.getElementById("verify_languageId").value;
      parameters[<span class="text-success">enex.FEATURE_PARAMETER_MSGINDEX</span>] = document.getElementById("verify_messageIndex").value;
      parameters[<span class="text-success">enex.FEATURE_PARAMETER_TEOPROTOCOL</span>] = document.getElementById("verify_teoProtocol").value;
      // If the data length field is not present in the template, EWC will compute the length itself from the data field
      //parameters[enex.FEATURE_PARAMETER_DATALENGTH] = document.getElementById("verify_dataLength").value;
      parameters[<span class="text-success">enex.FEATURE_PARAMETER_DATA</span>] = document.getElementById("verify_data").value;


// Create a callback to treat the return of the asynchronous function
var resultCallback = {

  success : function (aDataOut) {

    alert("Operation succeeded - data (" + aDataOut + ")");
  },

  failure : function (a_oError) {

    var message = "Operation FAILED.";
    message += " Error (" + a_oError.errorCode + ").";
    message += " Message (" + a_oError.message + ")";
    alert(message);
  }

};

  var cnx = enex.getConnection();

  if(!cnx) {

    alert("no available connection to the smart card");

    return;
  }

    cnx.sendSPE(resultCallback, enex.FEATURE_VERIFY_PIN_DIRECT, parameters);
           </pre>
         */
        this.sendSPE = function (a_oCallback, a_iFeature, a_oFeatureParameters) {

            LoggingService.debug("sendSPE - (BEGIN)");
            LoggingService.debug("sendSPE - a_iFeature (" + a_iFeature + ")");
            LoggingService.debug("sendSPE - a_oFeatureParameters (" + a_oFeatureParameters + ")");

            checkCallback(a_oCallback);

            var speCallback = function (a_oCallback) {

                return {

                    success: function () {

                        // Verify the feature is supported
                        var controlCode = thatInstance.featuresPCSC[a_iFeature],
                            command = null;

                        if (!controlCode) {

                            callFailure(a_oCallback, manageError(-1, languageFindString("FeatureNotSupported")));
                            return;
                        }

                        switch (a_iFeature) {

                            case enex.FEATURE_VERIFY_PIN_DIRECT:
                                command = computeStructureVerifyPIN(a_oFeatureParameters);
                                break;

                            case enex.FEATURE_MODIFY_PIN_DIRECT:
                                command = computeStructureModifyPIN(a_oFeatureParameters);
                                break;

                            case enex.FEATURE_CCID_ESC_COMMAND:
                                command = computeStructureEscapeCommand(a_oFeatureParameters);
                                break;

                            default:
                                callFailure(a_oCallback, manageError(-1, languageFindString("FeatureNotSupported")));
                        }

                        if (!command) {

                            callFailure(a_oCallback, manageError(-1, languageFindString("InvalidArguments")));
                            return;
                        }

                        // Define a callback to check the return of the verify PIN command
                        function innerCallback(a_oFinalCallback) {

                            return {

                                success: function (aDataOut) {

                                    endTransaction();
                                    modalboxClose();
                                    LoggingService.debug("sendSPE.success - DataOut (" + aDataOut + ")");

                                    // Check the result
                                    var errorMessage = isError(aDataOut);
                                    if (errorMessage) {

                                        callFailure(a_oFinalCallback, manageError(aDataOut, errorMessage));
                                        return;
                                    }

                                    LoggingService.info("sendSPE succeeded");
                                    LoggingService.debug("sendSPE - (END)");
                                    callSuccess(a_oFinalCallback, aDataOut);
                                },

                                failure: function (a_ErrorCode) {

                                    modalboxClose();
                                    LoggingService.error("sendSPE failed (" + a_ErrorCode + ")");
                                    callFailure(a_oFinalCallback, a_ErrorCode);
                                    LoggingService.debug("sendSPE - (END)");
                                }
                            };
                        }

                        modalboxOpen(languageFindString("ReaderReadInstructions"));

                        // Send the command to the PCR asynchronously
                        apdu_control(innerCallback(a_oCallback), controlCode, command);
                    },

                    failure: function (a_ErrorCode) {

                        LoggingService.error("sendSPE failed (" + a_ErrorCode + ")");
                        callFailure(a_oCallback, a_ErrorCode);
                        LoggingService.debug("sendSPE - (END)");
                    }
                };
            };

            // Retrieve the features supported by the PCR
            readerGetFeatures(speCallback(a_oCallback));

            LoggingService.debug("sendSPE - (END)");
        };


        ////////////////////////////////////////////////////////////////
        // SECURE CHANNEL Support
        ////////////////////////////////////////////////////////////////


        /**
         * @private
         * @memberOf Connection
         * @function secureChannelComputeP2
         * @desc Compute the P2 element of the APDU commands for all Secure Channel operations
         * @param {Boolean} a_EncryptionIndicator True if the SecureChannel must by encrypted.
         * @param {Boolean} a_SecureChannel_TerminateSecureChannelIndicator True if the SecureChannel must terminate on error.
         * @param {Boolean} a_WaitCardIndicator True if the SecureChannel must wait for a smart card.
         */
        function secureChannelComputeP2(a_EncryptionIndicator, a_SecureChannel_TerminateSecureChannelIndicator, a_WaitCardIndicator) {

            // Set no option by default
            var p2 = 1,
                P2;

            if (a_EncryptionIndicator) {

                p2 += 0x80;
            }

            if (a_SecureChannel_TerminateSecureChannelIndicator) {

                p2 += 0x40;
            }

            if (a_WaitCardIndicator) {

                p2 += 0x20;
            }

            P2 = ((p2 <= 0x0F) ? "0" : "");
            P2 += p2.toString(16);
            return P2;
        }


        /**
         * @private
         * @memberOf Connection
         * @function secureChannelComputeAPDU
         * @desc Build the targeted secure channel command
         * @param {Inner EWC constant} a_SecureChannelOperation Secure Channel command code.
         * @param {String} a_SecureChannelData Data required to build the Secure Channel command.
         * @param {Boolean} a_SecurityEnabledIndicator True if the SecureChannel is already established.
         * @param {Boolean} a_EncryptionIndicator True if the SecureChannel must by encrypted.
         * @param {Boolean} a_SecureChannel_TerminateSecureChannelIndicator True if the SecureChannel must terminate on error.
         * @param {Boolean} a_WaitCardIndicator True if the SecureChannel must wait for a smart card.
         */
        function secureChannelComputeAPDU(a_SecureChannelOperation, a_SecureChannelData, a_SecurityEnabledIndicator, a_Encryption_Indicator, a_SecureChannel_TerminateSecureChannelIndicator, a_WaitCardIndicator) {

            LoggingService.debug("secureChannelComputeAPDU - (BEGIN)");

            if ((null === a_SecureChannelOperation) || ("undefined" === typeof (a_SecureChannelOperation))) {

                throwException(languageFindString("InvalidSecureChannelOperationParameter"));
            }

            var CLAS = CLA_MAC_SECURITY_ENABLED,
                apdu,
                P2,
                len;

            // Add the class to the APDU command
            // Can be with or without security enabled
            if ((null !== a_SecurityEnabledIndicator) && ("undefined" !== typeof (a_SecurityEnabledIndicator))) {

                CLAS = (a_SecurityEnabledIndicator ? CLA_MAC_SECURITY_ENABLED : CLA_MAC_SECURITY_NOT_ENABLED);
            }

            apdu = CLAS;

            // Add the instruction to the APDU command
            apdu += INS;

            // Add the parameter 1 to the APDU command which is the security Channel operation to proceed
            apdu += a_SecureChannelOperation;

            // Add the parameter 2 to the APDU command which are the security Channel operation options
            P2 = secureChannelComputeP2(a_Encryption_Indicator, a_SecureChannel_TerminateSecureChannelIndicator, a_WaitCardIndicator);
            apdu += P2;

            // Add the data (if any) to the APDU command
            if (a_SecureChannelData && (a_SecureChannelData.length > 1)) {

                len = (a_SecureChannelData.length / 2);
                len = ((len <= 0x0F) ? "0" : "") + len;

                apdu += len.toString(16).toUpperCase();
                apdu += a_SecureChannelData;
            }

            LoggingService.debug("secureChannelComputeAPDU - APDU (" + apdu + ")");
            LoggingService.debug("secureChannelComputeAPDU - (END)");
            return apdu;
        }


        /**
         * @memberOf Connection
         * @function SecureChannelEstablishment
         * @desc This function establishes the Secure Channel.
         * @param {Object} Callback Object containing the "success" function returning the Secure Channel configuration and "failure" function returning the error if the function fails.		 *
         * @param {String} UnpredictableNumber A string containing the unpredictable number.
         * @param {String} SecureChannelConfiguration A string containing the Secure Channel Configuration.
         * @param {String} PasscodeConfiguration A string containing the Passcode Configuration.
         * @param {String} ApplicationSelectionList A string containing the Application Selection List.
         * @param {Number} EncryptionIndicator 1 if encryption is required otherwise 0. This parameter is stored and used for all command until the secure channel termination.
         * @param {Number} TerminateSecureChannelIndicator 1 if the PCR must terminate the Secure Channel after processing of the command otherwise 0. This parameter is stored and used for all command until the secure channel termination.
         * @param {Number} WaitCardIndicator 1 if the PCR must request the card holder to insert a smart card otherwise 0. This parameter is stored and used for all command until the secure channel termination.
         * @example
         * <pre>
    var cnx = enex.getConnection();
    if(!cnx) {

        alert("no available connection to the smart card");
        return;
    }

var resultCallback = {

  success : function (a_oArgs) {

    alert("Operation succeeded - The device returned the following data (" + a_oArgs + ")");
  },

  failure : function (a_oError) {

    var message = "Operation FAILED.";
    message += " Error (" + a_oError.errorCode + ").";
    message += " Message (" + a_oError.message + ")";
    alert(message);
  }

};

    var sUnpredictableNumber = "94882455";
    var sSecureChannelConfiguration = "20109840000011223344111222330000";
    var sPassCodeConfiguration = null;
    var sApplicationSelectionList = null;
    var bEncryption_Indicator = 0;
    var bTerminate_Secure_Channel_Indicator = 0;
    var bWait_Card_Indicator = 0;

    cnx.secureChannelEstablishment(resultCallback, 
                                    sUnpredictableNumber,
                                    sSecureChannelConfiguration,
                                    sPassCodeConfiguration,
                                    sApplicationSelectionList,
                                    bEncryption_Indicator,
                                    bTerminate_Secure_Channel_Indicator,
                                    bWait_Card_Indicator);
         </pre>
         */
        this.secureChannelEstablishment = function (a_oCallback,
            a_sUnpredictableNumber,
            a_sSecureChannelConfiguration,
            a_sPasscodeConfiguration,
            a_sApplicationSelectionList,
            a_EncryptionIndicator,
            a_TerminateSecureChannelIndicator,
            a_WaitCardIndicator) {

            LoggingService.debug("SecureChannelEstablishment - (BEGIN)");
            LoggingService.debug("SecureChannelEstablishment - a_sUnpredictableNumber (" + a_sUnpredictableNumber + ")");
            LoggingService.debug("SecureChannelEstablishment - a_sSecureChannelConfiguration (" + a_sSecureChannelConfiguration + ")");
            LoggingService.debug("SecureChannelEstablishment - a_sPasscodeConfiguration (" + a_sPasscodeConfiguration + ")");
            LoggingService.debug("SecureChannelEstablishment - a_sApplicationSelectionList (" + a_sApplicationSelectionList + ")");
            LoggingService.debug("SecureChannelEstablishment - a_EncryptionIndicator (" + a_EncryptionIndicator + ")");
            LoggingService.debug("SecureChannelEstablishment - a_TerminateSecureChannelIndicator (" + a_TerminateSecureChannelIndicator + ")");
            LoggingService.debug("SecureChannelEstablishment - a_WaitCardIndicator (" + a_WaitCardIndicator + ")");

            checkCallback(a_oCallback);

            if ((null === a_sSecureChannelConfiguration) || ("undefined" === typeof (a_sSecureChannelConfiguration))) {

                throwException(languageFindString("InvalidArguments"));
            }

            // Manage the unpredictable number used as challenge for Challenge Approval.
            var sUnpredictableNumber = "",
                sSecureChannelConfigurationData = "",
                sApplicationSelectionList = "",
                applications = "",
                DATA_APPLICATION_IDENTIFIER_TAG = "9F06",
                sPasscodeConfiguration = "",
                data,
                i,
                DATA_PASSCODE_CONFIGURATION_TAG = "DF71",
                P2,
                apdu,
                lc;

            if (a_sUnpredictableNumber) { //} && is_all_digits(a_sUnpredictableNumber)) {

                sUnpredictableNumber = tlv(DATA_UNPREDICTABLE_NUMBER_TAG, pad_string(a_sUnpredictableNumber, DATA_UNPREDICTABLE_NUMBER_LEN, "0", "left"));
            }

            if (a_sSecureChannelConfiguration) { //} && is_all_digits(a_sSecureChannelConfiguration)) {

                sSecureChannelConfigurationData = tlv(DATA_SECURE_CHANNEL_CONFIGURATION_TAG, a_sSecureChannelConfiguration);
            }

            // Application Selection List
            // The Application Selection List (ASL) is a template with tag value E7 that contains a list of Application
            // Identifier (AID) data elements. The ASL can contain up to 10 AIDs.
            // The AID is a data element (5-16 bytes) with tag value 9F06 that is used by the PCR for Card holder Authentication Application selection.
            if (a_sApplicationSelectionList && (a_sApplicationSelectionList instanceof Array)) {

                for (i = 0; i < a_sApplicationSelectionList.length; i = i + 1) {

                    if (is_all_digits(a_sApplicationSelectionList[i])) {

                        applications += tlv(DATA_APPLICATION_IDENTIFIER_TAG, a_sApplicationSelectionList[i]);
                    }
                }
                if (applications.length > 1) {
                    sApplicationSelectionList = tlv(DATA_APPLICATION_SELECTION_LIST_TAG, applications);
                }
            }

            if (a_sPasscodeConfiguration && is_all_digits(a_sPasscodeConfiguration)) {

                sPasscodeConfiguration = tlv(DATA_PASSCODE_CONFIGURATION_TAG, a_sPasscodeConfiguration);
            }

            // final data
            data = sUnpredictableNumber + sSecureChannelConfigurationData + sApplicationSelectionList + sPasscodeConfiguration;

            SecureChannel_EncryptionIndicator = a_EncryptionIndicator;
            SecureChannel_TerminateSecureChannelIndicator = a_TerminateSecureChannelIndicator;
            SecureChannel_WaitCardIndicator = a_WaitCardIndicator;

            // P2 options:
            P2 = secureChannelComputeP2(SecureChannel_EncryptionIndicator, SecureChannel_TerminateSecureChannelIndicator, SecureChannel_WaitCardIndicator);
            apdu = CLA_MAC_SECURITY_NOT_ENABLED + INS + P1_SECURE_CHANNEL_ESTABLISHMENT + P2;
            lc = (data.length / 2).toString(16).toUpperCase();
            if (lc.length < 2) {
                lc = "0" + lc;
            }
            apdu += lc;
            apdu += data;

            LoggingService.debug("SecureChannelEstablishment - apdu (" + apdu + ")");

            // Define a callback to check the return of the apdu
            function innerCallbackSecureChannelEstablishment(a_oFinalCallback) {

                return {
                    success: function (result) {
                        endTransaction();
                        modalboxClose();
                        var aStatusWord = result.statusWord,
                            aDataOut = result.dataOut;

                        LoggingService.debug("innerCallbackSecureChannelEstablishment.success - (BEGIN)");
                        LoggingService.debug("innerCallbackSecureChannelEstablishment.success - StatusWord (" + aStatusWord + ")");
                        LoggingService.debug("innerCallbackSecureChannelEstablishment.success - aDataOut (" + aDataOut + ")");
                        LoggingService.debug("innerCallbackSecureChannelEstablishment.success - (END)");

                        if (aStatusWord !== "9000") {

                            callFailure(a_oFinalCallback, manageError(aStatusWord));
                            return;
                        }

                        SecureChannel_isEstablished = true;

                        callSuccess(a_oFinalCallback, aDataOut);
                    },

                    failure: function (a_ErrorObject) {
                        endTransaction();

                        SecureChannel_isEstablished = false;
                        SecureChannel_EncryptionIndicator = null;
                        SecureChannel_TerminateSecureChannelIndicator = null;
                        SecureChannel_WaitCardIndicator = null;

                        LoggingService.debug("innerCallbackSecureChannelEstablishment.failure - (BEGIN)");
                        LoggingService.debug("innerCallbackSecureChannelEstablishment.failure - errorCode (" + a_ErrorObject.errorCode + ")");
                        LoggingService.debug("innerCallbackSecureChannelEstablishment.failure - message (" + a_ErrorObject.message + ")");

                        modalboxClose();

                        callFailure(a_oFinalCallback, a_ErrorObject);

                        LoggingService.debug("innerCallbackSecureChannelEstablishment.failure - (END)");
                    }
                };
            }

            modalboxOpen(languageFindString("ReaderReadInstructions"));

            // Send the apdu to the PCR asynchronously
            apdu_Transmit(apdu, innerCallbackSecureChannelEstablishment(a_oCallback));
        };



        /**
         * @public
         * @memberOf Connection
         * @function SecureChannelTermination
         * @desc This function ends the Secure Transaction previously established.
         * @param {Object} Callback Object containing the "success" function returning the result and "failure" function returning the error if the function fails.
         * @param {String} MAC MAC/Encrypted block to add as data to the command.
         * @example
         * <pre>
         var resultCallback = {

         success : function (a_oArgs) {
         alert("Secured Channel command returned " + a_oArgs);
         },

         failure : function (a_oArgs) {
         alert("Secure Channel command FAILED !!!! Error: " + a_oArgs);
         }

         };

         var c = enex.getConnection();
         if(c) {
         c.SecureChannelTermination(resultCallback, MAC);
         }
         * </pre>
         */
        this.secureChannelTermination = function (a_oCallback, a_sMAC) {

            LoggingService.debug("SecureChannelTermination - (BEGIN)");

            checkCallback(a_oCallback);

            // Check the MAC or Cypher and MAC data are present
            if (!a_sMAC || ("undefined" === typeof (a_sMAC)) || (a_sMAC.length < 1)) {

                LoggingService.error("SecureChannelTermination - Invalid parameter MAC");
                callFailure(a_oCallback, manageError(-1, languageFindString("InvalidArguments")));
                return;
            }

            // Compute the Secure Channel transaction to send to the PCR
            // Can throw an exception if the information needed to build the transaction are inconsistent
            var apdu = secureChannelComputeAPDU(P1_SECURE_CHANNEL_TERMINATION, a_sMAC, 1, SecureChannel_EncryptionIndicator);

            LoggingService.debug("SecureChannelTermination - APDU (" + apdu + ")");

            // Define a callback to check the return of the APDU
            function innerCallbackSecureChannel(a_oFinalCallback) {

                return {
                    success: function (result) {

                        endTransaction();
                        var aStatusWord = result.statusWord,
                            aDataOut = result.dataOut;

                        LoggingService.debug("SecureChannelTermination.success - (BEGIN)");
                        LoggingService.debug("SecureChannelTermination.success - StatusWord (" + aStatusWord + ")");
                        LoggingService.info("SecureChannelTermination - Successfully terminated. PCR returned (" + aDataOut + ")");

                        modalboxClose();

                        if (aStatusWord !== "9000") {

                            callFailure(a_oFinalCallback, manageError(aStatusWord));
                            return;
                        }

                        LoggingService.debug("SecureChannelTermination.success - (END)");
                        callSuccess(a_oFinalCallback, aDataOut);
                    },

                    failure: function (a_ErrorObject) {
                        endTransaction();

                        LoggingService.debug("SecureChannelTermination.failure - (BEGIN)");
                        LoggingService.debug("SecureChannelTermination.failure - errorCode (" + a_ErrorObject.errorCode + ")");
                        LoggingService.debug("SecureChannelTermination.failure - message (" + a_ErrorObject.message + ")");

                        modalboxClose();

                        LoggingService.debug("SecureChannelTermination.failure - (END)");

                        callFailure(a_oFinalCallback, a_ErrorObject);
                    }
                };
            }

            // Send the APDU to the PCR asynchronously
            apdu_Transmit(apdu, innerCallbackSecureChannel(a_oCallback));
        };


        ////////////////////////////////////////////////////////////////
        // SIGN WHAT YOU SEE
        ////////////////////////////////////////////////////////////////


        /**
         * @private
         * @memberOf Connection
         * @method format_swys
         * @desc Creates the SWYS command.
         */
        function format_swys(primitive, data) {
            var bytes,
                decimalPosValue,
                len;

            if (primitive.type === "DID") {
                if (data.length < 3) {
                    throwException(languageFindString("InvalidDecimalValue"));
                }

                decimalPosValue = data.charAt(data.length - 3);
                if (decimalPosValue !== '.' && decimalPosValue !== ',') {
                    throwException(languageFindString("InvalidDecimalValue"));
                }

                // Remove '.' or ',' from string
                data = data.substring(0, data.length - 3) +
                    data.substring(data.length - 2, data.length);

                if (!is_all_digits(data)) {
                    throwException(languageFindString("InvalidDecimalValue"));
                }
            }

            if (data.length < primitive.min_length || data.length > primitive.max_length) {
                throwException(languageFindString("InvalidDataLength"));
            }

            if (!is_all_digits(data)) {
                throwException(languageFindString("InputMustBeDigitsOnly"));
            }

            if (primitive.bcd) {
                bytes = ((data.length % 2 !== 0) ? ("0" + data) : data);
            } else if (primitive.type === "NID" || primitive.type === "DID") {
                // PadLength is always 12 for numbericInputDialog and
                // DecimalInputDialog and is not related to min/max-length which is
                // a configuration of the device. By always padding to twelve the
                // OTP is the same regardless of how many digits we can input in
                // the device.
                bytes = ascii_bytes(data, 12);
            } else {
                bytes = ascii_bytes(data);
            }
            len = byteArrayToHexString([bytes.length / 2]);
            return (primitive.tag + len.toUpperCase() + bytes);
        }


        /**
         * @private
         * @memberOf Connection
         * @method format_swys_sd
         * @desc Creates the TLV for currency of the SWYS command.
         */
        function format_swys_sd(primitive, data) {
            var value = primitive.allowed_values[data];
            if (!value) {
                throwException(languageFindString("UnknownValue"));
            }
            if (primitive.bcd) {
                return tlv(primitive.tag, get_currency_code_bcd(g_ReaderConfiguration.configuration.currencies, data));
            } else {
                return tlv(primitive.tag, ascii_bytes(value));
            }
        }


        /**
         * @private
         * @memberOf Connection
         * @method format_swys_e0
         */
        function format_swys_e0(primitive, data, displaySizes) {
            var found_matching_display_size = false,
                text,
                i,
                width,
                height;

            if (displaySizes) {

                for (i = 0; i < displaySizes.length; i = i + 1) {
                    width = displaySizes[i][0];
                    height = displaySizes[i][1];

                    //                    if (data.length > height) {
                    //                        continue;
                    //                    }
                    if (data.length <= height) {
                        text = "";
                        for (i = 0; i < data.length; i = i + 1) {
                            text += pad_string(data[i], width, " ");
                        }
                        for (i = data.length; i < height; i = i + 1) {
                            text += pad_string("", width, " ");
                        }

                        found_matching_display_size = true;
                        break;
                    }
                }
            }

            if (!found_matching_display_size) {
                throwException("Too many lines in free text data.");
            }

            return tlv(primitive.tag, ascii_bytes(text));
        }


        /**
         * @private
         * @memberOf Connection
         * @method mk_sign_buffer
         * @desc Creates the TLVs for each data of the SWYS command.
         */
        function mk_sign_buffer(swys_primitives, sign_data, displaySizes) {

            var prev_was_currency = false,
                buffer = "",
                i,
                primitive_name,
                data,
                primitive;

            // An extra comma in an array will be ignored by Chrome/FF/Safari while IE treats it as another object in the array. Example: [1, 2, 3,]
            if (!sign_data[sign_data.length - 1]) {

                sign_data.pop();
            }

            for (i = 0; i < sign_data.length; i = i + 1) {
                primitive_name = sign_data[i][0];
                data = sign_data[i][1];
                primitive = swys_primitives[primitive_name];
                if (!primitive) {

                    throwException(languageFindString("UnknownSWYSPrimitive") + primitive_name);
                }

                // Make sure that the INPUT_CURRENCY primitive is not used without a INPUT_AMOUNT_WITH_CURRENCY primitive following.
                if (primitive_name === "INPUT_CURRENCY") {

                    prev_was_currency = true;
                } else if ((primitive_name === "INPUT_AMOUNT_WITH_CURRENCY") && prev_was_currency) {

                    prev_was_currency = false;
                } else if (primitive_name === "INPUT_AMOUNT_WITH_CURRENCY") {

                    throwException(languageFindString("InvalidINPUT_AMOUNT_WITH_CURRENCYParameter"));
                }

                if (primitive.type === 'ID' || primitive.type === 'IDG' || primitive.type === 'NID' || primitive.type === 'DID') {
                    buffer += format_swys(primitive, data);
                } else if (primitive.type === 'SD') {
                    buffer += format_swys_sd(primitive, data);
                } else if (primitive.type === 'MD') {
                    buffer += tlv(primitive.tag);
                } else if (primitive.type === 'E0') {
                    buffer += format_swys_e0(primitive, data, displaySizes);
                } else if (primitive.type === 'E1') {
                    buffer += tlv(primitive.tag, data);
                } else {

                    throwException(languageFindString("InvalidPrimitiveType"));
                }
            }

            // Throw an exception if the last primitive was a INPUT_CURRENCY
            // primitive.
            if (prev_was_currency) {
                throwException(languageFindString("InvalidCurrencyWithoutAmountParameter"));
            }

            // The buffer is a hexadecimal string
            if (buffer.length > MAX_SIGN_BUFFER_BYTE_SIZE * 2) {
                throwException(languageFindString("MaximumSignBufferSizeExceeded"));
            }
            return buffer;
        }



        /**
         * @public
         * @memberOf Connection
         * @method swys
         * @desc Creates a SWYS OTP.
         * @param {Object} Callback Object containing the "success" function returning the result and "failure" function returning the error if the function fails.
         * @param {String} Application Either "BANK" or "SHOP", indicating what card application priority list that should be used for OTP creation, which
         * decides which Application ID (AID) that will be chosen on the card.<br> The recommendation is to use "SHOP" when doing eCommerce 3D-secure authentication
         * (MasterCard SecureCode and Verified by Visa), and "BANK" in all other cases.
         * @param {Array} DataToSign This array contains the data to be signed. The format of this data must conform to the configuration sent to the "init" function.
         * @param {String} Algorithm Either enex.SWYS_ALGO_GEMALTO, enex.SWYS_ALGO_MODE2TDS, enex.SWYS_ALGO_MODE3TDS, enex.SWYS_ALGO_GEMALTO_SHA256, or  enex.SWYS_ALGO_MODE2TDS_SHA256 or enex.SWYS_ALGO_MODE3TDS_SHA256, indicating which algorithm should be used for OTP creation.
         * àparam {Array of array} DisplaySizes This array contains the possible widths & lengths of the device screen. Each element of the array is an array which 2 cells: the first one is the width of the screen (for example 17 when the a screen line is eble to display 17 characters), the second one is the height of the screen (for example 4 when the screen is able to display 4 lines). If the parameter is not set then a default array of [17,4] array is used. Typically an invocation to the 'getPersonalCarddeviceInformation' (replace the deprecated function '_get_device_info') returns the screen size characteristics (from the tag 'D0' of the returned TLV buffer).
         * @example
         <pre>
// Create a callback to treat the return
var resultCallback = {

    success : function (a_oConnection, a_sToken) {

    // Reset the token display on the HTML page
    alert("Your token " + a_sToken + " has been successfully generated");

  },

  failure : function (a_oConnection, a_oError) {

    var sMessage = "Your token has NOT been generated.";
    sMessage += " Error (" + a_oError.errorCode + ").";
    sMessage += " Message (" + a_oError.message + ")";
    alert(sMessage);
  }
};

var cnx = enex.getConnection();
if((null == cnx) || (typeof (cnx) == "undefined")) {

    alert("no available connection to the smart card");
    return;
}

    var targetedApplication = "BANK";
    //var targetedApplication = "SHOP";

    var aData = [
        ["INPUT_CHALLENGE", "12345"],
        ["INPUT_BUY_SELL", "SELL"],
        ["INPUT_DATA",  "1234"],
        ["INPUT_DATA_2",  "2345"],
        ["INPUT_DATA_3",  "3456"],
        ["INPUT_DATA_4",  "4567"],
        ["INPUT_DATA_5",  "5678"],
        ["INPUT_CURRENCY", "USD"],
        ["INPUT_AMOUNT_WITH_CURRENCY", "99.99"],
        ["FREE_TEXT",
            [
                "Do you agree ?",
                "Press ok"
           ]
       ]
   ];

  var sAlgo = enex.SWYS_ALGO_GEMALTO;

  // Set the possible displays to first 17 characters on 4 lines or 17 characters on 5 lines
  var DisplaySizes = [[17,4], [17,5]];
    cnx.swys(resultCallback, targetedApplication, aData, sAlgo, DisplaySizes);
</pre>
         */

        this.swys = function (a_oCallback, a_sApplication, a_DataToSign, a_sAlgo, a_DisplaySizes) {

            LoggingService.debug("SignWhatYouSee - (BEGIN)");

            checkCallback(a_oCallback);

            var displaySizes = [
                [17, 4],
                [17, 3]
            ],
                aid = {
                    "DEVICE_CONFIGURATION": "00",
                    "BANK": "01",
                    "SHOP": "02"
                }[a_sApplication],
                algo = {
                    "gemalto": "00",
                    "mode2tds": "01",
                    "mode3tds": "02",
                    "gemalto_SHA256": "10",
                    "mode2tds_SHA256": "11",
                    "mode3tds_SHA256": "12"
                }[a_sAlgo],
                buffer = null,
                len,
                apdu;

            if (!aid) {

                LoggingService.error("SignWhatYouSee - Invalid parameter 'application'");
                a_oCallback.failure(thatInstance, languageFindString("InvalidArguments"));
                return;
            }

            if (!algo) {

                LoggingService.error("SignWhatYouSee - Invalid parameter 'algorithm'");
                a_oCallback.failure(thatInstance, manageError(-1, languageFindString("InvalidArguments")));
                return;
            }

            if (undefined !== a_DisplaySizes) {

                displaySizes = a_DisplaySizes;
            }

            // Check the data are present
            if (!a_DataToSign || ("undefined" === typeof (a_DataToSign)) || (a_DataToSign.length < 1)) {

                LoggingService.error("SignWhatYouSee - Invalid parameter 'data'");
                a_oCallback.failure(thatInstance, manageError(-1, languageFindString("InvalidArguments")));
                return;
            }

            buffer = null;
            try {

                buffer = mk_sign_buffer(g_ReaderConfiguration.primitives, a_DataToSign, displaySizes);
               
                LoggingService.info("buffer (" + buffer + ")");
                
                //Add value of apdu in dataHex input field
                document.getElementById("input_dataHex").value = buffer;
                
            } catch (e) {

                a_oCallback.failure(thatInstance, manageError(-1, e.message));
                return;

            }

            len = byteArrayToHexString([buffer.length / 2]).toUpperCase();

            apdu = "D034" + aid + algo + len + buffer;
            
            LoggingService.debug("SignWhatYouSee - APDU (" + apdu + ")");
			LoggingService.info("SignWhatYouSee - APDU (" + apdu + ")");

            // Define a callback to check the return of the APDU
            function innerCallbackSignWhatYouSee(a_oFinalCallback) {

                return {
                    success: function (result) {

                        endTransaction();
                        var aStatusWord = result.statusWord,
                            aDataOut = result.dataOut,
                            reply,
                            code;

                        LoggingService.debug("SignWhatYouSee.success - (BEGIN)");
                        LoggingService.debug("SignWhatYouSee.success - StatusWord (" + aStatusWord + ")");
                        LoggingService.debug("SignWhatYouSee.success - DataOut (" + aDataOut + ")");

                        modalboxClose();
                        if (aStatusWord !== "9000") {

                            a_oFinalCallback.failure(thatInstance, manageError(aStatusWord));
                            return;
                        }

                        // Extract the value of the TLV with tag 0xC1
                        reply = tlv_decode(aDataOut);
                        
                        //getting OTP
                        
                        code = getTokenCAP(reply, true);
                        
                        //Make an HTTP call to CAS server to validate it

                        if (code) {

                        	//OTP - batch transfer screen
                        	document.getElementById("input_otp").value = code;
                        	
                            LoggingService.info("SignWhatYouSee - Successfully generated token (" + code + ")");
                            LoggingService.debug("SignWhatYouSee.success - (END)");
                            a_oFinalCallback.success(thatInstance, code);
                            
                            console.log("Trigger the call to validate the OTP....");
                            validateOTP();

                        } else {

                            LoggingService.error("SignWhatYouSee.success - No token found");
                            LoggingService.debug("SignWhatYouSee.success - (END)");
                            a_oFinalCallback.failure(thatInstance, manageError(-1, "No token found in the response"));
                        }

                        LoggingService.debug("SignWhatYouSee.success - (END)");
                    },

                    failure: function (a_ErrorCode) {
                        endTransaction();
                        LoggingService.debug("SignWhatYouSee.failure - (BEGIN)");
                        LoggingService.debug("SignWhatYouSee.failure - code (" + a_ErrorCode.errorCode + ")");
                        LoggingService.debug("SignWhatYouSee.failure - message (" + a_ErrorCode.message + ")");
                        modalboxClose();
                        a_oFinalCallback.failure(thatInstance, a_ErrorCode);
                        LoggingService.debug("SignWhatYouSee.failure - (END)");
                    }
                };
            }

            modalboxOpen(languageFindString("ReaderReadInstructions"));

            // Send the apdu to the PCR asynchronously
            apdu_Transmit(apdu, innerCallbackSignWhatYouSee(a_oCallback));
        };








        ////////////////////////////////////////////////////////////////
        // LOW LEVEL PRIVATE FUNCTIONS
        ////////////////////////////////////////////////////////////////








        /**
         * @public
         * @desc Checks if the Gemalto driver is installed (only on windows platforms).<br>
           @param {Object} The parameter is an object containing two functions "success" and "failure" as properties.
            When the function succeeds, the "success" function is invoked to return a boolean value as first parameter of the function.
            When the function fails, the "failure" function is invoked and an object with two properties "errorCode" and "message" describing the issue is returned as first parameter.
         * @example
         <pre>
var cnx = enex.getConnection();

if(cnx) {

    var callback = {

        success : function (bIsGemaltoDriverInstalled){

            if (bIsGemaltoDriverInstalled) {

                alert("The Gemalto driver is properly installed");

            } else {

                alert("The Gemalto driver is NOT installed");					
            }
        },

        failure : function (a_oError) {

            alert("An error occurred (" + a_oError.errorCode + ") - (" + a_oError.message + ")");                    
        }
    };

    cnx.is_gemalto_driver_installed(callback);
}
         </pre>
         */
        this.is_gemalto_driver_installed = function (a_oCallback) {

            LoggingService.debug("is_gemalto_driver_installed - (BEGIN)");

            checkCallback(a_oCallback);

            function cb(a_oCallback) {

                return {

                    success: function (aDataOut) {

                        endTransaction();

                        var response_array = [],
                            driver_name;

                        while (aDataOut.length >= 2) {

                            response_array.push(parseInt(aDataOut.substring(0, 2), 16));

                            aDataOut = aDataOut.substring(2, aDataOut.length);
                        }

                        driver_name = String.fromCharCode.apply(String, response_array);

                        callSuccess(a_oCallback, (driver_name.search("Gemalto") === 0));
                    },

                    failure: function (a_ErrorCode) {

                        callSuccess(a_oCallback, false);
                    }
                };
            }

            try {

                //ctrlCode(2049) and DataString ("90010700") are Gemalto specific values
                //when are not present an exception will be thrown indicating that another driver is being used.
                var IOCTL_VENDOR_GET_ATTRIBUTE = 2049,
                    sendBuffer = "90010700",
                    raw = false; //, expectedLen = 19*6;
                apdu_control(cb(a_oCallback), IOCTL_VENDOR_GET_ATTRIBUTE, sendBuffer, raw); //, expectedLen);

            } catch (e) {

                callSuccess(a_oCallback, false);
            }

            LoggingService.debug("is_gemalto_driver_installed - (END)");
        };

    } // Connection end

    ReturnedAPI.Connection = Connection;

    /////////////////////
    // Connect object end
    /////////////////////



    /**
     * @private
     * @function connectionCreate
     * @desc Creates a new Connection instance to the card device with the specified name.
     * @param {String} deviceName deviceName device to connect to
     * @param {String} ATR ATR smart card to connect to
     */
    function connectionCreate(ReaderName, ATR, a_oCallback) {

        LoggingService.debug("connectionCreate - (BEGIN)");
        LoggingService.debug("connectionCreate - Reader name (" + ReaderName + ")");
        LoggingService.debug("connectionCreate - Smart card ATR (" + ATR + ")");

        if (g_CurrentConnection && (g_CurrentConnection.connection !== null)) {

            g_CurrentConnection.connection.dispose();
        }

        // Connect to the smart card
        g_CurrentConnection = new Connection(ReaderName, ATR);

        g_callbackForResult = a_oCallback;

        var callback = function (a_oFinalCallback) {

            return {
                success: function (cnx) {

                    g_CurrentConnection = cnx;
                    callSuccess(a_oFinalCallback, g_CurrentConnection);
                },

                failure: function (error) {
                    callFailure(g_callbackForResult, error);
                }
            };
        };

        g_CurrentConnection.create(callback(a_oCallback));

        LoggingService.debug("connectionCreate - (END)");
    }


    /**
     * @private
     * @function connectionDelete
     * @desc Delete the current connection.
     */
    function connectionDelete(aReaderName) {
        LoggingService.debug("connectionDelete - (BEGIN)");
        // If the current connection exists
        if (g_CurrentConnection) {
            // If we want to force a deletion (case of the eNex dispose)
            // or if PCSC notified a smart card removal coming from only the reader targeted by the current connection
            if ((aReaderName === undefined) || (aReaderName === g_CurrentConnection.readerName)) {

                g_CurrentConnection.dispose();
                g_CurrentConnection = null;
            }
        }
        LoggingService.debug("connectionDelete - (END)");
    }


    /**
     * @private
     * @property g_HardwareEventHandler
     * @desc Inner callback used to listen to reader/smart card events
     */
    g_HardwareEventHandler = {

        error: function (code) {
            LoggingService.error("HardwareEventHandler - (" + code + ")");
        },

        onCardInsertion: function (args) {

            LoggingService.debug("onCardInsertion - (BEGIN)");
            LoggingService.info("onCardInsertion - Reader name (" + args.readerName + ") - Card ATR (" + args.ATR + ")");

            // Perform incoming reader & smart card check if a callback exists
            var acceptReader = true,
                message = "";
            if (g_CallbackHardwareFilter && ('function' === typeof (g_CallbackHardwareFilter))) {

                acceptReader = g_CallbackHardwareFilter(args.readerName, args.ATR);
            }

            if (!acceptReader) {
                LoggingService.warning("onCardInsertion - Reader or smart card rejected by the Hardware Filter !");
                return;
            }

            if (g_CallbackHardwareEventNotification) {

                g_CallbackHardwareEventNotification("CARD_IN", args.readerName, args.ATR);
            }

            modalboxClose();

            // Connect to the smart card
            try {

                // Store locally the name of the reader and the ATR in case eNex should reconnected to the smart card silently
                g_currentReader = args.readerName;
                g_currentATR = args.ATR;

                connectionCreate(args.readerName, args.ATR);

            } catch (ex) {

                // Display a dialog box to warm the end-user
                modalboxClose();
                message = ex.message || languageFindString("PcscError");
                modalboxOpen(message);
            }

            LoggingService.debug("onCardInsertion - (END)");
        },


        onCardInsertionMute: function (args) {

            LoggingService.debug("onCardInsertionMute - (BEGIN)");
            LoggingService.debug("onCardInsertionMute - Reader name (" + args.readerName + ")");

            if (g_CallbackHardwareEventNotification) {

                g_CallbackHardwareEventNotification("CARD_MUTE", args.readerName);
            }

            LoggingService.debug("onCardInsertionMute - (END)");
        },


        onCardRemoval: function (args) {

            LoggingService.debug("onCardRemoval - (BEGIN)");
            LoggingService.info("onCardRemoval - Reader name (" + args.readerName + ")");

            // Remove the name of the reader and the ATR in case eNex should reconnected to the smart card silently
            if (args.readerName === g_currentReader) {

                modalboxClose();

                g_currentReader = null;
                g_currentATR = null;

                connectionDelete(args.readerName);
            }

            if (g_CallbackHardwareEventNotification) {

                g_CallbackHardwareEventNotification("CARD_OUT", args.readerName);
            }

            LoggingService.debug("onCardRemoval - (END)");
        },


        onReaderConnected: function (args) {
            LoggingService.debug("onReaderConnected - (BEGIN)");
            LoggingService.info("onReaderConnected - Reader name (" + args.readerName + ")");

            if (g_CallbackHardwareEventNotification) {

                g_CallbackHardwareEventNotification("READER_IN", args.readerName);
            }

            LoggingService.debug("onReaderConnected - (END)");
        },


        onReaderDisconnected: function (args) {

            LoggingService.debug("onReaderDisconnected - (BEGIN)");
            LoggingService.info("onReaderDisconnected - Reader name (" + args.readerName + ")");

            // Remove the name of the reader and the ATR
            // in case eNex should reconnected to the smart card silently
            if (args.readerName === g_currentReader) {

                g_currentReader = null;
                g_currentATR = null;

                modalboxClose();
            }

            if (g_CallbackHardwareEventNotification) {

                g_CallbackHardwareEventNotification("READER_OUT", args.readerName);
            }

            LoggingService.debug("onReaderDisconnected - (END)");
        }
    };


    /**
     * @public
     * @memberOf enex
     * @function dispose
     * @desc This function must be called to release all resources allocated by the eNex object.<br>
     * After "dispose" call, EWC does not more communicate with the smart card or the device until a call to the "init" function is performed.
     * @example enex.dispose();
     */
    function dispose() {

        LoggingService.debug("dispose - (BEGIN)");

        modalboxClose();

        // Release the PCSC object
        connectionDelete();

        g_currentReader = null;
        g_currentATR = null;

        // Un-register from card insertion-removal event.
        SConnect.PCSC.UnregisterCardIRHandler();

        LoggingService.debug("dispose - (END)");
    }
    ReturnedAPI.dispose = dispose;


    /**
     * @private
     * @property installAddOnsCallback
     * @desc Inner callback used to check the SConnnect licence verification and initialize the reader/smart card events notification.
     */
    installAddOnsCallback = {

        // The PCSC add-ons has been successfully installed. 
        success: function () {
            LoggingService.debug("installAddOnsCallback.success");

            // register to card insertion-removal event.
            try {

                SConnect.PCSC.RegisterCardIRHandler(g_HardwareEventHandler);

                if ((g_CallbackInitialization !== null) && (typeof (g_CallbackInitialization) != undefined)) {

                    callSuccess(g_CallbackInitialization);
                }

            } catch (ex) {

                callFailure(g_CallbackInitialization, languageFindString("PcscError"));
            }
        },

        error: function (code, info) {

            LoggingService.error("installAddOnsCallback.error - code (" + code + ") - info (" + info + ")");

            if ((g_CallbackInitialization !== null) && (typeof (g_CallbackInitialization) != undefined)) {

                callFailure(g_CallbackInitialization, code);
            }
        }
    };

    /**
     * @private
     * @property _ValidateServerCallback
     * @desc Inner callback used to check the SConnnect licence verification and initialize the reader/smart card events notification.
     */
    validateCallback = {

        // The SConnect license has been validated. Process to PCSC add-on installation
        success: function () {
            LoggingService.debug("validateCallback.success");

            SConnect.InstallAddOns([new SConnect.PCSCInfo()], installAddOnsCallback, !g_SkipSConnectMessages);
        },

        error: function (code) {

            LoggingService.error("validateCallback.error - code (" + code + ")");
            if (g_CallbackLicenceVerificationFailed) {

                g_CallbackLicenceVerificationFailed(code);
            }
        }
    };


    /**
     * @public
     * @memberOf enex
     * @function init
     * @desc This function must be called to initialize the EWC library.
     * @param {JSON} readerConfigurationForSWYS This JSON structure describes the primitives, currencies and templates used during the Sign What You See operations.
     * <br>For example:
     <pre>

     var readerConfiguration = ({
     "currencies" : { "EUR" : "978", "USD" : "840",
     "GBP" : "826", "BRL" : "986",
     "ARS" : "032", "SEK" : "752",
     "Other" : "999" },
     "primitives" :
     {
     "INPUT_FURTHER_INPUTS" : { "type" : "ID", "tag" : "DF43",
     "min_length" : 3, "max_length" : 11 },
     "INPUT_CHALLENGE" : { "type" : "IDG", "tag" : "9F37",
     "min_length" : 0, "max_length" : 8 },
     "INPUT_AMOUNT" : { "type" : "DID", "tag" : "9F03",
     "min_length" : 1, "max_length" : 12 },
     "INPUT_ACCOUNT_NUMBER" : { "type" : "ID", "tag" : "DF03",
     "min_length" : 1, "max_length" : 17 },
     "INPUT_TO_ACCOUNT" : { "type" : "ID", "tag" : "DF04",
     "min_length" : 1, "max_length" : 17 },
     "INPUT_FROM_ACCOUNT" : { "type" : "ID", "tag" : "5A",
     "min_length" : 1, "max_length" : 17 },
     "INPUT_PG_BG" : { "type" : "SD", "tag" : "DF06",
     "allowed_values" : {"PG" : "1", "BG" : "2"} },
     "INPUT_REF_ORDER_NUMBER" : { "type" : "ID", "tag" : "DF07",
     "min_length" : 1, "max_length" : 28 },
     "INPUT_REFERENCE_NUMBER" : { "type" : "ID", "tag" : "DF08",
     "min_length" : 0, "max_length" : 28 },
     "INPUT_NUMBER_OF_PAYMENTS" : { "type" : "NID", "tag" : "C3",
     "min_length" : 0, "max_length" : 12 },
     "INPUT_DATE" : { "type" : "ID", "tag" : "9A",
     "min_length" : 6, "max_length" : 8 },
     "INPUT_CHECKSUM" : { "type" : "ID", "tag" : "DF64",
     "min_length" : 0, "max_length" : 17 },
     "INPUT_TIME" : { "type" : "ID", "tag" : "DF14",
     "min_length" : 4, "max_length" : 4 },
     "INPUT_NOT_BEFORE" : { "type" : "ID", "tag" : "DF15",
     "min_length" : 6, "max_length" : 8 },
     "INPUT_CURRENCY" : { "type" : "SD", "tag" : "5F2A",
     "allowed_values" : "currencies" },
     "INPUT_AMOUNT_WITH_CURRENCY" : { "type" : "DID", "tag" : "9F02",
     "min_length" : 1, "max_length" : 12 },
     "INPUT_BUY_SELL" : { "type" : "SD", "tag" : "DF17",
     "allowed_values" : { "BUY" : "1", "SELL" : "2" }
     },
     "INPUT_IBAN" : { "type" : "ID", "tag" : "DF18",
     "min_length" : 6, "max_length" : 28 },
     "INPUT_LIMIT" : { "type" : "DID", "tag" : "DF19",
     "min_length" : 1, "max_length" : 12 },
     "INPUT_USER_ID" : { "type" : "ID", "tag" : "DF20",
     "min_length" : 0, "max_length" : 17 },
     "INPUT_UNITS" : { "type" : "DID", "tag" : "DF21",
     "min_length" : 1, "max_length" : 12 },
     "INPUT_IDENTITY_NUMBER" : { "type" : "ID", "tag" : "DF23",
     "min_length" : 6, "max_length" : 17 },
     "INPUT_EXTRA_CODE" : { "type" : "IDG", "tag" : "DF24",
     "min_length" : 2, "max_length" : 12 },
     "INPUT_QUANTITY" : { "type" : "NID", "tag" : "DF25",
     "min_length" : 1, "max_length" : 11 },
     "INPUT_PHONE_NUMBER" : { "type" : "ID", "tag" : "DF26",
     "min_length" : 5, "max_length" : 17 },
     "INPUT_DATA" : { "type" : "ID", "tag" : "DF71",
     "min_length" : 1, "max_length" : 17 },
     "INPUT_DATA_2" : { "type" : "ID", "tag" : "DF72",
     "min_length" : 1, "max_length" : 17 },
     "INPUT_DATA_3" : { "type" : "ID", "tag" : "DF73",
     "min_length" : 1, "max_length" : 17 },
     "INPUT_DATA_4" : { "type" : "ID", "tag" : "DF74",
     "min_length" : 1, "max_length" : 17 },
     "INPUT_DATA_5" : { "type" : "ID", "tag" : "DF75",
     "min_length" : 1, "max_length" : 17 },
     "INPUT_DATA_6" : { "type" : "ID", "tag" : "DF76",
     "min_length" : 1, "max_length" : 17 },
     "INPUT_DATA_7" : { "type" : "ID", "tag" : "DF77",
     "min_length" : 1, "max_length" : 17 },
     "INPUT_DATA_8" : { "type" : "ID", "tag" : "DF78",
     "min_length" : 1, "max_length" : 17 },
     "INPUT_DATA_9" : { "type" : "ID", "tag" : "DF79",
     "min_length" : 1, "max_length" : 17 },
     "INPUT_DATA_10" : { "type" : "ID", "tag" : "DF7A",
     "min_length" : 1, "max_length" : 17 },
     "INPUT_Passcode" : { "type" : "ID", "tag" : "DF1C",
     "min_length" : 0, "max_length" : 17 },
     "INPUT_DUE_DATE" : { "type" : "ID", "tag" : "DF37",
     "min_length" : 6, "max_length" : 8 },
     "INPUT_LOGIN_CODE" : { "type" : "ID", "tag" : "DF38",
     "min_length" : 0, "max_length" : 17 },
     "INPUT_TOTAL_AMOUNT" : { "type" : "DID", "tag" : "DF39",
     "min_length" : 1, "max_length" : 12 },
     "INPUT_VALID_UNTIL" : { "type" : "ID", "tag" : "DF40",
     "min_length" : 6, "max_length" : 8 },
     "INPUT_TO_DATE" : { "type" : "ID", "tag" : "DF41",
     "min_length" : 6, "max_length" : 8 },
     "INPUT_FROM_DATE" : { "type" : "ID", "tag" : "DF42",
     "min_length" : 6, "max_length" : 8 },

     "MESSAGE_INTERNATIONAL_PAYMENT" : { "type" : "MD", "tag" : "BF11" },
     "MESSAGE_BUY_SELL_SHARES" : { "type" : "MD", "tag" : "BF12" },
     "MESSAGE_NEW_PHONE_NUMBER" : { "type" : "MD", "tag" : "BF13" },
     "MESSAGE_NEW_PG_BG" : { "type" : "MD", "tag" : "BF14" },
     "MESSAGE_CONFIRM_PROTECT_FILE" : { "type" : "MD", "tag" : "BF15" },
     "MESSAGE_CONFIRM_AGREEMENT" : { "type" : "MD", "tag" : "BF16" },
     "MESSAGE_PG_BG_PAYMENT" : { "type" : "MD", "tag" : "BF17" },
     "MESSAGE_NEW_BENEFICIARY" : { "type" : "MD", "tag" : "BF18" },
     "MESSAGE_LOGIN" : { "type" : "MD", "tag" : "BF19" },
     "MESSAGE_PAYMENT" : { "type" : "MD", "tag" : "BF1A" },
     "MESSAGE_TRANSFER" : { "type" : "MD", "tag" : "BF1B" },
     "MESSAGE_SIGNING" : { "type" : "MD", "tag" : "BF1C" },
     "MESSAGE_AUTHENTICATE" : { "type" : "MD", "tag" : "BF1D" },
     "MESSAGE_CONFIRM_ASSIGNMENT" : { "type" : "MD", "tag" : "BF1E" },
     "MESSAGE_CONFIRM_ADDRESS_CHANGE" : { "type" : "MD", "tag" : "BF1F" },

     "FREE_TEXT" : { "type" : "E0", "tag" : "E0" },
     "HIDDEN_TEXT" : { "type" : "E1", "tag" : "E1",
     "min_length" : 1, "max_length" : 127 }
     },
     "templates" :
     {
     "0" : [
     ["INPUT_FURTHER_INPUTS"],
     ["SIGN", "BUY", "LOGIN"]],
     "1" : [
     ["INPUT_USER_ID"],
     ["LOGIN"]],
     "2" : [
     ["INPUT_Passcode"],
     ["LOGIN"]],
     "3" : [
     ["INPUT_IDENTITY_NUMBER"],
     ["LOGIN", "SIGN"]],
     "4" : [
     ["INPUT_EXTRA_CODE"],
     ["LOGIN", "SIGN", "BUY"]],
     "5" : [
     ["INPUT_REFERENCE_NUMBER"],
     ["LOGIN", "SIGN", "BUY"]],
     "6" : [
     ["INPUT_DATA"],
     ["LOGIN", "SIGN", "BUY"]],
     "7" : [
     ["MESSAGE_NEW_BENEFICIARY", "INPUT_ACCOUNT_NUMBER"],
     ["SIGN"]],
     "8" : [
     ["MESSAGE_NEW_PHONE_NUMBER" , "INPUT_PHONE_NUMBER"],
     ["SIGN" , "BUY"]],
     "9" : [
     ["INPUT_AMOUNT"],
     ["SIGN" , "BUY"]],
     "10" : [
     ["INPUT_TO_ACCOUNT" , "INPUT_AMOUNT"],
     ["SIGN"]],
     "11" : [
     ["MESSAGE_NEW_BENEFICIARY"],
     ["SIGN"]],
     "12" : [
     ["MESSAGE_CONFIRM_ADDRESS_CHANGE"],
     ["SIGN"]],
     "13" : [
     ["INPUT_CURRENCY", "INPUT_AMOUNT_WITH_CURRENCY"],
     ["SIGN" , "BUY"]],
     "14" : [
     ["INPUT_NUMBER_OF_PAYMENTS", "INPUT_TOTAL_AMOUNT"],
     ["SIGN"]],
     "15" : [
     ["MESSAGE_INTERNATIONAL_PAYMENT", "INPUT_IBAN", "INPUT_CURRENCY", "INPUT_AMOUNT_WITH_CURRENCY"],
     ["SIGN"]],
     "16" : [
     ["MESSAGE_CONFIRM_AGREEMENT", "INPUT_REFERENCE_NUMBER", "INPUT_DATE"],
     ["SIGN" , "BUY"]],
     "17" : [
     ["MESSAGE_CONFIRM_PROTECT_FILE", "INPUT_CHECKSUM"],
     ["SIGN"]],
     "18" : [
     ["MESSAGE_CONFIRM_PROTECT_FILE", "INPUT_CHECKSUM", "INPUT_TOTAL_AMOUNT"],
     ["SIGN"]],
     "19" : [
     ["MESSAGE_BUY_SELL_SHARES", "INPUT_BUY_SELL", "INPUT_AMOUNT"],
     ["SIGN"]],
     "20" : [
     ["MESSAGE_BUY_SELL_SHARES", "INPUT_BUY_SELL", "INPUT_QUANTITY"],
     ["SIGN"]],
     "21" : [
     ["MESSAGE_BUY_SELL_SHARES", "INPUT_BUY_SELL", "INPUT_QUANTITY", "INPUT_LIMIT", "INPUT_TO_DATE"],
     ["SIGN"]],
     "22" : [
     ["INPUT_ACCOUNT_NUMBER"],
     ["SIGN"]],
     "23" : [
     ["MESSAGE_PG_BG_PAYMENT", "INPUT_ACCOUNT_NUMBER", "INPUT_REFERENCE_NUMBER", "INPUT_AMOUNT"],
     ["SIGN"]]
     }
     }
    );
     </pre>

     @param {callback} callbackHardwareFilter function taking the reader name and the smart card as parameter and returning "true" to accept the connection with or "false" to reject the connection with.
     In this function you have to analyse the reader name & the smart card ATR to decide if you want to accept or reject them.
     If this function returns true then a connection to this card will be created. If false is returned the card will be ignored.
     <br>For example:
     <pre>

     function card_filter(reader_name, atr) {
     if((reader_name == "MySpecificReader) && (atr == "1234567890")) {
     // Accept to use this reader with this smart card
     return true;
     }

     // And reject any other
     return false;
     }
     </pre>

     @param {callback} callbackConnection function taking a "Connection" object as argument. This function is automatically called when a smart card is inserted and a valid "Connection" is ready.
     <br>Typically this function is used to perform an operation when a smart card is inserted.
     <br>For example:
     <pre>
     function connection_callback(connection) {

     // Perform a CAP operation each time the smart card is inserted
     connection.cap_mode1(cap_callback, "11223344", "10000", "SEK");
     }
     </pre>

     @param {callback} callbackHardwareEventNotification function taking the event type, the reader name related to the event and the smart card ATR related to the event.
     <br>For example:
     <pre>

     function onHardwareChange(a_Event, aReaderName, a_SmartCardATR) {

     var sMsg = "";
     switch(a_Event) {

     case "CARD_IN":
     sMsg += "A smart card with the ATR ";
     sMsg += a_SmartCardATR;
     sMsg += " is inserted in the reader ";
     sMsg += aReaderName;
     break;

     case "CARD_OUT":
     sMsg += "The smart card is withdrawn from the reader ";
     sMsg += aReaderName;
     break;

     case "CARD_MUTE":
     sMsg += "The smart card inserted into the ";
     sMsg += aReaderName;
     sMsg += " reader is MUTE !!!";
     break;

     case "READER_IN":
     sMsg += "The reader ";
     sMsg += aReaderName;
     sMsg += " is inserted on your system";
     break;

     case "READER_OUT":
     sMsg += "The reader ";
     sMsg += aReaderName;
     sMsg += " is withdrawn from your system";
     break;

     default:
     sMsg += "UNKNOWN EVENT ";
     sMsg += a_Event;
     break;
     }

     alert(sMsg);
     }
     </pre>

     @param {callback} callbackLicenseVerificationFailed function notifying the application that the SConnect license verification failed.
     <br>For example:
     <pre>

     function onLicenseVerificationFailed() {

     alert("SConnect license verification failed");
     }
     </pre>

     @param {JSON} serverConfiguration This parameter is a JSON structure describing the different URLs where are stored the SConnect files and EWC installation guides.
     <br>The "imgPath", "extPath", "eulaPath" and "faqPath" properties are required when the installation is driven by SConnect using the files by these paths.
     <br> Keep in mind that all paths are ABSOLUTE but the license path which is RELATIVE.
     <br>For example:
     <pre>
     var serverConfiguration = {
     imgPath : "https://localhost/SConnect/images/",
     extPath : "https://localhost/SConnect/extensions/",
     eulaPath : "https://localhost/SConnect/eula/",
     faqPath : "https://localhost/SConnect/faq/",
     licensePath : /sconnect.lic"
     };
     </pre>

     @param {boolean} SkipSConnectMessages This boolean flag manages the display of all SConnect messages.
     <br>If the value is set to "true" then no SConnect messages are displayed.
     <br>If the value is set to "false" the SConnect messages are displayed.

     @param {boolean} enableGUI Enable/disable the display of the inner EWC GUI.

     @param {object} callbackDialogBox Object defining a dialog to be displayed when the end-ser attention is required. It defines two properties.
     <br>The property "open" defines a function taking a message as argument provided by EWC to warn the end-user or react on a pending operation.
     <br>The property "close" defines a function to close the GUI previously opened by the "open" function.
     <br>For example:
     <pre>

     var callbackDialog = {

     open : function displayMessage(a_Message) {

     var title = document.getElementById("ModalTitle");
     title.innerHTML = "Warning";

     var message = document.getElementById("ModalMessage");
     message.innerHTML = a_Message;

     $('#myModal').modal();
     },

     close : function () {

     $('#myModal').modal('hide');
     }
     };
     </pre>

     @param {function} CallbackInitialization callback property to be notified when the initialization ends. This property exposes two functions (success/error).
     Note that if a SConnect installation is required this callback is not invoked.
     The function is useful to know when the EWC initialization is finished and the library is ready to be used.
      <br>For example:
     <pre>

     var callbackInitialization = {

        success : function () {
            alert('initialization done');
        },

        error : function (errorMessage) {
            alert('initialization failed. The error is ' + errorMessage);
        }
     };
     </pre>
     @example
     <pre>

     var CallbackHardwareFilter = function () {
     // Accept all readers and smart cards
     return true;
     };
     var CallbackConnection = null;

     var CallbackHardwareEventNotification = function (a_Event, a_Reader, a_ATR) {

     var sMsg = "";
     switch(a_Event) {

     case "CARD_IN":
     sMsg += "A smart card with the ATR ";
     sMsg += a_ATR;
     sMsg += " is inserted in the reader ";
     sMsg += a_Reader;
     break;

     case "CARD_OUT":
     sMsg += "The smart card is withdrawn from the reader ";
     sMsg += a_Reader;
     break;

     case "CARD_MUTE":
     sMsg += "The smart card inserted into the ";
     sMsg += a_Reader;
     sMsg += " reader is MUTE !!!";
     break;

     case "READER_IN":
     sMsg += "The reader ";
     sMsg += a_Reader;
     sMsg += " has been inserted on your system";
     break;

     case "READER_OUT":
     sMsg += "The reader ";
     sMsg += a_Reader;
     sMsg += " has been withdrawn from your system";
     break;

     default:
     sMsg += "UNKNOWN EVENT ";
     sMsg += a_Event;
     enex.dispose();
     break;
     }

     alert(sMsg);
     }

     var CallbackLicenceVerificationFailed = function onLicenceVerificationFailed() {

     alert("SConnect licence verification failed");
     }

     var JSONServerConfiguration = {
     imgPath : "https://localhost/SConnect/images/",
     extPath : "https://localhost/SConnect/extensions/",
     eulaPath : "https://localhost/SConnect/eula/",
     faqPath : "https://localhost/SConnect/faq/",
     licensePath : "https://localhost/sconnect.lic",
        addonPath : "https://localhost/SConnect/addons/
     };

    var SkipSConnectMessages = false;
    var bEnableGUI = true;
    var CallbackDialogBox = null;
    var callbackInitialization = {
     success : function () {
		alert('initialization done');
     },

     error : function (a_oError) {
        alert('initialization failed. The error is ' + a_oError.message);
    }
     };

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
     </pre>
     *
     */
    function init(a_JSONReaderConfiguration,
        a_CallbackHardwareFilter,
        a_CallbackConnection,
        a_CallbackHardwareEventNotification,
        a_CallbackLicenceVerificationFailed,
        a_JSONServerConfiguration,
        a_SkipSConnectMessages,
        a_bEnableGUI,
        a_CallbackDialogBox,
        a_CallbackInitialization) {

        LoggingService.debug("initialize - (BEGIN)");

        g_currentReader = null;
        g_currentATR = null;

        g_bEnableGUI = true;
        if ((null !== a_bEnableGUI) && (typeof (a_bEnableGUI) === "boolean")) {

            g_bEnableGUI = a_bEnableGUI;
        }
        g_CallbackInitialization = null;
        if (a_CallbackInitialization && (typeof (a_CallbackInitialization) !== "undefined")) {

            g_CallbackInitialization = a_CallbackInitialization;
        }

        g_CallbackDialogBox = null;
        if (a_CallbackDialogBox && (typeof (a_CallbackDialogBox) !== "undefined")) {

            g_CallbackDialogBox = a_CallbackDialogBox;
        }

        // Store the callbacks
        if (a_CallbackHardwareFilter && ('function' === typeof (a_CallbackHardwareFilter))) {

            g_CallbackHardwareFilter = a_CallbackHardwareFilter;
        }

        if (a_CallbackConnection && ('function' === typeof (a_CallbackConnection))) {

            g_CallbackConnection = a_CallbackConnection;
        }

        if (a_CallbackLicenceVerificationFailed && ('function' === typeof (a_CallbackLicenceVerificationFailed))) {

            g_CallbackLicenceVerificationFailed = a_CallbackLicenceVerificationFailed;
        }

        if (a_CallbackHardwareEventNotification && ('function' === typeof (a_CallbackHardwareEventNotification))) {

            g_CallbackHardwareEventNotification = a_CallbackHardwareEventNotification;
        }

        // Store the reader configuration (primitives, currencies, templates supported)
        g_ReaderConfiguration = DEFAULT_READER_CONFIGURATION;
        if (a_JSONReaderConfiguration && ('undefined' !== typeof (a_JSONReaderConfiguration))) {

            g_ReaderConfiguration = a_JSONReaderConfiguration;
        }

        g_ReaderConfiguration.primitives.INPUT_CURRENCY.allowed_values = g_ReaderConfiguration.currencies;

        // Set the URL to reach the web server providing SConnect
        if ((null !== a_JSONServerConfiguration) && ('undefined' !== typeof (a_JSONServerConfiguration))) {

            g_serverConfiguration = a_JSONServerConfiguration;

            SConnect.ConfigResources(a_JSONServerConfiguration);
        }

        // Set the flag used to display or not the SConnect GUI
        // By default no GUI is allowed
        if ((null === a_SkipSConnectMessages) || (typeof (a_SkipSConnectMessages) === 'undefined')) {

            a_SkipSConnectMessages = false;
        }
        g_SkipSConnectMessages = false;
        if (a_SkipSConnectMessages === true) {

            g_SkipSConnectMessages = true;
        }

        // Start the SConnect initialization process (check installation, check license, start PCSC polling)
        // If SConnect is not installed then starts the installation
        var installCallback = {
            success: function () {
                if ((null !== g_serverConfiguration) && (g_serverConfiguration !== 'undefined') && (g_serverConfiguration.licensePath !== 'undefined')) {
                    SConnect.ValidateServer(validateCallback, !g_SkipSConnectMessages, g_serverConfiguration.licensePath);
                } else {
                    SConnect.ValidateServer(validateCallback, !g_SkipSConnectMessages);
                }
            },

            error: function (code) {

                LoggingService.debug("installCallback.error");
                callFailure(g_CallbackInitialization, manageError(-1, languageFindString("SConnectNotInstalled")));
            }
        };
        SConnect.Install(installCallback, g_SkipSConnectMessages);

        LoggingService.debug("initialize - (END)");
    }
    ReturnedAPI.init = init;




    /**
     * @private
     * @function connectionAvailability
     * @desc Check if a connection is available.
     */
    function connectionAvailability() {

        LoggingService.debug("connectionAvailability - (BEGIN)");

        var ret = true;

        if (!g_CurrentConnection) {

            // Display a dialog box to warm the end-user
            modalboxOpen(languageFindString("HardwareRequired"));

            LoggingService.error("connectionAvailability - not connected to a smart card");
            ret = false;
        }

        LoggingService.debug("connectionAvailability - (END)");

        return ret;
    }




    /**
     * @public
     * @memberOf enex
     * @function getConnection
     * @desc Once the connection with the smart card is established, this function returns
     * the "Connection" object handling the connection and exposing all methods to perform
     * CAP, SWYS, PPDU & Secure Channel operations.
     * <br>Displays a GUI to warm the end-user that a reader or a smart card is required.
     * @returns {Object} Returns a valid "Connection" object connected to the smart card <br>
     * Otherwise the function returns "null" if there is no connection with the smart card.
     */
    function getConnection() {

        if (!g_CurrentConnection) {
            return null;
        }

        if (!g_CurrentConnection.connection) {
            return null;
        }

        return g_CurrentConnection;
    }
    ReturnedAPI.getConnection = getConnection;




    /**
     * @public
     * @memberOf enex
     * @function reConnection
     * @desc Creates a new Connection instance to the card reader with the specified name.
	 * Note: This is not calling SCardReconnect
	 * @param {Object} oCallback The function accepts an object containing two functions "success" and "failure" as properties.<br>
       When the function succeeds, the "success" function is invoked and the Connection is returned as the first parameter.<br>
       When the function fails, the "failure" function is invoked and an object with two properties "errorCode" and "message" describing the issue is returned as first parameter.
  @example
<pre>
var resultCallback = {

  success : function (a_oConnection) {

    alert("You are reconnected to the smart card");
  },

  failure : function (a_oError) {

    alert("The reconnection failed. Error code (" + a_oError.errorCode + "). Error message (" + a_oError.message + ")");
  }  
};

enex.reConnection(resultCallback);
</pre>
     */
    function reConnection(callback) {
        connectionCreate(g_currentReader, g_currentATR, callback);
    }
    ReturnedAPI.reConnection = reConnection;







    function isErrorPCSC(a_ErrorCode) {

        // Is it a PCSC exception ?
        var errorCode = a_ErrorCode.toString(16).toUpperCase(),
            errorCodeString = ((pcsc_errors[errorCode] + " (0x" + errorCode + ")") || "Unknown PCSC error"),
            errorCodeInt = parseInt("0x" + errorCode, 16);

        LoggingService.error("getErrorPCSC - code (" + errorCode + ") - message (" + errorCodeString + ")");
    }









    // -------------------- Localization --------------------






    /**
     * @public
     * @memberOf enex
     * @function list_readers
     * @desc Retrieves a list of all readers connected to the client machine.
     * @param {int} withCards if 1 then return readers with cards else return all connected readers
     * @returns {Array} an array of readers
     * @example
     <pre>
    var listCallback = {

      success : function (r) {

        var sMessage = "The available readers are: ";

        if (r.length) {

            for(var i = 0 ; i < r.length ; ++i) {

                sMessage += r[i] + " ";
            }
        } else {

            sMessage = "No reader available";
        }

        alert(sMessage);
      },

      failure : function (a_oError) {

        var error = "An error occurred. ";
        error += "Error code (" + a_oError.errorCode + ").";
        error += " Error message (" + a_oError.message + ")";
        alert(error);
      }
    };

  enex.list_readers(a_WithSmartcard, listCallback);
     </pre>
     */
    function list_readers(a_WithCard, a_oCallback) {

        checkCallback(a_oCallback);

        var pcsc = null,
            cb = {
                success: function (list) {

                    var i;
                    for (i = 0; i < list.length; i = i + 1) {
                        LoggingService.info("list_readers - (" + list[i] + ")");
                    }

                    if (pcsc) {
                        pcsc.dispose();
                    }
                    callSuccess(a_oCallback, list);
                },

                error: function (a_ErrorCode) {
                    if (pcsc) {
                        pcsc.dispose();
                    }
                    callFailure(a_oCallback, getErrorPCSC(a_ErrorCode));
                }
            },
            createCallback = {

                //                success : function (_pcsc) {
                //                    pcsc = _pcsc;	
                //                    pcsc.listReaders(a_WithCard, cb);
                //                },
                success: function (pcsc) {
                    pcsc.listReaders(a_WithCard, cb);
                },

                error: function ( /*code*/ ) {
                    callFailure(a_oCallback, manageError(-1, languageFindString("PcscError")));
                }
            };

        try {

            SConnect.PCSC.Create(createCallback);
        } catch (e) {
            //// An exception is thrown if no reader at all is available on the
            //// client machine. The error code from PC/SC is
            //// SCARD_E_NO_READERS_AVAILABLE ((LONG)0x8010002E) but that is not
            //// supported by SConnect and the error code is a private member
            //// in the exception. The check below should cover this case in
            //// SConnect since it creates an exception with no message.
            a_oCallback.success([]);
        }
    }
    ReturnedAPI.list_readers = list_readers;





    ////////////////////////////////////////////////////////////////
    // TRACKING
    ////////////////////////////////////////////////////////////////


    /**
     * @public
     * @memberOf enex
     * @function getTrackingInformation
     * @desc This function returns the EWC activity
     * @returns {Array} Array of records describing each step performed by EWC.<br>
        Each record is an object composed of the properties "Category" (Debug, Info, Warning, Error), "TimeStamp" and "Message". 
     * @example
     * <pre>
        var log = enex.getTrackingInformation();

        if (log) {

            // Format the record for screen display
            var r = "";
            for(var i = 0 ; i < log.length ; ++i) {

                switch(log[i].Category) {

                    case "Debug":
                    r = "debug - ";
                    break;

                    case "Info":
                    r = "info - ";
                    break;

                    case "Warning":
                    r = "warning - ";
                    break;

                    case "Error":
                    r = "error - ";
                    break;

                    default:
                    r = "unknown - ";
                    break;
                }

                r += log[i].TimeStamp;
                r += " - ";
                r += log[i].Message;

                displayThisLineOnMyPage(r);
            }
        }
     * </pre>
     */
    function getTrackingInformation() {

        return LoggingService.getRecords();
    }
    ReturnedAPI.getTrackingInformation = getTrackingInformation;



    /**
     * @public
     * @memberOf enex
     * @function get_file_from_server
     * @desc Fetchs a file from the server through JavaScript. It is typically used to fetch the EWC configuration file. This function can operate either synchronously or asynchronously.
     * @param {String} URL Relative URL to the configuration file
     * @param {Object} callback If this callback is supplied the configuration will be fetched asynchronously and the callback will be invoked when the request to the
     * server is complete. The callback shall be a function taking two parameters. The first is the status code from the request (200 if successful).
     * The second is the response text from the request. If the callback is null the configuration will be fetched synchronously and will instead be returned from this function.
     * @returns If no callback is provided it will return a list where the first element is the status code and the second element is the response text from the server.
     */
    function get_file_from_server(url, callback) {

        if (!XMLHttpRequest) {
            return null;
        }
        var http_request = new XMLHttpRequest();
        if (!callback) {
            http_request.open("GET", url, false);
            http_request.send();
            return [http_request.status, http_request.responseText];
        } else {
            http_request.open("GET", url, true);
            /** @private */
            http_request.onreadystatechange = function () {
                if (http_request.readyState === 4) {
                    callback(http_request.status, http_request.responseText);
                }
            };
            http_request.send();
            return null;
        }
    }
    ReturnedAPI.get_file_from_server = get_file_from_server;


    /** @private */
    function server_validation(server_validation_callback) {

        return {
            success: function () {
                if (server_validation_callback) {
                    server_validation_callback(SConnect.IsServerValidated());
                }
            },
            error: function (code) {
                if (server_validation_callback) {
                    server_validation_callback.error(code);
                }
            }

        };
    }




    /**
     * @public
     * @memberOf enex
     * @function is_installed
     * @desc Check if SConnect extension is installed or an update is available to replace the current version
     * @param {Object} callback The "success" function of callback is invoked when the SConnect extension is installed. Otherwise the "failure" function of the callback is invoked. The 'failure' function returns an 'error' argument containing the 'errorCode' property and the 'message' property. The 'message' property is set with the string "update required" when a SConnect update is available.
      * @example
     <pre>
    var cb = {

        success : function () {

            alert("SConnect is installed");
        },

        failure : function (error) {

        // The error is an object containing the errorCode property and the message property.
	    var sMessage = "SConnect is not installed or an update is ready to be installed. ";
            sMessage += "Error (" + error.errorCode + ") ";
            sMessage += "Message (" + error.message + ")";
            alert(sMessage);
        }
    };

    enex.is_installed(cb);
     </pre>
     */
    function is_installed(a_oCallback) {
        LoggingService.debug("is_installed - (BEGIN)");

        checkCallback(a_oCallback);

        var isInstalledCallback = {

            success: function (update) {

                if (update) {

                    callFailure(a_oCallback, manageError(-1, "update required"));

                } else {

                    callSuccess(a_oCallback);
                }
            },
            error: function (code) {

                callFailure(a_oCallback, manageError(code));
            }
        };

        SConnect._isInstalled(isInstalledCallback);
        LoggingService.debug("is_installed - (END)");

    }
    ReturnedAPI.is_installed = is_installed;



    /**
     * @public
     * @memberOf enex
     * @function validate_installation
     * @desc THIS FUNCTION IS DEPRECATED.
     * The SConnect server license validation method. Check first if SConnect is installed and start installation if needed. Then check
     * if the SConnect licence is validated and demand validation if needed.
     * @param {Object} server_validation_callback Optional callback function for validation status. Takes a single
     * parameter which is true if validation is successful, otherwise it is set to the validation error code.
     * @param {Object} extension_configuration Optional configuration info for SConnect. This object has two
     * attributes, imgPath and extPath, which tells SConnect where to find its resources. For more details, refer to the SConnect documentation.
     * @param {boolean} showValidationMsg Optional parameter for showing /hiding server validation message. Default set to true.
     */
    function validate_installation(server_validation_callback, extension_configuration, showValidationMsg) {

        checkCallback(server_validation_callback);

        // Start the SConnect initialization process (check installation, check license, start PCSC polling)
        // If SConnect is not installed then starts the installation
        var installCallback = {

            success: function () {
                if ((null !== extension_configuration) && (extension_configuration !== 'undefined') && (extension_configuration.licensePath !== 'undefined')) {
                    SConnect.ValidateServer(server_validation_callback, showValidationMsg, extension_configuration.licensePath);
                } else {
                    SConnect.ValidateServer(server_validation_callback, showValidationMsg);
                }
            },

            error: function ( /*code*/ ) {

                LoggingService.debug("installCallback.error");
                callFailure(server_validation_callback, manageError(-1, languageFindString("SConnectNotInstalled")));
            }
        };

        SConnect.Install(installCallback, !showValidationMsg);
    }
    ReturnedAPI.validate_installation = validate_installation;





    ////////////////////////////////////////////////////////////////
    // DETECTION
    ////////////////////////////////////////////////////////////////


    /**
     * @public
     * @memberOf enex
     * @function getBrowserCaracteristics
     * @desc This function returns the browser name, browser version & OS
     * @returns {Object} An object with the following properties:
     * <ul>
     *	<li>enex.BROWSER_NAME to get the name of the browser</li>
     *	<li>enex.BROWSER_VERSION to get the version of the browser</li>
     *	<li>enex.OPERATING_SYSTEM to get the name of the operating system</li>
     * </ul>
     * @example
     <pre>
     var r = enex.getBrowserCaracteristics();

     if (r) {

     var sMessage = "Your browser is " + r[enex.BROWSER_NAME];
     sMessage += ". The browser version is " + r[enex.BROWSER_VERSION]";
     sMessage += ". The Operating System is " + r[enex.OPERATING_SYSTEM]";

     alert(sMessage);
     }
     </pre>
     */
    function getBrowserCaracteristics() {

        LoggingService.debug("getPlatformInformation - (BEGIN)");

        var ret = {
            BrowserName: SConnectBrowserDetect.browser,
            BrowserVersion: SConnectBrowserDetect.version,
            OS: SConnectBrowserDetect.OS
        };

        LoggingService.info("getPlatformInformation - BrowserName (" + SConnectBrowserDetect.browser + ")");
        LoggingService.info("getPlatformInformation - BrowserVersion (" + SConnectBrowserDetect.version + ")");
        LoggingService.info("getPlatformInformation - OS (" + SConnectBrowserDetect.OS + ")");
        LoggingService.debug("getPlatformInformation - (END)");

        return ret;
    }
    ReturnedAPI.getBrowserCaracteristics = getBrowserCaracteristics;


    /**
     * @public
     * @memberOf enex
     * @function isBrowserSupported
     * @desc This function returns a boolean value to known if the current browser is supported
     * @returns {Boolean} True if the browser is supported otherwise false
     * @example
     <pre>
     var bIsBrowserSupported = enex.isBrowserSupported();

     if (bIsBrowserSupported) {

        alert("Your browser is properly supported.");
     }
     </pre>
     */
    function isBrowserSupported() {

        var isSupported = SConnect._isSupported();

        if (false === isSupported) {

            modalboxOpen(languageFindString("BrowserNotSupported"));
        }

        LoggingService.info("isBrowserSupported - (" + isSupported + ")");

        return isSupported;
    }
    ReturnedAPI.isBrowserSupported = isBrowserSupported;


    return ReturnedAPI;

}());



/**
 * @public
 * @desc Constant used to retrieve the browser name in the object returned by the function "getBrowserCaracteristics"
 * @type String
 */
enex.BROWSER_NAME = "BrowserName";

/**
 * @public
 * @desc Constant used to retrieve the browser version in the object returned by the function "getBrowserCaracteristics"
 * @type String
 */
enex.BROWSER_VERSION = "BrowserVersion";


/**
 * @public
 * @desc Constant used to retrieve the operating ssytem name in the object returned by the function "getBrowserCaracteristics"
 * @type String
 */
enex.OPERATING_SYSTEM = "OS";


/**
 * @public
 * @desc Constant used to retrieve the PCR name on reader/smart card events notification
 * @type String
 */
enex.PersonalCardReaderName = "PersonalCardReaderName";


/**
 * @public
 * @desc Constant used to retrieve the PCR information block on reader/smart card events notification
 * @type String
 */
enex.PersonalCardReaderInformation = "PersonalCardReaderInformation";


/**
 * @public
 * @desc Constant used to retrieve the smart card ATR on reader/smart card events notification
 * @type String
 */
enex.SmartCardATR = "SmartCardATR";


/**
 * Constant used to retrieve the smart card's PAN on a successfully call to the "getPrimaryAccountNumber" function
 * @type String
 * @constant
 */
enex.SmartCardPersonalAccountNumber = "SmartCardPersonalAccountNumber";


/**
 * Constant used to retrieve the smart card's PSN on a successfully call to the "getPrimaryAccountNumber" function
 * @type String
 * @constant
 */
enex.SmartCardPersonalAccountNumberSequenceNumber = "SmartCardPersonalAccountNumberSequenceNumber";


/**
 * Constant used to retrieve the smart card's expiration date on a successfully call to the "getPrimaryAccountNumber" function
 * @type String
 * @constant
 */
enex.SmartCardExpirationDate = "SmartCardExpirationDate";


/**
 * Constant used to send a verify PIN command with the "sendPPDU" or "sendSPE" functions
 * @type String
 * @constant
 */
enex.FEATURE_VERIFY_PIN_DIRECT = "06";


/**
 * Constant used to send a modify PIN command with the "sendPPDU" or "sendSPE" functions
 * @type String
 * @constant
 */
enex.FEATURE_MODIFY_PIN_DIRECT = "07";


/**
 * Constant used to send a ESC_Command command with the "sendPPDU" or "sendSPE" functions
 * @type String
 * @constant
 */
enex.FEATURE_CCID_ESC_COMMAND = "13";


/**
 * Constant used to set the time-out in SPE or PPDU template (see PC/SC part10 specification)
 * @type String
 * @constant
 */
enex.FEATURE_PARAMETER_TIMEOUT = "bTimeOut";


/**
 * Constant used to set the time-out after first key stroke in SPE or PPDU template (see PC/SC part10 specification)
 * @type String
 * @constant
 */
enex.FEATURE_PARAMETER_TIMEOUT2 = "bTimeOut2";


/**
 * Constant used to set the PIN format in SPE or PPDU template (see PC/SC part10 specification)
 * @type String
 * @constant
 */
enex.FEATURE_PARAMETER_FORMATSTRING = "bmFormatString";


/**
 * Constant used to set the PIN block string in SPE or PPDU template (see PC/SC part10 specification)
 * @type String
 * @constant
 */
enex.FEATURE_PARAMETER_PINBLOCKSTRING = "bmPINBlockString";


/**
 * Constant used to set the PIN length format in SPE or PPDU template (see PC/SC part10 specification)
 * @type String
 * @constant
 */
enex.FEATURE_PARAMETER_PINLENGTHFORMAT = "bmPINLengthFormat";


/**
 * Constant used to set the PIN maximum extra digit format in SPE or PPDU template (see PC/SC part10 specification)
 * @type String
 * @constant
 */
enex.FEATURE_PARAMETER_PINMAXEXTRADIGIT = "wPINMaxExtraDigit";


/**
 * Constant used to set the entry validation condition in SPE or PPDU template (see PC/SC part10 specification)
 * @type String
 * @constant
 */
enex.FEATURE_PARAMETER_ENTRYVALIDATIONCONDITION = "bEntryValidationCondition";


/**
 * Constant used to set the number of messages to display for PIN verification in SPE or PPDU template (see PC/SC part10 specification)
 * @type String
 * @constant
 */
enex.FEATURE_PARAMETER_NUMBERMESSAGE = "bNumberMessage";


/**
 * Constant used to set the language of messages in SPE or PPDU template (see PC/SC part10 specification)
 * @type String
 * @constant
 */
enex.FEATURE_PARAMETER_LANGID = "wLangId";


/**
 * Constant used to set the index of message in SPE or PPDU template (see PC/SC part10 specification)
 * @type String
 * @constant
 */
enex.FEATURE_PARAMETER_MSGINDEX = "bMsgIndex";


/**
 * Constant used to set the T=1 I-block prologue field to use in SPE or PPDU template (see PC/SC part10 specification)
 * @type String
 * @constant
 */
enex.FEATURE_PARAMETER_TEOPROTOCOL = "bTeoPrologue";


/**
 * Constant used to set the length of the data in SPE or PPDU template (see PC/SC part10 specification)
 * @type String
 * @constant
 */
enex.FEATURE_PARAMETER_DATALENGTH = "ulDataLength";


/**
 * Constant used to set the data in SPE or PPDU template (see PC/SC part10 specification)
 * @type String
 * @constant
 */
enex.FEATURE_PARAMETER_DATA = "abData";


/**
 * Constant used to set the insertion offset old in SPE or PPDU template (see PC/SC part10 specification)
 * @type String
 * @constant
 */
enex.FEATURE_PARAMETER_INSERTIONOFFSETOLD = "bInsertionOffsetOld";


/**
 * Constant used to set the insertion offset new in SPE or PPDU template (see PC/SC part10 specification)
 * @type String
 * @constant
 */
enex.FEATURE_PARAMETER_INSERTIONOFFSETNEW = "bInsertionOffsetNew";


/**
 * Constant used to set the PIN confirmation in SPE or PPDU template (see PC/SC part10 specification)
 * @type String
 * @constant
 */
enex.FEATURE_PARAMETER_CONFIRMPIN = "bConfirmPIN";


/**
 * Constant used to set the message index 1 in SPE or PPDU template (see PC/SC part10 specification)
 * @type String
 * @constant
 */
enex.FEATURE_PARAMETER_MSGINDEX1 = "bMsgIndex1";


/**
 * Constant used to set the message index 2 in SPE or PPDU template (see PC/SC part10 specification)
 * @type String
 * @constant
 */
enex.FEATURE_PARAMETER_MSGINDEX2 = "bMsgIndex2";


/**
 * Constant used to set the message index 3 in SPE or PPDU template (see PC/SC part10 specification)
 * @type String
 * @constant
 */
enex.FEATURE_PARAMETER_MSGINDEX3 = "bMsgIndex3";


/**
 * @public
 * @desc Constant used to set the Gemalto proprietary algorithm as SWYS algorithm.
 * @type String
 */
enex.SWYS_ALGO_GEMALTO = "gemalto";


/**
 * @public
 * @desc Constant used to set an algorithm based on CAP Mode2 TDS as SWYS algorithm.
 * @type String
 */
enex.SWYS_ALGO_MODE2TDS = "mode2tds";


/**
 * @public
 * @desc Constant used to set an algorithm based on CAP Mode3 TDS as SWYS algorithm.
 * @type String
 */
enex.SWYS_ALGO_MODE3TDS = "mode3tds";


/**
 * @public
 * @desc Constant used to set the Gemalto proprietary algorithm as SWYS algorithm.
 * @type String
 */
enex.SWYS_ALGO_GEMALTO_SHA256 = "gemalto_SHA256";


/**
 * @public
 * @desc Constant used to set an algorithm based on CAP Mode2 TDS as SWYS algorithm.
 * @type String
 */
enex.SWYS_ALGO_MODE2TDS_SHA256 = "mode2tds_SHA256";


/**
 * @public
 * @desc Constant used to set an algorithm based on CAP Mode3 TDS as SWYS algorithm.
 * @type String
 */
enex.SWYS_ALGO_MODE3TDS_SHA256 = "mode3tds_SHA256";

/**
 * @public
 * @desc Constant used to set the Gemalto proprietary algorithm as SWYS algorithm.
 * @type String
 */
enex.SWYS_ALGO_DEVICE_CONFIGURATION = "configured_by_device";

enex.SWYS_APPLICATION_FOR_BANK = "BANK";
enex.SWYS_APPLICATION_FOR_SHOPPING = "SHOP";
enex.SWYS_APPLICATION_DEVICE_CONFIGURATION = "DEVICE_CONFIGURATION";
