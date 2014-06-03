
$(function() {

	// ----------------------------------------------------------------------------------------------------
	//  Widgets
	// ----------------------------------------------------------------------------------------------------

	$(document).calculator();
	$(document).slider();

	$(document).primer({'element': $('.primer'), 'onInit': function( plugin ){
		$(document).trigger( "analytics.pageview", {'dimension1': plugin.isVideoSupported() ? 'video' : 'afbeelding' } );
	}});


	$('.button.secondary, .primer a, footer a').one('click', function(e){
		e.preventDefault();
		
		$(document).trigger( "analytics.event", { 'action': 'knop', 'label': $(this).text(), 'callback': function(){	
			window.location.href = $(this).attr('href');
		}.bind(this)} );

	});

	// ----------------------------------------------------------------------------------------------------
	//  Form configuration
	// ----------------------------------------------------------------------------------------------------

	var opts = {
		lines: 13, // The number of lines to draw
		length: 0, // The length of each line
		width: 9, // The line thickness
		radius: 24, // The radius of the inner circle
		corners: 1, // Corner roundness (0..1)
		rotate: 0, // The rotation offset
		direction: 1, // 1: clockwise, -1: counterclockwise
		color: '#fff', // #rgb or #rrggbb or array of colors
		speed: 2.2, // Rounds per second
		trail: 42, // Afterglow percentage
		shadow: false, // Whether to render a shadow
		hwaccel: false, // Whether to use hardware acceleration
		className: 'spinner', // The CSS class to assign to the spinner
		zIndex: 2e9, // The z-index (defaults to 2000000000)
		top: '50%', // Top position relative to parent
		left: '50%' // Left position relative to parent
	};

	var spinner = new Spinner(opts);



	$('footer form').websform({
		onBeforeValidation: function(instance, form) {

			// Show progress spinner
			spinner.spin( form.parents('footer').get(0) );

			form.parents('.container').addClass('loading');
			form.find('button[type="submit"]').removeClass('animated shake');
			form.find('.validation-error').removeClass('.validation-error');
		},
		onValidationError: function(instance, form, field, message) {
			form.find('[name="' + field + '"]').addClass('validation-error');
			form.find('[name="' + field + '"]').parent('.radio-group').addClass('validation-error');
		},
		onAfterValidation: function(instance, form) {


			if ( instance.hasErrors() ) {
				form.find('button[type="submit"]').addClass('animated shake');

				form.find('.validation-error').one('click', function(){
					$(this).removeClass('validation-error');
				});
				form.find('.validation-error').one('focus', function(){
					$(this).removeClass('validation-error');
				});

				$(document).trigger( "analytics.event", { 'action': 'formulier', 'label': 'Validatie fout' });

			} else {

				var footer = form.parents('footer');

				var thankyou = footer.find('.thankyou-container');
				var container = footer.find('.form-container');

				thankyou.height( container.height() );

				thankyou.removeClass('hide');
				container.addClass('hide');

				$(document).trigger( "analytics.pageview", {
					'page': '/bedankt',
					'title': thankyou.find('h1').text()
				});

				$(document).trigger( "facebook.track", {
					'id'	  : thankyou.attr('data-facebook-id'),
					'value'	  : thankyou.attr('data-facebook-value'),
					'currency': thankyou.attr('data-facebook-currency')
				});

			}

			// Hide progress spinner
			spinner.stop();

			form.parents('.container').removeClass('loading');


		},
	});


	// ----------------------------------------------------------------------------------------------------
	//  Unveil.js
	// ----------------------------------------------------------------------------------------------------

	$("img[data-src]").unveil(200, function(){
		$(this).on('load', function() {
			//$(this).css('opacity', '1');
			$(this).addClass('is-loaded');
		});
	});


	// ----------------------------------------------------------------------------------------------------
	//  Foundation
	// ----------------------------------------------------------------------------------------------------

	$(document).foundation();
	$(":input[placeholder]").placeholder();



	// ----------------------------------------------------------------------------------------------------
	//  Analytics
	// ----------------------------------------------------------------------------------------------------


	$(document).bind( "analytics.pageview", function( event, data ) {
		if(typeof ga == 'function') {
			ga('send', 'pageview', data);
		}
	});

	$(document).bind( "analytics.event", function( event, data ) {
		if(typeof ga == 'function') {
			ga('send', 'event', data.action, data.label, 1, { 'hitCallback': data.callback ? data.callback : function(){  } } );
		}
	});

	$(document).bind( "facebook.track", function( event, data ) {
		$('body').append('<img height="1" width="1" alt="" style="display:none" src="https://www.facebook.com/offsite_event.php?id='+data.id+'&amp;value='+data.value+'&amp;currency='+data.currency+'" />');  
	});


});