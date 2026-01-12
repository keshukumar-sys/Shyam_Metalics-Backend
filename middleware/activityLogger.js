const jwt = require('jsonwebtoken');
const ActivityLogController = require('../Controllers/ActivityLogController');
const { createLog } = require('../Controllers/ActivityLogController');
const User = require('../Model/UserModel');

const JWT_SECRET = process.env.JWT_SECRET || 'change_this_secret';

function scrubBody(body) {
  if (!body) return undefined;
  const clone = Array.isArray(body) ? [] : {};
  Object.keys(body || {}).forEach((k) => {
    if (['password', 'confirmPassword', 'token'].includes(k.toLowerCase())) {
      clone[k] = '***REDACTED***';
    } else {
      try {
        // avoid storing big buffers or files
        if (typeof body[k] === 'object' && body[k] && (body[k].path || body[k].buffer)) {
          clone[k] = '[file]';
        } else {
          clone[k] = body[k];
        }
      } catch (e) {
        clone[k] = '[unserializable]';
      }
    }
  });
  return clone;
}

async function attachUserFromToken(req) {
  if (req.user) return; // already available
  const authHeader = req.headers && req.headers.authorization;
  if (!authHeader) return;
  const token = authHeader.split(' ')[1];
  if (!token) return;
  try {
    const payload = jwt.verify(token, JWT_SECRET);
    if (payload && payload.id) {
      const user = await User.findById(payload.id).select('email');
      if (user) req.user = user;
    }
  } catch (e) {
    // ignore invalid tokens here - auth middleware will handle it for protected routes
  }
}
module.exports = function activityLogger(req, res, next) {
  if (req.path?.startsWith('/logs')) return next();

  const start = Date.now();

  const isMultipart =
    req.headers['content-type']?.includes('multipart/form-data');

  const logActivity = async () => {
    try {
      await createLog({
        user: req.user?._id,
        email: req.user?.email,
        action: `${req.method} ${req.originalUrl}`,
        method: req.method,
        route: req.originalUrl,
        ip:
          req.headers['x-forwarded-for'] ||
          req.ip ||
          req.connection?.remoteAddress,
        status: res.statusCode,
        metadata: {
          durationMs: Date.now() - start,
          body: isMultipart ? '[multipart omitted]' : scrubBody(req.body),
        },
      });
    } catch (e) {
      console.error('Activity logger failed:', e.message);
    }
  };

  res.on('finish', logActivity);
  res.on('close', logActivity);

  next();
};

