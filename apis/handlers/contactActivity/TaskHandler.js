const Task = require("../../../models/contactActivity/ContactTask");
const User = require("../../../models/acl/user");
const Contact = require("../../../models/Contact");
const Employee = require("../../../models/Employee");
const ContactTaskEmployee = require("../../../models/ContactTaskEmployee");
const { Op } = require("sequelize");
const moment = require("moment");
const { QueryTypes } = require("sequelize");
const sequelize = require("../../../database/connections");
const ContactActivityUpdate = require("../../../models/contactActivity/ContactActivityUpdateHistory");
const {
  createEventLog,
  getIpAddress,
  getChangedFieldValues,
} = require("../../../utils/GeneralUtils");
const {
  eventResourceTypes,
  eventActions,
} = require("../../../utils/constants");
const getTask = async (req, res) => {
  try {
    const data = await Task.findAll({
      include: [{
        model: User, attributes: ['id', 'corporate_name', 'first_name', 'middle_name', 'last_name', 'email', 'phone', 'gender']
      }, Employee]
    });
    res.status(200).json(data);
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};
// const TODAY_START = new Date().setHours(0, 0, 0, 0);
// const NOW = new Date().setHours(0, 0, 0, 0);
//get today tasks;
const getTodayTasks = async (req, res) => {
  const TODAY_START = moment().format("YYYY-MM-DD 00:00");
  
  const NOW = moment().format("YYYY-MM-DD 23:59");
  try {
    const data = await Task.findAll({
      include: [{ model: Contact, as: "contact" }],
      where: {
        userId: req.user.id,
        createdAt: {
          [Op.gte]: TODAY_START,
          [Op.lt]: NOW,
        },
      },
    });
    res.status(200).json(data);
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};

const getTaskByUser = async (req, res) => {
  const id = req.params.id;
  const startDate = new Date();
  const endDate = new Date();
  
  
  const today = moment();
  // 
  try {
    let data = await sequelize.query(
      `select * from crm.contact_tasks t inner join crm.contact_taskes_employees et on et.contactTaskId = t.id inner join crm.employees e on e.id = et.employeeId where e.userId=${id} and day(dueDate)= day(CURDATE()) and month(dueDate)=month(CURDATE()) and year(dueDate)=year(CURDATE());`,
      { type: QueryTypes.SELECT }
    );
    res.status(200).json(data);
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};

const getTaskByContact = async (req, res) => {
  const { target, id } = req.params;
  try {
    
    const data = await Task.findAll({
      include: [{
        model: User, attributes: ['id', 'corporate_name', 'first_name', 'middle_name', 'last_name', 'email', 'phone', 'gender']
      }],
      where: { targetId: id, target },
      order: [
        ["id", "DESC"],
        ["createdDate", "ASC"],
      ],
    });
    res.status(200).json(data);
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};

const createTask = async (req, res) => {
  const taskBody = req.body;
  try {
    const task = await Task.create(taskBody);
    res.status(200).json(task);
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};

const getTaskByPk = async (req, res) => {
  try {
    const task = await Task.findByPk(req.params.id, {
      include: [{
        model: User, attributes: ['id', 'corporate_name', 'first_name', 'middle_name', 'last_name', 'email', 'phone', 'gender']
      }, Employee],
    }).then(function (Task) {
      if (!Task) {
        res.status(400).json({ message: "No Data Found" });
      } else {
        res.status(200).json(Task);
      }
    });
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};

const editTask = async (req, res) => {
  const task = req.body;
  const id = req.body.id;

  try {
    
    const savedTask = await Task.findByPk(id);
    await Task.update(task, { where: { id: id } }).then(async function (
      taskId
    ) {
      const tasks = await Task.findByPk(id);
      if (task.employees.length != 0) {
        await tasks.setEmployees(task.employees, {
          through: ContactTaskEmployee,
        });
      }

      //Task Date history
      if (task.dueDate !== savedTask.dueDate)
        await ContactActivityUpdate.create({
          userId: req.user.id,
          contactId: savedTask.contactId,
          activity: "Task",
          attribute: "Due Date",
          previous_status: savedTask.dueDate,
          current_status: task.dueDate,
        });

      //Task task history
      if (task.task !== savedTask.task)
        await ContactActivityUpdate.create({
          userId: req.user.id,
          contactId: savedTask.contactId,
          activity: "Task",
          attribute: "Task",
          previous_status: savedTask.task,
          current_status: task.task,
        });

      //Task note history
      if (task.note !== savedTask.note)
        await ContactActivityUpdate.create({
          userId: req.user.id,
          contactId: savedTask.contactId,
          activity: "Task",
          attribute: "Note",
          previous_status: savedTask.note,
          current_status: task.note,
        });
    });
    const updatedTask = await Task.findByPk(id);
    const changedFieldValues = getChangedFieldValues(
      savedMeeting,
      foundMeeting
    );
    const value =
      updatedTask.target == "account" || updatedTask.target == "lead"
        ? await Contact.findByPk(updatedTask.targetId)
        : updatedTask.target == "opportunity"
          ? await Opportunity.findByPk(updatedTask.targetId)
          : await CompanyContact.findByPk(updatedTask.targetId);
    const name =
      updatedTask.target == "account" || updatedTask.target == "lead"
        ? value.firstName ?? value.companyName
        : updatedTask.target == "opportunity"
          ? value.subject
          : value.firstName;

    res.status(200).json({ id });
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};

const deleteTask = async (req, res) => {
  const id = req.params.id;

  try {
    await Task.destroy({ where: { id: id } });

    res.status(200).json({ id });
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};

module.exports = {
  getTask,
  createTask,
  getTaskByPk,
  editTask,
  getTaskByContact,
  getTaskByUser,
  deleteTask,
  getTodayTasks,
};
