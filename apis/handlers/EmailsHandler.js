const { isEmailValid } = require("../../utils/GeneralUtils");
const Email = require("../../models/Email");
const Contact = require("../../models/Contact");
const { Op } = require("sequelize");

const getEmails = async (req, res) => {
  
  const id = req.query.id;
  const category = req.query.category;
  
  try {
    const data = await Email.findAll({
      where: { ownerId: id, category: category },
    });
    res.status(200).json(data);
  } catch (error) {
    res.status(400).json({ msg: error.message });
  } 
};

const getAllEmails = async (req, res) => {
  try {
    const data = await Email.findAll();
    res.status(200).json(data);
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};

//posting
const createEmail = async (req, res) => {
  try {
    const contactFound = await Contact.findOne({
      where: {
        [Op.and]: [
          { id: { [Op.like]: req.body.ownerId } },
          {
            [Op.or]: [
              { primaryEmail: { [Op.like]: req.body.email } },
              { secondaryEmail: { [Op.like]: req.body.email } },
            ],
          },
        ],
      },
    });
    const foundEmail = await Email.findOne({
      where: {
        [Op.and]: [
          { email: { [Op.like]: req.body.email } },
          { ownerId: { [Op.like]: req.body.ownerId } },
        ],
      },
    });
    if (!isEmailValid(req.body.email)) {
      res.status(400).json({ msg: "invalid email" });
      return;
    } else if (contactFound != null || foundEmail != null) {
      res.status(400).json({ msg: "Email exists" });
      return;
    } else {
      const email = await Email.create({
        ...req.body,
      });
      res.status(200).json(email);
    }
  } catch (error) {
    
  }
};

const getEmail = async (req, res) => {
  
  try {
    const emails = await Email.findAll({
      where: { ownerId: req.params.id, category: req.params.category },
    });
    res.status(200).json(emails);
  } catch (error) {
    res.status(404).json({ msg: error.message });
  }
};

const editEmail = async (req, res) => {
  const { id, type, email } = req.body;
  if (!isEmailValid(email)) {
    res.status(400).json({ msg: "invalid email" });
    return;
  }
  try {
    await Email.update(
      {
        type,
        email,
      },

      { where: { id: id } }
    );

    res.status(200).json({ id });
  } catch (error) {
    res.status(404).json({ msg: error.message });
  }
};

const deleteEmail = async (req, res) => {
  const id = req.params.id;
  try {
    Email.destroy({ where: { id: id } });

    res.status(200).json({ id });
  } catch (error) {
    res.status(404).json({ msg: error.message });
  }
};

module.exports = {
  getEmails,
  getAllEmails,
  createEmail,
  getEmail,
  editEmail,
  deleteEmail,
};
