import { Request, Response } from "express";
import { db } from "../prisma/db.js";

// Get all todos
export const getTodos = async (_req: Request, res: Response) => {
  try {
    const todos = await db.orm.public.Todo.all();
    res.status(200).json(todos);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch todos" });
  }
};

// Create todo
export const createTodo = async (req: Request, res: Response) => {
  try {
    const { title, description } = req.body;

    if (!title || !title.trim()) {
      return res.status(400).json({ message: "Title is required" });
    }

    const todo = await db.orm.public.Todo.create({
      title: title.trim(),
      description: description || null,
      completed: false,
    });

    res.status(201).json(todo);
  } catch (error) {
    res.status(500).json({ message: "Failed to create todo" });
  }
};

// Get single todo
export const getTodoById = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);

    const todo = await db.orm.public.Todo.where({ id }).first();

    if (!todo) {
      return res.status(404).json({ message: "Todo not found" });
    }

    res.status(200).json(todo);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch todo" });
  }
};

// Update todo
export const updateTodo = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    const { title, description, completed } = req.body;

    const existingTodo = await db.orm.public.Todo.where({ id }).first();

    if (!existingTodo) {
      return res.status(404).json({ message: "Todo not found" });
    }

    const todo = await db.orm.public.Todo.where({ id }).update({
      title,
      description,
      completed,
    });

    res.status(200).json(todo);
  } catch (error) {
    res.status(500).json({ message: "Failed to update todo" });
  }
};

// Delete todo
export const deleteTodo = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);

    const existingTodo = await db.orm.public.Todo.where({ id }).first();

    if (!existingTodo) {
      return res.status(404).json({ message: "Todo not found" });
    }

    await db.orm.public.Todo.where({ id }).delete();

    res.status(200).json({ message: "Todo deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete todo" });
  }
};
