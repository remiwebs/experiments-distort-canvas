
define(['utilities/collection'], function ( Collection ) {

    function Distort() {
        if (!(this instanceof Distort)) {
            throw new TypeError("Distort constructor cannot be called as a function.");
        }

        this._canvas    = document.createElement( 'canvas' );
        this._context   = this._canvas.getContext( '2d' );
        this._callback  = null;
        this._direction = { x: 0, y: 1 };

        this.image = null;
        this.points = null;
        this.tilesize = null;
        this.size = {};
    }

	// ----------------------------------------------------------------------------------------------------
	//  Constructor
	// ----------------------------------------------------------------------------------------------------

    Distort._instance = null;

    Distort.instance = function () {

        if ( Distort._instance === null ) {
            Distort._instance = new Distort();
        }
        return Distort._instance;
    };

    Distort.apply = function( image, points, size, tilesize, callback ) {
    	
    	// Reuse instance.
    	var distort = Distort.instance();
    		distort.image = image;
    		distort.points = points;
    		distort.size = size;
    		distort.tilesize = tilesize;

    		distort.apply( callback );
    }

	// ----------------------------------------------------------------------------------------------------
	//  Class
	// ----------------------------------------------------------------------------------------------------

	Distort.prototype = {
		constructor: Distort,

		apply: function( callback )
		{	
			this._callback = callback;
			this._context.clearRect( 0, 0, this._canvas.width, this._canvas.height );
			
			this._resize();
			this._process();
		},

		_resize: function()
		{
			this._canvas.width = this.image.width+100;
			this._canvas.height = this.image.height;
		},

		_process: function()
		{
			var length = this.points.length;

			for ( i = 0; i < length; i++ )
			{
				this._processPoint( 
					this._context, 
					this.image, 
					this.points, 
					this.points[i],
					this.tilesize 
				);
			}

			this._callback( this._context.getImageData( 0, 0, this._canvas.width, this._canvas.height ) );
		},

		_processPoint: function( context, image, points, p1, tilesize )
		{
			var p3 = Collection.getItemByValue( points, 'row', p1.row + 1, 'column', p1.column );
			var p2 = Collection.getItemByValue( points, 'row', p1.row,     'column', p1.column + 1 );
			var p4 = Collection.getItemByValue( points, 'row', p1.row + 1, 'column', p1.column + 1 );

			if ( p1 && p2 && p3 && p4 )
			{
				var xm = this._getLinearSolution( 0, 0, p1.x_end, tilesize, 0, p2.x_end, 0, tilesize, p3.x_end );
				var ym = this._getLinearSolution( 0, 0, p1.y_end, tilesize, 0, p2.y_end, 0, tilesize, p3.y_end );
				var xn = this._getLinearSolution( tilesize, tilesize, p4.x_end, tilesize, 0, p2.x_end, 0, tilesize, p3.x_end );
				var yn = this._getLinearSolution( tilesize, tilesize, p4.y_end, tilesize, 0, p2.y_end, 0, tilesize, p3.y_end );


				context.save();
				context.setTransform( xm[0], ym[0], xm[1], ym[1], xm[2], ym[2] );
				context.beginPath();
				context.moveTo( 0, 0 );
				context.lineTo( tilesize, 0 );
				context.lineTo( 0, tilesize );
				context.lineTo( 0, 0 );
				context.closePath();
				context.fill();
				context.clip();
				context.drawImage( image, p1.x, p1.y, tilesize, tilesize, 0, 0, tilesize, tilesize );
				context.restore();

				context.save();
				context.setTransform( xn[0], yn[0], xn[1], yn[1], xn[2], yn[2] );
				context.beginPath();
				context.moveTo( tilesize, tilesize );
				context.lineTo( tilesize, 0 );
				context.lineTo( 0, tilesize );
				context.lineTo( tilesize, tilesize );
				context.closePath();
				context.fill();
				context.clip();
				context.drawImage( image, p1.x, p1.y, tilesize, tilesize, 0, 0, tilesize, tilesize );
				context.restore();
			}
		},

		_getLinearSolution: function( r1, s1, t1, r2, s2, t2, r3, s3, t3 )
		{
			r1 = parseFloat( r1 );
			s1 = parseFloat( s1 );
			t1 = parseFloat( t1 );
			r2 = parseFloat( r2 );
			s2 = parseFloat( s2 );
			t2 = parseFloat( t2 );
			r3 = parseFloat( r3 );
			s3 = parseFloat( s3 );
			t3 = parseFloat( t3 );

			var a = (((t2 - t3) * (s1 - s2)) - ((t1 - t2) * (s2 - s3))) / (((r2 - r3) * (s1 - s2)) - ((r1 - r2) * (s2 - s3)));
			var b = (((t2 - t3) * (r1 - r2)) - ((t1 - t2) * (r2 - r3))) / (((s2 - s3) * (r1 - r2)) - ((s1 - s2) * (r2 - r3)));
			var c = t1 - ( r1 * a ) - ( s1 * b );

			return [ a, b, c ];
        }
	}

	return Distort;
});

