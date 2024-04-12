const ACL = require("../../models/acl/ACL");
const OutsourcedService = require("../../models/OutsourcedService");
const ServiceCategory = require("../../models/ServiceCategory");

const getOutsourcedServices = async (req, res) => {
  try {
    const data = await OutsourcedService.findAll({
      include: [ServiceCategory],
    });
    res.status(200).json(data);
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};

//posting
const createOutsourcedService = async (req, res) => {
  const {
    serviceName,
    serviceCategoryId,
    assignedTo,
    sharedWith,
    supportTerminationDate,
    private,
    whereBought,
    relatedTo,
    opportunity,
    description,
  } = req.body;
  try {
    const outsourcedService = await OutsourcedService.create({
      serviceName: serviceName,
      serviceCategoryId: serviceCategoryId,
      assignedTo: assignedTo,
      sharedWith: sharedWith,
      supportTerminationDate: supportTerminationDate,
      private: private,
      whereBought: whereBought,
      relatedTo: relatedTo,
      opportunity: opportunity,
      description: description,
    });
    res.status(200).json(outsourcedService);
  } catch (error) {
    
  }
};

const getOutsourcedService = async (req, res) => {
  try {
    const outsourcedService = await OutsourcedService.findByPk(
      req.params.id
    ).then(function (outsourcedService) {
      if (!outsourcedService) {
        res.status(404).json({ message: "No Data Found" });
      }
      res.status(200).json(outsourcedService);
    });

    res.status(200).json(outsourcedService);
  } catch (error) {
    res.status(404).json({ msg: error.message });
  }
};

const editOutsourcedService = async (req, res) => {
  const {
    id,
    serviceName,
    serviceCategoryId,
    assignedTo,
    sharedWith,
    supportTerminationDate,
    private,
    whereBought,
    relatedTo,
    opportunity,
    description,
  } = req.body;

  try {
    OutsourcedService.update(
      {
        serviceName: serviceName,
        serviceCategoryId: serviceCategoryId,
        assignedTo: assignedTo,
        sharedWith: sharedWith,
        supportTerminationDate: supportTerminationDate,
        private: private,
        whereBought: whereBought,
        relatedTo: relatedTo,
        opportunity: opportunity,
        description: description,
      },

      { where: { id: id } }
    );

    res.status(200).json({ id });
  } catch (error) {
    res.status(404).json({ msg: error.message });
  }
};

const deleteOutsourcedService = async (req, res) => {
  const id = req.params.id;

  try {
    OutsourcedService.destroy({ where: { id: id } });

    res.status(200).json({ id });
  } catch (error) {
    res.status(404).json({ msg: error.message });
  }
};

const setAuthorizations = async (req, res) => {
  const { path } = req.params;
  try {
    const authorizations = await ACL.findOne({ where: { path, groupId } });
    res.status(200).json({
      path: authorizations.path,
      create: authorizations.create,
      read: authorizations.read,
      update: authorizations.update,
      delete: authorizations.delete,
    });
  } catch (error) {
    res.status(404).json({ msg: error.message });
  }
};

module.exports = {
  getOutsourcedServices,
  createOutsourcedService,
  getOutsourcedService,
  editOutsourcedService,
  deleteOutsourcedService,
  setAuthorizations,
};
