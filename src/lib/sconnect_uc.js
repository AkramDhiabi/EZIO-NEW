/* JSHint configuration */
/*jslint bitwise: true */
/*global window: false */
/*global LoggingService: true */
/*global document: true */
/*global navigator: true */
/*global setInterval: true */
/*global clearInterval: true */
/*global ActiveXObject: true */
/*global InstallTrigger: true */

// ------------------ SConnect Browser Detection -----------

/**
 * SConnectBrowserDetect
 * 
 * @private
 * @ignore
 */
var SConnectBrowserDetect = {
    /*
     * @private
     * @ignore
     */
    init: function () {

        this.browser = this.searchString(this.dataBrowser) || "An unknown browser";
        this.version = this.searchVersion(navigator.userAgent) || this.searchVersion(navigator.appVersion) || "an unknown version";
        this.OS = this.searchString(this.dataOS) || "an unknown OS";

        this.isWindows = (this.OS == "Windows");
        this.isLinux = (this.OS == "Linux");
        this.isMac = (this.OS == "Mac");

        this.isFirefox = (this.browser == "Firefox");
        this.isIE = (this.browser == "Explorer");
        this.isChrome = (this.browser == "Chrome");
        this.isSafari = (this.browser == "Safari");
        this.isOpera = (this.browser == "Opera");

        this._safariAppExtMinVersion = 10.1;
        // TODO: improve version comparsion - see SCONNECT-664 (and then _safariAppExtMinVersion could be changed to 10.0.3)
        this.isSafari9 = (this.isSafari) && (this.version >= 9) && (this.version < this._safariAppExtMinVersion);
        this.isSafariAppex = (this.isSafari) && (this.version >= this._safariAppExtMinVersion);
    },

    /*
     * @private
     * @ignore
     */
    abbr: function () {
        if (this.isFirefox) {
            return '-ff';
        }
        if (this.isIE) {
            return '-ie';
        }
        if (this.isChrome) {
            return '-cr';
        }
        if (this.isSafari) {
            return '-sf';
        }
        if (this.isOpera) {
            return '-op';
        }
        return '';
    },

    /*
     * @private
     * @ignore
     */
    searchString: function (data) {
        for (var i = 0; i < data.length; i++) {
            var dataString = data[i].string;
            var dataProp = data[i].prop;
            this.versionSearchString = data[i].versionSearch || data[i].identity;
            if (dataString) {
                if (dataString.indexOf(data[i].subString) != -1) {
                    return data[i].identity;
                }
            } else {
                if (dataProp) {
                    return data[i].identity;
                }
            }
        }
    },
    /*
     * @private
     * @ignore
     */
    searchVersion: function (dataString) {

        var index = dataString.indexOf(this.versionSearchString);
        if (index == -1) {
            return;
        }

        var ver = dataString.substring(index + this.versionSearchString.length + 1);

        index = ver.indexOf(' ');
        if (index != -1) {
            ver = ver.substring(0, index);
        }

        return parseFloat(ver);
    },

    /*
     * @private
     * @ignore
     */
    dataBrowser: [
        {
            string: navigator.userAgent,
            subString: "Edge",
            identity: "Edge",
            versionSearch: "Edge"
        },
        {
            string: navigator.userAgent,
            subString: "OPR",
            identity: "Opera",
            versionSearch: "OPR"
        },
        {
            string: navigator.userAgent,
            subString: "Chrome",
            identity: "Chrome",
            versionSearch: "Chrome"
        },
        {
            string: navigator.vendor,
            subString: "Apple",
            identity: "Safari",
            versionSearch: "Version"
        },
        {
            string: navigator.userAgent,
            subString: "Firefox",
            identity: "Firefox",
            versionSearch: "Firefox"
        },
        {
            string: navigator.userAgent,
            subString: "MSIE",
            identity: "Explorer",
            versionSearch: "MSIE"
        },
        {
            string: navigator.userAgent,
            subString: "Trident",
            identity: "Explorer",
            versionSearch: "rv"
        }
    ],

    /*
     * @private
     * @ignore
     */
    dataOS: [
        {
            string: navigator.platform,
            subString: "Win",
            identity: "Windows"
        },
        {
            string: navigator.platform,
            subString: "Mac",
            identity: "Mac"
        },
        {
            string: navigator.platform,
            subString: "Linux",
            identity: "Linux"
        }
    ]

};

/*
 * @private
 * @ignore
 */
SConnectBrowserDetect.init();

// ------------------ SConnect Constants -----------

/**
 * Constants for SConnect server validation result error code.
 */
function SConnectValidation() {}

SConnectValidation.VALIDATION_ERROR_SUCCESS = 0;
SConnectValidation.VALIDATION_ERROR_NOSECURITYKEY = 1;
SConnectValidation.VALIDATION_ERROR_INCORRECT_CREDENTIALS = 2;
SConnectValidation.VALIDATION_ERROR_INVALID_CREDENTIALS = 3;
SConnectValidation.VALIDATION_ERROR_INVALID_SSL = 4;
SConnectValidation.VALIDATION_ERROR_INTERNAL_ERROR = 5;
SConnectValidation.VALIDATION_ERROR_PROXY_AUTHENTICATION = 6;
SConnectValidation.VALIDATION_ERROR_NO_SSL = 9;
SConnectValidation.VALIDATION_ERROR_NO_SERVICE = 11;


// ------------------ SConnect -----------

/**
 * @constructor
 */
var SConnect = function () {};

// ------------------ SConnect Global Variables -----------

/**
 * @private
 */
SConnect._functCallbacks = {};

/**
 * @private
 */
SConnect._eventCallbacks = {};

/**
 * @private
 */
SConnect._copyright = "© " + new Date().getFullYear() + " Gemalto";

/**
 * @private
 */
SConnect._urlPrefix = "https://";

/**
 * @private
 */
SConnect._addonPath = SConnect._urlPrefix + "www.sconnect.com/addons/";

/**
 * @private
 */
SConnect._eulaPath = SConnect._urlPrefix + "www.sconnect.com/eula/";

/**
 * @private
 */
SConnect._extPath = SConnect._urlPrefix + "www.sconnect.com/extensions/";

/**
 * @private
 */
SConnect._faqPath = SConnect._urlPrefix + "www.sconnect.com/faqs/";

/**
 * @private
 */
SConnect._imgPath = SConnect._urlPrefix + "www.sconnect.com/images/";

/**
 * @private
 */
SConnect._expVersion = 0x02050000;
/**
 * @private
 */
SConnect._expVersionSafariNpapi = 0x02030000; // 2.3.0.0
/**
 * @private
 */
SConnect._expVersionStr = "2.5.0.0";
/**
 * @private
 */
SConnect._expVersionStrSafariNpapi = "2.3.0.0"; // For Safari 9/10.0 and below, 2.3.0.0
/**
 * @private
 */
SConnect._crExeName = "sconnect-host-v" + SConnect._expVersionStr + ".exe";
/**
 * @private
 */
SConnect._xpiName = "sconnect-ff-v" + SConnect._expVersionStr + ".xpi";
/**
 * @private
 */
SConnect._ieExeName = "sconnect-ie-v" + SConnect._expVersionStr + ".exe";
/**
 * @private
 */
SConnect._sfPkgName = "sconnect-sf-v" + SConnect._expVersionStr + ".pkg";
SConnect._sfPkgNameNpapi = "sconnect-sf-v" + SConnect._expVersionStrSafariNpapi + ".pkg";

/**
 * @private
 */
SConnect._cmdInProgress = false;

/**
 * Configure the location of required SConnect assets.
 *
 * <p>
 * Usage: 
 *   <br/>
 *   SConnect.ConfigResources({
 *         addonPath : 'http://www.example.com/addons/'
 *         eulaPath : 'http://www.example.com/eula/',
 *         extPath : 'http://www.example.com/extensions/',
 *         faqPath : 'http://www.example.com/faq/',
 *         imgPath : 'http://www.example.com/images/',
 *   });
 * </p>
 * 
 * @param {Object} config an object which specifies the path to folders containing resources as shown in the example above.
 */
SConnect.ConfigResources = function (config) {

    if (config.addonPath) {
        SConnect._addonPath = config.addonPath;
    }
    if (config.eulaPath) {
        SConnect._eulaPath = config.eulaPath;
    }

    if (config.extPath) {
        SConnect._extPath = config.extPath;
    }

    if (config.faqPath) {
        SConnect._faqPath = config.faqPath;
    }

    if (config.imgPath) {
        SConnect._imgPath = config.imgPath;
    }
};

/**
 * @private
 */
SConnect._reload = function () {

    window.location.reload();

};

// ------------------ SConnect Exception -----------

/**
 * @private
 */
SConnect.Inherits = function (subc, superc) {

    function F() {}
    F.prototype = superc.prototype;
    subc.prototype = new F();
    subc.prototype.constructor = subc;
    subc.superclass = superc;
    subc.superproto = superc.prototype;
};

SConnect.Exception = function (message) {
    this._message = message || "";
};

SConnect.Exception.prototype = {

    getErrorMessage: function () {
        return this._message;
    }
};

// -------------------- Localization --------------------

/**
 * @private
 */
