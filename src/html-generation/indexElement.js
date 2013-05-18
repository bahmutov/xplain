var check = require('check-types');
var html = require('pithy');

function getIndexWithTooltip(options) {
    check.verifyObject(options, 'missing options object');

    check.verifyObject(options.comment, 'missing api comment object');
    check.verifyString(options.name, 'missing name');

    var description = '<strong>' + options.name + '</strong>';
    var summary = options.comment.getSummary();
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
    if (!options.comment.isPublic()) {
        indexClass += ' private';
    }
    if (options.comment.isDeprecated()) {
        indexClass += ' deprecated';
    }
    if (options.className) {
        indexClass += ' ' + options.className;
    }

    var indexParts;
    if (options.link) {
        var indexAttributes = {
            href: '#' + options.name,
            class: indexClass,
            title: description
        };
        indexParts = [html.a(indexAttributes, options.name)];
    } else {
        var indexAttributes = {
            class: indexClass,
            title: description
        };
        indexParts = [html.span(indexAttributes, options.name)];
    }
    var indexElement = html.div(null, indexParts);
    return indexElement;
}

module.exports = getIndexWithTooltip;