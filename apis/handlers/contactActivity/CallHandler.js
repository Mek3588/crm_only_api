const Call = require("../../../models/contactActivity/ContactCall");
const User = require("../../../models/acl/user");
const Contact = require("../../../models/Contact");
const Opportunity = require("../../../models/Opportunity");
const CompanyContact = require("../../../models/CompanyContact")
const ContactActivityUpdate = require("../../../models/contactActivity/ContactActivityUpdateHistory");
const {
  createEventLog,
  getIpAddress,
  getChangedFieldValues,
} = require("../../../utils/GeneralUtils");
const {
  eventResourceTypes,
  eventActions,
} = require("../../../utils/constants");
const getCall = async (req, res) => {
  try {
    const data = await Call.findAll({ include: [User] });
    res.status(200).json(data);
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};

const getCallByContact = async (req, res) => {
  const { target, id } = req.params;
  try {
    const { f, r, st, sc, sd } = req.query;
    const data = await Call.findAndCountAll({
      include: [User],
      where: { targetId: id, target },
      // order: [
      //   ["id", "DESC"],
      //   ["createdDate", "ASC"],
      // ],
      offset: Number(f),
      limit: Number(r),
      order: [[sc || "createdAt", sd == 1 ? "DESC" : "ASC"]],
      // where: getSearch(st),
      subQuery: false,
    });
    res.status(200).json(data);
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};
const createCall = async (req, res) => {
  const callBody = { ...req.body, userId: req.user.id };
  try {
    const call = await Call.create(callBody);
    const savedCall = await Call.findByPk(call.id);

    const value =
      savedCall.target == "account" || savedCall.target == "lead"
        ? await Contact.findByPk(savedCall.targetId)
        : savedCall.target == "opportunity"
          ? await Opportunity.findByPk(savedCall.targetId)
          : await CompanyContact.findByPk(savedCall.targetId);
    const name =
      savedCall.target == "account" || savedCall.target == "lead"
        ? value.firstName ?? value.companyName
        : savedCall.target == "opportunity"
          ? value.subject
          : value.firstName;
    let ipAddress = await getIpAddress(req.ip);
    const eventLog = await createEventLog(
      req.user.id,
      eventResourceTypes.call,
      name,
      value.id,
      eventActions.create,
      "",
      ipAddress
    );

    res.status(200).json(call);
  } catch (error) {
    
    res.status(400).json({ msg: error.message });
  }
};

const getCallByPk = async (req, res) => {
  try {
    const call = await Call.findByPk(req.params.id, { include: [User] }).then(
      function (Call) {
        if (!Call) {
          res.status(400).json({ message: "No Data Found" });
        } else {
          res.status(200).json(Call);
        }
      }
    );
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};

const editCall = async (req, res) => {
  const call = req.body;
  const id = req.body.id;
  
  try {
    const savedCall = await Call.findByPk(id);
    await Call.update(call, { where: { id: id } });
    const updatedCall = await Call.findByPk(id);
    //Call Type history
    if (call.callType !== savedCall.callType)
      await ContactActivityUpdate.create({
        userId: req.user.id,
        contactId: savedCall.targetId,
        activity: "Call",
        attribute: "Type",
        previous_status: savedCall.callType,
        current_status: call.callType,
      });

    //Call Topic history
    if (call.topic !== savedCall.topic)
      await ContactActivityUpdate.create({
        userId: req.user.id,
        contactId: savedCall.targetId,
        activity: "Call",
        attribute: "Topic",
        previous_status: savedCall.topic,
        current_status: call.topic,
      });

    //Call duration history
    if (call.callDuration !== savedCall.callDuration)
      await ContactActivityUpdate.create({
        userId: req.user.id,
        contactId: savedCall.targetId,
        activity: "Call",
        attribute: "Duration",
        previous_status: savedCall.callDuration,
        current_status: call.callDuration,
      });
    const value =
      savedCall.target == "account" || savedCall.target == "lead"
        ? await Contact.findByPk(savedCall.targetId)
        : savedCall.target == "opportunity"
          ? await Opportunity.findByPk(savedCall.targetId)
          : await CompanyContact.findByPk(savedCall.targetId);
    const name =
      savedCall.target == "account" || savedCall.target == "lead"
        ? value.firstName ?? value.companyName
        : savedCall.target == "opportunity"
          ? value.subject
          : value.firstName;

    const changedFieldValues = getChangedFieldValues(savedCall, updatedCall);
    let ipAddress = await getIpAddress(req.ip);
    const eventLog = await createEventLog(
      req.user.id,
      eventResourceTypes.call,
      name,
      value.id,
      eventActions.edit,
      changedFieldValues,
      ipAddress
    );
    res.status(200).json({ id });
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};

const deleteCall = async (req, res) => {
  const id = req.params.id;

  try {
    const savedCall = await Call.findByPk(id);

    const value =
      savedCall.target == "account" || savedCall.target == "lead"
        ? await Contact.findByPk(savedCall.targetId)
        : savedCall.target == "opportunity"
          ? await Opportunity.findByPk(savedCall.targetId)
          : await CompanyContact.findByPk(savedCall.targetId);
    const name =
      savedCall.target == "account" || savedCall.target == "lead"
        ? value.firstName ?? value.companyName
        : savedCall.target == "opportunity"
          ? value.subject
          : value.firstName;

    await Call.destroy({ where: { id: id } });

    let ipAddress = await getIpAddress(req.ip);
    const eventLog = await createEventLog(
      req.user.id,
      eventResourceTypes.call,
      name,
      value.id,
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
  getCall,
  createCall,
  getCallByPk,
  editCall,
  deleteCall,
  getCallByContact,
};
