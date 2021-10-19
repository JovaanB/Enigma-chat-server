const express = require("express");
const socketio = require("socket.io");
const http = require("http");
const router = require("./router");
const cors = require("cors");
const { addUser, romveUser, getUser, getUsersInRoom } = require("./users");

const PORT = process.env.PORT || 5000;

const app = express();
const server = http.createServer(app);
const io = socketio(server, { cors: { origin: "http://localhost:3000", methods: ["GET", "POST"] } });

app.use(cors());
app.use(router);

io.on("connection", (socket) => {
    socket.on("join", ({ name, room }, callback) => {
        const { user, error } = addUser({ id: socket.id, name, room });
        if (error) return callback(error);

        socket.emit("message", { user: "admin", text: `${user.name}, bienvenue dans la salle ${user.room}` });
        socket.broadcast.to(user.room).emit("message", { user: "admin", text: `${user.name} est en ligne!` });

        socket.join(user.room);

        callback();
    });

    socket.on("sendMessage", (message, callback) => {
        const user = getUser(socket.id);

        io.to(user.room).emit("message", { user: user.name, text: message });
        callback();
    });

    socket.on("disconnect", () => {
        console.log("Oh non! Un utilisateur est parti :(");
    });
});

server.listen(PORT, () => console.log(`Serveur démarré sur le port ${PORT}`));
