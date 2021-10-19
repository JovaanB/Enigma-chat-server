const express = require("express");
const socketio = require("socket.io");
const http = require("http");
const router = require("./router");
const cors = require("cors");

const PORT = process.env.PORT || 5000;

const app = express();
const server = http.createServer(app);
const io = socketio(server, { cors: { origin: "http://localhost:3000", methods: ["GET", "POST"] } });

app.use(cors());
app.use(router);

io.on("connection", (socket) => {
    console.log("Un utilisateur s'est connecté!");

    // prettier-ignore
    socket.on("join", ({ name, room }, callback) => {
        console.log(name, room);
        callback();
    });

    socket.on("disconnect", () => {
        console.log("Oh non! Un utilisateur est parti :(");
    });
});

server.listen(PORT, () => console.log(`Serveur démarré sur le port ${PORT}`));
