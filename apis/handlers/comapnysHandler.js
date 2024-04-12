const Company = require("../../models/Company");

const getCompanys = async (req, res) => {
  const {type} = req.params
  try {
    const data = await Company.findAll({where: {type}});
    res.status(200).json(data);
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};

//posting
const createCompany = async (req, res) => {
  try {
    const newCompany = await Company.create({
      ...req.body,
    });
    res.status(200).json(newCompany);
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};

const createCompanies = async (req, res) => {
  const companyBody = req.body;
  try {
    companyBody.map(async (company) => {
        await Company.create(company);
    });
    res.status(200).json(companyBody);
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};


const getCompany = async (req, res) => {
  try {
    const emails = await Company.findAll({});
    res.status(200).json(emails);
  } catch (error) {
    res.status(404).json({ msg: error.message });
  }
};

const editCompany = async (req, res) => {
    
  const { companyId } = req.params;
  const { id, createdAt, updatedAt, ...others } = req.body;
  
  try {
    await Company.update(
      {
        ...others,
      },

      { where: { id: companyId } }
    );

    res.status(200).json({ id });
  } catch (error) {
    res.status(404).json({ msg: error.message });
  }
};

const deleteCompany = async (req, res) => {
  const { id } = req.params;
  try {
    Company.destroy({ where: { id: id } });
    res.status(200).json({ id });
  } catch (error) {
    res.status(404).json({ msg: error.message });
  }
};



module.exports = {
  getCompanys,
  createCompany,
  createCompanies,
  getCompany,
  editCompany,
  deleteCompany,
};
