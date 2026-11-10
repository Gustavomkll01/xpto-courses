// OpenAPI 3.0 spec, built programmatically (no dependencies) so it can also generate the Postman collection.
const id = { name: 'id', in: 'path', required: true, schema: { type: 'integer' } };
const ref = (n) => ({ $ref: `#/components/schemas/${n}` });
const json = (schema) => ({ 'application/json': { schema } });
const arr = (n) => ({ type: 'array', items: ref(n) });

const schemas = {
  User: { type: 'object', properties: { id: { type: 'integer' }, name: { type: 'string' }, email: { type: 'string', format: 'email' }, status: { type: 'string', enum: ['active', 'inactive'] }, createdAt: { type: 'string', format: 'date-time' }, updatedAt: { type: 'string', format: 'date-time' } } },
  UserInput: { type: 'object', required: ['name', 'email'], properties: { name: { type: 'string', example: 'Ana Silva' }, email: { type: 'string', example: 'ana@xpto.com' }, status: { type: 'string', enum: ['active', 'inactive'] } } },
  Course: { type: 'object', properties: { id: { type: 'integer' }, code: { type: 'string' }, title: { type: 'string' }, description: { type: 'string' }, userId: { type: 'integer' }, author: { type: 'object' }, createdAt: { type: 'string' }, updatedAt: { type: 'string' } } },
  CourseInput: { type: 'object', required: ['code', 'title', 'userId'], properties: { code: { type: 'string', example: 'CRS-100' }, title: { type: 'string', example: 'New course' }, description: { type: 'string' }, userId: { type: 'integer', example: 1 } } },
  Module: { type: 'object', properties: { id: { type: 'integer' }, courseId: { type: 'integer' }, userId: { type: 'integer' }, title: { type: 'string' }, description: { type: 'string' }, author: { type: 'object' } } },
  ModuleInput: { type: 'object', required: ['courseId', 'userId', 'title'], properties: { courseId: { type: 'integer', example: 1 }, userId: { type: 'integer', example: 1 }, title: { type: 'string', example: 'Module title' }, description: { type: 'string' } } },
  Content: { type: 'object', properties: { id: { type: 'integer' }, moduleId: { type: 'integer' }, title: { type: 'string' }, body: { type: 'string' } } },
  ContentInput: { type: 'object', required: ['moduleId', 'title', 'body'], properties: { moduleId: { type: 'integer', example: 1 }, title: { type: 'string', example: 'Lesson' }, body: { type: 'string', example: 'Lesson text' } } },
  Error: { type: 'object', properties: { error: { type: 'string' }, details: { type: 'array', items: { type: 'string' } } } },
};

const err = { description: 'Error', content: json(ref('Error')) };

function resource(path, tag, name) {
  const base = `/${path}`;
  return {
    [base]: {
      get: { tags: [tag], summary: `List ${path}`, responses: { 200: { description: 'OK', content: json(arr(name)) } } },
      post: { tags: [tag], summary: `Create ${name.toLowerCase()}`, requestBody: { required: true, content: json(ref(`${name}Input`)) }, responses: { 201: { description: 'Created', content: json(ref(name)) }, 400: err, 409: err } },
    },
    [`${base}/{id}`]: {
      get: { tags: [tag], summary: `Get ${name.toLowerCase()}`, parameters: [id], responses: { 200: { description: 'OK', content: json(ref(name)) }, 404: err } },
      put: { tags: [tag], summary: `Update ${name.toLowerCase()}`, parameters: [id], requestBody: { required: true, content: json(ref(`${name}Input`)) }, responses: { 200: { description: 'OK', content: json(ref(name)) }, 400: err, 404: err, 409: err } },
      delete: { tags: [tag], summary: `Delete ${name.toLowerCase()}`, parameters: [id], responses: { 204: { description: 'Deleted' }, 404: err, 409: err } },
    },
  };
}

const rep = (summary) => ({ get: { tags: ['Reports'], summary, responses: { 200: { description: 'OK', content: json({ type: 'array', items: { type: 'object' } }) } } } });

module.exports = {
  openapi: '3.0.3',
  info: { title: 'XPTO Courses API', version: '1.0.0', description: 'Course management: users, courses, modules, contents, watch tracking and reports.' },
  servers: [{ url: '/api' }],
  tags: ['Users', 'Courses', 'Modules', 'Contents', 'Views', 'Reports'].map((name) => ({ name })),
  paths: {
    ...resource('users', 'Users', 'User'),
    ...resource('courses', 'Courses', 'Course'),
    ...resource('modules', 'Modules', 'Module'),
    ...resource('contents', 'Contents', 'Content'),
    '/contents/{id}/views': {
      get: { tags: ['Views'], summary: 'Users who watched the content', parameters: [id], responses: { 200: { description: 'OK' } } },
      post: { tags: ['Views'], summary: 'Register that a user watched the content', parameters: [id], requestBody: { required: true, content: json({ type: 'object', required: ['userId'], properties: { userId: { type: 'integer', example: 1 } } }) }, responses: { 201: { description: 'Created' }, 200: { description: 'Already registered' }, 409: err } },
    },
    '/contents/{id}/views/{userId}': {
      delete: { tags: ['Views'], summary: 'Remove a watch record', parameters: [id, { name: 'userId', in: 'path', required: true, schema: { type: 'integer' } }], responses: { 204: { description: 'Deleted' } } },
    },
    '/reports/users-most-courses': rep('SQL 01 - Users ordered by number of courses'),
    '/reports/course-most-contents': rep('SQL 02 - Course(s) with the most contents'),
    '/reports/courses-totals': rep('SQL 03 - Courses with total modules and contents'),
    '/reports/contents-with-course': rep('SQL 04 - All contents with their course name'),
    '/reports/contents/{id}/watched-by': { get: { tags: ['Reports'], summary: 'SQL 05 - Users who watched a content (use id=2)', parameters: [id], responses: { 200: { description: 'OK' } } } },
  },
  components: { schemas },
};
