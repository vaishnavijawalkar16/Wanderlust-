import Listing from "../models/listing.js";
import Review from "../models/reviews.js";

export const showReviews = async (req, res) => {
  let listing = await Listing.findById(req.params.id);

  if (!listing) {
    req.flash("error", "Listing does not exist!");
    return res.redirect("/listings");
  }

  let newReview = new Review(req.body.review);

  newReview.author = req.user._id;
  listing.reviews.push(newReview._id);

  await newReview.save();
  await listing.save();

  req.flash("success", "Successfully created a new review!");
  res.redirect(`/listings/${listing._id}`);
};

export const deleteReview = async (req, res) => {
  let { id, reviewId } = req.params;

  await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
  await Review.findByIdAndDelete(reviewId);

  req.flash("success", "Review deleted!");
  res.redirect(`/listings/${id}`);
};