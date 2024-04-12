const { Op } = require("sequelize");
const CoverRate = require("../../models/CoverRate");
const VehicleCategory = require("../../models/motor/VehicleCategory");
const { MotorCoverType, Role } = require("../../utils/constants");
const User = require("../../models/acl/user");
const Employee = require("../../models/Employee");

const getSearch = (st) => {
  return {
    [Op.or]: [
      {
        coverType: {
          [Op.like]: "%" + st + "%",
        },
      },
      {
        description: {
          [Op.like]: "%" + st + "%",
        },
      },
    ],
  };
};

// const getCoverRate = async (req, res) => {
//   try {
//     const { f, r, st, sc, sd, type } = req.query;
//     let prerequisite = req.query.prerequisite;

//     
//     
//     if(!prerequisite){
      
//     }


//     let condition = {};

//     if(prerequisite == MotorCoverType.comprehensive){
//       prerequisite = MotorCoverType.ownDamage;
//     }

//     const prerequisiteCoverType = await CoverRate.findOne({
//       where: { flag: prerequisite },
//     });

//     

//     let tpprerequisiteId;
//     let tpprerequisiteCoverType;
//     let comprehensivePrerequisiteId;
//     let comprehensivePrerequisiteCoverType;
//     let odPrerequisiteId;
//     let odPrerequisiteCoverType;
    
//     if (type == "Main") {
//       tpprerequisiteCoverType = await CoverRate.findOne({
//         where: { flag: MotorCoverType.thirdParty },
//       });

//       if (tpprerequisiteCoverType) {
//         tpprerequisiteId = tpprerequisiteCoverType.id;
//         
//       }
//     }


//     // Comprehensive is the prerequisite of third party and own damage
//     if(type == "Main" ) {
//       odPrerequisiteCoverType = await CoverRate.findOne({
//         where: { flag: MotorCoverType.ownDamage },
//       });

//       if(odPrerequisiteCoverType) {
//         odPrerequisiteId = odPrerequisiteCoverType.id;
//         
//       }
//     }


//     
//     let prerequisiteId = 0;
//     let includedCoverTypes = [];
//     let addonCoverTypes = [];


//     if (prerequisiteCoverType) {
//       prerequisiteId = prerequisiteCoverType.id;

//       includedCoverTypes = await CoverRate.findAll({
//         where: { prerequisites: prerequisiteId },
//       });
//       
//     }





//     let prerequisiteIds

//     // if the type is main, OD is added to the prerequisiteIds


//     if (prerequisiteCoverType === MotorCoverType.comprehensive) {
//       // Identify own damage addons from includedCoverTypes
//       const ownDamageAddons = includedCoverTypes.filter(
//         (coverType) => coverType === MotorCoverType.ownDamage
//       );
    
//       // Add own damage addon IDs to prerequisiteIds
//       prerequisiteIds.push(...ownDamageAddons.map((addon) => addon.id));
//     }


//     // this is added because third party limit extension can also be given individually. (fire, theft and fire & theft)
//     if (type == "Main") {
//       prerequisiteIds = [prerequisiteId, tpprerequisiteId];

//     } 
//     else {
//       prerequisiteIds = [prerequisiteId];
//     }

//     const inclusiveCovers = includedCoverTypes.map(
//       (includedCoverType) => includedCoverType.dataValues.id
//     );

//     
//     prerequisiteIds.push([...inclusiveCovers]);
//     

//     type == "Main"
//       ?
//       (condition.prerequisites = { [Op.in]: prerequisiteIds })

//       //  (condition.prerequisites = 0)
//       : type == "AddOn" &&
//       (condition.prerequisites = { [Op.in]: prerequisiteIds });

//     const data = await CoverRate.findAndCountAll({
//       include: [
//         {
//           model: CoverRate,
//           as: "includedIn",
//         },
//         {
//           model: CoverRate,
//           as: "prerequisite",
//         },
//       ],
//       offset: Number(f),
//       limit: Number(r),
//       order: sc
//         ? [[sc, sd == 1 ? "ASC" : "DESC"]]
//         : [["createdAt", sd == 1 ? "DESC" : "ASC"]],
//       where: { ...getSearch(st), ...condition },
//     });
//     res.status(200).json(data);
//   } catch (error) {
//     
//     res.status(400).json({ msg: error.message });
//   }
// };

