const ServiceCharge = require("../../models/ServiceCharges");
const RiskType = require("../../models/RiskType");
const VehicleCategory = require("../../models/motor/VehicleCategory");
const { currentUser } = require("../../utils/GeneralUtils");
const User = require("../../models/acl/user");
const Employee = require("../../models/Employee");

const getServiceCharge = async (req, res) => {
  try {
    const currentUser = await User.findByPk(req.user.id, {
      include: [Employee],
    });

    //req.type="self"
    if (req.type == "all") {
      const data = await ServiceCharge.findAll({ include: VehicleCategory });
      res.status(200).json(data);
    }else if (req.type == "self"){
      const data = await ServiceCharge.findAll({ 
        include: VehicleCategory,
        where: {userId: currentUser.id}
      });
      res.status(200).json(data);
    }else if (req.type == "customer"){
      const data = await ServiceCharge.findAll({ 
        include: VehicleCategory,
        where: {userId: currentUser.id}
      });
      res.status(200).json(data);
    }else if (req.type == "branch"){
      const data = await ServiceCharge.findAll({ 
        include: [
          {
            model: User, as: 'user',
            include: [Employee],
          },
          VehicleCategory,
        ],
        where: {"$user.employee.branchId$": currentUser.employee.branchId}
      });
      res.status(200).json(data);
    }else if (req.type == "branchAndSelf"){
      const data = await ServiceCharge.findAll({ 
        include: [
          {
            model: User, as: 'user',
            include: [Employee],
          },
          VehicleCategory,
        ],
        where: {
          userId: currentUser.id,
          "$user.employee.branchId$": currentUser.employee.branchId}
      });
      res.status(200).json(data);
    }
  } catch (error) {
     res.status(400).json({ msg: error.message });
  }
};
 
//posting
const createServiceCharge = async (req, res) => {
  const dataBody = req.body
  try {
    const serviceCharge = await ServiceCharge.create(dataBody);
    res.status(200).json(serviceCharge);
  } catch (error) {
     res.status(400).json({ msg: error.message }); 
  }
};

const getServiceChargeByPk = async (req, res) => {
   const params = req.params.id
  try {
    const serviceCharge = await ServiceCharge.findByPk(params,{ include: VehicleCategory }).then(function (
      serviceCharge
    ) {
      if (!serviceCharge) {
        res.status(400).json({ message: "No Data Found" });
      }
      else{
res.status(200).json(serviceCharge);
      }
     
    });
    
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};

const editServiceCharge = async (req , res) => {
   const body = req.body
   const id = req.body.id

    try {
        ServiceCharge.update(body,{where: {id:id}});
        res.status(200).json({ id }
        )  
     }
    catch (error) {
        res.status(400).json({ msg: error.message });
     }
};

const deleteServiceCharge = async (req, res) => {
  const  id  = req.params.id;

  try {
    ServiceCharge.destroy({ where: { id: id } });

    res.status(200).json({ id });
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};

module.exports = {
  getServiceCharge,
  createServiceCharge,
  getServiceChargeByPk,
  editServiceCharge,
  deleteServiceCharge,
};