SConnect._localize = function (key) {

    this._baseLang = 'en';
    this._languages = ['ar', 'de', 'en', 'es', 'fr', 'nl', 'pt', 'sv'];

    this.LocalStrings = {

        ActiveXFilter: [
			"برجاء ايقاف تشغيل عنصر التحكم ActiveX Filtering وأعد تشغيل المتصفح انترنت اكسبلورر",
			"Bitte schalten sie die IE ActiveX-Filtering-Funktion aus und nachladen sie die seite",
			"Please turn off the IE ActiveX Filtering feature and reload the page",
			"Por favor, desactive el filtrado ActiveX de IE y recargue la página",
			"Désactivez le filtrage ActiveX d’IE et rechargez la page",
			"Zet de IE ActiveX-filtering uit en laad de pagina opnieuw",
			"Por favor desabilite o parâmetro IE ActiveX Filtering e recarregue a página",
			"Vänligen stäng av IE ActiveX filtreringsfunktion och ladda om sidan"
		],
        BrowserRestart: [
			"يرجى إعادة تشغيل المتصفح بعد اكتمال التثبيت",
			"Bitte starten sie ihren browser nach abschluss der installation neu",
			"Please restart the browser after the installation is complete",
			"Reinicie el navegador para completar la instalación",
			"Veuillez redémarrer votre navigateur après l’installation",
			"Start uw browser opnieuw op als de installatie voltooid is",
			"Por favor reiniciar o navegador depois que a instalação estiver completa",
			"Vänligen starta om webbläsaren efter installationen är färdig"
		],
        Close: ["أغلق", "Schließen", "Close", "Cerrar", "Fermer", "Sluit", "Fechar", "Stäng"],
        Help: ["مساعدة", "Hilfe", "Help", "Ayuda", "Aide", "Help", "Ajuda", "Hjälp"],
        InstallChromeDialog1: [
			"Chrome تثبيت للمتصفح - (SConnect (1/2",
			"Installation für Chrome - SConnect (1/2)",
			"Installation for Chrome - SConnect (1/2)",
			"Instalación por Chrome - SConnect (1/2)",
			"Installation dans Chrome - SConnect (1/2)",
			"Installatie voor Chrome - SConnect (1/2)",
			"Instalação Chrome - SConnect (1/2)",
			"Installation för Chrome - SConnect (1/2)"
		],
        InstallChromeDialog2: [
			"يرجى اتباع التعليمات التالية لتثبيت SConnect.",
			"Bitte folgen sie den nachstehenden anweisungen, um SConnect zu installieren.",
			"Please follow the instructions below to install SConnect.",
			"Por favor, siga las instrucciones descritas a continuación para la instalación de SConnect.",
			"Merci de suivre la procédure suivante pour installer SConnect.",
			"Volg de instructies om SConnect te installeren.",
			"Por favor siga as instruções abaixo para instalar o SConnect.",
			"Vänligen följ instruktionerna nedan för att installera SConnect."
		],
        InstallChromeDialog3: ["أنقر هنا", "Hier klicken", "Click here", "Clic aquí", "Cliquez ici", "Klik hier", "Clicar aqui", "Klicka här"],
        InstallChromeDialog4: ["تثبيت", "Installieren", "Install", "Instalar", "Installer", "Installeer", "Instalar", "Installera"],
        InstallChromeDialog5: ["إضافة", "Hinzufügen", "Add", "Añadir", "Ajouter", "Voeg toe", "Adicionar", "Lägg"],
        InstallChromeDialog6: ["تنفيذ", "Ausführen", "Execute", "Ejecutar", "Exécuter", "Voer uit", "Executar", "Kör"],
        InstallChromeDialog7: ["تثبيت", "Installieren", "Install", "Instalar", "Installer", "Installeer", "Instalar", "Installera"],
        InstallChromeDialog8: ["تم", "Fertig", "Done", "Finalizado", "Terminée", "En klaar!", "Finalizado", "Klar"],
        InstallOperaDialog1: [
			"Opera تثبيت للمتصفح - (SConnect (1/2",
			"Installation für Opera - SConnect (1/2)",
			"Installation for Opera - SConnect (1/2)",
			"Instalación por Opera - SConnect (1/2)",
			"Installation dans Opera - SConnect (1/2)",
			"Installatie voor Opera - SConnect (1/2)",
			"Instalação Opera - SConnect (1/2)",
			"Installation för Opera - SConnect (1/2)"
		],
        InstallFirefoxDialog1: [
			"Firefox تثبيت للمتصفح - (SConnect (1/2",
			"Installation für Firefox - SConnect (1/2)",
			"Installation for Firefox - SConnect (1/2)",
			"Instalación por Firefox - SConnect (1/2)",
			"Installation dans Firefox - SConnect (1/2)",
			"Installatie voor Firefox - SConnect (1/2)",
			"Instalação Firefox - SConnect (1/2)",
			"Installation för Firefox - SConnect (1/2)"
		],
        InstallSafariDialog1: [
			"Safari تثبيت للمتصفح - SConnect",
			"Installation für Safari - SConnect",
			"Installation for Safari - SConnect",
			"Instalación por Safari - SConnect",
			"Installation dans Safari - SConnect",
			"Installatie voor Safari - SConnect",
			"Instalação Safari - SConnect",
			"Installation för Safari - SConnect"
		],
        InstallSafariDialog2: [
			".SConnect يرجى اتباع التعليمات التالية لتثبيت",
			"Bitte folgen sie den nachstehenden anweisungen, um SConnect zu installieren.",
			"Please follow the instructions below to install SConnect.",
			"Por favor, siga las instrucciones descritas a continuación para la instalación de SConnect.",
			"Merci de suivre la procédure suivante pour installer SConnect.",
			"Volg de instructies om SConnect te installeren.",
			"Por favor siga as instruções abaixo para instalar o SConnect.",
			"Vänligen följ instruktionerna nedan för att installera SConnect."
		],
        InstallSafariDialog3: ["تنفيذ", "Ausführen", "Execute", "Ejecutar", "Exécuter", "Voer uit", "Executar", "Kör"],
        InstallSafariDialgSetup: ["إعداد", "Setup", "Setup", "Configurar", "Configurer", "Stel in", "Instalação", "Konfigurera"],
        InstallSafariDialgInstall: ["تثبيت", "Installieren", "Install", "Instalar", "Installer", "Installeer", "Instalar", "Installera"],
        InstallSafariDialgTrust: ["الوثوق", "Vertrauen", "Trust", "Confiar", "Se fier", "Sta toe", "Confiar", "Tillåt"],
        InstallDialog1: [
			"شرووط وأحكام إسكونيكت - SConnect",
			"Geschäftsbedingungen - SConnect",
			"Terms and Conditions - SConnect",
			"Términos y Condiciones - SConnect",
			"Conditions Générales - SConnect",
			"Algemene Voorwaarden - SConnect",
			"Termos e Condições - SConnect",
			"Villkor för SConnect"
		],
        InstallDialog2: [
			"SConnect هو ملحق لمتصفح الأنترنت يخول لتطبيقات الويب تحسين طرق حمايتها وذلك عن طريق الإنتفاع بالأجهزة المدعومة من الملحق والتى تكون متصلة بجهاز الحاسب الآلى.",
			"SConnect ist eine Browser-Erweiterung, die es ermöglicht, die Datenkommunikation von Web-Anwendungen von Dritt-Anbietern zu und von Iihem Computer abzusichern.",
			"SConnect is a browser extension that enables web applications to enhance their security by utilizing security devices connected to a computer.",
			"SConnect es una extensión del navegador que permite mejorar la seguridad en las aplicaciones web mediante la utilización de dispositivos compatibles conectados a un ordenador.",
			"SConnect est une extension du navigateur qui permet aux applications web d'accroitre leur sécurité en utilisant des dispositifs connectés à l'ordinateur.",
			"SConnect is een extensie voor uw browser. Dankzij SConnect kunt u webtoepassingen gebruiken met apparaten die u op uw computer aansluit. Zo worden de toepassingen veiliger.",
			"SConnect é uma extensão do navegador que permite que aplicações web melhorar a sua segurança através da utilização de dispositivos suportados conectados a um computador.",
			"SConnect är ett tillägg till webbläsaren som gör att webbapplikationer kan öka säkerheten genom att utnyttja stödda enheter som är anslutna till en dator."
		],
        InstallDialog3: [
			"بموجب هذا التفويض أوافق على السماح بتثبيت ملحق SConnect على جهاز الحاسب الآلى الخاص بي وأعترف بأن تطبيقات الويب المدعمة بـ SConnect من الممكن ان تنتفع بهذه الأجهزة. أنا أقبل المسئولية لمثل هذا الأستخدام وفقاً للشروط والأحكام ",
			"Hiermit ermächtige ich die Installation von SConnect auf meinem Computer und erkennen an, dass Web-Anwendungen durch SConnect angeschlossene Geräten aktiviert und kommuniziert. Ich akzeptiere die Verantwortung für eine solche Nutzung nach den ",
			"I hereby authorize the installation of SConnect on my computer and acknowledge that SConnect enabled web applications may utilize these devices. I accept responsibility for such use according to the terms and conditions of the ",
			"Por la presente, autorizo la instalación de SConnect en mi ordenador y reconozco el uso de estos dispositivos por parte de las aplicaciones web en las que SConnect se encuentre habilitado. Acepto la responsabilidad de ",
			"J'autorise l'installation de SConnect sur mon ordinateur et j'accepte que les applications web ayant accès à SConnect puissent utiliser ces dispositifs. J'accepte la responsabilité de cet usage conformément aux conditions ",
			"Ik geef toestemming om SConnect op mijn computer te instelleren en erken dat de applicaties die SConnect ondersteunen deze toestellen kunnen gebruiken. Ik aanvaard de verantwoordelijkheid voor dat gebruik zoals beschreven in de ",
			"Autorizo ​​a instalação do SConnect em meu computador e reconheço que as aplicações web SConnect habilitados podem utilizar esses dispositivos. Aceito a responsabilidade por tal uso de acordo com os termos e condições do ",
			"Jag accepterar installationen av SConnect på min dator, och godkänner jag att webbapplikationer får använda SConnect aktiverade enheter. Jag åtar mig ansvaret för sådant användande enligt villkoren i "
		],
        InstallDialog4: [
			"اتفاقية ترخيص المستخدم النهائي.",
			"SConnect Endbenutzer-Lizenzabkommens.",
			"SConnect End User License Agreement.",
			"Contrato de Licencia de Usuario Final de SConnect.",
			"Contrat de Licence de l’Utilisateur de SConnect.",
			"SConnect-Licensieovereenkomst Eindgebruiker.",
			"Acordo de Licença do SConnect.",
			"SConnect Slutanvändarvillkor."
		],
        InstallDialog5: ["رفض", "Ablehnen", "Decline", "Rechazar", "Refuser", "Niet akkoord", "Não concordo", "Avböj"],
        InstallDialog6: [
			"قبول و تثبيت",
			"Akzeptieren und Installieren",
			"Accept and Install",
			"Aceptar e Instalar",
			"Accepter et Installer",
			"Aanvaard en Installeer",
			"Aceitar e Instalar",
			"Acceptera och Installera"
		],
        InstallDialog7: [
			"قبول و تحديث",
			"Akzeptieren und Aktualisieren",
			"Accept and Update",
			"Aceptar y Actualizar",
			"Accepter et Mettre à Jour",
			"Aanvaard en Actualiseer",
			"Aceitar e Atualizar",
			"Acceptera Uppdatering"
		],
        InstallDialog8: ['ar/', 'de/', '', 'es/', 'fr/', '', 'pt/', ''], // TODO: change this
        NotSupportedDialog1: [
			"المتصفح غير مدعم",
			"Browser wird nicht unterstützt",
			"Browser not supported",
			"Buscador no respaldado",
			"Navigateur non pris en charge",
			"Uw browser wordt niet ondersteund",
			"Browser não suportado",
			"Webbläsaren stöds inte"
		],
        NotSupportedDialog2: [
			"إسكونيكت غير مدعم في الوقت الحاضر لهذا المتصفح.",
			"SConnect wird derzeit für diesen browser nicht unterstützt.",
			"SConnect is currently not supported for this browser.",
			"SConnect actualmente no está respaldado para este buscador.",
			"SConnect n’est actuellement pas pris en charge pour ce navigateur.",
			"U kunt uw huidige browser niet gebruiken voor SConnect.",
			"Neste momento, o SConnect não é suportado para este browser.",
			"SConnect stödjer för tillfället inte denna webbläsare."
		],
        NotSupportedDialog3: [
			"المتصفحات المدعمة هي:",
			"Unterstützte browser sind:",
			"Supported browsers are:",
			"Los buscadores respaldados son:",
			"Les navigateurs pris en charge sont:",
			"Ondersteunde browsers:",
			"Os navegadores suportados são:",
			"Webbläsare som stöds är:"
		],
        NotSupportedDialog4: [
			"منصات التشغيل المدعمة هي:",
			"Unterstützte plattformen sind:",
			"Supported platforms are:",
			"Las plataformas respaldadas son:",
			"Les plates-formes prises en charge sont:",
			"Ondersteunde besturingssystemen:",
			"As plataformas suportadas são:",
			"Operativsystem som stöds är:"
		],
        NotSupportedDialog5: [
			"أو لاحقا",
			"oder neuer",
			"or later",
			"o posterior",
			"ou version ultérieure",
			"of hoger",
			"ou posterior",
			"eller senare"
		],
        Reload: ["إعادة تحميل", "Neu laden", "Reload", "Recargar", "Recharger", "Opnieuw laden", "Recarregar", "Ladda om"],
        ValidationMsg1: [
			"الرجاء الإنتظار ...",
			"Bitte warten ...",
			"Please wait ...",
			"Espere por favor ...",
			"Veuillez patienter ...",
			"Een ogenblik geduld ...",
			"Por favor, aguarde ...",
			"Vänligen vänta ..."
		],
        ValidationMsg2: [
			"مصادقة المزود في تقدم",
			"Server-validierung laufend",
			"Server validation in progress",
			"Validación del servidor en progreso",
			"Validation du serveur en cours",
			"De server wordt gevalideerd",
			"Validação do servidor em andamento",
			"Verifiering av server pågår"
		],
        AddOnInstallMsg1: [
			"الرجاء الإنتظار ...",
			"Bitte warten ...",
			"Please wait ...",
			"Espere por favor ...",
			"Veuillez patienter ...",
			"Een ogenblik geduld ...",
			"Por favor, aguarde ...",
			"Vänligen vänta ..."
		],
        AddOnInstallMsg2: [
			"جاري التحميل",
			"Laden",
			"Loading",
			"Cargando",
			"Chargement",
			"Laden",
			"Carregando",
			"Laddar"
		],
        ExecuteInstallerMsg: [
			"تنفيذ مثبت SConnect",
			"Führer SConnect installation aus",
			"Execute SConnect installer",
			"Ejecutar el instalador de SConnect",
			"Exécutez l'installateur SConnect",
			"Voer de SConnect-installatie uit",
			"Execute o instalador SConnect",
			"Starta SConnect installation"
		],
        NoServiceMsg: [
			"SConnect خدمة غير نشطة",
			"Der SConnect-Dienst ist nicht aktiv",
			"The SConnect service is not active",
			"El servicio SConnect no está activo",
			"Le service SConnect n'est pas actif",
			"De SConnect-service is niet actief",
			"O serviço SConnect não está ativo",
			"SConnect-tjänsten är inte aktiv"
		]
    }; // end LocalStrings

    // languages = ['ar', 'de', 'en', 'es', 'fr', 'nl', 'pt', 'sv'];
	// Arabic, German, English, Spanish, French, Dutch, Portuguese (Portugal), Swedish
	// https://msdn.microsoft.com/en-us/library/ms533052(v=vs.85).aspx
    this.LocalStrings2 = {

        SafariOpenPreferences: [
			"[CMD]+[,] افتح التفضيلات",
			"Öffnen die Einstellungen",
			"Open Preferences [CMD]+[,]",
			"Abrir las Preferencias [CMD]+[,]",
			"Ouvrir les Préférences [CMD]+[,]",
			"Open de Voorkeuren [CMD]+[,]",
			"Abrir as preferências [CMD]+[,]",
			"Öppna inställningarna [CMD]+[,]"
		],
        SafariExtensionEnable: [
								"تبويب 'الإضافات' وتمكينها",
			"Erweiterungen und aktivieren",
			"Extensions tab and enable",
			"Extensiones y permitir",
			"Onglet Extensions puis activer",
			"Extensies tab en activeer",
			"Extensões tab e ativar",
			"Välj fliken tillägg och aktivera"
		],
        ClickWhenDone: [
			"انقر هنا عند الانتهاء",
			"Clicken hier, wenn fertig",
			"Click here when done",
			"Clic aquí cuando terminado",
			"Cliquer ici pour finaliser",
			"Klik hier als klaar",
			"Clique aqui quando terminar",
			"Klicka här när du är klar"
		],
		InstallChromeDialog6_lx: ["استخراج", "Extrakt", "Extract", "Extraer", "Veuillez extraire", "Extract", "Extrair", "Extrahera"],
        InstallChromeDialog7_lx: ["تشغيل المثبت من المحطة الطرفية", "Installer vom Terminal ausführen", "Run Installer From Terminal", "Ejecutar el instalador desde la terminal", "Lancer l'installation depuis un terminal", "Run Installer From Terminal", "Executar o instalador do terminal", "Kör installationsprogrammet från terminalfönstret"],				

    }; // end LocalStrings2

    this.LocalStrings.InstallOperaDialog2 = this.LocalStrings.InstallChromeDialog2;
    this.LocalStrings.InstallOperaDialog3 = this.LocalStrings.InstallChromeDialog3;
    this.LocalStrings.InstallOperaDialog4 = this.LocalStrings.InstallChromeDialog4;
    this.LocalStrings.InstallOperaDialog5 = this.LocalStrings.InstallChromeDialog8;
    this.LocalStrings.InstallOperaDialog6 = this.LocalStrings.InstallChromeDialog6;
    this.LocalStrings.InstallOperaDialog7 = this.LocalStrings.InstallChromeDialog7;
    this.LocalStrings.InstallOperaDialog8 = this.LocalStrings.InstallChromeDialog8;
    this.LocalStrings.InstallFirefoxDialog2 = this.LocalStrings.InstallChromeDialog2;
    this.LocalStrings.InstallFirefoxDialog3 = this.LocalStrings.InstallChromeDialog3;
    this.LocalStrings.InstallFirefoxDialog4 = this.LocalStrings.InstallChromeDialog4;
    this.LocalStrings.InstallFirefoxDialog5 = this.LocalStrings.InstallChromeDialog8;
    if (SConnectBrowserDetect.isLinux)
	{
		this.LocalStrings.InstallFirefoxDialog6 = this.LocalStrings2.InstallChromeDialog6_lx;
		this.LocalStrings.InstallFirefoxDialog7 = this.LocalStrings2.InstallChromeDialog7_lx;
	}
	else
	{
		this.LocalStrings.InstallFirefoxDialog6 = this.LocalStrings.InstallChromeDialog6;
		this.LocalStrings.InstallFirefoxDialog7 = this.LocalStrings.InstallChromeDialog7;
	}
    this.LocalStrings.InstallFirefoxDialog8 = this.LocalStrings.InstallChromeDialog8;

    // Safari 9 up to Safari 10.0 (inclusive) require a certain image, Safari 10.1 and later using appex requires a different image.
    var isOSX10_9 = (navigator.userAgent.indexOf('Mac OS X 10_9') > -1);

    if (SConnectBrowserDetect.isSafariAppex) {
        this.LocalStrings.InstallSafariDialog4 = this.LocalStrings.InstallSafariDialgInstall;
        this.LocalStrings.InstallSafariDialog5 = this.LocalStrings2.SafariOpenPreferences;
        this.LocalStrings.InstallSafariDialog6 = this.LocalStrings2.SafariExtensionEnable;
        this.LocalStrings.InstallSafariDialog7 = this.LocalStrings2.ClickWhenDone;
    } else {
        this.LocalStrings.InstallSafariDialog4 = this.LocalStrings.InstallSafariDialgSetup;
        if ((SConnectBrowserDetect.isSafari9) && (!isOSX10_9)) {
            this.LocalStrings.InstallSafariDialog5 = this.LocalStrings.InstallSafariDialgTrust;
        } else {
            this.LocalStrings.InstallSafariDialog5 = this.LocalStrings.InstallSafariDialgInstall;
        }
    }

    var lang = (navigator.language ? navigator.language : navigator.userLanguage).substring(0, 2),
        b, i = -1,
        j, arr = [],
        s;

    for (j = 0; j < this._languages.length; j++) {

        if (this._languages[j] === this._baseLang) {
            b = j;
        }

        if (this._languages[j] === lang) {
            i = j;
            break;
        }
    }

    if (i === -1) {
        i = b;
    }

    if (!key) {
        return lang;
    }

    if (this.LocalStrings[key]) {

        return this.LocalStrings[key][i];
    } else {

        for (s in this.LocalStrings) {
            if (s.indexOf(key) !== -1) {
                arr.push(this.LocalStrings[s][i]);
            }
        }

        return arr.length === 1 ? arr.toString() : arr;
    }
};

