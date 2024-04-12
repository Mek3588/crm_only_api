const Customer = require("../../../models/customer/Customer");
const {
  isPhoneNoValid,
  getFileExtension,
  isEmailValid,
} = require("../../../utils/GeneralUtils");
const { Op } = require("sequelize");
const Address = require("../../../models/Address");
const PhoneNo = require("../../../models/PhoneNo");
const SMSMessage = require("../../../models/SMS");
// const CustomerDepartment = require("../../../models/customer/CustomerDepartment");
const Employee = require("../../../models/Employee");
const Department = require("../../../models/Department");
const Email = require("../../../models/EmailModel");
const CustomerEmails = require("../../../models/customer/CustomerEmail");
const CustomerSms = require("../../../models/customer/CustomerSMS");
const { sendNewSms } = require("../SMSServiceHandler");
const { sendNewEmail } = require("../EmailServiceHandler");
const User = require("../../../models/acl/user");
const Emailcc = require("../../../models/EmailCc");
const Document = require("../../../models/Document");
const EmailDocument = require("../../../models/EmailDocument");
const Quotation = require("../../../models/Quotation");

const {
  Role,
  account_stage,
  financeStatus,
  policyStatus,
} = require("../../../utils/constants");

const sequelize = require("../../../database/connections");
const Contact = require("../../../models/Contact");
const MotorProposal = require("../../../models/proposals/MotorProposal");
const Branch = require("../../../models/Branch");
const SharedAccounts = require("../../../models/SharedAccounts");
const Policy = require("../../../models/Policy");
const Proposal = require("../../../models/proposals/Proposal");
const EndorsementFilesPath = require("../../../models/endorsement/EndorsementFilesPath");
const Opportunity = require("../../../models/Opportunity");
const Addons = require("../../../models/motor/Addons");
// const excelTemplate = require('../../uploads/zemen_customers_excel_template.xlsx');

const getSearch = (st) => {
  return {
    [Op.or]: [
      { "$contact.firstName$": { [Op.like]: `%${st}%` } },
      { "$contact.middleName$": { [Op.like]: `%${st}%` } },
      { "$contact.lastName$": { [Op.like]: `%${st}%` } },
      { "$contact.primaryEmail$": { [Op.like]: `%${st}%` } },
      { "$contact.primaryPhone$": { [Op.like]: `%${st}%` } },
      { "$contact.secondaryEmail$": { [Op.like]: `%${st}%` } },
      { "$contact.secondaryPhone$": { [Op.like]: `%${st}%` } },
      { "$contact.type$": { [Op.like]: `%${st}%` } },
      { "$contact.joinIndividualName$": { [Op.like]: `%${st}%` } },
      // {
      //   "$contact.motor_proposals$": {
      //     [Op.like]: `%${st}%`,
      //   },
      // },
      // { "$contact.firstName$": { [Op.like]: `%${st}%` } },
    ],
  };
};

