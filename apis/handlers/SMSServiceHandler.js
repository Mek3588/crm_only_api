const { isEmailValid } = require("../../utils/GeneralUtils");
const CommunicationHistory = require("../../models/ComunictionHistories");
let { smsServer } = require("../../utils/EmailServer");
const axios = require("axios");
const Contact = require("../../models/Contact");

const sendSMS = async (req, res) => {
  const { to, content, type } = req.body;
  var base64encodedData = Buffer.from(
    smsServer.username + ":" + smsServer.password
  ).toString("base64");
  String.prototype.hexEncode = function () {
    var hex, i;
    var result = "";
    for (i = 0; i < this.length; i++) {
      hex = this.charCodeAt(i).toString(16);
      result += ("000" + hex).slice(-4);
    }
    return result;
  };

  String.prototype.hexDecode = function () {
    var j;
    var hexes = this.match(/.{1,4}/g) || [];
    var back = "";
    for (j = 0; j < hexes.length; j++) {
      back += String.fromCharCode(parseInt(hexes[j], 16));
    }
    return back;
  };
  var lastTry = content.hexEncode();

  try {
    axios
      .post(
        `http://${smsServer.host}:${smsServer.port}/secure/send`,
        {
          to: to,
          from: smsServer.from,
          coding: 8,
          hex_content: lastTry,
        },
        {
          headers: {
            Authorization: "Basic " + base64encodedData,
            "content-type": "application/json;charset=UTF-8",
            accept: "application/json",
          },
        }
      )
      .then((e) => res.status(200).json(e.status));

    // Record sms
    if (type === "Contact") {
      const contact = await Contact.findOne({ where: { primaryPhone: to } });
      await CommunicationHistory.create({
        userId: req.user.id,
        contactId: contact.id,
        type: "SMS",
        content: content,
      });
    }
  } catch (error) {
    
    res.status(400).json({ msg: error.message });
  }
};

const sendNewSms = async (tos, content) => {
  
  

  String.prototype.hexEncode = function () {
    var hex, i;
    var result = "";
    for (i = 0; i < this.length; i++) {
      hex = this.charCodeAt(i).toString(16);
      result += ("000" + hex).slice(-4);
    }
    return result;
  };
  var hexCont = content.hexEncode();
  var base64encodedData = Buffer.from(
    smsServer.username + ":" + smsServer.password
  ).toString("base64");
  try {
    const sms = await axios.post(
      `http://${smsServer.host}:${smsServer.port}/secure/sendbatch`,
      {
        messages: [
          {
            to: [...tos],
            from: smsServer.from,
            coding: 8,
            hex_content: hexCont,
          },
        ],
      },
      {
        headers: {
          Authorization: "Basic " + base64encodedData,
          "content-type": "application/json;charset=UTF-8",
          accept: "application/json",
        },
      }
    );
    
    return sms;
  } catch (error) {
    console.log(error)
    
    return 0;
  }

};

//posting
const sendSMSs = async (req, res) => {
  const { tos, content } = req.body;
  
  String.prototype.hexEncode = function () {
    var hex, i;
    var result = "";
    for (i = 0; i < this.length; i++) {
      hex = this.charCodeAt(i).toString(16);
      result += ("000" + hex).slice(-4);
    }
    return result;
  };
  var hexCont = content.hexEncode();
  var base64encodedData = Buffer.from(
    smsServer.username + ":" + smsServer.password
  ).toString("base64");
  try {
    axios
      .post(
        `http://${smsServer.host}:${smsServer.port}/secure/sendbatch`,
        {
          messages: [
            {
              to: [...tos],
              from: smsServer.from,
              coding: 8,
              hex_content: hexCont,
            },
          ],
        },
        {
          headers: {
            Authorization: "Basic " + base64encodedData,
            "content-type": "application/json;charset=UTF-8",
            accept: "application/json",
          },
        }
      )
      .then((e) => res.status(200).json(e.status));
  } catch (error) {
    
    res.status(400).json({ msg: error.message });
  }
};

const smsFunction = async (phone, content) => {
  try {
    var hex_content = Buffer.from(content).toString("hex");
    var base64encodedData = Buffer.from(
      smsServer.username + ":" + smsServer.password
    ).toString("base64");
    String.prototype.hexEncode = function () {
      var hex, i;
      var result = "";
      for (i = 0; i < this.length; i++) {
        hex = this.charCodeAt(i).toString(16);
        result += ("000" + hex).slice(-4);
      }
      return result;
    };
    String.prototype.hexDecode = function () {
      var j;
      var hexes = this.match(/.{1,4}/g) || [];
      var back = "";
      for (j = 0; j < hexes.length; j++) {
        back += String.fromCharCode(parseInt(hexes[j], 16));
      }

      return back;
    };
    var lastTry = content.hexEncode();
    let info = await axios.post(
      `http://${smsServer.host}:${smsServer.port}/secure/send`,
      {
        to: phone,
        from: "7858",
        // "content": lastTry,
        coding: 8,
        hex_content: lastTry,
      },
      {
        headers: {
          Authorization: "Basic " + base64encodedData,
          "content-type": "application/json;charset=UTF-8",
          accept: "application/json",
        },
      }
    );
    return info.status;
  } catch (e) {
    return 0;
  }
};

module.exports = {
  sendSMS,
  sendSMSs,
  smsFunction,
  sendNewSms,
};
