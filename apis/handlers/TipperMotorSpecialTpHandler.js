const { Op } = require("sequelize");
const TipperMotorSpecialTp = require("../../models/TipperMotorSpecial");
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

const getTipperMotorSpecialTp = async (req, res) => {
  try {
    // if (!(await canUserRead(req.user, "tipperMotorSpecialTps"))) {
    //   return res.status(401).json({ msg: "unauthorized access!" });
    // }
    const { f, r, st, sc, sd, type } = req.query;
    const data = await TipperMotorSpecialTp.findAndCountAll({
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
const createTipperMotorSpecialTp = async (req, res) => {
  const tipperMotorSpecialTpBody = req.body;
  
  try {
    // if (!(await canUserCreate(req.user, "tipperMotorSpecialTps"))) {
    //   return res.status(401).json({ msg: "unauthorized access!" });
    // }
    // const ducplicateCountry = await TipperMotorSpecialTp.findAll({
    //   where: { vehicleType: tipperMotorSpecialTpBody.vehicleType },
    // });
    // if (ducplicateCountry.length > 0) {
    //   res
    //     .status(400)
    //     .json({ msg: "TipperMotorSpecialTp vehicleType already used!" });
    //   return;
    // }

    
    const tipperMotorSpecialTp = await TipperMotorSpecialTp.create(
      tipperMotorSpecialTpBody
    );
    if (tipperMotorSpecialTp) {
      let ipAddress = getIpAddress(req.ip);
      const eventLog = await createEventLog(
        req.user.id,
        eventResourceTypes.tipperMotorSpecialTp,
        `${tipperMotorSpecialTp.vehicleType} `,
        tipperMotorSpecialTp.id,
        eventActions.create,
        "",
        ipAddress
      );
    }
    res.status(200).json(tipperMotorSpecialTp);
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};

const getTipperMotorSpecialTpByPk = async (req, res) => {
  try {
    // if (!(await canUserRead(req.user, "tipperMotorSpecialTps"))) {
    //   return res.status(401).json({ msg: "unauthorized access!" });
    // }
    const tipperMotorSpecialTp = await TipperMotorSpecialTp.findByPk(
      req.params.id,
      {}
    ).then(function (tipperMotorSpecialTp) {
      if (!tipperMotorSpecialTp) {
        res.status(404).json({ message: "No Data Found" });
      } else if (tipperMotorSpecialTp) {
        let ipAddress = getIpAddress(req.ip);
        const eventLog = createEventLog(
          req.user.id,
          eventResourceTypes.tipperMotorSpecialTp,
          `${tipperMotorSpecialTp.vehicleType} `,
          tipperMotorSpecialTp.id,
          eventActions.view,
          "",
          ipAddress
        );
        res.status(200).json(tipperMotorSpecialTp);
      }
    });

    // res.status(200).json(tipperMotorSpecialTp);
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};

const editTipperMotorSpecialTp = async (req, res) => {
  const tipperMotorSpecialTpBody = req.body;
  const id = req.params.id;

  try {
    // if (!(await canUserEdit(req.user, "tipperMotorSpecialTps"))) {
    //   return res.status(401).json({ msg: "unauthorized access!" });
    // }
    const duplicateName = await TipperMotorSpecialTp.findAll({
      where: { vehicleType: tipperMotorSpecialTpBody.vehicleType },
    });
    if (duplicateName.length !== 0) {
      if (duplicateName[0].id !== tipperMotorSpecialTpBody.id) {
        res
          .status(400)
          .json({ msg: "TipperMotorSpecialTp vehicleType already used!" });
        return;
      }
    }
    let oldDept = await TipperMotorSpecialTp.findByPk(id, {});
    let dept = TipperMotorSpecialTp.update(tipperMotorSpecialTpBody, {
      where: { id: id },
    });

    if (dept) {
      let newDept = await TipperMotorSpecialTp.findByPk(id, {});
      let changedFieldValues = getChangedFieldValues(oldDept, newDept);
      let ipAddress = getIpAddress(req.ip);
      const eventLog = createEventLog(
        req.user.id,
        eventResourceTypes.tipperMotorSpecialTp,
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

const deleteTipperMotorSpecialTp = async (req, res) => {
  const id = req.params.id;
  try {
    // if (!(await canUserDelete(req.user, "tipperMotorSpecialTps"))) {
    //   return res.status(401).json({ msg: "unauthorized access!" });
    // }
    let tipperMotorSpecialTp = await TipperMotorSpecialTp.findByPk(id, {});
    let dept = await TipperMotorSpecialTp.destroy({ where: { id: id } });
    if (dept) {
      let ipAddress = getIpAddress(req.ip);
      const eventLog = createEventLog(
        req.user.id,
        eventResourceTypes.tipperMotorSpecialTp,
        `${tipperMotorSpecialTp.vehicleType} `,
        tipperMotorSpecialTp.id,
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
  getTipperMotorSpecialTp,
  createTipperMotorSpecialTp,
  getTipperMotorSpecialTpByPk,
  editTipperMotorSpecialTp,
  deleteTipperMotorSpecialTp,
};
