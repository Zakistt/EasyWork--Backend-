var express = require("express");
var router = express.Router();
const {
  createAgency,
  getAgency,
  updateAgency,
  deleteAgency,
} = require("../controllers/agencyController");

router.post("/", createAgency);
router.get("/", getAgency);
router.put("/", updateAgency);
router.delete("/", deleteAgency);

module.exports = router;