const getCoverRate = async (req, res) => {
  
  try {
    const { f, r, st, sc, sd, type } = req.query;
    let prerequisite = req.query.prerequisite;
    const currentUser = await User.findByPk(req.user.id, {
      include: [Employee],
    });

    
    
    if(!prerequisite){
      
    }


    let condition = {};

    if(prerequisite == MotorCoverType.comprehensive){
      prerequisite = MotorCoverType.ownDamage;
    }

    const prerequisiteCoverType = await CoverRate.findOne({
      where: { flag: prerequisite },
    });

    

    let tpprerequisiteId;
    let tpprerequisiteCoverType;
    let comprehensivePrerequisiteId;
    let comprehensivePrerequisiteCoverType;
    let odPrerequisiteId;
    let odPrerequisiteCoverType;
    
    if (type == "Main") {
      tpprerequisiteCoverType = await CoverRate.findOne({
        where: { flag: MotorCoverType.thirdParty },
      });

      if (tpprerequisiteCoverType) {
        tpprerequisiteId = tpprerequisiteCoverType.id;
        
      }
    }


    // Comprehensive is the prerequisite of third party and own damage
    if(type == "Main" ) {
      odPrerequisiteCoverType = await CoverRate.findOne({
        where: { flag: MotorCoverType.ownDamage },
      });

      if(odPrerequisiteCoverType) {
        odPrerequisiteId = odPrerequisiteCoverType.id;
        
      }
    }


    
    let prerequisiteId = 0;
    let includedCoverTypes = [];
    let addonCoverTypes = [];


    if (prerequisiteCoverType) {
      prerequisiteId = prerequisiteCoverType.id;

      includedCoverTypes = await CoverRate.findAll({
        where: { prerequisites: prerequisiteId },
      });
      
    }





    let prerequisiteIds

    // if the type is main, OD is added to the prerequisiteIds


    if (prerequisiteCoverType === MotorCoverType.comprehensive) {
      // Identify own damage addons from includedCoverTypes
      const ownDamageAddons = includedCoverTypes.filter(
        (coverType) => coverType === MotorCoverType.ownDamage
      );
    
      // Add own damage addon IDs to prerequisiteIds
      prerequisiteIds.push(...ownDamageAddons.map((addon) => addon.id));
    }


    // this is added because third party limit extension can also be given individually. (fire, theft and fire & theft)
    if (type == "Main") {
      prerequisiteIds = [prerequisiteId, tpprerequisiteId];

    } 
    else {
      prerequisiteIds = [prerequisiteId];
    }

    const inclusiveCovers = includedCoverTypes.map(
      (includedCoverType) => includedCoverType.dataValues.id
    );

    
    prerequisiteIds.push([...inclusiveCovers]);
    

    type == "Main"
      ?
      (condition.prerequisites = { [Op.in]: prerequisiteIds })

      //  (condition.prerequisites = 0)
      : type == "AddOn" &&
      (condition.prerequisites = { [Op.in]: prerequisiteIds });

    //req.type = "branch"
    
    

    if (req.type == "all") {
      
      const data = await CoverRate.findAndCountAll({
        include: [
          {
            model: CoverRate,
            as: "includedIn",
          },
          {
            model: CoverRate,
            as: "prerequisite",
          },
        ],
        offset: Number(f),
        limit: Number(r),
        order: sc
          ? [[sc, sd == 1 ? "DESC" : "ASC"]]
          : [["createdAt", sd == 1 ? "DESC" : "ASC"]],
        where: { ...getSearch(st), ...condition },
      });
    
      const reversedRows = data.rows.reverse();
  
      res.status(200).json(data);
    }
    else if (req.type == "self"){
      const data = await CoverRate.findAndCountAll({
        include: [
          {
            model: CoverRate,
            as: "includedIn",
          },
          {
            model: CoverRate,
            as: "prerequisite",
          },
        ],
        offset: Number(f),
        limit: Number(r),
        order: sc
          ? [[sc, sd == 1 ? "ASC" : "DESC"]]
          : [["createdAt", sd == 1 ? "DESC" : "ASC"]],
        where: {userId: currentUser.id,
         ...getSearch(st), ...condition}
      });
      res.status(200).json(data);
    }else if (req.type == "customer"){
      const data = await CoverRate.findAndCountAll({
        include: [
          {
            model: CoverRate,
            as: "includedIn",
          },
          {
            model: CoverRate,
            as: "prerequisite",
          },
        ],
        offset: Number(f),
        limit: Number(r),
        order: sc
          ? [[sc, sd == 1 ? "DESC" : "ASC"]]
          : [["createdAt", sd == 1 ? "DESC" : "ASC"]],
        where: { 
          // userId: currentUser.id, 
        ...getSearch(st), ...condition,}
      });
      res.status(200).json(data);
    }else if (req.type == "branch"){
      const data = await CoverRate.findAndCountAll({
        include: [
          {
            model: CoverRate,
            as: "includedIn",
          },
          {
            model: CoverRate,
            as: "prerequisite",
          },
          {
            model: User,
            as: 'user',
            include: [Employee],
          },
        ],
        offset: Number(f),
        limit: Number(r),
        order: sc
          ? [[sc, sd == 1 ? "ASC" : "DESC"]]
          : [["createdAt", sd == 1 ? "DESC" : "ASC"]],
        where: {
          "$user.employee.branchId$": currentUser.employee.branchId, 
          ...getSearch(st), 
          ...condition
        }
      });
      res.status(200).json(data);
    }else if (req.type == "branchAndSelf"){
      const data = await CoverRate.findAndCountAll({
        include: [
          {
            model: CoverRate,
            as: "includedIn",
          },
          {
            model: CoverRate,
            as: "prerequisite",
          },
          {
            model: User,
            as: 'user',
            include: [Employee],
          },
        ],
        offset: Number(f),
        limit: Number(r),
        order: sc
          ? [[sc, sd == 1 ? "ASC" : "DESC"]]
          : [["createdAt", sd == 1 ? "DESC" : "ASC"]],
        where: {
            userId: currentUser.id,
            "$user.employee.branchId$": currentUser.employee.branchId,
            ...getSearch(st),
            ...condition,
        }
      });

      res.status(200).json(data);
    }
      
    
  } catch (error) {
    
    res.status(400).json({ msg: error.message });
  }
};

