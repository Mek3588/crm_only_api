const Product = require("../../models/Product");

const getProducts = async (req, res) => {
  try {
    const data = await Product.findAll({ raw: true });
    res.status(200).json(data);
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};

//posting
const createProduct = async (req, res) => {
  
  const reqBody = req.body;
  try {
    const product = await Product.create(reqBody);
    res.status(200).json(product);
  } catch (error) {
    
  }
};

const getProduct = async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id).then(function (
      product
    ) {
      if (!product) {
        res.status(404).json({ message: "No Data Found" });
      }
      res.status(200).json(product);
      return
    });

    res.status(200).json(product);
  } catch (error) {
    res.status(404).json({ msg: error.message });
  }
};

const editProduct = async (req, res) => {
    const reqBody = req.body;
    const id = req.params.id;

  try {
    Product.update(
      reqBody,
      { where: { id: id } }
    );
    
    res.status(200).json({ id });
  } catch (error) {
    res.status(404).json({ msg: error.message });
  }
};

const deleteProduct = async (req, res) => {
  const  id  = req.params.id;
  try {
    Product.destroy({ where: { id: id } });

    res.status(200).json({ id });
  } catch (error) {
    res.status(404).json({ msg: error.message });
  }
};

module.exports = {
  getProducts,
  createProduct,
  getProduct,
  editProduct,
  deleteProduct,
};
