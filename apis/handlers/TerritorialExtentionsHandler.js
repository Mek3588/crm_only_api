const { Op } = require("sequelize");
const TerritorialExtension = require("../../models/TerritorialExtension");
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

const getTerritorialExtension = async (req, res) => {
  try {

    const { f, r, st, sc, sd } = req.query;
    const currentUser = await User.findByPk(req.user.id, {
      include: [Employee],
    });


    if (req.type == "all") {
      const data = await TerritorialExtension.findAndCountAll({
        offset: Number(f),
        limit: Number(r),
        order: sc
          ? [[sc, sd == 1 ? "ASC" : "DESC"]]
          : [["createdAt", sd == 1 ? "DESC" : "ASC"]],
        where: {...getSearch(st)},
      });
      res.status(200).json(data);
    }else if (req.type == "self"){
      const data = await TerritorialExtension.findAndCountAll({
        offset: Number(f),
        limit: Number(r),
        order: sc
          ? [[sc, sd == 1 ? "ASC" : "DESC"]]
          : [["createdAt", sd == 1 ? "DESC" : "ASC"]],
        where: {
          userId: currentUser.id,
          ...getSearch(st)},
      });
      res.status(200).json(data);
    }else if (req.type == "customer"){
      const data = await TerritorialExtension.findAndCountAll({
        offset: Number(f),
        limit: Number(r),
        order: sc
          ? [[sc, sd == 1 ? "ASC" : "DESC"]]
          : [["createdAt", sd == 1 ? "DESC" : "ASC"]],
        where: {
          // userId: currentUser.id,
          ...getSearch(st)},
      });
      res.status(200).json(data);
    }else if (req.type == "branch"){
      const data = await TerritorialExtension.findAndCountAll({
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
          ...getSearch(st)},
      });
      res.status(200).json(data);
    }else if (req.type == "branchAndSelf"){
      const data = await TerritorialExtension.findAndCountAll({
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
          ...getSearch(st)},
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
        country: {
          [Op.like]: "%" + st + "%",
        },
      },
    ],
  };
};
//posting
const createTerritorialExtension = async (req, res) => {
  const territorialExtensionBody = req.body;
  try {
    // if (!(await canUserCreate(req.user, "territorialExtensions"))) {
    //   return res.status(401).json({ msg: "unauthorized access!" });
    // }
    const ducplicateCountry = await TerritorialExtension.findAll({
      where: { country: territorialExtensionBody.country },
    });
    if (ducplicateCountry.length > 0) {
      res
        .status(400)
        .json({ msg: "TerritorialExtension country already used!" });
      return;
    }
    const territorialExtension = await TerritorialExtension.create(
      territorialExtensionBody
    );
    if (territorialExtension) {
      let ipAddress = getIpAddress(req.ip);
      const eventLog = await createEventLog(
        req.user.id,
        eventResourceTypes.territorialExtension,
        `${territorialExtension.country} `,
        territorialExtension.id,
        eventActions.create,
        "",
        ipAddress
      );
    }
    res.status(200).json(territorialExtension);
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};

const getTerritorialExtensionByPk = async (req, res) => {
  try {
    // if (!(await canUserRead(req.user, "territorialExtensions"))) {
    //   return res.status(401).json({ msg: "unauthorized access!" });
    // }
    const territorialExtension = await TerritorialExtension.findByPk(
      req.params.id,
      {
      }
    ).then(function (territorialExtension) {
      if (!territorialExtension) {
        res.status(404).json({ message: "No Data Found" });
      } else if (territorialExtension) {
        let ipAddress = getIpAddress(req.ip);
        const eventLog = createEventLog(
          req.user.id,
          eventResourceTypes.territorialExtension,
          `${territorialExtension.country} `,
          territorialExtension.id,
          eventActions.view,
          "",
          ipAddress
        );
        res.status(200).json(territorialExtension);
      }
    });

    // res.status(200).json(territorialExtension);
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};

const editTerritorialExtension = async (req, res) => {
  const territorialExtensionBody = req.body;
  const id = req.params.id;

  try {
    // if (!(await canUserEdit(req.user, "territorialExtensions"))) {
    //   return res.status(401).json({ msg: "unauthorized access!" });
    // }
    const duplicateName = await TerritorialExtension.findAll({
      where: { country: territorialExtensionBody.country },
    });
    if (duplicateName.length !== 0) {
      if (duplicateName[0].id !== territorialExtensionBody.id) {
        res
          .status(400)
          .json({ msg: "TerritorialExtension country already used!" });
        return;
      }
    }
    let oldDept = await TerritorialExtension.findByPk(id, {});
    let dept = TerritorialExtension.update(territorialExtensionBody, {
      where: { id: id },
    });

    if (dept) {
      let newDept = await TerritorialExtension.findByPk(id, {});
      let changedFieldValues = getChangedFieldValues(oldDept, newDept);
      let ipAddress = getIpAddress(req.ip);
      const eventLog = createEventLog(
        req.user.id,
        eventResourceTypes.territorialExtension,
        newDept.country,
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

const deleteTerritorialExtension = async (req, res) => {
  const id = req.params.id;
  try {
    // if (!(await canUserDelete(req.user, "territorialExtensions"))) {
    //   return res.status(401).json({ msg: "unauthorized access!" });
    // }
    let territorialExtension = await TerritorialExtension.findByPk(id, {});
    let dept = await TerritorialExtension.destroy({ where: { id: id } });
    if (dept) {
      let ipAddress = getIpAddress(req.ip);
      const eventLog = createEventLog(
        req.user.id,
        eventResourceTypes.territorialExtension,
        `${territorialExtension.country} `,
        territorialExtension.id,
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
  getTerritorialExtension,
  createTerritorialExtension,
  getTerritorialExtensionByPk,
  editTerritorialExtension,
  deleteTerritorialExtension,
};
