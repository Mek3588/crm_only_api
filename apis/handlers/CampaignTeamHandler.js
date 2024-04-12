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
    const role = req.user.role;
    const {branchId} = req.query;
    if(role == Role.superAdmin){

      // console.log("branchIIIIIIIIIIIIIIIiddddd", branchId,  id)
      if(branchId != "0" && branchId != 0 && branchId != undefined && branchId != ""){

      const data = await CampaignTeam.findAndCountAll({ where: { branchId: branchId, campaignId: id }, order: [["createdAt", "DESC"]], });
      // console.log("branchIIIIIIIIIIIIIIIiddddd ", data)

      return res.status(200).json(data);

      } else  {

      // console.log("branchIIIIIIIIIIIIIIIiddddd 0", branchId)

      const data = await CampaignTeam.findAndCountAll({ where: { campaignId: id }, order: [["createdAt", "DESC"]], });
      // console.log("branchIIIIIIIIIIIIIIIiddddd 0", data)

      return res.status(200).json(data);

      }
    } else if(role == Role.staff){

    let emp = await Employee.findOne({ where: { userId: req.user.id } })
    //  .branchId; 
    let branchId = await emp.branchId;
    const data = await CampaignTeam.findAndCountAll({ where: { branchId: branchId, campaignId: id }, order: [["createdAt", "DESC"]], });
    return res.status(200).json(data);

    }
  } catch (error) {
    console.log("errrrrrrrrrrrrr", error)
    res.status(400).json({ msg: error.message });
  }
};

//posting
const createCampaignTeam = async (req, res) => {
  const {branchId} = req.query;
  const role = req.user.role;
  const dataBody = req.body
  
  // 
  try {
    if(role == Role.superAdmin){
      const campaign = await CampaignTeam.create({ ...dataBody, branchId });
    console.log("createdCampaignTeam", campaign)
    return res.status(200).json(campaign);

    } else if(role === Role.staff){
      let emp = await Employee.findOne({ where: { userId: req.user.id } })
  let branchId = await emp.branchId;
      const campaign = await CampaignTeam.create({ ...dataBody, branchId });
    console.log("createdCampaignTeam", campaign)
    return res.status(200).json(campaign);

    }
    
  } catch (error) {
    return res.status(400).json({ msg: error.message });
  }
};

const getCampaignTeamByPk = async (req, res) => {
  console.log("getCampaignTeamByPk")
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
    const campaignId = req.body.campaignId
    const {teamLeaderId} = req.query;
    const role = req.user.role;
    console.log("editCampaignTeam",role, teamLeaderId, body)

    if( role === Role.superAdmin){
      const updated = await CampaignTeam.update(body, { where: { campaignId: campaignId, teamLeader: teamLeaderId } });
      return res.status(200).json({ msg: "Success" })

    } else if(role === Role.staff){

    const emp = await Employee.findAll({ where: { userId: req.user.id } })
      // const campaign = CampaignTeam.findAll({where: {campaignId}});
      const updated = await CampaignTeam.update(body, { where: { campaignId: campaignId, teamLeader: emp[0].id } });
      return res.status(200).json({ msg: "Success" })
    }
  }
  catch (error) {
    console.log("errrrrrrrrrrr", error)
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
    const {branchId} = req.query;
    const role = req.user.role;
    const teamId = req.params.id;


    if(role === Role.superAdmin){
      
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
    } else if (role === Role.staff){
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
    }

  
  } catch (error) {
    console.log("errrrrrrrrr", error)
    res.status(400).json({ msg: error.message });
  }
};

