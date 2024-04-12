const Customer = require("../../../models/Customer");
const {isEmailValid} = require("../../../utils/GeneralUtils");

/**
 * Get customers controller
 * @param {*} req 
 * @param {*} res 
 */

const getCustomers = async (req, res) => {
  try {
    const data = await Customer.findAll({ raw: true });
    res.status(200).json(data);
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};
 /**
  * Get insured customers controller
  * @param {*} req 
  * @param {*} res 
  */

const getInsuredCustomers = async (req, res) => {
  try {
    const data = await Customer.findAll({ where:{
      isInsured:[true]
    } });
    res.status(200).json(data);
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};

/**
 * Get leads controller
 * @param {*} req 
 * @param {*} res 
 */
const getLeads = async (req, res) => {
  try {
    const data = await Customer.findAll({ where:{
      isInsured:[false]
    } });
    res.status(200).json(data);
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};


/**
 * Create customers controller
 * @param {*} req 
 * @param {*} res 
 */
const createCustomer = async (req, res) => {
  const customerBody = req.body;
  try {
    
    const customer = await Customer.create(customerBody);
    res.status(200).json(customer);
  } catch (error) {
    
  }
};

/**
 * Get customer controller
 * @param {*} req 
 * @param {*} res 
 */
const getCustomer = async (req, res) => {
  try {
    const customer = await Customer.findByPk(req.params.id).then(function (
      customer
    ) {
      if (!customer) {
        res.status(404).json({ message: "No Data Found" });
      }
      res.status(200).json(customer);
    });

    // res.status(200).json(customer);
  } catch (error) {
    res.status(404).json({ msg: error.message });
  }
};
/**
 * Edit customer controller
 * @param {*} req 
 * @param {*} res 
 * @returns 
 */
const editCustomer = async (req, res) => {
  
  const { id, userId, type, business_source, region, city, subCity, woreda, kebele, houseNo, phoneNo, email} =
    req.body;

  try {
    if (!isEmailValid(email)){
      res.status(400).json({msg: "invalid email"});
      return;
  }
    Customer.update(
      {
        userId: userId,
        type: type,
        business_source: business_source,
        region: region,
        city: city,
        subCity: subCity,
        woreda: woreda,
        kebele: kebele,
        houseNo: houseNo, 
        phoneNo: phoneNo,
        email: email,
      },

      { where: { id: id } }
    );
    
    res.status(200).json({ id });
  } catch (error) {
    
    res.status(404).json({ msg: error.message });
  }
};

/**
 * Delete customer controller
 * @param {*} req 
 * @param {*} res 
 */
const deleteCustomer = async (req, res) => {
  const  id  = req.params.id;
  try {
    Customer.destroy({ where: { id: id } });

    res.status(200).json({ id });
  } catch (error) {
    res.status(404).json({ msg: error.message });
  }
};

module.exports = {
  getCustomers,
  createCustomer,
  getCustomer,
  editCustomer,
  deleteCustomer,
  getInsuredCustomers,
  getLeads
};