//posting
const createCoverRate = async (req, res) => {
  const dataBody = req.body;
  const userId = req.user.id;
  const currentUser = await User.findByPk(userId, {
    include: [Employee],
  });
  
  dataBody.userId = userId;
  
  if(currentUser.employee){
    dataBody.branchId = currentUser.employee.branchId;
  }
  
  
  try {
    const coverRate = await CoverRate.create(dataBody);
    res.status(200).json(coverRate);
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};

const getCoverRateByPk = async (req, res) => {
  const params = req.params.id;
  try {
    const data = await CoverRate.findByPk(params, {
      include: [
        {
          model: CoverRate,
          as: "includedIn",
        },
        {
          model: CoverRate,
          as: "prerequisite",
        },
      ],
    });
    if (!data) {
      return res.status(400).json({ message: "No Data Found" });
    } else {
      res.status(200).json(data);
    }
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};

const editCoverRate = async (req, res) => {
  const body = req.body;
  const id = req.body.id;

  try {
    CoverRate.update(body, { where: { id: id } });
    res.status(200).json({ id });
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};

const deleteCoverRate = async (req, res) => {
  const id = req.params.id;

  try {
    CoverRate.destroy({ where: { id: id } });

    res.status(200).json({ id });
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};

module.exports = {
  getCoverRate,
  createCoverRate,
  getCoverRateByPk,
  editCoverRate,
  deleteCoverRate,
};
