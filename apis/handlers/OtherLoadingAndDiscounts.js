const OtherLoadingAndDiscounts = require("../../models/otherLoadingAndDiscounts");
const User = require("../../models/acl/user");
const Employee = require("../../models/Employee");

const getOtherLoadingAndDiscounts = async (req, res) => {
  const currentUser = await User.findByPk(req.user.id, {
    include: [Employee],
  });
  //req.type ="self"
  

  try {
    if (req.type == "all") {
      const data = await OtherLoadingAndDiscounts.findAll({ raw: true });
      res.status(200).json(data);
    }else if (req.type == "self"){
      const data = await OtherLoadingAndDiscounts.findAll({ 
        raw: true,
        where: { userId: currentUser.id }
      });
      res.status(200).json(data);
    }else if (req.type == "customer"){
      const data = await OtherLoadingAndDiscounts.findAll({ 
        raw: true,
        where: { userId: currentUser.id } 
      });
      res.status(200).json(data);
    }else if (req.type == "branch"){
      const data = await OtherLoadingAndDiscounts.findAll({ 
        raw: true,
        include: {
          model: User, as: 'user',
          include: [Employee],
        },
        where: { "$user.employee.branchId$": currentUser.employee.branchId }
      });
      res.status(200).json(data);
    }else if (req.type == "branchAndSelf"){
      const data = await OtherLoadingAndDiscounts.findAll({ 
        raw: true,
        include: {
          model: User, as: 'user',
          include: [Employee],
        },
        where: { 
          userId: currentUser.id,
          "$user.employee.branchId$": currentUser.employee.branchId
        }
      });
      res.status(200).json(data);
    }
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};
const getOtherLoadingAndDiscountsForCustomer = async (req, res) => {
  try {
    const data = await OtherLoadingAndDiscounts.findAll({ where: { visibleToCustomer: true } });
    
    res.status(200).json(data);
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};
//posting
const createOtherLoadingAndDiscounts = async (req, res) => {
  
  const body = req.body
  try {
    const chargeRate = await OtherLoadingAndDiscounts.create(body);
    res.status(200).json(chargeRate);
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};

const getOtherLoadingAndDiscountsByPk = async (req, res) => {
  try {
    const chargeRate = await OtherLoadingAndDiscounts.findByPk(req.params.id).then(function (
      OtherLoadingAndDiscounts
    ) {
      if (!OtherLoadingAndDiscounts) {
        res.status(400).json({ message: "No Data Found" });
      }
      res.status(200).json(OtherLoadingAndDiscounts);
    });

    res.status(200).json(chargeRate);
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};

const editOtherLoadingAndDiscounts = async (req, res) => {
  const chargeRate = req.body
  const id = req.body.id

  try {
    
    OtherLoadingAndDiscounts.update(
      chargeRate,

      { where: { id: id } }
    );

    res.status(200).json({ id });
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};

const deleteOtherLoadingAndDiscounts = async (req, res) => {
  const id = req.params.id;

  try {
    OtherLoadingAndDiscounts.destroy({ where: { id: id } });

    res.status(200).json({ id });
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};

module.exports = {
  getOtherLoadingAndDiscounts,
  createOtherLoadingAndDiscounts,
  getOtherLoadingAndDiscountsByPk,
  editOtherLoadingAndDiscounts,
  deleteOtherLoadingAndDiscounts,
  getOtherLoadingAndDiscountsForCustomer
};
