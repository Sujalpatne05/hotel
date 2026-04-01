import { Router } from 'express';
import { query } from '../db.mjs';
import { authenticate } from '../middleware/auth.mjs';

const router = Router();

router.get('/reservations', authenticate, async (req, res) => {
  try {
    const { rows } = await query(`SELECT * FROM reservations WHERE restaurant_id=$1 ORDER BY created_at DESC`, [req.user.restaurantId]);
    res.json(rows);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.post('/reservations', authenticate, async (req, res) => {
  try {
    const { customer_name, customer_phone, reservation_date, reservation_time, guests, table_number, status } = req.body;
    if (!customer_name || !customer_phone || !reservation_date || !reservation_time) return res.status(400).json({ error: 'Required fields missing' });
    const { rows } = await query(
      `INSERT INTO reservations (restaurant_id, customer_name, customer_phone, reservation_date, reservation_time, guests, table_number, status)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8) RETURNING *`,
      [req.user.restaurantId, customer_name.trim(), customer_phone.trim(), reservation_date, reservation_time, Number(guests || 1), table_number || 'T1', status || 'pending']
    );
    res.status(201).json(rows[0]);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.put('/reservations/:id', authenticate, async (req, res) => {
  try {
    const { customer_name, customer_phone, reservation_date, reservation_time, guests, table_number, status } = req.body;
    const { rows } = await query(
      `UPDATE reservations SET customer_name=COALESCE($1,customer_name), customer_phone=COALESCE($2,customer_phone),
       reservation_date=COALESCE($3,reservation_date), reservation_time=COALESCE($4,reservation_time),
       guests=COALESCE($5,guests), table_number=COALESCE($6,table_number), status=COALESCE($7,status)
       WHERE id=$8 AND restaurant_id=$9 RETURNING *`,
      [customer_name, customer_phone, reservation_date, reservation_time, guests ? Number(guests) : null, table_number, status, req.params.id, req.user.restaurantId]
    );
    if (!rows[0]) return res.status(404).json({ error: 'Not found' });
    res.json(rows[0]);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.patch('/reservations/:id/status', authenticate, async (req, res) => {
  try {
    const { status } = req.body;
    const { rows } = await query(
      `UPDATE reservations SET status=$1 WHERE id=$2 AND restaurant_id=$3 RETURNING *`,
      [status, req.params.id, req.user.restaurantId]
    );
    if (!rows[0]) return res.status(404).json({ error: 'Not found' });
    res.json(rows[0]);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.delete('/reservations/:id', authenticate, async (req, res) => {
  try {
    await query(`DELETE FROM reservations WHERE id=$1 AND restaurant_id=$2`, [req.params.id, req.user.restaurantId]);
    res.json({ success: true });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

export default router;
