function initToggle(selector) {
    $(selector).click(function() {
        var button = $(this);
        var div = $('#source_' + this.id);
        div.toggle('fast', function() {
            button.toggleClass('showing');
        });
    });
}