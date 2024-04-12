const AccountMeeting = require("../../../models/accountActivity/AccountMeeting");
const User = require("../../../models/acl/user");
const Contact = require("../../../models/Contact")


const getAccountMeeting = async (req, res) => {
  try {
    const data = await AccountMeeting.findAll({ include: [User,Contact] });
    res.status(200).json(data);
  } catch (error) {
     res.status(400).json({ msg: error.message });
  }
}; 


const createAccountMeeting = async (req, res) => {
  const meetingBody = req.body
  try {
    const meeting = await AccountMeeting.create(meetingBody);
    res.status(200).json(meeting);
  } catch (error) {
     res.status(400).json({ msg: error.message });
  }
}; 

const getAccountMeetingByPk = async (req, res) => {
  try {
    const meeting = await AccountMeeting.findByPk(req.params.id,{ include: [User,Contact] ,  order: [
      ['id', 'DESC'],
      ['createdDate', 'ASC'],
  ], }).then(function (
      AccountMeeting
    ) {
      if (!AccountMeeting) {
        res.status(400).json({ message: "No Data Found" });
      }
      else {
        res.status(200).json(AccountMeeting);
      }
    });

   
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};

const editAccountMeeting = async (req , res) => {
   const meeting = req.body
   const id = req.body.id

  try {
    
    AccountMeeting.update(meeting,
      { where: { id: id } }
    );
    res.status(200).json({ id });
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};

const deleteAccountMeeting = async (req, res) => {
  const  id  = req.params.id;

  try {
    AccountMeeting.destroy({ where: { id: id } });

    res.status(200).json({ id });
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};

const getAccountMeetingByContact = async (req, res) => {
   const id = req.params.id
  try {
    const data = await AccountMeeting.findAll({ include: [Contact,User], where: { contactId: id },  order: [
      ['id', 'DESC'],
      ['createdDate', 'ASC'],
  ], });
    res.status(200).json(data);
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};
module.exports = {
  getAccountMeeting,
  createAccountMeeting,
  getAccountMeetingByPk,
  editAccountMeeting,
  deleteAccountMeeting,
  getAccountMeetingByContact,
};
