const { Op } = require("sequelize");
const Bsg = require("../../../models/BSG");
// const {
//   canUserRead,
//   canUserCreate,
//   canUserEdit,
//   canUserDelete,
// } = require("../../../utils/Authrizations");
const { eventResourceTypes, eventActions } = require("../../../utils/constants");
const {
  createEventLog,
  getChangedFieldValues,
  getIpAddress,
} = require("../../../utils/GeneralUtils");
const MiniBus = require("../../../models/quotation/MiniBuses");
const Vehicle = require("../../../models/motor/Vehicle");

const getMiniBus = async (req, res) => {
  try {
    // if (!(await canUserRead(req.user, "buses"))) {
    //   return res.status(401).json({ msg: "unauthorized access!" });
    // }
    const { f, r, st, sc, sd } = req.query;
    
    const data = await MiniBus.findAndCountAll({
      offset: Number(f),
      limit: Number(r),
      order: sc
        ? [[sc, sd == 1 ? "ASC" : "DESC"]]
        : [["createdAt", sd == 1 ? "DESC" : "ASC"]],
      // where: getSearch(st),
      include: [{model: Vehicle, as: "Vehicle"}]
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
        purpose: {
          [Op.like]: "%" + st + "%",
        },
      },
    ],
  };
};
//posting
const createMiniBus = async (req, res) => {
  const busBody = req.body;
  try {
    
    // if (!(await canUserCreate(req.user, "buses"))) {
    //   return res.status(401).json({ msg: "unauthorized access!" });
    // }
    // const ducplicateCountry = await Bsg.findAll({
    //   where: { vehicle: busBody.vehicle },
    // });
    // if (ducplicateCountry.length > 0) {
    //   res.status(400).json({ msg: "Bsg vehicle already used!" });
    //   return;
    // }
    const bus = await MiniBus.create(busBody);
    if (bus) {
      let ipAddress = getIpAddress(req.ip);
      const eventLog = await createEventLog(
        req.user.id,
        eventResourceTypes.bus,
        `${bus.vehicle} `,
        bus.id,
        eventActions.create,
        "",
        ipAddress
      );
    }
    res.status(200).json(bus);
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};

// post multiple minibuses 
const createMiniBuses = async (req, res) => {
 
  const minibusBody = req.body;
  
  
  var addedList = 0;
  var duplicate = [];
  var vehicleNotFound = [];
  var incorrect = [];
  var lineNumber = 2;
  try {
    // if (!(await canUserCreate(req.user, "vehicleRateCharts"))) {
    //   return res.status(401).json({ msg: "unauthorized access!" });
    // }
    let allVehicles = await Vehicle.findAll({
      attributes: ["id", "name"],
    });

    

    let promises = await minibusBody.map(async (vehicleRateChart) => {
      
      const duplicateName = await MiniBus.findAll({
        where: {
          vehicle_id: 
          allVehicles.find((vehicle) => {
            return vehicle.name == vehicleRateChart.vehicle;
          })?.id || 0,
          purpose: vehicleRateChart.purpose,
        },
       
      });

      
      const foundVehicle = await Vehicle.findOne({
        where: {
          name: vehicleRateChart.vehicle,
        },
      });

      

      if (duplicateName.length > 0) {
        // duplicate += 1;
        duplicate.push(allVehicles.filter((vehicle) => {
          return vehicle.name == vehicleRateChart.vehicle;
        }
        )[0].name);
      } 
      else if (foundVehicle == null) {
        vehicleNotFound.push(lineNumber);
      } 
      else {
        try {
          vehicleRateChart.vehicle_id = foundVehicle.id;
          
          
          const vehicleRateCharts = await MiniBus.create(
            vehicleRateChart
          );
          addedList += 1;
        } catch (error) {
          console.error(`Error processing line ${lineNumber}:`, error.message);
          incorrect.push(lineNumber);
        }
      }
      lineNumber = lineNumber + 1;
    });
    Promise.all(promises).then(function (results) {
      let msg = "";
      if (addedList != 0) {
        msg = msg + `${addedList} Mini Bus added`;
        
      }
      if (duplicate.length != 0) {
        msg = msg + ` duplicate value found for ${duplicate} \n`;
        
      }
      if (vehicleNotFound != 0) {
        msg =
          msg +
          ` Line ${vehicleNotFound} rejected because vehicle is not found`;
      }
      if (incorrect.length != 0) {
        msg = msg + ` line ${incorrect} has incorrect values`;
      }
      if (
        vehicleNotFound.length != 0 ||
        duplicate.length != 0 ||
        incorrect.length != 0
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


const getMiniBusByPk = async (req, res) => {
  try {
    // if (!(await canUserRead(req.user, "buses"))) {
    //   return res.status(401).json({ msg: "unauthorized access!" });
    // }
    const bus = await MiniBus.findByPk(req.params.id, {}).then(function (bus) {
      if (!bus) {
        res.status(404).json({ message: "No Data Found" });
      } else if (bus) {
        let ipAddress = getIpAddress(req.ip);
        const eventLog = createEventLog(
          req.user.id,
          eventResourceTypes.bus,
          `${bus.purpose} `,
          bus.id,
          eventActions.view,
          "",
          ipAddress
        );
        res.status(200).json(bus);
      }
    });

    // res.status(200).json(bsg);
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};

const editMiniBus= async (req, res) => {
  const busBody = req.body;
  const id = req.params.id;

  try {
    // if (!(await canUserEdit(req.user, "buss"))) {
    //   return res.status(401).json({ msg: "unauthorized access!" });
    // }
    // const duplicateName = await Bus.findAll({
    //   where: { id : id},
    // });
    // if (duplicateName.length !== 0) {
    //   if (duplicateName[0].id !== busBody.id) {
    //     res.status(400).json({ msg: "bus already used!" });
    //     return;
    //   }
    // }
    let oldDept = await MiniBus.findByPk(id, {});
    let dept = Bus.update(busBody, {
      where: { id: id },
    });

    if (dept) {
      let newDept = await MiniBus.findByPk(id, {});
      let changedFieldValues = getChangedFieldValues(oldDept, newDept);
      let ipAddress = getIpAddress(req.ip);
      const eventLog = createEventLog(
        req.user.id,
        eventResourceTypes.bus,
        newDept.purpose,
        newDept.id,
        eventActions.edit,
        changedFieldValues,
        ipAddress
      );
    }

    res.status(200).json({ id });
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};

const deleteMiniBus = async (req, res) => {
  const id = req.params.id;
  try {
    // if (!(await canUserDelete(req.user, "buses"))) {
    //   return res.status(401).json({ msg: "unauthorized access!" });
    // }
    let bus = await MiniBus.findByPk(id, {});
    let dept = await MiniBus.destroy({ where: { id: id } });
    if (dept) {
      let ipAddress = getIpAddress(req.ip);
      const eventLog = createEventLog(
        req.user.id,
        eventResourceTypes.bus,
        `${bus.purpose} `,
        bus.id,
        eventActions.delete,
        "",
        ipAddress
      );
    }
    res.status(200).json({ id });
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};

module.exports = {
  getMiniBus,
  createMiniBus,
  createMiniBuses,
  getMiniBusByPk,
  editMiniBus,
  deleteMiniBus,
};
