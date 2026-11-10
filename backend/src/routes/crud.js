const express = require('express');
const { ValidationError, ForeignKeyConstraintError, UniqueConstraintError } = require('sequelize');

const wrap = (fn) => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);
const pick = (obj, fields) => Object.fromEntries(fields.filter((f) => obj[f] !== undefined).map((f) => [f, obj[f]]));

// Generic CRUD router: GET /, GET /:id, POST /, PUT /:id, DELETE /:id
function crud(Model, { fields, include = [], order = [['id', 'ASC']] }) {
  const router = express.Router();
  router.get('/', wrap(async (req, res) => {
    const where = pick(req.query, fields.filter((f) => /Id$/.test(f))); // filter by FK, e.g. ?courseId=1
    res.json(await Model.findAll({ where, include, order }));
  }));
  router.get('/:id', wrap(async (req, res) => {
    const row = await Model.findByPk(req.params.id, { include });
    if (!row) return res.status(404).json({ error: `${Model.name} not found` });
    res.json(row);
  }));
  router.post('/', wrap(async (req, res) => {
    const row = await Model.create(pick(req.body, fields));
    res.status(201).json(await Model.findByPk(row.id, { include }));
  }));
  router.put('/:id', wrap(async (req, res) => {
    const row = await Model.findByPk(req.params.id);
    if (!row) return res.status(404).json({ error: `${Model.name} not found` });
    await row.update(pick(req.body, fields));
    res.json(await Model.findByPk(row.id, { include }));
  }));
  router.delete('/:id', wrap(async (req, res) => {
    const n = await Model.destroy({ where: { id: req.params.id } });
    if (!n) return res.status(404).json({ error: `${Model.name} not found` });
    res.status(204).end();
  }));
  return router;
}

function errorHandler(err, req, res, next) { // eslint-disable-line no-unused-vars
  if (err instanceof UniqueConstraintError) return res.status(409).json({ error: 'Duplicate value', details: err.errors.map((e) => e.message) });
  if (err instanceof ForeignKeyConstraintError) return res.status(409).json({ error: 'Invalid reference or record still in use' });
  if (err instanceof ValidationError) return res.status(400).json({ error: 'Validation failed', details: err.errors.map((e) => e.message) });
  if (err.name === 'SequelizeDatabaseError') return res.status(400).json({ error: 'Invalid request data' });
  console.error(err);
  res.status(500).json({ error: 'Internal server error' });
}

module.exports = { crud, wrap, errorHandler };
