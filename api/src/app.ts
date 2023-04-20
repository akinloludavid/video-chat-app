import express, { Response } from "express";
import { createServer } from "http";
import cors from "cors";
import { Server } from "socket.io";
const app = express();
const server = createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  socket.emit("me", socket.id);

  socket.on("disconnect", () => {
    socket.broadcast.emit("callEnded");
  });
  socket.on("callUser", ({ userToCall, signalData, from, name }) => {
    io.to(userToCall).emit("callUser", { signal: signalData, from, name });
  });
  socket.on("answerCall", (data) => {
    io.to(data.to).emit("callAccepted", data.signal);
  });
});
app.get("/", (_req, res: Response) => {
  res.send("Server running successfully");
});

app.use(cors());
const PORT = process.env.PORT || 5002;
server.listen(PORT, () => {
  console.log("Server running on " + PORT);
});
