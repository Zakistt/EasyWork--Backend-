const mongoose = require("mongoose");
/* setting up mongoose */
const userSchema = mongoose.Schema({
  _id: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  job: {
    type: String,
    required: false,
  },
  pfp: {
    type: String,
    required: false,
  },
  bio: {
    type: String,
    required: false,
  },
  work: {
    type: String,
    required: false,
  },
  education: {
    type: String,
    required: false,
  },
  skills: {
    type: Array,
    required: false,
  },
  contacts: {
    type: Object,
    required: false,
  },
  contactedAgencies: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "offer",
    },
  ],
  acceptedBy: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "offer",
    },
  ],
});
const userModel = mongoose.model("user", userSchema);
/* setting up mongoose */

async function getUserDB(email) {
  try {
    let user = await userModel.findOne({ email: email });
    if (user == null) {
      return { user: 0 };
    } else {
      return user;
    }
  } catch (error) {
    return error;
  }
}

async function getUserApplicationsDB(id) {
  try {
    const objectID = new mongoose.Types.ObjectId(id);
    let user = await userModel
      .findById(objectID)
      .select("contactedAgencies acceptedBy");
    await user.populate("contactedAgencies");
    await user.populate("acceptedBy");

    return user;
  } catch (error) {
    return `User not found`;
  }
}

async function createUserDB(userdata) {
  try {
    userdata._id = new mongoose.Types.ObjectId();
    userdata.job = "";
    userdata.bio = "";
    userdata.work = "";
    userdata.education = "";
    userdata.contacts = {
      apps: [
        { name: "facebook", value: "", key: 0 },
        { name: "instagram", value: "", key: 1 },
        { name: "twitter", value: "", key: 2 },
        { name: "linkedin", value: "", key: 3 },
      ],
      physical: [
        { name: "phone", value: "", key: 0 },
        { name: "mail", value: "", key: 1 },
        {
          name: "address",
          value: "",
          key: 2,
        },
      ],
    };
    const newuser = new userModel(userdata);
    await newuser.save();
    return {
      title: "Account Created Successfuly",
      description:
        "New User account has been created succcessfully. Click on the ID card icon to set up your resume and start applying for jobs.",
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

async function updateUserDB(email, user) {
  try {
    let data = user;
    delete data._id;
    delete data.email;
    delete data.contactedAgencies;
    delete data.acceptedBy;
    let newuser = await userModel.findOneAndUpdate({ email: email }, data);
    const { offerModel } = require("./offersModel");
    const offers = await offerModel.find({
      acceptedApplicants: newuser._id,
    });
    if (offers.length > 0) {
      for (let i = 0; i < offers.length; i++) {
        const index = offers[i].acceptedApplicants.indexOf(newuser._id);
        offers[i].acceptedApplicants.splice(index, 1);
        offers[i].applicants.push(newuser._id);
        offers[i].save();
      }
    }
    for (let i = 0; i < newuser.acceptedBy.length; i++) {
      const agency = newuser.acceptedBy[i];

      newuser.acceptedBy.splice(i, 1);
      newuser.contactedAgencies.push(agency);
    }

    newuser.save();
    return {
      title: "User Updated",
      description:
        "Your resume has been successfully updated, and all approvals are now deleted.",
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

async function deleteUserDB(id) {
  try {
    const { offerModel } = require("./offersModel");
    const objectID = new mongoose.Types.ObjectId(id);
    const offers = await offerModel.find({
      applicants: objectID,
    });
    if (offers.length > 0) {
      for (let i = 0; i < offers.length; i++) {
        const index = offers[i].applicants.indexOf(objectID);
        offers[i].applicants.splice(index, 1);
        offers[i].save();
      }
    } else {
      const offers2 = await offerModel.find({
        acceptedApplicants: objectID,
      });
      if (offers2.length > 0) {
        for (let i = 0; i < offers2.length; i++) {
          const index = offers2[i].acceptedApplicants.indexOf(objectID);
          offers2[i].acceptedApplicants.splice(index, 1);
          offers2[i].save();
        }
      }
    }
    await userModel.deleteOne({ _id: objectID });
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
  createUserDB,
  getUserDB,
  getUserApplicationsDB,
  updateUserDB,
  deleteUserDB,
  userModel,
};
