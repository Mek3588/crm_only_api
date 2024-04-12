const User = require("../../../models/acl/user");
const CompetitorBudget = require("../../../models/competitor/CompetitorBudget");
const Competitor = require("../../../models/competitor/Competitors");
const {
  Role,
  eventResourceTypes,
  eventActions,
} = require("../../../utils/constants");
const {
  createEventLog,
  getIpAddress,
  getChangedFieldValues,
} = require("../../../utils/GeneralUtils");
//activate , com'ment
const getSearch = (st, id) => {
  return {
    competitorId: id,
  };
};

const getBudgetByCompetitor = async (req, res) => {
  const { f, r, st, sc, sd } = req.query;
  try {
    const data = await CompetitorBudget.findAndCountAll({
      include: [User],
      offset: Number(f),
      limit: Number(r),
      // order: [[sc || "createdAt", sd == 1 ? "ASC" : "DESC"]],
      where: getSearch(st, req.params.id),
      subQuery: false,
    });
    res.status(200).json(data);
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};

const createCompetitorBudget = async (req, res) => {
  const body = req.body;
  try {
    const competitor = await CompetitorBudget.create(body);
    const newCompetitor = await CompetitorBudget.findByPk(competitor.id, {
      include: [Competitor],
    });
    let ipAddress = getIpAddress(req.ip);
    const eventLog = createEventLog(
      req.user.id,
      eventResourceTypes.competitorBudget,
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

const editCompetitorBudget = async (req, res) => {
  const competitor = req.body;

  try {
    const foundCompetitorBudget = await CompetitorBudget.findByPk(
      competitor.id
    );

    await CompetitorBudget.update(competitor, { where: { id: competitor.id } });
    const newCompetitor = await CompetitorBudget.findByPk(competitor.id, {
      include: [Competitor],
    });
    const changedFieldValues = getChangedFieldValues(
      foundCompetitorBudget,
      newCompetitor
    );
    let ipAddress = await getIpAddress(req.ip);
    const eventLog = await createEventLog(
      req.user.id,
      eventResourceTypes.competitorBudget,
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

const deleteCompetitorBudget = async (req, res) => {
  const id = req.params.id;

  try {
    const foundCompetitorBudget = await CompetitorBudget.findByPk(id, {
      include: [Competitor],
    });
    await CompetitorBudget.destroy({ where: { id: id } });
    let ipAddress = await getIpAddress(req.ip);
    const eventLog = await createEventLog(
      req.user.id,
      eventResourceTypes.competitor,
      foundCompetitorBudget.competitor.name,
      foundCompetitorBudget.competitor.id,
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
  getBudgetByCompetitor,
  deleteCompetitorBudget,
  editCompetitorBudget,
  createCompetitorBudget,
};
