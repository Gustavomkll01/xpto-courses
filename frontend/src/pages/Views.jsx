import { useEffect, useState } from 'react';
import { api } from '../api.js';

// Register that a user watched a content (feeds report SQL 05)
export default function Views() {
  const [users, setUsers] = useState([]);
  const [contents, setContents] = useState([]);
  const [userId, setUserId] = useState('');
  const [contentId, setContentId] = useState('');
  const [watched, setWatched] = useState([]);
  const [msg, setMsg] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    Promise.all([api.list('users'), api.list('contents')]).then(([u, c]) => { setUsers(u); setContents(c); }).catch((e) => setError(e.message));
  }, []);

  const loadWatched = (id) => (id ? api.get(`/contents/${id}/views`).then(setWatched).catch((e) => setError(e.message)) : setWatched([]));
  useEffect(() => { loadWatched(contentId); }, [contentId]);

  const submit = async (e) => {
    e.preventDefault();
    setError(''); setMsg('');
    try {
      await api.post(`/contents/${contentId}/views`, { userId: Number(userId) });
      setMsg('Watch registered.');
      loadWatched(contentId);
    } catch (err) { setError(err.message); }
  };

  return (
    <section>
      <h1>Watched lessons</h1>
      {error && <p className="error" role="alert">{error}</p>}
      {msg && <p className="ok">{msg}</p>}
      <form onSubmit={submit} className="card">
        <label>User
          <select value={userId} required onChange={(e) => setUserId(e.target.value)}>
            <option value="">Select...</option>
            {users.map((u) => <option key={u.id} value={u.id}>{u.id} - {u.name}</option>)}
          </select>
        </label>
        <label>Content
          <select value={contentId} required onChange={(e) => setContentId(e.target.value)}>
            <option value="">Select...</option>
            {contents.map((c) => <option key={c.id} value={c.id}>{c.id} - {c.title}</option>)}
          </select>
        </label>
        <button type="submit">Register watch</button>
      </form>
      {contentId && (
        <table>
          <thead><tr><th>User</th><th>Email</th><th>Watched at</th></tr></thead>
          <tbody>
            {watched.map((w) => <tr key={w.id}><td>{w.name}</td><td>{w.email}</td><td>{new Date(w.watched_at).toLocaleString()}</td></tr>)}
            {watched.length === 0 && <tr><td colSpan="3">Nobody yet.</td></tr>}
          </tbody>
        </table>
      )}
    </section>
  );
}
