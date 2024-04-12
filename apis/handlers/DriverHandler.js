const Driver = require("../../models/Driver");
const {isEmailValid} = require("../../utils/GeneralUtils");

const getDrivers = async (req, res) => {
  try {
    const data = await Driver.findAll({ raw: true });
    res.status(200).json(data);
  } catch (error) {
    
    res.status(400).json({ msg: error.message });
  }
};

//posting
const createDriver = async (req, res) => {
  
  const { first_name, father_name, grandfather_name, region, phone, wereda, sub_city, kebele, house_no, po_box, occupation, birth_date, license_no, grade, expiration_date} =
    req.body;
  try {
    const driver = await Driver.create({
      first_name: first_name,
      father_name: father_name,
      grandfather_name:grandfather_name,
      region: region,
      phone: phone,
      sub_city: sub_city,
      wereda: wereda,
      kebele : kebele,
      house_no: house_no, 
      po_box : po_box,
      occupation: occupation,
      birth_date:  birth_date,
      license_no: license_no, 
      grade: grade,
      expiration_date : expiration_date
    });
    res.status(200).json(driver);
  } catch (error) {
    
  }
};

const getDriver = async (req, res) => {
  try {
    const driver = await Driver.findByPk(req.params.id).then(function (
      driver
    ) {
      if (!driver) {
        res.status(404).json({ message: "No Data Found" });
      }
      res.status(200).json(driver);
    });

    res.status(200).json(driver);
  } catch (error) {
    res.status(404).json({ msg: error.message });
  }
};

const editDriver = async (req, res) => {
  
  const { id, first_name, father_name,grandfather_name, region, phone, sub_city, wereda, kebele, house_no, po_box, occupation, birth_date, license_no, grade, expiration_date } =
    req.body;
    Driver.update(
      {
        first_name: first_name,
        father_name: father_name,
        grandfather_name:grandfather_name,
        region: region,
        phone: phone,
        //region: region,
        sub_city: sub_city,
        wereda: wereda,
        kebele : kebele,
        house_no: house_no, 
        po_box : po_box,
        occupation: occupation,
        birth_date:  birth_date,
        license_no: license_no, 
        grade: grade,
        expiration_date : expiration_date
        
      },

      { where: { id: id } }
    );
    
    res.status(200).json({ id });
};

const deleteDriver = async (req, res) => {
  const  id  = req.params.id;
  try {
    Driver.destroy({ where: { id: id } });

    res.status(200).json({ id });
  } catch (error) {
    res.status(404).json({ msg: error.message });
  }
};

module.exports = {
  getDrivers,
  createDriver,
  getDriver,
  editDriver,
  deleteDriver,
};
