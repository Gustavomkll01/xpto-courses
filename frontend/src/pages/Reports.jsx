import { useEffect, useState } from 'react';
import { api } from '../api.js';

function Table({ rows }) {
  if (!rows) return <p>Loading...</p>;
  if (!rows.length) return <p>No results.</p>;
  const cols = Object.keys(rows[0]);
  return (
    <table>
      <thead><tr>{cols.map((c) => <th key={c}>{c}</th>)}</tr></thead>
      <tbody>{rows.map((r, i) => <tr key={i}>{cols.map((c) => <td key={c}>{String(r[c] ?? '')}</td>)}</tr>)}</tbody>
    </table>
  );
}

const reports = [
  ['SQL 01 - Users with the most courses', '/reports/users-most-courses'],
  ['SQL 02 - Course(s) with the most contents', '/reports/course-most-contents'],
  ['SQL 03 - Courses with total modules and contents', '/reports/courses-totals'],
  ['SQL 04 - All contents with course name', '/reports/contents-with-course'],
];

function Report({ title, path }) {
  const [rows, setRows] = useState(null);
  const [error, setError] = useState('');
  useEffect(() => { api.get(path).then(setRows).catch((e) => setError(e.message)); }, [path]);
  return (
    <div className="card">
      <h2>{title}</h2>
      {error ? <p className="error">{error}</p> : <Table rows={rows} />}
    </div>
  );
}

export default function Reports() {
  const [contentId, setContentId] = useState('2');
  return (
    <section>
      <h1>Reports</h1>
      {reports.map(([title, path]) => <Report key={path} title={title} path={path} />)}
      <div className="card">
        <h2>SQL 05 - Users who watched a content</h2>
        <label>Content ID <input type="number" min="1" value={contentId} onChange={(e) => setContentId(e.target.value)} /></label>
        {contentId && <Report key={contentId} title={`Content #${contentId}`} path={`/reports/contents/${contentId}/watched-by`} />}
      </div>
    </section>
  );
}
