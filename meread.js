#! /usr/bin/env node

var chalk = require('chalk');
var outs = require('./chalkDefaults.js');
var config = require('./meread.json');
var prompt = require('prompt');
var fs = require('fs');

var outputText = '';

function printBanner() {
  console.log(chalk.white('\n-----------------------------'));
  console.log(chalk.blue('     Welcome to meread!'));
  console.log(chalk.white('-----------------------------'));
  console.log(chalk.white('If you ever dislike a component, leave the field blank'));
  console.log(chalk.white('Let\'s build a clean README\n'));
};

function addEntry(style, body, key) {
  // if (style !== '') {
  //   console.log('style: ' + String(style));
  //   style += ' ';
  // }
  if (key !== undefined) {
    // console.log('key is undef');
    outputText += style + ' ' + key + '\n ' + body + '\n\n<br>\n';
  } else {
    // console.log('key is NOT undef');
    outputText += style + body + '\n\n<br>\n';
  }
};

function takeInput(arr) {
  prompt.get(arr, function (err, res) {
    for (var key in res) {
      if (res[key] === '' || res[key] === 'no') {
          console.log(chalk.gray('Created no entry for ' + key));
      } else {
        if (config[key].displayKey === true) {
          addEntry(config[key].style, res[key], key);
        } else {
          addEntry(config[key].style, res[key]);
        }
      }
    }

    outputText += 'This readme was templated with [meread](https://github.com/dawsonbotsford/meread)';

    var readmeLocation = 'README.md';

    fs.writeFile(readmeLocation, outputText, function(error) {
      if (error) {
        outs.error('Error writing to README.md');
        process.exit(1);
      }
      outs.success('meread build your readme at ' + readmeLocation + '!');
    });
  });
}

printBanner();

var myArr = [];

for (var key in config) {
  myArr.push(key);
}

takeInput(myArr);
