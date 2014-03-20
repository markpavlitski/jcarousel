                                jCarousel Module
Description
-----------

This module provides Views plugins to use the jCarousel jQuery plugin. For more
information about jCarousel, visit the official project page:
http://sorgalla.com/jcarousel/

Installation
------------

1) Place this module and it's dependencies in your modules folder. This will
   usually be sites/all/modules/contrib/.

2) Download jCarousel v0.3 from the project download page
   (http://sorgalla.com/jcarousel/dist/) and place it in sites/all/libraries/.

3) Enable the module within your Drupal site at Administer -> Site Building ->
   Modules (admin/build/modules).

Usage
-----

The jCarousel module is most commonly used with the Views module to turn
listings of images or other content into a carousel.

1) Install the Views module (http://drupal.org/project/views) on your Drupal
   site if you have not already.

2) Add a new view at Administration -> Structure -> Views
   (admin/structure/views).

3) Change the "Display format" of the view to "jCarousel". Disable the
   "Use pager" option, which cannot be used with the jCarousel style. Click the
   "Continue & Edit" button to configure the rest of the View.

4) Click on the "Settings" link next to the jCarousel Format to configure the
   options for the carousel such as the animation speed and skin.

5) Add the items you would like to include in the rotator under the "Fields"
   section, and build out the rest of the view as you would normally. Note that
   the preview of the carousel within Views probably will not appear correctly
   because the necessary JavaScript and CSS is not loaded in the Views
   interface. Save your view and visit a page URL containing the view to see
   how it appears.

Authors
-------

Nate Haug (http://quicksketch.org)
Matt Farina (http://www.mattfarina.com)
Wim Leers (work@wimleers.com | http://wimleers.com/work)
Rob Loach (http://www.robloach.net)
