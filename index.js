const express = require("express");
const mongoose = require("mongoose");
const socketio = require("socket.io");
const http = require("http");
const router = require("./router");
const cors = require("cors");
const { addUser, removeUser, getUser, getUsersInRoom } = require("./io/users");
const userRoutes = require("./routes/user");

const PORT = process.env.PORT || 5000;

const app = express();
const server = http.createServer(app);
const io = socketio(server, {
    cors: { origin: "https://inspiring-hugle-97ac8b.netlify.app", methods: ["GET", "POST"] },
});

app.use(cors());
app.use(router);

io.on("connection", (socket) => {
    socket.on("join", ({ name, room }, callback) => {
        const { user, error } = addUser({ id: socket.id, name, room });
        if (error) return callback(error);

        socket.join(user.room);

        socket.emit("message", { user: "admin", text: `${user.name}, bienvenue dans la salle ${user.room}` });
        socket.broadcast.to(user.room).emit("message", { user: "admin", text: `${user.name} est en ligne!` });

        io.to(user.room).emit("roomData", { room: user.room, users: getUsersInRoom(user.room) });

        callback();
    });

    socket.on("sendMessage", (message, callback) => {
        const user = getUser(socket.id);
        io.to(user.room).emit("message", { user: user.name, text: message });
        io.to(user.room).emit("roomData", { room: user.room, users: getUsersInRoom(user.room) });

        callback();
    });

    socket.on("disconnect", () => {
        const user = removeUser(socket.id);

        if (user) {
            io.to(user.room).emit("message", { user: "admin", text: `Oh non! ${user.name} est parti :(` });
        }
    });
});

mongoose
    .connect(
        "mongodb+srv://Jovan:6QnBqMiGkLBE2zT@cluster0.fkwcy.mongodb.net/enigma-chat-db?retryWrites=true&w=majority",
        {
            useNewUrlParser: true,
        }
    )
    .then(() => {
        app.use(express.json());
        app.use("/api", [userRoutes]);

        app.listen(4000, () => {
            console.log("Serveur mongoDB démarré!");
        });
    });

server.listen(PORT, () => console.log(`Serveur démarré sur le port ${PORT}`));
