'use strict';
module.exports = {
  async up(q, S) {
    await q.createTable('contents', {
      id: { type: S.INTEGER, primaryKey: true, autoIncrement: true },
      module_id: { type: S.INTEGER, allowNull: false, references: { model: 'modules', key: 'id' }, onDelete: 'CASCADE', onUpdate: 'CASCADE' },
      title: { type: S.STRING(160), allowNull: false },
      body: { type: S.TEXT, allowNull: false },
      created_at: { type: S.DATE, allowNull: false, defaultValue: S.fn('NOW') },
      updated_at: { type: S.DATE, allowNull: false, defaultValue: S.fn('NOW') },
    });
    await q.addIndex('contents', ['module_id']);
  },
  async down(q) { await q.dropTable('contents'); },
};
