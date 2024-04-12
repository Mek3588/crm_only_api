const { QueryTypes } = require("sequelize");
const sequelize = require("../database/connections");
const { Role } = require("./constants");

const getAcls = async (user, path) => {
  const acls = await sequelize.query(
    `select user_groups.userId, user_groups.groupId, acls.path, acls.canRead, acls.canCreate, acls.canEdit, acls.canDelete, acls.onlyMyBranch, acls.onlySelf from user_groups join acls on acls.groupId = user_groups.groupId where user_groups.userId = ${user.id} and acls.path='${path}';`,
    { type: QueryTypes.SELECT }
  );
  return acls;
};

const canUserRead = async (user, path) => {
  // 
  if (user.role == Role.superAdmin) return true;
  // if (user.role == Role.customer) return false;
  let canRead = false;
  
  
  const acls = await getAcls(user, path);
  for (let i = 0; i < acls.length; i++) {
    if (acls[i].canRead) {
      canRead = true;
      break;
    }
  }
  

  return canRead;
};

const canUserCreate = async (user, path) => {
  
  if (user.role == Role.superAdmin || user.role == Role.customer) return true;
  let canCreate = false;
  
  
  const acls = await getAcls(user, path);
  for (let i = 0; i < acls.length; i++) {
    if (acls[i].canCreate) {
      canCreate = true;
      break;
    }
  }
  return canCreate;
};

const canUserEdit = async (user, path) => {
  if (user.role == Role.superAdmin || user.role == Role.customer) return true;
  let canEdit = false;
  
  
  const acls = await getAcls(user, path);
  for (let i = 0; i < acls.length; i++) {
    if (acls[i].canEdit) {
      canEdit = true;
      break;
    }
  }
  return canEdit;
};
const canUserDelete = async (user, path) => {
  if (user.role == Role.superAdmin || user.role == Role.customer) return true;
  let canDelete = false;
  
  
  const acls = await getAcls(user, path);
  for (let i = 0; i < acls.length; i++) {
    if (acls[i].canDelete) {
      canDelete = true;
      break;
    }
  }
  return canDelete;
};
const canUserAccessOnlyBranch = async (user, path) => {
  if (user.role == Role.superAdmin || user.role == Role.customer) return false;
  let canAccessOnlyBranch = false;
  
  
  const acls = await getAcls(user, path);
  for (let i = 0; i < acls.length; i++) {
    if (acls[i].onlyMyBranch) {
      canAccessOnlyBranch = true;
      break;
    }
  }
  return canAccessOnlyBranch;
};
const canUserAccessOnlySelf = async (user, path) => {
  if (user.role == Role.superAdmin || user.role == Role.customer) return false;
  let canAccessOnlySelf = false;
  
  
  const acls = await getAcls(user, path);
  
  for (let i = 0; i < acls.length; i++) {
    if (acls[i].onlySelf) {
      canAccessOnlySelf = true;
      break;
    }
  }
  
  return canAccessOnlySelf;
};

module.exports = {
  canUserRead,
  canUserCreate,
  canUserEdit,
  canUserDelete,
  canUserAccessOnlyBranch,
  canUserAccessOnlySelf,
  getAcls,
};
