const { Op } = require("sequelize");

const Declaration = require("../../models/Declaration");

const getSearch = (st) => {
  return {
    [Op.or]: [
      { name: { [Op.like]: `%${st}%` } },
      { description: { [Op.like]: `%${st}%` } },
    ],
  };
};

const getDeclarations = async (req, res) => {
  
  //queryparams:  { f: '0', r: '7', st: '', sc: 'first_name', sd: '1' }
  const { f, r, st, sc, sd } = req.query;
  try {
    const data = await Declaration.findAndCountAll({
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
const createDeclaration = async (req, res) => {
  
  const reqBody = req.body;
  try {
    const agreement = await Declaration.create(reqBody);
    res.status(200).json(agreement);
  } catch (error) {
    
  }
};

const getDeclaration = async (req, res) => {
  try {
    const agreement = await Declaration.findByPk(req.params.id).then(
      function (agreement) {
        if (!agreement) {
          res.status(404).json({ message: "No Data Found" });
        }
        res.status(200).json(agreement);
      }
    );

    res.status(200).json(agreement);
  } catch (error) {
    res.status(404).json({ msg: error.message });
  }
};

const editDeclaration = async (req, res) => {
  const reqBody = req.body;
  const id = req.params.id;

  try {
    Declaration.update(
      reqBody,

      { where: { id: id } }
    );

    res.status(200).json({ id });
  } catch (error) {
    
    res.status(404).json({ msg: error.message });
  }
};

const deleteDeclaration = async (req, res) => {
  const id = req.params.id;
  try {
    Declaration.destroy({ where: { id: id } });

    res.status(200).json({ id });
  } catch (error) {
    res.status(404).json({ msg: error.message });
  }
};

module.exports = {
  getDeclarations,
  createDeclaration,
  getDeclaration,
  editDeclaration,
  deleteDeclaration,
};
