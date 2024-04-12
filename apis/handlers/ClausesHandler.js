const { Op } = require("sequelize");

const Clause = require("../../models/Clause");

const getSearch = (st) => {
  return {
    [Op.or]: [
      { name: { [Op.like]: `%${st}%` } },
      { description: { [Op.like]: `%${st}%` } },
    ],
  };
};

const getClauses = async (req, res) => {
  
  //queryparams:  { f: '0', r: '7', st: '', sc: 'first_name', sd: '1' }
  const { f, r, st, sc, sd } = req.query;
  try {
    const data = await Clause.findAndCountAll({
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

//posting
const createClause = async (req, res) => {
  
  const reqBody = req.body;
  try {
    const clause = await Clause.create(reqBody);
    res.status(200).json(clause);
  } catch (error) {
    
  }
};

const getClause = async (req, res) => {
  try {
    const clause = await Clause.findByPk(req.params.id).then(
      function (clause) {
        if (!clause) {
          res.status(404).json({ message: "No Data Found" });
        }
        res.status(200).json(clause);
      }
    );

    res.status(200).json(clause);
  } catch (error) {
    res.status(404).json({ msg: error.message });
  }
};

const editClause = async (req, res) => {
  const reqBody = req.body;
  const id = req.params.id;

  try {
    Clause.update(
      reqBody,

      { where: { id: id } }
    );

    res.status(200).json({ id });
  } catch (error) {
    
    res.status(404).json({ msg: error.message });
  }
};

const deleteClause = async (req, res) => {
  const id = req.params.id;
  try {
    Clause.destroy({ where: { id: id } });

    res.status(200).json({ id });
  } catch (error) {
    res.status(404).json({ msg: error.message });
  }
};

module.exports = {
  getClauses,
  createClause,
  getClause,
  editClause,
  deleteClause,
};
