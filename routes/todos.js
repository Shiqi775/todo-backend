// handle /todos API routes
// putting all "todo logic" in one file

const express = require('express');
const router = express.Router();          // Create a new router
const db = require('../db');              // Import DB connection

// GET /todos — get all todos, or filter by keyword
router.get('/', async (req, res) => {
  try {
    const keyword = req.query.keyword;

    let result;
    if (keyword) {
      // Use ILIKE for case-insensitive search
      result = await db.query(
        'SELECT * FROM todos WHERE content ILIKE $1 ORDER BY id DESC',
        [`%${keyword}%`]
      );
    } else {
      // No keyword, return all
      result = await db.query('SELECT * FROM todos ORDER BY id DESC');
    }

    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Search failed' });
  }
});

// GET a specific todo by ID
router.get('/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const result = await db.query('SELECT * FROM todos WHERE id = $1', [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Todo not found' });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error('Error retrieving todo by ID', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// POST /todos — create a new todo
router.post('/', async (req, res) => {
  try {
    const { content, completed = false } = req.body; // Get both content and optional completed status
    const result = await db.query(
      'INSERT INTO todos (content, completed) VALUES ($1, $2) RETURNING *',
      [content, completed]
    );

    res.status(201).json(result.rows[0]);  // Return the newly created todo
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Insert error' });
  }
});

// PUT /todos/:id — update a todo's content or completed status
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { content, completed } = req.body;

    const result = await db.query(
      'UPDATE todos SET content = $1, completed = $2 WHERE id = $3 RETURNING *',
      [content, completed, id]
    );

    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Update error' });
  }
});

// DELETE /todos/:id — delete a todo by ID
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    await db.query('DELETE FROM todos WHERE id = $1', [id]);

    res.status(204).send(); // 204 = No Content
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Delete error' });
  }
});

module.exports = router;
