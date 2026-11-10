'use strict';
module.exports = {
  async up(q, S) {
    await q.createTable('courses', {
      id: { type: S.INTEGER, primaryKey: true, autoIncrement: true },
      code: { type: S.STRING(40), allowNull: false, unique: true },
      title: { type: S.STRING(160), allowNull: false },
      description: S.TEXT,
      user_id: { type: S.INTEGER, allowNull: false, references: { model: 'users', key: 'id' }, onDelete: 'RESTRICT', onUpdate: 'CASCADE' },
      created_at: { type: S.DATE, allowNull: false, defaultValue: S.fn('NOW') },
      updated_at: { type: S.DATE, allowNull: false, defaultValue: S.fn('NOW') },
    });
    await q.addIndex('courses', ['user_id']);
  },
  async down(q) { await q.dropTable('courses'); },
};
