const Agent = require("../../../models/agent/Agent");
const {
  isPhoneNoValid,
  getFileExtension,
  isEmailValid,
  createEventLog,
  getIpAddress,
  getChangedFieldValues,
} = require("../../../utils/GeneralUtils");
const { Op } = require("sequelize");
const PhoneNo = require("../../../models/PhoneNo");
const SMSMessage = require("../../../models/SMS");
const AgentDepartment = require("../../../models/agent/AgentDepartment");
const Employee = require("../../../models/Employee");
const Department = require("../../../models/Department");
const Email = require("../../../models/EmailModel");
const AgentEmails = require("../../../models/agent/AgentEmail");
const AgentSms = require("../../../models/agent/AgentSMS");
const { sendNewSms } = require("../SMSServiceHandler");
const { sendNewEmail } = require("../EmailServiceHandler");
const User = require("../../../models/acl/user");
const Emailcc = require("../../../models/EmailCc");
const Document = require("../../../models/Document");
const EmailDocument = require("../../../models/EmailDocument");
const {
  eventResourceTypes,
  eventActions,
} = require("../../../utils/constants");
// const excelTemplate = require('../../uploads/zemen_agents_excel_template.xlsx');

const getSearch = (st) => {
  let phoneSearch = st.trim();
  if (st && st.startsWith("0")) {
    phoneSearch = st.slice(1);
  }

  const names = st.split(' '); 

  return {
    [Op.or]: [
      { firstName: { [Op.like]: `%${st}%` } },
      { fatherName: { [Op.like]: `%${st}%` } },
      { grandfatherName: { [Op.like]: `%${st}%` } },
      { firstName: { [Op.like]: `%${names[0]}%` } },
      { fatherName: { [Op.like]: `%${names[1]}%` } }, 
      { grandfatherName: { [Op.like]: `%${names[2]}%` } }, 
      { website: { [Op.like]: `%${st}%` } },
      { primaryEmail: { [Op.like]: `%${st}%` } },
      { primaryPhone: { [Op.like]: `%${phoneSearch}%` } },
      { secondaryEmail: { [Op.like]: `%${st}%` } },
      { secondaryPhone: { [Op.like]: `%${phoneSearch}%` } },
      { country: { [Op.like]: `%${st}%` } },
      { region: { [Op.like]: `%${st}%` } },
    ],
  };
};
const getAgent = async (req, res) => {
  const { f, r, st, sc, sd } = req.query;
  try {
    const data = await Agent.findAndCountAll({
      include: [{ model: User, as: "userAccount" }, User],
      offset: Number(f),
      limit: Number(r),
      order: [[sc || "createdAt", sd == 1 ? "DESC" : "ASC"]],
      where: getSearch(st),
      subQuery: false,
    });
    res.status(200).json(data);
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};

//posting
const createAgent = async (req, res) => {
  
  const agentBody = req.body;
  const { primaryEmail, primaryPhone, secondaryEmail, secondaryPhone } =
    req.body;
  try {
    const agentFound = await Agent.findOne({
      where: {
        [Op.or]: [
          { primaryEmail: { [Op.like]: primaryEmail } },
          { primaryPhone: { [Op.like]: req.body.primaryPhone } },
        ],
      },
    });
    if (primaryPhone == secondaryPhone) {
      res.status(400).json({
        msg: "Primary phone number and secondary phone number cannot be similar",
      });
      return;
    }
    if (
      primaryEmail == secondaryEmail &&
      primaryEmail != "" &&
      secondaryEmail != ""
    ) {
      res.status(400).json({
        msg: "Primary email and secondary email cannot be similar",
      });
      return;
    }

    if (agentFound === null) {
      if (req.file == null) {
        const { profilePicture, ...others } = agentBody;
        others.accountId = null;
        const data = await Agent.create(others);
        let ipAddress = getIpAddress(req.ip);
        const eventLog = await createEventLog(
          req.user.id,
          eventResourceTypes.agent,
          data.firstName,
          data.id,
          eventActions.create,
          "",
          ipAddress
        );
        res.status(200).json(data);
      } else {
        agentBody.profilePicture = "/uploads/" + req.file.filename;
        const data = await Agent.create(agentBody);
        let ipAddress = getIpAddress(req.ip);
        const eventLog = await createEventLog(
          req.user.id,
          eventResourceTypes.agent,
          data.firstName,
          data.id,
          eventActions.create,
          "",
          ipAddress
        );
        res.status(200).json(data);
      }
    } else if (agentFound) {
      res.status(400).json({ msg: "Agent already exists " });
      return;
    }
  } catch (error) {
    
    res.status(400).json({ msg: error.message });
  }
};
const addPhoneNumber = async (req, res) => {
  try {
    const agent = await AgentPhone.create(req.body);
    res.status(200).json(agent);
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};
const handleActivation = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);
    const agent = await User.update(
      { activated: !user.activated },
      { where: { id: req.params.id } }
    );
    // const sh = await Agent.findByPk(req.params.id)
    // const agent = await Agent.update(
    //   { active: !sh.active },
    //   {where :{id:req.params.id}}
    // )
    res.status(200).json(agent);
  } catch (error) {
    
    res.status(400).json({ msg: error.message });
  }
};

