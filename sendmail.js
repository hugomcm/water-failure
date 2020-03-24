const nodemailer = require('nodemailer');

module.exports = ({ from, to }, subject, lineMessages) => {
  let transporter = nodemailer.createTransport({
    sendmail: true,
    newline: 'unix',
    path: '/usr/sbin/sendmail'
  });

  transporter.sendMail(
    {
      from,
      to: to.join(','),
      subject,
      text: lineMessages.map(msg => ` - ${msg}`).join('\n')
    },
    (err, info) => {
      console.log('Email sent!');
      console.log(info.envelope);
      console.log(info.messageId);
    }
  );
};
