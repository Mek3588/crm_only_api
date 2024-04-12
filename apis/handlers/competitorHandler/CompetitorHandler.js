const Competitor = require("../../../models/competitor/Competitors");
const {
  isPhoneNoValid,
  getFileExtension,
  isEmailValid,
  createEventLog,
  getIpAddress,
  getChangedFieldValues,
  convertFlattenedToNested,
} = require("../../../utils/GeneralUtils");
const { Op } = require("sequelize");
const Address = require("../../../models/Address");
const PhoneNo = require("../../../models/PhoneNo");
const SMSMessage = require("../../../models/SMS");
const CompetitorDepartment = require("../../../models/competitor/CompetitorDepartment");
const Employee = require("../../../models/Employee");
const Department = require("../../../models/Department");
const Email = require("../../../models/EmailModel");
const CompetitorEmails = require("../../../models/competitor/CompetitorEmail");
const CompetitorSms = require("../../../models/competitor/CompetitorSMS");
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
const CompetitorBudget = require("../../../models/competitor/CompetitorBudget");
const sequelize = require("../../../database/connections");
const { canUserRead, canUserCreate } = require("../../../utils/Authrizations");
// const excelTemplate = require('../../uploads/zemen_competitors_excel_template.xlsx');

const getSearch = (st) => {
  return {
    [Op.or]: [
      { name: { [Op.like]: `%${st}%` } },
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

const getCompetitor = async (req, res) => {
  const { f, r, st, sc, sd } = req.query;

  try {
    let data;
    const currentUser = req.user;
    if (req.type == "all") {
      data = await Competitor.findAndCountAll({
        include: [{
          model: User, attributes: ['id', 'corporate_name', 'first_name', 'middle_name', 'last_name', 'email', 'phone', 'gender']
        }, Employee, Department],
        offset: Number(f),
        limit: Number(r),
        order: [[sc || "name", sd == 1 ? "ASC" : "DESC"]],
        where: getSearch(st),
        subQuery: false,
      });
    } else if (req.type == "self") {
      
      const user = await User.findByPk(currentUser.id, {
        include: [Employee],
      });
      data = await Competitor.findAndCountAll({
        include: [{
          model: User, attributes: ['id', 'corporate_name', 'first_name', 'middle_name', 'last_name', 'email', 'phone', 'gender']
        }, Employee, Department],
        offset: Number(f),
        limit: Number(r),
        order: [[sc || "name", sd == 1 ? "ASC" : "DESC"]],
        subQuery: false,

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
                //  { "$departments.id$": { [Op.like]: "$user.employee.departmentId$"} },
              ],
            },
            getSearch(st),
          ],
        },
      });
    } else if (req.type == "branch") {
      // const user = await User.findByPk(curretnUser.id, { include: [Employee] })
      data = await Competitor.findAndCountAll({
        include: [{
          model: User, attributes: {
            exclude: ['password', 'shortCodeExpirationDate',
              'createdAt', 'updatedAt', 'userId', 'shortCode', 'activation', 'activated', 'role'
            ]
          },
          include: [Employee]
        }, Employee, Department],
        offset: Number(f),
        limit: Number(r),
        order: [[sc || "name", sd == 1 ? "ASC" : "DESC"]],
        subQuery: false,

        where: {
          [Op.and]: [
            currentUser.employee
              ? {
                "$user.employee.branchId$": {
                  [Op.like]: `%${currentUser.employee.branchId}%`,
                },
              }
              : {
                id: null,
              },
            getSearch(st),
          ],
        },
      });
    } else if (req.type == "branchAndSelf") {
      const user = await User.findByPk(currentUser.id, {
        include: [Employee],
      });
      data = await Competitor.findAndCountAll({
        include: [{ model: User, attributes: ['id', 'corporate_name', 'first_name', 'middle_name', 'last_name', 'email', 'phone', 'gender'], }, Employee, Department],
        offset: Number(f),
        limit: Number(r),
        order: [[sc || "name", sd == 1 ? "ASC" : "DESC"]],
        subQuery: false,
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
                currentUser.employee
                  ? {
                    "$user.employee.branchId$": {
                      [Op.like]: `%${currentUser.employee.branchId}%`,
                    },
                  }
                  : {
                    id: null,
                  },

                //  { "$departments.id$": { [Op.like]: "$user.employee.departmentId$"} },
              ],
            },
            getSearch(st),
          ],
        },
      });
    }
    res.status(200).json(data);
  } catch (error) {
    
    res.status(400).json({ msg: error.message });
  }
};

