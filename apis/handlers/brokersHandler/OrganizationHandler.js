const Organization = require("../../../models/broker/Organization");
const {
  isPhoneNoValid,
  getFileExtension,
  isEmailValid,
  createEventLog,
  convertFlattenedToNested,
  getIpAddress,
  getChangedFieldValues,
} = require("../../../utils/GeneralUtils");
const { Op } = require("sequelize");
const PhoneNo = require("../../../models/PhoneNo");
const SMSMessage = require("../../../models/SMS");
const OrganizationDepartment = require("../../../models/broker/OrganizationDepartment");
const Department = require("../../../models/Department");

const OrganizationEmails = require("../../../models/broker/OrganizationEmail");
const OrganizationSms = require("../../../models/broker/OrganizationSMS");
const { sendNewSms } = require("../SMSServiceHandler");
const { sendNewEmail } = require("../EmailServiceHandler");
const User = require("../../../models/acl/user");
const EmailModel = require("../../../models/EmailModel");
const Emailcc = require("../../../models/EmailCc");
const Document = require("../../../models/Document");
const EmailDocument = require("../../../models/EmailDocument");
const sequelize = require("../../../database/connections");
const Agent = require("../../../models/agent/Agent");
const {
  eventResourceTypes,
  eventActions,
} = require("../../../utils/constants");
// const excelTemplate = require('../../uploads/zemen_organizations_excel_template.xlsx');

const getSearch = (st) => {
  let phoneSearch = st.trim();
if (st && st.startsWith("0")) {
  phoneSearch = st.slice(1);
}
return {
  [Op.or]: [
    { name: { [Op.like]: `%${st}%` } },
    { primaryPhone: { [Op.like]: `%${phoneSearch}%` } },
    { secondaryPhone: { [Op.like]: `%${phoneSearch}%` } },
    { primaryEmail: { [Op.like]: `%${st}%` } },
    { secondaryEmail: { [Op.like]: `%${st}%` } },
    { country: { [Op.like]: `%${st}%` } },
    { region: { [Op.like]: `%${st}%` } },
    { city: { [Op.like]: `%${st}%` } },
    { subcity: { [Op.like]: `%${st}%` } },
    { woreda: { [Op.like]: `%${st}%` } },
    { kebele: { [Op.like]: `%${st}%` } },
    { tinNumber: { [Op.like]: `%${st}%` } },
    { licenseNumber: { [Op.like]: `%${st}%` } },
    { licenseIssuedDate: { [Op.like]: `%${st}%` } },
    { licenseExpirationDate: { [Op.like]: `%${st}%` } },
    { vatRegistrationNumber: { [Op.like]: `%${st}%` } },
    { tot: { [Op.like]: `%${st}%` } },
    // { zipCode: { [Op.like]: `%${st}%` } },
    // { streetName: { [Op.like]: `%${st}%` } },
  ],
};
};

const getOrganization = async (req, res) => {
  
  const { f, r, st, sc, sd } = req.query;
  try {
    const data = await Organization.findAndCountAll({
      include: [User],
      offset: Number(f),
      limit: Number(r),
      order: [[sc || "createdAt", sd == 1 ? "DESC" : "ASC"]],
      where: getSearch(st),
      subQuery: false,
    });
    res.status(200).json(data);
  } catch (error) {
    
    res.status(400).json({ msg: error.message });
  }
};

