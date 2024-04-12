const FireRateCategory = require("../../../models/fire/FireRateCategory");
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
      { description: { [Op.like]: `%${st}%` } },
    ],
  };
};

const getFireRateCategory = async (req, res) => {
  const { f, r, st, sc, sd } = req.query;
  const currentUser = await User.findByPk(req.user.id, {
    include: [Employee],
  });
  //req.type = "branchAndSelf"
  
  try {
    if (req.type == "all") {
      const data = await FireRateCategory.findAndCountAll({
        offset: Number(f),
        limit: Number(r),
        order: [[sc || "name", sd == 1 ? "ASC" : "DESC"]],
        where: getSearch(st),
      });
      res.status(200).json(data);
    }else if (req.type == "self"){
      const data = await FireRateCategory.findAndCountAll({
        offset: Number(f),
        limit: Number(r),
        order: [[sc || "name", sd == 1 ? "ASC" : "DESC"]],
        where: {
          userId: currentUser.id,
          ...getSearch(st),
        }
      });
      res.status(200).json(data);
    }else if (req.type == "customer"){
      const data = await FireRateCategory.findAndCountAll({
        offset: Number(f),
        limit: Number(r),
        order: [[sc || "name", sd == 1 ? "ASC" : "DESC"]],
        where: {
          userId: currentUser.id,
          ...getSearch(st),
        }
      });
      res.status(200).json(data);
    }else if (req.type == "branch"){
      const data = await FireRateCategory.findAndCountAll({
        offset: Number(f),
        limit: Number(r),
        order: [[sc || "name", sd == 1 ? "ASC" : "DESC"]],
        where: {
          "$user.employee.branchId$": currentUser.employee.branchId,
          ...getSearch(st),
        }
      });
      res.status(200).json(data);
    }else if (req.type == "branchAndSelf"){
      const data = await FireRateCategory.findAndCountAll({
        offset: Number(f),
        limit: Number(r),
        order: [[sc || "name", sd == 1 ? "ASC" : "DESC"]],
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

const getAllFireRateCategorys = async (req, res) => {
  try {
    const data = await FireRateCategory.findAndCountAll();
    res.status(200).json(data);
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};

//posting
const createFireRateCategory = async (req, res) => {
  const fireRateCategoryBody = req.body;
  try {
    // Replaced by middleware
    // if (!(await canUserCreate(req.user, "fireRateCategorys"))) {
    //   return res.status(401).json({ msg: "unauthorized access!" });
    // }
    const duplicateName = await FireRateCategory.findAll({
      where: { name: fireRateCategoryBody.name },
    });
    if (duplicateName.length > 0) {
      res.status(400).json({ msg: "Fire rate category already registered!" });
      return;
    }
    const fireRateCategory = await FireRateCategory.create(
      fireRateCategoryBody
    );
    res.status(200).json(fireRateCategory);
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};

const createFireRateCategorys = async (req, res) => {
  const fireRateCategoryBody = req.body;
  const fireRateCategory = [];
  var addedFireRateCategorys = 0;
  var rejectedFireRateCategorys = 0;
  try {
    // Replaced by middleware
    // if (!(await canUserCreate(req.user, "fireRateCategorys"))) {
    //   return res.status(401).json({ msg: "unauthorized access!" });
    // }

    var promises = fireRateCategoryBody.map(async (element) => {
      const duplicateName = await FireRateCategory.findAll({
        where: { name: element.name },
      });
      if (duplicateName.length > 0) {
        rejectedFireRateCategorys += 1;
      } else if (duplicateName.length == 0) {
        fireRateCategory.push(await FireRateCategory.create(element));
        addedFireRateCategorys += 1;
      }
    });
    Promise.all(promises).then(function (results) {
      res
        .status(200)
        .json(
          `${addedFireRateCategorys} categories are added and ${rejectedFireRateCategorys} are rejected due to duplication.`
        );
    });
    // const fireRateCategory = await FireRateCategory.create(fireRateCategoryBody);
    // res.status(200).json(fireRateCategory);
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};

const getFireRateCategoryByPk = async (req, res) => {
  try {
    const fireRateCategory = await FireRateCategory.findByPk(
      req.params.id
    ).then(function (fireRateCategory) {
      if (!fireRateCategory) {
        res.status(404).json({ message: "No Data Found" });
      }
      res.status(200).json(fireRateCategory);
    });

    res.status(200).json(fireRateCategory);
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};

const editFireRateCategory = async (req, res) => {
  const reqBody = req.body;
  const id = req.params.id;

  try {
    // Replaced by middleware
    // if (!(await canUserEdit(req.user, "fireRateCategorys"))) {
    //   return res.status(401).json({ msg: "unauthorized access!" });
    // }
    const duplicateName = await FireRateCategory.findAll({
      where: { name: reqBody.name },
    });
    
    if (duplicateName.length !== 0) {
      if (duplicateName[0].id !== reqBody.id) {
        res.status(400).json({ msg: "Fire rate category already added" });
        return;
      }
    }

    FireRateCategory.update(
      reqBody,

      { where: { id: id } }
    );

    res.status(200).json({ id });
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};

const deleteFireRateCategory = async (req, res) => {
  const id = req.params.id;

  try {
    // Replaced by middleware
    // if (!(await canUserDelete(req.user, "fireRateCategorys"))) {
    //   return res.status(401).json({ msg: "unauthorized access!" });
    // }
    FireRateCategory.destroy({ where: { id: id } });
    res.status(200).json({ id });
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};
const getFireRateCategoryById = async (req, res) => {
  try {
    const data = await FireRateCategory.findByPk(req.params.id).then(function (
      fireRateCategory
    ) {
      if (!fireRateCategory) {
        res.status(404).json({ message: "No Data Found" });
      }
      res.status(200).json(fireRateCategory);
    });
  } catch (error) {
    res.status(404).json({ msg: error.message });
  }
};

module.exports = {
  getFireRateCategory,
  getAllFireRateCategorys,
  createFireRateCategory,
  createFireRateCategorys,
  getFireRateCategoryByPk,
  editFireRateCategory,
  deleteFireRateCategory,
  getFireRateCategoryById,
};
