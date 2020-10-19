/*
|--------------------------------------------------------------------------
| apolo.parallax-grid.js
|--------------------------------------------------------------------------
| Defines parallax-grid module.
*/
;(function($){
	'use strict';

	if(!('Apolo' in $)) {
		throw new Error('apolo.core.js file must be included.');
	};

	var _config = {
		columnsXs: 1,
		columnsSm: 2,
		columnsMd: 3,
		columnsLg: 3,
		breakpointsMap: {
			sm: 768,
			md: 992,
			lg: 1200
		},
		itemSelector: '.apo-parallax-grid-item',
		columnSelector: '.apo-parallax-grid-col',
		breakpointElement: $()
	},

	$w = $(window),
	$d = $(document),
	$footer = $('#footer');

	$.Apolo.modules.parallaxGrid = function( collection, config ) {
		if( !collection || !collection.length ) return;
		collection.each(function(index, element) {
			var $element = $(element);

			config = $.isPlainObject( config ) ? $.extend(true, {}, _config, config, $element.data()) :
					 $.extend(true, {}, _config, $element.data());

			if( !$element.data( 'ParallaxGrid' ) ) {
				$element.data( 'ParallaxGrid', new ParallaxGrid( $element, config ) );
			}
		});
	};

	function ParallaxGrid ( container, config ) {
		var _self = this;

		this.container = container;
		this.config = config;
		this.items = this.container.find( this.config.itemSelector );
		this.container.data('items', this.items);

		this.buildGrid();
		setTimeout( function() {
			_self.updateDocumentState();
			_self._bindEvents();
		}, 100 );
	};

	ParallaxGrid.prototype.buildGrid = function() {
		var existingColumns = this.container.find( this.config.columnSelector ),
			_self = this,
			counter = 0,
			columns;

		if( existingColumns.length ) existingColumns.remove();

		this.container.removeClass('apo-parallax-grid-cols-4')
					  .removeClass('apo-parallax-grid-cols-3')
					  .removeClass('apo-parallax-grid-cols-2')
					  .removeClass('apo-parallax-grid-cols-1');

		if( $w.width() >= this.config.breakpointsMap.lg ) {
			columns = this.config.columnsLg;
			this.container.addClass('apo-parallax-grid-cols-' + this.config.columnsLg);
		}
		else if( $w.width() >= this.config.breakpointsMap.md ) {
			columns = this.config.columnsMd;
			this.container.addClass('apo-parallax-grid-cols-' + this.config.columnsMd);
		}
		else if( $w.width() >= this.config.breakpointsMap.sm ) {
			columns = this.config.columnsSm;
			this.container.addClass('apo-parallax-grid-cols-' + this.config.columnsSm);
		}
		else {
			columns = this.config.columnsXs;
			this.container.addClass('apo-parallax-grid-cols-' + this.config.columnsXs);
		}

		this.newGridCollection = [];

		for(var i = 0; i < columns; i++) {
			_self.newGridCollection.push(
				$('<div></div>', {
					class: _self.config.columnSelector.slice(1)
				})
			);
		}

		this.items.each( function( index, element ) {
			_self.newGridCollection[counter].append( element );
			counter++;
			if(counter == columns) counter = 0;
		} );

		this.container.append( _self.newGridCollection );
		this.container.trigger('apolo.parallaxGridReady');
	};

	ParallaxGrid.prototype.updateDocumentState = function() {
		var _self = this;

		this.container.css('height', 'auto');

		this.columnsHeights = _self.newGridCollection.map( function(element){
			return element.outerHeight();
		} );

		this.minColumn = Math.min.apply(null, this.columnsHeights );
		this.maxColumn = Math.max.apply(null, this.columnsHeights );

		this.movableColumns = _self.newGridCollection.filter( function(element){
			return element.outerHeight() > _self.minColumn;
		} );

		this.containerBaseHeight = this.container.outerHeight();
	
		setTimeout(function(){
			$w.trigger('scroll.ApoParallaxGrid');
		}, 150);
	};

	ParallaxGrid.prototype._bindEvents = function() {
		var _self = this;

		$w.on('scroll.ApoParallaxGrid', function(e) {

			if(!_self.movableColumns.length ) return;

			if( _self.config.breakpointElement.offset().top <= $w.scrollTop() + $w.height() && !_self.breakpointed ) {
				_self.breakpointed = true;
				_self._moveColumns( ($w.scrollTop() + $w.height()) - _self.config.breakpointElement.offset().top );
				return;
			}
			else if( _self.config.breakpointElement.offset().top > $w.scrollTop() + $w.height() ) {
				if( _self.breakpointed ) {
					_self.breakpointed = false;
				}
				else {
					_self._moveColumns();
				}
			}
		});

		$w.on('resize.ApoParallaxGrid', function(e) {

			if(_self.resizeTimeOutId) clearTimeout( _self.resizeTimeOutId );

			_self.resizeTimeOutId = setTimeout( function(){
				_self.buildGrid();
				setTimeout(function(){
					_self.updateDocumentState();
					_self._moveColumns();
				}, 100);
			}, 100 );

		});
	};

	ParallaxGrid.prototype._moveColumns = function(difference) {
		
		difference = difference ? difference : 0;

		var _self = this,
			scrollPercentage = Math.round( ($w.scrollTop() - difference) / ( ($d.height() - _self.config.breakpointElement.outerHeight()) - $w.height() ) * 100 ),
			columnHeightDifferent = _self.maxColumn - _self.minColumn;

		_self.container.css('height', _self.containerBaseHeight - (columnHeightDifferent * ( scrollPercentage / 100 )));

		_self.movableColumns.forEach(function(element) {
			element.css('top', ( Math.abs( element.outerHeight() - _self.minColumn ) * ( scrollPercentage / 100 ) ) * -1 );
		});
	};

})(jQuery);