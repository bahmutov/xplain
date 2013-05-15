function initToggle(selector) {
    $(selector).click(function() {
        var button = $(this);
        var div = $('#' + this.id + 'd');
        div.toggle('fast', function() {
            button.toggleClass('showing');
        });
    });
}