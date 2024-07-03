const express = require("express");
const router = express.Router({ mergeParams: true });
const catchAsync = require("../utilities/catchAsync");
const Hotel = require("../models/hotel");
const Review = require("../models/review");
const ExpressError = require("../utilities/expressErrors");
const { validateReview, isLoggedIn, isReviewAuthor } = require("../middleware");
const reviews = require("../controllers/reviews");

router.post("/", isLoggedIn, validateReview, catchAsync(reviews.createReview));

router.delete("/:review_id", isLoggedIn, isReviewAuthor, catchAsync(reviews.deleteReview));

module.exports = router;