const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listing.js");

main().then((res)=>{
    console.log("Connected to MongoDB")
}).catch((err)=>{
    console.log("Error connecting to MongoDB", err)     
});

async function main() {
    await mongoose.connect("")
}

const initDB = async() =>{
    await Listing.deleteMany({});
    initData.data = initData.data.map((obj) => ({ ...obj, owner: "69985d081aef84ecd2e75a4b" }));
    await Listing.insertMany(initData.data);
    console.log("data was initialixed");
}
initDB();