const mongoose = require("mongoose");
const { deleteOfferDB, getOffersAgencyDB } = require("./offersModel");
const { offerModel } = require("./offersModel");
/* setting up mongoose */
const agencySchema = mongoose.Schema({
  _id: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  name: String,
  email: String,
  background: String,
});

const agencyModel = mongoose.model("agency", agencySchema);
/* setting up mongoose */

async function getAgencyDB(email) {
  try {
    const agency = await agencyModel.findOne({ email: email });
    if (agency == null) {
      return { agency: 0 };
    } else {
      return agency;
    }
  } catch (error) {
    return error;
  }
}

async function createAgencyDB(agency) {
  try {
    agency._id = new mongoose.Types.ObjectId();
    const newagency = new agencyModel(agency);
    await newagency.save();
    return {
      title: "Account Created Successfully",
      description:
        "New Agency account has been created succcessfully. Click on the edit icon to set it up.",
      status: "success",
    };
  } catch (error) {
    return {
      title: "Creation Failed",
      description:
        "Something went wrong... if this problem persists please leave a feedback!",
      status: "error",
    };
  }
}

async function updateAgencyDB(email, agency) {
  try {
    let data = agency;
    delete data._id;
    delete data.email;
    let newagency = await agencyModel.findOneAndUpdate({ email: email }, data);
    await newagency.save();
    return {
      title: "Agency Updated",
      description: "Your agency info have been been successfully updated.",
      status: "success",
    };
  } catch (error) {
    return {
      title: "Update Failed",
      description:
        "Something went wrong... if this problem persists please leave a feedback!",
      status: "error",
    };
  }
}

async function deleteAgencyDB(id) {
  try {
    const objectID = new mongoose.Types.ObjectId(id);
    const offers = await getOffersAgencyDB(id);
    for (let i = 0; i < offers.length; i++) {
      const element = offers[i]._id;
      await deleteOfferDB(element);
    }
    await agencyModel.deleteOne({ _id: objectID });
    return {
      title: "Account Deleted",
      description:
        "This account has been permanently deleted. A new one will be created if the same google account is used again.",
      status: "success",
    };
  } catch (error) {
    return {
      title: "Deletion Failed",
      description:
        "Something went wrong... if this problem persists please leave a feedback!",
      status: "error",
    };
  }
}

module.exports = {
  createAgencyDB,
  getAgencyDB,
  updateAgencyDB,
  deleteAgencyDB,
};
