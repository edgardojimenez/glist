
$(document).on("mobileinit", function () {
    $('#MPGroceries').on('pageinit', function () {
        window.grocery.initApp();
        $('#body').removeClass('h');
    });
});
