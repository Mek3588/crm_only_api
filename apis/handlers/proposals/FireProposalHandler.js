const numberToWords = require('number-to-words');
const User = require("../../../models/acl/user");
const Branch = require("../../../models/Branch");
const Partner = require("../../../models/partner/Partner");
const FireRate = require("../../../models/fire/FireRate");
const FireRateCategory = require("../../../models/fire/FireRateCategory");
const FireProposal = require("../../../models/proposals/FireProposal");
const { Op } = require("sequelize");
const FireQuotation = require("../../../models/fire/FireQuotation");
const { printPdf, printPdfLandScape, formatToCurrency, convertFlattenedToNested, getIpAddress, createEventLog, generateNumber } = require("../../../utils/GeneralUtils");
var fs = require("fs");
const path = require("path");
const FireAlliedPerilsRate = require("../../../models/fire/FireAlliedPerilsRate");
const moment = require("moment");
const {
  isActionPrivileged,
  privilegeObjects,
  privilegeActions,
  getGrantedPrivileges,
  Role,
  propertyInsurances,
  MotorCoverType,
  purposes,
  classOfBusiness,
  eventResourceTypes,
  eventActions,
  ContactType,
  policyStatus,
  financeStatus
} = require("../../../utils/constants");
const {
  canUserRead,
  canUserCreate,
  canUserEdit,
  canUserAccessOnlySelf,
  canUserAccessOnlyBranch,
  canUserDelete,
} = require("../../../utils/Authrizations");
const Employee = require("../../../models/Employee");
const ReInsurance = require("../../../models/proposals/ReInsurance");
const PDFMerger = require("pdf-merger-js");
const { alliedPerilsList } = require("../../../utils/fireQuotationConstants");
const Policy = require("../../../models/Policy");
const Contact = require("../../../models/Contact");
const Proposal = require("../../../models/proposals/Proposal");
const Opportunity = require("../../../models/Opportunity");
const EndorsementFilesPath = require("../../../models/endorsement/EndorsementFilesPath");
const FireApplicableWarranty = require("../../../models/fire/FireApplicableWarrantys");
const FireWarranty = require("../../../models/fire/FireWarranty");
const fire_rate_categories = require("../../../models/fire/FireRateCategory");
const MultipleProposal = require('../../../models/MultipleProposal');
const MultiplePolicy = require('../../../models/MultiplePolicy');


// Read HTML Template
var html = fs.readFileSync(
  path.join(__dirname, "./../../../templates/FireProposalPrintout.html"),
  "utf8"
);
var html2 = fs.readFileSync(
  path.join(__dirname, "./../../../templates/ReceiptOrderTemplate.html"),
  "utf8"
);

var certificateOfInsuranceTemplate = fs.readFileSync(
  path.join(__dirname, "./../../../templates/CertificateOfInsurace.html"),
  "utf8"
);

var privateVehicleTemplate = fs.readFileSync(
  path.join(__dirname, "./../../../templates/privateMotorPolicy.html"),
  "utf8"
);

var commercialVehicleTemplate = fs.readFileSync(
  path.join(__dirname, "./../../../templates/CommercialMotorPolicy.html"),
  "utf8"
);

var thirdPartyTemplate = fs.readFileSync(
  path.join(__dirname, "./../../../templates/TpPolicy.html"),
  "utf8"
);

var fireScheduleTemplate = fs.readFileSync(
  path.join(__dirname, "./../../../templates/FireScheduleTemplate.html"),
  "utf8"
);

var fireWarrantyTemplate = fs.readFileSync(
  path.join(__dirname, "./../../../templates/fire/fire-warranty-template.html"),
  "utf8"
);

var firePolicyWordingTemplate = fs.readFileSync(
  path.join(__dirname, "./../../../templates/fire/policy/fire-insurance-policy-template.html"),
  "utf8"
);

var motorMultipleRiskTemplate = fs.readFileSync(
  path.join(__dirname, "./../../../templates/MotorMultipleRiskScheduleTemplate.html"),
  "utf8"
);


const getSearch = (st) => {
  return {
    [Op.or]: [
      // {
      //   proposal_no: {
      //     [Op.like]: "%" + st + "%",
      //   },
      // },
      {
        firstName: {
          [Op.like]: "%" + st + "%",
        },
      },
      {
        middleName: {
          [Op.like]: "%" + st + "%",
        },
      },
      {
        lastName: {
          [Op.like]: "%" + st + "%",
        },
      },
      {
        primaryEmail: {
          [Op.like]: "%" + st + "%",
        },
      },
      {
        primaryPhone: {
          [Op.like]: "%" + st + "%",
        },
      },
      {
        country: {
          [Op.like]: "%" + st + "%",
        },
      },
      {
        purpose: {
          [Op.like]: "%" + st + "%",
        },
      },
    ],
  };
};

const getFireProposal = async (req, res) => {
  const currentUser = await User.findByPk(req.user.id, {
    include: [Employee],
  });
  try {
    const { f, r, st, sc, sd } = req.query;
    if (req.type === 'all') {
      const data = await FireProposal.findAndCountAll({
        include: [
          FireRate,
          FireRateCategory,
          FireQuotation,
          // { model: User, as: "owner" },
          // Branch,
        ],
        offset: Number(f),
        limit: Number(r),
        order: [[sc || "createdAt", sd == 1 ? "DESC" : "ASC"]],
        // where: getSearch(st),
      });
      res.status(200).json(data);
    } else if (req.type === 'self') {
      const data = await FireProposal.findAndCountAll({
        include: [
          FireRate,
          FireRateCategory,
          FireQuotation,
          { model: User, as: "owner" },
          Branch,
        ],
        offset: Number(f),
        limit: Number(r),
        order: [[sc || "createdAt", sd == 1 ? "DESC" : "ASC"]],
        where: getSearch(st),
        where: {
          ownerId: req.user ? req.user.id : 0,
        },
      });
      res.status(200).json(data);
    } else if (req.type == "customer") {
      const newProposal = await Proposal.findAndCountAll({
        offset: Number(f),
        limit: Number(r),

        order: [[sc || "createdAt", sd == 1 ? "DESC" : "ASC"]],

        subQuery: false,
        where: {
          [Op.and]: [
            {
              [Op.or]: [
                { userId: { [Op.like]: `%${currentUser.id}%` } },
                //{ assignedTo: { [Op.like]: `%${currentUser.id}%` } },
              ],
            },
            getSearch(st),
          ],
        },
        include: [
          {
            model: User,
            attributes: [
              "id",
              "corporate_name",
              "first_name",
              "middle_name",
              "last_name",
              "email",
              "phone",
              "gender",
            ],
            include: [Employee],
          },
          {
            model: Contact,
            include: [
              {
                model: User,
                as: "assignedUser",
                attributes: [
                  "id",
                  "corporate_name",
                  "first_name",
                  "middle_name",
                  "last_name",
                  "email",
                  "phone",
                  "gender",
                ],
              },
              Branch,
            ],
          },

          {
            model: FireProposal,
            include: [FireQuotation]
          },
        ],
      });

      res.status(200).json(newProposal);
    } else if (req.type == "branch") {
      let employee = await Employee.findOne({ where: { userId: req.user.id } });
      let branchId = employee.branchId;
      const data = await FireProposal.findAndCountAll({
        include: [
          FireRate,
          FireRateCategory,
          FireQuotation,
          // { model: User, as: "owner" },
          // Branch,
        ],
        offset: Number(f),
        limit: Number(r),
        order: [[sc || "createdAt", sd == 1 ? "DESC" : "ASC"]],
        where: getSearch(st),
        where: {
          branchId: branchId,
        },
      });
      res.status(200).json(data);
    }
  } catch (error) {
    res.status(404).json({ msg: error.message });
  }
};

