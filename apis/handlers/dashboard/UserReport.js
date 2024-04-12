const User = require("../../../models/acl/user");
const { Op, QueryTypes } = require("sequelize");
const { Role } = require("../../../utils/constants");
const Employee = require("../../../models/Employee");
const SalesPerson = require("../../../models/SalesPerson");
const sequelize = require("../../../database/connections");

const getNumberOfUsers = async (req, res) => {
  const { user } = req;
  
  try {
    const numberOfUsers = {
      totalUsers: 0,
      superAdmin: 0,
      customers: 0,
      staff: 0,
      agent: 0,
      broker: 0
    };

    // numberOfUsers.totalUsers = await User.count({where:{role : {[Op.ne]: Role.superAdmin}}});
    // numberOfUsers. employees = await Employee.count({  include: User, where: {"$user.activated$": 1}})
    // numberOfUsers.customers = await User.count({ where: { role: Role.customer } })
    // numberOfUsers.intermediaries = await SalesPerson.count({include: User,where: { "$user.activated$": 1}})
    if (req.user.role == Role.superAdmin) {
      numberOfUsers.totalUsers = await User.count({
        where: { activated: true },
      });


      numberOfUsers.customers = await User.count({
        where: {
          role: Role.customer,
          activated: true,
        },
      });
      numberOfUsers.agent = await User.count({
        where: {
          role: Role.agent,
          activated: true,
        },
      });
      numberOfUsers.broker = await User.count({
        where: {
          role: Role.broker,
          activated: true,
        },
      });
      numberOfUsers.staff = await User.count({
        where: {
          role: "Staff",
          activated: true,
        },
      });
      numberOfUsers.superAdmin = await User.count({
        where: {
          role: Role.superAdmin,
          activated: true,
        },
      });
    } else if (user.role === Role.branchManager) {
      currentUser = req.user;
      numberOfUsers.totalUsers = await User.count({
        where: {
          [Op.and]: [
            currentUser.employee ? {
              "$user.employee.branchId$": {
                [Op.like]: `%${currentUser.employee.branchId}%`,
              },
            } : null,
            { activated: true },
          ],
        },
      });

      numberOfUsers.customers = await User.count({
        where: {
          [Op.and]: [
            currentUser.employee ?? {
              "$user.employee.branchId$": {
                [Op.like]: `%${currentUser.employee.branchId}%`,
              },
            },
            { role: Role.customer },
            { activated: true },
          ],
        },
      });
      numberOfUsers.agent = await User.count({
        where: {
          [Op.and]: [
            currentUser.employee ?? {
              "$user.employee.branchId$": {
                [Op.like]: `%${currentUser.employee.branchId}%`,
              },
            },
            { role: Role.agent },
            { activated: true },
          ],
        },
      });
      numberOfUsers.broker = await User.count({
        where: {
          [Op.and]: [
            currentUser.employee ?? {
              "$user.employee.branchId$": {
                [Op.like]: `%${currentUser.employee.branchId}%`,
              },
            },
            { role: Role.broker },
            { activated: true },
          ],
        },
      });
      numberOfUsers.staff = await User.count({
        where: {
          [Op.and]: [
            currentUser.employee ?? {
              "$user.employee.branchId$": {
                [Op.like]: `%${currentUser.employee.branchId}%`,
              },
            },
            { role: "Staff" },
            { activated: true },
          ],
        },
      });
      // const employeeUsers = await sequelize.query(
      //   `select users.id as userId, employees.id as empId, users.role from employees join users on employees.userId=users.id
      //        where employees.branchId = (select branchId from employees where userId = ${user.id})`,
      //   { type: QueryTypes.SELECT }
      // );
      // const customerUsersCount = await sequelize.query(
      //   `select count(*) as count from(select users.id as userId, contacts.id as contactId from contacts join users on contacts.userId = users.id where contacts.branchId=(
      //       select branchId from contacts where userId=${user.id})) as amount`,
      //   { type: QueryTypes.SELECT }
      // );

      // const salesUsers = employeeUsers.filter(
      //   (salesUser) => salesUser.role === Role.sales
      // );
      // 
      // const branchManagerUsers = employeeUsers.filter(
      //   (branchManagerUser) => branchManagerUser.role === Role.branchManager
      // );
      // 
      // numberOfUsers.totalUsers =
      //   customerUsersCount[0].count + employeeUsers.length;
      // numberOfUsers.employees = salesUsers.length;
      // numberOfUsers.branchManagers = branchManagerUsers.length;
      // numberOfUsers.customers = customerUsersCount[0].count;
    }
    
    res.status(200).json(numberOfUsers);
  } catch (error) {
    
    res.status(400).json({ msg: error.message });
  }
};

module.exports = { getNumberOfUsers };
