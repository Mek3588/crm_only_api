const Account = require("../../models/Account");
const { canUserRead } = require("../../utils/Authrizations");
const { Role, ContactStatus } = require("../../utils/constants");
const { isEmailValid, isPhoneNoValid } = require("../../utils/GeneralUtils");

const fetchAccounts = async (user, stage) => {
  switch (user.role) {
    case Role.admin:
      return stage === "all"
        ? await Account.findAll({})
        : stage === ContactStatus.prospect
        ? await Account.findAll({ where: { status: ContactStatus.prospect } })
        : await Account.findAll({
            where: { status: ContactStatus.opportunity },
          });

    case Role.sales:
      return await Account.findAll({ where: { assigned_to: user.id } });

    default:
      return await Account.findAll({ where: { assigned_to: user.id } });
  }
};

const getAccounts = async (req, res) => {
  const { stage } = req.params;
  try {
    const data = await fetchAccounts(req.user, stage);
    res.status(200).json(data);
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};

const createAccount = async (req, res) => {
  const { name, industry, email, phone, address, status, assigned_to, branch } =
    req.body;
  try {
    if (!isPhoneNoValid(phone)) {
      res.status(400).json({ msg: "Invalid phone number" });
      return;
    }
    const contact = await Account.create({
      name: name,
      industry: industry,
      email: email,
      phone: phone,
      address: address,
      status: status,
      assigned_to: assigned_to,
      branch: branch,
    });
    res.status(200).json(contact);
  } catch (error) {
    
  }
};

const getAccount = async (req, res) => {
  try {
    const contact = await Account.findByPk(req.params.id).then(function (
      contact
    ) {
      if (!contact) {
        res.status(404).json({ message: "No Data Found" });
      }
      res.status(200).json(contact);
    });

    res.status(200).json(contact);
  } catch (error) {
    res.status(404).json({ msg: error.message });
  }
};

const editAccount = async (req, res) => {
  
  const {
    id,
    name,
    industry,
    email,
    phone,
    address,
    status,
    assigned_to,
    branch,
  } = req.body;

  try {
    if (!isEmailValid(email)) {
      res.status(400).json({ msg: "invalid email" });
      return;
    }
    if (!isPhoneNoValid(phone)) {
      res.status(400).json({ msg: "Invalid phone number" });
      return;
    }
    Account.update(
      {
        name: name,
        industry: industry,
        email: email,
        phone: phone,
        address: address,
        status: status,
        assigned_to: assigned_to,
        branch: branch,
      },
      { where: { id: id } }
    );

    res.status(200).json({ id });
  } catch (error) {
    
    res.status(404).json({ msg: error.message });
  }
};

const deleteAccount = async (req, res) => {
  const id = req.params.id;
  try {
    Account.destroy({ where: { id: id } });

    res.status(200).json({ id });
  } catch (error) {
    res.status(404).json({ msg: error.message });
  }
};

module.exports = {
  getAccounts,
  createAccount,
  getAccount,
  editAccount,
  deleteAccount,
};
