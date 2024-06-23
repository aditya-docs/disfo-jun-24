const AuthService = require("../services/auth.service");
const AuthServiceInstance = new AuthService();
const UserService = require("../services/user.service");
const UserServiceInstance = new UserService();

const postSignup = async (req, res) => {
  try {
    const newUserObj = await AuthServiceInstance.signup(req.body);
    res.status(201).send(newUserObj);
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: "Oops! Something went wrong. Try again!" });
  }
};

const postLogin = async (req, res) => {
  const { username, password } = req.body;
  let userObj;

  try {
    userObj = await UserServiceInstance.findByUsername(username);
  } catch (error) {
    console.error(error);
    return res.status(500).send({
      message: "Server error in finding in the user. Please try again!",
    });
  }
  const { isLoggedIn, token } = await AuthServiceInstance.login(
    password,
    userObj.password,
    userObj._id
  );
  if (isLoggedIn) {
    res.cookie("remember_user_token", token, { maxAge: 60000, httpOnly: true });
    return res.send({ isLoggedIn });
  }
  res
    .status(401)
    .send({ isLoggedIn, message: "One of username/password is incorrect" });
};

module.exports = { postSignup, postLogin };
