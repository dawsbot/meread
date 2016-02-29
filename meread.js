#! /usr/bin/env node

var chalk = require('chalk');
var outs = require('./chalkDefaults.js');
var config = require('./meread.json');
var prompt = require('prompt');
var fs = require('fs');

var titleString = '';
var commentString = '';
var sections = [];
var readmeLocation = 'README.md';

function printBanner() {
  console.log(chalk.white('\n-----------------------------'));
  console.log(chalk.blue('     Welcome to meread!'));
  console.log(chalk.white('-----------------------------'));
  console.log(chalk.white('If you ever dislike a component, leave the field blank'));
  console.log(chalk.green('Usage:'));
  console.log(chalk.green('  -l: add title but leave content blank'));
  console.log(chalk.green('  -f <path/to/file>: Use text in file'));
  console.log(chalk.green('  -o <style> <text>: Override style'));
  console.log(chalk.white('Let\'s build a clean README\n'));
};

function addEntry(title, body, comment) {
  sections.push(title + body + comment);
};

function takeInput(arr) {
  prompt.get(arr, function (err, res) {
    for (var key in res) {
      if (res[key] === '' || res[key] === 'no') {
          console.log(chalk.gray('Created no entry for ' + key));
      } else {
        titleString = config[key].style;
        commentString = '';

        if (config[key].displayKey === true) {
          titleString = config[key].style + ' ' + key + '\n';
        }

        if (res[key].toLowerCase() !== '-l'){
          commentString = res[key];
        }

        addEntry(titleString, commentString, config[key].comments);
      }
    }

    sections.push('Template: **[meread](https://github.com/dawsonbotsford/meread)**');
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
  fs.writeFile(readmeLocation, sections.join('\n\n<br>\n'), function(error) {
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
