const mongoose = require('mongoose');
const Review = require('./review');

const ImageSchema = mongoose.Schema({
    url:String,
    filename:String
});

ImageSchema.virtual('thumbnail').get(function(){
    return this.url.replace('/upload','/upload/w_200');
});
const opts = { toJSON: { virtuals: true } };
const CampgroundSchema = mongoose.Schema({
    title: String,
    images: [ImageSchema],
    geometry: {
        type: {
            type: String,
            enum: ['Point'],
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
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    reviews:[
        {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Review'
    }]
},opts);

CampgroundSchema.virtual('properties.popUpMarkUp').get(function(){
    return `
    <strong><a href="/campgrounds/${this._id}">${this.title}</a></strong>
    <p>${this.location}</p>`;
});

CampgroundSchema.post('findOneAndDelete', async(doc)=>{
    if(doc){
     await Review.deleteMany({
        _id: {
            $in: doc.reviews
        }
     })
    }
})

const Campground = mongoose.model('Campground',CampgroundSchema);

module.exports = Campground;

