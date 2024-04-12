const { Op } = require("sequelize");
const User = require("../../models/acl/user");
const Branch = require("../../models/Branch");
const Lead = require("../../models/Lead");
const { isEmailValid, isPhoneNoValid } = require("../../utils/GeneralUtils");

const getSearch = (st) => {
  return {
    [Op.or]: [
      { name: { [Op.like]: `%${st}%` } },
      { industry: { [Op.like]: `%${st}%` } },
      { primaryPhone: { [Op.like]: `%${st}%` } },
      { secondaryPhone: { [Op.like]: `%${st}%` } },
      { status: { [Op.like]: `%${st}%` } },
      { primaryEmail: { [Op.like]: `%${st}%` } },
      { secondaryEmail: { [Op.like]: `%${st}%` } },
      { website: { [Op.like]: `%${st}%` } },
      { fax: { [Op.like]: `%${st}%` } },
      { tinNumber: { [Op.like]: `%${st}%` } },
      { annualRevenue: { [Op.like]: `%${st}%` } },
      { legalForm: { [Op.like]: `%${st}%` } },
      { country: { [Op.like]: `%${st}%` } },
      { region: { [Op.like]: `%${st}%` } },
      { city: { [Op.like]: `%${st}%` } },
      { subcity: { [Op.like]: `%${st}%` } },
      { woreda: { [Op.like]: `%${st}%` } },
      { kebele: { [Op.like]: `%${st}%` } },
      { building: { [Op.like]: `%${st}%` } },
      { TOT: { [Op.like]: `%${st}%` } },
      { socialSecurity: { [Op.like]: `%${st}%` } },
      { registrationForVat: { [Op.like]: `%${st}%` } },
    ],
  };
};

const getLeads = async (req, res) => {
  
  //queryparams:  { f: '0', r: '7', st: '', sc: 'first_name', sd: '1' }
  const { f, r, st, sc, sd } = req.query;
  try {
    const data = await Lead.findAndCountAll({
      include: [
        {
          model: User,
          as: "assignedUser",
        },
        Branch,
        {
          model: Lead,
          as: "parentLead",
        },
      ],
      offset: Number(f),
      limit: Number(r),
      order: [[sc || "name", sd == 1 ? "ASC" : "DESC"]],
      where: getSearch(st),
    });
    res.status(200).json(data);
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};

const getLead = async (req, res) => {
  try {
    const lead = await Lead.findByPk(req.params.id, {
      include: [
        {
          model: User,
          as: "assignedUser",
        },
        Branch,
        {
          model: Lead,
          as: "parentLead",
        },
      ],
    });
    if (!lead) {
      res.status(404).json({ message: "No Data Found" });
    }
    res.status(200).json(lead);

    res.status(200).json(lead);
  } catch (error) {
    res.status(404).json({ msg: error.message });
  }
};
//posting
const createLead = async (req, res) => {
  
  const {
    name,
    status,
    assignedTo,
    industry,
    numberOfEmployees,
    productId,
    parentLeadId,
    branchId,
    primaryPhone,
    secondaryPhone,
    primaryEmail,
    secondaryEmail,
    website,
    fax,
    tinNumber,
    annualRevenue,
    legalForm,
    businessSource,
    country,
    region,
    city,
    subcity,
    woreda,
    kebele,
    building,
    officeNumber,
    poBox,
    TOT,
    socialSecurity,
    registrationForVat,
    description,
    userId,
  } = req.body;
  try {
    if (!isPhoneNoValid(primaryPhone)) {
      res.status(400).json({ msg: "Invalid phone number" });
      return;
    }
    if (!isEmailValid(primaryEmail)) {
      res.status(400).json({ msg: "invalid email" });
      return;
    }
    const lead = await Lead.create({
      name,
      status,
      assignedTo,
      industry,
      numberOfEmployees,
      productId,
      parentLeadId,
      branchId,
      primaryPhone,
      secondaryPhone,
      primaryEmail,
      secondaryEmail,
      website,
      fax,
      tinNumber,
      annualRevenue,
      legalForm,
      businessSource,
      country,
      region,
      city,
      subcity,
      woreda,
      kebele,
      building,
      officeNumber,
      poBox,
      TOT,
      socialSecurity,
      registrationForVat,
      description,
      userId,
    });
    res.status(200).json(lead);
  } catch (error) {
    
  }
};

const editLead = async (req, res) => {
  
  const {
    id,
    name,
    status,
    assignedTo,
    industry,
    numberOfEmployees,
    productId,
    parentLeadId,
    branchId,
    primaryPhone,
    secondaryPhone,
    primaryEmail,
    secondaryEmail,
    website,
    fax,
    tinNumber,
    annualRevenue,
    legalForm,
    businessSource,
    country,
    region,
    city,
    subcity,
    woreda,
    kebele,
    building,
    officeNumber,
    poBox,
    TOT,
    socialSecurity,
    registrationForVat,
    description,
    userId,
  } = req.body;

  try {
    if (!isPhoneNoValid(primaryPhone) || !isPhoneNoValid(secondaryPhone)) {
      res.status(400).json({ msg: "Invalid phone number" });
      return;
    }
    if (!isEmailValid(primaryEmail) || !isEmailValid(secondaryEmail)) {
      res.status(400).json({ msg: "invalid email" });
      return;
    }
    Lead.update(
      {
        name,
        status,
        assignedTo,
        industry,
        numberOfEmployees,
        productId,
        parentLeadId,
        branchId,
        primaryPhone,
        secondaryPhone,
        primaryEmail,
        secondaryEmail,
        website,
        fax,
        tinNumber,
        annualRevenue,
        legalForm,
        businessSource,
        country,
        region,
        city,
        subcity,
        woreda,
        kebele,
        building,
        officeNumber,
        poBox,
        TOT,
        socialSecurity,
        registrationForVat,
        description,
        userId,
      },

      { where: { id: id } }
    );

    res.status(200).json({ id });
  } catch (error) {
    
    res.status(404).json({ msg: error.message });
  }
};

const deleteLead = async (req, res) => {
  const id = req.params.id;
  try {
    Lead.destroy({ where: { id: id } });

    res.status(200).json({ id });
  } catch (error) {
    res.status(404).json({ msg: error.message });
  }
};

module.exports = {
  getLeads,
  createLead,
  getLead,
  editLead,
  deleteLead,
};
