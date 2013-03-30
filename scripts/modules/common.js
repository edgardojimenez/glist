
(function (gl, $, ko) {
    "use strict";

    var productFactory = (function () {
        var ProductFactory = function (id, name) {
            var self = this;
            self.id = ko.observable(id);
            self.name = ko.observable(name);
            self.removeGrocery = function () {
                gl.emitter.fire('deletegrocery', self.id())
            };
            self.removeProduct = function () {
                gl.emitter.fire('deleteproduct', self.id())
            };
            self.addToGrocery = function () {
                gl.emitter.fire('addproducttogrocerylist', self.id())
            };
            self.toggleCheck = function () {
                $(arguments[1].currentTarget).find('img.on').toggle();
                $(arguments[1].currentTarget).find('img.off').toggle();
            };
        };

        return function (id, name) {
            return new ProductFactory(id, name);
        };
    })();
    
    function errorDialog() {
        gl.cache.showError.click();
    }

    gl.common =  {
        productFactory: productFactory,

        displayErrorDialog: errorDialog,

        getData: function(options) {
            $.mobile.showPageLoadingMsg();

            return $.ajax({
                type: options.action,
                url: options.url,
                dataType: 'json',
                data: options.data
            }).fail(function() {
                errorDialog();
            });
        }
    };

})(GL, jQuery, ko);

