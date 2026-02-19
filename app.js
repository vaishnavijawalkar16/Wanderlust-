const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/ExpressError.js");
const session = require("express-session");
const flash = require("connect-flash");

const listings = require("./routes/listing.js");
const review = require("./routes/review.js");

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.engine("ejs", ejsMate);
app.use(express.static(path.join(__dirname, "public")));

const sessionOptions = {
  secret: "mysecretcode",
  resave: false,
  saveUninitialized: true,
  cookie: {
    expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
    maxAge: 1000 * 60 * 60 * 24 * 7,
    httpOnly: true,
  },
};
app.use(session(sessionOptions));
app.use(flash());

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

app.use((req,res,next) => {
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  next();
})

app.get("/", (req, res) => {
  res.send("hi, I am root");
});

app.use("/listings", listings);
app.use("/listings/:id/reviews", review);

app.get("/random",(req,res)=>{
  res.send("this is a random page");
});

app.use((req, res, next) => {
  next(new ExpressError(404, "Page not found"));
});

app.use((err,req,res,next) => {
  let { status = 500 , message = "Something went wrong" } = err;
  res.status(status).send(message);
});

app.listen(1634, () => {
  console.log("Server is running on port 1634");
});
