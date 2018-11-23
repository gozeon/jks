var path = require('path')
var fs = require('fs')
var { URL } = require('url')

var inquirer = require('inquirer')
var jenkins = require('jenkins')
var ora = require('ora')

var config = require('../lib/setting').config
var handleError = require('../lib/util').handleError

inquirer
  .prompt([
    {
      type: 'input', name: 'name', message: 'Please input job name.',
      validate: function (name) {
        if (name) {
          return true
        } else {
          console.log('Input a job name.')
        }
      }
    },
    {
      type: 'input', name: 'file', message: 'Please input job config file path with xml.',
      validate: function (file) {
        if (file) {
          if (fs.existsSync(path.join(process.cwd(), file))) {
            return true
          } else {
            console.log(`${file} don't exit.`)
          }
        } else {
          console.log('You need to input in a file path.')
        }
      }
    },
  ])
  .then(answers => {
    var spinner = new ora()

    var configFile = path.join(process.cwd(), answers.file)

    spinner.start(`Loading...`)
    jenkins({ baseUrl: config.fullUrl, crumbIssuer: true })
      .job
      .create(answers.name, fs.readFileSync(configFile, 'utf8'), function (err) {
        if (err) {
          handleError(err)
        } else {
          var jobUrl = new URL(`/job/${answers.name}`, config.baseUrl)
          spinner.succeed(`Created job for ${jobUrl}`)
        }
      })
  })
