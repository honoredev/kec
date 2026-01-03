// Backend Admin Authentication API
// Add these endpoints to your backend server

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { Admin } = require('../models'); // Your database model

const JWT_SECRET = process.env.JWT_SECRET || 'your-super-secure-jwt-secret-key';
const SALT_ROUNDS = 12;

// Admin Login Endpoint
app.post('/api/admin/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find admin in database
    const admin = await Admin.findOne({ where: { email } });
    if (!admin) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Verify password with bcrypt
    const isValidPassword = await bcrypt.compare(password, admin.password);
    if (!isValidPassword) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Generate JWT token
    const token = jwt.sign(
      { 
        adminId: admin.id, 
        email: admin.email,
        role: 'admin'
      },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({
      success: true,
      token,
      admin: {
        id: admin.id,
        email: admin.email,
        name: admin.name
      }
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Token Verification Endpoint
app.get('/api/admin/verify', authenticateToken, (req, res) => {
  // If middleware passes, token is valid
  res.json({ 
    success: true, 
    admin: req.admin 
  });
});

// JWT Authentication Middleware
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Access token required' });
  }

  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(403).json({ message: 'Invalid or expired token' });
    }
    req.admin = decoded;
    next();
  });
}

// Database Setup (Run once to create admin)
async function createAdminAccount() {
  try {
    // Check if admin already exists
    const existingAdmin = await Admin.findOne({ where: { email: 'admin@kec.com' } });
    if (existingAdmin) {
      console.log('Admin account already exists');
      return;
    }

    // Hash password with bcrypt
    const hashedPassword = await bcrypt.hash('your-secure-password', SALT_ROUNDS);

    // Create admin account
    await Admin.create({
      name: 'Administrator',
      email: 'admin@kec.com',
      password: hashedPassword,
      role: 'admin'
    });

    console.log('Admin account created successfully');
  } catch (error) {
    console.error('Error creating admin account:', error);
  }
}

// Database Model (Sequelize example)
const AdminModel = {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true
    }
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false
  },
  role: {
    type: DataTypes.STRING,
    defaultValue: 'admin'
  },
  createdAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  }
};

module.exports = {
  authenticateToken,
  createAdminAccount
};