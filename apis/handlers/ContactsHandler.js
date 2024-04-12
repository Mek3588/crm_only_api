const Call = require("../../models/contactActivity/ContactCall");
const Meeting = require("../../models/contactActivity/ContactMeeting");
const Note = require("../../models/contactActivity/Note");
const Task = require("../../models/contactActivity/ContactTask");
const Contact = require("../../models/Contact");
const User = require("../../models/acl/user");
const {
  Role,
  ContactStatus,
  ContactType,
  eventResourceTypes,
  eventActions,
} = require("../../utils/constants");
const Email = require("../../models/EmailModel");
const AdditionalEmailModel = require("../../models/Email");
// const AdditionalPhoneModel = require("../../models/PhoneNo")

const SMSMessage = require("../../models/SMS");
const {
  isPhoneNoValid,
  currentUser,
  getCurrentUser,
  sendSMS,
  isEmailValid,
  getFileExtension,
  createEventLog,
  getChangedFieldValues,
  getIpAddress,
} = require("../../utils/GeneralUtils");
const Branch = require("../../models/Branch");
const SharedSales = require("../../models/SharedSales");
const { Op } = require("sequelize");
const UpdateHistory = require("../../models/UpdateHistory");
const EmailService = require("../../models/EmailService");
const Employee = require("../../models/Employee");
const ContactBranch = require("../../models/ContactBranch");
const ContactEmployee = require("../../models/ContactEmployee");
const {
  sendWelcomeEmail,
  sendNewEmail,
} = require("../handlers/EmailServiceHandler");
const { smsFunction, sendNewSms } = require("../handlers/SMSServiceHandler");
const { getManagerWithBranch } = require("./EmployeesHandler");
const VehicleCategory = require("../../models/motor/Vehicle");
const Opportunity = require("../../models/Opportunity");
const SharedPeople = require("../../models/SharedPeople");
const SharedAccounts = require("../../models/SharedAccounts");
const ContactSms = require("../../models/ContactSMS");
const Emailcc = require("../../models/EmailCc");
const Document = require("../../models/Document");
const EmailDocument = require("../../models/EmailDocument");
const ContactEmails = require("../../models/ContactEmail");
const AdditionalEmail = require("../../models/Email");
const PhoneNo = require("../../models/PhoneNo");
const {
  canUserRead,
  canUserCreate,
  canUserEdit,
  canUserDelete,
  canUserAccessOnlySelf,
  canUserAccessOnlyBranch,
} = require("../../utils/Authrizations");
const SMSCampaign = require("../../models/SMSCampaign");
const EventLog = require("../../models/EventLog");
const SeenLead = require("../../models/SeenLead");
const Salutation = require("../../models/Salutation");
const Proposal = require("../../models/proposals/Proposal");
const Vehicle = require("../../models/motor/Vehicle");
const Invoice = require("../../models/Invoice");
const FireRateCategory = require("../../models/fire/FireRateCategory");

const getSearch = (st) => {
  
  let phoneSearch = st.trim();
  if (st && st.startsWith("0")) {
    phoneSearch = st.slice(1);
  }
  const names = st.split(' '); 
  return {
    [Op.or]: [
      { firstName: { [Op.like]: `%${names[0]}%` } },
      { middleName: { [Op.like]:`%${names[1]}%` } },
      { lastName: { [Op.like]: `%${names[2]}%` } },
      { primaryEmail: { [Op.like]: `%${st}%` } },
      { primaryPhone: { [Op.like]: `%${phoneSearch}%` } },
      // { secondaryEmail: { [Op.like]: `%${st}%` } },
      { secondaryPhone: { [Op.like]: `%${phoneSearch}%` } },
      { "$branch.name$": { [Op.like]: `%${st}%` } },
       { type: { [Op.like]: `%${st}%` } },
       { companyName: { [Op.like]:`%${st}%` } },
       //{ "$assignedemployee.first_name$": { [Op.like]: `%${st}%` } },
      // { gender: { [Op.like]: `%${st}%` } },
       { status: { [Op.like]: `%${st}%` } },
      { stage: { [Op.like]: `%${st}%` } },
      // { accountStage: { [Op.like]: `%${st}%` } },
      // { country: { [Op.like]: `%${st}%` } },
      // { region: { [Op.like]: `%${st}%` } },
      // { city: { [Op.like]: `%${st}%` } },
      // { woreda: { [Op.like]: `%${st}%` } },
      // { kebele: { [Op.like]: `%${st}%` } },
      // { building: { [Op.like]: `%${st}%` } },
      // { officeNumber: { [Op.like]: `%${st}%` } },
      // { poBox: { [Op.like]: `%${st}%` } },
      // { TOT: { [Op.like]: `%${st}%` } },
    ],
  };
};
/**
 * get contact controller
 * @param {*} req 
 * @param {*} res 
 * @returns 
 */
const getContact = async (req, res) => {
  // 
  // 
  // if (
  //   !(await canUserRead(req.user, "accounts")) &&
  //   !(await canUserRead(req.user, "leads"))
  // ) {
  //   return res.status(400).json({ msg: "unauthorized access!" });
  // }
  // 
  try {
    const contact = await Contact.findByPk(req.params.id, {
      include: [
        {
          model: User,
          as: "assignedUser",
        },
        {
          model: Contact,
          as: "memberOfC",
        },
        {
          model: User,
          as: "shares",
        },
        {
          model: User,
          as: "creater",
        },
        {
          model: Vehicle,
          as: "product",
        },
        {
          model: FireRateCategory,
          as: "fire_product",
        },
        {
          model: Branch,
          as: "branch",
        },
        {
          model: Employee,
          as: "assignedemployee",
        },
      ],
      subQuery: false,
    });
    if (!contact) {
      res.status(404).json({ message: "No Data Found" });
    } else {
      const alreadySeen = await SeenLead.findOne({
        where: { userId: req.user.id, contactId: contact.id },
      });
      if (!alreadySeen) {
        const seenLead = await SeenLead.create({
          userId: req.user.id,
          contactId: contact.id,
        });
      }

      let ipAddress = getIpAddress(req.ip);
      const eventLog = await createEventLog(
        req.user.id,
        contact.status == "leads"
          ? contact.status == "leads"
            ? eventResourceTypes.lead
            : eventResourceTypes.account
          : eventResourceTypes.account,
        `${contact.firstName} ${contact.middleName} ${contact.lastName ?? ''}`,
        contact.id,
        eventActions.view,
        "",
        ipAddress
      );
      res.status(200).json(contact);
    }
  } catch (error) {
    
    res.status(400).json({ msg: error.message });
  }
};

/**
 * get proposal controller
 * @param {*} req 
 * @param {*} res 
 */
const getContactByProposal = async (req, res) => {

  try {

    const proposal = await Proposal.findByPk(req.params.id)
    if (proposal != null) {
      const contact = await Contact.findByPk(proposal.contactId, {
        include: [
          {
            model: User,
            as: "assignedUser",
          },
          {
            model: Contact,
            as: "memberOfC",
          },
          {
            model: User,
            as: "shares",
          },
          {
            model: User,
            as: "creater",
          },
          {
            model: Vehicle,
            as: "product",
          },
          {
            model: Branch,
            as: "branch",
          },
          {
            model: Employee,
            as: "assignedemployee",
          },
        ],
        subQuery: false,
      });

      

      if (!contact) {
        res.status(404).json({ message: "No Data Found" });
      } else {
        const alreadySeen = await SeenLead.findOne({
          where: { userId: req.user.id, contactId: contact.id },
        });
        if (!alreadySeen) {
          const seenLead = await SeenLead.create({
            userId: req.user.id,
            contactId: contact.id,
          });
        }
      }


      let ipAddress = getIpAddress(req.ip);
      const eventLog = await createEventLog(
        req.user.id,
        contact.status == "leads"
          ? contact.status == "leads"
            ? eventResourceTypes.lead
            : eventResourceTypes.account
          : eventResourceTypes.account,
        `${contact.firstName} ${contact.middleName} ${contact.lastName}`,
        contact.id,
        eventActions.view,
        "",
        ipAddress
      );
      res.status(200).json(contact);
    }
  } catch (error) {
    
    res.status(400).json({ msg: error.message });
  }
};


