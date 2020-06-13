const express = require("express");
app = express();
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();
const logger = require("./utils/logger");
const middleware = require("./utils/middleware");
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    logger.info("connecting to database");
  })
  .catch((err) => {
    logger.error(err);
  });
app.use(cors());
app.use(express.json());
app.use(middleware.requestLogger);

// app routes
app.use("/api/users", require("./routes/users_routes"));
app.use(middleware.unknwnEndPoint);
app.use(middleware.errorHandler);

const PORT = process.env.PORT;
app.listen(PORT, () => {
  logger.info("app start at", PORT);
});
