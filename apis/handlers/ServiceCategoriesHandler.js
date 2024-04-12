const ServiceCategory = require("../../models/ServiceCategory");

const getServiceCategories = async (req, res) => {
  try {
    const data = await ServiceCategory.findAll({ raw: true });
    res.status(200).json(data);
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};

const createServiceCategory = async (req, res) => {
  const { categoryName, description } = req.body;
  try {
    const serviceCategory = await ServiceCategory.create({
      categoryName: categoryName,
      description: description,
    });
    res.status(200).json(serviceCategory);
  } catch (error) {
    
  }
};

const getServiceCategory = async (req, res) => {
  try {
    const serviceCategory = await ServiceCategory.findByPk(req.params.id).then(
      function (serviceCategory) {
        if (!serviceCategory) {
          res.status(404).json({ message: "No Data Found" });
        }
        res.status(200).json(serviceCategory);
      }
    );

    res.status(200).json(serviceCategory);
  } catch (error) {
    res.status(404).json({ msg: error.message });
  }
};

const editServiceCategory = async (req, res) => {
    const { id,categoryName, description } = req.body;

  try {
    ServiceCategory.update(
      {
        categoryName: categoryName,
        description: description,
      },

      { where: { id: id } }
    );

    res.status(200).json({ id });
  } catch (error) {
    res.status(404).json({ msg: error.message });
  }
};

const deleteServiceCategory = async (req, res) => {
  const id = req.params.id;
  try {
    ServiceCategory.destroy({ where: { id: id } });

    res.status(200).json({ id });
  } catch (error) {
    res.status(404).json({ msg: error.message });
  }
};

module.exports = {
  getServiceCategories,
  createServiceCategory,
  getServiceCategory,
  editServiceCategory,
  deleteServiceCategory,
};
