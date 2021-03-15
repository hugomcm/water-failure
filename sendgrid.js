// using Twilio SendGrid's v3 Node.js Library
// https://github.com/sendgrid/sendgrid-nodejs

const sgMail = require('@sendgrid/mail')
sgMail.setApiKey(process.env.WF_SENDGRID_API_KEY)

module.exports = ({ from, to }, subject, lineMessages) => {
  const txtMsg = lineMessages.map(msg => ` - ${msg}`).join('\n')
  const htmlMsg = '<ul>' + lineMessages.map(msg => `<li>${msg}</li>`).join('\n') + '</ul>'
  const email = {
    from,
    to,
    subject,
    text: txtMsg,
    html: `<div>${htmlMsg}</div>`,
  }
  sgMail
    .send(email)
    .then(info => {
      console.log('Email sent')
      // console.log(info)
      // console.log(info.envelope);
      // console.log(info.messageId);
    })
    .catch(error => {
      console.error(error)
    })
}
