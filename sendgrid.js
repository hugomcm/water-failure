// using Twilio SendGrid's v3 Node.js Library
// https://github.com/sendgrid/sendgrid-nodejs
import sgMail from '@sendgrid/mail'

sgMail.setApiKey(process.env.WF_SENDGRID_API_KEY)

export default ({ from, to }) =>
	(subject, lineMessages) => {
		const txtMsg = lineMessages.map(msg => ` - ${msg}`).join('\n')
		const htmlMsg = lineMessages.join('<br/>')
		const email = {
			from,
			to,
			subject,
			text: txtMsg.length === 0 ? ' ' : txtMsg,
			html: `<strong>Mensagem:</strong> <div>${htmlMsg}</div>`,
		}
		return sgMail
			.send(email)
			// .then(info => info)
			.catch(({ response, ...error }) => {
				console.error(error)
				console.error(response?.body)
			})
	}
