const Document = require("../../models/Document");

const Vendor = require("../../models/vendor/Vendors");
const User = require("../../models/acl/user");
const { Op } = require("sequelize");
const {
  createEventLog,
  getIpAddress,
  getChangedFieldValues,
} = require("../../utils/GeneralUtils");
const VendorDocuments = require("../../models/vendor/VendorDocument");
const Shareholder = require("../../models/shareholders/Shareholder");
const ShareholderDocuments = require("../../models/shareholders/ShareholderDocument");
const PartnerDocuments = require("../../models/partner/PartnerDocument");
const Partner = require("../../models/partner/Partner");
const Competitor = require("../../models/competitor/Competitors");
const Agent = require("../../models/agent/Agent");
const AgentDocuments = require("../../models/agent/AgentDocument");
const Organization = require("../../models/broker/Organization");
const CompetitorDocuments = require("../../models/competitor/CompetitorDocument");
const OrganizationDocuments = require("../../models/broker/OrganizationDocument");
const ContactDocuments = require("../../models/ContactDocument");
const Contact = require("../../models/Contact");
const Employee = require("../../models/Employee");
const EmployeeDocument = require("../../models/EmployeeDocument");
const EmailModel = require("../../models/EmailModel");
const CustomerDocuments = require("../../models/customer/CustomerDocument");
const Customer = require("../../models/customer/Customer");
const {Role,eventResourceTypes,eventActions} = require("../../utils/constants");

const getSearch = (st) => {
  return {
    [Op.or]: [
      { name: { [Op.like]: `%${st}%` } },
      { type: { [Op.like]: `%${st}%` } },
      { code: { [Op.like]: `%${st}%` } },
      { active: { [Op.like]: `%${st}%` } },
    ],
  };
};

