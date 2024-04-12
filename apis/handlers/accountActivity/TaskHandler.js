const AccountTask = require("../../../models/accountActivity/AccountTask");
const User = require("../../../models/acl/user");
const Contact = require("../../../models/Contact");


const getAccountTask = async (req, res) => {
  try {
    const data = await AccountTask.findAll({ include: [User,Contact] });
    res.status(200).json(data);
  } catch (error) {
     res.status(400).json({ msg: error.message });
  }
}; 

const getAccountTaskByUser = async (req, res) => {
   const id = req.params.id
  try {
    const data = await AccountTask.findAll({ include: [User,Contact], where: { userId: id } });
    res.status(200).json(data);
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};

const getAccountTaskByContact = async (req, res) => {
   const id = req.params.id
  try {
    const data = await AccountTask.findAll({ include: [Contact,User], where: { contactId: id } });
    res.status(200).json(data);
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};


const createAccountTask = async (req, res) => {
  const taskBody = req.body
  try {
    const task = await AccountTask.create(taskBody);
    res.status(200).json(task);
  } catch (error) {
     res.status(400).json({ msg: error.message });
  }
}; 

const getAccountTaskByPk = async (req, res) => {
  try {
    const task = await AccountTask.findByPk(req.params.id,{ include: [User,Contact] }).then(function (
      AccountTask
    ) {
      if (!AccountTask) {
        res.status(400).json({ message: "No Data Found" });
      }
      else {
        res.status(200).json(AccountTask);
      }
    });
   
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};

const editAccountTask = async (req , res) => {
   const task = req.body
   const id = req.body.id

  try {
    
    AccountTask.update(task,
      { where: { id: id } }
    );
    res.status(200).json({ id });
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};

const deleteAccountTask = async (req, res) => {
  const  id  = req.params.id;

  try {
    AccountTask.destroy({ where: { id: id } });

    res.status(200).json({ id });
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};

module.exports = {
  getAccountTask,
  createAccountTask,
  getAccountTaskByPk,
  editAccountTask,
  getAccountTaskByContact,
  getAccountTaskByUser,
  deleteAccountTask,
};
