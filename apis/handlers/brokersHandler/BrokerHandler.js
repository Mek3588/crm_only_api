const Broker = require("../../../models/broker/Broker");
const { isPhoneNoValid,convertFlattenedToNested } = require("../../../utils/GeneralUtils");
const { Op } = require("sequelize");
const PhoneNo = require("../../../models/PhoneNo");
const User = require("../../../models/acl/user");

// const excelTemplate = require('../../uploads/zemen_brokers_excel_template.xlsx');

const getSearch = (st) => {
  return {
      [Op.or]: [
       { firstName: { [Op.like]: `%${st}%` } },
      { fatherName: { [Op.like]: `%${st}%` } },
          { grandfatherName: { [Op.like]: `%${st}%` } },
      { gender: { [Op.like]: `%${st}%` } },
      { active: { [Op.like]: `%${st}%` } },
      { code: { [Op.like]: `%${st}%` } },
      { primaryEmail: { [Op.like]: `%${st}%` } },
      { primaryPhone: { [Op.like]: `%${st}%` } },
      { secondaryEmail: { [Op.like]: `%${st}%` } },
      { secondaryPhone: { [Op.like]: `%${st}%` } },
      { country: { [Op.like]: `%${st}%` } },
      { region: { [Op.like]: `%${st}%` } },
      { city: { [Op.like]: `%${st}%` } },
      { subcity: { [Op.like]: `%${st}%` } },
      { woreda: { [Op.like]: `%${st}%` } },
      { kebele: { [Op.like]: `%${st}%` } },
      { poBox: { [Op.like]: `%${st}%` } },
      { zipCode: { [Op.like]: `%${st}%` } },
      { streetName: { [Op.like]: `%${st}%` } },
      
    ],
  };
};

const getBroker = async (req, res) => {
   
    const { f, r, st, sc, sd } = req.query;
  try {
    const data = await Broker.findAndCountAll({
      include: [User, { model: User, as: "userAccount" }],
      offset: Number(f),
      limit: Number(r),
      order: [[sc || "createdAt", sd == 1 ? "DESC" : "ASC"]],
      where: { organizationId: req.params.id },
      subQuery: false,
    });
    res.status(200).json(data);
  } catch (error) {
    
    res.status(400).json({ msg: error.message });
  }
};
 
//posting
const createBroker = async (req, res) => {
  console.log("createBroker", req.body)
  let brokerBody = convertFlattenedToNested(req.body)
  const primaryEmail = brokerBody.primaryEmail; 
  try {
    const brokerFound = await Broker.findOne({
      where: {
        [Op.or]:[
          { primaryEmail: { [Op.like]: primaryEmail } },
          { primaryPhone: { [Op.like]: brokerBody.primaryPhone } }
        ]
      }
    })
  
    if (brokerFound === null) {
      if (req.file == null) {
        const { profilePicture, ...others } = brokerBody
           const data  = await Broker.create(others)
           console.log("======Broker.create=====", data)
        res.status(200).json(data);
      }
      else {
        brokerBody.profilePicture = "/uploads/" + req.file.filename
        const data  = await Broker.create(brokerBody)
        res.status(200).json(data);
      }
    } 
    else if(brokerFound){
      res.status(400).json({msg: "Broker exists"});
      return;
    }
    
  } catch (error) {
    
     res.status(400).json({ msg: error.message }); 
  }
}; 




const addPhoneNumber = async (req, res) => {
  try {
    const broker = await BrokerPhone.create(req.body)
     res.status(200).json(broker);
  } catch (error) {
     res.status(400).json({ msg: error.message });
  }
} 

const handleActivation = async (req, res) => { 
  try {
    
    const user = await User.findByPk(req.params.id)
    const broker = await User.update(
      { activated: !user.activated },
      { where: { id: req.params.id } }
    )
    // const sh = await Broker.findByPk(req.params.id)
    // const broker = await Broker.update(
    //   { active: !sh.active },
    //   {where :{id:req.params.id}}
    // )
    res.status(200).json(broker);
    
  } catch (error) {
    
      res.status(400).json({ msg: error.message });
  }
}

