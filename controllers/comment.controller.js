const Comment = require("../models/Comment");
const Artwork = require("../models/Artwork");
const Collection = require('../models/Collection')

// Add comment function
exports.AddComment = async (req, res) => {
    try {
        const { artworkId, collectionId, pCommentId, author, message } = req.body;

        console.log(req.body)

        let one_comment = new Comment({
            artworkId: artworkId,
            collectionId: collectionId,
            pCommentId: pCommentId,
            author: author,
            message: message,
        })

        if (artworkId != null) {
            let artwork = await Artwork.findById(artworkId)
            artwork.comments = [...artwork.comments, one_comment._id]
            await artwork.save();
        }

        if (collectionId != null) {
            let collection = await Collection.findById(collectionId)
            collection.comments = [...collection.comments, one_comment._id]
            await collection.save();
        }

        await one_comment.save();

        return res.status(200).send({ status: true, message: "Added successfully", result: one_comment });
    } catch (error) {
        console.error(error);
        return res.status(500).send({ status: false, message: 'Internal server error' });
    }
};

// Function that Get Comments
exports.GetComments = async (req, res) => {
    try {
        let comment_List = await Comment.find({ isDeleted: false })
            .populate("author")
            .exec();

        if (!comment_List) {
            return res.status(400).send({ status: false, message: 'There is no comment.' });
        }

        return res.status(200).send({
            status: true,
            message: 'success',
            commentList: comment_List
        });
    } catch (error) {
        console.error(error);
        return res.status(500).send({ status: false, message: 'Internal server error' });
    }
};