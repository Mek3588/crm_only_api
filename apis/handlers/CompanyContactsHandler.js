const { Op } = require("sequelize");
const User = require("../../models/acl/user");
const AgentContact = require("../../models/agent/AgentContact");
const OrganizationContact = require("../../models/broker/OrganizationContact");
const CompanyContact = require("../../models/CompanyContact");
const CompetitorContact = require("../../models/competitor/CompetitorContact");
const Competitor = require("../../models/competitor/Competitors");
const Contact = require("../../models/Contact");
const ContactCompanyConatact = require("../../models/ContactCompanyContact");
const PartnerContact = require("../../models/partner/PartnerContact");
const Partner = require("../../models/partner/Partner");
const SharedPeople = require("../../models/SharedPeople");
const ShareholderContact = require("../../models/shareholders/ShareholderContact");
const Shareholder = require("../../models/shareholders/Shareholder");
const VendorContact = require("../../models/vendor/VendorContact");
const Vendor = require("../../models/vendor/Vendors");
const Organization = require("../../models/broker/Organization");
const Agent = require("../../models/agent/Agent");
const {
  CompanyType,
  eventActions,
  eventResourceTypes,
} = require("../../utils/constants");
const {
  isEmailValid,
  isPhoneNoValid,
  getFileExtension,
  getChangedFieldValues,
  createEventLog,
  getIpAddress,
} = require("../../utils/GeneralUtils");
const EmailDocument = require("../../models/EmailDocument");
const { sendNewEmail } = require("./EmailServiceHandler");
const Emailcc = require("../../models/EmailCc");
const EmailModel = require("../../models/EmailModel");
const CompanyContactEmails = require("../../models/CompanyContactEmail");
const Document = require("../../models/Document");
const { sendNewSms } = require("./SMSServiceHandler");
const CompanyContactsSms = require("../../models/CompanyContactSMS");
const SMS = require("../../models/SMS");
const {
  canUserAccessOnlyBranch,
  canUserRead,
  canUserCreate,
  canUserEdit,
  canUserDelete,
  canUserAccessOnlySelf,
} = require("../../utils/Authrizations");
const Employee = require("../../models/Employee");
const Salutation = require("../../models/Salutation");
const CustomerContact = require("../../models/customer/CustomerContact");

const getSearch = (st) => {
  return {
    [Op.or]: [
      { firstName: { [Op.like]: `%${st}%` } },
      { fatherName: { [Op.like]: `%${st}%` } },
      { grandFatherName: { [Op.like]: `%${st}%` } },
      { primaryEmail: { [Op.like]: `%${st}%` } },
      { primaryPhone: { [Op.like]: `%${st}%` } },
      { secondaryEmail: { [Op.like]: `%${st}%` } },
      { secondaryPhone: { [Op.like]: `%${st}%` } },
      { gender: { [Op.like]: `%${st}%` } },
      { status: { [Op.like]: `%${st}%` } },
      { country: { [Op.like]: `%${st}%` } },
      { region: { [Op.like]: `%${st}%` } },
      { city: { [Op.like]: `%${st}%` } },
      { woreda: { [Op.like]: `%${st}%` } },
      { kebele: { [Op.like]: `%${st}%` } },
      { building: { [Op.like]: `%${st}%` } },
      { officeNumber: { [Op.like]: `%${st}%` } },
      { poBox: { [Op.like]: `%${st}%` } },
      { TOT: { [Op.like]: `%${st}%` } },
      { streetName: { [Op.like]: `%${st}%` } },
    ],
  };
};
const getAssignmentCondition = async (user, accountId) => {
  const { id } = user;
  let condition = {};
  if (await canUserAccessOnlySelf(user, "companyContacts")) {
    condition = {
      [Op.or]: [{ assignedTo: id }, { "$shares.id$": id }],
    };
  } else if (await canUserAccessOnlyBranch(user, "companyContacts")) {
    let branchId = await CompanyContact.findOne({ where: { userId: user.id } })
      .branchId;
    condition = { branchId };
  }
  if (accountId && accountId !== "undefined") {
    
    condition = { ...condition, memberOf: accountId, memberType: "Account" };
  }
  return condition;
};

