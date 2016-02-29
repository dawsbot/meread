#! /usr/bin/env node

var chalk = require('chalk');
var outs = require('./chalkDefaults.js');
var config = require('./meread.json');
var prompt = require('prompt');
var fs = require('fs');

var outputText = '';
var readmeLocation = 'README.md';

function printBanner() {
  console.log(chalk.white('\n-----------------------------'));
  console.log(chalk.blue('     Welcome to meread!'));
  console.log(chalk.white('-----------------------------'));
  console.log(chalk.white('If you ever dislike a component, leave the field blank'));
  console.log(chalk.white('Let\'s build a clean README\n'));
};

function addEntry(style, body, key) {
  if (key !== undefined) {
    outputText += style + ' ' + key + '\n ' + body + '\n\n<br>\n';
  } else {
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

    checkForReadme();
  });
};

function checkForReadme() {
  stats = fs.lstatSync(readmeLocation);
  if (stats.isFile()){
    console.log(chalk.red('\nREADME.md already exists!'));
    console.log(chalk.red('Enter new file name (Leave field blank to overwrite README.md):'));
    prompt.get(['Filename'], function(err, res) {
      if (res.Filename !== ''){
        console.log(res.Filename);
        readmeLocation = res.Filename;
      }

      writeToFile();
    });
  }
};

function writeToFile(){
  fs.writeFile(readmeLocation, outputText, function(error) {
    if (error) {
      outs.error('Error writing to README.md');
      process.exit(1);
    }
    outs.success('meread built your readme at ' + readmeLocation + '!');
  });
};

printBanner();

var myArr = [];

for (var key in config) {
  myArr.push(key);
}

takeInput(myArr);
