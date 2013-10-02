/**
 * Created with JetBrains WebStorm.
 * User: ejimenez
 * Date: 8/5/13
 * Time: 4:41 PM
 * To change this template use File | Settings | File Templates.
 */

describe('Test for repository.js module', function() {
    var id = 0,
        name = 'Foo';

    before(function (done) {
        GL.repo.addProductToProductList(name, false).done(function (data) {
            expect(data).to.be.ok();
            expect(data.id).to.not.be(0);
            expect(data.name).to.be(name);

            id = data.id;

            done();
        });
    });

    after(function (done) {
        GL.repo.remove('products', id).done(function () {

            GL.repo.getData('products').done(function (data) {
                expect(data).to.be.ok();
                expect(data).to.not.be.empty(0);

                data.forEach(function (item) {
                    if (item.name === name)
                        expect().fail("Foo was not removed")
                });

                done();
            });
        });
    });

    describe('When I add a new product "Bar" ', function() {
        it('Should get product foo back from the list', function(done){
            var name = "Bar",
                id = 0;

            GL.repo.addProductToProductList(name, false).done(function (data) {
                expect(data).to.be.ok();
                expect(data.id).to.not.be(0);
                expect(data.name).to.be(name);

                id = data.id;

                GL.repo.remove('products', id).done(function () {

                    GL.repo.getData('products').done(function (data) {
                        expect(data).to.be.ok();
                        expect(data).to.not.be.empty(0);

                        data.forEach(function (item) {
                            if (item.name === name)
                                expect().fail("Bar was not removed")
                        });

                        done();
                    });
                });
            });
        });
    });

    describe('When I get all products', function() {
        it('Should get a list of products', function(done){

            GL.repo.getData('products').done(function (data) {
                expect(data).to.be.ok();
                expect(data).to.not.be.empty(0);
            });

            done();
        });
    });

    describe('When I clear the groceries', function() {
        it('Should return a empty groceries list', function(done){
            GL.repo.clearGroceries().done(function () {

                GL.repo.getData('groceries').done(function (data) {
                    expect(data).to.be.ok();
                    expect(data.length).to.be(0);
                });

                done();
            });
        });
    });

    describe('When I add a new grocery "Foo"', function() {
        it('Should return the new grocery "Foo" on the list', function(done){

            GL.repo.addProductToGroceryList(id).done(function () {

                GL.repo.getData('groceries').done(function (data) {
                    expect(data).to.be.ok();
                    expect(data.length).to.be(1);
                    expect(data[0].productName).to.be(name);
                    expect(data[0].productId).to.be(id);

                });

                done();
            });
        });
    });

    describe('When I get all groceries', function() {
        it('Should return only one grocery on the list', function(done){

            GL.repo.getData('groceries').done(function (data) {

                expect(data).to.be.ok();
                expect(data.length).to.be(1);

                done();
            });
        });
    });

    describe('When I remove the grocery "Foo"', function() {
        it('Should return an empty list of groceries', function(done){

            GL.repo.remove('groceries', id).done(function () {

                GL.repo.getData('groceries').done(function (data) {
                    expect(data).to.be.ok();
                    expect(data.length).to.be(0);
                });

                done();
            });
        });
    });

    describe('When I remove the product "Bar"', function() {
        it('Should not be in the list of products', function(done){
            var name = "Bar",
                id = 0;

            GL.repo.addProductToProductList(name, false).done(function (data) {
                expect(data).to.be.ok();
                expect(data.id).to.not.be(0);
                expect(data.name).to.be(name);

                id = data.id;

                GL.repo.remove('products', id).done(function () {

                    GL.repo.getData('products').done(function (data) {
                        expect(data).to.be.ok();
                        expect(data).to.not.be.empty(0);

                        data.forEach(function (item) {
                            if (item.name === name)
                                expect().fail("Bar was not removed")
                        });

                        done();
                    });
                });
            });
        });
    });
});

