#!/usr/bin/env node
var { URL } = require('url')

var program = require('commander')

var jenkins = require('jenkins')
var ora = require('ora')

var config = require('../lib/setting').config
var jenkins = jenkins({ baseUrl: config.fullUrl, crumbIssuer: true })

program
  .version(require('../package.json').version, '-v, --version')
  .option('-n, --jobName <string>', 'jenkins job name')
  .option('-l, --log', 'print build log')
program.parse(process.argv)

if (program.jobName) {
  var spinner = new ora()
  spinner.start(`Loading...`)
  jenkins.job.get(program.jobName, function (err, data) {
    if (err) {
      spinner.fail(err)
    } else {
      var nextBuildNumber = data.nextBuildNumber
      jenkins.job.build(program.jobName, function (err, queueNumber) {
        if (err) {
          spinner.fail(err)
        } else {
          var jobUrl = new URL(`/job/${program.jobName}/${nextBuildNumber}`, config.baseUrl)
          spinner.succeed(`queue item number ${queueNumber}`)
          console.log(`more detail see ${jobUrl}`)

          if (program.log) {
            spinner.start('queuing...')
            setTimeout(() => {
              spinner.stop()
              var log = jenkins.build.logStream(program.jobName, nextBuildNumber)

              log.on('data', function (text) {
                process.stdout.write(text)
              })

              log.on('error', function (err) {
                spinner.fail(err)
                console.log(`Please to build job or the build task in queue, wait a while to execute 'jks job log -n ${program.jobName} -N ${nextBuildNumber}'`)
              })

              log.on('end', function () {
                // spinner.succeed(`job ${program.jobName}:${nextBuildNumber} build success.`)
              })
            }, 8000)
          }
        }
      })
    }
  })
} else if (program.log) {
  console.log(`you need input job name or run 'jks job build --help'`)
} else {
  program.help()
}
