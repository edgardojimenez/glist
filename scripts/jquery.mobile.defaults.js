$(document).on("mobileinit", function () {
    $.mobile.defaultDialogTransition = 'none';
    $.mobile.defaultPageTransition = 'none';

    GL.pages.groceries.on('pageinit', function () {
        GL.app.init();
    });
});
