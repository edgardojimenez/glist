/**
 * Created by ejimenez on 10/2/13.
 */

var repoMock = (function ($) {
    'use strict';

    var list = {
            groceries: null,
            products: null
        };

    function getData(key) {
        var deferred = $.Deferred(),
            data = list[key];

        deferred.resolve(data);
        return deferred.promise();
    }

    function remove(key, id) {
        var deferred = $.Deferred(),
            data = list[key],
            removed;

        for (var i = 0; i < data.length; i++) {
            if (data[i].id === id) {
                removed = data.splice(i, 1);
                break;
            }
        }

        if (key === 'groceries') {
            list.products.push(removed);
        }

        deferred.resolve();
        return deferred.promise();
    }

    function clearGroceries() {
        var deferred = $.Deferred(),
            gl = list.groceries,
            pl = list.products;

        for (var i = 0; i < gl.length; i++) {
            pl.push({ 'id': gl[i].id, 'name': gl[i].name });
        }

        list.groceries = [];

        deferred.resolve();
        return deferred.promise();
    }

    function addProductToGroceryList(productId) {
        var deferred = $.Deferred();
        for (var i = 0; i < list.products.length; i++) {
            if (list.products[i].id === productId) {
                list.groceries.push(list.products.splice(i,1)[0]);
                break;
            }
        }

        deferred.resolve();
        return deferred.promise();
    }

    function addProductToProductList(name, addToList) {
        var deferred = $.Deferred(),
            prod, lastId,
            all = list.products.concat(list.groceries);

        for (var i = 0; i < all.length; i++) {
            if (all[i].name === name) {
                deferred.resolve({id: -1, name: name});
                return deferred.promise();
            }
        }

        lastId = list.products.length + 1;

        prod = {id: lastId, name: name};

        if (addToList) {
            list.groceries.push(prod);
        } else {
            list.products.push(prod);
        }

        deferred.resolve(prod);
        return deferred.promise();
    }

    return {
        getData: getData,
        remove: remove,
        clearGroceries: clearGroceries,
        addProductToGroceryList: addProductToGroceryList,
        addProductToProductList: addProductToProductList,
        list: list
    };

})(jQuery);
