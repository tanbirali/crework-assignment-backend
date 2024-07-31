const mongoose = require("mongoose");
require("dotenv").config();

const connectToDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URL, { dbName: "crework" });
    // console.log("Mongodb connected");
  } catch (error) {
    console.error("Error occurred:", error);
  }
};

mongoose.connection.on("error", (err) => {
  console.error("Mongodb connection error:", err);
});

connectToDatabase();

module.exports = mongoose.connection;