const getAllCompetitors = async (req, res) => {
  const currentUser = req.user;
  try {
    if (req.type == "all") {
      const data = await Competitor.findAll({
        include: [{ model: User, attributes: ['id', 'corporate_name', 'first_name', 'middle_name', 'last_name', 'email', 'phone', 'gender'], }],
      });
      res.status(200).json(data);
    } else if (req.type == "self") {
      const user = await User.findByPk(currentUser.id, { include: [Employee] });
      const data = await Competitor.findAll({
        include: [{ model: User, attributes: ['id', 'corporate_name', 'first_name', 'middle_name', 'last_name', 'email', 'phone', 'gender'], }, Employee, Department],
        where: {
          [Op.or]: [
            { userId: { [Op.like]: `%${currentUser.id}%` } },
            { "$employee.userId$": { [Op.like]: `%${currentUser.id}%` } },
            user.employee && {
              "$departments.id$": {
                [Op.like]: `%${user.employee.departmentId}%`,
              },
            },
            //  { "$departments.id$": { [Op.like]: "$user.employee.departmentId$"} },
          ],
        },
      });

      res.status(200).json(data);

    } else if (req.type == "branch" && currentUser.employee) {
      const data = await Competitor.findAll({
        include: [{
          model: User, attributes: {
            exclude: ['password', 'shortCodeExpirationDate',
              'createdAt', 'updatedAt', 'userId', 'shortCode', 'activation', 'activated', 'role'
            ]
          }, include: [Employee]
        }, Employee, Department],
        where: currentUser.employee.branchId
          ? {
            "$user.employee.branchId$": {
              [Op.like]: `%${currentUser.employee.branchId}%`,
            },
          }
          : {
            id: null,
          },
      });
      res.status(200).json(data);
    }
  } catch (error) {
    
    res.status(400).json({ msg: error.message });
  }
};

//posting
const createCompetitor = async (req, res) => {
  // const competitorBody = req.body;
  // const primaryEmail = req.body.primaryEmail;
  let competitorBody = convertFlattenedToNested(req.body);
  try {
    const primaryEmail = competitorBody.primaryEmail;
    const competitorFound = await Competitor.findOne({
      where: {
        [Op.or]: [
          { primaryEmail: { [Op.like]: primaryEmail } },
          { primaryPhone: { [Op.like]: req.body.primaryPhone } },
        ],
      },
    });

    if (competitorFound === null) {
      if (req.file == null) {
        // const { profilePicture, ...others } = competitorBody;
        const data = await Competitor.create(competitorBody)
        
        await data.addDepartments(competitorBody.departments, {
          through: CompetitorDepartment,
        });
        let ipAddress = getIpAddress(req.ip);
        const eventLog = createEventLog(
          req.user.id,
          eventResourceTypes.competitor,
          data.name,
          data.id,
          eventActions.create,
          "",
          ipAddress
        );


        res.status(200).json(data);
      } else {
        competitorBody.profilePicture = "/uploads/" + req.file.filename;
        const data = await Competitor.create(competitorBody)
        await data.addDepartments(competitorBody.departments, {
          through: CompetitorDepartment,
        });
        let ipAddress = getIpAddress(req.ip);
        const eventLog = createEventLog(
          req.user.id,
          eventResourceTypes.competitor,
          data.name,
          data.id,
          eventActions.create,
          "",
          ipAddress
        );


        res.status(200).json(data);
      }
    } else if (competitorFound) {
      return res.status(404).json({ msg: "Competitor exists" });
    }
  } catch (error) {
    // 
    res.status(400).json({ msg: error.message });
  }
};

