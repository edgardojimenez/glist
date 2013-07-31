
/**
 * User: ejimenez
 * Date: 3/20/13
 * Time: 11:44 PM
 */
(function(win, $) {
    'use strict';

    win.GL = win.GL || {};
    win.GL.emitter = new win.Medium();

    var initialize = {

        initGroceriesPage: function () {
            var options = $.extend({}, arguments[0]);
            win.GL.groceries.init(options);
        },

        initProductsPage: function () {
            var options = $.extend({}, arguments[0]);
            win.GL.products.init(options);
        },

        initAllPages: function () {
            initialize.initGroceriesPage(arguments[0]);
            initialize.initProductsPage(arguments[0]);
        }
    };

    function initApp () {
        return initialize.initAllPages.apply(this, arguments);
    }

    win.GL.init = initApp;

})(window, jQuery);
