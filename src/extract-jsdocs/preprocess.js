// cleans white space in comments to allow dox paring
function preproces(source) {
    var clean = source.replace(/\n\s*@/g, '\n@');
    return clean;
}

module.exports = preproces;