const getContactByInvoice = async (req, res) => {

  try {

    const invoice = await Invoice.findByPk(req.params.id)
    
    if (invoice != null) {
      const contact = await Contact.findByPk(invoice.contactId, {
        include: [
          {
            model: User,
            as: "assignedUser",
          },
          {
            model: Contact,
            as: "memberOfC",
          },
          {
            model: User,
            as: "shares",
          },
          {
            model: User,
            as: "creater",
          },
          {
            model: Vehicle,
            as: "product",
          },
          {
            model: Branch,
            as: "branch",
          },
          {
            model: Employee,
            as: "assignedemployee",
          },
        ],
        subQuery: false,
      });

      

      if (!contact) {
        res.status(404).json({ message: "No Data Found" });
      } else {
        const alreadySeen = await SeenLead.findOne({
          where: { userId: req.user.id, contactId: contact.id },
        });
        if (!alreadySeen) {
          const seenLead = await SeenLead.create({
            userId: req.user.id,
            contactId: contact.id,
          });
        }
      }


      let ipAddress = getIpAddress(req.ip);
      const eventLog = await createEventLog(
        req.user.id,
        contact.status == "leads"
          ? contact.status == "leads"
            ? eventResourceTypes.lead
            : eventResourceTypes.account
          : eventResourceTypes.account,
        `${contact.firstName} ${contact.middleName} ${contact.lastName}`,
        contact.id,
        eventActions.view,
        "",
        ipAddress
      );
      res.status(200).json(contact);
    }
  } catch (error) {
    
    res.status(400).json({ msg: error.message });
  }
};

//function not controller

const getAssignmentCondition = async (user, status) => {
  const { role, id } = user;
  let condition = {};
  if (await canUserAccessOnlySelf(user, status)) {
    condition = {
      [Op.or]: [{ assignedTo: id },
        // { "$shares.id$": id }
      ]
    };
  } else if (await canUserAccessOnlyBranch(user, status)) {
    let employee = await Employee.findOne({ where: { userId: user.id } });
    let branchId = employee ? employee.branchId : null;
    
    condition = { branchId };
  }
  return condition;
};
 /**
  * get contacts controler
  * @param {*} req 
  * @param {*} res 
  * @returns 
  */
