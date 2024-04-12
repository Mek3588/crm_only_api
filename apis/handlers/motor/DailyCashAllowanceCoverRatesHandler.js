const DailyCashAllowanceCoverRate = require("../../../models/motor/DailyCashAllowanceCoverRate");
const User = require("../../../models/acl/user");
const Employee = require("../../../models/Employee");
const { Op } = require("sequelize");
const {
  canUserCreate,
  canUserEdit,
  canUserDelete,
} = require("../../../utils/Authrizations");
const {
  eventResourceTypes,
  eventActions,
} = require("../../../utils/constants");
const {
  createEventLog,
  getChangedFieldValues,
  getIpAddress,
} = require("../../../utils/GeneralUtils");

const getSearch = (st) => {
  return {
    [Op.or]: [
      { benefit: { [Op.like]: `%${st}%` } },
      { duration: { [Op.like]: `%${st}%` } },
      { premium: { [Op.like]: `%${st}%` } },
    ],
  };
};

const getDailyCashAllowanceCoverRate = async (req, res) => {
  const { f, r, st, sc, sd } = req.query;
  const currentUser = await User.findByPk(req.user.id, {
    include: [Employee],
  });

  try {
    if (req.type == "all") {
      const data = await DailyCashAllowanceCoverRate.findAndCountAll({
        offset: Number(f),
        limit: Number(r),
        order: [[sc || "benefit", sd == 1 ? "ASC" : "DESC"]],
        where: getSearch(st),
      });
      res.status(200).json(data);
    }else if (req.type == "self"){
      const data = await DailyCashAllowanceCoverRate.findAndCountAll({
        offset: Number(f),
        limit: Number(r),
        order: [[sc || "benefit", sd == 1 ? "ASC" : "DESC"]],
        where: { 
          userId: currentUser.id,
          ...getSearch(st),
        }
      });
      res.status(200).json(data);
    }else if (req.type == "customer"){
      const data = await DailyCashAllowanceCoverRate.findAndCountAll({
        offset: Number(f),
        limit: Number(r),
        order: [[sc || "benefit", sd == 1 ? "ASC" : "DESC"]],
        where: { 
          userId: currentUser.id,
          ...getSearch(st),
        }
      });
      res.status(200).json(data);
    }else if (req.type == "branch"){
      const data = await DailyCashAllowanceCoverRate.findAndCountAll({
        offset: Number(f),
        limit: Number(r),
        order: [[sc || "benefit", sd == 1 ? "ASC" : "DESC"]],
        include: {
          model: User, as: 'user',
          include: [Employee],
        },
        where: { 
          "$user.employee.branchId$": currentUser.employee.branchId,
          ...getSearch(st),
        }
      });
      res.status(200).json(data);
    }else if (req.type == "branchAndSelf"){
      const data = await DailyCashAllowanceCoverRate.findAndCountAll({
        offset: Number(f),
        limit: Number(r),
        order: [[sc || "benefit", sd == 1 ? "ASC" : "DESC"]],
        include: {
          model: User, as: 'user',
          include: [Employee],
        },
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
const getDailyCashAllowanceCoverDuplicateRate = async (req, res) => {
  const { f, r, st, sc, sd } = req.query;
  const currentUser = await User.findByPk(req.user.id, {
    include: [Employee],
  });

  try {
    let queryOptions = {
      offset: Number(f),
      limit: Number(r),
      order: [[sc || "benefit", sd == 1 ? "ASC" : "DESC"]],
      where: getSearch(st),
    };

    if (req.type === "branch" || req.type === "branchAndSelf") {
      queryOptions.include = {
        model: User, 
        as: 'user',
        include: [Employee],
      };
    }

    if (req.type === "self" || req.type === "customer" || req.type === "branchAndSelf") {
      queryOptions.where = {
        ...queryOptions.where,
        userId: currentUser.id,
      };
    }

    if (req.type === "branch" || req.type === "branchAndSelf") {
      queryOptions.where = {
        ...queryOptions.where,
        "$user.employee.branchId$": currentUser.employee.branchId,
      };
    }

    const data = await DailyCashAllowanceCoverRate.findAndCountAll(queryOptions);
    const uniqueData = [];
    const durationsSet = new Set();
    data.rows.forEach(item => {
      if (!durationsSet.has(item.duration)) {
        uniqueData.push(item);
        durationsSet.add(item.duration);
      }
    });
    console.log("Filtered Data:", uniqueData.length);
    res.status(200).json({
      count: uniqueData.length,
      rows: uniqueData,
    });
    
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};

const getAllDailyCashAllowanceCoverRates = async (req, res) => {
  try {
    const data = await DailyCashAllowanceCoverRate.findAndCountAll();
    res.status(200).json(data);
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};

//posting
const createDailyCashAllowanceCoverRate = async (req, res) => {
  const dailyCashAllowanceCoverRateBody = req.body;
  try {
    if (!(await canUserCreate(req.user, "dailyCashAllowanceCoverRates"))) {
      return res.status(401).json({ msg: "unauthorized access!" });
    }
    // const duplicateDailyCashAllowanceCoverRateName = await DailyCashAllowanceCoverRate.findAll({
    //   where: { name: dailyCashAllowanceCoverRateBody.name },
    // });
    // if (duplicateDailyCashAllowanceCoverRateName.length > 0) {
    //   res.status(400).json({ msg: "DailyCashAllowanceCoverRate already registered!" });
    //   return;
    // }
    const dailyCashAllowanceCoverRate =
      await DailyCashAllowanceCoverRate.create(dailyCashAllowanceCoverRateBody);
    if (dailyCashAllowanceCoverRate) {
      await createEventLog(
        req.user.id,
        eventResourceTypes.dailyCashAllowanceCoverRate,
        `${dailyCashAllowanceCoverRate.name}`,
        dailyCashAllowanceCoverRate.id,
        eventActions.create,
        "",
        getIpAddress(req.ip)
      );
    }
    res.status(200).json(dailyCashAllowanceCoverRate);
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};

const createDailyCashAllowanceCoverRates = async (req, res) => {
  const dailyCashAllowanceCoverRateBody = req.body;
  const dailyCashAllowanceCoverRate = [];
  const addedDailyCashAllowanceCoverRates = 0;
  var duplicate = [];
  var incorrect = [];
  var lineNumber = 2;
  try {
    if (!(await canUserCreate(req.user, "dailyCashAllowanceCoverRates"))) {
      return res.status(401).json({ msg: "unauthorized access!" });
    }

    var promises = dailyCashAllowanceCoverRateBody.map(async (element) => {
      // const duplicateName = await DailyCashAllowanceCoverRate.findAll({
      //   where: { name: element.name },
      // });
      // if (duplicateName.length > 0) {
      //   duplicate.push(lineNumber);
      // } else if (duplicateName.length == 0) {
      // dailyCashAllowanceCoverRate.push(await DailyCashAllowanceCoverRate.create(element));
      try {
        await DailyCashAllowanceCoverRate.create(element);
        addedDailyCashAllowanceCoverRates += 1;
      } catch (error) {
        incorrect.push(lineNumber);
      }
      lineNumber = lineNumber + 1;
    });
    Promise.all(promises).then(function (results) {
      let msg = "";
      if (addedDailyCashAllowanceCoverRates != 0) {
        msg = msg + `${addedDailyCashAllowanceCoverRates} countries added`;
      }
      if (incorrect.length != 0) {
        msg = msg + ` line ${incorrect} has incorrect values`;
      }
      if (duplicate != 0) {
        msg = msg + ` ${duplicate} duplicate found`;
      }
      if (duplicate.length != 0 || incorrect.length != 0) {
        res.status(400).json({ msg: msg });
      } else {
        res.status(200).json({ msg: msg });
      }
    });
    // const dailyCashAllowanceCoverRate = await DailyCashAllowanceCoverRate.create(dailyCashAllowanceCoverRateBody);
    // res.status(200).json(dailyCashAllowanceCoverRate);
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};

const getDailyCashAllowanceCoverRateByPk = async (req, res) => {
  try {
    const dailyCashAllowanceCoverRate =
      await DailyCashAllowanceCoverRate.findByPk(req.params.id).then(function (
        dailyCashAllowanceCoverRate
      ) {
        if (!dailyCashAllowanceCoverRate) {
          return res.status(404).json({ message: "No Data Found" });
        }
        return res.status(200).json(dailyCashAllowanceCoverRate);
      });
  } catch (error) {
    return res.status(400).json({ msg: error.message });
  }
};

const getDailyCashAllowanceCoverRateByDuration = async (req, res) => {
  console.log("getDailyCashAllowanceCoverRateByDuration", req.body)
  try {
    
    const dailyCashAllowanceCoverRate =
      await DailyCashAllowanceCoverRate.findAndCountAll({
        where: { duration: req.params.duration },
      });
    res.status(200).json(dailyCashAllowanceCoverRate);
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};

const editDailyCashAllowanceCoverRate = async (req, res) => {
  const reqBody = req.body;
  const id = req.params.id;

  try {
    if (!(await canUserEdit(req.user, "dailyCashAllowanceCoverRates"))) {
      return res.status(401).json({ msg: "unauthorized access!" });
    }
    // const duplicateDailyCashAllowanceCoverRateName =
    //   await DailyCashAllowanceCoverRate.findAll({
    //     where: { name: reqBody.name },
    //   });
    // if (duplicateDailyCashAllowanceCoverRateName.length !== 0)
    //   if (duplicateDailyCashAllowanceCoverRateName[0].id !== reqBody.id) {
    //     res
    //       .status(400)
    //       .json({ msg: "DailyCashAllowanceCoverRate already registered!" });
    //     return;
    //   }
    let oldDailyCashAllowanceCoverRate =
      await DailyCashAllowanceCoverRate.findByPk(id, {});
    let updated = await DailyCashAllowanceCoverRate.update(reqBody, {
      where: { id: id },
    });

    if (updated) {
      let newDailyCashAllowanceCoverRate =
        await DailyCashAllowanceCoverRate.findByPk(id, {});
      let changedFieldValues = getChangedFieldValues(
        oldDailyCashAllowanceCoverRate,
        newDailyCashAllowanceCoverRate
      );
      await createEventLog(
        req.user.id,
        eventResourceTypes.dailyCashAllowanceCoverRate,
        `${oldDailyCashAllowanceCoverRate.name}`,
        newDailyCashAllowanceCoverRate.id,
        eventActions.edit,
        changedFieldValues,
        getIpAddress(req.ip)
      );
    }

    res.status(200).json({ id });
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};

const deleteDailyCashAllowanceCoverRate = async (req, res) => {
  const id = req.params.id;

  try {
    if (!(await canUserDelete(req.user, "dailyCashAllowanceCoverRates"))) {
      return res.status(401).json({ msg: "unauthorized access!" });
    }
    let dailyCashAllowanceCoverRate =
      await DailyCashAllowanceCoverRate.findByPk(id, {});
    let deleted = await DailyCashAllowanceCoverRate.destroy({
      where: { id: id },
    });
    if (deleted) {
      await createEventLog(
        req.user.id,
        eventResourceTypes.dailyCashAllowanceCoverRate,
        `${dailyCashAllowanceCoverRate.name}`,
        dailyCashAllowanceCoverRate.id,
        eventActions.delete,
        "",
        getIpAddress(req.ip)
      );
    }
    res.status(200).json({ id });
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};

module.exports = {
  getDailyCashAllowanceCoverRate,
  getAllDailyCashAllowanceCoverRates,
  createDailyCashAllowanceCoverRate,
  createDailyCashAllowanceCoverRates,
  getDailyCashAllowanceCoverRateByPk,
  editDailyCashAllowanceCoverRate,
  deleteDailyCashAllowanceCoverRate,
  getDailyCashAllowanceCoverRateByDuration,
  getDailyCashAllowanceCoverDuplicateRate,
};
