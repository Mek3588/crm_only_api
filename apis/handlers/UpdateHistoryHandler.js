const UpdateHistory = require("../../models/UpdateHistory");
const { isEmailValid, isPhoneNoValid } = require("../../utils/GeneralUtils");
const bcrypt = require("bcryptjs");
const Contact = require("../../models/Contact");
const User = require("../../models/acl/user");

const getUpdateHistorys = async (req, res) => {
  const { contact_id } = req.params;
  
  try {
    const data = await UpdateHistory.findAll({
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
const createUpdateHistory = async (req, res) => {
  try {
    const updateHistory = await UpdateHistory.create({ ...req.body });
    res.status(200).json(updateHistory);
  } catch (error) {
    res.status(404).json({ msg: error.message });
  }
};

const getUpdateHistory = async (req, res) => {
  try {
    const updateHistory = await UpdateHistory.findByPk(req.params.id, {
      order: [["createdAt", "DESC"]],
    }).then(function (UpdateHistory) {
      if (!updateHistory) {
        res.status(404).json({ message: "No Data Found" });
      }
      res.status(200).json(updateHistory);
    });

    res.status(200).json(updateHistory);
  } catch (error) {
    res.status(404).json({ msg: error.message });
  }
};

const editUpdateHistory = async (req, res) => {
  
  const {
    id,
    first_name,
    last_name,
    attribute,
    email,
    phone,
    branch_id,
    department_id,
    role_id,
  } = req.body;

  try {
    if (!isPhoneNoValid(phone)) {
      res.status(400).json({ msg: "Invalid phone number" });
      return;
    }
    if (!isEmailValid(email)) {
      res.status(400).json({ msg: "invalid email" });
      return;
    }
    UpdateHistory.update(
      {
        first_name: first_name,
        last_name: last_name,
        attribute: attribute,
        email: email,
        phone: phone,
        branch_id: branch_id,
        department_id: department_id,
        role_id: role_id,
      },

      { where: { id: id } }
    );

    res.status(200).json({ id });
  } catch (error) {
    
    res.status(404).json({ msg: error.message });
  }
};

const deleteUpdateHistory = async (req, res) => {
  const id = req.params.id;
  try {
    UpdateHistory.destroy({ where: { id: id } });

    res.status(200).json({ id });
  } catch (error) {
    res.status(404).json({ msg: error.message });
  }
};

module.exports = {
  getUpdateHistorys,
  createUpdateHistory,
  getUpdateHistory,
  editUpdateHistory,
  deleteUpdateHistory,
};
