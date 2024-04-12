let { readEmail, readBody } = require("../../utils/EmailReciever");

const getAllEmails = async (req, res) => {
  try {
    res.status(200).json(readBody());
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};

const getEmailsByUser = async (req, res) => {
  try {
    readBody();
  } catch (error) {
    res.status(404).json({ msg: error.message });
  }
};

const getEmail = async (req, res) => {
  try {
    // await readBody();
    let mail = await readBody();
    
    res.status(200).json(mail);
  } catch (error) {
    res.status(404).json({ msg: error.message });
  }
};

module.exports = {
  getEmail,
  getAllEmails,
  getEmailsByUser,
};
