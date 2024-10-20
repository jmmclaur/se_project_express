const router = require("express").Router();
const auth = require("../middlewares/auth");
const { getCurrentUser, modifyUserData } = require("../controllers/users");
const { validateUser } = require("../middlewares/validation");

router.use(auth);
router.get("/me", getCurrentUser);
router.patch("/me", validateUser, modifyUserData);

module.exports = router;
