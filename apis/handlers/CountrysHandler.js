const Country = require("../../models/Country");
const { Op } = require("sequelize");
const {
  canUserCreate,
  canUserEdit,
  canUserDelete,
} = require("../../utils/Authrizations");
const { eventResourceTypes, eventActions } = require("../../utils/constants");
const {
  createEventLog,
  getChangedFieldValues,
  getIpAddress,
} = require("../../utils/GeneralUtils");

const getSearch = (st) => {
  return {
    [Op.or]: [
      { name: { [Op.like]: `%${st}%` } },
      { shortCode: { [Op.like]: `%${st}%` } },
      { description: { [Op.like]: `%${st}%` } },
    ],
  };
};

const getCountry = async (req, res) => {
  const { f, r, st, sc, sd } = req.query;
  try {
    const data = await Country.findAndCountAll({
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

const getAllCountrys = async (req, res) => {
  try {
    const data = await Country.findAndCountAll();
    res.status(200).json(data);
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};

//posting
const createCountry = async (req, res) => {
  const countryBody = req.body;
  try {
    if (!(await canUserCreate(req.user, "countrys"))) {
      return res.status(401).json({ msg: "unauthorized access!" });
    }
    const duplicateCountryName = await Country.findAll({
      where: { name: countryBody.name },
    });
    if (duplicateCountryName.length > 0) {
      res.status(400).json({ msg: "Country already registered!" });
      return;
    }
    const country = await Country.create(countryBody);
    if (country) {
      await createEventLog(
        req.user.id,
        eventResourceTypes.country,
        `${country.name}`,
        country.id,
        eventActions.create,
        "",
        getIpAddress(req.ip)
      );
    }
    res.status(200).json(country);
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};

const createCountrys = async (req, res) => {
  const countryBody = req.body;
  const country = [];
  var duplicate = [];
  var incorrect = [];
  var lineNumber = 2;
  try {
    if (!(await canUserCreate(req.user, "countrys"))) {
      return res.status(401).json({ msg: "unauthorized access!" });
    }

    var promises = countryBody.map(async (element) => {
      const duplicateName = await Country.findAll({
        where: { name: element.name },
      });
      if (duplicateName.length > 0) {
        duplicate.push(lineNumber);
      } else if (duplicateName.length == 0) {
        // country.push(await Country.create(element));
        try {
          await Country.create(element);
          addedCountrys += 1;
        } catch (error) {
          incorrect.push(lineNumber);
        }
      }
      lineNumber = lineNumber + 1;
    });
    Promise.all(promises).then(function (results) {
      let msg = "";
      if (addedCountrys != 0) {
        msg = msg + `${addedCountrys} countries added`;
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
    // const country = await Country.create(countryBody);
    // res.status(200).json(country);
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};

const getCountryByPk = async (req, res) => {
  try {
    const country = await Country.findByPk(req.params.id).then(function (
      country
    ) {
      if (!country) {
        res.status(404).json({ message: "No Data Found" });
      }
      res.status(200).json(country);
    });

    res.status(200).json(country);
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};

const getCountryByName = async (req, res) => {
  try {
    

    const country = await Country.findOne({ where: { name: req.params.name } });
    
    res.status(200).json(country.id);
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};

const editCountry = async (req, res) => {
  const reqBody = req.body;
  const id = req.params.id;

  try {
    if (!(await canUserEdit(req.user, "countrys"))) {
      return res.status(401).json({ msg: "unauthorized access!" });
    }
    const duplicateCountryName = await Country.findAll({
      where: { name: reqBody.name },
    });
    if (duplicateCountryName.length !== 0)
      if (duplicateCountryName[0].id !== reqBody.id) {
        res.status(400).json({ msg: "Country already registered!" });
        return;
      }
    let oldCountry = await Country.findByPk(id, {});
    let updated = await Country.update(reqBody, { where: { id: id } });

    if (updated) {
      let newCountry = await Country.findByPk(id, {});
      let changedFieldValues = getChangedFieldValues(oldCountry, newCountry)
      await createEventLog(
        req.user.id,
        eventResourceTypes.country,
        `${oldCountry.name}`,
        newCountry.id,
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

const deleteCountry = async (req, res) => {
  const id = req.params.id;

  try {
    if (!(await canUserDelete(req.user, "countrys"))) {
      return res.status(401).json({ msg: "unauthorized access!" });
    }
    let country = await Country.findByPk(id, {});
    let deleted = await Country.destroy({ where: { id: id } });
    if (deleted) {
      await createEventLog(
        req.user.id,
        eventResourceTypes.country,
        `${country.name}`,
        country.id,
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
  getCountry,
  getAllCountrys,
  createCountry,
  createCountrys,
  getCountryByPk,
  editCountry,
  deleteCountry,
  getCountryByName,
};