const getAllFireProposals = async (req, res) => {
  try {
    const data = await FireProposal.findAndCountAll({
      include: [
        FireRate,
        FireRateCategory,
        FireQuotation,
        { model: User, as: "owner" },
        Branch,
      ],
      order: [[sc || "createdAt", sd == 1 ? "ASC" : "DESC"]],
    });
    res.status(200).json(data);
  } catch (error) {
    res.status(404).json({ msg: error.message });
  }
};

//posting


const createFireProposal = async (req, res) => {
  let proposal;
  let newProposal;
  try {
    proposal = convertFlattenedToNested(req.body);



    // const proposalCreated = await Proposal.findOne({ include: [{ model: FireProposal, where: { fireQuotationId: proposal.fire_proposal.fireQuotationId } }] });

    // if (proposalCreated) {
    //   return res.status(409).json({ msg: "You have already created this proposal!!" });
    // }
    const startDate = new Date();
    const branch = await Branch.findByPk(proposal.contact.branchId);
    const proposal_no =
      "ZI/" +
      branch.short_code +
      "/FREP/" +
      startDate.getFullYear() +
      "" +
      startDate.getMonth() +
      "" +
      startDate.getDate() +
      "" +
      startDate.getUTCHours() +
      "" +
      startDate.getMinutes() +
      "" +
      startDate.getUTCMilliseconds()


    proposal.proposalNo = proposal_no  //
    const printPath = await printFireProposal(proposal);
    const scheduleDocPath = await generateScheduleDoc(proposal, proposal_no, branch);
    proposal.fire_proposal.printPath = printPath;
    const firequotation = await FireQuotation.findByPk(proposal.fire_proposal.fireQuotationId);
    const today = new Date();

    const firecategory = await fire_rate_categories.findOne({
      where: {
        id: firequotation.categoryId
      },
    });

    let { fire_proposal } = proposal;
    if (req.files["fire_proposal.idImage"])
      fire_proposal.idImage = req.files["fire_proposal.idImage"][0]
        ? "/uploads/fireProposal/" +
        req.files["fire_proposal.idImage"][0].filename
        : "";
    if (req.files["fire_proposal.videoFootage"])
      fire_proposal.videoFootage = req.files["fire_proposal.videoFootage"][0]
        ? "/uploads/fireProposal/" +
        req.files["fire_proposal.videoFootage"][0].filename
        : "";
    if (req.files["fire_proposal.document"])
      fire_proposal.document = req.files["fire_proposal.document"][0]
        ? "/uploads/fireProposal/" +
        req.files["fire_proposal.document"][0].filename
        : "";
    if (req.files["withholdingDocument"])
      proposal.withholdingDocument = req.files[
        "withholdingDocument"
      ][0]
        ? "/uploads/fireProposal/" +
        req.files["withholdingDocument"][0].filename
        : "";
    if (req.files["tot"])
      req.tot = req.files["tot"][0]
        ? "/uploads/fireProposal/" +
        req.files["tot"][0].filename
        : "";
    if (req.files['noClaim'])
      proposal.withholdingDocument = req.files['noClaim'][0] ? "/uploads/fireProposal/" + req.files['noClaim'][0].filename : "";

    const phone = proposal.contact.primaryPhone;
    let { contact } = proposal;
    const riApproval = await ReInsurance.findOne({
      where: {
        Category: firecategory.name || 'residential',
        activeFromDate: { [Op.lte]: today },
        activeUntilDate: { [Op.gte]: today },
      },
    });
    if (!riApproval) {
      console.error("Reapproval not set for this category");
    } else {
      const riApprovalName = riApproval.category;
      const fireCategoryName = firecategory.name;

      if (riApprovalName === fireCategoryName) {
        proposal.specialApproval = riApproval.amount >= firequotation.premium ? "Approved" : "Pending";
      }
    }








    contact.status = "accounts";
    contact.deleted = false;
    contact.memberOf == "null" ? null : contact.memberOf;
    contact.primaryPhone = `${contact.primaryPhone}`;
    contact.secondaryPhone == 0 || contact.secondaryPhone == "0"
      ? null
      : `+${contact.secondaryPhone}`;

    contact.secondaryEmail == 0 || contact.secondaryEmail == "0"
      ? null
      : contact.secondaryEmail;
    // notNull Violation: contacts.business_source_type cannot be null, notNull Violation: contacts.business_source cannot be null

    proposal.userId = req.user.id;
    // 

    const multipleProposal = await MultipleProposal.create({
      requested_by: contact.firstName ? contact.firstName : "",
      number_of_proposal: 1,
      is_fire: true
    });

    proposal.multipleProposalId = multipleProposal.id;

    const nwContact = proposal.contact;

    const contacts = proposal.contact.id
      ? await Contact.findOne({ where: { id: proposal.contact.id } })
      : null;

    if (contacts == null) {

      //conversion_date
      newProposal = await Proposal.create(proposal, {
        include: [{ model: Contact }, FireProposal],
      }).then((newProposal) => {
        const opportunity = {
          subject: "Proposal submitted",
          userId: 0,
          accountId: newProposal.id,
          assignedTo: contact.assignedTo || req.user.id,
          probablity: 80,
        };
        const opp = Opportunity.create(opportunity);
        return newProposal;
      });
    } else {

      const updatedContact = await Contact.update(nwContact, {
        where: { id: contact.id },
      });
      const opportunity = {
        subject: "Proposal submitted",
        accountId: updatedContact,
        userId: 0,
        probablity: 80,
        assignedTo: contact.assignedTo || req.user.id,
      };
      proposal.contactId = contact.id;
      newProposal = await Proposal.create(proposal, {
        include: [FireProposal],
      }).then(async (prop) => {
        const opp = await Opportunity.create(opportunity);
        return prop;
      });
    }

    // const newmo = await MotorProposal.create(proposal.fireProposal)

    const finalProposal = await Proposal.findByPk(newProposal.id, {
      include: [FireProposal, Contact],
    });
    let ipAddress = getIpAddress(req.ip);
    const eventLog = await createEventLog(
      req.user.id,
      eventResourceTypes.proposal,
      finalProposal.Contact == "Corporate"
        ? finalProposal.Contact.companyName
        : finalProposal.Contact == "Join Individual"
          ? finalProposal.Contact.joinIndividualName
          : finalProposal.Contact == "Individual"
            ? finalProposal.Contact.firstName
            : "",
      finalProposal.id,
      eventActions.create,
      "",
      ipAddress
    );
    res.status(200).json(finalProposal);
  } catch (error) {

    res.status(400).json({ msg: error.message });
  }
};
// const createFireProposal = async (req, res) => {
//   const fireProposalBody = req.body;
//   try {
//     const startDate = new Date();
//     const branch = await Branch.findByPk(fireProposalBody.branchId);
//     const proposal_no =
//       "ZI/" +
//       branch.name[0] +
//       branch.name[1] +
//       "/FREP/" +
//       startDate.getFullYear() +
//       "" +
//       startDate.getMonth() +
//       "" +
//       startDate.getDate() +
//       "" +
//       startDate.getUTCHours() +
//       "" +
//       startDate.getMinutes() +
//       "" +
//       startDate.getUTCMilliseconds();
//     let printPath = await printFireProposal({
//       ...fireProposalBody,
//       proposal_no,
//     });
//     const receiptOrderPath = await generateInvoiceOrder({
//       ...fireProposalBody,
//       proposal_no,
//     });
//     const schedulePath = await generateScheduleDoc(fireProposalBody);
//     //RI limit check
//     const RILimit = await ReInsurance.findOne({ where: { product: propertyInsurances.fireIns } });
//     const isApprovedByReAssurance = Number(fireProposalBody.sumInsured) <= Number(RILimit.amount);

