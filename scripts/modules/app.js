
/**
 * User: ejimenez
 * Date: 3/20/13
 * Time: 11:44 PM
 */
(function(win) {
    'use strict';

    win.GL = win.GL || {};

    GL.emitter = new Medium();

    GL.init = function () {
        GL.groceries.init();
        GL.products.init();
    };

})(window);
