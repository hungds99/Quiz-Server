require("dotenv").config();
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const jwt = require("./app/middlewares/jwt.middleware");
const errorHandler = require("./app/helpers/error-handler");
const UserRouter = require("./app/routers/user.router");
const QuizRouter = require("./app/routers/quiz.router");
const QuestionRouter = require("./app/routers/question.router");
const initSockets = require("./app/sockets");
const socketio = require("socket.io");
const http = require("http");
const HostRouter = require("./app/routers/host.router");
const TopicRouter = require("./app/routers/topic.router");
const { instrument } = require("@socket.io/admin-ui");
const ImageRouter = require("./app/routers/image.router");
const ScoreRouter = require("./app/routers/score.router");

const app = express();

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

// parse application/json
app.use(bodyParser.json());

app.use(cors());
app.use("/uploads", express.static("uploads"));

// use JWT auth to secure the api
app.use(jwt());

// global error handler
app.use(errorHandler);

// Init server with socket.io and express app
let server = http.createServer(app);
let io = socketio(server, {
  path: "/socket.io",
  cors: {
    origin: [process.env.CLIENT_URL],
    methods: ["GET", "POST"],
  },
});

// Init all sockets
initSockets(io);
instrument(io, {
  auth: false,
});

// api routes
app.use("/api/user", UserRouter);
app.use("/api/quiz", QuizRouter);
app.use("/api/question", QuestionRouter);
app.use("/api/host", HostRouter);
app.use("/api/topic", TopicRouter);
app.use("/api/image", ImageRouter);
app.use("/api/score", ScoreRouter);

// start server
const port =
  process.env.NODE_ENV === "production" ? process.env.PORT || 4002 : 4002;
server.listen(port, function () {
  console.log("Server listening on port " + port);
});
