import express from "express";
import cors from "cors";
import "dotenv/config";
import morgan from "morgan";
import path from "path";
import { fileURLToPath } from "url";

const app = express();
const PORT = process.env.PORT || 3000;

// middlewares
app.use(cors());
app.use(morgan("dev"));
app.use(express.json());
app.use("/api/orders", orderRouter);

// connect to database;

import { mongoConnect } from "./config/dbConfig.js";
mongoConnect();
// Get the directory name of the current module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Serve Images or Public Assets
app.use(express.static(path.join(__dirname, "/public")));

// routes
import { routes } from "./router/routers.js";
import orderRouter from "./router/orderRouter.js";
routes.map(({ path, middlewares }) => {
  return app.use(path, middlewares);
});

// server route
app.get("/", (req, res, next) => {
  res.json({
    message: "Server Live...",
  });
});

// 404 error handler
app.use((req, res, next) => {
  next({
    status: 404,
    message: "404 Path Not found",
  });
});

// global error handler
app.use((error, req, res, next) => {
  console.log(error);
  res.status(error.status || 500).json({
    message: error.message,
  });
});

// start our server
app.listen(PORT, (error) =>
  error
    ? console.log("Error", error)
    : console.log(`Server running at port: ${PORT}`)
);
