$(document).on('mobileinit', function () {
    $.mobile.defaultDialogTransition = 'none';
    $.mobile.defaultPageTransition = 'none';

    GL.cache.groceries.on('pageinit', function () {
        GL.main.init();
    });
});
