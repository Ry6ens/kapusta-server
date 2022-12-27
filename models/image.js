const { Schema, model } = require("mongoose");
const { handleSaveErrors } = require("../helpers");

const imageSchema = new Schema(
    {
        name: {
            type: String,
            required: true
        },
        image: {
            data: Buffer,
            contentType: String
        },
        owner: {
            type: Schema.Types.ObjectId,
            ref: "user",
            required: true,
            },
        avatarURL: {
            type: String,
        }
        },
        { versionKey: false, timestamps: true }
    )

    imageSchema.post("save", handleSaveErrors);

    const Image = model("image", imageSchema);

    module.exports = Image;