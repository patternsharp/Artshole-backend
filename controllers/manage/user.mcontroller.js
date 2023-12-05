const User = require("../../models/User");

// Function that Get All Users informations
exports.GetAllUsers = async (req, res) => {
  try {
    let userList = await User.find({ isDeleted: false })
      .populate("jobCategory")
      .populate("artistCategory")
      .populate("following")
      .populate("followers")
      .populate("likes")
      .populate("viewed")
      .populate("artworks")
      .populate("collections")
      .exec();

    return res.status(200).send(userList);
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .send({ status: false, message: "Internal server error" });
  }
};

// Function that Get One User information
exports.GetOneUser = async (req, res) => {
  try {
    let oneUser = await User.find({ _id: req.body.userId });
    res.status(200).send(oneUser);
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .send({ status: false, message: "Internal server error" });
  }
};

// Function that delete User
exports.DeleteUser = async (req, res) => {
  try {
    const { userId } = req.body;
    let user = await User.findOne({ _id: userId, isDeleted: false });

    if (!user) {
      return res
        .status(400)
        .send({ status: false, message: "User has already been deleted." });
    }
    const filter = { _id: userId };
    const update = { isDeleted: true };
    // let doc = await Character.findOneAndUpdate(filter, update);
    // doc = await Character.findOne(filter);
    let doc = await User.findOneAndUpdate(filter, update, { new: true });
    return res.status(200).send({
      status: true,
      message: "Has been successfully deleted.",
    });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .send({ status: false, message: "Internal server error" });
  }
};
