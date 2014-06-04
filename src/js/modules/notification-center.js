define(['signals'], function ( Signals ) {

    function NotificationCenter() {

        if (!(this instanceof NotificationCenter)) {
            throw new TypeError("NotificationCenter constructor cannot be called as a function.");
        }

        this._signals = {};
    }

	// ----------------------------------------------------------------------------------------------------
	//  Constructor
	// ----------------------------------------------------------------------------------------------------

    NotificationCenter._instance = null;

    NotificationCenter.defaultCenter = function () {

        if ( NotificationCenter._instance === null ) {
            NotificationCenter._instance = new NotificationCenter();
        }
        return NotificationCenter._instance;
    };

	// ----------------------------------------------------------------------------------------------------
	//  Class
	// ----------------------------------------------------------------------------------------------------

	NotificationCenter.prototype = {
		constructor: NotificationCenter,

		add: function( name, callback, context )
		{
			if ( ! this._signals[name] )
			{
				this._signals[name] = new Signals();
			}

			this._signals[name].add( callback, context );
		},


		dispatch: function( name, data )
		{
			if( this._signals[name] )
			{
				this._signals[name].dispatch( data );
			}
			
		}
	}

	return NotificationCenter;
});