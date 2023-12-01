const multer = require("multer");
const path = require("path");
const fs = require("fs");
const uuid = require("uuid");

const storage = multer.diskStorage({
  destination: function (req, file, callback) {
    callback(null, "./uploads/artwork/");
  },
  filename: function (req, file, callback) {
    // callback(null, "upload_" + file.fieldname + "_" + Date.now() + path.extname(file.originalname));
    callback(
      null,
      "upload_" + file.fieldname + "_" + uuid.v4() + "_" + Date.now() + ".jpg",
    );
  },
});

module.exports = () => {
  return multer({
    storage: storage,
    limits: { fileSize: 10 * 1024 * 1024 }, //10MB
    fileFilter: (req, file, callback) => {
      if (
        file.mimetype == "image/png" ||
        file.mimetype == "image/jpg" ||
        file.mimetype == "image/jpeg" ||
        file.mimetype == "image/gif"
      ) {
        callback(null, true);
      } else {
        callback(null, false);
        console.error("error");
        return callback(
          new Error("Only .png, .jpg, .jpeg, .gif format allowed!"),
        );
      }
    },
  }).array("artworkImg");
};
