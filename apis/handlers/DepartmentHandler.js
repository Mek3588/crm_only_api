const { Op } = require("sequelize");
const Department = require("../../models/Department");
const Employee = require("../../models/Employee");
// const {
//   canUserRead,
//   canUserCreate,
//   canUserEdit,
//   canUserDelete,
// } = require("../../utils/Authrizations");
const { eventResourceTypes, eventActions } = require("../../utils/constants");
const {
  createEventLog,
  getChangedFieldValues,
  getIpAddress,
} = require("../../utils/GeneralUtils");

const getDepartment = async (req, res) => {
  try {
    // if (!(await canUserRead(req.user, "departments"))) {
    //   return res.status(401).json({ msg: "unauthorized access!" });
    // }
    const { f, r, st, sc, sd } = req.query;
    const data = await Department.findAndCountAll({
      offset: Number(f),
      limit: Number(r),
      order: sc
        ? [[sc, sd == 1 ? "ASC" : "DESC"]]
        : [["createdAt", sd == 1 ? "DESC" : "ASC"]],
      where: getSearch(st),
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
        description: {
          [Op.like]: "%" + st + "%",
        },
      },
    ],
  };
};

const getDepartmentPopUp = async (req, res) => {
  try {
    // if (
    //   (await canUserRead(req.user, "departments")) ||
    //   (await canUserRead(req.user, "competitors")) ||
    //   (await canUserRead(req.user, "partners")) ||
    //   (await canUserRead(req.user, "shareholders")) ||
    //   (await canUserRead(req.user, "vendors")) ||
    //   (await canUserRead(req.user, "employees"))
    // ) {
      const { f, r, st, sc, sd } = req.query;
      const data = await Department.findAndCountAll({
        offset: Number(f),
        limit: Number(r),
        order: sc
          ? [[sc, sd == 1 ? "ASC" : "DESC"]]
          : [["createdAt", sd == 1 ? "DESC" : "ASC"]],
        where: {
          [Op.and]: [
            { isActive: { [Op.like]: true } },
            getSearch(st),
            //  { "$departments.id$": { [Op.like]: "$user.employee.departmentId$"} },
          ],
        },
      });
      res.status(200).json(data);
    // } else {
    //   return res.status(401).json({ msg: "unauthorized access!" });
    // }
  } catch (error) {
    
    res.status(400).json({ msg: error.message });
  }
};

const getAllDepartments = async (req, res) => {
  try {
    // if (!(await canUserRead(req.user, "departments"))) {
    //   return res.status(401).json({ msg: "unauthorized access!" });
    // }
    const data = await Department.findAndCountAll({ include: Employee });
    res.status(200).json(data);
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};
//posting
const createDepartment = async (req, res) => {
  const departmentBody = req.body;
  try {
    // if (!(await canUserCreate(req.user, "departments"))) {
    //   return res.status(401).json({ msg: "unauthorized access!" });
    // }
    const duplicateName = await Department.findAll({
      where: { name: departmentBody.name },
    });
    if (duplicateName.length > 0) {
      res.status(400).json({ msg: "Department name already used!" });
      return;
    }
    const department = await Department.create(departmentBody);
    if (department) {
      let ipAddress = getIpAddress(req.ip);
      const eventLog = await createEventLog(
        req.user.id,
        eventResourceTypes.department,
        `${department.name} `,
        department.id,
        eventActions.create,
        "",
        ipAddress
      );
    }
    res.status(200).json(department);
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};

const createDepartments = async (req, res) => {
  const departmentBody = req.body;
  var addedEmployeesNo = 0;
  var rejectedEmployeesNo = 0;
  var duplicate = [];
  var incorrect = [];
  var lineNumber = 2;
  try {
    // if (!(await canUserCreate(req.user, "departments"))) {
    //   return res.status(401).json({ msg: "unauthorized access!" });
    // }
    var promises = await departmentBody.map(async (department) => {
      const duplicateName = await Department.findAll({
        where: { name: department.name },
      });
      if (duplicateName.length > 0) {
        duplicate.push(lineNumber);
      } else {
        try {
          await Department.create(department);
          addedEmployeesNo += 1;
        } catch (error) {
          incorrect.push(lineNumber);
        }
      }
      lineNumber = lineNumber + 1;
    });
    Promise.all(promises).then(function (results) {
      let msg = "";
      if (addedEmployeesNo != 0) {
        msg = msg + `${addedEmployeesNo} departments added`;
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
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};

const getDepartmentByPk = async (req, res) => {
  try {
    // if (!(await canUserRead(req.user, "departments"))) {
    //   return res.status(401).json({ msg: "unauthorized access!" });
    // }
    const department = await Department.findByPk(req.params.id, {
      include: Employee,
    }).then(function (department) {
      if (!department) {
        res.status(404).json({ message: "No Data Found" });
      } else if (department) {
        let ipAddress = getIpAddress(req.ip);
        const eventLog = createEventLog(
          req.user.id,
          eventResourceTypes.department,
          `${department.name} `,
          department.id,
          eventActions.view,
          "",
          ipAddress
        );
        res.status(200).json(department);
      }
    });

    // res.status(200).json(department);
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};

const editDepartment = async (req, res) => {
  const departmentBody = req.body;
  const id = req.params.id;

  try {
    // if (!(await canUserEdit(req.user, "departments"))) {
    //   return res.status(401).json({ msg: "unauthorized access!" });
    // }
    const duplicateName = await Department.findAll({
      where: { name: departmentBody.name },
    });
    if (duplicateName.length !== 0) {
      if (duplicateName[0].id !== departmentBody.id) {
        res.status(400).json({ msg: "Department name already used!" });
        return;
      }
    }
    let oldDept = Department.findByPk(id, {});
    let dept = Department.update(departmentBody, { where: { id: id } });

    if (dept) {
      let newDept = Department.findByPk(id, {});
      let changedFieldValues = getChangedFieldValues(oldDept, newDept);
      let ipAddress = getIpAddress(req.ip);
      const eventLog = createEventLog(
        req.user.id,
        eventResourceTypes.department,
        `${oldDept.name} `,
        newDept.id,
        eventActions.edit,
        changedFieldValues,
        ipAddress
      );
    }

    res.status(200).json({ id });
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};

const handleDepartmentActivation = async (req, res) => {
  const departmentBody = req.body;
  const id = req.params.id;

  try {
    // if (!(await canUserEdit(req.user, "departments"))) {
    //   return res.status(401).json({ msg: "unauthorized access!" });
    // }
    const dept = await Department.findByPk(req.params.id);
    const data = await Department.update(
      { isActive: !dept.isActive },
      { where: { id: id } }
    );
    res.status(200).json(data);
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};

const deleteDepartment = async (req, res) => {
  const id = req.params.id;
  try {
    // if (!(await canUserDelete(req.user, "departments"))) {
    //   return res.status(401).json({ msg: "unauthorized access!" });
    // }
    let department = await Department.findByPk(id, {});
    let dept = await Department.destroy({ where: { id: id } });
    if (dept) {
      let ipAddress = getIpAddress(req.ip);
      const eventLog = createEventLog(
        req.user.id,
        eventResourceTypes.department,
        `${department.name} `,
        department.id,
        eventActions.delete,
        "",
        ipAddress
      );
    }
    res.status(200).json({ id });
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};

module.exports = {
  getDepartment,
  createDepartment,
  createDepartments,
  getDepartmentByPk,
  editDepartment,
  deleteDepartment,
  getDepartmentPopUp,
  getAllDepartments,
  handleDepartmentActivation,
};
