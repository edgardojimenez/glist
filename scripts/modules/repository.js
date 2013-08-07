/**
 * Created with JetBrains WebStorm.
 * User: ejimenez
 * Date: 7/31/13
 * Time: 2:39 PM
 */


(function (gl, $) {
    'use strict';

    function get(key, loaded) {
        var data,
            deferred = $.Deferred();

        deferred
            .fail(gl.common.displayErrorDialog)
            .always(gl.common.hideLoading);

        if (gl.common.hasLocalStorageCacheExpired(key)) {
            return getDb(key);
        }

        if (loaded) {
            deferred.resolve(null);
            return deferred.promise();
        }

        data = JSON.parse(gl.storage.get('gl.' + key));
        if (data && data.length > 0) {
            deferred.resolve(data)
            return deferred.promise();
        }

        return getDb(key);
    }

    function getDb(key) {
        return getData({
            url: gl.config.environment.serverUrl + '/api/{0}'.format(key),
            action: 'GET'
        });
    }

    function remove(key, id) {
        return getData({
            url: gl.config.environment.serverUrl + '/api/{0}/{1}'.format(key, id),
            action: 'DELETE'
        });
    }

    function clearGroceries() {
        return getData({
            url: gl.config.environment.serverUrl + '/api/groceries',
            action: 'DELETE'
        });
    }

    function addProductToGroceryList(product) {
        return getData({
            url: gl.config.environment.serverUrl + '/api/groceries/{0}'.format(product.id()),
            action: 'GET'
        });
    }

    function addProductToProductList(name, addToList) {
        return getData({
            url: gl.config.environment.serverUrl + '/api/products',
            action: 'POST',
            data: { name: name, addToList: addToList }
        });
    }

    // Common
    function persist(key, store) {
        gl.storage.set(key, store)
    }

    function getData(options) {
        return $.ajax({
            type: options.action,
            url: options.url,
            dataType: 'json',
            data: options.data,
            headers: {
                'X-Api-Key': gl.config.environment.apiKey
            }
        }).fail(gl.common.displayErrorDialog).always(gl.common.hideLoading);
    }

    gl.repo = {
        get: get,
        remove: remove,
        clearGroceries: clearGroceries,
        addProductToGroceryList: addProductToGroceryList,
        addProductToProductList: addProductToProductList,
        persist: persist
    };

})(GL, jQuery);
