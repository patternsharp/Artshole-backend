const ArtistCategory = require("../../models/ArtistCategory");
const JobCategory = require("../../models/JobCategory");
const ArtworkCategory = require("../../models/ArtworkCategory");
const CollectionCategory = require("../../models/CollectionCategory");

exports.AddArtistCategory = async (req, res) => {
  const { name } = req.body;
  try {
    let artist_Category = await ArtistCategory.findOne({ name });

    if (artist_Category) {
      return res
        .status(400)
        .send({ status: false, message: "This Category item already exists" });
    }

    artist_Category = new ArtistCategory({
      name: name,
    });

    artist_Category.save((error) => {
      if (error) {
        return res
          .status(500)
          .send({ status: false, message: "Internal server error" });
      }
      return res.status(200).send({
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

exports.UpdateArtistCategory = async (req, res) => {
  const { name, id } = req.body;
  try {
    let artist_Category = await ArtistCategory.findOne({ name });

    if (artist_Category) {
      return res
        .status(400)
        .send({ status: false, message: "This Category item already exists" });
    }

    ArtistCategory.findByIdAndUpdate(id, { name: name }, (error) => {
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

exports.DeleteArtistCategory = async (req, res) => {
  try {
    if (req.body && req.body._id) {
      const response = await ArtistCategory.deleteOne({ _id: req.body._id });
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

exports.AddJobCategory = async (req, res) => {
  const { name } = req.body;

  try {
    let job_Category = await JobCategory.findOne({ name });

    if (job_Category) {
      return res
        .status(400)
        .send({ status: false, message: "This Category item already exists" });
    }

    job_Category = new JobCategory({
      name: name,
    });

    job_Category.save((error) => {
      if (error) {
        return res
          .status(500)
          .send({ status: false, message: "Internal server error" });
      }
      return res.status(200).send({
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

exports.UpdateJobCategory = async (req, res) => {
  const { id, name } = req.body;

  try {
    let job_Category = await JobCategory.findOne({ name });
    if (job_Category) {
      return res
        .status(400)
        .send({ status: false, message: "This Category item already exists" });
    }

    JobCategory.findByIdAndUpdate(id, { name: name }, (error) => {
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

exports.DeleteJobCategory = async (req, res) => {
  try {
    if (req.body && req.body.id) {
      const response = await JobCategory.deleteOne({ _id: req.body.id });
      return res
        .status(200)
        .send({ status: true, message: "Deleted successfully." });
    } else {
      return res
        .status(400)
        .send({ sataus: false, message: "Something went wrong!" });
    }
  } catch (error) {
    return res
      .status(500)
      .send({ status: false, message: "Internal server error" });
  }
};

exports.AddArtworkCategory = async (req, res) => {
  const { name } = req.body;
  try {
    let art_Category = await ArtworkCategory.findOne({ name });

    if (art_Category) {
      return res
        .status(400)
        .send({ status: false, message: "This Category item already exists" });
    }

    art_Category = new ArtworkCategory({
      name: name,
    });

    art_Category.save((error) => {
      if (error) {
        return res
          .status(500)
          .send({ status: false, message: "Internal server error" });
      }
      return res.status(200).send({
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
  const { name, id } = req.body;

  try {
    let art_Category = await ArtworkCategory.findOne({ name });

    if (art_Category) {
      return res
        .status(400)
        .send({ status: false, message: "This Category item already exists" });
    }

    ArtworkCategory.findByIdAndUpdate(id, { name: name }, (error) => {
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

// Function that Delete Artwork Category items
exports.DeleteArtworkCategory = async (req, res) => {
  try {
    if (req.body && req.body.id) {
      const response = await ArtworkCategory.deleteOne({
        _id: req.body.id,
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
  const { name } = req.body;
  try {
    let collection_Category = await CollectionCategory.findOne({ name });
    if (collection_Category) {
      return res
        .status(400)
        .send({ status: false, message: "This Category item already exists" });
    }

    collection_Category = new CollectionCategory({
      name: name,
    });

    collection_Category.save((error) => {
      if (error) {
        return res
          .status(500)
          .send({ status: false, message: "Internal server error" });
      }
      return res.status(200).send({
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
  const { name, id } = req.body;

  try {
    let collection_Category = await CollectionCategory.findOne({ name });

    if (collection_Category) {
      return res
        .status(400)
        .send({ status: false, message: "This Category item already exists" });
    }

    CollectionCategory.findByIdAndUpdate(id, { name: name }, (error) => {
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

// Function that Delete Collection Category items
exports.DeleteCollectionCategory = async (req, res) => {
  try {
    if (req.body && req.body.id) {
      const response = await CollectionCategory.deleteOne({
        _id: req.body.id,
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
