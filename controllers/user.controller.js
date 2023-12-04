const Artwork = require("../models/Artwork");
const User = require("../models/User");

// Function that Get All artists informations
exports.GetAllArtists = async (req, res) => {
  try {
    let userList = await User.find({ isDeleted: false, isBlocked: false })
      .populate("jobCategory")
      .populate("artistCategory")
      .populate("likes")
      .populate({
        path: "artworks",
        populate: [
          {
            path: "author",
            populate: [{ path: "jobCategory" }],
          },
          {
            path: "comments",
            populate: [{ path: "author" }],
          },
        ],
      })
      .populate("reposted")
      .populate("bought")
      .populate({
        path: "collections",
        populate: [{ path: "author" }],
      })
      .populate("videos")
      .populate("viewed")
      .exec();

    console.log("userList=>", userList);

    return res.status(200).send(userList);
  } catch (err) {
    console.error(err.message);
    return res
      .status(500)
      .send({ status: false, message: "Internal server error" });
  }
};

// Function that Get initial artists
exports.GetInitialArtists = async (req, res) => {
  try {
    const { index, step, artistSearch } = req.body;

    let query = { isDeleted: false, isBlocked: false, isVerified: true };

    if (artistSearch.trim().length > 0) {
      query = {
        isDeleted: false,
        isBlocked: false,
        $or: [
          { fullName: { $regex: artistSearch, $options: "i" } },
          { screenName: { $regex: artistSearch, $options: "i" } },
          { about: { $regex: artistSearch, $options: "i" } },
        ],
      };
    }

    let all_artists = await User.find(query)
      .populate("jobCategory")
      .populate("artistCategory")
      .populate("likes")
      .populate({
        path: "artworks",
        populate: [
          {
            path: "author",
            populate: [{ path: "jobCategory" }],
          },
          {
            path: "comments",
            populate: [{ path: "author" }],
          },
        ],
      })
      .populate("reposted")
      .populate("bought")
      .populate({
        path: "collections",
        populate: [{ path: "author" }],
      })
      .populate("videos")
      .populate("viewed")
      .exec();

    const maxLength = all_artists.length;
    const loadMore = index + step;

    const results = all_artists.slice(0, loadMore);
    return res.status(200).send({
      status: true,
      message: "Success.",
      results: results,
      maxLength: maxLength,
    });
  } catch (err) {
    console.error(err.message);
    return res
      .status(500)
      .send({ status: false, message: "Internal server error" });
  }
};

// Function that Get One User information
exports.GetUserDetailsByScreenName = async (req, res) => {
  try {
    const { screenName } = req.body;
    let oneUser = await User.find({
      screenName: screenName,
      isDeleted: false,
      isBlocked: false,
      isVerified: true,
    })
      .populate("jobCategory")
      .populate("artistCategory")
      .populate("viewed")
      .populate("videos")
      .populate({
        path: "artworks",
        populate: [
          {
            path: "author",
            populate: [{ path: "jobCategory" }],
          },
          {
            path: "comments",
            populate: [{ path: "author" }],
          },
        ],
      })
      .populate({
        path: "likes",
        populate: [
          {
            path: "author",
            populate: [{ path: "jobCategory" }],
          },
          {
            path: "comments",
            populate: [{ path: "author" }],
          },
        ],
      })
      .populate({
        path: "reposted",
        populate: [
          {
            path: "author",
            populate: [{ path: "jobCategory" }],
          },
          {
            path: "comments",
            populate: [{ path: "author" }],
          },
        ],
      })
      .populate({
        path: "bought",
        populate: [
          {
            path: "author",
            populate: [{ path: "jobCategory" }],
          },
          {
            path: "comments",
            populate: [{ path: "author" }],
          },
        ],
      })
      .populate({
        path: "collections",
        populate: [{ path: "author" }],
      })
      .exec();

    return res.status(200).send({ status: true, oneUser: oneUser });
  } catch (err) {
    console.error(err.message);
    return res
      .status(500)
      .send({ status: false, message: "Internal server error" });
  }
};

// Function that toggle follow
exports.ToggleFollow = async (req, res) => {
  try {
    const { senderId, receiverId } = req.body;
    let cuser = await User.findById(senderId);
    let fuser = await User.findById(receiverId);
    const flag1 = cuser.following.includes(receiverId);
    const flag2 = fuser.followers.includes(senderId);

    if (!flag1 && !flag2) {
      cuser.following = [...cuser.following, receiverId];
      fuser.followers = [...fuser.followers, senderId];

      await cuser.save();
      await fuser.save();

      return res.status(200).send({ status: true, message: "User Followed" });
    } else {
      const followingIndex = cuser.following.indexOf(fuser._id);
      const followerIndex = fuser.followers.indexOf(cuser._id);

      cuser.following.splice(followingIndex, 1);
      fuser.followers.splice(followerIndex, 1);

      await cuser.save();
      await fuser.save();

      return res.status(200).send({ status: true, message: "User Unfollowed" });
    }
  } catch (err) {
    console.error(err.message);
    return res
      .status(500)
      .send({ status: false, message: "Internal server error" });
  }
};

// User Search
exports.SearchUsers = async (req, res) => {
  try {
    if (req.query.keyword) {
      const users = await User.find({
        $or: [
          { fullName: { $regex: req.query.keyword, $options: "i" } },
          { screenName: { $regex: req.query.keyword, $options: "i" } },
        ],
      });

      return res.status(200).send({ status: true, users: users });
    }
  } catch (error) {
    console.error(error.message);
    return res
      .status(500)
      .send({ status: false, message: "Internal server error" });
  }
};

// User Report
exports.ReportUser = async (req, res) => {
  try {
    const { email, reportDesc } = req.body;

    let userExists = await User.findOne({
      email: email,
      isDeleted: false,
      isBlocked: false,
      isVerified: true,
    });

    if (!userExists) {
      return res
        .status(404)
        .send({ status: false, message: "Something Went Wrong" });
    }

    const filter = { email: email };
    let update = {
      isReported: true,
      reportDesc: reportDesc,
      reportedAt: Date(),
    };

    await User.findOneAndUpdate(filter, update, { new: true });
    return res
      .status(200)
      .send({ status: true, message: "Report Successfully." });
  } catch (error) {
    console.error(error.message);
    return res
      .status(500)
      .send({ status: false, message: "Internal server error" });
  }
};
