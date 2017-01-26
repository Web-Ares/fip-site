$( function(){

    "use strict";

    $( function(){

        $.each( $( '.menu' ), function() {
            new Menu ( $( this ) );
        } );

        $.each( $( '#map' ), function() {
            new Map ( $( this ) );
        } );

        $.each( $( '.filter' ), function() {
            new SubFilter ( $( this ) );
        } );

        $.each( $('.search-document'), function(){
            new Autocomplete ( $(this) )
        } );

        $.each( $( '.persons' ), function() {
            new Slider ( $( this ) );
        } );

        $.each( $( '.awards' ), function() {
            new Slider ( $( this ) );
        } );

    } );

    var Autocomplete  = function (obj) {
        this.obj = obj;
        this.searchWrap = this.obj.find( '.search-document__text' );
        this.input = obj.find('input[type=search]');
        this.visible = 5;

        this.init();
    };
    Autocomplete.prototype = {
        init: function () {
            var self = this;

            self.core = self.core();
            self.core.build();
        },
        core: function () {
            var self = this;

            return {
                addEvents: function () {
                    $(window).on({
                        scroll: function(){
                            var resultDiv = $('.search-panel__result');

                            resultDiv.remove();
                            $('.nicescroll-rails').getNiceScroll().remove();
                            self.suggestSelected = 0;
                        },
                        resize: function(){
                            var resultDiv = $('.search-panel__result');

                            resultDiv.remove();
                            $('.nicescroll-rails').getNiceScroll().remove();
                            self.suggestSelected = 0;
                        }
                    });
                    self.searchWrap.on({
                        'click': function(){
                            self.input.focus();
                        }
                    });
                    self.input.on({
                        'focusout': function(){
                            var resultDiv = $('.search-panel__result');

                            setTimeout(function(){
                                resultDiv.remove();
                                self.suggestSelected = 0;
                                $('.nicescroll-rails').getNiceScroll().remove();
                            },300);

                        },
                        'keyup': function(e){
                            var itemCategory = $('.search-panel__result-item'),
                                resultDiv = $('.search-panel__result'),
                                niceScroll = $('.nicescroll-rails');

                            switch(e.keyCode) {
                                case 13:
                                    if(!(self.input.val()=='')){
                                        self.core.addLabel(itemCategory.filter('.active'));
                                        resultDiv.remove();
                                        niceScroll.getNiceScroll().remove();
                                        self.suggestSelected = 0;
                                    }
                                    break;
                                case 8:
                                case 46:
                                    if(self.input.val()==''){
                                        self.core.addLabel(itemCategory.filter('.active'));
                                        resultDiv.remove();
                                        niceScroll.getNiceScroll().remove();
                                        self.suggestSelected = 0;
                                        return false;
                                    }
                                    break;
                                case 32:
                                case 27:
                                    resultDiv.remove();
                                    niceScroll.getNiceScroll().remove();
                                    self.suggestSelected = 0;
                                    return false;
                                    break;
                                case 38:
                                case 40:
                                    e.preventDefault();
                                    if(self.countItems>0){
                                        self.core.keyActivate(e.keyCode);
                                        if(self.suggestSelected == self.countItems){
                                            self.suggestSelected = 0
                                        }
                                    }
                                    self.core.scrollResult();
                                    return false;
                                    break;
                            }

                            self.valueInput = $(this).val();
                            self.core.ajaxRequest($(this));

                        },
                        'keydown': function(e){
                            var curText = self.input.val();

                            if (e.which === 13){

                                self.core.addLabel(curText);

                                $('.search-panel__result').remove();
                                $('.nicescroll-rails').getNiceScroll().remove();

                                self.suggestSelected = 0;
                                return false;
                            }
                        }
                    });


                    $(document).on(
                        "click",
                        ".search-panel__result-item",
                        function(){

                            var curItem = $(this),
                                curText = curItem.text();

                            self.input.val(curText);

                            $('.search-panel__result').remove();

                            $('.nicescroll-rails').getNiceScroll().remove();

                            self.suggestSelected = 0;

                            return false;
                        }
                    );
                },
                scrollResult:function(){

                    var resultDivWrap = $('.search-panel__result-wrap'),
                        itemCategory = $('.search-panel__result-item');

                    resultDivWrap.getNiceScroll(0).doScrollTop(itemCategory.filter('.active').index()*itemCategory.eq(0).innerHeight());

                },
                declareVariables: function(){
                    self.request = new XMLHttpRequest();
                    self.suggestSelected = 0;
                },
                ajaxRequest: function(input){
                    var path = self.obj.data('autocomplete');
                    self.request.abort();
                    self.request = $.ajax({
                        url: path,
                        data: {
                            value: self.input.val(),
                            loadedCount: self.input.val().length
                        },
                        dataType: 'json',
                        timeout: 20000,
                        type: "GET",
                        success: function (msg) {
                            var $new_arr = [];

                            for (var key in msg) {

                                var val = msg[key];

                                for (var key1 in val) {

                                    var val1 = val[key1];

                                    if(key1=='caption'){
                                        var $pos = val1.toLowerCase().split(input[0].value.toLowerCase());
                                        $new_arr.push(val) ;
                                    }
                                }
                            }

                            if( $new_arr.length ){

                                var resultStr='<div class="search-panel__result">',
                                    resultStrDiv='<div class="search-panel__result-wrap">';

                                for( var i=0; i<=$new_arr.length-1; i++ ){

                                    resultStrDiv += '<div  class="search-panel__result-item">'+$new_arr[i].caption+'</div>';

                                }

                                resultStr+='</div>';
                                resultStrDiv+='</div>';
                                $(resultStr).append($(resultStrDiv));

                                if(!self.obj.find('.search-panel__result').length == 1){

                                    self.obj.append(resultStr);
                                    self.obj.find('.search-panel__result').append(resultStrDiv);

                                }else{
                                    self.obj.find('.search-panel__result').html('');
                                    self.obj.find('.search-panel__result').append(resultStrDiv);
                                }

                                var resultDiv = $('.search-panel__result'),
                                    resultDivWrap = $('.search-panel__result-wrap'),
                                    searchBlock = $('.search-panel > fieldset'),
                                    categoryItems = $('.search-panel__result-item'),
                                    maxHeight = resultDivWrap.outerHeight();

                                self.countItems = categoryItems.length;

                                if( maxHeight > resultDivWrap.find(categoryItems).eq( 0 ).outerHeight() * self.visible ){

                                    resultDivWrap.height(resultDivWrap.find(categoryItems).eq( 0 ).outerHeight() * self.visible);

                                    resultDivWrap.niceScroll({

                                        cursorcolor:"#ebebeb",
                                        cursoropacitymin: "1",
                                        cursorborderradius: "5px",
                                        cursorborder: "none",
                                        cursorwidth: "5px"

                                    });
                                }
                            }
                        },
                        error: function (XMLHttpRequest) {
                            if (XMLHttpRequest.statusText != "abort") {
                                alert("Error");
                            }
                        }
                    });

                    return false;
                },
                addLabel: function(elem){

                    var text = elem.text();

                    self.input.val( text )

                },
                keyActivate: function(n){

                    var itemCategory = $('.search-panel__result-item');

                    itemCategory.eq(self.suggestSelected-1).removeClass('active');

                    if(n == 40 && self.suggestSelected < self.countItems){

                        self.suggestSelected++;


                    }else if(n == 38 && self.suggestSelected > 0){

                        self.suggestSelected--;

                    }
                    if( self.suggestSelected > 0){

                        itemCategory.eq(self.suggestSelected-1).addClass('active');
                        self.input.val( itemCategory.eq(self.suggestSelected-1).text() );

                    } else {

                        self.input.val(self.valueInput);

                    }
                },
                build: function () {
                    self.core.declareVariables();
                    self.core.addEvents();
                }
            };
        }
    };

    var Map = function (obj) {

        //private properties
        var _obj = obj,
            _institute = $('.map-content__legend'),
            _instituteFrame = _institute.find('.map-content__legend-layout'),
            _mapData = _obj.data('map'),
            _regionslink = _obj.data('regions'),
            _request = new XMLHttpRequest(),
            _placemarks = [],
            _activeRegion,
            _myMap, _myPlacemark;

        //private methods
        var _loadRegion = function ( item ) {

                var curRegion = item;

                _request = $.ajax({
                    url: _regionslink,
                    data: {
                        id: curRegion
                    },
                    dataType: 'json',
                    timeout: 20000,
                    type: "GET",
                    success: function ( msg ) {

                        _initPlaces( msg )
                        _initLegend( msg )

                    },
                    error: function ( XMLHttpRequest ) {
                        if( XMLHttpRequest.statusText != 'abort' ) {
                            alert( 'Error!' );
                        }
                    }
                });

            },
            _onEvent = function(){

                _initMap();
                _initRegions();

            },
            _initMap = function(){

                _myMap = new ymaps.Map('map', {
                    center: _mapData.center,
                    zoom: _mapData.zoom
                }, {
                    searchControlProvider: 'yandex#search'
                });

            },
            _initLegend= function( msg ){

                _instituteFrame.addClass('hidden');
                _instituteFrame.empty();

                var id = msg;

                if ( id.points[0].name == null ) {

                    _institute.css( 'height', 0 );
                    return false;

                } else {

                    for ( var i=0; i < id.points.length; i++ ){

                        _instituteFrame.append('<div class="map-content__institute"><h3 class="map-content__institute-name"> '+ id.points[i].name +' </h3>'+
                            '<div class="map-content__institute-content"><div class="map-content__institute-info"><span class="map-content__legend-item">' +
                            '<span class="map-content__icon map-content__icon_reports map-content__icon_'+ id.points[i].reportsStatus +'"></span>' +
                            '<span class="map-content__legend-topic">Отчетные материалы</span></span><p> '+ id.points[i].reports +' </p></div>' +
                            '<div class="map-content__institute-info"><span class="map-content__legend-item"><span class="map-content__icon map-content__icon_site map-content__icon_'+ id.points[i].siteStatus +'"></span>' +
                            '<span class="map-content__legend-topic">Активность  в инициации и проведении событий  на сайте</span></span><p> '+ id.points[i].site +' </p></div>' +
                            '<div class="map-content__institute-info"><span class="map-content__legend-item"><span class="map-content__icon map-content__icon_fip map-content__icon_'+ id.points[i].fipStatus +'"></span>' +
                            '<span class="map-content__legend-topic">Активность представления результатов деятельности ФИП</span></span><p>'+ id.points[i].fip +'</p></div></div></div>');
                    }

                }

                var frameHeight = _instituteFrame.outerHeight();

                _institute.css( 'height', frameHeight );
                _instituteFrame.removeClass('hidden');

            },
            _initPlaces = function( msg ){

                for ( var i=0; i < _placemarks.length; i++ ){

                    _myMap.geoObjects.remove( _placemarks[i] );

                }

                _placemarks = []

                var regionPoints = msg;

                for ( var i=0; i < regionPoints.points.length; i++ ){

                    _myPlacemark = new ymaps.Placemark( regionPoints.points[i].place, {
                        balloonContent: regionPoints.points[i].balloon
                    }, {
                        iconLayout: 'default#image',
                        iconImageHref: "img/place.png",
                        iconImageSize: [30, 39]
                    });

                    _placemarks.push( _myPlacemark )

                    _myMap.geoObjects.add(_myPlacemark);

                }

            },
            _initRegions = function(){

                ymaps.regions.load('RU', {
                    lang: 'ru',
                    quality: 1
                }).then(function (result) {
                    var regions = result.geoObjects;

                    regions.options.set({
                        'strokeColor': '#639bd1',
                        'fillColor': 'rgba(255,255,255,0)'
                    });

                    result.geoObjects.events.add( 'click', function (e) {

                        if ( _activeRegion !=null ){
                            _activeRegion.options.set('fillColor', 'rgba( 255, 255, 255, 0 )')
                        }

                        var curRegion = e.get( 'target' );

                        _activeRegion = curRegion;

                        _loadRegion( curRegion.properties.get( 'osmId' ) )

                        console.log(curRegion.properties.get( 'osmId' ))

                        curRegion.options.set('fillColor', 'rgba( 35, 65, 94, .5 )')

                    });

                    _myMap.geoObjects.add(regions);
                }, function () {
                    alert('No response');
                });

            },
            _init = function() {
                ymaps.ready(_onEvent);
            };

        //public properties

        //public methods


        _init();
    };

    var Menu = function( obj ) {

        //private properties
        var _menu = obj,
            _menuPosition = _menu.offset().top,
            _window = $( window );

        //private methods
        var _initSlider = function() {

                _window.on( {
                    'scroll': function() {

                        if (_menuPosition >= _window.scrollTop() ) {
                            _menu.removeClass( 'menu_fix' );
                        } else {
                            _menu.addClass( 'menu_fix' );
                        }

                    }
                } )

            },
            _init = function() {
                _initSlider();
            };

        //public properties

        //public methods

        _init();
    };

    var SubFilter = function( obj ) {

        //private properties
        var _obj = obj,
            _btn = _obj.find( 'dt'),
            _subFilter = _obj.find( 'dl' );

        //private methods
        var _initEvent = function() {

                $.each( _subFilter, function() {
                    var curElem = $( this ),
                        curSub = curElem.find( 'dd' );

                    if ( curElem.hasClass('active') ){
                        curSub.slideDown(300);
                    }

                } );

                _btn.on( {
                    'click': function() {
                        var curElem = $( this ),
                            curParent = curElem.parent( 'dl' ),
                            curSub = curParent.children( 'dd' );

                        if ( curSub.length > 0 && !( curParent.hasClass( 'active' ) ) ) {

                            curParent.addClass( 'active' );
                            curSub.slideDown(300);

                        } else {

                            curParent.removeClass( 'active' );
                            curSub.slideUp(300);

                        }

                    }
                } )

            },
            _init = function() {
                _initEvent();
            };

        //public properties

        //public methods
        _init();
    };

    var Slider = function( obj ) {

        //private properties
        var _obj = obj,
            _personalSlider = _obj.find( '.persons__swipe' ),
            _awardsSlider = _obj.find( '.awards__swipe' ),
            _personal,
            _awards;

        //private methods
        var _initSlider = function() {

                _personal = new Swiper ( _personalSlider, {
                    effect: 'slide',
                    autoplay: false,
                    speed: 500,
                    loop: true,
                    slidesPerView: 4,
                    spaceBetween: 40,
                    nextButton: '.persons-button-next',
                    prevButton: '.persons-button-prev'
                } );

                _awards = new Swiper ( _awardsSlider, {
                    effect: 'slide',
                    autoplay: false,
                    speed: 500,
                    loop: true,
                    slidesPerView: 5,
                    spaceBetween: 20,
                    nextButton: '.awards-button-next',
                    prevButton: '.awards-button-prev'
                } );

            },
            _onEvent = function() {

            },
            _init = function() {
                _initSlider();
                _onEvent();
            };

        //public properties

        //public methods

        _init();
    };

} );