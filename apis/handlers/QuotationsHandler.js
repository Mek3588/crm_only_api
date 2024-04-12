const { Op, json } = require("sequelize");
const { Role, MotorCoverType } = require("../../utils/constants");
const Quotation = require("../../models/Quotation");
const Opportunity = require("../../models/Opportunity");
const { isEmailValid, isPhoneNoValid } = require("../../utils/GeneralUtils");
const Contact = require("../../models/Contact");
const Employee = require("../../models/Employee");
const Department = require("../../models/Department");
const VehicleCategory = require("../../models/motor/VehicleCategory");
const CustomerInputMotor = require("../../models/motor/CustomerInputMotor");
const User = require("../../models/acl/user");
const Branch = require("../../models/Branch");
const Vehicle = require("../../models/motor/Vehicle");
const {
  saveODPremium,
  saveTPPremium,
  getComprehensivePremium,
  getODPremium,
  getTPPremium,
} = require("./motor/functions");
const {
  canUserRead,
  canUserCreate,
  canUserEdit,
  canUserDelete,
  canUserAccessOnlySelf,
  canUserAccessOnlyBranch,
} = require("../../utils/Authrizations");
const { calculateLimitedCovers } = require("./motor/CustomerInputMotorHandler");
const Addons = require("../../models/motor/Addons");
const CoverRate = require("../../models/CoverRate");
const TerritorialExtension = require("../../models/TerritorialExtension");
const ComprehnsicveTp = require("../../models/ComprehnsicveTp");
const Proposal = require("../../models/proposals/Proposal");
const MotorProposal = require("../../models/proposals/MotorProposal");
const LimitedCoverRate = require("../../models/motor/LimitedCoverRate");

const getSearch = (st) => {
  return {
    [Op.or]: [
      { quotation_number: { [Op.like]: `%${st}%` } },
      { request_type: { [Op.like]: `%${st}%` } },
      { coverType: { [Op.like]: `%${st}%` } },
      { owner_first_name: { [Op.like]: `%${st}%` } },
      { owner_phoneNo: { [Op.like]: `%${st}%` } },
      { vehicle_type: { [Op.like]: `%${st}` } },
      { purpose: { [Op.like]: `%${st}` } },
      { carrying_capacity: { [Op.like]: `%${st}` } },
      { cc: { [Op.like]: `%${st}` } },
      { has_trailer: { [Op.like]: `%${st}` } },
      { main_driver: { [Op.like]: `%${st}` } },
      { additional_driver: { [Op.like]: `%${st}` } },
      { driver_type: { [Op.like]: `%${st}` } },
      { is_named_driver: { [Op.like]: `%${st}` } },

    ],
  };
};



