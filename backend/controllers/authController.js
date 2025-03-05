const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/UserData');

// Registration controller
const register = async (req, res) => {
  const { username, password, address, contactNumber, email, role, fullName } = req.body;

  try {
    // Check if user already exists
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ success: false, message: 'Username already exists' });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const newUser = new User({
      username,
      password: hashedPassword,
      address,
      contactNumber,
      email,
      role,
      fullName
    });

    // Save the user to the database
    const account = await newUser.save();

    res.status(201).json({ success: true, message: 'User registered successfully', account});
  } catch (error) {
    res.status(500).json({ success: false, message: 'User registration failed', error: error.message });
    console.error(error.message)
  }
};

// Login controller
const login = async (req, res) => {
  const { username, password } = req.body;

  try {
    // Find the user by username
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(400).json({ success: false, message: 'User not found' });
    }

    // Compare the password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ success: false, message: 'Invalid credentials' });
    }

    // Generate a JWT token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '24h' });

    res.status(200).json({ success: true, token });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Login failed', error });
  }
};


module.exports = { register, login };