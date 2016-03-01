#! /usr/bin/env node

var chalk = require('chalk');
var outs = require('./chalkDefaults.js');
var config = require('./meread.json');
var prompt = require('prompt');
var fs = require('fs');

var titleString = '';
var bodyString = '';
var shieldsArray = [];
var sections = [];
var readmeLocation = 'testREADME.md';

function printBanner() {
  console.log(chalk.white('\n-----------------------------'));
  console.log(chalk.blue('     Welcome to meread!'));
  console.log(chalk.white('-----------------------------'));
  console.log(chalk.white('If you ever dislike a component, leave the field blank'));
  console.log(chalk.green('Usage:'));
  console.log(chalk.green('  text: default to meread.json'))
  console.log(chalk.green('  -t: add title but leave content blank (overrides displayKey)'));
  console.log(chalk.green('  -l: add title and leave reminder (overrides displayKey)'))
  console.log(chalk.green('  -f <path/to/file>: Use text in file'));
  console.log(chalk.white('Let\'s build a clean README\n'));
};

function addEntry(title, body) {
  sections.push(title + body);
};

function projectTitle(arr) {
  prompt.get(['Title'], function (err, res) {
    if (res.Title == '') {
      addEntry('## Still Contemplating That','','');
    } else {
      addEntry(res.Title,'');
    }
    shields(arr);
  });
};

function shields(arr) {
  prompt.get(['Shield'], function (err, res) {
    for (var key in res){
      if (res[key] !== '') {
        shieldsArray.push(res[key]);
        shields(arr);
      } else {
        if (shieldsArray.length > 0){
          addEntry(shieldsArray.join(' '),'');
        }
        takeInput(arr);
      }
    }
  });
};

function takeInput(arr) {
  prompt.get(arr, function (err, res) {
    for (var key in res) {
      if (res[key] === '' || res[key] === 'no') {
          console.log(chalk.gray('Created no entry for ' + key));
      } else {
        titleString = config[key].style;
        bodyString = '';

        if (res[key].toLowerCase() === '-t' || res[key].toLowerCase() === '-l' || config[key].displayKey === true) {
            titleString = config[key].style + ' ' + key + '\n';
          }

        if (res[key].toLowerCase() === '-l'){
          bodyString = config[key].comments;
        } else {
          bodyString = res[key];
        }

        if (res[key].toLowerCase().startsWith('-f')){
          var f = res[key].slice(3, res[key].length);
        } else {
          var f = 'undefined'
        }
        getFile(f, function (results){
          if (results !== 'undefined'){
            addEntry(titleString, results);
          } else {
            addEntry(titleString, bodyString);
          }
        });
      }
    }

    checkForReadme();
  });
};

function getFile(file, callback){
  if (file === 'undefined'){
    callback('undefined')
  } else {
    fs.readFile(file, function read(err, data) {
      if (err) {
        throw err;
      }
      callback(data);
    });
  }
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
      sections.push('Template: **[meread](https://github.com/dawsonbotsford/meread)**');
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

projectTitle(myArr);
