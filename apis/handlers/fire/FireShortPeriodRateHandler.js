const FireShortPeriodRate = require("../../../models/fire/FireShortPeriodRate");
const User = require("../../../models/acl/user");
const Employee = require("../../../models/Employee");
const { Op } = require("sequelize");
// const {
//   canUserCreate,
//   canUserEdit,
//   canUserDelete,
// } = require("../../../utils/Authrizations");

const getSearch = (st) => {
  return {
    [Op.or]: [
      { minDuration: { [Op.like]: `%${st}%` } },
      { maxDuration: { [Op.like]: `%${st}%` } },
      { rate: { [Op.like]: `%${st}%` } },
    ],
  };
};

const getFireShortPeriodRate = async (req, res) => {
  const { f, r, st, sc, sd } = req.query;

  const currentUser = await User.findByPk(req.user.id, {
    include: [Employee],
  });
  //req.type = "all"
  try {
    
    if (req.type == "all") {
      const data = await FireShortPeriodRate.findAndCountAll({
        offset: Number(f),
        limit: Number(r),
        order: [[sc || "createdAt", sd == 1 ? "ASC" : "DESC"]],
        where: getSearch(st),
      });
      res.status(200).json(data);
    }else if (req.type == "self"){
      const data = await FireShortPeriodRate.findAndCountAll({
        offset: Number(f),
        limit: Number(r),
        order: [[sc || "createdAt", sd == 1 ? "ASC" : "DESC"]],
        where: {
          userId: currentUser.id,
          ...getSearch(st),
        }
      });
      res.status(200).json(data);
    }else if (req.type == "customer"){
      const data = await FireShortPeriodRate.findAndCountAll({
        offset: Number(f),
        limit: Number(r),
        order: [[sc || "createdAt", sd == 1 ? "ASC" : "DESC"]],
        where: {
          userId: currentUser.id,
          ...getSearch(st),
        }
      });
      res.status(200).json(data);
    }else if (req.type == "branch"){
      const data = await FireShortPeriodRate.findAndCountAll({
        offset: Number(f),
        limit: Number(r),
        order: [[sc || "createdAt", sd == 1 ? "ASC" : "DESC"]],
        where: {
          "$user.employee.branchId$": currentUser.employee.branchId,
          ...getSearch(st),
        }
      });
      res.status(200).json(data);
    }else if (req.type == "branchAndSelf"){
      const data = await FireShortPeriodRate.findAndCountAll({
        offset: Number(f),
        limit: Number(r),
        order: [[sc || "createdAt", sd == 1 ? "ASC" : "DESC"]],
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

const getAllFireShortPeriodRates = async (req, res) => {
  try {
    const data = await FireShortPeriodRate.findAndCountAll();
    res.status(200).json(data);
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};

//posting
const createFireShortPeriodRate = async (req, res) => {
  const fireShortPeriodRateBody = req.body;
  try {
    // Replaced By middleware
    // if (!(await canUserCreate(req.user, "fireShortPeriodRates"))) {
    //   return res.status(401).json({ msg: "unauthorized access!" });
    // }
    const existingFireShortPeriodRate = await FireShortPeriodRate.findOne({
      where: { 
        minDuration: fireShortPeriodRateBody.minDuration,
        maxDuration: fireShortPeriodRateBody.maxDuration,
        rate: fireShortPeriodRateBody.rate
      }
    });
    if (existingFireShortPeriodRate) {
      return res.status(400).json({ msg: "Duplicate data!" });
    }
    const fireShortPeriodRate = await FireShortPeriodRate.create(fireShortPeriodRateBody);
    res.status(200).json(fireShortPeriodRate);
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};

const createFireShortPeriodRates = async (req, res) => {
  const fireShortPeriodRateBody = req.body;
  const fireShortPeriodRate = [];
  var addedFireShortPeriodRates = 0;
  var rejectedFireShortPeriodRates = 0;
  try {
    // Replaced by middleware
    // if (!(await canUserCreate(req.user, "fireShortPeriodRates"))) {
    //   return res.status(401).json({ msg: "unauthorized access!" });
    // }

    var promises = fireShortPeriodRateBody.map(async (element) => {
      const duplicateName = await FireShortPeriodRate.findAll({
        where: { name: element.name },
      });
      if (duplicateName.length > 0) {
        rejectedFireShortPeriodRates += 1;
      } else if (duplicateName.length == 0) {
        fireShortPeriodRate.push(await FireShortPeriodRate.create(element));
        addedFireShortPeriodRates += 1;
      }
    });
    Promise.all(promises).then(function (results) {
      res
        .status(200)
        .json(
          `${addedFireShortPeriodRates} rates are added and ${rejectedFireShortPeriodRates} are rejected due to duplication.`
        );
    });
    // const fireShortPeriodRate = await FireShortPeriodRate.create(fireShortPeriodRateBody);
    // res.status(200).json(fireShortPeriodRate);
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};

const getFireShortPeriodRateByPk = async (req, res) => {
  try {
    const fireShortPeriodRate = await FireShortPeriodRate.findByPk(req.params.id).then(function (
      fireShortPeriodRate
    ) {
      if (!fireShortPeriodRate) {
        res.status(404).json({ message: "No Data Found" });
      }
      res.status(200).json(fireShortPeriodRate);
    });

    // res.status(200).json(fireShortPeriodRate);
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};

const editFireShortPeriodRate = async (req, res) => {
  const reqBody = req.body;
  const id = req.params.id;

  try {
    // Replaced by middlware
    // if (!(await canUserEdit(req.user, "fireShortPeriodRates"))) {
    //   return res.status(401).json({ msg: "unauthorized access!" });
    // }
    console.log("reqBody of editFireShortPeriodRate", reqBody)
    const duplicateFireShortPeriodRateName = await FireShortPeriodRate.findAll({
      where: { 
        rate: reqBody.rate,
        minDuration: reqBody.minDuration,
        maxDuration: reqBody.maxDuration,
      },
    });
    if (duplicateFireShortPeriodRateName.length !== 0)
      if (duplicateFireShortPeriodRateName[0].id !== reqBody.id) {
        res.status(400).json({ msg: "Warranty already registered!" });
        return;
      }
    FireShortPeriodRate.update(reqBody, { where: { id: id } });

    res.status(200).json({ id });
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};

const deleteFireShortPeriodRate = async (req, res) => {
  const id = req.params.id;

  try {
    // Replaced By middleware
    // if (!(await canUserDelete(req.user, "fireShortPeriodRates"))) {
    //   return res.status(401).json({ msg: "unauthorized access!" });
    // }
    FireShortPeriodRate.destroy({ where: { id: id } });

    res.status(200).json({ id });
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};

module.exports = {
  getFireShortPeriodRate,
  getAllFireShortPeriodRates,
  createFireShortPeriodRate,
  createFireShortPeriodRates,
  getFireShortPeriodRateByPk,
  editFireShortPeriodRate,
  deleteFireShortPeriodRate,
};
