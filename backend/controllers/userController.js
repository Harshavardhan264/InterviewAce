const User = require('../models/User');
const { resolveAuthenticatedUser } = require('../utils/authUser');

exports.getProfile = async (req, res) => {
  try {
    const user = await resolveAuthenticatedUser(req);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json({
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      streak: user.streak,
      readinessScore: user.readinessScore,
      createdAt: user.createdAt
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error retrieving profile' });
  }
};

exports.updateProfile = async (req, res) => {
  try {
    const { name, email } = req.body;
    const updateData = {};
    if (name) updateData.name = name;
    if (email) updateData.email = email;

    const existingUser = await resolveAuthenticatedUser(req);
    if (!existingUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    const user = await User.findByIdAndUpdate(existingUser._id, updateData, { new: true });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      streak: user.streak,
      readinessScore: user.readinessScore
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error updating profile' });
  }
};
