const LimitedCoverRate = require("../../../models/motor/LimitedCoverRate");
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
      { name: { [Op.like]: `%${st}%` } },
      { rate: { [Op.like]: `%${st}%` } },
    ],
  };
};

const getLimitedCoverRate = async (req, res) => {
  const { f, r, st, sc, sd } = req.query;
  const currentUser = await User.findByPk(req.user.id, {
    include: [Employee],
  });
  

  try {
    if (req.type == "all") {
      const data = await LimitedCoverRate.findAndCountAll({
        offset: Number(f),
        limit: Number(r),
        order: [[sc || "name", sd == 1 ? "ASC" : "DESC"]],
        where: getSearch(st),
      });
      res.status(200).json(data);
    }else if (req.type == "self"){
      const data = await LimitedCoverRate.findAndCountAll({
        offset: Number(f),
        limit: Number(r),
        order: [[sc || "name", sd == 1 ? "ASC" : "DESC"]],
        where: {
          userId: currentUser.id,
          ...getSearch(st)
        },
      });
      res.status(200).json(data);
    }else if (req.type == "customer"){
      const data = await LimitedCoverRate.findAndCountAll({
        offset: Number(f),
        limit: Number(r),
        order: [[sc || "name", sd == 1 ? "ASC" : "DESC"]],
        where: {
          userId: currentUser.id,
          ...getSearch(st)
        },
      });
      res.status(200).json(data);
    }else if (req.type == "branch"){
      const data = await LimitedCoverRate.findAndCountAll({
        offset: Number(f),
        limit: Number(r),
        order: [[sc || "name", sd == 1 ? "ASC" : "DESC"]],
        include: {
          model: User, as: 'user',
          include: [Employee],
        },
        where: {
          "$user.employee.branchId$": currentUser.employee.branchId,
          ...getSearch(st)
        },
      });
      res.status(200).json(data);
    }else if (req.type == "branchAndSelf"){
      const data = await LimitedCoverRate.findAndCountAll({
        offset: Number(f),
        limit: Number(r),
        order: [[sc || "name", sd == 1 ? "ASC" : "DESC"]],
        include: {
          model: User, as: 'user',
          include: [Employee],
        },
        where: {
          userId: currentUser.id,
          "$user.employee.branchId$": currentUser.employee.branchId,
          ...getSearch(st)
        },
      });
      res.status(200).json(data);
    }
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};

const getAllLimitedCoverRates = async (req, res) => {
  try {
    const data = await LimitedCoverRate.findAndCountAll();
    res.status(200).json(data);
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};

//posting
const createLimitedCoverRate = async (req, res) => {
  const limitedCoverRateBody = req.body;
  try {
    if (!(await canUserCreate(req.user, "limitedCoverRates"))) {
      return res.status(401).json({ msg: "unauthorized access!" });
    }

    const limitedCoverRate = await LimitedCoverRate.create(limitedCoverRateBody);
    if (limitedCoverRate) {
      await createEventLog(
        req.user.id,
        eventResourceTypes.limitedCoverRate,
        `${limitedCoverRate.name}`,
        limitedCoverRate.id,
        eventActions.create,
        "",
        getIpAddress(req.ip)
      );
    }
    res.status(200).json(limitedCoverRate);
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};

const createLimitedCoverRates = async (req, res) => {
  const limitedCoverRateBody = req.body;
  const limitedCoverRate = [];
  var duplicate = [];
  var incorrect = [];
  var lineNumber = 2;
  let addedLimitedCoverRates = 0;
  try {
    if (!(await canUserCreate(req.user, "limitedCoverRates"))) {
      return res.status(401).json({ msg: "unauthorized access!" });
    }

    var promises = limitedCoverRateBody.map(async (element) => {
      const duplicateName = await LimitedCoverRate.findAll({
        where: { name: element.name },
      });
      if (duplicateName.length > 0) {
        duplicate.push(lineNumber);
      } else if (duplicateName.length == 0) {
        // limitedCoverRate.push(await LimitedCoverRate.create(element));
        try {
          await LimitedCoverRate.create(element);
          addedLimitedCoverRates += 1;
        } catch (error) {
          incorrect.push(lineNumber);
        }
      }
      lineNumber = lineNumber + 1;
    });
    Promise.all(promises).then(function (results) {
      let msg = "";
      if (addedLimitedCoverRates != 0) {
        msg = msg + `${addedLimitedCoverRates} added`;
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
    // const limitedCoverRate = await LimitedCoverRate.create(limitedCoverRateBody);
    // res.status(200).json(limitedCoverRate);
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};

const getLimitedCoverRateByPk = async (req, res) => {
  try {
    const limitedCoverRate = await LimitedCoverRate.findByPk(req.params.id).then(function (
      limitedCoverRate
    ) {
      if (!limitedCoverRate) {
        res.status(404).json({ message: "No Data Found" });
      }
      res.status(200).json(limitedCoverRate);
    });

    res.status(200).json(limitedCoverRate);
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};

const getLimitedCoverRateByName = async (req, res) => {
  try {
    const { f, r, st, sc, sd } = req.query;
    const limitedCoverRate = await LimitedCoverRate.findAndCountAll({
      where: { name: Number(req.params.type) ? true : false },
      offset: Number(f),
      limit: Number(r),
      order: [[sc || "name", sd == 1 ? "ASC" : "DESC"]],
    });
    res.status(200).json(limitedCoverRate);
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};

const editLimitedCoverRate = async (req, res) => {
  const reqBody = req.body;
  const id = req.params.id;

  try {
    if (!(await canUserEdit(req.user, "limitedCoverRates"))) {
      return res.status(401).json({ msg: "unauthorized access!" });
    }

    let oldLimitedCoverRate = await LimitedCoverRate.findByPk(id, {});
    let updated = await LimitedCoverRate.update(reqBody, { where: { id: id } });

    if (updated) {
      let newLimitedCoverRate = await LimitedCoverRate.findByPk(id, {});
      let changedFieldValues = getChangedFieldValues(
        oldLimitedCoverRate,
        newLimitedCoverRate
      );
      await createEventLog(
        req.user.id,
        eventResourceTypes.limitedCoverRate,
        `${oldLimitedCoverRate.name}`,
        newLimitedCoverRate.id,
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

const deleteLimitedCoverRate = async (req, res) => {
  const id = req.params.id;

  try {
    if (!(await canUserDelete(req.user, "limitedCoverRates"))) {
      return res.status(401).json({ msg: "unauthorized access!" });
    }
    let limitedCoverRate = await LimitedCoverRate.findByPk(id, {});
    let deleted = await LimitedCoverRate.destroy({ where: { id: id } });
    if (deleted) {
      await createEventLog(
        req.user.id,
        eventResourceTypes.limitedCoverRate,
        `${limitedCoverRate.name}`,
        limitedCoverRate.id,
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
  getLimitedCoverRate,
  getAllLimitedCoverRates,
  createLimitedCoverRate,
  createLimitedCoverRates,
  getLimitedCoverRateByPk,
  editLimitedCoverRate,
  deleteLimitedCoverRate,
  getLimitedCoverRateByName,
};
