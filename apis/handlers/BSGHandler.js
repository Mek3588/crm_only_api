const { Op, json } = require("sequelize");
const Bsg = require("../../models/BSG");
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

const getBsg = async (req, res) => {
  try {
    // if (!(await canUserRead(req.user, "bsgs"))) {
    //   return res.status(401).json({ msg: "unauthorized access!" });
    // }
    const { f, r, st, sc, sd } = req.query;
    
    

    const currentUser = await User.findByPk(req.user.id, {
      include: [Employee],
    });
    //req.type = "branch"

    if (req.type == "all") {
      const data = await Bsg.findAndCountAll({
      
        // offset: Number(f),
        // limit: Number(r),
        // order: sc
        //   ? [[sc, sd == 1 ? "ASC" : "DESC"]]
        //   : [["createdAt", sd == 1 ? "DESC" : "ASC"]],
        // where: getSearch(st),
      });
      
      res.status(200).json(data);
    }else if (req.type == "self"){
      const data = await Bsg.findAndCountAll({
      
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
      const data = await Bsg.findAndCountAll({
      
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
      const data = await Bsg.findAndCountAll({
      
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
      const data = await Bsg.findAndCountAll({
      
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
        vehicle: {
          [Op.like]: "%" + st + "%",
        },
      },
    ],
  };
};
//posting
const createBsg = async (req, res) => {
  const bsgBody = req.body;
  try {
    // if (!(await canUserCreate(req.user, "bsgs"))) {
    //   return res.status(401).json({ msg: "unauthorized access!" });
    // }
    const ducplicateCountry = await Bsg.findAll({
      where: { vehicle: bsgBody.vehicle },
    });
    if (ducplicateCountry.length > 0) {
      res.status(400).json({ msg: "Bsg vehicle already used!" });
      return;
    }
    const bsg = await Bsg.create(bsgBody);
    if (bsg) {
      let ipAddress = getIpAddress(req.ip);
      const eventLog = await createEventLog(
        req.user.id,
        eventResourceTypes.bsg,
        `${bsg.vehicle} `,
        bsg.id,
        eventActions.create,
        "",
        ipAddress
      );
    }
    res.status(200).json(bsg);
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};

const getBsgByPk = async (req, res) => {
  try {
    // if (!(await canUserRead(req.user, "bsgs"))) {
    //   return res.status(401).json({ msg: "unauthorized access!" });
    // }
    const bsg = await Bsg.findByPk(req.params.id, {}).then(function (bsg) {
      if (!bsg) {
        res.status(404).json({ message: "No Data Found" });
      } else if (bsg) {
        let ipAddress = getIpAddress(req.ip);
        const eventLog = createEventLog(
          req.user.id,
          eventResourceTypes.bsg,
          `${bsg.vehicle} `,
          bsg.id,
          eventActions.view,
          "",
          ipAddress
        );
        res.status(200).json(bsg);
      }
    });

    // res.status(200).json(bsg);
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};

const editBsg = async (req, res) => {
  const bsgBody = req.body;
  const id = req.params.id;

  try {
    // if (!(await canUserEdit(req.user, "bsgs"))) {
    //   return res.status(401).json({ msg: "unauthorized access!" });
    // }
    const duplicateName = await Bsg.findAll({
      where: { vehicle: bsgBody.vehicle },
    });
    if (duplicateName.length !== 0) {
      if (duplicateName[0].id !== bsgBody.id) {
        res.status(400).json({ msg: "Bsg vehicle already used!" });
        return;
      }
    }
    let oldDept = await Bsg.findByPk(id, {});
    let dept = Bsg.update(bsgBody, {
      where: { id: id },
    });

    if (dept) {
      let newDept = await Bsg.findByPk(id, {});
      let changedFieldValues = getChangedFieldValues(oldDept, newDept);
      let ipAddress = getIpAddress(req.ip);
      const eventLog = createEventLog(
        req.user.id,
        eventResourceTypes.bsg,
        newDept.vehicle,
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

const getAllBsg = async (req, res) => {
  
  try {
    const data = await Bsg.findAndCountAll();
    res.status(200).json(data);
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};

const getAllBsgCharts = async (req, res) => {
  try {
    
    const data = await Bsg.findAndCountAll({
      include: [Vehicle],
      where: { vehicleType: req.params.name },
    });
    res.status(200).json(data);
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};


const deleteBsg = async (req, res) => {
  const id = req.params.id;
  try {
    // if (!(await canUserDelete(req.user, "bsgs"))) {
    //   return res.status(401).json({ msg: "unauthorized access!" });
    // }
    let bsg = await Bsg.findByPk(id, {});
    let dept = await Bsg.destroy({ where: { id: id } });
    if (dept) {
      let ipAddress = getIpAddress(req.ip);
      const eventLog = createEventLog(
        req.user.id,
        eventResourceTypes.bsg,
        `${bsg.vehicle} `,
        bsg.id,
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
  getBsg,
  createBsg,
  getBsgByPk,
  editBsg,
  deleteBsg,
  getAllBsg,
  getAllBsgCharts,
};
