import db from '../database';

export interface Customer {
  id?: number;
  name: string;
  email?: string;
  phone?: string;
  created_at?: string;
}

export interface CustomerWithStats extends Customer {
  total_teas: number;
  last_tea_date?: string;
}

export class CustomerModel {
  static getAll(): CustomerWithStats[] {
    const stmt = db.prepare(`
      SELECT
        c.*,
        COALESCE(SUM(tr.tea_count), 0) as total_teas,
        MAX(tr.created_at) as last_tea_date
      FROM customers c
      LEFT JOIN tea_records tr ON c.id = tr.customer_id
      GROUP BY c.id
      ORDER BY c.name ASC
    `);
    return stmt.all() as CustomerWithStats[];
  }

  static getById(id: number): CustomerWithStats | undefined {
    const stmt = db.prepare(`
      SELECT
        c.*,
        COALESCE(SUM(tr.tea_count), 0) as total_teas,
        MAX(tr.created_at) as last_tea_date
      FROM customers c
      LEFT JOIN tea_records tr ON c.id = tr.customer_id
      WHERE c.id = ?
      GROUP BY c.id
    `);
    return stmt.get(id) as CustomerWithStats | undefined;
  }

  static create(customer: Customer): Customer {
    const stmt = db.prepare(
      'INSERT INTO customers (name, email, phone) VALUES (?, ?, ?)'
    );
    const result = stmt.run(customer.name, customer.email || null, customer.phone || null);
    return { ...customer, id: result.lastInsertRowid as number };
  }

  static update(id: number, customer: Partial<Customer>): boolean {
    const fields: string[] = [];
    const values: any[] = [];

    if (customer.name !== undefined) {
      fields.push('name = ?');
      values.push(customer.name);
    }
    if (customer.email !== undefined) {
      fields.push('email = ?');
      values.push(customer.email || null);
    }
    if (customer.phone !== undefined) {
      fields.push('phone = ?');
      values.push(customer.phone || null);
    }

    if (fields.length === 0) return false;

    values.push(id);
    const stmt = db.prepare(`UPDATE customers SET ${fields.join(', ')} WHERE id = ?`);
    const result = stmt.run(...values);
    return result.changes > 0;
  }

  static delete(id: number): boolean {
    const stmt = db.prepare('DELETE FROM customers WHERE id = ?');
    const result = stmt.run(id);
    return result.changes > 0;
  }

  static search(query: string): CustomerWithStats[] {
    const stmt = db.prepare(`
      SELECT
        c.*,
        COALESCE(SUM(tr.tea_count), 0) as total_teas,
        MAX(tr.created_at) as last_tea_date
      FROM customers c
      LEFT JOIN tea_records tr ON c.id = tr.customer_id
      WHERE c.name LIKE ? OR c.email LIKE ? OR c.phone LIKE ?
      GROUP BY c.id
      ORDER BY c.name ASC
    `);
    const searchPattern = `%${query}%`;
    return stmt.all(searchPattern, searchPattern, searchPattern) as CustomerWithStats[];
  }
}
