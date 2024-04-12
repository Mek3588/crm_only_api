const { Op } = require("sequelize");
const ActionPrevilage = require("../../models/ActionPrevilages");
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

const getActionPrevilage = async (req, res) => {
  try {
    // if (!(await canUserRead(req.user, "actionPrevilages"))) {
    //   return res.status(401).json({ msg: "unauthorized access!" });
    // }
    const { f, r, st, sc, sd } = req.query;
    const data = await ActionPrevilage.findAndCountAll({
      offset: Number(f),
      limit: Number(r),
      order: sc
        ? [[sc, sd == 1 ? "ASC" : "DESC"]]
        : [["createdAt", sd == 1 ? "DESC" : "ASC"]],
      where: getSearch(st),
    });
    res.status(200).json(data);
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};

const getSearch = (st) => {
  return {
    [Op.or]: [
      {
        object: {
          [Op.like]: "%" + st + "%",
        },
      },
    ],
  };
};
//posting
const createActionPrevilage = async (req, res) => {
  const actionPrevilageBody = req.body;
  try {
    // if (!(await canUserCreate(req.user, "actionPrevilages"))) {
    //   return res.status(401).json({ msg: "unauthorized access!" });
    // }
    const ducplicateCountry = await ActionPrevilage.findAll({
      where: { object: actionPrevilageBody.object },
    });
    if (ducplicateCountry.length > 0) {
      res.status(400).json({ msg: "ActionPrevilage object already used!" });
      return;
    }
    const actionPrevilage = await ActionPrevilage.create(actionPrevilageBody);
    if (actionPrevilage) {
      let ipAddress = getIpAddress(req.ip);
      const eventLog = await createEventLog(
        req.user.id,
        eventResourceTypes.actionPrevilage,
        `${actionPrevilage.object} `,
        actionPrevilage.id,
        eventActions.create,
        "",
        ipAddress
      );
    }
    res.status(200).json(actionPrevilage);
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};

const getActionPrevilageByPk = async (req, res) => {
  try {
    // if (!(await canUserRead(req.user, "actionPrevilages"))) {
    //   return res.status(401).json({ msg: "unauthorized access!" });
    // }
    const actionPrevilage = await ActionPrevilage.findByPk(
      req.params.id,
      {}
    ).then(function (actionPrevilage) {
      if (!actionPrevilage) {
        res.status(404).json({ message: "No Data Found" });
      } else if (actionPrevilage) {
        let ipAddress = getIpAddress(req.ip);
        const eventLog = createEventLog(
          req.user.id,
          eventResourceTypes.actionPrevilage,
          `${actionPrevilage.object} `,
          actionPrevilage.id,
          eventActions.view,
          "",
          ipAddress
        );
        res.status(200).json(actionPrevilage);
      }
    });

    // res.status(200).json(actionPrevilage);
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};

const editActionPrevilage = async (req, res) => {
  const actionPrevilageBody = req.body;
  const id = req.params.id;

  try {
    // if (!(await canUserEdit(req.user, "actionPrevilages"))) {
    //   return res.status(401).json({ msg: "unauthorized access!" });
    // }
    const duplicateName = await ActionPrevilage.findAll({
      where: { object: actionPrevilageBody.object },
    });
    if (duplicateName.length !== 0) {
      if (duplicateName[0].id !== actionPrevilageBody.id) {
        res.status(400).json({ msg: "ActionPrevilage object already used!" });
        return;
      }
    }
    let oldDept = await ActionPrevilage.findByPk(id, {});
    let dept = ActionPrevilage.update(actionPrevilageBody, {
      where: { id: id },
    });

    if (dept) {
      let newDept = await ActionPrevilage.findByPk(id, {});
      let changedFieldValues = getChangedFieldValues(oldDept, newDept);
      let ipAddress = getIpAddress(req.ip);
      const eventLog = createEventLog(
        req.user.id,
        eventResourceTypes.actionPrevilage,
        newDept.object,
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

const deleteActionPrevilage = async (req, res) => {
  const id = req.params.id;
  try {
    // if (!(await canUserDelete(req.user, "actionPrevilages"))) {
    //   return res.status(401).json({ msg: "unauthorized access!" });
    // }
    let actionPrevilage = await ActionPrevilage.findByPk(id, {});
    let dept = await ActionPrevilage.destroy({ where: { id: id } });
    if (dept) {
      let ipAddress = getIpAddress(req.ip);
      const eventLog = createEventLog(
        req.user.id,
        eventResourceTypes.actionPrevilage,
        `${actionPrevilage.object} `,
        actionPrevilage.id,
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
  getActionPrevilage,
  createActionPrevilage,
  getActionPrevilageByPk,
  editActionPrevilage,
  deleteActionPrevilage,
};
