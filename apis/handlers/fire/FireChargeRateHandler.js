const FireChargeRate = require("../../../models/fire/FireChargeRate");

const getFireChargeRate = async (req, res) => {
  try {
    const data = await FireChargeRate.findAll({ raw: true });
    res.status(200).json(data);
  } catch (error) {
     res.status(400).json({ msg: error.message });
  }
};

//posting
const createFireChargeRate = async (req, res) => {
    
  const body = req.body
  try {
    const fireChargeRate = await FireChargeRate.create(body);
    res.status(200).json(fireChargeRate);
  } catch (error) {
     res.status(400).json({ msg: error.message });
  }
};

const getFireChargeRateByPk = async (req, res) => {
  try {
    const fireChargeRate = await FireChargeRate.findByPk(req.params.id).then(function (
      FireChargeRate
    ) {
      if (!FireChargeRate) {
        res.status(400).json({ message: "No Data Found" });
      }
      res.status(200).json(FireChargeRate);
    });

    res.status(200).json(fireChargeRate);
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};

const editFireChargeRate = async (req , res) => {
   const fireChargeRate = req.body
   const id = req.body.id

  try {
    
    FireChargeRate.update(
     fireChargeRate,

      { where: { id: id } }
    );
    
    res.status(200).json({ id });
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};

const deleteFireChargeRate = async (req, res) => {
  const  id  = req.params.id;

  try {
    FireChargeRate.destroy({ where: { id: id } });

    res.status(200).json({ id });
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};

module.exports = {
  getFireChargeRate,
  createFireChargeRate,
  getFireChargeRateByPk,
  editFireChargeRate,
  deleteFireChargeRate,
};
