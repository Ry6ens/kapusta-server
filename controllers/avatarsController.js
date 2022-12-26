const Image = require("../models/image");
const multer = require("multer");

const uploadAvatar = async (req, res) => {
    const { _id: owner } = req.user;

    const Storage = multer.diskStorage({
        destination: 'uploads',
        filename: (req, file, cb) => {
            cb(null.file.originalname);
        },
    });

    const upload = multer({
        storage: Storage
    }).single('testImage')

    const result = await Image.findOneAndUpdate(
        { owner },
        { balance: req.body.newBalance },
        { new: true }
    );
    res.status(201).json({ newBalance: result.balance });
  };

module.exports = {
    uploadAvatar
};