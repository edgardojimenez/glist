
GL.app = (function(GL, $, ko, config) {
    "use strict";

    $.extend(GL, $.eventEmitter);
    $.extend(GL, config);

    var initialize = {

        initGroceriesPage: function () {
            var options = $.extend({}, arguments[0]);
            GL.groceries.init(options);
        },

        initProductsPage: function () {
            var options = $.extend({}, arguments[0]);
            GL.products.init(options);
        },

        initData: function () {
            var options = $.extend({}, arguments[0]);

            GL.groceries.initData().always(function () {
                $('#body').removeClass('h');
            });
        },

        initAllPages: function () {
            initialize.initGroceriesPage(arguments[0]);
            initialize.initProductsPage(arguments[0]);
            initialize.initData(arguments[0]);
        }
    };

    function initApp () {
        $.mobile.showPageLoadingMsg();
        return initialize.initAllPages.apply(this, arguments);
    }

    return {
        init: initApp
    };

})(GL, jQuery, ko, config);



