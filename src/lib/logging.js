
/**
 * @file Javascript logging library
 * @version 1.0.0
 * @author Gemalto
 * @overview This library stores string messages in the front-end and provides also means to send them to the back-end.
 * @copyright Gemalto 2013
 * @license 
 */

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
* MODIFYING OR DISTRIBUTING THIS SOFTWARE OR ITS DERIVATIVES
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
/* JHint definition */
/*global window: false */
   
var LoggingService = (function () {

    "use strict";

    if( !window.console ) { 
    
        window.console = {
            log: function () {}
        };
    } 
    
    // Version of the library
    var VERSION = "1.0",
        CATEGORY = ["Error", "Warning", "Info", "Debug"],
        ERROR = 0,
        WARNING = 1,
        INFO = 2,
        DEBUG = 3,
        sLevel = DEBUG,
        logItem = null,
        logStore = null,
        logSave = null;

    // Initialize the logging features
    function setLevel( a_sLevel ) {
        
        sLevel = a_sLevel;        
    }


    function logitem( ) {
        var SPACER = " - ";
                  
        function getTimeStamp( ) {
            
            // Create a time stamp
            var d = new Date(),
                ts = null;
            
            if( d.toJSON ) {
                
                return d.toJSON( );
            }
            
            ts = d.getYear();
            ts += "-";
            ts += ( ( d.getMonth( ) < 10 ) ? ( "0" + d.getMonth( ) ): d.getMonth( ) );
            ts += "-";
            ts +=( ( d.getDay( ) < 10 ) ? ( "0" + d.getDay( ) ): d.getDay( ) );
            ts += "T";
            ts +=( ( d.getHours( ) < 10 ) ? ( "0" + d.getHours( ) ): d.getHours( ) );
            ts += ":";
            ts +=( ( d.getMinutes( ) < 10 ) ? ( "0" + d.getMinutes( ) ): d.getMinutes( ) );
            ts += ":";
            ts +=( ( d.getSeconds( ) < 10 ) ? ( "0" + d.getSeconds( ) ): d.getSeconds( ) );
            ts += ".";
            ts +=( ( d.getMilliseconds( ) < 10 ) ? ( "00" + d.getMilliseconds( ) ): ( ( d.getMilliseconds( ) < 100 ) ? ( "0" + d.getMilliseconds( ) ): ( d.getMilliseconds( ) ) ) );
        
            return ts;
        }


        function toString( a_Message, a_Type ) {
            
            // Create a time stamp
            var s = getTimeStamp( ) + SPACER;
    
            // Add the category to the message
            s += CATEGORY[ a_Type ] + SPACER;
            
            // Add the message
            s += a_Message;
            
            return s;

        }

        
        function toLitteral( a_Message, a_Type ) {
            
            var l = {
                
                "TimeStamp" : getTimeStamp( ),
                "Category" : CATEGORY[ a_Type ],
                "Message" : a_Message
            };
            
            return l;
        }
        
        
        return {
            toString : toString,
            toLitteral : toLitteral
        };
        
    }
    logItem = logitem();

    
    // LogStore class 
    function logstore( ) {
        
        // Default maximum size of the store
        var STORE_MAX_SIZE = 2000,
        // Maximum size to use. Can be reset at store creation
            maxSize = STORE_MAX_SIZE,
        // Declare the store as a simple array
            store = [],
        // Declare the index to use to create new element
            index = 0;
        
        // Return the current size of the store
        function size( ) {
            
            return store.length;
        
        }
        
        
        // Add a new item into the store
        function add( a_Item ) {
            
            // Add a new element to the store
            store[ index ] = a_Item;
            
            // Compute the next index to use to create the next store element
            // The index is reset to zero if the size exceeds the current max size
            index = ( index + 1 ) % maxSize;
        
        }
        
        function toArray( ) {
        
            return store;    
        }
        
        function toJSON( ) {
            
            var j = null;
            
            if( JSON ) {
                
                j = JSON.stringify( store );
            }
            
            return j;
        }
        

        // Add a new item into the store at a specific position
        /*function setAt( a_Index, a_Item ) {
            
            // Add a new element to the store
            store[ a_Index ] = a_Item;
        }*/

        
        // Get the item from a specific position
        function getAt( a_Index ) {
            
            if( a_Index > store.length ) {
                
                return null;
            }
            
            // Add a new element to the store
            return store[ a_Index ];
            
        }

        return {
            
            add : add,
            getRecords : toArray,
            getStore : toJSON,
            /*setAt : setAt,*/
            getAt : getAt,
            size : size
        };
        
    }
    logStore = logstore();
    
    
    function logsave( ) {
    
        var LABEL_STORAGE_DISK = "gemalto.ebanking.log";
                
        function toConsoleDebug( a_Message ) {
            
            try {
            
                if ( window.console.debug ) {
                    
                    window.console.debug( a_Message );
                
                } else {
                    
                    window.console.log( a_Message );
                }
                
            } catch( e ) {
                
            }
        }
        
        function toConsoleInfo( a_Message ) {
            
            try {
            
                if ( window.console.info ) {
                    
                    window.console.info( a_Message );
                
                } else {
                    
                    window.console.log( a_Message );
                }
                
            } catch( e ) {
                
            }
        }
        function toConsoleWarning( a_Message ) {
            
            try {
            
                if ( window.console.warn ) {
                    
                    window.console.warn( a_Message );
                
                } else {
                    
                    window.console.log( a_Message );
                }
                
            } catch( e ) {
                
            }
        }
        function toConsoleError( a_Message ) {
            
            try {
            
                if ( window.console.error ) {
                    
                    window.console.error( a_Message );
                
                } else {
                    
                    window.console.log( a_Message );
                }
                
            } catch( e ) {
                
            }
        }
        
        function toDisk( a_Message ) {
            
            if( window.localStorage ) {
            
                window.localStorage.setItem( LABEL_STORAGE_DISK, a_Message );
            }
        }
        
        
        function fromDisk( ) {
        
            if( window.localStorage ) {

                var o = window.localStorage.getItem( LABEL_STORAGE_DISK );
                
                window.console.log( "logSave - fromDisk = " + o );
                
                return o;
            }
            
            return null;
        }
        
        
        // Export the public interface of the object
        return {
            toConsoleDebug : toConsoleDebug,
            toConsoleInfo : toConsoleInfo,
            toConsoleWarning : toConsoleWarning,
            toConsoleError : toConsoleError,
            toDisk : toDisk,
            fromDisk : fromDisk
        };
        
    }
    logSave = logsave();
    

    function isNotLoggable( a_Type ) {
    
        if( a_Type > sLevel ) {
            return true;
        }
        return false;
    }
    

    function log( a_Message, a_Type ) {
        
        if (isNotLoggable(a_Type)) {
           return;
        }
        
        var s = logItem.toLitteral( a_Message, a_Type );
        
        logStore.add( s );
        
        //var st = logStore.getStore( );
        //console.log( "log - getStore <" + st + ">" );
        
        //logSave.toDisk( st );
        
        // Display the store
        //logSave.toConsole( st );
        
        // Display the string
        s = logItem.toString( a_Message, a_Type );

        switch( a_Type ) {
            
            case ERROR:
                logSave.toConsoleError( s );
                break;

            case WARNING:
                logSave.toConsoleWarning( s );
                break;

            case INFO:
                logSave.toConsoleInfo( s );
                break;

            case DEBUG:
                logSave.toConsoleDebug( s );
                break;

            default:
                logSave.toConsoleDebug( s );
                break;
        }
    }

    
    function error( a_Message ){
    
        // Store the message
        log( a_Message, ERROR );

    }


    function warning( a_Message ){

        // Store the message
        log( a_Message,  WARNING );

    }
    

    function info( a_Message ){

        // Store the message
        log( a_Message, INFO );

    }


    function debug( a_Message ){

        // Store the message
        log( a_Message, DEBUG );

    }
    
    
    function getLog( ) {
        
        //var l = logSave.fromDisk( );
        var l = logStore.getStore( );
        //console.log( "LoggingService - getLog = " + l );
        
        return l;
    }
    
   
    function getRecords( ) {
        
        //var l = logSave.fromDisk( );
        var l = logStore.getRecords( );
        //console.log( "LoggingService - getLog = " + l );
        
        return l;
    }

    
    return {
        getVersion: function () {
            return VERSION;
        },
        setLevel: setLevel,
        error : error,
        warning : warning,
        info : info,
        debug : debug,
        getLog : getLog,
        getRecords : getRecords,
        ERROR : ERROR,
        WARNING : WARNING,
        INFO : INFO,
        DEBUG : DEBUG
    };
    
}());
LoggingService.DEBUG = 3;
/*
LoggingService.ERROR = 0;
LoggingService.WARNING = 1;
LoggingService.INFO = 2;
LoggingService.DEBUG = 3;
*/