/*
|--------------------------------------------------------------------------
| apolo.fullpage.js
|--------------------------------------------------------------------------
| Defines Fullpage module.
*/
;(function($){
	'use strict';

	if(!('Apolo' in $)) {
		throw new Error('apolo.core.js file must be included.');
	};

	if( !$.fn || !$.fn.fullpage ) {
		throw new Error('fullpage.js is required for the apolo.fullpage.js module.')
	}

	var _config = {
		sectionSelector: '.fp-section',
		navigation: true,
		navigationPosition: $.Apolo.RTL ? 'left' : 'right',
		scrollingSpeed: 1500,
		easingcss3: 'cubic-bezier(0.23, 1, 0.32, 1)',
		scrollOverflow: true
	};

	function _prepareCallbacks( config ) {
		var afterRender = config.afterRender || function(){},
			onLeave = config.onLeave || function(){};

		config.afterRender = function() {
			var $container = $(this);
			$(document).trigger('render.apolo.fullpage', {
				$container: $container
			});
			afterRender.apply(this, Array.prototype.slice.call(arguments));
		};

		config.onLeave = function(index, nextIndex, direction) {
			var _self = this;
			$(document).trigger('leave.apolo.fullpage', {
				index: index,
				nextIndex: nextIndex,
				direction: direction,
				$element: $(_self)
			});
			onLeave.apply(this, Array.prototype.slice.call(arguments));
		};

		return config;
	};

	$.Apolo.modules.fullpage = function( collection, config ) {
		if( !collection || !collection.length ) return;

		var fullPageTimeOutId;

		config = $.isPlainObject(config) ?
				 $.extend(true, {}, _config, config, collection.data()) :
				 $.extend(true, {}, _config, collection.data());

		if( $(window).width() > 767 ) {
			collection.fullpage( _prepareCallbacks( config ) );
			$.fn.fullpage.apoIsInit = true;
		}

		$(window).on('resize.fullPage', function(e) {
			if( fullPageTimeOutId ) clearTimeout( fullPageTimeOutId );

			
			fullPageTimeOutId = setTimeout( function(){
				if( collection.data('destroy-on-mobile') ) {
					if( $(window).width() < 768 && $.fn.fullpage.apoIsInit ) {
						$.fn.fullpage.destroy('all');
						$.fn.fullpage.apoIsInit = false;
					}
					else if ( $(window).width() > 767 && $.fn.fullpage.apoIsInit ) {
						$.fn.fullpage.reBuild();
					}
					else if( $(window).width() > 767 ) {
						$.fn.fullpage.apoIsInit = true;
						collection.fullpage( _prepareCallbacks( config ) );
					}
				}
				else {
					$.fn.fullpage.reBuild();
					$.fn.fullpage.setResponsive( $(window).width() < 768 );
				}
			}, 200 );
			
		} ).trigger('resize.fullPage');
	};

})(jQuery);