
/**
 * User: ejimenez
 * Date: 3/20/13
 * Time: 11:44 PM
 */
(function(win) {
    'use strict';

    win.GL = win.GL || {};
    win.GL.emitter = new win.Medium();

    win.GL.init = function () {
        win.GL.groceries.init();
        win.GL.products.init();
    };

})(window);
