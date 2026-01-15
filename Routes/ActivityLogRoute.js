const express = require('express');
const router = express.Router();
const ActivityLogController = require('../Controllers/ActivityLogController');
const { authMiddleware, authRequired, requireRole } = require('../middleware/auth');

// Admin-only routes (enforce auth even for GET)
router.get('/', authRequired, requireRole(['admin']), ActivityLogController.getLogs);

router.delete('/:id', authRequired, requireRole(['admin']), ActivityLogController.deleteLog);

// Authenticated test endpoint (admin/uploader) - creates a log using controller method
router.post('/test-create', authRequired, requireRole(['admin','uploader']), async (req, res) => {
  try {
    console.info('test-create called by', req.user && req.user.email);
    const payload = {
      user: req.user && req.user._id,
      email: req.user && req.user.email,
      action: 'TEST_CREATE',
      method: 'POST',
      route: '/logs/test-create',
      ip: req.ip || req.headers['x-forwarded-for'],
      status: 200,
      metadata: { body: req.body }
    };
    const log = await ActivityLogController.createLog(payload);
    if (!log) return res.status(500).json({ status: 'error', message: 'Failed to create test log' });
    return res.json({ status: 'success', data: log });
  } catch (e) {
    console.error('Test-create log error:', e && e.message);
    return res.status(500).json({ status: 'error', message: 'Server error' });
  }
});
// Delete ALL logs (ADMIN ONLY)
router.delete(
  '/delete-all',
  authRequired,
  requireRole(['admin']),
  ActivityLogController.deleteAllLogs
);


// Authenticated test endpoint (admin/uploader) - creates a log using controller method
router.post('/test-create', authMiddleware, async (req, res) => {
  try {
    console.info('test-create called by', req.user && req.user.email);
    const payload = {
      user: req.user && req.user._id,
      email: req.user && req.user.email,
      action: 'TEST_CREATE',
      method: 'POST',
      route: '/logs/test-create',
      ip: req.ip || req.headers['x-forwarded-for'],
      status: 200,
      metadata: { body: req.body }
    };
    const log = await ActivityLogController.createLog(payload);
    if (!log) return res.status(500).json({ status: 'error', message: 'Failed to create test log' });
    return res.json({ status: 'success', data: log });
  } catch (e) {
    console.error('Test-create log error:', e && e.message);
    return res.status(500).json({ status: 'error', message: 'Server error' });
  }
});

// Public DEV-only endpoints to help verification (no auth)
if (process.env.NODE_ENV !== 'production') {
  router.post('/public-test-create', async (req, res) => {
    try {
      console.info('public-test-create called');
      const payload = {
        user: null,
        email: req.body && req.body.email,
        action: 'PUBLIC_TEST_CREATE',
        method: 'POST',
        route: '/logs/public-test-create',
        ip: req.ip || req.headers['x-forwarded-for'],
        status: 200,
        metadata: { body: req.body }
      };
      const log = await ActivityLogController.createLog(payload);
      if (!log) return res.status(500).json({ status: 'error', message: 'Failed to create public test log' });
      console.info('Public test log created:', log._id);
      return res.json({ status: 'success', data: log });
    } catch (e) {
      console.error('Public test-create error:', e && e.message);
      return res.status(500).json({ status: 'error', message: 'Server error' });
    }
  });

  router.get('/public-count', async (req, res) => {
    try {
      const count = await ActivityLogController.countLogs ? await ActivityLogController.countLogs() : null;
      return res.json({ status: 'success', count });
    } catch (e) {
      console.error('Public count error:', e && e.message);
      return res.status(500).json({ status: 'error' });
    }
  });

  router.get('/public-recent', async (req, res) => {
    try {
      const limit = parseInt(req.query.limit || '10', 10);
      const logs = await ActivityLogController.recentLogs ? await ActivityLogController.recentLogs(limit) : null;
      return res.json({ status: 'success', data: logs });
    } catch (e) {
      console.error('Public recent error:', e && e.message);
      return res.status(500).json({ status: 'error' });
    }
  });
}

module.exports = router;