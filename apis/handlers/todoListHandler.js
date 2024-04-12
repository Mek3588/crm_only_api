const { Op } = require("sequelize");
const TodoList = require("../../models/TodoList");


const getTodoList = async (req, res) => {
    try {
        const { f, r, st, sc, sd, type } = req.query;
        const data = await TodoList.findAndCountAll({
            // offset: Number(f),
            // limit: Number(r),
            order: sc
                ? [[sc, sd == 1 ? "ASC" : "DESC"]]
                : [["createdAt", sd == 1 ? "DESC" : "ASC"]],
           
        });
        res.status(200).json(data);
    } catch (error) {
        res.status(400).json({ msg: error.message });
    }
}

const getTodoListById = async (req, res) => {
    const id = req.params.id;
    try {
        const todoList = await TodoList.findByPk(id);
        return res.status(200).json(todoList);
    } catch (error) {
        res.status(400).json({ msg: error.message });
    }
}

const getTodoListByCustomerId = async (req, res) => {
    const id = req.params.id;
    try {
        const todoList = await TodoList.findAll({ where: { customerId: id } });
        return res.status(200).json(todoList);
    } catch (error) {
        res.status(400).json({ msg: error.message });
    }
}

const getSearch = (st) => {
    return {
        [Op.or]: [
            {
                taskName: {
                    [Op.like]: "%" + st + "%",
                },
            },
        ],
    };
};

const createTodoList = async (req, res) => {
    const todoListBody = req.body;
    
    try {
        const todoList = await TodoList.create(todoListBody);
        return res.status(200).json(todoList);
    } catch (error) {
        res.status(400).json({ msg: error.message });
    }
}

const updateTodoList = async (req, res) => {
    const todoListBody = req.body;
    
    try {
        const todoList = await TodoList.update(todoListBody, { where: { id: todoListBody.id } });
        return res.status(200).json(todoList);
    } catch (error) {
        res.status(400).json({ msg: error.message });
    }
}

const deleteTodoList = async (req, res) => {
    const todoListBody = req.body;
    
    try {
        const todoList = await TodoList.destroy({ where: { id: todoListBody.id } });
        return res.status(200).json(todoList);
    } catch (error) {
        res.status(400).json({ msg: error.message });
    }
}

module.exports = {
    getTodoList,
    getTodoListById,
    getTodoListByCustomerId,
    createTodoList,
    updateTodoList,
    deleteTodoList
};