// var os = require("os");
const createAgents = async (req, res) => {
  const agents = req.body;
  var addedList = 0;
  var duplicate = [];
  var incorrect = [];
  var lineNumber = 1;
  // var errorLine = [];

  try {
    const promises = await agents.map(async (agent) => {
      let addedAgents = await Agent.findOne({
        where: {
          [Op.or]: [
            { primaryEmail: { [Op.like]: agent.primaryEmail } },
            { primaryPhone: { [Op.like]: agent.primaryPhone } },
            { licenseNumber: { [Op.like]: agent.licenseNumber } },
          ],
        },
      }).then(async (addedAgents) => {
        lineNumber = lineNumber + 1;

        if (
          isEmailValid(agent.primaryEmail) &&
          isPhoneNoValid(agent.primaryPhone)
        )
          if (addedAgents == null) {
            agent.userId = req.user.id;

            try {

              // let mapAgent = {
              //   firstName: agent.firstName && agent.firstName.trim(),
              //   fatherName: agent.fatherName && agent.fatherName.trim(),
              //   grandfatherName: agent.grandfatherName && agent.grandfatherName.trim(),
              //   gender: agent.gender && agent.gender.trim(),
              //   primaryPhone: agent.primaryPhone && agent.primaryPhone.trim(),
              //   primaryEmail: agent.primaryEmail && agent.primaryEmail.trim(),
              //   secondaryEmail: agent.secondaryEmail && agent.secondaryEmail.trim(),
              //   website: agent.website && agent.website.trim(),
              //   country: agent.country && agent.country.trim(),
              //   region: agent.region && agent.region.trim(),
              //   city: agent.city && agent.city.trim(),
              //   subcity: agent.subcity && agent.subcity.trim(),
              //   woreda: agent.woreda,
              //   kebele: agent.kebele && agent.kebele.trim(),
              //   building: agent.building && agent.building.trim(),
              //   officeNumber: agent.officeNumber && agent.officeNumber.trim(),
              //   poBox: agent.poBox && agent.poBox.trim(),
              //   streetName: agent.streetName && agent.streetName.trim(),
              //   zipCode: agent.zipCode && agent.zipCode.trim(),
              //   tinNumber: agent.tinNumber,
              //   registeredForVat: agent.registeredForVat && agent.registeredForVat.trim(),
              //   vatRegistrationNumber: agent.vatRegistrationNumberagent && agent.vatRegistrationNumberagent.vatRegistrationNumber.trim(),
              //   tot: agent.tot && agent.tot.trim(),
              //   note: agent.note && agent.note.trim(),
              //   profilePicture: agent.profilePicture && agent.profilePicture.trim(),
              //   licenseNumber: agent.licenseNumber,
              //   batch: agent.batch && agent.batch.trim(),
              //   licenseIssuedDate: agent.licenseIssuedDate && new Date(agent.licenseIssuedDate),
              //   licenseExpirationDate: agent.licenseExpirationDate && new Date(agent.licenseExpirationDate),
              //   licenseType: agent.licenseType && agent.licenseType.trim(),
              //   description: agent.description && agent.description.trim(),
              //   socialSecurity: agent.socialSecurity && agent.socialSecurity.trim(),
              //   accountId: agent.accountId,
              //   userId: agent.userId
              // }
              // 
              let newAgent = await Agent.create(agent);
              newAgent && (addedList += 1);
            } catch (error) {
              

              if (error.name == "SequelizeValidationError") {
                
                

              }
              incorrect.push(lineNumber);

              // // 
              // 
              // 
              //   "-----error-----ValidationErrorItem-----",
              //   error.errors.map((e) => e.message)
              // );
              // 
              //   "-----error-----ValidationErrorItem-----",
              //   error.errors.map((e) => e.path)
              // );

              // res.status(400).json({ msg: error.message });
            }
          } else {
            
            duplicate.push(lineNumber);
          }
        else {
          incorrect.push(lineNumber);
          
        }
      })
      


    });
    Promise.all(promises).then(function (results) {
      // let mess = addedList && `${addedList} partners added` +  duplicate && `${duplicate} rejected`
      let msg = "";
      if (addedList != 0) {
        msg = msg + `${addedList}  agent added`;
      }
      if (duplicate.length != 0) {
        msg =
          msg == ""
            ? `Duplicate value found on line ${duplicate}`
            : msg + `, Duplicate value found on line ${duplicate}`;
      }
      if (incorrect.length != 0) {
        msg =
          msg == ""
            ? `Line ${incorrect} has incorrect values`
            : msg + `, Line ${incorrect} has incorrect values`;
      }
      // if (errorLine.length != 0) {
      //   msg = msg + ` line ${errorLine} have invalid values\n`;
      // }
      if (duplicate != 0 || incorrect != 0) {
        res.status(400).json({ msg: msg });
      } else {
        res.status(200).json({ msg: msg });
      }
    });
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};

const getAgentByPk = async (req, res) => {
  try {
    const agent = await Agent.findByPk(req.params.id, {
      include: [User, Department, { model: User, as: "userAccount" }],
    }).then(async (agent) => {
      if (!agent) {
        res.status(400).json({ message: "No Data Found" });
      } else {
        let ipAddress = getIpAddress(req.ip);
        const eventLog = await createEventLog(
          req.user.id,
          eventResourceTypes.agent,
          agent.firstName,
          agent.id,
          eventActions.view,
          "",
          ipAddress
        );

        res.status(200).json(agent);
      }
    });
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};
const getExcelTemplate = async (req, res) => {
  const fileName = "zemen_agents_excel_template.xlsx";
  const fileURL = "../../templates/zemen_agents_excel_template.xlsx";
  try {
    const stream = fs.createReadStream(fileURL);
    res.set({
      "Content-Disposition": `attachment; filename='${fileName}'`,
      "Content-Type": "application/xlsx",
    });
    stream.pipe(res);
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};
const editAgent = async (req, res) => {
  const agentBody = req.body;
  const id = req.body.id;
  try {
    const foundAgent = await Agent.findByPk(id);

    if (foundAgent) {
      agentBody.accountId =
        agentBody.accountId == "null" ? 0 : agentBody.accountId;

      if (req.file == null) {
        const { profilePicture, ...others } = agentBody;
        await Agent.update(others, { where: { id: id } });

        const newAgent = await Agent.findByPk(id);
        const changedFieldValues = getChangedFieldValues(foundAgent, newAgent);
        let ipAddress = getIpAddress(req.ip);
        const eventLog = await createEventLog(
          req.user.id,
          eventResourceTypes.agent,
          newAgent.firstName,
          newAgent.id,
          eventActions.edit,
          changedFieldValues,
          ipAddress
        );
        res.status(200).json({ id });
      } else {
        agentBody.profilePicture = "/uploads/" + req.file.filename;
        await Agent.update(agentBody, { where: { id: id } });
        res.status(200).json({ id });
      }
    } else {
      res.status(400).json({ msg: "No data found" });
    }
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};
const deleteAgent = async (req, res) => {
  const id = req.params.id;

  try {
    const foundAgent = await Agent.findByPk(id);

    await Agent.destroy({ where: { id: id } });
    let ipAddress = getIpAddress(req.ip);
    const eventLog = await createEventLog(
      req.user.id,
      eventResourceTypes.broker,
      foundAgent.firstName,
      foundAgent.id,
      eventActions.delete,
      "",
      ipAddress
    );

    res.status(200).json({ id });
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};
const sendEmail = async (req, res) => {
  const body = req.body;
  try {
    let documents;
    const agent = await Agent.findAll({
      where: { id: { [Op.in]: [body.agents] } },
    });
    if (agent) {
      if (body.documents != null) {
        documents = await Document.findAll({
          attributes: ["name", "document"],
          where: {
            id: {
              [Op.in]: [body.documents],
            },
          },
        });
        documents.map((e) => {
          let ext = getFileExtension(e.document);
          e.name = e.name + "." + ext;
        });
      }
      let newDocument = [];
      if (req.files != null) {
        req.files.map((e) => {
          let doc = {
            name: e.originalname,
            type: "Email Attachment",
            document: "/uploads/" + e.filename,
            userId: body.userId,
          };
          newDocument.push(doc);
        });

        await Array.prototype.push.apply(
          documents,
          newDocument.map(({ type, ...rest }) => {
            return rest;
          })
        );
      }
      const sendTo = [];
      agent.map((e) => {
        if (body.emailType) {
          if (body.emailType.length == 0) {
            if (e.primaryEmail) {
              sendTo.push(e.primaryEmail);
            }
          }
          if (body.emailType.find((element) => element == "primaryEmail")) {
            if (e.primaryEmail) {
              sendTo.push(e.primaryEmail);
            }
          }
          if (body.emailType.find((element) => element == "secondaryEmail")) {
            if (e.secondaryEmail) {
              sendTo.push(e.secondaryEmail);
            }
          }
        } else {
          if (e.primaryEmail) {
            sendTo.push(e.primaryEmail);
          }
        }
      });
      let emails;
      if (body.emailccs) {
        const splitData = body.emailccs.trim().split(",");
        emails = splitData.map((e) => {
          if (e) {
            return { email: e };
          }
        });
      } else {
        emails = [];
      }

      const newEmail = {
        userId: body.userId,
        subject: body.subject,
        message: body.message,
        emailccs: emails,
        documents: newDocument,
      };
      let from = req.user ? req.user.email : "";
      await sendNewEmail(
        sendTo,
        emails,
        body.subject,
        body.message,
        documents,
        from
      ).then(async (sentEmail) => {
        try {
          if (sentEmail >= 1) {
            const email = Email.create(newEmail, {
              include: [Emailcc, Document],
            }).then((email) => {
              body.agents != null &&
                email.addAgents(body.agents.map(Number), {
                  through: AgentEmails,
                });
              body.documents != null &&
                email.addDocuments(body.documents, {
                  through: EmailDocument,
                });
            });

            // let ipAddress = await getIpAddress(req.ip);
            // const eventLog = await createEventLog(
            //   req.user.id,
            //   eventResourceTypes.agentEmail,
            //   agent.firstName,
            //   agent.id,
            //   eventActions.create,
            //   "",
            //   ipAddress
            // );
            res.status(200).json(email);
          } else {
            res.status(200).json({ msg: "Email not sent" });
          }
        } catch (error) {
          res.status(400).json({ msg: error.message });
        }
      });
    }
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};

const sendSMS = async (req, res) => {
  const body = req.body;
  try {
    const agent = await Agent.findAll({
      where: { id: { [Op.in]: [body.agents] } },
    });
    const sendTo = [];
    // const name = [];

    if (agent) {
      agent.map((e) => {
        // name.push(e.firstName);
        if (body.phoneType.length == 0) {
          if (e.primaryPhone) {
            sendTo.push(e.primaryPhone);
          }
        }
        if (body.phoneType.find((element) => element == "primaryPhone")) {
          if (e.primaryPhone) {
            sendTo.push(e.primaryPhone);
          }
        }
        if (body.phoneType.find((element) => element == "secondaryPhone")) {
          if (e.secondaryPhone) {
            sendTo.push(e.secondaryPhone);
          }
        }
      });
      
      if (sendTo.length != 0) {
        return sendNewSms(sendTo, body.content).then((sent) => {
          if (sent.status == 200) {
            try {
              
              const sms = SMSMessage.create(body).then(async (sms) => {
                sms.addAgents(body.agents, { through: AgentSms });
                // let ipAddress = await getIpAddress(req.ip);
                // agent.map;
                // const eventLog = await createEventLog(
                //   req.user.id,
                //   eventResourceTypes.agentSms,
                //   name,
                //   body.agents,
                //   eventActions.create,
                //   "",
                //   ipAddress
                // );
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
        res.status(400).json({ msg: "Phone number can not be empty" });
      }
    } else {
      res.status(400).json({ msg: "sms not sent" });
    }
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};

const getEmail = async (req, res) => {
  const body = req.params.id;
  try {
    const sms = await Email.findAndCountAll({
      include: [User, Agent, Document, Emailcc],
      order: [["createdAt", "DESC"]],
      where: { "$agents.id$": { [Op.like]: body } },
    });
    res.status(200).json(sms);
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};

const getSMS = async (req, res) => {
  const body = req.params.id;
  try {
    const { f, r, st, sc, sd } = req.query;
    const sms = await SMSMessage.findAndCountAll({
      include: [{ model: User, attributes: ['id', 'corporate_name', 'first_name', 'middle_name', 'last_name', 'email', 'phone', 'gender'] }, Agent],
      where: { "$agents.id$": { [Op.like]: body } },
      offset: Number(f),
      limit: Number(r),
      order: [[sc || "createdAt", sd == 1 ? "DESC" : "ASC"]],
      // where: getSearch(st),
      subQuery: false,
    });

    console.log("sms Data==>",JSON.stringify(sms))
    res.status(200).json(sms);
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};
const profileUpload = async (req, res) => {
  try {
    

    if (req.file == null) {
      
      return res.status(400).json({ msg: "File Not  Uploaded" });
    } else {
      
      const vendor = await Agent.update(
        { profilePicture: "/uploads/" + req.file.filename },
        { where: { id: req.body.id } }
      );

      res.status(200).json(vendor);
    }
  } catch (error) {
    
    res.status(400).json({ msg: error.message });
  }
};

const getReports = async (req, res) => {
  let {
    country,
    city,
    region,
    subcity,
    batch,
    licenseExpirationDate,
    licenseType,
    gender,
    firstName,
    fatherName,
    grandfatherName,
    activeReport,
    licenseNumber,
  } = req.body;
  try {
    const agent = await Agent.findAll({
      include: [User],
      where: {
        [Op.and]: [
          gender.length != 0 && { gender: { [Op.in]: gender } },
          country.length != 0 && { country: { [Op.in]: country } },
          region.length != 0 && { region: { [Op.in]: region } },
          city.length != 0 && { city: { [Op.in]: city } },
          subcity.length != 0 && { subcity: { [Op.in]: subcity } },
          licenseNumber && {
            licenseNumber: {
              [Op.in]: licenseNumber.split(",").map((e) => {
                return e.trim();
              }),
            },
          },

          firstName && {
            firstName: {
              [Op.in]: firstName.split(",").map((e) => {
                return e.trim();
              }),
            },
          },
          fatherName && {
            fatherName: {
              [Op.in]: fatherName.split(",").map((e) => {
                return e.trim();
              }),
            },
          },
          grandfatherName && {
            grandfatherName: {
              [Op.in]: grandfatherName.split(",").map((e) => {
                return e.trim();
              }),
            },
          },
          activeReport.length != 0 && { active: { [Op.in]: activeReport } },

          //   // active && {active: active},
          // // {woreda: {[Op.in]: [woreda] }},
          // // {kebele: {[Op.in]: [kebele] }},
          // // {zipCode: { [Op.in]: [zipCode]}},
          // employeeId && { "$employee.id$": employeeId },
          batch && {
            batch: batch.split(",").map((e) => {
              return e.trim();
            }),
          },
          licenseExpirationDate && {
            licenseExpirationDate: licenseExpirationDate.split(",").map((e) => {
              return e.trim();
            }),
          },
          licenseType && {
            licenseType: licenseType.split(",").map((e) => {
              return e.trim();
            }),
          },
        ],
      },
    });
    
    res.status(200).json(agent);
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};

const getAllAgents = async (req, res) => {
  try {
    const data = await Agent.findAll({
      include: [User],
    });
    res.status(200).json(data);
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};

const getReportAgent = async (req, res) => {
  let {
    country,
    city,
    region,
    subcity,
    batch,
    licenseExpirationDate,
    licenseType,
    gender,
    activeReport,
    licenseNumber,
    firstName,
    fatherName,
    grandfatherName,
  } = req.body;
  try {
    
    const { f, r, st, sc, sd } = req.query;

    const agent = await Agent.findAndCountAll({
      include: [{ model: User, as: "userAccount" }, User],
      offset: Number(f),
      limit: Number(r),
      where: {
        [Op.and]: [
          gender.length != 0 && { gender: { [Op.in]: gender } },
          country.length != 0 && { country: { [Op.in]: country } },
          region.length != 0 && { region: { [Op.in]: region } },
          city.length != 0 && { city: { [Op.in]: city } },
          subcity.length != 0 && { subcity: { [Op.in]: subcity } },
          licenseNumber && {
            licenseNumber: {
              [Op.in]: licenseNumber.split(",").map((e) => {
                return e.trim();
              }),
            },
          },

          firstName && {
            firstName: {
              [Op.in]: firstName.split(",").map((e) => {
                return e.trim();
              }),
            },
          },
          fatherName && {
            fatherName: {
              [Op.in]: fatherName.split(",").map((e) => {
                return e.trim();
              }),
            },
          },
          grandfatherName && {
            grandfatherName: {
              [Op.in]: grandfatherName.split(",").map((e) => {
                return e.trim();
              }),
            },
          },
          //   // active && {active: active},
          // // {woreda: {[Op.in]: [woreda] }},
          // // {kebele: {[Op.in]: [kebele] }},
          // // {zipCode: { [Op.in]: [zipCode]}},
          // employeeId && { "$employee.id$": employeeId },
          batch && {
            batch: batch.split(",").map((e) => {
              return e.trim();
            }),
          },
          // activeReport   && sequelize.where(sequelize.col('$userAccount.activated$'), {
          //   [Op.in]:activeReport }
          // ),
          // activeReport && {
          //   "$userAccount.activated$": {
          //     [Op.and]: [
          //       { [Op.in]: activeReport },

          //     ]
          //   }

          //   },
          licenseExpirationDate && {
            licenseExpirationDate: licenseExpirationDate.split(",").map((e) => {
              return e.trim();
            }),
          },
          licenseType && {
            licenseType: licenseType.split(",").map((e) => {
              return e.trim();
            }),

          },
        ],
      },
      subQuery: false,
      distinct: true,
    });
    
    res.status(200).json(agent);
  } catch (error) {
    

    res.status(400).json({ msg: error.message });
  }
};

module.exports = {
  getAllAgents,
  getAgent,
  getExcelTemplate,
  createAgent,
  createAgents,
  getAgentByPk,
  editAgent,
  deleteAgent,
  handleActivation,
  addPhoneNumber,
  sendEmail,
  sendSMS,
  getEmail,
  getSMS,
  profileUpload,
  getReports,
  getReportAgent,
};
