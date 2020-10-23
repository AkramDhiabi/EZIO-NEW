
// ------------------ PCSC AddOn Info -----------

/**
 * @constructor
 */
SConnect.PCSCInfo = function() {

	/**
	 * TODO: PCSC addon version mode: 'exact' or 'minimum'
	 */
	// this.versionType = versionType;

	//if (typeof(versionType) == 'undefined')
	//	this.versionType = "exact";
		
	/**
	 * PCSC addon version
	 * @type String
	 */
	this.packageVersion = "1.1.0.1";
	
	/**
	 * PCSC addon URL
	 * @type Object
	 */
	this.packageURL = { win: "pcsc/pcsc-win-v" + this.packageVersion + ".pkg",
	                    win64: "pcsc/pcsc-win64-v" + this.packageVersion + ".pkg",
	                    lx: "pcsc/pcsc-lx-v" + this.packageVersion + ".pkg",
	                    lx64: "pcsc/pcsc-lx64-v" + this.packageVersion + ".pkg",
	                    osx: "pcsc/pcsc-osx-v" + this.packageVersion + ".pkg" };
	
	/**
	 * PCSC addon UUID
	 * @type String
	 */
	this.packageUUID = "f7384f20-cd95-11e2-8b8b-0800200c9a66";
	
	/**
	 * PCSC addon display name
	 * @type String
	 */
	this.packageName = "PCSC AddOn";
}


// ------------------ PCSC Constants -----------

/**
 * Used to indicate scope of resource manager context
 */
function SCardScope() { }
SCardScope.User     = 0;
SCardScope.Terminal = 1;
SCardScope.System   = 2;

/** 
 * Used to indicate mode of access to the smartcard
 */
function SCardAccessMode() { }
SCardAccessMode.Exclusive = 1;
SCardAccessMode.Shared    = 2;
SCardAccessMode.Direct    = 3;

/**
 * Used to indicate protocol type to access the smartcard
 */
function SCardProtocolIdentifiers() { }
SCardProtocolIdentifiers.Default = -2147483648;
SCardProtocolIdentifiers.Optimal = 0;
SCardProtocolIdentifiers.Raw = 0x10000;
SCardProtocolIdentifiers.T0 = 1;
SCardProtocolIdentifiers.T1 = 2;
SCardProtocolIdentifiers.Undefined = 0;

/**
 * List of PCSC card disposition mode
 */
function SCardDisposition() { }
SCardDisposition.LeaveCard   = 0;
SCardDisposition.ResetCard   = 1;
SCardDisposition.UnpowerCard = 2;
SCardDisposition.EjectCard   = 3;
SCardDisposition.Confiscate  = 4;

/**
* List of card reader state
*/
function SCardState() { }
SCardState.Unaware     = 0;
SCardState.Ignore      = 1;
SCardState.Changed     = 2;
SCardState.Unknown     = 4;
SCardState.Unavailable = 8;
SCardState.Empty   	   = 0x10;
SCardState.Present     = 0x20;
SCardState.ATRMatch    = 0x40;
SCardState.Exclusive   = 0x80;
SCardState.Inuse       = 0x100;
SCardState.Mute        = 0x200;
SCardState.Unpowered   = 0x400;


// ------------------ PCSC -----------

/**
 * @constructor
 */
SConnect.PCSC = function()
{
   /**
     * @private
     */  
	this._addonInfo = null;

    /**
     * @private
     */  
	this._addonId = null;
	
    /**
     * @private
     */
    this._eContext = false;
    
    /**
     * @private
     */  
    this._isDisposed = true;
	
    /**
     * @private
     */
    this._transactionCounter = 0;

    /**
     * @private
     */    
    this._connectedReader = null;
	
	/**
	 * @private
	 */
	this._activeProtocol = 0;
	
	/**
	 * @private
	 */
	this._exchangeInProgress = false;
};

