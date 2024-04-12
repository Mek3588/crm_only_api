// const Email = require("../../models/Email");
const nodemailer = require("nodemailer");
let { emailServerConf } = require("../../utils/EmailServer");
const EmailService = require("../../models/EmailService");
const Contact = require("../../models/Contact");
const CommunicationHistory = require("../../models/ComunictionHistories");
const path = require("path");

const sendEmail = async (req, res) => {
  const { recieverAddress, subject, message, cc } = req.body;
  try {
    
    const { type } = req.body;
    var emailServer = nodemailer.createTransport(emailServerConf);
    
    
    if (req.files == null) {
      let info = await emailServer.sendMail({
        from: req.user.email, // sender address
        to: `${recieverAddress}`, // list of receivers
        cc: `${cc}`,
        subject: `${subject}`, // Subject line
        text: `${message}`, // plain text body
        html: `<h3>Dear customer,</h3>  
              ${message}`, // attachments
      });
      

      //record history
      
      if (info.accepted.length && type === "Contact") {
        const contact = await Contact.findOne({
          where: { primaryEmail: recieverAddress },
        });
        await CommunicationHistory.create({
          userId: req.user.id,
          contactId: contact.id,
          type: "Email",
          content: message,
          subject: subject,
        });
      }
      res.status(200).json(info.response);
    } else {
      // const files = get(req, "body.data.file")
      const files = req.files;
      const attachments = files.map((file) => {
        return { filename: file.name, path: file.url };
      });
      let info = await emailServer.sendMail({
        from: req.user.email, // sender address
        to: `${recieverAddress}`, // list of receivers
        subject: `${subject}`, // Subject line
        text: `${message}`, // plain text body
        html: `<h3>Dear customer</h3>  
              ${message}`,
        cc: `${cc}`,
        attachments: files, // attachments
      });

      //record history
      
      if (info.accepted.length && type === "Contact") {
        const contact = await Contact.findOne({
          where: { primaryEmail: recieverAddress },
        });
        await CommunicationHistory.create({
          userId: req.user.id,
          contactId: contact.id,
          type: "Email",
          content: message,
          subject: subject,
        });
      }
      res.status(200).json(info.response);
    }
  } catch (error) {
    
    res.status(400).json({ msg: error.message });
  }
};

/////////////////////////
const sendNewEmail = async (
  recieverAddress,
  cc,
  subject,
  message,
  files,
  from
) => {
  try {
    let copy = [];
    if (cc && cc.length > 0) {
      cc.map((e) => {
        copy.push(e.email);
      });
    }
  //console.log("recivers",message.splice(1,3))
    var emailServer = nodemailer.createTransport(emailServerConf);
    if (files && files.length == 0) {
      let info = await emailServer.sendMail({
        from: from === null || from === "" ? "noreply@zemeninsurance.com" : from, // sender address
        to: `${recieverAddress}`, // list of receivers
        cc: `${copy}`,
        subject: `${subject}`, // Subject line
        text: `${message}`, // plain text body
        html: `<h3>Dear customer,</h3>
              ${message}`, // attachments
      });

      return info.accepted.length;
    } else if (files && files.length !== 0) {
      const attachments = files.map((file) => {
        return {
          filename: file.name,
          path: path.join(__dirname, "../../" + file.document),
        };
      });
      let info = await emailServer.sendMail({
        from: from, // sender address
        to: `${recieverAddress}`, // list of receivers
        subject: `${subject}`, // Subject line
        text: `${message}`, // plain text body
        html: `<h3>Dear customer</h3>
              ${message}`,
        cc: `${copy}`,
        attachments: attachments, // attachments
      });

      return info.accepted.length;
    }
    // return 1
  } catch (error) {
    console.log(error.message)
    console.log(error)
    
    return 0;
  }
};
///////////////

//posting
const sendEmails = async (req, res) => {
  const { recieverAddress, subject, message, cc } = req.body;
  try {
    
    var emailServer = nodemailer.createTransport(emailServerConf);
    
    
    if (req.files == null) {
      let info = await emailServer.sendMail({
        from: req.user.mail, // sender address
        to: `${recieverAddress}`, // list of receivers
        cc: `${cc}`,
        subject: `${subject}`, // Subject line
        text: `${message}`, // plain text body
        html: `<h3>Dear customer,</h3>  
              ${message}`, // attachments
      });
      
      res.status(200).json(info.response);
    } else {
      // const files = get(req, "body.data.file")
      const files = req.files;
      const attachments = files.map((file) => {
        return { filename: file.name, path: file.url };
      });
      let info = await emailServer.sendMail({
        from: req.user.mail, // sender address
        to: `${recieverAddress}`, // list of receivers
        subject: `${subject}`, // Subject line
        text: `${message}`, // plain text body
        html: `<h3>Dear customer</h3>  
              ${message}`,
        cc: `${cc}`,
        attachments: files, // attachments
      });
      
      res.status(200).json(info.response);
    }
  } catch (error) {
    
    res.status(400).json({ msg: error.message });
  }
};

const sendActivationEmail = async (
  recieverAddress,
  name,
  password,
  subject,
  message
) => {
  
  
  
  
  

  try {
    var emailServer = nodemailer.createTransport(emailServerConf);
    let info = await emailServer.sendMail({
      from: "crm@zemeninsurance.com", // sender address
      to: `${recieverAddress}`, // list of receivers
      subject: `${subject}`, // Subject line
      text: `${message}`, // plain text body
      html: `<h2>Dear ${name}</h2>  
              <p>${message}</p>
              <li>Email: ${recieverAddress}</li>
              <li>Password: ${password}</li>
              <p> Regards, </br> Zemen Team.`, // html body
    });
    
  } catch (error) {
    
  }
};

const sendResetLink = async (
  recieverAddress,
  name,
  password,
  subject,
  message
) => {
  
  
  
  
  

  try {
    var emailServer = nodemailer.createTransport(emailServerConf);
    let info = await emailServer.sendMail({
      from: "crm@zemeninsurance.com", // sender address
      to: `${recieverAddress}`, // list of receivers
      subject: `${subject}`, // Subject line
      text: `${""}`, // plain text body
      html: `<h2>Dear ${name}</h2>  
              <p>Please click this link to reset your password</p>
              <p>${message}</p>
              <p> Regards, </br> Zemen Team.`, // html body
    });
    
  } catch (error) {
    
  }
};

const sendWelcomeEmail = async (recieverAddress, name, subject, message) => {
  try {
    var emailServer = nodemailer.createTransport(emailServerConf);
    let info = await emailServer.sendMail({
      from: "crm@zemeninsurance.com", // sender address
      to: `${recieverAddress}`, // list of receivers
      subject: `${subject}`, // Subject line
      text: `${message}`, // plain text body
      html: `<h2>Dear ${name}</h2>  
              <p>${message}</p>
              <p> Regards, </br> Zemen Team.`, // html body
    });
    
  } catch (error) {
    
  }
};

module.exports = {
  sendEmail,
  sendEmails,
  sendActivationEmail,
  sendResetLink,
  sendWelcomeEmail,
  sendNewEmail,
};