//     //create Proposal object
//     const fireProposal = await FireProposal.create({
//       ...fireProposalBody,
//       proposal_no,
//       printPath,
//       receiptOrderPath,
//       schedulePath,
//       isApprovedByReAssurance,
//     });
//     res.status(200).json(fireProposal);
//   } catch (error) {
//     
//     res.status(404).json({ msg: error.message });
//   }
// };

const getFireProposalByPk = async (req, res) => {
  try {
    const fireProposal = await FireProposal.findByPk(req.params.id, {
      include: [
        FireRate,
        FireRateCategory,
        FireQuotation,
        // { model: User, as: "owner" },
        // Branch,
      ],
    });
    if (!fireProposal) {
      return res.status(404).json({ message: "No Data Found" });
    }
    return res.status(200).json(fireProposal);
  } catch (error) {
    res.status(404).json({ msg: error.message });
  }
};

const editFireProposal = async (req, res) => {
  const fireProposalBody = req.body;
  const id = req.params.id;
  try {
    const branch = await Branch.findByPk(fireProposalBody.branchId);
    let printPath = await printFireProposal({
      ...fireProposalBody,
      proposal_no,
    });
    const receiptOrderPath = await generateInvoiceOrder({
      ...fireProposalBody,
      proposal_no,
    });
    const schedulePath = await generateScheduleDoc(fireProposalBody);
    //RI limit check
    const RILimit = await ReInsurance.findOne({ where: { product: propertyInsurances[1].name } }).amount;
    const isApprovedByReAssurance = Number(sumInsured) <= Number(RILimit);



    FireProposal.update({ ...fireProposalBody, printPath, receiptOrderPath, schedulePath, isApprovedByReAssurance }, { where: { id: id } });

    res.status(200).json({ id });
  } catch (error) {
    res.status(404).json({ msg: error.message });
  }
};

const underWritingApproval = async (req, res) => {
  const fireProposalBody = req.body;
  const id = req.params.id;

  try {
    if (
      isActionPrivileged(
        req.user.id,
        privilegeObjects.proposal,
        privilegeActions.approve
      )
    ) {
      FireProposal.update(
        { ...fireProposalBody, isApproved: !fireProposalBody.isApproved },
        { where: { id: id } }
      );
      res.status(200).json({ id });
    }
  } catch (error) {
    res.status(404).json({ msg: error.message });
  }
};

const hasPrivilege = async (req, res) => {
  try {
    if (req.user.role === Role.staff) {
      let resp = await getGrantedPrivileges(req.user.id);
      res.status(200).json(resp);
    } else if (req.user.role === Role.superAdmin) {
      const resp = {
        Finance: true,
        Proposal: true,
        ReInsurance: true,
      };
      return res.status(200).json(resp);
    }
  } catch (error) {

    res.status(404).json({ msg: error.message });
  }
};

const financeApproval = async (req, res) => {
  const fireProposalBody = req.body;
  const id = req.params.id;

  try {

    FireProposal.update(
      {
        ...fireProposalBody,
        isApprovedByFinance: !fireProposalBody.isApprovedByFinance,
      },
      { where: { id: id } }
    );

    res.status(200).json({ id });
  } catch (error) {
    res.status(404).json({ msg: error.message });
  }
};

const reInsuranceApproval = async (req, res) => {
  const fireProposalBody = req.body;
  const id = req.params.id;

  try {

    FireProposal.update(
      {
        ...fireProposalBody,
        isApprovedByReAssurance: !fireProposalBody.isApprovedByReAssurance,
      },
      { where: { id: id } }
    );

    res.status(200).json({ id });
  } catch (error) {
    res.status(404).json({ msg: error.message });
  }
};

const deleteFireProposal = async (req, res) => {
  const id = req.params.id;

  try {
    FireProposal.destroy({ where: { id: id } });

    res.status(200).json({ id });
  } catch (error) {
    res.status(404).json({ msg: error.message });
  }
};

