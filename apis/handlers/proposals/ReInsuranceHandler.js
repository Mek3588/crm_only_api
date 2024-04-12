const ReInsurance = require("../../../models/proposals/ReInsurance");
const { Op } = require("sequelize");
const {
    canUserCreate,
    canUserEdit,
    canUserDelete,
} = require("../../../utils/Authrizations");
const { eventResourceTypes, eventActions } = require("../../../utils/constants");
const {
    createEventLog,
    getChangedFieldValues,
    getIpAddress,
} = require("../../../utils/GeneralUtils");

const getSearch = (st) => {

    return {
        [Op.or]: [
            { amount: { [Op.like]: `%${st}%` } }
            // { activeFromDate: { [Op.like]: `%${st}%` } },
            // { activeUntilDate: { [Op.like]: `%${st}%` } },
        ],
    };
};

const getReInsurance = async (req, res) => {
    const { f, r, st, sc, sd } = req.query;
    try {
        const data = await ReInsurance.findAndCountAll({
            offset: Number(f),
            limit: Number(r),
            order: [[sc || "createdAt", sd == 1 ? "DESC" : "ASC"]],

            // where: getSearch(st),
            subQuery: false
        });
        
        res.status(200).json(data);
    } catch (error) {
        res.status(400).json({ msg: error.message });
    }
};

const getAllReInsurances = async (req, res) => {
    try {
        const data = await ReInsurance.findAndCountAll();
        res.status(200).json(data);
    } catch (error) {
        res.status(400).json({ msg: error.message });
    }
};

//posting
const createReInsurance = async (req, res) => {
    const reInsuranceBody = req.body;
    

    try {
        const duplicateReInsurance = await ReInsurance.findOne({
            where: {
                category: reInsuranceBody.category,
            },
        });

        if (duplicateReInsurance) {
            return res.status(400).json({ msg: "ReInsurance with this category already exists!" });
        }
        req.userId = req.user.id;
        const reInsurance = await ReInsurance.create(reInsuranceBody);

        if (reInsurance) {
            await createEventLog(
                req.user.id,
                eventResourceTypes.reInsurance,
                `${reInsurance.name}`,
                reInsurance.id,
                eventActions.create,
                "",
                getIpAddress(req.ip)
            );
        }

        res.status(200).json(reInsurance);
    } catch (error) {
        res.status(400).json({ msg: error.message });
    }
};


const createReInsurances = async (req, res) => {
    const reInsuranceBody = req.body;
    const reInsurance = [];
    var duplicate = [];
    var incorrect = [];
    var lineNumber = 2;
    try {

        req.userId = req.user.id
        var promises = reInsuranceBody.map(async (element) => {
            const duplicateName = await ReInsurance.findAll({
                where: { name: element.name },
            });
            if (duplicateName.length > 0) {
                duplicate.push(lineNumber);
            } else if (duplicateName.length == 0) {
                // reInsurance.push(await ReInsurance.create(element));
                try {

                    await ReInsurance.create(element);
                    addedReInsurances += 1;
                } catch (error) {
                    incorrect.push(lineNumber);
                }
            }
            lineNumber = lineNumber + 1;
        });
        Promise.all(promises).then(function (results) {
            let msg = "";
            if (addedReInsurances != 0) {
                msg = msg + `${addedReInsurances} countries added`;
            }
            if (incorrect.length != 0) {
                msg = msg + ` line ${incorrect} has incorrect values`;
            }
            if (duplicate != 0) {
                msg = msg + ` ${duplicate} duplicate found`;
            }
            if (duplicate.length != 0 || incorrect.length != 0) {
                res.status(400).json({ msg: msg });
            } else {
                res.status(200).json({ msg: msg });
            }
        });
        // const reInsurance = await ReInsurance.create(reInsuranceBody);
        // res.status(200).json(reInsurance);
    } catch (error) {
        res.status(400).json({ msg: error.message });
    }
};

const getReInsuranceByPk = async (req, res) => {
    try {
        const reInsurance = await ReInsurance.findByPk(req.params.id).then(function (
            reInsurance
        ) {
            if (!reInsurance) {
                res.status(404).json({ message: "No Data Found" });
            }
            res.status(200).json(reInsurance);
        });

        res.status(200).json(reInsurance);
    } catch (error) {
        res.status(400).json({ msg: error.message });
    }
};



const editReInsurance = async (req, res) => {
    const reqBody = req.body;
    const id = reqBody.id;

    try {
        
        // const duplicateReInsuranceName = await ReInsurance.findAll({
        //     where: { name: reqBody.name },
        // });
        // if (duplicateReInsuranceName.length !== 0)
        //     if (duplicateReInsuranceName[0].id !== reqBody.id) {
        //         res.status(400).json({ msg: "ReInsurance already registered!" });
        //         return;
        //     }
        let oldReInsurance = await ReInsurance.findByPk(id,);
        let updated = await ReInsurance.update(reqBody, { where: { id: id } });

        if (updated) {
            let newReInsurance = await ReInsurance.findByPk(id);
            let changedFieldValues = getChangedFieldValues(oldReInsurance, newReInsurance)
            await createEventLog(
                req.user.id,
                eventResourceTypes.reInsurance,
                `${oldReInsurance.name}`,
                newReInsurance.id,
                eventActions.edit,
                changedFieldValues,
                getIpAddress(req.ip)
            );
        }
        res.status(200).json({ id });
    } catch (error) {
        
        res.status(400).json({ msg: error.message });
    }
};

const deleteReInsurance = async (req, res) => {
    const id = req.params.id;

    try {
        if (!(await canUserDelete(req.user, "reInsurances"))) {
            return res.status(401).json({ msg: "unauthorized access!" });
        }
        let reInsurance = await ReInsurance.findByPk(id, {});
        let deleted = await ReInsurance.destroy({ where: { id: id } });
        if (deleted) {
            await createEventLog(
                req.user.id,
                eventResourceTypes.reInsurance,
                `${reInsurance.name}`,
                reInsurance.id,
                eventActions.delete,
                "",
                getIpAddress(req.ip)
            );
        }
        res.status(200).json({ id });
    } catch (error) {
        res.status(400).json({ msg: error.message });
    }
};

module.exports = {
    getReInsurance,
    getAllReInsurances,
    createReInsurance,
    createReInsurances,
    getReInsuranceByPk,
    editReInsurance,
    deleteReInsurance,

};
