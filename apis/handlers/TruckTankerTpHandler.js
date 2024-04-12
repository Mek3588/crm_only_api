const { Op } = require("sequelize");
const Vehicle = require("../../models/motor/Vehicle");
const TruckTankerTp = require("../../models/TruckTankerTp");
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

const getTruckTankerTp = async (req, res) => {
  try {
    // if (!(await canUserRead(req.user, "truckTankerTps"))) {
    //   return res.status(401).json({ msg: "unauthorized access!" });
    // }
    const { f, r, st, sc, sd, type } = req.query;
    const data = await TruckTankerTp.findAndCountAll({
      offset: Number(f),
      limit: Number(r),
      order: sc
        ? [[sc, sd == 1 ? "ASC" : "DESC"]]
        : [["createdAt", sd == 1 ? "DESC" : "ASC"]],
        include: [
          { model: Vehicle, as: "vehicle" },
        ],
        where: {
          [Op.and]: [
            {
              vehicleType: type,
            },
            getSearch(st),
          ],
        }    });
    res.status(200).json(data);
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
        purpose: {
          [Op.like]: "%" + st + "%",
        },
        // maxCapacity: {
        //   [Op.like]: "%" + st + "%",
        // },
        // initPremium: {
        //   [Op.like]: "%" + st + "%",
        // },
        // vehicleId: {
        //   [Op.like]: "%" + st + "%",
        // },
      },
    ],
  };
};
//posting
const createTruckTankerTp = async (req, res) => {
  const truckTankerTpBody = req.body;
  
  try {
    // if (!(await canUserCreate(req.user, "truckTankerTps"))) {
    //   return res.status(401).json({ msg: "unauthorized access!" });
    // }
    // const ducplicateCountry = await TruckTankerTp.findAll({
    //   where: { vehicleType: truckTankerTpBody.vehicleType },
    // });
    // if (ducplicateCountry.length > 0) {
    //   res.status(400).json({ msg: "TruckTankerTp vehicleType already used!" });
    //   return;
    // }
    const truckTankerTp = await TruckTankerTp.create(truckTankerTpBody);
    if (truckTankerTp) {
      let ipAddress = getIpAddress(req.ip);
      const eventLog = await createEventLog(
        req.user.id,
        eventResourceTypes.truckTankerTp,
        `${truckTankerTp.vehicleType} `,
        truckTankerTp.id,
        eventActions.create,
        "",
        ipAddress
      );
    }
    res.status(200).json(truckTankerTp);
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};

const getTruckTankerTpByPk = async (req, res) => {
  try {
    // if (!(await canUserRead(req.user, "truckTankerTps"))) {
    //   return res.status(401).json({ msg: "unauthorized access!" });
    // }
    const truckTankerTp = await TruckTankerTp.findByPk(req.params.id, {}).then(
      function (truckTankerTp) {
        if (!truckTankerTp) {
          res.status(404).json({ message: "No Data Found" });
        } else if (truckTankerTp) {
          let ipAddress = getIpAddress(req.ip);
          const eventLog = createEventLog(
            req.user.id,
            eventResourceTypes.truckTankerTp,
            `${truckTankerTp.vehicleType} `,
            truckTankerTp.id,
            eventActions.view,
            "",
            ipAddress
          );
          res.status(200).json(truckTankerTp);
        }
      }
    );

    // res.status(200).json(truckTankerTp);
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};

const editTruckTankerTp = async (req, res) => {
  const truckTankerTpBody = req.body;
  const id = req.params.id;

  try {
    // if (!(await canUserEdit(req.user, "truckTankerTps"))) {
    //   return res.status(401).json({ msg: "unauthorized access!" });
    // }
    // const duplicateName = await TruckTankerTp.findAll({
    //   where: { vehicleType: truckTankerTpBody.vehicleType },
    // });
    // if (duplicateName.length !== 0) {
    //   if (duplicateName[0].id !== truckTankerTpBody.id) {
    //     res
    //       .status(400)
    //       .json({ msg: "TruckTankerTp vehicleType already used!" });
    //     return;
    //   }
    // }
    let oldDept = await TruckTankerTp.findByPk(id, {});
    let dept = TruckTankerTp.update(truckTankerTpBody, {
      where: { id: id },
    });

    if (dept) {
      let newDept = await TruckTankerTp.findByPk(id, {});
      let changedFieldValues = getChangedFieldValues(oldDept, newDept);
      let ipAddress = getIpAddress(req.ip);
      const eventLog = createEventLog(
        req.user.id,
        eventResourceTypes.truckTankerTp,
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

const deleteTruckTankerTp = async (req, res) => {
  const id = req.params.id;
  try {
    // if (!(await canUserDelete(req.user, "truckTankerTps"))) {
    //   return res.status(401).json({ msg: "unauthorized access!" });
    // }
    let truckTankerTp = await TruckTankerTp.findByPk(id, {});
    let dept = await TruckTankerTp.destroy({ where: { id: id } });
    if (dept) {
      let ipAddress = getIpAddress(req.ip);
      const eventLog = createEventLog(
        req.user.id,
        eventResourceTypes.truckTankerTp,
        `${truckTankerTp.vehicleType} `,
        truckTankerTp.id,
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
  getTruckTankerTp,
  createTruckTankerTp,
  getTruckTankerTpByPk,
  editTruckTankerTp,
  deleteTruckTankerTp,
};
