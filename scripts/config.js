/**
 * Created with JetBrains WebStorm.
 * User: ejimenez
 * Date: 3/20/13
 * Time: 11:44 PM
 * To change this template use File | Settings | File Templates.
 */

config = (function (window, $) {
    "use strict";

    var selected, environment, pages,
        prodHost = 'glist.apphb.com';

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

    pages = {
        groceries: $('#MPGroceries'),
        products: $('#MPProducts'),
        addProduct: $('#MPAddProduct'),
        dialog: $('#MPDialog'),
        error: $('#MPError'),
        showError: $('#show-error-page'),
        showDelete: $('#show-delete-page')
    };

    function setEnvInternal(env) {
        return selected = environment[env];
    }

    (function() {
        if (window.location.hostname === prodHost) {
            selected = environment.production;
        }
        selected = environment.development;

        window.GL = {};
    })();

    return {
        pages: pages,
        setEnvironment: setEnvInternal,
        environment: selected
    };

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