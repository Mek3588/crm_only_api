const Branch = require("../../models/Branch");

const Document = require("../../models/Document");
const { Op } = require("sequelize");
const SalesPerson = require("../../models/SalesPerson");
const CampaignTeam = require("../../models/CampaignTeam");
const Employee = require("../../models/Employee");
const CampaignIndividual = require("../../models/CampaignIndividual");
const Campaign = require("../../models/Campaign");
const { INTEGER } = require("sequelize");
const sequelize = require("../../database/connections");

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

const getCampaignIndividual = async (req, res) => {
    try {
        // { include: [SalesPerson, CampaignSales, SalesPerson ]}
        const data = await CampaignIndividual.findAll({ order: [["createdAt", "DESC"]], });
        res.status(200).json(data);
    } catch (error) {
        res.status(400).json({ msg: error.message });
    }
};

//posting
const createCampaignIndividual = async (req, res) => {

    try {
    const {teamleaderId} = req.query;
    const role = req.user.role;
    const { campaignId
        // ,campaign_teamId
    } = req.body
    
    // 
    if(role == Role.superAdmin){
        console.log("teamleaderIdteamleaderId", teamleaderId)
        let emp = await Employee.findOne({ where: { id: teamleaderId } })
    //   //  .branchId; 
    let branchId = await emp.branchId;
    //   
    
        let camp = await Campaign.findByPk(campaignId);
        // const campaign= await CampaignTeam.create({...dataBody,branchId });
        const campTeam = await CampaignTeam.findAll({ where: { campaignId: campaignId, teamLeader: emp.id } })

        const isIndividualCreated = await CampaignTeam.findByPk(campTeam[0].id);
        

        if (isIndividualCreated.isIndividuallyAssigned) {
            return res.status(400).json({ msg: "Campaign already assigned to team members!" });
        }
        // if(isIndividualCreated.isIndividuallyAssigned)
        // 
        let empIds = []
        for (let i = 0; i < campTeam.length; i++) {
            let tempMembers = campTeam[i].teamMembers.split(",");
            // 
            for (let j = 0; j < tempMembers.length; j++) {
                if (!empIds.includes(tempMembers[j])) {
                    empIds.push(tempMembers[j]);
                }
            }

        }

        const toAdd = empIds.map((id) => {
            let numId = parseInt(id);
            return { campaignId: campaignId, branchId: branchId, teamLeaderId: emp.id, teamMemberId: id };
        });
        const allData = await CampaignIndividual.bulkCreate(toAdd);

        const updateTeam = await CampaignTeam.update(
            {
                isIndividuallyAssigned: true
            },
            { where: { id: campTeam[0].id } }
        );

        res.status(200).json({ allData, updateTeam });

    } else if(role == Role.staff){
        let emp = await Employee.findOne({ where: { userId: req.user.id } })
    //   //  .branchId; 
    let branchId = await emp.branchId;
    //   
    
        let camp = await Campaign.findByPk(campaignId);
        // const campaign= await CampaignTeam.create({...dataBody,branchId });
        const campTeam = await CampaignTeam.findAll({ where: { campaignId: campaignId, teamLeader: emp.id } })

        const isIndividualCreated = await CampaignTeam.findByPk(campTeam[0].id);
        

        if (isIndividualCreated.isIndividuallyAssigned) {
            return res.status(400).json({ msg: "Campaign already assigned to team members!" });
        }
        // if(isIndividualCreated.isIndividuallyAssigned)
        // 
        let empIds = []
        for (let i = 0; i < campTeam.length; i++) {
            let tempMembers = campTeam[i].teamMembers.split(",");
            // 
            for (let j = 0; j < tempMembers.length; j++) {
                if (!empIds.includes(tempMembers[j])) {
                    empIds.push(tempMembers[j]);
                }
            }

        }

        const toAdd = empIds.map((id) => {
            let numId = parseInt(id);
            return { campaignId: campaignId, branchId: branchId, teamLeaderId: emp.id, teamMemberId: id };
        });
        const allData = await CampaignIndividual.bulkCreate(toAdd);

        const updateTeam = await CampaignTeam.update(
            {
                isIndividuallyAssigned: true
            },
            { where: { id: campTeam[0].id } }
        );

        res.status(200).json({ allData, updateTeam });

    }
    
    } catch (error) {
        console.log("errrrrrrrrrrr", error)
        res.status(400).json({ msg: error.message });
    }
};

