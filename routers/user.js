var express = require("express");
var router = express.Router();
const {
  createUser,
  getUser,
  getUserApplications,
  updateUser,
  deleteUser,
} = require("../controllers/userController");

router.post("/", createUser);
router.get("/", getUser);
router.get("/applications", getUserApplications);
router.put("/", updateUser);
router.delete("/", deleteUser);

module.exports = router;