// ------------------ SConnect UIs -----------

/**
 * @private
 */
SConnect._baseStyle = function () {

    // create the styles if they don't exist
    if (!this._styleCreated) {

        this._createStyleSheet(

            '#sconnect-dialog { font:13px arial,helvetica,sans-serif;left:0;position:absolute;right:0;top:100px; }' +
            '#sconnect-dialog-action { height:40px;margin-top:15px; }' +
            '#sconnect-dialog-copyright { bottom:20px;color:#aaa;font-size:9px;position:absolute; }' +
            '#sconnect-dialog-copyright.sconnect-small { position:relative;top:8px; }' +
            '#sconnect-dialog-box { background:#fff;border:1px solid #222;box-shadow: 0 5px 40px #000;padding:20px;width:500px;margin:0 auto;box-sizing:initial; }' +
            '#sconnect-dialog-box.wide { padding:25px;width:600px; }' +
            '#sconnect-dialog-desc { font-weight:bold;margin:10px 0;text-align:justify;line-height:18px; }' +
            '#sconnect-dialog-desc.center { color:#777;font-size:15px;font-weight:normal;padding:10px 0px 0px 0px;text-align:center; }' +
            '#sconnect-dialog-content { background-color:#eee;border:1px solid #ccc;text-align:justify;padding:10px;line-height:18px; }' +
            '#sconnect-dialog-content>ul { margin:1em 0;padding-left:40px; }' +
            '#sconnect-dialog-content>ul>li { list-style:disc; }' +
            '#sconnect-dialog-title { border-bottom:2px solid #aaa;font-size:16px;font-weight:bold;padding-bottom:6px; }' +
            '#sconnect-eula,#sconnect-install,#sconnect-nosupport,#sconnect-notify { height:100%;left:0;position:absolute;top:0;width:100%;z-index:10000; }' +
            '#sconnect-notice { background:#ccc;border:1px solid #222;background-image:-moz-linear-gradient(top,#eee,#ccc);background-image:-webkit-linear-gradient(top,#eee,#ccc);box-shadow:0 2px 10px #000;filter:progid:DXImageTransform.Microsoft.gradient(startColorstr="#eeeeee",endColorstr="#cccccc");font:13px arial,helvetica,sans-serif;left:0;padding:6px 12px;position:absolute;right:0;top:0; }' +
            '#sconnect-notice-content { line-height:2.5em; }' +
            '#sconnect-notify { height:auto; }' +
            '#sconnect-overlay { background:#333 none repeat scroll 0 0;filter:alpha(opacity=50);height:100%;opacity:0.7;width:100%;top:0;left:0;position:fixed; }' +
            '#sconnect-restart { margin-left:10px;margin-right:10px;padding:4px 8px; }' +
            '.sconnect-box { background-color:#ccc;border:1px solid #888; }' +
            '.sconnect-btn { background-color:#ccc;border:1px solid #888;color:#000;cursor:pointer;height:40px;margin:0;padding:10px 15px; }' +
            '.sconnect-center { margin-top:8px; }' +
            '.sconnect-clear { clear:both;padding-top:1em;text-align:center; }' +
            '.sconnect-close { background-image:url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAAadEVYdFNvZnR3YXJlAFBhaW50Lk5FVCB2My41LjEwMPRyoQAAAF1JREFUOE9j+P//PwMlmCLNIIsHoQEMQEcB8SH0cAGKHQDJYYjjUghUfBgmB9MMogkaAA4YqG1QGmwzNs14AxHJEJyaaWcARV7AFmAkBSKuACM6GknNF4MwKZPqBQB+BKeMvjiRLAAAAABJRU5ErkJggg==") }' +
            '.sconnect-help { background-image:url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAAadEVYdFNvZnR3YXJlAFBhaW50Lk5FVCB2My41LjEwMPRyoQAAALBJREFUOE9j+P//PwMlmCLNIIuxGsDAwMABxK1A/AGIgaoYngBxNBCzoLsWwwCQIiDeC9UI0oyMJxBjQDhU0w8grQg1cCqSQQrIhmBzQRtQ8R0g7oIpBLJ9kQzQwmsAhhMZGGSBmh9BDQDRKOGANxaAih2BGOQVUDiAAtSQYBigOI+B4QhUMyhQRbGlF0IugMWAI67ERpuEhBT6MBdgxD9cDb58gBR1A2QAMbmU4kAEAEjoeRcQ2wlnAAAAAElFTkSuQmCC") }' +
            '.sconnect-icon { cursor:pointer;height:16px;position:relative;width:16px; }' +
            '.sconnect-install { background-color:#37e;border-color:#35b;color:#fff;font-size:14px; }' +
            '.sconnect-left { float:left; }' +
            '.sconnect-link-left { float:left;padding-left:10px; }' +
            '.sconnect-link-right { float:right;padding-right:10px; }' +
            '.sconnect-overlay { float:left;position:relative;padding:10px; }' +
            '.sconnect-overlay>div { bottom:32px;color:#555;margin-bottom:-1em;position:relative;text-align:center; }' +
            '.sconnect-overlay>div.img-title { font-size:12px;bottom:28px; }' +
            '.sconnect-overlay>div.sconnect-number { background:#37e;border-radius:12px;bottom:-2px;color:#fff;font-size:11px;font-weight:bold;line-height:18px;margin:0 auto;width:18px; }' +
            '.sconnect-overlay>img { height:144px;margin:0 3px;width:180px; }' +
            '.sconnect-right { float:right; }' +
            '.sconnect-round { -webkit-border-radius:4px;-moz-border-radius:4px;-border-radius:4px; }' +
            '.sconnect-text { color:#000;font-size:16px;font-weight:bold; }' +
            '.sconnect-text-left { text-align:left; }' +
            '.sconnect-text-right { text-align:right; }' +
            'a.sconnect-link { color:#888;height:40px;line-height:4.5em;text-decoration:underline; }' +
            'a:hover.sconnect-link { color:#666; }' +
            'a>.sconnect-text,a:focus>.sconnect-text,a:hover>.sconnect-text,a:visited>.sconnect-text { text-decoration:none; }' +
            '#sconnect-execute-msg { color:white;padding:15px;font-family:tahoma,arial;font-size:14px;background:#3079ED;border:1px solid #fff;box-shadow:0 5px 40px #444; }' +
            '#sconnect-bounce-top { display:none;top:10px;right:7px;position:fixed;-webkit-animation:bounce-top 1s infinite; }' +
            '@-webkit-keyframes bounce-top { 0%	{ top: 15px; } 25%, 75% { top: 20px; } 50% { top: 25px; } 100% { top: 10px; } }' +
            '#sconnect-bounce-bottom { display:none;bottom:5px;left:5px;position:fixed; -webkit-animation:bounce-bottom 1s infinite; }' +
            '@-webkit-keyframes bounce-bottom { 0%	{ bottom: 5px; } 25%, 75% { bottom: 15px; } 50% { bottom: 20px; } 100% { bottom: 0; } }'
        );

        this._styleCreated = true;
    }
};

/**
 * @private
 */
