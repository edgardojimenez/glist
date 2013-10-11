/**
 * Created by ejimenez on 10/2/13.
 */

describe('Test for service.js module', function() {

    before(function () {
        GL.repo = repoMock;
        GL.storage = storageMock;
        GL.common = commonMock;

        GL.repo.list.groceries = [{"id":1,"name":"Cereal"},{"id":2,"name":"Apples"},{"id":3,"name":"Bananas"}];
        GL.repo.list.products = [{"id":4,"name":"Beer"},{"id":5,"name":"Wine"},{"id":6,"name":"Bacon"},{"id":7,"name":"Oranges"}];
    });

    describe('When I add a new product "Butter" to the product list', function() {
        it('Should add "Butter" the products list', function(done){
            var count = GL.repo.list.products.length,
                product = 'Butter';

            GL.service.addProductToProductList(product, false).done(function() {
                var lastProduct = GL.repo.list.products[count];

                expect(GL.repo.list.products).to.have.length(count + 1);
                expect(lastProduct.name).to.be(product);

                done();
            }).fail(function () {
                expect().to.fail("Error adding product to product list");
                done();
            });
        });
    });

    describe('When I add a new product "Bread" to the grocery list', function() {
        it('Should add "Bread" the grocery list', function(done){
            var count = GL.repo.list.groceries.length,
                product = 'Bread';

            GL.service.addProductToProductList(product, true).done(function() {
                var lastGrocery = GL.repo.list.groceries[count];
                var lastProduct = GL.repo.list.products[GL.repo.list.products.length - 1];

                expect(GL.repo.list.groceries).to.have.length(count + 1);
                expect(lastGrocery.name).to.be(product);
                expect(lastProduct.name).to.not.be(product);

                done();
            }).fail(function () {
                expect().to.fail("Error adding product and grocery list");
                done();
            });
        });
    });

    describe('When I add a product that already exists', function() {
        it('Should not add the product', function(done){
            var count = GL.repo.list.products.length,
                product = 'Beer';

            GL.service.addProductToProductList(product, false).done(function(data) {
                var lastProduct = GL.repo.list.products[count - 1];

                expect(GL.repo.list.products).to.have.length(count);
                expect(data.id).to.be(-1);
                expect(lastProduct.name).to.not.be(product);

                done();
            }).fail(function () {
                expect().to.fail("Error adding product to product list");
                done();
            });
        });
    });

    describe('When I add a product from the product list to the grocery list', function() {
        it('Should be in the grocery list and not in the products', function(done){
            var products = [],
                productId = 5,
                product = 'Wine';

            GL.service.addProductToGroceryList(productId).done(function() {
                var lastGrocery = GL.repo.list.groceries[GL.repo.list.groceries.length - 1];
                expect(lastGrocery.name).to.be(product);

                for (var i = 0; i < GL.repo.list.products.length; i++) {
                    if (GL.repo.list.products[i].name === product)
                        products.push(product);
                }

                expect(products).to.be.empty();

                done();
            }).fail(function () {
                expect().to.fail("Error adding product to grocery list");
                done();
            });
        });
    });

    describe('When I remove a product from the grocery list', function() {
        it('Should not be in the grocery list', function(done){
            var productId = 5,
                product = 'Wine';

            GL.service.remove('groceries', productId).done(function() {
                for (var i = 0; i < GL.repo.list.groceries.length; i++) {
                    if (GL.repo.list.groceries[i].name === product)
                        expect().to.fail("error grocery was not removed from list");
                }

                done();
            }).fail(function () {
                expect().to.fail("Error removing product from grocery list");
                done();
            });
        });
    });

    describe('When I delete a product from the product list', function() {
        it('Should not be in the product list', function(done){
            var productId = 6,
                product = 'Bacon';

            GL.service.remove('products', productId).done(function() {
                for (var i = 0; i < GL.repo.list.products.length; i++) {
                    if (GL.repo.list.products[i].name === product)
                        expect().to.fail("error product was not removed from list");
                }

                done();
            }).fail(function () {
                expect().to.fail("Error removing product to product list");
                done();
            });
        });
    });

    describe('When I get all products from the grocery list', function() {
        it('Should be have products in the grocery list', function(done){

            GL.service.get('groceries', false).done(function(data) {
                expect(data).to.be.ok();
                expect(data.length).to.be.above(0);

                done();
            }).fail(function () {
                expect().to.fail("Error retrieving the grocery list");
                done();
            });
        });
    });

    describe('When I get all products from the product list', function() {
        it('Should be have products in the product list', function(done){

            GL.service.get('products', false).done(function(data) {
                expect(data).to.be.ok();
                expect(data.length).to.be.above(0);

                done();
            }).fail(function () {
                expect().to.fail("Error retrieving the products list");
                done();
            });
        });
    });

    describe('When I clear the grocery list', function() {
        it('Should not be any products in the grocery list', function(done) {

            GL.service.clearGroceries().done(function() {
                expect(GL.repo.list.groceries).to.have.length(0);

                done();
            }).fail(function () {
                expect().to.fail("Error retrieving the products list");
                done();
            });
        });
    });

    describe('When I persist a product in local storage', function() {
        it('Should exist in local storage', function(done){
            var key = 'gl.products',
                product = [{"id":4,"name":"Beer"},{"id":5,"name":"Wine"}];

            GL.service.persist(key, product);

            GL.service.get('products', false).done(function (stored) {
                expect(stored).to.be.ok();
                expect(stored).to.have.length(2);

                done();
            }).fail(function () {
                expect().to.fail("Error getting data from local storage")
                done();
            });
        });
    });
});