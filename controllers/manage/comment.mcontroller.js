const Comment = require("../../models/Comment");
const { ObjectId } = require("mongodb");

// Function that Add Artwork Category items
exports.AddComment = async (req, res) => {
  const { type, artworkId, collectionId, pCommentId, userId, content } =
    req.body;

  console.log(req.body);

  try {
    let one_comment = new Comment({
      type: type,
      artworkId: artworkId,
      collectionId: collectionId,
      pCommentId: pCommentId,
      userId: userId,
      content: content,
    });

    await one_comment.save((err) => {
      if (err) {
        res
          .status(500)
          .send({ status: false, message: "Something went wrong!" });
        return;
      }
      res.status(200).send({ status: true, message: "Added successfully." });
    });
  } catch (err) {
    console.error(err.message);
    return res
      .status(500)
      .send({ status: false, message: "Internal server error" });
  }
};

// Function that get comments
exports.GetComments = async (req, res) => {
  const { comment_id_list } = req.body;

  try {
    let ids = comment_id_list.map((id) => new ObjectId(id));
    let comment_List = await Comment.find({
      _id: { $in: ids },
      isDeleted: false,
    });
    console.log(comment_List);
    res.status(200).send(comment_List);
  } catch (err) {
    console.error(err.message);
    return res
      .status(500)
      .send({ status: false, message: "Internal server error" });
  }
};

// Function that Update Artwork Category items
// exports.UpdateArtworkCategory = async (req, res) => {
//   const { itemTitle, itemId } = req.body;

//   try {
//     let art_Category = await Comment.findOne({ itemTitle });

//     if (art_Category) {
//       return res
//         .status(400)
//         .send({ status: false, message: "This Category item already exists" });
//     }

//     ArtworkCategory.findByIdAndUpdate(itemId, { itemTitle: itemTitle }, (err) => {
//       if (err) {
//         res.status(500).send({ status: false, message: "Something went wrong!" });
//         return;
//       }
//       res.status(200).send({ status: true, message: "Updated successfully." });
//     });
//   } catch (err) {
//     console.error(err.message);
//     return res.status(500).send({ status: false, message: 'Internal server error' });
//   }
// };

// // Function that Delete Artwork Category items
// exports.DeleteArtworkCategory = async (req, res) => {
//   console.log("delete item=>", req.body.itemId)
//   try {
//     if (req.body && req.body.itemId) {
//       const response = await Comment.deleteOne({ _id: req.body.itemId });
//       res.status(200).send({ status: true, message: "Deleted successfully." });
//     } else {
//       res.status(400).send({ sataus: false, message: "Something went wrong!" });
//     }
//   } catch (err) {
//     console.error(err.message);
//     return res.status(500).send({ status: false, message: 'Internal server error' });
//   }
// };
