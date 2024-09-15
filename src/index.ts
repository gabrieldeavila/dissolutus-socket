import { serve } from "serve";
import { Server } from "socket.io";

const io = new Server({ cors: { origin: "*" } });

io.on("connection", (socket) => {
  console.log(`socket ${socket.id} connected`);

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
  socket.on("sendChunk", (data) => {
    io.to(data.to).emit("receiveChunk", data.data);
  });
  socket.on("closeConnection", (data) => {
    io.to(data.to).emit("closeConnection");
  });
});

await serve(io.handler(), {
  port: 3001,
});
