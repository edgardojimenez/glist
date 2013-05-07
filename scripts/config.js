/**
 * Created with JetBrains WebStorm.
 * User: ejimenez
 * Date: 3/20/13
 * Time: 11:44 PM
 * To change this template use File | Settings | File Templates.
 */

(function (gl, win) {
    'use strict';

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

    function setEnvInternal(env) {
        return selected = environment[env];
    }

    if (win.location.hostname === prodHost) {
        selected = environment.production;
    } else {
        selected = environment.development;
    }

    gl.config = {
        setEnvironment: setEnvInternal,
        environment: selected
    };

})(GL, window);