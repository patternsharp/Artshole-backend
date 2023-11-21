const Collection = require("../../models/Collection");
var fs = require('fs');
var multer = require('multer');


//file upload function
var UploadCollectionImage = multer({
    storage: multer.diskStorage({
        destination: function (req, file, callback) {
            if (!fs.existsSync(dir)) {
                fs.mkdirSync(dir);
            }
            callback(null, './collectionImages');
        },
        filename: function (req, file, callback) {
            callback(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
        }
    }),

    fileFilter: function (req, file, callback) {
        var ext = path.extname(file.originalname)
        if (ext !== '.png' && ext !== '.jpg' && ext !== '.jpeg') {
            return callback(null, false)
        }
        callback(null, true)
    }
})

// Add collection function
exports.AddCollection = async (req, res) => {

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

// Function that get all collections
exports.GetAllCollections = async (req, res) => {
    try {
        let collection_List = await Collection.aggregate([
            { $match: { isDeleted: false, isBlocked: false } },
            {
                $lookup:
                {
                    from: 'users',
                    localField: 'userId',
                    foreignField: '_id',
                    as: 'author'
                }
            },
            {
                $lookup:
                {
                    from: 'users',
                    localField: 'favorited',
                    foreignField: '_id',
                    as: 'favorited'
                }
            },
            {
                $lookup:
                {
                    from: 'users',
                    localField: 'liked',
                    foreignField: '_id',
                    as: 'liked'
                }
            },
            {
                $lookup:
                {
                    from: 'users',
                    localField: 'contributer',
                    foreignField: '_id',
                    as: 'contributer'
                }
            },
            {
                $lookup:
                {
                    from: 'artworks',
                    localField: 'artworks',
                    foreignField: '_id',
                    as: 'artworks'
                }
            },
            {
                $lookup:
                {
                    from: 'comments',
                    localField: 'comments',
                    foreignField: '_id',
                    as: 'comments'
                }
            },
        ]);
        console.log("collection_list=>", collection_List)
        res.status(200).send(collection_List);
    } catch (err) {
        console.error(err.message);
        return res.status(500).send({ status: false, message: 'Internal server error' });
    }
};

// Function that Update Artwork Category items
// exports.UpdateArtworkCategory = async (req, res) => {
//     const { itemTitle, itemId } = req.body;

//     try {
//         let art = await ArtworkCategory.findOne({ itemTitle });

//         if (art) {
//             return res
//                 .status(400)
//                 .send({ status: false, message: "This Category item already exists" });
//         }

//         ArtworkCategory.findByIdAndUpdate(itemId, { itemTitle: itemTitle }, (err) => {
//             if (err) {
//                 res.status(500).send({ status: false, message: "Something went wrong!" });
//                 return;
//             }
//             res.status(200).send({ status: true, message: "Updated successfully." });
//         });
//     } catch (err) {
//         console.error(err.message);
//         return res.status(500).send({ status: false, message: 'Internal server error' });
//     }
// };

// // Function that Get Artwork Category items
// exports.DeleteArtwork = (req, res) => {
//     try {
//         if (req.body && req.body.itemId) {
//             User.findByIdAndUpdate(
//                 req.body.userId,
//                 { isDeleted: true },
//                 (err, data) => {
//                     if (data.isDeleted) {
//                         res.status(200).json({
//                             status: true,
//                             title: "User deleted.",
//                         });
//                     } else {
//                         res.status(400).json({
//                             errorMessage: err,
//                             status: false,
//                         });
//                     }
//                 }
//             );
//         } else {
//             res.status(400).json({
//                 errorMessage: "Add proper parameter first!",
//                 status: false,
//             });
//         }
//     } catch (e) {
//         res.status(400).json({
//             errorMessage: "Something went wrong!",
//             status: false,
//         });
//     }
// };