
(function (gl, $, ko) {
    "use strict";

    var productVm = {
        productArray: ko.observableArray(),
        isDirty: false,
        showList: function () {
            return this.productArray().length > 0;
        }
    };

    var addProductVm = {
        name: ko.observable(""),
        addToList: ko.observable(false),
        message: ko.observable(""),

        addProduct: function () {
            if (this.name().length > 0) {
                addProductToProductList(this.name(), this.addToList());
            } else {
                this.message("No product entered!");
            }
        },

        reset: function () {
            this.name("");
            this.message("");
            this.addToList(false);
            $("#addToList").checkboxradio("refresh");
        },

        resetInputs: function () {
            this.name("");
        }
    };

    function init(options) {
        gl.cache.products.bind("pageshow", function () {
            $('#body').removeClass('h');

            getProducts();

            if (productVm.isDirty) {
                gl.cache.products.find("#listProduct").listview("refresh");
                productVm.isDirty = false;
            }
        });

        gl.cache.addProduct.bind("pageshow", function () {
            addProductVm.reset();
        });

        ko.applyBindings(productVm, gl.cache.products.get(0));
        ko.applyBindings(addProductVm, gl.cache.addProduct.get(0));

        gl.emitter.subscribe('moveproductbacktolist', onMoveProductBackToList);
        gl.emitter.subscribe('returnproductsbacktolist', onReturnProductsBackToList);
        gl.emitter.subscribe('deleteproduct', deleteProduct);
        gl.emitter.subscribe('addproducttogrocerylist', addProductToGroceryList);
    }

    function onMoveProductBackToList(product) {
        addProduct(product);
        sortProducts();
        productVm.isDirty = true;
    }

    function onReturnProductsBackToList(products) {
        ko.utils.arrayForEach(products, function (item) {
            addToProducts(item);
        });

        sortProducts();
        productVm.isDirty = true;
    }

    function getProducts () {
        if (productVm.productArray().length > 0) return;

        $.mobile.showPageLoadingMsg();
        var data = JSON.parse(gl.storage.get('gl.productarray'));

        if (data) {
            loadProducts(data);
            $.mobile.hidePageLoadingMsg();
            return;
        }

        return gl.common.getData({
            url: gl.config.environment.serverUrl + '/api/products',
            action: 'GET'
        }).done(function (data) {
            if (data.length === 0)
                return;

            loadProducts(data);

            gl.storage.set('gl.productarray', JSON.stringify(data));

        }).always(function() {
            $.mobile.hidePageLoadingMsg();
        });
    }

    function loadProducts(data) {
        for (var i = 0; i < data.length; i++)
            productVm.productArray.push(gl.common.productFactory(data[i].Id, data[i].Name));

        if ($.mobile.activePage && $.mobile.activePage.attr('id') === gl.cache.products.attr('id'))
            gl.cache.products.find("#listProduct").listview("refresh");
    }

    function addProductToGroceryList(productId) {
        return gl.common.getData({
            url: gl.config.environment.serverUrl + '/api/groceries/{0}'.format(productId),
            action: 'POST'
        }).done(function() {

            var product = productVm.productArray.remove(function (item) {
                return item.id() === parseInt(productId, 10);
            });

            removeProduct(product[0]);

            gl.emitter.publish('addproducttogrocerylist', product[0]);

            groceryVm.isDirty = true;
            $("#MPProducts").find("#listProduct").listview("refresh");
        }).always(function() {
            $.mobile.hidePageLoadingMsg();
        });
    }

    function deleteProduct(id) {
        var $ok = gl.cache.dialog.find('a#ok');

        $ok.off('click');
        $ok.on('click', function () {
            return gl.common.getData({
                url: options.serverUrl + "/home/removeproduct/{0}".format(id),
                action: 'GET'
            }).done(function () {
                var product = productVm.productArray.remove(function (item) {
                    return item.id() === parseInt(id, 10);
                });

                removeProduct(product[0]);

                gl.cache.products.find("#listProduct").listview();

                $page.dialog('close');
            });
        }).always(function () {
            $.mobile.hidePageLoadingMsg();
        });

        gl.cache.showError.click();
    }

    function addProductToProductList(name, addToList) {
        return gl.common.getData({
            url: gl.config.environment.serverUrl + '/home/addproduct',
            action: 'POST',
            data: { product: name, addToList: addToList }
        }).done(function (data) {
            var newProduct;

            if (!data) {
                gl.common.displayErrorDialog();
                return;
            }

            if (data.Id > 0) {
                newProduct = gl.common.productFactory(data.Id, data.Name);

                if (addToList) {
                    gl.emitter.publish('addproducttogrocerylist', newProduct)
                } else {
                    addToProducts(newProduct);
                    sortProducts();
                    productVm.isDirty = true;
                }
            }

            addProductVm.message(data.Message);
            addProductVm.resetInputs();
        }).always(function() {
            $.mobile.hidePageLoadingMsg();
        });

    }

    function addProduct(product) {
        var startingLetter = product.name().substr(0, 1).toUpperCase();

        var exists = ko.utils.arrayFirst(productVm.productArray(), function (item) {
            return item.name().toUpperCase() === startingLetter;
        });

        if (!exists) {
            productVm.productArray.push(gl.common.productFactory(-1, startingLetter));
        }

        productVm.productArray.push(product);
    }

    function removeProduct(product) {
        var count = 0,
            startingLetter = product.name().substr(0, 1).toUpperCase();

        ko.utils.arrayForEach(productVm.productArray(), function (item) {
            if (item.name().substr(0, 1).toUpperCase() === startingLetter) {
                count++;
            }
        });

        if (count === 1) {
            productVm.productArray.remove(function (item) {
                return item.name() === startingLetter;
            });
        }
    }

    function sortProducts() {
        productVm.productArray.sort(function (item1, item2) {
            return item2.name().toLowerCase() > item1.name().toLowerCase() ? -1 : item2.name().toLowerCase() === item1.name().toLowerCase() ? 0 : 1;
        });
    }

    gl.products =  {
        init: init
    }

})(GL, jQuery, ko);