const printFireProposal = async (fireProposal) => {
  let name = "";
  const id = fireProposal.fire_proposal.fireQuotationId;
  const fireQuotation = await FireQuotation.findByPk(id, { include: [FireAlliedPerilsRate, FireRateCategory, FireRate] });
  let perils = "";
  fireQuotation.fire_allied_perils_rates.map((peril) => {
    perils = perils + peril.alliedPerilName + ", "
  });
  if (fireProposal.contact.type === ContactType.individual) {
    name = fireProposal.contact.firstName +
      " " +
      fireProposal.contact.middleName +
      " ";
    fireProposal.contact.lastName +
      " ";
  }
  else if (fireProposal.contact.type === ContactType.corporate) {
    name = fireProposal.contact.companyName
  }
  else if (fireProposal.contact.type === ContactType.joinIndividual) {
    name = fireProposal.contact.joinIndividualName
  }
  let printData = {
    name: name,
    proposal_no: fireProposal.proposalNo,
    city: fireProposal.contact.city,
    woreda: fireProposal.contact.woreda,
    kebele: fireProposal.contact.kebele,
    house_no: fireProposal.contact.officeNumber,
    riskRegion: fireProposal.fire_proposal.riskRegion,
    riskCity: fireProposal.fire_proposal.riskCity,
    riskWoreda: fireProposal.fire_proposal.riskWoreda,
    riskKebele: fireProposal.fire_proposal.riskKebele,
    riskHouseNo: fireProposal.fire_proposal.riskHouseNo,
    purpose: fireQuotation.fire_rate.occupation,
    fireBrigades: fireQuotation.fireBrigades,
    distance: fireProposal.fire_proposal.distance,
    responseTime: fireProposal.fire_proposal.responseTime,
    constractionDate: fireProposal.fire_proposal.contractionDate
      ? moment.utc(fireProposal.fire_proposal.contractionDate).add(1, 'days').format("DD/MM/YYYY")
      : 'N/A',
    alterationsMade: fireProposal.fire_proposal.alterationsMade,
    lightingSystems: fireProposal.fire_proposal.lightingSystems,
    pastLosses: fireProposal.fire_proposal.pastLosses,
    wall_type: fireQuotation.wall_type,
    roof_type: fireQuotation.roof_type,
    floor_type: fireQuotation.floor_type,
    partitionsMaterial: fireProposal.fire_proposal.partitionsMaterial,
    insuranceCoverFor: fireProposal.fire_proposal.insuranceCoverFor,
    effectiveFrom: moment(fireProposal.effectiveFrom).format("DD/MM/YYYY"),
    building: formatToCurrency(fireProposal.fire_proposal.building),
    gatesFences: formatToCurrency(fireProposal.fire_proposal.gatesFences),
    goods: formatToCurrency(fireProposal.fire_proposal.goods),
    other: formatToCurrency(fireProposal.fire_proposal.other ? fireProposal.fire_proposal.other : 0),
    sumInsured: formatToCurrency(Number(fireQuotation.sumInsured) + Number(fireQuotation.content_sum_insured)),
    alliedPerils: perils
    // alliedPerils: quotation.fire_allied_perils_rates ? quotation.fire_allied_perils_rates : [],
  };

  const path = "/print_files/" + Date.now() + ".pdf";




  //print data
  var document = {
    html: html,
    data: printData,
    path: "." + path,
    type: "",
  };

  await printPdf(document);
  return path;
};

const generateMotorInvoiceOrder = async (printData) => {
  try {

    const path = "/print_files/" + Date.now() + ".pdf";

    //print data
    var document = {
      html: html2,
      data: printData,
      path: "." + path,
      type: "",
    };

    await printPdf(document);
    return path;
  } catch (error) {

  }
};

const generateInsuranceCertificate = async (printData) => {
  try {

    const path = "/print_files/" + Date.now() + ".pdf";

    //print data
    var document = {
      html: certificateOfInsuranceTemplate,
      data: printData,
      path: "." + path,
      type: "",
    };
    
    await printPdfLandScape(document);
    return path;
  } catch (error) {
    console.log("the eoor inside is ",error);
  }
};

// Generate Multiple risk schedule for motor
const generateMotorMultipleRiskSchedule = async (printData) => {
  try {

    //
    const path = "/print_files/" + Date.now() + "multiple" + ".pdf";

    //print data
    var document = {
      html: motorMultipleRiskTemplate,
      data: printData,
      path: "." + path,
      type: "",
    };

    await printPdf(document);
    return path;
  }
  catch (error) {

  }
};

const generateMotorWording = async (printData) => {

  try {


    const path = "/print_files/" + Date.now() + ".pdf";

    let templateChoice;
    let pathes;
    let wordingPrintPath;

    if (printData.coverType == MotorCoverType.ownDamage) {
      if (printData.purpose == purposes.private) {
        templateChoice = privateVehicleTemplate;
        pathes = [
          path,
          "/templates/MotorFiles/PAGE_2_MOTOR_PRIVET.pdf",
          "/templates/MotorFiles/PAGE_3_MOTOR_PRIVET.pdf",
          "/templates/MotorFiles/PAGE_4_MOTOR_PRIVET.pdf",
        ]

        wordingPrintPath = "/print_files/" + Date.now() + "PRW" + ".pdf";

      }
      if (printData.purpose != purposes.private) {
        templateChoice = commercialVehicleTemplate
        pathes = [
          path,
          "/templates/MotorFiles/COMMERCIAL_VEHICLEI_PAGE_2.pdf",
          "/templates/MotorFiles/COMMERCIAL_VEHICLEI_PAGE_3.pdf",
          "/templates/MotorFiles/COMMERCIAL_VEHICLEI_PAGE_4.pdf"
        ]

        wordingPrintPath = "/print_files/" + Date.now() + "COW" + ".pdf";
      }
    }
    else if (printData.coverType == MotorCoverType.thirdParty) {
      templateChoice = thirdPartyTemplate;
      pathes = [
        path,
        // "/templates/MotorFiles/POLICY THIRD PARTY PAGE 2.pdf",
        // "/templates/MotorFiles/POLICY THIRD PARTY PAGE 3.pdf",
        // "/templates/MotorFiles/POLICY THIRD PARTY PAGE 4.pdf",
      ]

      wordingPrintPath = "/print_files/" + Date.now() + "TP" + ".pdf";
    }

    //print data
    var document = {
      html: templateChoice,
      data: printData,
      path: "." + path,
      type: "",
    };

    // 

    await printPdf(document);

    return { pathes, wordingPrintPath };
  } catch (error) {

  }
};


