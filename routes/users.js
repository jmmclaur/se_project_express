const router = require("express").Router();

const { getCurrentUser, modifyUserData } = require("../controllers/users");

router.get("/me", getCurrentUser);

router.patch("/me", modifyUserData);

module.exports = router;