const getQuotations = async (req, res) => {
  
  const currentUser = await User.findByPk(req.user.id, {
    include: [Employee],
  });
  const { f, r, st, sc, sd } = req.query;
  const type = req.type;
  const role = req.user.role;

  try {
    switch (type) {
      case "all":
        const allData = await Quotation.findAndCountAll({
          offset: Number(f),
          limit: Number(r),
          order: [[sc || "updatedAt", sd == 1 ? "DESC" : "ASC"]],
          include: [
            { model: User, as: "user", attributes: ['id', 'corporate_name', 'first_name', 'middle_name', 'last_name', 'email', 'phone', 'gender']},
            
          ],
          where: getSearch(st)
        });

        res.status(200).json(allData);
        break;

      case "self":
        const selfData = await Quotation.findAndCountAll({
          offset: Number(f),
          limit: Number(r),
          order: [[sc || "createdAt", sd == 1 ? "DESC" : "ASC"]],
          include: [{ model: User, as: 'user', attributes: ['id', 'corporate_name', 'first_name', 'middle_name', 'last_name', 'email', 'phone', 'gender'] },
          { model: Employee, as: 'assignedEmployee' }],
          where: {
            [Op.or]: [{ userId: currentUser.id }, { "$assignedEmployee.userId$": { [Op.like]: `%${currentUser.id}%` }, }]
          },
        });
        res.status(200).json(selfData);
        break;
      case "customer":
        const customerData = await Quotation.findAndCountAll({
          offset: Number(f),
          limit: Number(r),
          order: [[sc || "createdAt", sd == 1 ? "DESC" : "ASC"]],
          include: [{
            model: User, as: 'user', attributes: ['id', 'corporate_name', 'first_name', 'middle_name', 'last_name', 'email', 'phone', 'gender'],
          },
          {
            model: MotorProposal, include: [{ model: Proposal, include: [{ model: Contact, }] }]
          }
          ],
          // where: {
          //   [Op.or]: [
          //     { '$motor_proposals.proposals.contact.accountId$': { [Op.like]: `%${currentUser.id}%` } },
          //     { userId: currentUser.id },
          //   ]
          // },
          where: {
            userId: req.user.id
          }
        });

        
        res.status(200).json(customerData);
        break;
      case "branch":
        const currentEmployee = await Employee.findOne({
          where: { userId: currentUser.id }
        })
        const branchData = await Quotation.findAndCountAll({
          offset: Number(f),
          limit: Number(r),
          order: [[sc || "createdAt", sd == 1 ? "DESC" : "ASC"]],
          include: [{
            model: User, as: 'user', attributes: {
              exclude: ['password', 'shortCodeExpirationDate',
                'createdAt', 'updatedAt', 'userId', 'shortCode', 'activation', 'activated', 'role'
              ]
            }
          },
          { model: Employee, as: 'assignedEmployee' }],
          where: currentEmployee
            && {
            branchId: currentEmployee.branchId
          }

        });
        res.status(200).json(branchData);
        break;
      case "branchAndSelf":
        const user = await User.findByPk(currentUser.id, {
          include: [Employee],
        });
        const employee = await Employee.findOne({
          where: {
            userId: currentUser.id
          }
        })
        branchAndSelfData = await Quotation.findAndCountAll({
          include: [{ model: User, as: 'user', attributes: ['id', 'corporate_name', 'first_name', 'middle_name', 'last_name', 'email', 'phone', 'gender'], },
          { model: Employee, as: 'assignedEmployee' }],
          offset: Number(f),
          limit: Number(r),
          order: [[sc || "createdAt", sd == 1 ? "DESC" : "ASC"]],
          subQuery: false,
          where: {
            [Op.and]: [
              {
                [Op.or]: [
                  { userId: { [Op.like]: `%${currentUser.id}%` } },
                  { "$assignedEmployee.userId$": { [Op.like]: `%${currentUser.id}%` } },
                  employee
                  && {
                    branchId: {
                      [Op.like]: `%${employee.branchId}%`,
                    },
                  },
                ],
              },
              getSearch(st),
            ],
          },
        });
        res.status(200).json(branchAndSelfData);

        break;

      default:
        break;
    }
  } catch (error) {
    
    res.status(400).json({ msg: error.message });
  }
};

