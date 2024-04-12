const GradeLevel = require("../../models/GradeLevel");
const Country = require("../../models/Country");
const { Op } = require("sequelize");
// const {
//   canUserCreate,
//   canUserEdit,
//   canUserDelete,
// } = require("../../utils/Authrizations");

//get
const getGradeLevel = async (req, res) => {
  const { f, r, st, sc, sd } = req.query;
  try {
    const data = await GradeLevel.findAndCountAll({
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

const getGradeLevelByPk = async (req, res) => {
  try {
    const gradeLevel = await GradeLevel.findByPk(req.params.id).then(function (
      gradeLevel
    ) {
      if (!gradeLevel) {
        res.status(404).json({ message: "No Data Found" });
      } else {
        res.status(200).json(gradeLevel);
      }
    });

    // res.status(200).json(gradeLevel);
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};

const getAllGradeLevels = async (req, res) => {
  try {
    const data = await GradeLevel.findAndCountAll();
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
const createGradeLevel = async (req, res) => {
  const gradeLevelBody = req.body;
  try {
    // if (!(await canUserCreate(req.user, "gradeLevels"))) {
    //   return res.status(401).json({ msg: "unauthorized access!" });
    // }
    const duplicateName = await GradeLevel.findAll({
      where: { name: gradeLevelBody.name },
    });
    if (duplicateName.length > 0) {
      return res.status(400).json({ msg: "Grade Level already registered!" });
    }
    const gradeLevel = await GradeLevel.create(gradeLevelBody);
    res.status(200).json(gradeLevel);
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};

const createGradeLevels = async (req, res) => {
  const gradeLevelBody = req.body;
  var addedSaluationsNo = 0;
  var rejectedGradeLevelsNo = 0;
  try {
    var promises = await gradeLevelBody.map(async (gradeLevel) => {
      const duplicateName = await GradeLevel.findAll({
        where: { name: gradeLevel.name },
      });
      if (duplicateName.length > 0) {
        rejectedGradeLevelsNo += 1;
      } else {
        await GradeLevel.create(gradeLevel);
        addedSaluationsNo += 1;
      }
    });
    Promise.all(promises).then(function (results) {
      let msg = "";
      if (addedSaluationsNo != 0) {
        msg = msg + `${addedSaluationsNo} grade levels added`;
        
      }
      if (rejectedGradeLevelsNo != 0) {

        msg = msg + ` ${rejectedGradeLevelsNo} duplicate found`;
        
      }
      if (rejectedGradeLevelsNo != 0) {
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
const editGradeLevel = async (req, res) => {
  const reqBody = req.body;
  const id = req.params.id;

  try {
    // if (!(await canUserEdit(req.user, "gradeLevels"))) {
    //   return res.status(401).json({ msg: "unauthorized access!" });
    // }
    const duplicateName = await GradeLevel.findAll({
      where: { name: reqBody.name },
    });
    if (duplicateName.length > 0) {
      if (duplicateName[0].id !== reqBody.id) {
        return res.status(400).json({ msg: "Grade Level already registered!" });
      }
    }

    GradeLevel.update(
      reqBody,
      { where: { id: id } }
    );

    res.status(200).json({ id });
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};

const deleteGradeLevel = async (req, res) => {
  const id = req.params.id;

  try {
    // if (!(await canUserDelete(req.user, "gradeLevels"))) {
    //   return res.status(401).json({ msg: "unauthorized access!" });
    // }

    GradeLevel.destroy({ where: { id: id } });
    res.status(200).json({ id });
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};

module.exports = {
  getGradeLevel,
  getGradeLevelByPk,
  getAllGradeLevels,
  createGradeLevel,
  createGradeLevels,
  editGradeLevel,
  deleteGradeLevel,
};
