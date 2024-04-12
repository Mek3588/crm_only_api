const FireRate = require("../../../models/fire/FireRate");
const { Op } = require("sequelize");
const FireRateCategory = require("../../../models/fire/FireRateCategory");
const FireApplicableWarranty = require("../../../models/fire/FireApplicableWarrantys");
const FireRateApplicableWarrantys = require("../../../models/fire/FireRateApplicableWarrantys");
//const { canUserCreate } = require("../../../utils/Authrizations");
const FireWarranty = require("../../../models/fire/FireWarranty");
const User = require("../../../models/acl/user");
const Employee = require("../../../models/Employee");
const FireRateWarrantyAssociation = require("../../../models/fire/FireRateWarrantyAssociation");

const getSearch = (st) => {
  return {
    [Op.or]: [
      { riskCode: { [Op.like]: `%${st}%` } },
      { occupation: { [Op.like]: `%${st}%` } },
      { rate: { [Op.like]: `%${st}%` } },
      { "$fire_rate_category.name$": { [Op.like]: `%${st}%` } }
    ],
  };
};

// const getFireRate = async (req, res) => {
//   try {
//     const { f, r, st, sc, sd } = req.query;
//     const currentUser = await User.findByPk(req.user.id, {
//       include: [Employee],
//     });
//     //req.type = "all"
//     console.log("getFireRate", req.type)

