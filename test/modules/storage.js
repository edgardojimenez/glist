/**
 * User: ejimenez
 * Date: 8/9/13
 * Time: 5:36 PM
*/

describe('Test for storage.js module', function() {

    describe('When I store the value "foo" on key "foo"', function() {
        it('Should be stored', function(){
            GL.storage.set('foo', 'foo');
            var foo = GL.storage.get('foo');

            expect(foo).to.be.ok();
            expect(foo).to.be.equal('foo');
        });
    });

    describe('When I retrieve the value "foo" on key "foo"', function() {
        it('Should retrieve the value "foo"', function(){
            var foo = GL.storage.get('foo');

            expect(foo).to.be.ok();
            expect(foo).to.be.equal('foo');
        });
    });

    describe('When I clear the value "foo" on key "foo"', function() {
        it('Should return a value of null', function(){
            GL.storage.clear('foo');

            var foo = GL.storage.get('foo');

            expect(foo).to.not.be.ok();
            expect(foo).to.be.equal(null);
        });
    });
});