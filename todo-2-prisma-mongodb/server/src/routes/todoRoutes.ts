import { Router } from "express";

import {
  getTodos,
  createTodo,
  updateTodo,
  deleteTodo,
} from "../controllers/todoController";

const router = Router();

// GET - View all todos
router.get("/", getTodos);

// POST - Add todo
router.post("/", createTodo);

// PUT - Edit todo
router.put("/:id", updateTodo);

// DELETE - Delete todo
router.delete("/:id", deleteTodo);

export default router;
