const express = require("express");

const router = express.Router();

const {
  createTodo,
  getTodos,
  updateTodo,
  deleteTodo,
} = require("../controllers/todoController");

// GET - List all todos
router.get("/", getTodos);

// POST - Add new todo
router.post("/", createTodo);

// PUT - Update todo
router.put("/:id", updateTodo);

// DELETE - Delete todo
router.delete("/:id", deleteTodo);

module.exports = router;
