const User = require("../../../models/acl/user");
const Employee = require("../../../models/Employee");
const ShareholderComment = require("../../../models/shareholders/ShareholderComment");
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
const Shareholder = require("../../../models/shareholders/Shareholder");

//activate , com'ment

const getCommentByShareholder = async (req, res) => {
  try {
    
    const data = await ShareholderComment.findAll({
      include: [{ model: User, include: [Employee] }],
      where: { shareholderId: req.params.id },
    });
    res.status(200).json(data);
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};

const getComment = async (req, res) => {
  try {
    const data = await ShareholderComment.findAll({
      include: [{ model: User, include: [Employee] }],
    });
    res.status(200).json(data);
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};

const createShareholderComment = async (req, res) => {
  const body = req.body;
  try {
    const shareholder = await ShareholderComment.create(body);
    const foundComment = await ShareholderComment.findByPk(shareholder.id, {
      include: [Shareholder],
    });
    
    let ipAddress = await getIpAddress(req.ip);
    const eventLog = await createEventLog(
      req.user.id,
      eventResourceTypes.shareholderComment,
      foundComment.shareholder.name,
      foundComment.shareholder.id,
      eventActions.create,
      "",
      ipAddress
    );
    res.status(200).json(shareholder);
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};

const editShareholderComment = async (req, res) => {
  const shareholder = req.body;

  try {
    const foundShareholder = await ShareholderComment.findByPk(shareholder.id);
    await ShareholderComment.update(shareholder, {
      where: { id: shareholder.id },
    });
    const newShareholderComment = await ShareholderComment.findByPk(
      shareholder.id,
      {
        include: [Shareholder],
      }
    );
    const changedFieldValues = getChangedFieldValues(
      foundShareholder,
      newShareholderComment
    );
    let ipAddress = await getIpAddress(req.ip);
    const eventLog = await createEventLog(
      req.user.id,
      eventResourceTypes.shareholderComment,
      newShareholderComment.shareholder.name,
      newShareholderComment.shareholder.id,
      eventActions.edit,
      changedFieldValues,
      ipAddress
    );
    res.status(200).json({ shareholder });
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};

const deleteShareholderComment = async (req, res) => {
  const id = req.params.id;
  const foundComment = await ShareholderComment.findByPk(id, {
    include: [Shareholder],
  });
  try {
    await ShareholderComment.destroy({ where: { id: id } });
    let ipAddress = await getIpAddress(req.ip);
    const eventLog = await createEventLog(
      req.user.id,
      eventResourceTypes.shareholderComment,
      foundComment.shareholder.name,
      foundComment.shareholder.id,
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
  getCommentByShareholder,
  deleteShareholderComment,
  getComment,
  editShareholderComment,
  createShareholderComment,
};
