viewport-checker
=======================

**Note: jQuery-viewport-checker has been rewritten and renamed to no longer require jQuery.**

Little script that detects if an element is in the viewport and adds a class to it.

> Starting V2.x.x this plugin no longer requires jQuery. Take a look at version [1.x.x](https://www.npmjs.com/package/jquery-viewport-checker) if you're still looking for the jQuery version.

Installation
------------

Distribution files are shipped with the npm package. Install the package and use it in your project:

```
npm install --save viewport-checker
```

Or use unpkg.com to directly include the distribution files in your site:

```html
<script type="text/javascript" src="//unpkg.com/viewport-checker@^2"></script>
```

After including the script in your project you can construct a new instance by providing a querySelector. Make sure
to call `attach()` after you're DOM is ready so your elements are actually checked.
```html
<head>
    <script src="dist/viewportChecker.umd.js"></script>

    <script>
        const vpc = new ViewportChecker('.dummy');
        document.addEventListener('DOMContentLoaded', () => vpc.attach());
    </script>
</head>
```

Options
-------
`ViewportChecker` can be initialized with an additional argument representing the options. Available options are:
```javascript
new ViewportChecker('.dummy', {
    classToAdd: 'visible', // Class to add to the elements when they are visible,
    classToAddForFullView: 'full-visible', // Class to add when an item is completely visible in the viewport
    classToRemove: 'invisible', // Class to remove before adding 'classToAdd' to the elements
    removeClassAfterAnimation: false, // Remove added classes after animation has finished
    offset: [100 OR 10%], // The offset of the elements (let them appear earlier or later). This can also be percentage based by adding a '%' at the end
    invertBottomOffset: true, // Add the offset as a negative number to the element's bottom
    repeat: false, // Add the possibility to remove the class if the elements are not visible
    callbackFunction: function(elem, action){}, // Callback to do after a class was added to an element. Action will return "add" or "remove", depending if the class was added or removed
	scrollHorizontal: false // Set to true if your website scrolls horizontal instead of vertical.
});
```

In addition to the global options you can also provide 'per element' options using `data-attributes`. These attributes will then override the globally set options.

Available attributes are:
```html
<div data-vp-add-class="random"></div>          > classToAdd
<div data-vp-remove-class="random"></div>       > classToRemove
<div data-vp-remove-after-animation="true|false"></div>      > Removes added classes after CSS3 animation has completed
<div data-vp-offset="[100 OR 10%]"></div>       > offset
<div data-vp-repeat="true"></div>               > repeat
<div data-vp-scrollHorizontal="false"></div>    > scrollHorizontal
```

Use case
--------
The guys from web2feel have written a little tutorial with a great example of how you can use this script. Note that this tutorial was written for the original version (V1) which required jQuery. Although the API has changed it pretty much still shows what you can do with this plugin. You can check the [tutorial here](http://www.web2feel.com/tutorial-for-animated-scroll-loading-effects-with-animate-css-and-jquery/) and the [demo here](http://web2feel.com/freeby/scroll-effects/index.html).
