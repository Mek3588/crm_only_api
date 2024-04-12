const FireLoadingRate = require("../../../models/fire/FireLoadingRate.js");
const User = require("../../../models/acl/user");
const Employee = require("../../../models/Employee");
const { Op } = require("sequelize");
const {
  canUserCreate,
  canUserEdit,
  canUserDelete,
} = require("../../../utils/Authrizations");

const getSearch = (st) => {
  return {
    [Op.or]: [
      { name: { [Op.like]: `%${st}%` } },
      { code: { [Op.like]: `%${st}%` } },
      { description: { [Op.like]: `%${st}%` } },
    ],
  };
};

const getFireLoadingRate = async (req, res) => {
  const { f, r, st, sc, sd } = req.query;
  const currentUser = await User.findByPk(req.user.id, {
    include: [Employee],
  });
  //req.type = "all"
  try {
    if (req.type == "all") {
      const data = await FireLoadingRate.findAndCountAll({
        offset: Number(f),
        limit: Number(r),
        order: [[sc || "name", sd == 1 ? "ASC" : "DESC"]],
        where: getSearch(st),
      });
      res.status(200).json(data);
    }else if (req.type == "self"){
      const data = await FireLoadingRate.findAndCountAll({
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
      const data = await FireLoadingRate.findAndCountAll({
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
      const data = await FireLoadingRate.findAndCountAll({
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
      const data = await FireLoadingRate.findAndCountAll({
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

const getAllFireLoadingRates = async (req, res) => {
  try {
    const data = await FireLoadingRate.findAndCountAll();
    res.status(200).json(data);
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};

//posting
const createFireLoadingRate = async (req, res) => {
  const fireLoadingRateBody = req.body;
  try {
    // Replaced By middleware
    // if (!(await canUserCreate(req.user, "fireLoadingRates"))) {
    //   return res.status(401).json({ msg: "unauthorized access!" });
    // }
    const duplicateFireLoadingRateName = await FireLoadingRate.findAll({
      where: { name: fireLoadingRateBody.name },
    });
    if (duplicateFireLoadingRateName.length > 0) {
      res.status(400).json({ msg: "Loading already registered!" });
      return;
    }
    const fireLoadingRate = await FireLoadingRate.create(fireLoadingRateBody);
    res.status(200).json(fireLoadingRate);
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};

const createFireLoadingRates = async (req, res) => {
  const fireLoadingRateBody = req.body;
  const fireLoadingRate = [];
  var addedFireLoadingRates = 0;
  var rejectedFireLoadingRates = 0;
  try {
    // Replaced by middleware
    // if (!(await canUserCreate(req.user, "fireLoadingRates"))) {
    //   return res.status(401).json({ msg: "unauthorized access!" });
    // }

    var promises = fireLoadingRateBody.map(async (element) => {
      const duplicateName = await FireLoadingRate.findAll({
        where: { name: element.name },
      });
      if (duplicateName.length > 0) {
        rejectedFireLoadingRates += 1;
      } else if (duplicateName.length == 0) {
        fireLoadingRate.push(await FireLoadingRate.create(element));
        addedFireLoadingRates += 1;
      }
    });
    Promise.all(promises).then(function (results) {
      res
        .status(200)
        .json(
          `${addedFireLoadingRates} loadings are added and ${rejectedFireLoadingRates} are rejected due to duplication.`
        );
    });
    // const fireLoadingRate = await FireLoadingRate.create(fireLoadingRateBody);
    // res.status(200).json(fireLoadingRate);
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};

const getFireLoadingRateByPk = async (req, res) => {
  try {
    const fireLoadingRate = await FireLoadingRate.findByPk(req.params.id).then(function (
      fireLoadingRate
    ) {
      if (!fireLoadingRate) {
        res.status(404).json({ message: "No Data Found" });
      }
      res.status(200).json(fireLoadingRate);
    });

    res.status(200).json(fireLoadingRate);
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};

const editFireLoadingRate = async (req, res) => {
  const reqBody = req.body;
  const id = req.params.id;

  try {
    // Replaced By middleware
    // if (!(await canUserEdit(req.user, "fireLoadingRates"))) {
    //   return res.status(401).json({ msg: "unauthorized access!" });
    // }
    const duplicateFireLoadingRateName = await FireLoadingRate.findAll({
      where: { name: reqBody.name },
    });
    if (duplicateFireLoadingRateName.length !== 0)
      if (duplicateFireLoadingRateName[0].id !== reqBody.id) {
        res.status(400).json({ msg: "Loading already registered!" });
        return;
      }
    FireLoadingRate.update(reqBody, { where: { id: id } });

    res.status(200).json({ id });
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};

const deleteFireLoadingRate = async (req, res) => {
  const id = req.params.id;

  try {

    // Replaced by middleware
    // if (!(await canUserDelete(req.user, "fireLoadingRates"))) {
    //   return res.status(401).json({ msg: "unauthorized access!" });
    // }
    FireLoadingRate.destroy({ where: { id: id } });

    res.status(200).json({ id });
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};
const allowDuscountFireLoadingRate = async (req, res) => {
  const id = req.params.id;
  const { isDiscount } = req.body;

  try {
    const updated = await FireLoadingRate.update({ isDiscount }, { where: { id: id } });
    res.status(200).json({ updated });
    console.log("updated----->", updated)
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};


module.exports = {
  getFireLoadingRate,
  getAllFireLoadingRates,
  createFireLoadingRate,
  createFireLoadingRates,
  getFireLoadingRateByPk,
  editFireLoadingRate,
  deleteFireLoadingRate,
  allowDuscountFireLoadingRate,

};
