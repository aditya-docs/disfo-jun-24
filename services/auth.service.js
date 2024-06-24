const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/user.model");

class AuthService {
  signup = async (payload) => {
    const { password } = payload;
    return new User({
      ...payload,
      password: await this.generatePasswordHash(password),
    }).save();
  };

  generatePasswordHash = async (password) => {
    const salt = await bcrypt.genSalt(10);
    return bcrypt.hash(password, salt);
  };

  login = async (passwordFromRequestBody, hashedPasswordFromDB, userId) => ({
    isLoggedIn: await bcrypt.compare(
      passwordFromRequestBody,
      hashedPasswordFromDB
    ),
    token: await this.generateToken({ userId }),
  });

  generateToken = async (payload) =>
    jwt.sign(payload, process.env.JWT_SECRET_KEY, { expiresIn: "1m" });

  verifyToken = async (token) => jwt.verify(token, process.env.JWT_SECRET_KEY);
}

module.exports = AuthService;
