const MinimumPremium = require("../../../models/motor/MinimumPremium");
const Vehicle = require("../../../models/motor/Vehicle");
const User = require("../../../models/acl/user");
const Employee = require("../../../models/Employee");
const { type } = require("express/lib/response");

const getMinimumPremiums = async (req, res) => {
  const currentUser = await User.findByPk(req.user.id, {
    include: [Employee],
  });
  console.log("dtill inside ")

  try {
    if (req.type === "all") {
      const data = await MinimumPremium.findAll();
      
      res.status(200).json(data);
    } else if (req.type === "self" || req.type === "customer") {
      const data = await MinimumPremium.findAll({ 
        where: {
          userId: currentUser.id
        } 
      });
      
      res.status(200).json(data);
    } else if (req.type === "branch") {
      const data = await MinimumPremium.findAll({ 
        include: [{
          model: User,
          as: 'user',
          include: [Employee],
        }],
        where: {
          "$user.employee.branchId$": currentUser.employee.branchId
        } 
      });
      
      res.status(200).json(data);
    } else if (req.type === "branchAndSelf") {
      const data = await MinimumPremium.findAll({ 
        include: [{
          model: User,
          as: 'user',
          include: [Employee],
        }],
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

//posting
const createMinimumPremium = async (req, res) => {
  try {
    console.log("the inside ", req.body);
    if (req.body.type === "fire") {
      const existingFireMinimum = await MinimumPremium.findOne({
        where: {
          type: "fire"
        }
      });
      if (existingFireMinimum) {
        return res.status(400).json({ msg: 'A minimum for fire already exists.' });
      }
      
      req.body.category = "";
    }

    const existingMinimumPremium = await MinimumPremium.findOne({
      where: {
        category: req.body.category,
        type: "motor"
      }
    });

    if (existingMinimumPremium) {
      return res.status(400).json({ msg: 'A minimum with the same category already exists.' });
    }

    const minimumPremium = await MinimumPremium.create({
      ...req.body
    });

    res.status(200).json(minimumPremium);
  } catch (error) {
    console.log("error ==", error)
    res.status(500).json({ error: 'Internal server error' });
  }
};

 ``



const getMinimumPremium = async (req, res) => {
  try {
    const minimumPremium = await MinimumPremium.findByPk(req.params.id).then(function (
      minimumPremium
    ) {
      if (!minimumPremium) {
        res.status(404).json({ message: "No Data Found" });
      }
      res.status(200).json(minimumPremium);
    });

    res.status(200).json(minimumPremium);
  } catch (error) {
    res.status(404).json({ msg: error.message });
  }
};

const getMinimumPremiumsByCategory = async (req, res) => {
  try {
    const category = req.params.category;

    const minimumPremiums = await fetchMinimumPremiums({
      where: {
        category: category
      }
    });
    res.status(200).json(minimumPremiums);
  } catch (error) {
    // Handle errors
    console.error('Error fetching minimum premiums:', error);
    res.status(500).send('An error occurred while fetching minimum premiums.');
  }
};

const getMinimumPremiumsToFire = async (req, res) => {
  try {
    const existingFireMinimums = await MinimumPremium.findAll({
      where: {
        type: "fire"
      }
    });
console.log("thsdsnndsiu",existingFireMinimums)
    if (existingFireMinimums.length === 0) {
      return res.status(400).json({ msg: 'Please create a minimum premium first.' });
    }

    // If there are existing fire minimum premiums, respond with them
    res.status(200).json(existingFireMinimums);
  } catch (error) {
    console.error('Error fetching minimum premiums:', error);
    res.status(500).send('An error occurred while fetching minimum premiums.');
  }
};


const editMinimumPremium = async (req, res) => {
  
  const { id } = req.body;

  try {
    MinimumPremium.update(
      {
        ...req.body
      },

      { where: { id: id } }
    );

    res.status(200).json({ id });
  } catch (error) {
    res.status(404).json({ msg: error.message });
  }
};

const deleteMinimumPremium = async (req, res) => {
  const id = req.params.id;
  try {
    MinimumPremium.destroy({ where: { id: id } });

    res.status(200).json({ id });
  } catch (error) {
    res.status(404).json({ msg: error.message });
  }
};

module.exports = {
  getMinimumPremiums,
  createMinimumPremium,
  getMinimumPremium,
  editMinimumPremium,
  deleteMinimumPremium,
  getMinimumPremiumsByCategory,
  getMinimumPremiumsToFire,
};
