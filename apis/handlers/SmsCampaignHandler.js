
const User = require("../../models/acl/user");
const SMSCampaign = require("../../models/SMSCampaign");


const getSmsCampaign = async (req, res) => {
  try {

    const {campaignId, isLeadSms, isAccountSms, isCustomerSms, owner} = req.query;

    let smsCampaign = await SMSCampaign.findAll({where : {campaignId, isLeadSms, isAccountSms, isCustomerSms, owner} , 
      include: [{model: User}]})

    // let emp = await Employee.findOne({ where: { userId: req.user.id } })
    // //  .branchId; 
    // let branchId = await emp.branchId;
    // const data = await CampaignBranch.findAll({ where: { branchId }, order: [["createdAt", "DESC"]], });
    res.status(200).json(smsCampaign);
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};

//posting


module.exports = {
  getSmsCampaign,

};
