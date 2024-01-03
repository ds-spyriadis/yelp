const Campground = require('../models/campground');
const { cloudinary } = require("../cloudinary");
const mbxGeocoding= require('@mapbox/mapbox-sdk/services/geocoding');
const mapBoxToken = process.env.MAPBOX_TOKEN;           
const geocoder = mbxGeocoding({accessToken: mapBoxToken})    // contains the 2 methods forward geocode, kai akomh mia aplws 8a xrhsimopoioisw th mia


module.exports.index = async (req, res) => {
    const campgrounds = await Campground.find({});
    res.render('campgrounds/index',{campgrounds})
}

module.exports.renderNewForm = (req,res)=>{
    res.render('campgrounds/new')
}


module.exports.createCampground = async(req,res,next) => {
    const geoData = await geocoder.forwardGeocode({             //dhmhiourgoume kai stelnoume to query me tis suntetagmenes
        query: req.body.campground.location,
        limit:1
    }).send()
    const campground = new Campground(req.body.campground);
    campground.geometry = geoData.body.features[0].geometry;
    campground.images = req.files.map(f => ({url: f.path, filename: f.filename}))       //  <-- take the path and the filename, make a new object and put in the array
    campground.author = req.user._id;
     await campground.save();
     console.log(campground);
    req.flash('success','Successfully made a new campground!')
    res.redirect(`/campgrounds/${campground._id}`);    
}

module.exports.showCampground = async (req, res) => {
    const campground = await Campground.findById(req.params.id).populate({  // kanoume ena antikeimeno, me ena nested populate gia kathe review gia na vlepoume ton kathe ena ksexwrista kai meta ena akomh populate ksexwrista gia to ka8e campground  
        path: 'reviews',
        populate :{
            path:'author'
        }}).populate('author');
    if(!campground){
        req.flash('error','Cannot find that campground!')
        res.redirect('/campgrounds');
    }
    res.render('campgrounds/show', {campground} );
}
module.exports.renderEditForm = async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findById(id)
    if(!campground){
        req.flash('error','Cannot find that campground!')
        res.redirect('/campgrounds');
    }
    res.render('campgrounds/edit', {campground} );
}
                                                    //                              <------------ update
module.exports.updateCampground = async (req, res) => {
    const geoData = await geocoder.forwardGeocode({             //dhmhiourgoume kai stelnoume to query me tis suntetagmenes
        query: req.body.campground.location,
        limit:1
    }).send()
    const { id } = req.params;
    console.log(req.body);
    const campground = await Campground.findByIdAndUpdate(id, { ...req.body.campground})
    const imgs = req.files.map(f => ({ url: f.path, filename: f.filename}));
    campground.geometry = geoData.body.features[0].geometry;
    campground.images.push(...imgs);
    await campground.save();
    if(req.body.deleteImages) {                                                     //  delete images from cloud and then from mongo array
        for(let filename of req.body.deleteImages) {
            await cloudinary.uploader.destroy(filename);
        }

        await campground.updateOne({ $pull: { images: {filename: { $in: req.body.deleteImages}}}})
        console.log(campground)
    }
    req.flash('success','Successfully updated campground!');
    res.redirect(`/campgrounds/${campground._id}`)
}

module.exports.deleteCampground = async (req,res) => {
    const { id } = req.params;
    await Campground.findByIdAndDelete(id);
    req.flash('success','campground successfully deleted')
    res.redirect('/campgrounds');
 }