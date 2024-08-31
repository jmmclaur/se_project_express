const router = require("express").Router();
const { NOT_FOUND } = require("../utils/errors");

const userRouter = require("./users");
const itemRouter = require("./clothingItems");

const { auth } = require("../middlewares/auth");
const { login, createUser } = require("../controllers/users");

router.use("/users", auth, userRouter);
router.use("/items", itemRouter);

router.post("/signin", login);
router.post("/signup", createUser);

router.use((req, res) => {
  res.status(NOT_FOUND).send({ message: "Resource not found" });
});

module.exports = router;
