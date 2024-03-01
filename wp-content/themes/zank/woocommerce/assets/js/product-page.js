jQuery(document).ready(function($) {

    /*-- Strict mode enabled --*/
    'use strict';

    if ( $(".zank-product-stock-progressbar").length ) {
        var percent = $(".zank-product-stock-progressbar").data('stock-percent');
        $(".zank-product-stock-progressbar").css('width',percent);
    }

    // product tabs
    $(document.body).on('click', '.zank-product-tab-title-item', function(e) {
        e.preventDefault();
        var id = $(this).data('id');
        $('.zank-product-tabs-wrapper div[data-id="'+id+'"]').addClass('active');
        $('.zank-product-tabs-wrapper div:not([data-id="'+id+'"])').removeClass('active');
    });

    // product summary accordion tabs
    $('.cr-qna-link').on('click', function() {
        var name  = 'accordion';
        var offset  = 32;
        if ($('.zank-product-tabs-wrapper').length) {
            name  = 'tabs';
            offset = 0;
        }
        var target = $('.zank-product-'+name+'-wrapper').position();

        $('html,body').stop().animate({
            scrollTop: target.top + offset
        }, 1500);
        if ( $('[data-id="accordion-cr_qna"]').parent().hasClass('active') ) {
            return;
        } else {
            setTimeout(function(){
                $('[data-id="accordion-cr_qna"]').trigger('click');
            }, 700);
        }
        if ( $('[data-id="tab-cr_qna"]').hasClass('active') ) {
            return;
        } else {
            setTimeout(function(){
                $('[data-id="tab-cr_qna"]').trigger('click');
            }, 700);
        }
    });

    $(document.body).on('click','.zank-product-summary .woocommerce-review-link', function(e) {
        e.preventDefault();
        var target = $('.nt-woo-single #reviews').position();
        if ($('.zank-product-tabs-wrapper').length) {
            target = $('.nt-woo-single .zank-product-tabs-wrapper').position();
        }
        $('html,body').stop().animate({
            scrollTop: target.top
        }, 1500);

        if ( $('[data-id="tab-reviews"]').hasClass('active') ) {
            return;
        } else {
            setTimeout(function(){
                $('[data-id="tab-reviews"]').trigger('click');
            }, 700);
        }
    });

    // product summary accordion tabs
    $(document.body).on('click', '.zank-accordion-header', function(e) {
        e.preventDefault();
        var accordionItem   = $(this),
            accordionParent = accordionItem.parent(),
            accordionHeight = accordionItem.outerHeight(),
            headerHeight    = $('body').hasClass('admin-bar') ? 32 : 0,
            totalHeight     = accordionHeight + headerHeight;

        accordionParent.toggleClass('active');
        accordionItem.next('.zank-accordion-body').slideToggle();
        accordionParent.siblings().removeClass('active').find('.zank-accordion-body').slideUp();
    });

    // product selected-variations-terms
    if ( $('.zank-selected-variations-terms-wrapper').length > 0 ) {
        $('.variations_form').on('change', function() {
            var $this = $(this);
            var selectedterms = '';
            $this.find('.zank-variations-items select').each(function(){
                var title = $(this).parents('.zank-variations-items').find('.zank-small-title').text();
                var val = $(this).val();
                if (val) {
                    selectedterms += '<span class="selected-features"><span class="selected-title">'+title+': </span><span class="selected-value">'+val+'</span></span>';
                }
            });
            if (selectedterms){
                $('.zank-selected-variations-terms-wrapper').slideDown().find('.zank-selected-variations-terms').html(selectedterms);
            }
        });
        $('.zank-btn-reset.reset_variations').on('click', function() {
            $('.zank-selected-variations-terms-wrapper').slideUp();
        });
    }

    if ( zank_vars.product_ajax == 'yes' ) {
        // single page ajax add to cart
        $('body').on('submit', '.nt-woo-single form.cart', function(e) {

            if ( $(this).parents('.product').hasClass('product-type-external') || $(e.originalEvent.submitter).hasClass('zank-btn-buynow') ) {
                return;
            }

            e.preventDefault();

            var form = $(this),
                btn  = form.find('.zank-btn.single_add_to_cart_button'),
                val  = form.find('[name=add-to-cart]').val(),
                data = new FormData(form[0]);

            btn.addClass('loading');

            data.append('add-to-cart', val );

            // Ajax action.
            $.ajax({
                url         : zank_vars.wc_ajax_url.toString().replace( '%%endpoint%%', 'zank_ajax_add_to_cart' ),
                data        : data,
                type        : 'POST',
                processData : false,
                contentType : false,
                dataType    : 'json',
                success     : function( response ) {

                    btn.removeClass('loading');

                    var fragments = response.fragments;
                    var appended  = '<div class="woocommerce-notices-wrapper">'+fragments.notices+'</div>';

                    if ( fragments.notices.indexOf('woocommerce-error') > -1 ) {

                        btn.addClass('disabled');
                        $(appended).prependTo('.zank-shop-popup-notices');

                    } else {

                        if ( $('.zank-shop-popup-notices .woocommerce-notices-wrapper').length>0 ) {
                            $('.zank-shop-popup-notices .woocommerce-notices-wrapper').remove();
                            $(appended).prependTo('.zank-shop-popup-notices').delay(4000).fadeOut(300, function(){
                                $(this).remove();
                            });
                        } else {
                            $(appended).prependTo('.zank-shop-popup-notices').delay(4000).fadeOut(300, function(){
                                $(this).remove();
                            });
                        }
                    }

                    // update other areas
                    $('.minicart-panel').replaceWith(fragments.minicart);
                    $('.zank-cart-count').html(fragments.count);
                    $('.zank-cart-total').html(fragments.total);
                    $('.zank-cart-goal-text').html(fragments.shipping.message);
                    $('.zank-progress-bar').css('width',fragments.shipping.value+'%');

                    // Redirect to cart option
                    if ( zank_vars.cart_redirect === 'yes' ) {
                        window.location = zank_vars.cart_url;
                        return;
                    }
                },
                error: function() {
                    btn.removeClass('loading');
                    console.log('cart-error');
                    $( document.body ).trigger( 'wc_fragments_ajax_error' );
                }
            });
        });
    }

    /***** buynow start *****/

    $('body').on('click', '.nt-woo-single .zank-btn-buynow', function() {
        if ($(this).parents('form.cart').length) {
            return;
        }
        $(this).parents('form.cart').find('.zank-btn-buynow').trigger('click');
    });

    /***** buynow end *****/

    // Product Fake View

    var viewingItem = $('.zank-product-view'),
        data        = viewingItem.data('product-view'),
        countView   = viewingItem.find('.zank-view-count'),
        current     = 0,
        change_counter;

    singleProductFakeView();
    function singleProductFakeView() {

        if ( viewingItem.length ) {
            var min    = data.min,
                max    = data.max,
                delay  = data.delay,
                change = data.change,
                id     = data.id;

            if ( !viewingItem.hasClass( 'inited' ) ) {
                if ( typeof change !== 'undefined' && change ) {
                    clearInterval( change );
                }

                current = $.cookie( 'zank_cpv_' + id );

                if ( typeof current === 'undefined' || !current ) {
                    current = Math.floor(Math.random() * max) + min;
                }

                viewingItem.addClass('inited');

                $.cookie('zank_cpv_' + id, current, { expires: 1 / 24, path: '/'} );

                countView.html( current );

            }

            change_counter = setInterval( function() {
                current    = parseInt( countView.text() );

                if ( !current ) {
                    current = min;
                }

                var pm = Math.floor( Math.random() * 2 );
                var others = Math.floor( Math.random() * change + 1 );
                current = ( pm < 1 && current > others ) ? current - others : current + others;
                $.cookie('zank_cpv_' + id, current, { expires: 1 / 24, path: '/'} );

                countView.html( current );

            }, delay);
        }
    }

    zankProductGalleryInit();

    function zankProductGalleryInit() {
        if ( $('.zank-product-gallery-main-slider').length ) {
            var thumbsDirection = 'horizontal';
            if ( $('.zank-swiper-slider-wrapper').hasClass('thumbs-right') || $('.zank-swiper-slider-wrapper').hasClass('thumbs-left') ) {
                var thumbsDirection = 'vertical';
            }
            $('.zank-product-gallery-main-slider .swiper-slide').each(function(i,e){
                var thumbUrl = $(this).data('thumb') ? $(this).data('thumb') : $(this).data('src');
                var active   = i == 0 ? ' swiper-slide-thumb-active' : '';
                var videoH   = $(this).hasClass('iframe-video') ? ' style="height:'+Math.round($('.zank-product-thumbnails .swiper-slide:first-child img').height())+'px"' : '';
                var tumbImg = $(this).hasClass('iframe-video') ? '<div class="zank-slide-video-item-icon"'+videoH+'><i class="nt-icon-button-play-2"></i></div>' : '<img src="'+thumbUrl+'">';
                $('<div class="swiper-slide thmub-video-icon'+active+'">'+tumbImg+'</div>').appendTo($('.zank-product-thumbnails .zank-swiper-wrapper'));
            });
            var galleryThumbs  = new NTSwiper( '.zank-product-thumbnails', {
                spaceBetween         : 10,
                slidesPerView        : 5,
                direction            : "horizontal",
                wrapperClass         : "zank-swiper-wrapper",
                watchOverflow        : true,
                watchSlidesProgress  : true,
                watchSlidesVisibility: true,
                rewind               : true,
                resizeObserver       : true,
                grabCursor           : true,
                breakpoints          : {
                    320 : {
                        slidesPerView : 5,
                        direction     : "horizontal"
                    },
                    576 : {
                        slidesPerView : 8,
                        direction     : "horizontal",
                    },
                    768 : {
                        slidesPerView : thumbsDirection == 'vertical' ? 'auto' : 8,
                        direction     : thumbsDirection,
                    }
                },
                on                   : {
                    resize : function ( swiper ) {
                        swiper.update();
                        var videoicon = $('.zank-product-thumbnails .swiper-slide:not(.swiper-slide-active)').height();
                        $('.zank-slide-video-item-icon').css('height', videoicon );
                    },
                    init : function ( swiper ) {

                        setTimeout(function(){
                            var videoicon = $('.zank-product-thumbnails .swiper-slide:first-child').height();
                            $('.zank-slide-video-item-icon').css('height', videoicon - 6 );
                        }, 500);
                    }
                }
            });

            var galleryMain = new NTSwiper( '.zank-product-gallery-main-slider', {
                speed                 : 800,
                spaceBetween          : 0,
                slidesPerView         : 1,
                direction             : "horizontal",
                wrapperClass          : "zank-swiper-wrapper",
                watchSlidesVisibility : true,
                watchSlidesProgress   : true,
                rewind                : true,
                resizeObserver        : true,
                grabCursor            : true,
                navigation            : {
                    nextEl : ".zank-product-gallery-main-slider .zank-swiper-next",
                    prevEl : ".zank-product-gallery-main-slider .zank-swiper-prev"
                },
                thumbs                : {
                    swiper: galleryThumbs
                },
                on                    : {
                    init : function ( swiper ) {
                        var heightVertical = $('.zank-product-gallery-main-slider').height();
                        $('.zank-product-thumbnails').css('max-height', heightVertical );
                    },
                    resize : function ( swiper ) {
                        var heightVertical = $('.zank-product-gallery-main-slider').height();
                        $('.zank-product-thumbnails').css('max-height', heightVertical );
                        swiper.update();
                    },
                    transitionEnd : function ( swiper ) {
                        var  active = swiper.realIndex;

                        $( '.zank-product-gallery-main-slider .swiper-slide:not(.swiper-slide-active)' ).each(function () {
                            var iframe = $( this ).find('iframe');
                            if ( iframe.length ) {
                                iframe[0].contentWindow.postMessage('{"event":"command","func":"' + 'pauseVideo' + '","args":""}', '*');
                            }
                        });

                        $( '.zank-product-gallery-main-slider .swiper-slide.swiper-slide-active' ).each(function () {
                            var iframe2 = $( this ).find('iframe');
                            if ( iframe2.length ) {
                                iframe2[0].contentWindow.postMessage('{"event":"command","func":"' + 'playVideo' + '","args":""}', '*');
                            }
                        });
                    },
                    afterInit: function(swiper){
                        var iframesrc = $('.zank-product-gallery-main-slider .iframe-video iframe').data('src');
                        $( '.zank-product-gallery-main-slider .iframe-video iframe' ).attr('src', iframesrc);
                    }
                }
            });

            var $gallery     = $('.zank-product-gallery-main-slider'),
                $mainImg     = $gallery.find('.zank-swiper-slide-first'),
                $oMainImg    = $mainImg.find('img'),
                $oZoomImg    = $mainImg.find('img.zoomImg'),
                $oZoomSrc    = $oMainImg.attr('src'),
                $popupSrc    = $mainImg.attr('data-src'),
                $oThumbImg   = $('.zank-product-thumbnails .swiper-slide:first-child img'),
                $hasThumbs   = $mainImg.attr('data-thumb') ? true : false,
                $oThumbSrc   = $hasThumbs ? $mainImg.attr('data-thumb') : $popupSrc,
                resetBtn     = $('.zank-btn-reset.reset_variations'),
                $mainSkuHtml = $('.zank-sku-wrapper .sku'),
                $mainSku     = $mainSkuHtml.html();

            $('.zank-product-summary form.variations_form').on('show_variation', function( event, data ){
                if ( data.sku ) {
                    $mainSkuHtml.html(data.sku);
                }
                resetBtn.addClass( 'active' );
                var fullsrc = data.image.full_src;
                var src     = data.image.src;
                var tsrc    = data.image.gallery_thumbnail_src;
                $mainImg.attr('data-src',fullsrc);
                $oMainImg.attr('src',src);
                $oZoomImg.attr('src',fullsrc);
                if ( $hasThumbs ) {
                    $oThumbImg.attr('src',tsrc);
                } else {
                    $oThumbImg.attr('src',fullsrc);
                }
                setTimeout( function() {
                    if ( !$oMainImg.hasClass('active') ) {
                        galleryMain.slideTo(0);
                        galleryThumbs.slideTo(0);
                    }
                    galleryMain.update();
                    galleryMain.updateAutoHeight(10);
                    galleryThumbs.update();
                    initZoom('reinit',fullsrc);
                }, 100 );
            });

            $('.zank-product-summary form.variations_form').on('hide_variation', function(){
                $mainSkuHtml.html($mainSku);
                resetBtn.removeClass( 'active' );
                $mainImg.attr('data-src',$popupSrc);
                $oMainImg.attr('src',$oZoomSrc);
                $oZoomImg.attr('src',$oZoomSrc);
                $oThumbImg.attr('src',$oThumbSrc);

                setTimeout( function() {
                    if ( !$oMainImg.hasClass('active') ) {
                        galleryMain.slideTo(0);
                        galleryThumbs.slideTo(0);
                    }
                    galleryMain.update();
                    galleryMain.updateAutoHeight(10);
                    galleryThumbs.update();
                    initZoom('reinit',$oZoomSrc);
                }, 100 );
            });

            initZoom('load');

            /**
            * Init zoom.
            */
            function initZoom($action,$url) {
                if ( 'function' !== typeof $.fn.zoom && !wc_single_product_params.zoom_enabled ) {
                    return false;
                }

                var galleryWidth = $('.zank-product-gallery-main-slider .swiper-slide').width(),
                    zoomEnabled  = false,
                    zoom_options = {
                        touch: false
                    };

                if ( 'ontouchstart' in document.documentElement ) {
                    zoom_options.on = 'click';
                }

                $('.zank-product-gallery-main-slider .swiper-slide img').each( function( index, target ) {
                    var image = $( target );
                    var imageIndex = image.parents('.swiper-slide');

                    if ( image.attr( 'width' ) > galleryWidth ) {
                        if ( $action == 'load' ) {
                            zoom_options.url = image.parent().data('zoom-img');
                            image.wrap('<span class="zank-zoom-wrapper" style="display:block"></span>')
                              .css('display', 'block')
                              .parent()
                              .zoom(zoom_options);
                        } else {
                            image.trigger('zoom.destroy').unwrap();
                            zoom_options.url = imageIndex.hasClass('zank-swiper-slide-first') ? $url : image.parent().data('zoom-img');
                            image.wrap('<span class="zank-zoom-wrapper" style="display:block"></span>')
                              .css('display', 'block')
                              .parent()
                              .zoom(zoom_options);
                        }
                    }
                });
            }
        }
    }


    /**
    * singleGalleryGridVariations
    */

    if ( $('.zank-product-main-gallery-grid').length > 0 ) {

        var $gallery     = $('.zank-product-main-gallery-grid'),
            $mainImg     = $gallery.find('.zank-gallery-grid-item-first'),
            $oMainImg    = $mainImg.find('img'),
            $oMainSrc    = $oMainImg.attr('src'),
            $popupSrc    = $mainImg.attr('data-src'),
            resetBtn     = $('.zank-btn-reset.reset_variations'),
            $mainSkuHtml = $('.zank-sku-wrapper .sku'),
            $mainSku     = $mainSkuHtml.html();

        $('.zank-product-summary form.variations_form').on('show_variation', function( event, data ){
            var fullsrc = data.image.full_src,
                src     = data.image.src;
            if ( data.sku ) {
                $mainSkuHtml.html(data.sku);
            }
            resetBtn.addClass( 'active' );
            $mainImg.attr('data-src',fullsrc);
            $oMainImg.attr('src',src);
        });

        $('.zank-product-summary form.variations_form').on('hide_variation', function(){
            resetBtn.removeClass( 'active' );
            $oMainImg.attr('src',$oMainSrc);
            $oMainImg.attr('data-src',$popupSrc);
        });
    }

});
