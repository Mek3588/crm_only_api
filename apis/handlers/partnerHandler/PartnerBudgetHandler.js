const User = require("../../../models/acl/user");
const Partner = require("../../../models/partner/Partner");
const PartnerBudget = require("../../../models/partner/PartnerBudget");
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

const getSearch = (st, id) => {
  return {
    partnerId: id,
  };
};

const getBudgetByPartner = async (req, res) => {
  try {
    const { f, r, st, sc, sd } = req.query;
    const data = await PartnerBudget.findAndCountAll({
      include: [User, Partner],
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

const createPartnerBudget = async (req, res) => {
  const body = req.body;
  try {
    const partner = await PartnerBudget.create(body);
    const newPartner = await PartnerBudget.findByPk(partner.id, {
      include: [Partner],
    });
    // 
    // 

    let ipAddress = getIpAddress(req.ip);
    const eventLog = await createEventLog(
      req.user.id,
      eventResourceTypes.partnerBudget,
      newPartner.partner.partnerName,
      newPartner.partner.id,
      eventActions.create,
      "",
      ipAddress
    );
    res.status(200).json(partner);
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};

const editPartnerBudget = async (req, res) => {
  const partner = req.body;

  try {
    const foundPartnerBudget = await PartnerBudget.findByPk(partner.id);
    await PartnerBudget.update(partner, { where: { id: partner.id } });
    const newPartnerBudget = await PartnerBudget.findByPk(partner.id, {
      include: [Partner],
    });
    const changedFieldValues = getChangedFieldValues(
      foundPartnerBudget,
      newPartnerBudget
    );
    let ipAddress = await getIpAddress(req.ip);
    const eventLog = await createEventLog(
      req.user.id,
      eventResourceTypes.partnerBudget,
      newPartnerBudget.partner.partnerName,
      newPartnerBudget.partner.id,
      eventActions.edit,
      changedFieldValues,
      ipAddress
    );
    res.status(200).json({ partner });
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};

const deletePartnerBudget = async (req, res) => {
  const id = req.params.id;

  try {
    const foundPartnerBudget = await PartnerBudget.findByPk(id, {
      include: [Partner],
    });
    await PartnerBudget.destroy({ where: { id: id } });
    let ipAddress = await getIpAddress(req.ip);
    const eventLog = await createEventLog(
      req.user.id,
      eventResourceTypes.partnerBudget,
      foundPartnerBudget.partner.partnerName,
      foundPartnerBudget.partner.id,
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
  getBudgetByPartner,
  deletePartnerBudget,
  editPartnerBudget,
  createPartnerBudget,
};
