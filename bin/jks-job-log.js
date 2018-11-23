var program = require('commander')

var jenkins = require('jenkins')
var ora = require('ora')

var config = require('../lib/setting').config
var jenkins = jenkins({ baseUrl: config.fullUrl, crumbIssuer: true })
var spinner = new ora()

program
  .version(require('../package.json').version, '-v, --version')
  .option('-n, --jobName     <string>', 'jenkins job name')
  .option('-N, --buildNumber <number>', 'jenkins job build number')

program.parse(process.argv)

if (program.buildNumber && program.jobName) {
  var jobName = program.jobName
  var buildNumber = Number(program.buildNumber)

  if (isNaN(buildNumber)) {
    spinner.fail(`The type ${buildNumber} isn't a number`)
  } else {
    var log = jenkins.build.logStream(jobName, buildNumber)

    log.on('data', function (text) {
      process.stdout.write(text)
    })

    log.on('error', function (err) {
      spinner.fail(err)
      console.log(`Please to build job or the build task in queue, wait a while to execute 'jks job log -n ${jobName} -N ${buildNumber}'`)
    })

    log.on('end', function () {
      // spinner.succeed(`job ${program.jobName}:${nextBuildNumber} build success.`)
    })
  }

} else {
  program.help()
}
