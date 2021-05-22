const expressJwt = require("express-jwt");
const UserService = require("../services/user.service");

module.exports = jwt;

function jwt() {
  const key_secret = process.env.KEY_SECRET;
  return expressJwt({
    secret: key_secret,
    algorithms: ["HS256"],
    isRevoked,
  }).unless({
    path: [
      // public routes that don't require authentication
      "/api/user/authenticate",
      "/api/user/register",
    ],
  });
}

async function isRevoked(req, payload, done) {
  const user = await UserService.getById(payload.sub);
  // revoke token if user no longer exists
  if (user) {
    req.userInfo = user;
    return done();
  }

  return done(null, true);
}
