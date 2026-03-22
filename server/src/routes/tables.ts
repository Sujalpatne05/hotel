import { FastifyInstance } from 'fastify';
import pool from '../db';
import { requireRoles } from '../middleware/auth';

export default async function tableRoutes(app: FastifyInstance) {
  // Get all tables
  app.get('/tables', async () => {
    // If you have a tables table, use: const result = await pool.query('SELECT * FROM tables');
    // For now, return a static list for demo
    return [
      { id: 1, table_number: 1, capacity: 4, status: 'available' },
      { id: 2, table_number: 2, capacity: 4, status: 'available' },
      { id: 3, table_number: 3, capacity: 4, status: 'occupied' },
      { id: 4, table_number: 4, capacity: 2, status: 'available' },
      { id: 5, table_number: 5, capacity: 6, status: 'reserved' },
      { id: 6, table_number: 6, capacity: 4, status: 'available' },
      { id: 7, table_number: 7, capacity: 2, status: 'available' },
      { id: 8, table_number: 8, capacity: 4, status: 'available' },
      { id: 9, table_number: 9, capacity: 4, status: 'available' },
      { id: 10, table_number: 10, capacity: 4, status: 'available' },
    ];
  });
}