const createCompanyContacts = async (req, res) => {
  if (!(await canUserCreate(req.user, "companyContacts"))) {
    return res.status(400).json({ msg: "unauthorized access!" });
  }
  const companyContacts = req.body;
  var addedCompanyContactsList = 0;
  var duplicate = [];
  var incorrect = [];
  var lineNumber = 2;
  
  try {
    var promises = await companyContacts.map(async (companyContact) => {
      let primaryEmail = companyContact.primaryEmail;
      let primaryPhone = companyContact.primaryPhone;
      let memberType = companyContact.memberType;
      const findCompanyContactByEmail = await CompanyContact.findOne({
        where: { primaryEmail },
      });
      const findCompanyContactByphone = await CompanyContact.findOne({
        where: { primaryPhone },
      });
      
      if (
        findCompanyContactByEmail == null &&
        findCompanyContactByphone == null
      ) {
        if (
          isEmailValid(companyContact.primaryEmail) &&
          isPhoneNoValid(companyContact.primaryPhone)
        ) {
          try {
            let newCompanyContact = await CompanyContact.create({
              ...companyContact,
              deleted: false,
            });

            if (newCompanyContact) {
              if (memberType == CompanyType.vendor) {
                await companyContact.addVendors(memberOf, {
                  through: VendorContact,
                });
              } else if (
                memberType == CompanyType.account ||
                memberType == CompanyType.lead
              ) {
                await companyContact.addContacts(companyContact.contactId, {
                  through: ContactCompanyConatact,
                });
              } else if (memberType == CompanyType.shareholder) {
                await companyContact.addShareholders(memberOf, {
                  through: ShareholderContact,
                });
              } else if (memberType == CompanyType.competitor) {
                await companyContact.addCompetitors(memberOf, {
                  through: CompetitorContact,
                });
              } else if (memberType == CompanyType.agent) {
                await companyContact.addAgents(memberOf, {
                  through: AgentContact,
                });
              } else if (memberType == CompanyType.organization) {
                await companyContact.addOrganizations(memberOf, {
                  through: OrganizationContact,
                });
              } else if (memberType == CompanyType.partner) {
                await companyContact.addPartners(memberOf, {
                  through: PartnerContact,
                });
              }
            }
            addedCompanyContactsList += 1;
          } catch (error) {
            
            incorrect.push(lineNumber);
          }
        } else {
          incorrect.push(lineNumber);
        }
      } else {
        duplicate.push(lineNumber);
      }
      lineNumber = lineNumber + 1;
    });

    Promise.all(promises).then(function (results) {
      let msg = "";
      if (addedCompanyContactsList != 0) {
        msg = msg + `${addedCompanyContactsList} added`;
      }
      if (incorrect.length != 0) {
        msg =
          msg == ""
            ? `Line ${incorrect} has incorrect values`
            : msg + `,Line ${incorrect} has incorrect values`;
      }
      if (duplicate != 0) {
        msg =
          msg == ""
            ? `Duplicate value found on line ${duplicate}`
            : msg + `,Duplicate value found on line ${duplicate}`;
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

const generateReport = async (req, res) => {
  if (!(await canUserRead(req.user, "companyContacts"))) {
    return res.status(400).json({ msg: "unauthorized access!" });
  }
  const { f, r, st, sc, sd, accountId, purpose } = req.query;
  const { statuses, genders, assignedTos } = req.body;
  let { startDate, endDate } = req.body;
  if (startDate) {
    startDate = new Date(new Date(startDate).setHours(0, 0, 0, 0));
  }
  if (endDate) {
    endDate = new Date(new Date(endDate).setHours(23, 59, 59, 0));
  }
  
  reportConditions = {
    [Op.and]: [
      statuses && statuses.length > 0
        ? { status: { [Op.in]: statuses.map((status) => status.name) } }
        : {},
      genders && genders.length > 0
        ? { gender: { [Op.in]: genders.map((gender) => gender.name) } }
        : {},
      startDate ? { createdAt: { [Op.gte]: startDate } } : {},
      endDate ? { createdAt: { [Op.lte]: endDate } } : {},
    ],
  };
  let condition = await getAssignmentCondition(req.user, accountId);
  try {
    const pagination = purpose == "export" || {
      offset: Number(f),
      limit: Number(r),
    };
    const data = await CompanyContact.findAndCountAll({
      include: [
        {
          model: User,
          as: "assignedUser",
        },
        {
          model: User,
          as: "shares",
        },
      ],
      ...pagination,
      order: [[sc || "firstName", sd == 1 ? "ASC" : "DESC"]],
      where: { ...getSearch(st), ...condition, ...reportConditions },
      subQuery: false,
    });
    res.status(200).json(data);
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};
const getCompanyContacts = async (req, res) => {
  if (!(await canUserRead(req.user, "companyContacts"))) {
    return res.status(400).json({ msg: "unauthorized access!" });
  }
  //queryparams:  { f: '0', r: '7', st: '', sc: 'first_name', sd: '1' }
  const { f, r, st, sc, sd, accountId } = req.query;
  let condition = await getAssignmentCondition(req.user, accountId);
  try {
    const data = await CompanyContact.findAndCountAll({
      include: [
        Competitor,
        Vendor,
        Shareholder,
        Partner,
        Agent,
        Organization,
        Contact,
        {
          model: User,
          as: "assignedUser",
        },
        {
          model: User,
          as: "shares",
        },
        {
          model: Salutation,
          as: "salutation",
        },
      ],
      offset: Number(f),
      limit: Number(r),
      order: [[sc || "firstName", sd == 1 ? "ASC" : "DESC"]],
      where: { ...getSearch(st), ...condition },
      subQuery: false,
    });
    res.status(200).json(data);
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};

//posting
const createCompanyContact = async (req, res) => {
  if (!(await canUserCreate(req.user, "companyContacts"))) {
    return res.status(400).json({ msg: "unauthorized access!" });
  }
  const {
    firstName,
    fatherName,
    grandFatherName,
    leadSource,
    status,
    gender,
    salutationId,
    memberOf,
    memberType,
    memberName,
    assignedTo,
    primaryPhone,
    secondaryPhone,
    primaryEmail,
    secondaryEmail,
    country,
    region,
    city,
    subcity,
    woreda,
    kebele,
    building,
    officeNumber,
    poBox,
    TOT,
    streetName,
    note,
    website,
    zipCode,
    TINNumber,
    socialSecurity,
    languageNotifications,
    decisionMaker,
  } = req.body;
console.log("tyyyyyyy",req.body)
  try {
    if (!isPhoneNoValid(primaryPhone)) {
      res.status(400).json({ msg: "Invalid phone number" });
      return;
    }

    if (!isEmailValid(primaryEmail)) {
      res.status(400).json({ msg: "invalid email" });
      return;
    }
    if (
      secondaryPhone == primaryPhone &&
      secondaryPhone != "" &&
      primaryPhone != ""
    ) {
      res.status(400).json({
        msg: "Secondary phone number cannot be similar to primary phone number!",
      });
      return;
    }
    const companyContact = await CompanyContact.create({
      firstName,
      fatherName,
      grandFatherName,
      leadSource,
      status,
      memberName,
      gender,
      salutationId,
      assignedTo,
      primaryPhone,
      secondaryPhone,
      primaryEmail,
      secondaryEmail,
      country,
      region,
      memberOf,
      city,
      memberType,
      subcity,
      woreda,
      kebele,
      building,
      officeNumber,
      poBox,
      TOT,
      streetName,
      note,
      website,
      zipCode,
      TINNumber,
      socialSecurity,
      languageNotifications,
      decisionMaker,
      memberType,
    });
    console.log("tyyyyyyy",companyContact)

    if (companyContact) {
      const name =
        companyContact.firstName +
        " " +
        companyContact.fatherName +
        " " +
        companyContact.grandFatherName;
      let ipAddress = getIpAddress(req.ip);

      const eventLog = await createEventLog(
        req.user.id,
        eventResourceTypes.contact,
        name,
        companyContact.id,
        eventActions.create,
        "",
        ipAddress
      );
    }
    //adding share

    const { sharedWith } = req.body;
    console.log("the shares withi is ",sharedWith)
    console.log("the sharesqqq ",companyContact)

    const toAdd = sharedWith.map((element) => {
      return { contactId: companyContact.id, userId: element };
    });
    SharedPeople.bulkCreate(toAdd);
    // add member   memberOf,memberType

    if (companyContact) {
      if (memberType == CompanyType.vendor) {
        await companyContact.addVendors(memberOf, { through: VendorContact });
      } else if (
        memberType == CompanyType.account ||
        memberType == CompanyType.lead
      ) {
        await companyContact.addContacts(memberOf, {
          through: ContactCompanyConatact,
        });
      } else if (memberType == CompanyType.shareholder) {
        await companyContact.addShareholders(memberOf, {
          through: ShareholderContact,
        });
      } else if (memberType == CompanyType.competitor) {
        await companyContact.addCompetitors(memberOf, {
          through: CompetitorContact,
        });
      } else if (memberType == CompanyType.agent) {
        await companyContact.addAgents(memberOf, { through: AgentContact });
      } else if (memberType == CompanyType.organization) {
        await companyContact.addOrganizations(memberOf, {
          through: OrganizationContact,
        });
      } else if (memberType == CompanyType.partner) {
        await companyContact.addPartners(memberOf, { through: PartnerContact });
      }
    }
    
    res.status(200).json(companyContact);
  } catch (error) {
    
  }
};

const exportCompanyContacts = async (req, res) => {
  
  const { st, sc, sd, accountId } = req.query;
  if (!(await canUserRead(req.user, "companyContacts"))) {
    return res.status(400).json({ msg: "unauthorized access!" });
  }
  let condition = await getAssignmentCondition(req.user, accountId);

  try {
    const companyContacts = await CompanyContact.findAndCountAll({
      include: [
        Competitor,
        Vendor,
        Shareholder,
        Partner,
        Agent,
        Organization,
        Contact,
        {
          model: User,
          as: "assignedUser",
        },
        {
          model: User,
          as: "shares",
        },
        {
          model: Salutation,
          as: "salutation",
        },
      ],
      order: [[sc || "firstName", sd == 1 ? "ASC" : "DESC"]],
      where: {
        ...getSearch(st),
        ...condition,
      },
    });
    res.status(200).json(companyContacts);
  } catch (error) {
    
    res.status(400).json({ msg: error.message });
    co;
  }
};

const getCompanyContact = async (req, res) => {
  if (!(await canUserRead(req.user, "companyContacts"))) {
    return res.status(400).json({ msg: "unauthorized access!" });
  }
  try {
    const companyContact = await CompanyContact.findByPk(req.params.id, {
      include: [
        Competitor,
        Vendor,
        Shareholder,
        Partner,
        Agent,
        Organization,
        Contact,
        {
          model: User,
          as: "assignedUser",
        },
        {
          model: User,
          as: "shares",
        },
        {
          model: Salutation,
          as: "salutation",
        },
      ],
    }).then(async function (companyContact) {
      if (!companyContact) {
        res.status(404).json({ message: "No Data Found" });
      } else if (companyContact) {
        const name =
          companyContact.firstName +
          " " +
          companyContact.fatherName +
          " " +
          companyContact.grandFatherName;
        let ipAddress = getIpAddress(req.ip);

        const eventLog = await createEventLog(
          req.user.id,
          eventResourceTypes.contact,
          name,
          companyContact.id,
          eventActions.view,
          "",
          ipAddress
        );
      }

      res.status(200).json(companyContact);
    });

    // res.status(200).json(companyContact);
  } catch (error) {
    res.status(404).json({ msg: error.message });
  }
};

const editCompanyContact = async (req, res) => {
  if (!(await canUserEdit(req.user, "companyContacts"))) {
    return res.status(400).json({ msg: "unauthorized access!" });
  }
  const {
    id,
    firstName,
    fatherName,
    grandFatherName,
    leadSource,
    status,
    gender,
    salutationId,
    memberOf,
    memberType,
    memberName,
    assignedTo,
    primaryPhone,
    secondaryPhone,
    primaryEmail,
    secondaryEmail,
    country,
    region,
    city,
    subcity,
    woreda,
    kebele,
    building,
    officeNumber,
    poBox,
    TOT,
    streetName,
    note,
    website,
    zipCode,
    TINNumber,
    socialSecurity,
    languageNotifications,
    decisionMaker,
  } = req.body;
  try {
    if (!isPhoneNoValid(primaryPhone)) {
      res.status(400).json({ msg: "Invalid phone number" });
      return;
    }
    if (!isEmailValid(primaryEmail)) {
      res.status(400).json({ msg: "invalid email" });
      return;
    }
    const previousCompanyContact = await CompanyContact.findByPk(id);
    const updatedCompanyContact = await CompanyContact.update(
      {
        firstName,
        fatherName,
        grandFatherName,
        leadSource,
        status,
        gender,
        salutationId,
        memberOf,
        memberType,
        memberName,
        assignedTo,
        primaryPhone,
        secondaryPhone,
        primaryEmail,
        secondaryEmail,
        country,
        region,
        city,
        subcity,
        woreda,
        kebele,
        building,
        officeNumber,
        poBox,
        TOT,
        streetName,
        note,
        website,
        zipCode,
        TINNumber,
        socialSecurity,
        languageNotifications,
        decisionMaker,
      },

      { where: { id: id } }
    );
    const newCompanyContact = await CompanyContact.findByPk(id);
    if (updatedCompanyContact) {
      const changedFieldValues = getChangedFieldValues(
        previousCompanyContact,
        newCompanyContact
      );
      
      const name =
        newCompanyContact.firstName +
        " " +
        newCompanyContact.fatherName +
        " " +
        newCompanyContact.grandFatherName;
      let ipAddress = getIpAddress(req.ip);
      const eventLog = await createEventLog(
        req.user.id,
        eventResourceTypes.contact,
        name,
        newCompanyContact.id,
        eventActions.edit,
        changedFieldValues,
        ipAddress
      );
    }

    
    

    const { sharedWith } = req.body;
    await SharedPeople.destroy({ where: { contactId: req.body.id } });
    const toAdd =
      sharedWith &&
      sharedWith.map((element) => {
        return { contactId: req.body.id, userId: element };
      });
    sharedWith && (await SharedPeople.bulkCreate(toAdd));
    const companyContact = await CompanyContact.findByPk(id).then(
      (companyContact) => {
        if (companyContact) {
          if (memberType == CompanyType.vendor) {
            const vendor = req.body.vendor !== undefined ? req.body.vendor : [];
            companyContact.setVendors(vendor, {
                through: VendorContact,
            });
          } else if (
            memberType == CompanyType.account ||
            memberType == CompanyType.lead
          ) {
            companyContact.setContacts(req.body.contacts, {
              through: ContactCompanyConatact,
            });
          } else if (memberType == CompanyType.shareholder) {
            console.log("the company contacts are ", req.body.shareholders)
            companyContact.setShareholders(req.body.shareholders, {
              through: ShareholderContact,
            });
          } else if (memberType == CompanyType.competitor) {
            companyContact.setCompetitors(req.body.competitors, {
              through: CompetitorContact,
            });
          } else if (memberType == CompanyType.agent) {
            companyContact.setAgents(req.body.agents, {
              through: AgentContact,
            });
          } else if (memberType == CompanyType.organization) {
            companyContact.setOrganizations(req.body.organizations, {
              through: OrganizationContact,
            });
          } else if (memberType == CompanyType.partner) {
            companyContact.setPartners(req.body.partners, {
              through: PartnerContact,
            });
          } else if (memberType == " Customer") {
            companyContact.setPartners(req.body.customers, {
              through: CustomerContact,
            });
          }
        }
      }
    );
    res.status(200).json({ companyContact });
  } catch (error) {
    
    res.status(404).json({ msg: error.message });
  }
};

const deleteCompanyContact = async (req, res) => {
  if (!(await canUserDelete(req.user, "companyContacts"))) {
    return res.status(400).json({ msg: "unauthorized access!" });
  }
  const id = req.params.id;
  try {
    const companyContact = await CompanyContact.findByPk(id);
    const deletedContact = await CompanyContact.destroy({ where: { id: id } });
    await SharedPeople.destroy({ where: { contactId: id } });
    const name =
      companyContact.firstName +
      " " +
      companyContact.fatherName +
      " " +
      companyContact.grandFatherName;
    let ipAddress = getIpAddress(req.ip);
    const eventLog = await createEventLog(
      req.user.id,
      eventResourceTypes.contact,
      name,
      companyContact.id,
      eventActions.delete,
      "",
      ipAddress
    );
    
    res.status(200).json({ id });
  } catch (error) {
    res.status(404).json({ msg: error.message });
  }
};

const sendEmail = async (req, res) => {
  if (!(await canUserEdit(req.user, "companyContacts"))) {
    return res.status(400).json({ msg: "unauthorized access!" });
  }
  const body = req.body;
  try {
    let documents;
    
    const companyContact = await CompanyContact.findAll({
      where: { id: { [Op.in]: [body.companyContacts] } },
    });
    if (companyContact) {
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
      companyContact.map((e) => {
        if (body.emailType) {
          if (body.emailType.length == 0) {
            sendTo.push(e.primaryEmail);
          }
          if (body.emailType.find((element) => element == "primaryEmail")) {
            sendTo.push(e.primaryEmail);
          }
          if (body.emailType.find((element) => element == "secondaryEmail")) {
            sendTo.push(e.secondaryEmail);
          }
        } else {
          sendTo.push(e.primaryEmail);
        }
      });
      const splitData = body.emailccs.split(",");
      const emails = splitData.map((e) => {
        return { email: e };
      });
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
            const email = EmailModel.create(newEmail, {
              include: [Emailcc, Document],
            }).then((email) => {
              email.addCompany_contacts(body.companyContacts.map(Number), {
                through: CompanyContactEmails,
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
  if (!(await canUserEdit(req.user, "companyContacts"))) {
    return res.status(400).json({ msg: "unauthorized access!" });
  }
  const body = req.body;
  try {
    const companyContact = await CompanyContact.findAll({
      where: { id: { [Op.in]: [body.companyContacts] } },
    });
    const sendTo = [];
    if (companyContact) {
      companyContact.map((e) => {
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
      return await sendNewSms(sendTo, body.content).then((sent) => {
        if (sent.status == 200) {
          try {
            
            const sms = SMS.create(body).then((sms) => {
              sms.addCompany_contacts(body.companyContacts, {
                through: CompanyContactsSms,
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
      res.status(400).json({ msg: "sms not sent" });
    }
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};
const getEmail = async (req, res) => {
  // if (!(await canUserRead(req.user, "companyContacts"))) {//
  //   return res.status(400).json({ msg: "unauthorized access!" });
  // }
  const body = req.params.id;
  try {
    const sms = await EmailModel.findAndCountAll({
      // include: [User, CompanyContact, Document, Emailcc],
      include: [{ model: User, attributes: ['id', 'corporate_name', 'first_name', 'middle_name', 'last_name', 'email', 'phone', 'gender'], }, 
      CompanyContact, Document, Emailcc],
      order: [["createdAt", "DESC"]],
      where: { "$company_contacts.id$": { [Op.like]: body } },
    });
    res.status(200).json(sms);
    
  } catch (error) {
    
    res.status(400).json({ msg: error.message });
  }
};


const getSMS = async (req, res) => {
  const body = req.params.id;
  try {
    const { f, r, st, sc, sd } = req.query;
    const sms = await SMS.findAndCountAll({
      include: [{ model: User, attributes: ['id', 'corporate_name', 'first_name', 'middle_name', 'last_name', 'email', 'phone', 'gender'] }, CompanyContact],
      where: { "$company_contacts.id$": { [Op.like]: body } },
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
const updateContact = async (req, res) => {
  const reqBody = req.body;
  const id = req.params.id;

  try {
    if (!(await canUserEdit(req.user, "companyContacts"))) {
      return res.status(401).json({ msg: "unauthorized access!" });
    }
    await CompanyContact.update(reqBody, { where: { id: id } });
    res.status(200).json({ id });
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};

module.exports = {
  getCompanyContacts,
  createCompanyContact,
  getCompanyContact,
  editCompanyContact,
  deleteCompanyContact,
  generateReport,
  createCompanyContacts,
  sendSMS,
  getEmail,
  getSMS,
  sendEmail,
  exportCompanyContacts,
  updateContact,
};
