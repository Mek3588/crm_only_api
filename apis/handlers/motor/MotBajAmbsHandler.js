const MotBajAmb = require("../../../models/motor/MotBajAmb");
const { Op } = require("sequelize");
const {
  canUserCreate,
  canUserEdit,
  canUserDelete,
} = require("../../../utils/Authrizations");
const {
  eventResourceTypes,
  eventActions,
} = require("../../../utils/constants");
const {
  createEventLog,
  getChangedFieldValues,
  getIpAddress,
} = require("../../../utils/GeneralUtils");

const getSearch = (st) => {
  return {
    [Op.or]: [
      { purpose: { [Op.like]: `%${st}%` } },
      { vehicle_type: { [Op.like]: `%${st}%` } },
      { rate: { [Op.like]: `%${st}%` } },
    ],
  };
};

const getMotBajAmb = async (req, res) => {
  const { f, r, st, sc, sd } = req.query;
  try {
    const data = await MotBajAmb.findAndCountAll({
      offset: Number(f),
      limit: Number(r),
      order: [[sc || "vehicle_type", sd == 1 ? "ASC" : "DESC"]],
      where: getSearch(st),
    });
    res.status(200).json(data);
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};

const getAllMotBajAmbs = async (req, res) => {
  try {
    const data = await MotBajAmb.findAndCountAll({
      where: { vehicle_type: req.params.name },
    });
    res.status(200).json(data);
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};

//posting
const createMotBajAmb = async (req, res) => {
  const motBajAmbBody = req.body;
  try {
    if (!(await canUserCreate(req.user, "motBajAmbs"))) {
      return res.status(401).json({ msg: "unauthorized access!" });
    }
    // const duplicateMotBajAmbName = await MotBajAmb.findAll({
    //   where: {
    //     [Op.and]: [
    //       {
    //         vehicle_type: req.body.vehicle_type,
    //       },
    //       {
    //         purpose: req.body.purpose,
    //       },
    //     ],
    //   },
    // });
    // if (duplicateMotBajAmbName.length > 0) {
    //   res.status(400).json({ msg: "The rate is already registered!" });
    //   return;
    // }
    const motBajAmb = await MotBajAmb.create(motBajAmbBody);
    if (motBajAmb) {
      await createEventLog(
        req.user.id,
        eventResourceTypes.motBajAmb,
        `${motBajAmb.vehicle_type}`,
        motBajAmb.id,
        eventActions.create,
        "",
        getIpAddress(req.ip)
      );
    }
    res.status(200).json(motBajAmb);
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};

const createMotBajAmbs = async (req, res) => {
  const motBajAmbBody = req.body;
  const motBajAmb = [];
  var duplicate = [];
  var incorrect = [];
  var lineNumber = 2;
  try {
    if (!(await canUserCreate(req.user, "motBajAmbs"))) {
      return res.status(401).json({ msg: "unauthorized access!" });
    }

    var promises = motBajAmbBody.map(async (element) => {
      const duplicateName = await MotBajAmb.findAll({
        where: {
          [Op.and]: [
            {
              vehicle_type: element.vehicle_type,
            },
            {
              purpose: element.purpose,
            },
          ],
        },
      });
      if (duplicateName.length > 0) {
        duplicate.push(lineNumber);
      } else if (duplicateName.length == 0) {
        // motBajAmb.push(await MotBajAmb.create(element));
        try {
          await MotBajAmb.create(element);
          addedMotBajAmbs += 1;
        } catch (error) {
          incorrect.push(lineNumber);
        }
      }
      lineNumber = lineNumber + 1;
    });
    Promise.all(promises).then(function (results) {
      let msg = "";
      if (addedMotBajAmbs != 0) {
        msg = msg + `${addedMotBajAmbs} added`;
      }
      if (incorrect.length != 0) {
        msg = msg + ` line ${incorrect} has incorrect values`;
      }
      if (duplicate != 0) {
        msg = msg + ` ${duplicate} duplicate found`;
      }
      if (duplicate.length != 0 || incorrect.length != 0) {
        res.status(400).json({ msg: msg });
      } else {
        res.status(200).json({ msg: msg });
      }
    });
    // const motBajAmb = await MotBajAmb.create(motBajAmbBody);
    // res.status(200).json(motBajAmb);
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};

const getMotBajAmbByPk = async (req, res) => {
  try {
    const motBajAmb = await MotBajAmb.findByPk(req.params.id).then(function (
      motBajAmb
    ) {
      if (!motBajAmb) {
        res.status(404).json({ message: "No Data Found" });
      }
      res.status(200).json(motBajAmb);
    });

    // res.status(200).json(motBajAmb);
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};

const getMotBajAmbByName = async (req, res) => {
  try {
    const { f, r, st, sc, sd } = req.query;
    const { name } = req.params;
    const motBajAmb = await MotBajAmb.findAndCountAll({
      offset: Number(f),
      limit: Number(r),
      order: [[sc || "purpose", sd == 1 ? "ASC" : "DESC"]],
      where: {
        [Op.and]: [
          {
            vehicle_type: name,
          },
          getSearch(st),
        ],
      },
    });

    res.status(200).json(motBajAmb);
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};

const editMotBajAmb = async (req, res) => {
  const reqBody = req.body;
  const id = req.params.id;
  try {
    if (!(await canUserEdit(req.user, "motBajAmbs"))) {
      return res.status(401).json({ msg: "unauthorized access!" });
    }
    

    // const duplicateMotBajAmbName = await MotBajAmb.findAll({
    //   where: {
    //     [Op.and]: [
    //       {
    //         vehicle_type: reqBody.vehicle_type,
    //       },
    //       {
    //         purpose: reqBody.purpose,
    //       },
    //     ],
    //   },
    // });
    

    // if (duplicateMotBajAmbName.length !== 0)
    //   if (duplicateMotBajAmbName[0].id !== reqBody.id) {
    //     res.status(400).json({ msg: "MotBajAmb already registered!" });
    //     return;
    //   }
    
    let oldMotBajAmb = await MotBajAmb.findByPk(id, {});
    let updated = await MotBajAmb.update(reqBody, { where: { id: id } });
    
    if (updated) {
      let newMotBajAmb = await MotBajAmb.findByPk(id, {});
      let changedFieldValues = getChangedFieldValues(
        oldMotBajAmb,
        newMotBajAmb
      );
      
      await createEventLog(
        req.user.id,
        eventResourceTypes.motBajAmb,
        `${oldMotBajAmb.vehicle_type}`,
        newMotBajAmb.id,
        eventActions.edit,
        changedFieldValues,
        getIpAddress(req.ip)
      );
    }

    res.status(200).json({ id });
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};

const deleteMotBajAmb = async (req, res) => {
  const id = req.params.id;

  try {
    if (!(await canUserDelete(req.user, "motBajAmbs"))) {
      return res.status(401).json({ msg: "unauthorized access!" });
    }
    let motBajAmb = await MotBajAmb.findByPk(id, {});
    let deleted = await MotBajAmb.destroy({ where: { id: id } });
    if (deleted) {
      await createEventLog(
        req.user.id,
        eventResourceTypes.motBajAmb,
        `${motBajAmb.vehicle_type}`,
        motBajAmb.id,
        eventActions.delete,
        "",
        getIpAddress(req.ip)
      );
    }
    res.status(200).json({ id });
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};

module.exports = {
  getMotBajAmb,
  getAllMotBajAmbs,
  createMotBajAmb,
  createMotBajAmbs,
  getMotBajAmbByPk,
  editMotBajAmb,
  deleteMotBajAmb,
  getMotBajAmbByName,
};
