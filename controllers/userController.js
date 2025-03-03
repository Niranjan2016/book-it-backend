const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken'); // Add this import

// Get all users
exports.getUsers = async (req, res) => {
  try {
    const users = await User.findAll({
      attributes: { exclude: ['password_hash'] }
    });
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get single user
exports.getUser = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id, {
      attributes: { exclude: ['password_hash'] }
    });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create new user
exports.createUser = async (req, res) => {
  try {
    const user = await User.create(req.body);
    const userResponse = await User.findByPk(user.user_id, {
      attributes: { exclude: ['password_hash'] }
    });
    res.status(201).json(userResponse);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Update user
exports.updateUser = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    await user.update(req.body);
    const updatedUser = await User.findByPk(req.params.id, {
      attributes: { exclude: ['password_hash'] }
    });
    res.status(200).json(updatedUser);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete user
exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    await user.destroy();
    res.status(200).json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Register new user
exports.register = async (req, res) => {
    try {
        const { email, password, name } = req.body;
        // TODO: Add password hashing
        const user = await User.create({
            email,
            password,
            name
        });
        res.status(201).json({ message: 'User registered successfully', user });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Login user
exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;
        console.log('Login attempt for:', email);

        const user = await User.findOne({ 
            where: { email },
            attributes: ['user_id', 'email', 'password_hash', 'full_name', 'role', 'managed_venue_id'] 
        });

        if (!user) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const isValidPassword = await bcrypt.compare(password, user.password_hash);
        if (!isValidPassword) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        // Generate JWT token with correct payload structure
        const token = jwt.sign(
            { 
                userId: user.user_id,
                email: user.email,
                role: user.role,
                managedVenueId: user.managed_venue_id
            },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );

        console.log('Generated token:', token);

        res.status(200).json({
            message: 'Login successful',
            user: {
                id: user.user_id,
                email: user.email,
                name: user.full_name,
                role: user.role,
                managedVenueId: user.managed_venue_id
            },
            token
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ message: error.message });
    }
};

// Get user profile
exports.getProfile = async (req, res) => {
  try {
    // Get user ID from authenticated session/token
    const userId = req.user.user_id; // Assuming you have authentication middleware setting req.user

    const profile = await User.findByPk(userId, {
      attributes: ['user_id', 'full_name', 'email', 'phone']
      // Excluding password_hash for security
    });

    if (!profile) {
      return res.status(404).json({ message: 'User profile not found' });
    }

    res.status(200).json(profile);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update user profile
exports.updateProfile = async (req, res) => {
  try {
    const userId = req.user.user_id; // Get user ID from authenticated session
    const { full_name, email, phone } = req.body;

    const profile = await User.findByPk(userId);
    if (!profile) {
      return res.status(404).json({ message: 'User profile not found' });
    }

    await profile.update({
      full_name,
      email,
      phone
    });

    res.status(200).json({
      user_id: profile.user_id,
      full_name: profile.full_name,
      email: profile.email,
      phone: profile.phone
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};