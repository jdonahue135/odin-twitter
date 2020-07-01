//adapted from tutorial: https://www.positronx.io/react-file-upload-tutorial-with-node-express-and-multer/

var multer = require("multer");
const { uuid } = require("uuidv4");

const DIR = "./public/images/";

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, DIR);
  },
  filename: (req, file, cb) => {
    const fileName = file.originalname.toLowerCase().split(" ").join("-");
    cbValue = uuid() + "-" + fileName;
    cb(null, cbValue);
  },
});

var upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    if (
      file.mimetype == "image/png" ||
      file.mimetype == "image/jpg" ||
      file.mimetype == "image/jpeg"
    ) {
      cb(null, true);
    } else {
      cb(null, false);
      return cb(new Error("Only .png, .jpg and .jpeg format allowed!"));
    }
  },
});

module.exports = { upload };
