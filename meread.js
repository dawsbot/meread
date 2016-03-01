#! /usr/bin/env node

var chalk = require('chalk');
var outs = require('./chalkDefaults.js');
var config = require('./meread.json');
var prompt = require('prompt');
var fs = require('fs');

var order = {'Title': '', 'Shields': '', 'Description': '', 'Demo Image URL': '', 'Installation': '', 'Usage': '', 'API': '', 'License': ''};
var shieldsArray = [];
var sections = [];
var readmeLocation = 'README.md';

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

function updateEntry(key, title, body) {
  order[key] = title + body;
};

function projectTitle(arr) {
  prompt.get(['Title'], function (err, res) {
    if (res.Title == '') {
      updateEntry('Title', '## Still Contemplating That', '');
    } else {
      updateEntry('Title', '## ' +res.Title, '');
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
          updateEntry('Shields', shieldsArray.join(' '),'');
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
        var titleString = config[key].style;
        var bodyString = '';
        var lower = res[key].toLowerCase();

        if (lower === '-t' || lower === '-l' || config[key].displayKey === true) {
            titleString = config[key].style + ' ' + key + '\n'; //style + prompt
          }

        if (lower === '-l'){
          bodyString = config[key].comments;
        } else if (lower !== '-t'){
          bodyString = res[key];  //prompt answer
        }

        if (lower.slice(0,2) === '-f') {
          var f = res[key].slice(3, res[key].length);
          getFile(f, key, titleString);
        } else {
          updateEntry(key, titleString, bodyString);
        }
      }
    }

    checkForReadme();
  });
};

function getFile(file, key, title){
  fs.readFile(file, function read(err, data) {
    if (err) {
      throw err;  //possibly don't error but add notice in README to copy and paste data in
    }
    updateEntry(key, title, data);
  });
};

function checkForReadme() {
  fs.stat(readmeLocation, function(err, stat) {
    if (err == null) {
      console.log(chalk.red('\nREADME.md already exists!'));
      console.log(chalk.red('Enter new file name (Leave field blank to overwrite README.md):'));
      prompt.get(['Filename'], function(err, res) {
        if (res.Filename !== '') {
          console.log(res.Filename);
          readmeLocation = res.Filename;
        }
        buildReadme();
      });
    } else if(err.code == 'ENOENT') {
      fs.writeFile(readmeLocation, '');
      buildReadme();
    } else {
      console.log('Some other error: ', err.code);
    }
  });
};

function buildReadme(){
  for (var key in order){
    if (order[key] !== ''){
      sections.push(order[key])
    }
  }
  sections.push('Template: **[meread](https://github.com/dawsonbotsford/meread)**');
  writeToFile();
}
function writeToFile(){
  fs.writeFile(readmeLocation, sections.join('\n\n<br>\n'), { flags: 'w' }, function(error) {
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
