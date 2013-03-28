
GL.app = (function(GL, $) {
    "use strict";

    var initialize = {

        initGroceriesPage: function () {
            var options = $.extend({}, arguments[0]);
            GL.groceries.init(options);
        },

        initProductsPage: function () {
            var options = $.extend({}, arguments[0]);
            GL.products.init(options);
        },

        initAllPages: function () {
            initialize.initGroceriesPage(arguments[0]);
            initialize.initProductsPage(arguments[0]);
        }
    };

    function initApp () {
        return initialize.initAllPages.apply(this, arguments);
    }

    return {
        init: initApp
    };

})(GL, jQuery);