const generateInvoiceOrder = async (proposal, policyNumber) => {
  try {



    let endDate = new Date(proposal.effectiveFrom);
    endDate = endDate.setFullYear(endDate.getFullYear() + 1);
    // endDate = endDate.setDate(endDate.getDate() - 1);
    const fireQuotation = await FireQuotation.findByPk(
      proposal.fire_proposal.fireQuotationId,
      { include: [FireRate, FireRateCategory, FireAlliedPerilsRate] }
    );
    const branchData = await Branch.findByPk(proposal.contact.branchId);

    const name = proposal.contact
      ? proposal.contact.type == "Corporate"
        ? proposal.contact.companyName
        : proposal.contact.type == "Join Individual"
          ? proposal.contact.joinIndividualName
          : proposal.contact.type == "Individual"
            ? `${proposal.contact.firstName} ${proposal.contact.middleName} ` + proposal.contact.lastName ? proposal.contact.lastName : ''
            : ""
      : "";

    let printData = {
      branchName: branchData.name,
      branchCode: branchData.short_code,
      typeOfBusiness: proposal.contact.type,
      sourceOfBusiness: proposal.contact.business_source_type,
      intermediaryName: proposal.contact.business_source,
      insuredName: name,
      subCity: proposal.contact.subcity,
      woreda: proposal.fire_proposal.riskWoreda,
      houseNo: proposal.fire_proposal.riskHouseNo,
      tin_no: proposal.contact.tinNumber,
      customerID: proposal.contactId,
      policyNo: policyNumber,
      claimNo: "",
      vat_reg_no: proposal.contact.vatRegistrationNumber,

      insuranceCoverFor: proposal.fire_proposal.insuranceCoverFor,
      startDate: moment(proposal.effectiveFrom).add(1, 'days').format("DD/MM/YYYY"),

      endDate: moment(endDate).format("DD/MM/YYYY"),


      //       endDate: moment(endDate).add(1, 'days').format("DD/MM/YYYY"),

      premiumType: "New",
      premium: Number(fireQuotation.premium),
      revenueStamp: 5,
      total: Number(fireQuotation.premium),

      building: formatToCurrency(fireQuotation.building),
      gatesFences: formatToCurrency(fireQuotation.gatesFences),
      goods: formatToCurrency(fireQuotation.goods),
      other: formatToCurrency(fireQuotation.other ? fireQuotation.other : 0),
      sumInsured: formatToCurrency(Number(fireQuotation.sumInsured) + Number(fireQuotation.content_sum_insured)),
      alliedPerils: fireQuotation.alliedPerils ? fireQuotation.fire_allied_perils_rates : "",
      alliedPerils: fireQuotation.alliedPerils
        ? fireQuotation.fire_allied_perils_rates
        : [],
      being: "Payment for Fire and Lightning insurance cover",


      sumOfBirr: numberToWords.toWords(Number(fireQuotation.premium)),
      certificateNo: "",
      endorsementNo: "",

      checqueNo: "",
      officerName: "",

    };

    const path = "/print_files/" + Date.now() + ".pdf";

    //print data
    var document = {
      html: html2,
      data: printData,
      path: "." + path,
      type: "",
    };


    await printPdf(document);
    return path;
  } catch (error) {

    return -1
  }
};

const generateScheduleDoc = async (proposal, policyNo, branch) => {
  try {
    var endDate = new Date(proposal.effectiveFrom);
    endDate = endDate.setFullYear(endDate.getFullYear() + 1);
    // endDate = endDate.setDate(endDate.getDate() - 1); 
    const fireQuotation = await FireQuotation.findByPk(
      proposal.fire_proposal.fireQuotationId,
      { include: [FireRate, FireRateCategory, FireAlliedPerilsRate] }
    );
    const branch = await Branch.findByPk(proposal.contact.branchId);

    const branchData = await Branch.findByPk(fireQuotation.branchId);


    let allied_perils = [];
    fireQuotation.fire_allied_perils_rates.map((peril) => {
      allied_perils.push({
        alliedPerilName: peril.alliedPerilName,
        rate: peril.rate,
      });
    });

    const name = proposal.contact
      ? proposal.contact.type == "Corporate"
        ? proposal.contact.companyName
        : proposal.contact.type == "Join Individual"
          ? proposal.contact.joinIndividualName
          : proposal.contact.type == "Individual"
            ? `${proposal.contact.firstName} ${proposal.contact.middleName} ${proposal.contact.lastName ? proposal.contact.lastName : ''}`
            : ""
      : "";
    let printData = {
      branchName: branch.name,
      tel: fireQuotation.owner_phoneNo,
      policyNo: policyNo,
      claimNo: "",
      intermediaryName: "",
      insuredName: name,
      city: proposal.contact.city,
      subCity: proposal.contact.subcity,
      woreda: proposal.contact.woreda,
      houseNo: proposal.contact.building,
      riskCity: proposal.fire_proposal.riskCity,
      // houseNo: proposal.contact.houseNo,
      kebele: proposal.contact.kebele,
      contactpoBox: proposal.contact.poBox,
      tel2: proposal.contact.secondaryPhone,
      riskWoreda: proposal.fire_proposal.riskWoreda,
      riskKebele: proposal.fire_proposal.riskKebele,
      riskHouseNo: proposal.fire_proposal.riskHouseNo,
      startDate: moment(proposal.effectiveFrom).add(1, 'days').format("DD/MM/YYYY"),
      endDate: moment(endDate).format("DD/MM/YYYY"),
      expiration_date: moment(endDate).format("DD/MM/YYYY"),
      premiumType: "New",
      vat: 0,
      premium: Number(fireQuotation.premium) + 5.0 + "ETB",
      sumInsured: formatToCurrency(Number(fireQuotation.sumInsured) + Number(fireQuotation.content_sum_insured)),
      alliedPerils: allied_perils,
      description:
        fireQuotation.fire_rate_category.name +
        " " +
        fireQuotation.fire_rate.occupation +
        " building Situated at: " +
        proposal.fire_proposal.riskCity +
        " " +
        "Wall type " +
        fireQuotation.wall_type +
        " roof type: " +
        fireQuotation.roof_type +
        " floor type " +
        fireQuotation.floor_type +
        " Sum insured: " +
        formatToCurrency(Number(fireQuotation.sumInsured) + Number(fireQuotation.content_sum_insured)),
      // String(fireQuotation.sumInsured) + String(fireQuotation.content_sum_insured),
      // alliedPerils: quotation.fire_allied_perils_rates ? quotation.fire_allied_perils_rates : [],
    };

    const path = "/print_files/" + Date.now() + ".pdf";

    //print data
    var document = {
      html: fireScheduleTemplate,
      data: printData,
      path: "." + path,
      type: "",
    };

    await printPdf(document);
    return path;
  } catch (error) {

  }
};

