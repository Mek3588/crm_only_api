const User = require("../../../models/acl/user");
const Employee = require("../../../models/Employee");
const SMS = require("../../../models/SMS");
const VendorComment = require("../../../models/vendor/VendorComment");
const Vendor = require("../../../models/vendor/Vendors");
const { Op } = require("sequelize");
const SMSMessage = require("../../../models/SMS");
const Email = require("../../../models/EmailModel");
const VendorSms = require("../../../models/vendor/VendorSMS");
const VendorEmails = require("../../../models/vendor/VendorEmail");
const Department = require("../../../models/Department");
const VendorDepartment = require("../../../models/vendor/VendorDepartment");
const { sendNewSms } = require("../SMSServiceHandler");
const { sendNewEmail } = require("../EmailServiceHandler");
const Document = require("../../../models/Document");
const Emailcc = require("../../../models/EmailCc");
const EmailDocument = require("../../../models/EmailDocument");
const sequelize = require("../../../database/connections");
//activate , comment
const express = require("express");
const path = require("path");
const {
  Role,
  eventResourceTypes,
  eventActions,
} = require("../../../utils/constants");
const {
  getFileExtension,
  isPhoneNoValid,
  isEmailValid,
  getIpAddress,
  getChangedFieldValues,
  convertFlattenedToNested,
  createEventLog,
} = require("../../../utils/GeneralUtils");
const app = express();

app.use(express.static(path.resolve("../../../uploads")));

const getSearch = (st) => {
  return {
    [Op.or]: [
      { vendorName: { [Op.like]: `%${st}%` } },
      { active: { [Op.like]: `%${st}%` } },
      { website: { [Op.like]: `%${st}%` } },
      { primaryEmail: { [Op.like]: `%${st}%` } },
      { primaryPhone: { [Op.like]: `%${st}%` } },
      { secondaryEmail: { [Op.like]: `%${st}%` } },
      { secondaryPhone: { [Op.like]: `%${st}%` } },
      { country: { [Op.like]: `%${st}%` } },
      { region: { [Op.like]: `%${st}%` } },
      { city: { [Op.like]: `%${st}%` } },
      { subcity: { [Op.like]: `%${st}%` } },
      { woreda: { [Op.like]: `%${st}%` } },
      { kebele: { [Op.like]: `%${st}%` } },
      { building: { [Op.like]: `%${st}%` } },
      { officeNumber: { [Op.like]: `%${st}%` } },
      { poBox: { [Op.like]: `%${st}%` } },
      { zipCode: { [Op.like]: `%${st}%` } },
      { tot: { [Op.like]: `%${st}%` } },
      { streetName: { [Op.like]: `%${st}%` } },
      { tinNumber: { [Op.like]: `%${st}%` } },
      { registeredForVat: { [Op.like]: `%${st}%` } },
      { vatRegistrationNumber: { [Op.like]: `%${st}%` } },
      { category: { [Op.like]: `%${st}%` } },
      { annualPlan: { [Op.like]: `%${st}%` } },
    ],
  };
};

