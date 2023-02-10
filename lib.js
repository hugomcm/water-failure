// const fs = require('fs')
const Crawler = require('crawler')
const sendmail = require('./sendgrid')
const { parse: htmlParse } = require('node-html-parser')

const diff = (xs1, xs2) => xs1.filter(a => xs2.indexOf(a) === -1)

const getPageData = (html, searchKeyword) => {
	const msgStr = html

	const lines = msgStr
		.trim()
		.toLowerCase()
		.split(/\s*[\r\n]+\s*/g)

	return searchKeyword === null ? lines : lines.filter(msg => msg.includes(searchKeyword))
}

module.exports = (uri, searchKeyword, elementSelector, checkPeriodInSeconds, emailSettings) => {
	let lastMessages = []
	let firstRun = true
	const sendNotification = sendmail(emailSettings)

	const crawl = uri =>
		new Promise((resolve, reject) => {
			new Crawler().queue([
				{
					uri,
					jQuery: false,
					callback: function (error, res) {
						if (error) reject(error)

						const html = htmlParse(res.body).querySelector(elementSelector).rawText
						resolve(getPageData(html, searchKeyword))
					},
				},
			])
		})

	setInterval(async () => {
		try {
			const messages = await crawl(uri, searchKeyword)
			console.log(new Date(), ': ', uri, ' > msgs: ', `'${messages.join(', ')}'`)
			if (!firstRun) {
				const newMsgs = diff(messages, lastMessages)
				if (newMsgs.length > 0) {
					sendNotification(`Falta de água em '${searchKeyword}'`, newMsgs)
				}
			} else {
				firstRun = false
			}
			lastMessages = messages
		} catch (err) {
			console.log(new Date(), ': ', uri, ' > failed to crawl url | ', err)
		}
	}, checkPeriodInSeconds * 1000)
}
