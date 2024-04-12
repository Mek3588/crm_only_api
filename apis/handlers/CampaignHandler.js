
const Campaign = require("../../models/Campaign");
const CampaignTour = require("../../models/CampaignTour");
const Document = require("../../models/Document");
const Employee = require("../../models/Employee");
const CampaignTourMembers = require("../../models/CampaignTourMembers");
const CampaignTourDocument = require("../../models/CampaignTourDocuments");
const EmailService = require("../../models/EmailService");
const CampaignEvent = require("../../models/CampaignEvent");
const CampaignSocialMedia = require("../../models/CampaignSocialMedia");
const SMSCampaign = require("../../models/SMSCampaign");
const { Campaign_type } = require("../../utils/constants");
const CampaignHistory = require("../../models/CampaignHistory");
const CampaignTeam = require("../../models/CampaignTeam");
const { Op } = require("sequelize");
const CampaignIndividual = require("../../models/CampaignIndividual");
const Branch = require("../../models/Branch");
const CampaignBranch = require("../../models/CampaignBranch");
const VehicleCategory = require("../../models/motor/VehicleCategory");
const Contact = require("../../models/Contact");

const Customer = require("../../models/customer/Customer");
const Agent = require("../../models/agent/Agent");
const Organization = require("../../models/broker/Organization");
const CampaignAgent = require("../../models/CampaignAgent");
const Broker = require("../../models/broker/Broker");
const CampaignBroker = require("../../models/CampaignBroker");

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

const logCreateCampaign = async(campaign) => {

  if(campaign){
    
    let ipAddress = getIpAddress(req.ip);
    const eventLog = await createEventLog(
      req.user.id,
      eventResourceTypes.campaign,
      campaign.campaignName,
      campaign.id,
      eventActions.create,
      "",
      ipAddress
    );
  }
  return eventLog;
} 
const getSearch = (st) => {
  return {
    [Op.or]: [
      { campaignName: { [Op.like]: `%${st}%` } },
      { campaignType: { [Op.like]: `%${st}%` } },
      { campaignStatus: { [Op.like]: `%${st}%` } },
      { targetAudience: { [Op.like]: `%${st}%` } },
      { sponsor: { [Op.like]: `%${st}%` } },
      { campaignBudget: { [Op.like]: `%${st}%` } },
      { expectedSalesCount: { [Op.like]: `%${st}%` } },
      { expectedResponseCount: { [Op.like]: `%${st}%` } },
      { expectedROI: { [Op.like]: `%${st}%` } },
      { actualCost: { [Op.like]: `%${st}%` } },
      { expectedRevenue: { [Op.like]: `%${st}%` } },
      { actualSalesCount: { [Op.like]: `%${st}%` } },
      { actualResponseCount: { [Op.like]: `%${st}%` } },
      { actualROI: { [Op.like]: `%${st}%` } },
      { actualRevenue: { [Op.like]: `%${st}%` } },
      { description: { [Op.like]: `%${st}%` } },
      { objective: { [Op.like]: `%${st}%` } },
      { campaignLevel: { [Op.like]: `%${st}%` } },
      { campaignStartDate: { [Op.like]: `%${st}%` } },
      { expectedClosedDate: { [Op.like]: `%${st}%` } },
      { targetSize: { [Op.like]: `%${st}%` } },
      // { creatorBranch: { [Op.like]: `%${st}%` } }
    ]
    
  };
};

