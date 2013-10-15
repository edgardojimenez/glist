/**
 * User: ejimenez
 * Date: 3/30/13
 * Time: 9:31 AM
 * Common functionality used across application
 */
(function (gl, $, ko) {
    'use strict';

    var productFactory = (function () {
        function Product (id, name) {
            this.id = ko.observable(id);
            this.name = ko.observable(name);
        }

        Product.prototype = {
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
            return new Product(id, name);
        };
    })();
    
    function errorDialog() {
        gl.cache.showError.click();
    }

    function hideLoading() {
        $.mobile.hidePageLoadingMsg();
    }

    function showLoading() {
        $.mobile.showPageLoadingMsg();
    }

    function hasLocalStorageCacheExpired(key) {
        var ttlType = "ttl." + key;
        var ttl = new Date(gl.storage.get(ttlType));
        if (!ttl || dateDifferenceMinutes(ttl, new Date()) > gl.config.environment.ttlMinutes) {
            flushLocalStorage(key);
            return true;
        }

        return false;
    }

    function flushLocalStorage(key) {
        gl.storage.clear('ttl.' + key);
        gl.storage.clear('gl' + key);
        gl.emitter.publish("clearstorage" + key);
        gl.storage.set('ttl.' + key, new Date());
    }

    function dateDifferenceMinutes(earlierDate, laterDate) {
        var difference = laterDate.getTime() - earlierDate.getTime();
        return difference/1000/60;
    }

    gl.common =  {
        productFactory: productFactory,
        displayErrorDialog: errorDialog,
        hasLocalStorageCacheExpired: hasLocalStorageCacheExpired,
        showLoading: showLoading,
        hideLoading: hideLoading
    };

})(GL, jQuery, ko);

