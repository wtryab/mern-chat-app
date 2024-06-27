const express = require('express');

const { chats } = require("./data/data");

const connectDB = require("./config/db");

const userRoutes = require('./routes/userRoutes')

const colors = require("colors");

const dotenv = require("dotenv");

const { notFound, errorHandler } = require('./middleware/errorMiddleware');

const chatRoutes = require('./routes/chatRoutes')

const messageRoutes = require('./routes/messageRoutes');
const { Socket } = require('socket.io');
const path = require('path');

dotenv.config();

connectDB();

const app = express();

app.use(express.json()); //to accept json data//

/*app.get('/', (req, res) => {
    res.send("API IS RUNNING");
});*/


app.use('/api/user', userRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/message', messageRoutes);



//DEPLOYMENT
const __dirname1 = path.resolve();

if (process.env.NODE_ENV === "production") {
    app.use(express.static(path.join(__dirname1, "/frontend/build")));

    app.get("*", (req, res) =>
        res.sendFile(path.resolve(__dirname1, "frontend", "build", "index.html"))
    );
} else {
    app.get("/", (req, res) => {
        res.send("API is running..");
    });
}
//DEPLOYMENT




app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

const server = app.listen(5000, console.log(`Server started on PORT ${PORT}`.yellow.bold))

const io = require("socket.io")(server, {
    pingTimeout: 60000,
    cors: {
        origin: "http://localhost:3000"
    }
});

io.on("connection", (socket) => {
    console.log("connected to socket.io");
    socket.on("setup", (userData) => {
        socket.join(userData._id);
        socket.emit("connected");
        console.log(userData._id);
    });

    socket.on("join chat", (room) => {
        socket.join(room);
        console.log("user joined room " + room);
    })

    socket.on("new message", (newMessageRecieved) => {
        var chat = newMessageRecieved.chat;
        if (!chat.users) {
            console.log("Chat.users not defined");
        }
        chat.users.forEach(user => {
            if (user._id == newMessageRecieved.sender._id) {
                return;
            }
            socket.in(user._id).emit("message received", newMessageRecieved);
        });
    })
});