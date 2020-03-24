const run = require('./lib');

try {
  const searchKeyword =
    !process.argv[2] || process.argv[2] === ''
      ? null
      : process.argv[2].toLowerCase();
  const emailSettingsFrom = !process.argv[3] ? null : process.argv[3];
  const emailSettingsTo = !process.argv[4] ? null : process.argv[4].split(',');
  const checkPeriodInSeconds = !process.argv[5] ? 2 : +process.argv[5];
  const elementSelector = process.argv[6] || '.tab-content #home';
  const uri = process.argv[7] || 'http://www.simar-louresodivelas.pt/';

  if (!emailSettingsFrom || !emailSettingsTo) {
    throw 'No From or To email addresses passed.';
  }

  const emailSettings = {
    from: emailSettingsFrom,
    to: emailSettingsTo
  };

  console.log('Running with configs', {
    uri,
    checkPeriodInSeconds,
    elementSelector,
    searchKeyword,
    emailSettings
  });
  console.log(`Waiting for changes on '${uri}' > '${elementSelector}' ...`);

  run(uri, searchKeyword, elementSelector, checkPeriodInSeconds, emailSettings);
} catch (err) {
  console.error(err);
}
