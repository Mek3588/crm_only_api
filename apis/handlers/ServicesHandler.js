const Service = require("../../models/Service");

const getServices = async (req, res) => {
  try {
    const data = await Service.findAll({ raw: true });
    res.status(200).json(data);
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};

//posting
const createService = async (req, res) => {
  const { serviceName, usageUnit, website, category,  assignedTo, 
     active, sharedWith, renewable,private,  price, cost, taxes, description} =
    req.body;
  try {
    const service = await Service.create({
        serviceName: serviceName,
        usageUnit: usageUnit,
        website: website,
        category: category,
        assignedTo: assignedTo,
        active: active,
        sharedWith: sharedWith,
        renewable: renewable,
        private: private,
        price: price,
        cost: cost,
        taxes: taxes,
        description: description,
    });
    res.status(200).json(service);
  } catch (error) {
    
  }
};

const getService = async (req, res) => {
  try {
    const service = await Service.findByPk(req.params.id).then(function (
      service
    ) {
      if (!service) {
        res.status(404).json({ message: "No Data Found" });
      }
      res.status(200).json(service);
    });

    res.status(200).json(service);
  } catch (error) {
    res.status(404).json({ msg: error.message });
  }
};

const editService = async (req, res) => {
    const {id, serviceName, usageUnit, website, category,  assignedTo, 
        active, sharedWith, renewable,private,  price, cost, taxes, description} =
       req.body;

  try {
    Service.update(
      {
        serviceName: serviceName,
        usageUnit: usageUnit,
        website: website,
        category: category,
        assignedTo: assignedTo,
        active: active,
        sharedWith: sharedWith,
        renewable: renewable,
        private: private,
        price: price,
        cost: cost,
        taxes: taxes,
        description: description,
      },

      { where: { id: id } }
    );
    
    res.status(200).json({ id });
  } catch (error) {
    res.status(404).json({ msg: error.message });
  }
};

const deleteService = async (req, res) => {
  const  id  = req.params.id;

  try {
    Service.destroy({ where: { id: id } });

    res.status(200).json({ id });
  } catch (error) {
    res.status(404).json({ msg: error.message });
  }
};

module.exports = {
  getServices,
  createService,
  getService,
  editService,
  deleteService,
};