const generateMultipleFirePolicy = async (proposal, status, branchManagerApprovalStatus, multipleProposalId) => {
  console.log("insinde generateMultipleFirePolicy  ==")

  try {
    // proposal.motor_proposal.quotation

    const allProposals = await Proposal.findAll({
      where: {
        multipleProposalId: proposal.multipleProposalId,
        fireProposalId: { [Op.not]: 0 }
      },
      include: [{ model: Contact, include: { model: Branch } }, { model: FireProposal, include: { model: FireQuotation } }],
    })

    console.log("all fire proposal==", allProposals)

    allProposals.forEach(async (proposal) => {

      console.log("proposal.motor_proposal.quotation ==", proposal.fire_proposal.fire_quotation)
      let name;
      if (proposal.fire_proposal.fire_quotation.company_name !== "") {
        name = proposal.fire_proposal.fire_quotation.company_name;

      } else if (proposal.fire_proposal.fire_quotation.join_individual_name !== "") {
        name = proposal.fire_proposal.fire_quotation.join_individual_name;

      } else {
        name = proposal.fire_proposal.fire_quotation.owner_first_name + " " + proposal.fire_proposal.fire_quotation.owner_middle_name + " " + proposal.fire_proposal.fire_quotation.owner_last_name;

      }

      let singlePolicy = null;

      console.log("branch manager approval status", branchManagerApprovalStatus);

      if (branchManagerApprovalStatus == "Pending") {
        try {
          singlePolicy = await MultiplePolicy.create({
            number_of_policies: 1,
            is_fire: true,
            requested_by: name,
            cover_type: "Fire",
            status: status,
            proposalId: proposal.id
          })

          console.log("singlePolicy ==", singlePolicy);


        } catch (err) {
          console.log("singlePolicy error", err);
        }
      }


      const policy = await generatePolicy(proposal, singlePolicy?.id, branchManagerApprovalStatus)
      // const policy = await generateDraftPolicy(proposal, status, branchManagerApprovalStatus, "", singlePolicy?.id);

      if (policy == -1) {
        // return res.status(400).json({ msg: "Draft policy not generated" });

      }
    });

    // return policy;
  }
  catch (error) {
    console.log("error-------", error)
    return -1
  }

}

