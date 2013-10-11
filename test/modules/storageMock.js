/**
 * Created by ejimenez on 10/2/13.
 */

var storageMock = (function ($) {
    'use strict';

    var store = [];

    function get(key) {
        for (var i = 0; i < store.length; i++) {
            if (store[i].key === key)
                return store[i].value;
        }

        return null;
    }

    function set(key, value) {
        store.push({key: key, value: JSON.stringify(value)});
    }


    return {
        get: get,
        set: set
    };

})(jQuery);