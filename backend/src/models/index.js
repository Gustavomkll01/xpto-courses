const { Sequelize, DataTypes } = require('sequelize');
const config = require('../config/database')[process.env.NODE_ENV || 'development'];

const sequelize = new Sequelize(config.url, config);

const User = sequelize.define('User', {
  name: { type: DataTypes.STRING(120), allowNull: false, validate: { notEmpty: true } },
  email: { type: DataTypes.STRING(160), allowNull: false, unique: true, validate: { isEmail: true } },
  status: { type: DataTypes.STRING(20), allowNull: false, defaultValue: 'active', validate: { isIn: [['active', 'inactive']] } },
}, { tableName: 'users' });

const Course = sequelize.define('Course', {
  code: { type: DataTypes.STRING(40), allowNull: false, unique: true, validate: { notEmpty: true } },
  title: { type: DataTypes.STRING(160), allowNull: false, validate: { notEmpty: true } },
  description: DataTypes.TEXT,
  userId: { type: DataTypes.INTEGER, allowNull: false, field: 'user_id' },
}, { tableName: 'courses' });

const Module = sequelize.define('Module', {
  courseId: { type: DataTypes.INTEGER, allowNull: false, field: 'course_id' },
  userId: { type: DataTypes.INTEGER, allowNull: false, field: 'user_id' },
  title: { type: DataTypes.STRING(160), allowNull: false, validate: { notEmpty: true } },
  description: DataTypes.TEXT,
}, { tableName: 'modules' });

const Content = sequelize.define('Content', {
  moduleId: { type: DataTypes.INTEGER, allowNull: false, field: 'module_id' },
  title: { type: DataTypes.STRING(160), allowNull: false, validate: { notEmpty: true } },
  body: { type: DataTypes.TEXT, allowNull: false },
}, { tableName: 'contents' });

const ContentView = sequelize.define('ContentView', {
  userId: { type: DataTypes.INTEGER, allowNull: false, field: 'user_id' },
  contentId: { type: DataTypes.INTEGER, allowNull: false, field: 'content_id' },
  watchedAt: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW, field: 'watched_at' },
}, { tableName: 'content_views', timestamps: false });

User.hasMany(Course, { foreignKey: 'userId' });
Course.belongsTo(User, { foreignKey: 'userId', as: 'author' });
User.hasMany(Module, { foreignKey: 'userId' });
Module.belongsTo(User, { foreignKey: 'userId', as: 'author' });
Course.hasMany(Module, { foreignKey: 'courseId', onDelete: 'CASCADE' });
Module.belongsTo(Course, { foreignKey: 'courseId', as: 'course' });
Module.hasMany(Content, { foreignKey: 'moduleId', onDelete: 'CASCADE' });
Content.belongsTo(Module, { foreignKey: 'moduleId', as: 'module' });
User.hasMany(ContentView, { foreignKey: 'userId', onDelete: 'CASCADE' });
Content.hasMany(ContentView, { foreignKey: 'contentId', onDelete: 'CASCADE' });
ContentView.belongsTo(User, { foreignKey: 'userId' });
ContentView.belongsTo(Content, { foreignKey: 'contentId' });

module.exports = { sequelize, User, Course, Module, Content, ContentView };
