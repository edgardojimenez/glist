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

    function init(options) {
        gl.cache.products.on('pageinit', function () {
            ko.applyBindings(productVm, gl.cache.products.get(0));
        });

        gl.cache.products.on('pageshow', function () {
            $('#body').removeClass('h');

            getProducts();

            if (productVm.isDirty) {
                gl.cache.products.find('#listProduct').listview('refresh');
                productVm.isDirty = false;
            }
        });

        gl.cache.addProduct.on('pageinit', function () {
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
        gl.emitter.subscribe('deleteproduct', deleteProduct);
        gl.emitter.subscribe('addproducttogrocerylist', addProductToGroceryList);
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

    function getProducts () {
        $.mobile.showPageLoadingMsg();
        if (gl.common.unPersist('gl.productarray', productVm.productArray, loadProducts)) {
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

            persist();

        }).always(function() {
            $.mobile.hidePageLoadingMsg();
        });
    }

    function loadProducts(data) {
        for (var i = 0; i < data.length; i++)
            productVm.productArray.push(gl.common.productFactory(data[i].id, data[i].name));

        if ($.mobile.activePage && $.mobile.activePage.attr('id') === gl.cache.products.attr('id'))
            gl.cache.products.find('#listProduct').listview('refresh');
    }

    function addProductToGroceryList(product) {
        return gl.common.getData({
            url: gl.config.environment.serverUrl + '/api/groceries/{0}'.format(product.id()),
            action: 'GET'
        }).done(function() {
            var productId =  parseInt(product.id(), 10);

            var awayProduct = productVm.productArray.remove(function (item) {
                return item.id() === productId;
            });

            removeProduct(awayProduct[0]);

            persist();

            gl.emitter.publish('completeaddingproducttogrocerylist', awayProduct[0]);

            gl.cache.products.find('#listProduct').listview('refresh');
        }).always(function() {
            $.mobile.hidePageLoadingMsg();
        });
    }

    function deleteProduct(id) {
        var $ok = gl.cache.confirm.find('a#ok');

        $ok.off('click');
        $ok.on('click', function () {
            return gl.common.getData({
                url: gl.config.environment.serverUrl + '/api/products/{0}'.format(id),
                action: 'DELETE'
            }).done(function () {
                var product = productVm.productArray.remove(function (item) {
                    return item.id() === parseInt(id, 10);
                });

                removeProduct(product[0]);

                gl.cache.products.find('#listProduct').listview();
                persist();

                gl.cache.confirm.dialog('close');
            }).always(function () {
                $.mobile.hidePageLoadingMsg();
            });
        });

        gl.cache.showDelete.click();
    }

    function addProductToProductList(name, addToList) {
        return gl.common.getData({
            url: gl.config.environment.serverUrl + '/api/products',
            action: 'POST',
            data: { name: name, addToList: addToList }
        }).done(function (data) {
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
            }

            addProductVm.message('Added product  \'{0}\'.'.format(data.name));
            addProductVm.resetInputs();

            persist();
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

    function persist() {
        gl.common.persist('gl.productarray', productVm.productArray);
    }

    gl.products =  {
        init: init
    }

})(GL, jQuery, ko);
