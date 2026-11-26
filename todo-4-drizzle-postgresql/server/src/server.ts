import express from "express";
import cors from "cors";
import "dotenv/config";

import todoRoutes from "./routes/todoRoutes.js";

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (_req, res) => {
  res.json({
    message: "Todo 4 Drizzle PostgreSQL API is running",
  });
});

app.use("/api/todos", todoRoutes);

const PORT = process.env.PORT || 5003;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