//posting
const createOrganization = async (req, res) => {
  let organizationBody = convertFlattenedToNested(req.body);
  const { primaryEmail, secondaryEmail, primaryPhone, secondaryPhone } =
    organizationBody;
  try {
    if (primaryPhone == secondaryPhone) {
      res.status(400).json({
        msg: "Primary phone number and secondary phone number cannot be similar",
      });
      return;
    }
    if (
      primaryEmail == secondaryEmail &&
      primaryEmail != "" &&
      secondaryEmail != ""
    ) {
      res.status(400).json({
        msg: "Primary email and secondary email cannot be similar",
      });
      return;
    }
    const organizationFound = await Organization.findOne({
      where: {
        [Op.or]: [
          { primaryEmail: { [Op.like]: primaryEmail } },
          { primaryPhone: { [Op.like]: organizationBody.primaryPhone } },
        ],
      },
    });

    if (organizationFound === null) {
      if (req.file == null) {
        const { profilePicture, ...others } = organizationBody;
        const data = await Organization.create(others).then(
          async (data) => {
            data.addDepartments(organizationBody.departments, {
              through: OrganizationDepartment,
            });
            let ipAddress = getIpAddress(req.ip);
            const eventLog = await createEventLog(
              req.user.id,
              eventResourceTypes.broker,
              data.name,
              data.id,
              eventActions.create,
              "",
              ipAddress
            );
          }
        );
        res.status(200).json(data);
      } else {
        organizationBody.profilePicture = "/uploads/" + req.file.filename;
        const data = await Organization.create(organizationBody).then(
          async (data) => {
            data.addDepartments(organizationBody.departments, {
              through: OrganizationDepartment,
            });
            let ipAddress = getIpAddress(req.ip);
            const eventLog = await createEventLog(
              req.user.id,
              eventResourceTypes.broker,
              data.organization,
              data.id,
              eventActions.create,
              "",
              ipAddress
            );
          }
        );
        res.status(200).json(data);
      }
    } else if (organizationFound) {
      res.status(400).json({ msg: "Organization existes" });
      return;
    }
  } catch (error) {
    
    res.status(400).json({ msg: error.message });
  }
};

const addPhoneNumber = async (req, res) => {
  try {
    const organization = await OrganizationPhone.create(req.body);
    res.status(200).json(organization);
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};

const handleActivation = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);
    const organization = await User.update(
      { activated: !user.activated },
      { where: { id: req.params.id } }
    );
    // const sh = await Organization.findByPk(req.params.id)
    // const organization = await Organization.update(
    //   { active: !sh.active },
    //   {where :{id:req.params.id}}
    // )
    res.status(200).json(organization);
  } catch (error) {
    
    res.status(400).json({ msg: error.message });
  }
};

