const FireSumInsuredDiscount = require("../../../models/fire/FireSumInsuredDiscount");
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
      { minimum_amount: { [Op.like]: `%${st}%` } },
      { maximum_amount: { [Op.like]: `%${st}%` } },
      { rate: { [Op.like]: `%${st}%` } },
    ],
  };
};

const getFireSumInsuredDiscount = async (req, res) => {
  const { f, r, st, sc, sd } = req.query;
  const currentUser = await User.findByPk(req.user.id, {
    include: [Employee],
  });
  //req.type = "all"

  try {
    if (req.type == "all") {
      const data = await FireSumInsuredDiscount.findAndCountAll({
        offset: Number(f),
        limit: Number(r),
        order: [[sc || "createdAt", sd == 1 ? "ASC" : "DESC"]],
        where: getSearch(st),
      });
      res.status(200).json(data);
    }else if (req.type == "self"){
      const data = await FireSumInsuredDiscount.findAndCountAll({
        offset: Number(f),
        limit: Number(r),
        order: [[sc || "createdAt", sd == 1 ? "ASC" : "DESC"]],
        where: {
          userId: currentUser.id,
          ...getSearch(st),
        }
      });
      res.status(200).json(data);
    }else if (req.type == "customer"){
      const data = await FireSumInsuredDiscount.findAndCountAll({
        offset: Number(f),
        limit: Number(r),
        order: [[sc || "createdAt", sd == 1 ? "ASC" : "DESC"]],
        where: {
          userId: currentUser.id,
          ...getSearch(st),
        }
      });
      res.status(200).json(data);
    }else if (req.type == "branch"){
      const data = await FireSumInsuredDiscount.findAndCountAll({
        offset: Number(f),
        limit: Number(r),
        order: [[sc || "createdAt", sd == 1 ? "ASC" : "DESC"]],
        where: {
          "$user.employee.branchId$": currentUser.employee.branchId,
          ...getSearch(st),
        }
      });
      res.status(200).json(data);
    }else if (req.type == "branchAndSelf"){
      const data = await FireSumInsuredDiscount.findAndCountAll({
        offset: Number(f),
        limit: Number(r),
        order: [[sc || "createdAt", sd == 1 ? "ASC" : "DESC"]],
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

const getAllFireSumInsuredDiscounts = async (req, res) => {
  try {
    const data = await FireSumInsuredDiscount.findAndCountAll();
    res.status(200).json(data);
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};

//posting
const createFireSumInsuredDiscount = async (req, res) => {
  const fireSumInsuredDiscountBody = req.body;
  try {
    // Replaced by middlewares
    // if (!(await canUserCreate(req.user, "fireSumInsuredDiscounts"))) {
    //   return res.status(401).json({ msg: "unauthorized access!" });
    // }
    const duplicateName = await FireSumInsuredDiscount.findAll({
      where: { [Op.and]: [{ minimum_amount: fireSumInsuredDiscountBody.minimum_amount }, { maximum_amount: fireSumInsuredDiscountBody.maximum_amount }] },
    });
    if (duplicateName.length > 0) {
      res.status(400).json({ msg: "Sum insured discount already registered!" });
      return;
    }

    const fireSumInsuredDiscount = await FireSumInsuredDiscount.create(
      fireSumInsuredDiscountBody
    );
    res.status(200).json(fireSumInsuredDiscount);
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};

const createFireSumInsuredDiscounts = async (req, res) => {
  const fireSumInsuredDiscountBody = req.body;
  const fireSumInsuredDiscount = [];
  var addedFireSumInsuredDiscounts = 0;
  var rejectedFireSumInsuredDiscounts = 0;
  try {
    // Replaced By middlewares
    // if (!(await canUserCreate(req.user, "fireSumInsuredDiscounts"))) {
    //   return res.status(401).json({ msg: "unauthorized access!" });
    // }

    var promises = fireSumInsuredDiscountBody.map(async (element) => {
      const duplicateName = await FireSumInsuredDiscount.findAll({
        where: {
          minimum_amount: element.minimum_amount,
          maximum_amount: element.maximum_amount,
        },
      });
      if (duplicateName.length > 0) {
        rejectedFireSumInsuredDiscounts += 1;
      } else if (duplicateName.length == 0) {
        fireSumInsuredDiscount.push(
          await FireSumInsuredDiscount.create(element)
        );
        addedFireSumInsuredDiscounts += 1;
      }
    });
    Promise.all(promises).then(function (results) {
      res
        .status(200)
        .json(
          `${addedFireSumInsuredDiscounts} discounts are added and ${rejectedFireSumInsuredDiscounts} are rejected due to duplication.`
        );
    });
    // const fireSumInsuredDiscount = await FireSumInsuredDiscount.create(fireSumInsuredDiscountBody);
    // res.status(200).json(fireSumInsuredDiscount);
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};

const getFireSumInsuredDiscountByPk = async (req, res) => {
  try {
    const fireSumInsuredDiscount = await FireSumInsuredDiscount.findByPk(
      req.params.id
    ).then(function (fireSumInsuredDiscount) {
      if (!fireSumInsuredDiscount) {
        res.status(404).json({ message: "No Data Found" });
      }
      res.status(200).json(fireSumInsuredDiscount);
    });

    // res.status(200).json(fireSumInsuredDiscount);
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};

const editFireSumInsuredDiscount = async (req, res) => {
  const reqBody = req.body;
  const id = req.params.id;

  try {
    // Replaced by middleware
    // if (!(await canUserEdit(req.user, "fireSumInsuredDiscounts"))) {
    //   return res.status(401).json({ msg: "unauthorized access!" });
    // }
    const duplicatedDiscount = await FireSumInsuredDiscount.findAll({
      where: { [Op.and]: [{ minimum_amount: reqBody.minimum_amount }, { maximum_amount: reqBody.maximum_amount }] },
    });
    if (duplicatedDiscount.length !== 0)
      if (duplicatedDiscount[0].id !== reqBody.id) {
        res.status(400).json({ msg: "Sum insured discount already registered!" });
        return;
      }
    FireSumInsuredDiscount.update(reqBody, { where: { id: id } });

    res.status(200).json({ id });
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};

const deleteFireSumInsuredDiscount = async (req, res) => {
  const id = req.params.id;

  try {

    // replaced by middleware
    // if (!(await canUserDelete(req.user, "fireSumInsuredDiscounts"))) {
    //   return res.status(401).json({ msg: "unauthorized access!" });
    // }
    FireSumInsuredDiscount.destroy({ where: { id: id } });

    res.status(200).json({ id });
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};

module.exports = {
  getFireSumInsuredDiscount,
  getAllFireSumInsuredDiscounts,
  createFireSumInsuredDiscount,
  createFireSumInsuredDiscounts,
  getFireSumInsuredDiscountByPk,
  editFireSumInsuredDiscount,
  deleteFireSumInsuredDiscount,
};
