/*
|--------------------------------------------------------------------------
| apolo.sameheight.js
|--------------------------------------------------------------------------
| Defines sameheight module.
*/
;(function($){
	'use strict';

	if(!('Apolo' in $)) {
		throw new Error('apolo.core.js file must be included.');
	};

	/**
	 * Base configuration of the module.
	 * @private
	 */
	var _config = {
		targetSelector: '.apo-same-height',
		afterSettingHeight: function(items) {}
	},

	/**
	 * Contains all initialized items on the page.
	 * @private 
	 */
	_collection = $();


	/**
	 * Initializes new sameHeight instances.
	 * @param {jQuery} collection
	 * @param {Object} config
	 * @return {jQuery}
	 */
	$.Apolo.modules.sameHeight = function( collection, config ) {

		var $w, _s;

		collection = collection && collection.length ? collection : $();
		if( !collection.length ) return collection;

		$w = $(window);
		_s = this;

		config = config && $.isPlainObject( config ) ? config : {};

		$w.on('resize.SameHeight', function(e) {
			if( _s.resizeTimeoutId ) clearTimeout( _s.resizeTimeoutId );

			_s.resizeTimeoutId = setTimeout( function() {
				_collection.each( function(index, element) {
					var SameHeight = $(element).data( 'SameHeight' );
					if(SameHeight) SameHeight.setHeight();
				} );
			}, 500 );
		});

		return collection.each(function(){
			var $container = $(this),
				containerConfig = $.extend( true, {}, _config, config, $container.data() );
			if( $container.data( 'SameHeight' ) ) return;
			$container.data( 'SameHeight', new SameHeight( $container, containerConfig ) );
			_collection = _collection.add( $container );
		});
	};

	/**
	 * SameHeight.
	 * @param {jQuery} container
	 * @param {Object} config
	 * @constructor 
	 */
	function SameHeight(container, config) {

		/**
		 * Contains link to the current object.
		 * @private 
		 */
		var _self = this;

		/**
		 * Contains link to the current container.
		 * @type {jQuery}
		 * @public 
		 */
		this.container = container;

		/**
		 * Contains configuration object.
		 * @type {Object}
		 * @public 
		 */
		this.config = config;

		Object.defineProperties( this, {
			/**
			 * Contains collection of target items.
			 * @public 
			 * @return {jQuery}
			 */
			items: {
				get: function() {
					return _self.container.find( _self.config.targetSelector );
				}
			}
		} );

		this.setHeight();
	};

	/**
	 * Sets necessary height to each target item.
	 * 
	 * @public
	 * @return {SameHeight}
	 */
	SameHeight.prototype.setHeight = function() {
		var max = 0;

		this.reset();
		if( this.items.length ) {
			this.items.each(function(index, element){
				var $this = $(element),
					itemHeight = $this.outerHeight();
				if(itemHeight > max) max = itemHeight;
			}).css('height', max);
			this.config.afterSettingHeight.call(this.container, this.items);
			$(window).trigger('resized.apolo.sameheight');
		}

		return this;
	};

	/**
	 * Resets height for each target item.
	 * 
	 * @public
	 * @return {SameHeight}
	 */
	SameHeight.prototype.reset = function() {

		if( this.items.length ) {
			this.items.css('height', 'auto');
		}

		return this;
	};

})(jQuery);