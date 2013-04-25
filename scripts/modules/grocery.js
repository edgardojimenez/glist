
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

        gl.emitter.subscribe('completeaddingproducttogrocerylist', onAddProductToGroceryList);
        gl.emitter.subscribe('deletegrocery', deleteGrocery);
    }

    function onAddProductToGroceryList(newProduct) {
        groceryVm.groceryArray.push(newProduct);
        groceryVm.isDirty = true;

        persist();
    }
    
    function getGroceries() {
        if (gl.common.unPersist('gl.groceryarray', groceryVm.groceryArray, loadGroceries)) return;

        return gl.common.getData({
            url: gl.config.environment.serverUrl + '/api/groceries',
            action: 'GET'
        }).done(function (data) {
            if (data.length === 0)
                return;

            loadGroceries(data);

            persist();

        }).always(function() {
            $.mobile.hidePageLoadingMsg();
        });
    }

    function loadGroceries(data) {
        for (var i = 0; i < data.length; i++) {
            groceryVm.groceryArray.push(gl.common.productFactory(data[i].id || data[i].productId,  data[i].name || data[i].productName));
        }

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

            gl.emitter.publish('moveproductbacktolist', grocery[0]);

            gl.cache.groceries.find("#listGrocery").listview("refresh");

            persist();

        }).always(function() {
            $.mobile.hidePageLoadingMsg();
        });
    }

    function clearGroceries() {
        var $ok = gl.cache.confirm.find('a#ok');

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

                gl.emitter.publish('returnproductsbacktolist', productsToReturn);

                persist();

                gl.cache.confirm.dialog('close');
            }).always(function() {
                $.mobile.hidePageLoadingMsg();
            });
        });

        gl.cache.showDelete.click();
    }

    function persist() {
        gl.common.persist('gl.groceryarray', groceryVm.groceryArray);
    }

    gl.groceries = {
        init: init
    };

})(GL, jQuery, ko);
