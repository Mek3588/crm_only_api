const { Op } = require("sequelize");
const BusTaxiTp = require("../../models/BusTaxiTp");
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

const getBusTaxiTp = async (req, res) => {
  try {
    // if (!(await canUserRead(req.user, "busTaxiTps"))) {
    //   return res.status(401).json({ msg: "unauthorized access!" });
    // }
    const { f, r, st, sc, sd, type } = req.query;
    const data = await BusTaxiTp.findAndCountAll({
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
          getSearch(st),
        ],
      },
    });
    res.status(200).json(data);
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};

const getAllBusTaxiTp = async (req, res) => {
  
  try {
    const data = await Bsg.findAndCountAll();
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
      },
    ],
  };
};
//posting
const createBusTaxiTp = async (req, res) => {
  const busTaxiTpBody = req.body;
  try {
    // if (!(await canUserCreate(req.user, "busTaxiTps"))) {
    //   return res.status(401).json({ msg: "unauthorized access!" });
    // }
    // const ducplicateCountry = await BusTaxiTp.findAll({
    //   where: { vehicleType: busTaxiTpBody.vehicleType },
    // });
    // if (ducplicateCountry.length > 0) {
    //   res.status(400).json({ msg: "BusTaxiTp vehicleType already used!" });
    //   return;
    // }
    const busTaxiTp = await BusTaxiTp.create(busTaxiTpBody);
    if (busTaxiTp) {
      let ipAddress = getIpAddress(req.ip);
      const eventLog = await createEventLog(
        req.user.id,
        eventResourceTypes.busTaxiTp,
        `${busTaxiTp.vehicleType} `,
        busTaxiTp.id,
        eventActions.create,
        "",
        ipAddress
      );
    }
    res.status(200).json(busTaxiTp);
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};

const getBusTaxiTpByPk = async (req, res) => {
  try {
    // if (!(await canUserRead(req.user, "busTaxiTps"))) {
    //   return res.status(401).json({ msg: "unauthorized access!" });
    // }
    const busTaxiTp = await BusTaxiTp.findByPk(req.params.id, {}).then(
      function (busTaxiTp) {
        if (!busTaxiTp) {
          res.status(404).json({ message: "No Data Found" });
        } else if (busTaxiTp) {
          let ipAddress = getIpAddress(req.ip);
          const eventLog = createEventLog(
            req.user.id,
            eventResourceTypes.busTaxiTp,
            `${busTaxiTp.vehicleType} `,
            busTaxiTp.id,
            eventActions.view,
            "",
            ipAddress
          );
          res.status(200).json(busTaxiTp);
        }
      }
    );

    // res.status(200).json(busTaxiTp);
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};

const editBusTaxiTp = async (req, res) => {
  const busTaxiTpBody = req.body;
  const id = req.params.id;

  try {
    // if (!(await canUserEdit(req.user, "busTaxiTps"))) {
    //   return res.status(401).json({ msg: "unauthorized access!" });
    // }
    const duplicateName = await BusTaxiTp.findAll({
      where: { vehicleType: busTaxiTpBody.vehicleType },
    });
    if (duplicateName.length !== 0) {
      if (duplicateName[0].id !== busTaxiTpBody.id) {
        res.status(400).json({ msg: "BusTaxiTp vehicleType already used!" });
        return;
      }
    }
    let oldDept = await BusTaxiTp.findByPk(id, {});
    let dept = BusTaxiTp.update(busTaxiTpBody, {
      where: { id: id },
    });

    if (dept) {
      let newDept = await BusTaxiTp.findByPk(id, {});
      let changedFieldValues = getChangedFieldValues(oldDept, newDept);
      let ipAddress = getIpAddress(req.ip);
      const eventLog = createEventLog(
        req.user.id,
        eventResourceTypes.busTaxiTp,
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

const deleteBusTaxiTp = async (req, res) => {
  const id = req.params.id;
  try {
    // if (!(await canUserDelete(req.user, "busTaxiTps"))) {
    //   return res.status(401).json({ msg: "unauthorized access!" });
    // }
    let busTaxiTp = await BusTaxiTp.findByPk(id, {});
    let dept = await BusTaxiTp.destroy({ where: { id: id } });
    if (dept) {
      let ipAddress = getIpAddress(req.ip);
      const eventLog = createEventLog(
        req.user.id,
        eventResourceTypes.busTaxiTp,
        `${busTaxiTp.vehicleType} `,
        busTaxiTp.id,
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
  getBusTaxiTp,
  createBusTaxiTp,
  getBusTaxiTpByPk,
  editBusTaxiTp,
  deleteBusTaxiTp,
  getAllBusTaxiTp,
};
