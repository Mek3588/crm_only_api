const { Op } = require("sequelize");
const Setting = require("../../models/Setting");
const User = require("../../models/acl/user");
const Employee = require("../../models/Employee");
// const {
//   canUserRead,
//   canUserCreate,
//   canUserEdit,
//   canUserDelete,
// } = require("../../utils/Authrizations");
const { eventResourceTypes, eventActions } = require("../../utils/constants");
const {
  createEventLog,
  getChangedFieldValues,
  getIpAddress,
} = require("../../utils/GeneralUtils");

const getSetting = async (req, res) => {
  try {
    // if (!(await canUserRead(req.user, "settings"))) {
    //   return res.status(401).json({ msg: "unauthorized access!" });
    // }
    const { f, r, st, sc, sd } = req.query;
    const currentUser = await User.findByPk(req.user.id, {
      include: [Employee],
    });

    //req.type = "self"
    if (req.type == "all") {
      const data = await Setting.findAndCountAll({
        offset: Number(f),
        limit: Number(r),
        order: sc
          ? [[sc, sd == 1 ? "ASC" : "DESC"]]
          : [["createdAt", sd == 1 ? "DESC" : "ASC"]],
        where: getSearch(st),
      });
      res.status(200).json(data);
    }else if (req.type == "self"){
      const data = await Setting.findAndCountAll({
        offset: Number(f),
        limit: Number(r),
        order: sc
          ? [[sc, sd == 1 ? "ASC" : "DESC"]]
          : [["createdAt", sd == 1 ? "DESC" : "ASC"]],
        where: { 
          userId: currentUser.id,
          ...getSearch(st),
        }
      });
      res.status(200).json(data);
    }else if (req.type == "customer"){
      const data = await Setting.findAndCountAll({
        offset: Number(f),
        limit: Number(r),
        order: sc
          ? [[sc, sd == 1 ? "ASC" : "DESC"]]
          : [["createdAt", sd == 1 ? "DESC" : "ASC"]],
        where: { 
          userId: currentUser.id,
          ...getSearch(st),
        }
      });
      res.status(200).json(data);
    }else if (req.type == "branch"){
      const data = await Setting.findAndCountAll({
        offset: Number(f),
        limit: Number(r),
        order: sc
          ? [[sc, sd == 1 ? "ASC" : "DESC"]]
          : [["createdAt", sd == 1 ? "DESC" : "ASC"]],
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
      const data = await Setting.findAndCountAll({
        offset: Number(f),
        limit: Number(r),
        order: sc
          ? [[sc, sd == 1 ? "ASC" : "DESC"]]
          : [["createdAt", sd == 1 ? "DESC" : "ASC"]],
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

const getSearch = (st) => {
  return {
    [Op.or]: [
      {
        name: {
          [Op.like]: "%" + st + "%",
        },
      },
    ],
  };
};
//posting
const createSetting = async (req, res) => {
  const settingBody = req.body;
  try {
    // if (!(await canUserCreate(req.user, "settings"))) {
    //   return res.status(401).json({ msg: "unauthorized access!" });
    // }
    const ducplicateCountry = await Setting.findAll({
      where: { name: settingBody.name },
    });
    if (ducplicateCountry.length > 1) {
      res.status(400).json({ msg: "Setting name already used!" });
      return;
    }
    const setting = await Setting.create(settingBody);
    
    if (setting) {
      let ipAddress = getIpAddress(req.ip);
      const eventLog = await createEventLog(
        req.user.id,
        eventResourceTypes.setting,
        `${setting.name} `,
        setting.id,
        eventActions.create,
        "",
        ipAddress
      );
    }
    res.status(200).json(setting);
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};

const createSettings = async (req, res) => {
  const cityBody = req.body;
  try {
    // if (!(await canUserCreate(req.user, "settings"))) {
    //   return res.status(401).json({ msg: "unauthorized access!" });
    // }
    let promises = await cityBody.map(async (subcity) => {
      await Setting.create(subcity);
    });
    Promise.all(promises).then(function (results) {
      res.status(200).json({ msg: msg });
    });
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};

const getSettingByPk = async (req, res) => {
  try {
    // if (!(await canUserRead(req.user, "settings"))) {
    //   return res.status(401).json({ msg: "unauthorized access!" });
    // }
    const setting = await Setting.findByPk(req.params.id, {}).then(function (
      setting
    ) {
      if (!setting) {
        res.status(404).json({ message: "No Data Found" });
      } else if (setting) {
        let ipAddress = getIpAddress(req.ip);
        const eventLog = createEventLog(
          req.user.id,
          eventResourceTypes.setting,
          `${setting.name} `,
          setting.id,
          eventActions.view,
          "",
          ipAddress
        );
        res.status(200).json(setting);
      }
    });

    // res.status(200).json(setting);
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};

const editSetting = async (req, res) => {
  const settingBody = req.body;
  const id = req.params.id;

  try {
    // if (!(await canUserEdit(req.user, "settings"))) {
    //   return res.status(401).json({ msg: "unauthorized access!" });
    // }
    const duplicateName = await Setting.findAll({
      where: { name: settingBody.name },
    });
    // if (duplicateName.length !== 0) {
    //   if (duplicateName[0].id !== settingBody.id) {
    //     res.status(400).json({ msg: "Setting name already used!" });
    //     return;
    //   }
    // }
    let oldDept = await Setting.findByPk(id, {});
    let dept = Setting.update(settingBody, {
      where: { id: id },
    });

    if (dept) {
      let newDept = await Setting.findByPk(id, {});
      let changedFieldValues = getChangedFieldValues(oldDept, newDept);
      let ipAddress = getIpAddress(req.ip);
      const eventLog = createEventLog(
        req.user.id,
        eventResourceTypes.setting,
        newDept.name,
        newDept.id,
        eventActions.edit,
        changedFieldValues,
        ipAddress
      );
    }

    res.status(200).json({ id });
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};

const deleteSetting = async (req, res) => {
  const id = req.params.id;
  try {
    // if (!(await canUserDelete(req.user, "settings"))) {
    //   return res.status(401).json({ msg: "unauthorized access!" });
    // }
    let setting = await Setting.findByPk(id, {});
    let dept = await Setting.destroy({ where: { id: id } });
    if (dept) {
      let ipAddress = getIpAddress(req.ip);
      const eventLog = createEventLog(
        req.user.id,
        eventResourceTypes.setting,
        `${setting.name} `,
        setting.id,
        eventActions.delete,
        "",
        ipAddress
      );
    }
    res.status(200).json({ id });
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};

module.exports = {
  getSetting,
  createSetting,
  createSettings,
  getSettingByPk,
  editSetting,
  deleteSetting,
};
