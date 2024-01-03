const express = require('express');
const router = express.Router();
const campgrounds = require('../controllers/campground');
const catchAsync = require('../utils/catchAsync');
const { isLoggedIn, validateCampground,isAuthor} = require('../middleware');
const multer = require('multer');
const { storage } = require('../cloudinary');
// const upload = multer({dest:'uploads/'});        // gia topiki apothikeush
 const upload = multer({ storage });


// const Campground = require('../models/campground');
// const campground = require('../models/campground');
// const express = require('express')
// const router = express.Router();
// const catchAsync = require('../utils/catchAsync');
// const {isLoggedIn} = require('../middleware');
// const ExpressError = require('../utils/ExpressError');
// const { campgroundSchema, reviewSchema} = require('../schemas.js');
// const Review = require('../models/review');
// const Campground = require('../models/campground')

router.get('/new', isLoggedIn , campgrounds.renderNewForm)


router.route('/')                                           // enenei dhladh kanei chainning auta me to idio path
    .get(catchAsync(campgrounds.index))
    .post(isLoggedIn,upload.array('image'), validateCampground, catchAsync (campgrounds.createCampground))
  
router.route('/:id')
    .get(catchAsync(campgrounds.showCampground))
    .put(isLoggedIn, isAuthor, upload.array('image'), validateCampground, catchAsync(campgrounds.updateCampground))   
    .delete(isLoggedIn ,isAuthor,catchAsync(campgrounds.deleteCampground));


router.get('/:id/edit', isLoggedIn,isAuthor, catchAsync(campgrounds.renderEditForm));

module.exports = router;
