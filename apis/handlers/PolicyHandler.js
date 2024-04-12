const numberToWords = require('number-to-words');
const { ToWords } = require('to-words');
const moment = require("moment");
const { Op, where } = require("sequelize");
const Policy = require("../../models/Policy");
const { eventResourceTypes, eventActions, policyStatus, financeStatus, vehicleTypes, MotorCoverType, purposes, branchManagerApprovalStatus } = require("../../utils/constants");
const {
  createEventLog,
  getChangedFieldValues,
  getIpAddress,
  generateNumber,
  formatToCurrency,
} = require("../../utils/GeneralUtils");
const {
  canUserCreate,
  canUserEdit,
  canUserDelete,
} = require("../../utils/Authrizations");
const EndorsementFilesPath = require("../../models/endorsement/EndorsementFilesPath");
const Branch = require("../../models/Branch");
const Quotation = require("../../models/Quotation");

const { printMotorSchedule, printMultipleMotorSchedule, printMultipleMotorTruckSchedule, printTpEndorsement } = require("./motor/functions");
// const { createEndorsementByProposal } = require("./endorsement/EndorsementHandler");
const MotorProposal = require("../../models/proposals/MotorProposal");
const FinanceData = require("../../models/FinanceData");
const { generateMotorInvoiceOrder, generateMotorMultipleRiskSchedule, 
        generateInsuranceCertificate, generateMotorWording } = require("./proposals/FireProposalHandler");
const { createEndorsementByProposal, UpdateEndorsementByProposal } = require("./endorsement/EndorsementHandler");
const Proposal = require("../../models/proposals/Proposal");
const Addons = require("../../models/motor/Addons");
const CoverRate = require("../../models/CoverRate");
const PDFMerger = require("pdf-merger-js");
const Contact = require("../../models/Contact");
const TerritorialExtension = require("../../models/TerritorialExtension");
const User = require("../../models/acl/user");
const Employee = require("../../models/Employee");
const Endorsement = require('../../models/endorsement/Endorsement');
const MultipleProposal = require('../../models/MultipleProposal');
const { type } = require('os');
const LimitedCoverRate = require('../../models/motor/LimitedCoverRate');
const MultiplePolicy = require('../../models/MultiplePolicy');
const { lineGap } = require('pdfkit');
const toWords = new ToWords();

const getMultiplePolicy = async (req, res) => {

  try {
    const { f, r, st, sc, sd, status } = req.query;

    const currentUser = await User.findByPk(req.user.id, {
      include: [Employee],
    });
    let data
    //req.type = "all"

    if (req.type === "all") {
      const { f, r, st, sc, sd, status } = req.query;
      data = await MultiplePolicy.findAndCountAll({
        offset: Number(f),
        limit: Number(r),
        order: sc
          ? [[sc, sd == 1 ? "ASC" : "DESC"]]
          : [["createdAt", sd == 1 ? "DESC" : "ASC"]],
        where: {
          //  ...getSearch(st), 
          status: status
        },
      });
    }
    else if (req.type === "customer") {
      data = await MultiplePolicy.findAndCountAll({
        offset: Number(f),
        limit: Number(r),
        order: sc
          ? [[sc, sd == 1 ? "ASC" : "DESC"]]
          : [["createdAt", sd == 1 ? "DESC" : "ASC"]],
        where: {
          [Op.and]: [
            {
              [Op.or]: [
                { '$proposal.contact.accountId$': currentUser.id }
                //{ assignedTo: { [Op.like]: `%${currentUser.id}%` } },
              ],
            },
            { ...getSearch(st), policyStatus: status },

          ],
        },
      });
    }
    else if (req.type === "self") {
      data = await Policy.findAndCountAll({
        offset: Number(f),
        limit: Number(r),
        subQuery: false,

        order: sc
          ? [[sc, sd == 1 ? "ASC" : "DESC"]]
          : [["createdAt", sd == 1 ? "DESC" : "ASC"]],
        where: {
          [Op.and]: [
            {
              [Op.or]: [
                { "$proposal.userId": currentUser.id },
                { "$proposal.contact.assignedTo$": currentUser.id },
              ],
            },
            { ...getSearch(st), policyStatus: status },

          ],
        },

      });

    }
    else if (req.type === 'branch') {
      data = await Policy.findAndCountAll({
        offset: Number(f),
        limit: Number(r),
        subQuery: false,
        order: sc
          ? [[sc, sd == 1 ? "ASC" : "DESC"]]
          : [["createdAt", sd == 1 ? "DESC" : "ASC"]],
        where: {
          [Op.and]: [
            {
              [Op.or]: [
                {
                  "$proposal.contact.branchId$": currentUser.employee.branchId
                },
              ],
            },
            { ...getSearch(st), policyStatus: status },
          ],
        },

      });

    }
    else if (req.type === 'branchAndSelf') {
      data = await Policy.findAndCountAll({
        include: [EndorsementFilesPath, { model: Proposal, include: [Contact] }],
        offset: Number(f),
        limit: Number(r),
        subQuery: false,
        order: sc
          ? [[sc, sd == 1 ? "ASC" : "DESC"]]
          : [["createdAt", sd == 1 ? "DESC" : "ASC"]],
        where: {
          [Op.and]: [
            {
              [Op.or]: [
                { "$proposal.contact.branchId$": currentUser.employee.branchId },
                { "$proposal.userId": currentUser.id },
                { "$proposal.contact.assignedTo$": currentUser.id },
              ],
            },
            { ...getSearch(st), policyStatus: status },
          ],
        },

      });
    }
    res.status(200).json(data);
  } catch (error) {
    console.error("Error creating user:", error);
    return res.status(500).json({ msg: "Internal Server Error" });
  }
};

const getPolicy = async (req, res) => {

  try {
    const { f, r, st, sc, sd, status, multipleId } = req.query;

    const currentUser = await User.findByPk(req.user.id, {
      include: [Employee],
    });
    let data
    //req.type = "all"


    if (req.type === "all") {
      const { f, r, st, sc, sd, status } = req.query;
      data = await Policy.findAndCountAll({
        include: [EndorsementFilesPath],
        offset: Number(f),
        limit: Number(r),
        //subQuery: false,
        order: sc
          ? [[sc, sd == 1 ? "ASC" : "DESC"]]
          : [["createdAt", sd == 1 ? "DESC" : "ASC"]],
        where: { ...getSearch(st), policyStatus: status, multiplePolicyId: multipleId },
      });
    }
    else if (req.type === "customer") {
      data = await Policy.findAndCountAll({
        include: [EndorsementFilesPath, { model: Proposal, include: [Contact] }],
        offset: Number(f),
        limit: Number(r),
        subQuery: false,

        order: sc
          ? [[sc, sd == 1 ? "ASC" : "DESC"]]
          : [["createdAt", sd == 1 ? "DESC" : "ASC"]],
        where: {
          [Op.and]: [
            {
              [Op.or]: [
                { '$proposal.contact.accountId$': currentUser.id }
                //{ assignedTo: { [Op.like]: `%${currentUser.id}%` } },
              ],
            },
            { ...getSearch(st), policyStatus: status },

          ],
        },
      });
    }
    else if (req.type === "self") {
      data = await Policy.findAndCountAll({
        include: [EndorsementFilesPath, { model: Proposal, include: [Contact] }],
        offset: Number(f),
        limit: Number(r),
        subQuery: false,

        order: sc
          ? [[sc, sd == 1 ? "ASC" : "DESC"]]
          : [["createdAt", sd == 1 ? "DESC" : "ASC"]],
        where: {
          [Op.and]: [
            {
              [Op.or]: [
                { "$proposal.userId": currentUser.id },
                { "$proposal.contact.assignedTo$": currentUser.id },
              ],
            },
            { ...getSearch(st), policyStatus: status },

          ],
        },

      });

    }
    else if (req.type === 'branch') {
      data = await Policy.findAndCountAll({
        include: [EndorsementFilesPath, { model: Proposal, include: [Contact] }],
        offset: Number(f),
        limit: Number(r),
        subQuery: false,
        order: sc
          ? [[sc, sd == 1 ? "ASC" : "DESC"]]
          : [["createdAt", sd == 1 ? "DESC" : "ASC"]],
        where: {
          [Op.and]: [
            {
              [Op.or]: [
                {
                  "$proposal.contact.branchId$": currentUser.employee.branchId
                },
              ],
            },
            { ...getSearch(st), policyStatus: status },
          ],
        },

      });

    }
    else if (req.type === 'branchAndSelf') {
      data = await Policy.findAndCountAll({
        include: [EndorsementFilesPath, { model: Proposal, include: [Contact] }],
        offset: Number(f),
        limit: Number(r),
        subQuery: false,
        order: sc
          ? [[sc, sd == 1 ? "ASC" : "DESC"]]
          : [["createdAt", sd == 1 ? "DESC" : "ASC"]],
        where: {
          [Op.and]: [
            {
              [Op.or]: [
                { "$proposal.contact.branchId$": currentUser.employee.branchId },
                { "$proposal.userId": currentUser.id },
                { "$proposal.contact.assignedTo$": currentUser.id },
              ],
            },
            { ...getSearch(st), policyStatus: status },
          ],
        },

      });
    }
    res.status(200).json(data);
  } catch (error) {
    console.error("Error creating user:", error);
    return res.status(500).json({ msg: "Internal Server Error" });
  }
};

