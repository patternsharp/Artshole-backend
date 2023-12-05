const Artwork = require("../models/Artwork");
const User = require("../models/User");
const deleteFile = require("../utils/deleteFile");

// Add artwork function
exports.AddArtwork = async (req, res) => {
  try {
    let {
      artworkTitle,
      userId,
      artworkImg,
      description,
      price,
      width,
      height,
      depth,
      status,
      category,
      year,
      propertyList,
    } = req.body;

    let artArr = [];

    if (req.files) {
      req.files.map((e) => artArr.push(e.filename));
    }

    let art;

    if (artworkTitle != "") {
      art = await Artwork.findOne({ artworkTitle: artworkTitle });
    }

    if (art) {
      return res
        .status(400)
        .send({ status: false, message: "This Artwork already exists" });
    }

    art = new Artwork({
      artworkTitle: artworkTitle,
      author: userId,
      artworkImg: artArr,
      description: description,
      price: price,
      width: width,
      height: height,
      depth: depth,
      status: status,
      category: category,
      year: year,
      propertyList: JSON.parse(propertyList),
      lastUpdatedAt: Date(),
    });

    let user = await User.findById(userId);
    user.artworks = [...user.artworks, art._id];

    await user.save();
    await art.save();

    art = await Artwork.findOne({ _id: art._id })
      .populate({
        path: "author",
        populate: [{ path: "jobCategory" }],
      })
      .populate("liked")
      .populate("viewed")
      .populate("propertyList")
      .populate({
        path: "comments",
        populate: [{ path: "author" }],
      })
      .exec();

    return res
      .status(200)
      .send({ status: true, message: "Added successfully.", result: art });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .send({ status: false, message: "Internal server error" });
  }
};

// Function that Update Artwork  items
exports.UpdateArtwork = async (req, res) => {
  try {
    let {
      _id,
      artworkTitle,
      userId,
      artworkImg,
      description,
      price,
      width,
      height,
      depth,
      status,
      category,
      year,
      propertyList,
    } = req.body;

    let art = await Artwork.findOne({
      _id: _id,
      isDeleted: false,
      isBlocked: false,
    });

    if (!art) {
      return res
        .status(400)
        .send({ status: false, message: "Something went wrong!" });
    }

    if (art && req.files.length > 0) {
      for (let i = 0; i < art.artworkImg.length; i++) {
        await deleteFile("artwork/", art.artworkImg[i]);
      }
    }

    let artArr = [];

    if (req.files.length > 0) {
      req.files.map((e) => artArr.push(e.filename));
    } else {
      artArr = artworkImg;
    }

    const filter = { _id: _id };
    const update = {
      artworkTitle: artworkTitle,
      artworkImg: artArr,
      description: description,
      price: price,
      width: width,
      height: height,
      depth: depth,
      status: status,
      category: category,
      year: year,
      propertyList: JSON.parse(propertyList),
      lastUpdatedAt: Date(),
    };

    let doc = await Artwork.findOneAndUpdate(filter, update, { new: true });

    art = await Artwork.findOne({ _id: _id })
      .populate({
        path: "author",
        populate: [{ path: "jobCategory" }],
      })
      .populate("liked")
      .populate("viewed")
      .populate("propertyList")
      .populate({
        path: "comments",
        populate: [{ path: "author" }],
      })
      .exec();
    return res
      .status(200)
      .send({ status: true, message: "Updated successfully.", result: art });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .send({ status: false, message: "Internal server error" });
  }
};

