const express = require("express");
const router = express.Router({mergeParams: true });
const wrapAsync = require("../utils/wrapAsync.js");
const Listing = require("../models/listing.js");
const Review = require("../models/reviews");
const { isLoggedIn, validateReviews, isReviewAuthor } = require("../middleware.js");
const reviewscontroller = require("../controllers/reviews.js");

//Reviews post route
router.post(
  "/", 
  validateReviews , 
  isLoggedIn, 
  wrapAsync(reviewscontroller.showReviews)
);

//Reviews delete route
router.delete(
  "/:reviewId", 
  isLoggedIn,
  isReviewAuthor, 
  wrapAsync(reviewscontroller.deleteReview)
);

module.exports = router;