const getSingleTeamMembers = async (req, res) => {
  try {
    const role = req.user.role;
    const {campaignId, teamleaderId} = req.query;
    if(role == Role.superAdmin  ){
      console.log("in admin teamleader.id, ",teamleaderId,)

    //   if(branchId == undefined || teamleaderId == undefined || branchId == 0 || teamleaderId == 0 || branchId == "0" || teamleaderId == "0" ){
    // console.log("in admin teamleader.id, branchId in zero",teamleaderId, branchId)

    //   return res.status(400).json({ msg: 'please select team' });

    //   }else {
        if(teamleaderId !== 0 && teamleaderId !== "0" && teamleaderId !== undefined && teamleaderId !== null){
          console.log("in admin", campaignId, teamleaderId)
        const teamleader = await Employee.findOne({ where: { id: teamleaderId } })
        const branchId = await teamleader.branchId;

        console.log("in admin teamleader.id, branchId",teamleaderId,)

        const findTeam = await CampaignTeam.findAll({
          where:
            { campaignId:campaignId, teamLeader: teamleaderId },
        });
        console.log("in admin findTeamfindTeam", findTeam)


        const memberIds = findTeam[0].teamMembers.split(",");
        const teamLeaderId = findTeam[0].teamLeader;

        const teamLeaderData = await Employee.findByPk(teamleaderId);
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
        console.log("in admin teamleader.id, branchId", )

        return res.status(200).json({ teamMembers, teamLeaderName });

        } else {
          console.log("in admin else", campaignId, )

          const findTeams = await CampaignTeam.findAll({
            where: {
                campaignId: campaignId,
            },
        });
        
        if (!findTeams || findTeams.length === 0) {
        }
        
        const teamMembers = [];
        const teamLeaderNames = [];
        
        for (const team of findTeams) {
            const memberIds = team.teamMembers.split(",");
            const teamLeaderId = team.teamLeader;
        
            const teamLeaderData = await Employee.findByPk(teamLeaderId);
            const teamLeaderName = teamLeaderData.first_name + " " + teamLeaderData.father_name;
        
            teamLeaderNames.push(teamLeaderName);
        
            const team_Members = await Employee.findAll({
                where: {
                    id: { [Op.in]: memberIds }
                },
                attributes: ['first_name', 'father_name', 'id', 'employeeId']
            });
        
            for (const member of team_Members) {
                const temp = {
                    ...member.dataValues,
                    campaignId: team.campaignId,
                    branchId: team.branchId,
                    teamLeaderId: teamLeaderId,
                    expectedCost: 0,
                    expectedSalesCount: 0,
                    expectedResponseCount: 0,
                    expectedROI: 0,
                    expectedRevenue: 0,
                    isExpectedSet: true
                };
                teamMembers.push(temp);
            }
        }
        
        return res.status(200).json({  teamLeaderNames });
        
        }
      
    // }
    }else if(role == Role.staff){
    
    let emp = await Employee.findOne({ where: { userId: req.user.id } })
    let branchId = await emp.branchId;
    const findTeam = await CampaignTeam.findAll({
      where:
        { campaignId, teamLeader: emp.id },
    });

    const memberIds = findTeam[0].teamMembers.split(",");
    const teamLeaderId = findTeam[0].teamLeader;

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
    return res.status(200).json({ teamMembers, teamLeaderName });
  }
  } catch (error) {
    console.log("errrrrrrrrrrrrrrrrrrr", error)
    return res.status(400).json({ msg: error.message });
  }
};

const getSingleCampaignTeam = async (req, res) => {
  const { campaignId, teamleaderId } = req.query;
  const userId = req.user.id;
  const role = req.user.role;
  console.log("getSingleCampaignTeam req.query forsyyy",   campaignId, teamleaderId )
  try {
    if(role == Role.superAdmin){
      if(teamleaderId != 0){
          const teamleader = await Employee.findOne({ where: { id: teamleaderId } })

  
      const campaign = await CampaignTeam.findAll({
        where: { campaignId: campaignId, teamLeader: teamleader.id },
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
        console.log("getSingleCampaignTeam req.query teamleader", campaign[0])

          return res.status(200).json(campaign[0]);
        }
      } else {
        const campaign = await CampaignTeam.findAll({
          where: { campaignId: campaignId, },
          include: { model: Campaign, as: "mainCampaign" }
        });
          if (!campaign) {
            res.status(400).json({ message: "No Data Found" });
          }
          else { 
            
            console.log("getSingleCampaignTeam req.query",   campaign )
  
            return res.status(200).json(campaign);
          }
      }
    } else if (role == Role.staff){
  let emp = await Employee.findOne({ where: { userId } })
  // 

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

  }
  } catch (error) {
    console.log("errrrrrrrrr", error)
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
      return res.status(200).json(report);
    } else if (type == "Individual") {
      const body = {
        actualCost: total.total_actualCost,
        actualSalesCount: total.total_actualSalesCount,
        actualResponseCount: total.total_actualResponseCount,
        actualROI: total.total_actualROI,
        actualRevenue: total.total_actualRevenue,

      }
      const report = await CampaignTeam.update({ isIndividualTotalReported: true, ...body }, { where: { id: campTeamId } });
      return res.status(200).json(report);
    }


    return res.status(200).json(report);
  } catch (error) {
    return res.status(400).json({ msg: error.message });
  }
};

const getTeamResult = async (req, res) => {
  const { campaignId, teamId, branchId } = req.query;
  const userId = req.user.id;

  try {
    const role = req.user.role;
     if(role === Role.superAdmin){

      const campaign = await CampaignTeam.findAll({ where: { campaignId: campaignId, branchId: branchId, id: teamId } }).then(function (
        campaign
      ) {
        if (!campaign) {
          res.status(400).json({ message: "No Data Found" });
        }
        else {
          res.status(200).json(campaign[0]);
        }
  
      });
     } else if (role === Role.staff){
  let emp = await Employee.findOne({ where: { userId } })

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
     }

  } catch (error) {
    console.log("errrrrrrrrrr", error)
    res.status(400).json({ msg: error.message });
  }
};


