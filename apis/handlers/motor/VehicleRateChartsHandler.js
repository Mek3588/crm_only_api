const VehicleRateChart = require("../../../models/motor/VehicleRateChart");
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

//get
const getVehicleRateChart = async (req, res) => {
  try {
    const { f, r, st, sc, sd } = req.query;
    const data = await VehicleRateChart.findAndCountAll({
      include: [Vehicle],
      offset: Number(f),
      limit: Number(r),
      order: [[sc || "purpose", sd == 1 ? "ASC" : "DESC"]],
      where: getSearch(st),
    });
    res.status(200).json(data);
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};

const getVehicleRateChartByPk = async (req, res) => {
  try {
    const vehicleRateChart = await VehicleRateChart.findByPk(req.params.id, {
      include: [Vehicle],
    }).then(function (vehicleRateChart) {
      if (!vehicleRateChart) {
        res.status(404).json({ message: "No Data Found" });
      } else {
        res.status(200).json(vehicleRateChart);
      }
    });
    // res.status(200).json(vehicleRateChart);
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};

const getVehicleRateChartsByVehicle = async (req, res) => {
  try {
    const { f, r, st, sc, sd } = req.query;
    const { name } = req.params;
    const data = await VehicleRateChart.findAndCountAll({
      // where: { vehicleType: name },
      include: [Vehicle],
      offset: Number(f),
      limit: Number(r),
      order: [[sc || "purpose", sd == 1 ? "ASC" : "DESC"]],
      where: {
        [Op.and]: [
          {
            vehicleType: name,
          },
          getSearch(st),
        ],
      },
    });
    res.status(200).json(data);
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};
const getVehicleRateChartsByCountries = async (req, res) => {
  const name = req.body;

  try {
    const data = await VehicleRateChart.findAndCountAll({
      where: { "$vehicle.name$": { [Op.in]: name } },
      include: [Vehicle],
    });
    res.status(200).json(data);
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};

const getAllVehicleRateCharts = async (req, res) => {
  try {
    const data = await VehicleRateChart.findAndCountAll({
      include: [Vehicle],
      where: { vehicleType: req.params.name },
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
        vehicleType: {
          [Op.like]: "%" + st + "%",
        },
      },
      {
        purpose: {
          [Op.like]: "%" + st + "%",
        },
      },
      {
        "$vehicle.name$": {
          [Op.like]: "%" + st + "%",
        },
      },
      {
        rate: {
          [Op.like]: "%" + st + "%",
        },
      },
    ],
  };
};

//posting
const createVehicleRateChart = async (req, res) => {
  const vehicleRateChartBody = req.body;
  try {
    if (!(await canUserCreate(req.user, "vehicleRateCharts"))) {
      return res.status(401).json({ msg: "unauthorized access!" });
    }
    const duplicateName = await VehicleRateChart.findAll({
      where: {
        purpose: vehicleRateChartBody.purpose,
        "$vehicle.name$": { [Op.in]: vehicleRateChartBody.vehicle.name },
        
      },
      include: [Vehicle],
    });
    if (duplicateName.length > 0) {
      res.status(400).json({ msg: "VehicleRateChart already registered!" });
      return;
    }
    const vehicleRateChart = await VehicleRateChart.create(
      vehicleRateChartBody
    );
    if (vehicleRateChart) {
      await createEventLog(
        req.user.id,
        eventResourceTypes.vehicleRateChart,
        `${
          vehicleRateChart?.general_purpose +
          " " +
          vehicleRateChart?.specififc_purpose
        }`,
        vehicleRateChart.id,
        eventActions.create,
        "",
        getIpAddress(req.ip)
      );
    }
    res.status(200).json(vehicleRateChart);
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};

const createVehicleRateCharts = async (req, res) => {
 
  const vehicleRateChartBody = req.body;
  
  
  var addedList = 0;
  var duplicate = [];
  var vehicleNotFound = [];
  var incorrect = [];
  var lineNumber = 2;
  try {
    if (!(await canUserCreate(req.user, "vehicleRateCharts"))) {
      return res.status(401).json({ msg: "unauthorized access!" });
    }
    let allVehicles = await Vehicle.findAll({
      attributes: ["id", "name"],
    });

    

    let promises = await vehicleRateChartBody.map(async (vehicleRateChart) => {
      
      const duplicateName = await VehicleRateChart.findAll({
        where: {
          vehicleId: 
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
          vehicleRateChart.vehicleId = foundVehicle.id;
          const vehicleRateCharts = await VehicleRateChart.create(
            vehicleRateChart
          );
          addedList += 1;
        } catch (error) {
          incorrect.push(lineNumber);
        }
      }
      lineNumber = lineNumber + 1;
    });
    Promise.all(promises).then(function (results) {
      let msg = "";
      if (addedList != 0) {
        msg = msg + `${addedList} vehicleRateCharts added`;
        
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

//put
const editVehicleRateChart = async (req, res) => {
  const reqBody = req.body;
  const id = req.params.id;

  try {
    if (!(await canUserEdit(req.user, "vehicleRateCharts"))) {
      return res.status(401).json({ msg: "unauthorized access!" });
    }
    // const duplicateName = await VehicleRateChart.findAll({
    //   where: { specififc_purpose: reqBody.specififc_purpose },
    // });
    // 
    // if (duplicateName.length !== 0) {
    //   if (duplicateName[0].id !== reqBody.id) {
    //     res.status(400).json({ msg: "VehicleRateChart already added" });
    //     return;
    //   }
    // }
    let oldVehicleRateChart = await VehicleRateChart.findByPk(id, {});
    let updated = await VehicleRateChart.update(reqBody, { where: { id: id } });

    if (updated) {
      let newVehicleRateChart = await VehicleRateChart.findByPk(id, {});
      let changedFieldValues = getChangedFieldValues(
        oldVehicleRateChart,
        newVehicleRateChart
      );
      await createEventLog(
        req.user.id,
        eventResourceTypes.vehicleRateChart,
        `${
          oldVehicleRateChart?.general_purpose +
          " " +
          oldVehicleRateChart?.specififc_purpose
        }`,
        newVehicleRateChart.id,
        eventActions.edit,
        changedFieldValues,
        getIpAddress(req.ip)
      );
      res.status(200).json({ id });
    }
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};

const deleteVehicleRateChart = async (req, res) => {
  const id = req.params.id;

  try {
    if (!(await canUserDelete(req.user, "vehicleRateCharts"))) {
      return res.status(401).json({ msg: "unauthorized access!" });
    }
    let vehicleRateChart = await VehicleRateChart.findByPk(id, {});
    let deleted = await VehicleRateChart.destroy({ where: { id: id } });
    if (deleted) {
      await createEventLog(
        req.user.id,
        eventResourceTypes.vehicleRateChart,
        `${vehicleRateChart.name}`,
        vehicleRateChart.id,
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
  getVehicleRateChart,
  getVehicleRateChartByPk,
  getVehicleRateChartsByVehicle,
  createVehicleRateChart,
  editVehicleRateChart,
  deleteVehicleRateChart,
  getVehicleRateChartsByCountries,
  getAllVehicleRateCharts,
  createVehicleRateCharts,
};
