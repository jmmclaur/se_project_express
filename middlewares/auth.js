const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../utils/config");
const { NotAuthorized } = require("../utils/errors/NotAuthorized");

const auth = async (req, res, next) => {
  try {
    const { authorization } = req.headers;
    if (!authorization || !authorization.startsWith("Bearer ")) {
      return next(new NotAuthorized("Authorization required"));
    }

    const token = authorization.replace("Bearer ", "");

    const payload = jwt.verify(token, JWT_SECRET);
    req.user = payload;

    next();
    return "";
  } catch (err) {
    return next(new NotAuthorized("Authorization required"));
  }
};

module.exports = {
  auth,
};
