const { Op } = require('sequelize');
const ClaimVerification = require('../../../models/motor/claim/ClaimVerification');
const ClaimNotification = require('../../../models/motor/claim/ClaimNotification');
const Customer = require('../../../models/customer/Customer');
const {claimVerificationStatus} = require("../../../utils/constants")

const getSearch = (st) => {
    return {
        [Op.or]: [
           
            
            { customerId: { [Op.like]: `%${st}%` } },
            {claimNumber: { [Op.like]: `%${st}%` } },
            {policyNumber: { [Op.like]: `%${st}%` } },
            {accidentDate: { [Op.like]: `%${st}%` } },
            {accidentType: { [Op.like]: `%${st}%` } },
        ],
    };
    }

// const getClaimVerification = async (req, res) => {
//     const { f, r, st, sc, sd } = req.query;
   
//     const offset = Number(f);
//     const limit = Number(r);

//     // if (isNaN(offset) || isNaN(limit)) {
//     //     
//     //     res.status(400).json({ msg: "Invalid offset or limit" });
//     // } else {
//         try {
//             const data = await ClaimVerification.findAndCountAll({
//                 // offset,
//                 // limit,
//                 // order: [[sc || "createdAt", sd == 1 ? "DESC" : "ASC"]],
//             });
            
//             res.status(200).json(data);
//         } catch (error) {
            
//             res.status(400).json({ msg: error.message });
            
//         }

// }


const getClaimVerifications = async (req, res) => {
  
    const { f, r, st, sc, sd } = req.query;
  
    try {
      //const data = await ClaimNotification.findAndCountAll({});
      
      const data = await ClaimVerification.findAndCountAll({
        offset: Number(f),
        limit: Number(r),
        order: [[sc || 'createdAt', sd == 1 ? 'DESC' : 'ASC']],
        where: getSearch(st)
      });
      console.log("data",data)
      res.status(200).json(data);
    } catch (error) {
        console.log(error)
      
    }
  };

const getClaimVerificationByClaimNumber = async (req, res) => {
    const {claimNumber} = req.query;
    
    try {
        const data = await ClaimVerification.findOne({
            where: { claimNumber: claimNumber },
        });
        
        res.status(200).json(data);
    } catch (error) {
        
        res.status(400).json({ msg: error.message });
        
    }
}


const getClaimVerificationById = async (req, res) => {
    const id = req.params.id;
  
        try {
            const data = await ClaimVerification.findByPk(id);
            console.log("verification data", data);
            res.status(200).json(data);
        } catch (error) {
            
            res.status(400).json({ msg: error.message });
            
        }
}

// const getClaimVerificationByPk = async (req, res) => {
//     try {
//         const ClaimVerification = await ClaimVerification.findByPk(req.params.id).then(function (
//             ClaimVerification
//         ) {
//             if (!ClaimVerification) {
//                 res.status(404).json({ message: "No Data Found" });
//             }
//             res.status(200).json(ClaimVerification);
//         });

//         res.status(200).json(ClaimVerification);
//     } catch (error) {
//         res.status(404).json({ msg: error.message });
//     }
// }

const createClaimVerification = async (req, res) => {
 
    
    const verificationBody = req.body;
  
    verificationBody.verificationStatus = verificationBody.status | claimVerificationStatus.new
    
    const { claimNotificationId } = verificationBody;
    
    try {
        const data = await ClaimVerification.create(verificationBody);
        
        res.status(200).json(data);
    }catch (error) {
        res.status(400).json({ msg: error.message });
    }
}

const editClaimVerification = async (req, res) => {
    const verificationBody = req.body;
    const id = req.params.id;
    try {
        
        ClaimVerification.update(
            verificationBody,
            { where: { id: verificationBody.id } }
        );
        res.status(200).json({ id });
    } catch (error) {
        res.status(404).json({ msg: error.message });
    }
};

const deleteClaimVerification = async (req, res) => {
    const id = req.params.id;
    try {
        ClaimVerification.destroy({ where: { id: id } });
        res.status(200).json({ id });
    } catch (error) {
        res.status(404).json({ msg: error.message });
    }
};

module.exports = {
    //getClaimVerificationByPk,
    createClaimVerification,
   // getClaimVerification,
    editClaimVerification,
    deleteClaimVerification,
    getClaimVerificationById,
    getClaimVerifications,
    getClaimVerificationByClaimNumber,
};