const getContacts = async (req, res) => {
  const { f, r, st, sc, sd, status } = req.query;
  

  if (!(await canUserRead(req.user, status))) {
    return res.status(400).json({ msg: "unauthorized access!" });
  }
  //queryparams:  { f: '0', r: '7', st: '', sc: 'first_name', sd: '1' }
  let condition = await getAssignmentCondition(req.user, status);
  try {
    
    const data = await Contact.findAndCountAll({
      include: [
        Branch,
        {
          model: User,
          as: "assignedUser",
          attributes: ['id', 'corporate_name', 'first_name', 'middle_name', 'last_name', 'email', 'phone', 'gender']

        },
        {
          model: Contact,
          as: "memberOfC",
        },
        {
          model: Employee,
          as: "assignedemployee",
        },
        {
          model: User,
          as: "shares",
          attributes: ['id', 'corporate_name', 'first_name', 'middle_name', 'last_name', 'email', 'phone', 'gender']
        },
        {
          model: User,
          as: "creater",
          attributes: ['id', 'corporate_name', 'first_name', 'middle_name', 'last_name', 'email', 'phone', 'gender']

        },
        {
          model: User,
          as: "seenUsers",
          attributes: ["id"],
          where: { id: req.user.id },
          required: false,
          attributes: ['id', 'corporate_name', 'first_name', 'middle_name', 'last_name', 'email', 'phone', 'gender']

        },
        {
          model: Vehicle,
          as: "product",
        },
        {
          model: FireRateCategory,
          as: "fire_product",
        },
      ],
      distinct: true,
      offset: Number(f),
      limit: Number(r),
      order: [[sc || "createdAt", sd == 1 ? "DESC" : "ASC"]],
      where: { [Op.and]: [{ ...getSearch(st), status: status, ...condition }] },
      subQuery: false,
    });
    
    const seenLeadsCount = await Contact.count({
      include: [
        {
          model: User,
          as: "seenUsers",
          where: { id: req.user.id },
          required: true,
          attributes: ['id', 'corporate_name', 'first_name', 'middle_name', 'last_name', 'email', 'phone', 'gender']

        },
        {
          model: Branch,
          as: "branch",
        },
      ],
      distinct: true,
      where: { ...getSearch(st), status: status, ...condition },
      subQuery: false,
      order: [[sc || "createdAt", sd == 1 ? "DESC" : "ASC"]],
    });
    res
      .status(200)
      .json({ ...data, unseenLeadsCount: data.count - seenLeadsCount });
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};

/**
 *  convert leads controller
 * @param {*} req 
 * @param {*} res 
 * @returns 
 */
const convertLead = async (req, res) => {
  //commented by me
  // if (!(await canUserEdit(req.user, "leads"))) {
  //   return res.status(400).json({ msg: "unauthorized access!" });
  // }
  // 
  const { id } = req.params;
  try {
    const prevAccount = await Contact.findByPk(id);
    if (prevAccount.stage === "For Conversion") {
      await Contact.update(
        {
          ...req.body,
          stage: "converted",
          status: "accounts",
          conversion_date: new Date(),
        },
        { where: { id } }
      );
      let newAccount = await Contact.findByPk(id);
      const changedFieldValues = getChangedFieldValues(prevAccount, newAccount);
      let ipAddress = getIpAddress(req.ip);
      const name =
        prevAccount.firstName +
        " " +
        prevAccount.middleName +
        " " +
        prevAccount.lastName;
      const eventLog = await createEventLog(
        req.user.id,
        prevAccount.status == "leads"
          ? eventResourceTypes.lead
          : eventResourceTypes.account,
        name,
        prevAccount.id,
        eventActions.edit,
        changedFieldValues,
        ipAddress
      );
    } else {
      throw new Error();
    }
    const account = await Contact.findByPk(id, {
      include: [
        {
          model: User,
          as: "assignedUser",
        },
        {
          model: Contact,
          as: "memberOfC",
        },
        {
          model: User,
          as: "shares",
        },
        {
          model: User,
          as: "creater",
        },
        {
          model: Vehicle,
          as: "product",
        },
        {
          model: FireRateCategory,
          as: "fire_product",
        },
        {
          model: Branch,
          as: "branch",
        },
      ],
      subQuery: false,
    });
    if (!(await canUserRead(req.user, "accounts"))) {
      return res
        .status(400)
        .json({ msg: "you have no authorization to access the account!" });
    }
    const name =
      account.firstName + " " + account.middleName + " " + account.lastName;
    let ipAddress = getIpAddress(req.ip);
    const eventLog = await createEventLog(
      req.user.id,
      eventResourceTypes.account,
      name,
      account.id,
      eventActions.view,
      "",
      ipAddress
    );
    
    res.status(200).json(account);
  } catch (error) {
    
    res.status(400).json({ msg: error.message });
  }
};

/**
 * get memeber of fc controller
 * @param {*} req 
 * @param {*} res 
 * @returns 
 */

const getMemberOfC = async (req, res) => {
  const { f, r, st, sc, sd, status } = req.query;
  if (!(await canUserRead(req.user, status))) {
    return res.status(400).json({ msg: "unauthorized access!" });
  }
  //queryparams:  { f: '0', r: '7', st: '', sc: 'first_name', sd: '1' }
  const { role, id } = req.user;
  
  try {
    let condition =
      !req.query.pf || req.query.pf !== "member"
        ? { ...getSearch(st), status: status, deleted: false }
        : status == "accounts"
          ? {
            ...getSearch(st),
            status: status,
            deleted: false,
          }
          : { ...getSearch(st), status: status, deleted: false };
    
    
    if (await canUserAccessOnlySelf(req.user, status)) {
      condition.assignedTo = Number(id);
    }
    let data = await Contact.findAndCountAll({
      include: [
        {
          model: User,
          as: "assignedUser",
          attributes: ['id', 'corporate_name', 'first_name', 'middle_name', 'last_name', 'email', 'phone', 'gender']

        },
        {
          model: Contact,
          as: "memberOfC",
        },
        {
          model: Vehicle,
          as: "product",
        },
        {
          model: FireRateCategory,
          as: "fire_product",
        },
        {
          model: Branch,
          as: "branch",
        },
      ],
      offset: Number(f),
      limit: Number(r),
      order: [[sc || "firstName", sd == 1 ? "ASC" : "DESC"]],
      where: condition,
    });
    res.status(200).json(data);
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};

// const getContacts = async (req, res) => {
//   try {
//     const { stage } = req.params;
//     const user = req.user;
//     if (user.role === Role.branchManager) {
//       await getManagerWithBranch(user);
//     }
//     const data = await fetchContacts(user, stage);
//     res.status(200).json(data);
//   } catch (error) {
//     res.status(400).json({ msg: error.message });
//   }
// };


/**
 * get search result controller
 * @param {*} req 
 * @param {*} res 
 */
const getSearchResults = async (req, res) => {
  const key = req.query.key;
  const userId = req.query.userId;
  const role = req.query.role;
  let contact;

  try {
    if (role == Role.superAdmin || role == Role.admin) {
      contact = await Contact.findAll({

        include: [Branch, { model: User, attributes: ['id', 'corporate_name', 'first_name', 'middle_name', 'last_name', 'email', 'phone', 'gender'] }, Employee],
        order: [["id", "ASC"]],
        where: {
          [Op.or]: [
            {
              type: {
                [Op.like]: "%" + key + "%",
              },
            },
            {
              first_name: {
                [Op.like]: "%" + key + "%",
              },
            },
            {
              middle_name: {
                [Op.like]: "%" + key + "%",
              },
            },
            {
              last_name: {
                [Op.like]: "%" + key + "%",
              },
            },
            {
              company_name: {
                [Op.like]: "%" + key + "%",
              },
            },
            {
              industry: {
                [Op.like]: "%" + key + "%",
              },
            },
            {
              email: {
                [Op.like]: "%" + key + "%",
              },
            },
            {
              phone: {
                [Op.like]: "%" + key + "%",
              },
            },
            {
              business_source_type: {
                [Op.like]: "%" + key + "%",
              },
            },
            {
              business_source: {
                [Op.like]: "%" + key + "%",
              },
            },
            {
              status: {
                [Op.like]: "%" + key + "%",
              },
            },
            {
              state: {
                [Op.like]: "%" + key + "%",
              },
            },
            {
              city: {
                [Op.like]: "%" + key + "%",
              },
            },
            {
              gender: {
                [Op.like]: "%" + key + "%",
              },
            },
            {
              "$employees.first_name$": {
                [Op.like]: "%" + key + "%",
              },
            },
            {
              "$employees.father_name$": {
                [Op.like]: "%" + key + "%",
              },
            },
            {
              "$employees.grandfather_name$": {
                [Op.like]: "%" + key + "%",
              },
            },
          ],
          deleted: false,
        },
      });
    }

    if (await canUserAccessOnlySelf(req.user, "contacts")) {
      contact = await Contact.findAll({
        include: [Branch, { model: User, attributes: ['id', 'corporate_name', 'first_name', 'middle_name', 'last_name', 'email', 'phone', 'gender'] }, Employee],
        order: [["id", "ASC"]],
        where: {
          [Op.or]: [
            {
              type: {
                [Op.like]: "%" + key + "%",
              },
            },
            {
              first_name: {
                [Op.like]: "%" + key + "%",
              },
            },
            {
              middle_name: {
                [Op.like]: "%" + key + "%",
              },
            },
            {
              last_name: {
                [Op.like]: "%" + key + "%",
              },
            },
            {
              company_name: {
                [Op.like]: "%" + key + "%",
              },
            },
            {
              industry: {
                [Op.like]: "%" + key + "%",
              },
            },
            {
              email: {
                [Op.like]: "%" + key + "%",
              },
            },
            {
              phone: {
                [Op.like]: "%" + key + "%",
              },
            },
            {
              female: {
                [Op.like]: "%" + key + "%",
              },
            },
            {
              business_source_type: {
                [Op.like]: "%" + key + "%",
              },
            },
            {
              business_source: {
                [Op.like]: "%" + key + "%",
              },
            },
            {
              status: {
                [Op.like]: "%" + key + "%",
              },
            },
            {
              state: {
                [Op.like]: "%" + key + "%",
              },
            },
            {
              city: {
                [Op.like]: "%" + key + "%",
              },
            },
          ],
          "$employees.userId$": userId,
          deleted: false,
        },
      });
    }
    if (!contact) {
      res.status(404).json({ message: "No Data Found" });
    } else res.status(200).json(contact);
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};
/**
 * export contacts controller
 * @param {*} req 
 * @param {*} res 
 * @returns 
 */

const exportContacts = async (req, res) => {
  
  const { st, sc, sd, status } = req.query;
  if (!(await canUserRead(req.user, status))) {
    return res.status(400).json({ msg: "unauthorized access!" });
  }
  let condition = await getAssignmentCondition(req.user, status);
  try {
    const contacts = await Contact.findAndCountAll({
      include: [
        {
          model: User,
          as: "assignedUser",
          attributes: ['id', 'corporate_name', 'first_name', 'middle_name', 'last_name', 'email', 'phone', 'gender']
        },
        {
          model: Contact,
          as: "memberOfC",
        },
        {
          model: User,
          as: "shares",
          attributes: ['id', 'corporate_name', 'first_name', 'middle_name', 'last_name', 'email', 'phone', 'gender']

        },
        {
          model: User,
          as: "creater",
          attributes: ['id', 'corporate_name', 'first_name', 'middle_name', 'last_name', 'email', 'phone', 'gender']

        },
        {
          model: Vehicle,
          as: "product",
        },
        {
          model: FireRateCategory,
          as: "fire_product",
        },
        {
          model: Branch,
          as: "branch",
        },
      ],
      order: [[sc || "firstName", sd == 1 ? "ASC" : "DESC"]],
      where: {
        ...getSearch(st),
        status,
        ...condition,
        deleted: false,
      },
    });
    res.status(200).json(contacts);
  } catch (error) {
    
    res.status(400).json({ msg: error.message });
    co;
  }
};

/**
 * generate report controller
 * @param {*} req 
 * @param {*} res 
 * @returns 
 */

const generateReport = async (req, res) => {
  const { status } = req.params;


  if (!(await canUserRead(req.user, status))) {
    return res.status(400).json({ msg: "unauthorized access!" });
  }
  let contact = null;
  const { f, r, st, sc, sd, purpose } = req.query;
  const {
    types,
    genders,
    accountStages,
    assignedTos,
    branchIds,
    productIds,
    stages,
    business_source,
    business_source_type,
    stage,
    state,
    city,
    gender,
    userId,
    products,
    // fire_products,
    fire_productId
  } = req.body;
  
  let { startDate, endDate } = req.body;
  const role = req.user.role;
  if (startDate) {
    startDate = new Date(new Date(startDate).setHours(0, 0, 0, 0));
  }
  if (endDate) {
    endDate = new Date(new Date(endDate).setHours(23, 59, 59, 0));
  }

  const pagination = purpose == "export" || {
    offset: Number(f),
    limit: Number(r),
  };
  
  try {
    if (role == Role.superAdmin) {
      const accountConditions = {
        [Op.and]: [
          types.length !== 0
            ? {
              type: {
                [Op.in]: types.map((typee) => typee.name),
              },
            }
            : {},
          genders.length !== 0
            ? {
              gender: {
                [Op.in]: genders.map((gender) => gender.name),
              },
            }
            : {},
          accountStages.length !== 0
            ? {
              accountStage: {
                [Op.in]: accountStages.map(
                  (accountstage) => accountstage.name
                ),
              },
            }
            : {},
          assignedTos && assignedTos.length !== 0 && assignedTos[0] !== 0
            ? {
              assignedTo: {
                [Op.in]: assignedTos,
              },
            }
            : {},
            // products && {
            //   productIds: {
            //     [Op.in]: Array.isArray(products) ? products : [products],
            //   },
            // },
            // products.length !== 0
            // ? {
            //   productIds: {
            //     [Op.in]: products.map(
            //       (accountstage) => accountstage.name
            //     ),
            //   },
            // }
            // : {},
            // products && products.length !== 0 && products[0] !== 0
            // ? {
            //   product: {
            //     [Op.in]: products,
            //   },
            // }
            // : {},

          // products && {
          //   productIds: {
          //     [Op.in]: products.split(",").map((e) => {
          //       return e.trim();
          //     }),
          //   },
          // },
          productIds && productIds.length !== 0 && productIds[0] !== 0
        ? {
          productId: {
            [Op.in]: productIds,
          },
        }
        : {},
          // productIds && {
          //   productId: {
          //     [Op.in]: productIds,
          //   },
          // },

          // productIds && productIds.length !== 0 && productIds[0] !== 0
          //   ? {
          //     productId: {
          //       [Op.in]: productIds,
          //     },
          //   }
          //   : {},
          // fire_products && fire_products.length !== 0 && fire_products[0] !== 0
          // ? {
          //   fire_productId: {
          //     [Op.in]: fire_products,
          //   },
          // }
          // : {},
          fire_productId && fire_productId.length !== 0 && fire_productId[0] !== 0
            ? {
              fire_productId: {
                [Op.in]: fire_productId,
              },
            }
      : {},
          branchIds && branchIds.length !== 0 && branchIds[0] !== 0
            ? {
              branchId: {
                [Op.in]: branchIds,
              },
            }
            : {},
          startDate ? { createdAt: { [Op.gte]: startDate } } : {},
          endDate ? { createdAt: { [Op.lte]: endDate } } : {},
          {
            status: req.params.status,
          },
        ],
      };

      const leadConditions = {
        [Op.and]: [
          stages.length !== 0
            ? {
              stage: {
                [Op.in]: stages.map((stage) => stage.name),
              },
            }
            : {},
          assignedTos && assignedTos.length !== 0 && assignedTos[0] !== 0
            ? {
              assignedTo: {
                [Op.in]: assignedTos,
              },
            }
            : {},
          // products && {
          //   productIds: {
          //     [Op.in]: products.split(",").map((e) => {
          //       return e.trim();
          //     }),
          //   },
          // },
          productIds && productIds.length !== 0 && productIds[0] !== 0
        ? {
          productId: {
            [Op.in]: productIds,
          },
        }
        : {},
          // productIds && {
          //   productId: {
          //     [Op.in]: productIds,
          //   },
          // },
          fire_productId && fire_productId.length !== 0 && fire_productId[0] !== 0
            ? {
              fire_productId: {
                [Op.in]: fire_productId,
              },
            }
      : {},
          branchIds && branchIds.length !== 0 && branchIds[0] !== 0
            ? {
              branchId: {
                [Op.in]: branchIds,
              },
            }
            : {},
          startDate ? { createdAt: { [Op.gte]: startDate } } : {},
          endDate ? { createdAt: { [Op.lte]: endDate } } : {},
          {
            status: req.params.status,
            // [Op.or]: [{ status: "leads" }, { stage: "converted" }],
          },
        ],
      };

      
      const pagination = purpose == "export" || {
        offset: Number(f),
        limit: Number(r),
      };
      const conditions =
        status === "accounts" ? accountConditions : leadConditions;
      contact = await Contact.findAndCountAll({
        include: [
          {
            model: User,
            as: "assignedUser",
            attributes: ['id', 'corporate_name', 'first_name', 'middle_name', 'last_name', 'email', 'phone', 'gender']

          },
          {
            model: Contact,
            as: "memberOfC",
          },
          {
            model: User,
            as: "shares",
            attributes: ['id', 'corporate_name', 'first_name', 'middle_name', 'last_name', 'email', 'phone', 'gender']

          },
          {
            model: User,
            as: "creater",
            attributes: ['id', 'corporate_name', 'first_name', 'middle_name', 'last_name', 'email', 'phone', 'gender']

          },
          {
            model: Vehicle,
            as: "product",
          },
          {
            model: FireRateCategory,
            as: "fire_product",
          },
          {
            model: Branch,
            as: "branch",
          },
        ],
        subQuery: false,
        ...pagination,
        order: [[sc || "firstName", sd == 1 ? "ASC" : "DESC"]],
        distinct: true,
        where: {
          ...getSearch(st),
          ...conditions,
        },
      });
    }

    if (await canUserAccessOnlySelf(req.user, "contacts")) {
      let contact = await Contact.findAll({
        include: [Branch, User, Employee],
        order: [["id", "ASC"]],
        where: {
          ...getSearch(st),
          ...pagination,
          [Op.and]: [
            {
              type: {
                [Op.like]: "%" + type + "%",
              },
            },
            {
              business_source_type: {
                [Op.like]: "%" + business_source_type + "%",
              },
            },
            {
              business_source: {
                [Op.like]: "%" + business_source + "%",
              },
            },
            {
              status: {
                [Op.like]: "%" + status + "%",
              },
            },
            {
              state: {
                [Op.like]: "%" + state + "%",
              },
            },
            {
              city: {
                [Op.like]: "%" + city + "%",
              },
            },
            {
              gender: {
                [Op.like]: "%" + gender + "%",
              },
            },
          ],
          "$employees.userId$": userId,
          deleted: false,
        },
      });
    }
    if (!contact) {
      res.status(404).json({ message: "No Data Found" });
    } else res.status(200).json(contact);
  } catch (error) {
    
    res.status(400).json({ msg: error.message });
  }
};

/**
 * getLeads controller
 * @param {*} req 
 * @param {*} res 
 */

const getLeads = async (req, res) => {
  try {
    const data = await fetchLeads(req.user);
    res.status(200).json(data);
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};

/**
 * fetch contacts controller
 * @param {*} user 
 * @param {*} stage 
 * @returns 
 */

const fetchContacts = async (user, stage) => {
  switch (user.role) {
    case Role.superAdmin:
    case Role.admin:
      switch (stage) {
        case "all":
          return await Contact.findAll({
            include: [Branch, { model: User, attributes: ['id', 'corporate_name', 'first_name', 'middle_name', 'last_name', 'email', 'phone', 'gender'] }, Employee],
            where: { deleted: !true },
            order: [["createdAt", "DESC"]],
          });
        case ContactStatus.prospect:
          return await Contact.findAll({
            include: [Branch, { model: User, attributes: ['id', 'corporate_name', 'first_name', 'middle_name', 'last_name', 'email', 'phone', 'gender'] }, Employee],
            where: { status: ContactStatus.prospect, deleted: false },
            order: [["createdAt", "DESC"]],
          });
        case ContactStatus.opportunity:
          return await Contact.findAll({
            include: [Branch, { model: User, attributes: ['id', 'corporate_name', 'first_name', 'middle_name', 'last_name', 'email', 'phone', 'gender'] }, Employee],
            where: { status: ContactStatus.opportunity, deleted: false },
            order: [["createdAt", "DESC"]],
          });
        case ContactStatus.lead:
          return await Contact.findAll({
            include: [Branch, { model: User, attributes: ['id', 'corporate_name', 'first_name', 'middle_name', 'last_name', 'email', 'phone', 'gender'] }, Employee],
            where: { status: ContactStatus.lead, deleted: false },
            order: [["createdAt", "DESC"]],
          });
      }
    case Role.branchManager:
      switch (stage) {
        case "all":
          return await Contact.findAll({
            include: [Branch, { model: User, attributes: ['id', 'corporate_name', 'first_name', 'middle_name', 'last_name', 'email', 'phone', 'gender'] }, Employee],
            where: { deleted: !true, branchId: user.branchId },
            order: [["createdAt", "DESC"]],
          });
        case ContactStatus.prospect:
          return await Contact.findAll({
            include: [Branch, { model: User, attributes: ['id', 'corporate_name', 'first_name', 'middle_name', 'last_name', 'email', 'phone', 'gender'] }, Employee],
            where: {
              status: ContactStatus.prospect,
              deleted: false,
              branchId: user.branchId,
            },
            order: [["createdAt", "DESC"]],
          });
        case ContactStatus.opportunity:
          return await Contact.findAll({
            include: [Branch, { model: User, attributes: ['id', 'corporate_name', 'first_name', 'middle_name', 'last_name', 'email', 'phone', 'gender'] }, Employee],
            where: {
              status: ContactStatus.opportunity,
              deleted: false,
              branchId: user.branchId,
            },
            order: [["createdAt", "DESC"]],
          });
        case ContactStatus.lead:
          return await Contact.findAll({
            include: [Branch, { model: User, attributes: ['id', 'corporate_name', 'first_name', 'middle_name', 'last_name', 'email', 'phone', 'gender'] }, Employee],
            where: {
              status: ContactStatus.lead,
              deleted: false,
              branchId: user.branchId,
            },
            order: [["createdAt", "DESC"]],
          });
      }
      break;
    case Role.sales:
      switch (stage) {
        case "all":
          return await Contact.findAll({
            include: [Branch, { model: User, attributes: ['id', 'corporate_name', 'first_name', 'middle_name', 'last_name', 'email', 'phone', 'gender'] }, Employee],
            where: {
              [Op.or]: {
                userId: {
                  [Op.like]: user.id,
                },
                "$employees.userId$": { [Op.like]: user.id },
              },
              deleted: false,
            },
            order: [
              ["id", "DESC"],
              ["createdAt", "DESC"],
            ],
          });
        case ContactStatus.prospect:
          return await Contact.findAll({
            include: [Branch, { model: User, attributes: ['id', 'corporate_name', 'first_name', 'middle_name', 'last_name', 'email', 'phone', 'gender'] }, Employee],
            where: {
              [Op.or]: {
                userId: {
                  [Op.like]: user.id,
                },
                "$employees.userId$": { [Op.like]: user.id },
              },
              status: { [Op.like]: ContactStatus.prospect },
              deleted: false,
            },
          });
        case ContactStatus.opportunity:
          return await Contact.findAll({
            include: [Branch, { model: User, attributes: ['id', 'corporate_name', 'first_name', 'middle_name', 'last_name', 'email', 'phone', 'gender'] }, Employee],
            where: {
              [Op.or]: {
                userId: {
                  [Op.like]: user.id,
                },
                "$employees.userId$": { [Op.like]: user.id },
              },
              status: { [Op.like]: ContactStatus.opportunity },
              deleted: false,
            },
          });
        case ContactStatus.lead:
          return await Contact.findAll({
            include: [Branch, { model: User, attributes: ['id', 'corporate_name', 'first_name', 'middle_name', 'last_name', 'email', 'phone', 'gender'] }, Employee],
            where: {
              [Op.or]: {
                userId: {
                  [Op.like]: user.id,
                },
                "$employees.userId$": { [Op.like]: user.id },
              },
              status: { [Op.like]: ContactStatus.lead },
              deleted: false,
            },
          });
      }
    default:
      return await Contact.findAll({
        include: [Branch, Employee, { model: User, attributes: ['id', 'corporate_name', 'first_name', 'middle_name', 'last_name', 'email', 'phone', 'gender'] }],
        where: { userId: user.id, deleted: false },
        order: [
          ["id", "DESC"],
          ["createdAt", "DESC"],
        ],
      });
  }
};

/**
 * fetch prospects controler
 * @param {*} user 
 * @returns 
 */

const fetchProspects = async (user) => {
  switch (user.role) {
    case Role.admin:
      return await Contact.findAll({
        include: [Branch, { model: User, attributes: ['id', 'corporate_name', 'first_name', 'middle_name', 'last_name', 'email', 'phone', 'gender'] }],
        where: { stage: ContactStatus.prospect },
      });

    case Role.sales:
      return await Contact.findAll({
        include: [Branch, { model: User, attributes: ['id', 'corporate_name', 'first_name', 'middle_name', 'last_name', 'email', 'phone', 'gender'] }],
        where: { userId: user.id, stage: ContactStatus.prospect },
      });

    default:
      return await Contact.findAll({
        include: [[Branch, { model: User, attributes: ['id', 'corporate_name', 'first_name', 'middle_name', 'last_name', 'email', 'phone', 'gender'] }]],
        where: { userId: user.id, stage: ContactStatus.prospect },
      });
  }
};
/**
 * fetch contacts by employee and status
 * @param {*} req 
 * @param {*} res 
 */

const getContactsByEmployeeAndStatus = async (req, res) => {
  //queryparams:  { f: '0', r: '7', st: '', sc: 'first_name', sd: '1' }
  let condition = await getAssignmentCondition(req.user);
  
  const { f, r, st, sc, sd, status, employeeUserId } = req.query;
  try {
    const data = await Contact.findAndCountAll({
      include: [
        {
          model: User,
          as: "assignedUser",
          attributes: ['id', 'corporate_name', 'first_name', 'middle_name', 'last_name', 'email', 'phone', 'gender']
        },
        {
          model: Employee,
          as: "assignedemployee",
        },
        {
          model: Contact,
          as: "memberOfC",

        },
        {
          model: User,
          as: "shares",
          attributes: ['id', 'corporate_name', 'first_name', 'middle_name', 'last_name', 'email', 'phone', 'gender']

        },
        {
          model: User,
          as: "creater",
          attributes: ['id', 'corporate_name', 'first_name', 'middle_name', 'last_name', 'email', 'phone', 'gender']

        },
        {
          model: Vehicle,
          as: "product",
        },
        {
          model: FireRateCategory,
          as: "fire_product",
        },
        {
          model: Branch,
          as: "branch",
        },
      ],
      offset: Number(f),
      limit: Number(r),
      order: [[sc || "createdAt", sd == 1 ? "DESC" : "ASC"]],
      where: {
        ...getSearch(st),
        "$assignedUser.id$": employeeUserId,
        status: status,
        deleted: false,
      },
      subQuery: false,
    });
    res.status(200).json(data);
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};

/**
 * fetch leads function
 * @param {*} user 
 * @returns 
 */
const fetchLeads = async (user) => {
  switch (user.role) {
    case Role.admin:
      return await Contact.findAll({
        include: [Branch, { model: User, attributes: ['id', 'corporate_name', 'first_name', 'middle_name', 'last_name', 'email', 'phone', 'gender'] }, Employee],
        where: { stage: ContactStatus.lead },
      });

    case Role.sales:
      return await Contact.findAll({
        include: [Branch, { model: User, attributes: ['id', 'corporate_name', 'first_name', 'middle_name', 'last_name', 'email', 'phone', 'gender'] }, Employee],
        where: { userId: user.id, stage: ContactStatus.lead },
      });

    default:
      return await Contact.findAll({
        include: [[Branch, { model: User, attributes: ['id', 'corporate_name', 'first_name', 'middle_name', 'last_name', 'email', 'phone', 'gender'] }, Employee]],
        where: { userId: user.id, stage: ContactStatus.lead },
      });
  }
};

/**
 * fetch oportunities function
 * @param {*} user 
 * @returns 
 */
const fetchOppotunities = async (user) => {
  switch (user.role) {
    case Role.admin:
      return await Contact.findAll({
        include: [Branch, { model: User, attributes: ['id', 'corporate_name', 'first_name', 'middle_name', 'last_name', 'email', 'phone', 'gender'] }],
        where: { stage: ContactStatus.opportunity },
      });

    case Role.sales:
      return await Contact.findAll({
        include: [Branch, { model: User, attributes: ['id', 'corporate_name', 'first_name', 'middle_name', 'last_name', 'email', 'phone', 'gender'] }],
        where: { userId: user.id, stage: ContactStatus.opportunity },
      });

    default:
      return await Contact.findAll({
        include: [Branch, { model: User, attributes: ['id', 'corporate_name', 'first_name', 'middle_name', 'last_name', 'email', 'phone', 'gender'] }],
        where: { userId: user.id, stage: ContactStatus.opportunity },
      });
  }
};
/**
 * create contact controller
 * @param {*} req 
 * @param {*} res 
 * @returns 
 */
const createContact = async (req, res) => {
  const { status } = req.body;
  
  if (!(await canUserCreate(req.user, status))) {
    return res.status(400).json({ msg: "unauthorized access!" });
  }
  const reqbody = { ...req.body, userId: req.user.id };
  
  const { primaryEmail, secondaryEmail, secondaryPhone } = req.body;
  const { primaryPhone } = req.body;
  try {
    if (!isPhoneNoValid(primaryPhone)) {
      res.status(400).json({ msg: "invalid phone" });
      return;
    }
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
    if (
      !(primaryEmail !== "" || primaryEmail !== null) &&
      !isEmailValid(primaryEmail)
    ) {
      res.status(400).json({ msg: "Invalid Email" });
      return;
    }
    let findContactByEmail = null;
    if (primaryEmail !== "")
      findContactByEmail = await Contact.findOne({
        where: { primaryEmail },
      });
    let findContactByphone = null;
    if (primaryPhone !== "")
      findContactByphone = await Contact.findOne({
        where: { primaryPhone },
      });
    
    if (findContactByphone == null && findContactByEmail == null) {
      const contact = await Contact.create(reqbody);
      if (contact) {
        let ipAddress = getIpAddress(req.ip);
        const name =
          contact.firstName + " " + contact.middleName + " " + contact.lastName;
        const eventLog = await createEventLog(
          req.user.id,
          contact.status == "leads"
            ? eventResourceTypes.lead
            : eventResourceTypes.account,
          name,
          contact.id,
          eventActions.create,
          "",
          ipAddress
        );
      }
      const { sharedWith } = req.body;
      const toAdd = sharedWith.map((element) => {
        return { accountId: contact.id, userId: element };
      });
      const createShareedWith = await SharedAccounts.bulkCreate(toAdd);
      // if (createShareedWith) {
      //   createShareedWith.forEach(element => {
      //     const eventLog = await createEventLog(
      //       req.user.id,
      //       contact.status == "leads"
      // ? eventResourceTypes.lead
      // : eventResourceTypes.account,
      //       contact.id,
      //       eventActions.create
      //     );
      //   });
      // }
      // await contact.addEmployees(reqbody.employees, {
      //   through: ContactEmployee,
      // });
      // await contact.addBranches(reqbody.branches, { through: ContactBranch });
      let name = "";
      if (status === "leads") {
        name = contact.firstName;
      } else {
        name =
          contact.firstName + " " + contact.middleName || contact.companyName;
      }
      smsFunction(
        contact.phone,
        `Dear ${name}, welcome to the Zemen Insurance!`
      );
      primaryEmail &&
        sendWelcomeEmail(
          contact.primaryEmail,
          name,
          " Welcome to Zemen Insurance!",
          ""
        );

      res.status(200).json(contact);
    } else if (findContactByphone != null) {
      res.status(409).json({ msg: "Phone number already exists" });
    } else {
      res.status(409).json({ msg: "Email already exists" });
    }
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};

/**
 * create contact bulk controller
 * @param {*} req 
 * @param {*} res 
 * @returns 
 */
const createContacts = async (req, res) => {
  //commented by me
  // if (!(await canUserCreate(req.user, "contacts"))) {
  //   return res.status(400).json({ msg: "unauthorized access!" });
  // }
  const contacts = req.body;
  var addedContactsList = 0;
  var duplicate = [];
  var incorrect = [];
  var lineNumber = 1;

  try {
    var promises = await contacts.map(async (contact) => {
      let primaryEmail = contact.primaryEmail;
      let primaryPhone = contact.primaryPhone;
      lineNumber = lineNumber + 1;
      const findContactByEmail = await Contact.findOne({
        where: { primaryEmail },
      });
      const findContactByphone = await Contact.findOne({
        where: { primaryPhone },
      });
      

      contact.deleted = false;
      if (isPhoneNoValid(contact.primaryPhone)) {
        if (findContactByphone == null) {
          try {
            let newContact = await Contact.create(contact);
            addedContactsList += 1;
          } catch (error) {
            incorrect.push(lineNumber);
          }
          
        } else {
          duplicate.push(lineNumber);
        }
      } else {
        incorrect.push(lineNumber);
      }

    });
    Promise.all(promises).then(function (results) {
      
      let msg = "";
      
      if (addedContactsList != 0) {
        msg = msg + `${addedContactsList} added`;
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
/**
 * edit contacts controller
 * @param {*} req 
 * @param {*} res 
 * @returns 
 */
const editContact = async (req, res) => {
  
  //commented by me
  // if (
  //   !(await canUserEdit(req.user, "accounts")) &&
  //   !(await canUserEdit(req.user, "leads"))
  // ) {
  //   return res.status(400).json({ msg: "unauthorized access!" });
  // }
  const { id, ...others } = req.body;
  
  const { primaryEmail, primaryPhone } = req.body;
  try {
    let findContactByEmail = null;
    if (primaryEmail !== "")
      findContactByEmail = await Contact.findAll({
        where: { primaryEmail },
      });
    let findContactByphone = null;
    if (primaryPhone !== "")
      findContactByphone = await Contact.findAll({
        where: { primaryPhone },
      });
   
    // if (
    //   (findContactByphone && findContactByphone.length > 1) ||
    //   (findContactByEmail && findContactByEmail.length > 1)
    // ) {
    //   res.status(400).json({ msg: "Phone Number or email already exists" });
    //   return;
    // }

    const savedContact = await Contact.findByPk(id, {});
    const updatedContact = await Contact.update(others, {
      where: { id },
    });
    const newContact = await Contact.findByPk(id, {});
    
    const name =
      savedContact.firstName +
      " " +
      savedContact.middleName +
      " " +
      savedContact.lastName;
    if (updatedContact) {
      const changedFieldValues = getChangedFieldValues(
        savedContact,
        newContact
      );
      let ipAddress = getIpAddress(req.ip);
      const eventLog = await createEventLog(
        req.user.id,
        savedContact.status == "leads"
          ? eventResourceTypes.lead
          : eventResourceTypes.account,
        name,
        savedContact.id,
        eventActions.edit,
        changedFieldValues,
        ipAddress
      );
    }
    const { sharedWith } = req.body;
    SharedAccounts.destroy({ where: { accountId: req.body.id } });
    const toAdd = sharedWith.map((element) => {
      return { accountId: req.body.id, userId: element };
    });
    SharedAccounts.bulkCreate(toAdd);

    // if (req.body.employees.length != 0) {
    //   if (Number.isInteger(req.body.employees[0])) {
    //     await savedContact.setEmployees(req.body.employees, {
    //       through: ContactEmployee,
    //     });
    //   } else {
    //     let ids = [];
    //     req.body.employees.map((e) => {
    //       ids.push(e.id);
    //     });

    //     await savedContact.setEmployees(ids, { through: ContactEmployee });
    //   }
    // }
    // if (req.body.branches.length != 0) {
    //   if (Number.isInteger(req.body.branches[0])) {
    //     await savedContact.setBranches(req.body.branches, {
    //       through: ContactBranch,
    //     });
    //   } else {
    //     let branchIds = [];
    //     req.body.branches.map((e) => {
    //       branchIds.push(e.id);
    //     });
    //     await savedContact.setBranches(branchIds, { through: ContactBranch });
    //   }
    // }

    if (req.body.firstName !== savedContact.firstName) {
      await UpdateHistory.create({
        userId: req.user.id,
        contactId: savedContact.id,
        attribute: "First name",
        previous_status: savedContact.firstName,
        current_status: req.body.firstName,
      });
    }
    if (req.body.middleName !== savedContact.middleName) {
      await UpdateHistory.create({
        userId: req.user.id,
        contactId: savedContact.id,
        attribute: "Father Name",
        previous_status: savedContact.middleName,
        current_status: req.body.middleName,
      });
    }
    if (req.body.lastName !== savedContact.lastName) {
      await UpdateHistory.create({
        userId: req.user.id,
        contactId: savedContact.id,
        attribute: "Grand father name",
        previous_status: savedContact.lastName,
        current_status: req.body.lastName,
      });
    }
    //     if (employees !== savedContact.employees) {
    //   await UpdateHistory.create({
    //     userId: req.user.id,
    //     contactId: savedContact.id,
    //     attribute: 'Assigned Employee',
    //     previous_status: savedContact.employees.first_name + " " + employees.middle_name,
    //     current_status: employees.first_name + " " + employees.middle_name,
    //   });
    // }
    if (req.body.companyName !== savedContact.companyName) {
      await UpdateHistory.create({
        userId: req.user.id,
        contactId: savedContact.id,
        attribute: "Company Name",
        previous_status: savedContact.companyName,
        current_status: req.body.companyName,
      });
    }

    if (req.body.primaryPhone !== savedContact.primaryPhone) {
      await UpdateHistory.create({
        userId: req.user.id,
        contactId: savedContact.id,
        attribute: "Phone Number",
        previous_status: savedContact.primaryPhone,
        current_status: req.body.primaryPhone,
      });
    }
    if (req.body.primaryEmail !== savedContact.primaryEmail) {
      await UpdateHistory.create({
        userId: req.user.id,
        contactId: savedContact.id,
        attribute: "Email",
        previous_status: savedContact.primaryEmail,
        current_status: req.body.primaryEmail,
      });
    }

    if (req.body.status !== savedContact.status) {
      await UpdateHistory.create({
        userId: req.user.id,
        contactId: savedContact.id,
        attribute: "Status",
        previous_status: savedContact.status,
        current_status: req.body.status,
      });
    }
    // if (business_source !== savedContact.business_source) {
    //   await UpdateHistory.create({
    //     userId: req.user.id,
    //     contactId: savedContact.id,
    //     attribute: "Buiness Source",
    //     previous_status: savedContact.business_source,
    //     current_status: business_source,
    //   });
    // }

    res.status(200).json({ savedContact });
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};

/**
 * Edit prospect controller
 */
const editProspective = async (req, res) => {
  const reqbody = req.body;
  const id = req.param.id;
  try {
    await Contact.update(reqbody, { where: { id: reqbody.id } });

    res.status(200).json({ id });
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};
/**
 * edit opportunities controller
 * @param {*} req 
 * @param {*} res 
 */
const editOpportunity = async (req, res) => {
  const reqbody = req.body;
  const id = req.param.id;
  try {
    await Contact.update(reqbody, { where: { id: reqbody.id } });

    res.status(200).json({ id });
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};

/**
 * delete contact controller(authorization needed)
 * @param {*} req 
 * @param {*} res 
 * @returns 
 */
const deleteContact = async (req, res) => {
  //commented by me
  // if (
  //   !(await canUserDelete(req.user, "leads")) &&
  //   !(await canUserDelete(req.user, "accounts"))
  // ) {
  //   return res.status(400).json({ msg: "unauthorized access!" });
  // }
  const id = req.params.id;
  try {
    const contact = await Contact.findByPk(id);
    
    

    if (contact && contact.deleted) {
      await Contact.destroy({ where: { id: id } });
    } else {
      const opportunity = await Opportunity.findOne({
        where: { accountId: id },
      });
      if (!opportunity) {
        //Contact.update({ deleted: true }, { where: { id: id } });
        await Contact.destroy({ where: { id } });
        const name =
          contact.firstName + " " + contact.middleName + " " + contact.lastName;
        let ipAddress = getIpAddress(req.ip);
        const eventLog = await createEventLog(
          req.user.id,
          contact.status == "leads"
            ? eventResourceTypes.lead
            : eventResourceTypes.account,
          name,
          contact.id,
          eventActions.delete,
          "",
          ipAddress
        );
        await SeenLead.destroy({ where: { contactId: id } });
      } else {
        res.status(400).json({ msg: "The account has opportunities." });
      }
    }

    res.status(200).json({ id });
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};

/**
 * getDeleted contacts controller(authorization needed)
 * @param {*} req 
 * @param {*} res 
 * @returns 
 */
const getDeletedContacts = async (req, res) => {

  //commented by me
  // if (
  //   !(await canUserRead(req.user, "leads")) &&
  //   !(await canUserRead(req.user, "accounts"))
  // ) {
  //   return res.status(400).json({ msg: "unauthorized access!" });
  // }
  // 
  // let deletedContacts;
  const id = req.params.id;
  try {
    const user = await User.findByPk(req.params.id);
    const data = await fetchDeletedContacts(user);
    
    res.status(200).json(data);
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};
/**
 * fetchDeleted contacts(authorization needed) but currently not in use
 * @param {*} user 
 * @returns 
 */
const fetchDeletedContacts = async (user) => {
  if (
    !(await canUserRead(req.user, "leads")) &&
    !(await canUserRead(req.user, "leads"))
  ) {
    return res.status(400).json({ msg: "unauthorized access!" });
  }
  try {
    

    switch (user.role) {
      case Role.superAdmin:
      case Role.admin:
        
        return await Contact.findAll({
          include: [Branch, { model: User, attributes: ['id', 'corporate_name', 'first_name', 'middle_name', 'last_name', 'email', 'phone', 'gender'] }, Employee],
          where: { deleted: true },
          order: [["createdAt", "DESC"]],
        });
        break;
      case Role.admin:
        
        return await Contact.findAll({
          include: [Branch, { model: User, attributes: ['id', 'corporate_name', 'first_name', 'middle_name', 'last_name', 'email', 'phone', 'gender'] }, Employee],
          where: { deleted: true },
          order: [["createdAt", "DESC"]],
        });
        break;
      case Role.sales:
        return await Contact.findAll({
          include: [Branch, { model: User, attributes: ['id', 'corporate_name', 'first_name', 'middle_name', 'last_name', 'email', 'phone', 'gender'] }, Employee],
          where: {
            [Op.or]: {
              userId: {
                [Op.like]: user.id,
              },
              "$employees.userId$": { [Op.like]: user.id },
            },
            deleted: false,
          },
          order: [
            ["id", "DESC"],
            ["createdAt", "DESC"],
          ],
        });
        break;
    }
  } catch (error) {
    return error.message;
  }
};

/**
 * restore contacts
 * @param {*} req 
 * @param {*} res 
 * @returns 
 */
const restoreContacts = async (req, res) => {
  //commented by me
  // if (
  //   !(await canUserCreate(req.user, "leads")) &&
  //   !(await canUserCreate(req.user, "accounts"))
  // ) {
  //   return res.status(400).json({ msg: "unauthorized access!" });
  // }
  // 
  let restoredContacts;
  const contact = req.body;
  const id = contact;
  try {
    const result = Contact.findOne({ where: { id: id } });
    restoredContacts ==
      (await Contact.update({ deleted: false }, { where: { id: id } }));

    // const user = req.body;
    // const userId = user.id
    // try {
    //   switch (user.role){
    //     case Role.superAdmin:
    //       restoredContacts = await Contact.update({ deleted : false},{where : { deleted: true }});
    //       
    //       break
    //     case Role.admin:
    //       restoredContacts = await Contact.update({ deleted : false}, {where : { deleted: true }});
    //       
    //       break;
    //     case Role.sales:
    //       const deletedContacts = await Contact.findAll({ include : [Employee], where : { deleted: true, [Op.or]: {
    //               userId:  userId,
    //               "$employees.userId$": userId}, }});
    //       deletedContacts.forEach(async element => {
    //        restoreContacts = await Contact.update({deleted: false}, {where: {id: element.id}})
    //       });
    //       break;
    //   }
    res.status(200).json({ restoredContacts });
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};
/**
 * send eamil controller
 * @param {*} req 
 * @param {*} res 
 * @returns 
 */
const sendEmail = async (req, res) => {
  // if (
  //   !(await canUserEdit(req.user, "leads")) &&
  //   !(await canUserEdit(req.user, "accounts"))
  // ) {
  //   return res.status(400).json({ msg: "unauthorized access!" });
  // }
  const body = req.body;
  try {
    let documents;
    const contact = await Contact.findAll({
      where: { id: { [Op.in]: body.contacts } },
      include: [
        {
          model: AdditionalEmailModel,
          as: "owner",
        },
      ],
    });

    if (contact && contact[0].primaryEmail != null) {
      if (body.documents) {
        documents = await Document.findAll({
          attributes: ["name", "document"],
          where: {
            id: {
              [Op.in]: body.documents,
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
      let sendTo = [];

      if (body.additionalEmails) {
        const additionalEmail = await AdditionalEmail.findAll({
          attributes: ["email"],
          where: { id: { [Op.in]: [body.additionalEmails] } },
        });
        additionalEmail.map((e) => {
          sendTo.push(e.email);
        });
      }
      contact.map((e) => {
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
          if (body.emailType.find((element) => element == "additionalEmails")) {
            
            if (e.owner) {
              sendTo.push(e.owner.email);

              //  e.owner.map((owner) => {
              //    
              //   sendTo.push(owner.email)
              // })
            }
          }
        } else {
          sendTo.push(e.primaryEmail);
        }
      });

      if (sendTo.length == 0) {
        res.status(400).json({ msg: "Email address not found " });
      }

      
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

      if (sendTo[0] == "") {
        res.status(400).json({ msg: "Email address not found " });
      } else {
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
                email.addContacts(body.contacts.map(Number), {
                  through: ContactEmails,
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
      }
    } else {
      res.status(400).json({ msg: "Email address not found " });
    }
  } catch (error) {
    
    res.status(400).json({ msg: error.message });
  }
};
/**
 * send contact sms controller
 * @param {*} req 
 * @param {*} res 
 * @returns 
 */
const sendContactSMS = async (req, res) => {
  //commented by me
  // if (
  //   !(await canUserEdit(req.user, "leads")) &&
  //   !(await canUserEdit(req.user, "accounts"))
  // ) {
  //   return res.status(400).json({ msg: "unauthorized access!" });
  // }
  const body = req.body;

  
  try {
    const contact = await Contact.findAll({
      where: { id: { [Op.in]: body.contacts } },
      include: [
        {
          model: PhoneNo,
          as: "phoneowner",
        },
      ],
    });

    const sendTo = [];
    if (contact && contact[0].primaryPhone != null) {
      if (body.additionalPhones) {
        const additionalPhone = await PhoneNo.findAll({
          attributes: ["phoneNo"],
          where: { id: { [Op.in]: [body.additionalPhones] } },
        });
        additionalPhone.map((e) => {
          sendTo.push(e.phoneNo);
        });
      }
      contact.map((e) => {
        if (body.phoneType.length == 0) {
          sendTo.push(e.primaryPhone);
        }
        if (body.phoneType.find((element) => element == "primaryPhone")) {
          sendTo.push(e.primaryPhone);
        }
        if (body.phoneType.find((element) => element == "secondaryPhone")) {
          sendTo.push(e.secondaryPhone);
        }
        if (body.phoneType.find((element) => element == "additionalPhones")) {
          if (e.owner) {
            sendTo.push(e.phoneowner.phoneNo);

            //  e.owner.map((owner) => {
            //    
            //   sendTo.push(owner.email)
            // })
          }
        }
      });
      
      

      if (sendTo.length == 0) {
        res.status(400).json({ msg: "Email address not found " });
      } else {
        return await sendNewSms(sendTo, body.content).then((sent) => {
          // 
          if (sent.status == 200) {
            try {
              const sms = SMSMessage.create(body).then((sms) => {
                sms.addContacts(body.contacts, { through: ContactSms });
                return res.status(200).json(sms);
              });
            } catch (error) {
              res.status(400).json({ msg: error.message });
            }
          } else {
            res.status(400).json({ msg: "sms not sent" });
          }
        });
      }
    } else {
      res.status(400).json({ msg: "Phone number not found" });
    }
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};
// const getEmail = async (req, res) => {

//   if (
//     !(await canUserRead(req.user, "leads")) &&
//     !(await canUserRead(req.user, "accounts"))
//   ) {
//     return res.status(400).json({ msg: "unauthorized access!" });
//   }
//   const body = req.params.id;
//   try {
//     const { f, r, st, sc, sd } = req.query;
//     
//     


//     const email = await Email.findAndCountAll({
//       include: [{ model: User, attributes: ['id', 'corporate_name', 'first_name', 'middle_name', 'last_name', 'email', 'phone', 'gender'] }, Contact, Document, Emailcc],
//       where: { "$contacts.id$": { [Op.like]: body } },
//       offset: Number(f),
//       limit: Number(r),
//       order: [[sc || "createdAt", sd == 1 ? "DESC" : "ASC"]],
//       // where: getSearch(st),
//       subQuery: false,
//     });
//     

//     res.status(200).json(email);
//   } catch (error) {
//     res.status(400).json({ msg: error.message });
//   }
// };

/**
 * get email controller
 * @param {*} req 
 * @param {*} res 
 * @returns 
 */
const getEmail = async (req, res) => {
  // if (
  //   !(await canUserRead(req.user, "leads")) &&
  //   !(await canUserRead(req.user, "accounts"))
  // ) {
  //   return res.status(400).json({ msg: "unauthorized access!" });
  // }
  const body = req.params.id;
  try {
    const email = await Email.findAll({
      include: [{ model: User, attributes: ['id', 'corporate_name', 'first_name', 'middle_name', 'last_name', 'email', 'phone', 'gender'] }, Contact, Document, Emailcc],
      order: [["createdAt", "DESC"]],
      where: { "$contacts.id$": { [Op.like]: body } },
    });
    res.status(200).json({ rows: email });
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};
/**
 * get sms controller
 * @param {*} req 
 * @param {*} res 
 */
const getSMS = async (req, res) => {
  const body = req.params.id;
  try {
    const { f, r, st, sc, sd } = req.query;
    const sms = await SMSMessage.findAndCountAll({
      include: [{ model: User, attributes: ['id', 'corporate_name', 'first_name', 'middle_name', 'last_name', 'email', 'phone', 'gender'] }, Contact],
      where: { "$contacts.id$": { [Op.like]: body } },
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
/**
 * get campaigncontacts controller
 * @param {*} req 
 * @param {*} res 
 */
const getCampaignContacts = async (req, res) => {
  
  const campaignId = req.params.id;
  try {
    const data = await Contact.findAll({
      where: {
        business_source_type: ["Campaign", "CAMPAIGN"],
        business_source: campaignId,
      },
    });
    
    res.status(200).json(data);
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};

module.exports = {
  getContacts,
  createContact,
  createContacts,
  getMemberOfC,
  getContact,
  getSearchResults,
  getContactsByEmployeeAndStatus,
  generateReport,
  editOpportunity,
  editProspective,
  editContact,
  deleteContact,
  getLeads,
  convertLead,
  restoreContacts,
  getDeletedContacts,
  sendContactSMS,
  sendEmail,
  getSMS,
  getEmail,
  getCampaignContacts,
  exportContacts,
  getContactByProposal,
  getContactByInvoice
};
