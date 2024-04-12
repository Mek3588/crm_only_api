const User = require("../../../models/acl/user");
const Employee = require("../../../models/Employee");
const CompetitorComment = require("../../../models/competitor/CompetitorComment");
const VendorComment = require("../../../models/vendor/VendorComment");
const Vendor = require("../../../models/vendor/Vendors");
const {
  createEventLog,
  getIpAddress,
  getChangedFieldValues,
} = require("../../../utils/GeneralUtils");
const {
  Role,
  eventResourceTypes,
  eventActions,
} = require("../../../utils/constants");
const Competitor = require("../../../models/competitor/Competitors");
//activate , com'ment

const getCommentByCompetitor = async (req, res) => {
  try {
    
    const data = await CompetitorComment.findAll({
      include: [{ model: User, attributes: ['id', 'corporate_name', 'first_name', 'middle_name', 'last_name', 'email', 'phone', 'gender'], include: [Employee] }],
      where: { competitorId: req.params.id },
    });
    res.status(200).json(data);
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};

const getComment = async (req, res) => {
  try {
    const data = await CompetitorComment.findAll({
      include: [{ model: User, attributes: ['id', 'corporate_name', 'first_name', 'middle_name', 'last_name', 'email', 'phone', 'gender'], include: [Employee] }],
    });
    res.status(200).json(data);
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};

const createCompetitorComment = async (req, res) => {
  const body = req.body;
  try {
    const competitor = await CompetitorComment.create(body);
    const newCompetitor = await CompetitorComment.findByPk(competitor.id, {
      include: [Competitor],
    });
    let ipAddress = getIpAddress(req.ip);
    const eventLog = createEventLog(
      req.user.id,
      eventResourceTypes.competitorComment,
      newCompetitor.competitor.name,
      newCompetitor.competitor.id,
      eventActions.create,
      "",
      ipAddress
    );
    res.status(200).json(competitor);
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};

const editCompetitorComment = async (req, res) => {
  const competitor = req.body;

  try {
    const foundCompetitorBudget = await CompetitorComment.findByPk(
      competitor.id
    );
    await CompetitorComment.update(competitor, {
      where: { id: competitor.id },
    });
    const newCompetitor = await CompetitorComment.findByPk(competitor.id, {
      include: [Competitor],
    });
    const changedFieldValues = getChangedFieldValues(
      foundCompetitorBudget,
      newCompetitor
    );
    let ipAddress = await getIpAddress(req.ip);
    const eventLog = await createEventLog(
      req.user.id,
      eventResourceTypes.competitorComment,
      newCompetitor.competitor.name,
      newCompetitor.competitor.id,
      eventActions.edit,
      changedFieldValues,
      ipAddress
    );
    res.status(200).json({ competitor });
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};

const deleteCompetitorComment = async (req, res) => {
  const id = req.params.id;

  try {
    const newCompetitor = await CompetitorComment.findByPk(id, {
      include: [Competitor],
    });
    await CompetitorComment.destroy({ where: { id: id } });
    let ipAddress = await getIpAddress(req.ip);
    const eventLog = await createEventLog(
      req.user.id,
      eventResourceTypes.competitorComment,
      newCompetitor.competitor.name,
      newCompetitor.competitor.id,
      eventActions.delete,
      "",
      ipAddress
    );
    res.status(200).json({ id });
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};

module.exports = {
  getCommentByCompetitor,
  deleteCompetitorComment,
  getComment,
  editCompetitorComment,
  createCompetitorComment,
};
