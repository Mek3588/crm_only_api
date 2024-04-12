const Employee = require("../../models/Employee");
const {
  isEmailValid,
  isPhoneNoValid,
  getFileExtension,
  createEventLog,
  getChangedFieldValues,
  getIpAddress,
  isValidDate,
} = require("../../utils/GeneralUtils");
const Branch = require("../../models/Branch");
const Campaign = require("../../models/Campaign");
const User = require("../../models/acl/user");
const { Op } = require("sequelize");
const { QueryTypes } = require("sequelize");
const sequelize = require("../../database/connections");
const Department = require("../../models/Department");
const { eventResourceTypes, eventActions, Role } = require("../../utils/constants");
const Emailcc = require("../../models/EmailCc");
const Document = require("../../models/Document");
const EmailDocument = require("../../models/EmailDocument");
const Email = require("../../models/EmailModel");
const SMSMessage = require("../../models/SMS");

const { sendNewSms, smsFunction } = require("./SMSServiceHandler");
const { sendNewEmail, sendWelcomeEmail } = require("./EmailServiceHandler");
const EmployeeSms = require("../../models/EmployeeSMS");
const EmployeeEmails = require("../../models/EmployeeEmail");
const {
  canUserRead,
  canUserCreate,
  canUserEdit,
  canUserDelete,
  canUserAccessOnlySelf,
  canUserAccessOnlyBranch,
} = require("../../utils/Authrizations");
const EventLog = require("../../models/EventLog");

const getManagerWithBranch = async (user) => {
  
  let employee = await Employee.findOne({ where: { userId: user.id } });
  user.branchId = employee.branchId;
};

const getEmployees = async (req, res) => {
  // if (!(await canUserRead(req.user, "employees"))) {
  //   return res.status(400).json({ msg: "unauthorized access!" });
  // }
  try {
    
    const { f, r, st, sc, sd } = req.query;
    let data = [];
    let user = req.user;

    data = await Employee.findAndCountAll({
      offset: Number(f),
      limit: Number(r),
      order: [[sc || "employeeId", sd == 1 ? "ASC" : "DESC"]],
      include: [Branch, User, Department],
      where: getSearch(st),
    });
    res.status(200).json(data);
  } catch (error) {
    
    res.status(400).json({ msg: error.message });
  }
};

const getAllEmployees = async (req, res) => {
  if (!(await canUserRead(req.user, "employees"))) {
    return res.status(400).json({ msg: "unauthorized access!" });
  }
  try {
    
    //queryparams:  { f: '0', r: '7', st: '', sc: 'first_name', sd: '1' }
    const { f, r, st, sc, sd } = req.query;
    let data = [];
    let user = req.user;
    data = await Employee.findAndCountAll({
      include: [Branch, User, Department],
      order: [[sc || "employeeId", sd == 1 ? "ASC" : "DESC"]],
      where: getSearch(st),
    });
    // }

    res.status(200).json(data);
  } catch (error) {
    
    res.status(400).json({ msg: error.message });
  }
};

const getEmployeebyContact = async (req, res) => {
  const { id } = req.params;

  try {
    if (!(await canUserRead(req.user, "employees"))) {
      return res.status(401).json({ msg: "unauthorized access!" });
    }
    let data = await Employee.findAndCountAll({
      include: [Branch, User, Contact],
      where: {
        "$contacts.id$": id,
        "$user.activated$": 1,
      },
    });
    res.status(200).json(data);
    
  } catch (error) {
    
    res.status(400).json({ msg: error.message });
  }
};

const getActiveEmployees = async (req, res) => {
  console.log("heeeeeeeeeeeeeeeeeeereeeeee", req.user.role)
  try {
    const { f, r, st, sc, sd } = req.query;

    const datas = await Employee.findAndCountAll({
      include: [User],
      offset: Number(f),
      limit: Number(r),
      order: [[sc || "employeeId", sd == 1 ? "ASC" : "DESC"]],
      where: {
        [Op.and]: [{ "$user.activated$": true }, getSearch(st)],
      },
    });
    // let data = await sequelize.query(
    //   "select e.id, e.employeeId, e.gender, e.isActive, e.father_name,e.first_name,e.grandfather_name,e.email,e.position,e.userId,e.phone from  employees e Inner join users u on e.userId = u.id where u.activated = 1 and e.isActive = 1;",
    //   { type: QueryTypes.SELECT }
    // );
console.log("ddataaaaaaaaaaaaaatat", datas.count)
    res.status(200).json(datas);
  } catch (error) {
    
    res.status(400).json({ msg: error.message });
  }
};

