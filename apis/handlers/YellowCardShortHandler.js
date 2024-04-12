const { Op } = require("sequelize");
const YellowCardShort = require("../../models/YellowCardShort");
const User = require("../../models/acl/user");
const Employee = require("../../models/Employee");
const {
  canUserRead,
  canUserCreate,
  canUserEdit,
  canUserDelete,
} = require("../../utils/Authrizations");
const { eventResourceTypes, eventActions } = require("../../utils/constants");
const {
  createEventLog,
  getChangedFieldValues,
  getIpAddress,
} = require("../../utils/GeneralUtils");

const getYellowCardShort = async (req, res) => {
  try {
    // if (!(await canUserRead(req.user, "yellowCardShorts"))) {
    //   return res.status(401).json({ msg: "unauthorized access!" });
    // }
    const { f, r, st, sc, sd } = req.query;
    const currentUser = await User.findByPk(req.user.id, {
      include: [Employee],
    });

    if (req.type == "all") {
      const data = await YellowCardShort.findAndCountAll({
        offset: Number(f),
        limit: Number(r),
        order: sc
          ? [[sc, sd == 1 ? "ASC" : "DESC"]]
          : [["createdAt", sd == 1 ? "DESC" : "ASC"]],
        where: getSearch(st),
      });
      res.status(200).json(data);
    }else if (req.type == "self"){
      const data = await YellowCardShort.findAndCountAll({
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
      const data = await YellowCardShort.findAndCountAll({
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
      const data = await YellowCardShort.findAndCountAll({
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
      const data = await YellowCardShort.findAndCountAll({
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
    // [Op.or]: [
    //   {
    //     vehicle: {
    //       [Op.like]: "%" + st + "%",
    //     },
    //   },
    // ],
  };
};
//posting
const createYellowCardShort = async (req, res) => {
  const yellowCardShortBody = req.body;
  try {
    // if (!(await canUserCreate(req.user, "yellowCardShorts"))) {
    //   return res.status(401).json({ msg: "unauthorized access!" });
    // }
    // const ducplicateCountry = await YellowCardShort.findAll({
    //   where: { vehicle: yellowCardShortBody.vehicle },
    // });
    // if (ducplicateCountry.length > 0) {
    //   res.status(400).json({ msg: "YellowCardShort vehicle already used!" });
    //   return;
    // }
    const yellowCardShort = await YellowCardShort.create(yellowCardShortBody);
    if (yellowCardShort) {
      let ipAddress = getIpAddress(req.ip);
      const eventLog = await createEventLog(
        req.user.id,
        eventResourceTypes.yellowCardShort,
        `${yellowCardShort.yellowCardId} `,
        yellowCardShort.id,
        eventActions.create,
        "",
        ipAddress
      );
    }
    res.status(200).json(yellowCardShort);
  } catch (error) {
    
    res.status(400).json({ msg: error.message });
  }
};

const getYellowCardShortByPk = async (req, res) => {
  try {
    // if (!(await canUserRead(req.user, "yellowCardShorts"))) {
    //   return res.status(401).json({ msg: "unauthorized access!" });
    // }
    const yellowCardShort = await YellowCardShort.findByPk(
      req.params.id,
      {}
    ).then(function (yellowCardShort) {
      if (!yellowCardShort) {
        res.status(404).json({ message: "No Data Found" });
      } else if (yellowCardShort) {
        let ipAddress = getIpAddress(req.ip);
        const eventLog = createEventLog(
          req.user.id,
          eventResourceTypes.yellowCardShort,
          `${yellowCardShort.yellowCardId} `,
          yellowCardShort.id,
          eventActions.view,
          "",
          ipAddress
        );
        res.status(200).json(yellowCardShort);
      }
    });

    // res.status(200).json(yellowCardShort);
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};

const editYellowCardShort = async (req, res) => {
  const yellowCardShortBody = req.body;
  const id = req.params.id;

  try {
    // if (!(await canUserEdit(req.user, "yellowCardShorts"))) {
    //   return res.status(401).json({ msg: "unauthorized access!" });
    // }
    const duplicateName = await YellowCardShort.findAll({
      where: { yellowCardId: yellowCardShortBody.yellowCardId },
    });
    if (duplicateName.length !== 0) {
      if (duplicateName[0].id !== yellowCardShortBody.id) {
        res
          .status(400)
          .json({ msg: "YellowCardShort yellowCard already used!" });
        return;
      }
    }
    let oldDept = await YellowCardShort.findByPk(id, {});
    let dept = YellowCardShort.update(yellowCardShortBody, {
      where: { id: id },
    });

    if (dept) {
      let newDept = await YellowCardShort.findByPk(id, {});
      let changedFieldValues = getChangedFieldValues(oldDept, newDept);
      let ipAddress = getIpAddress(req.ip);
      const eventLog = createEventLog(
        req.user.id,
        eventResourceTypes.yellowCardShort,
        newDept.yellowCardId,
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

const deleteYellowCardShort = async (req, res) => {
  const id = req.params.id;
  try {
    // if (!(await canUserDelete(req.user, "yellowCardShorts"))) {
    //   return res.status(401).json({ msg: "unauthorized access!" });
    // }
    let yellowCardShort = await YellowCardShort.findByPk(id, {});
    let dept = await YellowCardShort.destroy({ where: { id: id } });
    if (dept) {
      let ipAddress = getIpAddress(req.ip);
      const eventLog = createEventLog(
        req.user.id,
        eventResourceTypes.yellowCardShort,
        `${yellowCardShort.yellowCardId} `,
        yellowCardShort.id,
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
  getYellowCardShort,
  createYellowCardShort,
  getYellowCardShortByPk,
  editYellowCardShort,
  deleteYellowCardShort,
};
