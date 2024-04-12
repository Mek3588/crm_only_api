const Branch = require("../../models/Branch");

const Document = require("../../models/Document");
const SalesPerson = require("../../models/SalesPerson");



const getCampaignSales= async (req, res) => {
  try {
      const data = await CampaignSales.findAll({ include: [SalesPerson, CampaignSales, SalesPerson ]});
    res.status(200).json(data);
  } catch (error) {
     res.status(400).json({ msg: error.message });
  }
};
 
//posting
const createCampaignSales= async (req, res) => {
  const dataBody = req.body
  try {
    const campaign= await CampaignSales.create(dataBody);
    res.status(200).json(campaign);
  } catch (error) {
     res.status(400).json({ msg: error.message });
  }
};

const getCampaignSalesByPk = async (req, res) => {
   const params = req.params.id
  try {
    const campaign= await CampaignSales.findByPk(params,{include:[SalesPerson,CampaignSales]}).then(function (
      campaign
    ) {
      if (!campaign) {
        res.status(400).json({ message: "No Data Found" });
      }
      else{
        res.status(200).json(campaign);
      }
     
    });
    
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};

const editCampaignSales= async (req , res) => {
   const body = req.body
   const id = req.body.id

    try {
        CampaignSales.update(body,{where: {id:id}});
        res.status(200).json({ id }
        )  
     }
    catch (error) {
        res.status(400).json({ msg: error.message });
     }
};

const deleteCampaignSales= async (req, res) => {
  const  id  = req.params.id;

  try {
    CampaignSales.destroy({ where: { id: id } });

    res.status(200).json({ id });
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};

module.exports = {
  getCampaignSales,
  createCampaignSales,
  getCampaignSalesByPk,
  editCampaignSales,
  deleteCampaignSales,
};
