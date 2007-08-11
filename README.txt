$Id$

Description
-----------
This module provides a central function for adding the jCarousel jQuery plugin
and makes sure it's added only once per page.

Additionally, it also provides a configurable "carousel" style for use by the
Mini Panels module.


Dependencies
------------
* jQuery Update (http://drupal.org/project/jquery_update)


Installation
------------
1) Place this module directory in your modules folder (this will usually be
"sites/all/modules/").

2) Enable the module.


Developer notes
---------------
1) Make sure you have HTML in a format that jCarousel can handle it. See
http://sorgalla.com/jcarousel/.

1) Add the required JS/CSS files by calling the jcarousel_add() function.

2) Optionally, you can also specify one of the included skins, tango is the
default: jcarousel_add('sweetie').

3) Or you can use none of the included skins:	jcarousel_add(FALSE).


Sponsor
-------
Paul Ektov of http://autobin.ru.


Author
------
Wim Leers

* mail: work@wimleers.com
* website: http://wimleers.com/work

The author can be contacted for paid customizations of this module as well as
Drupal consulting, development and installation.