const getCustomer = async (req, res) => {
  const { f, r, st, sc, sd } = req.query;
  try {
    let data;
    const currentUser = req.user;

    if (!currentUser) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    if (req.type === "all") {
      data = await Customer.findAndCountAll({
        include: [
          { model: Contact }, // attributes: [] }, // Include Contact table without selecting any attributes
        ],
        where: getSearch(st),
        offset: Number(f),
        limit: Number(r),
        order: [[sc || "createdAt", sd == 1 ? "DESC" : "ASC"]],
      });
    } else {
      let includeOptions = [{ model: Contact }]; //, attributes: [] }];
      if (req.type === "self" || req.type === "branchAndSelf") {
        includeOptions.push({ model: User });
      }

      data = await Customer.findAndCountAll({
        include: includeOptions,
        where: {
          [Op.and]: [
            getSearch(st),
            req.type === "self" && { userId: currentUser.id },
            req.type !== "all" &&
              currentUser.employee && {
                "$user.employee.branchId$": currentUser.employee.branchId,
              },
          ].filter(Boolean),
        },
        offset: Number(f),
        limit: Number(r),
        order: [[sc || "createdAt", sd == 1 ? "DESC" : "ASC"]],
      });
      data["count"] = data.count;
      data["rows"] = data.rows.map((_contact) => _contact.contact);
    }

    if (data) {
      res.status(200).json({
        count: data.count,
        rows: data.rows.map((customer) => customer.contact),
      });
    } else {
      res.status(404).json({ message: "No customers found" });
    }
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const getAllCustomers = async (req, res) => {
  try {
    let data;
    if (req.type === "all") {
      data = await Customer.findAll({
        include: [
          { model: User },
          { model: Policy },
          {
            model: Contact,
            include: [
              Branch,
              { model: User, as: "shares" },
              { model: User, as: "assignedUser" },
            ],
          },
        ],
      });
    } else if (req.type === "self") {
      const user = await User.findByPk(req.user.id, { include: [Employee] });
      data = await Customer.findAll({
        include: [
          User,
          {
            model: Contact,
            include: [
              Branch,
              { model: User, as: "shares" },
              { model: User, as: "assignedUser" },
            ],
          },
        ],
        where: {
          [Op.or]: [
            { userId: { [Op.like]: `%${req.user.id}%` } },
            { "$employee.userId$": { [Op.like]: `%${req.user.id}%` } },
            user.employee && {
              "$departments.id$": {
                [Op.like]: `%${user.employee.departmentId}%`,
              },
            },
          ],
        },
      });
    } else if (req.type === "branch" && req.user.employee) {
      data = await Customer.findAll({
        include: [
          User,
          {
            model: Contact,
            include: [
              Branch,
              { model: User, as: "shares" },
              { model: User, as: "assignedUser" },
            ],
          },
        ],
        where: req.user.employee.branchId
          ? {
              "$user.employee.branchId$": {
                [Op.like]: `%${req.user.employee.branchId}%`,
              },
            }
          : { id: null },
      });
    }
    const allContacts = data.flatMap((customer) => customer.contact);
    //console.log("data",allContacts)

    res.status(200).json(allContacts);
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};

const createCustomer = async (req, res) => {
  const customerBody = req.body;

  try {
    const customerFound = await Contact.findOne({
      where: {
        [Op.or]: [
          { primaryEmail: customerBody.primaryEmail },
          { primaryPhone: customerBody.primaryPhone },
        ],
      },
    });

    if (customerFound) {
      return res.status(400).json({ msg: "Customer already exists" });
    }

    let createdCustomer;
    let newContact;

    if (!req.file) {
      const { profilePicture, ...contactData } = customerBody;

      newContact = await Contact.create(contactData);

      customerBody.contactId = newContact.id;
    } else {
      customerBody.profilePicture = "/uploads/" + req.file.filename;
    }

    createdCustomer = await Customer.create(customerBody, {
      include: [Contact],
    });

    const data = await Customer.findByPk(createdCustomer.id, {
      include: [Contact],
    });

    console.log("Data", data);

    return res.status(200).json(data);
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};

const addPhoneNumber = async (req, res) => {
  try {
    const customer = await CustomerPhone.create(req.body);
    res.status(200).json(customer);
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};

const handleActivation = async (req, res) => {
  try {
    // const user = await User.findByPk(req.params.id)
    // const customer = await User.update(
    //   { activated: !user.activated },
    //   { where: { id: req.params.id } }
    // )

    if (!(await canUserCreate(req.user, "customers"))) {
      //console.log("------------------------", await canUserRead(req.user, "customer"))
      return res.status(400).json({ msg: "unauthorized access!" });
    }
    const sh = await Customer.findByPk(req.params.id);
    const customer = await Customer.update(
      { active: !sh.active },
      { where: { id: req.params.id } }
    );
    res.status(200).json(customer);
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};

const createCustomers = async (req, res) => {
  const customers = req.body;
  let addedList = [];
  let duplicates = [];
  let missingFields = [];
  let missingIndexes = [];
  let duplicateIndexes = [];

  try {
    await sequelize.transaction(async (t) => { 
      for (let i = 0; i < customers.length; i++) {
        const customer = customers[i];
        const missing = [];

        if (!customer.primaryPhone) {
          missing.push('primaryPhone');
        }
        if (!customer.primaryEmail) {
          missing.push('primaryEmail');
        }
        if (!customer.firstName) {
          missing.push('firstName');
        }
        if (!customer.middleName) {
          missing.push('middleName');
        }
        if (!customer.lastName) {
          missing.push('lastName');
        }
        if (!customer.type) {
          missing.push('type');
        }
        if (!customer.branchId) {
          missing.push('branchId');
        }
        if (!customer.assignedTo) {
          missing.push('assignedTo');
        }
        if (!customer.country) {
          missing.push('country');
        }

        if (missing.length > 0) {
          missingFields.push({ customer, missing });
          missingIndexes.push(i);
          continue;
        }

        const existingCustomer = await Contact.findOne({
          where: {
            [Op.or]: [
              { primaryPhone: customer.primaryPhone },
              { primaryEmail: customer.primaryEmail }
            ]
          }
        });

        if (!existingCustomer) {
          customer.userId = req.user.id;
          customer.active = true;
          customer.deleted = false;

          const addedContact = await Contact.create(customer, { transaction: t });
          customer.contactId = addedContact.id;
          
          const newCustomer = await Customer.create(customer, { transaction: t });
          addedList.push(newCustomer);
        } else {
          duplicates.push(customer);
          duplicateIndexes.push(i);
        }
      }
    });

    const responseMsg = `${addedList.length} customers added, ${duplicates.length} duplicates found, and ${missingFields.length} customers have missing fields.`;
    if(duplicates.length === customers.length || addedList.length === 0){
      return res.status(400).json({
        msg:"Error while registering a customer,please provide correct data!"
      })
    }else{
    return res.status(200).json({
      msg: responseMsg,
      addedList,
      duplicates,
      missingFields
    });
  }
  } catch (error) {
    console.error(error.message);
    res.status(400).json({ msg: error.message });
  }
};

const getCustomerByPk = async (req, res) => {
  try {
    const contact = await Contact.findByPk(req.params.id, {
      include: [
        {
          model: Proposal,
          include: [
            {
              model: Policy,
              where: {
                [Op.and]: [
                  { financeStatus: financeStatus.final },
                  { policyStatus: policyStatus.final },
                ],
              },
            },
            // { model: MotorProposal, include: [{ model: Quotation, include: [Addons] }] }
          ],
        },
        // Opportunity,
        // Opportunity,
        Branch,
      ],
    });

    return res.status(200).json(contact);
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};

const getCustomerRep = async (req, res) => {
  let {
    country,
    city,
    region,
    subcity,
    active,
    customer_budgets,
    employeeId,
    departments,
    employees,
    name,
    activeReport,
  } = req.body;
  const { f, r, st, sc, sd } = req.query;
  try {
    let data;
    //console.log("----------", r)
    data = await Customer.findAndCountAll({
      where: {
        [Op.and]: [
          country.length != 0 && { country: { [Op.in]: country } },
          region.length != 0 && { region: { [Op.in]: region } },
          city.length != 0 && { city: { [Op.in]: city } },
          subcity.length != 0 && { subcity: { [Op.in]: subcity } },
          employees.length != 0 && { "$employee.id$": employees },
          departments.length != 0 && {
            "$departments.id$": { [Op.in]: departments },
          },
          name && {
            name: {
              [Op.in]: name.split(",").map((e) => {
                return e.trim();
              }),
            },
          },
          customer_budgets.budgetYear &&
            sequelize.where(sequelize.col("customer_budget.budgetYear"), {
              [Op.in]: customer_budgets.budgetYear.split(",").map((e) => {
                return e.trim();
              }),
            }),
          customer_budgets.annualPlan &&
            sequelize.where(sequelize.col("customer_budget.annualPlan"), {
              [Op.in]: customer_budgets.annualPlan.split(",").map((e) => {
                return e.trim();
              }),
            }),
          customer_budgets.annualProduction &&
            sequelize.where(sequelize.col("customer_budget.annualProduction"), {
              [Op.in]: customer_budgets.annualProduction.split(",").map((e) => {
                return e.trim();
              }),
            }),
          customer_budgets.semiAnnualGrossWrittenPremium &&
            sequelize.where(
              sequelize.col("customer_budget.semiAnnualGrossWrittenPremium"),
              {
                [Op.in]: customer_budgets.semiAnnualGrossWrittenPremium
                  .split(",")
                  .map((e) => {
                    return e.trim();
                  }),
              }
            ),
          customer_budgets.growth &&
            sequelize.where(sequelize.col("customer_budget.growth"), {
              [Op.in]: customer_budgets.growth.split(",").map((e) => {
                return e.trim();
              }),
            }),
          activeReport.length != 0 && { active: { [Op.in]: activeReport } },

          customer_budgets.rank &&
            sequelize.where(sequelize.col("customer_budget.rank"), {
              [Op.in]: customer_budgets.rank.split(",").map((e) => {
                return e.trim();
              }),
            }),
        ],
      },
      include: [
        User,
        {
          model: Contact,
          include: [
            Branch,
            {
              model: User,
              as: "shares",
            },
            {
              model: User,
              as: "assignedUser",
            },
          ],
        },
      ],
      subQuery: false,
      offset: Number(f),
      limit: Number(r),
      order: [[sc || "name", sd == 1 ? "ASC" : "DESC"]],
      // raw: true,

      distinct: true,
    });
    //console.log("-----------resp", data)
    //console.log("-----------resp", data.rows.length)

    res.status(200).json(data);
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
    customer_budgets,
    employeeId,
    departments,
    employees,
    name,
    activeReport,
  } = req.body;
  try {
    // city =  JSON.parse("[" + city + "]");
    let customer;
    if (
      (country.length != 0) |
      (city != null) |
      (region.lenght != 0) |
      (subcity != null)
    ) {
      customer = await Customer.findAll({
        include: [CustomerBudget, Department, Employee, User],
        where: {
          // city: [city]
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
            employees.length != 0 && { "$employee.id$": employees },
            departments.length != 0 && {
              "$departments.id$": { [Op.in]: departments },
            },
            customer_budgets.budgetYear && {
              "$customer_budget.budgetYear$": customer_budgets.budgetYear
                .split(",")
                .map((e) => {
                  return e.trim();
                }),
            },
            activeReport.length != 0 && { active: { [Op.in]: activeReport } },
            customer_budgets.annualPlan && {
              "$customer_budget.annualPlan$": customer_budgets.annualPlan
                .split(",")
                .map((e) => {
                  return e.trim();
                }),
            },
            customer_budgets.annualProduction && {
              "$customer_budget.annualProduction$":
                customer_budgets.annualProduction.split(",").map((e) => {
                  return e.trim();
                }),
            },
            //   customer_budgets.semiAnnualGrossWrittenPremium   &&  {"$customer_budget.semiAnnualGrossWrittenPremium$" : customer_budgets.semiAnnualGrossWrittenPremium},
            customer_budgets.marketShare && {
              "$customer_budget.marketShare$": customer_budgets.marketShare
                .split(",")
                .map((e) => {
                  return e.trim();
                }),
            },
            customer_budgets.growth && {
              "$customer_budget.growth$": customer_budgets.growth
                .split(",")
                .map((e) => {
                  return e.trim();
                }),
            },
            customer_budgets.rank && {
              "$customer_budget.rank$": customer_budgets.rank
                .split(",")
                .map((e) => {
                  return e.trim();
                }),
            },
          ],
        },
      });
    } else {
      customer = await Customer.findAndCountAll({
        offset: Number(f),
        limit: Number(r),
      });
    }
    //console.log("customer")
    res.status(200).json(customer);
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};

const getExcelTemplate = async (req, res) => {
  const fileName = "zemen_customers_excel_template.xlsx";
  const fileURL = "../../templates/zemen_customers_excel_template.xlsx";
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

const editCustomer = async (req, res) => {
  const customer = req.body;
  try {
    const customerFound = await Customer.findOne({
      where: {
        contactId: customer.id,
      },
    });

    customer.userId = req.user.id;
    if (customerFound) {
      const updated_customer = await Contact.update(customer, {
        where: { id: customer.id },
      });
      res.status(200).json(updated_customer);
    } else {
      res.status(400).json({ msg: "No data found" });
    }
  } catch (error) {
    //console.log("--error--", error)
    res.status(400).json({ msg: error.message });
  }
};

const deleteCustomer = async (req, res) => {
  const id = req.params.id;

  try {
    Customer.destroy({ where: { id: id } });

    res.status(200).json({ id });
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};

const sendEmail = async (req, res) => {
  try {

    let body = JSON.parse(JSON.stringify(req.body));
  
    if (!body.customers || !body.subject || !body.message) {
      return res.status(400).json({ message: "Invalid request data" });
    }

    const customers = await Customer.findAll({
      include: Contact,
      where: { contactId: { [Op.in]: body.customers } }
    });

    if (customers.length === 0) {
      return res.status(400).json({ message: "Customers not found" });
    }

    // Process email attachments
    let documents = [];
    if (body.documents && body.documents.length > 0) {
      documents = await Document.findAll({
        attributes: ["name", "document"],
        where: {
          id: {
            [Op.in]: body.documents,
          },
        },
      });

      documents.forEach((doc) => {
        const ext = getFileExtension(doc.document);
        doc.name = `${doc.name}.${ext}`;
      });
    }
    const sendTo = [];
    if (customers.length > 0) {
      customers.forEach((customer) => {
        if (body.emailType.includes("primaryEmail") && customer.contact.primaryEmail) {
          sendTo.push(customer.contact.primaryEmail);
        }
        if (body.emailType.includes("secondaryPhone") && customer.contact.secondaryEmail) {
          sendTo.push(customer.contact.secondaryEmail);
        }
      });
    }
   
    // Prepare email CCs
    let emailCCs = [];
    if (body.emailccs) {
      const splitData = body.emailccs.trim().split(",");
      emailCCs = splitData.filter((email) => email);
    }

    // Prepare new email object
    const newEmail = {
      userId: Number(body.customers[0]),
      subject: body.subject,
      message: body.message,
      emailccs: emailCCs,
      documents: documents,
    };
 
    // Send email
    const from = req.user ? req.user.email : "";
    const sentEmailCount = await sendNewEmail(
      sendTo,
      emailCCs,
      body.subject,
      body.message,
      documents,
      from
    );
    console.log("sent email",sentEmailCount)

    // Handle email sending result
    if (sentEmailCount >= 1) {
      const email = await Email.create(newEmail);

      await email.addCustomers(customers);
      if (body.documents) {
        await email.addDocuments(body.documents, { through: EmailDocument });
      }
      return res.status(200).json(email);
    } else {
      return res.status(400).json({ msg: "Error in sending email" });
    }
  } catch (error) {
    console.error("Error sending email:", error);
    return res.status(400).json({ msg: "Failed to send email" });
  }
};
const sendSMS = async (req, res) => {
  const body = req.body;
  try {
    const customers = await Customer.findAll({
      include: Contact,
      where: { contactId: { [Op.in]: body.customers } }
    });

    const sendTo = [];
    if (customers.length > 0) {
      customers.forEach((customer) => {
        if (body.phoneType.includes("primaryPhone") && customer.contact.primaryPhone) {
          sendTo.push(customer.contact.primaryPhone);
        }
        if (body.phoneType.includes("secondaryPhone") && customer.contact.secondaryPhone) {
          sendTo.push(customer.contact.secondaryPhone);
        }
      });
      console.log("sendTo",sendTo)
    
      if (sendTo.length > 0) {
        const sent = await sendNewSms(sendTo, body.content);
        if (sent.status === 200) {
          const sms = await SMSMessage.create(body);
          await sms.addCustomers(customers, { through: CustomerSms });
          return res.status(200).json(sms);
        } else {
          return res.status(400).json({ msg: "SMS not sent" });
        }
      } else {
        return res.status(400).json({ msg: "Phone numbers cannot be empty" });
      }
    } else {
      return res.status(400).json({ msg: "Customers not found" });
    }
  } catch (error) {
    return res.status(400).json({ msg: error.message });
  }
}

const getEmail = async (req, res) => {
  const body = req.params.id;

  try {
    const { f, r, st, sc, sd } = req.query;

    // Check if f and r are undefined or non-numeric strings
    const offset = f !== undefined && !isNaN(Number(f)) ? Number(f) : 0;
    const limit = r !== undefined && !isNaN(Number(r)) ? Number(r) : 7;

    const email = await Email.findAndCountAll({
      include: [
        {
          model: User,
          attributes: [
            "id",
            "corporate_name",
            "first_name",
            "middle_name",
            "last_name",
            "email",
            "phone",
            "gender",
          ],
        },
        Customer,
      ],
      // where: { "$customers.contactId$": { [Op.like]: body } },
      where: {
        "$customers.contactId$": {
          [Op.like]: `%${body}%`, // Using '%' as wildcard characters for 'like' operator
        },
      },
      offset: offset,
      limit: limit,
      order: [[sc || "createdAt", sd == 1 ? "DESC" : "ASC"]],
      subQuery: false,
    });
    //console.log("email List", JSON.stringify(email))
    res.status(200).json(email);
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};

const getSMS = async (req, res) => {
  const body = req.params.id;
  try {
    const { f, r, st, sc, sd } = req.query;
    const sms = await SMSMessage.findAndCountAll({
      include: [
        {
          model: User,
          attributes: [
            "id",
            "corporate_name",
            "first_name",
            "middle_name",
            "last_name",
            "email",
            "phone",
            "gender",
          ],
        },
        Customer,
      ],
      where: { "$customers.contactId$": { [Op.like]: body } },
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

module.exports = {
  getCustomer,
  getExcelTemplate,
  createCustomer,
  createCustomers,
  getCustomerByPk,
  getReports,
  editCustomer,
  deleteCustomer,
  handleActivation,
  addPhoneNumber,
  sendEmail,
  sendSMS,
  getEmail,
  getSMS,
  getAllCustomers,
  getCustomerRep,
};
