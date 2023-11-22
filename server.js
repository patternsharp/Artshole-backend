const express = require("express");
const bodyParser = require("body-parser");
const cors = require('cors');
const path = require("path");
const connectDB = require("./config/dbConn");
const app = express();
require("dotenv").config();

app.use(cors({ origin: "*" }));
app.use(express.static('./uploads'));
app.use(bodyParser.json());   // parse requests of content-type - application/json
app.use(bodyParser.urlencoded({ extended: false }));   // parse requests of content-type - application/x-www-form-urlencoded

// Init Middleware
app.use(express.json());

// Connect Database
connectDB();

// Define Routes
require("./routes/artshole.routes")(app);

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => console.log(`Server started on port ${PORT}`));

// ============= socket.io ==============

const io = require("socket.io")(server, {
    // pingTimeout: 60000,
    cors: {
        origin: "*"
    }
});

let users = [];

const addUser = (userId, socketId) => {
    !users.some((e) => e.userId === userId) && users.push({ userId, socketId });
    console.log(users)
}

const removeUser = (socketId) => {
    users = users.filter((user) => user.socketId !== socketId);
}

const getUser = (userId) => {
    console.log("users", users)
    return users.find((user) => user.userId === userId);
}

io.on("connection", (socket) => {
    console.log("🚀 Someone connected!");

    // get userId and socketId from client
    socket.on("addUser", (userId) => {
        addUser(userId, socket.id);
        io.emit("getUsers", users);
    });

    // get and send notification
    socket.on("sendNotification", ({ senderId, receiverId, notificationContent, type }) => {
        const user = getUser(receiverId);

        console.log("tttttttt=>", user)

        io.to(user?.socketId).emit("getNotification", {
            senderId,
            receiverId,
            notificationContent,
            type
        });
    });

    // get and send message
    socket.on("sendMessage", ({ senderId, receiverId, chatId, content }) => {
        const user = getUser(receiverId);

        console.log("ggggggggg=>", user)

        io.to(user?.socketId).emit("getMessage", {
            senderId,
            content
        });
    });

    //type status
    socket.on("typing", ({ senderId, receiverId }) => {
        const user = getUser(receiverId)
        io.to(user?.socketId).emit("isTyping", senderId)
    })

    socket.on("typing stop", ({ senderId, receiverId }) => {
        const user = getUser(receiverId);
        io.to(user?.socketId).emit("isTypingStop", senderId);
    });

    // user disconnected
    socket.on("disconnect", () => {
        console.log("⚠️ Someone disconnected")
        removeUser(socket.id);
        io.emit("getUsers", users);
    });
});
