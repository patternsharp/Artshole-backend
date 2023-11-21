const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const url = process.env.Dev_Mode == "true" ? process.env.MONGO_URI_Dev : process.env.MONGO_URI;
    await mongoose.connect(url, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });

    console.log('Connected MongoDB for Artshole');
  } catch (err) {
    console.error("Connection error", err);
    // Exit process with failure
    process.exit(1);
  }
};

module.exports = connectDB;