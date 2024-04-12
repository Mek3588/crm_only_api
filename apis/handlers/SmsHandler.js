
const Vendor = require("../../models/vendor/Vendors");
const { Op } = require("sequelize");
const SMSMessage = require("../../models/SMS");
const { sendNewSms } = require("./SMSServiceHandler");
const VendorSms = require("../../models/vendor/VendorSMS");

const sendSMS = async (req, res) => {
  const body = req.body
  
    try { 
    const vendor = await Vendor.findByPk({ where: { id: { [Op.in]: [body.vendors] } } })
    const sendTo = []
      vendor.map(e => {
        if (body.emailType.length == 0) {
          sendTo.push(e.primaryPhonenumber)
        }
        if (body.emailType.find(element => element ==  'primaryPhonenuber')){
          sendTo.push(e.primaryPhonenumber)
        }
        if (body.emailType.find(element => element == 'secondaryPhonenumber')){
           sendTo.push(e.secondaryPhonenumber)
        }
      })


       sendNewSms(sendTo, body.content)

    if(sent == 1){
     const sms = await SMSMessage.create(body,).then((sms) => {
       sms.addVendors(body.vendors, { through: VendorSms })
       
     })

    //  if(body.campaignId != 0){
    //     // const newBody = {...body,  }
    //     const {userId, content, campaignId,isLeadSms, isAccountSms, isCustomerSms, ...others} = body;
    //     const newBody= {userId, content, campaignId,isLeadSms, isAccountSms, isCustomerSms};
    //     
    //  }
      return  res.status(200).json(sms);
    }
    else {
       res.status(400).json({ msg:"sms not sent" });
    }
   
  } catch (error) {
     res.status(400).json({ msg: error.message });
  }
}

const getSMS = async (req, res) => {
  const body = req.params.id
    try {
    const sms = await SMSMessage.findAll({
      include: [User, Vendor],
      where: {  "$vendors.id$": { [Op.like]:body}, }
   
    });
    res.status(200).json(sms);
  } catch (error) {
   
     res.status(400).json({ msg: error.message });
  }
}



module.exports = {
    getSMS,
    sendSMS
}