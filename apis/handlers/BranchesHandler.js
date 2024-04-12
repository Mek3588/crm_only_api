const { Sequelize, Op } = require("sequelize");
const Branch = require("../../models/Branch");
const CampaignTeam = require("../../models/CampaignTeam");
const ContactBranch = require("../../models/ContactBranch");
const Employee = require("../../models/Employee");
const { isPhoneNoValid } = require("../../utils/GeneralUtils");
const { sendNewSms } = require("./SMSServiceHandler");
const SMSMessage = require("../../models/SMS");
const { eventResourceTypes, eventActions } = require("../../utils/constants");
const {
  isEmailValid,
  getFileExtension,
  createEventLog,
  getChangedFieldValues,
  getIpAddress,
} = require("../../utils/GeneralUtils");

// const {
//   canUserRead,
//   canUserCreate,
//   canUserEdit,
//   canUserDelete,
//   canUserAccessOnlySelf,
//   canUserAccessOnlyBranch,
// } = require("../../utils/Authrizations");
const BranchSMS = require("../../models/BranchSMS");

const getBranches = async (req, res) => {
  try {
    const { f, r, st, sc, sd } = req.query;
    

    const data = await Branch.findAndCountAll({
      raw: true,
      offset: Number(f),
      limit: Number(r),
      order: [[sc || "branch_code", sd == 1 ? "ASC" : "DESC"]],
      where: getSearch(st),
    });
    res.status(200).json(data);
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};

const getAllBranches = async (req, res) => {
  try {
    const data = await Branch.findAndCountAll({});
    res.status(200).json(data);
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};

const getActiveBranches = async (req, res) => {
  try {
    const { f, r, st, sc, sd } = req.query;
    
    const data = await Branch.findAndCountAll({
      raw: true,
      offset: Number(f),
      limit: Number(r),
      order: [[sc || "branch_code", sd == 1 ? "ASC" : "DESC"]],
      where: {
        [Op.and]: [
          {
            isBranchActive: true,
          },
          getSearch(st),
        ],
      },
    });
    res.status(200).json(data);
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};

const getSearch = (st) => {
  return {
    [Op.or]: [
      {
        name: {
          [Op.like]: "%" + st + "%",
        },
      },
      {
        branch_code: {
          [Op.like]: "%" + st + "%",
        },
      },
      {
        contact_person: {
          [Op.like]: "%" + st + "%",
        },
      },
      {
        office_phone: {
          [Op.like]: st + "%",
        },
      },
      {
        email: {
          [Op.like]: "%" + st + "%",
        },
      },
      {
        country: {
          [Op.like]: "%" + st + "%",
        },
      },
      {
        state: {
          [Op.like]: "%" + st + "%",
        },
      },
      {
        city: {
          [Op.like]: "%" + st + "%",
        },
      },
    ],
  };
};

const getSortedBranches = async (req, res) => {
  const currentLatitude = req.query.latitude;
  const currentLongtude = req.query.longtude;
  const latToKilloMeter = 110.567;
  const longtoKillometer = 111.321;
  const sortedBranches = [];
  // 
  //   "the current latitude and longtude are ",
  //   currentLatitude,
  //   ", ",
  //   currentLongtude
  // );

  try {
    const data = await Branch.findAll({ raw: true });
    data.forEach((branch) => {
      // const locationUrl = branch.location.split(",");

      var latitude = branch.latitude;
      var longitude = branch.longitude;
      // 
      // var splitUrl = locationUrl.split('!3d');
      // 
      // var latLong = splitUrl[splitUrl.length - 1].split('!4d');
      // 
      // var longitude;
      // if (latLong.indexOf('?')!== -1){
      //   longitude = latLong[1].split('\\?')[0]
      // }
      // else {
      //   longitude = latLong[1];
      // }
      // 
      // var latitude = latLong[0];

      let latDistance = Math.abs(latitude - currentLatitude) * latToKilloMeter;
      let longDistance =
        Math.abs(longitude - currentLongtude) * longtoKillometer;
      let distance = Math.sqrt(
        Math.pow(latDistance, 2) + Math.pow(longDistance, 2)
      );
      // 
      const branchToBeSorted = {
        id: branch.id,
        name: branch.name,
        distance: Math.round(distance * 100) / 100,
      };
      let brnachINserted = false;
      for (let index = 0; index < sortedBranches.length; index++) {
        const sortedBranch = sortedBranches[index];
        if (sortedBranch) {
          if (branchToBeSorted.distance < sortedBranch.distance) {
            sortedBranches.splice(index, 0, branchToBeSorted);
            brnachINserted = true;
            break;
          }
        }
      }
      if (!brnachINserted) {
        sortedBranches.push(branchToBeSorted);
      }
    });

    res.status(200).json(sortedBranches);
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};

//posting
const createBranch = async (req, res) => {
  const reqBody = req.body;
  try {
    // if (!(await canUserCreate(req.user, "branches"))) {
    //   return res.status(401).json({ msg: "unauthorized access!" });
    // }
    if (!isPhoneNoValid(reqBody.contact_person)) {
      res.status(400).json({ msg: "Invalid phone number" });
      return;
    }
    const duplicateCode = await Branch.findAll({
      where: { branch_code: reqBody.branch_code },
    });

    if (duplicateCode.length !== 0) {
      
      res.status(400).json({ msg: "Branch short code already used!" });
      return;
    }
    const duplicateShortCode = await Branch.findAll({
      where: { short_code: reqBody.short_code },
    });

    if (duplicateShortCode.length !== 0) {
      res.status(400).json({ msg: "Branch short code already used!" });
      return;
    }
    const branch = await Branch.create(reqBody);
    if (branch) {
      let ipAddress = getIpAddress(req.ip);
      const eventLog = await createEventLog(
        req.user.id,
        eventResourceTypes.branch,
        `${branch.name} - ${branch.code} `,
        branch.id,
        eventActions.create,
        "",
        ipAddress
      );
    }

    res.status(200).json(branch);
  } catch (error) {
    res.status(404).json({ msg: error.message });
  }
};

const createBranches = async (req, res) => {
  const reqBody = req.body;
  var addedBranchesList = 0;
  var duplicate = [];
  var incorrect = [];
  var lineNumber = 2;
  try {
    // if (!(await canUserCreate(req.user, "branches"))) {
    //   return res.status(401).json({ msg: "unauthorized access!" });
    // }
    var promises = await reqBody.map(async (branch) => {
      var contact_person = branch.contact_person;
      var branch_code = branch.branch_code;
      var short_code = branch.short_code;
      let addedCotacts = await Branch.findOne({
        where: { contact_person },
      });
      let addedBranchCodes = await Branch.findOne({
        where: { branch_code },
      });
      let addedShortCodes = await Branch.findOne({
        where: { branch_code },
      });
      if (!addedCotacts && !addedBranchCodes && !addedBranchCodes) {
        try {
          await Branch.create(branch);
          addedBranchesList += 1;
        } catch (error) {
          incorrect.push(lineNumber);
        }
      } else {
        duplicate.push(lineNumber);
      }
      lineNumber = lineNumber + 1;
    });
    Promise.all(promises).then(function (results) {
      let msg = "";
      if (addedBranchesList != 0) {
        msg = msg + `${addedBranchesList} branches added`;
      }
      if (incorrect.length != 0) {
        msg = msg + ` line ${incorrect} has incorrect values \n`;
      }
      if (duplicate != 0) {
        msg = msg + ` duplicate value found on line ${duplicate} \n`;
      }
      if (duplicate != 0 || incorrect != 0) {
        res.status(400).json({ msg: msg });
      } else {
        res.status(200).json({ msg: msg });
      }
    });
    // res.status(200).json(reqBody);
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};

const getBranch = async (req, res) => {
  try {
    
    let temp = req.params.id;
    if (temp.length > 1) {
      let temp2 = temp.split(",");
      
      
      const branch = await Branch.findAll({
        where: { id: { [Op.in]: temp2 } },
      }).then(function (branch) {
        
        if (!branch) {
          res.status(404).json({ message: "No Data Found" });
        } else {
          // 

          res.status(200).json(branch);
        }
      });
    } else {
      const branch = await Branch.findByPk(req.params.id).then(async function (
        branch
      ) {
        
        if (!branch) {
          res.status(404).json({ message: "No Data Found" });
        } else {
          let ipAddress = getIpAddress(req.ip);
          const eventLog = await createEventLog(
            req.user.id,
            eventResourceTypes.branch,
            `${branch.name} - ${branch.code} `,
            branch.id,
            eventActions.view,
            "",
            ipAddress
          );
          res.status(200).json(branch);
        }
      });
    }

    // res.status(200).json(branch);
  } catch (error) {
    
    res.status(404).json({ msg: error.message });
  }
};

const editBranch = async (req, res) => {
  const { id, contact_person } = req.body;
  const reqBody = req.body;
  try {
    // if (!(await canUserEdit(req.user, "branches"))) {
    //   return res.status(401).json({ msg: "unauthorized access!" });
    // }
    if (!isPhoneNoValid(contact_person)) {
      res.status(400).json({ msg: "Invalid phone number" });
      return;
    }
    const duplicateCode = await Branch.findAll({
      where: { branch_code: reqBody.branch_code },
    });
    if (duplicateCode.length !== 0) {
      if (duplicateCode[0].id !== reqBody.id) {
        res.status(400).json({ msg: "Branch code already used!" });
        return;
      }
    }

    const duplicateShortCode = await Branch.findAll({
      where: { short_code: reqBody.short_code },
    });

    if (duplicateShortCode.length !== 0) {
      if (duplicateShortCode[0].id !== reqBody.id) {
        res.status(400).json({ msg: "Branch short code already used!" });
        return;
      }
    }

    let oldBranch = await Branch.findByPk(id, {});
    

    let bran = await Branch.update(reqBody, { where: { id: id } });

    if (bran) {
      let newBranch = await Branch.findByPk(id, {});
      let changedFieldValues = getChangedFieldValues(oldBranch, newBranch);
      let ipAddress = getIpAddress(req.ip);
      
      const eventLog = await createEventLog(
        req.user.id,
        eventResourceTypes.branch,
        `${oldBranch.name} - ${oldBranch.branch_code} `,
        newBranch.id,
        eventActions.edit,
        changedFieldValues,
        ipAddress
      );
    }

    res.status(200).json({ id });
  } catch (error) {
    
    res.status(404).json({ msg: error.message });
  }
};

const deleteBranch = async (req, res) => {
  const id = req.params.id;
  try {
    // if (!(await canUserDelete(req.user, "branches"))) {
    //   return res.status(401).json({ msg: "unauthorized access!" });
    // }
    let contacts = await ContactBranch.findAll({ where: { branchId: id } });
    let employees = await Employee.findAll({ where: { branchId: id } });
    if (contacts.length > 0) {
      res.status(400).json({ msg: "Branch is in use by Contacts" });
      return;
    }
    if (employees.length > 0) {
      res.status(400).json({ msg: "Branch is in use by employees" });
      return;
    }
    let branch = await Branch.findByPk(id);
    let ipAddress = getIpAddress(req.ip);
    const eventLog = await createEventLog(
      req.user.id,
      eventResourceTypes.branch,
      `${branch.name} - ${branch.code} `,
      branch.id,
      eventActions.delete,
      "",
      ipAddress
    );
    Branch.destroy({ where: { id: id } });
    res.status(200).json({ id });
  } catch (error) {
    res.status(404).json({ msg: error.message });
  }
};

const handleActivation = async (req, res) => {
  try {
    // if (!(await canUserEdit(req.user, "branches"))) {
    //   return res.status(400).json({ msg: "nauthrized access!" });
    // }
    const br = await Branch.findByPk(req.params.id);
    const branch = await Branch.update(
      { isBranchActive: !br.isBranchActive },
      { where: { id: req.params.id } }
    );
    res.status(200).json(branch);
  } catch (error) {
    
    res.status(400).json({ msg: error.message });
  }
};

const sendSMS = async (req, res) => {
  const body = req.body;
  try {
    const branch = await Branch.findAll({
      where: { id: { [Op.in]: [body.branches] } },
    });
    const sendTo = [];
    if (branch) {
      branch.map((e) => {
        if (body.phoneType.length == 0) {
          sendTo.push(e.contact_person);
        }
        if (body.phoneType.find((element) => element == "contact_person")) {
          sendTo.push(e.contact_person);
        }
        if (body.phoneType.find((element) => element == "contact_person2")) {
          sendTo.push(e.contact_person2);
        }
      });
      return await sendNewSms(sendTo, body.content).then((sent) => {
        if (sent.status == 200) {
          try {
            const sms = SMSMessage.create(body).then((sms) => {
              sms.addBranches(body.branches, { through: BranchSMS });
              return res.status(200).json(sms);
            });
          } catch (error) {
            
            res.status(400).json({ msg: "sms not sent" });
          }
        } else {
          
          res.status(400).json({ msg: "sms not sent" });
        }
      });
    } else {
      
      res.status(400).json({ msg: "sms not sent" });
    }
  } catch (error) {
    
    res.status(400).json({ msg: error.message });
  }
};

module.exports = {
  getBranch,
  getSortedBranches,
  getActiveBranches,
  createBranch,
  createBranches,
  getBranches,
  editBranch,
  deleteBranch,
  handleActivation,
  sendSMS,
  getAllBranches,
};
