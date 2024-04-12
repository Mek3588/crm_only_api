const { Op } = require("sequelize");
const YellowCard = require("../../models/YellowCard");
const User = require("../../models/acl/user");
const Employee = require("../../models/Employee");
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
  currentUser,
} = require("../../utils/GeneralUtils");

const getYellowCard = async (req, res) => {
  try {
    // if (!(await canUserRead(req.user, "yellowCards"))) {
    //   return res.status(401).json({ msg: "unauthorized access!" });
    // }P
    const { f, r, st, sc, sd } = req.query;
    const currentUser = await User.findByPk(req.user.id, {
      include: [Employee],
    });

    //req.type =""

    if (req.type == "all") {
      const data = await YellowCard.findAndCountAll({
        offset: Number(f),
        limit: Number(r),
        order: sc
          ? [[sc, sd == 1 ? "ASC" : "DESC"]]
          : [["createdAt", sd == 1 ? "DESC" : "ASC"]],
        where: getSearch(st),
      });
      
      res.status(200).json(data);
    }else if (req.type == "self"){
      const data = await YellowCard.findAndCountAll({
        offset: Number(f),
        limit: Number(r),
        order: sc
          ? [[sc, sd == 1 ? "ASC" : "DESC"]]
          : [["createdAt", sd == 1 ? "DESC" : "ASC"]],
        where: { 
          userId: currentUser.id,
          ...getSearch(st),
        }
      });
      
      res.status(200).json(data);
    }else if (req.type == "customer"){
      const data = await YellowCard.findAndCountAll({
        offset: Number(f),
        limit: Number(r),
        order: sc
          ? [[sc, sd == 1 ? "ASC" : "DESC"]]
          : [["createdAt", sd == 1 ? "DESC" : "ASC"]],
        where: { 
          userId: currentUser.id,
          ...getSearch(st),
        }
      });
      
      res.status(200).json(data);
    }else if (req.type == "branch"){
      const data = await YellowCard.findAndCountAll({
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
          "$user.employee.branchId$": currentUser.employee.branchId,
          ...getSearch(st),
        }
      });
      
      res.status(200).json(data);
    }else if (req.type == "branchAndSelf"){
      const data = await YellowCard.findAndCountAll({
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
          userId: currentUser.id,
          "$user.employee.branchId$": currentUser.employee.branchId,
          ...getSearch(st),
        }
      });
      
      res.status(200).json(data);
    }
    
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};

const getSearch = (st) => {
  return {
    // [Op.or]: [
    //   {
    //     // vehicle: {
    //     //   [Op.like]: "%" + st + "%",
    //     // },
    //   },
    // ],
  };
};
//posting
const createYellowCard = async (req, res) => {
  const yellowCardBody = req.body;
  
  try {
    // if (!(await canUserCreate(req.user, "yellowCards"))) {
    //   return res.status(401).json({ msg: "unauthorized access!" });
    // }

    // Check for duplicate yellow cards based on the vehicle field
    const duplicateYellowCard = await YellowCard.findOne({
      where: { vehicle_type: yellowCardBody.vehicle_type },
    });    

    if (duplicateYellowCard) {
      return res.status(400).json({ msg: "YellowCard vehicle already used!" });
    }

    const yellowCard = await YellowCard.create(yellowCardBody);
    if (yellowCard) {
      let ipAddress = getIpAddress(req.ip);
      // const eventLog = await createEventLog(
      //   req.user.id,
      //   eventResourceTypes.yellowCard,
      //   `${yellowCard.price} `,
      //   yellowCard.id,
      //   eventActions.create,
      //   "",
      //   ipAddress
      // );
    }
    res.status(200).json(yellowCard);
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};


const getYellowCardByPk = async (req, res) => {
  try {
    // if (!(await canUserRead(req.user, "yellowCards"))) {
    //   return res.status(401).json({ msg: "unauthorized access!" });
    // }
    const yellowCard = await YellowCard.findByPk(req.params.id, {}).then(
      function (yellowCard) {
        if (!yellowCard) {
          res.status(404).json({ message: "No Data Found" });
        } else if (yellowCard) {
          let ipAddress = getIpAddress(req.ip);
          const eventLog = createEventLog(
            req.user.id,
            eventResourceTypes.yellowCard,
            `${yellowCard.price} `,
            yellowCard.id,
            eventActions.view,
            "",
            ipAddress
          );
          res.status(200).json(yellowCard);
        }
      }
    );

    // res.status(200).json(yellowCard);
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};

const editYellowCard = async (req, res) => {
  const yellowCardBody = req.body;
  const id = req.params.id;

  try {
    // if (!(await canUserEdit(req.user, "yellowCards"))) {
    //   return res.status(401).json({ msg: "unauthorized access!" });
    // }
    // const duplicateName = await YellowCard.findAll({
    //   where: { vehicle: yellowCardBody.vehicle },
    // });
    // if (duplicateName.length !== 0) {
    //   if (duplicateName[0].id !== yellowCardBody.id) {
    //     res.status(400).json({ msg: "YellowCard vehicle already used!" });
    //     return;
    //   }
    // }
    let oldDept = await YellowCard.findByPk(id, {});
    let dept = YellowCard.update(yellowCardBody, {
      where: { id: id },
    });

    if (dept) {
      let newDept = await YellowCard.findByPk(id, {});
      let changedFieldValues = getChangedFieldValues(oldDept, newDept);
      let ipAddress = getIpAddress(req.ip);
      // const eventLog = createEventLog(
      //   req.user.id,
      //   eventResourceTypes.yellowCard,
      //   newDept.price,
      //   newDept.id,
      //   eventActions.edit,
      //   changedFieldValues,
      //   ipAddress
      // );
    }

    res.status(200).json({ id });
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};

const deleteYellowCard = async (req, res) => {
  const id = req.params.id;
  try {
    // if (!(await canUserDelete(req.user, "yellowCards"))) {
    //   return res.status(401).json({ msg: "unauthorized access!" });
    // }
    let yellowCard = await YellowCard.findByPk(id, {});
    let dept = await YellowCard.destroy({ where: { id: id } });
    if (dept) {
      let ipAddress = getIpAddress(req.ip);
      const eventLog = createEventLog(
        req.user.id,
        eventResourceTypes.yellowCard,
        `${yellowCard.price} `,
        yellowCard.id,
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

const getAllYellowCard = async (req, res) => {
  
  try {
    const data = await YellowCard.findAndCountAll();
    console.log("---------------------------------------============ yellow", data)
    res.status(200).json(data);
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};

module.exports = {
  getYellowCard,
  createYellowCard,
  getYellowCardByPk,
  editYellowCard,
  deleteYellowCard,
  getAllYellowCard,
};
