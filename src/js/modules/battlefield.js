define(['utilities/notification-center', 'utilities/context', 'utilities/collection', 'utilities/distort'], function ( NotificationCenter, Context, Collection, Distort ) {

    function Battlefield() {

        if (!(this instanceof Battlefield)) {
            throw new TypeError("Battlefield constructor cannot be called as a function.");
        }

        this._context = null;
        this._points = null;
        this._size = {};
        this._initialized = false;
        this._tilesize = 100;
        this._processing = false;

        this._image = null;
        this._distort = null;
        this.canvas = null;

        this._is_tweening = false;
				this._current_frame = 0;
				this._tweening_frames = 0;
				this._start_tweening_time = null;

				this._maximum_distort_distance = 300;
				this._tween_duration_in_seconds = 4;
    }

	// ----------------------------------------------------------------------------------------------------
	//  Constructor
	// ----------------------------------------------------------------------------------------------------

    Battlefield._instance = null;

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
			//NotificationCenter.defaultCenter().add('points.updated', this.updated, this);

			this.loaded();
		},

		refresh: function()
		{
			if ( this.canvas )
			{
				this._context = this.canvas.getContext("2d");
				this._points = this._getPoints();
				this._points = this._distortPoints();

				this.initStructure();

				this.canvas.setAttribute('width', this._size.width);
				this.canvas.setAttribute('height', this._size.height);

				document.addEventListener('mousemove', function(e){ this.cursorUpdated(e) }.bind(this));



				NotificationCenter.defaultCenter().dispatch('points.updated', this._points);

				this.redraw();
				this.updated();

			}
		},

		resized: function( size )
		{
			this._size = size;
			this.redraw();
		},

		loaded: function()
		{


			var img = new Image();
			img.onload = function() {

				console.log('loaded!');

				this._image = img;
				//this.refresh();
			}.bind(this);
			img.src = '/assets/images/lincoln.jpg';


		},

		// animate: function()
		// {
		// 	requestAnimationFrame( this.animate );

		// 	this.redraw();
		// },

		updated: function( points )
		{
			if ( this._image && this._points && this._processing == false )
			{
				this._processing = true;


				//this._context.putImageData( this._image, 0, 0 );
				//this._context.drawImage( this._image, 0, 0 );

				Distort.apply( this._image, this._points, {width: this.canvas.width, height: this.canvas.height}, this._tilesize, function( data ){

					// this._context.fillStyle = Context.randomColor();
					// this._context.fillRect(0, 0, this._size.width, this._size.height); 

					this._context.putImageData( data, 0, 0 );

					this._processing = false;

					//console.log(data);

				}.bind(this));

			}
		},

		redraw: function()
		{
			this.clear();
			this.draw();
			this.updated();

			requestAnimationFrame( this.redraw.bind(this) );
		},

		draw: function()
		{
			//console.log( this._image );





			
			



			// this._context.fillStyle = Context.randomColor();
			// this._context.fillRect(0, 0, this._size.width, this._size.height);



			// distort image
			// Distort


			// requestAnimationFrame( function(){
			// 	this.draw();
			// }.bind(this) );

			// console.log('draw');

				if ( this._is_tweening ) {
					this.structure();
				} else  if ( this.animate ) {
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

		},

		docreep: function()
		{
			this.closest_point = this.getClosestPoint( this._points, this.current_pos );


			var points_in_range = this.getPointsInRange( this._points, this.closest_point, 300 );
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

		initStructure: function()
		{

			this._tweening_frames = 100;

			this._start_tweening_time = new Date;
			
			this._is_tweening = true;

		},

		structure: function()
		{

				// Calculate the frame to load based on the time
				var current_time = new Date;
				var elapsed_time_in_milliseconds = current_time - this._start_tweening_time;
				var total_time_in_milliseconds = this._tween_duration_in_seconds * 1000;

				var elapsed_time_in_percentage = (100 * elapsed_time_in_milliseconds) / total_time_in_milliseconds;

				var current_frame = (this._tweening_frames * elapsed_time_in_percentage) / 100;

				if(current_frame <= this._tweening_frames) {
					
					// Calculate the points based on the current frame
					for ( var i = 0; i < this._points.length; i++ )
					{

						if(this._points[i]['ignore_at_structure'] === false) {

							// X
							var value = this.getEaseValue(current_frame, this._points[i]['x_distorted_start'], (this._points[i]['x_distorted_difference']*-1), this._tweening_frames);
							this._points[i]['x_end'] = value;

							// Y
							var value = this.getEaseValue(current_frame, this._points[i]['y_distorted_start'], (this._points[i]['y_distorted_difference']*-1), this._tweening_frames);
							this._points[i]['y_end'] = value;

						}

					}

	        NotificationCenter.defaultCenter().dispatch('points.updated', this._points);

      	} else {

      		// Set the points to the absolute correct final positions
      		for ( var i = 0; i < this._points.length; i++ )
					{

	      		this._points[i]['x_end'] = this._points[i]['x'];
	      		this._points[i]['y_end'] = this._points[i]['y'];

      		}

      		NotificationCenter.defaultCenter().dispatch('points.updated', this._points);
					this._is_tweening = false;

      	}
        
    },

		getEaseValue: function(t, b, c, d)
    {
			 // t = current frame, b = startvalue, c = change in value, d = total frames:
	     t /= d/2;
	     if (t < 1) return c/2*t*t + b;
	     t--;
	     return -c/2 * (t*(t-2) - 1) + b;

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

		// Distort points
		_distortPoints: function()
		{

			for ( var i = 0; i < this._points.length; i++ )
				{

					// Check if the points are not outher points
					if(
						(this._points[i]['x'] == 0) ||
						(this._points[i]['y'] == 0) || 
						(this._points[i]['x'] == this._size.widht) || 
						(this._points[i]['y'] == this._size.height)
					) {

						this._points[i]['ignore_at_structure'] = true;	

					} else {

						this._points[i]['ignore_at_structure'] = false;	

						// Set the coordinates to the distorted positions and store the distorted positions
						var randomNumber = Math.floor(Math.random() * 2) + 1;
						if(randomNumber == 2) {
							this._points[i]['x_end'] = this._points[i].x + Math.floor(Math.random() * this._maximum_distort_distance) + 1;
						} else {
							this._points[i]['x_end'] = this._points[i].x - Math.floor(Math.random() * this._maximum_distort_distance) + 1;
						}
						
						this._points[i]['x_end'] = this._points[i]['x_end'] < 0?0:this._points[i]['x_end'];
						this._points[i]['x_end'] = this._points[i]['x_end'] > this._size.width?this._size.width:this._points[i]['x_end'];
						

						var randomNumber = Math.floor(Math.random() * 2) + 1;
						if(randomNumber == 2) {
							this._points[i]['y_end'] = this._points[i].y + Math.floor(Math.random() * this._maximum_distort_distance) + 1;
						} else {
							this._points[i]['y_end'] = this._points[i].y - Math.floor(Math.random() * this._maximum_distort_distance) + 1;
						}

						this._points[i]['y_end'] = this._points[i]['y_end'] < 0?0:this._points[i]['y_end'];
						this._points[i]['y_end'] = this._points[i]['y_end'] > this._size.height?this._size.height:this._points[i]['y_end'];
						
					}

					this._points[i]['x_distorted_start'] = this._points[i]['x_end'];
					this._points[i]['x_distorted_difference'] = this._points[i]['x_distorted_start'] - this._points[i]['x'];

					this._points[i]['y_distorted_start'] = this._points[i]['y_end'];
					this._points[i]['y_distorted_difference'] = this._points[i]['y_distorted_start'] - this._points[i]['y'];

				}

				return this._points;
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