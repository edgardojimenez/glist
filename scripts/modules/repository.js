/**
 * Created with JetBrains WebStorm.
 * User: ejimenez
 * Date: 7/31/13
 * Time: 2:39 PM
 */


(function (gl, $) {
    'use strict';

    function getData(key) {
        var urlPartial = key === 'groceries' ? '/api/{0}'.format(key) : '/api/products/filtered';

        return getRemote({
            url: gl.config.environment.serverUrl + urlPartial,
            action: 'GET'
        });
    }

    function remove(key, id) {
        return getRemote({
            url: gl.config.environment.serverUrl + '/api/{0}/{1}'.format(key, id),
            action: 'DELETE'
        });
    }

    function clearGroceries() {
        return getRemote({
            url: gl.config.environment.serverUrl + '/api/groceries',
            action: 'DELETE'
        });
    }

    function addProductToGroceryList(productId) {
        return getRemote({
            url: gl.config.environment.serverUrl + '/api/groceries/{0}'.format(productId),
            action: 'GET'
        });
    }

    function addProductToProductList(name, addToList) {
        return getRemote({
            url: gl.config.environment.serverUrl + '/api/products',
            action: 'POST',
            data: { name: name, addToList: addToList }
        });
    }

    function getRemote(options) {
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
        getData: getData,
        remove: remove,
        clearGroceries: clearGroceries,
        addProductToGroceryList: addProductToGroceryList,
        addProductToProductList: addProductToProductList
    };

})(GL, jQuery);
