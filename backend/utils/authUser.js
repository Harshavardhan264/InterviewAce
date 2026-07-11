const mongoose = require('mongoose');
const User = require('../models/User');

const resolveAuthenticatedUser = async (req) => {
  const userId = req.user && req.user.id;
  const email = req.user && req.user.email;

  if (userId && mongoose.Types.ObjectId.isValid(userId)) {
    const userById = await User.findById(userId);
    if (userById) {
      return userById;
    }
  }

  if (email) {
    const userByEmail = await User.findOne({ email });
    if (userByEmail) {
      return userByEmail;
    }
  }

  return null;
};

module.exports = { resolveAuthenticatedUser };