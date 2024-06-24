const AuthService = require("../services/auth.service");
const AuthServiceInstance = new AuthService();

const verifyToken = async (req, res, next) => {
  const token = req?.headers?.authorization.split(" ")[1];
  try {
    const { userId } = await AuthServiceInstance.verifyToken(token);
    req.userId = userId;
    return next();
  } catch (error) {
    if (error.name === "TokenExpiredError")
      return res.status(403).send({ message: "Token expired, login again." });
    if (error.name === "JsonWebTokenError")
      return res.status(403).send({ message: "Invalid token" });
    res.status(500).send({ message: "Something went wrong! Try again." });
  }
};

module.exports = verifyToken;
