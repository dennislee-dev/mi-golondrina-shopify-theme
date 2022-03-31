/**
 * Include your custom JavaScript here.
 *
 * We also offer some hooks so you can plug your own logic. For instance, if you want to be notified when the variant
 * changes on product page, you can attach a listener to the document:
 *
 * document.addEventListener('variant:changed', function(event) {
 *   var variant = event.detail.variant; // Gives you access to the whole variant details
 * });
 *
 * You can also add a listener whenever a product is added to the cart:
 *
 * document.addEventListener('product:added', function(event) {
 *   var variant = event.detail.variant; // Get the variant that was added
 *   var quantity = event.detail.quantity; // Get the quantity that was added
 * });
 */
$(function() {
    /* Reformat product page body */
    $('.ProductMeta__Description .Rte').each(function() {
        $('meta',this).remove();
        var $newContent = $('<div>');
        var $section = null;
        var $inner = null;
        var headingCount = 0;
        $(this).children().each(function() {
        if ($(this).is('h1') || $(this).is('h2') || $(this).is('h3')) {
            headingCount++;
            if (headingCount <= 1) {
            $newContent.append($('<h4>').text($(this).text()));
            } else {
            if ($section) $newContent.append($section);
            $section = $('<div>').addClass('Collapsible');
            var $button = $('<button>')
                .addClass('Collapsible__Button')
                .addClass('Heading')
                .addClass('h4')
                .attr('data-action','toggle-collapsible')
                .attr('aria-expanded','false')
                .text($(this).text())
                .appendTo($section);
            var $plus = $('<span>').addClass('Collapsible__Plus').appendTo($button);
            $inner = $('<div>').addClass('Collapsible__Inner').appendTo($section);
            }
        } else {
            if ($section && $inner) {
            $inner.append($(this));
            } else {
            $newContent.append($(this));
            }
        }
        });
        if ($section) $newContent.append($section);
        $(this).html('').append($newContent);
    });

    //Display error if click on unavailable size on PDP
    $('.SizeSwatchList .HorizontalList__Item .SizeSwatch__Radio.Disabled+.SizeSwatch',document).on('click',function() {
        var addToCartButton = $('.ProductForm__AddToCart');
    
        var errorMessageElement = $('<span>');
        errorMessageElement.addClass('ProductForm__Error').addClass('Alert').addClass('Alert--error');
        errorMessageElement.html('Size ' + $(this).text() + ' is not available for this product. Contact us for more options.');
        addToCartButton.attr('disabled',null);
        errorMessageElement.insertAfter(addToCartButton);
        setTimeout(function () {
        errorMessageElement.remove();
        }, 2500);
    });

    //Update the other price, since dpo is only able to do one
    $('.ProductMeta__Price').on('DOMSubtreeModified',function(){$('.CurrentPrice').html($(this).html());});

    //Initialize custom size selection
    $('.dpo-container .fields.custom-size option[selected]').each(function() {
        $sizeSwatches = $('.CustomSizes');
        $sizeOption = $(this);
        if ($sizeSwatches) {
            var optionText = $sizeOption.text().trim();
            $('.SizeSwatch',$sizeSwatches).removeClass('Selected');
            $('.SizeSwatch',$sizeSwatches).each(function(){
                var compareText = $(this).text().trim();
                if (optionText == compareText) {
                    $(this).addClass('Selected');
                }
            });
        }
    });
    //Update selected sizes
    $('.CustomSizes .SizeSwatch').on('click',function(e){
        var $dpoSizes = $('.dpo-container .fields.custom-size');
        var $sizeElement = $(this);
        if ($dpoSizes) {
            var sizeText = $sizeElement.text().trim();
            $('option',$dpoSizes).prop('selected',false);
            $('option',$dpoSizes).each(function(){
                var compareText = $(this).text().trim();
                if (sizeText == compareText) {
                    $(this).prop('selected',true);
                    $sizeElement.parent().parent().find('.SizeSwatch.Selected').removeClass('Selected');
                    $sizeElement.addClass('Selected');
                }
            });
        }
    });
    var sizesValidation = function(e) {
        if ($('.CustomSizes').length > 0) {
            if ($('.SizeSwatch.Selected','.CustomSizes').length == 0) {
                $('.validation-advice','.CustomSizes').remove();
                $('<div class="validation-advice">This field is required</div>').appendTo('.CustomSizes');
                return false;
            } else {
            }
        } else {
        }
        return true;
    }
    if (window.dpoOptions) {
        window.dpoOptions.customValidation = sizesValidation;
    } else {
        jQuery(window).on('dpo_initialized',function() {
            window.dpoOptions.customValidation = sizesValidation;
        })
    }

    //Modalize Links
    $('main a').each(function() {
        var href = $(this).attr('href');
        if (href.indexOf("#") == -1 && href.indexOf("/pages/") == 0) {
            var modal_handle = href.replace('/pages/','modal-').replace('/','-');
            if ($('#'+modal_handle+'.Modal').length > 0) {
                $(this).attr('data-action','open-modal').attr('aria-controls',modal_handle);
            }
        }
    });

    $('.template-collection #shopify-section-page-extra-content-bridal').each(function() {
        var $target = $('<a>').attr('data-action','open-modal').attr('aria-controls','modal-bridal-modal-content').addClass('openBridalModal');
        $('.ImageHero__Image').first().wrap($target);
        if (!getCookie('bridal')) {
            setTimeout(() => {
                $('.ImageHero__Image','.openBridalModal').click();
                setCookie('bridal','viewed',365);
            }, 2000);
        }
    });

    $('.aa-input','.PageContainer').on('keydown', function(e) {
        if (e.keyCode === 13) {
            e.preventDefault();
            if ($(this).val()) {
                window.location.href = '/search?q='+$(this).val();
            }
        }
    });

    var resizeTimer;
    $(window).on('resize', function(e) {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(function() {
            computeStickyFacetBar();
            computeHomeSlideHeights();
        }, 250);
    });
    computeStickyFacetBar();
    computeHomeSlideHeights();


    quickviewSetup();
});
var computeHomeSlideHeights = function() {
    if ($('.Slideshow__Slide').length > 0) {
        $slides = $('.Slideshow__Slide');
        $slides.each(function(idx, el) {
            var $c = $('.Slideshow__Content',el);
            if ($c.length > 0) {
                var h = $c.outerHeight();
                document.documentElement.style.setProperty('--mobile-home-hero-content-height-'+(idx+1),h+'px');
            }
        });
    }
}
var computeStickyFacetBar = function() {
    if ($('.ais-facets').length > 0) {
        if (window.innerWidth >= 1008) {
            var windowHeight = window.innerHeight;
            var headerHeight = $('#shopify-section-header').height();
            var facetHeight = $('.ais-facets').height();
            if (facetHeight < windowHeight - headerHeight) {
                var top = headerHeight;
                $('.ais-facets').css({top: top+'px'});
            } else {
                var padding = 80;
                var top = windowHeight - facetHeight - padding;
                $('.ais-facets').css({top: top+'px'});
            }
        } else {
            $('.ais-facets').css({top:0});
        }
    }
    if ($('.CollectionInner__Sidebar').length > 0) {
        if (window.innerWidth >= 1008) {
            var windowHeight = window.innerHeight;
            var headerHeight = $('#shopify-section-header').height();
            var facetHeight = $('.CollectionInner__Sidebar').height();
            if (facetHeight < windowHeight - headerHeight) {
                var top = headerHeight;
                $('.CollectionInner__Sidebar').css({top: top+'px'});
            } else {
                var padding = 80;
                var top = windowHeight - facetHeight - padding;
                $('.CollectionInner__Sidebar').css({top: top+'px'});
            }
        } else {
            $('.CollectionInner__Sidebar').css({top:0});
        }
    }
}

