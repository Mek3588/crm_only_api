const SalesPerson = require("../../models/SalesPerson");
const User = require("../../models/acl/user");
const { isEmailValid, isPhoneNoValid } = require("../../utils/GeneralUtils");
const { Op } = require("sequelize");
const { smsFunction } = require("./SMSServiceHandler");
const { sendWelcomeEmail } = require("./EmailServiceHandler");

const getSalesPersons = async (req, res) => {
  try {
    const data = await SalesPerson.findAll({ include: User });
    res.status(200).json(data);
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};

const toggleActivation = async (req, res) => {
  const { userId } = req.params;
  try {
    const data = await User.findByPk(userId);
    await User.update(
      { activated: !data.activated },
      { where: { id: userId } }
    );
    res.status(200).json({ activated: !data.activated });
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};

//posting
const createSalesPerson = async (req, res) => {
  const {
    first_name,
    father_name,
    grandfather_name,
    email,
    gender,
    phone,
    license_no,
    license_expiration_date,
    type,
    organization_name,
  } = req.body;
  try {
    if (!isPhoneNoValid(phone)) {
      res.status(400).json({ msg: "Invalid phone number" });
      return;
    }
    const oldSalesPerson = await SalesPerson.findOne({where:{[Op.or]:[{email}, {phone}]}});
    if (oldSalesPerson) return res.status(400).json({ msg: "Sales person already registered." });
    const salesPerson = await SalesPerson.create({
      first_name,
       father_name,
    grandfather_name,
      email,
      gender,
      phone,
      license_no,
      license_expiration_date,
      type,
      organization_name,
    });
    smsFunction(phone, `Dear ${first_name} ${father_name} ${grandfather_name}, welcome to the Zemen Insurance!`)
    sendWelcomeEmail(email, `${first_name} ${father_name} ${grandfather_name}`, "welcome to the Zemen Insurance!", "welcome to the Zemen Insurance!")
  
    res.status(200).json(salesPerson);
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};

const createSalesPersons = async (req, res) => {
  const SalesPersons = req.body
  
  try {
    SalesPersons.map(async(salesPerson)=>{
      let addedSalesPersons = await SalesPerson.findAll({
        where: { phone: salesPerson.phone, email: salesPerson.email },
      });
      
      const {id, ...others} = salesPerson;
      if (addedSalesPersons.length == 0) await SalesPerson.create(others);
      smsFunction(salesPerson.phone, `Dear ${salesPerson.first_name} ${salesPerson.father_name} ${salesPerson.grandfather_name}, welcome to the Zemen Insurance!`)
      sendWelcomeEmail(salesPerson.email, `Dear ${salesPerson.first_name} ${salesPerson.father_name} ${salesPerson.grandfather_name}, welcome to the Zemen Insurance!`)
    });
    res.status(200).json(SalesPersons);
  } catch (error) {
    
     res.status(400).json({ msg: error.message });
  }
}; 


const getSalesPerson = async (req, res) => {
  try {
    const salesPerson = await SalesPerson.findByPk(req.params.id, {
      include: User,
    }).then(function (salesPerson) {
      if (!salesPerson) {
        res.status(404).json({ message: "No Data Found" });
      }
      res.status(200).json(salesPerson);
    });
  } catch (error) {
    res.status(404).json({ msg: error.message });
  }
};

const getSalesPersonsByType = async (req, res) => {
  const { type } = req.params;
  try {
    if (type == "Agent") {
      agents = await SalesPerson.findAll({ where: { type: "Agent" } });
      res.status(200).json(agents);
    }
    if (type == "Broker") {
      brokers = await SalesPerson.findAll({ where: { type: "Broker" } });
      res.status(200).json(brokers);
    }
  } catch (error) {
    res.status(404).json({ msg: error.message });
  }
};

const getSearchResults = async (req, res) => {  
  const  key  = req.query.key;
  const type = req.query.type;
  try {
    const salesPerson = await SalesPerson.findAll({
      order: [["id", "ASC"]],
      where: {
        [Op.or]: [
          {
            first_name: {
              [Op.like]: "%" + key + "%",
            },
          },
          {
            father_name: {
              [Op.like]: "%" + key + "%",
            },
          },
          {
            grandfather_name: {
              [Op.like]: "%" + key + "%",
            },
          },
          {
            email: {
              [Op.like]: "%" + key + "%",
            },
          },
          {
            phone: {
              [Op.like]: "%" + key + "%",
            },
          },
          {
            gender: {
              [Op.like]: key + "%",
            },
          },
          {
            license_no: {
              [Op.like]: "%" + key + "%",
            },
          },
          {
            organization_name: {
              [Op.like]: "%" + key + "%",
            },
          },
          {
            type: {
              [Op.like]: "%" + key + "%",
            },
          },
        ],
        [Op.and]: [
          ( !type || {
            type: {
              [Op.like]: "%" + type + "%",
            },
          }),
        ]
      },
    });
    if (!salesPerson) {
      res.status(404).json({ message: "No Data Found" });
    }else res.status(200).json(salesPerson);
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};

const getAllSearchResults = async (req, res) => {  
  const  key  = req.query.key;
  try {
    const salesPerson = await SalesPerson.findAll({
      order: [["id", "ASC"]],
      where: {
        [Op.or]: [
          {
            first_name: {
              [Op.like]: "%" + key + "%",
            },
          },
          {
            father_name: {
              [Op.like]: "%" + key + "%",
            },
          },
          {
            grandfather_name: {
              [Op.like]: "%" + key + "%",
            },
          },
          {
            email: {
              [Op.like]: "%" + key + "%",
            },
          },
          {
            phone: {
              [Op.like]: "%" + key + "%",
            },
          },
          {
            license_no: {
              [Op.like]: "%" + key + "%",
            },
          },
          {
            organization_name: {
              [Op.like]: "%" + key + "%",
            },
          },
          {
            type: {
              [Op.like]: "%" + key + "%",
            },
          },
        ],
      },
    });
    if (!salesPerson) {
      res.status(404).json({ message: "No Data Found" });
    }else res.status(200).json(salesPerson);
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};

const editSalesPerson = async (req, res) => {
  const {
    id,
    first_name,
    father_name,
    grandfather_name,
    email,
    phone,
    gender,
    license_no,
    license_expiration_date,
    type,
    organization_name,
  } = req.body;

  try {
    if (!isEmailValid(email)) {
      res.status(400).json({ msg: "invalid email" });
      return;
    }
    if (!isPhoneNoValid(phone)) {
      res.status(400).json({ msg: "Invalid phone number" });
      return;
    }
    SalesPerson.update(
      {
        first_name: first_name,
        father_name: father_name,
        grandfather_name: grandfather_name,
        email: email,
        phone: phone,
        gender: gender,
        license_no: license_no,
        license_expiration_date: license_expiration_date,
        type,
        organization_name,
      },

      { where: { id: id } }
    );

    res.status(200).json({ id });
  } catch (error) {
    res.status(404).json({ msg: error.message });
  }
};

const deleteSalesPerson = async (req, res) => {
  const id = req.params.id;
  try {
    SalesPerson.destroy({ where: { id: id } });

    res.status(200).json({ id });
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};

module.exports = {
  getSalesPersons,
  createSalesPerson,
  createSalesPersons,
  getSalesPerson,
  getSalesPersonsByType,
  getSearchResults,
  getAllSearchResults,
  editSalesPerson,
  deleteSalesPerson,
  toggleActivation,
};
