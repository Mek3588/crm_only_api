const Product = require("../../models/Product");
const ProductCategory = require("../../models/ProductCategory");

const getProductCategories = async (req, res) => {
  try {
    const data = await ProductCategory.findAll({ 
      // include:[Product] ,

    });
    res.status(200).json(data);
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};

const createProductCategory = async (req, res) => {
  const reqBody = req.body;
  try {
    const productCategory = await ProductCategory.create(reqBody);
    res.status(200).json(productCategory);
  } catch (error) {
    res.status(400).json({ msg: error.message });  }
};

const getProductCategory = async (req, res) => {
  try {
    const productCategory = await ProductCategory.findByPk(req.params.id).then(
      function (productCategory) {
        if (!productCategory) {
          res.status(404).json({ message: "No Data Found" });
        }
        res.status(200).json(productCategory);
      }
    );

    res.status(200).json(productCategory);
  } catch (error) {
    res.status(404).json({ msg: error.message });
  }
};

const editProductCategory = async (req, res) => {
    const id = req.params.id;
    const reqBody = req.body;

  try {
    ProductCategory.update(
      reqBody,
      { where: { id: id } }
    );

    res.status(200).json({ id });
  } catch (error) {
    res.status(404).json({ msg: error.message });
  }
};

const deleteProductCategory = async (req, res) => {
  const id = req.params.id;
  try {
    ProductCategory.destroy({ where: { id: id } });

    res.status(200).json({ id });
  } catch (error) {
    res.status(404).json({ msg: error.message });
  }
};

module.exports = {
  getProductCategories,
  createProductCategory,
  getProductCategory,
  editProductCategory,
  deleteProductCategory,
};
