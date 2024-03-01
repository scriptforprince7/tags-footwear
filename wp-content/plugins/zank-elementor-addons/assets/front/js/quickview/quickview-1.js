'use strict';

var zank_ids = [],
    zank_products = [];
(function($) {

    jQuery(document).ready(function($) {
        $('.zank-quickview-btn').each(function() {
            var id = $(this).data('id');
            if (-1 === $.inArray(id, zank_ids)) {
                zank_ids.push(id);
                zank_products.push({src: zank_vars.ajax_url + '?product_id=' + id});
            }
        });
    });

    function zank_get_key(array, key, value) {
      for (var i = 0; i < array.length; i++) {
        if (array[i][key] === value) {
          return i;
        }
      }
      return -1;
    }

    jQuery(document).on('zankShopInit',function() {
        $('.zank-quickview-btn').each(function() {
            var id = $(this).data('id');
            if (-1 === $.inArray(id, zank_ids)) {
                zank_ids.push(id);
                zank_products.push({src: zank_vars.ajax_url + '?product_id=' + id});
            }
        });
        init(zank_products);
    });
	
	jQuery(document).on('zank_quick_init',function() {
		$('.zank-quickview-btn').each(function() {
			var id = $(this).data('id');
			if (-1 === $.inArray(id, zank_ids)) {
				zank_ids.push(id);
				zank_products.push({src: zank_vars.ajax_url + '?product_id=' + id});
			}
		});
		init(zank_products);
	});

    init(zank_products);

    function init(zank_products){

        $(document).on('click touch', '.zank-quickview-btn', function(event) {
            event.preventDefault();

            var $this        = $(this),
                id           = $this.data('id'),
				clicked      = false,
                is_quickShop = $this.parents('.zank-loop-product').find('.zank-quick-shop-btn');

            var index = zank_get_key(zank_products, 'src', zank_vars.ajax_url + '?product_id=' + id);

            $.magnificPopup.open({
                items           : zank_products,
                type            : 'ajax',
                mainClass       : 'mfp-zank-quickview zank-mfp-slide-bottom',
                removalDelay    : 160,
                overflowY       : 'scroll',
                fixedContentPos : true,
                closeBtnInside  :true,
                tClose          : '',
                closeMarkup     : '<div class="mfp-close zank-panel-close-button"></div>',
                tLoading        : '<span class="loading-wrapper"><span class="ajax-loading"></span></span>',
                gallery         : {
                    tPrev: '',
                    tNext: '',
                    enabled: true
                },
                ajax: {
                    settings: {
                        type: 'GET',
                        data: {
                            action: 'zank_quickview'
                        }
                    }
                },
                callbacks: {
                    beforeOpen: function() {},
                    open: function() {
                        $('.mfp-preloader').addClass('loading');
						$('html,body').addClass('popup-open');
                    },
                    ajaxContentAdded: function() {
                        $('.mfp-preloader').removeClass('loading');

                        $('.zank-quickview-wrapper .zank_ajax_add_to_cart').on('click', function() {
                            setTimeout( function(){
                                $.magnificPopup.close();
                            }, 500);
                        });

                        $('.zank-quickview-wrapper .zank-quick-shop-btn').removeClass('zank-quick-shop-btn').addClass('open-quick-shop');

                        $('.zank-quickview-wrapper .open-quick-shop').on('click touch', function(event) {
                            event.preventDefault();
                            $.magnificPopup.close();
							clicked = true;
                        });

                        if ( $('.zank-quickview-main img').length > 1) {

                            $('.zank-quickview-main .swiper-slide img').each( function(){
                                var src = $(this).attr('src');
                                $('<div class="swiper-slide"><img width="80" height="80" src="'+src+'"/></div>').appendTo('.zank-quickview-thumbnails .zank-swiper-wrapper');
                            });

                            var galleryThumbs = new NTSwiper('.zank-quickview-thumbnails', {
                                loop                  : false,
                                speed                 : 1000,
                                spaceBetween          : 10,
                                slidesPerView         : 6,
                                autoHeight            : true,
                                watchSlidesVisibility : true,
                                wrapperClass          : "zank-swiper-wrapper",
                                grabCursor            : true,
                                navigation            : {
                                    nextEl: '.zank-quickview-main .zank-swiper-next',
                                    prevEl: '.zank-quickview-main .zank-swiper-prev'
                                }
                            });
                            var galleryTop = new NTSwiper('.zank-quickview-main', {
                                loop         : false,
                                speed        : 1000,
                                slidesPerView: 1,
                                spaceBetween : 0,
                                observer     : true,
                                rewind       : true,
                                wrapperClass : "zank-swiper-wrapper",
                                grabCursor   : true,
                                navigation   : {
                                    nextEl: '.zank-quickview-main .zank-swiper-next',
                                    prevEl: '.zank-quickview-main .zank-swiper-prev'
                                },
                                thumbs       : {
                                    swiper: galleryThumbs
                                }
                            });
                        }
                    },
                    close: function(){},
                    afterClose: function(){
                        if ( is_quickShop.length > 0 && clicked == true ) {
                            $(document.body).trigger('trigger_quick_shop',is_quickShop);
                        }
						$('html,body').removeClass('popup-open');
                    }
                }
            },index);
        });
    }
})(jQuery);
