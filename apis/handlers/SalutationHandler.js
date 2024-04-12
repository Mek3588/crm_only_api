const Salutation = require("../../models/Salutation");
const Country = require("../../models/Country");
const { Op } = require("sequelize");
// const {
//   canUserCreate,
//   canUserEdit,
//   canUserDelete,
// } = require("../../utils/Authrizations");
const Department = require("../../models/Department");

//get
const getSalutation = async (req, res) => {
  const { f, r, st, sc, sd } = req.query;
  try {
    const data = await Salutation.findAndCountAll({
      offset: Number(f),
      limit: Number(r),
      order: [[sc || "name", sd == 1 ? "ASC" : "DESC"]],
      where: getSearch(st),
    });
    res.status(200).json(data);
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};

const getSalutationByPk = async (req, res) => {
  try {
    const salutation = await Salutation.findByPk(req.params.id).then(function (
      salutation
    ) {
      if (!salutation) {
        res.status(404).json({ message: "No Data Found" });
      } else {
        res.status(200).json(salutation);
      }
    });

    // res.status(200).json(salutation);
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};

const getAllSalutation = async (req, res) => {
  try {
    const data = await Salutation.findAndCountAll();
    res.status(200).json(data);
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};

const getSearch = (st) => {
  return {
    [Op.or]: [
      {
        name: {
          [Op.like]: "%" + st + "%",
        },
      },
      {
        description: {
          [Op.like]: "%" + st + "%",
        },
      },
    ],
  };
};


//posting
const createSalutation = async (req, res) => {
  const salutationBody = req.body;
  try {
    // if (!(await canUserCreate(req.user, "salutations"))) {
    //   return res.status(401).json({ msg: "unauthorized access!" });
    // }
    const duplicateName = await Salutation.findAll({
      where: { name: salutationBody.name }
    });
    if (duplicateName.length > 0) {
      return res.status(400).json({ msg: "Salutation already registered!" });
    }
    const salutation = await Salutation.create(salutationBody);
    res.status(200).json(salutation);
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};

const createSalutations = async (req, res) => {
  const salutationBody = req.body;
  var addedSaluationsNo = 0;
  var rejectedSalutationsNo = 0;
  try {
    var promises = await salutationBody.map(async (salutation) => {
      const duplicateName = await Salutation.findAll({
        where: { name: salutation.name },
      });
      if (duplicateName.length > 0) {
        rejectedSalutationsNo += 1;
      } else {
        await Salutation.create(salutation);
        addedSaluationsNo += 1;
      }
    });
    Promise.all(promises).then(function (results) {
      let msg = "";
      if (addedSaluationsNo != 0) {
        msg = msg + `${addedSaluationsNo} salutation added`;
        
      }
      if (rejectedSalutationsNo != 0) {
        

        msg = msg + ` ${rejectedSalutationsNo} duplicate found`;
        
      }

      if (rejectedSalutationsNo != 0) {
        res.status(400).json({ msg: msg });
      } else {
        res.status(200).json({ msg: msg });
      }
    });
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};

//put
const editSalutation = async (req, res) => {
  const reqBody = req.body;
  const id = req.params.id;

  try {
    // if (!(await canUserEdit(req.user, "salutations"))) {
    //   return res.status(401).json({ msg: "unauthorized access!" });
    // }
    const duplicateName = await Salutation.findAll({
      where: { name: reqBody.name }
    });
    if (duplicateName.length > 0) {
      if (duplicateName[0].id !== reqBody.id) {
        return res.status(400).json({ msg: "Salutation already registered!" });
      }
    }
    Salutation.update(
      reqBody,

      { where: { id: id } }
    );

    res.status(200).json({ id });
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};

const deleteSalutation = async (req, res) => {
  const id = req.params.id;

  try {
    // if (!(await canUserDelete(req.user, "salutations"))) {
    //   return res.status(401).json({ msg: "unauthorized access!" });
    // }
    Salutation.destroy({ where: { id: id } });
    res.status(200).json({ id });
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};

module.exports = {
  getSalutation,
  getSalutationByPk,
  getAllSalutation,
  createSalutation,
  createSalutations,
  editSalutation,
  deleteSalutation,
};