//     if (req.type == "all") {
//       const data = await FireRate.findAndCountAll({
//         include: [{model: FireApplicableWarranty, include: [FireWarranty]}, { model: FireRateCategory, as: "fire_rate_category" }],
//         offset: Number(f),
//         limit: Number(r),
//         order: [[sc || "riskCode", sd == 1 ? "ASC" : "DESC"]],
//         where: getSearch(st),
//         subQuery: false,
//       });
//       res.status(200).json(data);
//     }else if (req.type == "self"){
//       const data = await FireRate.findAndCountAll({
//         include: [{model: FireApplicableWarranty, include: [FireWarranty]}, { model: FireRateCategory, as: "fire_rate_category" }],
//         offset: Number(f),
//         limit: Number(r),
//         order: [[sc || "riskCode", sd == 1 ? "ASC" : "DESC"]],
//         where: {
//           "$fire_rate_category.userId$": currentUser.id,
//           ...getSearch(st),
//         },
//         subQuery: false,
//       });
//       res.status(200).json(data);
//     }else if (req.type == "customer"){
//       const data = await FireRate.findAndCountAll({
//         include: [{model: FireApplicableWarranty, include: [FireWarranty]}, { model: FireRateCategory, as: "fire_rate_category" }],
//         offset: Number(f),
//         limit: Number(r),
//         order: [[sc || "riskCode", sd == 1 ? "ASC" : "DESC"]],
//         where: {
//           "$fire_rate_category.userId$": currentUser.id,
//           ...getSearch(st),
//         },
//         subQuery: false,
//       });
//       res.status(200).json(data);
//     }else if (req.type == "branch"){
//       const data = await FireRate.findAndCountAll({
//         include: [{model: FireApplicableWarranty, include: [FireWarranty]}, { model: FireRateCategory, as: "fire_rate_category" }],
//         offset: Number(f),
//         limit: Number(r),
//         order: [[sc || "riskCode", sd == 1 ? "ASC" : "DESC"]],
//         where: {
//           "$fire_rate_category.branchId$": currentUser.employee.branchId,
//           ...getSearch(st),
//         },
//         subQuery: false,
//       });
//       res.status(200).json(data);
//     }else if (req.type == "branchAndSelf"){
//       const data = await FireRate.findAndCountAll({
//         include: [{model: FireApplicableWarranty, include: [FireWarranty]}, { model: FireRateCategory, as: "fire_rate_category" }],
//         offset: Number(f),
//         limit: Number(r),
//         order: [[sc || "riskCode", sd == 1 ? "ASC" : "DESC"]],
//         where: {
//           "$fire_rate_category.userId$": currentUser.id,
//           "$fire_rate_category.branchId$": currentUser.employee.branchId,
//           ...getSearch(st),
//         },
//         subQuery: false,
//       });
//       res.status(200).json(data);
//     }
//   } catch (error) {
//     res.status(400).json({ msg: error.message });
//   }
// };
const getFireRate = async (req, res) => {
  try {
    const { f, r, st, sc, sd } = req.query;
    const currentUser = await User.findByPk(req.user.id, {
      include: [Employee],
    });
    //req.type = "all"
    

    if (req.type == "all") {
      const data = await FireRate.findAndCountAll({
        include: [{model: FireApplicableWarranty, include: [FireWarranty]}, { model: FireRateCategory, as: "fire_rate_category" },
        {
          model: FireWarranty,
          as: "fire_warranties",
          through: { model: FireRateWarrantyAssociation }
        }
      ],
        offset: Number(f),
        limit: Number(r),
        order: [[sc || "riskCode", sd == 1 ? "ASC" : "DESC"]],
        where: getSearch(st),
        subQuery: false,
      });
      res.status(200).json(data);
    }else if (req.type == "self"){
      const data = await FireRate.findAndCountAll({
        include: [{model: FireApplicableWarranty, include: [FireWarranty]}, { model: FireRateCategory, as: "fire_rate_category" },
        {
          model: FireWarranty,
          as: "fire_warranties",
          through: { model: FireRateWarrantyAssociation }
        }
      ],
        offset: Number(f),
        limit: Number(r),
        order: [[sc || "riskCode", sd == 1 ? "ASC" : "DESC"]],
        where: {
          "$fire_rate_category.userId$": currentUser.id,
          ...getSearch(st),
        },
        subQuery: false,
      });
      res.status(200).json(data);
    }else if (req.type == "customer"){
      const data = await FireRate.findAndCountAll({
        include: [{model: FireApplicableWarranty, include: [FireWarranty]}, { model: FireRateCategory, as: "fire_rate_category" },
        {
          model: FireWarranty,
          as: "fire_warranties",
          through: { model: FireRateWarrantyAssociation }
        }
      ],
        offset: Number(f),
        limit: Number(r),
        order: [[sc || "riskCode", sd == 1 ? "ASC" : "DESC"]],
        where: {
          "$fire_rate_category.userId$": currentUser.id,
          ...getSearch(st),
        },
        subQuery: false,
      });
      res.status(200).json(data);
    }else if (req.type == "branch"){
      const data = await FireRate.findAndCountAll({
        include: [{model: FireApplicableWarranty, include: [FireWarranty]}, { model: FireRateCategory, as: "fire_rate_category" },
        {
          model: FireWarranty,
          as: "fire_warranties",
          through: { model: FireRateWarrantyAssociation }
        }
      ],
        offset: Number(f),
        limit: Number(r),
        order: [[sc || "riskCode", sd == 1 ? "ASC" : "DESC"]],
        where: {
          "$fire_rate_category.branchId$": currentUser.employee.branchId,
          ...getSearch(st),
        },
        subQuery: false,
      });
      res.status(200).json(data);
    }else if (req.type == "branchAndSelf"){
      const data = await FireRate.findAndCountAll({
        include: [
          {model: FireApplicableWarranty, include: [FireWarranty]}, 
          { model: FireRateCategory, as: "fire_rate_category" },
          {
            model: FireWarranty,
            as: "fire_warranties",
            through: { model: FireRateWarrantyAssociation }
          }
        ],
        offset: Number(f),
        limit: Number(r),
        order: [[sc || "riskCode", sd == 1 ? "ASC" : "DESC"]],
        where: {
          "$fire_rate_category.userId$": currentUser.id,
          "$fire_rate_category.branchId$": currentUser.employee.branchId,
          ...getSearch(st),
        },
        subQuery: false,
      });
      res.status(200).json(data);
    }
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};

const getAllFireRates = async (req, res) => {
  try {
    const data = await FireRate.findAndCountAll({
      include: [
        FireApplicableWarranty,
        { model: FireRateCategory, as: "fire_rate_category" },
        {
          model: FireWarranty,
          as: "fire_warranties",
          through: { model: FireRateWarrantyAssociation }
        }
      ],
    });
    res.status(200).json(data);
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};

const getFireRatesByCategory = async (req, res) => {
  try {
    const categoryId = req.params.categoryId;
    const data = await FireRate.findAndCountAll({
      include: [
        { model: FireWarranty, as: "fire_warranties", through: { model: FireRateWarrantyAssociation } },
        FireApplicableWarranty,
        { model: FireRateCategory, as: "fire_rate_category" }
      ],
      where: { categoryId: categoryId },
    });
    res.status(200).json(data);
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};


//posting
// const createFireRate = async (req, res) => {
//   const fireRateBody = req.body;
//   // let warrantyIds = [];
//   try {
//     // Replaced by middleware
//     // if (!(await canUserCreate(req.user, "fireRates"))) {
//     //   return res.status(401).json({ msg: "unauthorized access!" });
//     // }
//     const duplicateName = await FireRate.findAll({
//       where: { occupation: fireRateBody.occupation },
//     });
//     if (duplicateName.length > 0) {
//       res.status(400).json({ msg: "Fire rate already registered!" });
//       return;
//     }
//     const duplicateCode = await FireRate.findAll({
//       where: { riskCode: fireRateBody.riskCode },
//     });
//     if (duplicateCode.length > 0) {
//       res.status(400).json({ msg: "Fire rate risk code already used!" });
//       return;
//     }
//     const fireRate = await FireRate.create(fireRateBody).then((rate) => {
//       rate.addFire_applicable_warrantys(fireRateBody.warrantyIds, {
//         through: FireRateApplicableWarrantys,
//       });
//     });
//     res.status(200).json(fireRate);
//     console.log("addFire_applicable_fireRateBody", fireRateBody)
//     console.log("addFire_applicable_warrantys", fireRateBody)
//   } catch (error) {
//     res.status(400).json({ msg: error.message });
//   }
// };
const createFireRate = async (req, res) => {
  const fireRateBody = req.body;
  // let warrantyIds = [];
  try {
    // Replaced by middleware
    // if (!(await canUserCreate(req.user, "fireRates"))) {
    //   return res.status(401).json({ msg: "unauthorized access!" });
    // }
    const duplicateName = await FireRate.findAll({
      where: { occupation: fireRateBody.occupation },
    });
    if (duplicateName.length > 0) {
      res.status(400).json({ msg: "Fire rate already registered!" });
      return;
    }
    const duplicateCode = await FireRate.findAll({
      where: { riskCode: fireRateBody.riskCode },
    });
    if (duplicateCode.length > 0) {
      res.status(400).json({ msg: "Fire rate risk code already used!" });
      return;
    }
    const fireRate = await FireRate.create(fireRateBody);
    await fireRate.addFire_applicable_warrantys(fireRateBody.warrantyIds, {
      through: FireRateApplicableWarrantys,
    });
    await Promise.all(
      fireRateBody.fire_warranties.map(async (warranty) => {
        await FireRateWarrantyAssociation.create({
          fireRateId: fireRate.id,
          fireWarrantyId: warranty.id,
        });
      })
    );

    const createdFireRate = await FireRate.findByPk(fireRate.id, {
      include: [{
        model: FireWarranty,
        through: { model: FireRateWarrantyAssociation, }
      }]
    });
    res.status(200).json(createdFireRate);
    console.log("addFire_applicable_fireRateBody", fireRateBody)
    console.log("addFire_applicable_warrantys", fireRateBody)
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};

const createFireRates = async (req, res) => {
  const fireRateBody = req.body;
  const fireRate = [];
  try {
    fireRateBody.map(async (element) => {
      fireRate.push(await FireRate.create(element));
    });
    // const fireRate = await FireRate.create(fireRateBody);
    res.status(200).json(fireRate);
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};

const getFireRateByPk = async (req, res) => {
  try {
    const fireRate = await FireRate.findByPk(req.params.id, {
      include: [
        {
          model: FireWarranty,
          as: "fire_warranties",
          through: { model: FireRateWarrantyAssociation }
        },
        { model: FireRateCategory }
      ]
    });

    if (!fireRate) {
      return res.status(404).json({ message: "No Data Found" });
    }
    res.status(200).json(fireRate);
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};

// const editFireRate = async (req, res) => {
//   const reqBody = req.body;
//   const id = req.params.id;
//   console.log("test rate",reqBody.warranty)
//   try {

//     const duplicateName = await FireRate.findAll({
//       where: { occupation: reqBody.occupation },
//     });
//     console.log(reqBody.id);
//     if (duplicateName.length !== 0) {
//       if (duplicateName[0].id !== reqBody.id) {
//         res.status(400).json({ msg: "Fire rate already registered" });
//         return;
//       }
//     }
//     const duplicateCode = await FireRate.findAll({
//       where: { riskCode: reqBody.riskCode },
//     });
//     if (duplicateCode.length > 0) {
//       if (duplicateCode[0].id !== reqBody.id) {
//         res.status(400).json({ msg: "Fire rate already registered" });
//         return;
//       }  
//     }
//     await FireRate.update(reqBody, { where: { id: id } });
//     const fireRate = await FireRate.findByPk(id).then((rate) => {
//       rate.setFire_applicable_warrantys(reqBody.warranty, {
//         through: FireRateApplicableWarrantys,
//       });
//     });
//     res.status(200).json({ fireRate });
//     console.log("addFire_applicable_warrantys_update", {fireRate})
//   } catch (error) {
//     res.status(400).json({ msg: error.message });
//   }
// };
const editFireRate = async (req, res) => {
  const reqBody = req.body;
  const id = req.params.id;
  
  try {

    const duplicateName = await FireRate.findAll({
      where: { occupation: reqBody.occupation },
    });
    
    if (duplicateName.length !== 0) {
      if (duplicateName[0].id !== reqBody.id) {
        res.status(400).json({ msg: "Fire rate already registered" });
        return;
      }
    }
    const duplicateCode = await FireRate.findAll({
      where: { riskCode: reqBody.riskCode },
    });
    if (duplicateCode.length > 0) {
      if (duplicateCode[0].id !== reqBody.id) {
        res.status(400).json({ msg: "Fire rate already registered" });
        return;
      }  
    }
    await FireRate.update(reqBody, { where: { id: id } });
    await FireRateWarrantyAssociation.destroy({ where: { fireRateId: id } });
    await Promise.all(
      reqBody.fire_warranties.map(async (warranty) => {
        await FireRateWarrantyAssociation.create({
          fireRateId: id,
          fireWarrantyId: warranty.id,
        });
      })
    );

    const fireRate = await FireRate.findByPk(id, {
      include: [{
        model: FireWarranty,
        through: { model: FireRateWarrantyAssociation, attributes: [] }
      }]    });
    res.status(200).json({ fireRate });
    
  } catch (error) {
    console.error("Error updating fire rate:", error);
    res.status(400).json({ msg: error.message });
  }
};

const deleteFireRate = async (req, res) => {
  const id = req.params.id;

  try {
    FireRate.destroy({ where: { id: id } });

    res.status(200).json({ id });
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};

module.exports = {
  getFireRate,
  getAllFireRates,
  getFireRatesByCategory,
  createFireRate,
  createFireRates,
  getFireRateByPk,
  editFireRate,
  deleteFireRate,
};
