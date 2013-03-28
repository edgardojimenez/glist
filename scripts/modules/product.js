
GL.products = (function (GL, $, ko) {
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
        GL.pages.products.bind("pageshow", function () {
            $('#body').removeClass('h');

            if (productVm.productArray().length === 0)
                getProducts();

            if (productVm.isDirty) {
                GL.pages.products.find("#listProduct").listview("refresh");
                productVm.isDirty = false;
            }
        });

        GL.pages.addProduct.bind("pageshow", function () {
            addProductVm.reset();
        });

        ko.applyBindings(productVm, GL.pages.products.get(0));
        ko.applyBindings(addProductVm, GL.pages.addProduct.get(0));

        GL.on('moveproductbacktolist', onMoveProductBackToList);
        GL.on('returnproductsbacktolist', onReturnProductsbackToList);
        GL.on('deleteproduct', deleteProduct);
        GL.on('addproducttogrocerylist', addProductToGroceryList);
    }

    function onMoveProductBackToList(product) {
        addProduct(product);
        sortProducts();
        productVm.isDirty = true;
    }

    function onReturnProductsbackToList(products) {
        ko.utils.arrayForEach(products, function (item) {
            addToProducts(item);
        });

        sortProducts();
        productVm.isDirty = true;
    }

    function getProducts () {
        return GL.common.getData({
            url: GL.environment.serverUrl + '/api/products',
            action: 'GET'
        }).done(function (data) {
            var i,
                $list = GL.pages.products.find("#listProduct");

            if (data.length === 0)
                return;

            for (i = 0; i < data.length; i++)
                productVm.productArray.push(GL.common.productFactory(data[i].Id, data[i].Name));

            if ($.mobile.activePage && $.mobile.activePage.attr('id') === GL.pages.products.attr('id'))
                $list.listview("refresh");
        }).always(function() {
            $.mobile.hidePageLoadingMsg();
        });
    }

    function addProductToGroceryList(productId) {
        return GL.common.getData({
            url: GL.environment.serverUrl + '/api/groceries/{0}'.format(productId),
            action: 'POST'
        }).done(function() {

            var product = productVm.productArray.remove(function (item) {
                return item.id() === parseInt(productId, 10);
            });

            removeProduct(product[0]);

            GL.emit('addproducttogrocerylist', product[0]);

            groceryVm.isDirty = true;
            $("#MPProducts").find("#listProduct").listview("refresh");
        }).always(function() {
            $.mobile.hidePageLoadingMsg();
        });
    }

    function deleteProduct(id) {
        var $ok = GL.pages.dialog.find('a#ok');

        $ok.off('click');
        $ok.on('click', function () {
            return GL.common.getData({
                url: options.serverUrl + "/home/removeproduct/{0}".format(id),
                action: 'GET'
            }).done(function () {
                var product = productVm.productArray.remove(function (item) {
                    return item.id() === parseInt(id, 10);
                });

                removeProduct(product[0]);

                GL.pages.products.find("#listProduct").listview();

                $page.dialog('close');
            });
        }).always(function () {
            $.mobile.hidePageLoadingMsg();
        });

        GL.pages.showError.click();
    }

    function addProductToProductList(name, addToList) {
        return GL.common.getData({
            url: GL.environment.serverUrl + '/home/addproduct',
            action: 'POST',
            data: { product: name, addToList: addToList }
        }).done(function (data) {
            var newProduct;

            if (!data) {
                GL.common.displayErrorDialog();
                return;
            }

            if (data.Id > 0) {
                newProduct = GL.common.productFactory(data.Id, data.Name);

                if (addToList) {
                    GL.emit('addproducttogrocerylist', newProduct)
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
            productVm.productArray.push(GL.common.productFactory(-1, startingLetter));
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

    return {
        init: init
    }

})(GL, jQuery, ko);