const getSearch = (st) => {
  return {
    [Op.or]: [
      {
        fullName: {
          [Op.like]: "%" + st + "%",
        },
      },
      {
        policyNumber: {
          [Op.like]: "%" + st + "%",
        },
      },
    ],
  };
};

//posting
const createPolicy = async (req, res) => {
  const policyBody = req.body;
  try {

    const duplicateCustomer = await Policy.findAll({
      where: { fullName: policyBody.fullName },
    });
    if (duplicateCustomer.length > 0) {
      return res.status(400).json({ msg: "Policy fullName already used!" });
    }

    if(policyBody?.policyNumber){
      policyBody.policyNumber = policyBody.policyNumber
      policyBody['coverType'] ='Own damage'
      policyBody['customerId'] = req.user.id
      policyBody['multiplePolicyId'] = "12"
      policyBody['policyType'] = 'Motor'
    }else{
    let policy_no = await generatePolicyNumber(policyBody.proposalId);
    policyBody.policyNumber = policy_no
    }
    const policy = await Policy.create(policyBody);
    console.log("policy",policy)
    if (policy) {
      let ipAddress = getIpAddress(req.ip);
      const eventLog = await createEventLog(
        req.user.id,
        eventResourceTypes.policy,
        `${policy.fullName} `,
        policy.id,
        eventActions.create,
        "",
        ipAddress
      );
    }
    return res.status(200).json(policy);
  } catch (error) {
    console.log(error.message)
    res.status(400).json({ msg: error.message });
  }
};

