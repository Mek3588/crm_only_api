const sequelize = require("../../../database/connections");
const Group = require("../../../models/acl/Group");
const User = require("../../../models/acl/user");
const UserGroup = require("../../../models/acl/UserGroup");
const Employee = require("../../../models/Employee");
const { QueryTypes, Op } = require("sequelize");
const ACL = require("../../../models/acl/ACL");
const getSearch = (st) => {
  return {
    [Op.or]: [{ name: { [Op.like]: `%${st}%` } }],
  };
};
const getGroup = async (req, res) => {
  const { f, r, st, sc, sd } = req.query;
  try {
    const data = await Group.findAndCountAll({
      include: { model: ACL, as: "acls" },
      offset: Number(f),
      limit: Number(r),
      order: [[sc || "createdAT", sd == 1 ? "DESC" : "ASC"]],
      where: getSearch(st),
    });

    const count = await Group.count();
    res.status(200).json({ rows: data.rows, count });
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};

//posting
const createGroup = async (req, res) => {
  const groupBody = req.body;
  
  try {
    const newGroup = {
      name: groupBody.name,
      description: groupBody.description,
    };
    let groupByName = await Group.findAll({ where: { name: groupBody.name } });
    if (groupByName.length > 0) {
      res.status(400).json({ msg: "Group name already used" });
      return;
    }
    const createdGroup = await Group.create(newGroup);
    if (createdGroup) {
      const { privilages } = groupBody;
      const newAcls = privilages.map((privilage) => {
        const {
          canRead,
          canCreate,
          canEdit,
          canDelete,
          onlyMyBranch,
          onlySelf,
        } = privilage;
        const newAcl = {
          groupId: createdGroup.id,
          path: privilage.path,
          canRead,
          canCreate,
          canEdit,
          canDelete,
          onlyMyBranch,
          onlySelf,
        };
        return newAcl;
      });
      
      const acl = await ACL.bulkCreate(newAcls);
    }
    res.status(200).json(createdGroup);
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};

const editGroup = async (req, res) => {
  
  const tempNotification = req.body;
  const id = req.body.id;

  try {
    const { name, description } = req.body;
    const updated = await Group.update(
      { name, description },
      { where: { id: id } }
    );
    if (updated) {
      const { privilages } = req.body;
      const newAcls = privilages.map((privilage) => {
        const {
          canRead,
          canCreate,
          canEdit,
          canDelete,
          onlyMyBranch,
          onlySelf,
        } = privilage;
        const newAcl = {
          groupId: req.body.id,
          path: privilage.path,
          canRead,
          canCreate,
          canEdit,
          canDelete,
          onlyMyBranch,
          onlySelf,
        };
        return newAcl;
      });
      
      await ACL.destroy({ where: { groupId: id } });
      const acl = await ACL.bulkCreate(newAcls);
    }
    res.status(200).json({ id });
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};

const createUserGroup = async (req, res) => {
  const groupBody = req.body;
  
  try {
    const group = await Group.findByPk(groupBody.groupId);
    await group.addUsers(groupBody.users, { through: UserGroup });
    res.status(200).json(group);
  } catch (error) {
    
    res.status(400).json({ msg: error.message });
  }
};

const removeUserGroup = async (req, res) => {
  const groupBody = req.params.id;
  try {
    UserGroup.destroy({ where: { id: groupBody } });

    res.status(200).json(groupBody);
  } catch (error) {
    
    
    res.status(400).json({ msg: error.message });
  }
};

const getUserGroupByPk = async (req, res) => {
  const groupId = req.params.id;
  try {
    // const data = await sequelize.query(
    //   `select employeeId, e.id as empId, u.id as userId, g.id as userGroupId,  e.gender, e.first_name, e.father_name, e.position, e.grandfather_name, e.email, e.phone, u.activated  from crm.employees e Inner join crm.users u on e.userId = u.id  Inner join crm.user_groups g on  g.userId = u.id where g.groupId = ${groupId}`,
    //   { type: QueryTypes.SELECT }
    // );
    const [userGroupData] = await sequelize.query(
      `select user_groups.id as userGroupId, users.first_name, users.middle_name, users.last_name, users.role, users.gender, users.activated from users join user_groups on users.id=user_groups.userId where user_groups.groupId=${groupId}`
    );
    res.status(200).json(userGroupData);
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};

const getGroupByPk = async (req, res) => {
  try {
    const group = await Group.findByPk(req.params.id, {
      include: [{ model: User }, Employee, ACL],
    }).then(function (group) {
      if (!group) {
        res.status(404).json({ message: "No Data Found" });
      }
      res.status(200).json(group);
    });
    
    res.status(200).json(group);
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};

const deleteGroup = async (req, res) => {
  const id = req.params.id;

  try {
    const userGroup = await UserGroup.findOne({ where: { groupId: id } });
    
    if (userGroup) {
      return res.status(400).json({ msg: "Cannot delete assigned groups" });
    }
    await Group.destroy({ where: { id: id } });
    await ACL.destroy({ where: { groupId: id } });

    res.status(200).json({ id });
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};

module.exports = {
  getGroup,
  createGroup,
  getGroupByPk,
  editGroup,
  deleteGroup,
  createUserGroup,
  getUserGroupByPk,
  removeUserGroup,
};
