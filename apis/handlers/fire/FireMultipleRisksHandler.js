const { Op } = require("sequelize");
const MultipleFireRisk = require("../../../models/fire/FireMultipleRisk");
//const {
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

const getMultipleFireRisk = async (req, res) => {
  
  try {

    // replaced by middleware
    // if (!(await canUserRead(req.user, "multipleFireRisks"))) {
    //   return res.status(401).json({ msg: "unauthorized access!" });
    // }
    
    const { f, r, st, sc, sd } = req.query;
    const data = await MultipleFireRisk.findAndCountAll({
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

const getSearch = (st) => {
  return {
    [Op.or]: [
      {
        requested_by: {
          [Op.like]: "%" + st + "%",
        },
      },
    ],
  };
};
//posting
const createMultipleFireRisk = async (req, res) => {
  const multipleFireRiskBody = req.body;
  try {

    // replaced by middleware
    // if (!(await canUserCreate(req.user, "multipleFireRisks"))) {
    //   return res.status(401).json({ msg: "unauthorized access!" });
    // }
    const ducplicateCountry = await MultipleFireRisk.findAll({
      where: { requested_by: multipleFireRiskBody.requested_by },
    });
    if (ducplicateCountry.length > 0) {
      res.status(400).json({ msg: "MultipleFireRisk requested_by already used!" });
      return;
    }
    const multipleFireRisk = await MultipleFireRisk.create(multipleFireRiskBody);
    if (multipleFireRisk) {
      let ipAddress = getIpAddress(req.ip);
      // const eventLog = await createEventLog(
      //   req.user.id,
      //   eventResourceTypes.multipleFireRisk,
      //   `${multipleFireRisk.requested_by} `,
      //   multipleFireRisk.id,
      //   eventActions.create,
      //   "",
      //   ipAddress
      // );
    }
    res.status(200).json(multipleFireRisk);
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};

const getMultipleFireRiskByPk = async (req, res) => {
  try {
    // replaced by middleware
    // if (!(await canUserRead(req.user, "multipleFireRisks"))) {
    //   return res.status(401).json({ msg: "unauthorized access!" });
    // }
    const multipleFireRisk = await MultipleFireRisk.findByPk(req.params.id, {}).then(
      function (multipleFireRisk) {
        if (!multipleFireRisk) {
          res.status(404).json({ message: "No Data Found" });
        } else if (multipleFireRisk) {
          let ipAddress = getIpAddress(req.ip);
          // const eventLog = createEventLog(
          //   req.user.id,
          //   eventResourceTypes.multipleFireRisk,
          //   `${multipleFireRisk.requested_by} `,
          //   multipleFireRisk.id,
          //   eventActions.view,
          //   "",
          //   ipAddress
          // );
          res.status(200).json(multipleFireRisk);
        }
      }
    );

    // res.status(200).json(multipleFireRisk);
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};

const editMultipleFireRisk = async (req, res) => {
  const multipleFireRiskBody = req.body;
  const id = req.params.id;

  try {

    // replaced by middleware
    // if (!(await canUserEdit(req.user, "firemultipleRisks"))) {
    //   return res.status(401).json({ msg: "unauthorized access!" });
    // }
    const duplicateName = await MultipleFireRisk.findAll({
      where: { requested_by: multipleFireRiskBody.requested_by },
    });
    if (duplicateName.length !== 0) {
      if (duplicateName[0].id !== multipleFireRiskBody.id) {
        res.status(400).json({ msg: "MultipleFireRisk requested_by already used!" });
        return;
      }
    }
    let oldDept = await MultipleFireRisk.findByPk(id, {});
    let dept = MultipleFireRisk.update(multipleFireRiskBody, {
      where: { id: id },
    });

    if (dept) {
      let newDept = await MultipleFireRisk.findByPk(id, {});
      let changedFieldValues = getChangedFieldValues(oldDept, newDept);
      let ipAddress = getIpAddress(req.ip);
    //   const eventLog = createEventLog(
    //     req.user.id,
    //     eventResourceTypes.multipleFireRisk,
    //     newDept.requested_by,
    //     newDept.id,
    //     eventActions.edit,
    //     changedFieldValues,
    //     ipAddress
    //   );
    }

    res.status(200).json({ id });
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};

const deleteMultipleFireRisk = async (req, res) => {
  const id = req.params.id;
  try {
    // replaced by middleware
    // if (!(await canUserDelete(req.user, "multipleRisks"))) {
    //   return res.status(401).json({ msg: "unauthorized access!" });
    // }
    let multipleFireRisk = await MultipleFireRisk.findByPk(id, {});
    let dept = await MultipleFireRisk.destroy({ where: { id: id } });
    if (dept) {
      let ipAddress = getIpAddress(req.ip);
      // const eventLog = createEventLog(
      //   req.user.id,
      //   eventResourceTypes.multipleFireRisk,
      //   `${multipleFireRisk.requested_by} `,
      //   multipleFireRisk.id,
      //   eventActions.delete,
      //   "",
      //   ipAddress
      // );
    }
    res.status(200).json({ id });
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};

module.exports = {
  getMultipleFireRisk,
  createMultipleFireRisk,
  getMultipleFireRiskByPk,
  editMultipleFireRisk,
  deleteMultipleFireRisk,
};
