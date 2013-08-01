/*
* start of the application
 */
$(document).on('mobileinit', function () {
    console.log('mobileinit');
    $.mobile.defaultDialogTransition = 'none';
    $.mobile.defaultPageTransition = 'none';

    GL.cache.groceries.on('pageinit', function () {
        console.log('groceries pageinit');
        //GL.init();
        GL.groceries.init();
    });

    GL.cache.products.on('pageinit', function () {
        console.log('products pageinit');
        GL.products.init();
    });
});
