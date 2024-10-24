require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
const { PORT = 3001 } = process.env;

mongoose.set("strictQuery", false);

mongoose
  .connect("mongodb://127.0.0.1:27017/wtwr_db")
  .then(() => {
    console.log("Connected to DB");
  })
  .catch(console.error);

app.use(express.json());
app.use(cors());

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

const { errors } = require("celebrate");
const { requestLogger, errorLogger } = require("./middlewares/logger");
const {
  validateUserBody,
  validateAuthentication,
} = require("./middlewares/validation");

const { login, createUser } = require("./controllers/users");

const mainRouter = require("./routes/index");

app.use("/", mainRouter);

mongoose
  .connect("mongodb://127.0.0.1:27017/wtwr_db")
  .then(() => {})
  .catch(console.error);
app.use(express.json());
app.use(requestLogger);

app.use(cors());
app.get("/crash-test", () => {
  setTimeout(() => {
    throw new Error("Server will crash");
  }, 0);
});
app.post("/signin", validateAuthentication, login);
app.post("/signup", validateUserBody, createUser);

app.use(errorLogger);

app.use(errors());

app.use((error, req, res, next) => {
  res.status(error.statusCode).send({ message: error.message });
  next();
});
