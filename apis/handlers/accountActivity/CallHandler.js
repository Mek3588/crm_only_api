const AccountCall = require("../../../models/accountActivity/AccountCall");
const User = require("../../../models/acl/user");
const Contact = require("../../../models/Contact")

const getAccountCall = async (req, res) => {
  try {
    const data = await Call.findAll({ include: [User,Contact] });
    res.status(200).json(data);
  } catch (error) {
     res.status(400).json({ msg: error.message });
  }
}; 

const getAccountCallByContact = async (req, res) => {
   const id = req.params.id
  try {
    const data = await AccountCall.findAll({ include: [Contact,User], where: { contactId: id } ,  order: [
      ['id', 'DESC'],
      ['createdDate', 'ASC'],
  ], });
    res.status(200).json(data);
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};
const createAccountCall = async (req, res) => {
  const callBody = req.body
  try {
    const call = await AccountCall.create(callBody);
    res.status(200).json(call);
  } catch (error) {
     res.status(400).json({ msg: error.message });
  }
}; 

const getAccountCallByPk = async (req, res) => {
  try {
    const call = await AccountCall.findByPk(req.params.id,{ include: [User,Contact] ,  order: [
      ['id', 'DESC'],
      ['createdDate', 'ASC'],
  ], }).then(function (
      AccountCall
    ) {
      if (!AccountCall) {
        res.status(400).json({ message: "No Data Found" });
      }
      else {
        res.status(200).json(AccountCall);
      }
    });

   
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};

const editAccountCall = async (req , res) => {
   const call = req.body
   const id = req.body.id

  try {
    
    AccountCall.update(call,
      { where: { id: id } }
    );
    res.status(200).json({ id });
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};

const deleteAccountCall = async (req, res) => {
  const  id  = req.params.id;

  try {
    AccountCall.destroy({ where: { id: id } });

    res.status(200).json({ id });
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};

module.exports = {
  getAccountCall: getAccountCall,
  createAccountCall,
  getAccountCallByPk,
  editAccountCall,
  deleteAccountCall,
  getAccountCallByContact
};
