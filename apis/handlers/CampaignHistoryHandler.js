const CampaignHistory= require("../../models/CampaignHistory");

const getCampaignHistory= async (req, res) => {
  try {
    const data = await CampaignHistory.findAll({ raw: true });
    res.status(200).json(data);
  } catch (error) {
     res.status(400).json({ msg: error.message });
  }
}; 

//posting
const createCampaignHistory= async (req, res) => {
  const campaignHistoryBody = req.body
  try {
    const campaignHistory= await CampaignHistory.create(campaignHistoryBody);
    res.status(200).json(campaignHistory);
  } catch (error) {
     res.status(400).json({ msg: error.message });
  }
}; 

const getCampaignHistoryByPk = async (req, res) => {
  try {
    const campaignHistory= await CampaignHistory.findByPk(req.params.id).then(function (
      CampaignHistory
    ) {
      if (!CampaignHistory) {
        res.status(400).json({ message: "No Data Found" });
      }
      else {
        res.status(200).json(CampaignHistory);
      }
    });

   
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};

const editCampaignHistory= async (req , res) => {
   const campaignHistory= req.body
   const id = req.campaignHistory.id

  try {
    
    CampaignHistory.update(
     campaignHistory,{ where: { id: id } }
    );
    
    res.status(200).json({ id });
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};

const deleteCampaignHistory= async (req, res) => {
  const  id  = req.params.id;

  try {
    CampaignHistory.destroy({ where: { id: id } });

    res.status(200).json({ id });
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};

module.exports = {
  getCampaignHistory,
  createCampaignHistory,
  getCampaignHistoryByPk,
  editCampaignHistory,
  deleteCampaignHistory,
};
