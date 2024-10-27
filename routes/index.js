const router = require("express").Router();
const userRouter = require("./users");
const { NotFound } = require("../utils/errors/NotFound");

const itemRouter = require("./clothingItems");

router.use("/items", itemRouter);
router.use("/users", userRouter);

router.use(() => {
  throw new NotFound("Resource not found");
});

module.exports = router;
