const Vehicle = require("../../../models/motor/Vehicle");
const { Op } = require("sequelize");
const {
  canUserCreate,
  canUserEdit,
  canUserDelete,
} = require("../../../utils/Authrizations");
const {
  eventResourceTypes,
  eventActions,
} = require("../../../utils/constants");
const {
  createEventLog,
  getChangedFieldValues,
  getIpAddress,
} = require("../../../utils/GeneralUtils");
const User = require("../../../models/acl/user");
const Employee = require("../../../models/Employee");
const Branch = require("../../../models/Branch");
const Proposal = require("../../../models/proposals/Proposal");
const MotorProposal = require("../../../models/proposals/MotorProposal");
const Quotation = require("../../../models/Quotation");
const VehicleCategory = require("../../../models/motor/VehicleCategory");

const getSearch = (st) => {
  return {
    [Op.or]: [
      { name: { [Op.like]: `%${st}%` } },
      { make_of: { [Op.like]: `%${st}%` } },
      { vehicle_type: { [Op.like]: `%${st}%` } },
      { description: { [Op.like]: `%${st}%` } },
    ],
  };
};

const getVehicle = async (req, res) => {
  const { f, r, st, sc, sd, vehicle_type } = req.query;
  let searchByVehicleType = {};
  
  

  if (vehicle_type && vehicle_type != "undefined") searchByVehicleType.vehicle_type = vehicle_type;
  
  try {
    const currentUser = await User.findByPk(req.user.id, {
      include: [Employee],
    });
    
    // const data = await Vehicle.findAndCountAll({
    //   offset: Number(f),
    //   limit: Number(r),
    //   order: [[sc || "name", sd == 1 ? "ASC" : "DESC"]],
    //   where: { [Op.and]: [getSearch(st), searchByVehicleType] },
    // });
    //req.type="branchAndSelf"
    

    if (req.type == "all") {
      const vehicle = await Vehicle.findAndCountAll(
        {
          attributes: ['id', 'name', 'make_of', 'vehicle_type', 'category'],
          offset: Number(f),
          limit: Number(r),
          order: [[sc || "name", sd == 1 ? "ASC" : "DESC"]],
          where: { [Op.and]: [getSearch(st), searchByVehicleType] },
        },
      )

      res.status(200).json(vehicle);
    } else if (req.type == "self") {
      const vehicle = await Vehicle.findAndCountAll(
        {
          offset: Number(f),
          limit: Number(r),
          order: [[sc || "name", sd == 1 ? "ASC" : "DESC"]],
          attributes: ['id', 'name', 'make_of', 'vehicle_type', 'category'],
          where: {
                userId: currentUser.id,
                ...getSearch(st),
          },
        },
      );

      res.status(200).json(vehicle);
    } else if (req.type == "customer") {
      const vehicle = await Vehicle.findAndCountAll(
        {
          offset: Number(f),
          limit: Number(r),
          order: [[sc || "name", sd == 1 ? "ASC" : "DESC"]],
          attributes: ['id', 'name', 'make_of', 'vehicle_type', 'category'],
          where: {
              // userId: currentUser.id ,
              ...getSearch(st),
          },
        },
      )

      res.status(200).json(vehicle);
    } else if (req.type == "branch") {
      const vehicle = await Vehicle.findAndCountAll(
        {
          offset: Number(f),
          limit: Number(r),
          order: [[sc || "name", sd == 1 ? "ASC" : "DESC"]],
          include: {
            model: User, as: 'user',
            include: [Employee],
          },
          where: {
            [Op.and]: [
                { "$user.employee.branchId$": currentUser.employee.branchId, },
                getSearch(st),
                searchByVehicleType
            ],
            }, 
          attributes: ['id', 'name', 'make_of', 'vehicle_type', 'category'],
        },
      )

      res.status(200).json(vehicle);
    } else if (req.type == "branchAndSelf") { 
      const vehicle = await Vehicle.findAndCountAll(
        {
          offset: Number(f),
          limit: Number(r),
          order: [[sc || "name", sd == 1 ? "ASC" : "DESC"]],
          include: {
            model: User, as: 'user',
            include: [Employee],
          },
          where: {
            userId: currentUser.id,
            "$user.employee.branchId$": currentUser.employee.branchId,
            ...getSearch(st),
          },
        },
      )

      res.status(200).json(vehicle);
    }
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};

const getAllVehicles = async (req, res) => {
  const vehicle = await Vehicle.findAndCountAll({})
  
  try {
    res.status(200).json(data);
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};

//posting
const createVehicle = async (req, res) => {
  const vehicleBody = req.body;
  const userId = req.user.id;
  const currentUser = await User.findByPk(req.user.id, {
    include: [Employee],
  });
  vehicleBody.userId = userId;
  vehicleBody.branchId = currentUser.employee?.branchId;

  try {
    if (!(await canUserCreate(req.user, "vehicles"))) {
      return res.status(401).json({ msg: "unauthorized access!" });
    }
    const duplicateVehicleName = await Vehicle.findAll({
      where: { name: vehicleBody.name, vehicle_type: vehicleBody.vehicle_type },
    });
    if (duplicateVehicleName.length > 0) {
      res.status(400).json({ msg: "Vehicle already registered!" });
      return;
    }
    const vehicle = await Vehicle.create(vehicleBody);
    if (vehicle) {
      await createEventLog(
        req.user.id,
        eventResourceTypes.vehicle,
        `${vehicle.name}`,
        vehicle.id,
        eventActions.create,
        "",
        getIpAddress(req.ip)
      );
    }
    res.status(200).json(vehicle);
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};

const createVehicles = async (req, res) => {
  const vehicleBody = req.body;
  var addedVehicles = 0;
  var duplicate = [];
  var incorrect = [];
  var lineNumber = 2;
  try {
    if (!(await canUserCreate(req.user, "vehicles"))) {
      return res.status(401).json({ msg: "unauthorized access!" });
    }

    var promises = vehicleBody.map(async (element) => {
      let duplicateName = await Vehicle.findAll({
        where: { name: element.name },
      });
      if (duplicateName.length > 0) {
        // 

        duplicate.push(lineNumber);
      } else if (duplicateName.length == 0) {
        // vehicle.push(await Vehicle.create(element));
        try {
          await Vehicle.create(element).then((e) => {
            
            

            addedVehicles += 1;
          })

        } catch (error) {
          
          incorrect.push(lineNumber);
        }
      }
      lineNumber = lineNumber + 1;
    });
    Promise.all(promises).then(function (results) {
      let msg = "";
      if (addedVehicles != 0) {
        

        msg = msg + `${addedVehicles} Vehicles added`;
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
    // const vehicle = await Vehicle.create(vehicleBody);
    // res.status(200).json(vehicle);
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};

const getVehicleByPk = async (req, res) => {
  try {
    const vehicle = await Vehicle.findByPk(req.params.id,
      
      ).then(function (
      vehicle
    ) {
      if (!vehicle) {
      return  res.status(404).json({ message: "No Data Found" });
      }
      
    return  res.status(200).json(vehicle);
    });

   return res.status(200).json(vehicle);
  } catch (error) {
   return res.status(400).json({ msg: error.message });
  }
};

  const getVehicleByName = async (req, res) => {
    try {
      

      const vehicle = await Vehicle.findOne({ where: { name: req.params.name } });
      
      res.status(200).json(vehicle.id);
    } catch (error) {
      res.status(400).json({ msg: error.message });
    }
  };

  const getVehiclesByType = async (req, res) => {
    try {
      const vehicles = await Vehicle.findAndCountAll({ where: { vehicle_type: req.params.type } });
      
      res.status(200).json(vehicles);
    } catch (error) {
      res.status(400).json({ msg: error.message });
    }
  };
  



const editVehicle = async (req, res) => {
  const reqBody = req.body;
  const id = req.params.id;

  try {
    if (!(await canUserEdit(req.user, "vehicles"))) {
      return res.status(401).json({ msg: "unauthorized access!" });
    }
    const duplicateVehicleName = await Vehicle.findAll({
      where: { name: reqBody.name },
    });
    if (duplicateVehicleName.length !== 0)
      if (duplicateVehicleName[0].id !== reqBody.id) {
        res.status(400).json({ msg: "Vehicle already registered!" });
        return;
      }
    let oldVehicle = await Vehicle.findByPk(id, {});
    let updated = await Vehicle.update(reqBody, { where: { id: id } });

    if (updated) {
      let newVehicle = await Vehicle.findByPk(id, {});
      let changedFieldValues = getChangedFieldValues(oldVehicle, newVehicle);
      await createEventLog(
        req.user.id,
        eventResourceTypes.vehicle,
        `${oldVehicle.name}`,
        newVehicle.id,
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

const deleteVehicle = async (req, res) => {
  const id = req.params.id;

  try {
    if (!(await canUserDelete(req.user, "vehicles"))) {
      return res.status(401).json({ msg: "unauthorized access!" });
    }
    let vehicle = await Vehicle.findByPk(id, {});
    let deleted = await Vehicle.destroy({ where: { id: id } });
    if (deleted) {
      await createEventLog(
        req.user.id,
        eventResourceTypes.vehicle,
        `${vehicle.name}`,
        vehicle.id,
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
  getVehicle,
  getAllVehicles,
  createVehicle,
  createVehicles,
  getVehicleByPk,
  editVehicle,
  getVehiclesByType,
  deleteVehicle,
  getVehicleByName,
};
