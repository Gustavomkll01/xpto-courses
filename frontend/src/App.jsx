import { NavLink, Navigate, Route, Routes } from 'react-router-dom';
import CrudPage from './pages/CrudPage.jsx';
import Reports from './pages/Reports.jsx';
import Views from './pages/Views.jsx';
import { resources } from './resources.js';

export default function App() {
  return (
    <div className="layout">
      <nav className="nav">
        <strong>XPTO Courses</strong>
        {Object.entries(resources).map(([key, r]) => <NavLink key={key} to={`/${key}`}>{r.label}</NavLink>)}
        <NavLink to="/views">Watched</NavLink>
        <NavLink to="/reports">Reports</NavLink>
        <a href="/api-docs" target="_blank" rel="noreferrer">API docs</a>
      </nav>
      <main>
        <Routes>
          <Route path="/" element={<Navigate to="/courses" replace />} />
          {Object.entries(resources).map(([key, r]) => <Route key={key} path={`/${key}`} element={<CrudPage key={key} resource={key} config={r} />} />)}
          <Route path="/views" element={<Views />} />
          <Route path="/reports" element={<Reports />} />
        </Routes>
      </main>
    </div>
  );
}
