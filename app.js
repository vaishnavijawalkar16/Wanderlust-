const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const Listing = require("./models/listing.js");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const wrapAsync = require("./utils/wrapAsync.js");
const ExpressError = require("./utils/ExpressError.js");
const listingSchema = require("./schema.js");

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.engine("ejs", ejsMate);
app.use(express.static(path.join(__dirname, "public")));

main()
  .then((res) => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => {
    console.log("Error connecting to MongoDB", err);
  });

async function main() {
  await mongoose.connect("mongodb://127.0.0.1:27017/wanderlust");
}

app.get("/", (req, res) => {
  res.send("hi, I am root");
});

const validateListing = (req,res,next)=>{
  let { error } = listingSchema.validate(req.body);
  if(error){
    throw new ExpressError(400,result.error);
  }else{
    next();
  }
}

//index route
app.get("/listings", wrapAsync ( async (req, res) => {
  const allListings = await Listing.find({});
  res.render("./listings/index.ejs", { allListings });
}));

//new route
app.get("/listings/new", (req, res) => {
  res.render("./listings/new.ejs");
});

//show route
app.get("/listings/:id", wrapAsync ( async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    res.render("./listings/show.ejs", { listing });
}));

//create route
app.post("/listings", wrapAsync(async (req, res) => {
    validateListing;
    const newListing = new Listing(req.body.listing);
    await newListing.save();
    res.redirect("/listings");
}));

//edit Route
app.get("/listings/:id/edit", wrapAsync ( async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id);
  res.render("./listings/edit.ejs", { listing });
}));

//update route
app.put("/listings/:id", wrapAsync ( async (req, res) => {
  validateListing;
  let { id } = req.params;
  await Listing.findByIdAndUpdate(id, req.body.listing, {
    new: true,
    runValidators: true,
  });

  res.redirect(`/listings`);
}));

//delete route
app.delete("/listings/:id", wrapAsync ( async (req, res) => {
  let { id } = req.params;
  await Listing.findByIdAndDelete(id);
  console.log("Deleted Successfully");
  res.redirect("/listings");
}));

app.get("/random",(req,res)=>{
  res.send("this is a random page");
});

app.use((req, res, next) => {
  next(new ExpressError(404, "Page not found"));
});

app.use((err,req,res,next) => {
  let { status = 500 , messsage = "something went wrong" } = err;
  res.status(status).send(messsage);
});

app.listen(1634, () => {
  console.log("Server is running on port 1634");
});
