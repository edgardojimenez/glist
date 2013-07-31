/**
 * Created with JetBrains WebStorm.
 * User: ejimenez
 * Date: 7/31/13
 * Time: 2:39 PM
 */


(function (gl, $) {
    'use strict';

    // Groceries
    function getGroceries(isLoaded, callback) {
        if (unPersist('gl.groceryarray', isLoaded, callback)) {
            callback();
            return;
        }

        return getData({
            url: gl.config.environment.serverUrl + '/api/groceries',
            action: 'GET'
        }).done(function (data) {

            callback(data);

        }).always(function() {
            $.mobile.hidePageLoadingMsg();
        });
    }

    function deleteGrocery(productId, callback) {
        return gl.common.getData({
            url: gl.config.environment.serverUrl + '/api/groceries/{0}'.format(productId),
            action: 'DELETE'
        }).done(function () {

            callback();

        }).always(function() {
            $.mobile.hidePageLoadingMsg();
        });
    }

    function clearGroceries(callback) {
        return gl.common.getData({
            url: gl.config.environment.serverUrl + '/api/groceries',
            action: 'DELETE'
        }).done(function() {
            callback();
        }).always(function() {
            $.mobile.hidePageLoadingMsg();
        });
    }

    // Products


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
            gl.common.displayErrorDialog();
        });
    }

    gl.repo = {
        getGroceries: getGroceries,
        deleteGrocery: deleteGrocery,
        clearGroceries: clearGroceries,
        persist: persist,
        unPersist: unPersist
    };

})(GL, jQuery);
