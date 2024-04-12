const { Op } = require("sequelize");
const Bsg = require("../../../models/BSG");
// const {
//   canUserRead,
//   canUserCreate,
//   canUserEdit,
//   canUserDelete,
// } = require("../../../utils/Authrizations");
const { eventResourceTypes, eventActions } = require("../../../utils/constants");
const {
  createEventLog,
  getChangedFieldValues,
  getIpAddress,
} = require("../../../utils/GeneralUtils");
const TpUnitPrice = require("../../../models/quotation/tp_unitPrice");
const Vehicle = require("../../../models/motor/Vehicle");
const User = require("../../../models/acl/user");
const Employee = require("../../../models/Employee");

const getTpUnitPrice = async (req, res) => {
  try {
    // if (!(await canUserRead(req.user, "tpUnitPrices"))) {
    //   return res.status(401).json({ msg: "unauthorized access!" });
    // }
    const { f, r, st, sc, sd,
      //  type 
      } = req.query;
    const currentUser = await User.findByPk(req.user.id, {
      include: [Employee],
    });

    //req.type="self"

    if (req.type == "all") {
    const data = await TpUnitPrice.findAndCountAll({
      offset: Number(f),
      limit: Number(r),
      order: sc
        ? [[sc, sd == 1 ? "ASC" : "DESC"]]
        : [["createdAt", sd == 1 ? "DESC" : "ASC"]],
        where: {
          [Op.and]: [
            // {
            //   vehicle_type: type,
            // },
            getSearch(st),
          ],
        },      // include: [{model: Vehicle, as: "Vehicle"}]
    });
    res.status(200).json(data);
    }else if (req.type == "self"){
      const data = await TpUnitPrice.findAndCountAll({
        offset: Number(f),
        limit: Number(r),
        order: sc
          ? [[sc, sd == 1 ? "ASC" : "DESC"]]
          : [["createdAt", sd == 1 ? "DESC" : "ASC"]],
          where: {
            [Op.and]: [
              // {
              //   vehicle_type: type,
              // },
              {userId: currentUser.id},
              getSearch(st),
            ],
          },      // include: [{model: Vehicle, as: "Vehicle"}]
      });
      res.status(200).json(data);
    }else if (req.type == "customer"){
      const data = await TpUnitPrice.findAndCountAll({
        offset: Number(f),
        limit: Number(r),
        order: sc
          ? [[sc, sd == 1 ? "ASC" : "DESC"]]
          : [["createdAt", sd == 1 ? "DESC" : "ASC"]],
          where: {
            [Op.and]: [
              // {
              //   vehicle_type: type,
              // },
              {userId: currentUser.id},
              getSearch(st),
            ],
          },      // include: [{model: Vehicle, as: "Vehicle"}]
      });
      res.status(200).json(data);
    }else if (req.type == "branch"){
      const data = await TpUnitPrice.findAndCountAll({
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
          [Op.and]: [
            // {
            //   vehicle_type: type,
            // },
            {"$user.employee.branchId$": currentUser.employee.branchId},
            getSearch(st),
          ],
        },      // include: [{model: Vehicle, as: "Vehicle"}]
      });
      res.status(200).json(data);
    }else if (req.type == "branchAndSelf"){
      const data = await TpUnitPrice.findAndCountAll({
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
          [Op.and]: [
            // {
            //   vehicle_type: type,
            // },
            {userId: currentUser.id},
            {"$user.employee.branchId$": currentUser.employee.branchId},
            getSearch(st),
          ],
        },      // include: [{model: Vehicle, as: "Vehicle"}]
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
        vehicle_type: {
          [Op.like]: "%" + st + "%",
        },
      },
    ],
  };
};
//posting
const createTpUnitPrice = async (req, res) => {
  const tpUnitPriceBody = req.body;
  try {
    // 
    // if (!(await canUserCreate(req.user, "tpUnitPrices"))) {
    //   return res.status(401).json({ msg: "unauthorized access!" });
    // }
    // const ducplicateCountry = await Bsg.findAll({
    //   where: { vehicle: tpUnitPriceBody.vehicle },
    // });
    // if (ducplicateCountry.length > 0) {
    //   res.status(400).json({ msg: "Bsg vehicle already used!" });
    //   return;
    // }
    const tpUnitPrice = await TpUnitPrice.create(tpUnitPriceBody);
    if (tpUnitPrice) {
      let ipAddress = getIpAddress(req.ip);
      const eventLog = await createEventLog(
        req.user.id,
        eventResourceTypes.tpUnitPrice,
        `${tpUnitPrice.vehicle_type} `,
        tpUnitPrice.id,
        eventActions.create,
        "",
        ipAddress
      );
    }
    res.status(200).json(tpUnitPrice);
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};

const getTpUnitPriceByPk = async (req, res) => {
  try {
    // if (!(await canUserRead(req.user, "tpUnitPrices"))) {
    //   return res.status(401).json({ msg: "unauthorized access!" });
    // }
    const tpUnitPrice = await TpUnitPrice.findByPk(req.params.id, {}).then(function (tpUnitPrice) {
      if (!tpUnitPrice) {
        res.status(404).json({ message: "No Data Found" });
      } else if (tpUnitPrice) {
        let ipAddress = getIpAddress(req.ip);
        const eventLog = createEventLog(
          req.user.id,
          eventResourceTypes.tpUnitPrice,
          `${tpUnitPrice.vehicle_type} `,
          tpUnitPrice.id,
          eventActions.view,
          "",
          ipAddress
        );
        res.status(200).json(tpUnitPrice);
      }
    });

    // res.status(200).json(bsg);
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};

const editTpUnitPrice= async (req, res) => {
  const tpUnitPriceBody = req.body;
  const id = req.params.id;

  try {
    // if (!(await canUserEdit(req.user, "tpUnitPrices"))) {
    //   return res.status(401).json({ msg: "unauthorized access!" });
    // }
    // const duplicateName = await TpUnitPrice.findAll({
    //   where: { id : id},
    // });
    // if (duplicateName.length !== 0) {
    //   if (duplicateName[0s].id !== tpUnitPriceBody.id) {
    //     res.status(400).jon({ msg: "tpUnitPrice already used!" });
    //     return;
    //   }
    // }
    let oldDept = await TpUnitPrice.findByPk(id, {});
    let dept = TpUnitPrice.update(tpUnitPriceBody, {
      where: { id: id },
    });

    if (dept) {
      let newDept = await TpUnitPrice.findByPk(id, {});
      let changedFieldValues = getChangedFieldValues(oldDept, newDept);
      let ipAddress = getIpAddress(req.ip);
      const eventLog = createEventLog(
        req.user.id,
        eventResourceTypes.tpUnitPrice,
        newDept.vehicle_type,
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

const deleteTpUnitPrice = async (req, res) => {
  const id = req.params.id;
  try {
    // if (!(await canUserDelete(req.user, "tpUnitPrices"))) {
    //   return res.status(401).json({ msg: "unauthorized access!" });
    // }
    let tpUnitPrice = await TpUnitPrice.findByPk(id, {});
    let dept = await TpUnitPrice.destroy({ where: { id: id } });
    if (dept) {
      let ipAddress = getIpAddress(req.ip);
      const eventLog = createEventLog(
        req.user.id,
        eventResourceTypes.tpUnitPrice,
        `${tpUnitPrice.vehicle_type} `,
        tpUnitPrice.id,
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
  getTpUnitPrice,
  createTpUnitPrice,
  getTpUnitPriceByPk,
  editTpUnitPrice,
  deleteTpUnitPrice,
};
