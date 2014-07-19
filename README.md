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
The current available options are:
```code
$('.dummy').viewportChecker({
    classToAdd: 'visible', // Class to add to the elements when they are visible
    offset: 100, // The offset of the elements (let them appear earlier or later)
    repeat: false, // Add the possibility to remove the class if the elements are not visible
    callbackFunction: function(elem){} // Callback to do after a class was added to an element
});
```
