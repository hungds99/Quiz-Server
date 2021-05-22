const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const { User } = require("../helpers/db");

const UserService = {
  authenticate,
  getAll,
  getById,
  create,
  update,
  delete: _delete,
  updatePassword,
};

module.exports = UserService;

async function authenticate({ email, password }) {
  const user = await User.findOne({ email });
  if (user && bcrypt.compareSync(password, user.hash)) {
    const token = jwt.sign(
      {
        sub: user.id,
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
          avatar: user.avatar,
        },
      },
      process.env.KEY_SECRET,
      {
        expiresIn: "7d",
      }
    );
    return {
      ...user.toJSON(),
      token,
    };
  }
}

async function getAll() {
  return await User.find();
}

async function getById(id) {
  return await User.findById(id);
}

async function create(userParam) {
  // validate
  if (await User.findOne({ email: userParam.email })) {
    throw 'Email "' + userParam.email + '" is already taken';
  }

  const user = new User(userParam);

  // hash password
  if (userParam.password) {
    user.hash = bcrypt.hashSync(userParam.password, 10);
  }

  // save user
  await user.save();
}

async function update(id, userParam) {
  const user = await User.findById(id);

  // validate
  if (!user) throw "User not found";
  if (
    user.username !== userParam.username &&
    (await User.findOne({ username: userParam.username }))
  ) {
    throw 'Username "' + userParam.username + '" is already taken';
  }

  // hash password if it was entered
  if (userParam.password) {
    userParam.hash = bcrypt.hashSync(userParam.password, 10);
  }

  // copy userParam properties to user
  Object.assign(user, userParam);

  return await user.save();
}

async function updatePassword(id, userParam) {
  const user = await User.findById(id);

  // validate
  if (!user) throw "User not found";
  if (
    user.username !== userParam.username &&
    (await User.findOne({ username: userParam.username }))
  ) {
    throw 'Username "' + userParam.username + '" is already taken';
  }

  // Kiểm tra và thay đổi mật khẩu mới
  if (
    userParam.password &&
    userParam.newPassword &&
    bcrypt.compareSync(userParam.password, user.hash)
  ) {
    userParam.hash = bcrypt.hashSync(userParam.newPassword, 10);
    Object.assign(user, userParam);
    await user.save();
    return true;
  }
  return false;
}

async function _delete(id) {
  await User.findByIdAndRemove(id);
}
