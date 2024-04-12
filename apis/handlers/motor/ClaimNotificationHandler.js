const { Op } = require('sequelize');
const ClaimNotification = require('../../../models/motor/claim/ClaimNotification');
const Customer = require('../../../models/customer/Customer');
const Policy = require('../../../models/Policy');

const getSearch = (st) => {
  return {
    [Op.or]: [],
  };
};

const getClaimNotification = async (req, res) => {
  const { f, r, st, sc, sd, policyNumber } = req.query;

  try {
    const offset = f ? Number(f) : 0;
    const limit = r ? Number(r) : 10; // You can set a default limit or adjust as needed

    const data = await ClaimNotification.findAndCountAll({
      include: [
        {
          model: Policy,
        },
      ],
      offset,
      limit,
      order: [[sc || 'createdAt', sd == 1 ? 'DESC' : 'ASC']],
      where: policyNumber ? { policyNumber } : {},
    });

    
    res.status(200).json(data);
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};

  const getClaimNotificationByClaimNumber = async (req, res) => {
    const {claimNo} = req.query;
    
    try {
        const data = await ClaimNotification.findAndCountAll({
            where: { claimNo: claimNo },
        });
        
        res.status(200).json(data);
    } catch (error) {
        
        res.status(400).json({ msg: error.message });
        
    }
}

const createClaimNotification = async (req, res) => {
  const claimBody = req.body;

  try {
    const data = await ClaimNotification.create(claimBody);

    
    res.status(200).json(data);
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};

const generateClaimNumber = async (proposalid, quotationProposal) => {
  let claimNumber;
  let coding;
  let quotation = quotationProposal;

  const proposal = await Proposal.findByPk(
    proposalid,
    {
      include: [{ model: MotorProposal, }, { model: Contact, }],
    }
  );

  if (quotationProposal == null) {

    const thisquotationProposal = await Quotation.findByPk(
      proposal.motor_proposal.quotationId,
      {
        include: [Branch],
      }
    );
    quotation = thisquotationProposal;

  } else quotation = quotationProposal;

  let lastClaimNumber = await ClaimNotification.findOne({
    order: [["id", "DESC"]], where: {
      "$claimNotification.customerId$": {
        [Op.not]: 0
      }
    }
  });

  ClaimNotification.bulkCreate(data)

  if (lastClaimNumber == null || !lastClaimNumber.claimNumber) {
    if (lastClaimNumber.claimNumber == null || lastClaimNumber.claimNumber == '') {
      lastClaimNumber = { id: 0 };
      const branchId = proposal?.contact?.branchId;

      const branch = await Branch.findByPk(branchId);
      const branchNames = branch.name.split(" ");

      branchNames.length > 1
        ? branchNames[0].charAt(0).toUpperCase() +
        branchNames[1].charAt(0).toUpperCase()
        : branchNames[0].charAt(0).toUpperCase() +
        branchNames[0].charAt(1).toUpperCase();
      const branchAbr = branch.short_code ? branch.short_code.toUpperCase() : "";
      policyNumber = `ZI/${branchAbr}/MTR/0000/${new Date().getMonth() + 1
        }/${new Date().getFullYear().toString().slice(2)}`;
    }
  }
  else {
    const thisContact = await Contact.findByPk(
      proposal.contactId,
      {
        include: [{ model: Branch, }],
      }
    );
    const branch = await Branch.findByPk(thisContact.branchId);
    const branchCode = branch.short_code;
    policyNumber = await generateNumber(lastPolicyNumber.policyNumber, branchCode, coding)
    // assign the previous policy number to the new policy number
    // policyNumber = lastPolicyNumber.policyNumber;
  }

  return claimNumber;
}

const editClaimNotification = async (req, res) => {
  const { id } = req.params;
  const claimBody = req.body;

  try {
    const data = await ClaimNotification.update(claimBody, { where: { id: id } });

    
    res.status(200).json(data);
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};

const deleteClaimNotification = async (req, res) => {
  const { id } = req.params;

  try {
    const data = await ClaimNotification.destroy({ where: { id: id } });

    
    res.status(200).json(data);
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};

module.exports = {
  getClaimNotification,
  createClaimNotification,
  editClaimNotification,
  deleteClaimNotification,
  getClaimNotificationByClaimNumber,
};