const getVendors = async (req, res) => {
  const { f, r, st, sc, sd } = req.query;
  try {
    const currentUser = req.user;
    if (req.type == "all") {
      const data = await Vendor.findAndCountAll({
        include: [User, Employee, Department],
        offset: Number(f),
        limit: Number(r),
        order: [[sc || "vendorName", sd == 1 ? "ASC" : "DESC"]],
        where: getSearch(st),
        subQuery: false,
      });
      res.status(200).json(data);
    } else if (req.type == "self") {
      const user = await User.findByPk(currentUser.id, { include: [Employee] });
      const data = await Vendor.findAndCountAll({
        include: [User, Employee, Department],
        offset: Number(f),
        limit: Number(r),
        order: [[sc || "vendorName", sd == 1 ? "ASC" : "DESC"]],
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
      // const user = await User.findByPk(currentUser.id,{include:[Employee]})
      const data = await Vendor.findAndCountAll({
        include: [{ model: User, include: [Employee] }, Employee, Department],
        offset: Number(f),
        limit: Number(r),
        order: [[sc || "vendorName", sd == 1 ? "ASC" : "DESC"]],
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

const handleActivation = async (req, res) => {
  try {
    const vh = await Vendor.findByPk(req.params.id);
    const vendor = await Vendor.update(
      { active: !vh.active },
      { where: { id: req.params.id } }
    );
    res.status(200).json(vendor);
  } catch (error) {
    
    res.status(400).json({ msg: error.message });
  }
};

const getReportVendor = async (req, res) => {
  let {
    country,
    city,
    region,
    subcity,
    active,
    employees,
    departments,
    category,
    vendorName,
    activeReport,
  } = req.body;
  const { f, r, st, sc, sd } = req.query;

  try {
    
    const vendor = await Vendor.findAndCountAll({
      offset: Number(f),
      limit: Number(r),
      order: [[sc || "vendorName", sd == 1 ? "ASC" : "DESC"]],
      include: [Department, Employee, User],
      where: {
        [Op.and]: [
          country.length != 0 && { country: { [Op.in]: country } },
          region.length != 0 && { region: { [Op.in]: region } },
          city.length != 0 && { city: { [Op.in]: city } },
          subcity.length != 0 && { subcity: { [Op.in]: subcity } },
          category && {
            category: categorysplit(",").map((e) => {
              return e.trim();
            }),
          },
          vendorName && {
            vendorName: {
              [Op.in]: vendorName.split(",").map((e) => {
                return e.trim();
              }),
            },
          },
          activeReport.length != 0 && { active: { [Op.in]: activeReport } },
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
      subQuery: false,
      // raw: true,
      distinct: true,
    });
    
    

    res.status(200).json(vendor);
  } catch (error) {
    
    res.status(400).json({ msg: error.message });
  }
};

const getReports = async (req, res) => {
  let {
    country,
    city,
    region,
    subcity,
    active,
    employees,
    departments,
    category,
    vendorName,
    activeReport,
  } = req.body;
  try {
    const competitor = await Vendor.findAll({
      include: [Department, Employee, User],
      where: {
        [Op.and]: [
          country.length != 0 && { country: { [Op.in]: country } },
          region.length != 0 && { region: { [Op.in]: region } },
          city && {
            city: city.split(",").map((e) => {
              return e.trim();
            }),
          },
          subcity && {
            subcity: subcity.split(",").map((e) => {
              return e.trim();
            }),
          },
          category && {
            category: categorysplit(",").map((e) => {
              return e.trim();
            }),
          },
          vendorName && {
            vendorName: {
              [Op.in]: vendorName.split(",").map((e) => {
                return e.trim();
              }),
            },
          },
          activeReport.length != 0 && { active: { [Op.in]: activeReport } },
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

const getVendor = async (req, res) => {
  const { id } = req.params;
  try {
    const data = await Vendor.findByPk(id, {
      include: [User, Employee, Department],
    });
    let ipAddress = getIpAddress(req.ip);
    const eventLog = await createEventLog(
      req.user.id,
      eventResourceTypes.vendor,
      data.vendorName,
      data.id,
      eventActions.view,
      "",
      ipAddress
    );
    res.status(200).json(data);
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};

//posting
const createVendor = async (req, res) => {
  let body = convertFlattenedToNested(req.body);

  try {
    const vendorFound = await Vendor.findOne({
      where: {
        [Op.or]: [
          { primaryEmail: { [Op.like]: body.primaryEmail } },
          { primaryPhone: { [Op.like]: body.primaryPhone } },
        ],
      },
    });
    if (vendorFound == null) {
      if (req.file == null) {
        const { profilePicture, ...others } = body;
        const vendor = await Vendor.create(others) 
          vendor.addDepartments(body.departments, {
            through: VendorDepartment,
          });

          let ipAddress = getIpAddress(req.ip);
          const eventLog = await createEventLog(
            req.user.id,
            eventResourceTypes.vendor,
            vendor.vendorName,
            vendor.id,
            eventActions.create,
            "",
            ipAddress
          );
        
        res.status(200).json(vendor);
      } else {
        body.profilePicture = "/uploads/" + req.file.filename;
        const vendor = await Vendor.create(body)
          vendor.addDepartments(body.departments, {
            through: VendorDepartment,
          });

          let ipAddress = getIpAddress(req.ip);
          const eventLog = await createEventLog(
            req.user.id,
            eventResourceTypes.vendor,
            vendor.vendorName,
            vendor.id,
            eventActions.create,
            "",
            ipAddress
          );
        
        res.status(200).json(vendor);
      }
    } else if (vendorFound) {
      res.status(400).json({ msg: "Vendor exists" });
      return;
    }
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};

const createVendors = async (req, res) => {
  const body = req.body;
  var addedList = 0;
  var duplicate = [];
  var incorrect = [];
  var lineNumber = 1;
  try {
    let promises = body.map(async (vendor) => {
      let addedVendors = await Vendor.findAll({
        where: {
          [Op.or]: [
            { primaryEmail: { [Op.like]: vendor.primaryEmail } },
            { primaryPhone: { [Op.like]: vendor.primaryPhone } },
          ],
        },
      }).then(async (addedVendors) => {
        lineNumber = lineNumber + 1;
        if (
          isEmailValid(vendor.primaryEmail) &&
          isPhoneNoValid(vendor.primaryPhone)
        ) {
          if (addedVendors.length == 0) {
            vendor.userId = req.user.id;
            vendor.active = true;
            try {
              let x = await Vendor.create(vendor);
              
              addedList += 1;
            } catch (error) {
              
              incorrect.push(lineNumber);
            }
          } else {
            duplicate.push(lineNumber);
          }
        } else {
          incorrect.push(lineNumber);
        }
      })


    });
    Promise.all(promises).then(function (results) {
      // let mess = addedList && `${addedList} partners added` +  duplicate && `${duplicate} rejected`
      let msg = "";
      if (addedList != 0) {
        msg = msg + `${addedList} vendor added`;
      }
      if (duplicate != 0) {
        msg = msg + ` duplicate value found on line ${duplicate} \n`;
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

const getVendorByPk = async (req, res) => {
  try {
    const vendor = await Vendor.findByPk(req.params.id).then(async (vendor) => {
      if (!vendor) {
        res.status(400).json({ message: "No Data Found" });
      }
      let ipAddress = getIpAddress(req.ip);
      const eventLog = await createEventLog(
        req.user.id,
        eventResourceTypes.vendor,
        vendor.vendorName,
        vendor.id,
        eventActions.view,
        "",
        ipAddress
      );
      res.status(200).json(vendor);
    });

    res.status(200).json(vendor);
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};

const editVendor = async (req, res) => {
  let vendorBody = convertFlattenedToNested(req.body);
  const id = vendorBody.id;
  try {
    const foundVendor = await Vendor.findByPk(id);

    if (foundVendor) {
      vendorBody.employeeId = vendorBody.employeeId == "null" ? 0 : vendorBody.employeeId;

      if (req.file == null) {
        const { profilePicture, ...others } = vendorBody;
        await Vendor.update(others, { where: { id: id } }).then(async (vendor) => {
          if (vendorBody.departments != null &&
            vendorBody.departments != "null" &&
            vendorBody.departments != "" && vendorBody.departments !=0 && vendorBody.departments != undefined
            && vendorBody.departments && vendorBody.departments.length > 0
            ) {
            await foundVendor.setDepartments(vendorBody.departments, {
              through: VendorDepartment,
            });
          }
        });
        const newVendor = await Vendor.findByPk(id);
        const changedFieldValues = getChangedFieldValues(
          foundVendor,
          newVendor
        );
        let ipAddress = getIpAddress(req.ip);
        const eventLog = await createEventLog(
          req.user.id,
          eventResourceTypes.vendor,
          newVendor.vendorName,
          newVendor.id,
          eventActions.edit,
          changedFieldValues,
          ipAddress
        );
        res.status(200).json({ id });
      } else {
        vendorBody.profilePicture = "/uploads/" + req.file.filename;
        await Vendor.update(vendorBody, { where: { id: id } }).then(
          (vendor) => {
            if (vendorBody.departments != null &&
              vendorBody.departments != "null" &&
              vendorBody.departments != "") {
              foundVendor.setDepartments(vendorBody.departments, {
                through: VendorDepartment,
              });
            }
          }
        );
        const newVendor = await Vendor.findByPk(id);
        const changedFieldValues = getChangedFieldValues(
          foundVendor,
          newVendor
        );
        let ipAddress = getIpAddress(req.ip);
        const eventLog = await createEventLog(
          req.user.id,
          eventResourceTypes.vendor,
          newVendor.vendorName,
          newVendor.id,
          eventActions.edit,
          changedFieldValues,
          ipAddress
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

const deleteVendor = async (req, res) => {
  const id = req.params.id;
  const t = await sequelize.transaction();
  try {
    const tobeDeletedVendor = await Vendor.findByPk(id);
    await Vendor.destroy({ where: { id: id } });
    const associatedDepartment = await VendorDepartment.findAll({
      where: { vendorId: id },
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
      eventResourceTypes.vendor,
      tobeDeletedVendor.vendorName,
      tobeDeletedVendor.id,
      eventActions.delete,
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
    const vendor = await Vendor.findAll({
      where: { id: { [Op.in]: [body.vendors] } },
    });
    if (vendor) {
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
      vendor.map((e) => {
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
      if (sendTo.length != 0) {
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
                email.addVendors(body.vendors.map(Number), {
                  through: VendorEmails,
                });
                body.documents != null &&
                  email.addDocuments(body.documents, {
                    through: EmailDocument,
                  });
              });
              res.status(200).json(email);
            } else {
              res.status(200).json({ msg: "Email not sent" });
            }
          } catch (error) {
            
            res.status(400).json({ msg: error.message });
          }
        });
      } else {
        res.status(400).json({ msg: "Email can not be empty" });
      }
    }
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};

const sendSMS = async (req, res) => {
  const body = req.body;

  try {
    const vendor = await Vendor.findAll({
      where: { id: { [Op.in]: body.vendors } },
    });
    const sendTo = [];
    if (vendor) {
      vendor.map((e) => {
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
                sms.addVendors(body.vendors, { through: VendorSms });
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
      include: [User, Vendor, Document, Emailcc],
      order: [["createdAt", "DESC"]],
      where: { "$vendors.id$": { [Op.like]: body } },
    });
    res.status(200).json({ rows: sms });
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};
// const sms = await Vendor.findAll({
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
//       include: [User, Vendor],
//       order: [["createdAt", "DESC"]],
//       where: { "$vendors.id$": { [Op.like]: body } },
//     });
//     res.status(200).json(sms);
//   } catch (error) {
//     res.status(400).json({ msg: error.message });
//   }
// };
const getSMS = async (req, res) => {
  const body = req.params.id;
  try {
    const { f, r, st, sc, sd } = req.query;
    const sms = await SMSMessage.findAndCountAll({
      include: [{ model: User, attributes: ['id', 'corporate_name', 'first_name', 'middle_name', 'last_name', 'email', 'phone', 'gender'] }, Vendor],
      where: { "$vendors.id$": { [Op.like]: body } },
      offset: Number(f),
      limit: Number(r),
      order: [[sc || "createdAt", sd == 1 ? "DESC" : "ASC"]],
      // where: getSearch(st),
      subQuery: false,
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
      
      const vendor = await Vendor.update(
        { profilePicture: "/uploads/" + req.file.filename },
        { where: { id: req.body.id } }
      );

      res.status(200).json(vendor);
    }
  } catch (error) {
    
    res.status(400).json({ msg: error.message });
  }
};

const getAllVendors = async (req, res) => {
  try {
    const currentUser = await req.user;

    if (req.type == "all") {
      const data = await Vendor.findAll({
        include: [User],
      });
      res.status(200).json(data);
    } else if (req.type == "self") {
      const user = await User.findByPk(currentUser.id, { include: [Employee] });
      const data = await Vendor.findAll({
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
      const data = await Vendor.findAll({
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
  getAllVendors,
  getVendor,
  getVendors,
  createVendor,
  createVendors,
  getVendorByPk,
  editVendor,
  deleteVendor,
  handleActivation,
  getSMS,
  sendSMS,
  getEmail,
  sendEmail,
  profileUpload,
  getReports,
  getReportVendor,
};
