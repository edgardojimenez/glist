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
            return gl.repo.getData(key);
        }

        if (loaded) {
            deferred.resolve(null);
            return deferred.promise();
        }

        data = JSON.parse(gl.storage.get('gl.' + key));
        if (data && data.length > 0) {
            deferred.resolve(data);
            return deferred.promise();
        }

        return gl.repo.getData(key);
    }

    function remove(key, id) {
        return gl.repo.remove(key, id);
    }

    function clearGroceries() {
        return gl.repo.clearGroceries();
    }

    function addProductToGroceryList(productId) {
        return gl.repo.addProductToGroceryList(productId);
    }

    function addProductToProductList(name, addToList) {
        return gl.repo.addProductToProductList(name, addToList);
    }

    // Common
    function persist(key, store) {
        gl.storage.set(key, store)
    }

    gl.service = {
        get: get,
        remove: remove,
        clearGroceries: clearGroceries,
        addProductToGroceryList: addProductToGroceryList,
        addProductToProductList: addProductToProductList,
        persist: persist
    };

})(GL, jQuery);
