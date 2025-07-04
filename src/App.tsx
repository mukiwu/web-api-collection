import { Routes, Route, Navigate } from 'react-router-dom';
import CollectionsPage from './pages/CollectionsPage';
import HomePage from './pages/HomePage';
import UpdatesPage from './pages/UpdatesPage';
import ApiDetailPage from './pages/ApiDetailPage';
import ApiEditPage from './pages/ApiEditPage';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/home" replace />} />
      <Route path="/collections" element={<CollectionsPage />} />
      <Route path="/home" element={<HomePage />} />
      <Route path="/updates" element={<UpdatesPage />} />
      <Route path="/api/:id" element={<ApiDetailPage />} />
      <Route path="/admin/api/new" element={<ApiEditPage />} />
      <Route path="/admin/api/:id/edit" element={<ApiEditPage />} />
    </Routes>
  );
}

export default App;