SConnect._createStyleSheet = function (cssText, id) {

    // let's check if style with id already exists or not
    if (document.getElementById(id) !== null) {
        return;
    }

    var ss;
    var head = document.getElementsByTagName("head")[0];
    var rules = document.createElement("style");
    rules.setAttribute("type", "text/css");

    if (id) {
        rules.setAttribute("id", id);
    }

    if (SConnectBrowserDetect.isIE) {

        head.appendChild(rules);
        ss = (rules.styleSheet) ? rules.styleSheet : rules.sheet;
        ss.cssText = cssText;
    } else {

        try {
            rules.appendChild(document.createTextNode(cssText));
        } catch (e) {
            rules.cssText = cssText;
        }

        head.appendChild(rules);
        ss = rules.styleSheet ? rules.styleSheet : (rules.sheet || document.styleSheets[document.styleSheets.length - 1]);
    }

    return ss;
};

/**
 * @private
 */
SConnect._changeOpac = function (id, opac) {

    var elem = document.getElementById(id),
        val;

    if (!elem) {
        return;
    }

    if (!isNaN(opac)) {

        elem.style.opacity = opac / 100;
        elem.style.filter = 'alpha(opacity=' + opac + ')';
    } else {

        if (elem.alpha === elem.target) {

            clearInterval(elem.si);

            if (elem.target === 0) {

                SConnect._destroyWindow(id);
            } else if (elem.target === 100) {

                if (elem.style.opacity) {
                    if (elem.style.removeProperty) {
                        elem.style.removeProperty('opacity');
                    } else {
                        elem.style.removeAttribute('opacity');
                    }
                }

                if (elem.style.filter) {
                    if (elem.style.removeProperty) {
                        elem.style.removeProperty('filter');
                    } else {
                        elem.style.removeAttribute('filter');
                    }
                }
            }
        } else {

            val = Math.min(Math.max(elem.alpha + (elem.flag * Math.round(200 / (elem.ms / elem.interval))), 0), 100);
            elem.style.opacity = val / 100;
            elem.style.filter = 'alpha(opacity=' + val + ')';
            elem.alpha = val;
        }
    }
};

/**
 * @private
 */
SConnect._fadeInOut = function (id, fadeIn) {

    var elem = document.getElementById(id);

    if (elem) {

        clearInterval(elem.si);
        SConnect._changeOpac(id, fadeIn ? 0 : 100);

        elem.target = fadeIn ? 100 : 0;
        elem.flag = fadeIn ? 1 : -1;
        elem.ms = 300;
        elem.interval = 60;
        elem.alpha = elem.style.opacity ? parseFloat(elem.style.opacity) * 100 : 0;
        elem.si = setInterval(function () {
            SConnect._changeOpac(id);
        }, elem.interval);
    }
};

/**
 * @private
 */
SConnect._destroyWindow = function (id) {

    try {
        document.body.removeChild(document.getElementById(id));
        delete SConnect._dialogName;
    } catch (e) {}
};

/**
 * @private
 */
SConnect._showStatusMsg = function (text, addon) {

    SConnect._createStyleSheet("#sconnect_status { position:absolute;left:45%;top:40%;padding:2px;z-index:20001;height:auto;border:1px solid #ccc; }" +
        "#sconnect_status .sconnect_status_indicator { background:white;color:#444;font:bold 13px tahoma,arial,helvetica;padding:10px;margin:0;height:auto; }" +
        "#sconnect_status_msg { font: normal 10px arial,tahoma,sans-serif; }");

    var arrTexts = SConnect._localize(text);

    var validationDiv = document.createElement("div");
    validationDiv.id = "sconnect_status";
    validationDiv.dir = (SConnect._localize() === "ar") ? "rtl" : "ltr";

    var validationIndicatorDiv = document.createElement("div");
    validationIndicatorDiv.className = "sconnect_status_indicator";

    var validationIndicatorSpan = document.createElement("span");
    validationIndicatorSpan.id = "sconnect_status_indicator_span";
    validationIndicatorSpan.innerHTML = arrTexts[0]; // + "<br>";

    validationIndicatorDiv.appendChild(validationIndicatorSpan);

    var validationMsgSpan = document.createElement("span");
    validationMsgSpan.id = "sconnect_status_msg";

    if ((typeof (addon) === 'undefined') || (addon === null)) {
        addon = "";
    }

    validationMsgSpan.innerHTML = '<br>' + arrTexts[1] + " " + addon + " ";

    validationIndicatorDiv.appendChild(validationMsgSpan);
    validationDiv.appendChild(validationIndicatorDiv);
    document.body.appendChild(validationDiv);

    var _titleWidth = validationIndicatorSpan.offsetWidth + 5;
    var _msgWidth = validationMsgSpan.offsetWidth;

    if (_msgWidth < _titleWidth) {
        validationIndicatorDiv.style.width = Math.max(_titleWidth, _msgWidth) + "px";
    }

    var i = setInterval(function () {

        var span = document.getElementById('sconnect_status_indicator_span');

        if (!span) {
            clearInterval(i);
        } else {

            var idx = span.innerHTML.indexOf('....');
            if (idx != -1) {
                span.innerHTML = span.innerHTML.substring(0, idx);
            } else {
                span.innerHTML += '.';
            }
        }
    }, 1000);
};

/**
 * @private
 */
SConnect._icon = function (cls, title, extra) {
    var reverse = SConnect._localize() === 'ar',
        isIE = SConnectBrowserDetect.isIE;
    return '<div class="sconnect-icon ' + (isIE ? cls.replace(/close|help/, 'text') : cls) + ' sconnect-' + (reverse ? 'left"' : 'right"') + (title ? ' title="' + title + '"' : '') + (extra ? ' ' + extra : '') + '>' +
        (isIE ? (cls.indexOf('close') !== -1 ? '&nbsp;&#215;' : '&nbsp;?') : '') + '</div>';
};

/**
 * @private
 */
SConnect._onClickClose = function (id) {
    return 'onclick="SConnect._fadeInOut(\'' + id + '\',false);"';
};

/**
 * @private
 */
SConnect._linkHelp = function (elem, anchor) {
    return '<a href="' + SConnect._faqPath + (anchor ? '#' + anchor : '') + '" target="_blank">' + elem + '</a>';
};

/**
 * @private
 */
SConnect._loadDialogImages = function (browser, mode, arrPaths, arrImgs, callback, retry) {

    var lang = SConnect._localize();

    browser = browser.toLowerCase();

    if ((!arrPaths) && (!arrImgs)) {

        arrPaths = [];
        arrImgs = [];

        var isOSX10_9 = (navigator.userAgent.indexOf('Mac OS X 10_9') > -1);
        var total = (browser == 'chrome' || browser == 'opera' || browser == 'firefox') ? 7 : 4;

        if (!SConnectBrowserDetect.isSafariAppex) {
            for (var i = 1; i < total; i++) {
                // Determing the image to display for Safari according to the version of Safari and/or OSX.
                var safariImgVer = '';

                if (i == 3) // step 3
                {
                    if ((SConnectBrowserDetect.isSafari9) && (!isOSX10_9)) {
                        safariImgVer = 'a';
                    }
                }

                arrPaths.push(SConnect._imgPath + browser + '-' + mode + '-' + i + safariImgVer + '.jpg');
            }
        } else {
            arrPaths.push(SConnect._imgPath + 'safari-install-osx-1.jpg'); // Safari execute
            arrPaths.push(SConnect._imgPath + 'safari-install-osx-2.jpg'); // Safari install
            arrPaths.push(SConnect._imgPath + 'safari-install-osx-2a.jpg'); // Safari Open preferences
            arrPaths.push(SConnect._imgPath + 'safari-install-osx-3bb.jpg'); // Safari extension enable
            arrPaths.push(SConnect._imgPath + 'ClickWhenDone.jpg');
        }

        SConnect._loadDialogImages(browser, mode, arrPaths, arrImgs, callback);
    } else {

        if (arrPaths.length > 0) {

            var img = new window.Image();

            img.onload = function () {

                arrPaths.splice(0, 1);
                arrImgs.push(img);
                SConnect._loadDialogImages(browser, mode, arrPaths, arrImgs, callback);
            };

            img.onerror = function () {

                if (!retry) {
                    SConnect._loadDialogImages(browser, mode, arrPaths, arrImgs, callback, true);
                }
            };

            if ((!retry) && (lang != 'en')) {

                img.src = arrPaths[0].replace(SConnect._imgPath, SConnect._imgPath + lang + '/');
            } else {

                img.src = arrPaths[0];
            }
        } else {

            window.setTimeout(function (callback, arrImgs) {
                callback(arrImgs);
            }, 5, callback, arrImgs);
        }
    }
};

/**
 * @private
 */
SConnect._createNotifyDialog = function (text, helpAnchor, showReloadBtn) {

    var notify = document.createElement('div');
    var reverse = SConnect._localize() === 'ar';

    SConnect._baseStyle();
    SConnect._dialogName = notify.id = 'sconnect-notify';
    notify.dir = reverse ? 'rtl' : 'ltr';

    notify.innerHTML =
        '<div id="sconnect-notice">' +
        SConnect._icon('sconnect-close sconnect-center', SConnect._localize('Close'), SConnect._onClickClose(notify.id)) +
        (helpAnchor ? SConnect._linkHelp(SConnect._icon('sconnect-help sconnect-center', SConnect._localize('Help')), helpAnchor) : '') +
        (showReloadBtn ? '<input id="sconnect-restart" class="sconnect-' + (reverse ? 'left' : 'right') + '" type="button" value="' + SConnect._localize('Reload') + '" onclick="window.location.reload();">' : '') +
        '<div id="sconnect-notice-content">' + text + ' - SConnect</div>' +
        '</div>';

    document.body.appendChild(notify);
    SConnect._fadeInOut(notify.id, true);
};

// ------------------ SConnect Install UIs -----------

/**
 * @private
 */
SConnect._onClickInstallChromeExt = function () {

    var w = 1050;
    var h = 670;
    var left = (window.screen.width - w) / 2;
    var top = (window.screen.height - h) / 4;

    var extid = "mjhbkkaddmmnkghdnnmkjcgpphnopnfk"; 

    var storeURL = (SConnectBrowserDetect.isChrome) ? "https://chrome.google.com/webstore/detail/" : "https://addons.opera.com/extensions/details/app_id/";

    window.open(storeURL + extid, "SConnect", 'width=' + w + ', height=' + h + ', top=' + top + ', left=' + left);

};

/**
 * @private
 */
SConnect._onClickInstallFFExt = function () {

    //LoggingService.debug("SConnect._onClickInstallFFExt - path (" + SConnect._extPath + SConnect._xpiName + ")");

    var params = {

        "SConnect 2.5.0.0": {

            URL: SConnect._extPath + SConnect._xpiName,
            IconURL: SConnect._imgPath + "sconnect.png",
            toString: function () {
                return this.URL;
            }
        }
    };

    // Install trigger is a function provided by the injected script of the Fiferox extension part
    InstallTrigger.install(params);

    return false;
};

/**
 * @private
 */
SConnect._downloadInstaller = function () {
    window.setTimeout(function () {

        // npapi pkg for old Safari
        var extSource = SConnect._extPath + SConnect._sfPkgNameNpapi;

        // new webext pkg for new Safari
        if (SConnectBrowserDetect.isSafariAppex) {
            extSource = SConnect._extPath + SConnect._sfPkgName;
        }

        if (SConnectBrowserDetect.isChrome || SConnectBrowserDetect.isOpera || SConnectBrowserDetect.isFirefox) {

            var _exeName = SConnect._crExeName;

            if (SConnectBrowserDetect.isMac) {
                _exeName = _exeName.replace(/.exe/g, '.pkg');
            } else if (SConnectBrowserDetect.isLinux) {
                _exeName = _exeName.replace(/.exe/g, '.tar.gz');
            }

            extSource = SConnect._extPath + _exeName;
        }

        var ifr = document.createElement('iframe');
        ifr.src = extSource;
        ifr.style.display = 'none';

        //LoggingService.debug("SConnect._downloadInstaller (" + extSource + ")");

        document.body.appendChild(ifr);

    }, 2000);
};

/**
 * @private
 */
