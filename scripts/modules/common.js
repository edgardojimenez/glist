
(function (gl, $, ko) {
    "use strict";

    var productFactory = (function () {
        var ProductFactory = function (id, name) {
            var self = this;
            self.id = ko.observable(id);
            self.name = ko.observable(name);
            self.removeGrocery = function () {
                gl.emitter.publish('deletegrocery', self.id())
            };
            self.removeProduct = function () {
                gl.emitter.publish('deleteproduct', self.id())
            };
            self.addToGrocery = function () {
                gl.emitter.publish('addproducttogrocerylist', self.id())
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

    function persist(key, store) {
        gl.storage.set(key, ko.toJSON(store))
    }

    function unPersist(key, store, callback) {
        if (store().length > 0) return true;

        var data = JSON.parse(gl.storage.get(key));

        if (data && data.length > 0) {
            callback(data);
            return true;
        }

        return false;
    }

    gl.common =  {
        productFactory: productFactory,

        displayErrorDialog: errorDialog,

        persist: persist,

        unPersist: unPersist,

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

