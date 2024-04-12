const AgeLoad = require("../../models/AgeLoad");
const User = require("../../models/acl/user");
const Employee = require("../../models/Employee");
const { Op } = require("sequelize");
const { currentUser } = require("../../utils/GeneralUtils");

const getAgeLoades = async (req, res) => {
  const currentUser = await User.findByPk(req.user.id, {
    include: [Employee],
  });

  //req.type="self"
  try {
    if (req.type == "all") {
      const data = await AgeLoad.findAll({ raw: true });
      res.status(200).json(data);
    }else if (req.type == "self"){
      const data = await AgeLoad.findAll({ 
        raw: true,
        where: {userId : currentUser.id}
       });
      res.status(200).json(data);
    }else if (req.type == "customer"){
      const data = await AgeLoad.findAll({ 
        raw: true,
        where: {
          // userId : currentUser.id
        }
       });
      res.status(200).json(data);
    }else if (req.type == "branch"){
      const data = await AgeLoad.findAll({ 
        raw: true,
        include: {
          model: User, as: 'user',
          include: [Employee],
        },
        where: {"$user.employee.branchId$": currentUser.employee.branchId,}
       });
      res.status(200).json(data);
    }else if (req.type == "branchAndSelf"){
      const data = await AgeLoad.findAll({ 
        raw: true,
        include: {
          model: User, as: 'user',
          include: [Employee],
        },
        where: {
          userId : currentUser.id,
          "$user.employee.branchId$": currentUser.employee.branchId,
        }
      })
      res.status(200).json(data);
    }
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};

//posting
const createAgeLoad = async (req, res) => {
  const { made_of, min_age, max_age, load_rate  } =
    req.body;
  try {
    const ageLoad = await AgeLoad.create({
      made_of,
      min_age,
      max_age,
      load_rate
    });
    res.status(200).json(ageLoad);
  } catch (error) {
    res.status(404).json({ msg: error.message });
  }
};

const getAgeLoad = async (req, res) => {
  try {
    const ageLoad = await AgeLoad.findByPk(req.params.id).then(function (ageLoad) {
      if (!ageLoad) {
        res.status(404).json({ message: "No Data Found" });
      }
      res.status(200).json(ageLoad);
    });

    res.status(200).json(ageLoad);
  } catch (error) {
    res.status(404).json({ msg: error.message });
  }
};

const editAgeLoad = async (req, res) => {
  const { id, made_of, min_age, max_age, load_rate } =
    req.body;

  try {
    AgeLoad.update(
      {
        made_of,
        min_age,
        max_age,
        load_rate
      },

      { where: { id: id } }
    );

    res.status(200).json({ id });
  } catch (error) {
    res.status(404).json({ msg: error.message });
  }
};

const deleteAgeLoad = async (req, res) => {
  const  id  = req.params.id;
  try {
    AgeLoad.destroy({ where: { id: id } });

    res.status(200).json({ id });
  } catch (error) {
    res.status(404).json({ msg: error.message });
  }
};

module.exports = {
  getAgeLoad,
  createAgeLoad,
  getAgeLoades,
  editAgeLoad,
  deleteAgeLoad,
};
