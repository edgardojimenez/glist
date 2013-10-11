/**
 * Created by ejimenez on 10/10/13.
 */

/**
 * Created by ejimenez on 10/2/13.
 */

var commonMock = (function ($) {
    'use strict';

    function displayErrorDialog() {
    }

    function hideLoading() {
    }

    function hasLocalStorageCacheExpired(key) {
        return false;
    }


    return {
        displayErrorDialog: displayErrorDialog,
        hideLoading: hideLoading,
        hasLocalStorageCacheExpired: hasLocalStorageCacheExpired
    };

})(jQuery);
