import { useCallback, useEffect, useState } from 'react';
import { api } from '../api.js';

const getPath = (obj, path) => path.split('.').reduce((o, k) => (o == null ? o : o[k]), obj);
const emptyForm = (fields) => Object.fromEntries(fields.map((f) => [f.name, f.name === 'status' ? 'active' : '']));

export default function CrudPage({ resource, config }) {
  const { label, fields, columns } = config;
  const [rows, setRows] = useState([]);
  const [lookups, setLookups] = useState({});
  const [form, setForm] = useState(emptyForm(fields));
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState('');

  const load = useCallback(async () => {
    try {
      setRows(await api.list(resource));
      const sources = [...new Set(fields.filter((f) => f.from).map((f) => f.from))];
      const entries = await Promise.all(sources.map(async (s) => [s, await api.list(s)]));
      setLookups(Object.fromEntries(entries));
    } catch (e) { setError(e.message); }
  }, [resource, fields]);

  useEffect(() => { load(); }, [load]);

  const reset = () => { setForm(emptyForm(fields)); setEditingId(null); };

  const submit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      if (editingId) await api.update(resource, editingId, form);
      else await api.create(resource, form);
      reset();
      load();
    } catch (err) { setError(err.message); }
  };

  const edit = (row) => {
    setEditingId(row.id);
    setForm(Object.fromEntries(fields.map((f) => [f.name, row[f.name] ?? ''])));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const remove = async (row) => {
    if (!window.confirm(`Delete ${label.toLowerCase()} #${row.id}?`)) return;
    try { await api.remove(resource, row.id); load(); } catch (err) { setError(err.message); }
  };

  const optionsFor = (f) => (f.options
    ? f.options.map((o) => [o, o])
    : (lookups[f.from] || []).map((r) => [r.id, `${r.id} - ${r[f.labelKey]}`]));

  return (
    <section>
      <h1>{label}</h1>
      {error && <p className="error" role="alert">{error}</p>}
      <form onSubmit={submit} className="card">
        <h2>{editingId ? `Edit #${editingId}` : 'New'}</h2>
        {fields.map((f) => (
          <label key={f.name}>{f.label}
            {f.type === 'textarea' ? (
              <textarea value={form[f.name]} required={f.required} onChange={(e) => setForm({ ...form, [f.name]: e.target.value })} />
            ) : f.type === 'select' ? (
              <select value={form[f.name]} required={f.required} onChange={(e) => setForm({ ...form, [f.name]: e.target.value })}>
                <option value="">Select...</option>
                {optionsFor(f).map(([v, text]) => <option key={v} value={v}>{text}</option>)}
              </select>
            ) : (
              <input type={f.type} value={form[f.name]} required={f.required} onChange={(e) => setForm({ ...form, [f.name]: e.target.value })} />
            )}
          </label>
        ))}
        <div className="actions">
          <button type="submit">{editingId ? 'Save' : 'Create'}</button>
          {editingId && <button type="button" className="secondary" onClick={reset}>Cancel</button>}
        </div>
      </form>

      <table>
        <thead><tr>{columns.map(([, h]) => <th key={h}>{h}</th>)}<th /></tr></thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.id}>
              {columns.map(([path]) => <td key={path}>{String(getPath(row, path) ?? '')}</td>)}
              <td className="actions">
                <button className="secondary" onClick={() => edit(row)}>Edit</button>
                <button className="danger" onClick={() => remove(row)}>Delete</button>
              </td>
            </tr>
          ))}
          {rows.length === 0 && <tr><td colSpan={columns.length + 1}>No records.</td></tr>}
        </tbody>
      </table>
    </section>
  );
}
