const { Op } = require("sequelize");
const CompanyContact = require("../../models/CompanyContact");
const Contact = require("../../models/Contact");
const { isEmailValid, isPhoneNoValid } = require("../../utils/GeneralUtils");
const ContactCompanyConatact = require("../../models/ContactCompanyContact");
const { canUserRead, canUserCreate } = require("../../utils/Authrizations");

const getSearch = (st, contactId) => {
  return {
    [Op.and]: [
      { "$contacts.id$": { [Op.like]: contactId } },
      {
        [Op.or]: [
          { firstName: { [Op.like]: `%${st}%` } },
          { fatherName: { [Op.like]: `%${st}%` } },
          { primaryPhone: { [Op.like]: `%${st}%` } },
          { secondaryPhone: { [Op.like]: `%${st}%` } },
          { primaryEmail: { [Op.like]: `%${st}%` } },
          { secondaryEmail: { [Op.like]: `%${st}%` } },
        ],
      },
    ],
  };
};

const getContactContacts = async (req, res) => {
  if (!(await canUserRead(req.user, "companyContacts"))) {
    return res.status(400).json({ msg: "unauthorized access!" });
  }
  //queryparams:  { f: '0', r: '7', st: '', sc: 'first_name', sd: '1' }
  const { f, r, st, sc, sd } = req.query;

  try {
    const data = await CompanyContact.findAndCountAll({
      include: [Contact],
      where: getSearch(st, req.params.id),
      offset: Number(f),
      limit: r == 0 ? null : Number(r),
      subQuery: false,
      // order: [[sc || "first_name", sd == 1 ? "ASC" : "DESC"]],
    });

    res.status(200).json(data);
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};

//posting
const createContactContact = async (req, res) => {
  if (!(await canUserCreate(req.user, "companyContacts"))) {
    
    return res.status(400).json({ msg: "unauthorized access!" });
  }
  const body = req.body;
  
  try {
    if (!isPhoneNoValid(body.primaryPhone)) {
      res.status(400).json({ msg: "Invalid phone number" });
      return;
    }
    const companyContact = await CompanyContact.create(body).then((contact) => {
      try {
        

        contact.addContacts(body.contactId, { through: ContactCompanyConatact });
        res.status(200).json(contact);
      }
      catch (error) {
        res.status(400).json({ msg: error.message });
      }
    });
    


  } catch (error) {
    
    res.status(400).json({ msg: error.message });
  }
};

module.exports = {
  getContactContacts,
  createContactContact,
};