SConnect._createInstallGuideDialog = function () {
    //LoggingService.debug("SConnect._createInstallGuideDialog");

    var browser = SConnectBrowserDetect.browser;
    var isChrome = SConnectBrowserDetect.isChrome;
    var isOpera = SConnectBrowserDetect.isOpera;
    var isFirefox = SConnectBrowserDetect.isFirefox;
    var isSafariAppex = SConnectBrowserDetect.isSafariAppex;
    var mode = 'install';
	if (SConnectBrowserDetect.isMac)
		mode = 'install-osx';
	else if (SConnectBrowserDetect.isLinux) {
		mode = 'install-lx';
	}


    SConnect._loadDialogImages(browser, mode, null, null, function (arrImgs) {
        var txts = SConnect._localize('Install' + browser + 'Dialog');
        var reverse = SConnect._localize() === 'ar';
        var install = document.createElement('div');


        SConnect._baseStyle();
        SConnect._dialogName = install.id = 'sconnect-install';
        install.dir = reverse ? 'rtl' : 'ltr';
        install.width = '100%';
        install.height = '100%';


        // Handle the first image span (with an onClick function)
        var img1span;
        if (isChrome || isOpera) {
            img1span = '<a href="#" target="_blank"  onclick="SConnect._onClickInstallChromeExt()"><span id="sconnect-install-img-1"></span></a>';
        } else if (isFirefox) {
            img1span = '<a href="#" target="_blank"  onclick="SConnect._onClickInstallFFExt()"><span id="sconnect-install-img-1"></span></a>';
        } else {
            img1span = '<span id="sconnect-install-img-1"></span>';
        }

        var img1div = '<div class="sconnect-overlay">' + img1span + '<div class="img-title">' + txts[2] + '</div><div class="sconnect-number">1</div></div>';
        var img2div = '<div class="sconnect-overlay"><span id="sconnect-install-img-2"></span><div class="img-title">' + txts[3] + '</div><div class="sconnect-number">2</div></div>';
        var img3div = '<div class="sconnect-overlay"><span id="sconnect-install-img-3"></span><div class="img-title">' + txts[4] + '</div><div class="sconnect-number">3</div></div>';
        var imgDiv = (reverse) ? (img3div + img2div + img1div) : (img1div + img2div + img3div);
        var img4div, img5div;
        if (isSafariAppex) {
            img4div = '<div class="sconnect-overlay"><span id="sconnect-install-img-4"></span><div class="img-title">' + txts[5] + '</div><div class="sconnect-number">4</div></div>';
            var img5span = '<a href="#" target="_blank"  onclick="SConnect._reload()"><span id="sconnect-install-img-5"></span></a>';
            img5div = '<div class="sconnect-overlay">' + img5span + '<div class="img-title">' + txts[6] + '</div><div class="sconnect-number">5</div></div>';
            if (reverse) {
                imgDiv = (img3div + img2div + img1div + img5div + img4div);
            } else {
                imgDiv = (img1div + img2div + img3div + img4div + img5div);
            }
        }

        var imgDiv2 = "";

        if (isChrome || isOpera || isFirefox) {
            img4div = '<div class="sconnect-overlay"><span id="sconnect-install-img-4"></span><div class="img-title">' + txts[5] + '</div><div class="sconnect-number">1</div></div>';
            img5div = '<div class="sconnect-overlay"><span id="sconnect-install-img-5"></span><div class="img-title">' + txts[6] + '</div><div class="sconnect-number">2</div></div>';
            var img6div = '<div class="sconnect-overlay"><span id="sconnect-install-img-6"></span><div class="img-title">' + txts[7] + '</div><div class="sconnect-number">3</div></div>';

            imgDiv2 = (reverse) ? (img6div + img5div + img4div) : (img4div + img5div + img6div);
        }

        install.innerHTML =
            '<div id="sconnect-overlay"></div>' +
            '<div id="sconnect-dialog">' +
            '<div id="sconnect-dialog-box" class="wide">' +
            SConnect._icon('sconnect-close', SConnect._localize('Close'), SConnect._onClickClose(install.id)) +
            SConnect._linkHelp(SConnect._icon('sconnect-help', SConnect._localize('Help')), 'install' + SConnectBrowserDetect.abbr()) +
            '<div id="sconnect-dialog-title" class="sconnect-text-' + (reverse ? 'right' : 'left') + '">' + txts[0] + '</div>' +
            '<div id="sconnect-dialog-desc" class="center">' + txts[1] + '</div>' +
            '<div id="sconnect-install-step-1">' +
            '<div>' + imgDiv + '</div>' +
            '</div>' +
            '<div id="sconnect-install-step-2" style="display:none;opacity=0;">' +
            '<div>' + imgDiv2 + '</div>' +
            '</div>' +
            '<div class="sconnect-clear">' + '</div>' +
            '<span id="sconnect-dialog-copyright">' + SConnect._copyright + '</span>' +
            '</div>' +
            '</div>';

        if (isChrome) {

            install.innerHTML += '<div id="sconnect-bounce-bottom">' +
                '<div id="sconnect-execute-msg">' + SConnect._localize('ExecuteInstallerMsg') + '</div>' +
                '<div id="sconnect-execute-arrow" style="position:relative;left:88px;width:0;height:0;border-left:10px solid transparent;border-right:10px solid transparent;border-top:10px solid #fff;font-size:0;line-height:0;"></div>' +
                '</div>';
        } else if (SConnectBrowserDetect.isSafariAppex) {} else {

            install.innerHTML += '<div id="sconnect-bounce-top">' +
                '<div id="sconnect-execute-arrow" style="position:absolute;top:-10px;right:5px;width:0;height:0;border-left:10px solid transparent;border-right:10px solid transparent;border-bottom:10px solid #fff;font-size:0;line-height:0;"></div>' +
                '<div id="sconnect-execute-msg">' + SConnect._localize('ExecuteInstallerMsg') + '</div>' +
                '</div>';
        }

        document.body.appendChild(install);

        for (var i = 1; i <= arrImgs.length; i++) {
            document.getElementById('sconnect-install-img-' + i).appendChild(arrImgs[i - 1]);
        }
        SConnect._fadeInOut(install.id, true);

        var topEl = document.getElementById("sconnect-bounce-top");
        var bottomEl = document.getElementById("sconnect-bounce-bottom");
        var arrowEl = document.getElementById('sconnect-execute-arrow');


        if (isChrome || isOpera || isFirefox) {
            var xpiWasUpdated = true;

            if (isFirefox) {
                // Check the xpi version that already installed,
                // if it's not updated yet then trigger step 1 to the user to install the xpi
                // but if xpi was already updated then go to step 2 for the user to install the host
                if (document.getElementById('sconnect-is-installed')) {
                    var currentInstalledXpiVersion = document.getElementById('sconnect-is-installed').innerHTML;
                    if (SConnect._expVersionStr > currentInstalledXpiVersion) {
                        xpiWasUpdated = false;
                    }
                }
            }

            // Host installation (step 2)
            if (isChrome || isOpera || (isFirefox && xpiWasUpdated)) {
                var eventName = 'SConnectInstalledEvent';

                SConnect._eventCallbackBackup = SConnect._eventCallbacks[eventName];

                SConnect._eventCallbacks[eventName] = function () {

                    SConnect._eventCallbacks[eventName] = SConnect._eventCallbackBackup;

                    document.getElementById('sconnect-dialog-title').innerHTML = txts[0].replace("1/2", "2/2");
                    document.getElementById('sconnect-install-step-1').style.display = 'none';
                    document.getElementById('sconnect-install-step-2').style.display = 'block';

                    SConnect._fadeInOut('sconnect-install-step-2', true);

                    SConnect._downloadInstaller();

                    window.setTimeout(function () {

                        if (isChrome) {

                            if (reverse) {
                                arrowEl.style.left = '-88px';
                            }
                            bottomEl.style.display = (window.self == window.top) ? "inline" : "none";

                        } else {

                            arrowEl.style.right = ((window.self == window.top) && window.opener) ? "4px" : "36px";
                            topEl.style.display = (window.self == window.top) ? "inline" : "none";

                        }

                    }, 3000);

                };

                if (document.getElementById('sconnect-is-installed')) {
                    SConnect._fireOnInstalledEvent();
                }
            } else {
                // xpi updating step (isFirefox && !xpiWasUpdated)
                // xpi installation (step 1)
                // let user first update the xpi
            }
        } else {

            SConnect._downloadInstaller();

            if (SConnectBrowserDetect.version >= 8) {
                arrowEl.style.right = "38px";
            }
            window.setTimeout(function () {

                topEl.style.fontSize = "13px";
                topEl.style.fontWeight = "bold";
                topEl.style.display = ((window.self == window.top) && !window.opener) ? "inline" : "none";

            }, 3000);
        }
    });
};

/**
 * @private
 */
SConnect._createInstallDialog = function (update) {
    //LoggingService.debug("SConnect._createInstallDialog");

    var txts = SConnect._localize('InstallDialog');
    var reverse = SConnect._localize() === 'ar';
    var eula = document.createElement('div');

    SConnect._baseStyle();
    SConnect._dialogName = eula.id = 'sconnect-eula';
    eula.dir = reverse ? 'rtl' : 'ltr';
    eula.width = '100%';
    eula.height = '100%';

    eula.innerHTML =
        '<div id="sconnect-overlay"></div>' +
        '<div id="sconnect-dialog">' +
        '<div id="sconnect-dialog-box">' +
        SConnect._icon('sconnect-close', SConnect._localize('Close'), SConnect._onClickClose(eula.id)) +
        SConnect._linkHelp(SConnect._icon('sconnect-help', SConnect._localize('Help')), 'install' + SConnectBrowserDetect.abbr()) +
        '<div id="sconnect-dialog-title" class="sconnect-text-' + (reverse ? 'right' : 'left') + '">' + txts[0] + '</div>' +
        '<div id="sconnect-dialog-desc">' + txts[1] + '</div>' +
        '<div id="sconnect-dialog-content">' + txts[2] + '<a href="' + SConnect._eulaPath + txts[7] + 'license.html" target="_blank">' + txts[3] + '</a></div>' +
        '<div id="sconnect-dialog-action">' +
        '<input class="sconnect-btn sconnect-install sconnect-round sconnect-' + (reverse ? 'left' : 'right') + '" type="button" value="' + (update ? txts[6] : txts[5]) + '" onclick="SConnect._doInstall(' + update + ')">' +
        (update ? '' : '<a href="javascript:void(0);" class="sconnect-link sconnect-link-' + (reverse ? 'left' : 'right') + '"' + SConnect._onClickClose(eula.id) + '>' + txts[4] + '</a>') +
        '</div>' +
        '<span id="sconnect-dialog-copyright">' + SConnect._copyright + '</span>' +
        '</div>' +
        '</div>';

    document.body.appendChild(eula);
    SConnect._fadeInOut(eula.id, true);
};

/**
 * @private
 */
SConnect._createNotSupportedDialog = function () {
    //LoggingService.debug("SConnect._createNotSupportedDialog");

    var txts = SConnect._localize('NotSupportedDialog');
    var reverse = SConnect._localize() === 'ar';
    var nosupport = document.createElement('div');

    SConnect._baseStyle();
    SConnect._dialogName = nosupport.id = 'sconnect-nosupport';
    nosupport.dir = reverse ? 'rtl' : 'ltr';

    nosupport.innerHTML =
        '<div id="sconnect-overlay"></div>' +
        '<div id="sconnect-dialog">' +
        '<div id="sconnect-dialog-box">' +
        SConnect._icon('sconnect-close', SConnect._localize('Close'), SConnect._onClickClose(nosupport.id)) +
        SConnect._linkHelp(SConnect._icon('sconnect-help', SConnect._localize('Help')), 'compatibility') +
        '<div id="sconnect-dialog-title" class="sconnect-text-' + (reverse ? 'right' : 'left') + '">' + txts[0] + '</div>' +
        '<div id="sconnect-dialog-desc">' + txts[1] + '</div>' +
        '<div id="sconnect-dialog-content">' +
        "<b>" + txts[2] + "</b><ul>" +
        "<li>Google Chrome 34 " + txts[4] + "</li>" +
        "<li>Internet Explorer 10 " + txts[4] + " (Windows)</li>" +
        "<li>Mozilla Firefox 53 " + txts[4] + "</li>" +
        "<li>Safari 6 " + txts[4] + " (OS X)</li>" +
        "<li>Opera 28 " + txts[4] + "</li>" +
        "</ul><b>" + txts[3] + "</b><ul>" +
        "<li>Linux</li>" +
        "<li>OS X 10.10 " + txts[4] + "</li>" +
        "<li>Windows 7 " + txts[4] + "</li></ul>" +
        '</div>' +
        '<span id="sconnect-dialog-copyright" class="sconnect-small">' + SConnect._copyright + '</span>' +
        '</div>' +
        '</div>';
    
    document.body.appendChild(nosupport);
    SConnect._fadeInOut(nosupport.id, true);
};

