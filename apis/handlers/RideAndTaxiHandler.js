const { Op } = require("sequelize");
const RideAndTaxi = require("../../models/RideAndTaxi");
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
const Vehicle = require("../../models/motor/Vehicle");

const getRideAndTaxi = async (req, res) => {
  try {
    // if (!(await canUserRead(req.user, "rideAndTaxis"))) {
    //   return res.status(401).json({ msg: "unauthorized access!" });
    // }
    
    const { f, r, st, sc, sd } = req.query;
    const data = await RideAndTaxi.findAndCountAll({
      include: [Vehicle],
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

const getRideAndTaxiByType = async (req, res) => {
  try {
    // if (!(await canUserRead(req.user, "rideAndTaxis"))) {
    //   return res.status(401).json({ msg: "unauthorized access!" });
    // }
    
    const { f, r, st, sc, sd } = req.query;
    const { type } = req.params;
    
    const data = await RideAndTaxi.findAndCountAll({
      include: [Vehicle],
      offset: Number(f),
      limit: Number(r),
      order: sc
        ? [[sc, sd == 1 ? "ASC" : "DESC"]]
        : [["createdAt", sd == 1 ? "DESC" : "ASC"]],
      where: {
        [Op.and]: [
          {
            vehicleType: type,
          },
        ],
      },
    });
    res.status(200).json(data);
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};

const getSearch = (st) => {
  return {
    [Op.or]: [],
  };
};
//posting
const createRideAndTaxi = async (req, res) => {
  const rideAndTaxiBody = req.body;
  try {
    // if (!(await canUserCreate(req.user, "rideAndTaxis"))) {
    //   return res.status(401).json({ msg: "unauthorized access!" });
    // }

    const rideAndTaxi = await RideAndTaxi.create(rideAndTaxiBody);
    if (rideAndTaxi) {
      let ipAddress = getIpAddress(req.ip);
      const eventLog = await createEventLog(
        req.user.id,
        eventResourceTypes.rideAndTaxi,
        `${rideAndTaxi.vehicle} `,
        rideAndTaxi.id,
        eventActions.create,
        "",
        ipAddress
      );
    }
    res.status(200).json(rideAndTaxi);
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};

const getRideAndTaxiByPk = async (req, res) => {
  try {
    // if (!(await canUserRead(req.user, "rideAndTaxis"))) {
    //   return res.status(401).json({ msg: "unauthorized access!" });
    // }
    const rideAndTaxi = await RideAndTaxi.findByPk(req.params.id, {}).then(
      function (rideAndTaxi) {
        if (!rideAndTaxi) {
          res.status(404).json({ message: "No Data Found" });
        } else if (rideAndTaxi) {
          let ipAddress = getIpAddress(req.ip);
          const eventLog = createEventLog(
            req.user.id,
            eventResourceTypes.rideAndTaxi,
            `${rideAndTaxi.vehicle} `,
            rideAndTaxi.id,
            eventActions.view,
            "",
            ipAddress
          );
          res.status(200).json(rideAndTaxi);
        }
      }
    );

    // res.status(200).json(rideAndTaxi);
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};

const editRideAndTaxi = async (req, res) => {
  const rideAndTaxiBody = req.body;
  const id = req.params.id;

  try {
    // if (!(await canUserEdit(req.user, "rideAndTaxis"))) {
    //   return res.status(401).json({ msg: "unauthorized access!" });
    // }
    
    const duplicateName = await RideAndTaxi.findAll({
      where: { vehicleId: rideAndTaxiBody.vehicle },
    });
    
    // if (duplicateName.length !== 0) {
    //   if (duplicateName[0].id !== rideAndTaxiBody.id) {
    //     res.status(400).json({ msg: "RideAndTaxi vehicle already used!" });
    //     return;
    //   }
    // }
    let oldDept = await RideAndTaxi.findByPk(id, {});
    let dept = RideAndTaxi.update(rideAndTaxiBody, {
      where: { id: id },
    });
    
    if (dept) {
      let newDept = await RideAndTaxi.findByPk(id, {});
      let changedFieldValues = getChangedFieldValues(oldDept, newDept);
      let ipAddress = getIpAddress(req.ip);
      const eventLog = createEventLog(
        req.user.id,
        eventResourceTypes.rideAndTaxi,
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

const deleteRideAndTaxi = async (req, res) => {
  const id = req.params.id;
  try {
    // if (!(await canUserDelete(req.user, "rideAndTaxis"))) {
    //   return res.status(401).json({ msg: "unauthorized access!" });
    // }
    let rideAndTaxi = await RideAndTaxi.findByPk(id, {});
    let dept = await RideAndTaxi.destroy({ where: { id: id } });
    if (dept) {
      let ipAddress = getIpAddress(req.ip);
      const eventLog = createEventLog(
        req.user.id,
        eventResourceTypes.rideAndTaxi,
        `${rideAndTaxi.vehicle} `,
        rideAndTaxi.id,
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
  getRideAndTaxi,
  getRideAndTaxiByType,
  createRideAndTaxi,
  getRideAndTaxiByPk,
  editRideAndTaxi,
  deleteRideAndTaxi,
};
