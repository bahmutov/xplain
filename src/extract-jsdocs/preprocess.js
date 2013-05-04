// cleans white space in comments to allow dox paring
// dox also has problem parsing comments having just tags
// so add some dummy text
function preproces(source) {
    var clean = source.replace(/\n\s*@/g, '\n@');
    // tags that are common by themselves without description text
    clean = clean.replace(/\/\*\*\s*@sample/gi, '/**\nsample\n@sample');
    clean = clean.replace(/\/\*\*\s*@example/gi, '/**\nexample\n@example');
    clean = clean.replace(/\/\*\*\s*@module/gi, '/**\nmodule\n@module');
    return clean;
}

module.exports = preproces;