const mongoose = require("mongoose");
const distance = require("gps-distance");
const NodeGeocoder = require("node-geocoder");
const { userModel } = require("./userModel");
/* setting up mongoose */
const offerSchema = mongoose.Schema({
  _id: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  creatorID: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  name: {
    type: mongoose.Schema.Types.String,
    required: true,
  },
  address: {
    type: mongoose.Schema.Types.String,
    required: false,
  },
  gps: {
    type: mongoose.Schema.Types.Array,
    required: false,
  },
  position: {
    type: mongoose.Schema.Types.String,
    required: false,
  },
  description: {
    type: mongoose.Schema.Types.String,
    required: false,
  },
  pfp: {
    type: mongoose.Schema.Types.String,
    required: false,
  },
  phone: {
    type: mongoose.Schema.Types.String,
    required: false,
  },
  age: {
    type: mongoose.Schema.Types.Array,
    required: false,
  },
  experience: {
    type: mongoose.Schema.Types.Number,
    required: false,
  },
  salary: {
    type: mongoose.Schema.Types.Array,
    required: false,
  },
  time: {
    type: mongoose.Schema.Types.Date,
    default: new Date(),
    required: true,
  },
  applicants: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
    },
  ],
  acceptedApplicants: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
    },
  ],
});
const offerModel = mongoose.model("offer", offerSchema);
/* setting up mongoose */

/* setting up geocoder */

const options = {
  provider: "mapquest",
  apiKey: "og7pfFIlGeM6ejgEWsNuppL7ST8KjbrK",
};

const geocoder = NodeGeocoder(options);
/* setting up geocoder */

async function getOffersDB(searchQuery, filter, location) {
  const offersPosition = await offerModel.find({
    position: {
      $regex: new RegExp(searchQuery, "i"),
    },
  });

  const offersName = await offerModel.find({
    name: {
      $regex: new RegExp(searchQuery, "i"),
    },
  });

  const offersDuplicated = offersName.concat(offersPosition);

  const offers = offersDuplicated.filter(
    (v, i, a) => a.findIndex((v2) => v2.id === v.id) === i
  );

  switch (filter) {
    case "Closest":
      async function getDistance(id, offer) {
        let offerLatLon = await geocoder.geocode(offer.address);

        let distanceToOffer = await distance(
          offerLatLon[0].latitude,
          offerLatLon[0].longitude,
          location.latitude,
          location.longitude
        );

        return [id, distanceToOffer];
      }

      let Distances = [];
      for (let index = 0; index < offers.length; index++) {
        if (offers[index].address != "") {
          Distances.push(await getDistance(offers[index]._id, offers[index]));
        } else {
          Distances.push([offers[index]._id, 999999999]);
        }
      }

      Distances.sort(function (a, b) {
        if (a[1] > b[1]) {
          return -1;
        } else {
          return 1;
        }
      });

      let offersSorted = [];
      for (let index = 0; index < offers.length; index++) {
        let offer = offers.find(
          (o) => o._id === Distances[offers.length - 1 - index][0]
        );
        offersSorted.push(offer);
      }

      return offersSorted;

    case "Most Recent":
      offers.sort(function (a, b) {
        if (b.time < a.time) {
          return -1;
        } else {
          return 1;
        }
      });
      return offers;

    case "Highest Paid":
      offers.sort(
        (a, b) =>
          (b.salary[0] + b.salary[1]) / 2 - (a.salary[0] + a.salary[1]) / 2
      );
      return offers;
  }
}

async function getOffersAgencyDB(id) {
  try {
    const objectID = new mongoose.Types.ObjectId(id);
    const offers = await offerModel.find({ creatorID: objectID });
    return offers;
  } catch (error) {
    return [];
  }
}

async function applyForOfferDB(user_id, offer_id) {
  try {
    const userID = new mongoose.Types.ObjectId(user_id);
    const offerID = new mongoose.Types.ObjectId(offer_id);

    let user = await userModel.findById(userID);
    let offer = await offerModel.findById(offerID);
    if (offer.applicants.filter((e) => e == user_id).length > 0) {
      return {
        title: "Oops!",
        description:
          "You have already applied for this job offer, all you can do now is wait!",
        status: "warning",
      };
    } else {
      user.contactedAgencies.push(offerID);
      user.save();

      offer.applicants.push(userID);
      offer.save();
      return {
        title: "Application Succeeded",
        description:
          "Your resume has been successfully sent to the agency, The ball is not in your court now!",
        status: "success",
      };
    }
  } catch (error) {
    return {
      title: "Application Failed",
      description:
        "Something went wrong... if this problem persists please leave a feedback!",
      status: "error",
    };
  }
}

