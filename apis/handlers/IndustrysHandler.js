const Industry = require("../../models/Industry");
const { Op } = require("sequelize");

const getSearch = (st) => {
  return {
    [Op.or]: [
      { code: { [Op.like]: `%${st}%` } },
      { name: { [Op.like]: `%${st}%` } },
      { description: { [Op.like]: `%${st}%` } },
    ],
  };
};

const getIndustry = async (req, res) => {
  

  const { f, r, st, sc, sd } = req.query;
  try {
    const data = await Industry.findAndCountAll({
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

const getAllIndustrys = async (req, res) => {
  try {
    const data = await Industry.findAndCountAll();
    res.status(200).json(data);
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};

//posting
const createIndustry = async (req, res) => {
  const industryBody = req.body;
  try {
    const registeredIndustry = await Industry.findOne({
      where: {
        [Op.or]: [
          { name: { [Op.like]: industryBody.name } },
          { code: { [Op.like]: industryBody.code } },
        ],
      },
    });
    if (registeredIndustry == null) {
      const industry = await Industry.create(industryBody);
      res.status(200).json(industry);
    } else {
      res.status(400).json({ msg: "Industry Exists" });
    }
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};

const createIndustrys = async (req, res) => {
  const industryBody = req.body;
  var addedList = 0;
  var duplicate = [];
  var incorrect = [];
  var lineNumber = 2;
  
  try {
    let promises = await industryBody.map(async (industry) => {
      let addedIndustries = await Industry.findOne({
        where: {
          [Op.or]: [
            { name: { [Op.like]: industry.name } },
            { code: { [Op.like]: industry.code } },
          ],
        },
      });

      if (addedIndustries == null) {
        try {
          let newIndustry = await Industry.create(industry).then((e) => {
            addedList += 1;
          });
        } catch (error) {
          incorrect.push(lineNumber);
        }
      } else {
        duplicate.push(lineNumber);
      }
      lineNumber = lineNumber + 1;
    });
    Promise.all(promises).then(function (results) {
      let msg = "";
      if (addedList != 0) {
        msg = msg + `${addedList} industries added`;
      }
      if (duplicate != 0) {
        msg = msg + ` ${duplicate} duplicate found`;
      }
      if (incorrect.length != 0) {
        msg = msg + ` line ${incorrect} has incorrect values \n`;
      }
      if (duplicate.length != 0 || incorrect.length != 0) {
        res.status(400).json({ msg: msg });
      } else {
        res.status(200).json({ msg: msg });
      }
    });
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};

const getIndustryByPk = async (req, res) => {
  try {
    const industry = await Industry.findByPk(req.params.id).then(function (
      industry
    ) {
      if (!industry) {
        res.status(404).json({ message: "No Data Found" });
      }
      res.status(200).json(industry);
    });

    res.status(200).json(industry);
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};

const editIndustry = async (req, res) => {
  const reqBody = req.body;
  const id = req.params.id;

  try {
    
    await Industry.update(
      reqBody,

      { where: { id: id } }
    );

    res.status(200).json({ id });
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};

const deleteIndustry = async (req, res) => {
  const id = req.params.id;

  try {
    await Industry.destroy({ where: { id: id } });

    res.status(200).json({ id });
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};

module.exports = {
  getIndustry,
  getAllIndustrys,
  createIndustry,
  createIndustrys,
  getIndustryByPk,
  editIndustry,
  deleteIndustry,
};
