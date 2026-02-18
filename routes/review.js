const express = require("express");
const router = express.Router({mergeParams: true });
const wrapAsync = require("../utils/wrapAsync.js");
const { reviewSchema } = require("../schema.js");
const ExpressError = require("../utils/ExpressError.js");
const Listing = require("../models/listing.js");
const Review = require("../models/reviews");


const validateReviews = (req,res,next)=>{
  let { error } = reviewSchema.validate(req.body);
  if(error){
    const msg = error.details.map(el => el.message).join(",");
    throw new ExpressError(400, msg);
  }else{
    next();
  }
};

//Reviews post route
router.post("/", validateReviews , wrapAsync(async(req,res)=>{
  let listing = await Listing.findById(req.params.id);
  let newReview = new Review(req.body.review);

  listing.reviews.push(newReview._id);

  await newReview.save();
  await listing.save();

  console.log("new review saved");
  res.redirect(`/listings/${listing._id}`);
}));

//Reviews delete route
router.delete("/:reviewId", wrapAsync( async (req,res) =>{
  let { id, reviewId } = req.params;

  await Listing.findByIdAndUpdate(id ,{$pull: {reviews:reviewId}});
  await Review.findByIdAndDelete(reviewId);

  res.redirect(`/listings/${id}`);
}));

module.exports = router;