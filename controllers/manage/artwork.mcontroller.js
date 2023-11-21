const Artwork = require("../../models/Artwork");
var fs = require('fs');
var multer = require('multer');

// Add artwork function
exports.AddArtwork = async (req, res) => {

    try {
        let art = await Artwork.findOne({ title: req.body.title });

        if (art) {
            return res
                .status(400)
                .json({ errors: [{ status: false, message: "This Category item already exists" }] });
        }

        art = new Artwork();
        art.title = req.body.title;
        art.imageUrl = req.files[0].filename;
        art.description = req.body.description;
        art.price = req.body.price;
        art.category = req.body.category;
        art.size = req.body.size;
        art.userId = req.body.userId;

        await art.save((err) => {
            if (err) {
                res.status(500).send({ status: false, message: "Something went wrong!" });
                return;
            }
            res.status(200).send({ status: true, message: "Added successfully." });
        });
    } catch (err) {
        console.error(err.message);
        return res.status(500).send({ status: false, message: 'Internal server error' });
    }
};

// Function that Get Artworks
exports.GetAllArtworks = async (req, res) => {
    try {
        let art_List = await Artwork.find({ isDeleted: false })
            .populate({
                path: 'author',
                populate: [
                    { path: 'jobCategory' }
                ]
            })
            .populate("liked")
            .populate("viewed")
            .populate({
                path: 'comments',
                populate: [
                    { path: 'author' }
                ]
            })
            .exec();

        return res.status(200).send({
            status: true,
            message: 'success',
            artworkList: art_List
        });
    } catch (error) {
        console.error(error.message);
        return res.status(500).send({ status: false, message: 'Internal server error' });
    }
};

// Function that Update Artwork Category items
exports.UpdateArtworkCategory = async (req, res) => {
    const { itemTitle, itemId } = req.body;

    try {
        let art = await ArtworkCategory.findOne({ itemTitle });

        if (art) {
            return res
                .status(400)
                .send({ status: false, message: "This Category item already exists" });
        }

        ArtworkCategory.findByIdAndUpdate(itemId, { itemTitle: itemTitle }, (err) => {
            if (err) {
                res.status(500).send({ status: false, message: "Something went wrong!" });
                return;
            }
            res.status(200).send({ status: true, message: "Updated successfully." });
        });
    } catch (err) {
        console.error(err.message);
        return res.status(500).send({ status: false, message: 'Internal server error' });
    }
};

// Function that Get Artwork Category items
exports.DeleteArtwork = (req, res) => {
    try {
        if (req.body && req.body.itemId) {
            User.findByIdAndUpdate(
                req.body.userId,
                { isDeleted: true },
                (err, data) => {
                    if (data.isDeleted) {
                        res.status(200).json({
                            status: true,
                            title: "User deleted.",
                        });
                    } else {
                        res.status(400).json({
                            errorMessage: err,
                            status: false,
                        });
                    }
                }
            );
        } else {
            res.status(400).json({
                errorMessage: "Add proper parameter first!",
                status: false,
            });
        }
    } catch (e) {
        res.status(400).json({
            errorMessage: "Something went wrong!",
            status: false,
        });
    }
};