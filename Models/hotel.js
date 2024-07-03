const mongoose = require("mongoose");
const Review = require("./review");
const Schema = mongoose.Schema;

const ImageSchema = new Schema({
    url: String,
    fileName: String
});

ImageSchema.virtual("thumbnail").get(function () {
    return this.url.replace("/upload", "/upload/w_200");
});

const opts = { toJSON: {virtuals: true} };

const HotelSchema = new Schema({
    title: String,
    image: [ImageSchema],
    geometry: {
        type: {
            type: String,
            enum: ["Point"],
            required: true
        },
        coordinates: {
            type: [Number],
            required: true
        }
    },
    price: Number,
    description: String,
    location: String,
    author: {
        type: Schema.Types.ObjectId,
        ref: "User",
    },
    reviews: [
        {
            type: Schema.Types.ObjectId,
            ref: "Review"
        }
    ]
}, opts);

HotelSchema.virtual("properties.popUpText").get(function () {
    return `<strong><a href="/hotels/${this._id}">${this.title}</a></strong>`
})

HotelSchema.post("findOneAndDelete", async function (document) {
    if (document) {
        await Review.deleteMany({
            _id: {
                $in: document.reviews
            }
        });
    }
});

module.exports = mongoose.model("Hotel", HotelSchema);
