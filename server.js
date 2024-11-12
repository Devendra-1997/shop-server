import express from "express";
import cors from "cors";
import "dotenv/config";
import { connectToMongoDb } from "./config/dbConfig.js";

const app = express();
const PORT = process.env.PORT || 8000;

// middlewares
app.use(
  cors({
    origin: "http://localhost:5173",
  })
);
app.use(express.json());

// connect to database
connectToMongoDb();

// Serve Images or Public Assets
import path from "path";
const __dirname = path.resolve();
app.use(express.static(path.join(__dirname, "/public")));

// server route
app.get("/", (req, res, next) => {
  res.json({
    message: "Server Live...",
  });
});

// // 404 error handler
// app.use((req, res, next) => {
//   next({
//     status: 404,
//     message: "404 Path Not found",
//   });
// });

// // global error handler
// app.use((error, req, res, next) => {
//   console.log(error);
//   res.status(error.status || 500).json({
//     message: error.message,
//   });
// });

// Routes for Client Side
import userRouter from "./router/userRouter.js";
app.use("/api/user", userRouter);

// start our server
app.listen(PORT, (error) => {
  error ? console.log("Error", error) : console.log("Server is running");
});