// Function that Get Artwork  items
exports.DeleteArtwork = async (req, res) => {
  try {
    const { itemId } = req.body;
    let art = await Artwork.find({ _id: itemId, isDeleted: false });

    if (!art) {
      return res.status(400).send({
        status: false,
        message: "This artwork has already been deleted.",
      });
    }

    const filter = { _id: itemId };
    const update = {
      isDeleted: true,
      deletedAt: Date(),
    };

    let doc = await Artwork.findOneAndUpdate(filter, update, { new: true });
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

// Function that Get Artworks
exports.GetClientArtworks = async (req, res) => {
  try {
    let art_List = await Artwork.find({ isDeleted: false, isBlocked: false })
      .populate({
        path: "author",
        populate: [{ path: "jobCategory" }],
      })
      .populate("liked")
      .populate("viewed")
      .populate("propertyList")
      .populate({
        path: "comments",
        populate: [{ path: "author" }],
      })
      .exec();

    return res.status(200).send({
      status: true,
      message: "success",
      artworkList: art_List,
    });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .send({ status: false, message: "Internal server error" });
  }
};

// Function that Get initial Artworks
exports.GetInitialArtworksByUser = async (req, res) => {
  try {
    const { index, step, userId, searchObject } = req.body;

    let query = { isDeleted: false, isBlocked: false, author: userId };

    if (userId == 0) {
      query = { isDeleted: false, isBlocked: false };
    }

    if (searchObject) {
      const { property, category, priceRange, searchText } = searchObject;

      if (property.length > 0) {
        if (category == "All") {
          if (searchText == null) {
            if (priceRange[0] == 0 && priceRange[1] == 10000) {
              query = {
                isDeleted: false,
                isBlocked: false,
                propertyList: { $in: property },
              };
            } else {
              if (priceRange[0] == 0 && priceRange[1] == 10000) {
                query = {
                  isDeleted: false,
                  isBlocked: false,
                  propertyList: { $in: property },
                };
              } else {
                query = {
                  isDeleted: false,
                  isBlocked: false,
                  price: { $gte: priceRange[0], $lte: priceRange[1] },
                  propertyList: { $in: property },
                };
              }
            }
          } else {
            if (priceRange[0] == 0 && priceRange[1] == 10000) {
              query = {
                isDeleted: false,
                isBlocked: false,
                propertyList: { $in: property },
                $or: [
                  { artworkTitle: { $regex: searchText, $options: "i" } },
                  { description: { $regex: searchText, $options: "i" } },
                ],
              };
            } else {
              query = {
                isDeleted: false,
                isBlocked: false,
                price: { $gte: priceRange[0], $lte: priceRange[1] },
                propertyList: { $in: property },
                $or: [
                  { artworkTitle: { $regex: searchText, $options: "i" } },
                  { description: { $regex: searchText, $options: "i" } },
                ],
              };
            }
          }
        } else {
          if (searchText == null) {
            query = {
              isDeleted: false,
              isBlocked: false,
              category: category,
              price: { $gte: priceRange[0], $lte: priceRange[1] },
              propertyList: { $in: property },
            };
          } else {
            query = {
              isDeleted: false,
              isBlocked: false,
              category: category,
              price: { $gte: priceRange[0], $lte: priceRange[1] },
              propertyList: { $in: property },
              $or: [
                { artworkTitle: { $regex: searchText, $options: "i" } },
                { description: { $regex: searchText, $options: "i" } },
              ],
            };
          }
        }
      } else {
        if (category == "All") {
          if (searchText == null) {
            if (priceRange[0] == 0 && priceRange[1] == 10000) {
              query = { isDeleted: false, isBlocked: false };
            } else {
              query = {
                isDeleted: false,
                isBlocked: false,
                price: { $gte: priceRange[0], $lte: priceRange[1] },
              };
            }
          } else {
            if (priceRange[0] == 0 && priceRange[1] == 10000) {
              query = {
                isDeleted: false,
                isBlocked: false,
                $or: [
                  { artworkTitle: { $regex: searchText, $options: "i" } },
                  { description: { $regex: searchText, $options: "i" } },
                ],
              };
            } else {
              query = {
                isDeleted: false,
                isBlocked: false,
                price: { $gte: priceRange[0], $lte: priceRange[1] },
                $or: [
                  { artworkTitle: { $regex: searchText, $options: "i" } },
                  { description: { $regex: searchText, $options: "i" } },
                ],
              };
            }
          }
        } else {
          if (searchText == null) {
            if (priceRange[0] == 0 && priceRange[1] == 10000) {
              query = {
                isDeleted: false,
                isBlocked: false,
                category: category,
              };
            } else {
              query = {
                isDeleted: false,
                isBlocked: false,
                category: category,
                price: { $gte: priceRange[0], $lte: priceRange[1] },
              };
            }
          } else {
            if (priceRange[0] == 0 && priceRange[1] == 10000) {
              query = {
                isDeleted: false,
                isBlocked: false,
                category: category,
                $or: [
                  { artworkTitle: { $regex: searchText, $options: "i" } },
                  { description: { $regex: searchText, $options: "i" } },
                ],
              };
            } else {
              query = {
                isDeleted: false,
                isBlocked: false,
                category: category,
                price: { $gte: priceRange[0], $lte: priceRange[1] },
                $or: [
                  { artworkTitle: { $regex: searchText, $options: "i" } },
                  { description: { $regex: searchText, $options: "i" } },
                ],
              };
            }
          }
        }
      }
    }

    let art_List = await Artwork.find(query)
      .populate({
        path: "author",
        populate: [{ path: "jobCategory" }],
      })
      .populate("liked")
      .populate("viewed")
      .populate("propertyList")
      .populate({
        path: "comments",
        populate: [{ path: "author" }],
      })
      .exec();

    const maxLength = art_List.length;
    const loadMore = index + step;

    const results = art_List.slice(0, loadMore);

    return res.status(200).send({
      status: true,
      message: "Success",
      results: results,
      maxLength: maxLength,
    });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .send({ status: false, message: "Internal server error" });
  }
};

// viewed count for one artwork
exports.ViewCountArtwork = async (req, res) => {
  try {
    const { artworkId, userId } = req.body;
    let artwork = await Artwork.findOne({ _id: artworkId });

    if (!artwork) {
      return res
        .status(400)
        .send({ status: false, message: "Something went wrong!" });
    }

    artwork.viewed.push(userId);
    await artwork.save();

    return res.status(200).send({ status: true, message: "success" });
  } catch (err) {
    console.error(err.message);
    return res
      .status(500)
      .send({ status: false, message: "Internal server error" });
  }
};

// Function that toggle like
exports.ToggleLike = async (req, res) => {
  try {
    const { userId, artworkId } = req.body;
    let user = await User.findById(userId);
    let artwork = await Artwork.findById(artworkId);
    const flag1 = user.likes.includes(artworkId);
    const flag2 = artwork.liked.includes(userId);

    if (!flag1 && !flag2) {
      user.likes = [...user.likes, artworkId];
      artwork.liked = [...artwork.liked, userId];

      await user.save();
      await artwork.save();

      return res.status(200).send({ status: true, message: "User liked" });
    } else {
      const index1 = user.likes.indexOf(artwork._id);
      const index2 = artwork.liked.indexOf(user._id);

      user.likes.splice(index1, 1);
      artwork.liked.splice(index2, 1);

      await user.save();
      await artwork.save();

      return res.status(200).send({ status: true, message: "User Unliked" });
    }
  } catch (err) {
    console.error(err.message);
    return res
      .status(500)
      .send({ status: false, message: "Internal server error" });
  }
};
