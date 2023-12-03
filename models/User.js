const mongoose = require("mongoose");
const Schema = mongoose.Schema;

let userSchema = new Schema({
  role: {
    type: String, // client or admin
    required: true,
    default : "client"
  },
  fullName: { 
    type: String,
    required: true,
  },
  screenName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  showEmail: {
    //show email on profile page
    type: Boolean,
    default: false,
  },
  password: {
    type: String,
    required: true,
  },
  term: {
    type: Boolean,
    default: true,
  },
  subscribe: {
    type: Boolean,
    default: false,
  },
  avatarUrl: {
    type: String,
    default: "default.jpg",
  },
  coverImg: {
    type: String,
    default: "default.jpg",
  },
  clientJob: {
    type: String,
  },
  jobCategory: [{ type: Schema.Types.ObjectId, ref: "JobCategory" }],
  artistCategory: [{ type: Schema.Types.ObjectId, ref: "ArtistCategory" }],
  country: {
    type: String,
  },
  state: {
    type: String,
  },
  city: {
    type: String,
  },
  address: {
    type: String,
  },
  zipCode: {
    type: String,
  },
  phoneNumber: {
    type: String,
  },
  birthday: {
    type: Date,
  },
  about: {
    type: String,
    default: "",
  },
  personalLink: {
    type: String,
    default: "",
  },
  facebookLink: {
    type: String,
  },
  instagramLink: {
    type: String,
  },
  linkedinLink: {
    type: String,
  },
  twitterLink: {
    type: String,
  },
  following: [{ type: Schema.Types.ObjectId, ref: "User" }],
  followers: [{ type: Schema.Types.ObjectId, ref: "User" }],
  likes: [{ type: Schema.Types.ObjectId, ref: "Artwork" }],
  artworks: [{ type: Schema.Types.ObjectId, ref: "Artwork" }],
  reposted: [{ type: Schema.Types.ObjectId, ref: "Artwork" }],
  bought: [{ type: Schema.Types.ObjectId, ref: "Artwork" }],
  collections: [{ type: Schema.Types.ObjectId, ref: "Collection" }],
  videos: [{ type: Schema.Types.ObjectId, ref: "Video" }],
  viewed: [{ type: Schema.Types.ObjectId, ref: "User" }],
  isReported: {
    type: Boolean,
    default: false,
  },
  reportDesc: {
    type: String,
    default: "",
  },
  reportedAt: {
    type: Date,
  },
  registeredAt: {
    type: Date,
    default: Date.now,
  },
  lastVisitedAt: {
    type: Date,
  },
  isVerified: {
    type: Boolean,
    default: false,
  },
  isBlocked: {
    type: Boolean, // block or active
    default: false,
  },
  blockedAt: {
    type: Date,
  },
  isDeleted: {
    type: Boolean,
    default: false,
  },
  deletedAt: {
    type: Date,
  },
  emailVerifyToken: {
    type: String,
  },
  emailVerifyExpiry: {
    type: Date,
  },
  resetPasswordToken: {
    type: String,
  },
  resetPasswordExpiry: {
    type: Date,
  },
});

module.exports = mongoose.model("User", userSchema);
