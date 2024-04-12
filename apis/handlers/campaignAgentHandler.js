const Branch = require("../../models/Branch");

const Document = require("../../models/Document");
const SalesPerson = require("../../models/SalesPerson");
const CampaignBranch = require("../../models/CampaignBranch");
const Employee = require("../../models/Employee");
const { Op } = require("sequelize");
const sequelize = require("../../database/connections");
const Campaign = require("../../models/Campaign");
const CampaignAgent = require("../../models/CampaignAgent");
const Agent = require("../../models/agent/Agent");


const getCampaignBranch = async (req, res) => {
  try {
    // { include: [SalesPerson, CampaignSales, SalesPerson ]}
    let emp = await Employee.findOne({ where: { userId: req.user.id } })
    //  .branchId; 
    let branchId = await emp.branchId;
    const data = await CampaignBranch.findAll({ where: { branchId }, order: [["createdAt", "DESC"]], });
    res.status(200).json(data);
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};

//posting
const createCampaignBranch = async (req, res) => {
  const dataBody = req.body
  let emp = await Employee.findOne({ where: { userId: req.user.id } })
  //  .branchId; 
  let branchId = await emp.branchId;
  // 
  try {
    const campaign = await CampaignBranch.create({ ...dataBody, branchId });
    res.status(200).json(campaign);
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};

const getOneCampaignAgent = async (req, res) => {
  const { campaignId, agentId } = req.query
  try {
    const campaign = await CampaignAgent.findOne({ where: { campaignId, agentId } }).then(function (
      campaign
    ) {
      if (!campaign) {
        res.status(400).json({ message: "No Data Found" });
      }
      else {
        res.status(200).json(campaign);
      }

    });

  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};

const editCampaignBranch = async (req, res) => {
  

  try {
    // 
    const body = req.body
    // 
    const campaignId = req.body.campaignId
    const agentId = req.body.agentId
    // 

    const emp = await Employee.findAll({ where: { userId: req.user.id } })
    // 


    // const campaign = CampaignBranch.findAll({where: {campaignId}});
    const updated = await CampaignAgent.update(body, { where: { campaignId: campaignId, agentId: agentId } });
    res.status(200).json({ msg: "Success" })
  }
  catch (error) {
    res.status(400).json({ msg: error.message });
  }
};


const deleteCampaignBranch = async (req, res) => {
  const id = req.params.id;

  try {
    CampaignBranch.destroy({ where: { id: id } });

    res.status(200).json({ id });
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};

const filterCampaignBranch = async (req, res) => {
  const key = req.query.key;
  const value = req.query.value;
  try {
    const employees = await CampaignBranch.findAll({
      order: [["id", "ASC"]],
      where: {
        [key]: value
      },
    });
    if (!employees) {
      res.status(404).json({ message: "No Data Found" });
    } else res.status(200).json(employees);
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};

const getCampaignBranchMembers = async (req, res) => {
  try {
    const { BranchId } = req.query;
    let emp = await Employee.findOne({ where: { userId: req.user.id } })
    let branchId = await emp.branchId;
    const findBranch = await CampaignBranch.findAll({
      where:
        { branchId: branchId, id: BranchId },
    });

    const memberIds = findBranch[0].BranchMembers.split(",");
    const BranchLeaderId = findBranch[0].BranchLeader;
    // 

    const BranchLeaderData = await Employee.findByPk(BranchLeaderId);
    const BranchLeaderName = BranchLeaderData.first_name + " " + BranchLeaderData.father_name;


    // 

    const BranchMembers = await Employee.findAll({
      where:
        { id: { [Op.in]: memberIds } },
    });
    res.status(200).json({ BranchMembers, BranchLeaderName });
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};

const getSingleCampaignAgent = async (req, res) => {
  const { campaignId } = req.query;
  const userId = req.user.id;


  let Agentt = await Agent.findOne({ where: { accountId: req.user.id } })

  

  if (Agentt) {
    try {
      const campaign = await CampaignAgent.findAll({ where: { campaignId: campaignId, agentId: Agentt.id } }).then(function (
        campaign
      ) {
        if (!campaign) {
          res.status(400).json({ message: "No Data Found" });
        }
        else {
          res.status(200).json(campaign[0]);
        }

      });

    } catch (error) {
      res.status(400).json({ msg: error.message });
    }
  }
};

// const getSingleCampaignAgent = async (req, res) => {
//   const { campaignId } = req.query;
//   const userId = req.user.id;

//   try {
//     let agent = await Agent.findOne({ where: { accountId: userId } });

//     console.log("Agent value is ", agent);

//     if (agent) {
//       const campaign = await CampaignAgent.findAll({ where: { campaignId: campaignId, agentId: agent.id } });

//       if (campaign.length === 0) {
//         res.status(400).json({ message: "No Data Found" });
//       } else {
//         res.status(200).json({ campaign: campaign[0], agent: agent });
//       }
//     } else {
//       res.status(400).json({ message: "Agent not found" });
//     }
//   } catch (error) {
//     res.status(400).json({ msg: error.message });
//   }
// };

const getSingleCampaignBranch = async (req, res) => {
  const { campaignId } = req.query;
  
  const userId = req.user.id;
  let emp = await Employee.findOne({ where: { userId } })
  // 

  try {
    const campaign = await CampaignBranch.findAll({ where: { campaignId: campaignId, branchId: emp.branchId } }).then(function (
      campaign
    ) {
      if (!campaign) {
        res.status(400).json({ message: "No Data Found" });
      }
      else {
        res.status(200).json(campaign[0]);
      }

    });

  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};

const reportCampaignAgent = async (req, res) => {
  const campIndId = req.body.id;
  

  try {
    const report = await CampaignAgent.update({ isReported: true }, { where: { id: campIndId } });

    res.status(200).json(report);
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};


// const reportCampaignBranch = async (req, res) => {
//   const campBranchId = req.body.id;
//   // 

//   try {
//       const report = await CampaignBranch.update({isBranchReported: true}, { where: { id :campBranchId} });

//       res.status(200).json(report);
//   } catch (error) {
//       res.status(400).json({ msg: error.message });
//   }
// };

const reportCampaignBranch = async (req, res) => {
  const { campBranchId, type, total } = req.body;
  // const type = req.body.type;
  // 

  try {
    if (type == "Branch") {
      const report = await CampaignBranch.update({ isBranchReported: true }, { where: { id: campBranchId } });
      res.status(200).json(report);
    } else if (type == "Team") {
      const body = {
        actualCost: total.total_actualCost,
        actualSalesCount: total.total_actualSalesCount,
        actualResponseCount: total.total_actualResponseCount,
        actualROI: total.total_actualROI,
        actualRevenue: total.total_actualRevenue,
      }
      const report = await CampaignBranch.update({ isTeamTotalReported: true, ...body }, { where: { id: campBranchId } });
      res.status(200).json(report);
    }


    res.status(200).json(report);
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};

const totalCampaignAgent = async (req, res) => {
  const campaignId = req.params.id;

  try {
    const userId = req.user.id;
    let emp = await Employee.findOne({ where: { userId } })
    // const report = await CampaignTeam.update({isReported: true}, { where: { id :campIndId} });
    const totalAmount = await CampaignAgent.findAll({
      attributes: [
        // 'branchId',
        'campaignId',
        [sequelize.fn('sum', sequelize.col('actualCost')), 'total_actualCost'],
        [sequelize.fn('sum', sequelize.col('actualSalesCount')), 'total_actualSalesCount'],
        [sequelize.fn('sum', sequelize.col('actualResponseCount')), 'total_actualResponseCount'],
        [sequelize.fn('sum', sequelize.col('actualROI')), 'total_actualROI'],
        [sequelize.fn('sum', sequelize.col('actualRevenue')), 'total_actualRevenue'],

      ],
      group: [
        // 'branchId', 
        'campaignId',],
      where: { [Op.or]: [{ isReported: true }] }
    });

    let index;
    for (let i = 0; i < totalAmount.length; i++) {
      if (
        // totalAmount[i].branchId == emp.branchId &&
        totalAmount[i].campaignId == campaignId) {
        index = i;
      }

    }
    res.status(200).json(totalAmount[index]);
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};

const updateExpectedValues = async (req, res) => {

  try {
    

    const body = req.body;

    // const body = { ...req.body, isExpectedSet: true };
    // const allData = await CampaignBranch.bulkCreate(req.body, { updateOnDuplicate: ["branchId", "campaignId"] });

    for (let i = 0; i < body.length; i++) {
      CampaignAgent.update(body[i], { where: { campaignId: body[i].campaignId, agentId: body[i].agentId } })
    }

    const updateCampaignStatus = await Campaign.update({ isAgentExpectedSet: true }, { where: { id: body[0].campaignId } })

    res.status(200).json({ msg: "Agent Campaign updated" });
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};

module.exports = {
  getCampaignBranch,
  createCampaignBranch,
  getOneCampaignAgent,
  editCampaignBranch,
  deleteCampaignBranch,
  filterCampaignBranch,
  getCampaignBranchMembers,
  // getSingleBranchMembers,
  getSingleCampaignAgent,
  getSingleCampaignBranch,
  reportCampaignBranch,
  totalCampaignAgent,
  updateExpectedValues,
  reportCampaignAgent
};
