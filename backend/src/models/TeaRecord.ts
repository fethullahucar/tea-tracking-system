import db from '../database';

export interface TeaRecord {
  id?: number;
  customer_id: number;
  tea_count: number;
  notes?: string;
  created_at?: string;
}

export interface TeaRecordWithCustomer extends TeaRecord {
  customer_name: string;
}

export class TeaRecordModel {
  static getAll(limit: number = 100): TeaRecordWithCustomer[] {
    const stmt = db.prepare(`
      SELECT
        tr.*,
        c.name as customer_name
      FROM tea_records tr
      JOIN customers c ON tr.customer_id = c.id
      ORDER BY tr.created_at DESC
      LIMIT ?
    `);
    return stmt.all(limit) as TeaRecordWithCustomer[];
  }

  static getByCustomerId(customerId: number): TeaRecord[] {
    const stmt = db.prepare(`
      SELECT * FROM tea_records
      WHERE customer_id = ?
      ORDER BY created_at DESC
    `);
    return stmt.all(customerId) as TeaRecord[];
  }

  static create(record: TeaRecord): TeaRecord {
    const stmt = db.prepare(
      'INSERT INTO tea_records (customer_id, tea_count, notes) VALUES (?, ?, ?)'
    );
    const result = stmt.run(
      record.customer_id,
      record.tea_count,
      record.notes || null
    );
    return { ...record, id: result.lastInsertRowid as number };
  }

  static delete(id: number): boolean {
    const stmt = db.prepare('DELETE FROM tea_records WHERE id = ?');
    const result = stmt.run(id);
    return result.changes > 0;
  }

  static getStats() {
    const totalTeas = db.prepare('SELECT COALESCE(SUM(tea_count), 0) as total FROM tea_records').get() as { total: number };
    const totalCustomers = db.prepare('SELECT COUNT(*) as total FROM customers').get() as { total: number };
    const todayTeas = db.prepare(`
      SELECT COALESCE(SUM(tea_count), 0) as total
      FROM tea_records
      WHERE DATE(created_at) = DATE('now')
    `).get() as { total: number };

    const topCustomers = db.prepare(`
      SELECT
        c.name,
        COALESCE(SUM(tr.tea_count), 0) as total_teas
      FROM customers c
      LEFT JOIN tea_records tr ON c.id = tr.customer_id
      GROUP BY c.id
      ORDER BY total_teas DESC
      LIMIT 10
    `).all();

    return {
      totalTeas: totalTeas.total,
      totalCustomers: totalCustomers.total,
      todayTeas: todayTeas.total,
      topCustomers
    };
  }
}
