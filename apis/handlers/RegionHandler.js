const Region = require("../../models/Region");
const Country = require("../../models/Country");
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
const getRegion = async (req, res) => {
  try {
    const { f, r, st, sc, sd } = req.query;
    const data = await Region.findAndCountAll({
      include: [Country],
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

const getRegionByPk = async (req, res) => {
  try {
    const region = await Region.findByPk(req.params.id).then(function (region) {
      if (!region) {
        res.status(404).json({ message: "No Data Found" });
      } else {
        res.status(200).json(region);
      }
    });
    // res.status(200).json(region);
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};

const getRegionsByCountry = async (req, res) => {
  const { name } = req.params;
  try {
    const data = await Region.findAndCountAll({
      where: { "$country.name$": name },
      include: [Country],
    });
    res.status(200).json(data);
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};
const getRegionsByCountries = async (req, res) => {
  const name = req.body;

  try {
    const data = await Region.findAndCountAll({
      where: { "$country.name$": { [Op.in]: name } },
      include: [Country],
    });
    res.status(200).json(data);
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};

const getAllRegions = async (req, res) => {
  try {
    const data = await Region.findAndCountAll({
      include: [Country],
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
        "$country.name$": {
          [Op.like]: "%" + st + "%",
        },
      },
    ],
  };
};

//posting
const createRegion = async (req, res) => {
  const regionBody = req.body;
  try {
    // if (!(await canUserCreate(req.user, "regions"))) {
    //   return res.status(401).json({ msg: "unauthorized access!" });
    // }
    const duplicateName = await Region.findAll({
      where: { name: regionBody.name },
    });
    if (duplicateName.length > 0) {
      res.status(400).json({ msg: "Region already registered!" });
      return;
    }
    const region = await Region.create(regionBody);
    if (region) {
      await createEventLog(
        req.user.id,
        eventResourceTypes.region,
        `${region.name}`,
        region.id,
        eventActions.create,
        "",
        getIpAddress(req.ip)
      );
    }
    res.status(200).json(region);
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};

const createRegions = async (req, res) => {
  const regionBody = req.body;
  var addedList = 0;
  var duplicate = [];
  var countryNotFound = [];
  var incorrect = [];
  var lineNumber = 2;
  try {
    // if (!(await canUserCreate(req.user, "regions"))) {
    //   return res.status(401).json({ msg: "unauthorized access!" });
    // }
    let promises = await regionBody.map(async (region) => {

      const duplicateName = await Region.findAll({
        where: { name: region.name },
      }).then(async (duplicateName) => {
        const foundCountry = await Country.findOne({
          where: { name: region.country },
        })
        if (duplicateName.length > 0) {
          duplicate.push(lineNumber);

        } else if (foundCountry == null) {
          countryNotFound.push(lineNumber);
        } else {
          try {
            region.countryId = foundCountry.id;
            const regions = await Region.create(region);
            addedList += 1;
          } catch (error) {
            incorrect.push(lineNumber);
          }
        }
      })
      lineNumber = lineNumber + 1;

    });
    Promise.all(promises).then(function (results) {
      let msg = "";
      if (addedList != 0) {
        msg = msg + `${addedList} regions added`;
        
      }
      if (duplicate != 0) {
        msg = msg + ` duplicate value found on line ${duplicate} \n`;
      }
      if (countryNotFound != 0) {
        msg =
          msg +
          ` Line ${countryNotFound} rejected because country is not found`;
      }
      if (incorrect.length != 0) {
        msg = msg + ` line ${incorrect} has incorrect values`;
      }
      if (
        countryNotFound.length != 0 ||
        duplicate.length != 0 ||
        incorrect.length
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
const editRegion = async (req, res) => {
  const reqBody = req.body;
  const id = req.params.id;

  try {
    // if (!(await canUserEdit(req.user, "regions"))) {
    //   return res.status(401).json({ msg: "unauthorized access!" });
    // }
    const duplicateName = await Region.findAll({
      where: { name: reqBody.name },
    });
    
    if (duplicateName.length !== 0) {
      if (duplicateName[0].id !== reqBody.id) {
        res.status(400).json({ msg: "Region already added" });
        return;
      }
    }
    let oldRegion = await Region.findByPk(id, {});
    let updated = await Region.update(reqBody, { where: { id: id } });

    if (updated) {
      let newRegion = await Region.findByPk(id, {});
      let changedFieldValues = getChangedFieldValues(oldRegion, newRegion)
      await createEventLog(
        req.user.id,
        eventResourceTypes.region,
        `${oldRegion.name}`,
        newRegion.id,
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

const deleteRegion = async (req, res) => {
  const id = req.params.id;

  try {
    // if (!(await canUserDelete(req.user, "regions"))) {
    //   return res.status(401).json({ msg: "unauthorized access!" });
    // }
    let region = await Region.findByPk(id, {});
    let deleted = await Region.destroy({ where: { id: id } });
    if (deleted) {
      await createEventLog(
        req.user.id,
        eventResourceTypes.region,
        `${region.name}`,
        region.id,
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
  getRegion,
  getRegionByPk,
  getRegionsByCountry,
  createRegion,
  editRegion,
  deleteRegion,
  getRegionsByCountries,
  getAllRegions,
  createRegions,
};
