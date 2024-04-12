const Proposal = require("../../../models/proposals/Proposal");
const Shareholder = require("../../../models/proposals/Proposal");
const {
  isPhoneNoValid,
  getFileExtension,
  isEmailValid,
  getChangedFieldValues,
  getIpAddress,
  createEventLog,
  convertFlattenedToNested,
  printPdf,
} = require("../../../utils/GeneralUtils");
const {
  canUserRead,
  canUserCreate,
  canUserEdit,
  canUserDelete,
  canUserAccessOnlySelf,
  canUserAccessOnlyBranch,
} = require("../../../utils/Authrizations");
const { Op, where } = require("sequelize");
const {
  Role,
  eventResourceTypes,
  eventActions,
  MotorCoverType,
  vehicleTypes,
  policyStatus,
  branchManagerApprovalStatus
} = require("../../../utils/constants");
const Contact = require("../../../models/Contact");
const MotorProposal = require("../../../models/proposals/MotorProposal");
const Opportunity = require("../../../models/Opportunity");
const User = require("../../../models/acl/user");
const Branch = require("../../../models/Branch");
const Employee = require("../../../models/Employee");
const fs = require("fs");
const path = require("path");
const ReInsurance = require("../../../models/proposals/ReInsurance");
const Quotation = require("../../../models/Quotation");
const Policy = require("../../../models/Policy");
const { printMotorSchedule, printMultipleMotorSchedule } = require("../motor/functions");
const { sendNewSms } = require("../SMSServiceHandler");
const { createEndorsementByProposal } = require("../endorsement/EndorsementHandler");
const { generateDraftPolicy, generateMultiplePolicy } = require("../PolicyHandler");
const ProposalComment = require("../../../models/proposals/ProposalComment");
const FireProposal = require("../../../models/proposals/FireProposal");
const FireQuotation = require("../../../models/fire/FireQuotation");
const { generatePolicy, generateMultipleFirePolicy } = require("./FireProposalHandler");
const { approveFinance } = require("../ReceiptOrderHandler");
const MultipleProposal = require("../../../models/MultipleProposal");
const Vehicle = require("../../../models/motor/Vehicle");
const html = fs.readFileSync(
  path.join(__dirname, "./../../../templates/MotorProposalPrintout.html"),
  "utf8"
);
const getSearch = (st) => {
  return {
    [Op.or]: [
      // { name: { [Op.like]: `%${st}%` } },
      { "$contact.firstName$": { [Op.like]: `%${st}%` } },
      { "$contact.middleName$": { [Op.like]: `%${st}%` } },
      { "$contact.lastName$": { [Op.like]: `%${st}%` } },
      { "$contact.gender$": { [Op.like]: `%${st}%` } },
      { "$contact.industry$": { [Op.like]: `%${st}%` } },
      { "$contact.branch.name$": { [Op.like]: `%${st}%` } },
      { "$contact.type$": { [Op.like]: `%${st}%` } },
      { "$contact.primaryEmail$": { [Op.like]: `%${st}%` } },
      { "$contact.secondaryEmail$": { [Op.like]: `%${st}%` } },
      { "$contact.primaryPhone$": { [Op.like]: `%${st}%` } },
      { "$contact.secondaryPhone$": { [Op.like]: `%${st}%` } },
      { "$contact.joinIndividualName$": { [Op.like]: `%${st}%` } },
      { "$contact.companyName$": { [Op.like]: `%${st}%` } },
      { "$contact.tinNumber$": { [Op.like]: `%${st}%` } },
      { "$contact.business_source$": { [Op.like]: `%${st}%` } },
      { "$contact.business_source_type$": { [Op.like]: `%${st}%` } },
      { "$motor_proposal.quotation.requested_quotation_id$": { [Op.like]: `%${st}%` } },

      // { "$contact.country": { [Op.like]: `%${st}%` } },
      // { "$contact.region": { [Op.like]: `%${st}%` } },
      // { "$contact.city": { [Op.like]: `%${st}%` } },
      // { "$contact.subcity": { [Op.like]: `%${st}%` } },
      // { "$contact.woreda": { [Op.like]: `%${st}%` } },
      // { "$contact.kebele": { [Op.like]: `%${st}%` } },

      // { shareHolderId: { [Op.like]: `%${st}%` } },
      // { primaryEmail: { [Op.like]: `%${st}%` } },
      // { primaryPhone: { [Op.like]: `%${st}%` } },
      // { primaryEmail: { [Op.like]: `%${st}%` } },
      // { secondaryPhone: { [Op.like]: `%${st}%` } },
      // { gender: { [Op.like]: `%${st}%` } },
      // { active: { [Op.like]: `%${st}%` } },
      // { stateOfInfluence: { [Op.like]: `%${st}%` } },
      // { country: { [Op.like]: `%${st}%` } },
      // { region: { [Op.like]: `%${st}%` } },
      // { city: { [Op.like]: `%${st}%` } },
      // { subcity: { [Op.like]: `%${st}%` } },
      // { woreda: { [Op.like]: `%${st}%` } },
      // { kebele: { [Op.like]: `%${st}%` } },
      // { building: { [Op.like]: `%${st}%` } },
      // { officeNumber: { [Op.like]: `%${st}%` } },
      // { streetName: { [Op.like]: `%${st}%` } },
      // { poBox: { [Op.like]: `%${st}%` } },
      // { zipCode: { [Op.like]: `%${st}%` } },
      // { socialSecurity: { [Op.like]: `%${st}%` } },
    ],
  };
};

