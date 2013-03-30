
(function (gl, $, ko) {
    "use strict";

    var groceryVm = {
            groceryArray: ko.observableArray(),
            setEmptyMessage: function () {
                if (this.groceryArray().length === 0) {
                    return "No items are on the lists";
                }
    
                return "";
            },
            isDirty: false,
            showList: function () {
                return this.groceryArray().length > 0;
            }
        };
    
    function init(options) {
        gl.cache.groceries.bind("pageshow", function () {
            $('#body').removeClass('h');

            getGroceries();

            if (groceryVm.isDirty) {
                gl.cache.groceries.find("#listGrocery").listview("refresh");
                groceryVm.isDirty = false;
            }
        });

        gl.cache.groceries.find('#clear').click(function () {
            clearGroceries();
        });

        ko.applyBindings(groceryVm, gl.cache.groceries.get(0));

        gl.emitter.on('addproducttogrocerylist', onAddProductToGroceryList);
        gl.emitter.on('deletegrocery', deleteGrocery);
    }

    function onAddProductToGroceryList(newProduct) {
        groceryVm.groceryArray.push(newProduct);
        groceryVm.isDirty = true;
    }
    
    function getGroceries() {
        if (groceryVm.groceryArray().length > 0) return;

        var data = JSON.parse(gl.storage.get('gl.groceryarray'));

        if (data) {
            loadGroceries(data);
            return;
        }

        return gl.common.getData({
            url: gl.config.environment.serverUrl + '/api/groceries',
            action: 'GET'
        }).done(function (data) {
            if (data.length === 0)
                return;

            loadGroceries(data);

            gl.storage.set('gl.groceryarray', JSON.stringify(data));

        }).always(function() {
            $.mobile.hidePageLoadingMsg();
        });
    }

    function loadGroceries(data) {
        for (var i = 0; i < data.length; i++)
            groceryVm.groceryArray.push(gl.common.productFactory(data[i].ProductId, data[i].ProductName));

        if ($.mobile.activePage && $.mobile.activePage.attr('id') === gl.cache.groceries.attr('id'))
            gl.cache.groceries.find("#listGrocery").listview("refresh");
    }

    function deleteGrocery(productId) {
        return gl.common.getData({
            url: gl.config.environment.serverUrl + "/api/groceries/{0}".format(productId),
            action: 'DELETE'
        }).done(function () {
            var grocery = groceryVm.groceryArray.remove(function (item) {
                return item.id() === parseInt(productId, 10);
            });

            gl.emitter.fire('moveproductbacktolist', grocery[0]);

            gl.cache.groceries.find("#listGrocery").listview("refresh");
        }).always(function() {
            $.mobile.hidePageLoadingMsg();
        });
    }

    function clearGroceries() {
        var $ok = gl.cache.dialog.find('a#ok');

        $ok.off('click');

        $ok.on("click", function () {
            return gl.common.getData({
                url: gl.config.environment.serverUrl + "/api/groceries",
                action: 'DELETE'
            }).done(function() {
                var productsToReturn = [];

                ko.utils.arrayForEach(groceryVm.groceryArray(), function (item) {
                    productsToReturn.push(item);
                });

                groceryVm.groceryArray.removeAll();
                gl.cache.groceries.find("#listGrocery").listview("refresh");

                gl.emitter.fire('returnproductsbacktolist', productsToReturn);

                gl.cache.dialog('close');
            }).always(function() {
                $.mobile.hidePageLoadingMsg();
            });

        });

        gl.cache.showDelete.click();
    }

    gl.groceries = {
        init: init
    };

})(GL, jQuery, ko);
