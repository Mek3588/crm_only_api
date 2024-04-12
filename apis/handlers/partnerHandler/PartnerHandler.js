const Partner = require("../../../models/partner/Partner");
const {
  isPhoneNoValid,
  getFileExtension,
  isEmailValid,
  getIpAddress,
  convertFlattenedToNested,
  createEventLog,
  getChangedFieldValues,
} = require("../../../utils/GeneralUtils");
const { Op } = require("sequelize");
const Address = require("../../../models/Address");
const PhoneNo = require("../../../models/PhoneNo");
const SMSMessage = require("../../../models/SMS");
const PartnerDepartment = require("../../../models/partner/PartnerDepartment");
const Employee = require("../../../models/Employee");
const Department = require("../../../models/Department");
const Email = require("../../../models/EmailModel");
const PartnerEmails = require("../../../models/partner/PartnerEmail");
const PartnerSms = require("../../../models/partner/PartnerSMS");
const { sendNewSms } = require("../SMSServiceHandler");
const { sendNewEmail } = require("../EmailServiceHandler");
const User = require("../../../models/acl/user");
const Emailcc = require("../../../models/EmailCc");
const Document = require("../../../models/Document");
const EmailDocument = require("../../../models/EmailDocument");
const {
  Role,
  eventResourceTypes,
  eventActions,
} = require("../../../utils/constants");
const PartnerBudget = require("../../../models/partner/PartnerBudget");
const e = require("express");
const sequelize = require("../../../database/connections");

// const excelTemplate = require('../../uploads/zemen_partners_excel_template.xlsx');

const getSearch = (st) => {
  return {
    [Op.or]: [
      { partnerName: { [Op.like]: `%${st}%` } },
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
    ],
  };
};

