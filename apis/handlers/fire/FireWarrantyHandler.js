const FireWarranty = require("../../../models/fire/FireWarranty.js");
const User = require("../../../models/acl/user");
const Employee = require("../../../models/Employee");
const { Op } = require("sequelize");
// const {
//   canUserCreate,
//   canUserEdit,
//   canUserDelete,
// } = require("../../../utils/Authrizations");

const getSearch = (st) => {
  return {
    [Op.or]: [
      { name: { [Op.like]: `%${st}%` } },
      { code: { [Op.like]: `%${st}%` } },
      { description: { [Op.like]: `%${st}%` } },
    ],
  };
};

const getFireWarranty = async (req, res) => {
  const { f, r, st, sc, sd } = req.query;
  const currentUser = await User.findByPk(req.user.id, {
    include: [Employee],
  });
  req.type = "all"
  try {
    if (req.type == "all") {
      const data = await FireWarranty.findAndCountAll({
        offset: Number(f),
        limit: Number(r),
        order: [[sc || "name", sd == 1 ? "ASC" : "DESC"]],
        where: getSearch(st),
      });
      res.status(200).json(data);
    }else if (req.type == "self"){
      const data = await FireWarranty.findAndCountAll({
        offset: Number(f),
        limit: Number(r),
        order: [[sc || "name", sd == 1 ? "ASC" : "DESC"]],
        where: 
        {
          userId: currentUser.id,
          ...getSearch(st),
        }
      });
      res.status(200).json(data);
    }else if (req.type == "customer"){
      const data = await FireWarranty.findAndCountAll({
        offset: Number(f),
        limit: Number(r),
        order: [[sc || "name", sd == 1 ? "ASC" : "DESC"]],
        where: 
        {
          userId: currentUser.id,
          ...getSearch(st),
        }
      });
      res.status(200).json(data);
    }else if (req.type == "branch"){
      const data = await FireWarranty.findAndCountAll({
        offset: Number(f),
        limit: Number(r),
        order: [[sc || "name", sd == 1 ? "ASC" : "DESC"]],
        where: 
        {
          branchId: currentUser.employee.id,
          ...getSearch(st),
        }
      });
      res.status(200).json(data);
    }else if (req.type == "branchAndSelf"){
      const data = await FireWarranty.findAndCountAll({
        offset: Number(f),
        limit: Number(r),
        order: [[sc || "name", sd == 1 ? "ASC" : "DESC"]],
        where: 
        {
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

const getAllFireWarrantys = async (req, res) => {
  try {
    const data = await FireWarranty.findAndCountAll();
    res.status(200).json(data);
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};

//posting
const createFireWarranty = async (req, res) => {
  const fireApplicableWarrantyBody = req.body;
  try {
    // Replaced By middleware
    // if (!(await canUserCreate(req.user, "fireApplicableWarrantys"))) {
    //   return res.status(401).json({ msg: "unauthorized access!" });
    // }
    const duplicateFireWarrantyName = await FireWarranty.findAll({
      where: { name: fireApplicableWarrantyBody.name },
    });
    if (duplicateFireWarrantyName.length > 0) {
      res.status(400).json({ msg: "Warranty already registered!" });
      return;
    }
    const fireWarranty = await FireWarranty.create(fireApplicableWarrantyBody);
    res.status(200).json(fireWarranty);
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};

const createFireWarrantys = async (req, res) => {
  const fireApplicableWarrantyBody = req.body;
  const fireWarranty = [];
  var addedFireWarrantys = 0;
  var rejectedFireWarrantys = 0;
  try {
    // Replaced by middleware
    // if (!(await canUserCreate(req.user, "fireApplicableWarrantys"))) {
    //   return res.status(401).json({ msg: "unauthorized access!" });
    // }

    var promises = fireApplicableWarrantyBody.map(async (element) => {
      const duplicateName = await FireWarranty.findAll({
        where: { name: element.name },
      });
      if (duplicateName.length > 0) {
        rejectedFireWarrantys += 1;
      } else if (duplicateName.length == 0) {
        fireWarranty.push(await FireWarranty.create(element));
        addedFireWarrantys += 1;
      }
    });
    Promise.all(promises).then(function (results) {
      res
        .status(200)
        .json(
          `${addedFireWarrantys} Warrantys are added and ${rejectedFireWarrantys} are rejected due to duplication.`
        );
    });
    // const fireWarranty = await FireWarranty.create(fireApplicableWarrantyBody);
    // res.status(200).json(fireWarranty);
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};

const getFireWarrantyByPk = async (req, res) => {
  try {
    const fireWarranty = await FireWarranty.findByPk(req.params.id).then(function (
      fireWarranty
    ) {
      if (!fireWarranty) {
        res.status(404).json({ message: "No Data Found" });
      }
      res.status(200).json(fireWarranty);
    });

    res.status(200).json(fireWarranty);
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};

const editFireWarranty = async (req, res) => {
  const reqBody = req.body;
  const id = req.params.id;

  try {
    // replaced by middleware
    // if (!(await canUserEdit(req.user, "fireApplicableWarrantys"))) {
    //   return res.status(401).json({ msg: "unauthorized access!" });
    // }
    const duplicateFireWarrantyName = await FireWarranty.findAll({
      where: { name: reqBody.name },
    });
    if (duplicateFireWarrantyName.length !== 0)
      if (duplicateFireWarrantyName[0].id !== reqBody.id) {
        res.status(400).json({ msg: "Warranty already registered!" });
        return;
      }
    FireWarranty.update(reqBody, { where: { id: id } });

    res.status(200).json({ id });
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};

const deleteFireWarranty = async (req, res) => {
  const id = req.params.id;

  try {
    // Replaced by middleware
    // if (!(await canUserDelete(req.user, "fireApplicableWarrantys"))) {
    //   return res.status(401).json({ msg: "unauthorized access!" });
    // }
    FireWarranty.destroy({ where: { id: id } });

    res.status(200).json({ id });
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};

module.exports = {
  getFireWarranty,
  getAllFireWarrantys,
  createFireWarranty,
  createFireWarrantys,
  getFireWarrantyByPk,
  editFireWarranty,
  deleteFireWarranty,
};
