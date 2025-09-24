import express from "express";
import {} from "dotenv/config";
import helmet from "helmet";
import cors from "cors";
import connectDb from "./utils/db.js";
import authenticationRoutes from "./routes/authentication.routes.js";

const app = express();
app.use(helmet());

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

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`The server is running on port ${PORT}`);
});