// ------------------ SConnect Private Methods -----------
// This is a very short and weak hash, and is not suitable for security purposes.
// The usage here is only for detecting repeat information, and is not a security purpose.
// Nevertheless, a stronger hash would be good to avoid accidental hash collisions.
// TODO: replace this with a larger hash, or maybe better, modify SConnect native to add the hash to the messages.
// TODO: Or could use the nonce that is already written into the messages (for Safari).
SConnect.shortHash = function (inpStr) {
    return inpStr.split("").reduce(function (x, y) {
        x = ((x << 5) - x) + y.charCodeAt(0);
        return x & x;
    }, 0);
};

var eventHash = 0; // This to filter unwanted repeat event messages from Safari interface.

/**
 * @private
 */
SConnect._receiveMessage = function (event) {

    //LoggingService.debug("");
    //LoggingService.debug("======================================");
    //LoggingService.debug("SConnect._receiveMessage");
    //LoggingService.debug("event (" + JSON.stringify(event) + ")");
    //LoggingService.debug("======================================");
    //LoggingService.debug("");

    var data = "";

    if ((SConnectBrowserDetect.isChrome) ||
        (SConnectBrowserDetect.isOpera) ||
        (SConnectBrowserDetect.isFirefox) ||
        (SConnectBrowserDetect.isSafari)) {

        // Only accept response messages from event-page
        if (event.source != window) {
            return;
        }

        data = event.data;
    } else /*if (SConnectBrowserDetect.isIE)*/ {

        data = JSON.parse(event);
    }

    // Only accept response messages with known rtype
    if (data.rtype) {

        if (data.rtype == "SConnect") {

            var callbackId = data.callbackId;

            if ((callbackId) && (SConnect._functCallbacks[callbackId])) {

                var response = data.response;
                var callback = SConnect._functCallbacks[callbackId];

                window.setTimeout(function () {
                    callback(response);
                }, 5, callback, response);

                delete SConnect._functCallbacks[callbackId];
            }
        } else if (data.rtype == "SConnect-E") {

            var eventName = data.event;

            if (SConnectBrowserDetect.isSafariAppex) {
                var eventBuf = data.callbackId + data.event + data.nonce + data.response;
                //console.log("eventBuf = " + eventBuf);
                var newEventHash = SConnect.shortHash(eventBuf);
                //crypto.subtle.digest("SHA-256", eventBuf).then(function (hash) { return hex(hash); })
                //console.log("new event response hash = ");
                //console.log(newEventHash);
                if (newEventHash == eventHash) {
                    //console.log("Ignoring duplicate SConnect event message.");
                    return;
                }
                eventHash = newEventHash;
            }

            if ((eventName) && (SConnect._eventCallbacks[eventName])) {

                var r = data.response;
                var c = SConnect._eventCallbacks[eventName];

                window.setTimeout(function () {
                    c(r);
                }, 5, c, r);
            }
        }
        // Other data.rtype are ignored.
    }
};

// listen to message sent by event-page
if ((SConnectBrowserDetect.isChrome) ||
    (SConnectBrowserDetect.isOpera) ||
    (SConnectBrowserDetect.isFirefox) ||
    (SConnectBrowserDetect.isSafari)) {

    window.addEventListener("message", SConnect._receiveMessage, false);
} else if (SConnectBrowserDetect.isIE) {

    window.onunload = function () {
        if (window.sconnect) {
            window.sconnect.Dispose();
        }
    };
}

/**
 * @private
 */
SConnect._triggerCallback = function (callback, success, arg1, arg2, arg3) {

    if (callback) {
        if (success) {
            if (callback.success) {
                if (callback.scope) {
                    callback.success.apply(callback.scope, [arg1, arg2, arg3]);
                } else {
                    callback.success(arg1, arg2, arg3);
                }
            }
        } else {
            if (callback.error) {
                if (callback.scope) {
                    callback.error.apply(callback.scope, [arg1, arg2, arg3]);
                } else {
                    callback.error(arg1, arg2, arg3);
                }
            }
        }
    }
    SConnect._cmdInProgress = false;
};

/**
 * @private
 */
SConnect._invoke = function (command, params, callback) {

    if ((typeof (command) === 'undefined') || (command === null)) {
        throw new SConnect.Exception("InsufficientArguments");
    }

    SConnect._cmdInProgress = true;
    if (typeof (params) === 'undefined') {
        params = null;
    }

    if (typeof (callback) === 'undefined') {
        callback = null;
    }

    var callbackId = null;

    if (callback) {

        // Math.random should be unique because of its seeding algorithm.
        // Convert it to base 36 (numbers + letters), and grab the first 
        // 9 characters after the decimal.
        callbackId = '_' + Math.random().toString(36).substr(2, 9);

        // store callback reference
        SConnect._functCallbacks[callbackId] = function (resp) {

            //LoggingService.debug("");
            //LoggingService.debug("======================================");
            //LoggingService.debug("SConnect._invoke - RESPONSE");
            //LoggingService.debug("response (" + JSON.stringify(resp) + ")");
            //LoggingService.debug("======================================");
            //LoggingService.debug("");


            if (resp[0] == "Error") {
                SConnect._triggerCallback(callback, false, resp[1]);
            } else {
                SConnect._triggerCallback(callback, true, resp);
            }
        };
    }

    // build message content to send
    var message = {
        type: "SConnect",
        command: command,
        params: params,
        callbackId: callbackId
    };

    //LoggingService.debug("");
    //LoggingService.debug("======================================");
    //LoggingService.debug("SConnect._invoke - MESSAGE");
    //LoggingService.debug("message (" + JSON.stringify(message) + ")");
    //LoggingService.debug("======================================");
    //LoggingService.debug("");

    // Send message to event-page
    if ((SConnectBrowserDetect.isChrome) ||
        (SConnectBrowserDetect.isOpera) ||
        (SConnectBrowserDetect.isSafari) ||
        (SConnectBrowserDetect.isFirefox)) {

        window.postMessage(message, '*');

    } else /*if (SConnectBrowserDetect.isIE)*/ {

        try {

            if (!window.sconnect) {

                window.sconnect = new ActiveXObject("SConnectIELib.SConnectIE");
                window.sconnect.Init(SConnect._receiveMessage);
            }

            window.sconnect.Invoke(JSON.stringify(message));
        } catch (e) {}
    }
};

/**
 * @private
 */
SConnect._isBrowserSupported = function () {

    return (
        (SConnectBrowserDetect.isWindows && (SConnectBrowserDetect.isChrome || SConnectBrowserDetect.isFirefox || SConnectBrowserDetect.isIE || SConnectBrowserDetect.isOpera)) ||
        (SConnectBrowserDetect.isMac && (SConnectBrowserDetect.isChrome || SConnectBrowserDetect.isFirefox || SConnectBrowserDetect.isSafari || SConnectBrowserDetect.isOpera)) ||
        (SConnectBrowserDetect.isLinux && (SConnectBrowserDetect.isChrome || SConnectBrowserDetect.isFirefox || SConnectBrowserDetect.isOpera))
    );
};

/**
 * @private
 */
SConnect._isVersionSupported = function () {

    return ((SConnectBrowserDetect.isChrome && (SConnectBrowserDetect.version >= 34)) ||
        (SConnectBrowserDetect.isIE && (SConnectBrowserDetect.version >= 10)) ||
        (SConnectBrowserDetect.isFirefox && (SConnectBrowserDetect.version >= 53)) ||        
        (SConnectBrowserDetect.isSafari && (SConnectBrowserDetect.version >= 6)) ||
        (SConnectBrowserDetect.isOpera && (SConnectBrowserDetect.version >= 28)));
};

/**
 * @private
 */
SConnect._isSupported = function () {

    //LoggingService.debug("SConnect._isSupported (" + (SConnect._isBrowserSupported() && SConnect._isVersionSupported()) + ")");
    return SConnect._isBrowserSupported() && SConnect._isVersionSupported();
};

/**
 * @private
 */
SConnect._isIEActiveXFilteringEnabled = function () {

    try {
        return window.external.msActiveXFilteringEnabled();
    } catch (e) {
        return false;
    }
};

/**
  Check if the the SConnectInstalledEvent event function exists.
  If it does not exist, reload the page.
  @private 
 **/
SConnect._checkInstalled = function () {
    //LoggingService.debug("SConnect._checkInstalled");

    var eventName = 'SConnectInstalledEvent';

    if (!SConnect._eventCallbacks[eventName]) {
        SConnect._eventCallbacks[eventName] = function () {
            window.location.reload();
        };
    }
};

/**
 * @private
 */
SConnect._fireOnInstalledEvent = function () {
    //LoggingService.debug("SConnect._fireOnInstalledEvent");
    var eventName = 'SConnectInstalledEvent';

    if (SConnect._eventCallbacks[eventName]) {

        window.setTimeout(function () {

            SConnect._eventCallbacks[eventName]();

        }, 5);
    }
};

/**
 * @private
 */
SConnect._isInstalled = function (callback) {

    var _callback = {

        success: function (update) {
            //LoggingService.debug("");
            //LoggingService.debug("======================================");
            //LoggingService.debug("SConnect._isInstalled - success");
            //LoggingService.debug("update (" + update + ")");
            //LoggingService.debug("======================================");
            //LoggingService.debug("");

            if (!update) {

                SConnect._destroyWindow('sconnect-eula');
                SConnect._destroyWindow('sconnect-install');
            }

            SConnect._triggerCallback(callback, true, update);
        },
        error: function ( /*code*/ ) {
            //LoggingService.debug("");
            //LoggingService.debug("======================================");
            //LoggingService.debug("SConnect._isInstalled - error");
            //LoggingService.debug("======================================");
            //LoggingService.debug("");

            SConnect._triggerCallback(callback, false);
        }
    };

    SConnect.IsInstalled(_callback);
};

/**
 * @private
 */
// Summary:
// a loop of checking if the host or xpi/crx/nex installation is finished			
// if host is not installed yet, then we will get here to the error
// and we run again this function in a loop until the host is installed	
SConnect._checkInstalledPoll = function () {

    var _callback = {

        success: function (update) {
            //LoggingService.debug("");
            //LoggingService.debug("======================================");
            //LoggingService.debug("SConnect._checkInstalledPoll - success");
            //LoggingService.debug("update (" + update + ")");
            //LoggingService.debug("======================================");
            //LoggingService.debug("");

            if (update) {
                if (SConnectBrowserDetect.isChrome || SConnectBrowserDetect.isOpera || SConnectBrowserDetect.isFirefox) {

					// **** UPDATE INSTALLATION ****
					// This is on an update installation of SConnect for Chrome/Opera/Firefox

					if (SConnectBrowserDetect.isLinux)
					{
						// Linux
						// (Chrome, Opera, Firefox)
						// the host installation is done by a script from Terminal
						// since this a manual flow for the user,
						// this can take a while to run and install,
						// if it will take too much time then the browser is crashing
						// so check for host installed less rapidly
						
						//LoggingService.debug("");
						//LoggingService.debug("==============");
						//LoggingService.debug("NOT RAPID 10000");
						//LoggingService.debug("==============");
						//LoggingService.debug("");
						setTimeout("SConnect._checkInstalledPoll()", 10000);
					}
					else
					{
						// Windows and OSX
						// the host installation is done by GUI for the user, 
						// so we can check rapidly if the host is installed,
						// because probably the host installation time will be short
						SConnect._checkInstalledPoll();
					}				
					
                } else {

                    SConnect._createNotifyDialog(SConnect._localize('BrowserRestart'), 'install' + SConnectBrowserDetect.abbr());
                }
            } else {

                SConnect._fireOnInstalledEvent();
            }
        },
        error: function () {
			// **** CLEAN INSTALLATION ****
			// This is on a clean fresh installation of SConnect for Chrome/Opera/Firefox
			
            //LoggingService.debug("");
            //LoggingService.debug("======================================");
            //LoggingService.debug("SConnect._checkInstalledPoll - error");
            //LoggingService.debug("======================================");
            //LoggingService.debug("");

			if (SConnectBrowserDetect.isLinux)
			{
				// Linux
				// (Chrome, Opera, Firefox)
				// the host installation is done by a script from Terminal
				// since this a manual flow for the user,
				// this can take a while to run and install,
				// if it will take too much time then the browser is crashing
				// so check for host installed less rapidly
				
				//LoggingService.debug("");
				//LoggingService.debug("==============");
				//LoggingService.debug("NOT RAPID 10000");
				//LoggingService.debug("==============");
				//LoggingService.debug("");
				setTimeout("SConnect._checkInstalledPoll()", 10000);
			}
			else
			{
				// Windows and OSX
				// the host installation is done by GUI for the user, 
				// so we can check rapidly if the host is installed,
				// because probably the host installation time will be short
				SConnect._checkInstalledPoll();
			}
        }
    };

    SConnect._isInstalled(_callback);
};

