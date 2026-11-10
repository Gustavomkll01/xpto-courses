'use strict';
module.exports = {
  async up(q, S) {
    await q.createTable('users', {
      id: { type: S.INTEGER, primaryKey: true, autoIncrement: true },
      name: { type: S.STRING(120), allowNull: false },
      email: { type: S.STRING(160), allowNull: false, unique: true },
      status: { type: S.STRING(20), allowNull: false, defaultValue: 'active' },
      created_at: { type: S.DATE, allowNull: false, defaultValue: S.fn('NOW') },
      updated_at: { type: S.DATE, allowNull: false, defaultValue: S.fn('NOW') },
    });
  },
  async down(q) { await q.dropTable('users'); },
};
