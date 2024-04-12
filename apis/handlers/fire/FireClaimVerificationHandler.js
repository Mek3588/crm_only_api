
const { Op } = require("sequelize");
const {
  eventResourceTypes,
  eventActions,
  Role,
} = require("../../../utils/constants");
const { duration } = require("moment");
const Contact = require("../../../models/Contact");
const Employee = require("../../../models/Employee");
const Opportunity = require("../../../models/Opportunity");
const User = require("../../../models/acl/user");
const Branch = require("../../../models/Branch");
var fs = require("fs");
var path = require("path");
const { log } = require("console");
const { canUserRead, 
  canUserDelete, 
  canUserAccessOnlyBranch } = require("../../middlewares/authorization.js");
const Customer = require("../../../models/customer/Customer.js");
const FireClaimVerification = require("../../../models/fire/claim/FireClaimVerification.js");
const FireClaimNotification = require("../../../models/fire/claim/FireClaimNotification.js");

const getSearch = (st) => {
  return {
    [Op.or]: [
      { insured: { [Op.like]: `%${st}%` } },
      { lossNature: { [Op.like]: `%${st}%` } },
      { policyNumber: { [Op.like]: `%${st}%` } },
      { claimNumber: { [Op.like]: `%${st}%` } },
      { customerId: { [Op.like]: `%${st}%` } },
      { fireClaimNotificationId: { [Op.like]: `%${st}%` } },
      { AccidentDate: { [Op.like]: `%${st}%` } },
    ],
  };

};

const getFireClaimVerification = async (req, res) => {
  const { f, r, st, sc, sd } = req.query;
  
  
      try {
          const verificationdata = await FireClaimVerification.findAndCountAll({
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
const createFireClaimVerification = async (req, res) => {
     const fireClaimBody = req.body;
    
    
    try {
      const ClaimNotification = await FireClaimNotification.findOne({
        where: {
          claimNumber: fireClaimBody.claimNumber,
        },
      });
      
      if (!ClaimNotification) {
        return res.status(404).json({ msg: "claim notification not found with the given data" });
      } else if(ClaimNotification.policyNumber != fireClaimBody.policyNumber)
      {
        return res.status(404).json({ msg: "incorrect Policy number!" });
      }

      const fireClaimVerification = await FireClaimVerification.create(

        {
        policyNumber: fireClaimBody.policyNumber,
        insured: fireClaimBody.insured,
        lossNature: fireClaimBody.lossNature,
        AccidentDate: fireClaimBody.AccidentDate,
        claimNumber: fireClaimBody.claimNumber,
        fireClaimNotificationId: fireClaimBody.fireClaimNotificationId? fireClaimBody.fireClaimNotificationId : ClaimNotification.id

      },
      )
      
      
      res.status(200).json(fireClaimVerification);
    } catch (error) {
      
      res.status(400).json({ msg: error.message });
    }
  };

   

const getFireClaimVerificationByPk = async (req, res) => {
  const id = req.params.id;
  
        try {
            const data = await FireClaimVerification.findByPk(id,{
                where: { id: id },
                include: [
                  {
                    model: FireClaimNotification,
                  },
                ],
            });
            if (!data) {
              return res.status(404).json({ message: "No Data Found" });
            }
            
            res.status(200).json(data);
        } catch (error) {
            
            res.status(400).json({ msg: error.message });
            
        }
};


const editFireClaimVerification = async (req, res) => {
  const verificationBody = req.body;
    const id = req.params.id;
    try {
        
        FireClaimVerification.update(
            verificationBody,
            { where: { id: verificationBody.id } }
        );
        res.status(200).json({ id });
    } catch (error) {
        res.status(404).json({ msg: error.message });
    }
};

const deleteFireClaimVerification = async (req, res) => {
  const id = req.params.id;
  try {
    if (!(await canUserDelete(req.user, "fire verification"))) {
      return res.status(401).json({ msg: "unauthorized access!" });
    }
    FireClaimVerification.destroy({ where: { id: id } });
    res.status(200).json({ id });
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};
//handleUnderwritingVerification
const handleUnderwritingVerification = async (req, res) => {
  let claim
  const claimToVerify = req.body;
  
  try {
    const id = req.body.id;
    const claimVerification = await FireClaimVerification.findByPk(id, );
    if (claimToVerify.fireClaimVerificationStatus == "Verify") {
        claim = await FireClaimVerification.update({
          underwritingApproval: claimToVerify.fireClaimVerificationStatus,
        },
          { where: { id: id } }
        );
    }
    
    res.status(200).json(claim);
  } catch (error) {
    
    res.status(400).json({ msg: error.message });
  }
};



module.exports = {
  getFireClaimVerification,
  createFireClaimVerification,
  editFireClaimVerification,
  deleteFireClaimVerification,
  getFireClaimVerificationByPk,
  handleUnderwritingVerification
};