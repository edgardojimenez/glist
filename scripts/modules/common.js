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
            console.log("Not Valid cache")
            return false;
        }

        console.log("Valid cache")
        return true;
    }

    function persist(key, store) {
        gl.storage.set(key, ko.toJSON(store))
    }

    function unPersist(key, store, callback) {
        if (!isLocalStorageCacheValid()) return false;

        if (store().length > 0) return true;

        var data = JSON.parse(gl.storage.get(key));

        if (data && data.length > 0) {
            callback(data);
            return true;
        }

        return false;
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

        persist: persist,

        unPersist: unPersist,

        getData: function(options) {
            $.mobile.showPageLoadingMsg();

            return $.ajax({
                type: options.action,
                url: options.url,
                dataType: 'json',
                data: options.data,
                headers: {
                    'X-Api-Key': gl.config.environment.apiKey
                }
            }).fail(function() {
                errorDialog();
            });
        }
    };

})(GL, jQuery, ko);

