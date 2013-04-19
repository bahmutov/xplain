function initToggle(selector) {
    $(selector).click(function() {
        var button = $(this);
        var div = $('#div' + this.id);
        div.toggle('slow', function() {
            button.toggleClass('showing');
        });
    });
}