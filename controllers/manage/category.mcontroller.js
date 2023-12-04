const ArtistCategory = require("../../models/ArtistCategory");
const JobCategory = require("../../models/JobCategory");
const ArtworkCategory = require("../../models/ArtworkCategory");
const CollectionCategory = require("../../models/CollectionCategory");

// Function that Add Artist Category items
exports.AddArtistCategory = async (req, res) => {
  const { itemTitle } = req.body;

  try {
    let artist_Category = await ArtistCategory.findOne({ itemTitle });

    if (artist_Category) {
      return res
        .status(400)
        .send({ status: false, message: "This Category item already exists" });
    }

    artist_Category = new ArtistCategory({
      itemTitle: itemTitle,
    });

    await artist_Category.save((error) => {
      if (error) {
        return res
          .status(500)
          .send({ status: false, message: "Internal server error" });
      }
      return res
        .status(200)
        .send({
          status: true,
          message: "Added successfully.",
          result: artist_Category,
        });
    });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .send({ status: false, message: "Internal server error" });
  }
};

// Function that Get Artist Category items
exports.GetArtistCategory = async (req, res) => {
  try {
    let artist_Category_List = await ArtistCategory.find();
    res.status(200).send(artist_Category_List);
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .send({ status: false, message: "Internal server error" });
  }
};

// Function that Update Artist Category items
exports.UpdateArtistCategory = async (req, res) => {
  const { itemTitle, itemId } = req.body;

  try {
    let artist_Category = await ArtistCategory.findOne({ itemTitle });

    if (artist_Category) {
      return res
        .status(400)
        .send({ status: false, message: "This Category item already exists" });
    }

    ArtistCategory.findByIdAndUpdate(
      itemId,
      { itemTitle: itemTitle },
      (error) => {
        if (error) {
          return res
            .status(500)
            .send({ status: false, message: "Internal server error" });
        }
        return res
          .status(200)
          .send({ status: true, message: "Updated successfully." });
      },
    );
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .send({ status: false, message: "Internal server error" });
  }
};

// Function that Delete Artist Category items
exports.DeleteArtistCategory = async (req, res) => {
  console.log("delete item=>", req.body.itemId);
  try {
    if (req.body && req.body.itemId) {
      const response = await ArtistCategory.deleteOne({ id: req.body.itemId });
      console.log(response);
      return res
        .status(200)
        .send({ status: true, message: "Deleted successfully." });
    } else {
      return res
        .status(400)
        .send({ sataus: false, message: "Something went wrong!" });
    }
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .send({ status: false, message: "Internal server error" });
  }
};

// Function that Add Job Category items
exports.AddJobCategory = async (req, res) => {
  const { itemTitle } = req.body;

  try {
    let job_Category = await JobCategory.findOne({ itemTitle });

    if (job_Category) {
      return res
        .status(400)
        .send({ status: false, message: "This Category item already exists" });
    }

    job_Category = new JobCategory({
      itemTitle: itemTitle,
    });

    await job_Category.save((error) => {
      if (error) {
        return res
          .status(500)
          .send({ status: false, message: "Internal server error" });
      }
      return res
        .status(200)
        .send({
          status: true,
          message: "Added successfully.",
          result: job_Category,
        });
    });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .send({ status: false, message: "Internal server error" });
  }
};

// Function that Get Job Category items
exports.GetJobCategory = async (req, res) => {
  try {
    let job_Category_List = await JobCategory.find();
    res.status(200).send(job_Category_List);
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .send({ status: false, message: "Internal server error" });
  }
};

// Function that Update Job Category items
exports.UpdateJobCategory = async (req, res) => {
  const { itemTitle, itemId } = req.body;

  try {
    let job_Category = await JobCategory.findOne({ itemTitle });

    if (job_Category) {
      return res
        .status(400)
        .send({ status: false, message: "This Category item already exists" });
    }

    JobCategory.findByIdAndUpdate(itemId, { itemTitle: itemTitle }, (error) => {
      if (error) {
        return res
          .status(500)
          .send({ status: false, message: "Internal server error" });
      }
      return res
        .status(200)
        .send({ status: true, message: "Updated successfully." });
    });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .send({ status: false, message: "Internal server error" });
  }
};

// Function that Delete Job Category items
exports.DeleteJobCategory = async (req, res) => {
  console.log("delete item=>", req.body.itemId);
  try {
    if (req.body && req.body.itemId) {
      const response = await JobCategory.deleteOne({ _id: req.body.itemId });
      return res
        .status(200)
        .send({ status: true, message: "Deleted successfully." });
    } else {
      return res
        .status(400)
        .send({ sataus: false, message: "Something went wrong!" });
    }
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .send({ status: false, message: "Internal server error" });
  }
};

