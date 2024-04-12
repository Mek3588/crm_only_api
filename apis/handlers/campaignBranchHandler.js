const Branch = require("../../models/Branch");

const Document = require("../../models/Document");
const SalesPerson = require("../../models/SalesPerson");
const CampaignBranch = require("../../models/CampaignBranch");
const Employee = require("../../models/Employee");
const { Op } = require("sequelize");
const sequelize = require("../../database/connections");
const Campaign = require("../../models/Campaign");

const {
  Role,
  eventResourceTypes,
  eventActions,
} = require("../../utils/constants");
const {
  isEmailValid,
  isPhoneNoValid,
  createEventLog,
  getChangedFieldValues,
  getIpAddress,
} = require("../../utils/GeneralUtils");

const getCampaignBranch = async (req, res) => {
  try {
    const role = req.user.role;
    
    if(role == Role.superAdmin){
      const data = await CampaignBranch.findAll({order: [["createdAt", "DESC"]], });
      res.status(200).json(data);
    }
    else if (role ==Role.staff){
      // { include: [SalesPerson, CampaignSales, SalesPerson ]}
    let emp = await Employee.findOne({ where: { userId: req.user.id } })
    //  .branchId; 
    let branchId = await emp.branchId;
    if(emp){
    const data = await CampaignBranch.findAll({ where: { branchId }, order: [["createdAt", "DESC"]], });
    res.status(200).json(data);
    }
    }
  } catch (error) {
    console.log("getCampaignBranch", error)
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

const getOneCampaignBranch = async (req, res) => {
  const { campaignId, branchId } = req.query
  try {
    const campaign = await CampaignBranch.findOne({ where: { campaignId, branchId } }).then(function (
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

console.log("editCampaignBranch", req.query)
  try {
    const { branchId } = req.query
    const role = req.user.role;
    // 
    const body = req.body
    // 
    const campaignId = req.body.campaignId
    // 

    const emp = await Employee.findAll({ where: { userId: req.user.id } })
    // 
    if(role == Role.superAdmin){
      const updated = await CampaignBranch.update(body, { where: { campaignId: campaignId, branchId: branchId } });
      res.status(200).json({ msg: "Success" })

    }
    else if(role == Role.staff && emp){
    // const campaign = CampaignBranch.findAll({where: {campaignId}});
    const updated = await CampaignBranch.update(body, { where: { campaignId: campaignId, branchId: emp[0].branchId } });
    res.status(200).json({ msg: "Success" })
    }
  }
  catch (error) {
    console.log("editCampaignBranch error", error)
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

const getSingleBranchMembers = async (req, res) => {
  try {
    const { campaignId } = req.query;
    let emp = await Employee.findOne({ where: { userId: req.user.id } })
    let branchId = await emp.branchId;
    const findBranch = await CampaignBranch.findAll({
      where:
        { campaignId, BranchLeader: emp.id },
    });

    const memberIds = findBranch[0].BranchMembers.split(",");
    const BranchLeaderId = findBranch[0].BranchLeader;
    // 

    const BranchLeaderData = await Employee.findByPk(BranchLeaderId);
    const BranchLeaderName = BranchLeaderData.first_name + " " + BranchLeaderData.father_name;
    const BranchMembers = await Employee.findAll({
      where:
        { id: { [Op.in]: memberIds } },
    });

    res.status(200).json({ BranchMembers, BranchLeaderName });
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};

const getSingleCampaignBranch = async (req, res) => {
  const { campaignId, campaignbranchId } = req.query
  // const { campaignId } = req.query;
  const role = req.user.role;
  
  const userId = req.user.id;
  let emp = await Employee.findOne({ where: { userId } })
  // 
  // console.log("getSingleCampaignBranch", req.query, userId, emp)


  try {
    if(role == Role.superAdmin){

      if(campaignbranchId == 0 || null) {
        const  campaigns = await CampaignBranch.findAll({ 
            where: { 
              campaignId: campaignId,
            },
            include:[ 
              {
              model: Campaign,
              as: "mainCampaign"
            },
            // {
            //   model: Branch,
            //   as : "campaignBranches"
            // }
          ]
        });

        if (!campaigns || campaigns.length === 0) {
          return res.status(400).json({ message: "No Data Found" });
        } else {
          let ipAddress = getIpAddress(req.ip);
        
          // Create event logs for each campaign found
          for (let i = 0; i < campaigns.length; i++) {
            const eventLog = await createEventLog(
              req.user.id,
              eventResourceTypes.campaign,
              campaigns[i].mainCampaign.campaignName,
              campaigns[i].id,
              eventActions.view,
              "",
              ipAddress
            );
          }
        
          // console.log("getSingleCampaignBranchforhead 2",  campaigns);
        }
        return  res.status(200).json(campaigns);
     }
      else if(campaignbranchId != 0 || campaignbranchId != null){
        const campaign = await CampaignBranch.findAll({ 
            where: { 
              campaignId: campaignId, branchId: campaignbranchId
            },
            include:[ 
              {
              model: Campaign,
              as: "mainCampaign"
            },
            // {
            //   model: Branch,
            //   as : "campaignBranches"
            // }
          ]
        });
        if (!campaign) {
          return res.status(400).json({ message: "No Data Found" });
        }
        else {
      
          let ipAddress = getIpAddress(req.ip);
          const eventLog = await createEventLog(
            req.user.id,
            eventResourceTypes.campaign,
            "",
            0,
            eventActions.view,
            "",
            ipAddress
          );
        return  res.status(200).json(campaign[0]);
        }
    }
    }else if (emp) {    
          const campaign = await CampaignBranch.findAll({ where: { campaignId: campaignId, branchId: emp.branchId },
          include: {model: Campaign, as: "mainCampaign"} })

            if (!campaign) {
              return res.status(400).json({ message: "No Data Found" });
            }
            else {
              

              let ipAddress = getIpAddress(req.ip);
              const eventLog = await createEventLog(
                req.user.id,
                eventResourceTypes.campaign,
                campaign[0].mainCampaign.campaignName,
                campaign[0].id,
                eventActions.view,
                "",
                ipAddress
              );
            // console.log("getSingleCampaignBranchforbranch", campaign[0])

            return  res.status(200).json(campaign[0]);
            }
      }
 

  } catch (error) {
  console.log("getSingleCampaignBranchforbrancherror", error)
   return res.status(400).json({ msg: error.message });
  }
};

const getSinglecampaignbranches = async (req, res) => {
  let { campaignbranchId } = req.query;
  console.log("getSingleCampaignBranchforbrancherror", campaignbranchId)

  campaignbranchId = campaignbranchId.split(",").map(id => parseInt(id.trim()));
  // campaignbranchId = Array.isArray(campaignbranchId) ? campaignbranchId : [campaignbranchId];
  console.log("getSingleCampaignBranchforbrancherror", campaignbranchId)
  try {
    const branchIds = {
      [Op.and]: [
        campaignbranchId && campaignbranchId.length !== 0 && campaignbranchId[0] !== 0
          ? {
            id: {
              [Op.in]: campaignbranchId,
            },
          }
          : {},
      ],
    };

    const data = await Branch.findAll({
      where: {
        ...branchIds,
      },
    });

    res.status(200).json(data);
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
  const role = req.user.role;
  // const type = req.body.type;
  // 

  try {
  const { branchId } = req.query;
  if(role == Role.superAdmin){
    if (type == "Branch") {
      const report = await CampaignBranch.update({ isBranchReported: true }, { where: { id: campBranchId } });
     return res.status(200).json(report);
    } else if (type == "Team") {
      const body = {
        actualCost: total.total_actualCost,
        actualSalesCount: total.total_actualSalesCount,
        actualResponseCount: total.total_actualResponseCount,
        actualROI: total.total_actualROI,
        actualRevenue: total.total_actualRevenue,
      }
      const report = await CampaignBranch.update({ isTeamTotalReported: true, ...body }, { where: { id: campBranchId } });
     return res.status(200).json(report);
    }


   return res.status(200).json(report);
  }
  if(role == Role.staff){


    if (type == "Branch") {
      const report = await CampaignBranch.update({ isBranchReported: true }, { where: { id: campBranchId } });
     return res.status(200).json(report);
    } else if (type == "Team") {
      const body = {
        actualCost: total.total_actualCost,
        actualSalesCount: total.total_actualSalesCount,
        actualResponseCount: total.total_actualResponseCount,
        actualROI: total.total_actualROI,
        actualRevenue: total.total_actualRevenue,
      }
      const report = await CampaignBranch.update({ isTeamTotalReported: true, ...body }, { where: { id: campBranchId } });
     return res.status(200).json(report);
    }


   return res.status(200).json(report);
  }
  } catch (error) {
    console.log("errrrrrrrrrrrrrrr", error)
   return res.status(400).json({ msg: error.message });
  }
};

const totalCampaignBranch = async (req, res) => {
  const campaignId = req.params.id;

  try {
    const userId = req.user.id;
    let emp = await Employee.findOne({ where: { userId } })
    // const report = await CampaignTeam.update({isReported: true}, { where: { id :campIndId} });
    const totalAmount = await CampaignBranch.findAll({
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
      where: { [Op.or]: [{ isBranchReported: true }, { isTeamTotalReported: true }] }
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
console.log("updateExpectedValues",  body)
    // const body = { ...req.body, isExpectedSet: true };
    // const allData = await CampaignBranch.bulkCreate(req.body, { updateOnDuplicate: ["branchId", "campaignId"] });

    for (let i = 0; i < body.length; i++) {
      CampaignBranch.update(body[i], { where: { campaignId: body[i].campaignId, branchId: body[i].branchId } })
    }

    const updateCampaignStatus = await Campaign.update({ isBranchExpectedSet: true }, { where: { id: body[0].campaignId } })

    res.status(200).json({ msg: "updated" });
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};

module.exports = {
  getCampaignBranch,
  createCampaignBranch,
  getOneCampaignBranch,
  editCampaignBranch,
  deleteCampaignBranch,
  filterCampaignBranch,
  getCampaignBranchMembers,
  getSingleBranchMembers,
  getSinglecampaignbranches,
  getSingleCampaignBranch,
  reportCampaignBranch,
  totalCampaignBranch,
  updateExpectedValues
};
