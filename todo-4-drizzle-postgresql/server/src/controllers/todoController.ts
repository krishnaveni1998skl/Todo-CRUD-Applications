import { Request, Response } from "express";
import { eq } from "drizzle-orm";
import { db } from "../db/index.js";
import { todos } from "../db/schema.js";

// Get all todos
export const getTodos = async (_req: Request, res: Response) => {
  try {
    const result = await db.select().from(todos);
    res.status(200).json(result);
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

    const [newTodo] = await db
      .insert(todos)
      .values({
        title: title.trim(),
        description: description || null,
        completed: false,
      })
      .returning();

    res.status(201).json(newTodo);
  } catch (error) {
    res.status(500).json({ message: "Failed to create todo" });
  }
};

// Get todo by ID
export const getTodoById = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);

    const [todo] = await db.select().from(todos).where(eq(todos.id, id));

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

    const [updatedTodo] = await db
      .update(todos)
      .set({
        title,
        description,
        completed,
        updatedAt: new Date(),
      })
      .where(eq(todos.id, id))
      .returning();

    if (!updatedTodo) {
      return res.status(404).json({ message: "Todo not found" });
    }

    res.status(200).json(updatedTodo);
  } catch (error) {
    res.status(500).json({ message: "Failed to update todo" });
  }
};

// Delete todo
export const deleteTodo = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);

    const [deletedTodo] = await db
      .delete(todos)
      .where(eq(todos.id, id))
      .returning();

    if (!deletedTodo) {
      return res.status(404).json({ message: "Todo not found" });
    }

    res.status(200).json({ message: "Todo deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete todo" });
  }
};
