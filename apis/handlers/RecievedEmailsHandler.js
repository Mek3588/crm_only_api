const RecievedEmail = require("../../models/RecievedEmail");
const { Op } = require("sequelize");
const {
  canUserCreate,
  canUserEdit,
  canUserDelete,
} = require("../../utils/Authrizations");
const { readUnseenEmails } = require("../../utils/EmailReciever");

//get
const getRecievedEmail = async (req, res) => {
  try {
    const { f, r, st, sc, sd } = req.query;
    await readUnseenEmails();
    const data = await RecievedEmail.findAndCountAll({
      offset: Number(f),
      limit: Number(r),
      order: [[sc || "createdAt", sd == 1 ? "ASC" : "DESC"]],
      where: getSearch(st),
    });
    res.status(200).json(data);
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};

const getRecievedEmailByPk = async (req, res) => {
  try {
    const recievedEmail = await RecievedEmail.findByPk(req.params.id).then(
      function (recievedEmail) {
        if (!recievedEmail) {
          res.status(404).json({ message: "No Data Found" });
        } else {
          res.status(200).json(recievedEmail);
        }
      }
    );
    // res.status(200).json(recievedEmail);
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};

const getRecievedEmailsByUser = async (req, res) => {
  const { from } = req.params;
  
  try {
    await readUnseenEmails();
    const data = await RecievedEmail.findAndCountAll({
      order: [['createdAt', 'ASC']], 
      where: { from: from },
    });
    res.status(200).json(data);
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};

const getAllRecievedEmails = async (req, res) => {
  try {
    const data = await RecievedEmail.findAndCountAll({
      order: [['createdAt', 'ASC']], 
    });
    res.status(200).json(data);
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};

const getSearch = (st) => {
  return {
    [Op.or]: [
      {
        subject: {
          [Op.like]: "%" + st + "%",
        },
      },
      {
        from: {
          [Op.like]: "%" + st + "%",
        },
      },
      {
        to: {
          [Op.like]: "%" + st + "%",
        },
      },
      {
        cc: {
          [Op.like]: "%" + st + "%",
        },
      },
      {
        message: {
          [Op.like]: "%" + st + "%",
        },
      },
    ],
  };
};

//posting
const createRecievedEmail = async (req, res) => {
  const recievedEmailBody = req.body;
  try {
    if (!(await canUserCreate(req.user, "recievedEmails"))) {
      return res.status(401).json({ msg: "unauthorized access!" });
    }
    const duplicateName = await RecievedEmail.findAll({
      where: { name: recievedEmailBody.name },
    });
    if (duplicateName.length > 0) {
      res.status(400).json({ msg: "RecievedEmail already registered!" });
      return;
    }
    const recievedEmail = await RecievedEmail.create(recievedEmailBody);
    res.status(200).json(recievedEmail);
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};

//put
const editRecievedEmail = async (req, res) => {
  const reqBody = req.body;
  const id = req.params.id;

  try {
    if (!(await canUserEdit(req.user, "recievedEmails"))) {
      return res.status(401).json({ msg: "unauthorized access!" });
    }
    const duplicateName = await RecievedEmail.findAll({
      where: { name: reqBody.name },
    });
    
    if (duplicateName.length !== 0) {
      if (duplicateName[0].id !== reqBody.id) {
        res.status(400).json({ msg: "RecievedEmail already added" });
        return;
      }
    }
    RecievedEmail.update(reqBody, { where: { id: id } });
    res.status(200).json({ id });
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};

const deleteRecievedEmail = async (req, res) => {
  const id = req.params.id;

  try {
    if (!(await canUserDelete(req.user, "recievedEmails"))) {
      return res.status(401).json({ msg: "unauthorized access!" });
    }
    RecievedEmail.destroy({ where: { id: id } });
    res.status(200).json({ id });
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};

module.exports = {
  getRecievedEmail,
  getRecievedEmailByPk,
  getRecievedEmailsByUser,
  createRecievedEmail,
  editRecievedEmail,
  deleteRecievedEmail,
  getAllRecievedEmails,
};
