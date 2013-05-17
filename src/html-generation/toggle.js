var check = require('check-types');
var html = require('pithy');

function makeToggle(id, label) {
    check.verifyString(id, 'missing id');
    check.verifyString(label, 'missing toggle label');
    var toggleElement = html.input({
        class: "toggle",
        type: "button",
        value: label,
        id: id
    });
    return toggleElement;
}

module.exports = makeToggle;