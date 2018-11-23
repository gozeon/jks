var gozesay = require('gozesay')
var tableify = require('tableify')
var prettyjson = require('prettyjson')
var Table = require('cli-table')

module.exports = {
  handleError: function (err) {
    if (err) {
      console.error(err)
      process.exit(1)
    }
  },

  say: function (message) {
    console.log(gozesay(message))
  },

  consoleJson: function (json) {
    console.log(prettyjson.render(json, {
      keysColor: 'yellow'
    }))
  }
}
