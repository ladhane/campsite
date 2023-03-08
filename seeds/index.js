const mongoose = require('mongoose');
const Campground = require('../models/campground');
const cities = require('./cities');
const { descriptors, places } = require('./seedHelper');

mongoose.connect('mongodb://127.0.0.1:27017/yelpcamp').then(()=>{
     console.log("OPEN FOE CONNECTION!!");
}).catch((err)=>{
    console.log("OHH NOO ERROR!!!");
    console.log(err);
})

const sample = array => array[Math.floor(Math.random() * array.length)];

const seedDB = async()=>{
    await Campground.deleteMany({});
    for(let i = 0; i<300; i++){
         const random = Math.floor(Math.random()*1000);
         const price = Math.floor(Math.random()*30)+10;
         const camp = new Campground({
            author: "63f0ca6f20d87090a3539aea",
            location: `${cities[random].city},${cities[random].state}`,
            title: `${sample(descriptors)} ${sample(places)}`,
            description: 'Lorem ipsum dolor, sit amet consectetur adipisicing elit. Dolor animi iusto hic non, in molestiae eaque aut amet itaque accusamus dolore vero molestias sunt. Adipisci ea in similique obcaecati ut.',
            price: price,
            geometry: {
                type: "Point",
                coordinates: [cities[random].longitude,cities[random].latitude]
            },
            images: [
                {
                  url: 'https://res.cloudinary.com/db7bkn6g5/image/upload/v1676804661/hhvrqifkadlznbbjgice.jpg',
                  filename: 'YelpCamp/hhvrqifkadlznbbjgice',
                },
                {
                  url: 'https://res.cloudinary.com/db7bkn6g5/image/upload/v1676804506/eomsicbr0nablohwxton.jpg',
                  filename: 'YelpCamp/eomsicbr0nablohwxton',
                }
              ]
        });
         await camp.save();
    }
}

seedDB().then(()=>{
    mongoose.connection.close();
});

