const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log(`DB Connected...`);
  } catch (err) {
    console.log(`The error in connectDB : ${err}`);
  }
};
module.exports = connectDB;
