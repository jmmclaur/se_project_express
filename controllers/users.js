const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const JWT_SECRET = require("../utils/config");
const User = require("../models/user");
const { BadRequestError } = require("../utils/errors/BadRequestError");
const { NotAuthorized } = require("../utils/errors/NotAuthorized");
const {
  OKAY_REQUEST,
  CREATE_REQUEST,
  handleErrors,
} = require("../utils/errors");

const createUser = (req, res, next) => {
  const { name, avatar, email, password } = req.body;

  bcrypt
    .hash(password, 10)
    .then((hash) =>
      User.create({
        name,
        avatar,
        email,
        password: hash,
      })
    )
    .then((user) =>
      res.status(CREATE_REQUEST).send({
        name: user.name,
        avatar: user.avatar,
        email: user.email,
      })
    )
    .catch((error) => {
      handleErrors(error, next);
    });
};

const login = (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new BadRequestError("Invalid data");
  }

  User.findOne({ email })
    .select("+password")
    .then(async (user) => {
      if (!user) {
        throw new NotAuthorized("NotAuthorizedError");
      }
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        throw new NotAuthorized("NotAuthorizedError");
      }
      const token = jwt.sign({ _id: user._id }, JWT_SECRET, {
        expiresIn: "7d",
      });
      return res.status(OKAY_REQUEST).send({
        token,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
        _id: user._id,
      });
    })
    .catch((err) => handleErrors(err, next));
};

const getCurrentUser = (req, res, next) => {
  const userId = req.user._id;
  User.findById(userId)
    .orFail()
    .then((user) => res.status(OKAY_REQUEST).send(user))
    .catch((err) => {
      console.error(err);
      handleErrors(err, next);
    });
};

const modifyUserData = async (req, res, next) => {
  User.findByIdAndUpdate(
    req.user._id,
    { name: req.body.name, avatar: req.body.avatar },
    {
      new: true,
      runValidators: true,
    }
  )
    .then((user) => res.send({ data: user }))
    .catch((error) => {
      console.error(error.name);
      handleErrors(error, next);
    });
};

export default { createUser, login, getCurrentUser, modifyUserData };
