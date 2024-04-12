// const JSDOM = require('jsdom').JSDOM;
const PDFDocument = require('pdfkit');
const fs = require('fs');

const EventLog = require("../models/EventLog");
let currentUser = {};
const moment = require("moment");
//Print package
var pdf = require("pdf-creator-node");
const PDFMerger = require('pdf-merger-js');

let setCurrentUser = (user) => {
  currentUser = user;
};
let getCurrentUser = () => {
  return currentUser;
};
const checkEmpty = (data) => {
  for (let item in data) {
    if (data[item] === null || data[item] === "" || data[item] === 0) {
      item = item.split("_").join(" ");
      return { isEmpty: true, msg: `The ${item} is empty` };
    }
  }
  return { isEmpty: false, msg: "" };
};
const isPasswordConfirmed = (password, confirm_password) => {
  return password === confirm_password;
};

const isPhoneNoValid = (phoneNo) => {
  return /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/im.test(
    phoneNo
  );
};

const isEmailValid = (email) => {
  return /^[a-zA-Z0-9][a-zA-Z0-9-_\.]+@([a-z]|[a-zA-Z0-9]?[a-zA-Z0-9]+[a-zA-Z0-9])\.[a-zA-Z0-9]{2,10}(?:\.[a-zA-Z0-9]{2,10})?$/.test(
    email
  );
};

