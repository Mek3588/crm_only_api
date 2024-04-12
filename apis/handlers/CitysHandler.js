const City = require("../../models/City");
const Region = require("../../models/Region");
const { Op } = require("sequelize");
// const {
//   canUserCreate,
//   canUserEdit,
//   canUserDelete,
// } = require("../../utils/Authrizations");
const { eventResourceTypes, eventActions } = require("../../utils/constants");
const {
  createEventLog,
  getChangedFieldValues,
  getIpAddress,
} = require("../../utils/GeneralUtils");

//get
const getCity = async (req, res) => {
  try {
    const { f, r, st, sc, sd } = req.query;
    const data = await City.findAndCountAll({
      include: [Region],
      offset: Number(f),
      limit: Number(r),
      order: [[sc || "name", sd == 1 ? "ASC" : "DESC"]],
      where: getSearch(st),
    });
    res.status(200).json(data);
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};

const getCityByPk = async (req, res) => {
  try {
    const subcity = await City.findByPk(req.params.id).then(function (subcity) {
      if (!subcity) {
        res.status(404).json({ message: "No Data Found" });
      } else {
        res.status(200).json(subcity);
      }
    });

    // res.status(200).json(subcity);
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};

const getCityByRegion = async (req, res) => {
  const { name } = req.params;
  try {
    const data = await City.findAndCountAll({
      where: { "$region.name$": name },
      include: [Region],
    });
    res.status(200).json(data);
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};
const getCityByRegions = async (req, res) => {
  const name = req.body;

  try {
    const data = await City.findAndCountAll({
      where: { "$region.name$": { [Op.in]: name } },
      include: [Region],
    });
    res.status(200).json(data);
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};

const getAllCitys = async (req, res) => {
  try {
    const data = await City.findAndCountAll({
      include: [Region],
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
        name: {
          [Op.like]: "%" + st + "%",
        },
      },
      {
        description: {
          [Op.like]: "%" + st + "%",
        },
      },
      {
        "$region.name$": {
          [Op.like]: "%" + st + "%",
        },
      },
    ],
  };
};

//posting
const createCity = async (req, res) => {
  const cityBody = req.body;
  try {
    // if (!(await canUserCreate(req.user, "citys"))) {
    //   return res.status(401).json({ msg: "unauthorized access!" });
    // }
    const duplicateName = await City.findAll({
      where: { name: cityBody.name },
    });
    if (duplicateName.length > 0) {
      let sameRegion = false;
      duplicateName.map((element) => {
        if (cityBody.regionId == element.regionId) {
          sameRegion = true;
        }
      });
      if (sameRegion) {
        res.status(400).json({ msg: "City already registered!" });
        return;
      }
    }

    const city = await City.create(cityBody);
    if (city) {
      await createEventLog(
        req.user.id,
        eventResourceTypes.city,
        `${city.name}`,
        city.id,
        eventActions.create,
        "",
        getIpAddress(req.ip)
      );
    }
    res.status(200).json(city);
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};

//put
const editCity = async (req, res) => {
  const reqBody = req.body;
  const id = req.params.id;
  try {
    // if (!(await canUserEdit(req.user, "citys"))) {
    //   return res.status(401).json({ msg: "unauthorized access!" });
    // }
    const duplicateName = await City.findAll({
      where: { name: reqBody.name },
    });
    
    let sameRegion = false;
    duplicateName.map((element) => {
      if (reqBody.regionId == element.regionId && reqBody.id !== element.id) {
        sameRegion = true;
      }
    });
    if (sameRegion) {
      res.status(400).json({ msg: "City already registered!" });
      return;
    }

    let oldCity = await City.findByPk(id, {});
    let updated = await City.update(reqBody, { where: { id: id } });

    if (updated) {
      let newCity = await City.findByPk(id, {});
      let changedFieldValues = getChangedFieldValues(oldCity, newCity)
      await createEventLog(
        req.user.id,
        eventResourceTypes.region,
        `${newCity.name}`,
        newCity.id,
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

const deleteCity = async (req, res) => {
  const id = req.params.id;

  try {
    // if (!(await canUserDelete(req.user, "citys"))) {
    //   return res.status(401).json({ msg: "unauthorized access!" });
    // }
    let city = await City.findByPk(id, {});
    let deleted = await City.destroy({ where: { id: id } });
    if (deleted) {
      await createEventLog(
        req.user.id,
        eventResourceTypes.city,
        `${city.name}`,
        city.id,
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

const createCities = async (req, res) => {
  const cityBody = req.body;
  var addedList = 0;
  var duplicate = 0;
  var countryNotFound = 0;
  try {
    // if (!(await canUserCreate(req.user, "citys"))) {
    //   return res.status(401).json({ msg: "unauthorized access!" });
    // }
    let promises = await cityBody.map(async (city) => {
      const duplicateName = await City.findAll({
        where: { name: city.name },
      });
      const foundRegion = await Region.findOne({
        where: { name: city.region },
      });
      if (duplicateName.length > 0) {
        duplicate += 1;
      } else if (foundRegion == null) {
        countryNotFound += 1;
      } else {
        try {
          city.regionId = foundRegion.id;
          const cities = await City.create(city);
          addedList += 1;
        } catch (error) {
          res.status(400).json({ msg: error.message });


        }
      }
    });
    Promise.all(promises).then(function (results) {
      let msg = "";
      if (addedList != 0) {
        msg = msg + `${addedList} cities added`;
        
      }
      if (duplicate != 0) {
        

        msg = msg + ` ${duplicate} duplicate found`;
        
      }
      if (countryNotFound != 0) {
        msg = msg + ` ${countryNotFound} rejected because region is not found`;
      }
      if (countryNotFound != 0 || duplicate != 0) {
        res.status(400).json({ msg: msg });
      } else {
        res.status(200).json({ msg: msg });
      }
    });
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};

module.exports = {
  getCity,
  getCityByPk,
  getCityByRegion,
  createCity,
  editCity,
  deleteCity,
  getCityByRegions,
  getAllCitys,
  createCities,
};