SConnect.PCSC.prototype = {

	// ------------------ PCSC Private Methods -----------

	/**
	 * @private
	 */
    _triggerCallback : function(callback, success, arg1, arg2, arg3) {
	
		SConnect._triggerCallback(callback, success, arg1, arg2, arg3);	
	},
	
	/**
	 * @private
	 */
    _invoke : function(command, params, callback) {

		if (typeof(params) == 'undefined')
			params = null;

		if (typeof(callback) == 'undefined')
			callback = null;

		var _this = this;
			
		var _invokeCallback = {
		
			success : function(res) {

				var code = res[0];
				var success = (code == 0);
			
				if (success) {
				
					_this._triggerCallback(callback, true, res[1], res[2], res[3]);
				}
				else {
				
					_this._triggerCallback(callback, false, code);
				}
			},
			error : function(code) {
			
				_this._triggerCallback(callback, false, code);
			}			
		}
		
		SConnect._invokeAddOnInstance(this._addonId, command, JSON.stringify(params), _invokeCallback);
	},

	/**
	 * @private
	 */
	_create : function(callback) {

		SConnect._createAddOnInstance(this._addonInfo.packageUUID, this._addonInfo.packageVersion, this._addonInfo.versionType, callback);
	},

	/**
	 * @private
	 */
    _dispose : function(callback) {

		SConnect._disposeAddOnInstance(this._addonId, this._addonInfo.packageUUID, this._addonInfo.packageVersion, callback);
	},	

	/**
	 * @private
	 */
    _registerCardStatusChangeListener : function(listener, callback) {

		SConnect._registerAddOnEvent(this._addonId, "CardStatusChangeEvent", listener, callback);
    },
	
	/**
	 * @private
	 */
    _unregisterCardStatusChangeListener : function(callback) {

		SConnect._unregisterAddOnEvent(this._addonId, "CardStatusChangeEvent", callback);
    },

	/**
	 * @private
	 */	
    _getActivePCI : function() {
	
        var pci;
        
        if (this._activeProtocol == SCardProtocolIdentifiers.T0) {
            pci = 0; /* SCardPCI.T0 */
        }
        else if (this._activeProtocol == SCardProtocolIdentifiers.T1) {
            pci = 1; /* SCardPCI.T1 */
        }
        else if (this._activeProtocol == SCardProtocolIdentifiers.Raw) {
            pci = 2 /* SCardPCI.Raw */
        }
        else {
            // FIXME : what to return in this case ? Return T0 for now.  
            // Default, Optimal, Undefined.
            pci = 0; /* SCardPCI.T0 */
        }
        
        return pci;
    },

	
	// ------------------ PCSC Public Methods -----------

    /**
     * Get the currently connected reader name
	 *
     * @memberOf SConnect.PCSC
     * @return {String} reader name
     */
    getConnectedReader : function() {
        return this._connectedReader;
    },

    /**
     * Get the current active protocol type
	 *
     * @memberOf SConnect.PCSC
     * @return {Number} protocol type
     */
    getActiveProtocol : function(){
        return this._activeProtocol;
    },
	
	/**
	 * Call "SCardEstablishContext" PCSC method
	 *
     * @memberOf SConnect.PCSC
	 * @param {Object} callback object called when the operation is finish
	 * <ul>
	 *   <li> callback.success() - function called when SCardEstablishContext call is successful
	 *   <li> callback.error(errorcode) - function called when SCardEstablishContext call is failed
	 *   <br> * errorCode: PCSC error code, or (-3) for "NotAuthorized"
	 * </ul>
	 * @param {SCardScope} scope {Optional} one of SCardScope value; default is User
     * @exception {SConnect.Exception} possible reason(s): "ObjectDisposed", "InvalidOperation"
	 * @return {void} 
	 */
    establishContext : function(callback, scope) {

        if (this._isDisposed)
            throw new SConnect.Exception("ObjectDisposed");
            
        if (this._eContext)
            throw new SConnect.Exception("InvalidOperation");
        
        if (typeof(scope) == 'undefined')
            scope = SCardScope.User;
	
		var params = [];
		params.push(scope);
		
		var _this = this;
		
		var _establishContextCallback = {
		
			success : function() {
		
				_this._eContext = true;
				_this._triggerCallback(callback, true);
			},
			error : function(code) {
			
				_this._triggerCallback(callback, false, code);
			}
		}
		
        this._invoke("SCardEstablishContext", params, _establishContextCallback);
    },

	/**
	 * Call "SCardReleaseContext" PCSC method
	 *
     * @memberOf SConnect.PCSC
	 * @param {Object} callback object called when the operation is finish
	 * <ul>
	 *   <li> callback.success() - function called when SCardReleaseContext call is successful
	 *   <li> callback.error(errorcode) - function called when SCardReleaseContext call is failed
	 *   <br> * errorcode: PCSC error code, or (-3) for "NotAuthorized"
	 * </ul>
     * @exception {SConnect.Exception} possible reason(s): "ObjectDisposed", "InvalidOperation"
	 * @return {void} 
	 */
    releaseContext : function(callback) {

        if (this._isDisposed)
            throw new SConnect.Exception("ObjectDisposed");
            
        if (!this._eContext)
            throw new SConnect.Exception("InvalidOperation");

		var _this = this;
		
		var _releaseContextCallback = {
		
			success : function() {
		
				_this._eContext = false;
				_this._triggerCallback(callback, true);
			},
			error : function(code) {
			
				_this._triggerCallback(callback, false, code);
			}
		}
			
        this._invoke("SCardReleaseContext", null, _releaseContextCallback);
    },

    /**
	 * Call "SCardBeginTransaction" PCSC method
	 *
     * @memberOf SConnect.PCSC
	 * @param {Object} callback object called when the operation is finish
	 * <ul>
	 *   <li> callback.success(transno) - function called when SCardBeginTransaction call is successful
	 *   <li> callback.error(errorcode) - function called when SCardBeginTransaction call is failed
	 *   <br> * transno: total number of transaction opened
	 *   <br> * errorcode: PCSC error code, or (-3) for "NotAuthorized"
	 * </ul>
     * @exception {SConnect.Exception} possible reason(s): "ObjectDisposed", "InvalidOperation"
	 * @return {void} 
     */
    beginTransaction : function(callback) {

        if (this._isDisposed)
            throw new SConnect.Exception("ObjectDisposed");
   
        if (this._connectedReader === null)
            throw new SConnect.Exception("InvalidOperation");
        
        if (this._transactionCounter == 0) {
         
			var _this = this;
			
			var _beginTransactionCallback = {
				
				success : function() {

					_this._transactionCounter++;
					_this._triggerCallback(callback, true, _this._transactionCounter);
				},
				error : function(code) {
				
					_this._triggerCallback(callback, false, code);
				}
			}		
		
			this._invoke("SCardBeginTransaction", null, _beginTransactionCallback);
        }
        else {
        
			this._transactionCounter++;
			this._triggerCallback(callback, true, this._transactionCounter);
        }
    },
	 
    /**
	 * Call "SCardEndTransaction" PCSC method
	 *
     * @memberOf SConnect.PCSC
	 * @param {Object} callback object called when the operation is finish
	 * <ul>
	 *   <li> callback.success(transno) - function called when SCardEndTransaction call is successful
	 *   <li> callback.error(errorcode) - function called when SCardEndTransaction call is failed
	 *   <br> * transno: total number of transaction still opened
	 *   <br> * errorcode: PCSC error code, or (-3) for "NotAuthorized"
	 * </ul>
     * @param {SCardDisposition} dispositionMode {Optional} one of SCardDisposition value; default is LeaveCard
     * @exception {SConnect.Exception} possible reason(s): "ObjectDisposed", "InvalidOperation"
	 * @return {void} 
     */
    endTransaction : function(callback, dispositionMode) {
  
        if (this._isDisposed)
            throw new SConnect.Exception("ObjectDisposed");
             
        if ((this._connectedReader === null) || (this._transactionCounter === 0))
            throw new SConnect.Exception("InvalidOperation");
        
        if (typeof(dispositionMode) == 'undefined')
            dispositionMode = SCardDisposition.LeaveCard;
        
        if (this._transactionCounter > 1) {
		
			this._transactionCounter--;
			this._triggerCallback(callback, true, this._transactionCounter);
		}
		else if (this._transactionCounter === 1) {
        
			var params = [];
			params.push(dispositionMode);
			
			var _this = this;
			
			var _endTransactionCallback = {
			
				success : function() {

					_this._transactionCounter = 0;
					_this._triggerCallback(callback, true, _this._transactionCounter);
				},
				error : function(code) {
				
					_this._triggerCallback(callback, false, code);
				}
			}
			
            this._invoke("SCardEndTransaction", params, _endTransactionCallback);
        }
    },

	/**
	 * Call "SCardCancel" PCSC method
	 *
     * @memberOf SConnect.PCSC
	 * @param {Object} callback object called when the operation is finish
	 * <ul>
	 *   <li> callback.success() - function called when SCardCancel call is successful
	 *   <li> callback.error(errorcode) - function called when SCardCancel call is failed
	 *   <br> * errorcode: PCSC error code, or (-3) for "NotAuthorized"
	 * </ul>
     * @exception {SConnect.Exception} possible reason(s): "ObjectDisposed"
	 * @return {void} 
	 */
    cardCancel : function(callback) {
            
        if (this._isDisposed)
            throw new SConnect.Exception("ObjectDisposed");
			
		this._invoke("SCardCancel", null, callback);
    },

	/**
	 * Call "SCardConnect" PCSC method
	 *
     * @memberOf SConnect.PCSC
     * @param {String} readerName name of reader to connect
	 * @param {Object} callback object called when the operation is finish
	 * <ul>
	 *   <li> callback.success(readername) - function called when SCardConnect call is successful
	 *   <li> callback.error(errorcode) - function called when SCardConnect call is failed
	 *   <br> * readername: name of reader successfully connected
	 *   <br> * errorcode: PCSC error code, or (-3) for "NotAuthorized"
	 * </ul>
     * @param {SCardAccessMode} accessMode {Optional} one of SCardAccessMode value; default is Shared
     * @param {SCardProtocolIdentifiers} preferredProtocol {Optional} one of SCardProtocolIdentifiers value; default is T0 | T1
     * @exception {SConnect.Exception} possible reason(s): "ObjectDisposed", "InvalidOperation", "InsufficientArguments"
	 * @return {void} 
	 */
	connect : function(readerName, callback, accessMode, preferredProtocol) {

		if (this._isDisposed)
			throw new SConnect.Exception("ObjectDisposed");

		if (this._connectedReader !== null)
			throw new SConnect.Exception("InvalidOperation");

		if (arguments.length < 1)
			throw new SConnect.Exception("InsufficientArguments");

		if (typeof(accessMode) == 'undefined')
			accessMode = SCardAccessMode.Shared;

		if (typeof(preferredProtocol) == 'undefined')
			preferredProtocol = SCardProtocolIdentifiers.T0 | SCardProtocolIdentifiers.T1;
	 
        var params = [];
		params.push(readerName);
		params.push(accessMode);
		params.push(preferredProtocol);

		var _this = this;
		
		var _connectCallback = {
		
			success : function(arg1) {

				_this._connectedReader = readerName;
				_this._activeProtocol = arg1;
				_this._triggerCallback(callback, true, readerName);
			},
			error : function(code) {
			
				_this._triggerCallback(callback, false, code);
			}
		}
		
		this._invoke("SCardConnect", params, _connectCallback);
    },

	/**
	 * Call "SCardReconnect" PCSC method
	 *
     * @memberOf SConnect.PCSC
	 * @param {Object} callback object called when the operation is finish
	 * <ul>
	 *   <li> callback.success(readername) - function called when SCardReconnect call is successful
	 *   <li> callback.error(errorcode) - function called when SCardReconnect call is failed
	 *   <br> * readername: name of reader successfully reconnected
	 *   <br> * errorcode: PCSC error code, or (-3) for "NotAuthorized"
	 * </ul>
     * @param {SCardAccessMode} accessMode {Optional} one of SCardAccessMode value; default is Shared
     * @param {SCardProtocolIdentifiers} preferredProtocol {Optional} one of SCardProtocolIdentifiers value; default is T0 | T1
     * @param {SCardDisposition} dispositionMode {Optional} one of SCardDisposition value; default is LeaveCard
     * @exception {SConnect.Exception} possible reason(s): "ObjectDisposed", "InvalidOperation", "InvalidDispositionMode"
	 * @return {void} 
	 */
    reconnect : function(callback, accessMode, preferredProtocol, dispositionMode) {
        
        if (this._isDisposed)
            throw new SConnect.Exception("ObjectDisposed");
             
        if (this._connectedReader === null)
            throw new SConnect.Exception("InvalidOperation");
        
        if (dispositionMode == SCardDisposition.EjectCard)
            throw new SConnect.Exception("InvalidDispositionMode");
        
        if (typeof(accessMode) == 'undefined')
            accessMode = SCardAccessMode.Shared;
         
        if (typeof(preferredProtocol) == 'undefined')
            preferredProtocol = SCardProtocolIdentifiers.T0 | SCardProtocolIdentifiers.T1;
                   
        if (typeof(dispositionMode) == 'undefined')
            dispositionMode = SCardDisposition.LeaveCard;
        
		var params = [];
		params.push(accessMode);
		params.push(preferredProtocol);
		params.push(dispositionMode);

		var _this = this;
		
		var _reconnectCallback = {
		
			success : function(arg1) {
			
				_this._activeProtocol = arg1;
				_this._triggerCallback(callback, true, _this._connectedReader);
			},
			error : function(code) {
			
				_this._triggerCallback(callback, false, code);
			}
		}
		
        this._invoke("SCardReconnect", params, _reconnectCallback);
    },
	
	/**
	 * Call "SCardDisconnect" PCSC method
	 *
     * @memberOf SConnect.PCSC
	 * @param {Object} callback object called when the operation is finish
	 * <ul>
	 *   <li> callback.success(readername) - function called when SCardDisconnect call is successful
	 *   <li> callback.error(errorcode) - function called when SCardDisconnect call is failed
	 *   <br> * readername: name of reader successfully disconnected
	 *   <br> * errorcode: PCSC error code, or (-3) for "NotAuthorized"
	 * </ul>
     * @param {SCardDisposition} dispositionMode {Optional} one of SCardDisposition value; default is LeaveCard 
     * @exception {SConnect.Exception} possible reason(s): "ObjectDisposed", "InvalidOperation"
	 * @return {void} 
	 */
    disconnect : function(callback, dispositionMode) {    
        
        if (this._isDisposed)
            throw new SConnect.Exception("ObjectDisposed");
             
        if (this._connectedReader === null)
            throw new SConnect.Exception("InvalidOperation");
                
        if (typeof(dispositionMode) == 'undefined')
            dispositionMode = SCardDisposition.LeaveCard;
        
		var params = [];
		params.push(dispositionMode);

		var _this = this;
		
		var _disconnectCallback = {
		
			success : function() {
			
				var readerName = _this._connectedReader;
				
				_this._activeProtocol = 0;
				_this._connectedReader = null;
				_this._transactionCounter = 0;
				_this._triggerCallback(callback, true, readerName);
			},
			error : function(code) {
			
				_this._triggerCallback(callback, false, code);
			}
		}
		
        this._invoke("SCardDisconnect", params, _disconnectCallback);
    },

	/**
	 * Call "SCardGetStatusChange" PCSC method
	 *
     * @memberOf SConnect.PCSC
     * @param {String} readerName name of the reader to get state of
	 * @param {Object} callback object called when the operation is finish
	 * <ul>
	 *   <li> callback.success(readerstate, atr) - function called when SCardGetStatusChange call is successful
	 *   <li> callback.error(errorcode) - function called when SCardGetStatusChange call is failed
	 *   <br> * readerstate: current state of the reader
	 *   <br> * atr: card's ATR bytes
	 *   <br> * errorcode: PCSC error code, or (-3) for "NotAuthorized"
	 * </ul>
     * @param {Number} currentState {Optional} one of SCardState value; default is Unaware
     * @exception {SConnect.Exception} possible reason(s): "ObjectDisposed", "InvalidOperation", "InsufficientArguments"
	 * @return {void} 
	 */
    readerStatus : function(readerName, callback, currentState) {
        
        if (this._isDisposed)
            throw new SConnect.Exception("ObjectDisposed");
            
        if (!this._eContext)
            throw new SConnect.Exception("InvalidOperation");      

		if (arguments.length < 1)
			throw new SConnect.Exception("InsufficientArguments");
			
        if (typeof(currentState) == 'undefined')
            currentState = SCardState.Unaware;

		var params = [];
		params.push(0);
		params.push(readerName);
		params.push(currentState);

		// callback params: event-state, atr
        this._invoke("SCardGetStatusChange", params, callback); 
    },

	/**
	 * Call "SCardStatus" PCSC method
	 *
     * @memberOf SConnect.PCSC
	 * @param {Object} callback object called when the operation is finish
	 * <ul>
	 *   <li> callback.success(cardstate, protocol, atr) - function called when SCardStatus call is successful
	 *   <li> callback.error(errorcode) - function called when SCardStatus call is failed
	 *   <br> * cardstate: current state of the card
	 *   <br> * protocol: current active protocol
	 *   <br> * atr: card's ATR bytes
	 *   <br> * errorcode: PCSC error code, or (-3) for "NotAuthorized"
	 * </ul>
     * @exception {SConnect.Exception} possible reason(s): "ObjectDisposed", "InvalidOperation"
	 * @return {void} 
	 */
    cardStatus : function(callback) {
            
        if (this._isDisposed)
            throw new SConnect.Exception("ObjectDisposed");
             
        if (this._connectedReader == null)
            throw new SConnect.Exception("InvalidOperation");
		
		// callback params: state, protocol, atr
        this._invoke("SCardStatus", null, callback);
    },

	/**
	 * Call "SCardListReaders" PCSC method
	 *
     * @memberOf SConnect.PCSC
     * @param {bool} withCard true means return readers with card inserted
	 * @param {Object} callback object called when the operation is finish
	 * <ul>
	 *   <li> callback.success(readerlist) - function called when SCardListReaders call is successful
	 *   <li> callback.error(errorcode) - function called when SCardListReaders call is failed
	 *   <br> * readerlist: list of reader name(s)
	 *   <br> * errorcode: PCSC error code, or (-3) for "NotAuthorized"
	 * </ul>
     * @exception {SConnect.Exception} possible reason(s): "ObjectDisposed", "InvalidOperation"
	 * @return {void} 
	 */
    listReaders : function(withCard, callback) {

		if (this._isDisposed)
			throw new SConnect.Exception("ObjectDisposed");

		if (!this._eContext)
			throw new SConnect.Exception("InvalidOperation");      

        var params = [];
		params.push(withCard ? 1 : 0);

		var _this = this;
		
		var _listReaderCallback = {
		
			success : function(arg1) {
				
				var list = arg1.split("#");
				list = list.splice(0, list.length - 1);
				
				_this._triggerCallback(callback, true, list);
			},
			error : function(code) {
			
				_this._triggerCallback(callback, false, code);
			}
		}
		
		this._invoke("SCardListReaders", params, _listReaderCallback);
    },
	
	/**
	 * Call "SCardTransmit" PCSC method
	 *
     * @memberOf SConnect.PCSC
     * @param {String} sendBuffer apdu command to send, in hex-string
	 * @param {Object} callback object called when the operation is finish
	 * <ul>
	 *   <li> callback.success(statusword, dataout) - function called when SCardTransmit call is successful
	 *   <li> callback.error(errorcode) - function called when SCardTransmit call is failed
	 *   <br> * statusword: status word returned by card
	 *   <br> * dataout: output data returned by card
	 *   <br> * errorcode: PCSC error code, or -3 = "NotAuthorized", 1 = "INVALID_HANDLE", 2 = "INVALID_OFFSET"
	 * </ul>
     * @param {Number} expectedLen {Optional} the expected response length
	 * @param {Number} handle {Optional} handle to secure data
	 * @param {Number} offset {Optional} start byte-offset where the secure data should be injected into, start from 0
     * @exception {SConnect.Exception} possible reason(s): "ObjectDisposed", "InvalidOperation", "InsufficientArguments"
	 * @return {void} 
	 */
    transmit : function(sendBuffer, callback, expectedLen, handle, offset) {
        
        if (this._isDisposed)
            throw new SConnect.Exception("ObjectDisposed");
         
        if (this._connectedReader === null)
            throw new SConnect.Exception("InvalidOperation");
        
        if (arguments.length < 1)
            throw new SConnect.Exception("InsufficientArguments");
        
		var params = [];
		params.push(this._getActivePCI());
		params.push(sendBuffer);
		params.push((expectedLen > 0) ? expectedLen : 258);
		params.push((handle >= 0) ? handle : -1);
		params.push((offset >= 0) ? offset : -1);

		var _this = this;
		
		var _transmitCallback = {
		
			success : function(arg1) {
			
				var resp = arg1; 
				var cres = "";
			
				// contains data
				if (resp.length > 4)
					cres = resp.substr(0, resp.length-4);
			
				var dataOut = cres;
				var statusWord = resp.substr(resp.length-4, 4);
			
				// callback params: SW, data
				_this._triggerCallback(callback, true, statusWord, dataOut);
			},
			error : function(code) {

				_this._triggerCallback(callback, false, code);
			}			
		}
		
		this._invoke("SCardTransmit", params, _transmitCallback);
    },	 

	/**
	 * Call "SCardTransmit" PCSC method and retrieve all dataout, within a transaction
	 *
     * @param {String} sendBuffer apdu command to send, in hex-string
	 * @param {Object} callback object called when the operation is finish
	 * <ul>
	 *   <li> callback.success(statusword, dataout) - function called when all procedure calls are successful
	 *   <li> callback.error(errorcode) - function called when any of the procedure call is failed
	 *   <br> * statusword: status word returned by card
	 *   <br> * dataout: output data returned by card
	 *   <br> * errorcode: PCSC error code, or -3 = "NotAuthorized", 1 = "INVALID_HANDLE", 2 = "INVALID_OFFSET"
	 * </ul>	 
     * @param {Number} le {Optional} Le parameter value for a case-4 APDU (used only in T=1 protocol)
	 * @param {Number} handle {Optional} handle to secure data
	 * @param {Number} offset {Optional} start byte-offset where the secure data should be injected into, start from 0
	 */
	exchangeAPDU : function(sendBuffer, callback, le, handle, offset) {

		if (arguments.length < 1)
			throw new SConnect.Exception("InsufficientArguments");
        
		if (this._exchangeInProgress)
			throw new SConnect.Exception("ExchangeInProgress");
		
		var _this = this;
		var _sw = "";
		var _dataout = "";
		var _errcode = null;
	
		var _endtransCallback = {
		
			success : function() {
			
				if (_errcode)
					_this._triggerCallback(callback, false, _errcode);
				else
					_this._triggerCallback(callback, true, _sw, _dataout);
			},
			error: function(code) {

				if (_errcode)
					_this._triggerCallback(callback, false, _errcode);
				else
					_this._triggerCallback(callback, false, code);
			}
		};
	
		var _exchangeCallback = {
		
			success : function(sw, dataout) {

				var sw1 = sw.substr(0,2);
				var sw2 = sw.substr(2,2);

				_sw = sw;
				_dataout += dataout;
			
				if ((sw1 == "6C") && (!(handle >= 0)) && (!(offset >= 0))) {
				
					// resend apdu with the right Le
					sendBuffer = sendBuffer.substring(0,8) + sw2;
					_this.transmit(sendBuffer, _exchangeCallback);
				}
				else if ((sw1 == "9F") || (sw1 == "61")) {

					// use the same CLA byte as the initial APDU.
					sendBuffer = sendBuffer.substr(0,2) + "C00000" + sw2;
					_this.transmit(sendBuffer, _exchangeCallback);
				}
				else {
			
					_this._exchangeInProgress = false;
					_this.endTransaction(_endtransCallback);
				}
			},
			error : function(code) {
			
				_errcode = code;
				_this._exchangeInProgress = false;
				_this.endTransaction(_endtransCallback);
			}
		};

		var _transCallback = {
		
			success : function(transno) {
			
				if ((this._activeProtocol == SCardProtocolIdentifiers.T1) && (typeof(le) != 'undefined') && (le != null))
					sendBuffer += le
				
				_this.transmit(sendBuffer, _exchangeCallback, null, handle, offset);
			},
			error : function(code) {
			
				_this._exchangeInProgress = false;	
				_this._triggerCallback(callback, false, code);				
			}
		};
		
		this._exchangeInProgress = true;		
		this.beginTransaction(_transCallback)
	},

	/**
	 * Call "SCardControl" PCSC method
	 *
     * @memberOf SConnect.PCSC
     * @param {Number} ctrlCode control code to send
     * @param {String} sendBuffer data to sent to the reader, in hex-string
     * @param {bool} raw true means it is the final code and no need to apply SCARD_CTL_CODE to it
	 * @param {Object} callback object called when the operation is finish
	 * <ul>
	 *   <li> callback.success(dataout) - function called when SCardControl call is successful
	 *   <li> callback.error(errorcode) - function called when SCardControl call is failed
	 *   <br> * dataout: output data returned by reader
	 *   <br> * errorcode: PCSC error code, or (-3) for "NotAuthorized"
	 * </ul>
     * @param {Number} expectedLen {Optional} expected response length
     * @exception {SConnect.Exception} possible reason(s): "ObjectDisposed", "InvalidOperation", "InsufficientArguments"
	 * @return {void} 
	 */
    cardControl : function(ctrlCode, sendBuffer, raw, callback, expectedLen) {

        if (this._isDisposed)
            throw new SConnect.Exception("ObjectDisposed");
         
        if (this._connectedReader === null)
            throw new SConnect.Exception("InvalidOperation");

        if (arguments.length < 3)
            throw new SConnect.Exception("InsufficientArguments");
			
		var params = [];
		params.push(ctrlCode);
		params.push(raw ? 1 : 0);
		params.push(sendBuffer ? sendBuffer : "");
		params.push((expectedLen > 0) ? expectedLen : 258);

        this._invoke("SCardControl", params, callback);
    },
	
	/**
	 * Call "SCardGetAttrib" PCSC method
	 *
     * @memberOf SConnect.PCSC
     * @param {Number} attrId identifier of the attribute to get
	 * @param {Object} callback object called when the operation is finish
	 * <ul>
	 *   <li> callback.success(dataout) - function called when SCardGetAttrib call is successful
	 *   <li> callback.error(errorcode) - function called when SCardGetAttrib call is failed
	 *	 <br> * dataout: attribute data returned by reader
	 *   <br> * errorcode: PCSC error code, or (-3) for "NotAuthorized"
	 * </ul>
     * @param {Number} expectedLen {Optional} expected response length
     * @exception {SConnect.Exception} possible reason(s): "ObjectDisposed", "InvalidOperation", "InsufficientArguments"
	 * @return {void} 
	 */
    getAttrib : function(attrId, callback, expectedLen) {

        if (this._isDisposed)
            throw new SConnect.Exception("ObjectDisposed");
         
        if (this._connectedReader === null)
            throw new SConnect.Exception("InvalidOperation");

        if (arguments.length < 1)
            throw new SConnect.Exception("InsufficientArguments");
			
		var params = [];
		params.push(attrId);
		params.push((expectedLen > 0) ? expectedLen : 258);
		
        this._invoke("SCardGetAttrib", params, callback);
    },

	/**
	 * Call "SCardSetAttrib" PCSC method
	 *
     * @memberOf SConnect.PCSC
     * @param {Number} attrId identifier of the attribute to set
     * @param {String} sendBuffer attribute value to set
	 * @param {Object} callback object called when the operation is finish
	 * <ul>
	 *   <li> callback.success() - function called when SCardSetAttrib call is successful
	 *   <li> callback.error(errorcode) - function called when SCardSetAttrib call is failed
	 *   <br> * errorcode: PCSC error code, or (-3) for "NotAuthorized"
	 * </ul>
     * @exception {SConnect.Exception} possible reason(s): "ObjectDisposed", "InvalidOperation", "InsufficientArguments"
	 * @return {void} 
	 */
	setAttrib : function(attrId, sendBuffer, callback) {

        if (this._isDisposed)
            throw new SConnect.Exception("ObjectDisposed");
         
        if (this._connectedReader == null)
            throw new SConnect.Exception("InvalidOperation");

        if (arguments.length < 2)
            throw new SConnect.Exception("InsufficientArguments");
			
		var params = [];
		params.push(attrId);
		params.push(sendBuffer);
		
        this._invoke("SCardSetAttrib", params, callback);
    },
	
	/**
	 * Dispose PCSC instance
	 *
     * @memberOf SConnect.PCSC
	 * @return {void} 
	 */
    dispose : function() {
    
        if (!this._isDisposed) {
		
			// dispose the addon instance
			this._dispose(null);
			
			this._addonId = null;
			this._isDisposed = true;			
        }
    }
};

