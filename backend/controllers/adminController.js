const User = require('../models/User');

exports.getUsers = async (req, res) => {
  try {
    const users = await User.find({}, '-password'); // Exclude hashed passwords
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'Server error retrieving users list' });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Prevent administrator self-deletion
    if (user._id.toString() === req.user.id.toString()) {
      return res.status(400).json({ message: 'Administrators cannot delete their own accounts' });
    }

    await User.findByIdAndDelete(req.params.id);
    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error deleting user' });
  }
};
