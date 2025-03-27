import fetch from 'node-fetch'
import sendmail from './sendgrid.js'
import { parse as htmlParse } from 'node-html-parser'
import { createHash } from 'crypto'
// import fs from 'fs/promises'

const genHash = data => {
	const h = createHash('sha256')
	h.update(data)
	return h.digest('hex')
}

const searchKeyword =
	!process.argv[2] || process.argv[2] === '' //
		? process.env.WF_SEARCH_KEYWORD
		: process.argv[2].toLowerCase()
const emailSettingsFrom = !process.argv[3] ? process.env.WF_FROM : process.argv[3]
const emailSettingsTo = !process.argv[4] ? process.env.WF_TO.split(',') : process.argv[4].split(',')
const checkPeriodInSeconds = !process.argv[5]
	? +process.env.WF_CHECK_PERIOD_IN_SECS
	: +process.argv[5]
// const elementSelector = process.argv[6] || process.env.WF_ELEM_SELECTOR
const uri = process.argv[7] || process.env.WF_URI
const url = `${process.env.WF_URI}${process.env.WF_PATH_TO_CHECK}`

if (!emailSettingsFrom || !emailSettingsTo) {
	throw 'No From or To email addresses passed.'
}

const emailSettings = {
	from: emailSettingsFrom,
	to: emailSettingsTo,
}

const sendNotification = sendmail(emailSettings)

const checkWaterFailure = async (url, searchKeyword) => {
	const res = await fetch(url)
	const body = await res.text()
	// const body = (await fs.readFile('./example.html')).toString()

	const parentDiv = htmlParse(body).querySelector('div#inner-body')
	// Find the target div by filtering

	const divElemXs = parentDiv?.childNodes.filter(n => n.tagName === 'DIV')

	const elem = divElemXs.length >= 2 ? divElemXs[1] : undefined

	// console.log(elem)
	if (!!elem) {
		const msgXs = elem.rawText
			.trim()
			.toLowerCase()
			.split(/\s*[\r\n]+\s*/g)

		return msgXs.join(' ').includes(searchKeyword) ? msgXs : []
	}

	return []
}

let firstRun = true
let lastMsgHash = ''
setInterval(async () => {
	try {
		// const msgXs = await checkWaterFailure(url, 'abastecimento')
		const msgXs = await checkWaterFailure(url, searchKeyword)
		console.log(`${new Date().toISOString()}:`, '> msg:', `'${msgXs.join(', ')}'`)

		if (!firstRun) {
			const msgHash = genHash(msgXs.join(', '))
			if (msgXs.length > 0) {
				if (msgHash !== lastMsgHash) {
					await sendNotification(`Falta de água em '${searchKeyword}'`, msgXs)
					console.log(`${new Date().toISOString()}:`, 'Sent email with:', msgXs)
					lastMsgHash = msgHash
				} else {
					console.log(`${new Date().toISOString()}:`, 'No send 1')
				}
			} else {
				lastMsgHash = msgHash
				console.log(`${new Date().toISOString()}:`, 'No send 2')
			}
		} else {
			firstRun = false
		}
	} catch (err) {
		console.error(`${new Date().toISOString()}:`, ' > failed to crawl url | ', err)
	}
}, checkPeriodInSeconds * 1000)
