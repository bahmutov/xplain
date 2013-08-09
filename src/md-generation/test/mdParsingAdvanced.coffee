MdParser = require '../mdParsing'

gt.module 'MdParser Advanced'

mdText = """
first line

second line

### foo

	code1
	code2

text after code
"""

gt.test 'md with code', ->
	doc = new MdParser(mdText)
	gt.object doc, 'have parsed doc'
	text = doc.text()
	gt.string text, 'returns string'
	gt.equal text, mdText, 'no changes to text'

mdSimple = """
### foo

  code1
  code2
"""

gt.test 'just code block', ->
  doc = new MdParser(mdSimple)
  gt.object doc, 'have parsed doc'
  text = doc.text()
  gt.string text, 'returns string'
  gt.equal text, mdSimple, 'no changes to code block'