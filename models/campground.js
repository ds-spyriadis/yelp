const mongoose = require('mongoose');
const Review = require('./review');
const Schema= mongoose.Schema;



const ImageSchema = new Schema({                // dhmiourgw tis oiknes ksexwrista gia na mporesw na dimiourghsw meta ena virtual thumbnail
    url: String,
    filename: String
});

ImageSchema.virtual('thumbnail').get(function() {                    // kanw ena virtual schema
    return this.url.replace('/upload','/upload/w_50');
});

const opts = {toJSON: {virtuals: true}};   // giati h mongoose den uposthrizei kai den perilambanei apo monh ths virtual otan metatrepoume apo document to Json    c56->569 8:00

const CampgroundSchema = new Schema({
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
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    reviews: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Review'
        }
    ]
},opts);


CampgroundSchema.virtual('properties.popUpMarkup').get(function() {                    // kanw ena virtual schema
    return `<strong><a href="/campgrounds/${this._id}">${this.title}</a><strong>
    <p>${this.description.substring(0,20)}...</p>`
});



CampgroundSchema.post('findOneAndDelete', async function (doc) {


    if (doc) {
        await Review.deleteMany({
            _id: {
                 $in: doc.reviews
            }
        })
    }
})


module.exports = mongoose.model('Campground',CampgroundSchema);