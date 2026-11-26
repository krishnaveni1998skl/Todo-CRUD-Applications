import express from "express";
import cors from "cors";
import "dotenv/config";

import todoRoutes from "./routes/todoRoutes.js";

const app = express();

app.use(cors());
app.use(express.json());

// Home route
app.get("/", (_req, res) => {
  res.json({
    message: "Todo 3 Prisma PostgreSQL API is running",
  });
});

// Todo CRUD routes
app.use("/api/todos", todoRoutes);

const PORT = 5002;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