const getPolicyByPk = async (req, res) => {
  try {

    const policy = await Policy.findByPk(req.params.id, { include: [EndorsementFilesPath, { model: Proposal, include: [Contact] }] })
    if (!policy) {
      return res.status(404).json({ message: "No Data Found" });
    }

    if (req.type === 'customer' && (policy.proposal.contact.accountId != req.user.id)) {
      return res.status(401).json({ msg: "unauthorized access" });
    }
    // if (req.type == 'self' && (policy.proposal.contact.accountId != req.user.id)){

    // }
    let ipAddress = getIpAddress(req.ip);
    const eventLog = createEventLog(
      req.user.id,
      eventResourceTypes.policy,
      `${policy.fullName} `,
      policy.id,
      eventActions.view,
      "",
      ipAddress
    );
    res.status(200).json(policy);
    // res.status(200).json(policy);
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};

const editPolicy = async (req, res) => {
  const policyBody = req.body;
  const id = req.params.id;

  try {
    if (!(await canUserEdit(req.user, "policys"))) {
      return res.status(401).json({ msg: "unauthorized access!" });
    }
    const duplicateName = await Policy.findAll({
      where: { fullName: policyBody.fullName },
    });
    if (duplicateName.length !== 0) {
      if (duplicateName[0].id !== policyBody.id) {
        res.status(400).json({ msg: "Policy fullName already used!" });
        return;
      }
    }
    let oldDept = await Policy.findByPk(id, {});
    let dept = Policy.update(policyBody, {
      where: { id: id },
    });

    if (dept) {
      let newDept = await Policy.findByPk(id, {});
      let changedFieldValues = getChangedFieldValues(oldDept, newDept);
      let ipAddress = getIpAddress(req.ip);
      const eventLog = createEventLog(
        req.user.id,
        eventResourceTypes.policy,
        newDept.fullName,
        newDept.id,
        eventActions.edit,
        changedFieldValues,
        ipAddress
      );
    }

    res.status(200).json({ id });
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};


const PolicyPayed = async (req, res) => {
  const policyBody = req.body;
  const id = req.body.id;
  try {
    if (!(await canUserEdit(req.user, "policys"))) {
      return res.status(401).json({ msg: "Unauthorized access!" });
    }


    const existingPolicy = await Policy.findByPk(id);
    console.log("misndvinsdivns", existingPolicy)
    if (!existingPolicy) {
      return res.status(404).json({ msg: "Policy not found" });
    }


    if (existingPolicy.isPaid) {
      console.log("it is paid")
      return res.status(400).json({ msg: "Policy is already Paid" });
    }

    const policy = await Policy.update({ ...policyBody, isPaid: true }, { where: { id: id } });
    console.log("aaaaaaa", policy)
    // Create event log
    const ipAddress = getIpAddress(req.ip);
    const eventLog = createEventLog(
      req.user.id,
      eventResourceTypes.policy,
      existingPolicy.fullName,
      existingPolicy.id,
      eventActions.edit,
      JSON.stringify({ isPaid: false }),
      ipAddress
    );

    res.status(200).json({ policy });
  } catch (error) {
    res.status(400).json({ msg: error.message });
    console.log("the errors", error.message)
  }
};


const deletePolicy = async (req, res) => {
  const id = req.params.id;
  try {
    // if (!(await canUserDelete(req.user, "policys"))) {
    //   return res.status(401).json({ msg: "unauthorized access!" });
    // }
    let policy = await Policy.findByPk(id, {});
    let dept = await Policy.destroy({ where: { id: id } });
    if (dept) {
      let ipAddress = getIpAddress(req.ip);
      const eventLog = createEventLog(
        req.user.id,
        eventResourceTypes.policy,
        `${policy.fullName} `,
        policy.id,
        eventActions.delete,
        "",
        ipAddress
      );
    }
    res.status(200).json({ id });
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};


const generateDraftPolicy = async (proposal, status, branchManagerApprovalStatus, initialCoverType, multPolicyId, count) => {

  // console.log("inside generate Draft policy ", proposal.motor_proposal.quotation.coverType)
  console.log("all inputs ", status, branchManagerApprovalStatus, initialCoverType, multPolicyId);

  try {
    let nextyear = new Date();
    nextyear.setYear(new Date().getFullYear() + 1);
    let policyYear = new Date();
    const branch = await Branch.findByPk(proposal.contact.branchId);
    let policyNumber;
    let quotationProposal;

    if (proposal.motor_proposal) {
      quotationProposal = await Quotation.findByPk(
        proposal.motor_proposal.quotationId,
        {
          include: [Branch],
        }
      );
    }

    // const approvedFinanceStatus = await approveFinance(proposal.motor_proposal.quotation.id)
    // 

    policyNumber = await generatePolicyNumber(proposal.id, quotationProposal);


    // const branchId = proposal?.contact?.branchId;
    // 



    const name = proposal.contact
      ? proposal.contact.type == "Corporate"
        ? proposal.contact.companyName
        : proposal.contact.type == "Join Individual"
          ? proposal.contact.joinIndividualName
          : proposal.contact.type == "Individual"
            ? `${proposal.contact.firstName} ${proposal.contact.middleName ?? ''} ${proposal.contact.lastName ?? ''}`
            : ""
      : ""


    // const policy = proposal.proposalStatus === "Accept" &&





    var startDate = new Date(proposal.effectiveFrom);
    var endDate = new Date(startDate);
    startDate.setMonth(startDate.getMonth() + 1);
    startDate.setDate(startDate.getDate() + 1);
    endDate.setFullYear(startDate.getFullYear() + 1);

    let startDateUI =
      startDate.getDate() +
      "/" +
      startDate.getMonth() +
      "/" +
      startDate.getFullYear();
    let endDateUI =
      endDate.getDate() +
      "/" +
      Number(endDate.getMonth() + 1) +
      "/" +
      Number(endDate.getFullYear());

    // const updatedProposal = await Proposal.findByPk(id, {
    //   include: [{
    //     model: Contact,
    //     include: [Branch]
    //   }, { model: MotorProposal, include: [Quotation] }],
    // });
    // 

    let motorProposalId = proposal.motorProposalId;
    // const motorProposal = await MotorProposal.findByPk(motorProposalId);

    const quotationAddons = await Addons.findAll({
      where: { quotationId: proposal.motor_proposal.quotation.id },
      include: [
        { model: CoverRate, as: "coverRate" },
        { model: LimitedCoverRate, as: "limitedCoverRate" }
      ]
    }, { raw: true })

    // console.log("quotationaddons", quotationAddons)


    let endorsements = []

    if (initialCoverType === MotorCoverType.comprehensive) {
      if (proposal.motor_proposal.quotation.coverType === MotorCoverType.ownDamage) {
        if (quotationAddons.length > 0) {
          quotationAddons.forEach((addon, index) => {
            console.log("addon od is", addon?.coverRate)
            console.log("index " + index + addon?.coverRate?.coverType)

            endorsements.push({ value: addon?.coverRate?.coverType })
          });
        }

      } else if (proposal.motor_proposal.quotation.coverType === MotorCoverType.thirdParty) {
        if (quotationAddons.length > 0) {
          quotationAddons.forEach((addon, index) => {
            console.log("addon tp is", addon?.dataValues?.limitedCoverRate)
            console.log("index " + index + addon?.limitedCoverRate?.name)

            endorsements.push({ value: addon?.LimitedCoverRate?.name })
          });
        }
      }

    }
    else {
      // if (quotationAddons.length > 0) {
      //   quotationAddons.forEach((addon, index) => {
      //     console.log("addon other is", addon?.dataValues)

      //     console.log("indexx" + index + addon?.dataValues?.limitedCoverRate)
      //     endorsements.push({ value: addon?.dataValues?.flag })
      //   });
      // }
      if (quotationAddons.length > 0) {
        quotationAddons.forEach((addon, index) => {
          console.log("addon other is", addon?.dataValues)

          console.log("indexx" + index + addon?.dataValues?.limitedCoverRate)
          const flag = addon?.dataValues?.coverRate?.dataValues?.flag;
          if (flag) {
            endorsements.push({ value: flag });
          }
        });
      }      
    }

    let isGood;

    if (proposal.motor_proposal.quotation.coverType == vehicleTypes.trucks ||
      proposal.motor_proposal.quotation.coverType == vehicleTypes.pickup_and_vans ||
      proposal.motor_proposal.quotation.coverType == vehicleTypes.trailer) {
      isGood = true;
    }
    else {
      isGood = false;
    }

    let inperson;
    if (proposal.motor_proposal.quotation.coverType === vehicleTypes.buses ||
      proposal.motor_proposal.quotation.coverType === vehicleTypes.taxi ||
      proposal.motor_proposal.quotation.MotorCoverType === MotorCoverType.ownDamage &&
      proposal.motor_proposal.quotation.coverType === vehicleTypes.mini_buses ||
      proposal.motor_proposal.quotation.coverType === vehicleTypes.private_automobiles
      //comprehensive minibus
      // || proposal.motor_proposal.quotation.MotorCoverType === MotorCoverType.comprehensive && 
      // proposal.motor_proposal.quotation.coverType == vehicleTypes.mini_buses 
    ) {
      inperson = true;
    }
    else {
      inperson = false;
    }
    let totalPremium = (Number(quotationProposal.premium) + 5)
    /////////////////// SCHEDULE PRINT DATAS

    let printData = {
      name_of_insured:
        proposal.contact.type === "Individual" ?
          (proposal.contact.firstName + " " + (proposal.contact.middleName ? proposal.contact.middleName : " ") + " " +
            (proposal.contact.lastName ? proposal.contact.lastName : " "))
          : proposal.contact.type === "Corporate" ?
            proposal.contact.companyName
            : proposal.contact.type === "Join Individual" ?
              proposal.contact.joinIndividualName
              : "",
      address_of_insured: proposal.contact.city,
      insureds_occupation: proposal.contact.industry ? proposal.contact.industry : "-",
      start_date: startDateUI,
      end_date: endDateUI,
      type_of_cover: quotationProposal.coverType,
      geographic_area_limit: "Within Ethiopia",
      branch: proposal.contact.branch.name,
      policy_no: policyNumber,
      woreda: proposal.contact.woreda,
      kebele: proposal.contact.kebele,
      HNo: proposal.contact.building,
      POBox: proposal.contact.poBox,
      sub_city: proposal.contact.subcity,
      tel: proposal.contact.primaryPhone,
      initialPremium: quotationProposal.premium,
      premium: totalPremium,
      use_of_vehicle: quotationProposal.purpose,
      plate_no: proposal.motor_proposal.plateNumber,
      chassis_no: proposal.motor_proposal.chassisNo,
      engine_no: proposal.motor_proposal.engineNo,
      make_and_type: proposal.motor_proposal.quotation.vehicle_type,
      cc: proposal.motor_proposal.quotation?.cc,
      year_of_manufacture: new Date(proposal.motor_proposal.quotation.manufactured_date).getFullYear() ?
        new Date(proposal.motor_proposal.quotation.manufactured_date).getFullYear() : "-",

      goods: isGood ? proposal.motor_proposal.quotation.carrying_capacity : "-",
      passangers: isGood ? proposal.motor_proposal.quotation.person_carrying_capacity : Number(proposal.motor_proposal.quotation.person_carrying_capacity) + Number(proposal.motor_proposal.quotation.carrying_capacity),
      //passangers: inperson ? proposal.motor_proposal.quotation.carrying_capacity : proposal.motor_proposal.quotation.person_carrying_capacity,
      insured_estimate: proposal.motor_proposal.quotation.sumInsured,
      endorsements: endorsements,
      status: status == policyStatus.draftPolicy ? true : false,
    };

    const insured_name = proposal.contact
      ? proposal.contact.type == "Corporate"
        ? proposal.contact.companyName
        : proposal.contact.type == "Join Individual"
          ? proposal.contact.joinIndividualName
          : proposal.contact.type == "Individual"
            ? `${proposal.contact.firstName} ${proposal.contact.middleName ?? ''} ${proposal.contact.lastName ?? ''}`
            : ""
      : ""

    let tpPrintData = {
      name_of_insured: insured_name,
      policy_number: policyNumber,
      startDate: `${policyYear.getDate()}/${policyYear.getMonth() + 1}/${policyYear.getFullYear()}`,
      endDate: `${policyYear.getDate() - 1}/${policyYear.getMonth() + 1}/${policyYear.getFullYear() + 1}`,
      policyEndDate: new Date(policyYear.getFullYear() + 1, policyYear.getMonth(), policyYear.getDate() - 1),

      type_of_vehicle: proposal.motor_proposal.quotation.vehicle_type,
      plate_no: proposal.motor_proposal.plateNumber,
      chassis_no: proposal.motor_proposal.chassisNo,
      engine_no: proposal.motor_proposal.engineNo,
      sum_insured: proposal.motor_proposal.quotation.sumInsured
    }

    console.log("tpPrintDatavalue is ", tpPrintData);
    console.log("proposal.motor_proposal.quotation.coverTypee ", proposal.motor_proposal.quotation.coverType)
    const monthNames = ["January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December"];

    const printMotorMultipleRiskData = {
      name_of_insured: proposal.contact.firstName + proposal.contact.middleName,
      address_of_insured: proposal.contact.city,
      policyNumber: policyNumber,
      startDate: startDateUI,
      endDate: endDateUI,
      motorInfo: [
        {
          index: 1,
          plate_no: proposal.motor_proposal.plateNumber,
          chassis_no: proposal.motor_proposal.chassisNo,
          engine_no: proposal.motor_proposal.engineNo,
          vehicle_type: proposal.motor_proposal.quotation.vehicle_type,
          cc: proposal.motor_proposal.quotation.cc,
          year_of_manufacture: new Date(proposal.motor_proposal.quotation.manufactured_date).getFullYear(),
          goods: isGood ? proposal.motor_proposal.quotation.carrying_capacity : "-",
          //passangers: proposal.motor_proposal.quotation.person_carrying_capacity,
          passangers: inperson ? proposal.motor_proposal.quotation.carrying_capacity : proposal.motor_proposal.quotation.person_carrying_capacity,
          insured_estimate: proposal.motor_proposal.quotation.sumInsured,
        },
        {
          index: 2,
          plate_no: proposal.motor_proposal.plateNumber,
          chassis_no: proposal.motor_proposal.chassisNo,
          engine_no: proposal.motor_proposal.engineNo,
          vehicle_type: proposal.motor_proposal.quotation.vehicle_type,
          cc: proposal.motor_proposal.quotation.cc,
          year_of_manufacture: new Date(proposal.motor_proposal.quotation.manufactured_date).getFullYear(),
          goods: isGood ? proposal.motor_proposal.quotation.carrying_capacity : "-",
          //passangers: proposal.motor_proposal.quotation.person_carrying_capacity,
          passangers: inperson ? proposal.motor_proposal.quotation.carrying_capacity : proposal.motor_proposal.quotation.person_carrying_capacity,
          insured_estimate: proposal.motor_proposal.quotation.sumInsured,
        }
      ],
      plate_no: proposal.motor_proposal.plateNumber,
      chassis_no: proposal.motor_proposal.chassisNo,
      engine_no: proposal.motor_proposal.engineNo,
      make_and_type: proposal.motor_proposal.quotation.coverType,
      cc: proposal.motor_proposal.quotation.cc,
      year_of_manufacture: new Date(proposal.motor_proposal.quotation.manufactured_date).getFullYear(),
      goods: isGood ? proposal.motor_proposal.quotation.carrying_capacity : "-",
      //passangers:  proposal.motor_proposal.quotation.person_carrying_capacity,
      passangers: inperson ? proposal.motor_proposal.quotation.carrying_capacity : proposal.motor_proposal.quotation.person_carrying_capacity,
      // passangers: 1 + proposal.motor_proposal.quotation.person_carrying_capacity,
      insured_estimate: proposal.motor_proposal.quotation.sumInsured,
      total_insured_estimate: proposal.motor_proposal.quotation.sumInsured,
      signed_day: new Date().getDate(),
      signed_month: monthNames[new Date().getMonth()],
      signed_year: new Date().getFullYear(),
      status: status == policyStatus.draftPolicy ? true : false

    }

    const printMotorMultipleRiskPath = await printMultipleMotorSchedule(printMotorMultipleRiskData);



    const sheetPath = await printMotorSchedule(printData);
    // console.log("schedule path", sheetPath);

    let tpSheetPath = "";


    if ((proposal.motor_proposal.quotation.coverType === MotorCoverType.thirdParty) && (proposal.motor_proposal.quotation.limitted_cover_type !== "")) {

      console.log("endorsement type ==", tpPrintData)
      console.log("endorsement type ==", quotationAddons)

      console.log("before template", quotationAddons[0]?.limitedCoverRate?.name)
      tpSheetPath = await printTpEndorsement(tpPrintData, quotationAddons, proposal.motor_proposal.quotation.MotorCoverType);

    }



    const financeOrders = await getFinance(proposal.motor_proposal.quotation.id);

    /////////////////// RECEIPT ORDER PRINT DATAS

    const ReceiptPrintData = {
      branchName: proposal.contact.branch.name,
      branchCode: proposal.contact.branch.branch_code,
      typeOfBusiness: "",
      sourceOfBusiness: proposal.contact.business_source_type,

      intermediaryName: proposal.contact.business_source,
      insuredName:
        proposal.contact.type === "Individual" ?
          (proposal.contact.firstName + " " + (proposal.contact.middleName ? proposal.contact.middleName : " ") + " " +
            (proposal.contact.lastName ? proposal.contact.lastName : " "))
          : proposal.contact.type === "Corporate" ?
            proposal.contact.companyName
            : proposal.contact.type === "Join Individual" ?
              proposal.contact.joinIndividualName
              : "",
      subCity: proposal.contact.subcity,
      woreda: proposal.contact.woreda,
      houseNo: proposal.contact.building,
      tin_no: proposal.contact.tinNumber,
      vat_reg_no: proposal.contact.vatRegistrationNumber,
      sumOfBirr: "",
      startDate: startDateUI,
      endDate: endDateUI,

      premiumType: proposal.motor_proposal.quotation.request_type,
      certificateNo: "",

      endorsementNo: "",


      checqueNo: financeOrders.sum,
      officerName: financeOrders.sum,

      customerID: proposal.contact.id,
      policyNo: policyNumber,
      claimNo: financeOrders.sum,




      sumInsured: proposal.motor_proposal.quotation.sumInsured,

      premium: proposal.motor_proposal.quotation.premium,
      fundLevy: financeOrders.tp_fund_levy,
      revenueStamp: 5,
      excessCont: financeOrders.excess_cont,
      other: financeOrders.other,
      sum: financeOrders.sum,
      vat: "",
      total: "",
      // vat : "",

      total: Number(proposal.motor_proposal.quotation.premium) + 5,

      // vat: Math.round(Number(financeOrders.premium) * 0.15 * 100) / 100,
      // total: Math.round(Number(financeOrders.premium) + Number(financeOrders.premium) * 0.15 * 100) / 100,
      status: status == policyStatus.draftPolicy ? true : false,
      fees: [],
      being: "",

    }

    console.log("proposal=========", proposal.contact.woreda)

    const certificatePrintData = {
      date_of_issuance: "April 03 2024",
      name_of_insured:
        proposal.contact.type === "Individual" ?
          (proposal.contact.firstName + " " + (proposal.contact.middleName ? proposal.contact.middleName : " ") + " " +
            (proposal.contact.lastName ? proposal.contact.lastName : " "))
          : proposal.contact.type === "Corporate" ?
            proposal.contact.companyName
            : proposal.contact.type === "Join Individual" ?
              proposal.contact.joinIndividualName
              : "",
      address: proposal.contact.region,
      city: proposal.contact.city,
      subcity: proposal.contact.subcity,
      woreda: proposal.contact.woreda,
      house_number: proposal.contact.building,
      kebele: proposal.contact.kebele,
      phone_number: proposal.contact.primaryPhone,
      plate_number: proposal.motor_proposal.plateNumber,
      engine_number: proposal.motor_proposal.engineNo,
      chasis_number: proposal.motor_proposal.chassisNo,
      vehicle_type: proposal.motor_proposal.quotation.vehicle_type,
      goods_carrying_capacity: isGood ? proposal.motor_proposal.quotation.carrying_capacity : "",
      persons_carrying_capacity: inperson ? proposal.motor_proposal.quotation.person_carrying_capacity : "",
      insurance_policy_number: policyNumber,
      policy_date_from: `${policyYear.getDate()}/${policyYear.getMonth() + 1}/${policyYear.getFullYear()}`,
      policy_date_to: `${policyYear.getDate() - 1}/${policyYear.getMonth() + 1}/${policyYear.getFullYear() + 1}`,
      conditions: 'rtfgyhj',
      entitled_to_drive: 'fcgvhb',
      insurer_name: 'fgh ghjk tgyh',
      adress_or_phone: '56789567899',
      premium_tariff: proposal.motor_proposal.quotation.premium,
      fund_tariff: 4667,
      sticker_plate_number: proposal.motor_proposal.plateNumber,
      sticker_chasis_number: proposal.motor_proposal.chassisNo,
      sticker_insurance_policy_number: policyNumber,
      sticker_policy_date_from: `${policyYear.getDate()}/${policyYear.getMonth() + 1}/${policyYear.getFullYear()}`,
      sticker_policy_date_to: `${policyYear.getDate() - 1}/${policyYear.getMonth() + 1}/${policyYear.getFullYear() + 1}`,
      sticker_insurer_name: 'fgh ghjk tgyh',
      sticker_date_of_issuance: "April 03 2024",
    }

    let certificatePath = "";
    if ((proposal.motor_proposal.quotation.coverType == MotorCoverType.thirdParty)) {
      console.log("certificatePrintData",certificatePrintData)
      certificatePath = await generateInsuranceCertificate(certificatePrintData);
      console.log("the certifictessss", certificatePath)
    }


    const proposalReciept = await Proposal.findByPk(proposal.id, {
      include: [
        {
          model: MotorProposal,
          include:
            [{
              model: Quotation,
              include:
                [{
                  model: Addons,
                  include: [
                    { model: TerritorialExtension, as: "territorialExtension" },
                    { model: CoverRate, as: "coverRate" },


                  ],
                },
                  // { model: Vehicle },
                  // { model: FinanceData }

                ]
            },
            ]
        },
        { model: Policy, include: [EndorsementFilesPath] },
        { model: Contact, include: { model: Branch } }
      ]
    })

    //
    //

    let ct = []
    if (proposalReciept.motor_proposal.quotation && proposalReciept.motor_proposal.quotation.addons) {
      let arr = []

      await Promise.all(
        proposalReciept.motor_proposal.quotation.addons.map(async (e) => {

          // 
          arr.push({ reason: e?.coverRate?.coverType, amount: formatToCurrency(e.addonPremium) })
          ct.push(e?.coverRate?.coverType)
        }
        )
      )
      // 
      ReceiptPrintData.fees = arr
    }
    let words = toWords.convert(ReceiptPrintData.total, { currency: true, currencyOptions: { name: 'ETB', plural: 'Birr',
           fractionalUnit: {
             name: 'cent',
             plural: 'cent',
           },
         }
       });
    // ReceiptPrintData.sumOfBirr = numberToWords.toWords(Number(ReceiptPrintData.total)).toUpperCase().charAt(0) + numberToWords.toWords(Number(ReceiptPrintData.total)).toUpperCase().slice(1).toLowerCase() + " " + "Birr Only"
    ReceiptPrintData.sumOfBirr = words.toUpperCase().charAt(0) + words.toUpperCase().slice(1).toLowerCase()

    // assign endorsment number to ReceiptPrintData





    ReceiptPrintData.being = ct.toString()




    printData.being = ct.toString()



    const motorMultipleRiskShedulePath = await generateMotorMultipleRiskSchedule(printMotorMultipleRiskData);
    let motorInvoicePath = "";
    console.log("count value is ", count)

    // if(count == 1 && branchManagerApprovalStatus == "Accept"){
    motorInvoicePath = await generateMotorInvoiceOrder(ReceiptPrintData);
    console.log("generated motorInvoicePath", motorInvoicePath);
    // }
    console.log("after tp endorsement")
    const wordingData = {
      office_phone: proposal.contact.branch.office_phone,
      branch_name: proposal.contact.branch.name,
      policy_no: policyNumber,
      coverType: proposal.motor_proposal.quotation.coverType,
      purpose: proposal.motor_proposal.quotation.purpose,
      status: status == policyStatus.draftPolicy ? true : false,
    }

    console.log("the wordingdata is ", wordingData)

    const income = await generateMotorWording(wordingData);
    console.log("wording path", income);


    let wordingPrintPath;
    var merger = new PDFMerger();

    var prom = income.pathes.map(async (element) => {
      await merger.add("." + element);
    });
    let policy
    Promise.all(prom).then(async function (result) {


      await merger.save("." + income.wordingPrintPath);

    });

    // if the policy is available and its status is final 

    // const allCheckPolicy = await Policy.findAll({ where: { proposalId: proposal.id }, })

    // if (allCheckPolicy.length > 0) {
    //   allCheckPolicy.forEach(async (checkPolicy) => {
    //     console.log("checkPolicy proposal.id", proposal.id)
    //     console.log("checkPolicy is ", checkPolicy)
    //     console.log("initialCoverType ==", initialCoverType)
    //     console.log("branchManagerApprovalStatus", branchManagerApprovalStatus);

    //     let createdpol;
    //     console.log("the proposal is", proposal)

    //     //THE FIRST CONDITION WILL BE
    //     //FOR THE FIRST TIME CHECKPOLICY WILL BE NULL 
    //     //SO IF IT IS COMPRHENSIVE THEN IT WILL CREATE TWICE (THE CHECKPOLICY WILL BE TRUE BUT IF THE TYPE IS COMPRHENSIVE IT WILL CREATE AGAIN)


    //     //IN THE CASE OF BRANCH APPROVAL IT SHOULDN'T BE CREATED AGAIN, RATHER IT NEEDS TO BE UPDATED
    //     // SO IF CHECKPOLICY, AND BRANCHMANAGER APPROVAL IS ACCEPT, AND IF IT IS COMPRHENSIVE
    //     //OR
    //     // IF CHECKPOLICY AND NOT COMPRHENSIVE

    //     if (checkPolicy && (initialCoverType !== MotorCoverType.comprehensive)) {
    //       //    IF THE STATUS IS ACCEPT AND COMPRHENSIVE THIS FUNCTION SHOULD BE MODIFIED
    //       // const updatedPolicyNumber = updateGeneratedPolicyNumber(checkPolicy);
    //       console.log("duplicated and not comprhensive", new Date(`${policyYear.getDate() - 1},${policyYear.getMonth() + 1},${policyYear.getFullYear() + 1}`))

    //       const newPolicy = {
    //         policyNumber: checkPolicy.policyNumber,
    //         // policyNumber: updatedPolicyNumber,
    //         fullName: name,
    //         proposalId: proposal.id,
    //         premium: proposal.motor_proposal.quotation.premium,
    //         policyStatus: status,
    //         financeStatus: financeStatus.receiptOrder,
    //         policyIssuedDate: new Date(),
    //         policyEndDate: new Date(policyYear.getFullYear() + 1, policyYear.getMonth(), policyYear.getDate() - 1),
    //         scheduleSheetPath: sheetPath,
    //         tpEndorsementSheetPath: tpSheetPath,
    //         multipleSchedulePath: printMotorMultipleRiskPath,
    //         branchManagerApprovalStatus: branchManagerApprovalStatus

    //       };
    //       await Policy.update(newPolicy, {
    //         where: { id: checkPolicy.id },
    //       }
    //       ).then(async (policy) => {
    //         if (proposal.motor_proposal.quotation.coverType === MotorCoverType.ownDamage) {
    //           const endorsement = await UpdateEndorsementByProposal(proposal.id, policyNumber, checkPolicy.id, status, branchManagerApprovalStatus)
    //           if (endorsement == -1) {
    //             return -1
    //           }
    //         }

    //       })

    //       policy = checkPolicy
    //       createdpol = checkPolicy
    //     }
    //     // if (checkPolicy) {
    //     else if (checkPolicy && (branchManagerApprovalStatus == "Accept") && (initialCoverType == MotorCoverType.comprehensive)) {
    //       //    IF THE STATUS IS ACCEPT AND COMPRHENSIVE THIS FUNCTION SHOULD BE MODIFIED
    //       // const updatedPolicyNumber = updateGeneratedPolicyNumber(checkPolicy);
    //       console.log("comprhensive branch approval", new Date(`${policyYear.getDate() - 1},${policyYear.getMonth() + 1},${policyYear.getFullYear() + 1}`))

    //       const newPolicy = {
    //         policyNumber: checkPolicy.policyNumber,
    //         // policyNumber: updatedPolicyNumber,
    //         fullName: name,
    //         proposalId: proposal.id,
    //         premium: proposal.motor_proposal.quotation.premium,
    //         policyStatus: status,
    //         financeStatus: financeStatus.receiptOrder,
    //         policyIssuedDate: new Date(),
    //         policyEndDate: new Date(policyYear.getFullYear() + 1, policyYear.getMonth(), policyYear.getDate() - 1),
    //         scheduleSheetPath: sheetPath,
    //         tpEndorsementSheetPath: tpSheetPath,
    //         multipleSchedulePath: printMotorMultipleRiskPath,
    //         branchManagerApprovalStatus: branchManagerApprovalStatus,
    //         policyType: proposal.motor_proposal.quotation.coverType
    //         // proposal.motorProposalId === 0 ? 'fire' : 'motor'
    //       };
    //       console.log("the poposlas", newPolicy)
    //       await Policy.update(newPolicy, {
    //         where: { id: checkPolicy.id },
    //       }
    //       ).then(async (policy) => {
    //         createdpol = policy;
    //         if (proposal.motor_proposal.quotation.coverType === MotorCoverType.ownDamage) {
    //           const endorsement = await UpdateEndorsementByProposal(proposal.id, policyNumber, checkPolicy.id, status, branchManagerApprovalStatus)
    //           if (endorsement == -1) {
    //             return -1
    //           }
    //         }

    //       })

    //       policy = checkPolicy
    //       createdpol = checkPolicy
    //     }

    //     else {
    //       console.log("datev ==", new Date(policyYear.getFullYear() + 1, policyYear.getMonth(), policyYear.getDate() - 1))
    //       const newPolicy = {
    //         policyNumber: policyNumber,
    //         fullName: name,
    //         proposalId: proposal.id,
    //         premium: proposal.motor_proposal.quotation.premium,
    //         policyStatus: status,
    //         financeStatus: financeStatus.receiptOrder,
    //         policyIssuedDate: new Date(),
    //         policyEndDate: new Date(policyYear.getFullYear() + 1, policyYear.getMonth(), policyYear.getDate() - 1),
    //         scheduleSheetPath: sheetPath,
    //         multipleSchedulePath: printMotorMultipleRiskPath,
    //         policyType: proposal.motor_proposal.quotation.coverType,
    //         tpEndorsementSheetPath: tpSheetPath,
    //         branchManagerApprovalStatus: branchManagerApprovalStatus

    //       };


    //       try {
    //         policy = await Policy.create(newPolicy).then(async (createdPolicy) => {
    //           createdpol = createdPolicy

    //           if (proposal.motor_proposal.quotation.coverType === MotorCoverType.ownDamage) {
    //             const endorsement = await createEndorsementByProposal(proposal.id, policyNumber, createdPolicy.id, status, branchManagerApprovalStatus)
    //             if (endorsement == -1) {
    //               return -1
    //             }
    //           }

    //           else {
    //             return createdPolicy
    //           }

    //         });
    //       } catch (error) {
    //         console.log("error while creating policy", error);
    //         res.status(500).json({ msg: error.message });

    //       }




    //     }

    //     console.log("createdpol", createdpol)

    //     const policyEndorsements = await EndorsementFilesPath.findAndCountAll({
    //       where: {
    //         PolicyId: createdpol.id
    //       },
    //       raw: true
    //     })


    //     const draftPolicypath = "/print_files/policy/" + Date.now() + "draft" + ".pdf";

    //     const policyWordingPath = income.wordingPrintPath;

    //     let policyDraftPathes = [
    //       policyWordingPath,
    //       motorInvoicePath,
    //       sheetPath,
    //     ]

    //     if (tpSheetPath !== "") {
    //       policyDraftPathes.push(tpSheetPath)
    //     }


    //     if (policyEndorsements.length !== 0) {
    //       policyEndorsements.rows.forEach(endorsement => {
    //         policyDraftPathes.push(endorsement.filePath)
    //       });
    //     }
    //     var mergerDraftPolicy = new PDFMerger();
    //     // var promDraft;

    //     // Promise.all(policyDraftPathes).then(async function (result) {
    //     const promDraft = policyDraftPathes.map(async (element) => {

    //       await mergerDraftPolicy.add("." + element);
    //       // const fileExists = checkFileExists(element);
    //       // if (fileExists) {
    //       //   const content = fs.readFileSync(element, 'utf-8');
    //       //   if (content !== null) {
    //       //     
    //       //     await mergerDraftPolicy.add("." + element);
    //       //   }

    //       // }

    //     });
    //     // })



    //     let finalDraftPath;

    //     Promise.all(promDraft).then(async function (result) {

    //       await mergerDraftPolicy.save("." + draftPolicypath);

    //     })


    //     console.log("pathes",
    //       "scheduleSheetPath", sheetPath,
    //       "receiptOrderSheetPath", motorInvoicePath,
    //       "wordingSheetPath", income.wordingPrintPath,
    //       "policySheetPath", draftPolicypath)

    //     const proposalPath = await Policy.update(
    //       {
    //         scheduleSheetPath: sheetPath,
    //         receiptOrderSheetPath: motorInvoicePath,
    //         wordingSheetPath: income.wordingPrintPath,
    //         policySheetPath: draftPolicypath,
    //         multiplePolicyId: multPolicyId,
    //         tpEndorsementSheetPath: tpSheetPath
    //       },
    //       { where: { id: createdpol.id } }
    //     );
    //   });
    // }
    // else {
      const checkPolicy = await Policy.findOne({ where: { proposalId: proposal.id , policyType : proposal.motor_proposal.quotation.coverType}, })

        console.log("checkPolicy proposal.id", proposal.id)
        console.log("checkPolicy is ", checkPolicy)
        console.log("initialCoverType ==", initialCoverType)
        console.log("branchManagerApprovalStatus", branchManagerApprovalStatus);

        let createdpol;
        console.log("the proposal is", proposal)

        //THE FIRST CONDITION WILL BE
        //FOR THE FIRST TIME CHECKPOLICY WILL BE NULL 
        //SO IF IT IS COMPRHENSIVE THEN IT WILL CREATE TWICE (THE CHECKPOLICY WILL BE TRUE BUT IF THE TYPE IS COMPRHENSIVE IT WILL CREATE AGAIN)


        //IN THE CASE OF BRANCH APPROVAL IT SHOULDN'T BE CREATED AGAIN, RATHER IT NEEDS TO BE UPDATED
        // SO IF CHECKPOLICY, AND BRANCHMANAGER APPROVAL IS ACCEPT, AND IF IT IS COMPRHENSIVE
        //OR
        // IF CHECKPOLICY AND NOT COMPRHENSIVE

        if (checkPolicy && (initialCoverType !== MotorCoverType.comprehensive)) {
          //    IF THE STATUS IS ACCEPT AND COMPRHENSIVE THIS FUNCTION SHOULD BE MODIFIED
          // const updatedPolicyNumber = updateGeneratedPolicyNumber(checkPolicy);
          console.log("duplicated and not comprhensive")

          const newPolicy = {
            policyNumber: checkPolicy.policyNumber,
            // policyNumber: updatedPolicyNumber,
            fullName: name,
            proposalId: proposal.id,
            premium: proposal.motor_proposal.quotation.premium,
            policyStatus: status,
            financeStatus: financeStatus.receiptOrder,
            policyIssuedDate: new Date(),
            policyEndDate: new Date(policyYear.getFullYear() + 1, policyYear.getMonth(), policyYear.getDate() - 1),
            scheduleSheetPath: sheetPath,
            tpEndorsementSheetPath: tpSheetPath,
            multipleSchedulePath: printMotorMultipleRiskPath,
            certificateSheetPath: certificatePath,
            branchManagerApprovalStatus: branchManagerApprovalStatus,

          };
          await Policy.update(newPolicy, {
            where: { id: checkPolicy.id },
          }
          ).then(async (policy) => {
            if (proposal.motor_proposal.quotation.coverType === MotorCoverType.ownDamage) {
              const endorsement = await UpdateEndorsementByProposal(proposal.id, policyNumber, checkPolicy.id, status, branchManagerApprovalStatus)
              if (endorsement == -1) {
                return -1
              }
            }

          })

          policy = checkPolicy
          createdpol = checkPolicy
        }
        // if (checkPolicy) {
        else if (checkPolicy && (branchManagerApprovalStatus == "Accept") && (initialCoverType == MotorCoverType.comprehensive)) {
          //    IF THE STATUS IS ACCEPT AND COMPRHENSIVE THIS FUNCTION SHOULD BE MODIFIED
          // const updatedPolicyNumber = updateGeneratedPolicyNumber(checkPolicy);
          console.log("comprhensive branch approval", new Date(`${policyYear.getDate() - 1},${policyYear.getMonth() + 1},${policyYear.getFullYear() + 1}`))

          const newPolicy = {
            policyNumber: checkPolicy.policyNumber,
            // policyNumber: updatedPolicyNumber,
            fullName: name,
            proposalId: proposal.id,
            premium: proposal.motor_proposal.quotation.premium,
            policyStatus: status,
            financeStatus: financeStatus.receiptOrder,
            policyIssuedDate: new Date(),
            policyEndDate: new Date(policyYear.getFullYear() + 1, policyYear.getMonth(), policyYear.getDate() - 1),
            scheduleSheetPath: sheetPath,
            tpEndorsementSheetPath: tpSheetPath,
            multipleSchedulePath: printMotorMultipleRiskPath,
            certificateSheetPath: certificatePath,
            branchManagerApprovalStatus: branchManagerApprovalStatus,
            policyType: proposal.motor_proposal.quotation.coverType
            // proposal.motorProposalId === 0 ? 'fire' : 'motor'
          };
          console.log("the poposlas", newPolicy)
          await Policy.update(newPolicy, {
            where: { id: checkPolicy.id },
          }
          ).then(async (policy) => {
            createdpol = policy;
            if (proposal.motor_proposal.quotation.coverType === MotorCoverType.ownDamage) {
              const endorsement = await UpdateEndorsementByProposal(proposal.id, policyNumber, checkPolicy.id, status, branchManagerApprovalStatus)
              if (endorsement == -1) {
                return -1
              }
            }

          })

          policy = checkPolicy
          createdpol = checkPolicy
        }

        else {
          console.log("datev ==", new Date(policyYear.getFullYear() + 1, policyYear.getMonth(), policyYear.getDate() - 1))
          const newPolicy = {
            policyNumber: policyNumber,
            fullName: name,
            proposalId: proposal.id,
            premium: proposal.motor_proposal.quotation.premium,
            policyStatus: status,
            financeStatus: financeStatus.receiptOrder,
            policyIssuedDate: new Date(),
            policyEndDate: new Date(policyYear.getFullYear() + 1, policyYear.getMonth(), policyYear.getDate() - 1),
            scheduleSheetPath: sheetPath,
            multipleSchedulePath: printMotorMultipleRiskPath,
            policyType: proposal.motor_proposal.quotation.coverType,
            tpEndorsementSheetPath: tpSheetPath,
            certificateSheetPath: certificatePath,
            branchManagerApprovalStatus: branchManagerApprovalStatus

          };


          try {
            policy = await Policy.create(newPolicy).then(async (createdPolicy) => {
              createdpol = createdPolicy

              if (proposal.motor_proposal.quotation.coverType === MotorCoverType.ownDamage) {
                const endorsement = await createEndorsementByProposal(proposal.id, policyNumber, createdPolicy.id, status, branchManagerApprovalStatus)
                if (endorsement == -1) {
                  return -1
                }
              }

              else {
                return createdPolicy
              }

            });
          } catch (error) {
            console.log("error while creating policy", error);
            res.status(500).json({ msg: error.message });

          }




        }

        console.log("createdpol", createdpol)

        const policyEndorsements = await EndorsementFilesPath.findAndCountAll({
          where: {
            PolicyId: createdpol.id
          },
          raw: true
        })


        const draftPolicypath = "/print_files/policy/" + Date.now() + "draft" + ".pdf";

        const policyWordingPath = income.wordingPrintPath;

        let policyDraftPathes = [
          policyWordingPath,
          motorInvoicePath,
          sheetPath,
        ]

        if (tpSheetPath !== "") {
          policyDraftPathes.push(tpSheetPath)
        }else if (certificatePath !== "") {
          policyDraftPathes.push(certificatePath)
        }


        if (policyEndorsements.length !== 0) {
          policyEndorsements.rows.forEach(endorsement => {
            policyDraftPathes.push(endorsement.filePath)
          });
        }
        var mergerDraftPolicy = new PDFMerger();
        // var promDraft;

        // Promise.all(policyDraftPathes).then(async function (result) {
        const promDraft = policyDraftPathes.map(async (element) => {

          await mergerDraftPolicy.add("." + element);
          // const fileExists = checkFileExists(element);
          // if (fileExists) {
          //   const content = fs.readFileSync(element, 'utf-8');
          //   if (content !== null) {
          //     
          //     await mergerDraftPolicy.add("." + element);
          //   }

          // }

        });
        // })



        let finalDraftPath;

        Promise.all(promDraft).then(async function (result) {

          await mergerDraftPolicy.save("." + draftPolicypath);

        })


        console.log("pathes",
          "scheduleSheetPath", sheetPath,
          "receiptOrderSheetPath", motorInvoicePath,
          "wordingSheetPath", income.wordingPrintPath,
          "policySheetPath", draftPolicypath,
          "certificatePath", certificatePath,
          "policyDraftPathes", policyDraftPathes)

        const proposalPath = await Policy.update(
          {
            scheduleSheetPath: sheetPath,
            receiptOrderSheetPath: motorInvoicePath,
            wordingSheetPath: income.wordingPrintPath,
            policySheetPath: draftPolicypath,
            multiplePolicyId: multPolicyId,
            tpEndorsementSheetPath: tpSheetPath,
            certificateSheetPath: certificatePath,
          },
          { where: { id: createdpol.id } }
        );
      // }
    

    // const finalDraftPath = await merger.save("." + draftPolicypath);


    return true
  }
  catch (error) {
    console.log("error occured ==", error)
    return -1
  }
}

const generatePolicyNumber = async (proposalid, quotationProposal) => {
  let policyNumber;
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



  let lastPolicyNumber = await Policy.findOne({
    order: [["id", "DESC"]], where: {
      "$proposal.motorProposalId$": {
        [Op.not]: 0
      }
    }, include: [{ model: Proposal }]
  });

  if (quotation) {

    if (quotation.coverType === MotorCoverType.thirdParty) {
      if (quotation.purpose === purposes.private) {
        coding = 'MTP';
      } else if (quotation.purpose === purposes.commercial) {
        coding = 'MTC';
      }
    }
    else {
      if (quotation.purpose === purposes.commercial) {
        coding = 'MCM';
      } else if (quotation.purpose === purposes.private) {
        coding = 'MPR';
      }
    }
  }


  if (lastPolicyNumber == null || !lastPolicyNumber.policyNumber) {
    if (lastPolicyNumber.policyNumber == null || lastPolicyNumber.policyNumber == '') {
      lastPolicyNumber = { id: 0 };
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

  return policyNumber;
}

const getFinance = async (quotationId) => {

  try {


    const onReceiptOrder = await Policy.findAll(
      {
        where: { financeStatus: financeStatus.receiptOrder },
        include: [
          {
            model: Proposal, include: [
              {
                model: MotorProposal, include: [
                  {
                    model: Quotation, include: [
                      {
                        model: FinanceData
                      }
                    ]
                  }
                ]
              }
            ]
          }
        ],
        raw: true
      },
    )

    const finance = await FinanceData.findOne({ where: { quotationId: quotationId } })

    // .then(function (finance) {
    //   

    if (!finance) {
      return { message: "No Data Found" };
    } else if (finance) {
      return finance;
    }
    // });
  } catch (error) {
    return { msg: error.message };
  }
};

const generateMultiplePolicy = async (proposal, status, branchManagerApprovalStatus, multipleProposalId) => {
  console.log("insinde gmp  ==")

  try {
    // proposal.motor_proposal.quotation

    const allProposals = await Proposal.findAll({
      where: {
        multipleProposalId: proposal.multipleProposalId,
        motorProposalId: { [Op.not]: 0 }
      },
      include: [{ model: Contact, include: { model: Branch } }, { model: MotorProposal, include: { model: Quotation } }],
    })

    // console.log("all proposal==", allProposals)

    allProposals.forEach(async (proposal) => {
      let message;
      if (proposal.motor_proposal.quotation.coverType === MotorCoverType.comprehensive) {
        let initialCoverType = proposal.motor_proposal.quotation.coverType
        message = "its comprhensive"
        let name;
        if (proposal.motor_proposal.quotation.company_name !== "") {
          name = proposal.motor_proposal.quotation.company_name;

        } else if (proposal.motor_proposal.quotation.join_individual_name !== "") {
          name = proposal.motor_proposal.quotation.join_individual_name;

        } else {
          name = proposal.motor_proposal.quotation.owner_first_name + " " + proposal.motor_proposal.quotation.owner_middle_name + " " + proposal.motor_proposal.quotation.owner_last_name;

        }
        let multPolicy = null;

        if (branchManagerApprovalStatus == "Pending") {
          try {
            multPolicy = await MultiplePolicy.create({
              number_of_policies: 2,
              is_motor: true,
              requested_by: name,
              cover_type: initialCoverType,
              status: status,
              proposalId: proposal.id
            })

          } catch (err) {
            console.log("multPolicy error", err);
          }
        }

        proposal.motor_proposal.quotation.coverType = MotorCoverType.ownDamage;

        let policyOD;
        let policyTP;
        let counter = 1;

        await Promise.all(proposal.motor_proposal.quotation.coverType).then(async function (response) {
          policyOD = await generateDraftPolicy(proposal, status, branchManagerApprovalStatus, initialCoverType, multPolicy?.id, counter);

          console.log("policyOD", policyOD)

        })

        console.log("middle");

        proposal.motor_proposal.quotation.coverType = MotorCoverType.thirdParty;
        counter = 2;

        await Promise.all(proposal.motor_proposal.quotation.coverType).then(async function (response) {

          console.log("tp promise")
          policyTP = await generateDraftPolicy(proposal, status, branchManagerApprovalStatus, initialCoverType, multPolicy?.id, counter);

          console.log("policyTP", policyTP)

        })

      }
      else {
        message = "its not comprhensive"
        let initialCoverType = proposal.motor_proposal.quotation.coverType

        // await Promise.all(proposal.motor_proposal.quotation.owner_first_name).then(async function (response) {
        // console.log("proposal.motor_proposal.quotation ==", proposal.motor_proposal.quotation)
        let name;
        if (proposal.motor_proposal.quotation.company_name !== "") {
          name = proposal.motor_proposal.quotation.company_name;

        } else if (proposal.motor_proposal.quotation.join_individual_name !== "") {
          name = proposal.motor_proposal.quotation.join_individual_name;

        } else {
          name = proposal.motor_proposal.quotation.owner_first_name + " " + proposal.motor_proposal.quotation.owner_middle_name + " " + proposal.motor_proposal.quotation.owner_last_name;

        }

        let singlePolicy = null;

        console.log("branch manager approval status", branchManagerApprovalStatus);

        if (branchManagerApprovalStatus == "Pending") {
          try {
            singlePolicy = await MultiplePolicy.create({
              number_of_policies: 1,
              is_motor: true,
              requested_by: name,
              cover_type: initialCoverType,
              status: status,
              proposalId: proposal.id
            })

            console.log("singlePolicy ==", singlePolicy);


          } catch (err) {
            console.log("singlePolicy error", err);
          }
        }




        // })
        const policy = await generateDraftPolicy(proposal, status, branchManagerApprovalStatus, "", singlePolicy?.id);

      }

      console.log("the ct is ==", proposal.motor_proposal.quotation.coverType);

      console.log("message ==", message);
    });

    // return policy;
  }
  catch (error) {
    console.log("error-------", error)
    return -1
  }

}

const getPolicyByContactId = async (req, res) => {
  const contactId = req.params.id;



  try {
    // Call the getProposalByContactId function and pass contactId
    const proposal = await getProposalByContactIdInternal(contactId);

    // Check if a proposal was found
    if (proposal) {
      // Use the proposal to find the associated policy
      const policy = await getPolicyByProposalIdInternal(proposal.id);

      if (policy) {
        // Return the policy
        res.status(200).json(policy);
      } else {
        res.status(404).json({ msg: "Policy not found for this proposal" });
      }
    } else {
      res.status(404).json({ msg: "Proposal for this contact not found" });
    }
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

// Internal function to get a proposal by contactId
const getProposalByContactIdInternal = async (contactId) => {
  try {
    const proposal = await Proposal.findOne({
      where: {
        contactId: contactId,
      },
    });

    return proposal;
  } catch (error) {
    throw error;
  }
};

// Internal function to get a policy by proposalId
const getPolicyByProposalIdInternal = async (proposalId) => {
  try {
    const policy = await Policy.findOne({
      where: {
        proposalId: proposalId,
      },
    });

    return policy;
  } catch (error) {
    throw error;
  }
};


module.exports = {
  generateDraftPolicy,
  getPolicy,
  createPolicy,
  getPolicyByPk,
  editPolicy,
  deletePolicy,
  getFinance,
  generateMultiplePolicy,
  generatePolicyNumber,
  getPolicyByContactId,
  getMultiplePolicy,
  PolicyPayed,
};
