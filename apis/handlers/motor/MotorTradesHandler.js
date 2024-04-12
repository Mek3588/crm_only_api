const MotorTrade = require("../../../models/motor/MotorTrade");
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
      { risk_type: { [Op.like]: `%${st}%` } },
      { rate: { [Op.like]: `%${st}%` } },
    ],
  };
};

const getMotorTrade = async (req, res) => {
  const { f, r, st, sc, sd } = req.query;
  try {
    const data = await MotorTrade.findAndCountAll({
      offset: Number(f),
      limit: Number(r),
      order: [[sc || "risk_type", sd == 1 ? "ASC" : "DESC"]],
      where: getSearch(st),
    });
    res.status(200).json(data);
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};

const getAllMotorTrades = async (req, res) => {
  try {
    const data = await MotorTrade.findAndCountAll();
    res.status(200).json(data);
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};

//posting
const createMotorTrade = async (req, res) => {
  const motorTradeBody = req.body;
  try {
    if (!(await canUserCreate(req.user, "motorTrades"))) {
      return res.status(401).json({ msg: "unauthorized access!" });
    }
    const duplicateMotorTradeName = await MotorTrade.findAll({
      where: { risk_type: motorTradeBody.risk_type },
    });
    if (duplicateMotorTradeName.length > 0) {
      res.status(400).json({ msg: "MotorTrade already registered!" });
      return;
    }
    const motorTrade = await MotorTrade.create(motorTradeBody);
    if (motorTrade) {
      await createEventLog(
        req.user.id,
        eventResourceTypes.motorTrade,
        `${motorTrade.risk_type}`,
        motorTrade.id,
        eventActions.create,
        "",
        getIpAddress(req.ip)
      );
    }
    res.status(200).json(motorTrade);
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};

const createMotorTrades = async (req, res) => {
  const motorTradeBody = req.body;
  const motorTrade = [];
  var duplicate = [];
  var incorrect = [];
  var lineNumber = 2;
  let addedMotorTrades = 0;
  try {
    if (!(await canUserCreate(req.user, "motorTrades"))) {
      return res.status(401).json({ msg: "unauthorized access!" });
    }

    var promises = motorTradeBody.map(async (element) => {
      const duplicateName = await MotorTrade.findAll({
        where: { risk_type: element.risk_type },
      });
      if (duplicateName.length > 0) {
        duplicate.push(lineNumber);
      } else if (duplicateName.length == 0) {
        // motorTrade.push(await MotorTrade.create(element));
        try {
          await MotorTrade.create(element);
          addedMotorTrades += 1;
        } catch (error) {
          incorrect.push(lineNumber);
        }
      }
      lineNumber = lineNumber + 1;
    });
    Promise.all(promises).then(function (results) {
      let msg = "";
      if (addedMotorTrades != 0) {
        msg = msg + `${addedMotorTrades} added`;
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
    // const motorTrade = await MotorTrade.create(motorTradeBody);
    // res.status(200).json(motorTrade);
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};

const getMotorTradeByPk = async (req, res) => {
  try {
    const motorTrade = await MotorTrade.findByPk(req.params.id).then(function (
      motorTrade
    ) {
      if (!motorTrade) {
        res.status(404).json({ message: "No Data Found" });
      }
      res.status(200).json(motorTrade);
    });

    res.status(200).json(motorTrade);
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};

const getMotorTradeByName = async (req, res) => {
  try {
    const { f, r, st, sc, sd } = req.query;
    const motorTrade = await MotorTrade.findAndCountAll({
      where: { is_garage: Number(req.params.type) ? true : false },
      offset: Number(f),
      limit: Number(r),
      order: [[sc || "risk_type", sd == 1 ? "ASC" : "DESC"]],
    });
    res.status(200).json(motorTrade);
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};

const editMotorTrade = async (req, res) => {
  const reqBody = req.body;
  const id = req.params.id;

  try {
    if (!(await canUserEdit(req.user, "motorTrades"))) {
      return res.status(401).json({ msg: "unauthorized access!" });
    }
    const duplicateName = await MotorTrade.findAll({
      where: { risk_type: reqBody.risk_type },
    });
    
    if (duplicateName.length !== 0) {
      if (duplicateName[0].id !== reqBody.id) {
        res.status(400).json({ msg: "MotorTrade already added" });
        return;
      }
    }
    let oldMotorTrade = await MotorTrade.findByPk(id, {});
    let updated = await MotorTrade.update(reqBody, { where: { id: id } });

    if (updated) {
      let newMotorTrade = await MotorTrade.findByPk(id, {});
      let changedFieldValues = getChangedFieldValues(
        oldMotorTrade,
        newMotorTrade
      );
      await createEventLog(
        req.user.id,
        eventResourceTypes.motorTrade,
        `${oldMotorTrade.risk_type}`,
        newMotorTrade.id,
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

const deleteMotorTrade = async (req, res) => {
  const id = req.params.id;

  try {
    if (!(await canUserDelete(req.user, "motorTrades"))) {
      return res.status(401).json({ msg: "unauthorized access!" });
    }
    let motorTrade = await MotorTrade.findByPk(id, {});
    let deleted = await MotorTrade.destroy({ where: { id: id } });
    if (deleted) {
      await createEventLog(
        req.user.id,
        eventResourceTypes.motorTrade,
        `${motorTrade.risk_type}`,
        motorTrade.id,
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
  getMotorTrade,
  getAllMotorTrades,
  createMotorTrade,
  createMotorTrades,
  getMotorTradeByPk,
  editMotorTrade,
  deleteMotorTrade,
  getMotorTradeByName,
};
