const Video = require("../models/Video");
const User = require("../models/User");

// Add video function
exports.AddVideo = async (req, res) => {
  try {
    const { videoLink, description, author } = req.body;

    let oneVideo = await Video.findOne({
      videoLink: videoLink,
      isDeleted: false,
    });

    if (oneVideo) {
      if (oneVideo.isBlocked == false) {
        return res
          .status(400)
          .send({ status: false, message: "This video already exists" });
      } else if (oneVideo.isBlocked == true) {
        return res
          .status(400)
          .send({ status: false, message: "This is a banned video" });
      }
    }

    oneVideo = new Video({
      videoLink: videoLink,
      author: author,
      description: description,
      lastUpdatedAt: Date(),
    });

    let user = await User.findById(author);
    user.videos = [...user.videos, oneVideo._id];

    await user.save();
    await oneVideo.save();

    return res
      .status(200)
      .send({ status: true, message: "Added successfully.", result: oneVideo });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .send({ status: false, message: "Internal server error" });
  }
};

// Function that Update Video  items
exports.UpdateVideo = async (req, res) => {
  try {
    const { _id, author, videoLink, description } = req.body;

    let video = await Video.findOne({ _id: _id });

    if (!video) {
      return res
        .status(400)
        .send({ status: false, message: "Something went wrong!" });
    }

    const filter = { _id: _id };
    const update = {
      videoLink: videoLink,
      description: description,
      lastUpdatedAt: Date(),
    };

    let doc = await Video.findOneAndUpdate(filter, update, { new: true });

    video = await Video.findOne({ _id: _id })
      .populate({
        path: "author",
        populate: [{ path: "jobCategory" }],
      })
      .exec();

    return res
      .status(200)
      .send({ status: true, message: "Updated successfully.", result: video });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .send({ status: false, message: "Internal server error" });
  }
};

// Function that Delete Video
exports.DeleteVideo = async (req, res) => {
  try {
    const { itemId } = req.body;
    let video = await Video.find({ _id: itemId, isDeleted: false });

    if (!video) {
      return res.status(400).send({
        status: false,
        message: "This video has already been deleted.",
      });
    }

    const filter = { _id: itemId };
    const update = {
      isDeleted: true,
      deletedAt: Date(),
    };

    let doc = await Video.findOneAndUpdate(filter, update, { new: true });
    return res
      .status(200)
      .send({ status: true, message: "Deleted Successfully." });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .send({ status: false, message: "Internal server error" });
  }
};

// Function that Get Videos
exports.GetClientVideos = async (req, res) => {
  try {
    let video_List = await Video.find({ isDeleted: false, isBlocked: false })
      .populate("author")
      .populate("viewed")
      .populate("liked")
      .exec();

    if (!video_List) {
      return res
        .status(400)
        .send({ status: false, message: "There is no video." });
    }

    return res.status(200).send({
      status: true,
      message: "success",
      videoList: video_List,
    });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .send({ status: false, message: "Internal server error" });
  }
};
