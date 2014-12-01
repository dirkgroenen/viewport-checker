jQuery-viewport-checker
=======================

Little script that detects if an element is in the viewport and adds a class to it.

Installation
------------
Just include the script and jQuery in your website <head> tag and call it on the elements you want to check.
```code
<head>
    <script src="http://code.jquery.com/jquery.js"></script>
    <script src="viewportchecker.js"></script>

    <script>
        $(document).ready(function(){
            $('.dummy').viewportChecker();
        });
    </script>
</head>
```

Options
-------
The currently available global options are:
```code
$('.dummy').viewportChecker({
    classToAdd: 'visible', // Class to add to the elements when they are visible
    classToRemove: 'invisible', // Class to remove before adding 'classToAdd' to the elements
    offset: 100, // The offset of the elements (let them appear earlier or later)
    invertBottomOffset: true, // Add the offset as a negative number to the element's bottom
    repeat: false, // Add the possibility to remove the class if the elements are not visible
    callbackFunction: function(elem, action){}, // Callback to do after a class was added to an element. Action will return "add" or "remove", depending if the class was added or removed
	scrollHorizontal: false // Set to true if your website scrolls horizontal instead of vertical.
});
```

Besides the global options you can also add data-attributes to each individual element. These attributes will override the global options. 

Available attributes are:
```code
<div data-vp-add-class="random"></div>          >   clasToAdd
<div data-vp-remove-class="random"></div>       >	clasToRemove
<div data-vp-offset="100"></div>                >	offset
<div data-vp-repeat="true"></div>               >	repeat
<div data-vp-scrollHorizontal="false"></div>    >	scrollHorizontal
```

Use case
--------
The guys from web2feel have written a little tutorial with a great example of how you can use this script. You can check the [tutorial here](http://www.web2feel.com/tutorial-for-animated-scroll-loading-effects-with-animate-css-and-jquery/) and the [demo here](http://web2feel.com/freeby/scroll-effects/index.html).
