const { Op, where, Sequelize } = require('sequelize');
const User = require("../../models/acl/user");
const Campaign = require("../../models/Campaign");
const Contact = require("../../models/Contact");
const Employee = require("../../models/Employee");
const Vehicle = require("../../models/motor/Vehicle");
const Opportunity = require("../../models/Opportunity");
const SharedOpporunity = require("../../models/SharedOpportunity");
const {
  canUserAccessOnlyBranch,
  canUserAccessOnlySelf,
  canUserRead,
  canUserCreate,
  canUserEdit,
  canUserDelete,
} = require("../../utils/Authrizations");
const {
  Role,
  eventResourceTypes,
  eventActions,
  ContactStatus,
} = require("../../utils/constants");
const {
  isEmailValid,
  isPhoneNoValid,
  createEventLog,
  getChangedFieldValues,
  getIpAddress,
} = require("../../utils/GeneralUtils");
const FireRateCategory = require("../../models/fire/FireRateCategory");
const Customer = require("../../models/customer/Customer");


/**
 * Search function with st = search term
 * @param {} st 
 * @returns 
 */
const getSearch = (st) => {
  console.log("opportunity change search", st);
  return {
    [Op.or]: [
      { subject: { [Op.like]: `%${st}%` } },
      { assignedTo: { [Op.like]: `%${st}%` } }, 
      { probablity: { [Op.like]: `%${st}%` } },
      { productId: { [Op.like]: `%${st}%` } },
      { fire_productId: { [Op.like]: `%${st}% `} },
      { status: { [Op.like]: `%${st}%` } },
      { source: { [Op.like]: `%${st}%` } },
      { '$product.name$': { [Op.like]: `%${st}%` } }, 
      { '$fire_product.name$': { [Op.like]: `%${st}%` } },
      {
        [Op.or]: [
          Sequelize.where(Sequelize.fn('concat', Sequelize.col('assignedUser.first_name'), ' ', Sequelize.col('assignedUser.middle_name'), ' ', Sequelize.col('assignedUser.last_name')), { [Op.like]: `%${st}%` })
        ]
      },
      {
        [Op.or]: [
          Sequelize.where(Sequelize.fn('concat', Sequelize.col('account.firstName'), ' ', Sequelize.col('account.middleName'), ' ', Sequelize.col('account.lastName')), { [Op.like]: `%${st}%` })
        ]
      }
    ],
  };
};





/**
 * Get assignment condition function with loggedin user and account id
 * @param {*} user 
 * @param {*} accountId 
 * @returns 
 */
const getAssignmentCondition = async (user, accountId) => {
  const { role, id } = user;
  let condition = {};
  if (await canUserAccessOnlySelf(user, "opportunitys")) {
    condition = {
      [Op.or]: [{ assignedTo: id }, { "$shares.id$": id }],
    };
  } else if (await canUserAccessOnlyBranch(user, "opportunitys")) {
    let branchId = await Employee.findOne({ where: { userId: user.id } })
      .branchId;
    condition = { branchId };
  }
  if (accountId && accountId !== "undefined") {
    condition = { ...condition, accountId };
  }

  return condition;
};

/**
 * Generate report controller
 * @param {*} req 
 * @param {*} res 
 * @returns 
 */
