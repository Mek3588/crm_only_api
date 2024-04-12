const { Op } = require('sequelize');
const UnderWritingClaimVerification = require('../../../models/motor/claim/UnderWritingClaimVerification');
const ClaimVerification = require('../../../models/motor/claim/ClaimVerification');


const getSearch = (st) => {
    return {
        [Op.or]: [
            {customerId: { [Op.like]: `%${st}%` } },
            {claimVerificationId: { [Op.like]: `%${st}%` } },
            {policyNumber: { [Op.like]: `%${st}%` } },
            {accountNumber: { [Op.like]: `%${st}%` } },
            {plateNumber: { [Op.like]: `%${st}%` } },
            {model: { [Op.like]: `%${st}%` } },
            {chassisNumber: { [Op.like]: `%${st}%` } },
            {engineNumber: { [Op.like]: `%${st}%` } },
            {yearOfManufacture: { [Op.like]: `%${st}%` } },
            {purpose: { [Op.like]: `%${st}%` } },
            {coverType: { [Op.like]: `%${st}%` } },

        ]
    }
}

const getUnderWritingClaimVerification = async (req, res) => {
    const { f, r, st, sc, sd, purpose } = req.query;

    console.log("purpose", purpose)

    try {
        const pagination = purpose === "export" || {
            offset: Number(f),
            limit: Number(r),
          }; 

        const data = await UnderWritingClaimVerification.findAndCountAll({
            ...pagination,
            order: [[sc || "createdAt", (sd == 1 && purpose !== "export") ? "DESC" : "ASC"]],
            subQuery: false,
            where: getSearch(st),
        });
        
        res.status(200).json(data);

    }catch (error) {
        res.status(400).json({ msg: error.message });
    }
}


const getUnderWritingClaimVerificationByPk = async (req, res) => {
    console.log("req.params.id", req.params.id)

    try {
        const underWritingClaimVerification = await UnderWritingClaimVerification.findByPk(req.params.id).then(function (
            UnderWritingClaimVerification
        ) {
            if (!UnderWritingClaimVerification) {
                res.status(404).json({ message: "No Data Found" });
            }
            res.status(200).json(UnderWritingClaimVerification);
        });

        return res.status(200).json(underWritingClaimVerification);
    } catch (error) {
        return res.status(404).json({ msg: error.message });
    }
}

const getUnderWritingClaimVerificationByCustomerId = async (req, res) => {
    try {
        const UnderWritingClaimVerification = await UnderWritingClaimVerification.findAll({
            where: { customerId: req.params.id }
        }).then(function (
            UnderWritingClaimVerification
        ) {
            if (!UnderWritingClaimVerification) {
                res.status(404).json({ message: "No Data Found" });
            }
            return res.status(200).json(UnderWritingClaimVerification);
        });

        return res.status(200).json(UnderWritingClaimVerification);
    } catch (error) {
        return res.status(404).json({ msg: error.message });
    }
}

const getUnderWritingClaimVerificationByClaimVerificationId = async (req, res) => {
    try {
        const UnderWritingClaimVerification = await UnderWritingClaimVerification.findAll({
            where: { claimVerificationId: req.params.claimVerificationId }
        })


        res.status(200).json(UnderWritingClaimVerification);
    } catch (error) {
        res.status(404).json({ msg: error.message });

    }
}

const createUnderWritingClaimVerification = async (req, res) => {
    const verificationBody = req.body;
    
    const { claimNotificationId } = verificationBody;
    
    try {
        const data = await UnderWritingClaimVerification.create(verificationBody);
        
        res.status(200).json(data);
    }catch (error) {
        res.status(400).json({ msg: error.message });
    }
}

const createUnderWritingClaimVerifications = async (req, res) => {
    const underWritingClaimVerificationBody = req.body;
    var addedList = 0;
    var duplicate = 0;
    let promises;

    console.log("underWritingClaimVerificationBody", underWritingClaimVerificationBody)

    try {
      // if (!(await canUserCreate(req.user, "citys"))) {
      //   return res.status(401).json({ msg: "unauthorized access!" });
      // }
      promises = underWritingClaimVerificationBody.map(async (underWritingClaimVerification) => {
        const duplicateUnderWritings = await UnderWritingClaimVerification.findAll({
            where: { claimVerificationId: underWritingClaimVerification.claimVerificationId },
        });
    
        console.log("duplicateUnderWritings", duplicateUnderWritings)
        if (duplicateUnderWritings.length > 0) {
            duplicate += 1;
        } else {
            try {
                const createdUnderWritingClaimVerification = await UnderWritingClaimVerification.create(underWritingClaimVerification);
                console.log("createdUnderWritingClaimVerification", createdUnderWritingClaimVerification)
                
                addedList += 1;
            } catch (error) {
                res.status(400).json({ msg: error.message });
                
            } 
        }
    });
        
        
        Promise.all(promises).then(function (results) {
            let msg = "";
        if (addedList !== 0) {
          msg = msg + `${addedList} Underwriting Claim Verification Added`;
          console.log("underWritings MSG", msg);
        }
        if (duplicate != 0) {
          console.log("duplicate MSG", msg);
  
          msg = msg + ` ${duplicateUnderWritings} duplicate found`;
          console.log("duplicate MSG", msg);
        }
        res.status(200).json({ msg: msg });
      });
    } catch (error) {
      res.status(400).json({ msg: error.message });
    }
  };

const editUnderWritingClaimVerification = async (req, res) => {
    const verificationBody = req.body;
    const id = req.params.id;
    try {
        
        UnderWritingClaimVerification.update(
            verificationBody,
            { where: { id: verificationBody.id } }
        );
        res.status(200).json({ id });
    } catch (error) {
        res.status(404).json({ msg: error.message });
    }
}

const deleteUnderWritingClaimVerification = async (req, res) => {
    const id = req.params.id;
    try {
        UnderWritingClaimVerification.destroy({ where: { id: id } });
        res.status(200).json({ id });
    } catch (error) {
        res.status(404).json({ msg: error.message });
    }
}

module.exports = {
    getUnderWritingClaimVerification,
    getUnderWritingClaimVerificationByPk,
    getUnderWritingClaimVerificationByCustomerId,
    getUnderWritingClaimVerificationByClaimVerificationId,
    createUnderWritingClaimVerification,
    createUnderWritingClaimVerifications,
    editUnderWritingClaimVerification,
    deleteUnderWritingClaimVerification,
};