const InsuranceCategory = require("../../models/insuranceCategory");
const RiskType = require("../../models/RiskType");

const getInsuranceCategory = async (req, res) => {
  try {
    const data = await InsuranceCategory.findAll({ include: RiskType });
    res.status(200).json(data);
  } catch (error) {
     res.status(400).json({ msg: error.message }); 
  }
};
 
//posting
const createInsuranceCategory = async (req, res) => {
  const chargeRateBody = req.body
  try {
    const riskType = await InsuranceCategory.create(chargeRateBody,{ include: RiskType });
    res.status(200).json(riskType);
  } catch (error) {
     res.status(400).json({ msg: error.message });
  } 
};

const getInsuranceCategoryByPk = async (req, res) => {
   const params = req.params.id
  try {
    const riskType = await InsuranceCategory.findByPk(params,{ include: RiskType }).then(function (
      InsuranceCategory
    ) {
      if (!InsuranceCategory) {
        res.status(400).json({ message: "No Data Found" });
      }
      res.status(200).json(InsuranceCategory);
    });

    res.status(200).json(chargeRate);
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};

const editInsuranceCategory = async (req , res) => {
   const body = req.body
   const id = req.params.id
 var filter = {
  include:[{ model:RiskType }],
  where: {id: id},
 }
 try {
  InsuranceCategory.findByPk(id).then((insuranceCategory) => {
        if(!insuranceCategory) {
            res.status(400).json({ message: "No Data Found" });
        };
        // InsuranceCategory.update(body,{where: {id:id}});
        
        
        RiskType.update(body.RiskType, {where:{id: body.risk_types}});
        res.status(200).json({ id }
        )  
    })


// InsuranceCategory.findByPk(id,{ include: RiskType }).then(function (insuranceCategory) {
//   if (insuranceCategory) {
//       insuranceCategory.RiskType.updateAttributes(body).then(function (result) {
//       res.status(200).json(result); 
//     });
//   } else {
//       res.status(404).json({ message: "No Data Found" });
//   }
// })  

    // InsuranceCategory.update(
    //   body,
    //   filter

    // );
    
    //  res.status(200).json({ id });  
 }
 catch (error) {
    res.status(400).json({ msg: error.message });
  }
};

const deleteInsuranceCategory = async (req, res) => {
  const  id  = req.params.id;

  try {
    InsuranceCategory.destroy({ where: { id: id } });

    res.status(200).json({ id });
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};

module.exports = {
  getInsuranceCategory,
  createInsuranceCategory,
  getInsuranceCategoryByPk,
  editInsuranceCategory,
  deleteInsuranceCategory,
};
