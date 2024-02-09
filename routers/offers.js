var express = require("express");
var router = express.Router();
const {
  createOffer,
  getOffer,
  updateOffer,
  deleteOffer,
  getOffers,

  getOffersAgency,

  applyForOffer,
  approveApplication,
  deleteApplication,
  disapproveApplication,

  getOfferApplicants,
} = require("../controllers/offersController");

router.post("/offers", getOffers);

router.post("/offer", createOffer);
router.get("/offer", getOffer);
router.put("/offer", updateOffer);
router.delete("/offer", deleteOffer);

router.post("/offersagency", getOffersAgency);

router.post("/offerapplication", applyForOffer);
router.post("/offerapproveapplication", approveApplication);
router.delete("/offerdeleteapplication", deleteApplication);
router.delete("/offerdisapproveapplication", disapproveApplication);

router.get("/offerapplicants", getOfferApplicants);

module.exports = router;
