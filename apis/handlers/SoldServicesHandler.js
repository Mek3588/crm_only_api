const SoldService = require("../../models/SoldService");
const ServiceCategory = require("../../models/ServiceCategory");
const Service = require("../../models/Service");

const getSoldServices = async (req, res) => {
  try {
    const data = await SoldService.findAll({ 

      include:[Service, ServiceCategory] ,
     });
    res.status(200).json(data);
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};

//posting
const createSoldService = async (req, res) => {
  const { productName, status, serviceId, serviceCategoryId,  supportTerminationDate, 
    private, whereBought, relatedTo,opportunity,  description} =
    req.body;
  try {
    const soldService = await SoldService.create({
        productName: productName,
        status: status,
        serviceId: serviceId,
        serviceCategoryId: serviceCategoryId,
        supportTerminationDate: supportTerminationDate,
        private: private,
        whereBought: whereBought,
        relatedTo: relatedTo,
        opportunity: opportunity,
        description: description
    });
    res.status(200).json(soldService);
  } catch (error) {
    
  }
};

const getSoldService = async (req, res) => {
  try {
    const soldService = await SoldService.findByPk(req.params.id)
    .then(function (
      soldService
    ) {
      if (!soldService) {
        res.status(400).json({ message: "No Data Found" });
      }
      res.status(200).json(soldService);
    });

    res.status(200).json(soldService);
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};

const editSoldService = async (req, res) => {
    const { id, productName, status, serviceId, serviceCategoryId,  supportTerminationDate, 
    private, whereBought, relatedTo,opportunity,  description} =
       req.body;

  try {
    SoldService.update(
      {
        productName: productName,
        status: status,
        serviceId: serviceId,
        serviceCategoryId: serviceCategoryId,
        supportTerminationDate: supportTerminationDate,
        private: private,
        whereBought: whereBought,
        relatedTo: relatedTo,
        opportunity: opportunity,
        description: description
      },

      { where: { id: id } }
    );
    
    res.status(200).json({ id });
  } catch (error) {
    res.status(404).json({ msg: error.message });
  }
};

const deleteSoldService = async (req, res) => {
  const  id  = req.params.id;

  try {
    SoldService.destroy({ where: { id: id } });

    res.status(200).json({ id });
  } catch (error) {
    res.status(404).json({ msg: error.message });
  }
};

module.exports = {
  getSoldServices,
  createSoldService,
  getSoldService,
  editSoldService,
  deleteSoldService,
};
