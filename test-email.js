const nodemailer = require('nodemailer');

const from = process.argv[2] || 'info@example.com';
const to = process.argv[3] || 'recipient@example.com';

let transporter = nodemailer.createTransport({
  sendmail: true,
  newline: 'unix',
  path: '/usr/sbin/sendmail'
});

transporter.sendMail(
  {
    from,
    to,
    subject: 'Message',
    text: 'I hope this message gets delivered!'
  },
  (err, info) => {
    console.log(info.envelope);
    console.log(info.messageId);
  }
);
