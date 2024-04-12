const CampaignTour = require("../../models/CampaignTour");
const CampaignTourMembers = require("../../models/CampaignTourMembers");
const CampaignTourDocument = require("../../models/CampaignTourDocuments");
const SalesPerson = require("../../models/SalesPerson");
const Document = require("../../models/Document")
const getCampaignTour = async (req, res) => {
  try {
    const data = await CampaignTour.findAll({include:[SalesPerson,Document]});
    res.status(200).json(data);
  } catch (error) {
     res.status(400).json({ msg: error.message });
  }
}; 

//posting
const createCampaignTour = async (req, res) => {
  const campaignTourBody = req.body
 
  try {
    const campaignTour = await CampaignTour.create({
      visitDate: campaignTourBody.visitDate,
      sector: campaignTourBody.sector,
     
    });
   
    await campaignTour.addSales_person(campaignTourBody.sales_persons, { through: CampaignTourMembers })
     await campaignTour.addDocuments(campaignTourBody.documents, { through: CampaignTourDocument })
    res.status(200).json(campaignTour);
  } catch (error) {
     res.status(400).json({ msg: error.message });
  }
}; 

const getCampaignTourByPk = async (req, res) => {
  try {
    const campaignTour = await CampaignTour.findByPk(req.params.id).then(function (
      CampaignTour
    ) {
      if (!CampaignTour) {
        res.status(400).json({ message: "No Data Found" });
      }
      else {
        res.status(200).json(CampaignTour);
      }
    });

   
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};

const editCampaignTour = async (req , res) => {
   const campaignTourbody = req.body
   const id = req.body.id

  try {
    const getCampaignTour = await CampaignTour.findByPk(id).then(function (
      response
    ) {
      if (!response) {
        res.status(400).json({ message: "No Data Found" });
      }
      else {
        const campaignTour =  CampaignTour.update(
          campaignTourbody,{ where: { id: id } }
        );

        response.setSales_persons(campaignTourbody.sales_persons, { through: CampaignTourMembers })
        response.setDocuments(campaignTourbody.documents, { through: CampaignTourDocument })
        res.status(200).json({ id });
      }
    });
  
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};

const deleteCampaignTour = async (req, res) => {
  const  id  = req.params.id;

  try {
    CampaignTour.destroy({ where: { id: id } });

    res.status(200).json({ id });
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};

module.exports = {
  getCampaignTour,
  createCampaignTour,
  getCampaignTourByPk,
  editCampaignTour,
  deleteCampaignTour,
};