const generatePolicy = async (proposal, multiplePolicyId, branchManagerApprovalStatus) => {
  try {
    // const proposal = await Proposal.findByPk(req.id, { include: [{ model: FireProposal, include: [FireQuotation] }, Contact] });
    const startDate = new Date(proposal.effectiveFrom);
    var endDate = new Date(proposal.effectiveFrom);
    endDate = endDate.setFullYear(endDate.getFullYear() + 1);
    const periodOfInsurance = moment(proposal.effectiveFrom).add(1, 'days').format("DD/MM/YYYY") + " to " + moment(endDate).format("DD/MM/YYYY");
    const fireQuotation = await FireQuotation.findByPk(proposal.fire_proposal.fireQuotationId, { include: [FireAlliedPerilsRate] })
    const branch = await Branch.findByPk(proposal.contact.branchId);
    let policyNumber;




    let lastPolicyNumber = await Policy.findOne({
      order: [["id", "DESC"]], where: {
        "$proposal.fireProposalId$": {
          [Op.not]: 0
        }
      }, include: [{
        model: Proposal,
      }]
    });

    // if (lastPolicyNumber == null || !lastPolicyNumber.policyNumber) {
    // if (lastPolicyNumber.policyNumber == null || lastPolicyNumber.policyNumber == '') {
    lastPolicyNumber = { id: 0 };
    // 
    const branchAbr = branch.short_code ? branch.short_code.toUpperCase() : "";

    policyNumber = `ZI/${branchAbr}/FRE/0000/${new Date().getMonth() + 1
      }/${new Date().getFullYear().toString().slice(2)}`;

    // }
    // }
    // else {
    //   policyNumber = await generateNumber(lastPolicyNumber.policyNumber)
    //   

    // }


    const name = proposal.contact
      ? proposal.contact.type == "Corporate"
        ? proposal.contact.companyName
        : proposal.contact.type == "Join Individual"
          ? proposal.contact.joinIndividualName
          : proposal.contact.type == "Individual"
            ? `${proposal.contact.firstName} ${proposal.contact.middleName}`
            : ""
      : ""

    const nameOfInsured = name;
    let endorsementPaths = [];

    if (fireQuotation.fire_allied_perils_rates) {
      var promises = await fireQuotation.fire_allied_perils_rates.map(async (peril) => {
        const premium = (((Number(fireQuotation.sumInsured) + Number(fireQuotation.content_sum_insured)) * peril.rate) / 100).toFixed(2)
        let filePath
        switch (peril.alliedPerilName) {
          case alliedPerilsList.aircraft:
            filePath = "air-craft-damage-endorsement"
            endorsementPaths.push(await generateEndorsement(periodOfInsurance, policyNumber, name, filePath, "AR", proposal.contact.branchId, premium, alliedPerilsList.aircraft))
            break;
          case alliedPerilsList.burstingAndOverflowing:
            filePath = "bursting-and-overflowing-endorsement"
            endorsementPaths.push(await generateEndorsement(periodOfInsurance, policyNumber, name, filePath, "BO", proposal.contact.branchId, premium, alliedPerilsList.burstingAndOverflowing))
            break;
          case alliedPerilsList.bushFire:
            filePath = "bush-fire-endorsement"
            endorsementPaths.push(await generateEndorsement(periodOfInsurance, policyNumber, name, filePath, "BF", proposal.contact.branchId, premium, alliedPerilsList.bushFire))
            break;
          case alliedPerilsList.earthquake:
            filePath = "earthquake-endorsement"
            endorsementPaths.push(await generateEndorsement(periodOfInsurance, policyNumber, name, filePath, "EQ", proposal.contact.branchId, premium, alliedPerilsList.earthquake))
            break;
          case alliedPerilsList.explosion:
            filePath = "explosion-endorsement"
            endorsementPaths.push(await generateEndorsement(periodOfInsurance, policyNumber, name, filePath, "EX", proposal.contact.branchId, premium, alliedPerilsList.explosion))
            break;
          case alliedPerilsList.impactDamage:
            filePath = "impact-damage-endorsement"
            endorsementPaths.push(await generateEndorsement(periodOfInsurance, policyNumber, name, filePath, "ID", proposal.contact.branchId, premium, alliedPerilsList.impactDamage))
            break;
          case alliedPerilsList.malicious:
            filePath = "malicious-damage-endorsement"
            endorsementPaths.push(await generateEndorsement(periodOfInsurance, policyNumber, name, filePath, "MD", proposal.contact.branchId, premium, alliedPerilsList.malicious))
            break;
          case alliedPerilsList.smoke:
            filePath = "smoke-damage-endorsement"
            endorsementPaths.push(await generateEndorsement(periodOfInsurance, policyNumber, name, filePath, "SM", proposal.contact.branchId, premium, alliedPerilsList.smoke))
            break;
          case alliedPerilsList.spontaneous:
            filePath = "spontaneous-damage-endorsement"
            endorsementPaths.push(await generateEndorsement(periodOfInsurance, policyNumber, name, filePath, "SD", proposal.contact.branchId, premium, alliedPerilsList.spontaneous))
            break;
          case alliedPerilsList.storm:
            filePath = "storm-tempest-flood-endorsement"
            endorsementPaths.push(await generateEndorsement(periodOfInsurance, policyNumber, name, filePath, "ST", proposal.contact.branchId, premium, alliedPerilsList.storm))
            break;
          case alliedPerilsList.subsidence:
            filePath = "subsidence-collapse-endorsement"
            endorsementPaths.push(await generateEndorsement(periodOfInsurance, policyNumber, name, filePath, "SB", proposal.contact.branchId, premium, alliedPerilsList.subsidence))
            break;
          case alliedPerilsList.sprinkler:
            filePath = "sprinkler-leakage-endorsement"
            endorsementPaths.push(await generateEndorsement(periodOfInsurance, policyNumber, name, filePath, "SP", proposal.contact.branchId, premium, alliedPerilsList.sprinkler))
            break;
          case alliedPerilsList.volcanic:
            filePath = "volcanic-eruption-endorsement"
            endorsementPaths.push(await generateEndorsement(periodOfInsurance, policyNumber, name, filePath, "SD", proposal.contact.branchId, premium, alliedPerilsList.volcanic))
            break;
          case alliedPerilsList.srcc:
            filePath = "srcc-endorsement"
            endorsementPaths.push(await generateEndorsement(periodOfInsurance, policyNumber, name, filePath, "SD", proposal.contact.branchId, premium, alliedPerilsList.srcc))
            break;
          default:
            break;

        }

      });


      Promise.all(promises).then(async function (result) {
        const endorsementsPath = await mergeEndorsements(endorsementPaths);
        const schedulePath = await generateScheduleDoc(proposal, policyNumber, branch)
        const firePolicyWording = await generatePolicyWording(branch.name, branch.office_phone, policyNumber);

        const policySheetPath = await generatePolicyDoc([endorsementsPath], schedulePath, firePolicyWording);
        const receiptOrderSheetPath = await generateInvoiceOrder(proposal, policyNumber);

        let policyData = {
          policyNumber: policyNumber,
          fullName: name,
          proposalId: proposal.id,
          policyIssuedDate: new Date(),
          policyEndDate: endDate,
          premium: fireQuotation.premium,
          policyStatus: policyStatus.draftPolicy,
          financeStatus: financeStatus.receiptOrder,
          scheduleSheetPath: schedulePath,
          policySheetPath: policySheetPath,
          endorsementsPath: endorsementsPath,
          receiptOrderSheetPath: receiptOrderSheetPath,
          wordingSheetPath: firePolicyWording,
          multiplePolicyId: multiplePolicyId,
          branchManagerApprovalStatus:branchManagerApprovalStatus

        }
        const checkPolicy = await Policy.findOne({ where: { proposalId: proposal.id }, })

        if (checkPolicy && (branchManagerApprovalStatus == "Accept")) {
          const resp = await Policy.update(policyData,
            { where: { id: checkPolicy.id } });

            if (resp && endorsementPaths.length > 0) {
              var prom = endorsementPaths.map(async (endorsement) => {
                var filePath = endorsement.printPath;
                var endorsementNo = endorsement.endorsementNo
                var fileName = endorsement.endorsementName;
                var policyId = resp.id;
                var isWarranty = true;
  
  
                await EndorsementFilesPath.update({ endorsementNo, fileName, filePath, policyId, isWarranty }, {where: {policyId: checkPolicy.id}})
              })
  
              Promise.all(prom).then(async function (result) {
  
              })
            }
  
            resp && await generateWarranty(fireQuotation.fireRateId, branch, policyNumber, nameOfInsured, periodOfInsurance, resp.id);
            // res.status(200).json(resp);

        } else {

          const resp = await Policy.create(policyData);

          if (resp && endorsementPaths.length > 0) {
            var prom = endorsementPaths.map(async (endorsement) => {
              var filePath = endorsement.printPath;
              var endorsementNo = endorsement.endorsementNo
              var fileName = endorsement.endorsementName;
              var policyId = resp.id;
              var isWarranty = true;


              await EndorsementFilesPath.create({ endorsementNo, fileName, filePath, policyId, isWarranty })
            })

            Promise.all(prom).then(async function (result) {

            })
          }

          resp && await generateWarranty(fireQuotation.fireRateId, branch, policyNumber, nameOfInsured, periodOfInsurance, resp.id);
          // res.status(200).json(resp);
        }


      });
      console.log("multiplePolicyId 1", multiplePolicyId);


    }
    else {
      const schedulePath = await generateScheduleDoc(proposal)
      const policyDocPath = await generatePolicyDoc(endorsementPaths, schedulePath);


      let policyData = {
        policyNumber: policyNumber,
        fullName: nameOfInsured,
        proposalId: 0,
        policyIssuedDate: startDate,
        policyEndDate: endDate,
        premium: fireQuotation.premium,
        status: policyStatus.draftPolicy,
        scheduleSheetPath: schedulePath,
        policyDocPath: policyDocPath,
        wordingSheetPath: "",
        multiplePolicyId: multiplePolicyId
      }

      console.log("multiplePolicyId2", multiplePolicyId);

      const checkPolicy = await Policy.findOne({ where: { proposalId: proposal.id }, })

      if (checkPolicy && (branchManagerApprovalStatus == "Accept")) {
        const resp = await Policy.update(policyData,
          { where: { id: checkPolicy.id } });

      } else {

        const resp = await Policy.create(policyData);

      }

      const resp = await Policy.create(policyData);
      resp.id && await generateWarranty(fireQuotation.fireRateId, branch, policyNumber, nameOfInsured, periodOfInsurance, resp.id);
      // var promises = await warrantyResponse.map(async (warranty) => {
      //   var filePath = warranty.printPath;
      //   var endorsementNo = warranty.endorsementNo
      //   var fileName = "";
      //   var policyId = resp.id;
      //   var isWarranty = true;
      //   await EndorsementFilesPath.create({ endorsementNo, fileName, filePath, policyId, isWarranty })
      // });
      Promise.all(promises).then(async function (result) {

      })


    }
  }
  catch (error) {

  }

}

