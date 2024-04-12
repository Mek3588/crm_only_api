
const { Op } = require("sequelize");
const { duration } = require("moment");
var fs = require("fs");
const { log } = require("console");
const { canUserRead, 
  canUserDelete, 
  canUserAccessOnlyBranch } = require("../../middlewares/authorization.js");
const Customer = require("../../../models/customer/Customer.js");
const FireClaimUnderwritingVerification = require("../../../models/fire/claim/FireClaimUnderwritingVerification.js");
const FireClaimNotification = require("../../../models/fire/claim/FireClaimNotification.js");

const getSearch = (st) => {
  return {
    [Op.or]: [
      { insured: { [Op.like]: `%${st}%` } },
      { coverType: { [Op.like]: `%${st}%` } },
      { policyNumber: { [Op.like]: `%${st}%` } },
      { deductable: { [Op.like]: `%${st}%` } },
      { fireClaimVerificationId: { [Op.like]: `%${st}%` } },
      { remark: { [Op.like]: `%${st}%` } },
      { duration: { [Op.like]: `%${st}%` } },
      { sumInsured: { [Op.like]: `%${st}%` } },
      { fornow: { [Op.like]: `%${st}%` } },
    ],
  };

};

const getFireClaimUnderwritingVerification = async (req, res) => {
  const { f, r, st, sc, sd } = req.query;
  

      try {
          const verificationdata = await FireClaimUnderwritingVerification.findAndCountAll({
            offset: Number(f),
          limit: Number(r),
          order: [[sc || "createdAt", sd == 1 ? "DESC" : "ASC"]],
          where: getSearch(st),
           
          });
          
          res.status(200).json(verificationdata);
      } catch (error) {
          
          res.status(400).json({ msg: error.message });
          
      }
};

//posting
const createFireClaimUnderwritingVerification = async (req, res) => {
     const fireClaimBody = req.body;
    
    
   
    try {
      if (!fireClaimBody.fireClaimVerificationId) {
        return res.status(404).json({ msg: "undefiend clam" });
      } 
      const fireClaimUnderwritingVerification = await FireClaimUnderwritingVerification.create(

        {
        policyNumber: fireClaimBody.policyNumber,
        insured: fireClaimBody.insured,
        duration: fireClaimBody.duration,
        AccidentDate: fireClaimBody.AccidentDate,
        claimNumber: fireClaimBody.claimNumber,
        sumInsured: fireClaimBody.sumInsured,
        remark: fireClaimBody.remark,
        coverType: fireClaimBody.coverType,
        deductable: fireClaimBody.deductable,
        fornow: fireClaimBody.fornow,
        fireClaimVerificationId: fireClaimBody.fireClaimVerificationId

      },
      )
      

      res.status(200).json(fireClaimUnderwritingVerification);
    } catch (error) {
      
      res.status(400).json({ msg: error.message });
    }

  };


const getFireClaimUnderwritingVerificationByPk = async (req, res) => {
  const id = req.params.id;
  
        try {
            const data = await FireClaimUnderwritingVerification.findByPk(id, {
                where: { id: id },
            });
            
            res.status(200).json(data);
        } catch (error) {
            
            res.status(400).json({ msg: error.message });
            
        }
};

const editFireClaimUnderwritingVerification = async (req, res) => {
  const verificationBody = req.body;
    const id = req.params.id;
    try {
        
        FireClaimUnderwritingVerification.update(
            verificationBody,
            { where: { id: verificationBody.id } }
        );
        res.status(200).json({ id });
    } catch (error) {
        res.status(404).json({ msg: error.message });
    }
};

const deleteFireClaimUnderwritingVerification = async (req, res) => {
  const id = req.params.id;
  try {
    if (!(await canUserDelete(req.user, "fire verification"))) {
      return res.status(401).json({ msg: "unauthorized access!" });
    }
    FireClaimUnderwritingVerification.destroy({ where: { id: id } });
    res.status(200).json({ id });
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};




module.exports = {
  getFireClaimUnderwritingVerification,
  createFireClaimUnderwritingVerification,
  // getAllFireQuotations,
  editFireClaimUnderwritingVerification,
  deleteFireClaimUnderwritingVerification,
  getFireClaimUnderwritingVerificationByPk,

};