/**
 * Create SConnect PCSC addon instance 
 *
 * @memberOf SConnect.PCSC
 * @param {Object} callback object called when the operation is finish
 * <ul>
 *   <li> callback.success(pcsc) - function called when SConnect PCSC addon instance creation is successful
 *   <li> callback.error(errorcode) - function called when SConnect PCSC addon instance creation is failed
 *   <br> * pcsc: SConnect.PCSC instance created
 *   <br> * errorcode: -3 = "NotAuthorized", -4 = "InvSignature", -5 = "NotInstalled", -6 = "DllLoadFailed", -7 = "AddOnCreateFailed"
 * </ul>
 * @return {void} 
 */
SConnect.PCSC.Create = function(callback) {

	var establishCtx = true;
	var info = new SConnect.PCSCInfo();
	var pcsc = new SConnect.PCSC();
		
	pcsc._addonInfo = info;
	
	var _createCallback = {
	
		success : function(res) {
	
			var code = res[0];
			var success = (code >= 0);
			
			if (!success) {
			
				pcsc._triggerCallback(callback, false, code);
			}
			else {
			
				pcsc._addonId = res[0];
				pcsc._isDisposed = false;
				
				if (!establishCtx) {
				
					pcsc._triggerCallback(callback, true, pcsc);
				}
				else {
				
					var _establishContextCallback = {
					
						success : function() { 
						
							pcsc._triggerCallback(callback, true, pcsc);
						},
						error : function(code) {
						
							pcsc._triggerCallback(callback, false, code);
						}
					};
				
					pcsc.establishContext(_establishContextCallback);
				}
			}
		},
		error : function(code) {
		
			pcsc._triggerCallback(callback, false, code);
		}
	}
	
	pcsc._create(_createCallback);
};