const sendSMS = (phone, content) => {
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
  axios
    .post(
      `http://${smsServer.host}:${smsServer.port}/secure/send`,
      {
        to: phone,
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
    )
    .then((e) => res.status(200).json(e.status));
};

const changeDateFormat = (date) => {
  const currentYear = date.getFullYear();
  const currentMonth =
    date.getMonth() + 1 < 10
      ? "0" + (date.getMonth() + 1)
      : date.getMonth() + 1;
  const currentDateOfMonth =
    date.getDate() < 10 ? "0" + date.getDate() : date.getDate();
  const currentDate = `${currentYear}-${currentMonth}-${currentDateOfMonth}`;
  return currentDate;
};

const getFileExtension = (filename) => {
  // get file extension
  const extension = filename.substring(
    filename.lastIndexOf(".") + 1,
    filename.length
  );
  return extension;
};

const createEventLog = async (
  userId,
  resourceType,
  resourceName,
  resourceId,
  action,
  changedField,
  ipAddress
) => {
  return await EventLog.create({
    userId,
    resourceType,
    resourceName,
    resourceId,
    action,
    changedField,
    ipAddress,
  });
};

const getIpAddress = (unformattedIpAddress) => {
  let ipAddress = unformattedIpAddress.split(":");
  ipAddress = ipAddress[ipAddress.length - 1];
  return ipAddress;
};

// const getIpAddress = async (req) => {
//   let ip = req.socket.remoteAddress || req.headers['x-forwarded-for'];
//   
//   if (ip.substr(0, 7) == "::ffff:") {
//     ip = ip.substr(7)
//   }
//   try {
//     return ip;
//   }
//   catch (error) {
//     return error;

//   }
// };

// const getChangedFieldValues = (previousObject, newObject) => {
//   previousObject = previousObject.dataValues;
//   newObject = newObject.dataValues;
//   const keys = Object.keys(previousObject);
//   let changedFieldValues = "";
//   keys.forEach((key) => {

//     if (
//       key != "createdAt" &&
//       key != "updatedAt" &&
//       previousObject[key] != newObject[key]
//     ) {
//       if (typeof previousValue === "string") {
//         previousValue = previousValue.trim();
//       }

//       if (typeof newValue === "string") {
//         newValue = newValue.trim();
//       }
//       
//       

//       
//       changedFieldValues += `${key}: ${previousObject[key]} -> ${newObject[key]}, `;
//     }
//   });
//   return changedFieldValues;
// };

const getChangedFieldValues = (previousObject, newObject) => {
  previousObject = previousObject.dataValues;
  newObject = newObject.dataValues;
  const keys = Object.keys(previousObject);
  let changedFieldValues = "";

  keys.forEach((key) => {
    if (
      key !== "createdAt" &&
      key !== "updatedAt" &&
      previousObject[key] !== newObject[key]
    ) {
      let previousValue = previousObject[key];
      let newValue = newObject[key];
      // Compare date-time strings
      if (moment.isDate(previousValue)) {
        if (moment.isDate(newValue)) {
          if (moment(previousValue).isSame(newValue) == false) {
            changedFieldValues += `${key}: ${previousValue} -> ${newValue}, `;
          }
        } else {
          changedFieldValues += `${key}: ${previousValue} -> ${newValue}, `;
        }
        return; // Skip to the next iteration if the date-time strings are the same
      }

      // Trim whitespace for string values
      if (typeof previousValue === "string") {
        previousValue = previousValue.trim();
      }

      if (typeof newValue === "string") {
        newValue = newValue.trim();
      }

      changedFieldValues += `${key}: ${previousValue} -> ${newValue}, `;
    }
  });
  return changedFieldValues.trim();
};


const isValidDate = (d) => {
  return d instanceof Date && !isNaN(d);
}
// function convertFlattenedToNested(flattenedData) {
//   const nestedData = {};
//   for (const key in flattenedData) {
//     if (Object.prototype.hasOwnProperty.call(flattenedData, key)) {
//       const value = flattenedData[key];
//       const parts = key.split('.');
//       let current = nestedData;

//       for (let i = 0; i < parts.length; i++) {
//         const part = parts[i];
//         if (i === parts.length - 1) {
//           // Convert numeric strings to numbers
//           current[part] = !isNaN(value) ? Number(value) : value === "null" ? null : value;
//         } else {
//           current[part] = current[part] || {};
//           current = current[part];
//         }
//       }
//     }
//   }

//   return nestedData;
// }


function convertFlattenedToNested(flattenedData) {
  const result = {};

  for (let key in flattenedData) {
    if (Object.prototype.hasOwnProperty.call(flattenedData, key)) {
      let value = flattenedData[key];
      if (value === '' || typeof value === 'undefined' || value === "null") {
        value = null;
      }if (value === '0' ) {
        value = 0;
      }
      const parts = key.split('.');
      const lastIndex = parts.length - 1;
      let current = result;

      for (let i = 0; i <= lastIndex; i++) {
        const part = parts[i];  

        if (i === lastIndex) {
          if (isNaN(part)) {
            current[part] = value;
          } else {
            const index = Number(part);
            current[index] = [value];
          }
        } else {
          if (!current[part]) {
            if (isNaN(parts[i + 1])) {
              current[part] = {};
            } else {
              current[part] = [];
            }
          }

          current = current[part];
        }
      }
    }
  }

  return result;
}



const formatToCurrency = (val) => {
  let ETB = new Intl.NumberFormat("en-US");
  return ETB.format(val);
};


const printPdf = async (document) => {
  var options = {
    format: "A4",
    orientation: "portrait",
    border: "5mm",
    header: {
      height: "3mm",
    },
    // add css styles to the page

    "css": "html body{ font-family: 'Berlin Sans FB'}"
  };
  try {
    // document = await addWatermark(document);
    let res = await pdf.create(document, options, {
      childProcessOptions: {
        env: {
          OPENSSL_CONF: "/dev/null",
        },
      },
    });

    console.log("the respnse of the certificat", res)
    // const doc = new PDFDocument();
    // doc.pipe(fs.createWriteStream(res));
    // doc.font("Helvetica", 12)
    // doc.text("Watermark", 10, 50)
    // doc.end();    
    return res;
  } catch (error) {
    console.error("The print error is", error);
    return error;
  }
};

const printPdfLandScape = async (document) => {
  var options = {
    format: "A4",
    orientation: "landscape",
    border: "5mm",
    header: {
      height: "3mm",
    },
    // add css styles to the page

    "css": "html body{ font-family: 'Berlin Sans FB'}"
  };
  try {
    // document = await addWatermark(document);
    let res = await pdf.create(document, options, {
      childProcessOptions: {
        env: {
          OPENSSL_CONF: "/dev/null",
        },
      },
    });
    // const doc = new PDFDocument();
    // doc.pipe(fs.createWriteStream(res));
    // doc.font("Helvetica", 12)
    // doc.text("Watermark", 10, 50)
    // doc.end();    
    return res;
  } catch (error) {
    console.error("The print error is", error);
    return error;
  }
}

const mergePdfs = async (pdfPaths) => {
  try {
    let mergedPath = "/print_files/" + Date.now() + ".pdf";
    var merger = new PDFMerger();
    var prom = pdfPaths.map(async (pdf) => {
      await merger.add("." + pdf);
    });
    Promise.all(prom).then(async function (result) {
      const promises = await merger.save("." + mergedPath);
      Promise.all([promises]).then(async function (result) {
      });
    });

    return mergedPath
  }
  catch (error) {
    
  }
}






const generateNumber = async (string, branchCode, coding) => {


  const numberMatch = string.match(/\d+/);

  const number = Number(numberMatch[0]);
  const incrementedNumber = String(number + 1).padStart(numberMatch[0].length, '0');

  const currentDate = new Date();
  const currentYear = String(currentDate.getFullYear()).slice(-2);
  const currentMonth = String(currentDate.getMonth() + 1).padStart(2, '0');

  const finalString = string.replace(/\d+/, incrementedNumber).replace(/(\d{2})\/(\d{2})$/, `${currentMonth}/${currentYear}`);
    if (string && coding && branchCode ) {

      const policyN = `ZI/${branchCode}/${coding}/${incrementedNumber}/${currentMonth}/${currentYear}`;

        return policyN;
      } else {
        return finalString;
    }
};


module.exports = {
  currentUser,
  setCurrentUser,
  getCurrentUser,
  checkEmpty,
  isPasswordConfirmed,
  isEmailValid,
  isPhoneNoValid,
  sendSMS,
  changeDateFormat,
  getFileExtension,
  createEventLog,
  getChangedFieldValues,
  getIpAddress,
  isValidDate,
  convertFlattenedToNested,
  formatToCurrency,
  printPdf,
  printPdfLandScape,
  mergePdfs,
  generateNumber
};
