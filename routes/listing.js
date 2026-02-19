const express = require("express");
const router = express.Router({ mergeParams: true });
const wrapAsync = require("../utils/wrapAsync.js");
const { listingSchema } = require("../schema.js");
const ExpressError = require("../utils/ExpressError.js");
const Listing = require("../models/listing.js");

const validateListing = (req, res, next) => {
  let { error } = listingSchema.validate(req.body);
  if (error) {
    const msg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(400, msg);
  } else {
    next();
  }
};

// INDEX route
router.get(
  "/",
  wrapAsync(async (req, res) => {
    const allListings = await Listing.find({});
    res.render("./listings/index.ejs", { allListings });
  })
);

// NEW route
router.get("/new", (req, res) => {
  res.render("./listings/new.ejs");
});

// SHOW route
router.get(
  "/:id",
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id).populate("reviews");
    if(!listing){
      req.flash("error", "Listing does not exist!");
      res.redirect("/listings");
    }else{
      res.render("./listings/show.ejs", { listing });
    }
  })
);

// CREATE route
router.post(
  "/",
  validateListing,
  wrapAsync(async (req, res) => {

    const listingData = req.body.listing;

    const newListing = new Listing({
      title: listingData.title,
      description: listingData.description,
      price: listingData.price,
      location: listingData.location,
      country: listingData.country,
      image: {
        filename: "listing-image",
        url: listingData.image
      }
    });

    await newListing.save();
    req.flash("success", "Successfully created a new listing!");
    res.redirect("/listings");
  })
);


// EDIT route
router.get(
  "/:id/edit",
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    res.render("./listings/edit.ejs", { listing });
  })
);

// UPDATE route
router.put(
  "/:id",
  validateListing,
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    await Listing.findByIdAndUpdate(id, { ...req.body.listing });
    req.flash("success", "Listing updated");
    res.redirect(`/listings/${id}`);
  })
);

// DELETE route
router.delete(
  "/:id",
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    await Listing.findByIdAndDelete(id);
    req.flash("success", "Listing deleted!");
    res.redirect("/listings");
  })
);

module.exports = router;
