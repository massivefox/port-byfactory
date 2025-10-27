const chalk = require('chalk');

/**
 * Adds mark check symbol
 */
function addCheckMark(callback) {
  console.log(chalk.green(' ✓'));
  if (callback) callback();
}

module.exports = addCheckMark;