const createOrganizations = async (req, res) => {
  const organizations = req.body;
  var addedList = 0;
  var duplicate = [];
  var incorrect = [];
  var lineNumber = 2;

  try {
    const promises = organizations.map(async (organization) => {
      let addedOrganizations = await Organization.findOne({
        where: {
          [Op.or]: [
            { primaryEmail: { [Op.like]: organization.primaryEmail } },
            { primaryPhone: { [Op.like]: organization.primaryPhone } },
            { licenseNumber: { [Op.like]: organization.licenseNumber } },
          ],
        },
      }).then(async (addedOrganizations) => {
        lineNumber = lineNumber + 1;
        if (
          isEmailValid(organization.primaryEmail) &&
          isPhoneNoValid(organization.primaryPhone)
        ) {
          if (addedOrganizations == null) {
            organization.userId = req.user.id;
            try {
              let newOrganization = await Organization.create(organization);
              newOrganization && (addedList += 1);
            } catch (error) {
              

              incorrect.push(lineNumber);
              // if (error.name == "SequelizeValidationError") {
              //   

              // }
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
        msg = msg + `${addedList}  brokers added`;
      }
      if (duplicate.length != 0) {
        msg =
          msg == ""
            ? `Duplicate value found on line ${duplicate}`
            : msg + `, Duplicate value found on line ${duplicate}`;
      }
      if (incorrect.length != 0) {
        
        msg =
          msg == ""
            ? `Line ${incorrect} has incorrect values`
            : msg + `, Line ${incorrect} has incorrect values`;
        
      }

      if (duplicate != 0 || incorrect.length != 0) {
        
        res.status(400).json({ msg: msg });
      } else {
        res.status(200).json({ msg: msg });
      }
    });
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};

const getOrganizationByPk = async (req, res) => {
  try {
    const organization = await Organization.findByPk(req.params.id, {
      include: [User, Department],
    }).then(async (organization) => {
      if (!organization) {
        res.status(400).json({ message: "No Data Found" });
      } else {
        let ipAddress = getIpAddress(req.ip);
        const eventLog = await createEventLog(
          req.user.id,
          eventResourceTypes.broker,
          organization.name,
          organization.id,
          eventActions.view,
          "",
          ipAddress
        );

        res.status(200).json(organization);
      }
    });
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};

const getExcelTemplate = async (req, res) => {
  const fileName = "zemen_organizations_excel_template.xlsx";
  const fileURL = "../../templates/zemen_organizations_excel_template.xlsx";
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
const editOrganization = async (req, res) => {
  const organizationBody = convertFlattenedToNested(req.body);
  const id = organizationBody.id;
  try {
    const foundOrganization = await Organization.findByPk(id);

    if (foundOrganization) {
      if (req.file == null) {
        const { profilePicture, ...others } = organizationBody;
        await Organization.update(others, { where: { id: id } });

        const newOrganization = await Organization.findByPk(id);
        const changedFieldValues = getChangedFieldValues(
          foundOrganization,
          newOrganization
        );
        let ipAddress = getIpAddress(req.ip);
        const eventLog = await createEventLog(
          req.user.id,
          eventResourceTypes.broker,
          newOrganization.name,
          newOrganization.id,
          eventActions.edit,
          changedFieldValues,
          ipAddress
        );
        res.status(200).json({ id });
      } else {
        organizationBody.profilePicture = "/uploads/" + req.file.filename;
        await Organization.update(organizationBody, { where: { id: id } });
        res.status(200).json({ id });
      }
    } else {
      res.status(400).json({ msg: "No data found" });
    }
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};

const deleteOrganization = async (req, res) => {
  const id = req.params.id;
  const t = await sequelize.transaction();
  try {
    const foundOrganization = await Organization.findByPk(id);
    await Organization.destroy({ where: { id: id } });

    const associatedDepartment = await OrganizationDepartment.findAll({
      where: { organizationId: id },
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
      eventResourceTypes.broker,
      foundOrganization.name,
      foundOrganization.id,
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
    const organization = await Organization.findAll({
      where: { id: { [Op.in]: [body.organizations] } },
    });
    if (organization) {
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
      }
      const sendTo = [];
      organization.map((e) => {
        if (body.emailType) {
          if (body.emailType.length == 0) {
            if (e.primaryEmail) {
              sendTo.push(e.primaryEmail);
            }
          }
          if (body.emailType.find((element) => element == "primaryEmail")) {
            sendTo.push(e.primaryEmail);
          }
          if (body.emailType.find((element) => element == "secondaryEmail")) {
            sendTo.push(e.secondaryEmail);
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
      ).then(async (sentEmail) => {
        try {
          if (sentEmail >= 1) {
            const email = EmailModel.create(newEmail, {
              include: [Emailcc, Document],
            }).then((email) => {
              email.addOrganizations(body.organizations.map(Number), {
                through: OrganizationEmails,
              });
              body.documents != null &&
                email.addDocuments(body.documents, { through: EmailDocument });
            });
            // let ipAddress = await getIpAddress(req.ip);
            // const eventLog = await createEventLog(
            //   req.user.id,
            //   eventResourceTypes.organizationEmail,
            //   organization.firstName,
            //   organization.id,
            //   eventActions.create,
            //   "",
            //   ipAddress
            // );
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
    const organization = await Organization.findAll({
      where: { id: { [Op.in]: [body.organizations] } },
    });
    const sendTo = [];
    if (organization) {
      organization.map((e) => {
        if (body.phoneType.length == 0) {
          sendTo.push(e.primaryPhone);
        }
        if (body.phoneType.find((element) => element == "primaryPhone")) {
          sendTo.push(e.primaryPhone);
        }
        if (body.phoneType.find((element) => element == "secondaryPhone")) {
          sendTo.push(e.secondaryPhone);
        }
      });
      return sendNewSms(sendTo, body.content).then((sent) => {
        if (sent.status == 200) {
          try {
            const sms = SMSMessage.create(body).then(async (sms) => {
              sms.addOrganizations(body.organizations, {
                through: OrganizationSms,
              });

              // let ipAddress = await getIpAddress(req.ip);
              // const eventLog = await createEventLog(
              //   req.user.id,
              //   eventResourceTypes.organizationEmail,
              //   organization.name,
              //   organization.id,
              //   eventActions.create,
              //   "",
              //   ipAddress
              // );
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
      res.status(400).json({ msg: "sms not sent" });
    }
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};

const getEmail = async (req, res) => {
  const body = req.params.id;
  try {
    const sms = await EmailModel.findAll({
      include: [User, Organization, Emailcc, Document],
      order: [["createdAt", "DESC"]],
      order: [["createdAt", "DESC"]],
      where: { "$organizations.id$": { [Op.like]: body } },
    });
    res.status(200).json({ rows: sms });
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};


const getSMS = async (req, res) => {
  const body = req.params.id;
  try {
    const { f, r, st, sc, sd } = req.query;
    const sms = await SMSMessage.findAndCountAll({
      include: [{ model: User, attributes: ['id', 'corporate_name', 'first_name', 'middle_name', 'last_name', 'email', 'phone', 'gender'] }, Organization],
      where: { "$organizations.id$": { [Op.like]: body } },
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


const getReports = async (req, res) => {
  let {
    country,
    city,
    region,
    subcity,
    licenseExpirationDate,
    licenseType,
    name,
  } = req.body;
  try {
    // city =  JSON.parse("[" + city + "]");

    let organization;

    organization = await Organization.findAll({
      include: [User],
      where: {
        // city: [city]
        [Op.and]: [
          country.length != 0 && { country: { [Op.in]: country } },
          region.length != 0 && { region: { [Op.in]: region } },
          city.length != 0 && { city: { [Op.in]: city } },
          subcity.length != 0 && { subcity: { [Op.in]: subcity } },

          //  city && {city: city.split(',').map((e) => {
          //        return e.trim()
          //    })},
          //  subcity && { subcity: subcity.split(',').map((e) => {
          //        return e.trim()
          //  })
          // },
          name && {
            name: {
              [Op.in]: name.split(",").map((e) => {
                return e.trim();
              }),
            },
          },
          //   //   // active && {active: active},
          //   // // {woreda: {[Op.in]: [woreda] }},
          //   // // {kebele: {[Op.in]: [kebele] }},
          //   // // {zipCode: { [Op.in]: [zipCode]}},

          licenseExpirationDate && {
            licenseExpirationDate: licenseExpirationDate.split(",").map((e) => {
              return e.trim();
            }),
          },
          licenseType && {
            licenseType: licenseType.split(",").map((e) => {
              return e.trim();
            }),
          },
        ],
      },
    });

    
    res.status(200).json(organization);
  } catch (error) {
    
    res.status(400).json({ msg: error.message });
  }
};

const getReportOrganization = async (req, res) => {
  let {
    country,
    city,
    region,
    subcity,
    licenseExpirationDate,
    licenseType,
    name,
  } = req.body;
  const { f, r, st, sc, sd } = req.query;
  try {
    // city =  JSON.parse("[" + city + "]");

    let organization;

    organization = await Organization.findAndCountAll({
      offset: Number(f),
      limit: Number(r),
      order: [[sc || "createdAt", sd == 1 ? "ASC" : "DESC"]],
      include: [User],
      where: {
        // city: [city]
        [Op.and]: [
          country.length != 0 && { country: { [Op.in]: country } },
          region.length != 0 && { region: { [Op.in]: region } },
          city.length != 0 && { city: { [Op.in]: city } },
          subcity.length != 0 && { subcity: { [Op.in]: subcity } },

          name && {
            name: {
              [Op.in]: name.split(",").map((e) => {
                return e.trim();
              }),
            },
          },

          //   //   // active && {active: active},
          //   // // {woreda: {[Op.in]: [woreda] }},
          //   // // {kebele: {[Op.in]: [kebele] }},
          //   // // {zipCode: { [Op.in]: [zipCode]}},

          licenseExpirationDate && {
            licenseExpirationDate: licenseExpirationDate.split(",").map((e) => {
              return e.trim();
            }),
          },
          licenseType && {
            licenseType: licenseType.split(",").map((e) => {
              return e.trim();
            }),
          },
        ],
      },
      subQuery: false,
      distinct: true,
    });

    res.status(200).json(organization);
  } catch (error) {
    
    res.status(400).json({ msg: error.message });
  }
};

const getAllOrganizations = async (req, res) => {
  try {
    const data = await Organization.findAll({
      include: [User],
    });
    res.status(200).json(data);
  } catch (error) {
    
    res.status(400).json({ msg: error.message });
  }
};

module.exports = {
  getAllOrganizations,
  getOrganization,
  getExcelTemplate,
  createOrganization,
  createOrganizations,
  getOrganizationByPk,

  editOrganization,
  deleteOrganization,
  handleActivation,
  addPhoneNumber,
  sendEmail,
  sendSMS,
  getEmail,
  getSMS,
  getReports,
  getReportOrganization,
};
