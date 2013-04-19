function initToggle(selector) {
    $(selector).click(function() {
        var button = $(this);
        var div = $('#' + this.id + 'd');
        div.toggle('slow', function() {
            button.toggleClass('showing');
        });
    });
}