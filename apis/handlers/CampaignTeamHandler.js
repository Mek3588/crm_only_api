const Branch = require("../../models/Branch");

const Document = require("../../models/Document");
const SalesPerson = require("../../models/SalesPerson");
const CampaignTeam = require("../../models/CampaignTeam");
const Employee = require("../../models/Employee");
const { Op } = require("sequelize");
const sequelize = require("../../database/connections");
const CampaignBranch = require("../../models/CampaignBranch");
const CampaignIndividual = require("../../models/CampaignIndividual");
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
const Campaign = require("../../models/Campaign");

const getCampaignTeam = async (req, res) => {
  try {
    // { include: [SalesPerson, CampaignSales, SalesPerson ]}
    const id = req.params.id;
    let emp = await Employee.findOne({ where: { userId: req.user.id } })
    //  .branchId; 
    let branchId = await emp.branchId;
    const data = await CampaignTeam.findAll({ where: { branchId, campaignId: id }, order: [["createdAt", "DESC"]], });
    res.status(200).json(data);
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};

//posting
const createCampaignTeam = async (req, res) => {
  const dataBody = req.body
  let emp = await Employee.findOne({ where: { userId: req.user.id } })
  //  .branchId; 
  let branchId = await emp.branchId;
  // 
  try {
    const campaign = await CampaignTeam.create({ ...dataBody, branchId });
    res.status(200).json(campaign);
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};

const getCampaignTeamByPk = async (req, res) => {
  const params = req.params.id
  try {
    const campaign = await CampaignTeam.findByPk(params).then(function (
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

const editCampaignTeam = async (req, res) => {


  try {
    // 
    const body = req.body
    // 
    const campaignId = req.body.campaignId
    // 

    const emp = await Employee.findAll({ where: { userId: req.user.id } })
    // 


    // const campaign = CampaignTeam.findAll({where: {campaignId}});
    const updated = await CampaignTeam.update(body, { where: { campaignId: campaignId, teamLeader: emp[0].id } });
    res.status(200).json({ msg: "Success" })
  }
  catch (error) {
    res.status(400).json({ msg: error.message });
  }
};


const deleteCampaignTeam = async (req, res) => {
  const id = req.params.id;

  try {
    CampaignTeam.destroy({ where: { id: id } });

    res.status(200).json({ id });
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};

const filterCampaignTeam = async (req, res) => {
  const key = req.query.key;
  const value = req.query.value;
  try {
    const employees = await CampaignTeam.findAll({
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

const getCampaignTeamMembers = async (req, res) => {
  try {
    // 
    const teamId = req.params.id;
    let emp = await Employee.findOne({ where: { userId: req.user.id } })
    let branchId = await emp.branchId;
    const findTeam = await CampaignTeam.findAll({
      where:
        { branchId: branchId, id: teamId },
    });

    const memberIds = findTeam[0].teamMembers.split(",");
    const teamLeaderId = findTeam[0].teamLeader;
    // 

    const teamLeaderData = await Employee.findByPk(teamLeaderId);
    const teamLeaderName = teamLeaderData.first_name + " " + teamLeaderData.father_name;


    // 

    const teamMembers = await Employee.findAll({
      where:
        { id: { [Op.in]: memberIds } },
    });
    res.status(200).json({ teamMembers, teamLeaderName });
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};

const getSingleTeamMembers = async (req, res) => {
  try {
    
    const campaignId = req.params.id;
    
    let emp = await Employee.findOne({ where: { userId: req.user.id } })
    let branchId = await emp.branchId;
    const findTeam = await CampaignTeam.findAll({
      where:
        { campaignId, teamLeader: emp.id },
    });

    

    const memberIds = findTeam[0].teamMembers.split(",");
    const teamLeaderId = findTeam[0].teamLeader;
    // 

    const teamLeaderData = await Employee.findByPk(teamLeaderId);
    const teamLeaderName = teamLeaderData.first_name + " " + teamLeaderData.father_name;
    const team_Members = await Employee.findAll({
      where:
        { id: { [Op.in]: memberIds } },
      attributes: ['first_name', 'father_name', 'id', 'employeeId']
    });

    let teamMembers = []

    for (let i = 0; i < team_Members.length; i++) {
      let temp;
      temp = {
        ...team_Members[i].dataValues, campaignId, branchId, teamLeaderId,
        expectedCost: 0, expectedSalesCount: 0, expectedResponseCount: 0, expectedROI: 0, expectedRevenue: 0, isExpectedSet: true
      }
      teamMembers.push(temp);
    }




    res.status(200).json({ teamMembers, teamLeaderName });
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};

const getSingleCampaignTeam = async (req, res) => {
  const { campaignId } = req.query;
  const userId = req.user.id;
  let emp = await Employee.findOne({ where: { userId } })
  // 

  try {
    const campaign = await CampaignTeam.findAll({
      where: { campaignId: campaignId, teamLeader: emp.id },
      include: { model: Campaign, as: "mainCampaign" }
    });
      if (!campaign) {
        res.status(400).json({ message: "No Data Found" });
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
        res.status(200).json(campaign[0]);
      }


  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};

const reportCampaignTeam = async (req, res) => {
  const { campTeamId, type, total } = req.body;
  // const type = req.body.type;
  // 

  try {
    if (type == "Team") {
      const report = await CampaignTeam.update({ isTeamReported: true }, { where: { id: campTeamId } });
      res.status(200).json(report);
    } else if (type == "Individual") {
      const body = {
        actualCost: total.total_actualCost,
        actualSalesCount: total.total_actualSalesCount,
        actualResponseCount: total.total_actualResponseCount,
        actualROI: total.total_actualROI,
        actualRevenue: total.total_actualRevenue,

      }
      const report = await CampaignTeam.update({ isIndividualTotalReported: true, ...body }, { where: { id: campTeamId } });
      res.status(200).json(report);
    }


    res.status(200).json(report);
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};

const getTeamResult = async (req, res) => {
  const { campaignId, teamId } = req.query;
  const userId = req.user.id;
  let emp = await Employee.findOne({ where: { userId } })

  try {
    const campaign = await CampaignTeam.findAll({ where: { campaignId: campaignId, branchId: emp.branchId, id: teamId } }).then(function (
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


const totalCampaignTeam = async (req, res) => {
  const campaignId = req.params.id;

  try {
    const userId = req.user.id;
    let emp = await Employee.findOne({ where: { userId } })
    // const report = await CampaignTeam.update({isReported: true}, { where: { id :campIndId} });
    const totalAmount = await CampaignTeam.findAll({
      attributes: [
        'teamLeader',
        'campaignId',
        [sequelize.fn('sum', sequelize.col('actualCost')), 'total_actualCost'],
        [sequelize.fn('sum', sequelize.col('actualSalesCount')), 'total_actualSalesCount'],
        [sequelize.fn('sum', sequelize.col('actualResponseCount')), 'total_actualResponseCount'],
        [sequelize.fn('sum', sequelize.col('actualROI')), 'total_actualROI'],
        [sequelize.fn('sum', sequelize.col('actualRevenue')), 'total_actualRevenue'],

      ],
      group: ['teamLeader', 'campaignId',],
      // where: { isTeamReported: true , isIndividualTotalReported:true }
      where: { [Op.or]: [{ isTeamReported: true }, { isIndividualTotalReported: true }] }

    });

    let index;
    for (let i = 0; i < totalAmount.length; i++) {
      if (totalAmount[i].teamLeader == emp.id && totalAmount[i].campaignId == campaignId) {
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
      let temp = body[i];
      temp.isExpectedSet = true
      CampaignTeam.update(temp, { where: { id: body[i].id } })
    }
    // { where: { campaignId: campaignId, teamLeader: emp[0].id } }
    const updateCampaignStatus = await CampaignBranch.update({ isTeamExpectedSet: true }, { where: { branchId: body[0].branchId, campaignId: body[0].campaignId } })

    res.status(200).json({ msg: "updated" });
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};

const getTeamIndividualCampaigns = async (req, res) => {
  try {

    
    // 
    const { teamId, campaignId } = req.query;
    let emp = await Employee.findOne({ where: { userId: req.user.id } })
    let branchId = await emp.branchId;
    const findTeam = await CampaignTeam.findByPk(teamId);

    const memberIds = findTeam.teamMembers.split(",");
    // const teamLeaderId = findTeam[0].teamLeader;
    // 

    // const teamLeaderData = await Employee.findByPk(teamLeaderId);
    // const teamLeaderName = teamLeaderData.first_name + " " + teamLeaderData.father_name;

    const findInd = await CampaignIndividual.findAll({
      where:
      {
        teamMemberId: { [Op.in]: memberIds },
        campaignId,
        branchId,
        teamLeaderId: emp.id,
      },
    });


    res.status(200).json(findInd);
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};

module.exports = {
  getCampaignTeam,
  createCampaignTeam,
  getCampaignTeamByPk,
  editCampaignTeam,
  deleteCampaignTeam,
  filterCampaignTeam,
  getCampaignTeamMembers,
  getSingleTeamMembers,
  getSingleCampaignTeam,
  reportCampaignTeam,
  getTeamResult,
  totalCampaignTeam,
  updateExpectedValues,
  getTeamIndividualCampaigns
};
