const joi = require("joi");

module.exports.hotelSchema = joi.object({
    hotel: joi.object({
        title: joi.string().required(),
        price: joi.number().required().min(0),
        description: joi.string().required(),
        // image: joi.string().required(),
        location: joi.string().required()
    }).required(),
    deleteImages: joi.array()

});

module.exports.reviewSchema = joi.object({
    review: joi.object({
        rating: joi.number().required().min(1).max(5),
        body: joi.string().required()
    }).required()
})