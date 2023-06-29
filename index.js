const express = require("express");
require("dotenv").config();
const cors = require("cors");
const router = require("./routes/route");
const connectDB = require("./db/conn");
const app = express();
const http = require("http");
const socketIO = require("socket.io");

connectDB();

app.use(cors());
app.use(express.json());
app.use("/api", router);

const server = http.createServer(app);
const io = socketIO(server, {
  cors: {
    origin: `${process.env.FRONTEND_URL}`,
  },
});

server.listen(process.env.PORT, () => {
  console.log(`App is listening on PORT : ${process.env.PORT}`);
});

io.on("connection", (socket) => {

  socket.on("join_room", ({ room }) => {
    socket.join(room);
  });

  socket.on("msg", ({ msg , room }) => {
    socket.to(room).emit("new_msg", msg);
  });
});
