const FireApplicableWarranty = require("../../../models/fire/FireApplicableWarrantys.js");
const User = require("../../../models/acl/user");
const Employee = require("../../../models/Employee");
const { Op } = require("sequelize");
const {
  canUserCreate,
  canUserEdit,
  canUserDelete,
} = require("../../../utils/Authrizations");
const FireWarrantyApplicableRelations = require("../../../models/fire/FireWarrantyApplicableRelation.js");
const FireWarranty = require("../../../models/fire/FireWarranty.js");

const getSearch = (st) => {
  return {
    [Op.or]: [
      { name: { [Op.like]: `%${st}%` } },
      { code: { [Op.like]: `%${st}%` } },
      { description: { [Op.like]: `%${st}%` } },
    ],
  };
};

const getFireApplicableWarranty = async (req, res) => {
  const { f, r, st, sc, sd } = req.query;
  const currentUser = await User.findByPk(req.user.id, {
    include: [Employee],
  });

  //req.type = "all"
  try {
    if (req.type == "all") {
      const data = await FireApplicableWarranty.findAndCountAll({
        offset: Number(f),
        limit: Number(r),
        order: [[sc || "name", sd == 1 ? "ASC" : "DESC"]],
        where: getSearch(st),
        include: [FireWarranty]
      });
      res.status(200).json(data);
    }else if (req.type == "self"){
      const data = await FireApplicableWarranty.findAndCountAll({
        offset: Number(f),
        limit: Number(r),
        order: [[sc || "name", sd == 1 ? "ASC" : "DESC"]],
        where: {
          userId: currentUser.id,
          ...getSearch(st),
        },
        include: [FireWarranty]
      });
      res.status(200).json(data);
    }else if (req.type == "customer"){
      const data = await FireApplicableWarranty.findAndCountAll({
        offset: Number(f),
        limit: Number(r),
        order: [[sc || "name", sd == 1 ? "ASC" : "DESC"]],
        where: {
          userId: currentUser.id,
          ...getSearch(st),
        },
        include: [FireWarranty]
      });
      res.status(200).json(data);
    }else if (req.type == "branch"){
      const data = await FireApplicableWarranty.findAndCountAll({
        offset: Number(f),
        limit: Number(r),
        order: [[sc || "name", sd == 1 ? "ASC" : "DESC"]],
        where: {
          "$user.employee.branchId$": currentUser.employee.branchId,
          ...getSearch(st),
        },
        include: [FireWarranty]
      });
      res.status(200).json(data);
    }else if (req.type == "branchAndSelf"){
      const data = await FireApplicableWarranty.findAndCountAll({
        offset: Number(f),
        limit: Number(r),
        order: [[sc || "name", sd == 1 ? "ASC" : "DESC"]],
        where: {
          userId: currentUser.id,
          "$user.employee.branchId$": currentUser.employee.branchId,
          ...getSearch(st),
        },
        include: [FireWarranty]
      });
      
      res.status(200).json(data);
    }
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};

const getAllFireApplicableWarrantys = async (req, res) => {
  try {
    const data = await FireApplicableWarranty.findAndCountAll({ include: [FireWarranty] });
    res.status(200).json(data);
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};

//posting
const createFireApplicableWarranty = async (req, res) => {
  const fireApplicableWarrantyBody = req.body;
  try {
    // replaced by middleware
    // if (!(await canUserCreate(req.user, "fireApplicableWarrantys"))) {
    //   return res.status(401).json({ msg: "unauthorized access!" });
    // }
    const duplicateFireApplicableWarrantyName = await FireApplicableWarranty.findAll({
      where: { name: fireApplicableWarrantyBody.name }, include: [FireWarranty]
    });

    

    if (duplicateFireApplicableWarrantyName.length > 0) {
      res.status(400).json({ msg: "Warranty already registered!" });
      return;
    }

    const fireApplicableWarranty = await FireApplicableWarranty.create(fireApplicableWarrantyBody).then((applicableWarranty) => {

      
      applicableWarranty.addFire_warranties(req.body.fireWarrantsId, { through: FireWarrantyApplicableRelations })
    });
    res.status(200).json(fireApplicableWarranty);
  } catch (error) {
    
    res.status(400).json({ msg: error.message });
  }
};

const createFireApplicableWarrantys = async (req, res) => {
  const fireApplicableWarrantyBody = req.body;
  const fireApplicableWarranty = [];
  var addedFireApplicableWarrantys = 0;
  var rejectedFireApplicableWarrantys = 0;
  try {
    // Replaced by middleware
    // if (!(await canUserCreate(req.user, "fireApplicableWarrantys"))) {
    //   return res.status(401).json({ msg: "unauthorized access!" });
    // }

    var promises = fireApplicableWarrantyBody.map(async (element) => {
      const duplicateName = await FireApplicableWarranty.findAll({
        where: { name: element.name },
      });
      if (duplicateName.length > 0) {
        rejectedFireApplicableWarrantys += 1;
      } else if (duplicateName.length == 0) {
        fireApplicableWarranty.push(await FireApplicableWarranty.create(element));
        addedFireApplicableWarrantys += 1;
      }
    });
    Promise.all(promises).then(function (results) {
      res
        .status(200)
        .json(
          `${addedFireApplicableWarrantys} Warrantys are added and ${rejectedFireApplicableWarrantys} are rejected due to duplication.`
        );
    });
    // const fireApplicableWarranty = await FireApplicableWarranty.create(fireApplicableWarrantyBody);
    // res.status(200).json(fireApplicableWarranty);
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};

const getFireApplicableWarrantyByPk = async (req, res) => {
  try {
    const fireApplicableWarranty = await FireApplicableWarranty.findByPk(req.params.id).then(function (
      fireApplicableWarranty
    ) {
      if (!fireApplicableWarranty) {
        res.status(404).json({ message: "No Data Found" });
      }
      res.status(200).json(fireApplicableWarranty);
    });

    res.status(200).json(fireApplicableWarranty);
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};

const editFireApplicableWarranty = async (req, res) => {
  const reqBody = req.body;
  const id = req.params.id;

  try {
    // Replaced by middleware
    // if (!(await canUserEdit(req.user, "fireApplicableWarrantys"))) {
    //   return res.status(401).json({ msg: "unauthorized access!" });
    // }
    const duplicateFireApplicableWarrantyName = await FireApplicableWarranty.findAll({
      where: { name: reqBody.name },
    });
    if (duplicateFireApplicableWarrantyName.length !== 0)
      if (duplicateFireApplicableWarrantyName[0].id !== reqBody.id) {
        res.status(400).json({ msg: "Warranty already registered!" });
        return;
      }
    FireApplicableWarranty.update(reqBody, { where: { id: id } })
    const updatedWarranty = await FireApplicableWarranty.findByPk(id).then((applicableWarranty) => {
      applicableWarranty.setFire_warranties(req.body.fireWarrantsId, { through: FireWarrantyApplicableRelations })
    });
    
    res.status(200).json({ id });
  } catch (error) {
    
    res.status(400).json({ msg: error.message });
  }
};

const deleteFireApplicableWarranty = async (req, res) => {
  const id = req.params.id;

  try {

    // Replaced by middleware
    // if (!(await canUserDelete(req.user, "fireApplicableWarrantys"))) {
    //   return res.status(401).json({ msg: "unauthorized access!" });
    // }
    FireApplicableWarranty.destroy({ where: { id: id } });

    res.status(200).json({ id });
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};

module.exports = {
  getFireApplicableWarranty,
  getAllFireApplicableWarrantys,
  createFireApplicableWarranty,
  createFireApplicableWarrantys,
  getFireApplicableWarrantyByPk,
  editFireApplicableWarranty,
  deleteFireApplicableWarranty,
};
