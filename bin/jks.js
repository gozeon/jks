#!/usr/bin/env node

var fs = require('fs')
var URL = require('url').URL

var program = require('commander')
var inquirer = require('inquirer')
var mkdirp = require('mkdirp')
var touch = require("touch")
var writeData = require('write-data')
var ora = require('ora')
var jenkins = require('jenkins')

var { dataPath, testPath, configYml, config } = require('../lib/setting')
var { handleError, say, consoleJson } = require('../lib/util')

!function () {
  if (!fs.existsSync(dataPath)) {
    mkdirp.sync(testPath)
  }

  if (!fs.existsSync(configYml)) {
    touch.sync(configYml)
  }
}()

say('Welcome to JKS!')

program
  .version(require('../package.json').version, '-v, --version')

program
  .command('init')
  .description('init a jenkins')
  .action(function () {
    var baseUrlDefault = config ? config.baseUrl : undefined
    var usernameDefault = config ? config.username : undefined
    var tokenDefault = config ? config.token : undefined

    inquirer
      .prompt([
        {
          type: 'input', name: 'baseUrl', message: 'Please input jenkins url.',
          default: baseUrlDefault,
          validate: function (baseUrl) {
            if (baseUrl) {
              return true
            } else {
              console.log('Input jenkins url.')
            }
          }
        },
        {
          type: 'input', name: 'username', message: 'Please input username.',
          default: usernameDefault,
          validate: function (username) {
            if (username) {
              return true
            } else {
              console.log('Input username.')
            }
          }
        },
        {
          type: 'input', name: 'token', message: 'Please input password or token.',
          default: tokenDefault,
          validate: function (token) {
            if (token) {
              return true
            } else {
              console.log('Input password or token.')
            }
          }
        },
      ])
      .then(answers => {
        var spinner = new ora()
        var targetUrl = new URL(answers.baseUrl)

        targetUrl.username = answers.username
        targetUrl.password = answers.token
        answers.fullUrl = targetUrl.href

        spinner.start(`Loading jenkins config...`)
        writeData(configYml, answers, function (err) {
          if (err) {
            spinner.fail(err)
          }

          spinner.succeed(`Success jenkins config.`)
        })
      })
  })

program
  .command('info')
  .description('show jenkins info')
  .action(function () {
    var spinner = new ora()

    spinner.start(`Fetching jenkins info. `)
    if (config && config.fullUrl) {
      jenkins({ baseUrl: config.fullUrl, crumbIssuer: true }).info(function (err, data) {
        if (err) {
          spinner.fail(err)
        } else {
          spinner.succeed(`Get jenkins info.`)
          consoleJson(data)
        }
      })
    } else {
      spinner.fail(`Please run 'jks init'.`)
    }
  })

program.command('job [action]', 'jenkins job todo')

program.parse(process.argv)
