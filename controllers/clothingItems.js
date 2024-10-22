const ClothingItem = require("../models/clothingItem");
const { handleErrors } = require("../utils/errors");
const { OKAY_REQUEST, CREATE_REQUEST } = require("../utils/errors");
const { DEFAULT } = require("./users").default;
const BadRequestError = require("../utils/errors/BadRequestError");
const { ForbiddenError } = require("../utils/errors/ForbiddenError");

const createItem = async (req, res, next) => {
  const { name, weather, imageUrl } = req.body;

  if (!name || name.length < 2) {
    throw new BadRequestError("Validation Error");
  }
  const item = await ClothingItem.create({
    name,
    weather,
    imageUrl,
    owner: req.user._id,
  });
  res
    .status(CREATE_REQUEST)
    .send({ data: item })
    .catch((err) => {
      handleErrors(err, next);
    });
};

const getItems = (req, res, next) => {
  ClothingItem.find({})
    .then((items) => res.status(OKAY_REQUEST).send(items))
    .catch((err) => {
      console.error(err);
      return next(new DEFAULT("An error has occurred on the server"));
    });
};

const deleteItem = (req, res) => {
  const { itemId } = req.params;

  ClothingItem.findById(itemId)
    .orFail()
    .then((item) => {
      if (String(item.owner) !== req.user._id) {
        return next(new ForbiddenError("Access unauthorized"));
      }
      return item
        .deleteOne()
        .then(() => res.send({ message: "Successfully deleted" }));
    })
    .catch((err) => {
      handleErrors(err, next);
    });
};

const likeItem = (req, res) => {
  ClothingItem.findByIdAndUpdate(
    req.params.itemId,
    { $addToSet: { likes: req.user._id } },
    { new: true }
  )
    .orFail()
    .then((item) => {
      res.status(OKAY_REQUEST).send({ data: item });
    })
    .catch((err) => {
      handleErrors(err, next);
    });
};

const dislikeItem = (req, res) => {
  ClothingItem.findByIdAndUpdate(
    req.params.itemId,
    { $pull: { likes: req.user._id } },
    { new: true }
  )
    .orFail()
    .then((item) => {
      res.status(OKAY_REQUEST).send({ data: item });
    })
    .catch((err) => {
      handleErrors(err, next);
    });
};

module.exports = { createItem, getItems, deleteItem, likeItem, dislikeItem };
