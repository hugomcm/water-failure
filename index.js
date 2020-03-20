const run = require('./lib');

const searchKeyword =
  !process.argv[2] || process.argv[2] === ''
    ? null
    : process.argv[2].toLowerCase();
const checkPeriodInSeconds = !process.argv[3] ? 2 : +process.argv[3];
const elementSelector = process.argv[4] || '.tab-content #home';
const uri = process.argv[5] || 'http://www.simar-louresodivelas.pt/';

console.log('Running with configs', {
  uri,
  checkPeriodInSeconds,
  elementSelector,
  searchKeyword
});
console.log(`Waiting for changes on '${uri}' > '${elementSelector}' ...`);

run(uri, searchKeyword, elementSelector, checkPeriodInSeconds);
