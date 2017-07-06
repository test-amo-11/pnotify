// Mobile
(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        // AMD. Register as a module.
        define('pnotify.mobile', ['jquery', 'pnotify'], factory);
    } else if (typeof exports === 'object' && typeof module !== 'undefined') {
        // CommonJS
        module.exports = factory(require('jquery'), require('./pnotify'));
    } else {
        // Browser globals
        factory(root.jQuery, root.PNotify);
    }
}(typeof window !== "undefined" ? window : this, function($, PNotify){
    PNotify.prototype.options.mobile = {
        // Let the user swipe the notice away.
        swipe_dismiss: true,
        // Styles the notice to look good on mobile.
        styling: true
    };
    PNotify.prototype.modules.mobile = {
        swipe_dismiss: true,

        init: function(notice, options){
            var that = this,
                origY = null,
                diffY = null,
                noticeHeight = null;

            this.swipe_dismiss = options.swipe_dismiss;
            this.doMobileStyling(notice, options);

            notice.elem.on({
                "touchstart": function(e){
                    if (!that.swipe_dismiss) {
                        return;
                    }

                    origY = e.originalEvent.touches[0].screenY;
                    noticeHeight = notice.elem.height();
                    notice.container.css("top", "0");
                },
                "touchmove": function(e){
                    e.preventDefault();
                    e.stopPropagation();
                    if (!origY || !that.swipe_dismiss) {
                        return;
                    }

                    var curX = e.originalEvent.touches[0].screenY;

                    diffY = curX - origY;
                    var opacity = (1 - (Math.abs(diffY) / noticeHeight)) * notice.options.opacity;

                    if (diffY < 0) {
                        notice.elem.css("opacity", opacity);
                        notice.container.css("top", diffY);
                    }
                },
                "touchend": function() {
                    if (!origY || !that.swipe_dismiss) {
                        return;
                    }

                    if (diffY < -40) {
                        var goLeft = (diffY < 0) ? noticeHeight * -2 : noticeHeight * 2;
                        notice.elem.animate({"opacity": 0}, 100);
                        notice.container.animate({"top": goLeft}, 100);
                        notice.remove();
                    } else {
                        notice.elem.animate({"opacity": notice.options.opacity}, 100);
                        notice.container.animate({"top": 0}, 100);
                    }
                    origY = null;
                    diffY = null;
                    noticeHeight = null;
                },
                "touchcancel": function(){
                    if (!origY || !that.swipe_dismiss) {
                        return;
                    }

                    notice.elem.animate({"opacity": notice.options.opacity}, 100);
                    notice.container.animate({"top": 0}, 100);
                    origY = null;
                    diffY = null;
                    noticeHeight = null;
                }
            });
        },
        update: function(notice, options){
            this.swipe_dismiss = options.swipe_dismiss;
            this.doMobileStyling(notice, options);
        },
        doMobileStyling: function(notice, options){
            if (options.styling) {
                notice.elem.addClass("ui-pnotify-mobile-able");

                if ($(window).width() <= 480) {
                    if (!notice.options.stack.mobileOrigSpacing1) {
                        notice.options.stack.mobileOrigSpacing1 = notice.options.stack.spacing1;
                        notice.options.stack.mobileOrigSpacing2 = notice.options.stack.spacing2;
                    }
                    notice.options.stack.spacing1 = 0;
                    notice.options.stack.spacing2 = 0;
                } else if (notice.options.stack.mobileOrigSpacing1 || notice.options.stack.mobileOrigSpacing2) {
                    notice.options.stack.spacing1 = notice.options.stack.mobileOrigSpacing1;
                    delete notice.options.stack.mobileOrigSpacing1;
                    notice.options.stack.spacing2 = notice.options.stack.mobileOrigSpacing2;
                    delete notice.options.stack.mobileOrigSpacing2;
                }
            } else {
                notice.elem.removeClass("ui-pnotify-mobile-able");

                if (notice.options.stack.mobileOrigSpacing1) {
                    notice.options.stack.spacing1 = notice.options.stack.mobileOrigSpacing1;
                    delete notice.options.stack.mobileOrigSpacing1;
                }
                if (notice.options.stack.mobileOrigSpacing2) {
                    notice.options.stack.spacing2 = notice.options.stack.mobileOrigSpacing2;
                    delete notice.options.stack.mobileOrigSpacing2;
                }
            }
        }
    };
    return PNotify;
}));
