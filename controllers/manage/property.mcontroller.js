const ArtworkProperty = require("../../models/ArtworkProperty");

// Function that Add Artwork Property items
exports.AddArtworkProperty = async (req, res) => {
  const { itemTitle, parentId } = req.body;

  try {
    let art_Property = await ArtworkProperty.findOne({ itemTitle });

    if (art_Property) {
      return res
        .status(400)
        .send({ status: false, message: "This Property item already exists" });
    }

    art_Property = new ArtworkProperty({
      itemTitle: itemTitle,
      parentId: parentId,
    });

    await art_Property.save((error) => {
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

// Function that Get Artwork Property items
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

// Function that Update Artwork Property items
exports.UpdateArtworkProperty = async (req, res) => {
  const { itemTitle, itemId } = req.body;

  try {
    let art_Property = await ArtworkProperty.findOne({ itemTitle });

    if (art_Property) {
      return res
        .status(400)
        .send({ status: false, message: "This Property item already exists" });
    }

    ArtworkProperty.findByIdAndUpdate(
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
          .send({ status: true, message: "Updated successfully."});
      },
    );
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .send({ status: false, message: "Internal server error" });
  }
};

// Function that Delete Artwork Property items
exports.DeleteArtworkProperty = async (req, res) => {
  console.log("delete item12313131313=>", req.body.itemId);
  try {
    if (req.body && req.body.itemId) {
      const response = await ArtworkProperty.deleteOne({
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