const getQuotationsByGroup = async (req, res) => {
  
  //queryparams:  { f: '0', r: '7', st: '', sc: 'first_name', sd: '1' }
  const { f, r, st, sc, sd, id } = req.query;
  
  const role = req.user.role;
  
  
  try {
    switch (role) {
      case Role.superAdmin:
        data = await Quotation.findAndCountAll({
          offset: Number(f),
          limit: Number(r),
          order: [[sc || "createdAt", sd == 1 ? "DESC" : "ASC"]],
          // where: getSearch(st),
          where: { requested_quotation_id: id },
          include: [
            //  { model: Employee, as: "employee"}, , {model: User, as: "owner"},  VehicleCategory
            //  {model: Employee, as: "assignedEmployee"},
            { model: User, as: "user" },
            { model: Contact, as: "lead" },
            Opportunity,
            { model: Branch, as: "branch" },
            { model: Vehicle, as: "vehicle" },
          ],
        });
        res.status(200).json(data);
        break;
      case Role.sales:
        data = await Quotation.findAndCountAll({
          offset: Number(f),
          limit: Number(r),
          order: [[sc || "createdAt", sd == 1 ? "DESC" : "ASC"]],
          include: [
            { model: Employee, as: "employee" },
            { model: Employee, as: "assignedEmployee" },
            { model: User, as: "owner" },
            { model: User, as: "user" },
            VehicleCategory,
            { model: Contact, as: "lead" },
            Opportunity,
          ],
          where: {
            [Op.and]: [
              {
                [Op.or]: [
                  {
                    "$assignedEmployee.userId$": {
                      [Op.like]: `%${req.user.id}%`,
                    },
                  },
                  { "$employee.userId$": { [Op.like]: `%${req.user.id}%` } },
                ],
              },
              getSearch(st),
              { id },
            ],
          },
        });
        res.status(200).json(data);
        break;
      case Role.branchManager:
        data = await Quotation.findAndCountAll({
          offset: Number(f),
          limit: Number(r),
          order: [[sc || "createdAt", sd == 1 ? "DESC" : "ASC"]],
          include: [
            { model: Employee, as: "employee" },
            { model: Employee, as: "assignedEmployee" },
            { model: User, as: "owner" },
            { model: User, as: "user" },
            VehicleCategory,
            { model: Contact, as: "lead" },
            Opportunity,
          ],
          where: {
            [Op.and]: [
              {
                "$assignedEmployee.userId$": { [Op.like]: `%${req.user.id}%` },
              },
              getSearch(st),
              { id },
            ],
          },
        });
        res.status(200).json(data);
        break;
      case Role.agent:
        data = await Quotation.findAndCountAll({
          offset: Number(f),
          limit: Number(r),
          include: [
            { model: Employee, as: "employee" },
            { model: Employee, as: "assignedEmployee" },
            VehicleCategory,
            { model: Contact, as: "lead" },
            Opportunity,
            { model: User, as: "user" },
            { model: User, as: "owner" },
          ],
          order: [[sc || "createdAt", sd == 1 ? "DESC" : "ASC"]],
          where: {
            [Op.and]: [
              { userId: { [Op.like]: `%${req.user.id}%` } },
              getSearch(st),
              { id },
            ],
          },
        });
        res.status(200).json(data);
        break;
      case Role.customer:
        data = await Quotation.findAndCountAll({
          offset: Number(f),
          limit: Number(r),
          order: [[sc || "createdAt", sd == 1 ? "DESC" : "ASC"]],
          include: [
            { model: Employee, as: "assignedEmployee" },
            { model: User, as: "user" },
          ],
          where: {
            [Op.and]: [
              {
                userId: id,
              },
              getSearch(st),
            ],
          },
        });
        res.status(200).json(data);
        break;
      default:
        break;
    }
  } catch (error) {
    
    res.status(400).json({ msg: error.message });
  }
};

//posting
const createQuotation = async (req, res) => {
  
  const {
    subject,
    comment,
    opportunityId,
    contactId,
    assignedTo,
    userId,
    productId,
    reportTo,
    document,
    ownerId,
  } = req.body;

console.log("Quotion Body",req.body)  
  let expirationDate = new Date();
  expirationDate.setMonth(expirationDate.getMonth() + 3);
  try {
    // await Quotation.addHook("afterCreate", (quotation, options)=>{
    //   quotation.addEmployees()
    // })
    const quotation = await Quotation.create({
      subject,
      comment,
      expirationDate,
      opportunityId,
      contactId,
      assignedTo,
      userId,
      productId,
      reportTo,
      document,
      ownerId,
    });
    

    res.status(200).json(quotation);
  } catch (error) {
    
  }
};

