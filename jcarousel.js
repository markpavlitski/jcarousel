
/**
 * @file
 * Provides the jCarousel Drupal behavior.
 */

/**
 * The jCarousel Drupal behavior that creates the set of jCarousel elements from Drupal.settings.jcarousel.
 */
Drupal.behaviors.jcarousel = function() {
  // Iterate through each selector and add the carousel.
  jQuery.each(Drupal.settings.jcarousel || {}, function(selector, options) {

    // Convert any callback arguments from strings to function calls.
    var callbacks = ['initCallback', 'itemLoadCallback', 'itemFirstInCallback', 'itemFirstOutCallback', 'itemLastOutCallback', 'itemLastInCallback', 'itemVisibleInCallback', 'itemVisibleOutCallback', 'buttonNextCallback', 'buttonPrevCallback'];
    jQuery.each(callbacks, function(callback, callbackname) {
      if (options[callbackname] || false) {
        // The callback depends on its type.
        if (typeof(options[callbackname]) == 'string') {
          // Strings are evaluated as functions.
          options[callbackname] = eval(options[callbackname]);
        }
        else if (typeof(options[callbackname]) == 'object' || (options[callbackname] instanceof Array)) {
          // Arrays are evaluated as a list of callback registrations. This is because callbacks
          // like itemVisibleInCallback can either be a function call back, or an array of callbacks
          // consisting of both onBeforeAnimation and onAfterAnimation.
          jQuery.each(options[callbackname], function(subcallbackname, subcallback) {
            options[callbackname][subcallbackname] = eval(subcallback);
          });
        }
      }
    });

    // Prepare the skin name to be added as a class name.
    var skin = options['skin'];
    if (typeof(skin) == 'string') {
      skin = ' jcarousel-skin-' + skin;
    }
    else {
      skin = '';
    }

    // Prepare callbacks for circular carousels
    if (options['wrap'] == 'circular') {
      var itemList = [];
      // Add item to storage list, then remove it from the HTML so the carousel has no length
      // The removing is necessary, otherwise the carousel will stop when it reaches the end
      $(selector + ' li').each(function(){
        itemList.push($(this).html());
        this.parentNode.removeChild(this);
      });

      options['itemVisibleInCallback'] = { onBeforeAnimation: function(carousel, item, i, state, e) {
        jcarousel_itemVisibleInCallback(carousel, item, i, state, e, itemList);
      }};

      options['itemVisibleOutCallback'] = { onAfterAnimation: jcarousel_itemVisibleOutCallback };
    }

    // Create the countdown element on non-processed elements.
    $(selector + ':not(.jcarousel-processed)').removeClass('js-hide').addClass('jcarousel-processed' + skin).jcarousel(options);
  });
};

function jcarousel_itemVisibleInCallback(carousel, item, i, state, e, items) {
  var idx = carousel.index(i, items.length);
  carousel.add(i, items[idx - 1]);
}

function jcarousel_itemVisibleOutCallback(carousel, item, i, state, e) {
  carousel.remove(i);
}
