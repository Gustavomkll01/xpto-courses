require('dotenv').config();
const app = require('./app');
const { sequelize } = require('./models');

const port = process.env.PORT || 3001;
sequelize.authenticate()
  .then(() => app.listen(port, () => console.log(`API on :${port} - docs at /api-docs`)))
  .catch((e) => { console.error('Database connection failed:', e.message); process.exit(1); });
