/**
 * User: ejimenez
 * Date: 3/20/13
 * Time: 11:44 PM
 */

(function () {
    if (!String.prototype.format) {
        Object.defineProperty(String.prototype, 'format', {
            value: function () {
                var s = this,
                    i = arguments.length;

                while (i--) {
                    s = s.replace(new RegExp('\\{' + i + '\\}', 'gm'), arguments[i]);
                }
                return s;
            },
            enumerable: false
        });
    }

})();





/**
 * User: ejimenez
 * Date: 3/20/13
 * Time: 11:44 PM
 */
(function(win) {
    win.GL = win.GL || {};
    win.GL.emitter = new win.Medium();
})(window);


