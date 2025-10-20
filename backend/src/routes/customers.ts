import { Router, Request, Response } from 'express';
import { CustomerModel } from '../models/Customer';

const router = Router();

// Get all customers
router.get('/', (req: Request, res: Response) => {
  try {
    const customers = CustomerModel.getAll();
    res.json(customers);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch customers' });
  }
});

// Search customers
router.get('/search', (req: Request, res: Response) => {
  try {
    const query = req.query.q as string;
    if (!query) {
      return res.status(400).json({ error: 'Search query required' });
    }
    const customers = CustomerModel.search(query);
    res.json(customers);
  } catch (error) {
    res.status(500).json({ error: 'Failed to search customers' });
  }
});

// Get customer by ID
router.get('/:id', (req: Request, res: Response) => {
  try {
    const customer = CustomerModel.getById(parseInt(req.params.id));
    if (!customer) {
      return res.status(404).json({ error: 'Customer not found' });
    }
    res.json(customer);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch customer' });
  }
});

// Create new customer
router.post('/', (req: Request, res: Response) => {
  try {
    const { name, email, phone } = req.body;
    if (!name) {
      return res.status(400).json({ error: 'Name is required' });
    }
    const customer = CustomerModel.create({ name, email, phone });
    res.status(201).json(customer);
  } catch (error: any) {
    if (error.code === 'SQLITE_CONSTRAINT') {
      return res.status(400).json({ error: 'Email already exists' });
    }
    res.status(500).json({ error: 'Failed to create customer' });
  }
});

// Update customer
router.put('/:id', (req: Request, res: Response) => {
  try {
    const { name, email, phone } = req.body;
    const updated = CustomerModel.update(parseInt(req.params.id), { name, email, phone });
    if (!updated) {
      return res.status(404).json({ error: 'Customer not found' });
    }
    res.json({ message: 'Customer updated successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update customer' });
  }
});

// Delete customer
router.delete('/:id', (req: Request, res: Response) => {
  try {
    const deleted = CustomerModel.delete(parseInt(req.params.id));
    if (!deleted) {
      return res.status(404).json({ error: 'Customer not found' });
    }
    res.json({ message: 'Customer deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete customer' });
  }
});

export default router;
