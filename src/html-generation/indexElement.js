var verify = require('check-types').verify;
var html = require('pithy');
var debug = require('debug')('index');

function getIndexWithTooltip(options) {
    verify.object(options, 'missing options object');
    verify.object(options.comment, 'missing api comment object');
    verify.string(options.name, 'missing name');
    debug('index for', options.name, '-', options.comment.getFullName());

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

    var fullName = options.comment.getFullName();
    var indexParts;
    if (options.link) {
        var indexAttributes = {
            href: '#' + options.name,
            class: indexClass,
            title: description
        };
        indexParts = [html.a(indexAttributes, fullName)];
    } else {
        var simpleAttributes = {
            class: indexClass,
            title: description
        };
        indexParts = [html.span(simpleAttributes, fullName)];
    }
    var indexElement = html.div(null, indexParts);
    return indexElement;
}

module.exports = getIndexWithTooltip;