async function approveApplicationDB(user_id, offer_id) {
  try {
    const userID = new mongoose.Types.ObjectId(user_id);
    const offerID = new mongoose.Types.ObjectId(offer_id);

    let user = await userModel.findById(userID);
    let offer = await offerModel.findById(offerID);
    if (offer.acceptedApplicants.filter((e) => e == user_id).length > 0) {
      return "This application has already being approved";
    } else {
      const agency_index = user.contactedAgencies.indexOf(offerID);
      user.acceptedBy.push(offerID);
      user.contactedAgencies.splice(agency_index, 1);
      user.save();

      const user_index = offer.applicants.indexOf(userID);
      offer.acceptedApplicants.push(userID);
      offer.applicants.splice(user_index, 1);
      offer.save();
      return "Application Approved";
    }
  } catch (error) {
    console.log(error);
    return "Approval failed!.";
  }
}

async function deleteApplicationDB(user_id, offer_id) {
  try {
    const userID = new mongoose.Types.ObjectId(user_id);
    const offerID = new mongoose.Types.ObjectId(offer_id);

    let user = await userModel.findById(userID);
    let offer = await offerModel.findById(offerID);

    const user_index = offer.applicants.indexOf(userID);
    offer.applicants.splice(user_index, 1);
    offer.save();

    const agency_index = user.contactedAgencies.indexOf(offerID);
    user.contactedAgencies.splice(agency_index, 1);
    user.save();
    return "Application removed";
  } catch (error) {
    console.log(error);
    return "Removing application failed!.";
  }
}

async function disapproveApplicationDB(user_id, offer_id) {
  try {
    const userID = new mongoose.Types.ObjectId(user_id);
    const offerID = new mongoose.Types.ObjectId(offer_id);

    let user = await userModel.findById(userID);
    let offer = await offerModel.findById(offerID);

    const user_index = offer.acceptedApplicants.indexOf(userID);
    offer.acceptedApplicants.splice(user_index, 1);
    offer.applicants.push(userID);
    offer.save();

    const agency_index = user.acceptedBy.indexOf(offerID);
    user.acceptedBy.splice(agency_index, 1);
    user.contactedAgencies.push(offerID);
    user.save();

    return "Application disapproved";
  } catch (error) {
    console.log(error);
    return "Disapproving application failed!.";
  }
}

async function getOfferApplicantsDB(id) {
  try {
    const offerID = new mongoose.Types.ObjectId(id);

    let offer = await offerModel
      .findById(offerID)
      .select("applicants acceptedApplicants");

    await offer.populate("applicants");
    await offer.populate("acceptedApplicants");

    return offer;
  } catch (error) {
    console.log(error);
    return "Fetching applicants failed!.";
  }
}

async function getOfferDB(id) {
  try {
    const objectID = new mongoose.Types.ObjectId(id);
    const offer = await offerModel.findById(objectID);
    return offer;
  } catch (error) {
    return `Offer not found`;
  }
}

async function createOfferDB(offer) {
  try {
    offer.creatorID = new mongoose.Types.ObjectId(offer.creatorID);
    offer._id = new mongoose.Types.ObjectId();
    const newoffer = new offerModel(offer);
    await newoffer.save();
    return {
      title: "Offer creation succeeded",
      description:
        "New Offer created successfully, check your offer's applicants list to stay updated",
      status: "success",
    };
  } catch (error) {
    return {
      title: "Offer creation failed",
      description:
        "Something went wrong... if this problem persists please leave a feedback!",
      status: "error",
    };
  }
}

async function deleteOfferDB(id) {
  try {
    const objectID = new mongoose.Types.ObjectId(id);
    const offer = await offerModel.findById(objectID);
    for (let i = 0; i < offer.applicants.length; i++) {
      const element = offer.applicants[i];
      const user = await userModel.findById(element);
      const index = user.contactedAgencies.indexOf(objectID);
      user.contactedAgencies.splice(index, 1);
    }
    for (let i = 0; i < offer.acceptedApplicants.length; i++) {
      const element = offer.acceptedApplicants[i];
      const user = await userModel.findById(element);
      const index = user.acceptedBy.indexOf(objectID);
      user.acceptedBy.splice(index, 1);
    }
    await offerModel.deleteOne({ _id: objectID });
    return {
      title: "Offer Deleted Successfully",
      description:
        "This offer and all its applications have been permanently deleted.",
      status: "success",
    };
  } catch (error) {
    return {
      title: "Delete Failed",
      description:
        "Something went wrong... if this problem persists please leave a feedback!",
      status: "error",
    };
  }
}

async function updateOfferDB(id, offer) {
  try {
    delete offer._id;
    delete offer.time;
    offer.applicants = [];
    offer.acceptedApplicants = [];
    deleteOfferDB(id);
    createOfferDB(offer);
    return {
      title: "Offer Updated",
      description:
        "This offer has been successfully updated and all applicants have been removed!",
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

module.exports = {
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

  offerModel,
};
