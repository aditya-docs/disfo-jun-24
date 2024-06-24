const JWTStrategy = require("passport-jwt").Strategy;
const ExtractJWT = require("passport-jwt").ExtractJwt;

const options = {
  jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.JWT_SECRET_KEY,
};

const strategy = new JWTStrategy(options, async (payload, done) => {
  try {
    return done(null, payload.userId);
  } catch (error) {
    return done(error, false);
  }
});

module.exports = strategy;