const generatePolicyWording = async (branchName, officePhone, policyNo) => {

  try {
    var printData = {
      branchName: branchName,
      officePhone: officePhone,
      policyNo: policyNo,
      // status: policyStatus == policyStatus.draftPolicy ? true : false,

    }

    const printPath = "/print_files/" + Date.now() + ".pdf";

    //print data
    var document = {
      html: firePolicyWordingTemplate,
      data: printData,
      path: "." + printPath,
      type: "",
    };

    await printPdf(document);
    return printPath;
    // var resp;

    // let policyPath = "/print_files/" + Date.now() + ".pdf";
    // var merger = new PDFMerger();
    // let a = await merger.add("." + printPath);
    // let b = await merger.add("." + "/templates/fire/policy/FireInsurancePolicy.pdf");
    // Promise.all([a, b]).then(async function (result) {
    //   await merger.save("." + policyPath);
    //   return policyPath
    // });

    return await mergePdfs([printPath, "/templates/fire/policy/FireInsurancePolicy.pdf"]);

  }
  catch (error) {

  }

}

const generateWarranty = async (fireRateId, branch, policyNo, nameOfInsured, periodOfInsurance, id) => {
  try {
    const fireRate = await FireRate.findByPk(fireRateId, { include: [{ model: FireApplicableWarranty, include: [FireWarranty] }] });
    var responseObj = [];
    const pro = await fireRate.fire_applicable_warrantys.map(async (warranty) => {
      const startDate = new Date()
      const endorsementNo =
        "ZI/" + branch.short_code +
        "/FREP/" +
        startDate.getFullYear() +
        "" +
        startDate.getMonth() +
        "" +
        startDate.getDate()
      // "/"
      // + branch.code +

      // // "/" +
      // "" +
      //   startDate.getUTCHours() +
      //   "" +
      //   startDate.getMinutes() +
      //   "" +
      //   startDate.getUTCMilliseconds();
      var warrantsArray = []
      if (warranty.fire_warranties) {
        warranty.fire_warranties.map((element) => {
          warrantsArray.push({ description: element.description });
        })
      }

      var printData = {
        warrantyName: warranty.name,
        endorsementNo: endorsementNo,
        policyNo: policyNo,
        nameOfInsured: nameOfInsured,
        periodOfInsurance: periodOfInsurance,
        mainWarranty: warranty.description,
        subWarrants: warrantsArray,
        city: branch.city,
        status: "Draft",
        day: (new Date()).getDate(),
        month: (new Date()).toLocaleString('default', { month: 'long' }),
        year: (new Date()).getFullYear(),
      }

      const printPath = "/print_files/" + Date.now() + ".pdf";

      //print data
      var document = {
        html: fireWarrantyTemplate,
        data: printData,
        path: "." + printPath,
        type: "",
      };

      await printPdf(document);
      var filePath = printPath;
      var fileName = warranty.name;
      var policyId = id;
      var isWarranty = true;
      await EndorsementFilesPath.create({ endorsementNo, fileName, filePath, policyId, isWarranty })
    });

    Promise.all(pro).then(async function (r) {
      return
    });
  }
  catch (e) {

  }
}

const generateEndorsement = async (periodOfInsurance, policyNo, nameOfInsured, templateName, code, branchId, premium, endorsementName) => {
  try {
    const endorsementTemplate = fs.readFileSync(
      path.join(__dirname, `./../../../templates/fire/endorsements/${templateName}.html`),
      "utf8"
    );
    const branch = await Branch.findByPk(branchId);
    const startDate = new Date()
    const endorsementNo =
      "ZI/" + branch.short_code +
      "/FREP/" +
      startDate.getFullYear() +
      "" +
      startDate.getMonth() +
      "" +
      startDate.getDate() +
      "/" + code + "/" +
      "" +
      startDate.getUTCHours() +
      "" +
      startDate.getMinutes() +
      "" +
      startDate.getUTCMilliseconds();

    var printData = {
      endorsementNo: endorsementNo,
      policyNo: policyNo,
      nameOfInsured: nameOfInsured,
      periodOfInsurance: periodOfInsurance,
      premium: premium,
      finalpremium: Number(premium) + 5,
      city: branch.city,
      day: (new Date()).getDate(),
      month: (new Date()).getMonth(),
      year: (new Date()).getFullYear(),
    }

    const printPath = "/print_files/" + Date.now() + ".pdf";
    //print data
    var document = {
      html: endorsementTemplate,
      data: printData,
      path: "." + printPath,
      type: "",
    };

    await printPdf(document);
    return { printPath, endorsementNo, endorsementName };

  }
  catch (error) {

  }

}

const generatePolicyDoc = async (paths, schedulePath, firePolicyDocPath) => {
  try {
    let printPath = "/print_files/" + Date.now() + ".pdf";
    var merger = new PDFMerger();

    await merger.add("." + firePolicyDocPath);
    await merger.add("." + schedulePath);
    var prom = paths.map(async (path) => {
      await merger.add("." + path);
    });
    Promise.all(prom).then(async function (result) {
      await merger.save("." + printPath);
    });
    return printPath
  }
  catch (error) {

  }
}

const mergeEndorsements = async (paths) => {
  try {
    let printPath = "/print_files/" + Date.now() + ".pdf";
    var merger = new PDFMerger();
    var prom = paths.map(async (path) => {
      await merger.add("." + path.printPath);
    });
    Promise.all(prom).then(async function (result) {
      await merger.save("." + printPath);
    });
    return printPath
  }
  catch (error) {

  }
}

module.exports = {
  getFireProposal,
  getAllFireProposals,
  createFireProposal,
  getFireProposalByPk,
  editFireProposal,
  deleteFireProposal,
  underWritingApproval: underWritingApproval,
  financeApproval,
  reInsuranceApproval,
  hasPrivilege,
  generatePolicy,
  generateMotorInvoiceOrder,
  generateInsuranceCertificate,
  generateMotorMultipleRiskSchedule,
  generateMotorWording,
  generateMultipleFirePolicy

}

