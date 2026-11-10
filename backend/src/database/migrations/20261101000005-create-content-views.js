'use strict';
// Extra table: records which user watched which content (many-to-many with watched_at).
module.exports = {
  async up(q, S) {
    await q.createTable('content_views', {
      id: { type: S.INTEGER, primaryKey: true, autoIncrement: true },
      user_id: { type: S.INTEGER, allowNull: false, references: { model: 'users', key: 'id' }, onDelete: 'CASCADE', onUpdate: 'CASCADE' },
      content_id: { type: S.INTEGER, allowNull: false, references: { model: 'contents', key: 'id' }, onDelete: 'CASCADE', onUpdate: 'CASCADE' },
      watched_at: { type: S.DATE, allowNull: false, defaultValue: S.fn('NOW') },
    });
    await q.addConstraint('content_views', { fields: ['user_id', 'content_id'], type: 'unique', name: 'content_views_user_content_uq' });
    await q.addIndex('content_views', ['content_id']);
  },
  async down(q) { await q.dropTable('content_views'); },
};
