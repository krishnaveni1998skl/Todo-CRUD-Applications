import { db } from "./prisma/db";

async function testDatabase() {
  try {
    const todos = await db.orm.todos.all();

    console.log("MongoDB connection successful!");
    console.log("Todos:", todos);
  } catch (error) {
    console.error("Database connection failed:", error);
  } finally {
    await db.close();
  }
}

testDatabase();
