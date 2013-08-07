/**
 * User: ejimenez
 * Date: 3/30/13
 * Time: 9:31 AM
 * Product module, contains the view models and controller
 * for the list products and add products screens
 */

(function (gl, $, ko) {
    'use strict';

    var productVm = {
        productArray: ko.observableArray(),
        isDirty: false,
        showList: function () {
            return this.productArray().length > 0;
        }
    };

    var addProductVm = {
        name: ko.observable(''),
        addToList: ko.observable(),
        message: ko.observable(''),

        addProduct: function () {
            if (this.name().length > 0) {
                addProductToProductList(this.name(), this.addToList());
            } else {
                this.message('No product entered!');
            }
        },

        reset: function () {
            this.name('');
            this.message('');
            this.addToList(false);
        },

        resetInputs: function () {
            this.name('');
        }
    };

    function init() {
        ko.applyBindings(productVm, gl.cache.products.get(0));

        gl.cache.products.on('pageshow', function () {
            $('#body').removeClass('h');

            gl.common.showLoading();
            var isLoaded = productVm.productArray().length > 0;
            gl.repo.get('products', isLoaded).done(function (data) {

                if (data && data.length > 0) {
                    loadProducts(data);
                    persist();
                }

                if (productVm.isDirty) {
                    gl.cache.products.find('#listProduct').listview('refresh');
                    productVm.isDirty = false;
                }

            });
        });

        gl.cache.addProduct.on('pageinit', function () {
            $('#body').removeClass('h');
            ko.bindingHandlers.jqmChecked = {
                init: function (element, valueAccessor) {

                    if (element.type != "checkbox") return;

                    var modelValue = valueAccessor();

                    $(element).on('click', function () {
                        if (ko.utils.unwrapObservable(modelValue))
                            modelValue(false);
                        else
                            modelValue(true);
                    });
                },

                update: function (element, valueAccessor) {
                    if (element.type != "checkbox") return;

                    var unwrappedValue = ko.utils.unwrapObservable(valueAccessor());
                    if (unwrappedValue === undefined) return;

                    if (unwrappedValue)
                        $(element).prop('checked', 'checked').checkboxradio('refresh');
                    else
                        $(element).removeAttr('checked').checkboxradio('refresh');
                }
            };

            ko.applyBindings(addProductVm, gl.cache.addProduct.get(0));
        });

        gl.cache.addProduct.on('pageshow', function () {
            addProductVm.reset();
        });

        gl.emitter.subscribe('moveproductbacktolist', onMoveProductBackToList);

        gl.emitter.subscribe('returnproductsbacktolist', onReturnProductsBackToList);

        gl.emitter.subscribe('deleteproduct', function (id) {
            var $ok = gl.cache.confirm.find('a#ok');

            $ok.off('click');
            $ok.on('click', function () {
                gl.common.showLoading();
                gl.repo.remove('products', id).done(function () {
                    var product = productVm.productArray.remove(function (item) {
                        return item.id() === parseInt(id, 10);
                    });

                    removeProduct(product[0]);

                    gl.cache.products.find('#listProduct').listview();
                    persist();

                    gl.cache.confirm.dialog('close');
                });
            });

            gl.cache.showDelete.click();
        });

        gl.emitter.subscribe('addproducttogrocerylist', function (product) {
            gl.common.showLoading();
            gl.repo.addProductToGroceryList(product).done(function () {
                var productId =  parseInt(product.id(), 10);

                var awayProduct = productVm.productArray.remove(function (item) {
                    return item.id() === productId;
                });

                removeProduct(awayProduct[0]);

                persist();

                gl.emitter.publish('completeaddingproducttogrocerylist', awayProduct[0]);

                gl.cache.products.find('#listProduct').listview('refresh');
            });
        });

        gl.emitter.subscribe('clearstorageproducts', function() {
            productVm.productArray.removeAll();
        });
    }

    function onMoveProductBackToList(product) {
        addProduct(product);
        sortProducts();
        productVm.isDirty = true;
        persist();
    }

    function onReturnProductsBackToList(products) {
        ko.utils.arrayForEach(products, function (item) {
            addProduct(item);
        });

        sortProducts();
        productVm.isDirty = true;
        persist();
    }

    function loadProducts(data) {
        for (var i = 0; i < data.length; i++)
            productVm.productArray.push(gl.common.productFactory(data[i].id, data[i].name));

        productVm.isDirty = true
    }

    function addProductToProductList(name, addToList) {
        gl.common.showLoading();
        gl.repo.addProductToProductList(name, addToList).done(function (data) {
            var newProduct;

            if (!data) {
                gl.common.displayErrorDialog();
                return;
            }

            if (data.id > 0) {
                newProduct = gl.common.productFactory(data.id, data.name);

                if (addToList) {
                    gl.emitter.publish('completeaddingproducttogrocerylist', newProduct)
                } else {
                    addProduct(newProduct);
                    sortProducts();
                    productVm.isDirty = true;
                    persist();
                }

                addProductVm.message('Added product  \'{0}\'.'.format(data.name));
            } else if (data.id === -1) {
                addProductVm.message('Product  \'{0}\' exists.'.format(data.name));
            }

            addProductVm.resetInputs();

            persist();
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

    function persist() {
        gl.repo.persist('gl.products', ko.toJSON(productVm.productArray));
    }

    gl.products =  {
        init: init
    }

})(GL, jQuery, ko);