const generateReport = async (req, res) => {

  // Replaced By middleware
  // if (!(await canUserRead(req.user, "opportunitys"))) {
  //   return res.status(400).json({ msg: "unauthorized access!" });
  // }
  const { f, r, st, sc, sd, accountId, purpose } = req.query;
  console.log("generateReport", req.body)
  
  let condition = await getAssignmentCondition(req.user, accountId);
  const pagination = purpose == "export" || {
    offset: Number(f),
    limit: Number(r),
  };
  const { statuses, sources, assignedTos, productIds, fire_productIds } = req.body;
  let { startDate, endDate } = req.body;
  if (startDate) {
    startDate = new Date(new Date(startDate).setHours(0, 0, 0, 0));
  }
  if (endDate) {
    endDate = new Date(new Date(endDate).setHours(23, 59, 59, 0));
  }
  const reportCondition = {
    [Op.and]: [
      statuses && statuses.length !== 0
        ? {
          status: {
            [Op.in]: statuses.map((statuss) => statuss.name),
          },
        }
        : {},
      sources && sources.length !== 0
        ? {
          source: {
            [Op.in]: sources.map((source) => source.name),
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
      productIds && productIds.length !== 0 && productIds[0] !== 0
        ? {
          productId: {
            [Op.in]: productIds,
          },
        }
        : {},

      fire_productIds && fire_productIds.length !== 0 && fire_productIds[0] !== 0
      ? {
        fire_productId: {
          [Op.in]: fire_productIds,
        },
      }
      : {},
      startDate
        ? {
          createdAt: {
            [Op.gte]: startDate,
          },
        }
        : {},
      endDate
        ? {
          createdAt: {
            [Op.lte]: endDate,
          },
        }
        : {},

      // productIds && productIds.length !== 0 && productIds[0] !== 0
      //   ? {
      //       productId: {
      //         [Op.in]: productIds,
      //       },
      //     }
      //   : {},
    ],
  };
  try {
    const data = await Opportunity.findAndCountAll({
      include: [
        {
          model: User,
          as: "assignedUser",
        },
        {
          model: Contact,
          as: "account",
        },
        {
          model: User,
          as: "shares",
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
      ...pagination,
      order: [[sc || "subject", sd == 1 ? "ASC" : "DESC"]],
      where: { ...getSearch(st), ...condition, ...reportCondition },
      subQuery: false,
    });
    
    res.status(200).json(data);
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};

/**
 * Get opportunities controller
 * @param {*} req 
 * @param {*} res 
 * @returns 
 */
const getOpportunitys = async (req, res) => {

  // Replaced by middleware
  // if (!(await canUserRead(req.user, "opportunitys"))) {
  //   return res.status(400).json({ msg: "unauthorized access!" });
  // }
  // 
  //queryparams:  { f: '0', r: '7', st: '', sc: 'first_name', sd: '1' }
  const { f, r, st, sc, sd, accountId } = req.query;
  let condition = await getAssignmentCondition(req.user, accountId);
  try {
    const data = await Opportunity.findAndCountAll({
      include: [
        {
          model: User,
          as: "assignedUser",
        },
        {
          model: Campaign,
          as: "campaign",
        },
        {
          model: Contact,
          as: "account",
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
      ],
      offset: Number(f),
      limit: Number(r),
      order: [[sc || "createdAt", sd == 1 ? "DESC" : "ASC"]],
      where: { ...getSearch(st), ...condition },
      subQuery: false,
    });
    res.status(200).json(data);
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};

/**
 * Export opportunities controller
 * @param {*} req 
 * @param {*} res 
 * @returns 
 */
const exportOpportunitys = async (req, res) => {
  const { st, sc, sd, accountId } = req.query;
  if (!(await canUserRead(req.user, "opportunitys"))) {
    return res.status(400).json({ msg: "unauthorized access!" });
  }
  let condition = await getAssignmentCondition(req.user, accountId);
  try {
    const opportunitys = await Opportunity.findAndCountAll({
      include: [
        {
          model: User,
          as: "assignedUser",
        },
        {
          model: Campaign,
          as: "campaign",
        },
        {
          model: Contact,
          as: "account",
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
      ],
      order: [[sc || "subject", sd == 1 ? "ASC" : "DESC"]],
      where: {
        ...getSearch(st),
        ...condition,
      },
    });
    res.status(200).json(opportunitys);
  } catch (error) {
    
    res.status(400).json({ msg: error.message });
    co;
  }
};

/**
 * Create opportunities controller
 * @param {*} req 
 * @param {*} res 
 * @returns 
 */
const createOpportunity = async (req, res) => {
  // Replaced by middleware
  // if (!(await canUserCreate(req.user, "opportunitys"))) {
  //   return res.status(400).json({ msg: "unauthorized access!" });
  // }
  // 
  let {
    subject,
    assignedTo,
    probablity,
    accountId,
    productId,
    fire_productId,
    status,
    source,
    description,
    campaignId,
    userId,
  } = req.body;
  userId = req.user.id;
  try {
    const opportunity = await Opportunity.create({
      subject,
      assignedTo,
      probablity,
      accountId,
      productId,
      fire_productId,
      status,
      source,
      description,
      campaignId,
      userId,
    });

    if (opportunity) {
      let ipAddress = getIpAddress(req.ip);
      const eventLog = await createEventLog(
        req.user.id,
        eventResourceTypes.opportunity,
        subject,
        opportunity.id,
        eventActions.create,
        "",
        ipAddress
      );
    }
    //adding share
    const { sharedWith } = req.body;
    const toAdd =
      sharedWith &&
      sharedWith.map((element) => {
        return { opportunityId: opportunity.id, userId: element };
      });
    SharedOpporunity.bulkCreate(toAdd);

    res.status(200).json(opportunity);
  } catch (error) {
    
  }
};

/**
 * Get opportunities controller
 * @param {*} req 
 * @param {*} res 
 * @returns 
 */
const getOpportunity = async (req, res) => {

  // Replaced by middleware
  // if (!(await canUserRead(req.user, "opportunitys"))) {
  //   return res.status(400).json({ msg: "unauthorized access!" });
  // }
  try {
    const opportunity = await Opportunity.findByPk(req.params.id, {
      include: [
        {
          model: User,
          as: "assignedUser",
        },
        {
          model: Contact,
          as: "account",
        },
        {
          model: Campaign,
          as: "campaign",
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
      ],
      subQuery: false,
    }).then(async function (opportunity) {
      if (!opportunity) {
        return res.status(404).json({ message: "No Data Found" });
      } else {
        let ipAddress = getIpAddress(req.ip);
        const eventLog = await createEventLog(
          req.user.id,
          eventResourceTypes.opportunity,
          opportunity.subject,
          opportunity.id,
          eventActions.view,
          "",
          ipAddress
        );
      }
      

      return res.status(200).json(opportunity);
    });

    //  retur   res.status(200).json(opportunity);


  } catch (error) {
    res.status(404).json({ msg: error.message });
  }
};

/**
 * Edit opportunities controller
 * @param {*} req 
 * @param {*} res 
 * @returns 
 */
const editOpportunity = async (req, res) => {
  // Replaced by middleware
  // if (!(await canUserEdit(req.user, "opportunitys"))) {
  //   return res.status(400).json({ msg: "unauthorized access!" });
  // }

  console.log("editOpportunity derso neber");

  const {
    id,
    subject,
    assignedTo,
    probablity,
    accountId,
    productId,
    fire_productId,
    status,
    source,
    description,
    campaignId,
  } = req.body;

  try {
    const previousOpportunity = await Opportunity.findByPk(id);
    const updateOpportunity = await Opportunity.update(
      {
        subject,
        assignedTo,
        probablity,
        accountId,
        productId,
        fire_productId,
        status,
        source,
        description,
        campaignId,
      },

      { where: { id: id } }
    );
    const newOpportunity = await Opportunity.findByPk(id);

    if (newOpportunity.probablity === 100) {
      const newCustomer = await Customer.create({
        contactId: newOpportunity.accountId,
        userId: newOpportunity.userId,
        opportunityId: id,
      });

      const newStatus = ContactStatus.customer;
      const updatedContact = await Contact.update(
        { status: newStatus },
        { where: { id: newOpportunity.accountId } }
      );
    }
    if (updateOpportunity) {
      const changedFieldValues = getChangedFieldValues(
        previousOpportunity,
        newOpportunity
      );
      let ipAddress = getIpAddress(req.ip);
      const eventLog = await createEventLog(
        req.user.id,
        eventResourceTypes.opportunity,
        newOpportunity.subject,
        newOpportunity.id,
        eventActions.edit,
        changedFieldValues,
        ipAddress
      );
    }
    const { sharedWith } = req.body;
    SharedOpporunity.destroy({ where: { opportunityId: req.body.id } });
    const toAdd =
      sharedWith &&
      sharedWith.map((element) => {
        return { opportunityId: req.body.id, userId: element };
      });
    SharedOpporunity.bulkCreate(toAdd);
    res.status(200).json({ id });
  } catch (error) {
    
    res.status(404).json({ msg: error.message });
  }
};

/**
 * Delete opportunities controller
 * @param {*} req 
 * @param {*} res 
 * @returns 
 */
const deleteOpportunity = async (req, res) => {
  //  Replaced by middleware
  // if (!(await canUserDelete(req.user, "opportunitys"))) {
  //   return res.status(400).json({ msg: "unauthorized access!" });
  // }
  const id = req.params.id;
  try {
    const oldOpportunity = await Opportunity.findByPk(id);
    const deletedOpportunity = await Opportunity.destroy({ where: { id: id } });
    let ipAddress = getIpAddress(req.ip);
    const eventLog = await createEventLog(
      req.user.id,
      eventResourceTypes.opportunity,
      oldOpportunity.subject,
      oldOpportunity.id,
      eventActions.delete,
      "",
      ipAddress
    );
    res.status(200).json({ id });
  } catch (error) {
    res.status(404).json({ msg: error.message });
  }
};

module.exports = {
  getOpportunitys,
  createOpportunity,
  getOpportunity,
  editOpportunity,
  deleteOpportunity,
  generateReport,
  exportOpportunitys,
};
