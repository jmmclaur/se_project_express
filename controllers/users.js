const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../utils/config");
const User = require("../models/user");
const {
  BAD_REQUEST,
  NOT_FOUND,
  INTERNAL_SERVER_ERROR,
  requestConflict409,
  unauthorizedReq401,
} = require("../utils/errors");

const createUser = async (req, res) => {
  const { name, avatar, email, password } = req.body;

  console.log(
    "Creating user with name:",
    name,
    ", avatar:",
    avatar,
    ", password:",
    password,
    ", email:",
    email
  );
  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res
        .status(requestConflict409)
        .send({ message: "User with this email already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      name,
      avatar,
      email,
      password: hashedPassword,
    });

    const { password: pwd, ...userWithoutPassword } = newUser.toObject();
    return res.status(201).send({ data: userWithoutPassword });
  } catch (err) {
    console.error("createUser error name:", err.name);
    if (err.name === "ValidationError") {
      return res.status(BAD_REQUEST).send({ message: "Invalid data" });
    }
    if (err.code === 11000) {
      return res.status(requestConflict409).send({
        message:
          "User with this email already exists from createUser controller",
      });
    }
    return res
      .status(INTERNAL_SERVER_ERROR)
      .send({ message: "An error has occurred on the server." });
  }
};

const login = (req, res) => {
  const { email, password } = req.body;
  User.findUserByCredentials(email, password)
    .then((user) => {
      console.log("user object from the login controller", user);
      const token = jwt.sign({ _id: user._id }, JWT_SECRET, {
        expiresIn: "7d",
      });
      res.status(200).send({ token });
    })
    .catch((err) => {
      console.error("Login error:", err.message);
      if (err.message === "Incorrect password or email") {
        return res
          .status(unauthorizedReq401)
          .send({ message: "unauthorized request" });
      }
      return res.status(INTERNAL_SERVER_ERROR).send({
        message: "Internal server error from the catch in the login controller",
      });
    });
};

const getCurrentUser = async (req, res) => {
  try {
    const user = await User.findOne({ _id: req.user._id });
    if (!user) {
      return res.status(NOT_FOUND).send({ message: "Item ID not found" });
    }
    console.log(user);
    return res.status(200).send(user);
  } catch (error) {
    return res
      .status(INTERNAL_SERVER_ERROR)
      .send({ error: "Could not find user from getCurrentUser controller" });
  }
};

const modifyUserData = async (req, res) => {
  try {
    const updates = { name: req.body.name, avatar: req.body.avatar };
    const updatedUser = await User.findByIdAndUpdate(req.user._id, updates, {
      new: true,
      runValidators: true,
    }).orFail(() => {
      const error = new Error(
        "User ID not found in this coming from modifyUserData"
      );
      error.statusCode = NOT_FOUND;
      throw error;
    });

    console.log("updated User from modifyUserData", updatedUser);
    return res.status(200).send(updatedUser);
  } catch (error) {
    if (error.statusCode === 404) {
      return res.status(error).send({ message: error.message });
    }
    if (error.name === "ValidationError") {
      return res.status(BAD_REQUEST).send({
        message: "provided data is incorrect",
      });
    }
    return res
      .status(INTERNAL_SERVER_ERROR)
      .send({ error: "Could not update user from modifyUserData" });
  }
};

module.exports = { createUser, login, getCurrentUser, modifyUserData };
