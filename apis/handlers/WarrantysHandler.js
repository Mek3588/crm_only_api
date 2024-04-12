const { Op } = require("sequelize");

const Warranty = require("../../models/Warranty");

const getSearch = (st) => {
  return {
    [Op.or]: [
      { name: { [Op.like]: `%${st}%` } },
      { description: { [Op.like]: `%${st}%` } },
      { shortName: { [Op.like]: `%${st}%` } },
    ],
  };
};

const getWarrantys = async (req, res) => {
  
//   queryparams:  { f: '0', r: '7', st: '', sc: 'first_name', sd: '1' }
  const { f, r, st, sc, sd } = req.query;
  try {
    const data = await Warranty.findAndCountAll({
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
const createWarranty = async (req, res) => {
  
  const reqBody = req.body;
  try {
    const warranty = await Warranty.create(reqBody);
    res.status(200).json(warranty);
  } catch (error) {
    
  }
};

const getWarranty = async (req, res) => {
  try {
    const warranty = await Warranty.findByPk(req.params.id).then(
      function (warranty) {
        if (!warranty) {
          res.status(404).json({ message: "No Data Found" });
        }
        res.status(200).json(warranty);
      }
    );

    res.status(200).json(warranty);
  } catch (error) {
    res.status(404).json({ msg: error.message });
  }
};

const editWarranty = async (req, res) => {
  const reqBody = req.body;
  const id = req.body.id;

  try {
    Warranty.update(
      reqBody,

      { where: { id: id } }
    );

    res.status(200).json({ id });
  } catch (error) {
    
    res.status(404).json({ msg: error.message });
  }
};

const deleteWarranty = async (req, res) => {
  const id = req.params.id;
  try {
    Warranty.destroy({ where: { id: id } });

    res.status(200).json({ id });
  } catch (error) {
    res.status(404).json({ msg: error.message });
  }
};

module.exports = {
  getWarrantys,
  createWarranty,
  getWarranty,
  editWarranty,
  deleteWarranty,
};
