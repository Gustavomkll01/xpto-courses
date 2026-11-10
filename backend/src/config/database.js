require('dotenv').config();

const url = process.env.DATABASE_URL || 'postgres://postgres:postgres@localhost:5432/xpto_courses';
const ssl = process.env.DB_SSL === 'true';

const base = {
  url,
  dialect: 'postgres',
  logging: false,
  define: { underscored: true },
  dialectOptions: ssl ? { ssl: { require: true, rejectUnauthorized: false } } : {},
};

// sequelize-cli reads one entry per NODE_ENV
module.exports = { development: base, test: base, production: base };
