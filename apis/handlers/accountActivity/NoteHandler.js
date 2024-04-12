const AccountNote = require("../../../models/accountActivity/AccountNote");
const User = require("../../../models/acl/user");
const Contact = require("../../../models/Contact");

const getAccountNote = async (req, res) => {
  try {
    const data = await AccountNote.findAll({ include: [User,Contact] });
    res.status(200).json(data);
  } catch (error) {
     res.status(400).json({ msg: error.message });
  }
}; 

const createAccountNote = async (req, res) => {
  const noteBody = req.body
  try {
    const note = await AccountNote.create(noteBody);
    res.status(200).json(note);
  } catch (error) {
     res.status(400).json({ msg: error.message });
  }
}; 

const getAccountNoteByUser = async (req, res) => {
   const id = req.params.id
  try {
    const data = await AccountNote.findAll({ include: [User,Contact], where: { userId: id },  order: [
      ['id', 'DESC'],
      ['createdDate', 'ASC'],
  ], });
    res.status(200).json(data);
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};

const getAccountNoteByContact = async (req, res) => {
   const id = req.params.id
  try {
    const data = await AccountNote.findAll({ include: [Contact,User], where: { contactId: id },  order: [
      ['id', 'DESC'],
      ['createdDate', 'ASC'],
  ], });
    res.status(200).json(data);
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};

const getAccountNoteByPk = async (req, res) => {
  try {
    const note = await AccountNote.findByPk(req.params.id,{ include: [User,Contact] }).then(function (
      AccountNote
    ) {  
      if (!AccountNote) {
        res.status(400).json({ message: "No Data Found" });
      }
      else {
        res.status(200).json(AccountNote);
      }
    });

   
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};

const editAccountNote = async (req , res) => {
   const note = req.body
   const id = req.body.id

  try {
    
    AccountNote.update(note,
      { where: { id: id } }
    );
    res.status(200).json({ id });
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};

const deleteAccountNote = async (req, res) => {
  const  id  = req.params.id;

  try {
    AccountNote.destroy({ where: { id: id } });

    res.status(200).json({ id });
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};



module.exports = {
  getAccountNote,
  createAccountNote,
  getAccountNoteByPk,
  getAccountNoteByUser,
  editAccountNote,
  deleteAccountNote,
  getAccountNoteByContact,
 
};
