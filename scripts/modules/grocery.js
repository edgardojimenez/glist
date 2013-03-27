
GL.groceries = (function (GL, $, ko) {
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
        GL.pages.groceries.bind("pageshow", function () {
            if (groceryVm.isDirty) {
                GL.pages.groceries.find("#listGrocery").listview("refresh");
                groceryVm.isDirty = false;
            }
        });

        GL.pages.groceries.find('#clear').click(function () {
            g.clearGroceries();
        });

        ko.applyBindings(groceryVm, GL.pages.groceries.get(0));

        GL.on('addproducttogrocerylist', onAddProductToGroceryList);
        GL.on('deletegrocery', deleteGrocery);

    }

    function onAddProductToGroceryList(newProduct) {
        groceryVm.groceryArray.push(newProduct);
        groceryVm.isDirty = true;
    }

    function initData() {
        return getGroceries();
    }
    
    function getGroceries() {
        return GL.common.getData({
            url: GL.environment.serverUrl + '/api/groceries',
            action: 'GET'
        }).done(function (data) {
            var i,
                $list = GL.pages.groceries.find("#listGrocery");

            if (data.length === 0)
                return;

            for (i = 0; i < data.length; i++)
                groceryVm.groceryArray.push(GL.common.productFactory(data[i].ProductId, data[i].ProductName));

            if ($.mobile.activePage && $.mobile.activePage.attr('id') === GL.pages.groceries.attr('id'))
                $list.listview("refresh");

        });
    }

    function deleteGrocery(productId) {
        return GL.common.getData({
            url: GL.environment.serverUrl + "/api/groceries/{0}".format(productId),
            action: 'DELETE'
        }).done(function () {
            var grocery = groceryVm.groceryArray.remove(function (item) {
                return item.id() === parseInt(productId, 10);
            });

            GL.emit('moveproductbacktolist', grocery[0]);

            GL.pages.groceries.find("#listGrocery").listview("refresh");
        });
    }

    function clearGroceries() {
        var $ok = GL.pages.dialog.find('a#ok');

        $ok.off('click');

        $ok.on("click", function () {
            return GL.common.getData({
                url: GL.environment.serverUrl + "/api/groceries",
                action: 'DELETE'
            }).done(function() {
                var productsToReturn = [];

                ko.utils.arrayForEach(groceryVm.groceryArray(), function (item) {
                    productsToReturn.push(item);
                });

                groceryVm.groceryArray.removeAll();
                GL.pages.groceries.find("#listGrocery").listview("refresh");

                gl.emit('returnproductsbacktolist', productsToReturn);

                GL.pages.dialog('close');
            });

        });

        GL.pages.showError.click();
    }

    return {
        init: init,
        initData: initData
    };

})(GL, jQuery, ko);
