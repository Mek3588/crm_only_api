const User = require("../../../models/acl/user");
const Employee = require("../../../models/Employee");
const OrganizationComment = require("../../../models/broker/OrganizationComment");
const {
  eventResourceTypes,
  eventActions,
} = require("../../../utils/constants");
//activate , com'ment
const {
  createEventLog,
  getIpAddress,
  getChangedFieldValues,
} = require("../../../utils/GeneralUtils");
const Organization = require("../../../models/broker/Organization");

//activate , com'ment

const getCommentByOrganization = async (req, res) => {
  try {
    
    const data = await OrganizationComment.findAll({
      include: [{ model: User, include: [Employee] }],
      where: { organizationId: req.params.id },
    });
    res.status(200).json(data);
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};

const getComment = async (req, res) => {
  try {
    const data = await OrganizationComment.findAll({
      include: [{ model: User, include: [Employee] }],
    });
    res.status(200).json(data);
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};

const createOrganizationComment = async (req, res) => {
  const body = req.body;
  try {
    const organization = await OrganizationComment.create(body);
    const newOrganization = await OrganizationComment.findByPk(
      organization.id,
      { include: [Organization] }
    );
    let ipAddress = getIpAddress(req.ip);
    const eventLog = createEventLog(
      req.user.id,
      eventResourceTypes.agentComment,
      newOrganization.organization.name,
      newOrganization.id,
      eventActions.create,
      "",
      ipAddress
    );
    res.status(200).json(organization);
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};

const editOrganizationComment = async (req, res) => {
  const organization = req.body;

  try {
    foundAgent = await OrganizationComment.findByPk(organization.id);
    await OrganizationComment.update(organization, {
      where: { id: organization.id },
    });
    const newOrganization = await OrganizationComment.findByPk(
      organization.id,
      { include: [Organization] }
    );
    const changedFieldValues = getChangedFieldValues(
      foundAgent,
      newOrganization
    );
    let ipAddress = getIpAddress(req.ip);
    const eventLog = createEventLog(
      req.user.id,
      eventResourceTypes.brokerComment,
      newOrganization.organization.name,
      newOrganization.id,
      eventActions.edit,
      "",
      ipAddress
    );
    res.status(200).json({ organization });
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};

const deleteOrganizationComment = async (req, res) => {
  const id = req.params.id;

  try {
    foundAgent = await OrganizationComment.findByPk(id, {
      include: [Organization],
    });
    await OrganizationComment.destroy({ where: { id: id } });
    let ipAddress = getIpAddress(req.ip);
    const eventLog = createEventLog(
      req.user.id,
      eventResourceTypes.brokerComment,
      foundAgent.organization.name,
      foundAgent.id,
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
  getCommentByOrganization,
  deleteOrganizationComment,
  getComment,
  editOrganizationComment,
  createOrganizationComment,
};
