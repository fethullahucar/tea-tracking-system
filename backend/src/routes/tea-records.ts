import { Router, Request, Response } from 'express';
import { TeaRecordModel } from '../models/TeaRecord';

const router = Router();

// Get all tea records
router.get('/', (req: Request, res: Response) => {
  try {
    const limit = parseInt(req.query.limit as string) || 100;
    const records = TeaRecordModel.getAll(limit);
    res.json(records);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch tea records' });
  }
});

// Get tea records by customer ID
router.get('/customer/:customerId', (req: Request, res: Response) => {
  try {
    const records = TeaRecordModel.getByCustomerId(parseInt(req.params.customerId));
    res.json(records);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch tea records' });
  }
});

// Get statistics
router.get('/stats/dashboard', (req: Request, res: Response) => {
  try {
    const stats = TeaRecordModel.getStats();
    res.json(stats);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch statistics' });
  }
});

// Create new tea record
router.post('/', (req: Request, res: Response) => {
  try {
    const { customer_id, tea_count, notes } = req.body;
    if (!customer_id || !tea_count) {
      return res.status(400).json({ error: 'Customer ID and tea count are required' });
    }
    const record = TeaRecordModel.create({ customer_id, tea_count, notes });
    res.status(201).json(record);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create tea record' });
  }
});

// Delete tea record
router.delete('/:id', (req: Request, res: Response) => {
  try {
    const deleted = TeaRecordModel.delete(parseInt(req.params.id));
    if (!deleted) {
      return res.status(404).json({ error: 'Tea record not found' });
    }
    res.json({ message: 'Tea record deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete tea record' });
  }
});

export default router;
