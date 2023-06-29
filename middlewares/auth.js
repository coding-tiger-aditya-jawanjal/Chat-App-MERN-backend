const jwt = require("jsonwebtoken");
const User = require("../models/user-model");

exports.auth = async (req, res, next) => {
  try {
    const key = req.headers.Authorization || req.headers.authorization;
    if(!key){
      return res.status(400).json({ msg: `No Token in Authorization!`, err: err.message });
    }
    const token = key.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded) {
      return res.status(400).json({ msg: `Error in decoding token!`, err: err.message });
    }
    const id = decoded.token;
      const user = await User.findOne({_id:id}).select("name email pic");
      if (!user) {
        return res.status(400).json({ msg: `Invalid Token Id !` });
      }
      req.user = user;
      next();
  } catch (err) {
    res.status(400).json({ msg: `The error is in auth ! `, err: err.message });
  }
};
