const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const moment = require("moment");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const userSchema = new mongoose.Schema(
    {
        email: {
            type: String,
            unique: true,
            required: true,
        },
        username: {
            type: String,
            unique: true,
            required: true,
        },
        password: {
            type: String,
            required: true,
        },
        firstname: {
            type: String,
            required: true,
        },
        lastname: {
            type: String,
            required: true,
        },
        articles: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Article",
            },
        ],
    },
    { timeStamps: true }
);

userSchema.pre("save", async function () {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

userSchema.methods.createJWT = function () {
    const payload = {
        id: this._id,
        email: this.email,
        iat: moment().unix(),
        exp: moment().add(process.env.JWT_EXPIRES_IN, "minutes").unix(),
    };

    return jwt.sign(payload, process.env.JWT_SECRET);
};

userSchema.methods.correctPassword = async function (
    candidatePassword,
    userPassword
) {
    return await bcrypt.compare(candidatePassword, userPassword);
};

module.exports = mongoose.model("User", userSchema);
