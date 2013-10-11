/**
 * Created with JetBrains WebStorm.
 * User: ejimenez
 * Date: 8/5/13
 * Time: 4:41 PM
 * To change this template use File | Settings | File Templates.
 */

describe('Test for repository.js module', function() {
    var foo = {id: 0, name: 'Foo'},
        bar = {id: 0, name: 'Bar'}

    beforeEach(function (done) {
        GL.repo.addProductToProductList(foo.name, true).done(function (data) {
            expect(data).to.be.ok();
            expect(data.id).to.not.be(0);
            expect(data.name).to.be(foo.name);

            foo.id = data.id;

            done();
        }).fail(function() {
            expect().fail("Error adding product Foo");
            done();
        });
    });

    afterEach(function (done) {
        GL.repo.clearGroceries().done(function () {
            // remove foo
            GL.repo.remove('products', foo.id).done(function () {
                GL.repo.getData('products').done(function (data) {
                    expect(data).to.be.ok();
                    expect(data).to.not.be.empty(0);

                    data.forEach(function (item) {
                        if (item.name === foo.name)
                            expect().fail("Foo was not removed");
                    });

                    // remove bar
                    if (bar.id > 0) {
                        GL.repo.remove('products', bar.id).done(function () {
                            GL.repo.getData('products').done(function (data) {
                                expect(data).to.be.ok();
                                expect(data).to.not.be.empty(0);

                                data.forEach(function (item) {
                                    if (item.name === bar.name)
                                        expect().fail("Bar was not removed");
                                });

                                done();
                            }).fail(function() {
                                expect().fail("Error getting products");
                                done();
                            });
                        }).fail(function() {
                            expect().fail("Error removing product");
                            done();
                        });
                    } else {
                        done();
                    }
                }).fail(function() {
                    expect().fail("Error getting products");
                    done();
                });
            }).fail(function() {
                expect().fail("Error removing product");
                done();
            });
        }).fail(function() {
            expect().fail("Error removing product");
            done();
        });
    });

    describe('When I add a new product "Bar"', function() {
        it('Should return product "Bar"', function(done) {

            GL.repo.addProductToProductList(bar.name, false).done(function (data) {
                expect(data).to.be.ok();
                expect(data.id).to.not.be(0);
                expect(data.name).to.be(bar.name);

                bar.id = data.id;

                done();
            }).fail(function() {
                expect().fail("Error adding product to grocery list");
                done();
            });
        });
    });

    describe('When I get all products', function() {
        it('Should get a list of products', function(done) {

            GL.repo.clearGroceries().done(function () {
                GL.repo.getData('products').done(function (data) {
                    expect(data).to.be.ok();
                    expect(data).to.not.be.empty(0);

                    done();
                }).fail(function() {
                    expect().fail("Error getting product");
                    done();
                });
            }).fail(function() {
                expect().fail("Error getting product");
                done();
            });
        });
    });

    describe('When I clear the groceries', function() {
        it('Should return a empty groceries list', function(done) {

            GL.repo.clearGroceries().done(function () {
                GL.repo.getData('groceries').done(function (data) {
                    expect(data).to.be.ok();
                    expect(data.length).to.be(0);

                    done();
                }).fail(function() {
                    expect().fail("Error removing groceries");
                    done();
                });

            }).fail(function() {
                expect().fail("Error clear groceries");
                done();
            });
        });
    });

    describe('When I add a new grocery "Foo"', function() {
        it('Should return the new grocery "Foo" on the list', function(done) {

            GL.repo.addProductToGroceryList(foo.id).done(function () {
                GL.repo.getData('groceries').done(function (data) {
                    expect(data).to.be.ok();
                    expect(data.length).to.be(1);
                    expect(data[0].productName).to.be(foo.name);
                    expect(data[0].productId).to.be(foo.id);

                    done();
                }).fail(function() {
                    expect().fail("Error getting groceries");
                    done();
                });

            }).fail(function() {
                expect().fail("Error adding product");
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
            }).fail(function() {
                expect().fail("Error getting groceries");
                done();
            });
        });
    });

    describe('When I remove the grocery "Foo"', function() {
        it('Should return an empty list of groceries', function(done){
            GL.repo.remove('groceries', foo.id).done(function () {
                GL.repo.getData('groceries').done(function (data) {
                    expect(data).to.be.ok();
                    expect(data.length).to.be(0);

                    done();
                }).fail(function() {
                    expect().fail("Error getting groceries");
                    done();
                });

            }).fail(function() {
                expect().fail("Error removing grocery");
                done();
            });
        });
    });
});

