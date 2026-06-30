const express = require('express');
const { Pool } = require('pg');

const app = express();
app.use(express.json());

const pool = new Pool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: 5432,
});

// Listar todas as tarefas
app.get('/tasks', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM tasks ORDER BY id');
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ erro: 'Erro ao buscar tarefas' });
  }
});

// Criar uma tarefa
app.post('/tasks', async (req, res) => {
  try {
    const { titulo } = req.body;
    if (!titulo) {
      return res.status(400).json({ erro: 'O título é obrigatório' });
    }
    const result = await pool.query(
      'INSERT INTO tasks (titulo) VALUES ($1) RETURNING *',
      [titulo]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ erro: 'Erro ao criar tarefa' });
  }
});

// Atualizar uma tarefa (editar titulo e/ou concluir)
app.put('/tasks/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { titulo, concluida } = req.body;
    const result = await pool.query(
      'UPDATE tasks SET titulo = $1, concluida = $2 WHERE id = $3 RETURNING *',
      [titulo, concluida, id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ erro: 'Tarefa não encontrada' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ erro: 'Erro ao atualizar tarefa' });
  }
});

// Apagar uma tarefa
app.delete('/tasks/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query(
      'DELETE FROM tasks WHERE id = $1 RETURNING *',
      [id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ erro: 'Tarefa não encontrada' });
    }
    res.json({ mensagem: 'Tarefa apagada', tarefa: result.rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ erro: 'Erro ao apagar tarefa' });
  }
});

app.listen(3000, () => {
  console.log('API rodando na porta 3000');
});
