This module allows you to make use of the jCarousel jQuery plugin (http://sorgalla.com/jcarousel/).

It requires the jQuery Update module (http://drupal.org/project/jquery_update).


INSTALLATION:

1) Place this module directory in your modules folder (this will usually be
"sites/all/modules/").

2) Enable the module.


USAGE:

0) Make sure you have HTML in a format that jCarousel can handle it. See http://sorgalla.com/jcarousel/.

1) Add the required JS/CSS files by calling this function:
	jcarousel_add();

2) Optionally, you can also specify one of the included skins, tango is the default:
	jcarousel_add('sweetie');

3) Or you can use no skin altogether (and define your own 
	jcarousel_add(FALSE);


NOTES:

Only the tango skin is modified for usage with Drupal (specifically for usage as a block), the others have not yet been tested.