const express = require('express');
const router = express.Router();
const Transaction = require('../models/Transaction');

// GET /api/transactions  — list with optional filters
router.get('/', async (req, res) => {
  try {
    const { type, category, search, startDate, endDate, month, year } = req.query;
    const filter = {};

    if (type && type !== 'all') filter.type = type;
    if (category && category !== 'all') filter.category = category;

    if (startDate || endDate) {
      filter.date = {};
      if (startDate) filter.date.$gte = new Date(startDate);
      if (endDate) {
        const end = new Date(endDate);
        end.setHours(23, 59, 59, 999);
        filter.date.$lte = end;
      }
    }

    // Month/year filter for reports page
    if (month && year) {
      const startOfMonth = new Date(year, month - 1, 1);
      const endOfMonth = new Date(year, month, 0, 23, 59, 59, 999);
      filter.date = { $gte: startOfMonth, $lte: endOfMonth };
    }

    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ];
    }

    const transactions = await Transaction.find(filter).sort({ date: -1 });
    res.json({ success: true, data: transactions });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// GET /api/transactions/summary  — aggregate totals
router.get('/summary', async (req, res) => {
  try {
    const { month, year } = req.query;
    const filter = {};

    if (month && year) {
      const startOfMonth = new Date(year, month - 1, 1);
      const endOfMonth = new Date(year, month, 0, 23, 59, 59, 999);
      filter.date = { $gte: startOfMonth, $lte: endOfMonth };
    }

    const result = await Transaction.aggregate([
      { $match: filter },
      {
        $group: {
          _id: '$type',
          total: { $sum: '$amount' },
          count: { $sum: 1 },
        },
      },
    ]);

    const summary = { income: 0, expense: 0, incomeCount: 0, expenseCount: 0 };
    result.forEach((item) => {
      if (item._id === 'income') {
        summary.income = item.total;
        summary.incomeCount = item.count;
      } else {
        summary.expense = item.total;
        summary.expenseCount = item.count;
      }
    });
    summary.balance = summary.income - summary.expense;
    summary.totalCount = summary.incomeCount + summary.expenseCount;

    res.json({ success: true, data: summary });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// GET /api/transactions/monthly-data  — last 6 months bar chart data
router.get('/monthly-data', async (req, res) => {
  try {
    const months = [];
    const now = new Date();
    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      months.push({ year: d.getFullYear(), month: d.getMonth() + 1 });
    }

    const results = await Promise.all(
      months.map(async ({ year, month }) => {
        const start = new Date(year, month - 1, 1);
        const end = new Date(year, month, 0, 23, 59, 59, 999);
        const agg = await Transaction.aggregate([
          { $match: { date: { $gte: start, $lte: end } } },
          { $group: { _id: '$type', total: { $sum: '$amount' } } },
        ]);
        const monthName = start.toLocaleString('default', { month: 'short' });
        const obj = { month: `${monthName} ${year}`, income: 0, expense: 0 };
        agg.forEach((a) => {
          if (a._id === 'income') obj.income = a.total;
          else obj.expense = a.total;
        });
        return obj;
      })
    );

    res.json({ success: true, data: results });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// GET /api/transactions/category-data  — expenses by category (pie)
router.get('/category-data', async (req, res) => {
  try {
    const { month, year } = req.query;
    const filter = { type: 'expense' };

    if (month && year) {
      const start = new Date(year, month - 1, 1);
      const end = new Date(year, month, 0, 23, 59, 59, 999);
      filter.date = { $gte: start, $lte: end };
    }

    const result = await Transaction.aggregate([
      { $match: filter },
      { $group: { _id: '$category', value: { $sum: '$amount' } } },
      { $sort: { value: -1 } },
    ]);

    const data = result.map((r) => ({ name: r._id, value: r.value }));
    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// POST /api/transactions
router.post('/', async (req, res) => {
  try {
    const { title, amount, type, category, date, description } = req.body;

    if (!title || !amount || !type || !category || !date) {
      return res.status(400).json({ success: false, message: 'Please fill in all required fields.' });
    }
    if (amount <= 0) {
      return res.status(400).json({ success: false, message: 'Amount must be greater than zero.' });
    }

    const transaction = await Transaction.create({ title, amount, type, category, date, description });
    res.status(201).json({ success: true, data: transaction });
  } catch (error) {
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map((e) => e.message);
      return res.status(400).json({ success: false, message: messages.join('. ') });
    }
    res.status(500).json({ success: false, message: error.message });
  }
});

// PUT /api/transactions/:id
router.put('/:id', async (req, res) => {
  try {
    const { title, amount, type, category, date, description } = req.body;

    if (amount && amount <= 0) {
      return res.status(400).json({ success: false, message: 'Amount must be greater than zero.' });
    }

    const transaction = await Transaction.findByIdAndUpdate(
      req.params.id,
      { title, amount, type, category, date, description },
      { new: true, runValidators: true }
    );

    if (!transaction) {
      return res.status(404).json({ success: false, message: 'Transaction not found.' });
    }

    res.json({ success: true, data: transaction });
  } catch (error) {
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map((e) => e.message);
      return res.status(400).json({ success: false, message: messages.join('. ') });
    }
    res.status(500).json({ success: false, message: error.message });
  }
});

// DELETE /api/transactions/:id
router.delete('/:id', async (req, res) => {
  try {
    const transaction = await Transaction.findByIdAndDelete(req.params.id);
    if (!transaction) {
      return res.status(404).json({ success: false, message: 'Transaction not found.' });
    }
    res.json({ success: true, message: 'Transaction deleted successfully.' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