/**
 * Register a listener to the card and reader status change event
 *
 * @memberOf SConnect.PCSC
 * @param {Object} callback object called when the event is fired
 * <ul>
 *   <li> callback.onCardInsertion(readerName, atr) - function called when a card insertion event is fired
 *   <li> callback.onCardInsertionMute(readerName) - function called when a card insertion event is fired, but mute
 *   <li> callback.onCardRemoval(readerName) - function called when a card removal event is fired
 *   <li> callback.onCardConnected(readerName) - function called when a reader connection event is fired
 *   <li> callback.onCardDisconnected(readerName) - function called when a reader disconnection event is fired
 *   <li> callback.success() - function called when listener registration is successful
 *   <li> callback.error(errorcode) - function called when listener registration is failed
 *   <br> * readerName: name of the reader
 *   <br> * atr: card's ATR bytes
 *   <br> * errorcode: error code, or (-3) for "NotAuthorized"
 * </ul>
 * @return {void} 
 */
SConnect.PCSC.RegisterCardIRHandler = function(callback) {

    if (!window.internal_ir_scom) {

		var _createCallback = {
		
			success : function(pcsc) {

				window.internal_ir_scom = pcsc;
				window.internal_ir_callback = callback;
				
				pcsc._registerCardStatusChangeListener(SConnect.PCSC._onCardStatusChange, callback);				
			},
			error : function(code) {
			
				SConnect._triggerCallback(callback, false, code);
			}
		};
		
		SConnect.PCSC.Create(_createCallback);
		
    } else {
	
		SConnect._triggerCallback(callback, true);
	}
};

