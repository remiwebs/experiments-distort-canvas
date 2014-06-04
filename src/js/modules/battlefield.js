define(['utilities/notification-center', 'utilities/context', 'utilities/collection'], function ( NotificationCenter, Context, Collection ) {

    function Battlefield() {

        if (!(this instanceof Battlefield)) {
            throw new TypeError("Battlefield constructor cannot be called as a function.");
        }

        this._context = null;
        this._points = null;
        this._size = {};
        this._initialized = false;
        this._tilesize = 100;

        this._image = null;
        this.canvas = null;
    }

	// ----------------------------------------------------------------------------------------------------
	//  Constructor
	// ----------------------------------------------------------------------------------------------------

    Battlefield._instance = null;

    Battlefield.instance = function () {

        if ( Battlefield._instance === null ) {
            Battlefield._instance = Battlefield.make();
        }
        return Battlefield._instance;
    };

	// ----------------------------------------------------------------------------------------------------
	//  Class
	// ----------------------------------------------------------------------------------------------------

	Battlefield.prototype = {
		constructor: Battlefield,

		run: function( size )
		{
			this._size = size;
			this.refresh();

			NotificationCenter.defaultCenter().add('window.resized', this.resized, this);
		},

		refresh: function()
		{
			if ( this.canvas )
			{
				this._context = this.canvas.getContext("2d");
				this._points = this._getPoints();


				this.canvas.setAttribute('width', this._size.width);
				this.canvas.setAttribute('height', this._size.height);

				document.addEventListener('mousemove', function(e){ this.cursorUpdated(e) }.bind(this));



				NotificationCenter.defaultCenter().dispatch('points.updated', this._points);

				this.redraw();
			}
		},

		resized: function( size )
		{
			this._size = size;
			this.redraw();
		},

		redraw: function()
		{
			this.clear();
			this.draw();
		},

		draw: function()
		{
			// this._context.fillStyle = Context.randomColor();
			// this._context.fillRect(0, 0, this._size.width, this._size.height);



			requestAnimationFrame( function(){
				this.draw();
			}.bind(this) );

			console.log('draw');

		    if ( this.animate ) {
		    	this.docreep();	
		    }
		},



		cursorUpdated: function(event)
		{
			if ( ! this.current_pos )
			{
				this.current_pos = {x:0, y:0};
			}

			this.last_pos = this.current_pos;

			if (
				typeof event.offsetX !== 'undefined' &&
				typeof event.offsetY !== 'undefined'
			)
			{
				this.current_pos.x = event.offsetX;
				this.current_pos.y = event.offsetY;
			}

			else
			{
				this.current_pos.x = event.layerX;
				this.current_pos.y = event.layerY;
			}

			this.animate = true;
			//this.docreep();
			//requestTick();
		},

		docreep: function()
		{
			this.closest_point = this.getClosestPoint( this._points, this.current_pos );


			var points_in_range = this.getPointsInRange( this._points, this.closest_point, 500 );
			//var points_in_range = getPoints();

			if ( points_in_range && points_in_range.length > 0 ) {
				
				this._context.clearRect( 0, 0, this.canvas.width, this.canvas.height );

				for ( var i = 0; i < points_in_range.length; i++ )
				{				
					this.creep( this._context, this.current_pos, points_in_range[i] );
				}
 

				// Update canvas
				//signals['points-updated'].dispatch( points );

				NotificationCenter.defaultCenter().dispatch('points.updated', this._points);

				//drawrect( ctx, points, true );
			}

			ticking = false;

		},

		creep: function( ctx, current_pos, closest_point )
		{


			var magnet = 400;

			var x0 = closest_point.x_end;
			var y0 = closest_point.y_end;
			var x1 = current_pos.x;
			var y1 = current_pos.y;

			var distancex = x1-x0;
			var distancey = y1-y0;

			var distance = Math.sqrt( (distancex * distancex) + (distancey * distancey) );

			//distance = Math.max( distance, 200 );
	

		    var powerx = closest_point.x_end - (distancex / distance) * magnet / distance;
		    var powery = closest_point.y_end - (distancey / distance) * magnet / distance;

		    if ( ! this.forcex && ! this.forcey ) {
				this.forcex = 1;
				this.forcey = 1;
		    }

		    this.forcex == 1 ? closest_point.x : this.forcex;
		    this.forcey == 1 ? closest_point.y : this.forcey;


		    this.forcex = (this.forcex + (closest_point.x - x0) / 2) / 1000.66;
		    this.forcey = (this.forcey + (closest_point.y - y0) / 2) / 1000.66;

		    // this.forcex = (this.forcex + (closest_point.x - x0) / 2) / 50.66;
		    // this.forcey = (this.forcey + (closest_point.y - y0) / 2) / 50.66;

		    

		    // console.log('forcex: ' + forcex);

			
		    closest_point.x_end = Math.max(powerx + this.forcex, 0);
		    closest_point.y_end = Math.max(powery + this.forcey, 0);



			ctx.beginPath();
			ctx.fillStyle = '#00ff00';
			ctx.lineWidth = 3;
			ctx.strokeStyle = '#cccccc';
			ctx.arc( closest_point.x_end, closest_point.y_end, 4, 0, Math.PI * 2, true );
			ctx.stroke();
			ctx.fill();
			ctx.closePath();

		},






















		clear: function()
		{
			Context.clear( this._context, this._size );
		},

		resized: function( size )
		{
			this._size = size;

			//this.redraw();
			this.refresh();
		},

		_getPoints: function()
		{
			console.log("get points");
			console.log( this._size );

			var result = [ ];
			var column = 0;
			var row = 0;
			var index = 0;
			var x = 0;
			var y = 0;
			var width = this._size.width;
			var height = this._size.height;

			for ( x = 0; x < width; x += this._tilesize )
			{
				row = 0;

				for ( y = 0; y < height; y += this._tilesize )
				{
					result[index] = { x: x, y: y, x_end:x, y_end: y, column: column, row: row, index: index };
					index++;
					row++;
				}

				column++;
			}

			return result;			
		},


		drawGrid: function( ctx, points, hittest )
		{
			var p1, p2, p3, p4;

			for ( var i = 0; i < points.length; i++ )
			{
				p1 = points[i];
				p2 = Collection.getItemByValue( points, 'row', p1.row + 1, 'column', p1.column );
				p3 = Collection.getItemByValue( points, 'row', p1.row,     'column', p1.column + 1 );
				p4 = Collection.getItemByValue( points, 'row', p1.row + 1, 'column', p1.column + 1 );

				if ( p1 && p2 && p3 && p4 )
				{
					ctx.beginPath();
					ctx.moveTo( p1.x_end, p1.y_end );
					ctx.lineTo( p3.x_end, p3.y_end );
					ctx.lineTo( p4.x_end, p4.y_end );
					ctx.lineTo( p2.x_end, p2.y_end );
					ctx.lineTo( p1.x_end, p1.y_end );

					ctx.lineWidth = 0.5;


					if ( typeof(hittest) == "function" ) {

						hittest();

					} else {

						ctx.strokeStyle = 'red';
						ctx.stroke();

					}

					

					ctx.closePath();
				}
			}
		},


		getClosestPoint: function( points, pos )
		{
			var i = 0;
			var len = points.length;
			var shortest_distance = Infinity;
			var distance = Infinity;
			var result;

			for ( i = 0; i < len; i++ )
			{
				distance = this.getDistance( { x: points[i].x_end, y: points[i].y_end }, pos );

				if ( distance < shortest_distance )
				{
					shortest_distance = distance;
					result = points[i];
				}
			}

			return result;
		},

		getPointsInRange: function( points, pos, max_distance )
		{
			var i = 0;
			var len = points.length;
			var distance = Infinity;
			var results = [];

			for ( i = 0; i < len; i++ )
			{

				distance = this.getDistance( { x: points[i].x_end, y: points[i].y_end }, pos );

				if ( distance <= max_distance && distance > 0 )
				{	
					points[i].distance = distance;
					results.push( points[i] );
				}
			}

			return results;
		},

		getDistance: function( p1, p2 )
		{
			var xs = 0;
			var ys = 0;

			xs = p2.x - p1.x;
			xs = xs * xs;

			ys = p2.y - p1.y;
			ys = ys * ys;

			return Math.sqrt( xs + ys );
		}



	}

	return Battlefield;
});