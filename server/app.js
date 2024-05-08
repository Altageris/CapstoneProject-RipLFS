const express = require("express");
const kafkaService = require("./kafka/kafkaService");
const indexRouter = require("./routes/index");
const usersRouter = require("./routes/users");
const { gameRouter } = require("./routes/gameRouter");
const audioRouter = require("./routes/audioRouter");
const v2verifyRouter = require("./routes/v2verifyRouter");
const app = express();
const bodyParser = require("body-parser");
const jsonParser = bodyParser.json();
const transcribeText = require("./audio/OpenAI-API");
const port = 3001;
const cors = require("cors");
const fs = require("fs");
const enableKafka = false;

app.use(jsonParser);
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors());

app.use("/", indexRouter);
app.use("/users", usersRouter);
app.use("/game", gameRouter);
app.use("/audio", audioRouter);

// Kafka setup
if (enableKafka) {
  (async () => {
    try {
      // Connect to Kafka
      await kafkaService.connectKafka();
      console.log("Kafka connected successfully");
      console.log("Kafka consumer running");
      //await kafkaService.deleteTopic();
    } catch (error) {
      console.error("Error starting the Kafka service:", error);
      process.exit(1);
    }
  })();
}

// Graceful shutdown
if (enableKafka) {
  process.on("SIGINT", async () => {
    console.log("Shutting down server...");
    await kafkaService.disconnectKafka();
    console.log("Kafka disconnected");
    server.close(() => {
      console.log("Server stopped");
      process.exit(0);
    });
  });
}

app.use("/voice", v2verifyRouter);

app.listen(port, () =>
  console.log("Example app is listening on port " + port + ".")
);
