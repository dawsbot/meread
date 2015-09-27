#! /usr/bin/env node

var chalk = require('chalk');
var outs = require('./chalkDefaults.js');
var config = require('./meread.json');
var prompt = require('prompt');
var fs = require('fs');

var outputText = '';

function printBanner() {
  console.log(chalk.white('-----------------------------'));
  console.log(chalk.magenta('     Welcome to meread!'));
  console.log(chalk.white('-----------------------------'));
  console.log(chalk.white('Let\'s build a clean README\n'));
};

function addEntry(style, body) {
      outputText += style + body + '\n';
};

function takeInput(arr) {
  prompt.get(arr, function (err, res) {
    for (var key in res) {
      // console.log('key: ' + key);
      // console.log('res: ' + res[key]);
      if (res[key] === '' || res[key] === 'no') {
          console.log(chalk.gray('Created no entry for ' + key));
      } else {
        addEntry(config[key].style, res[key]);
      }
    }

    fs.writeFile('README.md', outputText, function(error) {
      if (error) {
        outs.error('Error writing to README.md');
        process.exit(1);
      }

      outs.success('Clean and organized README hot and fresh!');
    });
  });
}

printBanner();

var myArr = [];

for (var key in config) {
  myArr.push(key);
}

takeInput(myArr);
