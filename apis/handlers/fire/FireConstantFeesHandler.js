const FireConstantFees = require("../../../models/fire/FireConstantFees.js");
const User = require("../../../models/acl/user");
const Employee = require("../../../models/Employee");
const { Op } = require("sequelize");
const {
  canUserCreate,
  canUserEdit,
  canUserDelete,
} = require("../../../utils/Authrizations");
const { currentUser } = require("../../../utils/GeneralUtils.js");

const getSearch = (st) => {
  return {
    [Op.or]: [
      { name: { [Op.like]: `%${st}%` } },
      { code: { [Op.like]: `%${st}%` } },
      { description: { [Op.like]: `%${st}%` } },
    ],
  };
};

const getFireConstantFees = async (req, res) => {
  const { f, r, st, sc, sd } = req.query;
  const currentUser = await User.findByPk(req.user.id, {
    include: [Employee],
  });
  //req.type = "all"
  try {
    if (req.type == "all") {
      const data = await FireConstantFees.findAndCountAll({
        offset: Number(f),
        limit: Number(r),
        order: [[sc || "name", sd == 1 ? "ASC" : "DESC"]],
        where: getSearch(st),
      });
      res.status(200).json(data);
    }else if (req.type == "self"){
      const data = await FireConstantFees.findAndCountAll({
        offset: Number(f),
        limit: Number(r),
        order: [[sc || "name", sd == 1 ? "ASC" : "DESC"]],
        where: {
          userId: currentUser.id,
          ...getSearch(st),
        }
      });
      res.status(200).json(data);
    }else if (req.type == "customer"){
      const data = await FireConstantFees.findAndCountAll({
        offset: Number(f),
        limit: Number(r),
        order: [[sc || "name", sd == 1 ? "ASC" : "DESC"]],
        where: {
          userId: currentUser.id,
          ...getSearch(st),
        }
      });
      res.status(200).json(data);
    }else if (req.type == "branch"){
      const data = await FireConstantFees.findAndCountAll({
        offset: Number(f),
        limit: Number(r),
        order: [[sc || "name", sd == 1 ? "ASC" : "DESC"]],
        where: {
          "$user.employee.branchId$": currentUser.employee.branchId,
          ...getSearch(st),
        }
      });
      res.status(200).json(data);
    }else if (req.type == "branchAndSelf"){
      const data = await FireConstantFees.findAndCountAll({
        offset: Number(f),
        limit: Number(r),
        order: [[sc || "name", sd == 1 ? "ASC" : "DESC"]],
        where: {
          userId: currentUser.id,
          "$user.employee.branchId$": currentUser.employee.branchId,
          ...getSearch(st),
        }
      });
      res.status(200).json(data);
    }
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};

const getAllFireConstantFeess = async (req, res) => {
  try {
    const data = await FireConstantFees.findAndCountAll();
    res.status(200).json(data);
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};

//posting
const createFireConstantFees = async (req, res) => {
  const fireConstantFeesBody = req.body;
  try {
    // Replaced by middleware
    // if (!(await canUserCreate(req.user, "fireConstantFeess"))) {
    //   return res.status(401).json({ msg: "unauthorized access!" });
    // }
    const duplicateFireConstantFeesName = await FireConstantFees.findAll({
      where: { name: fireConstantFeesBody.name },
    });
    if (duplicateFireConstantFeesName.length > 0) {
      res.status(400).json({ msg: "Loading already registered!" });
      return;
    }
    const fireConstantFees = await FireConstantFees.create(fireConstantFeesBody);
    res.status(200).json(fireConstantFees);
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};

const createFireConstantFeess = async (req, res) => {
  const fireConstantFeesBody = req.body;
  const fireConstantFees = [];
  var addedFireConstantFeess = 0;
  var rejectedFireConstantFeess = 0;
  try {
    // Replaced By middleware
    // if (!(await canUserCreate(req.user, "fireConstantFeess"))) {
    //   return res.status(401).json({ msg: "unauthorized access!" });
    // }

    var promises = fireConstantFeesBody.map(async (element) => {
      const duplicateName = await FireConstantFees.findAll({
        where: { name: element.name },
      });
      if (duplicateName.length > 0) {
        rejectedFireConstantFeess += 1;
      } else if (duplicateName.length == 0) {
        fireConstantFees.push(await FireConstantFees.create(element));
        addedFireConstantFeess += 1;
      }
    });
    Promise.all(promises).then(function (results) {
      res
        .status(200)
        .json(
          `${addedFireConstantFeess} loadings are added and ${rejectedFireConstantFeess} are rejected due to duplication.`
        );
    });
    // const fireConstantFees = await FireConstantFees.create(fireConstantFeesBody);
    // res.status(200).json(fireConstantFees);
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};

const getFireConstantFeesByPk = async (req, res) => {
  try {
    const fireConstantFees = await FireConstantFees.findByPk(req.params.id).then(function (
      fireConstantFees
    ) {
      if (!fireConstantFees) {
        res.status(404).json({ message: "No Data Found" });
      }
      res.status(200).json(fireConstantFees);
    });

    res.status(200).json(fireConstantFees);
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};

const editFireConstantFees = async (req, res) => {
  const reqBody = req.body;
  const id = req.params.id;

  try {
    // Replaced By Middleware
    // if (!(await canUserEdit(req.user, "fireConstantFeess"))) {
    //   return res.status(401).json({ msg: "unauthorized access!" });
    // }
    const duplicateFireConstantFeesName = await FireConstantFees.findAll({
      where: { name: reqBody.name },
    });
    if (duplicateFireConstantFeesName.length !== 0)
      if (duplicateFireConstantFeesName[0].id !== reqBody.id) {
        res.status(400).json({ msg: "Loading already registered!" });
        return;
      }
    FireConstantFees.update(reqBody, { where: { id: id } });

    res.status(200).json({ id });
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};

const deleteFireConstantFees = async (req, res) => {
  const id = req.params.id;

  try {
    // Replaced by middleware
    // if (!(await canUserDelete(req.user, "fireConstantFeess"))) {
    //   return res.status(401).json({ msg: "unauthorized access!" });
    // }
    FireConstantFees.destroy({ where: { id: id } });

    res.status(200).json({ id });
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};

module.exports = {
  getFireConstantFees,
  getAllFireConstantFeess,
  createFireConstantFees,
  createFireConstantFeess,
  getFireConstantFeesByPk,
  editFireConstantFees,
  deleteFireConstantFees,
};
