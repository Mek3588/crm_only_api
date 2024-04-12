const Document = require("../../../models/Document");
const Contact = require("../../../models/Contact");
const MotorProposal = require("../../../models/proposals/MotorProposal");
const Quotation = require("../../../models/Quotation");
const Branch = require("../../../models/Branch");
const Opportunity = require("../../../models/Opportunity");
const { Role } = require('../../../utils/constants');
const User = require("../../../models/acl/user");
const Proposal = require("../../../models/proposals/Proposal");


const getMotorProposal = async (req, res) => {
  const role = req.user.role;
  try {
    switch (role) {
      case Role.superAdmin:
        data = await MotorProposal.findAll({ include: [Quotation, Branch, Opportunity, { model: User, as: "owner" }] });
        res.status(200).json(data);
        break;
      case Role.sales:
        data = await MotorProposal.findAll({ include: [Quotation, Branch, Opportunity, { model: User, as: "owner" }] });
        res.status(200).json(data);
        break;
      case Role.customer:
        data = await MotorProposal.findAll({
          include: [{ model: User, as: "owner" }, Quotation, Branch, Opportunity],
          where: { ownerId: req.user.id }
        });
        res.status(200).json(data);
        break;
    }
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};

const createMotorProposal = async (req, res) => {
  const reqbody = req.body
  
  
  let idImage = '';
  let videoFootage = '';
  let document = '';
  let withholdingDocument = '';


  if (req.files['idImage'])
    idImage = req.files['idImage'][0] ? "/uploads/motorProposal/" + req.files['idImage'][0].filename : "";
  if (req.files['videoFootage'])
    videoFootage = req.files['videoFootage'][0] ? "/uploads/motorProposal/" + req.files['videoFootage'][0].filename : "";
  if (req.files['document'])
    document = req.files['document'][0] ? "/uploads/motorProposal/" + req.files['document'][0].filename : "";
  if (req.files['withholdingDocument'])
    withholdingDocument = req.files['withholdingDocument'][0] ? "/uploads/motorProposal/" + req.files['withholdingDocument'][0].filename : "";

  try {
    const motorProposal = await MotorProposal.create({
      ownerId: reqbody.ownerId,
      firstName: reqbody.firstName,
      middleName: reqbody.middleName,
      lastName: reqbody.lastName,
      primaryEmail: reqbody.primaryEmail,
      primaryPhone: reqbody.primaryPhone,
      country: reqbody.country,
      region: reqbody.region,
      city: reqbody.city,
      subcity: reqbody.subcity,
      woreda: reqbody.woreda,
      kebele: reqbody.kebele,
      poBox: reqbody.poBox,
      chassisNo: reqbody.chassisNo,
      engineNo: reqbody.engineNo,
      horsePower: reqbody.horsePower,
      plateNumber: reqbody.plateNumber,
      quotationId: reqbody.quotationId,
      effectiveFrom: reqbody.effectiveFrom,
      // leadId: reqbody.leadId,
      opportunityId: reqbody.opportunityId,
      branchId: reqbody.branchId,
      idImage: idImage,
      videoFootage: videoFootage,
      document: document,
      withholdingDocument: withholdingDocument,
      // termsAndConditions: reqbody.termsAndConditions,
      isApproved: reqbody.isApproved,
      plateNumber: reqbody.plateNumber,
      horsePower: reqbody.horsePower,
      noClaim: reqbody.noClaim,
    },)
    res.status(200).json(motorProposal);
    //  }
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};

///delete and update should be done manualy
const getMotorProposalByPk = async (req, res) => {
  try {
    const motorProposal = await MotorProposal.findOne({ include: [Quotation, Opportunity, Branch], where: { id: req.params.id } }).then(function (
      MotorProposal
    ) {
      if (!MotorProposal) {
        res.status(400).json({ message: "No Data Found" });
      }
      else {
        res.status(200).json(MotorProposal);
      }
    });

  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};

const editMotorProposal = async (req, res) => {
  const reqbody = req.body
  const id = req.body.id
  
  
  const oldData = await MotorProposal.findByPk(id);
  let idImage = oldData.idImage;
  let videoFootage = oldData.videoFootage;
  let document = oldData.document;
  let withholdingDocument = oldData.withholdingDocument;


  if (req.files['idImage'])
    idImage = req.files['idImage'][0] ? "/uploads/motorProposal/" + req.files['idImage'][0].filename : "";
  if (req.files['videoFootage'])
    videoFootage = req.files['videoFootage'][0] ? "/uploads/motorProposal/" + req.files['videoFootage'][0].filename : "";
  if (req.files['document'])
    document = req.files['document'][0] ? "/uploads/motorProposal/" + req.files['document'][0].filename : "";
  if (req.files['withholdingDocument'])
    withholdingDocument = req.files['withholdingDocument'][0] ? "/uploads/motorProposal/" + req.files['withholdingDocument'][0].filename : "";

  try {
    const motoreProposal = await MotorProposal.update({
      ownerId: reqbody.ownerId,
      firstName: reqbody.firstName,
      middleName: reqbody.middleName,
      lastName: reqbody.lastName,
      primaryEmail: reqbody.primaryEmail,
      primaryPhone: reqbody.primaryPhone,
      country: reqbody.country,
      region: reqbody.region,
      city: reqbody.city,
      subcity: reqbody.subcity,
      woreda: reqbody.woreda,
      kebele: reqbody.kebele,
      poBox: reqbody.poBox,
      chassisNo: reqbody.chassisNo,
      engineNo: reqbody.engineNo,
      horsePower: reqbody.horsePower,
      plateNumber: reqbody.plateNumber,
      quotationId: reqbody.quotationId,
      effectiveFrom: reqbody.effectiveFrom,
      // leadId: reqbody.leadId,
      opportunityId: reqbody.opportunityId,
      branchId: reqbody.branchId,
      idImage: idImage,
      videoFootage: videoFootage,
      document: document,
      withholdingDocument: withholdingDocument,
      // termsAndConditions: reqbody.termsAndConditions,
      isApproved: reqbody.isApproved,
      plateNumber: reqbody.plateNumber,
      horsePower: reqbody.horsePower,
      noClaim: reqbody.noClaim,
    },
      { where: { id: id } }
    )
    res.status(200).json(motoreProposal);
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};

const approveMotorProposal = async (req, res) => {
  const motoreProposal = req.body
  const id = req.body.id
  

  try {
    const data = await MotorProposal.findByPk(id);
    const resp = await MotorProposal.update({ isApproved: !data.isApproved }, { where: { id: id } });
    
    res.status(200).json(resp);
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};

const deleteMotorProposal = async (req, res) => {
  const id = req.params.id;
  try {
    MotorProposal.destroy({ where: { id: id } });
    res.status(200).json({ id });
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};

module.exports = {
  getMotorProposal,
  createMotorProposal,
  getMotorProposalByPk,
  editMotorProposal,
  approveMotorProposal,
  deleteMotorProposal,
};
