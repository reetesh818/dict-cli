#! /usr/bin/env node

const program = require('commander');
const word = require('./dictFunctions');

program
  .command('def')
  .description('definition for the word')
  .option('--word <type>', 'Enter your word')
  .action((opt) => word.def(opt));

program
  .command('syn')
  .description('synonym for the word')
  .option('--word <type>', 'Enter your word')
  .action((opt) => word.syn(opt));

program
  .command('ant')
  .description('antonym for the word')
  .option('--word <type>', 'Enter your word')
  .action((opt) => word.ant(opt));

program
  .command('ex')
  .description('example for the word')
  .option('--word <type>', 'Enter your word')
  .action((opt) => word.ex(opt));

program.command('wod').description('word of the day').action(word.wod);

program.command('play').description('Play the word game').action(word.play);
program.parse(process.argv);