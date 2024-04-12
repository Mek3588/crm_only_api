const User = require("../../../models/acl/user");
const Employee = require("../../../models/Employee");
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
//activate , com'ment

const getCommentByVendor = async (req, res) => {
  try {
    
    const data = await VendorComment.findAll({
      include: [{ model: User, include: [Employee] }],
      where: { vendorId: req.params.id },
    });
    res.status(200).json(data);
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};

const getComment = async (req, res) => {
  try {
    const data = await VendorComment.findAll({
      include: [{ model: User, include: [Employee] }],
    });
    res.status(200).json(data);
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};

const createVendorComment = async (req, res) => {
  const body = req.body;
  try {
    const vendorComment = await VendorComment.create(body);
    const foundComment = await VendorComment.findByPk(vendorComment.id, {
      include: [Vendor],
    });
    
    let ipAddress = await getIpAddress(req.ip);
    const eventLog = await createEventLog(
      req.user.id,
      eventResourceTypes.vendorComment,
      foundComment.vendor.vendorName,
      foundComment.vendor.id,
      eventActions.create,
      "",
      ipAddress
    );
    res.status(200).json(vendorComment);
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};

const editVendorComment = async (req, res) => {
  const vendorComment = req.body;

  try {
    const foundPartner = await VendorComment.findByPk(vendorComment.id);
    await VendorComment.update(vendorComment, {
      where: { id: vendorComment.id },
    });
    const newVendorComment = await VendorComment.findByPk(vendorComment.id, {
      include: [Vendor],
    });
    const changedFieldValues = getChangedFieldValues(
      foundPartner,
      newVendorComment
    );
    let ipAddress = await getIpAddress(req.ip);
    const eventLog = await createEventLog(
      req.user.id,
      eventResourceTypes.vendorComment,
      newVendorComment.vendor.vendorName,
      newVendorComment.vendor.id,
      eventActions.edit,
      changedFieldValues,
      ipAddress
    );
    res.status(200).json({ vendorComment });
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};

const deleteVendorComment = async (req, res) => {
  const id = req.params.id;

  try {
    const foundComment = await VendorComment.findByPk(id, {
      include: [Vendor],
    });
    await VendorComment.destroy({ where: { id: id } });
    let ipAddress = await getIpAddress(req.ip);
    const eventLog = await createEventLog(
      req.user.id,
      eventResourceTypes.vendorComment,
      foundComment.vendor.vendorName,
      foundComment.vendor.id,
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
  getCommentByVendor,
  deleteVendorComment,
  getComment,
  editVendorComment,
  createVendorComment,
};
