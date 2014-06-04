

// ----------------------------------------------------------------------------------------------------
//  Require.js config (see: http://requirejs.org/)
// ----------------------------------------------------------------------------------------------------
	requirejs.config(
		{
			baseUrl: '/',
			waitSeconds: 5,
			urlArgs: 'bust=' +  ( new Date() ).getTime(),
			paths: {
				'signals': 'libs/signals-1.0.0'
			}
		}
	);

	require(['modules/battlefield', 'modules/grid', 'utilities/viewport'], function( Battlefield, Grid, Viewport ){

		var grid = new Grid();
			grid.canvas = document.getElementById("grid");
			grid.run( Viewport.getSize() );

		var battlefield = new Battlefield();
			battlefield.canvas = document.getElementById("battlefield");
			//battlefield.image( "http://www.hdwallpaperspics.com/wp-content/uploads/2012/11/leopard-print-colorful-pattern-twitter-109835.jpg" );
			battlefield.run( Viewport.getSize() );


	});

	require(['utilities/notification-center', 'utilities/viewport'], function( NotificationCenter, Viewport ){

		window.onresize = function(){

			NotificationCenter.defaultCenter().dispatch( 'window.resizing', Viewport.getSize() );
			
			if ( window.resizeTimer ) 
			{
				clearTimeout(this.resizeTimer);
			}

			window.resizeTimer = setTimeout(function(){
				NotificationCenter.defaultCenter().dispatch( 'window.resized', Viewport.getSize() );
			}, 500);
		};
	});
