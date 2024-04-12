const { Op } = require("sequelize");
const MultipleRisk = require("../../models/MultipleRisk");
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

const getMultipleRisk = async (req, res) => {
  
  const { f, r, st, sc, sd } = req.query;
  try {
    let data
    switch (req.type) {
      case "all":
        data = await MultipleRisk.findAndCountAll({
          offset: Number(f),
          limit: Number(r),
          order: sc
            ? [[sc, sd == 1 ? "ASC" : "DESC"]]
            : [["createdAt", sd == 1 ? "DESC" : "ASC"]],
          where: getSearch(st),
        });
      case "customer":
        data = await MultipleRisk.findAndCountAll({
          offset: Number(f),
          limit: Number(r),
          order: sc
            ? [[sc, sd == 1 ? "ASC" : "DESC"]]
            : [["createdAt", sd == 1 ? "DESC" : "ASC"]],
          where: getSearch(st),
        });
      //  include: [{ model: User, as: 'user', attributes: ['id', 'corporate_name', 'first_name', 'middle_name', 'last_name', 'email', 'phone', 'gender'] },

      case "branch":
        data = await MultipleRisk.findAndCountAll({
          offset: Number(f),
          limit: Number(r),
          order: sc
            ? [[sc, sd == 1 ? "ASC" : "DESC"]]
            : [["createdAt", sd == 1 ? "DESC" : "ASC"]],
          // include: [{model:}]

          where: getSearch(st),
        });

      case "branchAndSelf":
        data = await MultipleRisk.findAndCountAll({
          offset: Number(f),
          limit: Number(r),
          order: sc
            ? [[sc, sd == 1 ? "ASC" : "DESC"]]
            : [["createdAt", sd == 1 ? "DESC" : "ASC"]],
          where: getSearch(st),
        });
      case "self":
        data = await MultipleRisk.findAndCountAll({
          offset: Number(f),
          limit: Number(r),
          order: sc
            ? [[sc, sd == 1 ? "ASC" : "DESC"]]
            : [["createdAt", sd == 1 ? "DESC" : "ASC"]],
          where: getSearch(st),
        });
    }







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
const createMultipleRisk = async (req, res) => {
  const multipleRiskBody = req.body;
  try {
    if (!(await canUserCreate(req.user, "multipleRisks"))) {
      return res.status(401).json({ msg: "unauthorized access!" });
    }
    const ducplicateCountry = await MultipleRisk.findAll({
      where: { requested_by: multipleRiskBody.requested_by },
    });
    if (ducplicateCountry.length > 0) {
      res.status(400).json({ msg: "MultipleRisk requested_by already used!" });
      return;
    }
    const multipleRisk = await MultipleRisk.create(multipleRiskBody);
    if (multipleRisk) {
      let ipAddress = getIpAddress(req.ip);
      const eventLog = await createEventLog(
        req.user.id,
        eventResourceTypes.multipleRisk,
        `${multipleRisk.requested_by} `,
        multipleRisk.id,
        eventActions.create,
        "",
        ipAddress
      );
    }
    res.status(200).json(multipleRisk);
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};

const getMultipleRiskByPk = async (req, res) => {
  try {
    if (!(await canUserRead(req.user, "multipleRisks"))) {
      return res.status(401).json({ msg: "unauthorized access!" });
    }
    const multipleRisk = await MultipleRisk.findByPk(req.params.id, {}).then(
      function (multipleRisk) {
        if (!multipleRisk) {
          res.status(404).json({ message: "No Data Found" });
        } else if (multipleRisk) {
          let ipAddress = getIpAddress(req.ip);
          const eventLog = createEventLog(
            req.user.id,
            eventResourceTypes.multipleRisk,
            `${multipleRisk.requested_by} `,
            multipleRisk.id,
            eventActions.view,
            "",
            ipAddress
          );
          res.status(200).json(multipleRisk);
        }
      }
    );

    // res.status(200).json(multipleRisk);
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};

const editMultipleRisk = async (req, res) => {
  const multipleRiskBody = req.body;
  const id = req.params.id;

  try {
    if (!(await canUserEdit(req.user, "multipleRisks"))) {
      return res.status(401).json({ msg: "unauthorized access!" });
    }
    const duplicateName = await MultipleRisk.findAll({
      where: { requested_by: multipleRiskBody.requested_by },
    });
    if (duplicateName.length !== 0) {
      if (duplicateName[0].id !== multipleRiskBody.id) {
        res.status(400).json({ msg: "MultipleRisk requested_by already used!" });
        return;
      }
    }
    let oldDept = await MultipleRisk.findByPk(id, {});
    let dept = MultipleRisk.update(multipleRiskBody, {
      where: { id: id },
    });

    if (dept) {
      let newDept = await MultipleRisk.findByPk(id, {});
      let changedFieldValues = getChangedFieldValues(oldDept, newDept);
      let ipAddress = getIpAddress(req.ip);
      const eventLog = createEventLog(
        req.user.id,
        eventResourceTypes.multipleRisk,
        newDept.requested_by,
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

const deleteMultipleRisk = async (req, res) => {
  const id = req.params.id;
  try {
    if (!(await canUserDelete(req.user, "multipleRisks"))) {
      return res.status(401).json({ msg: "unauthorized access!" });
    }
    let multipleRisk = await MultipleRisk.findByPk(id, {});
    let dept = await MultipleRisk.destroy({ where: { id: id } });
    if (dept) {
      let ipAddress = getIpAddress(req.ip);
      const eventLog = createEventLog(
        req.user.id,
        eventResourceTypes.multipleRisk,
        `${multipleRisk.requested_by} `,
        multipleRisk.id,
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
  getMultipleRisk,
  createMultipleRisk,
  getMultipleRiskByPk,
  editMultipleRisk,
  deleteMultipleRisk,
};
