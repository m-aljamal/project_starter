const logger = require("./logger");
const jwt = require("jsonwebtoken");

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

  if (error.name === "existingUser")
    res.status(400).json({ error: error.message });
  else if (error.name === "JsonWebTokenError")
    res.status(401).json({ error: error.message });
  else res.status(400).json({ error: error.message });

  next(error);
};

const getUsetFromToken = (req, res, next) => {
  const token = req.header("auth-token");
  if (!token) {
    return res.status(401).json({ error: "No token, authoriztion denied" });
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_CREATE_USER);
    req.user = decoded.user;
    next();
  } catch (error) {
    return res.status(401).json({ msg: "invaild token" });
  }
};

module.exports = {
  getUsetFromToken,
  requestLogger,
  errorHandler,
  unknwnEndPoint,
  getUsetFromToken,
};
