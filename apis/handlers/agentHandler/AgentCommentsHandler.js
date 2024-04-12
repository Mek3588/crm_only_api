const User = require("../../../models/acl/user");
const Employee = require("../../../models/Employee");
const AgentComment = require("../../../models/agent/AgentComment");
const VendorComment = require("../../../models/vendor/VendorComment");
const Vendor = require("../../../models/vendor/Vendors");
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
const Agent = require("../../../models/agent/Agent");
const getCommentByAgent = async (req, res) => {
  try {
    
    const data = await AgentComment.findAll({
      include: [{ model: User, include: [Employee] }],
      where: { agentId: req.params.id },
    });
    res.status(200).json(data);
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};

const getComment = async (req, res) => {
  try {
    const data = await AgentComment.findAll({
      include: [{ model: User, include: [Employee] }],
    });
    res.status(200).json(data);
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};

const createAgentComment = async (req, res) => {
  const body = req.body;
  try {
    const agent = await AgentComment.create(body);
    const newAgent = await AgentComment.findByPk(agent.id, {
      include: [Agent],
    });
    let ipAddress = getIpAddress(req.ip);
    const eventLog = createEventLog(
      req.user.id,
      eventResourceTypes.agentComment,
      newAgent.agent.firstName,
      newAgent.id,
      eventActions.create,
      "",
      ipAddress
    );
    res.status(200).json(agent);
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};

const editAgentComment = async (req, res) => {
  const agent = req.body;

  try {
    const foundAgent = await AgentComment.findByPk(agent.id);
    await AgentComment.update(agent, { where: { id: agent.id } });
    const updatedAgent = await AgentComment.findByPk(agent.id, {
      include: [Agent],
    });
    const changedFieldValues = getChangedFieldValues(foundAgent, updatedAgent);
    let ipAddress = getIpAddress(req.ip);
    const eventLog = await createEventLog(
      req.user.id,
      eventResourceTypes.agentComment,
      updatedAgent.agent.firstName,
      updatedAgent.id,
      eventActions.edit,
      changedFieldValues,
      ipAddress
    );
    res.status(200).json({ agent });
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};

const deleteAgentComment = async (req, res) => {
  const id = req.params.id;

  try {
    const updatedAgent = await AgentComment.findByPk(id, {
      include: [Agent],
    });
    await AgentComment.destroy({ where: { id: id } });
    let ipAddress = getIpAddress(req.ip);
    const eventLog = createEventLog(
      req.user.id,
      eventResourceTypes.agentComment,
      updatedAgent.agent.firstName,
      updatedAgent.id,
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
  getCommentByAgent,
  deleteAgentComment,
  getComment,
  editAgentComment,
  createAgentComment,
};
