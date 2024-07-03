const Hotel = require("../models/hotel");
const cloudinary = require('cloudinary').v2;
const mbxGeocoding = require("@mapbox/mapbox-sdk/services/geocoding");
const mapBoxToken = process.env.MAPBOX_TOKEN;
const geoCoder = mbxGeocoding({ accessToken: mapBoxToken });

module.exports.index = async (req, res) => {
    const hotels = await Hotel.find({});
    res.render("hotels/index", { hotels });
}

module.exports.renderNewForm = (req, res) => {
    res.render("hotels/new");
}

module.exports.createHotel = async (req, res) => {
    const geoData = await geoCoder.forwardGeocode({
        query: req.body.hotel.location,
        limit: 1
    }).send();
    const hotel = new Hotel(req.body.hotel);
    hotel.geometry = geoData.body.features[0].geometry;
    hotel.image = req.files.map((file) => ({ url: file.path, fileName: file.filename }));
    hotel.author = req.user._id;
    await hotel.save();
    console.log(hotel);
    req.flash("success", "Hotel added successfully!");
    res.redirect(`/hotels/${hotel._id}`);
}

module.exports.showHotel = async (req, res) => {
    const hotel = await Hotel.findById(req.params.id).populate({
        path: "reviews",
        populate: {
            path: "author",
        }
    }).populate("author");
    if (!hotel) {
        req.flash("error", "Hotel does not exist!");
        return res.redirect("/hotels");
    }
    res.render("hotels/details", { hotel });
}

module.exports.renderEditForm = async (req, res) => {
    const { id } = req.params;
    const hotel = await Hotel.findById(id);
    if (!hotel) {
        req.flash("error", "Hotel does not exist!");
        return res.redirect("/hotels");
    }
    res.render("hotels/edit", { hotel });
}

module.exports.editHotel = async (req, res) => {
    const { id } = req.params;
    const hotel = await Hotel.findByIdAndUpdate(id, { ...req.body.hotel });
    const imgs = req.files.map((file) => ({ url: file.path, fileName: file.filename }));
    hotel.image.push(...imgs);
    await hotel.save();
    if (req.body.deleteImages) {
        for (let filename of req.body.deleteImages) {
            await cloudinary.uploader.destroy(filename);
        }
        await hotel.updateOne({ $pull: { image: { fileName: { $in: req.body.deleteImages } } } });
    }
    req.flash("success", "Hotel updated successfully!");
    res.redirect(`/hotels/${hotel._id}`);
}

module.exports.deleteHotel = async (req, res) => {
    const { id } = req.params;
    await Hotel.findByIdAndDelete(id);
    req.flash("success", "Hotel deleted successfully!");
    res.redirect("/hotels");
}