const createProposal = async (req, res) => {
  let proposal;
  let newProposal;

  console.log("inside create proposal")
  try {
    // 

    proposal = convertFlattenedToNested(req.body);


    const proposalCreated = await Proposal.findOne({ include: [{ model: MotorProposal, where: { quotationId: proposal.motor_proposal.quotationId } }] });

    // if (proposalCreated) {
    //   return res.status(409).json({ msg: "You have already created proposal!!" });
    // }
    // if (proposalCreated) {
    //   return res.status(409).json({ msg: "You have already created proposal!!" });
    // }

    const startDate = new Date();
    const branch = await Branch.findByPk(proposal.contact.branchId);
    const proposal_no =
      "ZI/" +
      branch.short_code +
      "/MOTP/" +
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
    // 
    // 
    const comingEffectiveFromDate = new Date(req.body.effectiveFrom);
    comingEffectiveFromDate.setDate(comingEffectiveFromDate.getDate() + 1);
    const formattedEffectiveFromDate = comingEffectiveFromDate.toISOString().split('T')[0];

    // try {
    // 
    proposal.effectiveFrom = formattedEffectiveFromDate;

    proposal.proposalNo = proposal_no  //

    const quotation = await Quotation.findByPk(proposal.motor_proposal.quotationId);
    const today = new Date();

    const riApproval = await ReInsurance.findOne({
      where: {
        activeFromDate: { [Op.lte]: today },
        activeUntilDate: { [Op.gte]: today },
      },
    });


    let { motor_proposal } = proposal;

    if (req.files["motor_proposal.idImage"])
      motor_proposal.idImage = req.files["motor_proposal.idImage"][0]
        ? "/uploads/motorProposal/" +
        req.files["motor_proposal.idImage"][0].filename
        : "";
    if (req.files["motor_proposal.videoFootage"])
      motor_proposal.videoFootage = req.files["motor_proposal.videoFootage"][0]
        ? "/uploads/motorProposal/" +
        req.files["motor_proposal.videoFootage"][0].filename
        : "";
    if (req.files["motor_proposal.document"])
      motor_proposal.document = req.files["motor_proposal.document"][0]
        ? "/uploads/motorProposal/" +
        req.files["motor_proposal.document"][0].filename
        : "";
    if (req.files["withholdingDocument"])
      proposal.withholdingDocument = req.files[
        "withholdingDocument"
      ][0]
        ? "/uploads/motorProposal/" +
        req.files["withholdingDocument"][0].filename
        : "";
    if (req.files["tot"])
      req.tot = req.files["tot"][0]
        ? "/uploads/motorProposal/" +
        req.files["tot"][0].filename
        : "";
    if (req.files['noClaim'])
      proposal.noClaim = req.files['noClaim'][0] ? "/uploads/motorProposal/" + req.files['noClaim'][0].filename : "";

    const phone = proposal.contact.primaryPhone;
    let { contact } = proposal;
    // let { motor_proposal } = proposal
    // motor_proposal.idImage = idImage
    // motor_proposal.videoFootage = videoFootage

    if (riApproval) {
      proposal.specialApproval =
        quotation.premium >= riApproval.amount ? "Pending" : null;
    }


    contact.status = "accounts";
    contact.deleted = false;
    contact.memberOf == "null" ? null : contact.memberOf;
    contact.primaryPhone = `${contact.primaryPhone}`;//+
    contact.secondaryPhone === 0 || contact.secondaryPhone === "0"
      ? null
      : `${contact.secondaryPhone}`;//+
    contact.secondaryEmail === 0 || contact.secondaryEmail === "0"
      ? null
      : contact.secondaryEmail;


    // notNull Violation: contacts.business_source_type cannot be null, notNull Violation: contacts.business_source cannot be null

    proposal.userId = req.user.id;
    // 

    const nwContact = proposal.contact;

    const contacts = proposal.contact.id
      ? await Contact.findOne({
        where: {
          id: proposal.contact.id
          // primaryPhone: proposal.contact.primaryPhone 
        }
      })
      : null;

    console.log("mul.prop to be created");

    const multipleProposal = await MultipleProposal.create({
      requested_by: contact.firstName ? contact.firstName : "",
      number_of_proposal: 1,
      is_motor: true
    });

    proposal.multipleProposalId = multipleProposal.id;

    console.log("mul.prop created", multipleProposal);
    if (contacts == null) {
      //conversion_date
      newProposal = await Proposal.create(proposal, {
        include: [{ model: Contact }, MotorProposal],
      }).then((newProposal) => {
        console.log("proposal created", newProposal)
        const opportunity = {
          subject: "Proposal submitted",
          userId: req.user ? req.user.id : 0,
          accountId: contact.id,
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
        accountId: contact.id,
        userId: req.user ? req.user.id : 0,
        probablity: 80,
        assignedTo: contact.assignedTo || req.user.id,
      };
      proposal.contactId = contact.id;
      newProposal = await Proposal.create(proposal, {
        include: [MotorProposal],
      }).then(async (prop) => {
        const opp = await Opportunity.create(opportunity);
        return prop;
      });
    }

    



    // const newmo = await MotorProposal.create(proposal.motorProposal)

    const finalProposal = await Proposal.findByPk(newProposal.id, {
      include: [MotorProposal, Contact],
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

const getAllProposal = async (req, res) => {
  const { f, r, st, sc, sd } = req.query;

  try {
    const currentUser = await User.findByPk(req.user.id, {
      include: [Employee],
    });



    if (req.type == "all") {
      const newProposal = await Proposal.findAndCountAll({
        offset: Number(f),
        limit: Number(r),
        order: [[sc || "createdAt", sd == 1 ? "DESC" : "ASC"]],
        subQuery: false,
        where: getSearch(st),
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
            ],
          },
          {
            model: MotorProposal,
            include: [Quotation]
          },
          {
            model: FireProposal,
            include: [FireQuotation]
          },
        ],
      });

      res.status(200).json(newProposal);
    } else if (req.type == "self") {
      const newProposal = await Proposal.findAndCountAll({
        offset: Number(f),
        limit: Number(r),
        order: [[sc || "createdAt", sd == 1 ? "ASC" : "DESC"]],
        subQuery: false,
        where: {
          [Op.and]: [
            {
              [Op.or]: [
                { userId: currentUser.id },
                { "$contact.assignedTo$": currentUser.id },
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
            model: MotorProposal,
            include: [Quotation]
          },
          {
            model: FireProposal,
            include: [FireQuotation]
          },
        ],
      });

      res.status(200).json(newProposal);
    } else if (req.type == "customer") {
      const newProposal = await Proposal.findAndCountAll({
        offset: Number(f),
        limit: Number(r),
        order: [[sc || "createdAt", sd == 1 ? "ASC" : "DESC"]],
        subQuery: false,
        where: {
          [Op.and]: [
            {
              [Op.or]: [
                { userId: currentUser.id },
                { '$contact.accountId$': currentUser.id },
                // { assignedTo: { [Op.like]: `%${currentUser.id}%` } },
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
            model: MotorProposal,
            include: [Quotation]
          },
          {
            model: FireProposal,
            include: [FireQuotation]
          },
        ],
      });

      res.status(200).json(newProposal);
    } else if (req.type == "branch") {
      const newProposal = await Proposal.findAndCountAll({
        offset: Number(f),
        limit: Number(r),
        order: [[sc || "createdAt", sd == 1 ? "ASC" : "DESC"]],
        subQuery: false,

        include: [
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
            model: MotorProposal,
            include: [Quotation]
          },
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
            model: FireProposal,
            include: [FireQuotation]
          },
        ],
        where: {
          [Op.and]: [
            {
              [Op.or]: [
                {
                  "$contact.branchId$": currentUser.employee.branchId
                },

              ],
            },
            getSearch(st),
          ],
        },
      });

      res.status(200).json(newProposal);
    } else if (req.type == "branchAndSelf") {
      const newProposal = await Proposal.findAndCountAll({
        offset: Number(f),
        limit: Number(r),
        order: [[sc || "createdAt", sd == 1 ? "ASC" : "DESC"]],

        subQuery: false,
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
            model: MotorProposal,
            include: [Quotation]
          },
          {
            model: FireProposal,
            include: [FireQuotation]
          },
        ],
        where: {
          [Op.and]: [
            {
              [Op.or]: [
                { userId: currentUser.id },
                { "$contact.assignedTo$": currentUser.id },
                {
                  "$contact.branchId$": currentUser.employee.branchId
                },


              ],
            },
            getSearch(st),
          ],
        },
      });

      res.status(200).json(newProposal);
    }
  } catch (error) {
    console.error("Error creating user:", error);
    return res.status(500).json({ msg: "Internal Server Error" });

  }
};

const getProposalByPk = async (req, res) => {
  const proposalId = req.params.id;
  const today = new Date();

  try {

    const oldProposal = await Proposal.findByPk(proposalId);

    if (oldProposal && oldProposal.motorProposalId !== 0) {
      const motorProposal = await MotorProposal.findByPk(oldProposal.motorProposalId,
        { include: [Quotation] })


      const riApproval = await ReInsurance.findOne({
        where: {
          activeFromDate: { [Op.lte]: today },
          activeUntilDate: { [Op.gte]: today },
        },
      });

      // if ((oldProposal.specialApproval !== null) || (oldProposal.specialApproval == "Pending")) {

      //   let needSpecialApproval = (motorProposal.quotation.premium >= riApproval.amount) ? "Pending" : null

      //   Proposal.update(
      //     { specialApproval: needSpecialApproval },
      //     { where: { id: proposalId } }
      //   )
      // }

    }

    const newProposal = await Proposal.findByPk(proposalId, {

      include: [
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
          model: MotorProposal,
          include: [Quotation]
        },
        {
          model: FireProposal,
          include: [FireQuotation]
        },
        {
          model: ProposalComment,
          group: ['commentBy']
        }
      ],
    })

    // console.log("new proposal ==", newProposal)

    // if (req.type === 'customer' && (newProposal.contact.accountId != req.user.id || newProposal.userId != req.user.id)) {
    //   return res.status(401).json({ msg: "unauthorized access" });
    // }

    //

    if (newProposal?.userId == req.user.id) {
      await Proposal.update(
        { notificationNotSeen: false },
        { where: { id: proposalId } }
      );
    }
    let ipAddress = getIpAddress(req.ip);
    const eventLog = await createEventLog(
      req.user.id,
      eventResourceTypes.proposal,
      newProposal?.Contact
        ? newProposal?.Contact == "Corporate"
          ? newProposal?.Contact.companyName
          : newProposal?.Contact == "Join Individual"
            ? newProposal?.Contact.joinIndividualName
            : newProposal?.Contact == "Individual"
              ? newProposal?.Contact.firstName
              : ""
        : "",
      newProposal?.id,
      eventActions.view,
      "",
      ipAddress
    );



    res.status(200).json(newProposal);
  } catch (error) {
    console.error("Error :", error)
    return res.status(500).json({ msg: "Internal Server Error" });

  }
};
const getProposalByPlateNo = async (req, res) => {
  //const plateNumber = req.body;
  const plateNumber = req.params.plateno;


  try {
    const proposal = await Proposal.findOne({
      include: [
        {
          model: Contact,
          include: [
            {
              model: Vehicle,
              as: "product"
            },
          ]
        },
        {
          model: MotorProposal,
          where: { plateNumber: plateNumber },
        },
      ],
    })

    if (proposal)
      res.status(200).json(proposal);
    else
      res.status(404).json({ msg: "Proposal not found" });

  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};

const editProposal = async (req, res) => {
  // const proposal = req.body
  try {
    const prop = await Proposal.findByPk(req.body.id);


    const proposal = convertFlattenedToNested(req.body);
    const quotation = await Quotation.findByPk(proposal.motor_proposal.quotationId);
    const today = new Date();
    if (
      // prop.canNotEdit == true,
      prop.underwritingApproval === branchManagerApprovalStatus.approved) {
      return res.status(400).json({ msg: "Can Not Edit Proposal" });
    }
    //if customer but not current user then false
    if (req.type == "customer" && (req.user.id !== prop.userId)) {
      return res.status(400).json({ msg: "Can Not Edit Others Proposal" });
    }
    const riApproval = await ReInsurance.findOne({
      where: {
        [Op.and]: [{
          activeFromDate: { [Op.lte]: today },
          activeUntilDate: { [Op.gte]: today },
        },
        { product: "Motor Insurance with Additional Covers" }
        ]
      },
    });

    let { motor_proposal } = proposal;
    if (req.files["motor_proposal.idImage"])
      motor_proposal.idImage = req.files["motor_proposal.idImage"][0]
        ? "/uploads/motorProposal/" +
        req.files["motor_proposal.idImage"][0].filename
        : "";
    if (req.files["motor_proposal.videoFootage"])
      motor_proposal.videoFootage = req.files["motor_proposal.videoFootage"][0]
        ? "/uploads/motorProposal/" +
        req.files["motor_proposal.videoFootage"][0].filename
        : "";
    if (req.files["motor_proposal.document"])
      motor_proposal.document = req.files["motor_proposal.document"][0]
        ? "/uploads/motorProposal/" +
        req.files["motor_proposal.document"][0].filename
        : "";
    if (req.files["withholdingDocument"])
      proposal.withholdingDocument = req.files[
        "withholdingDocument"
      ][0]
        ? "/uploads/motorProposal/" +
        req.files["withholdingDocument"][0].filename
        : "";
    if (req.files["tot"])
      req.tot = req.files["tot"][0]
        ? "/uploads/motorProposal/" +
        req.files["tot"][0].filename
        : "";
    // if (req.files['motor_proposal.noClime'])
    //     motor_proposal.withholdingDocument = req.files['motor_proposal.noClime'][0] ? "/uploads/motorProposal/" + req.files['motor_proposal.noClime'][0].filename : "";
    if (req.files["noClaim"])
      proposal.noClaim = req.files["noClaim"][0]
        ? "/uploads/motorProposal/" +
        req.files["motor_proposal.noClime"][0].filename
        : "";
    let { contact } = proposal;

    contact.primaryPhone = `${contact.primaryPhone}`; //+
    contact.secondaryPhone == 0 || contact.secondaryPhone == "0"
      ? null
      : ` ${contact.secondaryPhone}`;
    contact.business_source = "null";
    contact.business_source_type = "null";
    contact.primaryEmail == 0 || contact.primaryEmail == "0"
      ? null
      : contact.primaryEmail;
    contact.secondaryEmail == 0 || contact.secondaryEmail == "0"
      ? null
      : contact.secondaryEmail;
    proposal.underwritingApproval = null;
    proposal.branchManagerApproval = null;
    proposal.preApprovalCheck = null;

    // 


    if (riApproval) {
      proposal.specialApproval =
        quotation.premium >= riApproval.amount ? "Pending" : null;
    }

    const foundProposal = await Proposal.findByPk(proposal.id, {
      include: [Contact],
    }).then((proposals) => {
      const newProposal = Proposal.update(proposal, {
        where: { id: proposal.id },
      }).then(() => {
        Contact.update(proposal.contact, { where: { id: proposal.contactId } });
        MotorProposal.update(proposal.motor_proposal, {
          where: { id: proposal.motor_proposal.id },
        });
      });
      return proposals;
    });
    const updatedProposal = await Proposal.findByPk(proposal.id, {
      include: [Contact],
    });
    // 
    // 

    const changedFieldValues = getChangedFieldValues(
      foundProposal,
      updatedProposal
    );
    let ipAddress = getIpAddress(req.ip);
    const eventLog = await createEventLog(
      req.user.id,
      eventResourceTypes.proposal,
      updatedProposal.Contact
        ? updatedProposal.Contact == "Corporate"
          ? updatedProposal.Contact.companyName
          : updatedProposal.Contact == "Join Individual"
            ? updatedProposal.Contact.joinIndividualName
            : updatedProposal.Contact == "Individual"
              ? updatedProposal.Contact.firstName
              : ""
        : "",
      updatedProposal.id,
      eventActions.edit,
      changedFieldValues,
      ipAddress
    );
    res.status(200).json(foundProposal);
  } catch (error) {

    res.status(404).json({ msg: error.message });
  }
};

const handleUnderwritingApproval = async (req, res) => {

  try {
    let proposal
    // const sh = await Proposal.findByPk(req.params.id);
    const id = req.body.id
    const underwritingApproval = await Proposal.findByPk(id, { include: [Contact] });
    console.log("the inside ", req.body)
    console.log("thqqqe inside ", req.body.proposalStatus)

    if (
      // underwritingApproval.specialApproval != "Accept" || 
      underwritingApproval.specialApproval == "0") {
      res
        .status(400)
        .json({ msg: "Can not change status before RI approval" });
      return
    }
    else {
      if (underwritingApproval.motorProposalId) {
        if (req.body.proposalStatus == "Accept") {
          proposal = await Proposal.update({
            underwritingApproval: req.body.proposalStatus,
            canNotEdit: true
          },
            { where: { id: id } }
          );
        }
        else
          proposal = await Proposal.update(
            {
              underwritingApproval: req.body.proposalStatus,
              canNotEdit: true
            },
            { where: { id: id } }
          );
        const updatedProposal = await Proposal.findByPk(id, {
          include: [{
            model: Contact,
            include: [Branch]
          }, { model: MotorProposal, include: [Quotation] }],
        }).then(async (proposal) => {
          if (proposal.underwritingApproval == "Accept") {

            const policy = await generateMultiplePolicy(proposal, policyStatus.draftPolicy, branchManagerApprovalStatus.pending)

            if (policy == -1) {
              // return res.status(400).json({ msg: "Draft policy not generated" });

            }
          }
          // return proposal  
        })
      }
      else if (underwritingApproval.fireProposalId) {
        if (req.body.proposalStatus == "Accept") {
          proposal = await Proposal.update({
            underwritingApproval: req.body.proposalStatus,
            canNotEdit: true
          },
            { where: { id: id } }
          );
        }
        else
          proposal = await Proposal.update(
            {
              underwritingApproval: req.body.proposalStatus,
              canNotEdit: true
            },
            { where: { id: id } }
          );
        const updatedProposal = await Proposal.findByPk(id, {
          include: [{
            model: Contact,
            include: [Branch]
          }, { model: FireProposal, include: [FireQuotation] }],
        }).then(async (proposal) => {
          if (proposal.underwritingApproval == "Accept") {
            // const policy = await generatePolicy(proposal)
            const policy = await generateMultipleFirePolicy(proposal, policyStatus.draftPolicy, branchManagerApprovalStatus.pending)

            if (policy == -1) {
              // return res.status(400).json({ msg: "Draft policy not generated" });

            }
          }
          // return proposal 
        })
      }

      let ipAddress = getIpAddress(req.ip);
      const eventLog = await createEventLog(
        req.user.id,
        eventResourceTypes.proposal,
        underwritingApproval.contact
          ? underwritingApproval.contact == "Corporate"
            ? underwritingApproval.contact.companyName
            : underwritingApproval.contact == "Join Individual"
              ? underwritingApproval.contact.joinIndividualName
              : underwritingApproval.contact == "Individual"
                ? underwritingApproval.contact.firstName
                : ""
          : "",
        underwritingApproval.id,
        eventActions.edit,
        "handleUnderwritingApproval",
        ipAddress
      );
    }
    res.status(200).json(proposal);
  } catch (error) {

    res.status(400).json({ msg: error.message });

  }
};

const handlePreApprovalCheck = async (req, res) => {
  try {
    // const sh = await Proposal.findByPk(req.params.id);
    const id = req.body.id;
    const status = req.body.proposalStatus;
    const getProposal = await Proposal.findByPk(id);
    if (getProposal.underwritingApproval != "Accept") {
      res
        .status(400)
        .json({ msg: "Can not change status before Underwriting approval" });
      return;
    }

    // if (getProposal.canNotEdit == true) {
    //     res.status(400).json({ msg: "Uneditable" })
    //     return
    // }
    if (status == "Accept") {
      const proposal = await Proposal.update(
        { preApprovalCheck: status },
        { where: { id: id } }
      );
    } else {
      const proposal = await Proposal.update(
        {
          preApprovalCheck: status,
          notificationNotSeen: true,
        },
        { where: { id: id } }
      );
    }
    const updatedProposal = await Proposal.findByPk(id, { include: [Contact] });

    let ipAddress = getIpAddress(req.ip);
    const eventLog = await createEventLog(
      req.user.id,
      eventResourceTypes.proposal,
      updatedProposal.Contact
        ? updatedProposal.Contact == "Corporate"
          ? updatedProposal.Contact.companyName
          : updatedProposal.Contact == "Join Individual"
            ? updatedProposal.Contact.joinIndividualName
            : updatedProposal.Contact == "Individual"
              ? updatedProposal.Contact.firstName
              : ""
        : "",
      updatedProposal.id,
      eventActions.edit,
      "preApprovalCheck",
      ipAddress
    );
    res.status(200).json(updatedProposal);
  } catch (error) {

    res.status(400).json({ msg: error.message });
  }
};

const handleBranchManager = async (req, res) => {
  try {
    // const sh = await Proposal.findByPk(req.params.id);

    const id = req.body.id;
    console.log("the proposal approval value", req.body.proposalStatus)
    console.log("req.body value", req.body)
    let status  = req.body.proposalStatus;
    const proposalApproval = await Proposal.findByPk(id, { include: [Contact] });
    if (
      proposalApproval.underwritingApproval != "Accept" ||
      proposalApproval.preApprovalCheck != "Accept"
    ) {
      return res.status(400).json({
        msg: "Can not change status before Underwriting approval and Pre-approval",
      });
    }
    // if (proposalApproval.canNotEdit == true) {
    //     res.status(400).json({ msg: "Uneditable" })
    //     return
    // }
    const proposal = await Proposal.update(
      {
        branchManagerApproval: req.body.proposalStatus,
        notificationNotSeen: true,
        canNotEdit: true

      },

      { where: { id: req.body.id } }
    )
    const updatedProposal = await Proposal.findByPk(req.body.id, {
      include: [{
        model: Contact,
        include: [Branch]
      }, { model: MotorProposal, include: [Quotation] }],
    }).then(async (proposal) => {
      if (status == "Accept") {

        if (proposal.fireProposalId) {
          console.log(" in to teh abyss", proposal)
          // const policy = await generateDraftPolicy(proposal)
          const policy = await generateMultipleFirePolicy(proposal, policyStatus.draftPolicy, branchManagerApprovalStatus.approved)

          console.log("branch policy fire tesing", policy)

          if (policy == false) {
            return res.status(400).json({ msg: "Draft policy not generated" });
          }
        }

        else if (proposal.motorProposalId) {

          // const policy = await generateDraftPolicy(proposal, policyStatus.draftPolicy, branchManagerApprovalStatus.approved)

          const policy = await generateMultiplePolicy(proposal, policyStatus.draftPolicy, branchManagerApprovalStatus.approved)
          console.log("branch policy motor", policy)

          if (policy == -1) {
            return res.status(400).json({ msg: "Draft policy not generated" });
          }
        }
        else {
          console.log("inside else");
          return res.status(400).json({ msg: "Draft policy not generated" });

        }
        // else {
        // const sms = await sendAcceptanceSMS(updatedProposal.contact.primaryPhone)
        // if (sms == -1) {
        //   return res.status(400).json({
        //     msg: "SMS not sent to the Client",
        //   });
        // }
        // }
      }
      return proposal
    })

    let ipAddress = getIpAddress(req.ip);
    // const eventLog = await createEventLog(
    //   req.user.id,
    //   eventResourceTypes.proposal,
    //   updatedProposal.Contact
    //     ? updatedProposal.Contact == "Corporate"
    //       ? updatedProposal.Contact.companyName
    //       : updatedProposal.Contact == "Join Individual"
    //         ? updatedProposal.Contact.joinIndividualName
    //         : updatedProposal.Contact == "Individual"
    //           ? updatedProposal.Contact.firstName
    //           : ""
    //     : "",
    //   updatedProposal.id,
    //   eventActions.edit,
    //   "branchManagerApproval",
    //   ipAddress
    // );
    return res.status(200).json(proposal);
  } catch (error) {
    console.log("erro branch ==", error)
    return res.status(400).json({ msg: error.message });
  }
};

const handleSpecialApproval = async (req, res) => {
  try {
    const id = req.body.id;



    // if (!underwritingApproval.editable) {
    //     res.status(400).json({ msg: "Uneditable" })
    // }
    const proposal = await Proposal.update(
      {
        specialApproval: req.body.proposalStatus,
        canNotEdit: true


      },
      { where: { id: id } }
    );
    const updatedProposal = await Proposal.findByPk(id, { include: [Contact] });

    let ipAddress = getIpAddress(req.ip);
    const eventLog = await createEventLog(
      req.user.id,
      eventResourceTypes.proposal,
      updatedProposal.Contact
        ? updatedProposal.Contact == "Corporate"
          ? updatedProposal.Contact.companyName
          : updatedProposal.Contact == "Join Individual"
            ? updatedProposal.Contact.joinIndividualName
            : updatedProposal.Contact == "Individual"
              ? updatedProposal.Contact.firstName
              : ""
        : "",
      updatedProposal.id,
      eventActions.edit,
      "specialApproval",
      ipAddress
    );
    res.status(200).json(proposal);
  } catch (error) {

    res.status(400).json({ msg: error.message });
  }
};

const getProposalNotification = async (req, res) => {
  try {
    // const sh = await Proposal.findByPk(req.params.id);
    const proposal = await Proposal.findAndCountAll({
      include: [Contact],

      where: {
        [Op.and]: [
          {
            [Op.or]: [
              { underwritingApproval: "Reject" },
              { preApprovalCheck: "Reject" },
              { specialApproval: "Reject" },
              { branchManagerApproval: "Reject" },
              { branchManagerApproval: "Accept" },
            ],
          },
          { userId: req.user.id },
          { notificationNotSeen: true },
        ],
      },
    });
    // const updatedProposal = await Proposal.findByPk(req.body.id, { include: [Contact] });

    // let ipAddress = getIpAddress(req.ip);
    // const eventLog = await createEventLog(
    //     req.user.id,
    //     eventResourceTypes.proposal,
    //     updatedProposal.Contact ? updatedProposal.Contact == "Corporate" ? updatedProposal.Contact.companyName : updatedProposal.Contact == "Join Individual" ? newProposal.Contact.joinIndividualName : updatedProposal.Contact == "Individual" ? updatedProposal.Contact.firstName : "" : "",
    //     updatedProposal.id,
    //     eventActions.edit,
    //     "branchManagerApproval",
    //     ipAddress
    // );

    res.status(200).json(proposal);
  } catch (error) {

    res.status(400).json({ msg: error.message });
  }
};

const printProposalByPk = async (req, res) => {
  const proposalId = req.params.id;

  try {
    const newProposal = await Proposal.findByPk(proposalId, {
      include: [
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
          model: MotorProposal,
          include: [Quotation]
        }

      ],
    }).then(async (proposal) => {
      let printData = {
        name:
          proposal.contact.type == "Corporate"
            ? proposal.contact.companyName
            : proposal.contact.type == "Join Individual"
              ? proposal.contact.joinIndividualName
              : proposal.contact.type == "Individual"
                ? `${proposal.contact.firstName ?? ' '} ${proposal.contact.middleName ?? ' '} ${proposal.contact.lastName ?? ''}`
                : "",

        proposalNo: proposal.proposalNo,
        // industry: proposal.contact.industry,
        branch: proposal.contact.branch.name,
        riskprimaryEmail: proposal.contact.primaryEmail,
        primaryPhone: proposal.contact.primaryPhone,
        country: proposal.contact.country,
        city: proposal.contact.city,
        region: proposal.contact.region,
        subcity: proposal.contact.subcity,
        riskworeda: proposal.contact.woreda,
        riskkebele: proposal.contact.kebele,
        riskpoBox: proposal.contact.poBox,
        coverType: proposal.motor_proposal.quotation.coverType,
        vehicleType: proposal.motor_proposal.quotation.vehicle_type,
        purpose: proposal.motor_proposal.quotation.purpose,
        carryingCapacity: proposal.motor_proposal.quotation.carrying_capacity,
        yearOfManufacture: proposal.motor_proposal.quotation.manufactured_date.substring(0, 10),
        engineNo: proposal.motor_proposal.engineNo,
        // makeOfVehicle: proposal.motor_proposal.quotation.makeOfVehicle,
        // yearOfPurchased: proposal.motor_proposal.yearOfPurchased,
        // typeOfBody: proposal.motor_proposal.typeOfBody,
        pricePaidByTheProposer: proposal.motor_proposal.premium,
        // proposersPresentEstimateValue:
        //   proposal.motor_proposal.proposersPresentEstimateValue,
        // horsePower: proposal.motor_proposal.cc,
        plateNumber: proposal.motor_proposal.plateNumber,
        chassisNo: proposal.motor_proposal.chassisNo,
        cc: proposal.motor_proposal.quotation.cc,
        isThereAdditionalCoverForInternalItems: proposal.motor_proposal.additionalCoverForInternalItems ? true : false,
        additionalCoverForInternalItemsMake:
          proposal.motor_proposal.additionalCoverForInternalItemsMake,
        additionalCoverForInternalItems:
          proposal.motor_proposal.additionalCoverForInternalItems,
        // additionalCoverForInternalItemsMake: proposal.motor_proposal.additionalCoverForInternalItemsMake,
        additionalCoverForInternalItemsValue:
          proposal.motor_proposal.additionalCoverForInternalItemsValue,
        isVehicleState: proposal.motor_proposal.isItInAGoodState ? "Yes" : "No",
        whereIsTheVehicleLeftOvernight:
          proposal.motor_proposal.whereIsTheVehicleLeftOvernight,
        isThereOtherowner: proposal.motor_proposal.otherOwnersName ? true : false,
        otherOwnersName: proposal.motor_proposal.otherOwnersName,
        otherOwnersAddress: proposal.motor_proposal.otherOwnersAddress,
        isThereFinanciallyIntrusted: proposal.motor_proposal.financiallyIntrustedCompanyName ? true : false,
        financiallyIntrustedCompanyName:
          proposal.motor_proposal.financiallyIntrustedCompanyName,
        financiallyIntrustedAddress:
          proposal.motor_proposal.financiallyIntrustedAddress,
        drivingSince: proposal.motor_proposal.drivingSince,
        driverLicenseIssuedFrom:
          proposal.motor_proposal.driverLicenseIssuedFrom,
        physicalInfirmity: proposal.motor_proposal.physicalInfirmity
          ? "Yes"
          : "No",
        OffenseInPastYear: proposal.motor_proposal.OffenseInPastYear
          ? "Yes"
          : "No",
        previousInsurance: proposal.motor_proposal.previousInsurance,
        proposalHasBeenDeclinedBefore: proposal.motor_proposal
          .proposalHasBeenDeclinedBefore
          ? "Yes"
          : "No",
        refusedToRenewPolicyByAnyInsurance: proposal.motor_proposal
          .refusedToRenewPolicyByAnyInsurance
          ? "Yes"
          : "No",
        insuranceCompanyHasCancelledYourPolicy: proposal.motor_proposal
          .insuranceCompanyHasCancelledYourPolicy
          ? "Yes"
          : "No",
        insuranceCompanyHasIncreasedYourPremium: proposal.motor_proposal
          .insuranceCompanyHasIncreasedYourPremium
          ? "Yes"
          : "No",
        requiredToCarryTheFirstPositionInALoss: proposal.motor_proposal
          .requiredToCarryTheFirstPositionInALoss
          ? "Yes"
          : "No",
        imposedSpecialCondition: proposal.motor_proposal.imposedSpecialCondition
          ? "Yes"
          : "No",
        accidentOnTheVehicle: proposal.motor_proposal.accidentOnTheVehicle,
        personalInjury: proposal.motor_proposal.personalInjury,
        propertyDamage: proposal.motor_proposal.propertyDamage,
        noClaim: proposal.noClaim != null ? "Yes" : "No",
      };

      const path = "/print_files/" + Date.now() + ".pdf";

      //print data
      var document = {
        html: html,
        data: printData,
        path: "." + path,
        type: "",
      };
      // 
      await printPdf(document);
      return path;
    });

    let ipAddress = getIpAddress(req.ip);
    // const eventLog = await createEventLog(
    //     req.user.id,
    //     eventResourceTypes.proposal,
    //     newProposal.Contact ? newProposal.Contact == "Corporate" ? newProposal.Contact.companyName : newProposal.Contact == "Join Individual" ? newProposal.Contact.joinIndividualName : newProposal.Contact == "Individual" ? newProposal.Contact.firstName : "" : "",
    //     newProposal.id,
    //     eventActions.view,
    //     "",
    //     ipAddress
    // );
    // 
    res.status(200).json(newProposal);
  } catch (error) {


    res.status(404).json({ msg: error.message });
  }
};


const sendAcceptanceSMS = async (phone) => {
  try {

    const content = "Dear customer,\n\nYour proposal has been accepted. Please pay the required premium fee and collect your policy.\n\n Zemen Insuracne Sc."
    // const sms = sendNewSms(["+251940844183"], content)
    if (sms == 0) {
      res.status(400).json({ msg: "Unable to sens the customer a message" });
    }

  }
  catch (error) {
    return -1

  }
}

const getProposalByContactId = async (req, res) => {
  const { f, r, st, sc, sd } = req.query;
  const contactId = req.params.id;



  try {
    const proposals = await Proposal.findAndCountAll({
      offset: Number(f),
      limit: Number(r),
      order: [[sc || "createdAt", sd == 1 ? "DESC" : "ASC"]],
      where: {
        contactId: contactId,
        ...(st ? { [Op.or]: [getSearch(st)] } : {}),
      },
    });

    if (proposals) {
      res.status(200).json(proposals);
    } else {
      res.status(404).json({ msg: "Proposals for this contact not found" });
    }

  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};

const generateReport = async (req, res) => {

  let proposal;
  console.log("proposals report req", req.user.role)

  if (!(await canUserRead(req.user, "proposals"))) {
    return res.status(401).json({ msg: "unauthorized access!" });
  }

  const { f, r, st, sc, sd, purpose } = req.query;
  const {
    types,
    names,
    phone_numbers,
    startDate,
    endDate
  } = req.body;
  const role = req.user.role;

  let formattedStartDate;
  let formattedEndDate;

  if (startDate) {
    formattedStartDate = new Date(new Date(startDate).setHours(0, 0, 0, 0));
  }
  if (endDate) {
    formattedEndDate = new Date(new Date(endDate).setHours(23, 59, 59, 0));
  }

  const pagination = purpose === "export" || {
    offset: Number(f),
    limit: Number(r),
  };

  console.log("generateReport", req.body)


  try {
    if (role == Role.superAdmin) {
      const conditions = {
        [Op.and]: [
          types && types.length !== 0 && types[0] !== 0
            ? {
              "$contact.type$": {
                [Op.in]: types.map((type) => {
                  return type.name;
                }),
              },
            }
            : {},
          names && names.length !== 0 && names[0] !== 0
            ? {
              [Op.or]: {
                [Op.and]: {
                  "$contact.firstName$": {
                    [Op.in]: names.map((name) => {
                      let nameParts = name.split(' ')
                      return nameParts[0];
                    })
                  },
                  "$contact.middleName$": {
                    [Op.eq]: names.map((name) => {
                      let nameParts = name.split(' ')
                      return nameParts[1];
                    })
                  },
                },
                "$contact.companyName$": {
                  [Op.in]: names,
                },
                "$contact.joinIndividualName$": {
                  [Op.in]: names,
                },
              },
            }
            : {},
          phone_numbers && phone_numbers.length !== 0 && phone_numbers[0] !== 0
            ? {
              "$contact.primaryPhone$": {
                [Op.in]: phone_numbers,
              },
            }
            : {},
          formattedStartDate ? { createdAt: { [Op.gte]: formattedStartDate } } : {},
          formattedEndDate ? { createdAt: { [Op.lte]: formattedEndDate } } : {},
        ],
      };

      console.log("condition is  ", conditions);

      proposal = await Proposal.findAndCountAll({
        include: [Contact],
        subQuery: false,
        ...pagination,
        order: [[sc || "id", sd == 1 ? "DESC" : "ASC"]],
        distinct: true,
        where: {
          ...conditions,
        },
      });
    }

    if (await canUserAccessOnlySelf(req.user, "proposals")) {
      proposal = await Proposal.findAll({
        include: [User],
        order: [["id", "DESC"]],
        where: {
          ...pagination,
          "$user.id$": req.user.id,
          deleted: false,
        },
      });
    }

    console.log("proposal report", proposal.rows)
    console.log("purpose", purpose);

    if (!proposal) {
      res.status(404).json({ message: "No Data Found" });
    } else res.status(200).json(proposal);
  } catch (error) {
    console.log("the error is ", error);
    res.status(400).json({ msg: error.message });
  }
};

module.exports = {
  editProposal,
  getProposalByPk,
  getAllProposal,
  getProposalByPlateNo,
  createProposal,
  handleUnderwritingApproval,
  handlePreApprovalCheck,
  handleBranchManager,
  handleSpecialApproval,
  getProposalNotification,
  printProposalByPk,
  getProposalByContactId,
  generateReport
};
