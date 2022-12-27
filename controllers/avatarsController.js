const Image = require("../models/image");
const Jimp = require('jimp');
const fs = require("fs/promises");
const path = require("path");

const avatarsDir = path.join(__dirname, "../", "public", "avatars")

const updateAvatar = async (req, res) => {
    const { _id: owner } = req.user;
    const avatar = await Image.findOne({owner});
        if (!avatar) {
            const {path: tempUpload, originalname} = req.file;
            const filename = `${owner}_${originalname}`;
            const resultUpload = path.join(avatarsDir, filename);
            await fs.rename(tempUpload, resultUpload);

            const resizeAvatar = await Jimp.read(resultUpload);
            await resizeAvatar.resize(250, 250).write(resultUpload);

            const avatarURL = path.join("avatars", filename);

            const newAvatar = await Image.create({
                name: filename,
                avatarUrl: avatarURL,
                image: {
                data: req.file.filename,
                contentType: "image/png"
                },
                owner: owner,
            });

            res.status(201).json({newAvatar});

        } else {
            const {path: tempUpload, originalname} = req.file;
            const filename = `${owner}_${originalname}`;
            const resultUpload = path.join(avatarsDir, filename);
            await fs.rename(tempUpload, resultUpload);

            const resizeAvatar = await Jimp.read(resultUpload);
            await resizeAvatar.resize(250, 250).write(resultUpload);

            const avatarURL = path.join("avatars", filename);

            await Image.findOneAndUpdate({
                name: filename,
                avatarURL: avatarURL,
                image: {
                data: req.file.filename,
                contentType: "image/png"
                },
                owner: owner,
            });

            const updatedAvatar = await Image.find({owner});
            'https://kapusta-server.herokuapp.com/'
            console.log(updatedAvatar)
            const imgUrl = `{data:image/png;base64,${updatedAvatar[0].image.data}}`

            console.log(imgUrl)

            res.status(200).json({URL: updatedAvatar.avatarURL, });
        }

};

module.exports = {
    updateAvatar
};