const getPartner = async (req, res) => {
  const { f, r, st, sc, sd } = req.query;
  try {
    let data;
    const currentUser = await req.user;
    if (req.type == "all") {
      data = await Partner.findAndCountAll({
        include: [User, Employee, Department],
        offset: Number(f),
        limit: Number(r),
        order: [[sc || "partnerName", sd == 1 ? "ASC" : "DESC"]],
        where: getSearch(st),
        subQuery: false,
      });
    } else if (req.type == "self") {
      const user = await User.findByPk(currentUser.id, { include: [Employee] });
      data = await Partner.findAndCountAll({
        include: [User, Employee, Department],
        offset: Number(f),
        limit: Number(r),
        order: [[sc || "partnerName", sd == 1 ? "ASC" : "DESC"]],
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
    } else if (req.type == "branch") {
      const user = await User.findByPk(currentUser.id, { include: [Employee] });
      data = await Partner.findAndCountAll({
        include: [{ model: User, include: [Employee] }, Employee, Department],
        offset: Number(f),
        limit: Number(r),
        order: [[sc || "partnerName", sd == 1 ? "ASC" : "DESC"]],
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
    }
    res.status(200).json(data);
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};

//posting
const createPartner = async (req, res) => {
  let partnerBody = convertFlattenedToNested(req.body);
  const primaryEmail = partnerBody.primaryEmail;
  try {
    const partnerFound = await Partner.findOne({
      where: {
        [Op.or]: [
          { primaryEmail: { [Op.like]: primaryEmail } },
          { primaryPhone: { [Op.like]: partnerBody.primaryPhone } },
        ],
      },
    });

    if (partnerFound === null) {
      if (req.file == null) {
        const { profilePicture, ...others } = partnerBody;
        const data = await Partner.create(others)
        data.addDepartments(partnerBody.departments, {
          through: PartnerDepartment,
        });
        let ipAddress = getIpAddress(req.ip);
        const eventLog = await createEventLog(
          req.user.id,
          eventResourceTypes.partner,
          data.partnerName,
          data.id,
          eventActions.create,
          "",
          ipAddress
        );


        res.status(200).json(data);
      } else {
        partnerBody.profilePicture = "/uploads/" + req.file.filename;
        const data = await Partner.create(partnerBody)
        data.addDepartments(partnerBody.departments, {
          through: PartnerDepartment,
        });

        let ipAddress = getIpAddress(req.ip);
        const eventLog = await createEventLog(
          req.user.id,
          eventResourceTypes.partner,
          data.partnerName,
          data.id,
          eventActions.create,
          "",
          ipAddress
        );

        res.status(200).json(data);
      }
    } else if (partnerFound) {
      res.status(400).json({ msg: "Partner existes" });
      return;
    }
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};

const addPhoneNumber = async (req, res) => {
  try {
    const partner = await PartnerPhone.create(req.body);
    res.status(200).json(partner);
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};

const handleActivation = async (req, res) => {
  try {
    // const user = await User.findByPk(req.params.id)
    // const partner = await User.update(
    //   { activated: !user.activated },
    //   { where: { id: req.params.id } }
    // )
    const sh = await Partner.findByPk(req.params.id);
    const partner = await Partner.update(
      { active: !sh.active },
      { where: { id: req.params.id } }
    );
    res.status(200).json(partner);
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};

const createPartners = async (req, res) => {
  const partners = req.body;
  var addedList = 0;
  var duplicate = [];
  var incorrect = [];
  var lineNumber = 1;

  try {
    const promises = partners.map(async (partner) => {
      let addedPartners = await Partner.findOne({
        where: {
          [Op.or]: [
            { primaryEmail: { [Op.like]: partner.primaryEmail } },
            { primaryPhone: { [Op.like]: partner.primaryPhone } },
          ],
        },
      }).then(async (addedPartners) => {
        lineNumber = lineNumber + 1;
        if (
          isPhoneNoValid(partner.primaryPhone) &&
          isEmailValid(partner.primaryEmail)
        ) {
          if (addedPartners == null) {
            partner.userId = req.user.id;
            partner.active = true;
            try {
              let newPartner = await Partner.create(partner);
              newPartner && (addedList += 1);
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
        msg = msg + `${addedList} partner added`;
      }
      if (duplicate != 0) {
        msg = msg + ` duplicate value found on line ${duplicate} \n`;
      }
      if (incorrect.length != 0 || incorrect != 0) {
        msg = msg + ` Line ${incorrect} has incorrect values  \n`;
      }
      if (duplicate != 0) {
        res.status(400).json({ msg: msg });
      } else {
        res.status(200).json({ msg: msg });
      }
    });
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};

const getPartnerByPk = async (req, res) => {
  try {
    const partner = await Partner.findByPk(req.params.id, {
      include: [User, Employee, Department],
    }).then(async (partner) => {
      if (!partner) {
        res.status(400).json({ message: "No Data Found" });
      } else {
        let ipAddress = getIpAddress(req.ip);
        const eventLog = await createEventLog(
          req.user.id,
          eventResourceTypes.partner,
          partner.partnerName,
          partner.id,
          eventActions.view,
          "",
          ipAddress
        );
        res.status(200).json(partner);
      }
    });
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};

const getSearchResults = async (req, res) => {
  const { key } = req.params;

  try {
    const partner = await Partner.findAll({
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
    if (!partner) {
      res.status(404).json({ message: "No Data Found" });
    } else res.status(200).json(partner);
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};

const getExcelTemplate = async (req, res) => {
  const fileName = "zemen_partners_excel_template.xlsx";
  const fileURL = "../../templates/zemen_partners_excel_template.xlsx";
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

const getPartnerReports = async (req, res) => {
  let {
    country,
    city,
    region,
    subcity,
    active,
    partner_budgets,
    employees,
    departments,
    partnerName,
    activeReport,
  } = req.body;
  const { f, r, st, sc, sd } = req.query;
  
  try {
    const competitor = await Partner.findAndCountAll({
      include: [PartnerBudget, Department, Employee, User],
      where: {
        [Op.and]: [
          country.length != 0 && { country: { [Op.in]: country } },
          region.length != 0 && { region: { [Op.in]: region } },
          city.length != 0 && { city: { [Op.in]: city } },
          subcity.length != 0 && { subcity: { [Op.in]: subcity } },
          partnerName && {
            partnerName: {
              [Op.in]: partnerName.split(",").map((e) => {
                return e.trim();
              }),
            },
          },

          // active && {active: active},
          // {woreda: {[Op.in]: [woreda] }},
          // {kebele: {[Op.in]: [kebele] }},
          employees.length != 0 && { "$employee.id$": employees },
          departments.length != 0 && {
            "$departments.id$": { [Op.in]: departments },
          },
          activeReport.length != 0 && { active: { [Op.in]: activeReport } },
          partner_budgets.budgetYear &&
          sequelize.where(sequelize.col("$partner_budget.budgetYear$"), {
            [Op.in]: partner_budgets.budgetYear.split(",").map((e) => {
              return e.trim();
            }),
          }),
          partner_budgets.annualPlan &&
          sequelize.where(sequelize.col("$partner_budget.annualPlan$"), {
            [Op.in]: partner_budgets.annualPlan.split(",").map((e) => {
              return e.trim();
            }),
          }),

          partner_budgets.annualProduction &&
          sequelize.where(
            sequelize.col('"$partner_budget.annualProduction$"'),
            {
              [Op.in]: partner_budgets.annualProduction
                .split(",")
                .map((e) => {
                  return e.trim();
                }),
            }
          ),
        ],
      },
      subQuery: false,
      // raw: true,
      offset: Number(f),
      limit: Number(r),
      order: [[sc || "partnerName", sd == 1 ? "ASC" : "DESC"]],

      distinct: true,
    });

    res.status(200).json(competitor);
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
    partner_budgets,
    employees,
    departments,
    partnerName,
    activeReport,
  } = req.body;
  try {
    const competitor = await Partner.findAll({
      include: [PartnerBudget, Department, Employee, User],
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
          partnerName && {
            partnerName: {
              [Op.in]: partnerName.split(",").map((e) => {
                return e.trim();
              }),
            },
          },
          activeReport.length != 0 && { active: { [Op.in]: activeReport } },
          // active && {active: active},
          // {woreda: {[Op.in]: [woreda] }},
          // {kebele: {[Op.in]: [kebele] }},
          employees.length != 0 && { "$employee.id$": employees },
          departments.length != 0 && {
            "$departments.id$": { [Op.in]: departments },
          },
          partner_budgets.budgetYear && {
            "$partner_budget.budgetYear$": partner_budgets.budgetYear
              .split(",")
              .map((e) => {
                return e.trim();
              }),
          },
          partner_budgets.annualPlan && {
            "$partner_budget.annualPlan$": partner_budgets.annualPlan
              .split(",")
              .map((e) => {
                return e.trim();
              }),
          },
          partner_budgets.annualProduction && {
            "$partner_budget.annualProduction$":
              partner_budgets.annualProduction.split(",").map((e) => {
                return e.trim();
              }),
          },
        ],
      },
    });

    res.status(200).json(competitor);
  } catch (error) {
    
    res.status(400).json({ msg: error.message });
  }
};

const editPartner = async (req, res) => {
  let partnerBody = convertFlattenedToNested(req.body);
  const id = partnerBody.id;
  try {
    const foundPartner = await Partner.findByPk(id);
    if (foundPartner) {
      partnerBody.employeeId =
        partnerBody.employeeId == "null" ? 0 : partnerBody.employeeId;
      
      
      if (req.file == null) {
        const { profilePicture, ...others } = partnerBody;
        await Partner.update(others, { where: { id: id } }).then(async (partner) => {
          if (partnerBody.departments != null &&
            partnerBody.departments != "null" &&
            partnerBody.departments != "" && partnerBody.departments != 0 && partnerBody.departments != undefined
            && partnerBody.departments && partnerBody.departments.length > 0
            ) {
           
            await foundPartner.setDepartments(partnerBody.departments, {
              through: PartnerDepartment,
            });
          }
        });
        const newPartner = await Partner.findByPk(id);
        const changedFieldValues = getChangedFieldValues(
          foundPartner,
          newPartner
        );
        let ipAddress = getIpAddress(req.ip);
        const eventLog = await createEventLog(
          req.user.id,
          eventResourceTypes.partner,
          newPartner.partnerName,
          newPartner.id,
          eventActions.edit,
          changedFieldValues,
          ipAddress
        );
        res.status(200).json({ id });
      } else {
        partnerBody.profilePicture = "/uploads/" + req.file.filename;
        await Partner.update(partnerBody, { where: { id: id } }).then(
          (partner) => {
            if (partnerBody.departments != null &&
              partnerBody.departments != "null" &&
              partnerBody.departments != "") {
              foundPartner.setDepartments(partnerBody.departments, {
                through: PartnerDepartment,
              });
            }
          }
        );
        const newPartner = await Partner.findByPk(id);
        const changedFieldValues = getChangedFieldValues(
          foundPartner,
          newPartner
        );
        let ipAddress = getIpAddress(req.ip);
        const eventLog = await createEventLog(
          req.user.id,
          eventResourceTypes.partner,
          newPartner.partnerName,
          newPartner.id,
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

const deletePartner = async (req, res) => {
  const id = req.params.id;
  const t = await sequelize.transaction();
  
  try {
    const prevPartner = await Partner.findByPk(id);
    

    await Partner.destroy({ where: { id: id } });

    const associatedDepartment = await PartnerDepartment.findAll({
      where: { partnerId: id },
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
      eventResourceTypes.partner,
      prevPartner.partnerName,
      prevPartner.id,
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
    const partner = await Partner.findAll({
      where: { id: { [Op.in]: [body.partners] } },
    });
    
    if (partner) {
      if (body.documents != null) {
        documents = await Document.findAll({
          attributes: ["name", "document"],
          where: { id: { [Op.in]: [body.documents] } },
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
      partner.map((e) => {
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
              }).then((em) => {
                body.partners != null &&
                  em.addPartners(body.partners.map(Number), {
                    through: PartnerEmails,
                  });
                body.documents != null &&
                  em.addDocuments(body.documents, { through: EmailDocument });
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
    const partner = await Partner.findAll({
      where: { id: { [Op.in]: body.partners } },
    });
    const sendTo = [];
    if (partner) {
      partner.map((e) => {
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
        return await sendNewSms(sendTo, body.content).then((sent) => {
          if (sent.status == 200) {
            try {
              const sms = SMSMessage.create(body).then((sms) => {
                sms.addPartners(body.partners, { through: PartnerSms });
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
      include: [User, Partner, Document, Emailcc],
      order: [["createdAt", "DESC"]],
      where: { "$partners.id$": { [Op.like]: body } },
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
      include: [{ model: User, attributes: ['id', 'corporate_name', 'first_name', 'middle_name', 'last_name', 'email', 'phone', 'gender'] }, Partner],
      where: { "$partners.id$": { [Op.like]: body } },
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
      const vendor = await Partner.update(
        { profilePicture: "/uploads/" + req.file.filename },
        { where: { id: req.body.id } }
      );

      res.status(200).json(vendor);
    }
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};

const getAllPartners = async (req, res) => {
  try {
    const currentUser = await req.user;
    if (req.type == "all") {
      const data = await Partner.findAll({
        include: [User],
      });

      res.status(200).json(data);
    } else if (req.type == "self") {
      const user = await User.findByPk(currentUser.id, { include: [Employee] });
      const data = await Partner.findAll({
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
      const data = await Partner.findAll({
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
  getAllPartners,
  getPartner,
  getExcelTemplate,
  createPartner,
  createPartners,
  getPartnerByPk,
  getSearchResults,
  editPartner,
  deletePartner,
  handleActivation,
  addPhoneNumber,
  sendEmail,
  sendSMS,
  getEmail,
  getSMS,
  profileUpload,
  getReports,
  getPartnerReports,
};
