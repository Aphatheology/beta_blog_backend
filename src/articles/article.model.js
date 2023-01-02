const mongoose = require("mongoose");

const articleSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            unique: true,
            required: true,
        },
        description: {
            type: String,
        },
        author: {
            type: String,
            ref: "User",
            required: true,
        },
        state: {
            type: String,
            enum: ["draft", "published"],
            required: true,
            default: "draft",
        },
        readCount: {
            type: Number,
            default: 0,
        },
        readingTime: {
            type: Number,
            default: 0,
        },
        tags: {
            type: String,
        },
        body: {
            type: String,
            required: true,
        },
        timestamp: {
            type: Date,
            default: Date.now,
        },
    },
    { timeStamps: true }
);

module.exports = mongoose.model("Article", articleSchema);
