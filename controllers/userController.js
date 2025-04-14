const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken'); // Add this import
const { Op } = require('sequelize');

// Admin functions
const getUsers = async (req, res) => {
  try {
    const { role, page = 1, limit = 10, search } = req.query;  // Add search parameter
    const whereClause = {
      ...(role && { role }),
      ...(search && {
        full_name: {
          [Op.like]: `%${search}%`  // Case-insensitive search
        }
      })
    };
    const offset = (page - 1) * limit;

    const { count, rows: users } = await User.findAndCountAll({
      where: whereClause,
      attributes: ['user_id', 'full_name', 'email', 'phone', 'role', 'managed_venue_id', 'createdAt'],
      order: [['createdAt', 'DESC']],
      offset: Number(offset),
      limit: Number(limit),
      logging: (sql) => console.log('Generated SQL:', sql)
    });

    res.status(200).json({
      users,
      currentPage: Number(page),
      totalPages: Math.ceil(count / limit),
      totalItems: count,
      itemsPerPage: Number(limit),
    });
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ message: error.message });
  }
};

const getUser = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id, {
      attributes: ['user_id', 'full_name', 'email', 'phone', 'role', 'managed_venue_id']
    });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json(user);
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({ message: error.message });
  }
};

const createUser = async (req, res) => {
  try {
    const user = await User.create(req.body);
    res.status(201).json(user);
  } catch (error) {
    console.error('Error creating user:', error);
    res.status(500).json({ message: error.message });
  }
};

const updateUser = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    await user.update(req.body);
    res.status(200).json(user);
  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).json({ message: error.message });
  }
};

const deleteUser = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    await user.destroy();
    res.status(204).send();
  } catch (error) {
    console.error('Error deleting user:', error);
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

const getVenueUsers = async (req, res) => {
  try {
    if (!req.user.managed_venue_id) {
      return res.status(400).json({ message: 'No managed venue found' });
    }

    const { page = 1, limit = 10, search } = req.query;
    const offset = (page - 1) * limit;

    const whereClause = {
      managed_venue_id: req.user.managed_venue_id,
      role: { [Op.in]: ['venue_admin', 'venue_employee'] },
      user_id: { [Op.ne]: req.user.user_id },
      ...(search && {
        full_name: {
          [Op.like]: `%${search}%`  // Case-insensitive search
        }
      })
    };

    const { count, rows: venueUsers } = await User.findAndCountAll({
      where: whereClause,
      attributes: ['user_id', 'full_name', 'email', 'phone', 'managed_venue_id', 'role', 'createdAt'],
      order: [['user_id', 'DESC']],
      offset: Number(offset),
      limit: Number(limit),
      logging: console.log
    });

    res.status(200).json({
      users: venueUsers,
      currentPage: Number(page),
      totalPages: Math.ceil(count / limit),
      totalItems: count,
      itemsPerPage: Number(limit)
    });
  } catch (error) {
    console.error('Error fetching venue users:', error);
    res.status(500).json({ message: error.message });
  }
};

const createVenueAdmin = async (req, res) => {
  try {
    const { email, password, full_name, phone, role, venue_id } = req.body;

    // Validate required fields
    if (!email || !password || !full_name) {
      return res.status(400).json({
        message: 'Missing required fields',
        required: ['email', 'password', 'full_name']
      });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const password_hash = await bcrypt.hash(password, salt);

    const userData = {
      email,
      password_hash,
      full_name,
      phone: phone || null,
      role: role || 'venue_admin',
      managed_venue_id: venue_id  // Get venue ID from logged-in admin
    };

    if (role !== 'user' && venue_id === null) {
      userData.managed_venue_id = req.user.managed_venue_id;
    }

    const venueAdmin = await User.create(userData);

    res.status(201).json({
      message: 'Venue admin created successfully',
      user: {
        user_id: venueAdmin.user_id,
        email: venueAdmin.email,
        full_name: venueAdmin.full_name,
        phone: venueAdmin.phone,
        managed_venue_id: venueAdmin.managed_venue_id
      }
    });
  } catch (error) {
    console.error('Error creating venue admin:', error);
    res.status(500).json({
      message: 'Error creating venue admin',
      error: error.message
    });
  }
};

// Add to module.exports
module.exports = {
  getUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser,
  getVenueUsers, createVenueAdmin
};