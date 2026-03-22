import { FastifyInstance } from 'fastify';
import pool from '../db';
import { z } from 'zod';
import { requireRoles } from '../middleware/auth';

const MenuItemSchema = z.object({
  name: z.string().min(1),
  category: z.string().min(1),
  price: z.number().positive(),
  available: z.boolean(),
  image_url: z.string().url().optional(),
});

export default async function menuRoutes(app: FastifyInstance) {
  // Get all menu items
  app.get('/menu', async () => {
    const result = await pool.query('SELECT * FROM menu');
    // Always return a consistent object structure with image_url
    return result.rows.map(row => ({
      id: row.id,
      name: row.name,
      category: row.category,
      price: row.price,
      available: row.available,
      image_url: row.image_url || '',
      restaurant_id: row.restaurant_id,
    }));
  });

  // Add a new menu item
  app.post('/menu', { preHandler: requireRoles(['admin', 'superadmin']) }, async (request, reply) => {
    const parsed = MenuItemSchema.safeParse(request.body);
    if (!parsed.success) {
      reply.code(400);
      return { error: 'Invalid payload', details: parsed.error.flatten() };
    }
    const { name, category, price, available, image_url } = parsed.data;
    try {
      const result = await pool.query(
        'INSERT INTO menu (name, category, price, available, image_url) VALUES ($1, $2, $3, $4, $5) RETURNING *',
        [name, category, price, available, image_url || null],
      );
      // Always include image_url in the response, even if null
      const row = result.rows[0];
      return {
        id: row.id,
        name: row.name,
        category: row.category,
        price: row.price,
        available: row.available,
        image_url: row.image_url || '',
        restaurant_id: row.restaurant_id,
      };
    } catch (err) {
      reply.code(500);
      return { error: 'Failed to add menu item', details: err };
    }
  });

  // Update a menu item
  app.put('/menu/:id', { preHandler: requireRoles(['admin', 'superadmin']) }, async (request, reply) => {
    const id = Number(request.params.id);
    const parsed = MenuItemSchema.partial().safeParse(request.body);
    if (!parsed.success) {
      reply.code(400);
      return { error: 'Invalid payload', details: parsed.error.flatten() };
    }
    const fields = parsed.data;
    const updates = Object.keys(fields).map((k, i) => `${k} = $${i + 1}`);
    const values = Object.values(fields);
    if (!updates.length) {
      reply.code(400);
      return { error: 'No fields to update' };
    }
    try {
      const result = await pool.query(
        `UPDATE menu SET ${updates.join(', ')} WHERE id = $${updates.length + 1} RETURNING *`,
        [...values, id],
      );
      if (result.rowCount === 0) {
        reply.code(404);
        return { error: 'Menu item not found' };
      }
      const row = result.rows[0];
      return {
        id: row.id,
        name: row.name,
        category: row.category,
        price: row.price,
        available: row.available,
        image_url: row.image_url || '',
        restaurant_id: row.restaurant_id,
      };
    } catch (err) {
      reply.code(500);
      return { error: 'Failed to update menu item', details: err };
    }
  });

  // Delete a menu item
  app.delete('/menu/:id', { preHandler: requireRoles(['admin', 'superadmin']) }, async (request, reply) => {
    const id = Number(request.params.id);
    try {
      const result = await pool.query('DELETE FROM menu WHERE id = $1 RETURNING *', [id]);
      if (result.rowCount === 0) {
        reply.code(404);
        return { error: 'Menu item not found' };
      }
      return { success: true };
    } catch (err) {
      reply.code(500);
      return { error: 'Failed to delete menu item', details: err };
    }
  });
}
