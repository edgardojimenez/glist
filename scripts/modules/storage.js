/**
 * User: ejimenez
 * Date: 3/30/13
 * Time: 8:55 AM
 */

(function (gl, win) {
    'use strict';

    function get(key) {
        if (!win.localStorage) return;

        if (!key) return;

        if (arguments.length > 1)
            return win.localStorage.getItem(key) || arguments[1];

        return win.localStorage.getItem(key)
    }

    function set(key, value) {
        if (!win.localStorage) return;

        if (!key || !value) return;

        return win.localStorage.setItem(key, value);
    }

    function clear(key) {
        win.localStorage.removeItem(key);
    }

    gl.storage = {
        get: get,
        set: set,
        clear: clear
    };

})(GL, window);
