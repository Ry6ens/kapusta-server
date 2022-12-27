// const Image = require("../models/image");
const Jimp = require('jimp');
const fs = require("fs/promises");
const path = require("path");

const avatarsDir = path.join(__dirname, "../", "public", "avatars")

const updateNewAvatar = async (file, owner) => {
    const {path: tempUpload, originalname} = file;
    const filename = `${owner}_${originalname}`;
    const resultUpload = path.join(avatarsDir, filename);
    await fs.rename(tempUpload, resultUpload);

    const resizeAvatar = await Jimp.read(resultUpload);
    await resizeAvatar.resize(250, 250).write(resultUpload);

    const avatarURL = path.join("avatars", filename);

    return avatarURL;

            // 'https://kapusta-server.herokuapp.com/'

};

module.exports = {
    updateNewAvatar,
};