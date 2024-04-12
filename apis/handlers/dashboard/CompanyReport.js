const { QueryTypes } = require("sequelize");
const sequelize = require("../../../database/connections");
const Employee = require("../../../models/Employee");
const SalesPerson = require("../../../models/SalesPerson");

const intermideryByType = async (req, res) => {
    try {
        
        const data = await sequelize.query("select count(*) as count , type from crm.sales_persons group by type ", { type: QueryTypes.SELECT })
        res.status(200).json(data)
    }
    catch (error) {
        res.status(400).json({ msg: error.message })
    }
}

module.exports = {
    intermideryByType
}


