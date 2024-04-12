const RiskType = require("../../models/RiskType");

const getRiskType = async (req, res) => {
  try {
    const data = await RiskType.findAll({ raw: true });
    res.status(200).json(data);
  } catch (error) {
     res.status(400).json({ msg: error.message });
  }
}; 

//posting
const createRiskType = async (req, res) => {
  const riskTypeBody = req.body
  try {
    const riskType = await RiskType.create(riskTypeBody);
    res.status(200).json(riskType);
  } catch (error) {
     res.status(400).json({ msg: error.message });
  }
}; 

const getRiskTypeByPk = async (req, res) => {
  try {
    const riskType = await RiskType.findByPk(req.params.id).then(function (
      RiskType
    ) {
      if (!RiskType) {
        res.status(400).json({ message: "No Data Found" });
      }
      else {
        res.status(200).json(RiskType);
      }
    });

   
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};

const editRiskType = async (req , res) => {
   const riskType = req.body
   const id = req.params.id

  try {
    
    RiskType.update(
     riskType,

      { where: { id: id } }
    );
    
    res.status(200).json({ id });
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};

const deleteRiskType = async (req, res) => {
  const  id  = req.params.id;

  try {
    RiskType.destroy({ where: { id: id } });

    res.status(200).json({ id });
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};

module.exports = {
  getRiskType,
  createRiskType,
  getRiskTypeByPk,
  editRiskType,
  deleteRiskType,
};
