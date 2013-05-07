/**
 * User: ejimenez
 * Date: 3/30/13
 * Time: 9:31 AM
 */


(function(gl, $) {
    'use strict';

    var initialize = {

        initGroceriesPage: function () {
            var options = $.extend({}, arguments[0]);
            gl.groceries.init(options);
        },

        initProductsPage: function () {
            var options = $.extend({}, arguments[0]);
            gl.products.init(options);
        },

        initAllPages: function () {
            initialize.initGroceriesPage(arguments[0]);
            initialize.initProductsPage(arguments[0]);
        }
    };

    function initApp () {
        return initialize.initAllPages.apply(this, arguments);
    }

    gl.main =  {
        init: initApp
    };

})(GL, jQuery);



