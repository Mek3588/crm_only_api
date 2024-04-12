const { Op } = require("sequelize");
const CompanyContact = require("../../../models/CompanyContact");
const Shareholder = require("../../../models/competitors/Shareholder");
const ShareholderContact = require("../../../models/competitors/ShareholderContact");
const Broker = require("../../../models/agent/Brokers");
const { isEmailValid, isPhoneNoValid } = require("../../../utils/GeneralUtils");

const getSearch = (st, agentId) => {
    return {
        [Op.and]: [ 
          {"$agents.id$":  { [Op.like]:agentId }},
            // {
            //     [Op.or]: [
            //         { firstName: { [Op.like]: `%${st}%` } },
            //         { fatherName: { [Op.like]: `%${st}%` } },
            //         { secondaryPhone: { [Op.like]: `%${st}%` } },
            //         { secondaryPhone: { [Op.like]: `%${st}%` } },
            //         { primaryEmail: { [Op.like]: `%${st}%` } },
            //         { secondaryEmail: { [Op.like]: `%${st}%` } },
            //     ],
            // }
            ]
  };
};

const getBrokerContacts = async (req, res) => {
  //queryparams:  { f: '0', r: '7', st: '', sc: 'first_name', sd: '1' }
  const { f, r, st, sc, sd } = req.query;
  try {
    const data = await CompanyContact.findAndCountAll({
      include: [ Shareholder ],
       where: getSearch(st,req.params.id),
       offset: Number(f),
      limit: Number(r),
       subQuery:false
      // order: [[sc || "first_name", sd == 1 ? "ASC" : "DESC"]],
     
     
    });
    
    res.status(200).json(data);
  } catch (error) {
   
    res.status(400).json({ msg: error.message });
  }
};

//posting
const createBrokerContact = async (req, res) => {
  const body = req.body;
  
  try {
    if (!isPhoneNoValid(body.primaryPhone)) {
      res.status(400).json({ msg: "Invalid phone number" });
      return;
    }
    const companyContact = await CompanyContact.create(body).then((contact) => {
      contact.addBrokers(body.agentId, {through : ShareholderContact})
    })
    res.status(200).json(companyContact);
  } catch (error) {
    
    res.status(400).json({ msg: error.message });
  }
};

const getBrokerContact = async (req, res) => {
  try {
    const companyContact = await CompanyContact.findByPk(req.params.id).then((companyContact) => {
      if (!companyContact) {
        res.status(400).json({ message: "No Data Found" });
      }
      else {
        res.status(200).json(companyContact);
      }
      }
    );

    res.status(200).json(companyContact);
  } catch (error) {
    res.status(404).json({ msg: error.message });
  }
};


module.exports = {
  getBrokerContacts,
  createBrokerContact,
  getBrokerContact
 
};
