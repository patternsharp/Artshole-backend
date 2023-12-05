const ArtworkProperty = require("../../models/ArtworkProperty");

// Function that Add Artwork Property items
exports.AddArtworkProperty = async (req, res) => {
  const { name, parentId } = req.body;
  try {
    let art_Property = null;
    await ArtworkProperty.findOne({ parentId: parentId, name: name })
      .then((item) => {
        art_Property = item;
      })
      .catch((err) => {
        console.log(err);
      });

    if (art_Property) {
      return res
        .status(400)
        .send({ status: false, message: "This Property item already exists" });
    }
    art_Property = new ArtworkProperty({
      name: name,
      parentId: parentId,
    });

    art_Property.save((error) => {
      if (error) {
        return res
          .status(500)
          .send({ status: false, message: "Internal server error" });
      }
      return res.status(200).send({
        status: true,
        message: "Added successfully.",
        result: art_Property,
      });
    });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .send({ status: false, message: "Internal server error" });
  }
};

exports.GetArtworkProperty = async (req, res) => {
  try {
    let art_Property_List = await ArtworkProperty.find();
    return res.status(200).send(art_Property_List);
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .send({ status: false, message: "Internal server error" });
  }
};

exports.UpdateArtworkProperty = async (req, res) => {
  const { name, id } = req.body;

  try {
    let art_Property = await ArtworkProperty.findOne({ name });

    if (art_Property) {
      return res
        .status(400)
        .send({ status: false, message: "This Property item already exists" });
    }

    ArtworkProperty.findByIdAndUpdate(id, { name: name }, (error) => {
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

exports.DeleteArtworkProperty = async (req, res) => {
  try {
    if (req.body && req.body.id) {
      const response = await ArtworkProperty.deleteOne({
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