const getQuotation = async (req, res) => {
  try {
    
    const quotation = await Quotation.findOne({
      include: [
        // VehicleCategory,  {model: User, as: "owner"}
        { model: MotorProposal, Include: { model: Proposal, include: Contact } },
        Opportunity,
        { model: User, as: "user" },
        { model: Contact, as: "lead" },
        { model: Branch, as: "branch" },
        { model: Vehicle, as: "vehicle" },
      ],
      where: { id: req.params.id },
    }).then(function (quotation) {
      
      console.log("the gettesed in back", quotation)
      if (!quotation) {
        return res.status(404).json({ message: "No Data Found" });
      } else {
        // if (req.type === 'customer' && (quotation.proposal.contact.accountId != req.user.id)) {
        //   return res.status(401).json({ msg: "unauthorized access" });
        // }

        res.status(200).json(quotation);
      }
    });

    // res.status(200).json(quotation);
  } catch (error) {
    res.status(404).json({ msg: error.message });
  }
};
const getQuotationByContactId = async (req, res) => {
  try {
    const quotation = await Quotation.findOne({
      include: [
        // VehicleCategory,  {model: User, as: "owner"}
        { model: MotorProposal, Include: { model: Proposal, include: Contact } },
        Opportunity,
        { model: User, as: "user" },
        { model: Contact, as: "lead" },
        { model: Branch, as: "branch" },
        { model: Vehicle, as: "vehicle" },
      ],
      where: { contactId: req.params.id },
    }).then(function (quotation) {
      console.log("getQuotation", quotation)

      if (!quotation) {
        return res.status(404).json({ message: "No Data Found" });
      } else {
        // if (req.type === 'customer' && (quotation.proposal.contact.accountId != req.user.id)) {
        //   return res.status(401).json({ msg: "unauthorized access" });
        // }

        res.status(200).json(quotation);
      }
    });

    // res.status(200).json(quotation);
  } catch (error) {
    res.status(404).json({ msg: error.message });
  }
};
const editQuotation = async (req, res) => {
  let result = 0;
  const { coverType, id } = req.body;
  try {
    let quotation = 0;
    if (coverType === MotorCoverType.ownDamage) {
      const odPremium = await getODPremium(req.body);
      const newBody = {
        ...req.body,
        premium: odPremium.quotation,
      };

      Quotation.update(newBody, { where: { id: id } });
      // res.status(200).json({ id });
      res.status(200).json([
        {
          premium: newBody.premium,
          // calculation_sheet_path: "",
          // contactId: 0,
          // quotationId: 0,
          // older
        },
      ])
    }
    if (coverType === MotorCoverType.thirdParty) {
      const tpPremium = await getTPPremium(req.body);
      

      const newBody = {
        ...req.body,
        premium: tpPremium.result,
      };

      Quotation.update(newBody, { where: { id: id } });
      // res.status(200).json({ id });
      res.status(200).json([
        {
          premium: newBody.premium,
          // calculation_sheet_path: "",
          // contactId: 0,
          // quotationId: 0,
          // older
        },
      ])
    }
    if (coverType === MotorCoverType.comprehensive) {
      const comprehensivePremium = await getComprehensivePremium(req.body);

      const odPremium = await getODPremium(req.body);
      const tpPremium = await getTPPremium(req.body);
      const totalPremium = parseInt(odPremium + tpPremium).toFixed(2);
      

      const newBody = {
        ...req.body,
        premium: totalPremium.result,
      };

      Quotation.update(newBody, { where: { id: id } });
      // res.status(200).json({ id });
      res.status(200).json([
        {
          premium: newBody.premium,
          // calculation_sheet_path: "",
          // contactId: 0,
          // quotationId: 0,
          // older
        },
      ])
    } else if (
      coverType === MotorCoverType.fireAndTheft ||
      coverType === MotorCoverType.theftOnly ||
      coverType === MotorCoverType.fireOnly
    ) {
      quotation = await calculateLimitedCovers(coverType, purpose, sumInsured);
      const newBody = {
        ...req.body,
        premium: quotation,
      };

      Quotation.update(newBody, { where: { id: id } });
      // res.status(200).json({ id });
      res.status(200).json([
        {
          premium: newBody.premium,
          // calculation_sheet_path: "",
          // contactId: 0,
          // quotationId: 0,
          // older
        },
      ])
    }
  } catch (error) {
    
    res.status(404).json({ msg: error.message });
  }
};

const deleteQuotation = async (req, res) => {
  const id = req.params.id;
  try {
    Quotation.destroy({ where: { id: id } });

    res.status(200).json({ id });
  } catch (error) {
    res.status(404).json({ msg: error.message });
  }
};

const getAddon = async (req, res) => {
  try {
    const addons = await Addons.findAll({
      include: [
        // VehicleCategory,  {model: User, as: "owner"}
        { model: CoverRate, as: "coverRate" },
        { model: LimitedCoverRate, as: "limitedCoverRate" },
        { model: TerritorialExtension, as: "territorialExtension" },
        { model: ComprehnsicveTp, as: "comprehensiveTp" },
      ],
      where: { quotationId: req.params.id },
    }).then(function (addons) {
      if (!addons) {
        res.status(404).json({ message: "No Data Found" });
      } else {
        
        res.status(200).json(addons);
      }
    });

    // res.status(200).json(quotation);
  } catch (error) {
    res.status(404).json({ msg: error.message });
  }
};

