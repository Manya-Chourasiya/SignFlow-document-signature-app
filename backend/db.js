const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    const result = await mongoose.connect(
      "mongodb://manyachourasiya8_db_user:wGPY7ahbfNyK35A@ac-euu8cys-shard-00-00.2x6ocg5.mongodb.net:27017,ac-euu8cys-shard-00-01.2x6ocg5.mongodb.net:27017,ac-euu8cys-shard-00-02.2x6ocg5.mongodb.net:27017/?ssl=true&replicaSet=atlas-5758bi-shard-0&authSource=admin&appName=Cluster0"
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