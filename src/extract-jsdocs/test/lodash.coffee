gt.module 'lodash complex comments'

getComments = (require '../getTaggedComments').getComments
Comment = require '../Comment'

path = require 'path'
fs = require 'fs'
filename = path.join __dirname, 'data/lodash.js'
src = fs.readFileSync filename, 'utf-8'

gt.test 'basic', ->
    gt.string src, 'have string contents'
    comments = getComments src
    gt.array comments, 'have comments'
    gt.equal comments.length, 1, 'single comment'
    c = new Comment comments[0]
    # console.dir c
    gt.equal c.tagValue('method'), 'first'
    gt.equal c.tagValue('alias'), 'detect'
    gt.equal c.getFullName(), '_.first'

    gt.equal c.getMemberOf(), '_'
    gt.equal c.tagValue('category'), 'Collections'
    gt.equal c.getCategory(), 'Collections'