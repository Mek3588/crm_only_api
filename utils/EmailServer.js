const nodemailer = require("nodemailer");

var emailServer = nodemailer.createTransport({
  host: "mail.zemeninsurance.com ",
  port: 465,
  secure: true,
  auth: {
    user: "noreply@zemeninsurance.com",
    pass: "N0tify(n0w)",
  },
});

const smsServer = {
  host: "196.188.235.243",
  port: "8080",
  username: "etech",
  password: "etech",
  from: "7858",
};

// const emailServerConf = {
//   host: "mail.zemeninsurance.com",
//   port: 465,
//   secure: true,
//   auth: {
//     // user: "_mainaccount@zemeninsurance.com",
//     // pass: "ZeM@82$Ab*&75",
//     user: "noreply@zemeninsurance.com",
//     pass: "N0tify(n0w)"
//   },
// };

const emailServerConf = {
  host: "mail.zemeninsurance.com",
  port: 465,
  secure: true,
  auth: {
    user: "noreply@zemeninsurance.com",
    pass:  "N0tify(n0w)",
  },
};

module.exports = { emailServer, emailServerConf, smsServer };