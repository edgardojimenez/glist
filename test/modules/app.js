/**
 * User: ejimenez
 * Date: 8/5/13
 * Time: 4:40 PM
 */
console.log('hi');

var Medium = function () {};

var GL = require('./../../scripts/modules/app');

describe('Test for app.js module', function() {

    describe('When loading app.js', function() {

        it('Should have an object GL as the namespace', function(){
            expect(GL).to.be.ok();
            expect(GL).to.be.a('object');
        });

        it('Should have GL with object emitter', function(){
            expect(GL.emitter).to.be.ok();
            expect(GL.emitter).to.be.an('object');
        });

        it('Should have GL with function init', function(){
            expect(GL.init).to.be.ok();
            expect(GL.init).to.be.a('function');
        });

    });
});

