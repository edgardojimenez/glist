/**
 * Created with JetBrains WebStorm.
 * User: ejimenez
 * Date: 7/31/13
 * Time: 2:39 PM
 */


(function (gl, $) {
    'use strict';

    // Groceries
    function getGroceries(isLoaded) {
        var deferred;
        if (unPersist('gl.groceryarray', isLoaded)) {
            deferred = $.Deferred();
            deferred.resolve();
            return deferred.promise();
        }

        return getData({
            url: gl.config.environment.serverUrl + '/api/groceries',
            action: 'GET'
        });
    }

    function deleteGrocery(productId) {
        return getData({
            url: gl.config.environment.serverUrl + '/api/groceries/{0}'.format(productId),
            action: 'DELETE'
        });
    }

    function clearGroceries() {
        return getData({
            url: gl.config.environment.serverUrl + '/api/groceries',
            action: 'DELETE'
        });
    }

    // Products
    function getProducts(isLoaded) {
        var deferred;
        if (unPersist('gl.productarray', isLoaded)) {
            deferred = $.Deferred();
            deferred.resolve();
            return deferred.promise();
        }

        return getData({
            url: gl.config.environment.serverUrl + '/api/products',
            action: 'GET'
        });
    }

    function deleteProduct(id) {
        return getData({
            url: gl.config.environment.serverUrl + '/api/products/{0}'.format(id),
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

    function unPersist(key, loaded, callback) {
        if (!gl.common.isLocalStorageCacheValid()) return false;

        if (loaded) return true;

        var data = JSON.parse(gl.storage.get(key));

        if (data && data.length > 0) {
            callback(data);
            return true;
        }

        return false;
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
        });
    }

    gl.repo = {
        getGroceries: getGroceries,
        deleteGrocery: deleteGrocery,
        clearGroceries: clearGroceries,
        getProducts: getProducts,
        deleteProduct: deleteProduct,
        addProductToGroceryList: addProductToGroceryList,
        addProductToProductList: addProductToProductList,
        persist: persist,
        unPersist: unPersist
    };

})(GL, jQuery);
