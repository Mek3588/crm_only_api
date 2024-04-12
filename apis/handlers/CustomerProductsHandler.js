const CustomerProduct = require("../../models/CustomerProduct");
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

//get
const getCustomerProduct = async (req, res) => {
  try {
    const { f, r, st, sc, sd } = req.query;
    const data = await CustomerProduct.findAndCountAll({
      include: [CustomerProductCategory],
      offset: Number(f),
      limit: Number(r),
      order: [[sc || "name", sd == 1 ? "ASC" : "DESC"]],
      where: getSearch(st),
    });
    res.status(200).json(data);
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};

const getCustomerProductByPk = async (req, res) => {
  try {
    const customerProduct = await CustomerProduct.findByPk(req.params.id).then(
      function (customerProduct) {
        if (!customerProduct) {
          res.status(404).json({ message: "No Data Found" });
        } else {
          res.status(200).json(customerProduct);
        }
      }
    );
    // res.status(200).json(customerProduct);
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};

const getCustomerProductsByCustomerProductCategory = async (req, res) => {
  const { name } = req.params;
  try {
    const data = await CustomerProduct.findAndCountAll({
      where: { "$country.name$": name },
      include: [CustomerProductCategory],
    });
    res.status(200).json(data);
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};
const getCustomerProductsByCountries = async (req, res) => {
  const name = req.body;

  try {
    const data = await CustomerProduct.findAndCountAll({
      where: { "$country.name$": { [Op.in]: name } },
      include: [CustomerProductCategory],
    });
    res.status(200).json(data);
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};

const getAllCustomerProducts = async (req, res) => {
  try {
    const data = await CustomerProduct.findAndCountAll({
      include: [CustomerProductCategory],
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
        name: {
          [Op.like]: "%" + st + "%",
        },
      },
      {
        description: {
          [Op.like]: "%" + st + "%",
        },
      },
      {
        "$customer_product_category.categoryName$": {
          [Op.like]: "%" + st + "%",
        },
      },
    ],
  };
};

/**
 * Create customer product controller(Single)
 * @param {*} req 
 * @param {*} res 
 * @returns 
 */
const createCustomerProduct = async (req, res) => {
  const customerProductBody = req.body;
  try {
    // Replaced by middleware
    // if (!(await canUserCreate(req.user, "customerProducts"))) {
    //   return res.status(401).json({ msg: "unauthorized access!" });
    // }
    const propic = req.file
      ? "uploads/" + req.file.filename
      : "";
    const duplicateName = await CustomerProduct.findAll({
      where: { name: customerProductBody.name },
    });
    if (duplicateName.length > 0) {
      res.status(400).json({ msg: "Customer Product already registered!" });
      return;
    }

    let productObject = {
      customerProductCategoryId: customerProductBody.customerProductCategoryId,
      name: customerProductBody.name,
      description: customerProductBody.description,
      productImage: propic,
      isActive: customerProductBody.isActive,
    };

    const customerProduct = await CustomerProduct.create(productObject);
    if (customerProduct) {
      await createEventLog(
        req.user.id,
        eventResourceTypes.customerProduct,
        `${customerProduct.name}`,
        customerProduct.id,
        eventActions.create,
        "",
        getIpAddress(req.ip)
      );
    }
    res.status(200).json(customerProduct);
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};

/**
 * Create customer products controler(bukl)
 * @param {*} req 
 * @param {*} res 
 * @returns 
 */
const createCustomerProducts = async (req, res) => {
  const customerProductBody = req.body;
  var addedList = 0;
  var duplicate = [];
  var countryNotFound = [];
  var incorrect = [];
  var lineNumber = 2;
  try {
    // Replaced by middlware
    // if (!(await canUserCreate(req.user, "customerProducts"))) {
    //   return res.status(401).json({ msg: "unauthorized access!" });
    // }
    // 
    let promises = await customerProductBody.map(async (customerProduct) => {
      const duplicateName = await CustomerProduct.findAll({
        where: { name: customerProduct.name },
      });
      const foundCustomerProductCategory =
        await CustomerProductCategory.findOne({
          where: { categoryName: customerProduct.productCategory },
        });
      if (duplicateName.length > 0) {
        duplicate += 1;
      } else if (foundCustomerProductCategory == null) {
        countryNotFound.push(lineNumber);
      } else {
        try {
          customerProduct.countryId = foundCustomerProductCategory.id;
          const customerProducts = await CustomerProduct.create(
            {...customerProduct, customerProductCategoryId: foundCustomerProductCategory? foundCustomerProductCategory.id : 0}
          );
          addedList += 1;
        } catch (error) {
          incorrect.push(lineNumber);
        }
      }
      lineNumber = lineNumber + 1;
    });
    Promise.all(promises).then(function (results) {
      let msg = "";
      if (addedList != 0) {
        msg = msg + `${addedList} customerProducts added`;
        
      }
      if (duplicate != 0) {
        msg = msg + ` duplicate value found on line ${duplicate} \n`;
      }
      if (countryNotFound != 0) {
        msg =
          msg +
          ` Line ${countryNotFound} rejected because country is not found`;
      }
      if (incorrect.length != 0) {
        msg = msg + ` line ${incorrect} has incorrect values`;
      }
      if (
        countryNotFound.length != 0 ||
        duplicate.length != 0 ||
        incorrect.length
      ) {
        res.status(400).json({ msg: msg });
      } else {
        res.status(200).json({ msg: msg });
      }
    });
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};

/**
 * Edit customer product controller
 * @param {*} req 
 * @param {*} res 
 * @returns 
 */
const editCustomerProduct = async (req, res) => {
  const reqBody = req.body;
  const id = req.params.id;

  try {

    // Replaced by middleware
    // if (!(await canUserEdit(req.user, "customerProducts"))) {
    //   return res.status(401).json({ msg: "unauthorized access!" });
    // }
    const duplicateName = await CustomerProduct.findAll({
      where: { name: reqBody.name },
    });
    
    if (duplicateName.length !== 0) {
      if (duplicateName[0].id !== Number(reqBody.id)) {
        res.status(400).json({ msg: "CustomerProduct already added" });
        return;
      }
    }
    
    const propic = req.file
      ? "uploads/" + req.file.filename
      : req.body.productImage;
      
    let productsBody;
    if (req.file) {
      productsBody = {
        customerProductCategoryId: req.body.customerProductCategoryId,
        name: req.body.name,
        description: req.body.description,
        productImage: propic,
        isActive: req.body.isActive,
      };
    } else {
      productsBody = {
        customerProductCategoryId: req.body.customerProductCategoryId,
        name: req.body.name,
        description: req.body.description,
        productImage: req.body.productImage,
        isActive: req.body.isActive,
      };
    }
    let oldCustomerProduct = await CustomerProduct.findByPk(id, {});
    let updated = await CustomerProduct.update(productsBody, { where: { id: id } });
    if (updated) {
      let newCustomerProduct = await CustomerProduct.findByPk(id, {});
      let changedFieldValues = getChangedFieldValues(
        oldCustomerProduct,
        newCustomerProduct
      );
      await createEventLog(
        req.user.id,
        eventResourceTypes.customerProduct,
        `${oldCustomerProduct.name}`,
        newCustomerProduct.id,
        eventActions.edit,
        changedFieldValues,
        getIpAddress(req.ip)
      );
      res.status(200).json({ id });
    }
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};

/**
 * Delete customer products controller
 * @param {*} req 
 * @param {*} res 
 * @returns 
 */
const deleteCustomerProduct = async (req, res) => {
  const id = req.params.id;

  try {
    // Replaced by middleware
    // if (!(await canUserDelete(req.user, "customerProducts"))) {
    //   return res.status(401).json({ msg: "unauthorized access!" });
    // }
    let customerProduct = await CustomerProduct.findByPk(id, {});
    let deleted = await CustomerProduct.destroy({ where: { id: id } });
    if (deleted) {
      await createEventLog(
        req.user.id,
        eventResourceTypes.customerProduct,
        `${customerProduct.name}`,
        customerProduct.id,
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
  getCustomerProduct,
  getCustomerProductByPk,
  getCustomerProductsByCustomerProductCategory,
  createCustomerProduct,
  editCustomerProduct,
  deleteCustomerProduct,
  getCustomerProductsByCountries,
  getAllCustomerProducts,
  createCustomerProducts,
};
