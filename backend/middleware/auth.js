const jwt = require('jsonwebtoken');

const requestCounts = {};

function auth(req, res, next) {
  const authHeader = req.header('Authorization');
  const token = authHeader ? authHeader.replace('Bearer ', '') : null;

  if (!token) {
    return res.status(401).json({ message: 'No token, authorization denied' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Token is not valid' });
  }
}

function adminOnly(req, res, next) {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Access denied. Admin only.' });
  }
  next();
}

function authLimiter(req, res, next) {
  const ip = req.ip || 'unknown';
  const now = Date.now();
  const windowMs = 15 * 60 * 1000;
  const maxRequests = 10;

  if (!requestCounts[ip] || now - requestCounts[ip].startTime > windowMs) {
    requestCounts[ip] = { count: 1, startTime: now };
    return next();
  }

  requestCounts[ip].count++;

  if (requestCounts[ip].count > maxRequests) {
    return res.status(429).json({
      message: 'Too many login attempts. Please try again after 15 minutes.'
    });
  }

  next();
}

module.exports = { auth, adminOnly, authLimiter };