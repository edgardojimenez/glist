/*
* start of the application
 */
$(document).on('mobileinit', function () {
    $.mobile.defaultDialogTransition = 'none';
    $.mobile.defaultPageTransition = 'none';

    GL.cache.groceries.on('pageinit', function () {
        GL.groceries.init();
    });

    GL.cache.products.on('pageinit', function () {
        GL.products.init();
    });
});
