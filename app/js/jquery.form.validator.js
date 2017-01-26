( function(){

    $( function(){

        $.each( $( '.authorization' ), function() {
            new FormValidation ( $( this ) );
        } );

        $.each( $( '.profile' ), function() {
            new FormValidation ( $( this ) );
        } );

    });

    var FormValidation = function (obj) {
        var _obj = obj,
            _action = _obj.find( 'form' ).attr( 'action' ),
            _inputs = _obj.find($("[required]")),
            _select = _obj.find( $("select[required]") );

        var _addEvents = function () {

                _obj.on({
                    'submit': function(){

                        $.each( _inputs, function(){

                            var curItem = $(this),
                                curAttr = curItem.attr("type");

                            if ( curAttr == "checkbox" ){
                                var curCheck = this.checked;
                                if ( !curCheck ){
                                    curItem.addClass("site__required-error");
                                    _obj.addClass('error');
                                }

                            }
                            else if ( curItem.is("select") ){

                                console.log('ddd')

                                if ( curItem.val() == "0" ){
                                    console.log('ddd1')
                                    _obj.addClass('error');
                                }

                            }
                            else if ( curItem.val() == '' ) {

                                curItem.addClass("site__required-error");
                                _obj.addClass('error');

                            }
                            else if ( curAttr == "email" ){
                                var pattern = /^([a-z0-9_\.-])+@[a-z0-9-]+\.([a-z]{2,4}\.)?[a-z]{2,4}$/i;
                                if ( pattern.test(curItem.val()) == false ){
                                    curItem.addClass("site__required-error");
                                    _obj.addClass('error');
                                }
                            }

                        } );

                        if( _obj.hasClass('error') ){

                            return false;

                        }
                    }
                });
                _inputs.on({

                    'focus': function(){

                        var curItem = $(this),
                            closest = curItem.closest("fieldset"),
                            innerInputs = closest.find("input");

                        if(_obj.hasClass('error')){
                            curItem.removeClass("site__required-error");

                            if ( innerInputs.length > 1 ){
                                if ( !closest.find(".site__required-error").length ){
                                    closest.removeClass('error');
                                }
                            } else {
                                _obj.removeClass('error');
                            }
                        }

                    }

                });

                _select.on({
                    change: function(){
                        var curItem = $(this),
                            curParent = curItem.parent( '.websters-select' );

                        curParent.removeClass('error');
                    }
                });
            },
            _init = function () {
                _addEvents();
            };

        _init();
    };

} )();