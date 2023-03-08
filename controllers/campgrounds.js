const Campground = require("../models/campground");
const {cloudinary } = require("../cloudinary");
const mbxGeoCoding = require('@mapbox/mapbox-sdk/services/geocoding');
const geoCoder = mbxGeoCoding({accessToken: process.env.MAPBOX_TOKEN});
module.exports.index = async (req, res) => {
  try {
    const campgrounds = await Campground.find({});
    res.render("campgrounds/index", { campgrounds });
  } catch (e) {
    next(e);
  }
};

module.exports.showNewCampgroundForm = (req, res) => {
  res.render("campgrounds/new");
};

module.exports.createNewCampground = async (req, res, next) => {
  try {
    //if(!req.body.campground) throw new ExpressError('Invalid Campground Data',400);
    const geoData = await geoCoder.forwardGeocode({
        query: req.body.campground.location,
        limit: 1
      }).send()
      console.log(geoData.body.features[0].geometry.coordinates);
    const campground = new Campground(req.body.campground);
    campground.geometry = geoData.body.features[0].geometry;
    campground.author = req.user._id;
    campground.images = req.files.map(file => ({url: file.path, filename: file.filename}));
    console.log(campground);
    campground.save();
    req.flash("success", "Successfully created a campground");
    res.redirect(`/campgrounds/${campground.id}`);
  } catch (e) {
    next(e);
  }
};

module.exports.getParticularCampground = async (req, res, next) => {
  try {
    const campground = await Campground.findById(req.params.id)
      .populate({
        path: "reviews",
        populate: {
          path: "author",
        },
      })
      .populate("author");
    if (!campground) {
      req.flash("error", "Campground doesnot exist");
      return res.redirect("/campgrounds");
    }
    res.render("campgrounds/show", { campground });
  } catch (e) {
    next(e);
  }
};

module.exports.showEditFormOfParticularCampground = async (req, res) => {
  try {
    const { id } = req.params;
    const campground = await Campground.findById(id);
    if (!campground) {
      req.flash("error", "Campground doesnot exist");
      return res.redirect("/campgrounds");
    }
    res.render("campgrounds/edit", { campground });
  } catch (e) {
    next(e);
  }
};

module.exports.editParticularCampground = async (req, res, next) => {
  try {
    console.log(req.body);
    const { id } = req.params;
    // if(!req.body.campground) throw new ExpressError('Invalid Campground Data',400);
    const campground = await Campground.findByIdAndUpdate(
      id,
      req.body.campground,
      { runValidators: true, new: true }
    );
    const imgs = req.files.map(file => ({url: file.path, filename: file.filename}));
    campground.images.push(...imgs);
    await campground.save();
    if(req.body.deletedImages){
        for(let filename of req.body.deletedImages){
            cloudinary.uploader.destroy(filename);
        }
        await campground.updateOne({$pull: {images: {filename: {$in: req.body.deletedImages}}}});
        console.log(campground);
    }
    req.flash("success", "Campground has been updated");
    res.redirect(`/campgrounds/${campground._id}`);
  } catch (e) {
    next(e);
  }
};

module.exports.deleteCampground = async (req, res) => {
    try {
      const { id } = req.params;
      await Campground.findByIdAndDelete(id);
      req.flash("success", "Successfully deleted campground");
      res.redirect("/campgrounds");
    } catch (e) {
      next(e);
    }
  }