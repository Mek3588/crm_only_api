const Sequelize = require("sequelize");

const sequelize = new Sequelize(
  process.env.DATABASE,
  process.env.DATABASE_USER,
  process.env.DATABASE_PASSWORD,
  {
    host: process.env.HOST,
    dialect: "mysql",//process.env.DIALECT,
    logging: false
  }
);
// const authenticated = async () => {
//   try {
//     await sequelize.authenticate();
//     
//   } catch (error) {
//     
//   }
// };
// authenticated();
module.exports = sequelize;
global.exports = sequelize;
