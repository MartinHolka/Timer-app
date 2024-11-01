const express = require("express");
require("dotenv").config();
require("express-async-errors");
const cors = require("cors");

const app = express();

// database
const connectDB = require("./database/connectDB");

// middleware
app.use(cors());
app.use(express.json());
const authenticate = require("./middleware/authMiddleware");

// routers
const authRouter = require("./routes/authRouter");
const activityRouter = require("./routes/activityRouter");
const sessionRouter = require("./routes/sessionRouter");
const taskRouter = require("./routes/taskRouter");

// routes
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/activities", authenticate, activityRouter);
app.use("/api/v1/sessions", authenticate, sessionRouter);
app.use("/api/v1/tasks", authenticate, taskRouter);

const port = process.env.PORT || 3000;

const start = async () => {
  try {
    await connectDB(process.env.MONGO_URI);
    app.listen(port);
    console.log(`Server listening on port ${port}`);
  } catch (error) {
    console.log(error);
  }
};
start();
