const socketioJwt = require("socketio-jwt");
const UserService = require("../services/user.service");
const QuizService = require("../services/quiz.service");
const HostService = require("../services/host.service");
const Helper = require("./helpers");
const ScoreService = require("../services/score.service");
const QuestionService = require("../services/question.service");

const initSockets = (io) => {
  // Pass authorize
  io.use(
    socketioJwt.authorize({
      secret: process.env.KEY_SECRET,
      handshake: true,
    })
  );

  let hostDataClients = {};

  io.on("connection", async (socket) => {
    try {
      const userInfo = await UserService.getById(socket.decoded_token.sub);
      console.log(`${socket.id} đang kết nối... ${userInfo.username}`);

      socket.on("disconnect", async () => {
        // Kiểm tra có tồn tại host hay không
        if (hostDataClients) {
          const host = await HostService.getById(hostDataClients._id);
          if (host) {
            // Xóa player
            const hostUpdated = await HostService.findAndRemovePlayer(
              host._id,
              userInfo._id
            );

            // Thông báo đến phòng có người thoát khỏi phòng
            console.log(`${socket.id} ngừng kết nối...`);
            io.to(host.pin).emit("player-leave-room", hostUpdated.players);
          }
        }
      });

      // * B1. Host khởi tạo room
      socket.on("host-create-room", async ({ id }) => {
        // Khởi tạo room data
        const host = await HostService.findAndUpdate(id, { isLive: true });
        if (host) {
          hostDataClients = host;
          // Tham gia vào phòng
          socket.join(host.pin);
        } else {
          console.log("Host Không tồn tại !");
        }
      });

      // * B2. Player join vào room
      socket.on("player-join-room", async ({ id }) => {
        // Kiểm tra có tồn tại host hay không
        const host = await HostService.getById(id);
        if (host) {
          // Kiểm tra player đã tồn tại hay chưa
          hostDataClients = host;
          if (!Helper.checkPlayerExisted(host.players, userInfo._id)) {
            // Thêm player vào hệ thống
            let hostUpdated = await HostService.findAndUpdate(id, {
              players: [...host.players, userInfo],
            });

            // Player tham gia vào phòng
            socket.join(host.pin);

            // Thông báo đến phòng có người tham gia
            io.to(host.pin).emit("update-player-room", hostUpdated.players);
          } else {
            console.log("Player đã tham gia !");
          }
        } else {
          console.log("Host không tồn tại !");
        }
      });

      // * B3. Khi host connect tới game
      socket.on("host-join-game", async (id) => {
        // Kiểm tra có tồn tại host hay không
        const host = await HostService.updateCurrentQuestion(id, 0);
        if (host) {
          hostDataClients = host;

          // Lấy quiz
          const quiz = await QuizService.getById(host.quiz);

          // Gửi toàn bộ câu hỏi cho host
          let hostDetail = {
            host: host,
            quiz: quiz,
            questions: [...quiz.questions],
          };
          socket.emit("show-all-host-detail", hostDetail);

          // Đếm thời gian vào game
          let counter = 6;
          let timerInterval = setInterval(function () {
            io.to(host.pin).emit("counter-game-start", counter);
            counter--;
            if (counter === -2) {
              // Gửi câu hỏi cho toàn bộ người chơi
              sendQuestionAndCounter(host, quiz);
              clearInterval(timerInterval);
            }
          }, 1000);
        }
      });

      function sendQuestionAndCounter(host, quiz) {
        // Câu hỏi host.currentQuestion
        let question = quiz.questions[host.currentQuestion];
        io.to(host.pin).emit(
          "room-question",
          question,
          quiz.questions.length - 1 === host.currentQuestion
        );
        let counter = question.time;
        let timers = setInterval(async function () {
          io.to(host.pin).emit("counter-question", counter);
          counter--;
          if (counter === -1) {
            // Kết thúc thời gian (io.to(host.pin) )
            socket.broadcast.emit("question-time-up", {
              questionId: question.id,
              hostId: host._id,
            });

            // Hiển thị điểm số của player (getAllPlayerScore)
            let playersTotalScore =
              await ScoreService.getPlayersTotalScoreByHost(host._id);

            socket.emit("show-player-total-score", playersTotalScore);
            clearInterval(timers);
          }
        }, 1000);
      }

      // * B4. Player trả lời câu hỏi
      socket.on("player-answer-question", async ({ hostId, playerAnswer }) => {
        // Kiểm tra có tồn tại host hay không
        const host = await HostService.getById(hostId);
        if (host) {
          let score = 0;
          // Kiểm tra người dùng không nhập gì cả
          if (playerAnswer.answerId) {
            let question = await QuestionService.getById(
              playerAnswer.questionId
            );

            // Kiểm tra đáp án có đúng hay không ?
            question.answers.forEach((answer) => {
              if (playerAnswer.answerId.toString() === answer._id.toString()) {
                answer.isCorrect && (score = playerAnswer.time * 100);
              }
            });
          }

          let playerScore = {
            host: host._id,
            question: playerAnswer.questionId,
            player: userInfo._id,
            playerAnswer: playerAnswer.answerId,
            score: score,
          };

          // Lưu điểm người chơi
          await ScoreService.create(playerScore);
        }
      });

      // * B5. Player get score
      socket.on("player-get-score-question", async ({ questionId, hostId }) => {
        // Kiểm tra có tồn tại host hay không
        const host = await HostService.getById(hostId);

        if (host) {
          // Lấy thông tin câu hỏi
          let question = await QuestionService.getById(questionId);

          let correctAnswer;
          question.answers.forEach((answer) => {
            answer.isCorrect ? (correctAnswer = answer) : answer;
          });

          let playerHostAnswer = await ScoreService.getPlayerScoreQuestion(
            hostId,
            questionId,
            userInfo._id
          );

          // Kiểm tra người dùng có trả lời hay không ?
          let playerChoiseAnswer = null;
          if (playerHostAnswer) {
            question.answers.forEach((answer) => {
              if (
                playerHostAnswer.playerAnswer &&
                answer._id.toString() ===
                  playerHostAnswer.playerAnswer.toString()
              ) {
                playerChoiseAnswer = answer;
              }
            });
          }

          let playerTotalScore = await ScoreService.getPlayerTotalScore(
            hostId,
            userInfo._id
          );

          let dataResult = {
            question,
            correctAnswer,
            score: playerHostAnswer ? playerHostAnswer.score : 0,
            playerChoiseAnswer,
            totalScore: playerTotalScore ? playerTotalScore.totalScore : 0,
          };

          socket.emit("show-player-score", dataResult);
        }
      });

      // * B6. Câu hỏi tiếp theo
      socket.on("next-question", async (hostId) => {
        // Kiểm tra có tồn tại host hay không
        const host = await HostService.getById(hostId);
        if (host) {
          // Lấy quiz
          const quiz = await QuizService.getById(host.quiz);

          if (quiz.questions.length - 1 > host.currentQuestion) {
            // Vẫn còn câu hỏi

            // Cập nhật thứ tự câu hỏi
            let hostUpdated = await HostService.updateCurrentQuestion(
              host._id,
              host.currentQuestion + 1
            );
            sendQuestionAndCounter(hostUpdated, quiz);
          } else {
            // Hết câu hỏi và trả về toàn bộ list người chơi điểm cao
            console.log("Hết câu hỏi rồi bạn iê !");
          }
        }
      });

      // Hiển thị thông tin kết quả cho người chơi
      socket.on("show-player-ranked", async (hostId) => {
        // Hiển thị điểm số của player (getAllPlayerScore)
        let playersTotalScore = await ScoreService.getPlayersTotalScoreByHost(
          hostId
        );

        socket.broadcast.emit("show-player-total-score", playersTotalScore);
      });
    } catch (error) {
      console.log(error);
    }
  });
};

module.exports = initSockets;
