const express = require("express");
const router = express.Router();
const protectedRoute = require("./middlewares/protectedRoute");

const {
    getTodoList,
    getTodoListById,
    getTodoListByCustomerId,
    createTodoList,
    updateTodoList,
    deleteTodoList
} = require("./handlers/todoListHandler");

router.route("/").get(protectedRoute, getTodoList);
router.route("/:id").get(protectedRoute, getTodoListById);
router.route("/:id").get(protectedRoute, getTodoListByCustomerId);
router.route("/").post(protectedRoute, createTodoList);
router.route("/:id").put(protectedRoute, updateTodoList);
router.route("/:id").delete(protectedRoute, deleteTodoList);

module.exports = router;