const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    const result = await mongoose.connect(
      process.env.MONGO_URI
    );

    console.log(result.connection.host);
    console.log("MongoDB Connected");
  } catch (error) {
    console.log("ERROR NAME:", error.name);
    console.log("ERROR MESSAGE:", error.message);
    console.log(error);
  }
};

module.exports = connectDB;