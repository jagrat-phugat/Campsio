const mongoose = require("mongoose");
const Hotel = require("../models/hotel");
const cities = require("./cities");
const { places, descriptors } = require("./seedHelpers");

mongoose.set("strictQuery", false);
mongoose.connect("mongodb://localhost:27017/campsio", {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "Connection error: "));
db.once("open", () => {
    console.log("Database connected successfully!");
});

const randomElement = (arr) => arr[Math.floor(Math.random() * arr.length)];

const seedDB = async () => {
    await Hotel.deleteMany({});
    for (let i = 0; i < 400; i++) {
        const randomCity = randomElement(cities);
        const randPrice = Math.floor(Math.random() * 1000) + 300;
        const newHotel = new Hotel({
            author: "62309d4f56a13b5dbee373b2",
            title: `${randomElement(descriptors)} ${randomElement(places)}`,
            location: `${randomCity.city}, ${randomCity.state}`,
            description: "Lorem, ipsum dolor sit amet consectetur adipisicing elit. Quos accusamus totam dolorum, ut nemo voluptatem odit repudiandae sed, voluptatibus, obcaecati natus aut veritatis! Repellendus nostrum quae itaque repellat quaerat nihil.",
            price: randPrice,
            geometry: {
                type: "Point",
                coordinates: [
                    randomCity.longitude,
                    randomCity.latitude
                ]
            },
            image: [
                {
                    url: 'https://res.cloudinary.com/dsuoqau8g/image/upload/v1649682415/mrcimz4x6tjll3s0vgd9.jpg',
                    fileName: 'mrcimz4x6tjll3s0vgd9',
                },
                {
                    url: 'https://res.cloudinary.com/dsuoqau8g/image/upload/v1649682415/o2l8oryurjilbtkbkkjr.jpg',
                    fileName: 'o2l8oryurjilbtkbkkjr',
                }
            ],
        });
        await newHotel.save();
    }
};

seedDB().then(() => {
    mongoose.connection.close();
})
