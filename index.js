const run = require('./lib')
// console.log(process.argv)
try {
  const searchKeyword =
    !process.argv[2] || process.argv[2] === '' //
      ? process.env.WF_SEARCH_KEYWORD
      : process.argv[2].toLowerCase()
  const emailSettingsFrom = !process.argv[3] ? process.env.WF_FROM : process.argv[3]
  const emailSettingsTo = !process.argv[4] ? process.env.WF_TO.split(',') : process.argv[4].split(',')
  const checkPeriodInSeconds = !process.argv[5] ? +process.env.WF_CHECK_PERIOD_IN_SECS : +process.argv[5]
  const elementSelector = process.argv[6] || process.env.WF_ELEM_SELECTOR
  const uri = process.argv[7] || process.env.WF_URI

  if (!emailSettingsFrom || !emailSettingsTo) {
    throw 'No From or To email addresses passed.'
  }

  const emailSettings = {
    from: emailSettingsFrom,
    to: emailSettingsTo,
  }

  console.log('Running with configs', {
    uri,
    checkPeriodInSeconds,
    elementSelector,
    searchKeyword,
    emailSettings,
  })
  console.log(`Waiting for changes on '${uri}' > '${elementSelector}' ...`)

  run(uri, searchKeyword, elementSelector, checkPeriodInSeconds, emailSettings)
} catch (err) {
  console.error(err)
}