const totalCampaignTeam = async (req, res) => {
  const {campaignId, } = req.params;
  const { branchId} = req.query;

  try {
    const userId = req.user.id;
    const role = req.user.role;
    if (role === Role.superAdmin) {
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
        group: ['teamLeader', 'campaignId'],
        where: { [Op.or]: [{ isTeamReported: true }, { isIndividualTotalReported: true }] }
      });

      // Find the total amount for the specified campaign and team leader
      const totalAmountForCampaignAndTeamLeader = totalAmount.find(item =>
        item.teamLeader == userId && item.campaignId == campaignId
      );

      if (totalAmountForCampaignAndTeamLeader) {
        res.status(200).json(totalAmountForCampaignAndTeamLeader);
      } else {
        res.status(404).json({ msg: 'Total amount not found for the specified campaign and team leader' });
      }
    }else if(role == Role.staff){
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
      // where: { isTeamReported: true , isIndividualTotalReported:true }//
      where: { [Op.or]: [{ isTeamReported: true }, { isIndividualTotalReported: true }] }

    });

    let index;
    for (let i = 0; i < totalAmount.length; i++) {
      if (totalAmount[i].teamLeader == emp.id && totalAmount[i].campaignId == campaignId) {
        index = i;
      }

    }
    res.status(200).json(totalAmount[index]);
    }
  } catch (error) {
    console.log("totalCampaignTeamerrrrrrrr", error)
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
    const role = req.user.role;

    
    // 
    const { teamId, campaignId } = req.query;
    console.log("getTeamIndividualCampaigns", teamId)
    if(role === Role.superAdmin){
    const findTeam = await CampaignTeam.findByPk(teamId);

      let emp = await Employee.findOne({ where: { id: findTeam.teamLeader } })
    let branchId = await emp.branchId;

    const memberIds = findTeam.teamMembers.split(",");

    const findInd = await CampaignIndividual.findAll({
      where:
      {
        teamMemberId: { [Op.in]: memberIds },
        campaignId,
        branchId,
        teamLeaderId: emp.id,
      },
      include: { model: Campaign, as: "mainCampaign" },
      // offset: Number(f),
      // limit: Number(r),
      // order: [[sc || "createdAt", sd == 1 ? "DESC" : "ASC"]],
    });


    res.status(200).json(findInd);

    } else if (role === Role.staff){
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

    }
    
  } catch (error) {
    console.log("individualCampaigns error", error)
    res.status(400).json({ msg: error.message });
  }
};

const getTeamsOfCampaignTeam = async (req, res) => {
  const { campaignId, branchId } = req.query;

  try {
    // console.log("getTeamsOfCampaignTeam req", campaignId, branchId);

    const findTeam = await CampaignTeam.findAll({
      where: { campaignId: campaignId, branchId: branchId },
    });

    // console.log("findTeam:", findTeam);

    const teamLeaderIds = findTeam.map(team => team.teamLeader);

    const teamLeader = await Employee.findAll({
      where: { id: { [Op.in]: teamLeaderIds } },
    });

    // console.log("getTeamsOfCampaignTeam teamLeader", teamLeader);

    return res.status(200).json(teamLeader);
  } catch (error) {
    console.log("getTeamsOfCampaignTeam errorrrrrrr", error);
    return res.status(400).json({ msg: error.message });
  }
};

const getSingleTeamCampaigns = async (req, res) => {
  try {
    const role = req.user.role;
    const { campaignId, f, r, st, sc, sd } = req.query;

    if (role == Role.superAdmin) {
      const campaignIds = campaignId.split(',').map(id => parseInt(id.trim()));
      // console.log("getSingleTeamCampaigns", campaignIds, typeof campaignIds[0]);

      const singleteamcampaigns = await CampaignTeam.findAndCountAll({
        where: {
          campaignId: { [Op.in]: campaignIds },
          // ...getSearch(st)
        },
        include: { model: Campaign, as: "mainCampaign" },
        offset: Number(f),
        limit: Number(r),
        order: [[sc || "createdAt", sd == 1 ? "DESC" : "ASC"]],
      });

      return res.status(200).json(singleteamcampaigns);

    } else {
      return res.status(400).json({ msg: "Unauth" });
    }
  } catch (error) {
    return res.status(400).json({ msg: error.message });
  }
}

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
  getTeamIndividualCampaigns,
  getTeamsOfCampaignTeam,
  getSingleTeamCampaigns,
};
