const express = require('express');
const { QueryTypes } = require('sequelize');
const { sequelize, User, Course, Module, Content, ContentView } = require('../models');
const { crud, wrap } = require('./crud');
const queries = require('../reports/queries');

const router = express.Router();
const author = { model: User, as: 'author', attributes: ['id', 'name'] };

router.use('/users', crud(User, { fields: ['name', 'email', 'status'] }));
router.use('/courses', crud(Course, { fields: ['code', 'title', 'description', 'userId'], include: [author] }));
router.use('/modules', crud(Module, { fields: ['courseId', 'userId', 'title', 'description'], include: [author] }));
router.use('/contents', crud(Content, { fields: ['moduleId', 'title', 'body'] }));

// Watched lessons: register that a user watched a content (idempotent)
router.get('/contents/:id/views', wrap(async (req, res) => {
  res.json(await sequelize.query(queries.usersWatchedContent, { replacements: { contentId: req.params.id }, type: QueryTypes.SELECT }));
}));
router.post('/contents/:id/views', wrap(async (req, res) => {
  const [view, created] = await ContentView.findOrCreate({ where: { contentId: req.params.id, userId: req.body.userId } });
  res.status(created ? 201 : 200).json(view);
}));
router.delete('/contents/:id/views/:userId', wrap(async (req, res) => {
  await ContentView.destroy({ where: { contentId: req.params.id, userId: req.params.userId } });
  res.status(204).end();
}));

// Reports (raw SQL)
const report = (sql) => wrap(async (req, res) => res.json(await sequelize.query(sql, { type: QueryTypes.SELECT })));
router.get('/reports/users-most-courses', report(queries.usersMostCourses));
router.get('/reports/course-most-contents', report(queries.courseMostContents));
router.get('/reports/courses-totals', report(queries.coursesTotals));
router.get('/reports/contents-with-course', report(queries.contentsWithCourse));
router.get('/reports/contents/:id/watched-by', wrap(async (req, res) => {
  res.json(await sequelize.query(queries.usersWatchedContent, { replacements: { contentId: req.params.id }, type: QueryTypes.SELECT }));
}));

module.exports = router;
