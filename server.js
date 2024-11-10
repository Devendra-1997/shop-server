import express from "express";
import cors from "cors";
import "dotenv/config";
import { mongoConnect } from "./config/dbConfig.js";
import userRouter from "./router/userRouter.js";

const app = express();
const PORT = process.env.PORT || 8000;

// middlewares
app.use(cors());
app.use(express.json());

// connect to database
mongoConnect();

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

// Routers

app.use("/api/user", userRouter);
// app.use("/api/burrow", burrowRouter);
// app.use("/api/review", reviewRouter);
// app.use("/api/book", bookRouter);
// app.use("/api/user/profile", profileRouter);

// start our server
app.listen(PORT, (error) => {
  error ? console.log("Error", error) : console.log("Server is running");
});
