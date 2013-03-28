
GL.common = (function (GL, $, ko) {
    "use strict";

    var productFactory = (function () {
        var ProductFactory = function (id, name) {
            var self = this;
            self.id = ko.observable(id);
            self.name = ko.observable(name);
            self.removeGrocery = function () {
                GL.emit('deletegrocery', self.id())
            };
            self.removeProduct = function () {
                GL.emit('deleteproduct', self.id())
            };
            self.addToGrocery = function () {
                GL.emit('addproducttogrocerylist', self.id())
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
        GL.pages.showError.click();
    }

    return {
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

