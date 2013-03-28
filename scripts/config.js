/**
 * Created with JetBrains WebStorm.
 * User: ejimenez
 * Date: 3/20/13
 * Time: 11:44 PM
 * To change this template use File | Settings | File Templates.
 */

(function (window, $) {
    "use strict";

    var selected, environment, pages,
        prodHost = 'glist.apphb.com';

    pages = {
        groceries: $('#MPGroceries'),
        products: $('#MPProducts'),
        addProduct: $('#MPAddProduct'),
        dialog: $('#MPDialog'),
        error: $('#MPError'),
        showError: $('#show-error-page'),
        showDelete: $('#show-delete-page')
    };

    environment = {
        production: {
            serverUrl: 'http://mobws.apphb.com'
        },
        development: {
            serverUrl: 'http://localhost:56665'
        },
        stage: {
            serverUrl: ''
        }
    };

    function setEnvInternal(env) {
        return selected = environment[env];
    }

    if (window.location.hostname === prodHost) {
        selected = environment.production;
    } else {
        selected = environment.development;
    }

    $.extend((window.GL = {}), {
        pages: pages,
        setEnvironment: setEnvInternal,
        environment: selected
    }, $.eventEmitter);

})(window, jQuery);


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

}());