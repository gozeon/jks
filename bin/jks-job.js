var program = require('commander')

program
  .version(require('../package.json').version, '-v, --version')
  .command('add', 'add a jenkins job')

program.parse(process.argv)
