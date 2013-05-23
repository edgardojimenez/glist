/**
 * User: ejimenez
 * Date: 3/20/13
 * Time: 11:44 PM
 */

(function (gl, win) {
    'use strict';

    var selected, environment, pages,
        prodHost = 'glist.apphb.com';

    environment = {
        production: {
            serverUrl: 'http://mobws.apphb.com',
            apiKey: '49492ABA-1F13-4E02-8ADC-1206FA203858'
        },
        development: {
            serverUrl: 'http://localhost:56665',
            apiKey: '23B5D06B-DC43-42A4-84E2-61A531736155'
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