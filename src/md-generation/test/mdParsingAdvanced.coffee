MdParser = require '../mdParsing'
eol = require('os').EOL
eolRegex = new RegExp eol, 'g'

split = require '../splitText'

gt.module 'MdParser Advanced'

mdText = """
first line

second line

### foo

    code1
    code2

text after code
"""
mdText = mdText.replace eolRegex, '\n'

gt.test 'md with code', ->
  doc = new MdParser(mdText)
  gt.object doc, 'have parsed doc'
  text = doc.text()
  gt.string text, 'returns string'

  console.log(JSON.stringify(mdText, null, 2))
  console.log(JSON.stringify(text, null, 2))
  gt.aequal text, mdText, 'no changes to text'

mdSimple = """
### foo

    code1
    code2
"""
# mdSimple = mdSimple.replace /\n/g, eol

gt.skip 'splitting lines', ->
  console.log 'eol has ' + eol.length + ' chars, "' +
  eol.charCodeAt(0) + '" and "' +
  eol.charCodeAt(1) + '"'
  lines = mdSimple.split eol
  gt.equal lines.length, 4, 'split into four lines'

gt.skip 'just code block', ->
  console.log(JSON.stringify(mdSimple, null, 2))
  doc = new MdParser(mdSimple)
  gt.object doc, 'have parsed doc'
  blocks = doc.codeBlocks()
  gt.equal blocks.length, 1, 'single code block'
  gt.equal blocks[0].name, 'foo', 'block name'
  gt.equal blocks[0].text, '  code1' + eol + '  code2' + eol

  text = doc.text()
  gt.string text, 'returns string'
  console.log(JSON.stringify(text, null, 2))
  gt.equal text, mdSimple, 'no changes to code block'
