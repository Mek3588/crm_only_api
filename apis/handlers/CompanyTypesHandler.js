const CompanyType = require("../../models/CompanyType");

const getCompanyTypes = async (req, res) => {
  try {
    const data = await CompanyType.findAll({ raw: true });
    res.status(200).json(data);
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};

//posting
const createCompanyType = async (req, res) => {
  const { name, description } =
    req.body;
  try {
    const branch = await CompanyType.create({
      name,
      description
    });
    res.status(200).json(branch);
  } catch (error) {
    res.status(404).json({ msg: error.message });
  }
};

const getCompanyType = async (req, res) => {
  try {
    const branch = await CompanyType.findByPk(req.params.id).then(function (branch) {
      if (!branch) {
        res.status(404).json({ message: "No Data Found" });
      }
      res.status(200).json(branch);
    });

    res.status(200).json(branch);
  } catch (error) {
    res.status(404).json({ msg: error.message });
  }
};

const editCompanyType = async (req, res) => {
  const { id, name, description, } =
    req.body;

  try {
    CompanyType.update(
      {
      name,
      description,
      },

      { where: { id: id } }
    );

    res.status(200).json({ id });
  } catch (error) {
    res.status(404).json({ msg: error.message });
  }
};

const deleteCompanyType = async (req, res) => {
  const  id  = req.params.id;
  try {
    CompanyType.destroy({ where: { id: id } });

    res.status(200).json({ id });
  } catch (error) {
    res.status(404).json({ msg: error.message });
  }
};

module.exports = {
  getCompanyType,
  createCompanyType,
  getCompanyTypes,
  editCompanyType,
  deleteCompanyType,
};
