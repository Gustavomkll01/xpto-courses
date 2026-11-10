// Generates docs/openapi.json and the Postman collection from the OpenAPI object.
const fs = require('fs');
const path = require('path');
const spec = require('./openapi');

const out = path.resolve(__dirname, '../../../docs');
fs.writeFileSync(path.join(out, 'openapi.json'), JSON.stringify(spec, null, 2));

const resolve = (s) => (s && s.$ref ? spec.components.schemas[s.$ref.split('/').pop()] : s);
const example = (s) => Object.fromEntries(Object.entries(resolve(s).properties).map(([k, v]) => [k, v.example ?? (v.type === 'integer' ? 1 : 'string')]));

const items = [];
for (const [p, ops] of Object.entries(spec.paths)) {
  for (const [method, op] of Object.entries(ops)) {
    const route = p.replace(/\{(\w+)\}/g, (_, n) => (n === 'id' ? '1' : '1'));
    const body = op.requestBody && op.requestBody.content['application/json'].schema;
    let name = op.summary;
    items.push({
      tag: op.tags[0],
      item: {
        name,
        request: {
          method: method.toUpperCase(),
          header: body ? [{ key: 'Content-Type', value: 'application/json' }] : [],
          url: { raw: `{{baseUrl}}${route}`, host: ['{{baseUrl}}'], path: route.split('/').filter(Boolean) },
          ...(body ? { body: { mode: 'raw', raw: JSON.stringify(example(body), null, 2), options: { raw: { language: 'json' } } } } : {}),
        },
      },
    });
  }
}
const folders = spec.tags.map((t) => ({ name: t.name, item: items.filter((i) => i.tag === t.name).map((i) => i.item) }));
const collection = {
  info: { name: 'XPTO Courses API', schema: 'https://schema.getpostman.com/json/collection/v2.1.0/collection.json' },
  variable: [{ key: 'baseUrl', value: 'http://localhost:3001/api' }],
  item: folders,
};
fs.writeFileSync(path.join(out, 'postman_collection.json'), JSON.stringify(collection, null, 2));
console.log('Generated openapi.json and postman_collection.json');