var loadAlternateImages = function() {
    console.log('loadAlternateImages');
    console.log('length: ' + $('.ProductList .ais-hit.ais-product').length);
    $('.ProductList .ais-hit.ais-product').each(function() {
        var $product = $(this);
        var handle = $(this).data('handle');
        var url = window.location.protocol + '//' + Shopify.shop + '/products/' + handle + '.json';
        var $imageContainer = $(this).find('.ProductItem__ImageWrapper');
        $.ajax(
            {
                type: 'GET',
                url: url,
                success: function(data) {
                    var images = data.product.images;
                    if (images.length > 1) {
                        //<img class="ProductItem__Image ProductItem__Image--alternate Image--lazyLoad Image--fadeIn" src="https://cdn.shopify.com/s/files/1/0241/7723/products/EvaDressPinkBack.jpg?v=1595341786">
                        var $alternateImage = $('<img>')
                            .addClass('ProductItem__Image')
                            .addClass('ProductItem__Image--alternate')
                            .addClass('Image--lazyLoad')
                            .addClass('Image--fadeIn')
                            .attr('src',images[1].src)
                            .prependTo($imageContainer.find('.AspectRatio'));
                        $imageContainer.addClass('ProductItem__ImageWrapper--withAlternateImage')
                    }
                }
            }
        );
    });
}

