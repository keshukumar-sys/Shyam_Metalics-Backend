const ActivityLog = require('../Model/ActivityLogModel');

exports.createLog = async (payload) => {
  try {
    const log = await ActivityLog.create(payload);
    try { console.info('Activity log created:', log && log._id); } catch(e) {}
    return log;
  } catch (e) {
    console.error('Failed to create activity log:', e && e.message);
    try { console.error(e && e.stack); } catch (err) {}
    return null;
  }
};

exports.getLogs = async (req, res) => {
  try {
    const page = parseInt(req.query.page || '1', 10);
    const limit = parseInt(req.query.limit || '50', 10);
    const skip = (page - 1) * limit;

    const filter = {};
    if (req.query.email) filter.email = req.query.email;
    if (req.query.action) filter.action = { $regex: req.query.action, $options: 'i' };

    const [total, logs] = await Promise.all([
      ActivityLog.countDocuments(filter),
      ActivityLog.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
    ]);

    res.json({ status: 'success', total, page, limit, data: logs });
  } catch (error) {
    console.error('Error fetching logs:', error && error.message);
    res.status(500).json({ status: 'error', message: 'Failed to fetch logs' });
  }
};

// Helper methods for DEV public endpoints
exports.countLogs = async () => {
  return ActivityLog.countDocuments({});
};

exports.recentLogs = async (limit = 10) => {
  return ActivityLog.find({}).sort({ createdAt: -1 }).limit(limit).lean();
};

exports.deleteLog = async (req, res) => {
  try {
    const id = req.params.id;
    await ActivityLog.findByIdAndDelete(id);
    res.json({ status: 'success' });
  } catch (e) {
    console.error('Error deleting log:', e && e.message);
    res.status(500).json({ status: 'error' });
  }
};
