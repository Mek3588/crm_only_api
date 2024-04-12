const { QueryTypes } = require("sequelize");
const sequelize = require("../../database/connections");
const { Role } = require("../../utils/constants");
//const { getCurrentUser, currentUser } = require("../../utils/GeneralUtils");
const Proposal = require("../../models/proposals/Proposal");
/**
 * get acl function
 * @param {*} user 
 * @param {*} path 
 * @returns 
 */
const getAcls = async (user, path) => {
  const acls = await sequelize.query(
    `select user_groups.userId, user_groups.groupId, acls.path, acls.canRead, acls.canCreate, acls.canEdit, acls.canDelete, acls.onlyMyBranch, acls.onlySelf from user_groups join acls on acls.groupId = user_groups.groupId where user_groups.userId = ${user.id} and acls.path='${path}';`,
    { type: QueryTypes.SELECT }
  );
  return acls;
};

const canUserRead = (paths) => async (req, res, next) => {
  
  const user = req.user;
  let canRead = false;
  let type = "none";
  if (user.role == Role.superAdmin) {
    type = "all";
  } else if (user.role == Role.customer) {
    type = "customer";
  } else {
    await Promise.all(
      paths.map(async (path) => {
        const acls = await getAcls(user, path);
        for (let i = 0; i < acls.length; i++) {
          if (acls[i].onlyMyBranch && acls[i].onlySelf) {
            
            type = "branchAndSelf";
            break;
          } else if (acls[i].onlyMyBranch) {
            
            
            type = "branch";
            break;
          } else if (acls[i].onlySelf) {
            
            
            type = "self";
            
            break;
          } else if (acls[i].canRead) {
            

            type = "all";
            break;
          } else {
            type = "none";
            break;
          }
        }
      })
    );
    // const acls = await getAcls(user, path);
    // 

  }

  if (
    type == "self" ||
    type == "customer" ||
    type == "all" ||
    type == "branch" ||
    type == "branchAndSelf"
  ) {
    req.type = type;
    await next();
  } else {
    res.status(401).json({ msg: "unauthorized access!" });
  }
};

const canUserCreate = (paths) => async (req, res, next) => {
  const user = req.user;
  var canCreate = false;
  if (user.role == Role.superAdmin) {
    canCreate = true;
    
  } else if (user.role == Role.customer) {
    //canEdit = true;
    req.type = "customer";
    canCreate = true;
  }
  else {
    await Promise.all(
      paths.map(async (path) => {
        const acls = await getAcls(user, path);
        for (let i = 0; i < acls.length; i++) {
          if (acls[i].canCreate) {
            canCreate = true;
            break;
          }
        }
      })
    );
  }


  if (canCreate) {
    next();
  } else {
    res.status(401).json({ msg: "unauthorized access" });
  }
};

const canUserEdit = (paths) => async (req, res, next) => {
  const user = req.user;
  let canEdit = false;
  let editPath = "";
  if (user.role == Role.superAdmin) {
    canEdit = true;
  } else if (user.role == Role.customer) {

    req.type = "customer";
    canEdit = true;
  }
  else {
    // 
    await Promise.all(
      paths.map(async (path) => {
        const acls = await getAcls(user, path);
        for (let i = 0; i < acls.length; i++) {
          if (acls[i].canEdit) {
            canEdit = true;
            editPath = path;
            break;
          }
        }
      })
    );
  }

  if (canEdit) {
    next();
  } else {
    res.status(401).json({ msg: "unauthorized access" });
  }
};

const canUserDelete = (paths) => async (req, res, next) => {
  const user = req.user;
  let canDelete = false;
  if (user.role == Role.superAdmin) {
    canDelete = true;
  } else if (user.role == Role.customer) {
    req.type = "customer";
    canDelete = true;
  }
  else {
    
    // 
    await Promise.all(
      paths.map(async (path) => {
        const acls = await getAcls(user, path);
        for (let i = 0; i < acls.length; i++) {
          if (acls[i].canDelete) {
            canDelete = true;
            break;
          }
        }
      })
    );
  }
  if (canDelete) {
    next();
  } else {
    res.status(401).json({ msg: "unauthorized access" });
  }
};

const canUserAccessOnlyBranch = (path) => async (req, res, next) => {
  const user = req.user;
  let canAccessOnlyBranch = false;
  if (user.role == Role.superAdmin) {
    return false;
  }
  
  
  const acls = await getAcls(user, path);
  for (let i = 0; i < acls.length; i++) {
    if (acls[i].onlyMyBranch) {
      canAccessOnlyBranch = true;
      break;
    }
  }
  if (canAccessOnlyBranch) {
    next();
  } else {
    res.status(401).json({ msg: "unauthorized access" });
  }
};

const canUserAccessOnlySelf = (path) => async (req, res, next) => {
  const user = req.user;
  let canAccessOnlySelf = false;
  if (user.role == Role.superAdmin) {
    canAccessOnlySelf = false;
  } else {
    
    
    const acls = await getAcls(user, path);
    
    for (let i = 0; i < acls.length; i++) {
      if (acls[i].onlySelf) {
        canAccessOnlySelf = true;
        break;
      }
    }
  }
  if (canAccessOnlySelf) {
    next();
  } else {
    res.status(401).json({ msg: "unauthorized access" });
  }
};

//what to be accessed>
const canUserAccessOnlyCustomer = (path) => async (req, res, next) => {
  const user = req.user;
  let canAccessOnlyCustomer = false;
  if (user.role == Role.superAdmin) {
    canAccessOnlyCustomer = false;
  } else {
    
    
    const acls = await getAcls(user, path);
    
    for (let i = 0; i < acls.length; i++) {
      if (acls[i].onlyCustomer) {
        canAccessOnlyCustomer = true;
        break;
      }
    }
  }
  if (canAccessOnlyCustomer) {
    next();
  } else {
    res.status(401).json({ msg: "unauthorized access" });
    
  }
};
//<
module.exports = {
  canUserRead,
  canUserCreate,
  canUserEdit,
  canUserDelete,
  canUserAccessOnlyBranch,
  canUserAccessOnlySelf,
  canUserAccessOnlyCustomer,
};
