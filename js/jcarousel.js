/**
 * @file
 * Add jCarousel behaviors to the page and provide Views-support.
 */

(function($) {

Drupal.behaviors.jcarousel = {};
Drupal.behaviors.jcarousel.attach = function(context, settings) {
  settings = settings || Drupal.settings;

  $('[data-jcarousel]:not(.jcarousel-processed)').each(function() {
    var $carousel = $(this);
    $carousel.options = $carousel.data();

    // Add standard options required for AJAX functionality.
    if ($carousel.options.ajax) {
      // @todo
    }

    // If auto-scrolling, pause animation when hoving over the carousel.
    if ($carousel.options.auto) {
      // @todo
    }

    // Load the appropriate skin stylesheet.
    if ($carousel.options.skinfile) {
      // Check if the stylesheet has already been loaded.
      if (!$("link[href='" + $carousel.options.skinfile + "']").length) {
        // Create a new DOM element for the stylesheet.
        $('<link href="' + $carousel.options.skinfile + '" rel="stylesheet">')
          // Once the stylesheet has loaded, run the responsive callback, in
          // case any elements have been resized.
          .load(function() {Drupal.jcarousel.responsiveCallback($carousel);})
          // Add into <head>.
          .appendTo("head");
      }
    }

    // Add navigation to the carousel if enabled.
    if (!$carousel.options.setupCallback) {
      $carousel.on('jcarousel:createend', function(event, carousel) {
        Drupal.jcarousel.setupCarousel(carousel);
        if (carousel.options.navigation) {
          Drupal.jcarousel.addNavigation(carousel, carousel.options.navigation);
        }
      });
      if ($carousel.options.navigation && !$carousel.options.itemVisibleInCallback) {
        // @todo
      }
    }

    // Add responsive callback to the carousel.
    $carousel.on('jcarousel:reload jcarousel:create', function(event, carousel) {
      Drupal.jcarousel.responsiveCallback($(this));
    });

    $carousel.buttonNext = $carousel.siblings('.jcarousel-next:first');
    $carousel.buttonPrev = $carousel.siblings('.jcarousel-prev:first');

    // Initialize the jcarousel.
    $carousel.addClass('jcarousel-processed').jcarousel($carousel.options);
    $carousel.buttonPrev.jcarouselControl({
      target: '-=1',
      carousel: $carousel
    });
    $carousel.buttonNext.jcarouselControl({
      target: '+=1',
      carousel: $carousel
    });
  });
};

Drupal.jcarousel = {};
Drupal.jcarousel.ajaxLoadCallback = function(jcarousel, state) {
  // Check if the requested items already exist.
  if (state == 'init' || jcarousel.has(jcarousel.first, jcarousel.last)) {
    return;
  }

  var $list = jcarousel.list;
  var $view = $list.parents('.view:first');
  var ajaxPath = Drupal.settings.jcarousel.ajaxPath;
  var target = $view.get(0);

  // Find this view's settings in the Views AJAX settings.
  var settings;
  $.each(Drupal.settings.jcarousel.carousels, function(domID, carouselSettings) {
    if ($list.is('.' + domID)) {
      settings = carouselSettings['view_options'];
    }
  });

  // Copied from ajax_view.js:
  var viewData = { 'js': 1, 'first': jcarousel.first - 1, 'last': jcarousel.last };
  // Construct an object using the settings defaults and then overriding
  // with data specific to the link.
  $.extend(
    viewData,
    settings
  );

  $.ajax({
    url: ajaxPath,
    type: 'GET',
    data: viewData,
    success: function(response) {
      Drupal.jcarousel.ajaxResponseCallback(jcarousel, target, response);
    },
    error: function(xhr) {
      Drupal.jcarousel.ajaxErrorCallback(xhr, ajaxPath);
    },
    dataType: 'json'
  });

};

/**
 * Init callback for jCarousel. Pauses the carousel when hovering over.
 */
Drupal.jcarousel.autoPauseCallback = function(carousel, state) {
  function pauseAuto() {
    carousel.stopAuto();
  }
  function resumeAuto() {
    carousel.startAuto();
  }
  carousel.clip.hover(pauseAuto, resumeAuto);
  carousel.buttonNext.hover(pauseAuto, resumeAuto);
  carousel.buttonPrev.hover(pauseAuto, resumeAuto);
};

/**
 * Setup callback for jCarousel. Calculates number of pages.
 */
Drupal.jcarousel.setupCarousel = function(carousel) {
  // Determine the number of pages this carousel includes.
  // This only works for a positive starting point. Also, .first is 1-based
  // while .last is a count, so we need to reset the .first number to be
  // 0-based to make the math work.
  carousel.pageSize = carousel.last - (carousel.first - 1);

  // jCarousel's Views integration sets "size" in the carousel options. Use that
  // if available, otherwise count the number of items in the carousel.
  var itemCount = carousel.options.size ? carousel.options.size : $(carousel.list).children('li').length;
  carousel.pageCount =  Math.ceil(itemCount / carousel.pageSize);
  carousel.pageNumber = 1;

  // Disable the previous/next arrows if there is only one page.
  if (carousel.options.wrap != 'circular' && carousel.pageCount == 1) {
    $(carousel.buttonNext).addClass('jcarousel-next-disabled').attr('disabled', true);
    $(carousel.buttonPrev).addClass('jcarousel-prev-disabled').attr('disabled', true);
  }
};

/**
 * Callback for reponsive views.
 */
Drupal.jcarousel.responsiveCallback = function($carousel) {
  if ($carousel.options.responsive) {
    var width = $carousel.innerWidth();
    $carousel.jcarousel('items').width(width);
  }
}

/**
 * AJAX callback for all jCarousel-style views.
 */
Drupal.jcarousel.ajaxResponseCallback = function(jcarousel, target, response) {
  if (response.debug) {
    alert(response.debug);
  }

  var $view = $(target);
  // @todo this is incorrect:
  jcarousel = jcarousel || $view.find('ul.jcarousel').data('jcarousel');

  // Add items to the jCarousel.
  $('ul.jcarousel > li', response.display).each(function(i) {
    var itemNumber = this.className.replace(/.*?jcarousel-item-(\d+).*/, '$1');
    jcarousel.add(itemNumber, this.innerHTML);
  });

  // Add Drupal behaviors to the content of the carousel to affect new items.
  Drupal.attachBehaviors(jcarousel.list.get(0));

  // Treat messages the same way that Views typically handles messages.
  if (response.messages) {
    // Show any messages (but first remove old ones, if there are any).
    $view.find('.views-messages').remove().end().prepend(response.messages);
  }
};

/**
 * Display error messages using the same mechanism as Views module.
 */
Drupal.jcarousel.ajaxErrorCallback = function (xhr, path) {
  var error_text = '';

  if ((xhr.status == 500 && xhr.responseText) || xhr.status == 200) {
    error_text = xhr.responseText;

    // Replace all &lt; and &gt; by < and >
    error_text = error_text.replace("/&(lt|gt);/g", function (m, p) {
      return (p == "lt")? "<" : ">";
    });

    // Now, replace all html tags by empty spaces
    error_text = error_text.replace(/<("[^"]*"|'[^']*'|[^'">])*>/gi,"");

    // Fix end lines
    error_text = error_text.replace(/[\n]+\s+/g,"\n");
  }
  else if (xhr.status == 500) {
    error_text = xhr.status + ': ' + Drupal.t("Internal server error. Please see server or PHP logs for error information.");
  }
  else {
    error_text = xhr.status + ': ' + xhr.statusText;
  }

  alert(Drupal.t("An error occurred at @path.\n\nError Description: @error", {'@path': path, '@error': error_text}));
};

})(jQuery);