const employeeByGroup = async (req, res) => {
  const param = req.params.id;
  try {
    if (!(await canUserRead(req.user, "employees"))) {
      return res.status(401).json({ msg: "unauthorized access!" });
    }
    let data = await sequelize.query(
      `select  id ,e.employeeId, e.gender, e.father_name,e.first_name,e.grandfather_name,e.email,e.position,e.userId,e.phone
          from  crm.employees e
          Inner join crm.users u on e.userId = u.id 
          where u.activated  = 1 and  e.userId not in (
          select userId from crm.user_groups 
          where groupId = ${param}
          )`,
      { type: QueryTypes.SELECT }
    );
    res.status(200).json(data);
  } catch (error) {
    
  }
};

const getSearchResults = async (req, res) => {
  const { key } = req.params;
  try {
    if (!(await canUserRead(req.user, "employees"))) {
      return res.status(401).json({ msg: "unauthorized access!" });
    }
    const results = await Employee.findAll({
      order: [["id", "ASC"]],
      where: {
        [Op.or]: [
          {
            first_name: {
              [Op.like]: "%" + key + "%",
            },
          },
          {
            father_name: {
              [Op.like]: "%" + key + "%",
            },
          },
          {
            gender: {
              [Op.like]: key + "%",
            },
          },
          {
            grandfather_name: {
              [Op.like]: "%" + key + "%",
            },
          },
          {
            email: {
              [Op.like]: "%" + key + "%",
            },
          },
          {
            phone: {
              [Op.like]: "%" + key + "%",
            },
          },
          {
            position: {
              [Op.like]: "%" + key + "%",
            },
          },
          {
            "$branch.name$": {
              [Op.like]: "%" + key + "%",
            },
          },
          {
            "$department.name$": {
              [Op.like]: "%" + key + "%",
            },
          },
        ],
      },
    });
    if (!results) {
      res.status(404).json({ message: "No Data Found" });
    } else res.status(200).json(results);
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};

const filterEmployee = async (req, res) => {
  const key = req.query.key;
  const value = req.query.value;
  try {
    if (!(await canUserRead(req.user, "employees"))) {
      return res.status(401).json({ msg: "unauthorized access!" });
    }
    const employees = await Employee.findAll({
      order: [["id", "ASC"]],
      where: {
        [key]: value,
      },
    });
    if (!employees) {
      res.status(404).json({ message: "No Data Found" });
    } else res.status(200).json(employees);
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};

const getBranchEmployee = async (req, res) => {
  
  // console.log("branchIdbranchIdbranchId===================", )

  try {
    const {branchId} = req.query;
    const role = req.user.role;
    if(role == Role.superAdmin){
      console.log("branchIdbranchIdbranchId", branchId)

      const employees = await Employee.findAll({
        where: { branchId: branchId },
        order: [["employeeId", "ASC"]],

      });
      if (!employees) {
        return res.status(404).json({ message: "No Data Found" });
      } else {
        return res.status(200).json(employees);
      }
    }
    else if (role == Role.staff){
      let emp = await Employee.findOne({ where: { userId: req.user.id } });
      let branchId = await emp.branchId;
      const employees = await Employee.findAll({
        order: [["employeeId", "ASC"]],
        where: { branchId: branchId },
      });
      if (!employees) {
        res.status(404).json({ message: "No Data Found" });
      } else {
      // console.log("branchIdbranchIdbranchId", employees[0])

        res.status(200).json(employees);
      }
    }
  } catch (error) {
    console.log(error)
    res.status(400).json({ msg: error.message });
  }
};

const getEmployeesbyBranch = async (req, res) => {
  try {
    
    const branchId = req.params.id;

    
    const whereCondition = branchId === '0' ? {} : { branchId: branchId };
    
    const employees = await Employee.findAll({
      order: [["createdAt", "ASC"]], 
      where: whereCondition,
      limit: 7, 
    });

    if (!employees || employees.length === 0) {
      res.status(404).json({ message: "No Data Found" });
    } else {
      res.status(200).json(employees);
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Internal Server Error" });
  }
};




//posting
const createEmployee = async (req, res) => {
  const {
    employeeId,
    first_name,
    father_name,
    grandfather_name,
    gender,
    email,
    secondary_email,
    phone,
    secondary_phone,
    position,
    role,
    hiredDate,
    terminationDate,
    grade_level,
    sub_city,
    salutation,
    isActive,
    isDepartmentManager,
    tin_number,
    profile_picture,
    note,
    social_security_no,
    country,
    description_details,
    region,
    city,
    wereda,
    kebele,
    house_no,
    po_box,
    branchId,
    userId,
    departmentId,
  } = req.body;
  const propic = req.file
    ? "uploads/employees/profile_pic/" + req.file.filename
    : "";
  const employeeBody = {
    employeeId: employeeId,
    first_name: first_name,
    father_name: father_name,
    grandfather_name: grandfather_name,
    gender: gender,
    email: email,
    secondary_email: secondary_email,
    phone: phone,
    secondary_phone: secondary_phone,
    position: position,
    role: role,
    hiredDate: hiredDate,
    terminationDate: isValidDate(terminationDate) ? terminationDate : null,
    grade_level: grade_level,
    isActive: isActive,
    isDepartmentManager: isDepartmentManager,
    tin_number: tin_number,
    note: note,
    social_security_no: social_security_no,
    country: country,
    region: region,
    city: city,
    sub_city: sub_city,
    wereda: wereda,
    kebele: kebele,
    house_no: house_no,
    po_box: po_box,
    branchId: branchId,
    userId: userId,
    departmentId: departmentId,
    description_details: description_details,
    salutation: salutation,
    profile_picture: propic,
  };
  if (phone == secondary_phone) {
    res.status(400).json({
      msg: "Primary phone number and secondary phone number cannot be similar",
    });
    return;
  }
  if (email == secondary_email && email != "" && secondary_email != "") {
    res.status(400).json({
      msg: "Primary email and secondary email cannot be similar",
    });
    return;
  }

  try {
    // if (!(await canUserCreate(req.user, "employees"))) {
    //   return res.status(401).json({ msg: "unauthorized access!" });
    // }
    if (!isPhoneNoValid(phone)) {
      res.status(400).json({ msg: "Invalid phone number" });
      return;
    }
    let employeeById = await Employee.findAll({
      where: { employeeId: employeeId },
    });
    let employeeByPhone = await Employee.findAll({
      where: { phone: phone },
    });
    if (employeeById.length > 0) {
      res.status(400).json({ msg: "Employee Id already used" });
      return;
    }
    if (employeeByPhone.length > 0) {
      res.status(400).json({ msg: "Employee Phone already used" });
      return;
    }
    const employee = await Employee.create(employeeBody);
    let ipAddress = getIpAddress(req.ip);
    const eventLog = await createEventLog(
      req.user.id,
      eventResourceTypes.employee,
      `${employee.first_name} ${employee.father_name} ${employee.grandfather_name}`,
      employee.id,
      eventActions.create,
      "",
      ipAddress
    );

    res.status(200).json(employee);
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};

const createEmployees = async (req, res) => {
  const employeeBody = req.body;
  var addedEmployeesNo = 0;
  var duplicate = [];
  var incorrect = [];
  var lineNumber = 1;
  try {
    // if (!(await canUserRead(req.user, "employees"))) {
    //   return res.status(401).json({ msg: "unauthorized access!" });
    // }
    var promises = await employeeBody.map(async (employee) => {
      
      let email = employee.email;
      let phone = employee.phone;
      let employeeId = employee.employeeId;
      const employeeByEmail = await Employee.findOne({ where: { email } });
      const employeeByPhone = await Employee.findOne({ where: { phone } });
      const employeeByEmpId = await Employee.findOne({ where: { employeeId } });
      lineNumber = lineNumber + 1;
      if (!employeeByEmail && !employeeByPhone && !employeeByEmpId) {
        if (isEmailValid(email) && isPhoneNoValid(phone)) {
          try {
            await Employee.create(employee);
            addedEmployeesNo += 1;
          } catch (error) {
            
            incorrect.push(lineNumber);
          }
        } else {
          incorrect.push(lineNumber);
        }
      } else {
        duplicate.push(lineNumber);
      }

    });
    Promise.all(promises).then(function (results) {
      let msg = "";
      if (addedEmployeesNo !== 0) {
        msg = msg + `${addedEmployeesNo} added`;
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

      if (duplicate != 0 || incorrect != 0) {
        res.status(400).json({ msg: msg });
      } else {
        res.status(200).json({ msg: msg });
      }
    });
    // res.status(200).json(employeeBody);
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};

const getEmployee = async (req, res) => {
  // if (!(await canUserRead(req.user, "employees"))) {
  //   return res.status(400).json({ msg: "unauthorized access!" });
  // }
  try {
    const employee = await Employee.findByPk(req.params.id, {
      include: [Branch, User, Department],
    });
    if (!employee) {
      return res.status(400).json({ message: "No Data Found" });
    } else {
      let ipAddress = getIpAddress(req.ip);
      let eventLog = await createEventLog(
        req.user.id,
        eventResourceTypes.employee,
        `${employee.first_name} ${employee.father_name} ${employee.grandfather_name}`,
        employee.id,
        eventActions.view,
        "",
        ipAddress
      );
      res.status(200).json(employee);
    }
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};

const editEmployee = async (req, res) => {
  const {
    employeeId,
    first_name,
    father_name,
    grandfather_name,
    gender,
    email,
    secondary_email,
    phone,
    secondary_phone,
    position,
    role,
    hiredDate,
    terminationDate,
    grade_level,
    sub_city,
    salutation,
    isActive,
    isDepartmentManager,
    tin_number,
    profile_picture,
    note,
    social_security_no,
    country,
    description_details,
    region,
    city,
    wereda,
    kebele,
    house_no,
    po_box,
    branchId,
    userId,
    departmentId,
  } = req.body;

  
  const id = req.params.id;
  const propic = req.file
    ? "uploads/employees/profile_pic/" + req.file.filename
    : profile_picture;
  let employeeBody;
  if (req.file)
    employeeBody = {
      employeeId: employeeId,
      first_name: first_name,
      father_name: father_name,
      grandfather_name: grandfather_name,
      gender: gender,
      email: email,
      secondary_email: secondary_email,
      phone: phone,
      secondary_phone: secondary_phone,
      position: position,
      role: role,
      hiredDate: hiredDate,
      terminationDate: isValidDate(terminationDate) ? terminationDate : null,
      grade_level: grade_level,
      sub_city: sub_city,
      isActive: isActive,
      isDepartmentManager: isDepartmentManager,
      tin_number: tin_number,
      note: note,
      social_security_no: social_security_no,
      country: country,
      region: region,
      city: city,
      wereda: wereda,
      kebele: kebele,
      house_no: house_no,
      po_box: po_box,
      branchId: Number(branchId),
      userId: userId,
      departmentId: departmentId,
      description_details: description_details,
      salutation: salutation,
      profile_picture: propic,
    };
  else {
    employeeBody = {
      ...req.body,
      terminationDate: isValidDate(terminationDate) ? terminationDate : null,
    };
  }

  

  try {
    if (!(await canUserEdit(req.user, "employees"))) {
      return res.status(401).json({ msg: "unauthorized access!" });
    }
    if (!isEmailValid(employeeBody.email)) {
      res.status(400).json({ msg: "invalid email" });
      return;
    }

    if (!isPhoneNoValid(req.body.phone)) {
      res.status(400).json({ msg: "Invalid phone number" });
      return;
    }
    let employeeById = await Employee.findAll({
      where: { employeeId: employeeId },
    });
    let employeeByPhone = await Employee.findAll({
      where: { phone: phone },
    });
    let employeeByEmail = await Employee.findAll({
      where: { email: email },
    });
    if (employeeById.length > 0 && employeeById[0].id !== Number(id)) {
      res.status(400).json({ msg: "Employee Id already used" });
      return;
    }
    if (employeeByPhone.length > 0 && employeeByPhone[0].id !== Number(id)) {
      res.status(400).json({ msg: "Phone Number already used" });
      return;
    }

    if (employeeByEmail.length > 0 && employeeByEmail[0].id !== Number(id)) {
      res.status(400).json({ msg: "Email already used" });
      return;
    }
    let oldEmp = await Employee.findByPk(id, {});
    let userWithSimilarEmail = await User.findOne({
      where: {
        [Op.or]: [{ email: employeeBody.email }, { phone: employeeBody.phone }],
        id: { [Op.not]: oldEmp.userId },
      },
    });
    
    if (userWithSimilarEmail !== null) {
      if (userWithSimilarEmail.email == employeeBody.email) {
        return res
          .status(400)
          .json({ msg: "Other user uses the primary email" });
      }
      if (userWithSimilarEmail.phone == employeeBody.phone) {
        return res
          .status(400)
          .json({ msg: "Other user uses the primary phone" });
      }
    }

    let emp = await Employee.update(employeeBody, { where: { id } });

    if (oldEmp.userId) {
      let updatedUser = await User.update(
        {
          ...employeeBody,
          role: "Staff",
          middle_name: employeeBody.father_name,
          last_name: employeeBody.grandfather_name,
        },
        {
          where: { id: oldEmp.userId },
        }
      );
      let user = await User.findByPk(oldEmp.userId);
      
      sendWelcomeEmail(
        user.email,
        user.first_name + " " + user.middle_name + " " + user.last_name,
        "Profile changed!",
        `Dear ${user.first_name + " " + user.middle_name + " " + user.last_name
        }, your profile is changed. your email is ${user.email
        } and your primary phone is ${user.phone}`
        // + ` To add the event to your calendar, ` + `${finalMeetlink}`
      );

      smsFunction(
        user.phone,
        `Dear ${user.first_name + " " + user.middle_name + " " + user.last_name
        }, your profile is changed. your email is 
        ${user.email} and your primary phone is ${user.phone}`
      );
    }

    
    User.update({ role: emp.role }, { where: { id: emp.userId } });
    if (emp) {
      let updateEmp = await Employee.findByPk(id, {});
      let ipAddress = getIpAddress(req.ip);
      let changedFieldValues = getChangedFieldValues(oldEmp, updateEmp);
      let eventLog = await createEventLog(
        req.user.id,
        eventResourceTypes.employee,
        `${emp.first_name} ${emp.father_name} ${emp.grandfather_name}`,
        updateEmp.id,
        eventActions.edit,
        changedFieldValues,
        ipAddress
      );
    }
    res.status(200).json({ msg: "Employee edited successfully" });
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};

const deleteEmployee = async (req, res) => {
  const id = req.params.id;
  try {
    if (!(await canUserDelete(req.user, "employees"))) {
      return res.status(401).json({ msg: "unauthorized access!" });
    }
    let campaigns = await Campaign.findAll({ where: { employeeId: id } });
    if (campaigns.length > 0) {
      res.status(400).json({ msg: "Employee is in use by campaigns" });
      return;
    }
    let emp = await Employee.findByPk(id);
    Employee.destroy({ where: { id: id } });
    let ipAddress = getIpAddress(req.ip);
    let eventLog = await createEventLog(
      req.user.id,
      eventResourceTypes.employee,
      `${emp.first_name} ${emp.father_name} ${emp.grandfather_name}`,
      emp.id,
      eventActions.edit,
      "",
      ipAddress
    );
    res.status(200).json({ id });
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};

const getSearch = (st) => {
  return {
    [Op.or]: [
      {
        employeeId: {
          [Op.like]: "%" + st + "%",
        },
      },
      {
        first_name: {
          [Op.like]: "%" + st + "%",
        },
      },
      {
        father_name: {
          [Op.like]: "%" + st + "%",
        },
      },
      {
        gender: {
          [Op.like]: st + "%",
        },
      },
      {
        grandfather_name: {
          [Op.like]: "%" + st + "%",
        },
      },
      {
        email: {
          [Op.like]: "%" + st + "%",
        },
      },
      {
        phone: {
          [Op.like]: "%" + st + "%",
        },
      },
      {
        position: {
          [Op.like]: "%" + st + "%",
        },
      },
      // {
      //   "$branch.name$": {
      //     [Op.like]: "%" + st + "%",
      //   },
      // },
      // {
      //   "$department.name$": {
      //     [Op.like]: "%" + st + "%",
      //   },
      // },
    ],
  };
};

const generateReport = async (req, res) => {
  const { f, r, st, sc, sd, purpose } = req.query;

  const pagination = purpose == "export" || {
    offset: Number(f),
    limit: Number(r),
  };

  let {
    genders,
    grade_levels,
    countrys,
    regionIds,
    departmentIds,
    branchIds,
    startDate,
    endDate,
    hiredDate,
    terminationStartDate,
    terminationEndDate,
  } = req.body;
  if (startDate) {
    startDate = new Date(new Date(startDate).setHours(0, 0, 0, 0));
  }
  if (endDate) {
    endDate = new Date(new Date(endDate).setHours(23, 59, 59, 0));
  }
  if (terminationStartDate) {
    terminationStartDate = new Date(
      new Date(terminationStartDate).setHours(0, 0, 0, 0)
    );
  }
  if (terminationEndDate) {
    terminationEndDate = new Date(
      new Date(terminationEndDate).setHours(23, 59, 59, 0)
    );
  }
  let employee;
  const role = req.user.role;

  try {
    if (!(await canUserRead(req.user, "employees"))) {
      return res.status(401).json({ msg: "unauthorized access!" });
    }
    if (
      !(await canUserAccessOnlySelf(req.user, "employees")) &&
      !(await canUserAccessOnlyBranch(req.user, "employees"))
    ) {
      const adminConditions = {
        [Op.and]: [
          grade_levels && grade_levels.length !== 0
            ? {
              grade_level: {
                [Op.in]: grade_levels.map((grade_level) => grade_level.name),
              },
            }
            : {},
          genders.length !== 0
            ? {
              gender: {
                [Op.in]: genders.map((gender) => gender.name),
              },
            }
            : {},
          countrys && countrys.length !== 0
            ? {
              country: {
                [Op.in]: countrys.map((country) => country.name),
              },
            }
            : {},
          regionIds && regionIds.length !== 0
            ? {
              region: {
                [Op.in]: regionIds.map((region) => region),
              },
            }
            : {},
          departmentIds && departmentIds.length !== 0 && departmentIds[0] !== 0
            ? {
              departmentId: {
                [Op.in]: departmentIds,
              },
            }
            : {},
          branchIds && branchIds.length !== 0 && branchIds[0] !== 0
            ? {
              branchId: {
                [Op.in]: branchIds,
              },
            }
            : {},
          startDate ? { hiredDate: { [Op.gte]: startDate } } : {},
          endDate ? { hiredDate: { [Op.lte]: endDate } } : {},
          terminationStartDate
            ? { terminationDate: { [Op.gte]: terminationStartDate } }
            : {},
          terminationEndDate
            ? { terminationDate: { [Op.lte]: terminationEndDate } }
            : {},
        ],
      };

      const conditions = adminConditions;
      employee = await Employee.findAndCountAll({
        include: [Branch, User, Department],
        order: [[sc || "employeeId", sd == 1 ? "ASC" : "DESC"]],
        where: {
          ...conditions,
          ...getSearch(st),
        },
        ...pagination,
      });
    }

    if (await canUserAccessOnlyBranch(req.user, "employees")) {
      const branchManagerConditions = {
        [Op.and]: [
          grade_levels.length !== 0
            ? {
              grade_level: {
                [Op.in]: grade_levels.map((grade_level) => grade_level.name),
              },
            }
            : {},
          genders.length !== 0
            ? {
              gender: {
                [Op.in]: genders.map((gender) => gender.name),
              },
            }
            : {},
          countrys.length !== 0
            ? {
              country: {
                [Op.in]: countrys.map((country) => country.name),
              },
            }
            : {},
          regionIds.length !== 0
            ? {
              region: {
                [Op.in]: regionIds.map((region) => region),
              },
            }
            : {},
          departmentIds && departmentIds.length !== 0 && departmentIds[0] !== 0
            ? {
              departmentId: {
                [Op.in]: departmentIds,
              },
            }
            : {},
          branchIds && branchIds.length !== 0 && branchIds[0] !== 0
            ? {
              branchId: {
                [Op.in]: branchIds,
              },
            }
            : {},
        ],
      };
      employee = await Employee.findAll({
        include: [Branch, User, Employee],
        order: [[sc || "employeeId", sd == 1 ? "ASC" : "DESC"]],
        where: {
          conditions,
          branchId: req.user.branchId,
          ...branchManagerConditions,
          ...getSearch(st),
        },
      });
    }
    if (!employee) {
      res.status(404).json({ message: "No Data Found" });
    } else res.status(200).json(employee);
  } catch (error) {
    
    res.status(400).json({ msg: error.message });
  }
};

// const sendEmail = async (req, res) => {
//   const body = req.body;
//   try {
//     console.log("sendEMAIL------------", body);
//     let documents;
//     const employee = await Employee.findAll({
//       where: { id: { [Op.in]: [body.employees] } },
//     });
//     if (employee) {
//       if (body.documents != null) {
//         documents = await Document.findAll({
//           attributes: ["name", "document"],
//           where: { id: { [Op.in]: [body.documents] } },
//         });
//         documents.map((e) => {
//           let ext = getFileExtension(e.document);
//           e.name = e.name + "." + ext;
//         });

//         let newDocument = [];
//         if (req.files != null) {
//           req.files.map((e) => {
//             console.log(" e.originalname", e.originalname);
//             let doc = {
//               name: e.originalname,
//               type: "Email Attachment",
//               document: "/uploads/" + e.filename,
//               userId: body.userId,
//             };
//             newDocument.push(doc);
//           });

//           await Array.prototype.push.apply(
//             documents,
//             newDocument.map(({ type, ...rest }) => {
//               return rest;
//             })
//           );
//         }
//         const sendTo = [];
//         employee.map((e) => {
//           if (body.emailType) {
//             if (body.emailType.length == 0) {
//               sendTo.push(e.primaryEmail);
//             }
//             if (body.emailType.find((element) => element == "primaryEmail")) {
//               sendTo.push(e.primaryEmail);
//             }
//             if (body.emailType.find((element) => element == "secondaryEmail")) {
//               sendTo.push(e.secondaryEmail);
//             }
//           } else {
//             sendTo.push(e.primaryEmail);
//           }
//         });
//         const splitData = body.emailccs.split(",");
//         const emails = splitData.map((e) => {
//           return { email: e };
//         });
//         const newEmail = {
//           userId: body.userId,
//           subject: body.subject,
//           message: body.message,
//           emailccs: emails,
//           documents: newDocument,
//         };
//         let from = req.user ? req.user.email : "";
//         await sendNewEmail(
//           sendTo,
//           emails,
//           body.subject,
//           body.message,
//           documents,
//           from
//         ).then((sentEmail) => {
//           try {
//             if (sentEmail >= 1) {
//               const email = Email.create(newEmail, {
//                 include: [Emailcc, Document],
//               }).then((email) => {
//                 try {
//                   email.addEmployees(body.employees.map(Number), {
//                     through: EmployeeEmails,
//                   });
//                   body.documents != null &&
//                     email.addDocuments(body.documents, {
//                       through: EmailDocument,
//                     });
//                 } catch (error) {
//                   res.status(400).json({ msg: "Email not stored" });
//                 }
//               });
//               res.status(200).json(email);
//             } else {
//               res.status(200).json({ msg: "Email not sent" });
//             }
//           } catch (error) {
//             res.status(400).json({ msg: error.message });
//           }
//         });
//       }
//     } else {
//       res.status(400).json({ msg: "Employee not found" });
//     }
//   } catch (error) {
//     res.status(400).json({ msg: error.message });
//   }
// };
const sendEmail = async (req, res) => {
  const body = req.body;
  try {
    
    let documents;
    const employee = await Employee.findAll({
      where: { id: { [Op.in]: [body.employees] } },
    });
    console.log("sendEMAIL employee------------", employee);
    if (employee) {
      if (body.documents != null) {
        documents = await Document.findAll({
          attributes: ["name", "document"],
          where: { id: { [Op.in]: [body.documents] } },
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
        employee.map((e) => {
          if (body.email) {
            if (body.emailType.length == 0) {
            if (e.email) {
              sendTo.push(e.email);
            }
          }
            if (body.emailType.find((element) => element == 'primaryEmail')) {
              console.log("primaryEmai------------", e.email);

            if (e.email) {
              sendTo.push(e.email);
            }
          }
            if (body.emailType.find((element) => element == "secondaryEmail")) {
            if (e.secondaryEmail) {
              sendTo.push(e.secondaryEmail);
            }
          }
          } else {
          if (e.email) {
            sendTo.push(e.email);
          }
        }
        });
        console.log("sendTo------------", sendTo);
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
      const employees = body.employees.map(Number);
        const newEmail = {
          userId: body.userId,
          subject: body.subject,
          message: body.message,
          emailccs: emails,
          documents: newDocument,
        };
      if (sendTo.length != 0) {
        let from = req.user ? req.user.email : "";
        await sendNewEmail(
          sendTo,
          emails,
          body.subject,
          body.message,
          documents,
          from
        ).then((sentEmail) => {
          try {
            if (sentEmail >= 1) {
              const email = Email.create(newEmail, {
                include: [Emailcc, Document],
              }).then((email) => {
                try {
                  email.addEmployees(employees, {
                    through: EmployeeEmails,
                  });
                  body.documents != null &&
                    email.addDocuments(body.documents, {
                      through: EmailDocument,
                    });
                } catch (error) {
                    console.log("error during create ", error);
                }
              });
              res.status(200).json(email);
            } else {
              res.status(200).json({ msg: "Email not sent" });
            }
          } catch (error) {
            console.log("error was----->", error);
            res.status(400).json({ msg: error.message });
          }
        });
      } else {
        res.status(400).json({ msg: "Email can not be empty" });
      }
    }
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};

const toggleActivation = async (req, res) => {
  const { userId } = req.params;
  try {
    let user = await User.findByPk(userId);
    await User.update(
      { activated: !user.activated },
      { where: { id: userId } }
    );
    let data = await Employee.findOne({
      where: { userId: userId },
      include: [User],
    });
    await Employee.update(
      { isActive: !data.isActive },
      { where: { userId: userId } }
    );
    data = await Employee.findOne({
      where: { userId: userId },
      include: [User],
    });
    res.status(200).json(data);
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};

const sendSMS = async (req, res) => {
  const body = req.body;
  try {
    
    const employee = await Employee.findAll({
      where: { id: { [Op.in]: body.employees } },
    });
    const sendTo = [];
    
    if (employee) {
      employee.map((e) => {
        
        // if (body.phoneType.length == 0) {
          sendTo.push(e.phone);
        // }
        // if (body.phoneType.find((element) => element == "primaryPhone")) {
        //   sendTo.push(e.phone);
        // }
        // if (body.phoneType.find((element) => element == "secondaryPhone")) {
        //   sendTo.push(e.secondary_phone);
        // }
      });
      return await sendNewSms(sendTo, body.content).then((sent) => {
        if (sent.status == 200) {
          try {
            const sms = SMSMessage.create(body).then((sms) => {
              sms.addEmployees(body.employees, { through: EmployeeSms });
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

const getEmail = async (req, res) => {
  const body = req.params.id;
  try {
    const sms = await Email.findAll({
      include: [User, Employee, Document, Emailcc],
      order: [["createdAt", "DESC"]],
      where: { "$employees.id$": { [Op.like]: body } },
    });
    res.status(200).json({ rows: sms });
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};

const getSMS = async (req, res) => {
  const body = req.params.id;
  try {
    const { f, r, st, sc, sd } = req.query;
    const sms = await SMSMessage.findAndCountAll({
      include: [{ model: User, attributes: ['id', 'corporate_name', 'first_name', 'middle_name', 'last_name', 'email', 'phone', 'gender'] }, Employee],
      where: { "$employees.id$": { [Op.like]: body } },
      offset: Number(f),
      limit: Number(r),
      order: [[sc || "createdAt", sd == 1 ? "DESC" : "ASC"]],
      // where: getSearch(st),
      subQuery: false,
    });
    res.status(200).json(sms);
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};


module.exports = {
  getEmployees,
  getSearchResults,
  generateReport,
  createEmployee,
  createEmployees,
  getEmployee,
  editEmployee,
  deleteEmployee,
  getEmployeebyContact,
  getActiveEmployees,
  employeeByGroup,
  getManagerWithBranch,
  filterEmployee,
  getBranchEmployee,
  toggleActivation,
  getEmail,
  getSMS,
  sendEmail,
  sendSMS,
  getAllEmployees,
  getEmployeesbyBranch,
};
