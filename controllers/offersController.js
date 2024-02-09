const {
  createOfferDB,
  getOfferDB,
  updateOfferDB,
  deleteOfferDB,
  getOffersDB,

  getOffersAgencyDB,

  applyForOfferDB,
  approveApplicationDB,
  deleteApplicationDB,
  disapproveApplicationDB,

  getOfferApplicantsDB,
} = require("../models/offersModel");

async function getOffers(req, res, next) {
  const searchQuery = req.body.searchQuery;
  const filter = req.body.option;
  const location = req.body.location;
  const response = await getOffersDB(searchQuery, filter, location);
  res.send(response);
}

async function getOffersAgency(req, res, next) {
  const id = req.query.id;
  const response = await getOffersAgencyDB(id);
  res.send(response);
}

async function applyForOffer(req, res, next) {
  const user_id = req.query.user_id;
  const offer_id = req.query.offer_id;

  const response = await applyForOfferDB(user_id, offer_id);
  res.send(response);
}

async function approveApplication(req, res, next) {
  const user_id = req.query.user_id;
  const offer_id = req.query.offer_id;

  const response = await approveApplicationDB(user_id, offer_id);
  res.send(response);
}

async function deleteApplication(req, res, next) {
  const user_id = req.query.user_id;
  const offer_id = req.query.offer_id;

  const response = await deleteApplicationDB(user_id, offer_id);
  res.send(response);
}

async function disapproveApplication(req, res, next) {
  const user_id = req.query.user_id;
  const offer_id = req.query.offer_id;

  const response = await disapproveApplicationDB(user_id, offer_id);
  res.send(response);
}

async function getOfferApplicants(req, res, next) {
  const id = req.query.id;
  const response = await getOfferApplicantsDB(id);
  res.send(response);
}

async function createOffer(req, res, next) {
  const offer = req.body.offer;
  const response = await createOfferDB(offer);
  res.send(response);
}

async function getOffer(req, res, next) {
  const id = req.query.id;
  const response = await getOfferDB(id);
  res.send(response);
}

async function updateOffer(req, res, next) {
  const id = req.query.id;
  const offer = req.body.offer;
  const response = await updateOfferDB(id, offer);
  res.send(response);
}

async function deleteOffer(req, res, next) {
  const id = req.query.id;
  const response = await deleteOfferDB(id);
  res.send(response);
}

module.exports = {
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
};
