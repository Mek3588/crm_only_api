// Load the full build.
var _ = require("lodash");
var imaps = require("imap-simple");
const RecievedEmail = require("../models/RecievedEmail");
const simpleParser = require("mailparser").simpleParser;
let pass = "t,Hyv3)CuFtd";

var config = {
  imap: {
    user: "crm.ibox@zemeninsurance.com",
    password: pass,
    host: "mail.zemeninsurance.com",
    port: 993,
    tls: true,
    authTimeout: 3000,
    tlsOptions: {
      rejectUnauthorized: false,
    },
  },
};

const readUnseenEmails = async () => {
  let readMail = [];
  try {
    let connection = await imaps.connect(config);
    if (connection) {
      connection.openBox("INBOX").then(function () {
        var searchCriteria = ["ALL", ["SINCE", "May 20, 2023"]];
        var fetchOptions = {
          bodies: ["HEADER", "TEXT", ""],
        };
        return connection
          .search(searchCriteria, fetchOptions)
          .then(function (messages) {
            messages.forEach(function (item) {
              var all = _.find(item.parts, { which: "" });
              var id = item.attributes.uid;
              var idHeader = "Imap-Id: " + id + "\r\n";
              simpleParser(idHeader + all.body, async (err, mail) => {
                // access to the whole mail object
                
                
                readMail.push(mail);
                let from = mail.from.value ? mail.from.value[0].address : " ";
                let to = mail.to.value ? mail.to.value[0].address : "";
                let subject = mail.subject;
                let message = mail.text;
                let cc = mail.cc ? mail.cc.value[0].address : "";
                let recievedDate = mail.date ? mail.date : "";
                // 
                // 
                // 
                // 
                // let to = mail.to;
                // let cc = mail.cc;
                // let message = mail.message;
                // let subject = mail.subject;
                let duplicate = await RecievedEmail.findAll({
                  where: { message: message, from: from, subject: subject },
                });
                if (duplicate.length == 0) {
                  let resp = await RecievedEmail.create({
                    from,
                    to,
                    subject,
                    cc,
                    message,
                    recievedDate,
                  });
                }
                // 
              });
            });
          });
      });
    }

    return readMail;
  } catch (e) {
    
  }
};

module.exports = { readUnseenEmails };
