const router = require("express").Router();

const { NotFound } = require("../utils/errors/NotFound");

const itemRouter = require("./clothingItems");

router.use("/items", itemRouter);

router.use(() => {
  throw new NotFound("Resource not found");
});

module.exports = router;
