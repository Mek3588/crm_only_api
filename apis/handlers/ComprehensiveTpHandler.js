const { Op } = require("sequelize");
const ComprehensiveTp = require("../../models/ComprehnsicveTp");
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

const getComprehensiveTp = async (req, res) => {
  try {
    if (!(await canUserRead(req.user, "comprehensiveTps"))) {
      return res.status(401).json({ msg: "unauthorized access!" });
    }
    const { f, r, st, sc, sd } = req.query;
    
    

    const currentUser = await User.findByPk(req.user.id, {
      include: [Employee],
    });

    if (req.type == "all") {
      let data = await ComprehensiveTp.findAndCountAll({
        offset: Number(f),
        limit: Number(r),
        order: sc
          ? [[sc, sd == 1 ? "ASC" : "DESC"]]
          : [["createdAt", sd == 1 ? "DESC" : "ASC"]],
        where: { ...getSearch(st) },
      });
      
      res.status(200).json(data);
    }else if (req.type == "self"){
      let data = await ComprehensiveTp.findAndCountAll({
        offset: Number(f),
        limit: Number(r),
        order: sc
          ? [[sc, sd == 1 ? "ASC" : "DESC"]]
          : [["createdAt", sd == 1 ? "DESC" : "ASC"]],
        where: { 
          userId: currentUser.id,
          ...getSearch(st) 
        },
      });
      
      res.status(200).json(data);
    }else if (req.type == "customer"){
      let data = await ComprehensiveTp.findAndCountAll({
        offset: Number(f),
        limit: Number(r),
        order: sc
          ? [[sc, sd == 1 ? "ASC" : "DESC"]]
          : [["createdAt", sd == 1 ? "DESC" : "ASC"]],
        where: { 
          userId: currentUser.id,
          ...getSearch(st) 
        },
      });
      
      res.status(200).json(data);
    }else if (req.type == "branch"){
      let data = await ComprehensiveTp.findAndCountAll({
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
          ...getSearch(st) 
        },
      });
      
      res.status(200).json(data);
    }else if (req.type == "branchAndSelf"){
      let data = await ComprehensiveTp.findAndCountAll({
        offset: Number(f),
        limit: Number(r),
        include: {
          model: User, as: 'user',
          include: [Employee],
        },
        order: sc
          ? [[sc, sd == 1 ? "ASC" : "DESC"]]
          : [["createdAt", sd == 1 ? "DESC" : "ASC"]],
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

const getSearch = (st) => {
  return {
    [Op.or]: [
      {
        vehicleType: {
          [Op.like]: "%" + st + "%",
        },
      },
    ],
  };
};
//posting
const createComprehensiveTp = async (req, res) => {
  const comprehensiveTpBody = req.body;
  try {
    if (!(await canUserCreate(req.user, "comprehensiveTps"))) {
      return res.status(401).json({ msg: "unauthorized access!" });
    }
    // const ducplicateCountry = await ComprehensiveTp.findAll({
    //   where: { vehicleType: comprehensiveTpBody.vehicleType },
    // });
    // if (ducplicateCountry.length > 0) {
    //   res.status(400).json({ msg: "ComprehensiveTp vehicleType already used!" });
    //   return;
    // }
    const comprehensiveTp = await ComprehensiveTp.create(comprehensiveTpBody);
    if (comprehensiveTp) {
      let ipAddress = getIpAddress(req.ip);
      const eventLog = await createEventLog(
        req.user.id,
        eventResourceTypes.comprehensiveTp,
        `${comprehensiveTp.vehicleType} `,
        comprehensiveTp.id,
        eventActions.create,
        "",
        ipAddress
      );
    }
    res.status(200).json(comprehensiveTp);
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};

const getComprehensiveTpByPk = async (req, res) => {
  try {
    if (!(await canUserRead(req.user, "comprehensiveTps"))) {
      return res.status(401).json({ msg: "unauthorized access!" });
    }
    const comprehensiveTp = await ComprehensiveTp.findByPk(req.params.id, {}).then(function (
      comprehensiveTp
    ) {
      if (!comprehensiveTp) {
        res.status(404).json({ message: "No Data Found" });
      } else if (comprehensiveTp) {
        let ipAddress = getIpAddress(req.ip);
        const eventLog = createEventLog(
          req.user.id,
          eventResourceTypes.comprehensiveTp,
          `${comprehensiveTp.vehicleType} `,
          comprehensiveTp.id,
          eventActions.view,
          "",
          ipAddress
        );
        res.status(200).json(comprehensiveTp);
      }
    });

    // res.status(200).json(comprehensiveTp);
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};

const editComprehensiveTp = async (req, res) => {
  const comprehensiveTpBody = req.body;
  const id = req.params.id;

  try {
    if (!(await canUserEdit(req.user, "comprehensiveTps"))) {
      return res.status(401).json({ msg: "unauthorized access!" });
    }
    const duplicateName = await ComprehensiveTp.findAll({
      where: { vehicleType: comprehensiveTpBody.vehicleType },
    });
    if (duplicateName.length !== 0) {
      if (duplicateName[0].id !== comprehensiveTpBody.id) {
        res.status(400).json({ msg: "ComprehensiveTp vehicleType already used!" });
        return;
      }
    }
    let oldDept = await ComprehensiveTp.findByPk(id, {});
    let dept = ComprehensiveTp.update(comprehensiveTpBody, {
      where: { id: id },
    });

    if (dept) {
      let newDept = await ComprehensiveTp.findByPk(id, {});
      let changedFieldValues = getChangedFieldValues(oldDept, newDept);
      let ipAddress = getIpAddress(req.ip);
      const eventLog = createEventLog(
        req.user.id,
        eventResourceTypes.comprehensiveTp,
        newDept.vehicleType,
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

const deleteComprehensiveTp = async (req, res) => {
  const id = req.params.id;
  try {
    if (!(await canUserDelete(req.user, "comprehensiveTps"))) {
      return res.status(401).json({ msg: "unauthorized access!" });
    }
    let comprehensiveTp = await ComprehensiveTp.findByPk(id, {});
    let dept = await ComprehensiveTp.destroy({ where: { id: id } });
    if (dept) {
      let ipAddress = getIpAddress(req.ip);
      const eventLog = createEventLog(
        req.user.id,
        eventResourceTypes.comprehensiveTp,
        `${comprehensiveTp.vehicleType} `,
        comprehensiveTp.id,
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
  getComprehensiveTp,
  createComprehensiveTp,
  getComprehensiveTpByPk,
  editComprehensiveTp,
  deleteComprehensiveTp,
};
