const {
  createUserDB,
  getUserDB,
  getUserApplicationsDB,
  updateUserDB,
  deleteUserDB,
} = require("../models/userModel");

async function createUser(req, res, next) {
  const user = req.body.user;
  const response = await createUserDB(user);
  res.send(response);
}

async function getUser(req, res, next) {
  const email = req.query.email;
  const user = await getUserDB(email);
  res.send(user);
}
async function getUserApplications(req, res, next) {
  const id = req.query.id;
  const user = await getUserApplicationsDB(id);
  res.send(user);
}
async function updateUser(req, res, next) {
  const email = req.query.email;
  const user = req.body;
  const response = await updateUserDB(email, user);
  res.send(response);
}

async function deleteUser(req, res, next) {
  const id = req.query.id;
  const response = await deleteUserDB(id);
  res.send(response);
}

module.exports = {
  createUser,
  getUser,
  updateUser,
  deleteUser,
  getUserApplications,
};
