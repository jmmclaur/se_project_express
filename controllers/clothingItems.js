const ClothingItem = require("../models/clothingItem");
const {
  BAD_REQUEST,
  NOT_FOUND,
  INTERNAL_SERVER_ERROR,
  FORBIDDEN,
} = require("../utils/errors");

const createItem = (req, res) => {
  const { name, weather, imageUrl } = req.body;

  ClothingItem.create({ name, weather, imageUrl, owner: req.user._id })
    .then((item) => {
      res.send({ data: item });
    })
    .catch((error) => {
      if (error.name === "ValidationError") {
        res.status(BAD_REQUEST).send({ message: "Validation Error" });
      } else {
        res
          .status(INTERNAL_SERVER_ERROR)
          .send({ message: "An error has occurred on the server" });
      }
    });
};

const getItems = (req, res) => {
  ClothingItem.find({})
    .then((items) => res.send(items))
    .catch((err) => {
      console.error(err);
      return res
        .status(INTERNAL_SERVER_ERROR)
        .send({ message: "An error has occurred on the server" });
    });
};

const deleteItem = (req, res) => {
  const { itemId } = req.params;

  ClothingItem.findById(itemId)
    .orFail()
    .then((item) => {
      if (String(item.owner) !== req.user._id) {
        return res.status(FORBIDDEN).send({ message: "Access unauthorized" });
      }
      return item
        .deleteOne()
        .then(() => res.status(200).send({ message: "Successfully deleted" }));
    })
    .catch((err) => {
      console.error(err);
      if (err.name === "DocumentNotFoundError") {
        return res.status(NOT_FOUND).send({ message: "Document not found" });
      }
      if (err.name === "CastError") {
        return res.status(BAD_REQUEST).send({ message: "Invalid data" });
      }
      return res
        .status(INTERNAL_SERVER_ERROR)
        .SEND({ message: "An error has occurred on the server" });
    });
};

/*
      res.send({
        message: "Item successfully deleted",
      })
    )
    .catch((err) => {
      console.error(`Error ${err.name} with message ${err.message}`);

      if (err.name === "DocumentNotFoundError") {
        return res.status(NOT_FOUND).send({ message: "Document not found" });
      }
      if (err.name === "CastError") {
        return res.status(BAD_REQUEST).send({ message: "Invalid data" });
      }

      return res
        .status(INTERNAL_SERVER_ERROR)
        .send({ message: "An error has occurred on the server" });
    }); 
}; */

const likeItem = (req, res) => {
  ClothingItem.findByIdAndUpdate(
    req.params.itemId,
    { $addToSet: { likes: req.user._id } },
    { new: true }
  )
    .orFail()
    .then((item) => {
      res.send({ data: item });
    })
    .catch((err) => {
      console.error(`Error ${err.name} with message ${err.message}`);

      if (err.name === "DocumentNotFoundError") {
        return res.status(NOT_FOUND).send({ message: "Document not found" });
      }
      if (err.name === "CastError") {
        return res.status(BAD_REQUEST).send({ message: "Invalid data" });
      }

      return res
        .status(INTERNAL_SERVER_ERROR)
        .send({ message: "An error has occurred on the server" });
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
      res.send({ data: item });
    })
    .catch((err) => {
      console.error(`Error ${err.name} with message ${err.message}`);

      if (err.name === "DocumentNotFoundError") {
        return res.status(NOT_FOUND).send({ message: "Document not found" });
      }
      if (err.name === "CastError") {
        return res.status(BAD_REQUEST).send({ message: "Invalid data" });
      }

      return res
        .status(INTERNAL_SERVER_ERROR)
        .send({ message: "An error has occurred on the server" });
    });
};

module.exports = { createItem, getItems, deleteItem, likeItem, dislikeItem };
