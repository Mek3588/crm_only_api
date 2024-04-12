const Contact = require("../../../models/Contact");
const { Op } = require("sequelize");
const {
  ContactStatus,
  Role,
  ContactType,
  CompanyType,
} = require("../../../utils/constants");
const { QueryTypes } = require("sequelize");
const sequelize = require("../../../database/connections");
const User = require("../../../models/acl/user");
const Employee = require("../../../models/Employee");
const Opportunity = require("../../../models/Opportunity");

const getCount = async (req, res) => {
  const numberOfContacts = {
    totalContact: 0,
    prospects: 0,
    opportunities: 0,
    lead: 0,
    customer: 0,
  };
  const { status } = req.param;

  try {
    let data;
    if (status == ContactStatus.prospect) {
      data = await Contact.count({ where: status == ContactStatus.prospect });
    } else if (status == ContactStatus.lead) {
      data = await Contact.count({ where: status == ContactStatus.lead });
    } else if (status == ContactStatus.opportunity) {
      data = await Contact.count({
        where: status == ContactStatus.opportunity,
      });
    } else if (status == ContactStatus.customer) {
      data = await Contact.count({ where: status == ContactStatus.customer });
    } else {
      data = await Contact.count();
    }
    res.status(200).json(numberOfContacts);
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};

const getNumberOfContacts = async (req, res) => {
  
  const userId = req.user.id;
  const numberOfContacts = {
    totalContact: 0,
    customer: 0,
    lead: 0,
    individual_account: 0,
    corporate_account: 0,
    joinIndividual_account: 0,
    opportunity: 0,
  };
  try {
    numberOfContacts.lead = await Contact.count({
      where: {
        status: "leads",
        deleted: false,
      },
    });
    numberOfContacts.joinIndividual_account = await Contact.count({
      where: {
        status: "accounts",
        type: ContactType.joinIndividual,
        deleted: false,
      },
    });
    numberOfContacts.individual_account = await Contact.count({
      where: {
        status: "accounts",
        type: ContactType.individual,
        deleted: false,
      },
    });
    numberOfContacts.corporate_account = await Contact.count({
      where: {
        status: "accounts",
        type: ContactType.corporate,
        deleted: false,
      },
    });

    numberOfContacts.opportunity = await Opportunity.count({
      // where: {
      //   status: {
      //     [Op.notIn]: [
      //       "Sale cancelled",
      //       "Sale failed",
      //       "Sales completed",
      //       "Invoicing",
      //     ],
      //   },
      // },
    });

    numberOfContacts.totalContact = await Contact.count({
      where: { deleted: false },
    });
    
    res.status(200).json(numberOfContacts);
  } catch (error) {
    

    res.status(400).json({ msg: error.message });
  }
};

const getNumberOfContactsById = async (req, res) => {
  const userId = req.user.id;
  const numberOfContacts = {
    totalContact: 0,
    customer: 0,
    lead: 0,
    individual_account: 0,
    corporate_account: 0,
  };
  try {
    numberOfContacts.lead = await Contact.count({
      where: {
        type: ContactType.individual,
        status: "leads",
        userId: userId,
        deleted: false,
      },
    });

    numberOfContacts.individual_account = await Contact.count({
      where: {
        type: ContactType.individual,
        status: "accounts",
        userId: userId,
        deleted: false,
      },
    });
    numberOfContacts.corporate_account = await Contact.count({
      where: {
        status: ContactType.corporate,
        type: "accounts",
        userId: userId,
        deleted: false,
      },
    });

    numberOfContacts.totalContact = await Contact.count({
      where: { deleted: false },
    });
    
    res.status(200).json(numberOfContacts);
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};

const getThisYearCount = async (req, res) => {
  const month = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  let newResp = [];
  const { user } = req;
  const employee = await Employee.findOne({ where: { userId: user.id } });
  // 
  try {
    let data = [];

    if (user.role === Role.superAdmin) {
      // 
      data = await sequelize.query(
        "SELECT count(*) as count, status , MonthName(createdAt)  month FROM crm.contacts where  deleted=false and YEAR(createdAt)  = YEAR(CURDATE())group by   MonthName(createdAt),status ORDER BY STR_TO_DATE(CONCAT('0001' , Month,  '01'), '%Y %M %d') ",
        { type: QueryTypes.SELECT }
      );
    } else if (user.role === Role.branchManager) {
      data = await sequelize.query(
        `SELECT count(*) as count, status , MonthName(createdAt)  month FROM crm.contacts where  deleted=false ${employee !== null && `and branchId=${employee.branchId}`
        } and YEAR(createdAt)  = YEAR(CURDATE())group by   MonthName(createdAt),status ORDER BY STR_TO_DATE(CONCAT('0001' , Month,  '01'), '%Y %M %d') `,
        { type: QueryTypes.SELECT }
      );
    }
    let i = 0;
    month.map((e) => {
      let newData = data.filter((item) => item.month == month[i]);
      var responses = {
        month: month[i],
        leads: newData.filter((item) => item.status === "leads")[0]
          ? newData.filter((item) => item.status === "leads")[0].count
          : 0,
        accounts: newData.filter((item) => item.status === "accounts")[0]
          ? newData.filter((item) => item.status === "accounts")[0].count
          : 0,
      };

      newResp.push(responses);
      i++;
    });
    


    let formattedResponse = {
      count: newResp?.length,
      rows: newResp
    }


    res.status(200).json(formattedResponse);
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};

const getOpportunityByMonth = async (req, res) => {
  let opportunity = [];
  try {
    opportunity = await sequelize.query(
      "SELECT count(*) as count, status , MonthName(createdAt)  month FROM crm.opportunitys where YEAR(createdAt)  = YEAR(CURDATE()) group by   MonthName(createdAt),status ORDER BY STR_TO_DATE(CONCAT('0001' , Month,  '01'), '%Y %M %d') ",
      { type: QueryTypes.SELECT }
    );
    
    res.status(200).json(opportunity);
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};

const getThisYearCountById = async (req, res) => {
  const param = req.params.id;
  const month = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  let newResp = [];
  const { user } = req;
  try {
    const data = await sequelize.query(
      `SELECT count(*) as count, status , MonthName(createdAt)  month FROM crm.contacts where deleted=false and  userId =${param} and  YEAR(createdAt)  = YEAR(CURDATE())group by   MonthName(createdAt),status ORDER BY STR_TO_DATE(CONCAT('0001' , Month,  '01'), '%Y %M %d') `,
      { type: QueryTypes.SELECT }
    );
    let i = 0;
    month.map((e) => {
      let newData = data.filter((item) => item.month == month[i]);
      var nwresponses = {
        month: month[i],
        lead: newData.filter((item) => item.status === "Lead")[0]
          ? newData.filter((item) => item.status === "Lead")[0].count
          : 0,
        opportunity: newData.filter((item) => item.status === "Opportunity")[0]
          ? newData.filter((item) => item.status === "Opportunity")[0].count
          : 0,
        prospect: newData.filter((item) => item.status === "Prospect")[0]
          ? newData.filter((item) => item.status === "Prospect")[0].count
          : 0,
      };

      newResp.push(nwresponses);
      i++;
    });

    res.status(200).json(newResp);
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};
const countAllContact = async (req, res) => {
  try {
    const data = await Contact.count();
    res.status(200).json(data);
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};
const countAllContactById = async (req, res) => {
  const param = req.params.id;
  try {
    const data = await Contact.count({ where: { userId: param } });
    res.status(200).json(data);
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};

const getByBussinessSource = async (req, res) => {
  const { user } = req;
  //   business source:  [
  //     { count: 4, business_source_type: 'Agent' },
  //     { count: 5, business_source_type: 'Direct' },
  //     { count: 1, business_source_type: 'Sales Person' }
  //   ]
  try {
    const data = await getBussinessSource(user);
    // 
    const totalCount = data.reduce(
      (total, element) => total + element.count,
      0
    );
    // 
    const ratio = data.map((element) => ({
      ...element,
      count: Math.round((element.count / totalCount) * 100)
    }));
    // 

    let formattedResponse = {
      count: ratio?.length,
      rows: ratio
    }
    res.status(200).json(formattedResponse);
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};

const getBussinessSource = async (user) => {
  const employee = await Employee.findOne({ where: { userId: user.id } });
  if (user.role === Role.admin || user.role === Role.superAdmin) {
    return await sequelize.query(
      `SELECT count(*) as count,business_source_type FROM crm.contacts where deleted=false group by business_source_type `,
      { type: QueryTypes.SELECT }
    );
  } else if (user.role === Role.branchManager) {
    return await sequelize.query(
      `SELECT count(*) as count,business_source_type FROM crm.contacts where deleted=false ${employee &&
      employee.branchId !== null &&
      `and branchId=${employee.branchId}`
      } group by business_source_type `,
      { type: QueryTypes.SELECT }
    );
  }
};

const getByBussinessPercent = async (req, res) => {
  const userId = req.user.id;
  try {
    let newArray = [];
    if (req.type == "all") {
      const data = await getBussinessSource();
      const allData = await Contact.count();
      data.map((e) => {
        let count = ((e.count * 100) / allData);
        let business_source_type = e.business_source_type;
        newArray.push({
          business_source_type: business_source_type,
          count: Math.round(count),
        });
      });
      res.status(200).json(data);
    } else if (req.type == "self") {
      const data = await sequelize.query(
        `SELECT count(*) as count,business_source_type FROM crm.contacts where deleted=false and userId = ${userId} group by business_source_type `,
        { type: QueryTypes.SELECT }
      );

      const allData = await Contact.count({ where: { userId: userId } });
      data.map((e) => {
        let count = (e.count * 100) / allData;
        let business_source_type = e.business_source_type;
        newArray.push({
          business_source_type: business_source_type,
          count: Math.round(count),
        });
      });
      res.status(200).json(data);
    } else if (req.type == "branch") {
      
      const user = await User.findByPk(userId, {
        include: [Employee],
      });
      data = await Contact.Count({
        include: [{ model: User, include: [Employee] }, Employee, Department],
        group: ["business_source_type"],
        where: {
          branchId: {
            [Op.like]: `%${user.employee.branchId}%`,
          },
        },
      });
      
      res.status(200).json(data);
    } else if (req.type == "branchAndSelf") {
    }
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};

const getByBussinessPercentById = async (req, res) => {
  const param = req.params.id;
  try {
    let newArraay = [];

    const data = await sequelize.query(
      `SELECT count(*) as count,business_source_type FROM crm.contacts where deleted=false and userId = ${param} group by business_source_type `,
      { type: QueryTypes.SELECT }
    );
    res.status(200).json(data);
    const allData = await Contact.count({ where: { userId: param } });
    data.map((e) => {
      let count = (e.count * 100) / allData;
      let business_source_type = e.business_source_type;
      newArraay.push({
        business_source_type: business_source_type,
        count: Math.round(count),
      });
    });

    res.status(200).json(newArraay);
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};

const getByBussinessSourceById = async (req, res) => {
  const param = req.params.id;
  try {
    const data = await sequelize.query(
      `SELECT count(*) as count,business_source_type FROM crm.contacts where deleted=false and userId = ${param} group by business_source_type `,
      { type: QueryTypes.SELECT }
    );
    res.status(200).json(data);
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};

module.exports = {
  getThisYearCount,
  getNumberOfContacts,
  getCount,
  getByBussinessSource,
  getByBussinessSourceById,
  getThisYearCountById,
  getNumberOfContactsById,
  getByBussinessPercent,
  getByBussinessPercentById,
  getOpportunityByMonth,
};