const getDocument = async (req, res) => {
  const { f, r, st, sc, sd } = req.query;
  try {
    if (sc == null) {
      sc = "";
    }
    const data = await Document.findAndCountAll({
      include: [
        User,
        Competitor,
        Partner,
        Vendor,
        Shareholder,
        Agent,
        Organization,
        Contact,
        Employee,
        EmailModel,
      ],
      offset: Number(f),
      limit: Number(r),
      order:
        sc && sc == "user.name"
          ? [["user", "first_name", sd == 1 ? "ASC" : "DESC"]]
          : sc
            ? [[sc, sd == 1 ? "ASC" : "DESC"]]
            : [["createdAt", sd == 1 ? "DESC" : "ASC"]],
      subQuery: false,
      where: {
        [Op.and]: [
          { "$competitors.id$": null },
          { "$partners.id$": null },
          { "$shareholders.id$": null },
          { "$vendors.id$": null },
          { "$agents.id$": null },
          { "$organizations.id$": null },
          { "$contacts.id$": null },
          { "$employees.id$": null },
          { "$email_models.id$": null },

          getSearch(st),
        ],
      },
    });
    // { type: { [Op.not]: "Email Attachment" } }
    
    res.status(200).json(data);
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};

const getActiveDocument = async (req, res) => {
  const { f, r, st, sc, sd } = req.query;
  try {
    if (sc == null) {
      sc = "";
    }
    const data = await Document.findAndCountAll({
      include: [
        User,
        Competitor,
        Partner,
        Vendor,
        Shareholder,
        Agent,
        Organization,
        Contact,
        Employee,
        EmailModel,
      ],
      offset: Number(f),
      limit: Number(r),
      order:
        sc && sc == "user.name"
          ? [["user", "first_name", sd == 1 ? "ASC" : "DESC"]]
          : sc
            ? [[sc, sd == 1 ? "ASC" : "DESC"]]
            : [["createdAt", sd == 1 ? "DESC" : "ASC"]],
      subQuery: false,
      where: {
        [Op.and]: [
          { "$competitors.id$": null },
          { "$partners.id$": null },
          { "$shareholders.id$": null },
          { "$vendors.id$": null },
          { "$agents.id$": null },
          { "$organizations.id$": null },
          { "$contacts.id$": null },
          { "$employees.id$": null },
          { "$email_models.id$": null },
          { active: { [Op.like]: true } },
          getSearch(st),
        ],
      },
    });
    res.status(200).json(data);
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};

const getDocumentByVendor = async (req, res) => {
  const { f, r, st, sc, sd } = req.query;
  try {
    const data = await Document.findAndCountAll({
      include: [Vendor, User],
      offset: Number(f),
      limit: Number(r),
      order: [[sc || "createdAt", sd == 1 ? "ASC" : "DESC"]],
      subQuery: false,
      where: {
        [Op.and]: [
          { "$vendors.id$": { [Op.like]: req.params.id } },
          getSearch(st),
        ],
      },
    });
    
    res.status(200).json(data);
  } catch (error) {
    
    res.status(400).json({ msg: error.message });
  }
};

const createDocumentVendor = async (req, res) => {
  try {
    if (req.file == null) {
      
      return res.status(400).json({ msg: "File Not  Uploaded" });
    } else {
      const newDoc = {
        name: req.body.name,
        document: "/uploads/" + req.file.filename,
        type: req.body.type,
        description: req.body.description,
        userId: req.body.userId,
        code: req.body.code,
        active: req.body.active,
        originalName: req.file.originalname,
      };
      const addedCategories = await Document.findOne({
        where: {
          [Op.or]: [
            { name: { [Op.like]: newDoc.name } },
            { code: { [Op.like]: newDoc.code } },
          ],
        },
      });
      if (addedCategories == null) {
        const document = await Document.create(newDoc).then(
          async (document) => {
            document.addVendors(req.body.vendorId, {
              through: VendorDocuments,
            });

            let ipAddress = await getIpAddress(req.ip);

            const eventLog = await createEventLog(
              req.user.id,
              eventResourceTypes.vendorDocument,
              document.name,
              document.id,
              eventActions.create,
              "",
              ipAddress
            );
          }
        );
        res.status(200).json(document);
      } else {
        res.status(400).json({ msg: "Document exists" });
      }
    }
  } catch (error) {
    res.status(400).json({ msg: error.message });
    
  }
};

const getDocumentByShareholder = async (req, res) => {
  const { f, r, st, sc, sd } = req.query;
  try {
    const data = await Document.findAndCountAll({
      include: [Shareholder, User],
      offset: Number(f),
      limit: Number(r),
      order: [[sc || "createdAt", sd == 1 ? "ASC" : "DESC"]],
      subQuery: false,
      where: {
        [Op.and]: [
          { "$shareholders.id$": { [Op.like]: req.params.id } },
          getSearch(st),
        ],
      },
    });
    
    res.status(200).json(data);
  } catch (error) {
    
    res.status(400).json({ msg: error.message });
  }
};

//Employee documents Handler
const createEmployeeDocument = async (req, res) => {
  try {
    if (req.file == null) {
      
      return res.status(400).json({ msg: "File Not  Uploaded" });
    } else {
      const newDoc = {
        name: req.body.name,
        document: "/uploads/" + req.file.filename,
        type: req.body.type,
        description: req.body.description,
        userId: req.body.userId,
        code: req.body.code,
        active: req.body.active,
        originalName: req.file.originalname,
      };

      const addedCategories = await Document.findOne({
        where: {
          [Op.or]: [
            { name: { [Op.like]: newDoc.name } },
            { code: { [Op.like]: newDoc.code } },
          ],
        },
      });
      if (addedCategories == null) {
        const document = await Document.create(newDoc).then(
          async (document) => {
            document.addEmployees(req.body.employeeId, {
              through: EmployeeDocument,
            });
            let ipAddress = await getIpAddress(req.ip);
            const eventLog = await createEventLog(
              req.user.id,
              eventResourceTypes.employeeDocument,
              document.name,
              document.id,
              eventActions.create,
              "",
              ipAddress
            );
          }
        );

        res.status(200).json(document);
      } else {
        res.status(400).json({ msg: "Document exists" });
      }
    }
  } catch (error) {
    res.status(400).json({ msg: error.message });
    
  }
};

const getEmployeeDocuments = async (req, res) => {
  const { f, r, st, sc, sd } = req.query;
  try {
    

    const data = await Document.findAndCountAll({
      include: [Employee, User],
      offset: Number(f),
      limit: Number(r),
      order: [[sc || "createdAt", sd == 1 ? "ASC" : "DESC"]],
      subQuery: false,
      where: {
        [Op.and]: [
          { "$employees.id$": { [Op.like]: req.params.id } },
          getSearch(st),
        ],
      },
    });
    
    res.status(200).json(data);
  } catch (error) {
    
    res.status(400).json({ msg: error.message });
  }
};

const createDocumentShareholder = async (req, res) => {
  try {
    if (req.file == null) {
      
      return res.status(400).json({ msg: "File Not  Uploaded" });
    } else {
      const newDoc = {
        name: req.body.name,
        document: "/uploads/" + req.file.filename,
        type: req.body.type,
        description: req.body.description,
        userId: req.body.userId,
        code: req.body.code,
        active: req.body.active,
        originalName: req.file.originalname,
      };
      const addedCategories = await Document.findOne({
        where: {
          [Op.or]: [
            { name: { [Op.like]: newDoc.name } },
            { code: { [Op.like]: newDoc.code } },
          ],
        },
      });
      if (addedCategories == null) {
        const document = await Document.create(newDoc).then(
          async (document) => {
            document.addShareholders(req.body.shareholderId, {
              through: ShareholderDocuments,
            });
            let ipAddress = await getIpAddress(req.ip);

            const eventLog = await createEventLog(
              req.user.id,
              eventResourceTypes.shareholderDocument,
              document.name,
              document.id,
              eventActions.create,
              "",
              ipAddress
            );
          }
        );

        res.status(200).json(document);
      } else {
        res.status(400).json({ msg: "Document exists" });
      }
    }
  } catch (error) {
    res.status(400).json({ msg: error.message });
    
  }
};

/////-----partner------//
const getDocumentByPartner = async (req, res) => {
  const { f, r, st, sc, sd } = req.query;
  try {
    const data = await Document.findAndCountAll({
      include: [Partner, User],
      offset: Number(f),
      limit: Number(r),
      order: [[sc || "createdAt", sd == 1 ? "ASC" : "DESC"]],
      subQuery: false,
      where: {
        [Op.and]: [
          { "$partners.id$": { [Op.like]: req.params.id } },
          getSearch(st),
        ],
      },
    });
    
    res.status(200).json(data);
  } catch (error) {
    
    res.status(400).json({ msg: error.message });
  }
};

const createDocumentPartner = async (req, res) => {
  try {
    if (req.file == null) {
      
      return res.status(400).json({ msg: "File Not  Uploaded" });
    } else {
      const newDoc = {
        name: req.body.name,
        document: "/uploads/" + req.file.filename,
        type: req.body.type,
        description: req.body.description,
        userId: req.body.userId,
        code: req.body.code,
        active: req.body.active,
        originalName: req.file.originalname,
      };
      const addedCategories = await Document.findOne({
        where: {
          [Op.or]: [
            { name: { [Op.like]: newDoc.name } },
            { code: { [Op.like]: newDoc.code } },
          ],
        },
      });
      if (addedCategories == null) {
        const document = await Document.create(newDoc).then(
          async (document) => {
            document.addPartners(req.body.partnerId, {
              through: PartnerDocuments,
            });
            let ipAddress = await getIpAddress(req.ip);

            const eventLog = await createEventLog(
              req.user.id,
              eventResourceTypes.partnerDocument,
              document.name,
              document.id,
              eventActions.create,
              "",
              ipAddress
            );
          }
        );

        res.status(200).json(document);
      } else {
        res.status(400).json({ msg: "Document exists" });
      }
    }
  } catch (error) {
    res.status(400).json({ msg: error.message });
    
  }
};

//-----Competitor------//
const getDocumentByCompetitor = async (req, res) => {
  const { f, r, st, sc, sd } = req.query;

  try {
    const data = await Document.findAndCountAll({
      include: [Competitor, User],
      offset: Number(f),
      limit: Number(r),
      order: [[sc || "createdAt", sd == 1 ? "ASC" : "DESC"]],
      subQuery: false,
      where: {
        [Op.and]: [
          { "$competitors.id$": { [Op.like]: req.params.id } },
          getSearch(st),
        ],
      },
    });
    res.status(200).json(data);
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};

const createDocumentCompetitor = async (req, res) => {
  try {
    if (req.file == null) {
      return res.status(400).json({ msg: "File Not  Uploaded" });
    } else {
      const newDoc = {
        name: req.body.name,
        document: "/uploads/" + req.file.filename,
        type: req.body.type,
        description: req.body.description,
        userId: req.body.userId,
        code: req.body.code,
        active: req.body.active,
        originalName: req.file.originalname,
      };

      const addedCategories = await Document.findOne({
        where: {
          [Op.or]: [
            { name: { [Op.like]: newDoc.name } },
            { code: { [Op.like]: newDoc.code } },
          ],
        },
      });
      if (addedCategories == null) {
        const document = await Document.create(newDoc).then(
          async (document) => {
            document.addCompetitors(req.body.competitorId, {
              through: CompetitorDocuments,
            });
            let ipAddress = await getIpAddress(req.ip);

            const eventLog = await createEventLog(
              req.user.id,
              eventResourceTypes.competitorDocument,
              document.name,
              document.id,
              eventActions.create,
              "",
              ipAddress
            );
          }
        );

        res.status(200).json(document);
      } else {
        res.status(400).json({ msg: "Document exists" });
      }
    }
  } catch (error) {
    res.status(400).json({ msg: error.message });
    
  }
};

//-----Agent------//
const getDocumentByAgent = async (req, res) => {
  const { f, r, st, sc, sd } = req.query;
  try {
    const data = await Document.findAndCountAll({
      include: [Agent, User],
      offset: Number(f),
      limit: Number(r),
      order: [[sc || "createdAt", sd == 1 ? "ASC" : "DESC"]],
      subQuery: false,
      where: {
        [Op.and]: [
          { "$agents.id$": { [Op.like]: req.params.id } },
          getSearch(st),
        ],
      },
    });
    res.status(200).json(data);
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};

const createDocumentAgent = async (req, res) => {
  try {
    if (req.file == null) {
      return res.status(400).json({ msg: "File Not  Uploaded" });
    } else {
      const newDoc = {
        name: req.body.name,
        document: "/uploads/" + req.file.filename,
        type: req.body.type,
        description: req.body.description,
        userId: req.body.userId,
        code: req.body.code,
        active: req.body.active,
        originalName: req.file.originalname,
      };

      const addedCategories = await Document.findOne({
        where: {
          [Op.or]: [
            { name: { [Op.like]: newDoc.name } },
            { code: { [Op.like]: newDoc.code } },
          ],
        },
      });

      if (addedCategories == null) {
        const document = await Document.create(newDoc).then(
          async (document) => {
            document.addAgents(req.body.agentId, {
              through: AgentDocuments,
            });
            let ipAddress = await getIpAddress(req.ip);
            const eventLog = await createEventLog(
              req.user.id,
              eventResourceTypes.agentDocument,
              document.name,
              document.id,
              eventActions.create,
              "",
              ipAddress
            );
          }
        );
        res.status(200).json(document);
      } else {
        res.status(400).json({ msg: "Document exists" });
      }
    }
  } catch (error) {
    res.status(400).json({ msg: error.message });
    
  }
};

//-----Organization------//
const getDocumentByOrganization = async (req, res) => {
  const { f, r, st, sc, sd } = req.query;
  try {
    const data = await Document.findAndCountAll({
      include: [Organization, User],
      offset: Number(f),
      limit: Number(r),
      order: [[sc || "createdAt", sd == 1 ? "ASC" : "DESC"]],
      subQuery: false,
      where: {
        [Op.and]: [
          { "$organizations.id$": { [Op.like]: req.params.id } },
          getSearch(st),
        ],
      },
    });
    res.status(200).json(data);
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};

const createDocumentOrganization = async (req, res) => {
  try {
    if (req.file == null) {
      return res.status(400).json({ msg: "File Not  Uploaded" });
    } else {
      const newDoc = {
        name: req.body.name,
        document: "/uploads/" + req.file.filename,
        type: req.body.type,
        description: req.body.description,
        userId: req.body.userId,
        code: req.body.code,
        active: req.body.active,
        originalName: req.file.originalname,
      };

      const addedCategories = await Document.findOne({
        where: {
          [Op.or]: [
            { name: { [Op.like]: newDoc.name } },
            { code: { [Op.like]: newDoc.code } },
          ],
        },
      });

      if (addedCategories == null) {
        const document = await Document.create(newDoc).then(
          async (document) => {
            document.addOrganizations(req.body.organizationId, {
              through: OrganizationDocuments,
            });
            let ipAddress = await getIpAddress(req.ip);

            const eventLog = await createEventLog(
              req.user.id,
              eventResourceTypes.brokerDocument,
              document.name,
              document.id,
              eventActions.create,
              "",
              ipAddress
            );
          }
        );

        res.status(200).json(document);
      } else {
        res.status(400).json({ msg: "Document exists" });
      }
    }
  } catch (error) {
    res.status(400).json({ msg: error.message });
    
  }
};

const createDocumentContact = async (req, res) => {
  try {
    if (req.file == null) {
      return res.status(400).json({ msg: "File Not  Uploaded" });
    } else {
      const newDoc = {
        name: req.body.name,
        document: "/uploads/" + req.file.filename,
        type: req.body.type,
        description: req.body.description,
        userId: req.body.userId,
        code: req.body.code,
        active: req.body.active,
        originalName: req.file.originalname,
      };
      const contactId =
        req.body.leadId == 0 ? req.body.accountId : req.body.leadId;
      const addedCategories = await Document.findOne({
        where: {
          [Op.or]: [
            { name: { [Op.like]: newDoc.name } },
            { code: { [Op.like]: newDoc.code } },
          ],
        },
      });
      if (addedCategories == null) {
        const document = await Document.create(newDoc).then(async (doc) => {
          try {
            
            doc.addContacts(contactId, {
              through: ContactDocuments,
            });
          } catch (error) {
            res.status(400).json({ msg: error.message });
          }
        });

        res.status(200).json(document);
      } else {
        res.status(400).json({ msg: "Document exists" });
      }
    }
  } catch (error) {
    res.status(400).json({ msg: error.message });
    
  }
};

const getDocumentByLead = async (req, res) => {
  const { f, r, st, sc, sd } = req.query;
  try {
    
    const data = await Document.findAndCountAll({
      include: [Contact, User],
      offset: Number(f),
      limit: Number(r),
      order: [[sc || "createdAt", sd == 1 ? "ASC" : "DESC"]],
      subQuery: false,
      where: {
        [Op.and]: [
          {
            "$contacts.id$": { [Op.like]: req.params.id },
          },
          { "$contacts.status$": "leads" },

          getSearch(st),
        ],
      },
    });
    res.status(200).json(data);
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};

const getDocumentByAccount = async (req, res) => {
  try {
    const { f, r, st, sc, sd } = req.query;
    
    const data = await Document.findAndCountAll({
      include: [Contact, User],
      offset: Number(f),
      limit: Number(r),
      order: [[sc || "createdAt", sd == 1 ? "ASC" : "DESC"]],
      subQuery: false,
      where: {
        [Op.and]: [
          {
            "$contacts.id$": { [Op.like]: req.params.id },
          },
          { "$contacts.status$": "accounts" },

          getSearch(st),
        ],
      },
    });
    res.status(200).json(data);
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};

function getFileExtension(file) {
  // get file extension
  const filename = file.originalname;
  file.mimetype.split("/")[1] ==
    filename.substring(filename.lastIndexOf(".") + 1, filename.length);
  return extension;
}

//posting
const createDocument = async (req, res) => {
  try {
    if (req.file == null) {
      return res
        .status(400)
        .json({ msg: "File Not  Uploaded or File Corrupted" });
    } else {
      
      const newDoc = {
        name: req.body.name,
        document: "/uploads/" + req.file.filename,
        type: req.body.type,
        description: req.body.description,
        userId: req.body.userId,
        code: req.body.code,
        active: req.body.active,
        originalName: req.file.originalname,
      };
      const addedCategories = await Document.findOne({
        where: {
          [Op.or]: [
            { name: { [Op.like]: newDoc.name } },
            { code: { [Op.like]: newDoc.code } },
          ],
        },
      });
      if (addedCategories == null) {
        const document = await Document.create(newDoc);
        let ipAddress = await getIpAddress(req.ip);

        const eventLog = await createEventLog(
          req.user.id,
          eventResourceTypes.document,
          document.name,
          document.id,
          eventActions.create,
          "",
          ipAddress
        );
        res.status(200).json(document);
      } else {
        res.status(400).json({ msg: "Document exists" });
      }
    }
  } catch (error) {
    res.status(400).json({ msg: error.message });
    
  }
};

const getDocumentByPk = async (req, res) => {
  try {
    const document = await Document.findByPk(req.params.id, {
      include: [User],
    }).then(function (Document) {
      if (!Document) {
        res.status(400).json({ message: "No Data Found" });
      } else {
        res.status(200).json(Document);
      }
    });
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};

const editDocument = async (req, res) => {
  const id = req.params.id;

  try {
    const foundDocument = await Document.findByPk(id);
    if (req.file == null) {
      // 
      await Document.update(
        {
          name: req.body.name,
          type: req.body.type,
          description: req.body.description,
          code: req.body.code,
          active: req.body.active,
          // originalName: req.file.originalname,
        },
        { where: { id: id } }
      );
      const updatedDocument = await Document.findByPk(id);
      const changedFieldValues = getChangedFieldValues(
        foundDocument,
        updatedDocument
      );
      let ipAddress = await getIpAddress(req.ip);
      const eventLog = await createEventLog(
        req.user.id,
        eventResourceTypes.document,
        updatedDocument.name,
        updatedDocument.id,
        eventActions.edit,
        changedFieldValues,
        ipAddress
      );

      return res.status(200).json({ id });
    } else {
      
      const newDoc = {
        name: req.body.name,
        document: "/uploads/" + req.file.filename,
        type: req.body.type,
        description: req.body.description,
        code: req.body.code,
        active: req.body.active,
        originalName: req.file.originalname,

      };
      // const document = await Document.findByPk(req.params.id)

      await Document.update(newDoc, { where: { id: id } });
      const updatedDocument = await Document.findByPk(id);
      const changedFieldValues = getChangedFieldValues(
        foundDocument,
        updatedDocument
      );
      let ipAddress = await getIpAddress(req.ip);
      const eventLog = await createEventLog(
        req.user.id,
        eventResourceTypes.document,
        updatedDocument.name,
        updatedDocument.id,
        eventActions.edit,
        changedFieldValues,
        ipAddress
      );
      //    fs.rm(document.document, { recursive:true }, (err) => {
      //   if(err){
      //       // File deletion failed
      //       console.error(err.message);

      //   }
      //   
      // })

      res.status(200).json({ id });
    }
  } catch (error) {
    
    res.status(400).json({ msg: error.message });
  }
};

const deleteDocument = async (req, res) => {
  const id = req.params.id;
  
  try {

    const foundDocument = await Document.findByPk(id);
    await Document.destroy({ where: { id: id } });
    // const changedFieldValues = getChangedFieldValues(
    //   foundDocument,
    //   updatedDocument
    // );
    let ipAddress = await getIpAddress(req.ip);
    const eventLog = await createEventLog(
      req.user.id,
      eventResourceTypes.document,
      foundDocument.name,
      foundDocument.id,
      eventActions.delete,
      "",
      ipAddress
    );
    res.status(200).json({ id });
  } catch (error) {
    
    res.status(400).json({ msg: error.message });
  }
};

//-----Customer------//
const getDocumentByCustomer = async (req, res) => {
  const { f, r, st, sc, sd } = req.query;
  try {
    const data = await Document.findAndCountAll({
      include: [Customer, User],
      offset: Number(f),
      limit: Number(r),
      order: [[sc || "createdAt", sd == 1 ? "ASC" : "DESC"]],
      subQuery: false,
      where: {
        [Op.and]: [
          { "$customers.id$": { [Op.like]: req.params.id } },
          getSearch(st),
        ],
      },
    });
    res.status(200).json(data);
  } catch (error) {
    
    res.status(400).json({ msg: error.message });
  }
};

const createDocumentCustomer = async (req, res) => {
  try {
    if (req.file == null) {
      return res.status(400).json({ msg: "File Not  Uploaded" });
    } else {
      const newDoc = {
        name: req.body.name,
        document: "/uploads/" + req.file.filename,
        type: req.body.type,
        description: req.body.description,
        userId: req.body.userId,
        code: req.body.code,
        active: req.body.active,
        originalName: req.file.originalname,
      };

      const addedCategories = await Document.findOne({
        where: {
          [Op.or]: [
            { name: { [Op.like]: newDoc.name } },
            { code: { [Op.like]: newDoc.code } },
          ],
        },
      });

      if (addedCategories == null) {
        const document = await Document.create(newDoc).then(
          async (document) => {
            document.addCustomers(req.body.customerId, {
              through: CustomerDocuments,
            });
            let ipAddress = await getIpAddress(req.ip);
            const eventLog = await createEventLog(
              req.user.id,
              eventResourceTypes.customerDocument,
              document.name,
              document.id,
              eventActions.create,
              "",
              ipAddress
            );
          }
        );
        res.status(200).json(document);
      } else {
        res.status(400).json({ msg: "Document exists" });
      }
    }
  } catch (error) {
    res.status(400).json({ msg: error.message });
    
  }
};

module.exports = {
  getDocumentByCustomer,
  createDocumentCustomer,
  getDocument,
  getActiveDocument,
  createDocument,
  getDocumentByPk,
  editDocument,
  deleteDocument,
  getDocumentByVendor,
  createDocumentVendor,
  getEmployeeDocuments,
  createEmployeeDocument,
  getDocumentByShareholder,
  createDocumentShareholder,
  getDocumentByCompetitor,
  createDocumentCompetitor,
  getDocumentByAgent,
  createDocumentAgent,
  getDocumentByOrganization,
  createDocumentOrganization,
  getDocumentByPartner,
  createDocumentPartner,
  createDocumentContact,
  getDocumentByLead,
  getDocumentByAccount,
};
