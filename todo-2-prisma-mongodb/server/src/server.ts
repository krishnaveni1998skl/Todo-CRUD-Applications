import express from "express";
import cors from "cors";
import "dotenv/config";

import todoRoutes from "./routes/todoRoutes";

const app = express();

app.use(cors());
app.use(express.json());

// Health check
app.get("/", (_req, res) => {
  res.json({
    message: "Todo 2 Prisma MongoDB API is running",
  });
});

// Todo CRUD routes
app.use("/api/todos", todoRoutes);

const PORT = 5001;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
