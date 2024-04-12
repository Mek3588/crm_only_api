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
const Bus = require("../../../models/quotation/Buses");
const Vehicle = require("../../../models/motor/Vehicle");
const CCTP = require("../../../models/quotation/cc_tp");

const getCCTP = async (req, res) => {
  
  try {
    // if (!(await canUserRead(req.user, "cc_tps"))) {
    //   return res.status(401).json({ msg: "unauthorized access!" });
    // }
    const { f, r, st, sc, sd, type } = req.query;
    const data = await CCTP.findAndCountAll({
      offset: Number(f),
      limit: Number(r),
      order: sc
        ? [[sc, sd == 1 ? "ASC" : "DESC"]]
        : [["createdAt", sd == 1 ? "DESC" : "ASC"]],
        where: {
          [Op.and]: [
            {
              vehicle_type: type,
            },
            getSearch(st),
          ],
        }
    //   include: [{model: Vehicle, as: "Vehicle"}]
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
        vehicle_type: {
          [Op.like]: "%" + st + "%",
        },
      },
    ],
  };
};
//posting
const createCCTP = async (req, res) => {
  const cctpBody = req.body;
  try {
    // 
    // if (!(await canUserCreate(req.user, "cc_tps"))) {
    //   return res.status(401).json({ msg: "unauthorized access!" });
    // }
    // const ducplicateCountry = await Bsg.findAll({
    //   where: { vehicle: cctpBody.vehicle },
    // });
    // if (ducplicateCountry.length > 0) {
    //   res.status(400).json({ msg: "Bsg vehicle already used!" });
    //   return;
    // }
    const cctp = await CCTP.create(cctpBody);
    if (cctp) {
      let ipAddress = getIpAddress(req.ip);
      const eventLog = await createEventLog(
        req.user.id,
        eventResourceTypes.cctp,
        `${cctp.vehicle_type} `,
        cctp.id,
        eventActions.create,
        "",
        ipAddress
      );
    }
    res.status(200).json(cctp);
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};

const getCCTPByPk = async (req, res) => {
  try {
    // if (!(await canUserRead(req.user, "cc_tps"))) {
    //   return res.status(401).json({ msg: "unauthorized access!" });
    // }
    const cctp = await CCTP.findByPk(req.params.id, {}).then(function (cctp) {
      if (!cctp) {
        res.status(404).json({ message: "No Data Found" });
      } else if (cctp) {
        let ipAddress = getIpAddress(req.ip);
        const eventLog = createEventLog(
          req.user.id,
          eventResourceTypes.cctp,
          `${cctp.vehicle_type} `,
          cctp.id,
          eventActions.view,
          "",
          ipAddress
        );
        res.status(200).json(cctp);
      }
    });

    // res.status(200).json(bsg);
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};

const editCCTP= async (req, res) => {
  const cctpBody = req.body;
  const id = req.params.id;

  try {
    // if (!(await canUserEdit(req.user, "cc_tps"))) {
    //   return res.status(401).json({ msg: "unauthorized access!" });
    // }
    // const duplicateName = await Bus.findAll({
    //   where: { id : id},
    // });
    // if (duplicateName.length !== 0) {
    //   if (duplicateName[0].id !== cctpBody.id) {
    //     res.status(400).json({ msg: "bus already used!" });
    //     return;
    //   }
    // }
        let oldDept = await CCTP.findByPk(id, {});
    let dept = CCTP.update(cctpBody, {
      where: { id: id },
    });

    if (dept) {
      let newDept = await CCTP.findByPk(id, {});
      let changedFieldValues = getChangedFieldValues(oldDept, newDept);
      let ipAddress = getIpAddress(req.ip);
      const eventLog = createEventLog(
        req.user.id,
        eventResourceTypes.cctp,
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

const deleteCCTP = async (req, res) => {
  const id = req.params.id;
  try {
    // if (!(await canUserDelete(req.user, "cc_tps"))) {
    //   return res.status(401).json({ msg: "unauthorized access!" });
    // }
    let cctp = await CCTP.findByPk(id, {});
    let dept = await CCTP.destroy({ where: { id: id } });
    if (dept) {
      let ipAddress = getIpAddress(req.ip);
      const eventLog = createEventLog(
        req.user.id,
        eventResourceTypes.cctp,
        `${cctp.vehicle_type} `,
        cctp.id,
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
  getCCTP,
  createCCTP,
  getCCTPByPk,
  editCCTP,
  deleteCCTP,
};
