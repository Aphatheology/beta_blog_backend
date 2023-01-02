const mongoose = require("mongoose");
const slug = require("mongoose-slug-generator");
mongoose.plugin(slug);

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
        manualSlug: {
            type: String,
            unique: true,
            required: true,
        },
        slug: { 
            type: String, 
            slug: "title", 
            unique: true 
        },
        timestamp: {
            type: Date,
            default: Date.now,
        },
    },
    { timeStamps: true }
);

module.exports = mongoose.model("Article", articleSchema);
