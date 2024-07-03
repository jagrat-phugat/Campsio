const Hotel = require("../models/hotel");
const Review = require("../models/review");

module.exports.createReview = async (req, res) => {
    const hotel = await Hotel.findById(req.params.id);
    const review = new Review(req.body.review);
    review.author = req.user._id;
    hotel.reviews.push(review);
    await review.save();
    await hotel.save();
    req.flash("success", "Review added successfully!");
    res.redirect(`/hotels/${hotel._id}`);
}

module.exports.deleteReview = async (req, res) => {
    const { id, review_id } = req.params;
    await Hotel.findByIdAndUpdate(id, { $pull: { reviews: review_id } });
    await Review.findByIdAndDelete(review_id);
    req.flash("success", "Review deleted successfully!");
    res.redirect(`/hotels/${id}`);
}
