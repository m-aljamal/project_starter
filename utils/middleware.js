const logger = require("./logger");

const requestLogger = (req, res, next) => {
  logger.info("Method", req.method);
  logger.info("path", req.path);
  logger.info("body", req.body);
  logger.info("-------");
  next();
};

const unknwnEndPoint = (req, res) => {
  res.status(404).send({ error: "unknown endpoint" });
};

const errorHandler = (error, req, res, next) => {
  logger.error(error.message);
  next(error);
};
module.exports = {
  requestLogger,
  errorHandler,
  unknwnEndPoint,
};
