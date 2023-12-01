const Collection = require("../models/Collection");
const User = require("../models/User");

// Add artwork function
exports.AddCollection = async (req, res) => {
  try {
    const { collectionTitle, userId, coverImg, description, type } = req.body;

    let collection = await Collection.findOne({
      collectionTitle: collectionTitle,
    });

    if (collection) {
      return res
        .status(400)
        .send({ status: false, message: "This Collection already exists" });
    }

    collection = new Collection({
      collectionTitle: collectionTitle,
      author: userId,
      coverImg: req.files.coverImg[0].filename,
      description: description,
      type: type,
      lastUpdatedAt: Date(),
    });

    let user = await User.findById(userId);
    user.collections = [...user.collections, collection._id];

    await collection.save();
    await user.save();

    return res
      .status(200)
      .send({
        status: true,
        message: "Added successfully.",
        result: collection,
      });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .send({ status: false, message: "Internal server error" });
  }
};

// Function that Update Collection
exports.UpdateCollection = async (req, res) => {
  try {
    const { _id, collectionTitle, coverImg, description, type } = req.body;

    console.log(req.body);

    let collection = await Collection.findOne({ _id: _id });

    if (!collection) {
      return res
        .status(400)
        .send({ status: false, message: "Something went wrong!" });
    }

    const filter = { _id: _id };
    const update = {
      collectionTitle: collectionTitle,
      coverImg: coverImg,
      description: description,
      type: type,
      lastUpdatedAt: Date(),
    };

    let doc = await Collection.findOneAndUpdate(filter, update, { new: true });
    return res
      .status(200)
      .send({ status: true, message: "Updated successfully." });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .send({ status: false, message: "Internal server error" });
  }
};

// Function that delete one Collection
exports.DeleteCollection = async (req, res) => {
  try {
    const { itemId } = req.body;
    let collection = await Collection.find({ _id: itemId, isDeleted: false });

    if (!collection) {
      return res
        .status(400)
        .send({
          status: false,
          message: "This collection has already been deleted.",
        });
    }

    const filter = { _id: itemId };
    const update = {
      isDeleted: true,
      deletedAt: Date(),
    };

    let doc = await Collection.findOneAndUpdate(filter, update, { new: true });
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

// Function that Get Collections
exports.GetClientCollections = async (req, res) => {
  try {
    let collection_List = await Collection.find({
      isDeleted: false,
      isBlocked: false,
    })
      .populate({
        path: "author",
        populate: [
          { path: "jobCategory" },
          { path: "followers" },
          { path: "following" },
        ],
      })
      .populate("liked")
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
        path: "comments",
        populate: [{ path: "author" }],
      })
      .exec();

    // if (!collection_List) {
    //     return res.status(400).send({ status: false, message: 'There is no collection.' });
    // }

    return res.status(200).send({
      status: true,
      message: "success",
      collectionList: collection_List,
    });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .send({ status: false, message: "Internal server error" });
  }
};

// Function that Get One Collection By Id
exports.GetCollectionDetailsById = async (req, res) => {
  try {
    let oneCollection = await Collection.find({
      isDeleted: false,
      isBlocked: false,
      _id: req.body.collectionId,
    })
      .populate({
        path: "author",
        populate: [
          { path: "jobCategory" },
          { path: "followers" },
          { path: "following" },
        ],
      })
      .populate("liked")
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
        path: "comments",
        populate: [{ path: "author" }],
      })
      .exec();

    return res.status(200).send({
      status: true,
      message: "success",
      oneCollection: oneCollection,
    });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .send({ status: false, message: "Internal server error" });
  }
};

// Function that Get initial collections
exports.GetInitialCollectionsByUser = async (req, res) => {
  try {
    const { index, step, userId } = req.body;

    let query = { isDeleted: false, isBlocked: false, author: userId };

    if (userId == 0) {
      query = { isDeleted: false, isBlocked: false };
    }

    let all_collections = await Collection.find(query)
      .populate({
        path: "author",
        populate: [
          { path: "jobCategory" },
          { path: "followers" },
          { path: "following" },
        ],
      })
      .populate("liked")
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
        path: "comments",
        populate: [{ path: "author" }],
      })
      .exec();

    const maxLength = all_collections.length;
    const loadMore = index + step;

    const results = all_collections.slice(0, loadMore);
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

// Collection Search
exports.SearchCollections = async (req, res) => {
  try {
    if (req.query.keyword) {
      const collections = await Collection.find({
        $or: [
          {
            collectionTitle: {
              $regex: req.query.keyword,
              $options: "i",
            },
          },
          {
            description: {
              $regex: req.query.keyword,
              $options: "i",
            },
          },
        ],
        isDeleted: false,
        isBlocked: false,
      })
        .populate({
          path: "author",
          populate: [
            { path: "jobCategory" },
            { path: "followers" },
            { path: "following" },
          ],
        })
        .populate("liked")
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
          path: "comments",
          populate: [{ path: "author" }],
        })
        .exec();

      return res
        .status(200)
        .send({ status: true, collectionList: collections });
    }
  } catch (err) {
    console.error(err.message);
    return res
      .status(500)
      .send({ status: false, message: "Internal server error" });
  }
};

// viewed count for one collection
exports.ViewCountCollection = async (req, res) => {
  try {
    const { collectionId, userId } = req.body;
    let collection = await Collection.findOne({ _id: collectionId });

    if (!collection) {
      return res
        .status(400)
        .send({ status: false, message: "Something went wrong!" });
    }

    collection.viewed.push(userId);
    await collection.save();

    return res.status(200).send({ status: true, message: "success" });
  } catch (err) {
    console.error(err.message);
    return res
      .status(500)
      .send({ status: false, message: "Internal server error" });
  }
};

// Function that Get my collections
exports.GetMyCollections = async (req, res) => {
  try {
    const { userId } = req.body;
    let collection_List = await Collection.find({
      isDeleted: false,
      isBlocked: false,
      author: userId,
    })
      .populate({
        path: "author",
        populate: [
          { path: "jobCategory" },
          { path: "followers" },
          { path: "following" },
        ],
      })
      .populate("liked")
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
        path: "comments",
        populate: [{ path: "author" }],
      })
      .exec();

    return res.status(200).send({
      status: true,
      message: "success",
      results: collection_List,
    });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .send({ status: false, message: "Internal server error" });
  }
};

// Function that add or delete artwork to collection
exports.UpdateArtworkOnCollection = async (req, res) => {
  try {
    const { collectionId, artworkId } = req.body;
    let collection = await Collection.findById(collectionId);
    let flag = collection.artworks.includes(artworkId);

    if (!flag) {
      collection.artworks = [...collection.artworks, artworkId];
      await collection.save();
      return res
        .status(200)
        .send({ status: true, message: "success", result: collection });
    } else {
      const index = collection.artworks.indexOf(artworkId);
      collection.artworks.splice(index, 1);
      await collection.save();
      return res
        .status(200)
        .send({ status: true, message: "success", result: collection });
    }
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .send({ status: false, message: "Internal server error" });
  }
};
