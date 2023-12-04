const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const path = require("path");
const connectDB = require("./config/dbConn");
const app = express();
const fs = require("fs");

// -------------------------------------models for dumpdb
const ArtistCategory = require("./models/ArtistCategory");
const Artwork = require("./models/Artwork");
const ArtworkCategory = require("./models/ArtworkCategory");
const ArtworkProperty = require("./models/ArtworkProperty");
const JobCategory = require("./models/JobCategory");
const CollectionCategory = require("./models/CollectionCategory");
const Collection = require("./models/Collection");

require("dotenv").config();

app.use(cors({ origin: "*" }));
app.use(express.static("./uploads"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
function test() {
  const nodes = [];

  // Read the contents of the text file
  fs.readFile("art_category.txt", "utf8", (err, data) => {
    if (err) {
      console.error("Error reading the file:", err);
      return;
    }

    // Split the content by newlines to get items
    const lines = data.split(/\r?\n/);

    // Add each non-empty line as a node to the array
    lines.forEach((line) => {
      if (line.trim()) {
        // This will ignore empty lines
        nodes.push(line.trim());
      }
    });

    // Process or output the nodes as needed
    nodes.forEach(async (node, index) => {
      // let artist_Category = new ArtworkCategory({
      //   itemTitle: node,
      // });
      // await artist_Category.save();
    });
  });
}

test();
app.use(express.json());
connectDB();

require("./routes/artshole.routes")(app);

const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () =>
  console.log(`Server started on port ${PORT}`),
);

const io = require("socket.io")(server, {
  cors: {
    origin: "*",
  },
});

let users = [];

const addUser = (userId, socketId) => {
  !users.some((e) => e.userId === userId) && users.push({ userId, socketId });
};

const removeUser = (socketId) => {
  users = users.filter((user) => user.socketId !== socketId);
};

const getUser = (userId) => {
  return users.find((user) => user.userId === userId);
};

io.on("connection", (socket) => {
  socket.on("addUser", (userId) => {
    addUser(userId, socket.id);
    io.emit("getUsers", users);
  });

  socket.on(
    "sendNotification",
    ({ senderId, receiverId, notificationContent, type }) => {
      const user = getUser(receiverId);

      io.to(user?.socketId).emit("getNotification", {
        senderId,
        receiverId,
        notificationContent,
        type,
      });
    },
  );

  socket.on("sendMessage", ({ senderId, receiverId, chatId, content }) => {
    const user = getUser(receiverId);
    io.to(user?.socketId).emit("getMessage", {
      senderId,
      content,
    });
  });

  socket.on("typing", ({ senderId, receiverId }) => {
    const user = getUser(receiverId);
    io.to(user?.socketId).emit("isTyping", senderId);
  });

  socket.on("typing stop", ({ senderId, receiverId }) => {
    const user = getUser(receiverId);
    io.to(user?.socketId).emit("isTypingStop", senderId);
  });

  socket.on("disconnect", () => {
    removeUser(socket.id);
    io.emit("getUsers", users);
  });
});