function getCookie(name) {
    var v = document.cookie.match('(^|;) ?' + name + '=([^;]*)(;|$)');
    return v ? v[2] : null;
}
function setCookie(name, value, days) {
    var d = new Date;
    d.setTime(d.getTime() + 24*60*60*1000*days);
    document.cookie = name + "=" + value + ";path=/;expires=" + d.toGMTString();
}
function deleteCookie(name) { setCookie(name, '', -1); }

var quickviewSetup = function() {
    if ($('.trigger-quickview').length > 0) {
        $('.trigger-quickview').on('click',function(e) {
            e.preventDefault();
            var product_url = $(this).closest('a').attr('href');
            $.ajax(
                {
                    type: 'GET',
                    url: product_url + '?view=quickview',
                    success: function(response) {
                        openModal(response);

                        var quickviewJsonData = JSON.parse( $('.quickview-modal').find('[data-product-json]').html() );
                        $('.quickview-modal .SizeSwatchList .HorizontalList__Item .SizeSwatch__Radio',document).on('change', quickviewJsonData, quickviewVariantSelect);
                        $('.Product__Slideshow').flickity({
                            // options
                            cellAlign: 'left',
                            contain: true
                          });
                    }
                }
            );            
        });
    }
}

function generateModal(content){
    var modal_html = '<div class="quickview-modal-wrapper">' + 
        '<button class="trigger-quickview-close"><span>close quickview</span></button>' +
        '<div class="quickview-modal">' + 
            '<div class="quickview-content">' +
            content + 
            '</div>' +
        '</div>' +
    '</div>';

    return modal_html;
}

function openModal(content){
    var modal = generateModal(content);

    //add modal
    $('body').append(modal);

    //add on click events
    $('.trigger-quickview-close').on('click', function(){
        closeModal();
    });

    //add body class
    $('body').addClass('quickview-open');
}

function closeModal(){
    //add off click events
    $('.quickview-modal .SizeSwatchList .HorizontalList__Item .SizeSwatch__Radio',document).off('change', quickviewVariantSelect);
    $('.trigger-quickview-close').off('click');

    //remove modal and modal content
    $('.quickview-modal-wrapper').remove();

    //remove body class
    $('body').removeClass('quickview-open');
}

function quickviewVariantSelect(evt) {
    var quickviewOption1 = $('.quickview-modal [name="option-0"]').length ? $('.quickview-modal [name="option-0"]:checked').val() : null;
    var quickviewOption2 = $('.quickview-modal [name="option-1"]').length ? $('.quickview-modal [name="option-1"]:checked').val() : null;
    var quickviewOption3 = $('.quickview-modal [name="option-2"]').length ? $('.quickview-modal [name="option-2"]:checked').val() : null;

    var quickviewValue = quickviewVariantFromOptions(evt.data.product, quickviewOption1, quickviewOption2, quickviewOption3);

    $('select[name="id"] option[value="' + quickviewValue + '"]').prop('selected', true);
}

function quickviewVariantFromOptions(productData, option1, option2, option3) {
    var found = false;

    productData['variants'].forEach(function (variant) {
        if (variant['option1'] === option1 && variant['option2'] === option2 && variant['option3'] === option3) {
            console.log(variant);
            console.log(variant.id);
            console.log(variant['id']);
            found =  variant.id;
        }
    });

    return found || null;
  }