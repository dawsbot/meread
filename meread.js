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
};

function addEntry(style, body) {
      outputText += style + body + '\n';
};

function takeInput(arr) {
  prompt.get(arr, function (err, res) {
    for (var key in res) {
      console.log('key: ' + key);
      console.log('res: ' + res[key]);

      addEntry(config[key].style, res[key]);
    }

    fs.writeFile('README.md', outputText, function(error) {
      if (error) {
        throw error;
      }
      console.log('success');
    });
  });
}

printBanner();

var myArr = [];

for (var key in config) {
  myArr.push(key);
}

takeInput(myArr);
