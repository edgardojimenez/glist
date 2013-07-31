/**
 * Created with JetBrains WebStorm.
 * User: ejimenez
 * Date: 7/31/13
 * Time: 2:39 PM
 */


(function (gl, $) {
    'use strict';

    function getGroceries(isLoaded, callback) {
        if (gl.common.unPersist('gl.groceryarray', isLoaded, callback)) return;

        return getData({
            url: gl.config.environment.serverUrl + '/api/groceries',
            action: 'GET'
        }).done(function (data) {
            if (data.length === 0)
                return;

            callback(data);

        }).always(function() {
            $.mobile.hidePageLoadingMsg();
        });
    }

    function deleteGrocery() {

    }

    function clearGroceries() {

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
        clearGroceries: clearGroceries
    };

})(GL, jQuery);
