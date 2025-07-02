import { Routes, Route, Navigate } from 'react-router-dom';
import CollectionsPage from './pages/CollectionsPage';
import HomePage from './pages/HomePage';
import UpdatesPage from './pages/UpdatesPage';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/home" replace />} />
      <Route path="/collections" element={<CollectionsPage />} />
      <Route path="/home" element={<HomePage />} />
      <Route path="/updates" element={<UpdatesPage />} />
    </Routes>
  );
}

export default App;
