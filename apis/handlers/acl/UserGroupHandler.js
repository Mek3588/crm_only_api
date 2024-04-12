const UserGroup  = require("../../../models/acl/UserGroup");
const  Group  = require("../../../models/acl/Group");
const getUserGroup = async (req, res) => {
  try {
    User
    const data = await UserGroup.findAll({ raw: true });
    res.status(200).json(data);
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};

const getUserGroupByPk = async (req, res) => {
    const id = req.params.id
    try {
      const data = await UserGroup.findByPk(id)
        res.status(200).json(data);
    
    }
    catch (error) {
        res.status(400).json({ msg: error.message });
    }
}

const createUserGroup = async (req, res) => {
  const groupBody = req.body;
  try {
    const data = await UserGroup.create(groupBody);
    
    res.status(200).json(data);
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};



const deleteUserGroup = async (req, res) => {
  const id = req.params.id;

  try {
    UserGroup.destroy({ where: { id: id } });
    res.status(200).json({ id });
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};

const editUserGroup = async (req, res) => {
  const body = req.body;
  const id = req.body.id 
  try {
    
    let userGroup = await UserGroup.findAll({ where: { id: id } });
    if (userGroup.length < 0) {
      res.status(400).json({ msg: " Not found" });
      return;
    }
    UserGroup.update(body,{ where: { id: id } }
    );
    res.status(200).json({ id });
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};

module.exports = {
  getUserGroup,
  createUserGroup,
  getUserGroupByPk,
  editUserGroup,
  deleteUserGroup,
};



