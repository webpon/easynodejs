const mime = require('../static/mime.json')
function getMime(extname) {
  return mime[extname]
}
module.exports = getMime