const generateReport = async (req, res) => {

  let quotation;
  console.log("quo report req", req.user.role)

  if (!(await canUserRead(req.user, "quotations"))) {
    return res.status(401).json({ msg: "unauthorized access!" });
  }

  const { f, r, st, sc, sd, purpose } = req.query;
  const {
    quotation_numbers,
    names,
    request_types,
    phone_numbers,
    cover_types,
    vehicle_types,
    startDate,
    endDate
  } = req.body;
  const role = req.user.role;

  let formattedStartDate;
  let formattedEndDate;

  if (startDate) {
    formattedStartDate = new Date(new Date(startDate).setHours(0, 0, 0, 0));
  }
  if (endDate) {
    formattedEndDate = new Date(new Date(endDate).setHours(23, 59, 59, 0));
  }

  const pagination = purpose == "export" || {
    offset: Number(f),
    limit: Number(r),
  };

  console.log("generateReport", req.body)

  try {
    if (role == Role.superAdmin) {
      const conditions = {
        [Op.and]: [
          quotation_numbers && quotation_numbers.length !== 0 && quotation_numbers[0] !== 0
            ? {
              quotation_number: {
                [Op.in]: quotation_numbers,
              },
            }
            : {},
          names && names.length !== 0 && names[0] !== 0
            ? {
                [Op.or]: {
                  [Op.and]: {
                    owner_first_name: {
                      [Op.in]: names.map((name)=> {
                        let nameParts = name.split(' ')
                        return nameParts[0];
                      })
                    },
                    owner_middle_name: {
                      [Op.eq]: names.map((name)=> {
                        let nameParts = name.split(' ')
                        return nameParts[1];
                      })
                    },
                  },
                  company_name: {
                    [Op.in]: names,
                  },
                  join_individual_name: {
                    [Op.in]: names,
                  },
                },
              }
            : {},
          phone_numbers && phone_numbers.length !== 0 && phone_numbers[0] !== 0
            ? {
              owner_phoneNo: {
                [Op.in]: phone_numbers,
              },
            }
            : {},
          request_types && request_types.length !== 0 && request_types[0] !== 0
            ? {
              request_type: {
                [Op.in]: request_types.map((type) => {
                  return type.name
                }),
              },
            }
            : {},
          cover_types && cover_types.length !== 0 && cover_types[0] !== 0
            ? {
              coverType: {
                [Op.in]: cover_types.map((type) => {
                  return type.name
                }),
              },
            }
            : {},
          vehicle_types && vehicle_types.length !== 0 && vehicle_types[0] !== 0
            ? {
              vehicle_type: {
                [Op.in]: vehicle_types.map((type) => {
                  return type.name
                }),
              },
            }
            : {},
          formattedStartDate ? { createdAt: { [Op.gte]: formattedStartDate } } : {},
          formattedEndDate ? { createdAt: { [Op.lte]: formattedEndDate } } : {},
        ],
      };

      console.log("condition is  ", conditions);
      
      quotation = await Quotation.findAndCountAll({
        include: [{ model: Contact, as: "lead" }],
        subQuery: false,
        ...pagination,
        order: [[sc || "createdAt", sd == 1 ? "DESC" : "ASC"]],
        distinct: true,
        where: {
          ...conditions,
        },
      });
    }

    if (await canUserAccessOnlySelf(req.user, "quotations")) {
      quotation = await Quotation.findAll({
        include: [User, { model: Contact, as: "lead" }],
        order: [["createdAt", "DESC"]],
        where: {
          ...pagination,
          "$user.id$": req.user.id,
          deleted: false,
        },
      });
    }

    console.log("quo report", quotation.rows)
    if (!quotation) {
      res.status(404).json({ message: "No Data Found" });
    } else res.status(200).json(quotation);
  } catch (error) {
    console.log("the error is ", error);
    res.status(400).json({ msg: error.message });
  }
};

module.exports = {
  getQuotations,
  createQuotation,
  getQuotation,
  editQuotation,
  deleteQuotation,
  getQuotationsByGroup,
  getAddon,
  generateReport,
  getQuotationByContactId
};