const createBrokers = async (req, res) => {
  const brokers = req.body

  const primaryEmail = req.body.primaryEmail;
  
  try {
    console.log("createBrokers=================================================")
    brokers.map(async(broker)=>{
      let addedBrokers = await Broker.findOne({
        where: { brokerId: broker.brokerId },
      });
      let usedEmails = await Broker.findOne({
        where: {primaryEmail: broker.primaryEmail}
      })

      if (addedBrokers == null && usedEmails == null)
        await Broker.create(broker);
    });
    res.status(200).json(brokers);
  } catch (error) {
     res.status(400).json({ msg: error.message });
  }
}; 

const getBrokerByPk = async (req, res) => {
  try {
    const broker = await Broker.findByPk(req.params.id,{include:[User,{model: User, as: 'userAccount'}]}).then((broker) =>{
      if (!broker) {
        res.status(400).json({ message: "No Data Found" });
      }
      else {
        res.status(200).json(broker);
      }
    });

   
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};



const getExcelTemplate = async (req, res) => {
  const fileName =  'zemen_brokers_excel_template.xlsx'
  const fileURL = '../../templates/zemen_brokers_excel_template.xlsx'
  try {
    const stream = fs.createReadStream(fileURL);
    res.set({
      'Content-Disposition': `attachment; filename='${fileName}'`,
      'Content-Type': 'application/xlsx',
    });
    stream.pipe(res);   
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};
const editBroker = async (req , res) => {
   let brokerBody =convertFlattenedToNested(req.body);
   const id = brokerBody.id
  try {
  const foundBroker = await Broker.findByPk(id)

    if (foundBroker) {
        brokerBody.accountId == "null" ? 0 : brokerBody.accountId;

      if (req.file == null) {
        const { profilePicture, ...others } = brokerBody
        await Broker.update(others, { where: { id: id } })
         res.status(200).json({ id });

      }
      else {
        brokerBody.profilePicture = "/uploads/" + req.file.filename
         await Broker.update(brokerBody, { where: { id: id } })
         res.status(200).json({ id });
      }
  }
 else {
          res.status(400).json({msg: "No data found"});
        }

  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};


const deleteBroker = async (req, res) => {
  const  id  = req.params.id;

  try {
    Broker.destroy({ where: { id: id } });

    res.status(200).json({ id });
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};


// const sendEmail = async (req, res) => {
//   const body = req.body

//   try {
//     const email = await Email.create(body).then((email) => {
//       email.addVendors(body.brokerId, {through : BrokerEmails})
//     }).then((email) => {
//       Broker.findByPk(body.brokerId).then((broker) => {
//         sendNewEmail(broker.primaryEmail, "", body.subject, body.message)
//       })
      
//     })
//     res.status(200).json(email);
//   } catch (error) {

//      res.status(400).json({ msg: error.message });
//   }
// }


// const sendSMS = async (req, res) => {
   
//   const body = req.body
  
//   try { 
//     const sms = await SMSMessage.create(body).then((sms) => {
//       sms.addVendors(body.brokerId, { through: BrokerSms })
//     }).then((sms) => {
//       Broker.findByPk(body.brokerId).then((broker) => {
//          sendNewSms(broker.primaryPhone, body.content)
//       })
     
//     })
   
//     res.status(200).json(sms);
//   } catch (error) {
   
//      res.status(400).json({ msg: error.message });
//   }
// }

// const getEmail = async (req, res) => {
//   const body = req.params.id
//   try {
//     const sms = await Email.findAll({
//       include: [ User, Broker],
//         where: {  "$brokers.id$": { [Op.like]:body}, }
        
//     });
//     res.status(200).json(sms);
//   } catch (error) {
  
//      res.status(400).json({ msg: error.message });
//   }
// }
// const getSMS = async (req, res) => {
//   const body = req.params.id
//     try {
//     const sms = await SMSMessage.findAll({
//       include: [User, Broker],
//       where: {  "$brokers.id$": { [Op.like]:body}, }
   
//     });
//     res.status(200).json(sms);
//   } catch (error) {
   
//      res.status(400).json({ msg: error.message });
//   }
// }







module.exports = {
  getBroker,
  getExcelTemplate,
  createBroker,
  createBrokers,
  getBrokerByPk,

  editBroker,
  deleteBroker,
  handleActivation,
  addPhoneNumber,
  // sendEmail,
  // sendSMS,
  // getEmail,
  // getSMS,

  
};
