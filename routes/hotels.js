const express = require("express");
const router = express.Router();
const Hotel = require("../models/hotel");
const catchAsync = require("../utilities/catchAsync");
const hotels = require("../controllers/hotels");
const { isLoggedIn, isAuthor, validateHotel } = require("../middleware");
const multer = require("multer");
const { storage } = require("../cloudinary");
const upload = multer({ storage });

router.route("/")
    .get(catchAsync(hotels.index))
    .post(isLoggedIn, upload.array('image'), validateHotel, catchAsync(hotels.createHotel))

router.get("/new", isLoggedIn, hotels.renderNewForm);

router.route("/:id")
    .get(catchAsync(hotels.showHotel))
    .put(isLoggedIn, isAuthor, upload.array('image'), validateHotel, catchAsync(hotels.editHotel))
    .delete(isLoggedIn, isAuthor, catchAsync(hotels.deleteHotel))

router.get("/:id/edit", isLoggedIn, isAuthor, catchAsync(hotels.renderEditForm));

module.exports = router;
