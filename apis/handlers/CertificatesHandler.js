const { Op } = require("sequelize");

const Certificate = require("../../models/Certificate");

const getSearch = (st) => {
  return {
    [Op.or]: [
      { name: { [Op.like]: `%${st}%` } },
      { description: { [Op.like]: `%${st}%` } },
      { shortName: { [Op.like]: `%${st}%` } },
    ],
  };
};

const getCertificates = async (req, res) => {
  
  //queryparams:  { f: '0', r: '7', st: '', sc: 'first_name', sd: '1' }
  const { f, r, st, sc, sd } = req.query;
  try {
    const data = await Certificate.findAndCountAll({
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
const createCertificate = async (req, res) => {
  
  const reqBody = req.body;
  try {
    const certificate = await Certificate.create(reqBody);
    res.status(200).json(certificate);
  } catch (error) {
    
  }
};

const getCertificate = async (req, res) => {
  try {
    const certificate = await Certificate.findByPk(req.params.id).then(
      function (certificate) {
        if (!certificate) {
          res.status(404).json({ message: "No Data Found" });
        }
        res.status(200).json(certificate);
      }
    );

    res.status(200).json(certificate);
  } catch (error) {
    res.status(404).json({ msg: error.message });
  }
};

const editCertificate = async (req, res) => {
  const reqBody = req.body;
  const id = req.params.id;

  try {
    Certificate.update(
      reqBody,

      { where: { id: id } }
    );

    res.status(200).json({ id });
  } catch (error) {
    
    res.status(404).json({ msg: error.message });
  }
};

const deleteCertificate = async (req, res) => {
  const id = req.params.id;
  try {
    Certificate.destroy({ where: { id: id } });

    res.status(200).json({ id });
  } catch (error) {
    res.status(404).json({ msg: error.message });
  }
};

module.exports = {
  getCertificates,
  createCertificate,
  getCertificate,
  editCertificate,
  deleteCertificate,
};