/**
 * Unregister listener from the card and reader status change event
 *
 * @memberOf SConnect.PCSC
 * @param {Object} callback object called when the event is fired
 * <ul>
 *   <li> callback.success() - function called when listener unregistration is successful
 *   <li> callback.error(errorcode) - function called when listener unregistration is failed
 *   <br> * errorcode: error code, or (-3) for "NotAuthorized"
 * </ul>
 * @return {void} 
 */
SConnect.PCSC.UnregisterCardIRHandler = function(callback) {

    if (window.internal_ir_scom) {

		window.internal_ir_scom._unregisterCardStatusChangeListener(callback);
        window.internal_ir_scom.dispose();
        window.internal_ir_scom = null;
		window.internal_ir_callback = null;
		
    }  else {
	
		SConnect._triggerCallback(callback, true);
	}
};

/**
 * @private
 */
SConnect.PCSC._onCardStatusChange = function(result) {

	var res = JSON.parse(result);
	var reader = res[0];
	var	status = res[1];
	var atr = res[2];
	
    var args = {};
    args.readerName = reader;

    if (status === "removed" || status === 0) {

        // fire the card removal event
        if (window.internal_ir_callback) {
            if (window.internal_ir_callback.onCardRemoval) {
                if (window.internal_ir_callback.scope) {
                    window.internal_ir_callback.onCardRemoval.apply(window.internal_ir_callback.scope, [args]);
                } else {
                    window.internal_ir_callback.onCardRemoval(args);
                }
            }
        }
    }
	else if (status === "inserted" || status === 1) {

        if ((atr) && (atr.length > 0)) {
        
            // normal card insertion, ATR is available
            args.ATR = atr;                
            
            // fire the insertion event
            if (window.internal_ir_callback) {
                if (window.internal_ir_callback.onCardInsertion) {
                    if (window.internal_ir_callback.scope) {
                        window.internal_ir_callback.onCardInsertion.apply(window.internal_ir_callback.scope, [args]);
                    } else {
                        window.internal_ir_callback.onCardInsertion(args);
                    }
                }
            }
        }
        else {
        
            // card insertion + card mute, e.g. when card inserted upside down.
        
            // fire the insertion-mute event
            if (window.internal_ir_callback) {
                if (window.internal_ir_callback.onCardInsertionMute) {
                    if (window.internal_ir_callback.scope) {
                        window.internal_ir_callback.onCardInsertionMute.apply(window.internal_ir_callback.scope, [args]);
                    } else {
                        window.internal_ir_callback.onCardInsertionMute(args);
                    }
                }
            }
        }
    }
    else if (status === "disconnected" || status === 2) {

        // fire the reader removal event
        if (window.internal_ir_callback) {
            if (window.internal_ir_callback.onReaderDisconnected) {
                if (window.internal_ir_callback.scope) {
                    window.internal_ir_callback.onReaderDisconnected.apply(window.internal_ir_callback.scope, [args]);
                } else {
                    window.internal_ir_callback.onReaderDisconnected(args);
                }
            }
        }
    }
    else if (status === "connected" || status === 3) {

        // fire the reader insertion event
        if (window.internal_ir_callback) {
            if (window.internal_ir_callback.onReaderConnected) {
                if (window.internal_ir_callback.scope) {
                    window.internal_ir_callback.onReaderConnected.apply(window.internal_ir_callback.scope, [args]);
                } else {
                    window.internal_ir_callback.onReaderConnected(args);
                }
            }
        }
    }
};

