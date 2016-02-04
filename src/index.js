require('babel-polyfill')

var methods = {
  ...require('./pages/wiki-guildwars2.js'),
  ...require('./pages/gw2dungeons.js'),
  ...require('./pages/guildwars2.js')
}

module.exports = methods
