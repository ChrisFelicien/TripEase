import express from "express";
import cookieParser from "cookie-parser";
import {} from "dotenv/config";
import helmet from "helmet";
import cors from "cors";
import connectDb from "./utils/db.js";
import authenticationRoutes from "./routes/authentication.routes.js";
import AppError from "./utils/AppError.js";
import errorController from "./controllers/error.js";

const app = express();
app.use(helmet());
app.use(cookieParser());

// connect to DB
connectDb();

app.use(express.json());
app.use(
  cors({
    origin: process.env.DEV_CLIENT
  })
);

//
app.use("/api/v1/auth", authenticationRoutes);
app.all(/.*/, (req, res, next) => {
  next(new AppError(`${req.originalUrl} not find in this server`));
});
app.use(errorController);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`The server is running on port ${PORT}`);
});
