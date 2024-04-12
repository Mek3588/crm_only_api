const CustomerProductCategory = require("../../models/CustomerProductCategory");
const { Op } = require("sequelize");
const {
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

const getSearch = (st) => {
  return {
    [Op.or]: [
      { categoryName: { [Op.like]: `%${st}%` } },
      { description: { [Op.like]: `%${st}%` } },
    ],
  };
};

const getCustomerProductCategory = async (req, res) => {
  const { f, r, st, sc, sd } = req.query;
  try {
    const data = await CustomerProductCategory.findAndCountAll({
      offset: Number(f),
      limit: Number(r),
      order: [[sc || "categoryName", sd == 1 ? "ASC" : "DESC"]],
      where: getSearch(st),
    });
    res.status(200).json(data);
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};

const getAllCustomerProductCategorys = async (req, res) => {
  try {
    const data = await CustomerProductCategory.findAndCountAll();
    res.status(200).json(data);
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};

/**
 * Create customer Product category controller(single)
 * @param {*} req 
 * @param {*} res 
 * @returns 
 */
const createCustomerProductCategory = async (req, res) => {
  const customerProductCategoryBody = req.body;
  try {

    // Replaced by middleware
    // if (!(await canUserCreate(req.user, "customerProductCategorys"))) {
    //   return res.status(401).json({ msg: "unauthorized access!" });
    // }
    const duplicateCustomerProductCategoryName = await CustomerProductCategory.findAll({
      where: { categoryName: customerProductCategoryBody.categoryName },
    });
    if (duplicateCustomerProductCategoryName.length > 0) {
      res.status(400).json({ msg: "CustomerProductCategory already registered!" });
      return;
    }
    const customerProductCategory = await CustomerProductCategory.create(customerProductCategoryBody);
    if (customerProductCategory) {
      await createEventLog(
        req.user.id,
        eventResourceTypes.customerProductCategory,
        `${customerProductCategory.categoryName}`,
        customerProductCategory.id,
        eventActions.create,
        "",
        getIpAddress(req.ip)
      );
    }
    res.status(200).json(customerProductCategory);
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};

/**
 * Create Customer product category controler(bulk)
 * @param {*} req 
 * @param {*} res 
 * @returns 
 */
const createCustomerProductCategorys = async (req, res) => {
  const customerProductCategoryBody = req.body;
  const customerProductCategory = [];
  let addedCustomerProductCategorys = 0;
  var duplicate = [];
  var incorrect = [];
  var lineNumber = 2;
  try {

    // Replaced by middleware
    // if (!(await canUserCreate(req.user, "customerProductCategorys"))) {
    //   return res.status(401).json({ msg: "unauthorized access!" });
    // }

    var promises = customerProductCategoryBody.map(async (element) => {
      const duplicateName = await CustomerProductCategory.findAll({
        where: { categoryName: element.categoryName },
      });
      if (duplicateName.length > 0) {
        duplicate.push(lineNumber);
      } else if (duplicateName.length == 0) {
        // customerProductCategory.push(await CustomerProductCategory.create(element));
        try {
          await CustomerProductCategory.create(element);
          addedCustomerProductCategorys += 1;
        } catch (error) {
          incorrect.push(lineNumber);
        }
      }
      lineNumber = lineNumber + 1;
    });
    Promise.all(promises).then(function (results) {
      let msg = "";
      if (addedCustomerProductCategorys != 0) {
        msg = msg + `${addedCustomerProductCategorys} products added`;
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
    // const customerProductCategory = await CustomerProductCategory.create(customerProductCategoryBody);
    // res.status(200).json(customerProductCategory);
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};

const getCustomerProductCategoryByPk = async (req, res) => {
  try {
    const customerProductCategory = await CustomerProductCategory.findByPk(req.params.id).then(function (
      customerProductCategory
    ) {
      if (!customerProductCategory) {
        res.status(404).json({ message: "No Data Found" });
      }
      res.status(200).json(customerProductCategory);
    });

    res.status(200).json(customerProductCategory);
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};

const getCustomerProductCategoryByName = async (req, res) => {
  try {
    

    const customerProductCategory = await CustomerProductCategory.findOne({ where: { categoryName: req.params.categoryName } });
    
    res.status(200).json(customerProductCategory.id);
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};

/**
 * Edit customer product category controller
 * @param {*} req 
 * @param {*} res 
 * @returns 
 */
const editCustomerProductCategory = async (req, res) => {
  const reqBody = req.body;
  const id = req.params.id;

  try {
    // Replaced by middleware
    // if (!(await canUserEdit(req.user, "customerProductCategorys"))) {
    //   return res.status(401).json({ msg: "unauthorized access!" });
    // }
    const duplicateCustomerProductCategoryName = await CustomerProductCategory.findAll({
      where: { categoryName: reqBody.categoryName },
    });
    if (duplicateCustomerProductCategoryName.length !== 0)
      if (duplicateCustomerProductCategoryName[0].id !== reqBody.id) {
        res.status(400).json({ msg: "CustomerProductCategory already registered!" });
        return;
      }
    let oldCustomerProductCategory = await CustomerProductCategory.findByPk(id, {});
    let updated = await CustomerProductCategory.update(reqBody, { where: { id: id } });

    if (updated) {
      let newCustomerProductCategory = await CustomerProductCategory.findByPk(id, {});
      let changedFieldValues = getChangedFieldValues(oldCustomerProductCategory, newCustomerProductCategory)
      await createEventLog(
        req.user.id,
        eventResourceTypes.customerProductCategory,
        `${oldCustomerProductCategory.categoryName}`,
        newCustomerProductCategory.id,
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

/**
 * Delete customer Product category controller
 * @param {*} req 
 * @param {*} res 
 * @returns 
 */
const deleteCustomerProductCategory = async (req, res) => {
  const id = req.params.id;

  try {
    // Replaced by middleware
    // if (!(await canUserDelete(req.user, "customerProductCategorys"))) {
    //   return res.status(401).json({ msg: "unauthorized access!" });
    // }
    let customerProductCategory = await CustomerProductCategory.findByPk(id, {});
    let deleted = await CustomerProductCategory.destroy({ where: { id: id } });
    if (deleted) {
      await createEventLog(
        req.user.id,
        eventResourceTypes.customerProductCategory,
        `${customerProductCategory.categoryName}`,
        customerProductCategory.id,
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
  getCustomerProductCategory,
  getAllCustomerProductCategorys,
  createCustomerProductCategory,
  createCustomerProductCategorys,
  getCustomerProductCategoryByPk,
  editCustomerProductCategory,
  deleteCustomerProductCategory,
  getCustomerProductCategoryByName,
};
