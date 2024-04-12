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
const CampaignBroker = require("../../models/CampaignBroker");
const Broker = require("../../models/broker/Broker");
const Organization = require("../../models/broker/Organization");


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

const getOneCampaignBroker = async (req, res) => {
    const { campaignId, brokerId } = req.query
    try {
        const campaign = await CampaignBroker.findOne({ where: { campaignId, brokerId } }).then(function (
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

const editCampaignBroker = async (req, res) => {
    console.log("editCampaignBroker", req.body)

    try {
        // 
        const body = req.body
        // 
        const campaignId = req.body.campaignId
        const brokerId = req.body.brokerId
        // 

        const emp = await Employee.findAll({ where: { userId: req.user.id } })
        // 


        // const campaign = CampaignBranch.findAll({where: {campaignId}});
        const updated = await CampaignBroker.update(body, { where: { campaignId: campaignId, brokerId: brokerId } });
      return  res.status(200).json({ msg: "Success" })
    }
    catch (error) {
       return res.status(400).json({ msg: error.message });
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

// const getSingleCampaignBroker = async (req, res) => {
//     const { campaignId } = req.query;
//     const userId = req.user.id;
//     console.log("getSingleCampaignBrokerreqbody", req.body)

//     let Brokerr = await Broker.findOne({ where: { accountId: userId } })

    

//     if (Brokerr) {
//         try {
//             console.log("yesssssgetSingleCampaignBroker", Brokerr)

//             const campaign = await CampaignBroker.findAll({ where: { campaignId: campaignId, brokerId: Brokerr.organizationId} }).then(function (
//                 campaign
//             ) {
//                 if (!campaign) {
//                     res.status(400).json({ message: "No Data Found" });
//                 }
//                 else {
//                     console.log("getSingleCampaignBrokerthecampaign", campaign[0])
//                   return  res.status(200).json(campaign[0]);
//                 }

//             });

//         } catch (error) {
//             console.log("errrrrrogetSingleCampaignBroker", error)
//            return res.status(400).json({ msg: error.message });
//         }
//     }
// };
const getSingleCampaignBroker = async (req, res) => {
    try {
        const { campaignId } = req.query;
        const userId = req.user.id;

        console.log("getSingleCampaignBrokerreqbody", req.body);

        const broker = await Broker.findOne({ where: { accountId: userId } });

        if (!broker) {
            return res.status(404).json({ message: "Broker not found for the user." });
        }

        const campaignBroker = await CampaignBroker.findOne({ 
            where: { campaignId: campaignId, brokerId: broker.organizationId } 
        });

        if (!campaignBroker) {
            return res.status(404).json({ message: "No Data Found" });
        }

        console.log("getSingleCampaignBrokerthecampaign", campaignBroker);
        return res.status(200).json(campaignBroker);
    } catch (error) {
        console.error("errrrrrogetSingleCampaignBroker", error);
        return res.status(500).json({ msg: "Internal server error." });
    }
};

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

const reportCampaignBroker = async (req, res) => {
    const campIndId = req.body.id;
    

    try {
        const report = await CampaignBroker.update({ isReported: true }, { where: { id: campIndId } });

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

const totalCampaignBroker = async (req, res) => {
    const campaignId = req.params.id;

    try {
        const userId = req.user.id;
        let emp = await Employee.findOne({ where: { userId } })
        // const report = await CampaignTeam.update({isReported: true}, { where: { id :campIndId} });
        const totalAmount = await CampaignBroker.findAll({
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

// const updateExpectedValues = async (req, res) => {

//     try {
        

//         const body = req.body;

//         // const body = { ...req.body, isExpectedSet: true };
//         // const allData = await CampaignBranch.bulkCreate(req.body, { updateOnDuplicate: ["branchId", "campaignId"] });
//         console.log("updateExpectedValues", req.body)

//         // for (let i = 0; i < body.length; i++) {
//         //     CampaignBroker.update(body[i], { where: { campaignId: body[i].campaignId, brokerId: body[i].brokerId } })
//         // }
//         for (let i = 0; i < body.length; i++) {
//         console.log("updatesingleOrgIdsOrgIds", body[i].brokerId)

//             const broker = await Broker.findAll({ where: { id: body[i].brokerId } });

//         console.log("updatesingleOrgIdsOrgIds", broker)

            
//             const OrgIds = broker.map(broker => broker.organizationId);
//             await CampaignBroker.update(body[i], { 
//                 where: { 
//                     campaignId: body[i].campaignId, 
//                     brokerId: OrgIds
//                 } 
//             });
//         }        

//         const updateCampaignStatus = await Campaign.update({ isBrokerExpectedSet: true }, { where: { id: body[0].campaignId } })

//         res.status(200).json({ msg: "Broker Campaign updated" });
//     } catch (error) {
//         res.status(400).json({ msg: error.message });
//     }

//     // try {
        

// //     const body = req.body;

// //     // const body = { ...req.body, isExpectedSet: true };
// //     // const allData = await CampaignBranch.bulkCreate(req.body, { updateOnDuplicate: ["branchId", "campaignId"] });
// //     console.log("updateExpectedValues", req.body)
// //     // const theBroker = Broker.findOne({where: {id : body.brokerId}})
    
// //     for (let i = 0; i < body.length; i++) {
// //         const theBroker = await Broker.findOne({ where: { id: body[i].brokerId } });

// //         CampaignBroker.update(body[i], { where: { campaignId: body[i].campaignId, brokerId: theBroker.organizationId } })
// //     }

// //     const updateCampaignStatus = await Campaign.update({ isBrokerExpectedSet: true }, { where: { id: body[0].campaignId } })

// //     res.status(200).json({ msg: "Broker Campaign updated" });
// // } catch (error) {
// //     res.status(400).json({ msg: error.message });
// // }
// };
const updateExpectedValues = async (req, res) => {
    try {
        const body = req.body;

        console.log("updateExpectedValues", req.body);

        // Iterate through each body object
        for (let i = 0; i < body.length; i++) {
            console.log("updatesingleOrgIdsOrgIds", body[i].brokerId);

            // Retrieve the corresponding brokers using Broker.findAll() based on the provided body[i].brokerId
            const brokers = await Broker.findAll({ where: { id: body[i].brokerId } });

            console.log("updatesingleOrgIdsOrgIds", brokers);

            // Extract the organizationId from each broker object in the brokers array using map()
            const OrgIds = brokers.map(broker => broker.organizationId);

            // Update the brokerId in the body object with the corresponding OrgIds
            body[i].brokerId = OrgIds[0];

            // Update the CampaignBroker entry where both the campaignId and the original brokerId match the entry in body
            await CampaignBroker.update(
                body[i], 
                { where: { campaignId: body[i].campaignId, brokerId: body[i].brokerId } }
            );
        }

        // Update the isBrokerExpectedSet status for the campaign
        await Campaign.update({ isBrokerExpectedSet: true }, { where: { id: body[0].campaignId } });

        // Return a success response
        res.status(200).json({ msg: "Broker Campaign updated" });
    } catch (error) {
        // Return an error response if an error occurs
        res.status(400).json({ msg: error.message });
    }
};


module.exports = {
    getCampaignBranch,
    createCampaignBranch,
    getOneCampaignBroker,
    editCampaignBroker,
    deleteCampaignBranch,
    filterCampaignBranch,
    getCampaignBranchMembers,
    // getSingleBranchMembers,
    getSingleCampaignBroker,
    getSingleCampaignBranch,
    reportCampaignBranch,
    totalCampaignBroker,
    updateExpectedValues,
    reportCampaignBroker
};
