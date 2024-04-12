const PeriodRate = require("../../models/PeriodRate");
const User = require("../../models/acl/user");
const Employee = require("../../models/Employee");
const { Op } = require("sequelize");
// const {
//   canUserCreate,
//   canUserEdit,
//   canUserDelete,
// } = require("../../utils/Authrizations");

const getSearch = (st) => {
  return {
    [Op.or]: [
      { minDuration: { [Op.like]: `%${st}%` } },
      { maxDuration: { [Op.like]: `%${st}%` } },
      { rate: { [Op.like]: `%${st}%` } },
    ],
  };
};

const getPeriodRate = async (req, res) => {
  const { f, r, st, sc, sd } = req.query;
  const currentUser = await User.findByPk(req.user.id, {
    include: [Employee],
  });
  

  //req.type = "branchAndSelf"

  try {
    

    if (req.type == "all") {
      const data = await PeriodRate.findAndCountAll({
        // offset: Number(f),
        // limit: Number(r),
        // order: [[sc || "createdAt", sd == 1 ? "ASC" : "DESC"]],
        // where: getSearch(st),
      });
      res.status(200).json(data);
    }else if (req.type == "self"){
      const data = await PeriodRate.findAndCountAll({
        // offset: Number(f),
        // limit: Number(r),
        // order: [[sc || "createdAt", sd == 1 ? "ASC" : "DESC"]],
        //where: getSearch(st),
        where: {userId: currentUser.id}
      });
      res.status(200).json(data);
    }else if (req.type == "customer"){
      const data = await PeriodRate.findAndCountAll({
        // offset: Number(f),
        // limit: Number(r),
        // order: [[sc || "createdAt", sd == 1 ? "ASC" : "DESC"]],
        //where: getSearch(st),
        where: {userId: currentUser.id}
      });
      res.status(200).json(data);
    }else if (req.type == "branch"){
      const data = await PeriodRate.findAndCountAll({
        // offset: Number(f),
        // limit: Number(r),
        // order: [[sc || "createdAt", sd == 1 ? "ASC" : "DESC"]],
        //where: getSearch(st),
        include: {
          model: User, as: 'user',
          include: [Employee],
        },
        where: {"$user.employee.branchId$": currentUser.employee.branchId}
      });
      res.status(200).json(data);
    }else if (req.type == "branchAndSelf"){
      const data = await PeriodRate.findAndCountAll({
        // offset: Number(f),
        // limit: Number(r),
        // order: [[sc || "createdAt", sd == 1 ? "ASC" : "DESC"]],
        //where: getSearch(st),
        include: {
          model: User, as: 'user',
          include: [Employee],
        },
        where: {
          userId: currentUser.id,
          "$user.employee.branchId$": currentUser.employee.branchId
        }
      });
      res.status(200).json(data);
    }
  } catch (error) {
    
    res.status(400).json({ msg: error.message });
  }
};

const getAllPeriodRates = async (req, res) => {
  try {
    const data = await PeriodRate.findAndCountAll();
    res.status(200).json(data);
  } catch (error) {
    

    res.status(400).json({ msg: error.message });
  }
};

//posting
const createPeriodRate = async (req, res) => {
  const periodRateBody = req.body;
  try {
    // if (!(await canUserCreate(req.user, "periodRates"))) {
    //   return res.status(401).json({ msg: "unauthorized access!" });
    // }
    const periodRate = await PeriodRate.create(periodRateBody);
    res.status(200).json(periodRate);
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};

const createPeriodRates = async (req, res) => {
  const periodRateBody = req.body;
  const periodRate = [];
  var addedPeriodRates = 0;
  var rejectedPeriodRates = 0;
  try {
    // if (!(await canUserCreate(req.user, "periodRates"))) {
    //   return res.status(401).json({ msg: "unauthorized access!" });
    // }

    var promises = periodRateBody.map(async (element) => {
      periodRate.push(await PeriodRate.create(element));
      addedPeriodRates += 1;
    });
    Promise.all(promises).then(function (results) {
      res
        .status(200)
        .json(
          `${addedPeriodRates} rates are added and ${rejectedPeriodRates} are rejected due to duplication.`
        );
    });
    // const periodRate = await PeriodRate.create(periodRateBody);
    // res.status(200).json(periodRate);
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};

const getPeriodRateByPk = async (req, res) => {
  try {
    const periodRate = await PeriodRate.findByPk(req.params.id).then(function (
      periodRate
    ) {
      if (!periodRate) {
        res.status(404).json({ message: "No Data Found" });
      }
      res.status(200).json(periodRate);
    });

    // res.status(200).json(periodRate);
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};

const editPeriodRate = async (req, res) => {
  const reqBody = req.body;
  const id = req.params.id;

  try {
    // if (!(await canUserEdit(req.user, "periodRates"))) {
    //   return res.status(401).json({ msg: "unauthorized access!" });
    // }
    PeriodRate.update(reqBody, { where: { id: id } });
    res.status(200).json({ id });
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};

const deletePeriodRate = async (req, res) => {
  const id = req.params.id;

  try {
    // if (!(await canUserDelete(req.user, "periodRates"))) {
    //   return res.status(401).json({ msg: "unauthorized access!" });
    // }
    PeriodRate.destroy({ where: { id: id } });

    res.status(200).json({ id });
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};

module.exports = {
  getPeriodRate,
  getAllPeriodRates,
  createPeriodRate,
  createPeriodRates,
  getPeriodRateByPk,
  editPeriodRate,
  deletePeriodRate,
};
