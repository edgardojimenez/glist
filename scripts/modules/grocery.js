/**
 * User: ejimenez
 * Date: 3/30/13
 * Time: 9:31 AM
 * Grocery module, contains the view models and controller
 * for the list groceries screens
 */
(function (gl, $, ko) {
    'use strict';

    var groceryVm = {
            groceryArray: ko.observableArray(),
            setEmptyMessage: function () {
                if (this.groceryArray().length === 0) {
                    this.isDirty = true;
                    return 'No items are on the lists';
                }
    
                return '';
            },
            isDirty: false,
            showList: function () {
                return this.groceryArray().length > 0;
            }
        };
    
    function init() {
        gl.cache.groceries.bind('pageshow', function () {
            $('#body').removeClass('h');

            var isLoaded = groceryVm.groceryArray().length > 0
            gl.repo.getGroceries(isLoaded, function (data) {

                if (data && data.length) {
                    loadGroceries(data);
                    persist();
                }

                if (groceryVm.isDirty) {
                    gl.cache.groceries.find('#listGrocery').listview('refresh');
                    groceryVm.isDirty = false;
                }
            });
        });

        gl.cache.groceries.find('#clear').click(function () {
            var $ok = gl.cache.confirm.find('a#ok');

            $ok.off('click');

            $ok.on("click", function () {
                gl.repo.clearGroceries(function () {
                    var productsToReturn = [];

                    ko.utils.arrayForEach(groceryVm.groceryArray(), function (item) {
                        productsToReturn.push(item);
                    });

                    groceryVm.groceryArray.removeAll();
                    gl.cache.groceries.find('#listGrocery').listview('refresh');

                    gl.emitter.publish('returnproductsbacktolist', productsToReturn);

                    persist();

                    gl.cache.confirm.dialog('close');
                });
            });

            gl.cache.showDelete.click();
        });

        ko.applyBindings(groceryVm, gl.cache.groceries.get(0));

        gl.emitter.subscribe('completeaddingproducttogrocerylist', onAddProductToGroceryList);
        gl.emitter.subscribe('deletegrocery', function (productId) {
            gl.repo.deleteGrocery(productId, function () {
                var grocery = groceryVm.groceryArray.remove(function (item) {
                    return item.id() === parseInt(productId, 10);
                });

                gl.emitter.publish('moveproductbacktolist', grocery[0]);

                gl.cache.groceries.find('#listGrocery').listview('refresh');

                persist();
            });
        });
        gl.emitter.subscribe('cleararray', function() {
            groceryVm.groceryArray.removeAll();
        });

    }

    function onAddProductToGroceryList(newProduct) {
        groceryVm.groceryArray.push(newProduct);
        groceryVm.isDirty = true;

        persist();
    }

    function loadGroceries(data) {
        for (var i = 0; i < data.length; i++) {
            groceryVm.groceryArray.push(gl.common.productFactory(data[i].id || data[i].productId,  data[i].name || data[i].productName));
        }

        //if ($.mobile.activePage && $.mobile.activePage.attr('id') === gl.cache.groceries.attr('id'))
        //    gl.cache.groceries.find('#listGrocery').listview('refresh');
    }

    function persist() {
        gl.repo.persist('gl.groceryarray', ko.toJSON(groceryVm.groceryArray));
    }

    gl.groceries = {
        init: init
    };

})(GL, jQuery, ko);
