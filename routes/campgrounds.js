const express = require("express");
const router = express.Router();
const Campground = require("../models/campground");
const campgrounds = require("../controllers/campgrounds");
const { isLoggedIn, validateCampground, isAuthor } = require("../middleware");
const multer  = require('multer');
const { storage } = require('../cloudinary');
const upload = multer({ storage })

router
  .route("/")
  .get(campgrounds.index)
  .post(isLoggedIn, upload.array('image'), validateCampground, campgrounds.createNewCampground);
  // .post(upload.array('image'),(req,res)=>{
  //   console.log(req.body,req.files);
  //   console.log("It worked!!")
  // })

router.get("/new", isLoggedIn, campgrounds.showNewCampgroundForm);

router.get(
  "/:id/edit",
  isLoggedIn,
  isAuthor,
  campgrounds.showEditFormOfParticularCampground
);

router
  .route("/:id")
  .get(campgrounds.getParticularCampground)
  .put( 
    isLoggedIn,
    isAuthor,
    upload.array('image'),
    validateCampground,
    campgrounds.editParticularCampground
  )
  // .put(upload.array('image'),(req,res)=>{
  //   console.log(req.body,req.files);
  //   console.log("It worked!!")
  // })
  .delete(isLoggedIn, isAuthor, campgrounds.deleteCampground);

module.exports = router;