// Function that Add Artwork Category items
exports.AddArtworkCategory = async (req, res) => {
  const { itemTitle } = req.body;

  try {
    let art_Category = await ArtworkCategory.findOne({ itemTitle });

    if (art_Category) {
      return res
        .status(400)
        .send({ status: false, message: "This Category item already exists" });
    }

    art_Category = new ArtworkCategory({
      itemTitle: itemTitle,
    });

    await art_Category.save((error) => {
      if (error) {
        return res
          .status(500)
          .send({ status: false, message: "Internal server error" });
      }
      return res
        .status(200)
        .send({
          status: true,
          message: "Added successfully.",
          result: art_Category,
        });
    });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .send({ status: false, message: "Internal server error" });
  }
};

// Function that Get Artwork Category items
exports.GetArtworkCategory = async (req, res) => {
  try {
    let art_Category_List = await ArtworkCategory.find();
    res.status(200).send(art_Category_List);
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .send({ status: false, message: "Internal server error" });
  }
};

// Function that Update Artwork Category items
exports.UpdateArtworkCategory = async (req, res) => {
  const { itemTitle, itemId } = req.body;

  try {
    let art_Category = await ArtworkCategory.findOne({ itemTitle });

    if (art_Category) {
      return res
        .status(400)
        .send({ status: false, message: "This Category item already exists" });
    }

    ArtworkCategory.findByIdAndUpdate(
      itemId,
      { itemTitle: itemTitle },
      (error) => {
        if (error) {
          return res
            .status(500)
            .send({ status: false, message: "Internal server error" });
        }
        return res
          .status(200)
          .send({ status: true, message: "Updated successfully." });
      },
    );
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .send({ status: false, message: "Internal server error" });
  }
};

// Function that Delete Artwork Category items
exports.DeleteArtworkCategory = async (req, res) => {
  console.log("delete item=>", req.body.itemId);
  try {
    if (req.body && req.body.itemId) {
      const response = await ArtworkCategory.deleteOne({
        _id: req.body.itemId,
      });
      return res
        .status(200)
        .send({ status: true, message: "Deleted successfully." });
    } else {
      return res
        .status(400)
        .send({ sataus: false, message: "Something went wrong!" });
    }
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .send({ status: false, message: "Internal server error" });
  }
};

// Function that Add Collection Category items
exports.AddCollectionCategory = async (req, res) => {
  const { itemTitle } = req.body;

  try {
    let collection_Category = await CollectionCategory.findOne({ itemTitle });

    if (collection_Category) {
      return res
        .status(400)
        .send({ status: false, message: "This Category item already exists" });
    }

    collection_Category = new CollectionCategory({
      itemTitle: itemTitle,
    });

    await collection_Category.save((error) => {
      if (error) {
        return res
          .status(500)
          .send({ status: false, message: "Internal server error" });
      }
      return res
        .status(200)
        .send({
          status: true,
          message: "Added successfully.",
          result: collection_Category,
        });
    });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .send({ status: false, message: "Internal server error" });
  }
};

// Function that Get Collection Category items
exports.GetCollectionCategory = async (req, res) => {
  try {
    let collection_Category_List = await CollectionCategory.find();
    res.status(200).send(collection_Category_List);
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .send({ status: false, message: "Internal server error" });
  }
};

// Function that Update Collection Category items
exports.UpdateCollectionCategory = async (req, res) => {
  const { itemTitle, itemId } = req.body;

  try {
    let collection_Category = await CollectionCategory.findOne({ itemTitle });

    if (collection_Category) {
      return res
        .status(400)
        .send({ status: false, message: "This Category item already exists" });
    }

    CollectionCategory.findByIdAndUpdate(
      itemId,
      { itemTitle: itemTitle },
      (error) => {
        if (error) {
          return res
            .status(500)
            .send({ status: false, message: "Internal server error" });
        }
        return res
          .status(200)
          .send({ status: true, message: "Updated successfully." });
      },
    );
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .send({ status: false, message: "Internal server error" });
  }
};

// Function that Delete Collection Category items
exports.DeleteCollectionCategory = async (req, res) => {
  console.log("delete item=>", req.body.itemId);
  try {
    if (req.body && req.body.itemId) {
      const response = await CollectionCategory.deleteOne({
        _id: req.body.itemId,
      });
      return res
        .status(200)
        .send({ status: true, message: "Deleted successfully." });
    } else {
      return res
        .status(400)
        .send({ sataus: false, message: "Something went wrong!" });
    }
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .send({ status: false, message: "Internal server error" });
  }
};
