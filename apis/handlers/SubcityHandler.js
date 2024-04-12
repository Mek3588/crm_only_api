const Subcity = require("../../models/Subcity");
const City = require("../../models/City");
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
const getSubcity = async (req, res) => {
  try {
    const { f, r, st, sc, sd } = req.query;
    const data = await Subcity.findAndCountAll({
      include: [City],
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

const getSubcityByPk = async (req, res) => {
  try {
    const subcity = await Subcity.findByPk(req.params.id).then(function (
      subcity
    ) {
      if (!subcity) {
        res.status(404).json({ message: "No Data Found" });
      } else {
        res.status(200).json(subcity);
      }
    });
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};

const getSubcityByCity = async (req, res) => {
  const { name } = req.params;
  try {
    const data = await Subcity.findAndCountAll({
      where: { "$city.name$": name },
      include: [City],
    });
    res.status(200).json(data);
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};

const getSubcityByCities = async (req, res) => {
  const name = req.body;
  try {
    const data = await Subcity.findAndCountAll({
      where: { "$city.name$": { [Op.in]: name } },
      include: [City],
    });
    res.status(200).json(data);
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};

const getAllSubcitys = async (req, res) => {
  try {
    const data = await Subcity.findAndCountAll({
      include: [City],
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
        "$city.name$": {
          [Op.like]: "%" + st + "%",
        },
      },
    ],
  };
};

//posting
const createSubcity = async (req, res) => {
  const subcityBody = req.body;
  try {
    // if (!(await canUserCreate(req.user, "subcitys"))) {
    //   return res.status(401).json({ msg: "unauthorized access!" });
    // }
    const duplicateName = await Subcity.findAll({
      where: { name: subcityBody.name },
    });
    if (duplicateName.length > 0) {
      let sameCity = false;
      duplicateName.map((element) => {
        if (subcityBody.cityId == element.cityId) {
          sameCity = true;
        }
      });
      if (sameCity) {
        res.status(400).json({ msg: "Subcity already registered!" });
        return;
      }
    }
    const subcity = await Subcity.create(subcityBody);
    if (subcity) {
      await createEventLog(
        req.user.id,
        eventResourceTypes.subcity,
        `${subcity.name}`,
        subcity.id,
        eventActions.create,
        "",
        getIpAddress(req.ip)
      );
    }
    res.status(200).json(subcity);
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};

//put
const editSubcity = async (req, res) => {
  const reqBody = req.body;
  const id = req.params.id;

  try {
    // if (!(await canUserEdit(req.user, "subcitys"))) {
    //   return res.status(401).json({ msg: "unauthorized access!" });
    // }
    const duplicateName = await Subcity.findAll({
      where: { name: reqBody.name },
    });
    if (duplicateName.length > 0) {
      let sameCity = false;
      duplicateName.map((element) => {
        if (reqBody.cityId == element.cityId && reqBody.id !== element.id) {
          sameCity = true;
        }
      });
      if (sameCity) {
        res.status(400).json({ msg: "Subcity already registered!" });
        return;
      }
    }
    let oldSubcity = await Subcity.findByPk(id, {});
    let updated = await Subcity.update(reqBody, { where: { id: id } });

    if (updated) {
      let newSubcity = await Subcity.findByPk(id, {});
      let changedFieldValues = getChangedFieldValues(oldSubcity, newSubcity)
      await createEventLog(
        req.user.id,
        eventResourceTypes.region,
        `${oldSubcity.name}`,
        newSubcity.id,
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

const deleteSubcity = async (req, res) => {
  const id = req.params.id;

  try {
    // if (!(await canUserDelete(req.user, "subcitys"))) {
    //   return res.status(401).json({ msg: "unauthorized access!" });
    // }
    let subcity = await Subcity.findByPk(id, {});
    let deleted = await Subcity.destroy({ where: { id: id } });
    if (deleted) {
      await createEventLog(
        req.user.id,
        eventResourceTypes.subcity,
        `${subcity.name}`,
        subcity.id,
        eventActions.delete,
        "",
        getIpAddress(req.ip)
      );
    } res.status(200).json({ id });
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};

const createSubcities = async (req, res) => {
  const cityBody = req.body;
  var addedList = 0;
  var duplicate = [];
  var countryNotFound = [];
  var incorrect = [];

  var lineNumber = 2;

  try {
    // if (!(await canUserCreate(req.user, "citys"))) {
    //   return res.status(401).json({ msg: "unauthorized access!" });
    // }
    let promises = await cityBody.map(async (subcity) => {
      const duplicateName = await Subcity.findAll({
        where: { name: subcity.name },
      });
      
      const foundCity = await City.findOne({
        where: { name: subcity.city },
      });
      if (duplicateName.length > 0) {
        
        duplicate.push(lineNumber);
      } else if (foundCity == null) {
        countryNotFound.push(lineNumber);
      } else {
        try {
          subcity.cityId = foundCity.id;
          const cities = await Subcity.create(subcity);
          addedList += 1;
        } catch (error) {
          incorrect.push(lineNumber);
          res.status(400).json({ msg: error.message });
        }
      }
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
          ` Line ${countryNotFound} rejected because city is not found`;
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

module.exports = {
  getSubcity,
  getSubcityByPk,
  getSubcityByCity,
  createSubcity,
  editSubcity,
  deleteSubcity,
  getSubcityByCities,
  getAllSubcitys,
  createSubcities,
};
