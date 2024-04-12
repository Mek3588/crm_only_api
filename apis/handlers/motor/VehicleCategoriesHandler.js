const VehicleCategory = require("../../../models/motor/VehicleCategory");
const {
  canUserCreate,
  canUserEdit,
  canUserDelete,
} = require("../../../utils/Authrizations");

const getVehicleCategories = async (req, res) => {
  
  const { id } = req.params;
  try {
    const data = await VehicleCategory.findAll({
      include: [{ model: VehicleCategory, as: "superCategory" }],
      where: { superCategotyId: id != "null" ? id : null },
    });
    res.status(200).json(data);
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};

const getActiveVehicleCategories = async (req, res) => {
  
  const { id } = req.params;
  try {
    const data = await VehicleCategory.findAll({
      where: { superCategotyId: id != "null" ? id : null, isActive: true },
    });
    res.status(200).json(data);
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};

//posting
const createVehicleCategory = async (req, res) => {
  if (!(await canUserCreate(req.user, "vehicleCategorys"))) {
    return res.status(401).json({ msg: "unauthorized access!" });
  }
  try {
    // 
    // let newVehicleCategory = {};
    // const {name, superCategotyId, rate, description} = req.body;
    // if (name) newVehicleCategory.name = name;
    // if (superCategotyId) newVehicleCategory.superCategotyId = superCategotyId;
    //   if (rate) newVehicleCategory.rate = rate
    const vehicleCategory = await VehicleCategory.create({
      ...req.body,
    });
    res.status(200).json(vehicleCategory);
  } catch (error) {
    res.status(404).json({ msg: error.message });
  }
};

const getVehicleCategory = async (req, res) => {
  try {
    const data = await VehicleCategory.findByPk(req.params.id).then(function (
      vehicleCategory
    ) {
      if (!vehicleCategory) {
        res.status(404).json({ message: "No Data Found" });
      }
      res.status(200).json(vehicleCategory);
    });
  } catch (error) {
    res.status(404).json({ msg: error.message });
  }
};

const editVehicleCategory = async (req, res) => {
  
  const { id } = req.body;
  if (!(await canUserEdit(req.user, "vehicleCategorys"))) {
    return res.status(401).json({ msg: "unauthorized access!" });
  }
  try {
    VehicleCategory.update(
      {
        ...req.body,
      },

      { where: { id: id } }
    );

    res.status(200).json({ id });
  } catch (error) {
    res.status(404).json({ msg: error.message });
  }
};

const deleteVehicleCategory = async (req, res) => {
  const id = req.params.id;
  if (!(await canUserDelete(req.user, "vehicleCategorys"))) {
    return res.status(401).json({ msg: "unauthorized access!" });
  }
  
  try {
    VehicleCategory.destroy({ where: { id: id } });

    res.status(200).json({ id });
  } catch (error) {
    res.status(404).json({ msg: error.message });
  }
};

module.exports = {
  getVehicleCategories,
  getActiveVehicleCategories,
  createVehicleCategory,
  getVehicleCategory,
  editVehicleCategory,
  deleteVehicleCategory,
};
