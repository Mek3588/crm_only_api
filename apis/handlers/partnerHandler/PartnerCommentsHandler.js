const User = require("../../../models/acl/user");
const Employee = require("../../../models/Employee");
const PartnerComment = require("../../../models/partner/PartnerComment");
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
const Partner = require("../../../models/partner/Partner");
//activate , com'ment

const getCommentByPartner = async (req, res) => {
  try {
    
    const data = await PartnerComment.findAll({
      include: [{ model: User, include: [Employee] }],
      where: { partnerId: req.params.id },
    });
    res.status(200).json(data);
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};

const getComment = async (req, res) => {
  try {
    const data = await PartnerComment.findAll({
      include: [{ model: User, include: [Employee] }],
    });

    res.status(200).json(data);
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};

const createPartnerComment = async (req, res) => {
  const body = req.body;
  try {
    const partner = await PartnerComment.create(body);
    const newPartnerComment = await PartnerComment.findByPk(partner.id, {
      include: [Partner],
    });
    let ipAddress = await getIpAddress(req.ip);
    const eventLog = await createEventLog(
      req.user.id,
      eventResourceTypes.partnerComment,
      newPartnerComment.partner.partnerName,
      newPartnerComment.partner.id,
      eventActions.create,
      "",
      ipAddress
    );
    res.status(200).json(partner);
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};

const editPartnerComment = async (req, res) => {
  const partner = req.body;

  try {
    const foundPartner = await PartnerComment.findByPk(partner.id);
    await PartnerComment.update(partner, { where: { id: partner.id } });
    const newPartnerComment = await PartnerComment.findByPk(partner.id, {
      include: [Partner],
    });
    const changedFieldValues = getChangedFieldValues(
      foundPartner,
      newPartnerComment
    );
    let ipAddress = await getIpAddress(req.ip);
    const eventLog = await createEventLog(
      req.user.id,
      eventResourceTypes.partnerComment,
      newPartnerComment.partner.partnerName,
      newPartnerComment.partner.id,
      eventActions.edit,
      changedFieldValues,
      ipAddress
    );
    res.status(200).json({ partner });
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};

const deletePartnerComment = async (req, res) => {
  const id = req.params.id;

  try {
    const newPartnerComment = await PartnerComment.findByPk(id, {
      include: [Partner],
    });
    await PartnerComment.destroy({ where: { id: id } });
    let ipAddress = await getIpAddress(req.ip);
    const eventLog = await createEventLog(
      req.user.id,
      eventResourceTypes.partnerComment,
      newPartnerComment.partner.partnerName,
      newPartnerComment.partner.id,
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
  getCommentByPartner,
  deletePartnerComment,
  getComment,
  editPartnerComment,
  createPartnerComment,
};
