const fs = require('fs');
const Crawler = require('crawler');
const sendmail = require('./sendmail');
const { parse: htmlParse } = require('node-html-parser');

module.exports = (
  uri,
  searchKeyword,
  elementSelector,
  checkPeriodInSeconds,
  emailSettings
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

  function sendNotification(subject, msgsArr) {
    sendmail(emailSettings, subject, msgsArr);
  }

  setInterval(async () => {
    const messages = await crawlTest(uri, searchKeyword);
    // console.log(messages);
    if (!firstRun) {
      const newMsgs = diff(messages, lastMessages);
      if (newMsgs.length > 0) {
        sendNotification(`Falta de água em '${searchKeyword}'`, newMsgs);
      }
    } else {
      firstRun = false;
    }
    lastMessages = messages;
  }, checkPeriodInSeconds * 1000);
};
