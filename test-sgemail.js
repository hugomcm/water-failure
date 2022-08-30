const sg = require('./sendgrid')

const from = process.argv[2] || 'info@example.com'
const to = process.argv[3] || 'recipient@example.com'

const subject = 'Message'
const lineMessages = ['I hope this message gets delivered!', 'BestRegards', 'Myself']

sg({ from, to }, subject, lineMessages).then(data => {
	console.log(data)
})