const getCampaignIndividualByPk = async (req, res) => {
    const params = req.params.id
    try {
        const campaign = await CampaignIndividual.findByPk(params).then(function (
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



const editCampaignIndividual = async (req, res) => {


    try {
        const {individualId} = req.query; 
        const body = req.body
        console.log("editCampaignIndividual individualId",  individualId)

        
        const campaignId = req.body.campaignId
        const role = req.user.role;

        if(role === Role.superAdmin){

        // const emp = await Employee.findOne({ where: {id:individualId } })

        const updated = await CampaignIndividual.update(body, { where: { id: body.id, campaignId: campaignId, teamMemberId: individualId } });
        return res.status(200).json(updated)

        } else if (role === Role.staff){

        const emp = await Employee.findAll({ where: { userId: req.user.id } })
        // 


        // const campaign = CampaignIndividual.findAll({where: {campaignId}});
        const updated = await CampaignIndividual.update(body, { where: { campaignId: campaignId, teamMemberId: emp[0].id } });
        return res.status(200).json({ msg: "Success" })
        }
        

    }
    catch (error) {
        console.log("editCampaignIndividual errrrr", error)
        res.status(400).json({ msg: error.message });
    }
};

const deleteCampaignIndividual = async (req, res) => {
    const id = req.params.id;

    try {
        CampaignIndividual.destroy({ where: { id: id } });

        res.status(200).json({ id });
    } catch (error) {
        res.status(400).json({ msg: error.message });
    }
};

const filterCampaignIndividual = async (req, res) => {
    const key = req.query.key;
    const value = req.query.value;
    try {
        const employees = await CampaignIndividual.findAll({
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

const getSingleCampaignIndividual = async (req, res) => {
    const { campaignId, individualId } = req.query;
    const userId = req.user.id;
    const role = req.user.role;

    
    

    try {

        if(role === Role.superAdmin){
            if(individualId != 0){
                let emp = await Employee.findOne({ where: { id: individualId } })
                console.log("getSingleCampaignIndividual", )
            
                const campaign = await CampaignIndividual.findAll({
                    where: { campaignId: campaignId, teamMemberId: emp.id },
                    include: { model: Campaign, as: "mainCampaign" }
                })
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
            } else {
                const campaign = await CampaignIndividual.findAll({
                    where: { campaignId: campaignId,},
                    include: { model: Campaign, as: "mainCampaign" }
                })
                if (!campaign) {
                    res.status(400).json({ message: "No Data Found" });
                }
                else {
                    res.status(200).json(campaign);
                }
            }

        } else if (role === Role.staff){
            let emp = await Employee.findOne({ where: { userId } })
            
        const campaign = await CampaignIndividual.findAll({
            where: { campaignId: campaignId, teamMemberId: emp.id },
            include: { model: Campaign, as: "mainCampaign" }
        })
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
        console.log("errrrrrrrrrrrrrrrrrr", error)
        res.status(400).json({ msg: error.message });
    }
};

const getIndividualResult = async (req, res) => {
    const { campaignId, memberId, teamleaderId } = req.query;
    const userId = req.user.id;
    const role = req.user.role;

    try {

        if(role === Role.superAdmin){
            const campaign = await CampaignIndividual.findAll({ where: { campaignId: campaignId, teamLeaderId: teamleaderId, teamMemberId: memberId } }).then(function (
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

            const campaign = await CampaignIndividual.findAll({ where: { campaignId: campaignId, teamLeaderId: emp.id, teamMemberId: memberId } }).then(function (
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

const reportCampaignIndividual = async (req, res) => {
    const campIndId = req.body.id;
    

    try {
        const report = await CampaignIndividual.update({ isReported: true }, { where: { id: campIndId } });

        res.status(200).json(report);
    } catch (error) {
        res.status(400).json({ msg: error.message });
    }
};

const totalCampaignIndividual = async (req, res) => {
    const campaignId = req.params.id;

    try {
        const {teamleaderId} = req.query
        const userId = req.user.id;
        const role = req.user.role;

        if(role == Role.superAdmin){
            let emp = await Employee.findOne({ where: { id: teamleaderId } })
        // const report = await CampaignIndividual.update({isReported: true}, { where: { id :campIndId} });
        const totalAmount = await CampaignIndividual.findAll({
            attributes: [
                'teamLeaderId',
                'campaignId',
                [sequelize.fn('sum', sequelize.col('actualCost')), 'total_actualCost'],
                [sequelize.fn('sum', sequelize.col('actualSalesCount')), 'total_actualSalesCount'],
                [sequelize.fn('sum', sequelize.col('actualResponseCount')), 'total_actualResponseCount'],
                [sequelize.fn('sum', sequelize.col('actualROI')), 'total_actualROI'],
                [sequelize.fn('sum', sequelize.col('actualRevenue')), 'total_actualRevenue'],

            ],
            group: ['teamLeaderId', 'campaignId',],
            where: { isReported: true }
        });

        let index;
        for (let i = 0; i < totalAmount.length; i++) {
            if (totalAmount[i].teamLeaderId == emp.id && totalAmount[i].campaignId == campaignId) {
                index = i;
            }

        }
        res.status(200).json(totalAmount[index]);

        } else if (role == Role.staff){
            let emp = await Employee.findOne({ where: { userId } })
        // const report = await CampaignIndividual.update({isReported: true}, { where: { id :campIndId} });
        const totalAmount = await CampaignIndividual.findAll({
            attributes: [
                'teamLeaderId',
                'campaignId',
                [sequelize.fn('sum', sequelize.col('actualCost')), 'total_actualCost'],
                [sequelize.fn('sum', sequelize.col('actualSalesCount')), 'total_actualSalesCount'],
                [sequelize.fn('sum', sequelize.col('actualResponseCount')), 'total_actualResponseCount'],
                [sequelize.fn('sum', sequelize.col('actualROI')), 'total_actualROI'],
                [sequelize.fn('sum', sequelize.col('actualRevenue')), 'total_actualRevenue'],

            ],
            group: ['teamLeaderId', 'campaignId',],
            where: { isReported: true }
        });

        let index;
        for (let i = 0; i < totalAmount.length; i++) {
            if (totalAmount[i].teamLeaderId == emp.id && totalAmount[i].campaignId == campaignId) {
                index = i;
            }

        }
        res.status(200).json(totalAmount[index]);
        }
        
    } catch (error) {
        res.status(400).json({ msg: error.message });
    }
};

const updateExpectedValues = async (req, res) => {

    try {
        

        const body = req.body;

        // const body = { ...req.body, isExpectedSet: true };
        // const allData = await CampaignBranch.bulkCreate(req.body, { updateOnDuplicate: ["branchId", "campaignId"] });

        await Promise.all(body.map(async (campaign) => {

            //   await Employee.create(employee);
            const { id, ...others } = campaign;
            await CampaignIndividual.update(others, {
                where: {
                    campaignId: campaign.campaignId,
                    branchId: campaign.branchId,
                    teamLeaderId: campaign.teamLeaderId,
                    teamMemberId: campaign.id
                }
            })
        }));
        // for (let i = 0; i < body.length; i++) {
        //     let temp = {...body[i], isExpectedSet: true};

        //     

        //     // temp.isExpectedSet = true 


        //     // CampaignIndividual.update(temp, {
        //     //     where: {
        //     //         campaignId: temp.campaignId,
        //     //         branchId: temp.branchId,
        //     //         teamLeaderId: temp.teamLeaderId,
        //     //         teamMemberId: temp.id
        //     //     }
        //     // })
        // }
        // { where: { campaignId: campaignId, teamLeader: emp[0].id } }
        const updateCampaignStatus = await CampaignTeam.update({ isIndividualExpectedSet: true },
            { where: { branchId: body[0].branchId, campaignId: body[0].campaignId, teamLeader: body[0].teamLeaderId } })

        res.status(200).json({ msg: "updated" });
    } catch (error) {
        
        res.status(400).json({ msg: error.message });
    }
};

const getMembersOfCampiagnTeam = async (req, res) => {
    const { campaignId } = req.query;
    const comingCampaignId = parseInt(campaignId, 10); // Parse campaignId as integer
    console.log("getMembersOfCampiagnTeam query", comingCampaignId);
  
    try {
        const campaigntemp = await CampaignIndividual.findAll({
            where: {
                campaignId: comingCampaignId,
            }
        });
        // console.log("getMembersOfCampiagnTeam query", campaigntemp);

        // Extract campaignIds from campaigntemp
        const campaignIds = campaigntemp.map(campaign => campaign.teamMemberId);
        
        // Fetch employees based on extracted campaignIds
        const data = await Employee.findAll({
            where: {
                id: {
                    [Op.in]: campaignIds,
                },
            },
        });
  
        res.status(200).json(data);
    } catch (error) {
        res.status(400).json({ msg: error.message });
    }
};


module.exports = {
    getCampaignIndividual,
    createCampaignIndividual,
    getCampaignIndividualByPk,
    editCampaignIndividual,
    deleteCampaignIndividual,
    filterCampaignIndividual,
    getSingleCampaignIndividual,
    reportCampaignIndividual,
    getIndividualResult,
    totalCampaignIndividual,
    updateExpectedValues,
    getMembersOfCampiagnTeam,
};
