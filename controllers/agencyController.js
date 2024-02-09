const {
  createAgencyDB,
  getAgencyDB,
  updateAgencyDB,
  deleteAgencyDB,
} = require("../models/agencyModel");

async function createAgency(req, res, next) {
  const agency = req.body.agency;
  const response = await createAgencyDB(agency);
  res.send(response);
}

async function getAgency(req, res, next) {
  const email = req.query.email;
  const response = await getAgencyDB(email);
  res.send(response);
}

async function updateAgency(req, res, next) {
  const email = req.query.email;
  const agency = req.body;
  const response = await updateAgencyDB(email, agency);
  res.send(response);
}

async function deleteAgency(req, res, next) {
  const id = req.query.id;
  const response = await deleteAgencyDB(id);
  res.send(response);
}

module.exports = { createAgency, getAgency, updateAgency, deleteAgency };
