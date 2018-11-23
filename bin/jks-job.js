var program = require('commander')

program
  .version(require('../package.json').version, '-v, --version')
  .command('add', 'add a jenkins job')
  .command('build', 'build a jenkins job')
  .command('log', 'get jenkins job log')

program.parse(process.argv)
