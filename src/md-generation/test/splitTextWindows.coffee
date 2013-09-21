split = require '../splitText'

gt.module 'splitText'

text = """
first line
second line
"""

gt.test 'split Windows text', ->
  lines = split text
  gt.equal lines.length, 2, 'number of lines in text'
