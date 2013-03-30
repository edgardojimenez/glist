/**
 * Created with JetBrains WebStorm.
 * User: ejimenez
 * Date: 3/30/13
 * Time: 8:55 AM
 * To change this template use File | Settings | File Templates.
 */

(function (gl, win) {

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

    gl.storage = {
        get: get,
        set: set
    };

})(GL, window)
