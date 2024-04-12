const { Op } = require("sequelize");
const Bsg = require("../../../models/BSG");
// const {
//   canUserRead,
//   canUserCreate,
//   canUserEdit,
//   canUserDelete,
// } = require("../../../utils/Authrizations");
const {
  eventResourceTypes,
  eventActions,
} = require("../../../utils/constants");
const {
  createEventLog,
  getChangedFieldValues,
  getIpAddress,
} = require("../../../utils/GeneralUtils");
const Learner = require("../../../models/quotation/learner");
const Vehicle = require("../../../models/motor/Vehicle");

const getLearner = async (req, res) => {
  
  try {
    // if (!(await canUserRead(req.user, "learners"))) {
    //   return res.status(401).json({ msg: "unauthorized access!" });
    // }
    const { f, r, st, sc, sd, type } = req.query;
    
    const data = await Learner.findAndCountAll({
      offset: Number(f),
      limit: Number(r),
      order: sc
        ? [[sc, sd == 1 ? "ASC" : "DESC"]]
        : [["createdAt", sd == 1 ? "DESC" : "ASC"]],
      where: {
        [Op.and]: [{}, getSearch(st)],
      }, // include: [{model: Vehicle, as: "Vehicle"}]
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
const createLearner = async (req, res) => {
  
  const learnerBody = req.body;
  try {
    // if (!(await canUserCreate(req.user, "learners"))) {
    //   return res.status(401).json({ msg: "unauthorized access!" });
    // }
    // const ducplicateCountry = await Bsg.findAll({
    //   where: { vehicle: learnerBody.vehicle },
    // });
    // if (ducplicateCountry.length > 0) {
    //   res.status(400).json({ msg: "Bsg vehicle already used!" });
    //   return;
    // }
    const learner = await Learner.create(learnerBody);
    if (learner) {
      let ipAddress = getIpAddress(req.ip);
      const eventLog = await createEventLog(
        req.user.id,
        eventResourceTypes.learner,
        `${learner.vehicle_type} `,
        learner.id,
        eventActions.create,
        "",
        ipAddress
      );
    }
    res.status(200).json(learner);
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};

const getLearnerByPk = async (req, res) => {
  try {
    // if (!(await canUserRead(req.user, "learners"))) {
    //   return res.status(401).json({ msg: "unauthorized access!" });
    // }
    const learner = await Learner.findByPk(req.params.id, {}).then(function (
      learner
    ) {
      if (!learner) {
        res.status(404).json({ message: "No Data Found" });
      } else if (learner) {
        let ipAddress = getIpAddress(req.ip);
        const eventLog = createEventLog(
          req.user.id,
          eventResourceTypes.learner,
          `${learner.vehicle_type} `,
          learner.id,
          eventActions.view,
          "",
          ipAddress
        );
        res.status(200).json(learner);
      }
    });

    // res.status(200).json(bsg);
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};

const editLearner = async (req, res) => {
  const learnerBody = req.body;
  const id = req.params.id;
  
  try {
    // if (!(await canUserEdit(req.user, "learners"))) {
    //   return res.status(401).json({ msg: "unauthorized access!" });
    // }
    // const duplicateName = await Learner.findAll({
    //   where: { id : id},
    // });
    // if (duplicateName.length !== 0) {
    //   if (duplicateName[0s].id !== learnerBody.id) {
    //     res.status(400).jon({ msg: "learner already used!" });
    //     return;
    //   }
    // }
    let oldDept = await Learner.findByPk(id, {});
    let dept = Learner.update(learnerBody, {
      where: { id: id },
    });

    if (dept) {
      let newDept = await Learner.findByPk(id, {});
      let changedFieldValues = getChangedFieldValues(oldDept, newDept);
      let ipAddress = getIpAddress(req.ip);
      const eventLog = createEventLog(
        req.user.id,
        eventResourceTypes.learner,
        newDept.purpose,
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

const deleteLearner = async (req, res) => {
  const id = req.params.id;
  try {
    // if (!(await canUserDelete(req.user, "learners"))) {
    //   return res.status(401).json({ msg: "unauthorized access!" });
    // }
    let learner = await Learner.findByPk(id, {});
    let dept = await Learner.destroy({ where: { id: id } });
    if (dept) {
      let ipAddress = getIpAddress(req.ip);
      const eventLog = createEventLog(
        req.user.id,
        eventResourceTypes.learner,
        `${learner.vehicle_type} `,
        learner.id,
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
  getLearner,
  createLearner,
  getLearnerByPk,
  editLearner,
  deleteLearner,
};
