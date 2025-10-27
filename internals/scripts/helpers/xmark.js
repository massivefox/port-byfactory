const chalk = require('chalk');

/**
 * Adds mark cross symbol
 */
function addXMark(callback) {
  console.log(chalk.red(' ✘'));
  if (callback) callback();
}

module.exports = addXMark;
