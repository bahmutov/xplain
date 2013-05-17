var check = require('check-types');
var html = require('pithy');

function makeToggle(id, label, visibleByDefault) {
    check.verifyString(id, 'missing id');
    check.verifyString(label, 'missing toggle label');

    // make sure id's don't include invalid characters
    id = id.replace(/[$]/i, '_');

    var toggleClass = 'toggle';
    if (visibleByDefault) {
        toggleClass += ' showing';
    }

    var toggleElement = html.input({
        class: toggleClass,
        type: "button",
        value: label,
        id: id
    });
    return toggleElement;
}

module.exports = makeToggle;