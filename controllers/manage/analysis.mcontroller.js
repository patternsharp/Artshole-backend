const Artwork = require("../../models/Artwork");
const User = require("../../models/User");

// Function that Get Artworks
exports.GetAllVisitors = async (req, res) => {
  try {
    let art_List = await Artwork.find({ isDeleted: false, isBlocked: false });

    return res.status(200).send(art_List);
  } catch (error) {
    console.error(error.message);
    return res
      .status(500)
      .send({ status: false, message: "Internal server error" });
  }
};

// Function that Get new user
exports.GetNewUsers = async (req, res) => {
  try {
    let res = await User.find({
      isDeleted: false,
      isBlocked: false,
      registeredAt,
    });

    return res.status(200).send(res);
  } catch (error) {
    console.error(error.message);
    return res
      .status(500)
      .send({ status: false, message: "Internal server error" });
  }
};
