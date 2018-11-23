var fs = require('fs')
var path = require('path')
var yaml = require('read-data').yaml

module.exports = {
  dataPath: path.join(__dirname, '../data'),

  get testPath() {
    return path.join(this.dataPath, 'test')
  },

  get configYml() {
    return path.join(this.dataPath, 'jks.yaml')
  },

  get config() {
    if (fs.existsSync(this.configYml)) {
      return yaml.sync(this.configYml)
    } else {
      return {}
    }
  }
}
