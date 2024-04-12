const CommunicationHistory = require("../../models/ComunictionHistories");
const { isEmailValid, isPhoneNoValid } = require("../../utils/GeneralUtils");
const bcrypt = require("bcryptjs");
const Contact = require("../../models/Contact");
const User = require("../../models/acl/user");

const getCommunicationHistorys = async (req, res) => {
  const { contact_id } = req.params;
  
  try {
    const data = await CommunicationHistory.findAll({
      where: { contactId: contact_id },
      include: User,
      order: [["createdAt", "DESC"]],
    });
    
    res.status(200).json(data);
  } catch (error) {
    
    res.status(404).json({ msg: error.message });
  }
};

//posting
const createCommunicationHistory = async (req, res) => {
  try {
    const communicationHistory = await CommunicationHistory.create({
      ...req.body,
    });
    res.status(200).json(communicationHistory);
  } catch (error) {
    res.status(404).json({ msg: error.message });
  }
};

const getCommunicationHistory = async (req, res) => {
  try {
    const communicationHistory = await CommunicationHistory.findByPk(
      req.params.id,
      { order: [["createdAt", "DESC"]] }
    ).then(function (CommunicationHistory) {
      if (!communicationHistory) {
        res.status(404).json({ message: "No Data Found" });
      }
      res.status(200).json(communicationHistory);
    });

    res.status(200).json(communicationHistory);
  } catch (error) {
    res.status(404).json({ msg: error.message });
  }
};

const editCommunicationHistory = async (req, res) => {
  
  const reqBody = req.body;

  try {
    if (!isPhoneNoValid(phone)) {
      res.status(400).json({ msg: "Invalid phone number" });
      return;
    }
    if (!isEmailValid(email)) {
      res.status(400).json({ msg: "invalid email" });
      return;
    }
    CommunicationHistory.update(reqBody, { where: { id: id } });

    res.status(200).json({ id });
  } catch (error) {
    
    res.status(404).json({ msg: error.message });
  }
};

const deleteCommunicationHistory = async (req, res) => {
  const id = req.params.id;
  try {
    CommunicationHistory.destroy({ where: { id: id } });

    res.status(200).json({ id });
  } catch (error) {
    res.status(404).json({ msg: error.message });
  }
};

module.exports = {
  getCommunicationHistorys,
  createCommunicationHistory,
  getCommunicationHistory,
  editCommunicationHistory,
  deleteCommunicationHistory,
};
