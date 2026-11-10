// Declarative config for each CRUD screen.
// field.type: text | email | textarea | select (options come from another resource: field.from + field.labelKey)
export const resources = {
  courses: {
    label: 'Courses',
    fields: [
      { name: 'code', label: 'Code', type: 'text', required: true },
      { name: 'title', label: 'Title', type: 'text', required: true },
      { name: 'description', label: 'Description', type: 'textarea' },
      { name: 'userId', label: 'Author', type: 'select', from: 'users', labelKey: 'name', required: true },
    ],
    columns: [['id', 'ID'], ['code', 'Code'], ['title', 'Title'], ['author.name', 'Author']],
  },
  modules: {
    label: 'Modules',
    fields: [
      { name: 'courseId', label: 'Course', type: 'select', from: 'courses', labelKey: 'title', required: true },
      { name: 'userId', label: 'Author', type: 'select', from: 'users', labelKey: 'name', required: true },
      { name: 'title', label: 'Title', type: 'text', required: true },
      { name: 'description', label: 'Description', type: 'textarea' },
    ],
    columns: [['id', 'ID'], ['courseId', 'Course ID'], ['title', 'Title'], ['author.name', 'Author']],
  },
  contents: {
    label: 'Contents',
    fields: [
      { name: 'moduleId', label: 'Module', type: 'select', from: 'modules', labelKey: 'title', required: true },
      { name: 'title', label: 'Title', type: 'text', required: true },
      { name: 'body', label: 'Content', type: 'textarea', required: true },
    ],
    columns: [['id', 'ID'], ['moduleId', 'Module ID'], ['title', 'Title']],
  },
  users: {
    label: 'Users',
    fields: [
      { name: 'name', label: 'Name', type: 'text', required: true },
      { name: 'email', label: 'Email', type: 'email', required: true },
      { name: 'status', label: 'Status', type: 'select', options: ['active', 'inactive'], required: true },
    ],
    columns: [['id', 'ID'], ['name', 'Name'], ['email', 'Email'], ['status', 'Status']],
  },
};
