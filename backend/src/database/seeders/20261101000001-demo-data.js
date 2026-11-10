'use strict';
// Seed layout: 5 users, 5 courses.
//  course 1 -> 5 modules x 3 contents   course 2 -> 3 modules x 5 contents
//  course 3 -> 2 modules x 4 contents   courses 4 and 5 -> 1 module x 2 contents (to reach 5 courses)
const SEQ_TABLES = ['users', 'courses', 'modules', 'contents', 'content_views'];

module.exports = {
  async up(q) {
    const now = new Date();
    const stamp = { created_at: now, updated_at: now };

    const users = [
      ['Ana Silva', 'ana@xpto.com'], ['Bruno Costa', 'bruno@xpto.com'], ['Carla Souza', 'carla@xpto.com'],
      ['Diego Lima', 'diego@xpto.com'], ['Elisa Rocha', 'elisa@xpto.com'],
    ].map(([name, email], i) => ({ id: i + 1, name, email, status: i === 4 ? 'inactive' : 'active', ...stamp }));

    // [title, owner user id, modules, contents per module]
    const plan = [
      ['Node.js Fundamentals', 1, 5, 3], ['React from Scratch', 1, 3, 5], ['PostgreSQL Essentials', 2, 2, 4],
      ['Docker for Developers', 3, 1, 2], ['Git and GitHub', 4, 1, 2],
    ];
    const courses = [], modules = [], contents = [];
    plan.forEach(([title, userId, nMods, nCont], ci) => {
      const courseId = ci + 1;
      courses.push({ id: courseId, code: `CRS-${String(courseId).padStart(3, '0')}`, title, description: `${title} - online course`, user_id: userId, ...stamp });
      for (let m = 1; m <= nMods; m++) {
        const moduleId = modules.length + 1;
        modules.push({ id: moduleId, course_id: courseId, user_id: userId, title: `${title} - Module ${m}`, description: `Module ${m} of ${title}`, ...stamp });
        for (let c = 1; c <= nCont; c++) {
          contents.push({ id: contents.length + 1, module_id: moduleId, title: `Lesson ${m}.${c}`, body: `Content of lesson ${m}.${c} from ${title}.`, ...stamp });
        }
      }
    });

    const views = [[1, 1], [1, 2], [2, 2], [3, 2], [4, 5], [5, 3]]
      .map(([user_id, content_id], i) => ({ id: i + 1, user_id, content_id, watched_at: new Date(now.getTime() - i * 3600e3) }));

    await q.bulkInsert('users', users);
    await q.bulkInsert('courses', courses);
    await q.bulkInsert('modules', modules);
    await q.bulkInsert('contents', contents);
    await q.bulkInsert('content_views', views);

    // explicit ids were inserted, so move the sequences forward
    for (const t of SEQ_TABLES) {
      await q.sequelize.query(`SELECT setval(pg_get_serial_sequence('${t}', 'id'), (SELECT MAX(id) FROM ${t}))`);
    }
  },
  async down(q) {
    for (const t of [...SEQ_TABLES].reverse()) await q.bulkDelete(t, null, {});
  },
};