const addPhoneNumber = async (req, res) => {
  try {
    const competitor = await CompetitorPhone.create(req.body);
    res.status(200).json(competitor);
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};

const handleActivation = async (req, res) => {
  try {
    // const user = await User.findByPk(req.params.id)
    // const competitor = await User.update(
    //   { activated: !user.activated },
    //   { where: { id: req.params.id } }
    // )

    // const sh = await Competitor.findByPk(req.params.id);
    // if (!(await canUserCreate(req.user, "competitors"))) {
    //   
    //   return res.status(400).json({ msg: "unauthorized access!" });
    // }
    const sh = await Competitor.findByPk(req.params.id);
    const competitor = await Competitor.update(
      { active: !sh.active },
      { where: { id: req.params.id } }
    );
    res.status(200).json(competitor);
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};

const createCompetitors = async (req, res) => {
  const competitors = req.body;
  var addedList = 0;
  var duplicate = [];
  var incorrect = [];
  var lineNumber = 1;

  try {
    let promises = await competitors.map(async (competitor) => {
      let addedCompetitors = await Competitor.findOne({
        where: {
          [Op.or]: [
            { primaryEmail: { [Op.like]: competitor.primaryEmail } },
            { primaryPhone: { [Op.like]: competitor.primaryPhone } },
          ],
        },
      }).then(async (addedCompetitors) => {
        lineNumber = lineNumber + 1;

        if (
          isPhoneNoValid(competitor.primaryPhone) &&
          isEmailValid(competitor.primaryEmail)
        ) {
          if (addedCompetitors == null) {
            competitor.userId = req.user.id;
            competitor.active = true;
            try {
              let newCompetitor = await Competitor.create(competitor).then(
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
          incorrect.push(lineNumber);
        }
      })

    });
    Promise.all(promises).then(function (results) {
      let msg = "";
      if (addedList != 0) {
        
        msg = msg + `${addedList} competitors added`;
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

const getCompetitorByPk = async (req, res) => {
  try {
    const competitor = await Competitor.findByPk(req.params.id, {
      include: [{ model: User, attributes: ['id', 'corporate_name', 'first_name', 'middle_name', 'last_name', 'email', 'phone', 'gender'], }, Employee, Department],
    }).then(async (competitor) => {
      if (!competitor) {
        res.status(400).json({ message: "No Data Found" });
      } else {
        

        let ipAddress = await getIpAddress(req.ip);
        
        
        const eventLog = await createEventLog(
          req.user.id,
          eventResourceTypes.competitor,
          competitor.name,
          competitor.id,
          eventActions.view,
          "",
          ipAddress
        );
        res.status(200).json(competitor);
      }
    });
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};

const getCompetitorRep = async (req, res) => {
  let {
    country,
    city,
    region,
    subcity,
    active,
    competitor_budgets,
    employeeId,
    departments,
    employees,
    name,
    activeReport,
  } = req.body;
  const { f, r, st, sc, sd } = req.query;
  try {
    let data;
    
    data = await Competitor.findAndCountAll({
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
          competitor_budgets.budgetYear &&
          sequelize.where(sequelize.col("competitor_budget.budgetYear"), {
            [Op.in]: competitor_budgets.budgetYear.split(",").map((e) => {
              return e.trim();
            }),
          }),
          competitor_budgets.annualPlan &&
          sequelize.where(sequelize.col("competitor_budget.annualPlan"), {
            [Op.in]: competitor_budgets.annualPlan.split(",").map((e) => {
              return e.trim();
            }),
          }),
          competitor_budgets.annualProduction &&
          sequelize.where(
            sequelize.col("competitor_budget.annualProduction"),
            {
              [Op.in]: competitor_budgets.annualProduction
                .split(",")
                .map((e) => {
                  return e.trim();
                }),
            }
          ),
          competitor_budgets.semiAnnualGrossWrittenPremium &&
          sequelize.where(
            sequelize.col("competitor_budget.semiAnnualGrossWrittenPremium"),
            {
              [Op.in]: competitor_budgets.semiAnnualGrossWrittenPremium
                .split(",")
                .map((e) => {
                  return e.trim();
                }),
            }
          ),
          competitor_budgets.growth &&
          sequelize.where(sequelize.col("competitor_budget.growth"), {
            [Op.in]: competitor_budgets.growth.split(",").map((e) => {
              return e.trim();
            }),
          }),
          activeReport.length != 0 && { active: { [Op.in]: activeReport } },

          competitor_budgets.rank &&
          sequelize.where(sequelize.col("competitor_budget.rank"), {
            [Op.in]: competitor_budgets.rank.split(",").map((e) => {
              return e.trim();
            }),
          }),
        ],
      },
      include: [{ model: User, attributes: ['id', 'corporate_name', 'first_name', 'middle_name', 'last_name', 'email', 'phone', 'gender'], }, Employee, Department, CompetitorBudget],
      subQuery: false,
      offset: Number(f),
      limit: Number(r),
      order: [[sc || "name", sd == 1 ? "ASC" : "DESC"]],
      // raw: true,

      distinct: true,
    });
    
    

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
    competitor_budgets,
    employeeId,
    departments,
    employees,
    name,
    activeReport,
  } = req.body;
  try {
    // city =  JSON.parse("[" + city + "]");
    let competitor;
    if (
      (country.length != 0) |
      (city != null) |
      (region.lenght != 0) |
      (subcity != null)
    ) {
      competitor = await Competitor.findAll({
        include: [CompetitorBudget, Department, Employee, { model: User, attributes: ['id', 'corporate_name', 'first_name', 'middle_name', 'last_name', 'email', 'phone', 'gender'], }],
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
            competitor_budgets.budgetYear && {
              "$competitor_budget.budgetYear$": competitor_budgets.budgetYear
                .split(",")
                .map((e) => {
                  return e.trim();
                }),
            },
            activeReport.length != 0 && { active: { [Op.in]: activeReport } },
            competitor_budgets.annualPlan && {
              "$competitor_budget.annualPlan$": competitor_budgets.annualPlan
                .split(",")
                .map((e) => {
                  return e.trim();
                }),
            },
            competitor_budgets.annualProduction && {
              "$competitor_budget.annualProduction$":
                competitor_budgets.annualProduction.split(",").map((e) => {
                  return e.trim();
                }),
            },
            //   competitor_budgets.semiAnnualGrossWrittenPremium   &&  {"$competitor_budget.semiAnnualGrossWrittenPremium$" : competitor_budgets.semiAnnualGrossWrittenPremium},
            competitor_budgets.marketShare && {
              "$competitor_budget.marketShare$": competitor_budgets.marketShare
                .split(",")
                .map((e) => {
                  return e.trim();
                }),
            },
            competitor_budgets.growth && {
              "$competitor_budget.growth$": competitor_budgets.growth
                .split(",")
                .map((e) => {
                  return e.trim();
                }),
            },
            competitor_budgets.rank && {
              "$competitor_budget.rank$": competitor_budgets.rank
                .split(",")
                .map((e) => {
                  return e.trim();
                }),
            },
          ],
        },
      });
    } else {
      competitor = await Competitor.findAndCountAll({
        offset: Number(f),
        limit: Number(r),
      });
    }
    res.status(200).json(competitor);
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};

const getExcelTemplate = async (req, res) => {
  const fileName = "zemen_competitors_excel_template.xlsx";
  const fileURL = "../../templates/zemen_competitors_excel_template.xlsx";
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

const editCompetitor = async (req, res) => {
  // const competitor = req.body;
  // const id = competitor.id;
  let competitorBody = convertFlattenedToNested(req.body);
  const id = competitorBody.id;
  try {
    const competitorFound = await Competitor.findByPk(id);
    // 

    if (competitorFound) {
      competitorBody.employeeId =
        competitorBody.employeeId = competitorBody.employeeId == "null" ? 0 : competitorBody.employeeId;

      if (req.file == null) {
        const { profilePicture, ...others } = competitorBody;
        await Competitor.update(others, {
          where: { id: id },
        }).then((competitor) => {
          if (competitorBody.departments != null &&
            competitorBody.departments != "null" &&
            competitorBody.departments != "" && competitor.departments && competitor.departments.length > 0)
            competitorFound.setDepartments(competitorBody.departments, {
              through: CompetitorDepartment,
            });
        });
        const newCompetitor = await Competitor.findByPk(id);
        const changedFieldValues = getChangedFieldValues(
          competitorFound,
          newCompetitor
        );
        let ipAddress = getIpAddress(req.ip);
        const eventLog = await createEventLog(
          req.user.id,
          eventResourceTypes.competitor,
          newCompetitor.name,
          newCompetitor.id,
          eventActions.edit,
          changedFieldValues,
          ipAddress
        );
        res.status(200).json({ id });
      } else {
        competitorBody.profilePicture = "/uploads/" + req.file.filename;
        await Competitor.update(competitorBody, {
          where: { id: competitorBody.id },
        }).then((competitor) => {
          if (competitorBody.departments != null ||
            competitorBody.departments != "null" ||
            competitorBody.departments != "")
            competitorFound.setDepartments(competitorBody.departments, {
              through: CompetitorDepartment,
            });
        });
        const newCompetitor = await Competitor.findByPk(id);
        const changedFieldValues = getChangedFieldValues(
          competitorFound,
          newCompetitor
        );
        let ipAddress = getIpAddress(req.ip);
        const eventLog = await createEventLog(
          req.user.id,
          eventResourceTypes.competitor,
          newCompetitor.name,
          newCompetitor.id,
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

const deleteCompetitor = async (req, res) => {
  const id = req.params.id;
  const t = await sequelize.transaction();


  try {
    const tobeDeletedCompetitor = await Competitor.findByPk(id);
    await Competitor.destroy({ where: { id: id } });
    const associatedDepartment = await CompetitorDepartment.findAll({
      where: { competitorId: id },
      transaction: t,
    });
    await Promise.all(
      associatedDepartment.map(async (department) => {
        await department.destroy({ transaction: t });
      })
    );

    let ipAddress = await getIpAddress(req.ip);
    const eventLog = await createEventLog(
      req.user.id,
      eventResourceTypes.competitor,
      tobeDeletedCompetitor.name,
      tobeDeletedCompetitor.id,
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
    const competitor = await Competitor.findAll({
      where: { id: { [Op.in]: [body.competitors] } },
    });
    if (competitor) {
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
      // /home/user/Documents/etech/CRM/crm_api/apis/handlers/competitorHandler/CompetitorHandler.js
      let newDocument = [];
      if (req.files.length != 0) {
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
      competitor.map((e) => {
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
      const competitors = body.competitors.map(Number);
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
                try {
                  email.addCompetitors(competitors, {
                    through: CompetitorEmails,
                  });
                  body.documents != null &&
                    email.addDocuments(body.documents, {
                      through: EmailDocument,
                    });
                } catch (error) {
                  
                }
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
    const competitor = await Competitor.findAll({
      where: { id: { [Op.in]: body.competitors } },
    });
    const sendTo = [];
    if (competitor) {
      competitor.map((e) => {
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
                sms.addCompetitors(body.competitors, {
                  through: CompetitorSms,
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
      include: [{ model: User, attributes: ['id', 'corporate_name', 'first_name', 'middle_name', 'last_name', 'email', 'phone', 'gender'], }, Competitor, Document, Emailcc],
      order: [["createdAt", "DESC"]],
      where: { "$competitors.id$": { [Op.like]: body } },
    });
    res.status(200).json({ rows: sms });
  } catch (error) {
    
    res.status(400).json({ msg: error.message });
  }
};
// const getSMS = async (req, res) => {
//   const body = req.params.id;
//   try {
//     const sms = await SMSMessage.findAll({
//       include: [{ model: User, attributes: ['id', 'corporate_name', 'first_name', 'middle_name', 'last_name', 'email', 'phone', 'gender'], }, Competitor],
//       order: [["createdAt", "DESC"]],
//       where: { "$competitors.id$": { [Op.like]: body } },
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
      include: [{ model: User, attributes: ['id', 'corporate_name', 'first_name', 'middle_name', 'last_name', 'email', 'phone', 'gender'] }, Competitor],
      where: { "$competitors.id$": { [Op.like]: body } },
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
  getCompetitor,
  getExcelTemplate,
  createCompetitor,
  createCompetitors,
  getCompetitorByPk,
  getReports,
  editCompetitor,
  deleteCompetitor,
  handleActivation,
  addPhoneNumber,
  sendEmail,
  sendSMS,
  getEmail,
  getSMS,
  getAllCompetitors,
  getCompetitorRep,
};
