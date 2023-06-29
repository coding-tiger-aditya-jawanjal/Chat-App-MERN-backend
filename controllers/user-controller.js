const User = require("../models/user-model");
const bcrypt = require("bcrypt");
const cloudinary = require("cloudinary").v2;
const jwt = require("jsonwebtoken");

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});

exports.signup = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res
        .status(400)
        .json({ msg: `Name , Email and Password Required !` });
    }
    const userExists = await User.findOne({ email: email });
    if (userExists) {
      return res.status(400).json({ msg: `User already Exists !` });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({
      name: name,
      email: email,
      password: hashedPassword,
    });
    if (req.file) {
      console.log(req.file);
      const result = await cloudinary.uploader.upload(`${req.file.path}`, {
        public_id: req.file.originalname,
      });
      console.log(result);
      if (!result) {
        return res.status(400).json({ msg: `Error in image upload !` });
      }
      user.pic = result.secure_url;
    }
    const savedUser = await user.save();
    const token = jwt.sign({ token: savedUser._id }, process.env.JWT_SECRET, {
      expiresIn: "30d",
    });
    res.status(201).json({
      msg: `Registered Successfully !`,
      token: {
        token,
      },
    });
  } catch (err) {
    res.status(400).json({ err });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ msg: `Email and Password required !` });
    }
    const userExist = await User.findOne({ email: email });
    if (!userExist) {
      return res.status(400).json({ msg: `No user found !` });
    }
    const passwordMatched = await bcrypt.compare(password, userExist.password);
    if (!passwordMatched) {
      return res.status(400).json({ msg: `Incorrect Email or password !` });
    }
    const token = jwt.sign({ token: userExist._id }, process.env.JWT_SECRET, {
      expiresIn: "30d",
    });
    res.status(201).json({
      msg: `Login Successfully !`,
      token: {
        token,
      },
    });
  } catch (err) {
    res.status(400).json({ msg: `Error in login !`, err: err.message });
  }
};

exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find({}).select("name email pic").sort({'createdAt':-1});
    res.status(200).json({ msg: `All user Fetched !`, users: users });
  } catch (err) {
    res.status(400).json({ msg: `Error in getAllUsers !`, err: err.message });
  }
};

exports.getSelfInfo = async (req,res) =>{
  try {
    res.status(201).json({ msg: `My Info Fetched !`, me: req.user });
  } catch (err) {
    res.status(400).json({ msg: `Error in getSelfInfo !`, err: err.message });
  }
}