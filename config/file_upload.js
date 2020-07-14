//adapted from tutorial: https://www.positronx.io/react-file-upload-tutorial-with-node-express-and-multer/
//updated to use aws: https://stackoverflow.com/questions/40494050/uploading-image-to-amazon-s3-using-multer-s3-nodejs#:~:text=json())%3B%20var%20upload,to%20see%20upload%20form%20app

require("dotenv").config();

var multer = require("multer");
const { uuid } = require("uuidv4");
var aws = require("aws-sdk");
var multerS3 = require("multer-s3");

aws.config.update({
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  bucket: process.env.S3_BUCKET_NAME,
});

var s3 = new aws.S3();

var upload = multer({
  storage: multerS3({
    s3: s3,
    bucket: process.env.S3_BUCKET_NAME,
    key: function (req, file, cb) {
      const fileName = file.originalname.toLowerCase().split(" ").join("-");
      cbValue = uuid() + "-" + fileName;
      console.log(file);
      cb(null, cbValue);
    },
  }),
});

module.exports = { upload };
