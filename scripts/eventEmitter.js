/**
 * Created with JetBrains WebStorm.
 * User: ejimenez
 * Date: 3/20/13
 * Time: 11:41 PM
 * To change this template use File | Settings | File Templates.
 */

(function(gl, jQuery) {

    gl.emitter = {
        _JQInit: function() {
            this._JQ = jQuery(this);
        },
        fire: function(evt, data) {
            !this._JQ && this._JQInit();
            this._JQ.trigger(evt, data);
        },
        once: function(evt, handler) {
            !this._JQ && this._JQInit();
            this._JQ.one(evt, handler);
        },
        on: function(evt, handler) {
            !this._JQ && this._JQInit();
            this._JQ.bind(evt, handler);
        },
        off: function(evt, handler) {
            !this._JQ && this._JQInit();
            this._JQ.unbind(evt, handler);
        }
    };

}(GL, jQuery));