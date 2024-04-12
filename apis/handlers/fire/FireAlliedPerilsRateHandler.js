const FireAlliedPerilsRate = require("../../../models/fire/FireAlliedPerilsRate");
const User = require("../../../models/acl/user");
const Employee = require("../../../models/Employee");
const { Op } = require("sequelize");
const {
  canUserCreate,
  canUserEdit,
  canUserDelete,
} = require("../../../utils/Authrizations");
const { json } = require("body-parser");
const { currentUser } = require("../../../utils/GeneralUtils");

const getSearch = (st) => {
  return {
    [Op.or]: [
      { alliedPerilName: { [Op.like]: `%${st}%` } },
      { rate: { [Op.like]: `%${st}%` } },
    ],
  };
};

const getFireAlliedPerilsRate = async (req, res) => {
  const { f, r, st, sc, sd } = req.query;
  const currentUser = await User.findByPk(req.user.id, {
    include: [Employee],
  });

  //req.type="all"
  try {
    if (req.type == "all") {
      const data = await FireAlliedPerilsRate.findAndCountAll({
        offset: Number(f),
        limit: Number(r),
        order: [[sc || "alliedPerilName", sd == 1 ? "ASC" : "DESC"]],
        where: getSearch(st),
      });
      res.status(200).json(data);
    }else if (req.type == "self"){
      const data = await FireAlliedPerilsRate.findAndCountAll({
        offset: Number(f),
        limit: Number(r),
        order: [[sc || "alliedPerilName", sd == 1 ? "ASC" : "DESC"]],
        where: {
          userId: currentUser.id,
          ...getSearch(st),
        }
      });
      res.status(200).json(data);
    }else if (req.type == "customer"){
      const data = await FireAlliedPerilsRate.findAndCountAll({
        offset: Number(f),
        limit: Number(r),
        order: [[sc || "alliedPerilName", sd == 1 ? "ASC" : "DESC"]],
        where: {
          // userId: currentUser.id,
          ...getSearch(st),
        }
      });
      res.status(200).json(data);
    }else if (req.type == "branch"){
      const data = await FireAlliedPerilsRate.findAndCountAll({
        offset: Number(f),
        limit: Number(r),
        order: [[sc || "alliedPerilName", sd == 1 ? "ASC" : "DESC"]],
        where: {
          "$user.employee.branchId$": currentUser.employee.branchId,
          ...getSearch(st),
        }
      });
      res.status(200).json(data);
    }else if (req.type == "branchAndSelf"){
      const data = await FireAlliedPerilsRate.findAndCountAll({
        offset: Number(f),
        limit: Number(r),
        order: [[sc || "alliedPerilName", sd == 1 ? "ASC" : "DESC"]],
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

const getAllFireAlliedPerilsRates = async (req, res) => {
  try {
    const data = await FireAlliedPerilsRate.findAndCountAll();
    res.status(200).json(data);
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};

//posting
const createFireAlliedPerilsRate = async (req, res) => {
  const fireAlliedPerilsRateBody = req.body;
  try {
    // replaced by middleware
    // if (!(await canUserCreate(req.user, "fireAlliedPerilsRates"))) {
    //   return res.status(401).json({ msg: "unauthorized access!" });
    // }
    const duplicateName = await FireAlliedPerilsRate.findAll({
      where: { [Op.or]: [{ alliedPerilName: fireAlliedPerilsRateBody.alliedPerilName }, { flag: fireAlliedPerilsRateBody.flag }] },
    });
    if(duplicateName){
      res.status(400),json({msg: "Name or flag has been already recorded!"})
    }
    const fireAlliedPerilsRate = await FireAlliedPerilsRate.create(
      fireAlliedPerilsRateBody
    );
    res.status(200).json(fireAlliedPerilsRate);
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};

const createFireAlliedPerilsRates = async (req, res) => {
  const fireAlliedPerilsRateBody = req.body;
  const fireAlliedPerilsRate = [];
  var addedFireAlliedPerilsRates = 0;
  var rejectedFireAlliedPerilsRates = 0;
  try {
    // replaced by middleware
    // if (!(await canUserCreate(req.user, "fireAlliedPerilsRates"))) {
    //   return res.status(401).json({ msg: "unauthorized access!" });
    // }

    var promises = fireAlliedPerilsRateBody.map(async (element) => {
      const duplicateName = await FireAlliedPerilsRate.findAll({
        where: { [Op.or]: [{ alliedPerilName: element.alliedPerilName }, { flag: element.flag }] },
      });
      if (duplicateName.length > 0) {
        rejectedFireAlliedPerilsRates += 1;
      } else if (duplicateName.length == 0) {
        fireAlliedPerilsRate.push(await FireAlliedPerilsRate.create(element));
        addedFireAlliedPerilsRates += 1;
      }
    });
    Promise.all(promises).then(function (results) {
      res
        .status(200)
        .json(
          `${addedFireAlliedPerilsRates} categories are added and ${rejectedFireAlliedPerilsRates} are rejected due to duplication.`
        );
    });
    // const fireAlliedPerilsRate = await FireAlliedPerilsRate.create(fireAlliedPerilsRateBody);
    // res.status(200).json(fireAlliedPerilsRate);
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};

const getFireAlliedPerilsRateByPk = async (req, res) => {
  try {
    const fireAlliedPerilsRate = await FireAlliedPerilsRate.findByPk(
      req.params.id
    ).then(function (fireAlliedPerilsRate) {
      if (!fireAlliedPerilsRate) {
        res.status(404).json({ message: "No Data Found" });
      }
      res.status(200).json(fireAlliedPerilsRate);
    });

    res.status(200).json(fireAlliedPerilsRate);
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};

const editFireAlliedPerilsRate = async (req, res) => {
  const reqBody = req.body;
  const id = req.params.id;

  try {

    // replaced by middleware
    // if (!(await canUserEdit(req.user, "fireAlliedPerilsRates"))) {
    //   return res.status(401).json({ msg: "unauthorized access!" });
    // }
    
    const duplicateName = await FireAlliedPerilsRate.findAll({
      where: { [Op.or]: [{ alliedPerilName: reqBody.alliedPerilName }, { flag: reqBody.flag }] },
    });
    if(duplicateName.length){
      if(duplicateName[0].id !== req.params.id)
      res.status(400),json({msg: "Name or flag has been already recorded!"})
    }
    
    FireAlliedPerilsRate.update(
      reqBody,

      { where: { id: id } }
    );

    res.status(200).json({ id });
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};

const deleteFireAlliedPerilsRate = async (req, res) => {
  const id = req.params.id;

  try {
    // replaced by middleware
    // if (!(await canUserDelete(req.user, "fireAlliedPerilsRates"))) {
    //   return res.status(401).json({ msg: "unauthorized access!" });
    // }
    FireAlliedPerilsRate.destroy({ where: { id: id } });
    res.status(200).json({ id });
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};

module.exports = {
  getFireAlliedPerilsRate,
  getAllFireAlliedPerilsRates,
  createFireAlliedPerilsRate,
  createFireAlliedPerilsRates,
  getFireAlliedPerilsRateByPk,
  editFireAlliedPerilsRate,
  deleteFireAlliedPerilsRate,
};
