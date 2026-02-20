const express = require("express");
const router = express.Router({ mergeParams: true });
const wrapAsync = require("../utils/wrapAsync.js");
const Listing = require("../models/listing.js");
const { isLoggedIn, isOwner, validateListing} = require("../middleware.js");
const listingscontroller = require("../controllers/listings.js");

// INDEX route
router.get(
  "/",
  wrapAsync(listingscontroller.index)
);

// NEW route
router.get("/new",isLoggedIn, (req, res) => {
  res.render("./listings/new.ejs");
});

// SHOW route
router.get(
  "/:id",
  wrapAsync(listingscontroller.show)
);

// CREATE route
router.post(
  "/", isLoggedIn,
  validateListing,
  wrapAsync(listingscontroller.create),
);


// EDIT route
router.get(
  "/:id/edit", isLoggedIn, isOwner,
  wrapAsync(listingscontroller.edit)
);

// UPDATE route
router.put(
  "/:id", isLoggedIn,
  validateListing, isOwner,
  wrapAsync(listingscontroller.update)
);

// DELETE route
router.delete(
  "/:id", isLoggedIn, isOwner,
  wrapAsync(listingscontroller.destroy)
);

module.exports = router;
