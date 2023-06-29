const Message = require("../models/message-model");
const Chat = require("../models/chat-model");
const cloudinary = require("cloudinary").v2;
const https = require('https');
const fs = require('fs');

exports.sendMessage = async (req, res) => {
  try {
    const { content, chatId } = req.body;
    const message = new Message({
      senderId: req.user._id,
      content: content,
      chatId: chatId,
    });
    const newMessage = await message.save();
    const sent = await Chat.findByIdAndUpdate(chatId,{
      $push:{
        messages:newMessage._id
      },
      $set:{
        latestMessage:newMessage._id
      }
    },{
      new:true
    })
    res.status(201).json({ msg: newMessage });
  } catch (err) {
    res.status(400).json({ msg: "err in send Message", err: err.message });
  }
};

exports.sendMediaMessage = async (req, res) => {
  try {
    const { chatId } = req.body;
    if (req.file) {
      console.log(req.file);
      const result = await cloudinary.uploader.upload(`${req.file.path}`, {
        public_id: req.file.originalname,
      });
      console.log(result);
      if (!result) {
        return res.status(400).json({ msg: `Error in image upload !` });
      }
    const message = new Message({
      senderId: req.user._id,
      content: result.secure_url,
      chatId: chatId,
    });
    const newMessage = await message.save();
    const sent = await Chat.findByIdAndUpdate(chatId,{
      $push:{
        messages:newMessage._id
      },
      $set:{
        latestMessage:newMessage._id
      }
    },{
      new:true
    })
    res.status(201).json({ msg: newMessage });
  }
  } catch (err) {
    res.status(400).json({ msg: "err in send Message", err: err.message });
  }
};

exports.getAllMessages = async (req,res) =>{
  try {
    const {chatId} = req.body;
    const messages = await Chat.findOne({_id:chatId}).populate({
      path:'users',
      select:'name email pic'
    }).populate({
      path:'messages'
    })
    res.status(200).json(messages);
  } catch (err) {
    res.status(400).json({ msg: "err in getAllMessages", err: err.message });
  }
}

