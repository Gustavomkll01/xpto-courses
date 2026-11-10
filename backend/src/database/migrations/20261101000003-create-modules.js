'use strict';
module.exports = {
  async up(q, S) {
    await q.createTable('modules', {
      id: { type: S.INTEGER, primaryKey: true, autoIncrement: true },
      course_id: { type: S.INTEGER, allowNull: false, references: { model: 'courses', key: 'id' }, onDelete: 'CASCADE', onUpdate: 'CASCADE' },
      user_id: { type: S.INTEGER, allowNull: false, references: { model: 'users', key: 'id' }, onDelete: 'RESTRICT', onUpdate: 'CASCADE' },
      title: { type: S.STRING(160), allowNull: false },
      description: S.TEXT,
      created_at: { type: S.DATE, allowNull: false, defaultValue: S.fn('NOW') },
      updated_at: { type: S.DATE, allowNull: false, defaultValue: S.fn('NOW') },
    });
    await q.addIndex('modules', ['course_id']);
    await q.addIndex('modules', ['user_id']);
  },
  async down(q) { await q.dropTable('modules'); },
};
