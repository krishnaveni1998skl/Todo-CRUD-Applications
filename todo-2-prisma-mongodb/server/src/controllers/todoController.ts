import type { Request, Response } from "express";
import { db } from "../prisma/db";

// GET - Get all todos
export const getTodos = async (_req: Request, res: Response) => {
  try {
    const todos = await db.orm.todos.all();
    res.status(200).json(todos);
  } catch (error) {
    console.error("Get Todos Error:", error);
    res.status(500).json({ message: "Failed to fetch todos" });
  }
};

// POST - Create a todo
export const createTodo = async (req: Request, res: Response) => {
  try {
    const { title, description } = req.body;

    if (!title || typeof title !== "string" || !title.trim()) {
      res.status(400).json({ message: "Title is required" });
      return;
    }

    const todo = await db.orm.todos.create({
      title: title.trim(),
      description: description?.trim() || null,
      completed: false,
    });

    res.status(201).json({
      message: "Todo created successfully",
      todo,
    });
  } catch (error) {
    console.error("Create Todo Error:", error);
    res.status(500).json({ message: "Failed to create todo" });
  }
};

// PUT - Update a todo
export const updateTodo = async (req: Request, res: Response) => {
  try {
    
    const { title, description, completed } = req.body;
    const id = req.params.id;

    if (typeof id !== "string") {
      return res.status(400).json({ message: "Invalid Todo ID" });
    }
    const todo = await db.orm.todos.where({ id: id }).update({
      ...(title !== undefined && { title }),
      ...(description !== undefined && { description }),
      ...(completed !== undefined && { completed }),
    });

    if (!todo) {
      res.status(404).json({ message: "Todo not found" });
      return;
    }

    res.status(200).json({
      message: "Todo updated successfully",
      todo,
    });
  } catch (error) {
    console.error("Update Todo Error:", error);
    res.status(500).json({ message: "Failed to update todo" });
  }
};

// DELETE - Delete a todo
export const deleteTodo = async (req: Request, res: Response) => {
  try {
    const id = req.params.id;

    if (typeof id !== "string") {
      return res.status(400).json({ message: "Invalid Todo ID" });
    }

    const todo = await db.orm.todos.where({ id: id }).delete();

    if (!todo) {
      res.status(404).json({ message: "Todo not found" });
      return;
    }

    res.status(200).json({
      message: "Todo deleted successfully",
      todo,
    });
  } catch (error) {
    console.error("Delete Todo Error:", error);
    res.status(500).json({ message: "Failed to delete todo" });
  }
};
