define(['utilities/notification-center', 'utilities/context', 'utilities/collection'], function ( NotificationCenter, Context, Collection ) {

    function Grid() {

        if (!(this instanceof Grid)) {
            throw new TypeError("Grid constructor cannot be called as a function.");
        }

        this._context = null;
        this._points = null;
        this._size = {};
        this._initialized = false;
        this._tilesize = 50;

        this.canvas = null;
    }

	// ----------------------------------------------------------------------------------------------------
	//  Constructor
	// ----------------------------------------------------------------------------------------------------

    Grid._instance = null;

    Grid.instance = function () {

        if ( Grid._instance === null ) {
            Grid._instance = Grid.make();
        }
        return Grid._instance;
    };

	// ----------------------------------------------------------------------------------------------------
	//  Class
	// ----------------------------------------------------------------------------------------------------

	Grid.prototype = {
		constructor: Grid,

		run: function( size )
		{
			this._size = size;

			NotificationCenter.defaultCenter().add('points.updated', this.updated, this);
			NotificationCenter.defaultCenter().add('window.resized', this.resized, this);

			this.refresh();
		},

		updated: function( points )
		{
			this._points = points;

			this.refresh();
		},

		resized: function( size )
		{
			this._size = size;

			this.refresh();
		},

		refresh: function()
		{
			if ( this.canvas )
			{
				this._context = this.canvas.getContext("2d");	

				this.canvas.setAttribute('width', this._size.width);
				this.canvas.setAttribute('height', this._size.height);

				this.redraw();
			}
		},

		redraw: function()
		{
			this.clear();
			this.draw();
		},

		draw: function()
		{
			if ( this._points !== null && this._context !== null ) 
			{
				var p1, p2, p3, p4;

				for ( var i = 0; i < this._points.length; i++ )
				{
					p1 = this._points[i];
					p2 = Collection.getItemByValue( this._points, 'row', p1.row + 1, 'column', p1.column );
					p3 = Collection.getItemByValue( this._points, 'row', p1.row,     'column', p1.column + 1 );
					p4 = Collection.getItemByValue( this._points, 'row', p1.row + 1, 'column', p1.column + 1 );

					if ( p1 && p2 && p3 && p4 )
					{
						this._context.beginPath();
						this._context.moveTo( p1.x_end, p1.y_end );
						this._context.lineTo( p3.x_end, p3.y_end );
						this._context.lineTo( p4.x_end, p4.y_end );
						this._context.lineTo( p2.x_end, p2.y_end );
						this._context.lineTo( p1.x_end, p1.y_end );

						this._context.lineWidth = 0.5;

						this._context.strokeStyle = 'blue';
						this._context.stroke();

						

						this._context.closePath();
					}
				}
			}

		},

		clear: function()
		{
			Context.clear( this._context, this._size );
		}
	}

	return Grid;
});