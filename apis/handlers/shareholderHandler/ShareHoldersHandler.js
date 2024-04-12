const Shareholder = require("../../../models/shareholders/Shareholder");
const {
  isPhoneNoValid,
  getFileExtension,
  isEmailValid,
  getChangedFieldValues,
  getIpAddress,
  createEventLog,
  convertFlattenedToNested,
} = require("../../../utils/GeneralUtils");
const { Op } = require("sequelize");
const Address = require("../../../models/Address");
const PhoneNo = require("../../../models/PhoneNo");

const ShareHolderPhone = require("../../../models/ShareHolderPhone");
const ShareholderDepartment = require("../../../models/shareholders/ShareholderDepartment");
const Employee = require("../../../models/Employee");
const Department = require("../../../models/Department");
const Email = require("../../../models/EmailModel");
const ShareholderEmails = require("../../../models/shareholders/ShareholderEmail");
const ShareholderSms = require("../../../models/shareholders/ShareholderSMS");
const { sendNewSms } = require("../SMSServiceHandler");
const { sendNewEmail } = require("../EmailServiceHandler");
const User = require("../../../models/acl/user");
const SMSMessage = require("../../../models/SMS");
const Emailcc = require("../../../models/EmailCc");
const Document = require("../../../models/Document");
const EmailDocument = require("../../../models/EmailDocument");
const sequelize = require("../../../database/connections");
const {
  Role,
  eventResourceTypes,
  eventActions,
} = require("../../../utils/constants");

// const excelTemplate = require('../../uploads/zemen_shareholders_excel_template.xlsx');

const getSearch = (st) => {
  return {
    [Op.or]: [
      { name: { [Op.like]: `%${st}%` } },
      { shareHolderId: { [Op.like]: `%${st}%` } },
      { primaryEmail: { [Op.like]: `%${st}%` } },
      { primaryPhone: { [Op.like]: `%${st}%` } },
      { secondaryEmail: { [Op.like]: `%${st}%` } },
      { secondaryPhone: { [Op.like]: `%${st}%` } },
      { gender: { [Op.like]: `%${st}%` } },
      { active: { [Op.like]: `%${st}%` } },
      { stateOfInfluence: { [Op.like]: `%${st}%` } },
      { country: { [Op.like]: `%${st}%` } },
      { region: { [Op.like]: `%${st}%` } },
      { city: { [Op.like]: `%${st}%` } },
      { subcity: { [Op.like]: `%${st}%` } },
      { woreda: { [Op.like]: `%${st}%` } },
      { kebele: { [Op.like]: `%${st}%` } },
      { building: { [Op.like]: `%${st}%` } },
      { officeNumber: { [Op.like]: `%${st}%` } },
      { streetName: { [Op.like]: `%${st}%` } },
      { poBox: { [Op.like]: `%${st}%` } },
      { zipCode: { [Op.like]: `%${st}%` } },
      { socialSecurity: { [Op.like]: `%${st}%` } },
    ],
  };
};

