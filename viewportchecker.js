/*
Version 1.0
The MIT License (MIT)

Copyright (c) 2014 Dirk Groenen

Permission is hereby granted, free of charge, to any person obtaining a copy of
this software and associated documentation files (the "Software"), to deal in
the Software without restriction, including without limitation the rights to
use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of
the Software, and to permit persons to whom the Software is furnished to do so,
subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.
*/

(function($){
    $.fn.viewportChecker = function(useroptions){
        // Define options and extend with user
        var options = {
            classToAdd: 'visible',
            offset: 100
        }
        $.extend(options, useroptions);


        this.checkElements = function(){
            // Cache given element into $elem and set some variables
            var $elem = this,
                scrollElem = ((navigator.userAgent.toLowerCase().indexOf('webkit') != -1) ? 'body' : 'html'),
                viewportTop = $(scrollElem).scrollTop(),
                viewportBottom = ( viewportTop + $(window).height() );

            $elem.each(function(){
                // If class already exists; quit
                if ($(this).hasClass(options.classToAdd))
                    return;

                // define the top position of the element and include the offset which makes is appear earlier or later
                var elemTop = Math.round( $(this).offset().top ) + options.offset,
                    elemBottom = elemTop + ($(this).height());

                // Add class if in viewport
                if ((elemTop < viewportBottom) && (elemBottom > viewportTop))
                    $(this).addClass(options.classToAdd);
            });
        }

        $(window).scroll(this.checkElements);
        this.checkElements()
    }
})(jQuery);
