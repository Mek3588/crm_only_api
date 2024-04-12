const ContactActivityUpdate = require("../../../models/contactActivity/ContactActivityUpdateHistory");
const { isEmailValid, isPhoneNoValid } = require("../../../utils/GeneralUtils");
const bcrypt = require("bcryptjs");
const Contact = require("../../../models/Contact");
const User = require("../../../models/acl/user");


const getContactActivityUpdates = async (req, res) => {
  const { contact_id } = req.params;
  
  try {
    const data = await ContactActivityUpdate.findAll(
      {
        where: { contactId: contact_id }, include: [{ model: User, attributes: ['id', 'corporate_name', 'first_name', 'middle_name', 'last_name', 'email', 'phone', 'gender'] }], order: [['createdAt', 'DESC']]
      });

    res.status(200).json(data);
  } catch (error) {
    
    res.status(404).json({ msg: error.message });
  }
};

//posting
const createContactActivityUpdate = async (req, res) => {
  try {
    const updateHistory = await ContactActivityUpdate.create({ ...req.body });
    res.status(200).json(updateHistory);
  } catch (error) {
    res.status(404).json({ msg: error.message });
  }
};

const getContactActivityUpdate = async (req, res) => {
  try {
    const updateHistory = await ContactActivityUpdate.findByPk(req.params.id, { order: [["createdAt", "DESC"]] })
    if (!updateHistory) {
      res.status(404).json({ message: "No Data Found" });
    }
    else {
      res.status(200).json(updateHistory);
    }
  } catch (error) {
    res.status(404).json({ msg: error.message });
  }
};

const editContactActivityUpdate = async (req, res) => {
  
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
    ContactActivityUpdate.update(
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

const deleteContactActivityUpdate = async (req, res) => {
  const id = req.params.id;
  try {
    ContactActivityUpdate.destroy({ where: { id: id } });

    res.status(200).json({ id });
  } catch (error) {
    res.status(404).json({ msg: error.message });
  }
};


module.exports = {
  getContactActivityUpdates,
  createContactActivityUpdate,
  getContactActivityUpdate,
  editContactActivityUpdate,
  deleteContactActivityUpdate,
};
