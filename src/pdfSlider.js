/**
 @author : alexwebgr
 @desc : simple slider originally created for pdf files but can be used for any content

 This program is free software: you can redistribute it and/or modify
 it under the terms of the GNU General Public License as published by
 the Free Software Foundation, either version 3 of the License, or
 (at your option) any later version.

 This program is distributed in the hope that it will be useful,
 but WITHOUT ANY WARRANTY; without even the implied warranty of
 MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 GNU General Public License for more details.

 You should have received a copy of the GNU General Public License
 along with this program.  If not, see <http://www.gnu.org/licenses/>.

 */

(function ($)
{
    var
        log =
        {
            echo : function (msg)
            {
                if (window.console)
                    console.log(msg);
            }
        },

        options = {},

        defaults =
        {
            container : ".carousel",
            item : "object",
            itemHeight : 500,
            itemWidth : 960,
            speed : 700,
            activeSlideIndex : 0
        },

        methods =
        {
            init : function (opts)
            {
                options = $.extend(defaults, opts);

                methods._create();
            },

            _setActive : function ()
            {
                var slides = $(options.container + " .slide");
                var listItems = $(".pdfList a");

                listItems.removeClass("activeItem");

                slides
                    .css("margin-left", "0px")
                    .removeClass("active")
                ;

                $.each(slides, function(index)
                {
                    if (index < options.activeSlideIndex)
                    {
                        $(this).css({
                            marginLeft : "-1000px"
                        });
                    }
                });

                $(".slide").eq(options.activeSlideIndex).addClass("active");
                listItems.eq(options.activeSlideIndex).addClass("activeItem");

                $(options.container).show();
            },

            destroy : function ()
            {
                var slides = $(options.container + " .slide");

                $(options.container)
                    .hide()
                    .find(".slide").removeClass("active")
                ;
                options.activeSlideIndex = 0;
                slides.css("margin-left", "0px");
            },

            _create : function ()
            {
                if (!$(".slide").length)
                {
                    var items = $(options.container + " " + options.item);

                    $.each(items, function ()
                    {
                        //console.log($(this).index());
                        $(this)
                            .attr(
                            {
                                "height":options.itemHeight,
                                "width":options.itemWidth
                            })
                            .wrap("<div class='slide' style='z-index:-" + $(this).index() * 10 + "' />")
                        ;
                    });

                    $(options.container)
                        .append("<div class='pdfSlider_button next'/>")
                        .append("<div class='pdfSlider_button prev'/>")
                        .append("<div class='pdfSlider_close'/>")
                    ;
                }

                methods._setActive();
                methods._animate();
            },

            _animate : function ()
            {
                var
                    init = 0,
                    i = options.activeSlideIndex,
                    slides = $(options.container + " .slide"),
                    slidesLength = slides.length - 1
                ;

                $(options.container)
                    .off()
                    .on(
                    {
                        click : function ()
                        {
                            var ele = $(".active.slide");

                            if (!ele.length)
                                ele = slides.first().addClass("active");

                            var index = ele.index() - 1;

                            if ($(this).hasClass("next"))
                            {
                                if (i < slidesLength)
                                {
                                    ele.animate(
                                        {
                                            marginLeft:"-1000px"
                                        },
                                        options.speed,
                                        function ()
                                        {
                                            $(".pdfList .activeItem").removeClass("activeItem");
                                            $(".pdfList a").eq(index).addClass("activeItem");
                                            ele.removeClass("active");
                                            ele.next(".slide")
                                                .addClass("active")
                                            ;
                                        }
                                    );
                                    i++;
                                }
                            }

                            if ($(this).hasClass("prev"))
                            {
                                if (i > init)
                                {
                                    $(".pdfList .activeItem").removeClass("activeItem");
                                    $(".pdfList a").eq(index).addClass("activeItem");
                                    ele.removeClass("active");
                                    ele.prev(".slide")
                                        .addClass("active")
                                        .animate(
                                        {
                                            marginLeft:"0px"
                                        },
                                        options.speed
                                    )
                                    ;
                                    i--;
                                }
                            }
                        }
                    }, ".pdfSlider_button"
                );
            }
        }
    ;

    $.fn.pdfSlider = function (method)
    {
        // Method calling logic
        if (methods[method])
        {
            return methods[ method ].apply(this, Array.prototype.slice.call(arguments, 1));
        }
        else if (typeof method === "object" || !method)
        {
            return methods.init.apply(this, arguments);
        }
        else
        {
            log.echo("Method " + method + " does not exist");

            return false;
        }
    };
})(jQuery);