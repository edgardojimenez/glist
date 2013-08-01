/**
 * User: ejimenez
 * Date: 3/30/13
 * Time: 9:31 AM
 * Common functionality used across application
 */
(function (gl, $, ko) {
    'use strict';

    var productFactory = (function () {
        function ProductFactory (id, name) {
            this.id = ko.observable(id);
            this.name = ko.observable(name);
        }

        ProductFactory.prototype = {
            removeGrocery: function () {
                gl.emitter.publish('deletegrocery', this.id())
            },

            removeProduct: function () {
                gl.emitter.publish('deleteproduct', this.id())
            },

            addToGrocery: function () {
                gl.emitter.publish('addproducttogrocerylist', this)
            },

            toggleCheck: function () {
                $(arguments[1].currentTarget).find('img.on').toggle();
                $(arguments[1].currentTarget).find('img.off').toggle();
            }
        };

        return function (id, name) {
            return new ProductFactory(id, name);
        };
    })();
    
    function errorDialog() {
        gl.cache.showError.click();
    }

    function isLocalStorageCacheValid() {
        var ttl = new Date(gl.storage.get('ttl'));
        if (!ttl || dateDifferenceMinutes(ttl, new Date()) > gl.config.environment.ttlMinutes) {
            flushLocalStorage();
            return false;
        }

        return true;
    }

    function flushLocalStorage() {
        gl.storage.clear();
        gl.emitter.publish("cleararray");
        gl.storage.set('ttl', new Date());
    }

    function dateDifferenceMinutes(earlierDate, laterDate) {
        var difference = laterDate.getTime() - earlierDate.getTime();
        return difference/1000/60;
    }

    gl.common =  {
        productFactory: productFactory,
        displayErrorDialog: errorDialog,
        isLocalStorageCacheValid: isLocalStorageCacheValid,
    };

})(GL, jQuery, ko);