/**
 * @private
 */
SConnect._doInstall = function ( /*update*/ ) {
    //LoggingService.debug("SConnect._doInstall - (BEGIN)");

    if (SConnect._dialogName) {
        SConnect._destroyWindow('sconnect-eula');
    }

    if (SConnectBrowserDetect.isChrome || SConnectBrowserDetect.isOpera || SConnectBrowserDetect.isFirefox) {
		
        SConnect._checkInstalled();
        SConnect._checkInstalledPoll();
        SConnect._createInstallGuideDialog();

    } else if (SConnectBrowserDetect.isSafari) {

        SConnect._createInstallGuideDialog();
    } else { // IE

        SConnect._checkInstalled();
        SConnect._checkInstalledPoll();

        document.location.href = SConnect._extPath + SConnect._ieExeName;
    }
    //LoggingService.debug("SConnect._doInstall - (END)");
};

/**
 * @private
 */
SConnect._install = function (update, skipEula) {

    //LoggingService.debug("SConnect._install");

    SConnect._destroyWindow('sconnect-eula');

    // TODO : on update, show 'what's new' rather than showing EULA again
    if (skipEula) {
        SConnect._doInstall(update);
    } else {
        SConnect._createInstallDialog(update);
    }
};

/**
 * @private
 */
SConnect._registerEvent = function (eventName, listener, callback) {

    if (SConnect._eventCallbacks[eventName]) {
        throw new SConnect.Exception("InvalidOperation");
    }

    // limit to only one listener per event type
    SConnect._eventCallbacks[eventName] = listener;

    var _callback = {

        success: function (resp) {
            //LoggingService.debug("");
            //LoggingService.debug("======================================");
            //LoggingService.debug("SConnect._registerEvent - success");
            //LoggingService.debug("response (" + JSON.stringify(resp) + ")");
            //LoggingService.debug("======================================");
            //LoggingService.debug("");

            SConnect._triggerCallback(callback, true, resp);
        },
        error: function (code) {
            //LoggingService.debug("");
            //LoggingService.debug("======================================");
            //LoggingService.debug("SConnect._registerEvent - error");
            //LoggingService.debug("code (" + code + ")");
            //LoggingService.debug("======================================");
            //LoggingService.debug("");

            SConnect._triggerCallback(callback, false, code);
        }
    };

    var params = [];
    params.push(eventName);

    SConnect._invoke("RegisterEvent", params, _callback);
};

/**
 * @private
 */
SConnect._unregisterEvent = function (eventName, callback) {

    delete SConnect._eventCallbacks[eventName];

    var _callback = {

        success: function (resp) {
            //LoggingService.debug("");
            //LoggingService.debug("======================================");
            //LoggingService.debug("SConnect._unregisterEvent - success");
            //LoggingService.debug("response (" + JSON.stringify(resp) + ")");
            //LoggingService.debug("======================================");
            //LoggingService.debug("");

            SConnect._triggerCallback(callback, true, resp);
        },
        error: function (code) {
            //LoggingService.debug("");
            //LoggingService.debug("======================================");
            //LoggingService.debug("SConnect._unregisterEvent - error");
            //LoggingService.debug("code (" + code + ")");
            //LoggingService.debug("======================================");
            //LoggingService.debug("");

            SConnect._triggerCallback(callback, false, code);
        }
    };

    var params = [];
    params.push(eventName);

    SConnect._invoke("UnregisterEvent", params, _callback);
};

/**
 * @private
 */
SConnect._registerAddonInstallFinishEventListener = function (listener, callback) {

    //LoggingService.debug("SConnect._registerAddonInstallFinishEventListener");
    SConnect._registerEvent("AddOnInstallFinishEvent", listener, callback);
};

/**
 * @private
 */
SConnect._unregisterAddonInstallFinishEventListener = function (callback) {

    //LoggingService.debug("SConnect._unregisterAddonInstallFinishEventListener");
    SConnect._unregisterEvent("AddOnInstallFinishEvent", callback);
};

// ------------------ SConnect Protected Methods (for addon.js) -----------

/**
 * @private
 */
SConnect._createAddOnInstance = function (uuid, version, versionType, callback) {

    if ((typeof (uuid) === 'undefined') || (uuid === null)) {
        throw new SConnect.Exception("InsufficientArguments");
    }

    if ((typeof (version) === 'undefined') || (version === null)) {
        throw new SConnect.Exception("InsufficientArguments");
    }

    if (typeof (versionType) === 'undefined') {
        versionType = 'exact';
    }

    // TODO : handle 'exact' or 'minimum' versionType

    var _callback = {

        success: function (resp) {
            //LoggingService.debug("======================================");
            //LoggingService.debug("SConnect._createAddOnInstance - success");
            //LoggingService.debug("response (" + JSON.stringify(resp) + ")");
            //LoggingService.debug("======================================");

            SConnect._triggerCallback(callback, true, resp);
        },
        error: function (code) {
            //LoggingService.debug("======================================");
            //LoggingService.debug("SConnect._createAddOnInstance - error");
            //LoggingService.debug("code (" + code + ")");
            //LoggingService.debug("======================================");

            SConnect._triggerCallback(callback, false, code);
        }
    };

    var params = [];
    params.push(uuid);
    params.push(version);
    params.push(versionType);

    SConnect._invoke("CreateAddOnInstance", params, _callback);
};

/**
 * @private
 */
SConnect._disposeAddOnInstance = function (addonId, uuid, version, callback) {

    if ((typeof (addonId) === 'undefined') || (addonId === null)) {
        throw new SConnect.Exception("InsufficientArguments");
    }

    if ((typeof (uuid) === 'undefined') || (uuid === null)) {
        throw new SConnect.Exception("InsufficientArguments");
    }
    if ((typeof (version) === 'undefined') || (version === null)) {
        throw new SConnect.Exception("InsufficientArguments");
    }
    var _callback = {

        success: function (resp) {
            //LoggingService.debug("======================================");
            //LoggingService.debug("SConnect._disposeAddOnInstance - success");
            //LoggingService.debug("response (" + JSON.stringify(resp) + ")");
            //LoggingService.debug("======================================");

            SConnect._triggerCallback(callback, true, resp);
        },
        error: function (code) {
            //LoggingService.debug("======================================");
            //LoggingService.debug("SConnect._disposeAddOnInstance - error");
            //LoggingService.debug("code (" + code + ")");
            //LoggingService.debug("======================================");

            SConnect._triggerCallback(callback, false, code);
        }
    };

    var params = [];
    params.push(addonId);
    params.push(uuid);
    params.push(version);

    SConnect._invoke("DisposeAddOnInstance", params, _callback);
};

/**
 * @private
 */
SConnect._invokeAddOnInstance = function (addonId, command, parameter, callback) {

    if ((typeof (addonId) === 'undefined') || (addonId === null)) {
        throw new SConnect.Exception("InsufficientArguments");
    }

    if ((typeof (command) === 'undefined') || (command === null)) {
        throw new SConnect.Exception("InsufficientArguments");
    }
    if (typeof (parameter) === 'undefined') {
        parameter = null;
    }
    if (typeof (callback) === 'undefined') {
        callback = null;
    }

    var _callback = {

        success: function (resp) {
            //LoggingService.debug("======================================");
            //LoggingService.debug("SConnect._invokeAddOnInstance - success");
            //LoggingService.debug("response (" + JSON.stringify(resp) + ")");
            //LoggingService.debug("======================================");

            SConnect._triggerCallback(callback, true, resp);
        },
        error: function (code) {
            //LoggingService.debug("======================================");
            //LoggingService.debug("SConnect._invokeAddOnInstance - error");
            //LoggingService.debug("code (" + code + ")");
            //LoggingService.debug("======================================");

            SConnect._triggerCallback(callback, false, code);
        }
    };

    var params = [];
    params.push(addonId);
    params.push(command);
    params.push(parameter);

    SConnect._invoke("InvokeAddOnInstance", params, _callback);
};

/**
 * @private
 */
SConnect._registerAddOnEvent = function (addonId, eventName, listener, callback) {

    if ((typeof (addonId) === 'undefined') || (addonId === null)) {
        throw new SConnect.Exception("InsufficientArguments");
    }

    // limit to only one listener per event type
    SConnect._eventCallbacks[eventName] = listener;

    var _callback = {

        success: function (resp) {
            //LoggingService.debug("======================================");
            //LoggingService.debug("SConnect._registerAddOnEvent - success");
            //LoggingService.debug("response (" + JSON.stringify(resp) + ")");
            //LoggingService.debug("======================================");

            SConnect._triggerCallback(callback, true, resp);
        },
        error: function (code) {
            //LoggingService.debug("======================================");
            //LoggingService.debug("SConnect._registerAddOnEvent - error");
            //LoggingService.debug("code (" + code + ")");
            //LoggingService.debug("======================================");

            SConnect._triggerCallback(callback, false, code);
        }
    };

    var params = [];
    params.push(addonId);
    params.push(eventName);

    SConnect._invoke("RegisterAddOnEvent", params, _callback);
};

/**
 * @private
 */
SConnect._unregisterAddOnEvent = function (addonId, eventName, callback) {

    delete SConnect._eventCallbacks[eventName];

    var _callback = {

        success: function (resp) {
            //LoggingService.debug("======================================");
            //LoggingService.debug("SConnect._unregisterAddOnEvent - success");
            //LoggingService.debug("response (" + JSON.stringify(resp) + ")");
            //LoggingService.debug("======================================");

            SConnect._triggerCallback(callback, true, resp);
        },
        error: function (code) {
            //LoggingService.debug("======================================");
            //LoggingService.debug("SConnect._unregisterAddOnEvent - error");
            //LoggingService.debug("code (" + code + ")");
            //LoggingService.debug("======================================");

            SConnect._triggerCallback(callback, false, code);
        }
    };

    var params = [];
    params.push(addonId);
    params.push(eventName);

    SConnect._invoke("UnregisterAddOnEvent", params, _callback);
};


// ------------------ SConnect Public Methods -----------

/**
 * Register SConnect onInstalled event handler.
 *
 * @memberOf SConnect
 * @param {Object} callback object called when the event is fired
 * <ul>
 *   <li> callback.onInstalled() - function called when onInstalled event is fired
 * </ul>
 * @return {void} 
 */
SConnect.RegisterOnInstalledEventHandler = function (callback) {
    //LoggingService.debug("======================================");
    //LoggingService.debug("SConnect.RegisterOnInstalledEventHandler");
    //LoggingService.debug("======================================");

    var eventName = 'SConnectInstalledEvent';

    if (callback) {

        SConnect._eventCallbacks[eventName] = function () {

            if (callback.onInstalled) {

                if (callback.scope) {
                    callback.onInstalled.apply(callback.scope);
                } else {
                    callback.onInstalled();
                }
            }
        };
    }
};

/**
 * Check if SConnect is installed
 *
 * @memberOf SConnect
 * @param {Object} callback object called when the operation is finish
 * <ul>
 *   <li> callback.success(update) - function called when SConnect is installed
 *   <li> callback.error() - function called when SConnect is NOT installed
 *   <br> * update: true indicates update is needed, false otherwise
 * </ul>
 * @return {void} 
 */
SConnect.IsInstalled = function (callback) {

    var _callback = {

        success: function (version) {
            //LoggingService.debug("");
            //LoggingService.debug("======================================");
            //LoggingService.debug("SConnect.IsInstalled - success");
            //LoggingService.debug("version (" + version + ")");
            //LoggingService.debug("======================================");
            //LoggingService.debug("");

            var currentVersion = SConnect._expVersion;

            // support npapi pkg for old Safari
            if (SConnectBrowserDetect.isSafari) {
                if (SConnectBrowserDetect.isSafariAppex) {
                    // new appex for Safari
                    currentVersion = SConnect._expVersionSafari;
                } else {
                    currentVersion = SConnect._expVersionSafariNpapi;
                }
            }

            var update = version < currentVersion;

            SConnect._triggerCallback(callback, true, update);
        },
        error: function ( /*code*/ ) {
            //LoggingService.debug("");
            //LoggingService.debug("======================================");
            //LoggingService.debug("SConnect.IsInstalled - error");
            //LoggingService.debug("======================================");
            //LoggingService.debug("");

            SConnect._triggerCallback(callback, false);
        }
    };

    SConnect.GetVersion(_callback);
};

