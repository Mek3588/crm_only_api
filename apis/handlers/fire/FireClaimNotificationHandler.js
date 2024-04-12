
const FireClaimNotification = require("../../../models/fire/claim/FireClaimNotification");
const { Op } = require("sequelize");
const {
  Role,
} = require("../../../utils/constants");
const moment = require("moment");
var fs = require("fs");
var path = require("path");

const ACL = require("../../../models/acl/ACL");
const { formatToCurrency, printPdf, convertFlattenedToNested } = require("../../../utils/GeneralUtils");
const PDFMerger = require("pdf-merger-js");
const { log } = require("console");
const { canUserRead, 
  canUserDelete, 
  canUserAccessOnlyBranch } = require("../../middlewares/authorization.js");
const Customer = require("../../../models/customer/Customer.js");
const Policy = require("../../../models/Policy.js");
const Proposal = require("../../../models/proposals/Proposal.js");

const getSearch = (st) => {
  return {
    [Op.or]: [
      { fullName: { [Op.like]: `%${st}%` } },
      { phoneNumber: { [Op.like]: `%${st}%` } },
      { policyNumber: { [Op.like]: `%${st}%` } },
      { claimNumber: { [Op.like]: `%${st}%` } },
      { customerId: { [Op.like]: `%${st}%` } },
      { claimIssuedDate: { [Op.like]: `%${st}%` } },
      { AccidentDate: { [Op.like]: `%${st}%` } },
    ],
  };

};

const getFireClaimNotification = async (req, res) => {
  const { f, r, st, sc, sd } = req.query;
  

  try {
    const notificationdata = await FireClaimNotification.findAndCountAll({
      offset: Number(f),
      limit: Number(r),
      order: [[sc || "createdAt", sd == 1 ? "DESC" : "ASC"]],
      where: getSearch(st),
      include: [
        {
          model: Policy,
        },
      ],
    });

    
    res.status(200).json(notificationdata);
  } catch (error) {
    
    res.status(400).json({ msg: error.message });
    
  }
};



//posting
const createFireClaimNotification = async (req, res) => {
  let fireClaim;
     const fireClaimBody = req.body;
    
    try {
      const claimedPolicy = await Policy.findOne({
        where: {
          policyNumber: fireClaimBody.policyNumber,
        },
      });
   
      if (!claimedPolicy) {
        return res.status(404).json({ msg: "Policy not found with the given policy number" });
      }
      else if(claimedPolicy)
      {
        const proposal = await Proposal.findOne({
          where: {
            id: claimedPolicy.proposalId,
          },
        });
        
        if (!proposal || (proposal.fireProposalId === 0)) {
          return res.status(404).json({ msg: "Policy not associated with Fire!" });
        }else{ }
        
      }

      var startDate = new Date();
     
    
    let claimIssuedDate = new Date();

    fireClaim = convertFlattenedToNested(fireClaimBody);

          const claimNumber =
           "FREC/" +
          startDate.getFullYear() +
          "" +
          (startDate.getMonth() + 1) +
          "" +
          startDate.getDate() +
          "/" +
          startDate.getUTCHours() +
          "" +
          startDate.getMinutes() +
          "" +
          startDate.getUTCMilliseconds();  

         // fireClaim.claimNumber = claimNumber;

      if (req.files["document"])
      document = req.files["document"][0] ? 
      "/uploads/fireClaimLetters/" + req.files["document"][0].filename : "";

        //fireClaim.customerId  = req.user.id;

      const fireClaimNotification = await FireClaimNotification.create(
        {
        policyNumber: claimedPolicy.policyNumber,
        fullName: fireClaimBody.fullName,
        phoneNumber: fireClaimBody.phoneNumber,
        customerId: req.user.id,
        huoseNumber: fireClaimBody.huoseNumber,
        AccidentDate: fireClaimBody.AccidentDate,
        claimNumber: claimNumber,
        claimIssuedDate: claimIssuedDate,
        document: document,
        policyId : claimedPolicy.id
      },
      //fireClaim
      )
      

      res.status(200).json(fireClaimNotification);
    } catch (error) {
      res.status(400).json({ msg: error.message });
    }
  // }
  };





const getFireClaimNotificationByPk = async (req, res) => {
  const id = req.params.id;
        try {
            const data = await FireClaimNotification.findByPk(req.params.id,{
                where: { id: id },
                include: [
                  {
                    model: Policy,
                  },
                ],
            });
            
            res.status(200).json(data);
        } catch (error) {
            
            res.status(400).json({ msg: error.message });
            
        }
};



const editFireClaimNotification = async (req, res) => {
  const verificationBody = req.body;
    const id = req.params.id;
    try {
        
        FireClaimNotification.update(
            verificationBody,
            { where: { id: verificationBody.id } }
        );
        res.status(200).json({ id });
    } catch (error) {
        res.status(404).json({ msg: error.message });
    }
};

const deleteFireClaimNotification = async (req, res) => {
  const id = req.params.id;
  try {
    if (!(await canUserDelete(req.user, "fireQuotations"))) {
      return res.status(401).json({ msg: "unauthorized access!" });
    }
    FireClaimNotification.destroy({ where: { id: id } });
    res.status(200).json({ id });
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};

module.exports = {
  getFireClaimNotification,
  createFireClaimNotification,
  editFireClaimNotification,
  deleteFireClaimNotification,
  getFireClaimNotificationByPk,
};