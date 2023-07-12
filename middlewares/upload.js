const multer = require("multer");

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "uploads/");
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
        console.log(file.originalname, "oroginal name");
        console.log("image", file);
        const filename = file.originalname.split(".")[0];
        const extension = `.${file.originalname.split(".")[1]}`;

        cb(null, filename + "-" + uniqueSuffix + extension);
    },
});

exports.upload = multer({ storage: storage });