/**
 * Get SConnect version
 *
 * @memberOf SConnect
 * @param {Object} callback object called when the operation is finish
 * <ul>
 *   <li> callback.success(version) - function called when GetVersion is successful
 *   <li> callback.error(errorcode) - function called when GetVersion is failed
 *   <br> * errorcode: error code
 * </ul>
 * @return {void} 
 */
SConnect.GetVersion = function (callback) {

    var _timer = null;

    var _callback = {

        success: function (resp) {

            //LoggingService.debug("");
            //LoggingService.debug("======================================");
            //LoggingService.debug("SConnect.GetVersion - success");
            //LoggingService.debug("response (" + JSON.stringify(resp) + ")");
            //LoggingService.debug("======================================");
            //LoggingService.debug("");

            if (_timer) {
                window.clearTimeout(_timer);
            }

            var version = parseInt(resp[0], 16);

            if (resp[1].length > 0) {
                version = Math.min(version, parseInt(resp[1], 16));
            }

            SConnect._triggerCallback(callback, true, version);
        },
        error: function (code) {
            //LoggingService.debug("");
            //LoggingService.debug("======================================");
            //LoggingService.debug("SConnect.GetVersion - error");
            //LoggingService.debug("code (" + code + ")");
            //LoggingService.debug("======================================");
            //LoggingService.debug("");

            if (_timer) {
                window.clearTimeout(_timer);
            }

            SConnect._triggerCallback(callback, false, code);
        }
    };

    SConnect._invoke("GetVersion", null, _callback);

    _timer = window.setTimeout(function () {

        SConnect._triggerCallback(callback, false);

    }, SConnectBrowserDetect.isSafariAppex ? 4000 : 2000);
};

/**
 * Trigger SConnect installation procedure
 *
 * @memberOf SConnect
 * @param {Object} callback object called when the operation is finish
 * <ul>
 *   <li> callback.success() - function called when SConnect installation is successful
 * </ul>
 * @param {bool} skipEula {Optional} true to skip EULA dialog
 * @return {void} 
 */
SConnect.Install = function (callback, skipEula) {

    if (!SConnect._isSupported()) {

        SConnect._createNotSupportedDialog();
    } else {

        if (SConnect._isIEActiveXFilteringEnabled()) {

            SConnect._createNotifyDialog(SConnect._localize('ActiveXFilter'), 'activex', false);
        } else {

            var _callback = {

                success: function (update) {
                    //LoggingService.debug("");
                    //LoggingService.debug("======================================");
                    //LoggingService.debug("SConnect.Install - success");
                    //LoggingService.debug("update (" + update + ")");
                    //LoggingService.debug("======================================");
                    //LoggingService.debug("");

                    if (update) {

                        SConnect._install(true, skipEula);
                    } else {

                        SConnect._triggerCallback(callback, true);
                    }
                },
                error: function () {
                    //LoggingService.debug("");
                    //LoggingService.debug("======================================");
                    //LoggingService.debug("SConnect.Install - error");
                    //LoggingService.debug("======================================");
                    //LoggingService.debug("");

                    SConnect._install(false, skipEula);
                }
            };

            SConnect._isInstalled(_callback);
        }
    }
};

/**
 * Trigger SConnect server validation procedure 
 *
 * @memberOf SConnect
 * @param {Object} callback object called when the operation is finish
 * <ul>
 *   <li> callback.success() - function called when SConnect server validation is successful
 *   <li> callback.error(errorcode) - function called when SConnect server validation is failed
 *   <br> * errorcode: error code ( one of SConnectValidation constant values )
 * </ul>
 * @param {bool} showMsg {Optional} true to show the default server validation message
 * @param {String} connKeyPath {Optional} the location and name of connection key relative to domain URL
 * @param {Number} connKeyPortNo {Optional} port number to use for fetching the connection key {1 - 65534}
 * @exception {SConnect.Exception} possible reason(s): "InvalidPortNumber"
 * @return {void} 
 */
SConnect.ValidateServer = function (callback, showMsg, connKeyPath, connKeyPortNo) {

    try {
        if ((typeof (Prototype) != 'undefined') && (Prototype)) {

            var version = parseFloat(Prototype.Version.substring(0, 3));

            if ((version < 1.7) && Array.prototype.toJSON) {

                delete Array.prototype.toJSON;
            }
        }
    } catch (e) {}

    // TODO: Add a timeout for Safari with appex (this will time out if containing app is not running)
    //       This timeout can be modeled on the one that is already implemented for GetVersion.
    //       An appropriate code should be sent to web app so that message to end user can appear.
    if ((typeof (connKeyPath) === 'undefined') || (connKeyPath === null) || (connKeyPath.length === 0)) {
        connKeyPath = "/sconnect_key.lic";
    }

    if ((typeof (connKeyPortNo) === 'undefined') || (connKeyPortNo === null)) {
        connKeyPortNo = 0;
    }

    // valid port number : 1 .. 65534. 
    // value 0 and 65535 is reserved for internal purpose.
    if ((connKeyPortNo < 0) || (connKeyPortNo > 0xffff)) {
        throw new SConnect.Exception("InvalidPortNumber");
    }

    if (showMsg !== false) {
        SConnect._showStatusMsg("ValidationMsg");
    }

    var params = [];
    params.push(connKeyPath);
    params.push(connKeyPortNo);

    var _callback = {

        success: function () {

            //LoggingService.debug("");
            //LoggingService.debug("======================================");
            //LoggingService.debug("SConnect.ValidateServer - success");
            //LoggingService.debug("======================================");
            //LoggingService.debug("");

            SConnect._fadeInOut("sconnect_status", false);
            SConnect._triggerCallback(callback, true);
        },
        error: function (code) {

            //LoggingService.debug("");
            //LoggingService.debug("======================================");
            //LoggingService.debug("SConnect.ValidateServer - error (" + code + ")");
            //LoggingService.debug("======================================");
            //LoggingService.debug("");

            //console.log("ValidateServer error: " + code);
            if (code == SConnectValidation.VALIDATION_ERROR_NO_SERVICE) {
                //console.log("NoServiceMsg: " + SConnect._localize('NoServiceMsg'));
                SConnect._createNotifyDialog(SConnect._localize('NoServiceMsg'), false);
            }
            SConnect._fadeInOut("sconnect_status", false);
            SConnect._triggerCallback(callback, false, code);
        }
    };

    SConnect._invoke("ValidateServer", params, _callback);
};

/**
 * Trigger SConnect AddOn(s) installation procedure
 * 
 * @memberOf SConnect
 * @param {Array} addons array of addon's info object to install
 * @param {Object} callback object called when the operation is finish
 * <ul>
 *   <li> callback.success() - function called when SConnect AddOn(s) installation is successful
 *   <li> callback.error(errorcode, info) - function called when SConnect AddOn(s) installation is failed
 *   <br> * errorcode: error code, e.g. (-3) for "NotAuthorized", (-4) for "InvSignature"
 *   <br> * info: info of addon which is failed to install - if available
 * </ul>
 * @param {bool} showMsg {Optional} true to show the default addon installation message
 * @exception {SConnect.Exception} possible reason(s): "InsufficientArguments"
 * @return {void} 
 */
SConnect.InstallAddOns = function (addons, callback, showMsg) {

    if ((typeof (addons) === 'undefined') || (addons === null) || (addons.length === 0)) {
        throw new SConnect.Exception("InsufficientArguments");
    }
    SConnect._destroyWindow("sconnect_status");

    if (showMsg !== false) {
        SConnect._showStatusMsg('AddOnInstallMsg', addons[0].packageName);
    }

    var _eventListener = function (resp) {

        //LoggingService.debug("");
        //LoggingService.debug("======================================");
        //LoggingService.debug("SConnect._registerAddonInstallFinishEventListener");
        //LoggingService.debug("response (" + JSON.stringify(resp) + ")");
        //LoggingService.debug("======================================");
        //LoggingService.debug("");

        var res = JSON.parse(resp);
        var code = res[0];
        var info = res[1];

        if ((code == 200) || (code === 0)) {
            if (addons === null) {
                //console.log("Null addons detected!");
            } else if (addons.length === 0) {
                //console.log("addons length 0 detected!");
            } else if (addons[0].packageUUID === null) {
                //console.log("Null addons[0].packageUUID detected!");
            } else if (addons[0].packageUUID == info.packageUUID) {
                //console.log("Registered addons[0].packageUUID matches. Shifting addons...");
                addons.shift();

                if (addons.length > 0) {

                    SConnect._destroyWindow("sconnect_status");
                    SConnect._showStatusMsg('AddOnInstallMsg', addons[0].packageName);
                }
            }
        }
    };

    SConnect._registerAddonInstallFinishEventListener(_eventListener);

    var _callback = {

        success: function () {

            //LoggingService.debug("");
            //LoggingService.debug("======================================");
            //LoggingService.debug("SConnect.InstallAddOns - success");
            //LoggingService.debug("======================================");
            //LoggingService.debug("");
			
            SConnect._unregisterAddonInstallFinishEventListener();
            SConnect._fadeInOut("sconnect_status", false);
            SConnect._triggerCallback(callback, true);
        },

        error: function (code) {

            //LoggingService.debug("");
            //LoggingService.debug("======================================");
            //LoggingService.debug("SConnect.InstallAddOns - error");
            //LoggingService.debug("======================================");
            //LoggingService.debug("");
			
            SConnect._unregisterAddonInstallFinishEventListener();
            SConnect._fadeInOut("sconnect_status", false);
            SConnect._triggerCallback(callback, false, code, addons[0]);

        }
    };

    var basePath = SConnect._addonPath;

    // build fully qualified path from relative path
    if ((basePath.toLowerCase().indexOf('http://') !== 0) &&
        (basePath.toLowerCase().indexOf('https://') !== 0)) {

        var img = document.createElement('img');
        img.src = basePath;
        basePath = img.src;
        img.src = '';
    }

    var params = [];
    params.push(basePath);
    params.push(addons);

    SConnect._invoke("InstallAddOns", params, _callback);
};

/**
 * @private
 */
SConnect._pollForEvents = function () {
    //LoggingService.debug("SConnect._pollForEvents - (BEGIN)");

    // Normally, a poll such as this is not needed for SConnect.
    // However, an issue with Safari appex shutdown requires
    // some mechanism for restarting the appex communication
    // for events. This function provides that mechanism.

    if (SConnect._cmdInProgress) {
        // skip poll if another command is in progress
        //console.log("SConnect: poll skipped while command in progress.");
        //LoggingService.debug("SConnect._pollForEvents - skip");
        return;
    }

    var _timer = null;

    var _callback = {

        success: function ( /*resp*/ ) {

            //LoggingService.debug("SConnect._pollForEvents - success");

            if (_timer) {
                window.clearTimeout(_timer);
            }

            //console.log("PollForEvents: success.");
            SConnect._cmdInProgress = false;
        },
        error: function ( /*code*/ ) {

            //LoggingService.debug("SConnect._pollForEvents - failure");

            if (_timer) {
                window.clearTimeout(_timer);
            }

            //console.log("PollForEvents: failure.");
            SConnect._cmdInProgress = false;
        }
    };

    //console.log("_pollForEvents: invoking PollForEvents...");
    SConnect._invoke("PollForEvents", null, _callback);

    _timer = window.setTimeout(function () {
        //console.log("_pollForEvents: timeout");

    }, 3000);

    //LoggingService.debug("SConnect._pollForEvents - (END)");
};

// This is a workaround of appex shutdown on Safari using App Extension (appex)
// This restarts the appex and retrieves SConnect events if the appex has shut down.
/**
 * @private
 */
SConnect._interval = null;
if (SConnectBrowserDetect.isSafariAppex) {
    SConnect._interval = window.setInterval(SConnect._pollForEvents, 3500); // Poll every 3.5 seconds.
}
if (SConnectBrowserDetect.isSafariAppex) {

    window.onunload = function () {
        //console.log("sconnect.js: Clearing interval...");
        if (SConnect._interval) {
            clearInterval(SConnect._interval); // Stop the polling
        }
        //console.log("Interval cleared.");
        //console.log("sconnect.js: Clearing event handlers...");
        while ((SConnect._eventCallbacks !== null) && (SConnect._eventCallbacks.length() > 0)) {
            //console.log("deleting _eventCallback entry...");
            SConnect._eventCallbacks.shift();
        }
        //console.log("_eventCallback[] cleared");
        //if (window.sconnect)
        //	window.sconnect.Dispose();
    };
}
