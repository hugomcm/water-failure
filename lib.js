const fs = require('fs');
const Crawler = require('crawler');
const { parse: htmlParse } = require('node-html-parser');

module.exports = (
  uri,
  searchKeyword,
  elementSelector,
  checkPeriodInSeconds
) => {
  let lastMessages = [];
  let firstRun = true;

  function diff(A, B) {
    return A.filter(function(a) {
      return B.indexOf(a) == -1;
    });
  }
  function getPageData(html, searchKeyword) {
    const msgStr = html;

    const lines = msgStr
      .trim()
      .toLowerCase()
      .split(/\s*[\r\n]+\s*/g);

    return searchKeyword === null
      ? lines
      : lines.filter(msg => msg.includes(searchKeyword));
  }

  function crawl(uri) {
    return new Promise((resolve, reject) => {
      new Crawler().queue([
        {
          uri: uri,
          jQuery: false,
          callback: function(error, res) {
            if (error) reject(error);

            const html = htmlParse(res.body).querySelector(elementSelector)
              .rawText;
            resolve(getPageData(html, searchKeyword));
          }
        }
      ]);
    });
  }

  function crawlTest(uri) {
    const testContent = fs.readFileSync('test.txt').toString();
    return new Promise(resolve =>
      resolve(getPageData(testContent, searchKeyword))
    );
  }

  function sendEmailMsg(msgsArr) {
    // TODO: send email thu API
    // const recipients = ['destination@example.com', 'destination2@example.com'];
    // const recipients = [];
    // exec(
    //   `echo ${msgsArr.join(
    //     '\n'
    //   )} | mail -s "Notificação de falta de água" -aFrom:NAME\<info@example.com\> ${recipients.join(
    //     ','
    //   )}`
    // );
    console.log({ msgsArr });
    console.log(`Notification email sent @ ${new Date()}`);
  }

  setInterval(async () => {
    const messages = await crawl(uri, searchKeyword);
    // console.log(messages);
    if (!firstRun) {
      const newMsgs = diff(messages, lastMessages);
      if (newMsgs.length > 0) {
        sendEmailMsg(newMsgs);
      }
    } else {
      firstRun = false;
    }
    lastMessages = messages;
  }, checkPeriodInSeconds * 1000);
};
