var chalk = require('chalk');

module.exports = {
  error: function (text){
    console.log(chalk.bold.red(text));
  },
  success: function(text){
    console.log(chalk.green(text));
  }
};
