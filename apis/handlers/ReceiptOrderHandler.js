const { Op, where } = require("sequelize");
const Bsg = require("../../models/BSG");
const Contact = require("../../models/Contact");
const Branch = require("../../models/Branch");
const FinanceData = require("../../models/FinanceData");
const Policy = require("../../models/Policy");
const MotorProposal = require("../../models/proposals/MotorProposal");
const Proposal = require("../../models/proposals/Proposal");
const Quotation = require("../../models/Quotation");
const User = require("../../models/acl/user");
const Employee = require("../../models/Employee");
// const {
//   canUserRead,
//   canUserCreate,
//   canUserEdit,
//   canUserDelete,
// } = require("../../utils/Authrizations");
const { eventResourceTypes, eventActions, financeStatus, policyStatus, account_stage, branchManagerApprovalStatus } = require("../../utils/constants");
const {
  createEventLog,
  getChangedFieldValues,
  getIpAddress,
} = require("../../utils/GeneralUtils");
const { generateDraftPolicy, generateMultiplePolicy } = require("./PolicyHandler");
const Opportunity = require("../../models/Opportunity");
const FireClaimNotification = require("../../models/fire/claim/FireClaimNotification");
const MultiplePolicy = require("../../models/MultiplePolicy");
const getFinance = async (req, res) => {
  try {
    // if (!(await canUserRead(req.user, "financeOrders"))) {
    //   return res.status(401).json({ msg: "unauthorized access!" });
    // }
    const { f, r, st, sc, sd, status, branchManagerApprovalStatus } = req.query;


    const currentUser = await User.findByPk(req.user.id, {
      include: [Employee],
    });




    if (req.type == "all") {
      const onReceiptOrder = await Policy.findAndCountAll(
        {

          where: { financeStatus: status },
          attributes: ['fullName', 'premium', 'createdAt', 'id', 'policyNumber', 'financeStatus', 'receiptOrderSheetPath', 'branchManagerApprovalStatus',],
          include: [
            {
              model: Proposal, attributes: ['id'],
              where: { branchManagerApproval: branchManagerApprovalStatus },
              include: [
                {
                  model: MotorProposal, attributes: ['id'], include: [
                    {
                      model: Quotation, attributes: ['request_type', 'coverType'], include: [
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
          offset: Number(f),
          limit: Number(r),
          order: sc
            ? [[sc, sd == 1 ? "ASC" : "DESC"]]
            : [["createdAt", sd == 1 ? "DESC" : "ASC"]],
          // where: getSearch(st),
        },
      )

      res.status(200).json(onReceiptOrder);
    } else if (req.type == "self") {
      const onReceiptOrder = await Policy.findAndCountAll(
        {

          where: {
            financeStatus: status,
            [Op.and]: [
              {
                [Op.or]: [
                  { "$proposal.userId$": currentUser.id },
                ],
              },
              getSearch(st),
            ],
          },
          attributes: ['fullName', 'premium', 'createdAt', 'id', 'policyNumber', 'financeStatus', 'receiptOrderSheetPath', 'branchManagerApprovalStatus',],
          include: [
            {
              model: Proposal, attributes: ['id'],
              where: { branchManagerApproval: branchManagerApprovalStatus },
              include: [
                {
                  model: MotorProposal, attributes: ['id'], include: [
                    {
                      model: Quotation, attributes: ['request_type', 'coverType'], include: [
                        {
                          model: FinanceData
                        }
                      ]
                    } //
                  ]
                }
              ]
            }
          ],
          offset: Number(f),
          limit: Number(r),
          order: sc
            ? [[sc, sd == 1 ? "ASC" : "DESC"]]
            : [["createdAt", sd == 1 ? "DESC" : "ASC"]],
          // where: getSearch(st),
        },



      )

      res.status(200).json(onReceiptOrder);
    } else if (req.type == "customer") {
      const onReceiptOrder = await Policy.findAndCountAll(
        {

          where: {
            financeStatus: status,
            [Op.and]: [
              {
                [Op.or]: [
                  { "$proposal.userId$": currentUser.id },
                ],
              },
              getSearch(st),
            ],
          },
          attributes: ['fullName', 'premium', 'createdAt', 'id', 'policyNumber', 'financeStatus', 'receiptOrderSheetPath', 'branchManagerApprovalStatus',],
          include: [
            {
              model: Proposal, attributes: ['id'], as: 'proposal',
              where: { branchManagerApproval: branchManagerApprovalStatus },
              include: [
                {
                  model: MotorProposal, attributes: ['id'], include: [
                    {
                      model: Quotation, attributes: ['request_type', 'coverType'], include: [
                        {
                          model: FinanceData
                        }
                      ]
                    } //
                  ]
                }
              ]
            }
          ],
          offset: Number(f),
          limit: Number(r),
          order: sc
            ? [[sc, sd == 1 ? "ASC" : "DESC"]]
            : [["createdAt", sd == 1 ? "DESC" : "ASC"]],
          // where: getSearch(st),
        },



      )

      res.status(200).json(onReceiptOrder);
    } else if (req.type == "branch") {
      const onReceiptOrder = await Policy.findAndCountAll(
        {

          where: {
            financeStatus: status,
            "$proposal.contact.branchId$": currentUser.employee.branchId,
          },
          attributes: ['fullName', 'premium', 'createdAt', 'id', 'policyNumber', 'financeStatus', 'receiptOrderSheetPath', 'branchManagerApprovalStatus',],
          include: [
            {
              model: Proposal, attributes: ['id'],
              where: { branchManagerApproval: branchManagerApprovalStatus },
              include: [
                {
                  model: MotorProposal, attributes: ['id'], include: [
                    {
                      model: Quotation, attributes: ['request_type', 'coverType'], include: [
                        {
                          model: FinanceData
                        }
                      ]
                    } //
                  ]
                }
              ],
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
            }
          ],
          offset: Number(f),
          limit: Number(r),
          order: sc
            ? [[sc, sd == 1 ? "ASC" : "DESC"]]
            : [["createdAt", sd == 1 ? "DESC" : "ASC"]],
          where: getSearch(st),
        },



      )

      res.status(200).json(onReceiptOrder);
    } else if (req.type == "branchAndSelf") {
      const onReceiptOrder = await Policy.findAndCountAll(
        {
          where:
          {
            [Op.or]: [
              {
                financeStatus: status,
                [Op.and]: [
                  { "$proposal.userId$": currentUser.id },
                  { "$proposal.contact.branchId$": currentUser.employee.branchId, },
                ],
              },
            ],
          },
          attributes: ['fullName', 'premium', 'createdAt', 'id', 'policyNumber', 'financeStatus', 'receiptOrderSheetPath', 'branchManagerApprovalStatus',],
          include: [
            {
              model: Proposal, attributes: ['id'],
              where: { branchManagerApproval: branchManagerApprovalStatus },
              include: [
                {
                  model: MotorProposal, attributes: ['id'], include: [
                    {
                      model: Quotation, attributes: ['request_type', 'coverType'], include: [
                        {
                          model: FinanceData
                        }
                      ]
                    } //
                  ]
                }
              ]
            }
          ],
          offset: Number(f),
          limit: Number(r),
          order: sc
            ? [[sc, sd == 1 ? "ASC" : "DESC"]]
            : [["createdAt", sd == 1 ? "DESC" : "ASC"]],
          // where: getSearch(st),
        },



      )

      res.status(200).json(onReceiptOrder);
    }

  } catch (error) {


    res.status(400).json({ msg: error.message });
  }
};

const getSearch = (st) => {
  return {
    [Op.or]: [
      {
        fullName: { [Op.like]: `%${st}%` },
      },
      {
        policyNumber: { [Op.like]: `%${st}%` },
      },
      {
        premium: { [Op.like]: `%${st}%` },
      },
      {
        id: { [Op.like]: `%${st}%` },
      },
      {
        createdAt: { [Op.like]: `%${st}%` },

      },
    ],
  };
};



const getFinanceByPk = async (req, res) => {
  try {
    // if (!(await canUserRead(req.user, "financeOrders"))) {
    //   return res.status(401).json({ msg: "unauthorized access!" });
    // }
    const onReceiptOrder = await Policy.findByPk(req.params.id,
      {
        where: { financeStatus: financeStatus.receiptOrder, branchManagerApprovalStatus: branchManagerApprovalStatus.approved },
        attributes: ['fullName', 'premium', 'createdAt', 'id', 'receiptOrderSheetPath', 'financeStatus'],
        include: [
          {
            model: Proposal, attributes: ['id'], include: [
              {
                model: MotorProposal, attributes: ['id'], include: [
                  {
                    model: Quotation, attributes: ['request_type', 'coverType'], include: [
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
      },
    )
    if (!onReceiptOrder) {
      res.status(404).json({ message: "No Data Found" });
    } else if (onReceiptOrder) {
      let ipAddress = getIpAddress(req.ip);
      const eventLog = createEventLog(
        req.user.id,
        eventResourceTypes.receipt_order,
        ` `,
        onReceiptOrder.id,
        eventActions.view,
        "",
        ipAddress
      );
      res.status(200).json(onReceiptOrder);
    }


    // res.status(200).json(bsg);
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};

const editFinance = async (req, res) => {
  const bsgBody = req.body;
  const id = req.params.id;

  try {
    // if (!(await canUserEdit(req.user, "bsgs"))) {
    //   return res.status(401).json({ msg: "unauthorized access!" });
    // }
    const duplicateName = await Bsg.findAll({
      where: { vehicle: bsgBody.vehicle },
    });
    if (duplicateName.length !== 0) {
      if (duplicateName[0].id !== bsgBody.id) {
        res.status(400).json({ msg: "Bsg vehicle already used!" });
        return;
      }
    }
    let oldDept = await Bsg.findByPk(id, {});
    let dept = Bsg.update(bsgBody, {
      where: { id: id },
    });

    if (dept) {
      let newDept = await Bsg.findByPk(id, {});
      let changedFieldValues = getChangedFieldValues(oldDept, newDept);
      let ipAddress = getIpAddress(req.ip);
      const eventLog = createEventLog(
        req.user.id,
        eventResourceTypes.bsg,
        newDept.vehicle,
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


const approveFinance = async (req, res) => {
  const id = req.params.id;

  console.log("inside approve finance")

  try {

    const approved = await Policy.update(
      {
        financeStatus: financeStatus.final,
        policyStatus: policyStatus.final,
        isPaid: true
      },
      { where: { id: id } }
    ).then(async (approved) => {


      const policy = await Policy.findByPk(id, { include: [{ model: Proposal, include: [Contact] }] }).then(async (foundPolicy) => {

        if (foundPolicy.policyStatus === policyStatus.final) {
          const contact = await Contact.update({
            accountStage: account_stage.activeClient
          },
            { where: { id: foundPolicy.proposal.contact.id } })
            .then(async (contact) => {

              // }
              if (contact) {
                // updating the multiple policy policy status after payment confirmation
                const updateres = await MultiplePolicy.update({ status: policyStatus.final }, { where: { proposalId: foundPolicy.proposal.id } })
                console.log("updateres", updateres);

                const foundOpportunity = await Opportunity.findOne({ where: { accountId: foundPolicy.proposal.contact.id } })
                if (foundOpportunity) {


                  await Opportunity.update({ status: "Sales completed", probablity: "100" }, { where: { accountId: foundOpportunity.id } })
                }
              }
            })
        }
      });
    });



    //  find the proposal id of the policy
    const proposalId = await Policy.findByPk(id, { attributes: ['proposalId'] });



    // Generate the final policy after approval 


    const proposal = await Proposal.findByPk(proposalId.proposalId, {
      include: [{
        model: Contact,
        include: [Branch]
      }, {
        model: MotorProposal, include: [Quotation]
      }]
    });

    if (approved) {


      // const finalPolicy = await generateMultiplePolicy(proposal, policyStatus.final, branchManagerApprovalStatus.approved);

    }



    // Use the finalPolicy variable outside the asynchronous callback


    res.status(200).json({ id });
  } catch (error) {
    console.log("there is some error while approving finance", error)
    res.status(400).json({ msg: error.message });
  }
};



module.exports = {
  getFinance,
  getFinanceByPk,
  editFinance,
  approveFinance
};
