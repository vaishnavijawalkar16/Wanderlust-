import Listing from "../models/listing.js";

export const index = async (req, res) => {
    const allListings = await Listing.find({});
    res.render("./listings/index.ejs", { allListings })
};

export const show = async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id).populate({ path: "reviews" , populate: { path: "author" }}).populate("owner");
    if(!listing){
      req.flash("error", "Listing does not exist!");
      res.redirect("/listings");
    }else{
      res.render("./listings/show.ejs", { listing });
    }
};

export const create = async (req, res) => {

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
    newListing.owner = req.user._id;
    await newListing.save();
    req.flash("success", "Successfully created a new listing!");
    res.redirect("/listings");
};

export const edit = async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    if(!listing.owner._id.equals(req.user._id)){
      req.flash("error", "You don't have permission to edit this listing!");
      return res.redirect(`/listings/${id}`);
    }
    res.render("./listings/edit.ejs", { listing });
};

export const update = async (req, res) => {
    let { id } = req.params;
    await Listing.findByIdAndUpdate(id, { ...req.body.listing });
    req.flash("success", "Listing updated");
    res.redirect(`/listings/${id}`);
};

export const destroy = async (req, res) => {
    let { id } = req.params;
    await Listing.findByIdAndDelete(id);
    req.flash("success", "Listing deleted!");
    res.redirect("/listings");
};