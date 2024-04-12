const Contact = require("../../models/Contact");
const SharedSales = require("../../models/SharedSales");
const User = require("../../models/acl/user");

const getSharedSales = async (req, res) => {
  try {
    
    const data = await SharedSales.findAll({ include:[User,Contact],  where: {contactId: req.params.contactId} });
    res.status(200).json(data);
  } catch (error) {
     res.status(400).json({ msg: error.message });
  }
}; 


//posting
const createSharedSales = async (req, res) => {
  const sharedSalesBody = req.body
 
  try {
    await sharedSalesBody.userId.forEach(element => {
       let shared = SharedSales.findAll({ where: { contactId: sharedSalesBody.contactId, userId: sharedSalesBody.userId } });
      if (shared.length == 0) {
        SharedSales.create({
          contactId: sharedSalesBody.contactId,
          userId: element
        }
        );
      }
      
    });
    
    res.status(200).json(sharedSalesBody);
  } catch (error) {
    
    res.status(400).json({ msg: error.message });
    
  }
}; 

const getSharedSalesByPk = async (req, res) => {
  try {
    const sharedSales = await SharedSales.findByPk(req.params.id,{include:[User,Contact]}).then(function (
      SharedSales
    ) {
      if (!SharedSales) {
        res.status(400).json({ message: "No Data Found" });
      }
      else {
        res.status(200).json(SharedSales);
      }
    });

   
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};

const editSharedSales = async (req , res) => {
   const sharedSales = req.body
   const id = req.params.id

  try {
    
    SharedSales.update(
     sharedSales,

      { where: { id: id } }
    );
    
    res.status(200).json({ id });
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};

const deleteSharedSales = async (req, res) => {
  const  id  = req.params.id;

  try {
    SharedSales.destroy({ where: { id: id } });

    res.status(200).json({ id });
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};

module.exports = {
  getSharedSales,
  createSharedSales,
  getSharedSalesByPk,
  editSharedSales,
  deleteSharedSales,
};