const getShareHolder = async (req, res) => {
  const { f, r, st, sc, sd } = req.query;
  try {
    const currentUser = req.user;
    if (req.type == "all") {
      const data = await Shareholder.findAndCountAll({
        include: [User, Employee, Department],
        offset: Number(f),
        limit: Number(r),
        order: [[sc || "name", sd == 1 ? "ASC" : "DESC"]],
        where: getSearch(st),
        subQuery: false,
      });
      res.status(200).json(data);
    } else if (req.type == "self") {
      const user = await User.findByPk(currentUser.id, { include: [Employee] });
      const data = await Shareholder.findAndCountAll({
        include: [User, Employee, Department],
        offset: Number(f),
        limit: Number(r),
        order: [[sc || "name", sd == 1 ? "ASC" : "DESC"]],
        where: {
          [Op.and]: [
            {
              [Op.or]: [
                { userId: { [Op.like]: `%${currentUser.id}%` } },
                { "$employee.userId$": { [Op.like]: `%${currentUser.id}%` } },
                user.employee && {
                  "$departments.id$": {
                    [Op.like]: `%${user.employee.departmentId}%`,
                  },
                },
              ],
            },
            getSearch(st),
          ],
        },
        subQuery: false,
      });
      res.status(200).json(data);
    } else if (req.type == "branch") {
      const user = await User.findByPk(currentUser.id, { include: [Employee] });
      const data = await Shareholder.findAndCountAll({
        include: [{ model: User, include: [Employee] }, Employee, Department],
        offset: Number(f),
        limit: Number(r),
        order: [[sc || "name", sd == 1 ? "ASC" : "DESC"]],
        where: {
          [Op.and]: [
            currentUser.employee
              ? {
                "$user.employee.branchId$": {
                  [Op.like]: `%${currentUser.employee.branchId}%`,
                },
              }
              : { id: null },
            getSearch(st),
          ],
        },
        subQuery: false,
      });
      res.status(200).json(data);
    }
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};

//posting
const createShareHolder = async (req, res) => {
  const shareHolderBody = convertFlattenedToNested(req.body);

  try {
    const shareholderFound = await Shareholder.findOne({
      where: {
        [Op.or]: [
          { primaryEmail: { [Op.like]: shareHolderBody.primaryEmail.trim() } },
          { primaryPhone: { [Op.like]: shareHolderBody.primaryPhone.trim() } },
          {
            shareHolderId: { [Op.like]: shareHolderBody.shareHolderId.trim() },
          },
        ],
      },
    });
    if (shareholderFound == null) {
      if (req.file == null) {
        
        const { profilePicture, ...others } = shareHolderBody;
        const shareholder = await Shareholder.create(others).then(
          async (shareholder) => {
            shareholder.addDepartments(shareHolderBody.departments, {
              through: ShareholderDepartment,
            });

            let ipAddress = getIpAddress(req.ip);
            const eventLog = await createEventLog(
              req.user.id,
              eventResourceTypes.shareHolder,
              shareholder.name,
              shareholder.id,
              eventActions.create,
              "",
              ipAddress
            );
          }
        );
        res.status(200).json(shareholder);
      } else {
        shareHolderBody.profilePicture = "/uploads/" + req.file.filename;
        
        const shareholder = await Shareholder.create(shareHolderBody).then(
          async (shareholder) => {
            shareholder.addDepartments(shareHolderBody.departments, {
              through: ShareholderDepartment,
            });

            let ipAddress = getIpAddress(req.ip);
            const eventLog = await createEventLog(
              req.user.id,
              eventResourceTypes.shareHolder,
              shareholder.name,
              shareholder.id,
              eventActions.create,
              "",
              ipAddress
            );
          }
        );
        res.status(200).json(shareholder);
      }
    } else if (shareholderFound) {
      return res.status(404).json({ msg: "Shareholder already existes" });
    }
  } catch (error) {
    
    res.status(400).json({ msg: error.message });
  }
};

const addPhoneNumber = async (req, res) => {
  try {
    const shareHolder = await ShareHolderPhone.create(req.body);
    res.status(200).json(shareHolder);
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};

const handleActivation = async (req, res) => {
  try {
    // const user = await User.findByPk(req.params.id)
    // const shareHolder = await User.update(
    //   { activated: !user.activated },
    //   { where: { id: req.params.id } }
    // )
    const sh = await Shareholder.findByPk(req.params.id);
    const shareHolder = await Shareholder.update(
      { active: !sh.active },
      { where: { id: req.params.id } }
    );
    let ipAddress = getIpAddress(req.ip);
    const eventLog = await createEventLog(
      req.user.id,
      eventResourceTypes.shareHolder,
      sh.name,
      sh.id,
      eventActions.create,
      "",
      ipAddress
    );
    res.status(200).json(shareHolder);
  } catch (error) {
    
    res.status(400).json({ msg: error.message });
  }
};

const createShareHolders = async (req, res) => {
  const shareHolders = req.body;
  var addedList = 0;
  var duplicate = [];
  var incorrect = [];
  var lineNumber = 1;
  try {
    let promises = await shareHolders.map(async (shareholder) => {
      let addedShareholders = await Shareholder.findOne({
        where: {
          [Op.or]: [
            { primaryEmail: { [Op.like]: shareholder.primaryEmail } },
            { primaryPhone: { [Op.like]: shareholder.primaryPhone } },
            { shareHolderId: shareholder.shareHolderId },
          ],
        },
      }).then(async (addedShareholders) => {
        lineNumber = lineNumber + 1;
        if (
          isEmailValid(shareholder.primaryEmail) &&
          isPhoneNoValid(shareholder.primaryPhone)
        ) {

          if (addedShareholders == null) {//
            shareholder.userId = req.user.id;
            shareholder.active = true;
            try {
              let newShareholder = await Shareholder.create(shareholder).then(
                (e) => {
                  addedList += 1;
                }
              );
            } catch (error) {
              incorrect.push(lineNumber);
            }
          } else {

            duplicate.push(lineNumber);

          }
        } else {
          incorrect.push(shareholder.name);

          


        }
      })



    });
    Promise.all(promises).then(function (results) {
      //  let mess = addedList && `${addedList} partners added` +  duplicate && `${duplicate} rejected
      
      

      let msg = "";
      if (addedList != 0) {
        msg = msg + `${addedList} shareholder added`;
      }
      if (duplicate != 0) {
        msg = msg + ` duplicate value found on  line ${duplicate} \n`;
      }
      if (incorrect.length != 0) {
        msg = msg + ` line ${incorrect} has incorrect values \n`;
      }
      if (duplicate != 0 || incorrect != 0) {
        res.status(400).json({ msg: msg });
      } else {
        res.status(200).json({ msg: msg });
      }
    });
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};

const getShareHolderByPk = async (req, res) => {
  try {
    const shareHolder = await Shareholder.findByPk(req.params.id, {
      include: [User, Employee, Department],
    }).then(async (shareHolder) => {
      if (!shareHolder) {
        res.status(400).json({ message: "No Data Found" });
      } else {
        let ipAddress = getIpAddress(req.ip);
        const eventLog = await createEventLog(
          req.user.id,
          eventResourceTypes.shareHolder,
          shareHolder.name,
          shareHolder.id,
          eventActions.view,
          "",
          ipAddress
        );
        res.status(200).json(shareHolder);
      }
    });
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};

const getSearchResults = async (req, res) => {
  const { key } = req.params;
  
  try {
    const shareHolder = await Shareholder.findAll({
      include: [PhoneNo],
      order: [["id", "ASC"]],
      where: {
        [Op.or]: [
          {
            firstName: {
              [Op.like]: "%" + key + "%",
            },
          },
          {
            lastName: {
              [Op.like]: "%" + key + "%",
            },
          },
          {
            grandfatherName: {
              [Op.like]: "%" + key + "%",
            },
          },
          {
            "$phoneNos.phoneNo$": {
              [Op.like]: "%" + key + "%",
            },
          },
          {
            email: {
              [Op.like]: "%" + key + "%",
            },
          },
          {
            gender: {
              [Op.like]: key + "%",
            },
          },
        ],
      },
    });
    if (!shareHolder) {
      res.status(404).json({ message: "No Data Found" });
    } else res.status(200).json(shareHolder);
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};

const getExcelTemplate = async (req, res) => {
  const fileName = "zemen_shareholders_excel_template.xlsx";
  const fileURL = "../../templates/zemen_shareholders_excel_template.xlsx";
  try {
    const stream = fs.createReadStream(fileURL);
    res.set({
      "Content-Disposition": `attachment; filename='${fileName}'`,
      "Content-Type": "application/xlsx",
    });
    stream.pipe(res);
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};

const editShareHolder = async (req, res) => {
  let shareholderBody = convertFlattenedToNested(req.body);
  const id = shareholderBody.id;
  try {
    const foundShareholder = await Shareholder.findByPk(id);

    if (foundShareholder) {
      shareholderBody.employeeId = shareholderBody.employeeId == "null" ? 0 : shareholderBody.employeeId;

      if (req.file == null) {
        const { profilePicture, ...others } = shareholderBody;
        await Shareholder.update(others, {
          where: { id: id },
        }).then(async (shareholder) => {
          if (shareholderBody.departments != null &&
            shareholderBody.departments != "null" &&
            shareholderBody.departments != "" && shareholderBody.departments && shareholderBody.departments.length > 0) {
            await foundShareholder.setDepartments(shareholderBody.departments, {
              through: ShareholderDepartment,
            });
          }
        });
        const newShareHolder = await Shareholder.findByPk(id);
        const changedFieldValues = getChangedFieldValues(
          foundShareholder,
          newShareHolder
        );
        let ipAddress = getIpAddress(req.ip);
        const eventLog = await createEventLog(
          req.user.id,
          eventResourceTypes.shareHolder,
          newShareHolder.name,
          newShareHolder.id,
          eventActions.edit,
          changedFieldValues,
          ipAddress
        );
        res.status(200).json({ id });
      } else {
        shareholderBody.profilePicture = "/uploads/" + req.file.filename;
        await Shareholder.update(shareholderBody, { where: { id: id } }).then(
          (shareHolder) => {
            if (shareholderBody.departments != null ||
              shareholderBody.departments != "null" ||
              shareholderBody.departments != "") {
              foundShareholder.setDepartments(shareholderBody.departments, {
                through: ShareholderDepartment,
              });
            }
          }
        );
        res.status(200).json({ id });
      }
    } else {
      res.status(400).json({ msg: "No data found" });
    }
  } catch (error) {
    
    res.status(400).json({ msg: error.message });
  }
};

const deleteShareHolder = async (req, res) => {
  const id = req.params.id;
  const t = await sequelize.transaction();

  try {
    const tobeDeletedShareHolder = await Shareholder.findByPk(id);
    await Shareholder.destroy({ where: { id: id } });
    const associatedDepartment = await ShareholderDepartment.findAll({
      where: { shareHolderId: id },
      transaction: t,
    });
    await Promise.all(
      associatedDepartment.map(async (department) => {
        await department.destroy({ transaction: t });
      })
    );
    let ipAddress = getIpAddress(req.ip);
    const eventLog = await createEventLog(
      req.user.id,
      eventResourceTypes.shareHolder,
      tobeDeletedShareHolder.name,
      tobeDeletedShareHolder.id,
      eventActions.create,
      "",
      ipAddress
    );
    await t.commit();
    res.status(200).json({ id });
  } catch (error) {
    await t.rollback();
    res.status(400).json({ msg: error.message });
  }
};

const sendEmail = async (req, res) => {
  const body = req.body;
  try {
    let documents;
    const shareholder = await Shareholder.findAll({
      where: { id: { [Op.in]: [body.shareholders] } },
    });
    if (shareholder) {
      if (body.documents != null) {
        documents = await Document.findAll({
          attributes: ["name", "document"],
          where: {
            id: {
              [Op.in]: [body.documents],
            },
          },
        });
        documents.map((e) => {
          let ext = getFileExtension(e.document);
          e.name = e.name + "." + ext;
        });
      }
      let newDocument = [];
      if (req.files != null) {
        req.files.map((e) => {
          
          let doc = {
            name: e.originalname,
            type: "Email Attachment",
            document: "/uploads/" + e.filename,
            userId: body.userId,
          };
          newDocument.push(doc);
        });

        await Array.prototype.push.apply(
          documents,
          newDocument.map(({ type, ...rest }) => {
            return rest;
          })
        );
      }
      const sendTo = [];
      shareholder.map((e) => {
        if (body.emailType) {
          if (body.emailType.length == 0) {
            if (e.primaryEmail) {
              sendTo.push(e.primaryEmail);
            }
          }
          if (body.emailType.find((element) => element == "primaryEmail")) {
            if (e.primaryEmail) {
              sendTo.push(e.primaryEmail);
            }
          }
          if (body.emailType.find((element) => element == "secondaryEmail")) {
            if (e.secondaryEmail) {
              sendTo.push(e.secondaryEmail);
            }
          }
        } else {
          if (e.primaryEmail) {
            sendTo.push(e.primaryEmail);
          }
        }
      });
      let emails;
      if (body.emailccs) {
        const splitData = body.emailccs.trim().split(",");
        emails = splitData.map((e) => {
          if (e) {
            return { email: e };
          }
        });
      } else {
        emails = [];
      }

      const newEmail = {
        userId: body.userId,
        subject: body.subject,
        message: body.message,
        emailccs: emails,
        documents: newDocument,
      };
      let from = req.user ? req.user.email : "";
      await sendNewEmail(
        sendTo,
        emails,
        body.subject,
        body.message,
        documents,
        from
      ).then((sentEmail) => {
        try {
          if (sentEmail >= 1) {
            const email = Email.create(newEmail, {
              include: [Emailcc, Document],
            }).then((email) => {
              body.shareholders != null &&
                email.addShareholders(body.shareholders.map(Number), {
                  through: ShareholderEmails,
                });
              body.documents != null &&
                email.addDocuments(body.documents, { through: EmailDocument });
            });
            res.status(200).json(email);
          } else {
            res.status(200).json({ msg: "Email not sent" });
          }
        } catch (error) {
          
          res.status(400).json({ msg: error.message });
        }
      });
    }
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};

const sendSMS = async (req, res) => {
  const body = req.body;
  try {
    const shareholder = await Shareholder.findAll({
      where: { id: { [Op.in]: body.shareholders } },
    });
    const sendTo = [];
    if (shareholder) {
      shareholder.map((e) => {
        if (body.phoneType.length == 0) {
          if (e.primaryPhone) {
            sendTo.push(e.primaryPhone);
          }
        }
        if (body.phoneType.find((element) => element == "primaryPhone")) {
          if (e.primaryPhone) {
            sendTo.push(e.primaryPhone);
          }
        }
        if (body.phoneType.find((element) => element == "secondaryPhone")) {
          if (e.secondaryPhone) {
            sendTo.push(e.secondaryPhone);
          }
        }
      });
      if (sendTo.length != 0) {
        return sendNewSms(sendTo, body.content).then((sent) => {
          if (sent.status == 200) {
            try {
              const sms = SMSMessage.create(body).then((sms) => {
                sms.addShareholders(body.shareholders, {
                  through: ShareholderSms,
                });
                return res.status(200).json(sms);
              });
            } catch (error) {
              res.status(400).json({ msg: "sms not sent" });
            }
          } else {
            res.status(400).json({ msg: "sms not sent" });
          }
        });
      } else {
        res.status(400).json({ msg: "Phone number can not be empty" });
      }
    } else {
      res.status(400).json({ msg: "sms not sent" });
    }
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};

const getEmail = async (req, res) => {
  const body = req.params.id;
  try {
    const sms = await Email.findAll({
      include: [User, Shareholder, Document, Emailcc],
      where: { "$shareholders.id$": { [Op.like]: body } },
    });
    res.status(200).json({ rows: sms });
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};
// const sms = await Shareholder.findAll({
//       include: [
//         {
//           model: SMS,
//           include:
//           { model: User },
//         },
//         {
//           model: Vendor,
//           through: { where: { vendorId: body } }
//         }],
//     });
// const getSMS = async (req, res) => {
//   const body = req.params.id;

//   try {
//     const sms = await SMSMessage.findAll({
//       include: [User, Shareholder],
//       where: { "$shareholders.id$": { [Op.like]: body } },
//     });

//     res.status(200).json(sms);
//   } catch (error) {
//     
//     res.status(400).json({ msg: error.message });
//   }
// };

const getSMS = async (req, res) => {
  const body = req.params.id;
  try {
    const sms = await SMSMessage.findAndCountAll({
      include: [User, Shareholder],
      where: { "$shareholders.id$": { [Op.like]: body } },
      order: [["createdAt", "DESC"]],
    });

    res.status(200).json(sms);
  } catch (error) {
    
    res.status(400).json({ msg: error.message });
  }
};


const profileUpload = async (req, res) => {
  try {
    

    if (req.file == null) {
      
      return res.status(400).json({ msg: "File Not  Uploaded" });
    } else {
      
      const vendor = await Shareholder.update(
        { profilePicture: "/uploads/" + req.file.filename },
        { where: { id: req.body.id } }
      );

      res.status(200).json(vendor);
    }
  } catch (error) {
    
    res.status(400).json({ msg: error.message });
  }
};

const getReportShareholder = async (req, res) => {
  let {
    numberOfShare,
    gender,
    employees,
    departments,
    shareHolderId,
    influentialReport,
    activeReport,
    type,
    majorReport,
    name,
  } = req.body;
  const { f, r, st, sc, sd } = req.query;
  
  try {
    const competitor = await Shareholder.findAndCountAll({
      include: [Department, Employee, User],
      offset: Number(f),
      limit: Number(r),
      subQuery: false,
      // raw: true,
      distinct: true,
      where: {
        [Op.and]: [
          numberOfShare && {
            numberOfShare: numberOfShare.split(",").map((e) => {
              return e.trim();
            }),
          },
          shareHolderId && {
            shareHolderId: shareHolderId.split(",").map((e) => {
              return e.trim();
            }),
          },
          gender.length != 0 && { gender: { [Op.in]: gender } },
          influentialReport.length != 0 && {
            influential: { [Op.in]: influentialReport },
          },
          majorReport.length != 0 && { major: { [Op.in]: majorReport } },
          name && {
            name: {
              [Op.in]: name.split(",").map((e) => {
                return e.trim();
              }),
            },
          },
          activeReport.length != 0 && { active: { [Op.in]: activeReport } },
          type.length != 0 && { type: { [Op.in]: type } },
          //  influential && {influential: categorysplit(',').map((e) => {
          //        return e.trim()
          //  })
          // },
          //    major && {major: categorysplit(',').map((e) => {
          //        return e.trim()
          //    })  },
          //   // active && {active: active},
          // // {woreda: {[Op.in]: [woreda] }},
          // // {kebele: {[Op.in]: [kebele] }},
          // // {zipCode: { [Op.in]: [zipCode]}},
          // employeeId && { "$employee.id$": employeeId },
          departments.length != 0 && {
            "$departments.id$": { [Op.in]: departments },
          },
          employees.length != 0 && { "$employee.id$": employees },
        ],
      },

    });
    
    res.status(200).json(competitor);
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};

const getReports = async (req, res) => {
  let {
    numberOfShare,
    gender,
    type,
    major,
    employees,
    departments,
    influentialReport,
    majorReport,
    name,
    activeReport,
  } = req.body;
  try {
    const competitor = await Shareholder.findAll({
      include: [Department, Employee, User],
      where: {
        [Op.and]: [
          gender.length != 0 && { gender: { [Op.in]: gender } },
          numberOfShare && {
            numberOfShare: numberOfShare.split(",").map((e) => {
              return e.trim();
            }),
          },
          influentialReport.length != 0 && {
            influential: { [Op.in]: influentialReport },
          },
          majorReport.length != 0 && { major: { [Op.in]: majorReport } },

          activeReport.length != 0 && { active: { [Op.in]: activeReport } },
          type.length != 0 && { type: { [Op.in]: type } },
          name && {
            name: {
              [Op.in]: name.split(",").map((e) => {
                return e.trim();
              }),
            },
          },

          //   // active && {active: active},
          // // {woreda: {[Op.in]: [woreda] }},
          // // {kebele: {[Op.in]: [kebele] }},
          // // {zipCode: { [Op.in]: [zipCode]}},
          // employeeId && { "$employee.id$": employeeId },
          departments.length != 0 && {
            "$departments.id$": { [Op.in]: departments },
          },
          employees.length != 0 && { "$employee.id$": employees },
        ],
      },
    });

    res.status(200).json(competitor);
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};

const getAllShareholders = async (req, res) => {
  const currentUser = await req.user;

  try {
    if (req.type == "all") {
      const data = await Shareholder.findAll({
        include: [User],
      });
      res.status(200).json(data);
    } else if (req.type == "self") {
      const user = await User.findByPk(currentUser.id, { include: [Employee] });
      const data = await Shareholder.findAll({
        include: [User, Employee, Department],
        where: {
          [Op.or]: [
            { userId: { [Op.like]: `%${currentUser.id}%` } },
            { "$employee.userId$": { [Op.like]: `%${currentUser.id}%` } },
            user.employee && {
              "$departments.id$": {
                [Op.like]: `%${user.employee.departmentId}%`,
              },
            },
          ],
        },
      });
      res.status(200).json(data);
    } else if (req.type == "branch") {
      const data = await Shareholder.findAll({
        include: [{ model: User, include: [Employee] }, Employee, Department],
        where: {
          [Op.and]: [
            currentUser.employee
              ? {
                "$user.employee.branchId$": {
                  [Op.like]: `%${currentUser.employee.branchId}%`,
                },
              }
              : { id: null },
          ],
        },
      });
      res.status(200).json(data);
    }
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};

module.exports = {
  getAllShareholders,
  getShareHolder,
  getExcelTemplate,
  createShareHolder,
  createShareHolders,
  getShareHolderByPk,
  getSearchResults,
  editShareHolder,
  deleteShareHolder,
  handleActivation,
  addPhoneNumber,
  sendEmail,
  sendSMS,
  getEmail,
  getSMS,
  profileUpload,
  getReports,
  getReportShareholder,
};
