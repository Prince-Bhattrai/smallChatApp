import express from "express"
import {Server} from "socket.io"
import http from "http"
import cors from "cors"

const app = express()
app.use(cors())
app.use(express.json())

const server = http.createServer(app)

const io = new Server(server, {
  cors: {
    origin: "https://easy-chat-7q89kb344-prince-bhattrais-projects.vercel.app/",
    methods: ["GET", "POST"]
  }
});

io.on("connection", (socket) => {
  console.log("Client connected:", socket.id);

  socket.on("CMsg", (msg) => {
    console.log("Client:", msg);
    io.emit("SMsg", msg);
  });
});

server.listen(4000, () => {
  console.log("App is running at http://localhost:4000");
});
