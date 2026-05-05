const express = require('express');
const bcrypt = require('bcryptjs');
const { body, validationResult } = require('express-validator');
const pool = require('../config/db');

const router = express.Router();

// ──────────────────────────────────────────────
// Password strength helper
// Rules: min 8 chars, at least 1 uppercase, 1 lowercase, 1 digit, 1 special char
// ──────────────────────────────────────────────
function getPasswordStrength(password) {
  const rules = {
    length: password.length >= 8,
    uppercase: /[A-Z]/.test(password),
    lowercase: /[a-z]/.test(password),
    digit: /[0-9]/.test(password),
    special: /[^A-Za-z0-9]/.test(password),
  };
  const passed = Object.values(rules).filter(Boolean).length;
  let strength = 'weak';
  if (passed === 5) strength = 'strong';
  else if (passed >= 3) strength = 'medium';
  return { strength, rules };
}

// ──────────────────────────────────────────────
// POST /api/auth/register
// ──────────────────────────────────────────────
router.post(
  '/register',
  [
    body('name').trim().notEmpty().withMessage('Name is required'),
    body('email').isEmail().normalizeEmail().withMessage('Valid email is required'),
    body('password').isLength({ min: 8 }).withMessage('Password must be at least 8 characters'),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, email, password } = req.body;

    // Password strength gate
    const { strength } = getPasswordStrength(password);
    if (strength !== 'strong') {
      return res.status(400).json({
        errors: [
          {
            field: 'password',
            message:
              'Password is too weak. Use at least 8 characters with uppercase, lowercase, a number, and a special character.',
          },
        ],
      });
    }

    try {
      // Check for duplicate email
      const existing = await pool.query('SELECT id FROM users WHERE email = $1', [email]);
      if (existing.rows.length > 0) {
        return res.status(409).json({ errors: [{ field: 'email', message: 'Email is already registered.' }] });
      }

      // Hash password
      const salt = await bcrypt.genSalt(12);
      const passwordHash = await bcrypt.hash(password, salt);

      // Insert user
      const result = await pool.query(
        'INSERT INTO users (name, email, password_hash) VALUES ($1, $2, $3) RETURNING id, name, email, created_at',
        [name, email, passwordHash]
      );

      const user = result.rows[0];

      // Auto-login after registration
      req.session.userId = user.id;
      req.session.userName = user.name;
      req.session.userEmail = user.email;

      return res.status(201).json({
        message: 'Registration successful.',
        user: { id: user.id, name: user.name, email: user.email, createdAt: user.created_at },
      });
    } catch (err) {
      console.error('Register error:', err.message);
      return res.status(500).json({ errors: [{ message: 'Server error. Please try again.' }] });
    }
  }
);

// ──────────────────────────────────────────────
// POST /api/auth/login
// ──────────────────────────────────────────────
router.post(
  '/login',
  [
    body('email').isEmail().normalizeEmail().withMessage('Valid email is required'),
    body('password').notEmpty().withMessage('Password is required'),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    try {
      const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
      if (result.rows.length === 0) {
        return res.status(401).json({ errors: [{ message: 'Invalid email or password.' }] });
      }

      const user = result.rows[0];
      const match = await bcrypt.compare(password, user.password_hash);

      if (!match) {
        return res.status(401).json({ errors: [{ message: 'Invalid email or password.' }] });
      }

      req.session.userId = user.id;
      req.session.userName = user.name;
      req.session.userEmail = user.email;

      return res.json({
        message: 'Login successful.',
        user: { id: user.id, name: user.name, email: user.email },
      });
    } catch (err) {
      console.error('Login error:', err.message);
      return res.status(500).json({ errors: [{ message: 'Server error. Please try again.' }] });
    }
  }
);

// ──────────────────────────────────────────────
// POST /api/auth/logout
// ──────────────────────────────────────────────
router.post('/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({ errors: [{ message: 'Logout failed.' }] });
    }
    res.clearCookie('connect.sid');
    return res.json({ message: 'Logged out successfully.' });
  });
});

// ──────────────────────────────────────────────
// GET /api/auth/me  — check current session
// ──────────────────────────────────────────────
router.get('/me', (req, res) => {
  if (req.session.userId) {
    return res.json({
      authenticated: true,
      user: {
        id: req.session.userId,
        name: req.session.userName,
        email: req.session.userEmail,
      },
    });
  }
  return res.status(401).json({ authenticated: false });
});

// ──────────────────────────────────────────────
// GET /api/auth/password-strength  — live check
// ──────────────────────────────────────────────
router.post('/password-strength', (req, res) => {
  const { password } = req.body;
  if (!password) return res.json({ strength: 'weak', rules: {} });
  return res.json(getPasswordStrength(password));
});

module.exports = router;
