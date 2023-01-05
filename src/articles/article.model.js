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

// articleSchema.post("findOneAndUpdate", async function () {
//     console.log('after saving')
//     let docToUpdate = await this.model.findOne(this.getQuery());
//     console.log(docToUpdate)
//     const wordsPerMinute = 180;
// 	const minutes = (docToUpdate.body.match(/(\w+)/g).length) / wordsPerMinute;
// 	docToUpdate.readingTime = Math.ceil(minutes);
//     // console.log(this.readingTime, minutes)
//     this.set({ readingTime: Math.ceil(minutes) });
// });

module.exports = mongoose.model("Article", articleSchema);