const getCampaign = async (req, res) => {
  const { f, r, st, sc, sd } = req.query;
  try {
    const data = await Campaign.findAndCountAll({
      offset: Number(f),
      limit: Number(r),
      order: [[sc || "createdAt", sd == 1 ? "DESC" : "ASC"]],
      // subQuery: false,
      where: getSearch(st),

      include: [
        CampaignEvent, 
        CampaignSocialMedia, 
        SMSCampaign, 
        CampaignHistory,
        { 
          model: CampaignTour, 
          include: [Document,] 
        }, 
        { 
          model: Branch, 
          as: "createdBranch" 
        }
        //  {
        //   model: VehicleCategory,
        //   as: "product",
        // },
      ],
      // order: [["createdAt", "DESC"]],

    });
    // 
    res.status(200).json(data);
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};

//posting
const createCampaign = async (req, res) => {

  let dataBody = req.body;
  
  let emp = await Employee.findOne({ where: { userId: req.user.id } })

  if (dataBody.addedByBranch) {
    let emp = await Employee.findOne({ where: { userId: req.user.id } })
    
    if (emp) {
      dataBody.creatorBranch = emp.branchId
    }
  }
  // const dataBody = req.body
  // 
  let campaign

  try {
    if (dataBody.campaignType == Campaign_type.tour) {
      console.log("====campaign===", dataBody)
      campaign = await Campaign.create(dataBody, {
        include: [{ model: CampaignTour, }]
      }),
        await campaign.campaigns_tours.forEach(element => {
          element.addEmployees(dataBody.campaigns_tours.employees, { through: CampaignTourMembers }),
            element.addDocuments(dataBody.campaigns_tours.documents, { through: CampaignTourDocument })
        });

        if(campaign){
          
          let ipAddress = getIpAddress(req.ip);
          const eventLog = await createEventLog(
            req.user.id,
            eventResourceTypes.campaign,
            campaign.campaignName,
            campaign.id,
            eventActions.create,
            "",
            ipAddress
          );
        }
    }
    else if (dataBody.campaignType == Campaign_type.event) {
      campaign = await Campaign.create(dataBody, { include: CampaignEvent })
      if(campaign){
        
        let ipAddress = getIpAddress(req.ip);
        const eventLog = await createEventLog(
          req.user.id,
          eventResourceTypes.campaign,
          campaign.campaignName,
          campaign.id,
          eventActions.create,
          "",
          ipAddress
        );
      }
    }
    else if (dataBody.campaignType == Campaign_type.socialMedia) {
      console.log("dataBody socialMedia Campaign is", dataBody)
      campaign = await Campaign.create(dataBody, { include: CampaignSocialMedia })
      if(campaign){
        
        let ipAddress = getIpAddress(req.ip);
        const eventLog = await createEventLog(
          req.user.id,
          eventResourceTypes.campaign,
          campaign.campaignName,
          campaign.id,
          eventActions.create,
          "",
          ipAddress
        );
      }
    }
    // else if (dataBody.campaignType == Campaign_type.sms) {
    //   console.log("dataBody SMS Campaign is", dataBody)
    //   campaign = await Campaign.create(dataBody, { include: SMSCampaign })
    //   if(campaign){
    //     console.log("created SMS Campaign name is ", campaign)
    //     let ipAddress = getIpAddress(req.ip);
    //     const eventLog = await createEventLog(
    //       req.user.id,
    //       eventResourceTypes.campaign,
    //       campaign.campaignName,
    //       campaign.id,
    //       eventActions.create,
    //       "",
    //       ipAddress
    //     );
    //   }
    // }
    else {
      campaign = await Campaign.create(dataBody)
      if(campaign){
        
        let ipAddress = getIpAddress(req.ip);
        const eventLog = await createEventLog(
          req.user.id,
          eventResourceTypes.campaign,
          campaign.campaignName,
          campaign.id,
          eventActions.create,
          "",
          ipAddress
        );
      }
    }
    // if (dataBody.event != null) {
    //    campaign =  await Campaign.create(dataBody,{include: CampaignTour})
    // }

    // 
console.log("campaigncampaigncampaigncampaign", campaign)
    if (dataBody.branches) {
      const toAdd = dataBody.branches.split(",").map((id) => {
        let numId = parseInt(id);
        return { campaignId: campaign.id, branchId: numId };
      });
      // 
      const allData = await CampaignBranch.bulkCreate(toAdd);
    } 

    if (dataBody.agentId) {
      const toAdd = dataBody.agentId.split(",").map((id) => {
        let numId = parseInt(id);
        return { campaignId: campaign.id, agentId: numId };
      });
      // 
      const allData = await CampaignAgent.bulkCreate(toAdd);
    }
    if (dataBody.brokerId) {
      const toAdd = dataBody.brokerId.split(",").map((id) => {
        let numId = parseInt(id);
        return { campaignId: campaign.id, brokerId: numId };
      });
      // 
      const allData = await CampaignBroker.bulkCreate(toAdd);
    }


    if (dataBody.addedByBranch) {
      const branchBody = {
        campaignId: campaign.id,
        branchId: emp.branchId,
        actualCost: 0,
        actualSalesCount: 0,
        actualResponseCount: 0,
        actualROI: 0,
        actualRevenue: 0,
        isExpectedSet: false,
        isBranchReported: false,
        isTeamTotalReported: false,
        branchName: emp.branchName,
        expectedCost: dataBody.campaignBudget,
        expectedSalesCount: dataBody.expectedSalesCount,
        expectedResponseCount: dataBody.expectedResponseCount,
        expectedROI: dataBody.expectedROI,
        expectedRevenue: dataBody.expectedRevenue,
        isExpectedSet: true,
        isTeamExpectedSet: false,



      }
      const createBranchCampaign = await CampaignBranch.create(branchBody);


    }

    // | id | campaignId | branchId | actualCost | actualSalesCount | actualResponseCount | actualROI | actualRevenue | 
    // isBranchReported | isTeamTotalReported | branchName | expectedCost | expectedSalesCount
    //  | expectedResponseCount | expectedROI | expectedRevenue | isExpectedSet | isTeamExpectedSet | createdAt           | updatedAt 


    res.status(200).json(campaign);

  } catch (error) {
    
    res.status(400).json({ msg: error.message });
  }
};

const getCampaignByPk = async (req, res) => {
  const params = req.params.id
  try {
    const campaign = await Campaign.findByPk(params, {
      include: [
        { model: CampaignTour, include: [Document] }, CampaignEvent, CampaignSocialMedia, SMSCampaign, CampaignHistory]

    }).then(async function (
      campaign
    ) {
      if (!campaign) {
        res.status(400).json({ message: "No Data Found" });
      }
      else {
        let br = campaign.branches ? campaign.branches.split(",") : []
        br = br.map(b => Number(b));
        
        


        let pro = campaign.productId ? campaign.productId.split(",") : [];
        pro = pro.map(p => Number(p));

        let lead = campaign.leads ? campaign.leads.split(",") : [];
        lead = lead.map(l => Number(l));

        let account = campaign.accounts ? campaign.accounts.split(",") : [];
        account = account.map(a => Number(a));

        let customer = campaign.customers ? campaign.customers.split(",") : [];
        customer = customer.map(a => Number(a));

        let agent = campaign.agentId ? campaign.agentId.split(",") : [];
        agent = agent.map(a => Number(a));

        let broker = campaign.brokerId ? campaign.brokerId.split(",") : [];
        broker = broker.map(a => Number(a));
        console.log("brokerbroker", broker, campaign.brokerId)

        let branch = []
        branch = await Branch.findAll({
          raw: true,
          where: { id: { [Op.in]: br } }
        })
        let product = []
        product = await VehicleCategory.findAll({
          raw: true,
          where: { id: { [Op.in]: pro } }
        })


        const campaignBranch = await CampaignBranch.findAll({
          where: { branchId: { [Op.in]: br }, campaignId: campaign.id }
        })

        const campaignAgent = await CampaignAgent.findAll({
          where: { agentId: { [Op.in]: agent }, campaignId: campaign.id }
        })

        const campaigBroker = await CampaignBroker.findAll({
          where: { brokerId: { [Op.in]: broker }, campaignId: campaign.id }
        })
        console.log("campaigBrokercampaigBroker",campaign.id, campaigBroker)
        const leads = await Contact.findAll({
          where: { id: { [Op.in]: lead } },
          include: { model: Branch, as: "branch" }
        })

        const accounts = await Contact.findAll({
          where: { id: { [Op.in]: account } }
        })

        const customers = await Customer.findAll({
          where: { id: { [Op.in]: customer } },
          include: [{ model: Contact }]
        })

        const agents = await Agent.findAll({
          where: { id: { [Op.in]: agent } },
          // include: [{ model: Contact }]
        })

        const Orgs = await Organization.findAll({
          where: { id: { [Op.in]: broker } }
        });        
        const OrgIds = Orgs.map(org => org.id);
        
        const brokers = await Broker.findAll({
          where: { organizationId: { [Op.in]: OrgIds }, isRepresentative: true },
          // include: [{ model: Contact }]
        });
        // const brokersId = brokers.map(brokers => brokers.id);
        // console.log("brokersIdbrokersId", brokersId)
        // const campaigBroker = await CampaignBroker.findAll({
        //   where: { brokerId: { [Op.in]: brokersId }, campaignId: campaign.id }
        // })
        console.log("campaigBrokercampaigBroker",campaign.id, campaigBroker)

        


        let customerContacts = customers.map(customer => customer.contact);
        

        // 

        // 


        const branchNames = []
        const productNames = []
        let agentNames = []
        let brokerNames = []




        for (let i = 0; i < branch.length; i++) {
          let tempObj = { campaignId: campaign.id, branchName: branch[i].name, branchId: branch[i].id, expectedCost: 0, expectedSalesCount: 0, expectedResponseCount: 0, expectedROI: 0, expectedRevenue: 0, isExpectedSet: true }
          branchNames.push(tempObj)
        }

        for (let i = 0; i < product.length; i++) {
          let temppro = { id: product[i].id, productName: product[i].name }
          productNames.push(temppro)
        }

        for (let i = 0; i < agents.length; i++) {
          // let tempagent = { id: agents[i].id, productName: agents[i].name }
          let tempObj = { campaignId: campaign.id, agentId: agents[i].id, firstName: agents[i].firstName, fatherName: agents[i].fatherName, expectedCost: 0, expectedSalesCount: 0, expectedResponseCount: 0, expectedROI: 0, expectedRevenue: 0, isExpectedSet: true }

          agentNames.push(tempObj)
        }


        for (let i = 0; i < brokers.length; i++) {
          // let tempagent = { id: agents[i].id, productName: agents[i].name }
          console.log("campaignId====", campaign.id, brokers[i].id, brokers[i].firstName)
          let tempObj = { campaignId: campaign.id, brokerId: brokers[i].id, firstName: brokers[i].firstName, fatherName: brokers[i].fatherName, expectedCost: 0, expectedSalesCount: 0, expectedResponseCount: 0, expectedROI: 0, expectedRevenue: 0, isExpectedSet: true }

          brokerNames.push(tempObj)
          console.log("tempObjtempObj", tempObj)
        }


        


          
          let ipAddress = getIpAddress(req.ip);
          const eventLog = await createEventLog(
            0,
            eventResourceTypes.campaign,
            campaign.campaignName,
            campaign.id,
            eventActions.view,
            "",
            ipAddress
          );
          console.log("brokerNamesbrokerNames", brokerNames)

          res.status(200).json({
            campaign, branchNames, campaignBranch, productNames, leads, accounts, customerContacts,
            agentNames, campaignAgent, campaigBroker, brokerNames
          });
        

          



      }
    });

  } catch (error) {
    
    res.status(400).json({ msg: error.message });
  }
};

const editCampaign = async (req, res) => {
  
  const body = req.body
  // const id = req.body.id
  const { id, actualCost, actualSalesCount, actualResponseCount, actualROI, actualRevenue, ...others } = req.body;
  try {

    const oldCamp = await Campaign.findByPk(id);
    

    const newBody = {
      actualCost: body.actualCost,
      actualSalesCount: body.actualSalesCount,
      actualResponseCount: body.actualResponseCount,
      actualROI: body.actualROI,
      actualRevenue: body.actualRevenue


    }

    // body.campaignStartDate = oldCamp.campaignStartDate;
    // body.expectedClosedDate = oldCamp.expectedClosedDate;


   const updated =  await Campaign.update({ ...newBody, ...others }, { where: { id: id } });

   const newCampaign = await Campaign.findByPk(id);

   
   if (updated) {
    const changedFieldValues = getChangedFieldValues(
      oldCamp,
      newCampaign
    );
    let ipAddress = getIpAddress(req.ip);
    
    const eventLog = await createEventLog(
      req.user.id,
      eventResourceTypes.campaign,
      newCampaign.campaignName,
      newCampaign.id,
      eventActions.edit,
      changedFieldValues,
      ipAddress
    );
  }

    const getAll = await Campaign.findByPk(id, { include: [CampaignTour, CampaignSocialMedia, CampaignEvent, SMSCampaign] })

    if (others.campaignType == Campaign_type.tour) {
      const { id, ...otherTour } = others.campaigns_tours
      const campaignId = await CampaignTour.update(otherTour, {
        where: { id: getAll.campaigns_tours[0].id }

      }),
        tour = await CampaignTour.findByPk(getAll.campaigns_tours[0].id)

      await tour.setEmployees(body.campaigns_tours.employees, { through: CampaignTourMembers }),
        await tour.setDocuments(body.campaigns_tours.documents, { through: CampaignTourDocument })
      res.status(200).json({ id })
    }
    // else if (body.campaignType == Campaign_type.event) {
    //   const oldCampaign = await Campaign.findByPk(id, { include: [CampaignEvent] })
    //   CampaignEvent.update(body.campaign_events, { where: { id: oldCampaign.campaign_events[0].id } })
    //   console.log('Event ID to update:', eventIdToUpdate);
    else if (body.campaignType == Campaign_type.event) {
      console.log('the body for Campaign_type.event to update:', body);
      const oldCampaign = await Campaign.findByPk(id, { include: [CampaignEvent] });
      const eventIdToUpdate = oldCampaign.campaign_events[0].id;
      console.log('Event ID to update:', eventIdToUpdate);
      
      body.campaign_events.id = eventIdToUpdate;
    
      await CampaignEvent.update(body.campaign_events, { where: { id: eventIdToUpdate } });
    
      if (oldCampaign) {
        if (oldCampaign.campaign_events[0].startingDate != body.campaign_events.startingDate || oldCampaign.campaign_events[0].endingDate != body.campaign_events.endingDate) {
          CampaignHistory.create({
            campaignId: id,
            previousStartingDate: getAll.campaign_events[0].startingDate,
            previousEndingDate: getAll.campaign_events[0].endingDate,
            currentStartingDate: body.campaign_events.startingDate,
            currentEndingDate: body.campaign_events.endingDate,
          });
        }
      }
      res.status(200).json({ id })
    }
    else if (body.campaignType == Campaign_type.socialMedia) {
      const getBySocialMedia = await Campaign.findByPk(id, { include: [CampaignSocialMedia] })
      await CampaignSocialMedia.update(body.social_medias, { where: { id: getAll.campaign_socialmedias[0].id } })
      res.status(200).json({ id })
    }
    else if (body.campaignType == Campaign_type.sms|| body.campaignType == Campaign_type.email) {
         console.log("Campaign_type.sms", req.body)
      // const smCampaign = await Campaign.findByPk(id, { include: [SMSCampaign] })
      // await SMSCampaign.update(body.sms_campaigns, { where: { id: getAll.sms_campaigns[0].id } })
      // res.status(200).json({ id })
          try {
            Campaign.update( body, { where: { id: body.id } } );
            res.status(200).json({ id });
          } catch (error) {
            res.status(404).json({ msg: error.message });
          }
    }
    else {
      res.status(400).json({ id })
      // 
    }
  }
  catch (error) {
    
    res.status(400).json({ msg: error.message });
  }
};

const editCampaignFeaturedAsset = async (req, res) => {
  
  // 
  const id = req.params.id
  // const id = req.body.id
  const featuredAsset = req.file.filename;

  
  
  try {

    await Campaign.update({ featuredAsset }, { where: { id: id } });
    res.status(200).json({ id })
  }
  catch (error) {
    
    res.status(400).json({ msg: error.message });
  }
}

const deleteCampaign = async (req, res) => {
  const id = req.params.id;
  try {
    const oldCampaign = await Campaign.findByPk(id);

    Campaign.destroy({ where: { id: id } });

    let ipAddress = getIpAddress(req.ip);
    const eventLog = await createEventLog(
      req.user.id,
      eventResourceTypes.campaign,
      oldCampaign.campaignName,
      oldCampaign.id,
      eventActions.delete,
      "",
      ipAddress
    );


    res.status(200).json({ id });
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};

const getBranchCampaign = async (req, res) => {
  const { f, r, st, sc, sd } = req.query;
  // console.log("getBranchCampaign_query", req.query)
  // const { role, id } = req.user;
  // 
  try {
    let emp = await Employee.findOne({ where: { userId: req.user.id } })
    

    

    //  .branchId; 
     if (req.type == "all") {
      const branchividualCampaigns = await Campaign.findAndCountAll({
          where: { 
            isBranchExpectedSet: true,
            ...getSearch(st)
           },
          offset: Number(f),
          limit: Number(r),
          order: [[sc || "createdAt", sd == 1 ? "DESC" : "ASC"]],
       });

       res.status(200).json(branchividualCampaigns);
       
     } else if (emp) {
      let branchId = await emp.branchId;
      
      // 

      // let campaigns =await getCampaign();
      let campaigns = await Campaign.findAndCountAll({
        // where: { isBranchExpectedSet: true },
        // where: { [Op.or]: [{ isBranchExpectedSet: true }, { creatorBranch: branchId }] },

        // order: [["updatedAt", "DESC"]]
        where: { 
          isBranchExpectedSet: true,
          ...getSearch(st)
         },
        offset: Number(f),
        limit: Number(r),
        order: [[sc || "createdAt", sd == 1 ? "DESC" : "ASC"]],
      });

      let selfCampaign = await Campaign.findAndCountAll({
        // where: { creatorBranch: branchId },
        // where: { [Op.or]: [{ isBranchExpectedSet: true }, { creatorBranch: branchId }] },

        // order: [["updatedAt", "DESC"]]
        where: { 
          isBranchExpectedSet: true,
          ...getSearch(st)
         },
        offset: Number(f),
        limit: Number(r),
        order: [[sc || "createdAt", sd == 1 ? "DESC" : "ASC"]],
      });


      let tempCampaign = [];
      // 
      for (let i = 0; i < selfCampaign.length; i++) {

        tempCampaign.push(selfCampaign[i]);

      }


      for (let i = 0; i < campaigns.length; i++) {
        // 
        let tempArr = campaigns[i].branches.split(",");
        // 
        if (tempArr.includes(branchId.toString())) {
          // 
          tempCampaign.push(campaigns[i]);
        }

      }

      // const formattedResponse = {
      //   count : tempCampaign?.length,
      //   rows: tempCampaign
      // }
      
      res.status(200).json(tempCampaign);
    } else {
      res.status(400).json({ msg: "Please check for existance of employee" });

    }

  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
}

const getTeamCampaign = async (req, res) => {

  try {
    let emp = await Employee.findOne({ where: { userId: req.user.id } })

    let leaderTeams = await CampaignTeam.findAll({
      // include: User,
      where: { teamLeader: { [Op.in]: [emp.id] }, isExpectedSet: true },
      // { activated: true },


    });

    let campaigns = [];

    for (let i = 0; i < leaderTeams.length; i++) {
      if (!campaigns.includes(leaderTeams[i].campaignId)) {
        campaigns.push(leaderTeams[i].campaignId)
      }
    }


    let teamLeaderCampaigns = await Campaign.findAll({
      // include: User,
      where: { id: { [Op.in]: campaigns } },
      order: [["updatedAt", "DESC"]]
      // { activated: true },


    });

   const formattedResponse = {
        count : teamLeaderCampaigns?.length,
        rows: teamLeaderCampaigns
      }
      
      res.status(200).json(formattedResponse);

  }


  catch (error) {
    res.status(400).json({ msg: error.message });
  }
}

const getIndividualCampaign = async (req, res) => {

  try {
    let emp = await Employee.findOne({ where: { userId: req.user.id } })

    let IndCamps = await CampaignIndividual.findAll({
      // include: User,
      where: { teamMemberId: { [Op.in]: [emp.id] }, isExpectedSet: true },
      // { activated: true },


    });

    let IndCampaigns = [];

    for (let i = 0; i < IndCamps.length; i++) {
      if (!IndCampaigns.includes(IndCamps[i].campaignId)) {
        IndCampaigns.push(IndCamps[i].campaignId)
      }
    }


    let individualCampaigns = await Campaign.findAll({
      // include: User,
      where: { id: { [Op.in]: IndCampaigns } },
      order: [["updatedAt", "DESC"]]
      // { activated: true },


    });
    
    const formattedResponse = {
      count : individualCampaigns?.length,
      rows: individualCampaigns
    }
    
    res.status(200).json(formattedResponse);

  }


  catch (error) {
    res.status(400).json({ msg: error.message });
  }
}

const getAgentCampaign = async (req, res) => {
  const {f, r, st, sc, sd} = req.query

  try {
   const userId = req.user.id
    let agent = await Agent.findOne({ where: { accountId: userId } })
    if(req.user.type = "all"){
      const agentCampaigns = await Campaign.findAndCountAll({
        where: { 
          isAgentExpectedSet: true,
          ...getSearch(st)
         },
        offset: Number(f),
        limit: Number(r),
        order: [[sc || "createdAt", sd == 1 ? "DESC" : "ASC"]],
      });
      res.status(200).json(agentCampaigns);

    } else


    if (agent) {


      const AllAgentCampaigns = await Campaign.findAll({ where: { agentId: { [Op.not]: null } } });

      let agentCampaigns = [];


      for (let i = 0; i < AllAgentCampaigns.length; i++) {
        if (AllAgentCampaigns[i].agentId.includes(agent.id)) {
          agentCampaigns.push(AllAgentCampaigns[i].id)
        }
      }

      let agentividualCampaigns = await Campaign.findAll({
        // include: User,
        where: { id: { [Op.in]: agentCampaigns } },
        order: [["updatedAt", "DESC"]]
        // { activated: true },


      });

      const formattedResponse = {
        count : agentividualCampaigns?.length,
        rows: agentividualCampaigns
      }
      
      res.status(200).json(formattedResponse);


    }

    else {
      res.status(400).json({ msg: "No campaign for this agent" });

    }


  }


  catch (error) {
    res.status(400).json({ msg: error.message });
  }
}

const getBrokerCampaign = async (req, res) => {
  const { f, r, st, sc, sd } = req.query;

  try {
    const body = req.body
    console.log("getBrokerCampaigngetBrokerCampaign", )
    let broker = await Broker.findOne({ where: { accountId: req.user.id } })
    

    const AllBrokerCampaigns = await Campaign.findAll({ where: { brokerId: { [Op.not]: null } } });

    let brokerCampaigns = [];

    if (req.type == "all") {
     const brokerividualCampaigns = await Campaign.findAndCountAll({
        where: { 
          isBrokerExpectedSet: true,
          ...getSearch(st)
         },
        offset: Number(f),
        limit: Number(r),
        order: [[sc || "createdAt", sd == 1 ? "DESC" : "ASC"]],
      });
      res.status(200).json(brokerividualCampaigns);

    } else{
    


    for (let i = 0; i < AllBrokerCampaigns.length; i++) {
      if ((AllBrokerCampaigns[i].brokerId.includes(broker.organizationId) && broker.isRepresentative)) {
        brokerCampaigns.push(AllBrokerCampaigns[i].id)
      }
    }

    let brokerividualCampaigns = await Campaign.findAll({
      // include: User,
      where: { id: { [Op.in]: brokerCampaigns } },
      order: [["updatedAt", "DESC"]]
      // { activated: true },


    });

    const formattedResponse = {
      count : brokerividualCampaigns?.length,
      rows: brokerividualCampaigns
    }
    console.log("broker formattedResponse", formattedResponse)
    res.status(200).json(brokerividualCampaigns);
    }
  }


  catch (error) {
    res.status(400).json({ msg: error.message });
  }
}

const reportCampaign = async (req, res) => {
  // const id = req.body.id;
  const { campaignId, type, total } = req.body;
  

  

  try {
    if (type == "HeadOffice") {
      const report = await Campaign.update({ isHeadOfficeReported: true }, { where: { id: campaignId } });
      res.status(200).json(report);
    } else if (type == "Branch") {
      const body = {
        actualCost: total.total_actualCost,
        actualSalesCount: total.total_actualSalesCount,
        actualResponseCount: total.total_actualResponseCount,
        actualROI: total.total_actualROI,
        actualRevenue: total.total_actualRevenue,

      }

      const report = await Campaign.update({ isBranchTotalReported: true, ...body }, { where: { id: campaignId } });
      res.status(200).json(report);
    }
    else if (type == "Agent") {
      const report = await Campaign.update({ isAgentTotalReported: true }, { where: { id: campaignId } });
      res.status(200).json(report);
    }
    else if (type == "Broker") {
      const report = await Campaign.update({ isBrokerTotalReported: true }, { where: { id: campaignId } });
      res.status(200).json(report);
    }
    // res.status(200).json(report);
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};


module.exports = {
  getCampaign,
  createCampaign,
  getCampaignByPk,
  editCampaign,
  deleteCampaign,
  getBranchCampaign,
  getTeamCampaign,
  getIndividualCampaign,
  reportCampaign,
  editCampaignFeaturedAsset,
  getAgentCampaign,
  getBrokerCampaign
};
