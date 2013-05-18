var check = require('check-types');
var html = require('pithy');

function getIndexWithTooltip(apiComment, name) {
    var description = '<strong>' + name + '</strong>';
    var summary = apiComment.getSummary();
    if (summary) {
        var maxLength = 50;
        if (summary.length > maxLength) {
            // should it check if it breaks inside the html element?
            summary = summary.replace(/<\/p>/gi, '');
            if (summary.length > maxLength) {
                summary = summary.substr(0, maxLength) + '...';
            }
        }
        description += summary;
    }
    var indexClass = 'tooltip';
    if (!apiComment.isPublic()) {
        indexClass += ' private';
    }
    if (apiComment.isDeprecated()) {
        indexClass += ' deprecated';
    }
    var indexAttributes = {
        href: '#' + name,
        class: indexClass,
        title: description
    };
    if (!apiComment.isPublic()) {
    }
    var indexParts = [html.a(indexAttributes, name)];
    var indexElement = html.div(null, indexParts);
    return indexElement;
}

module.exports = getIndexWithTooltip;