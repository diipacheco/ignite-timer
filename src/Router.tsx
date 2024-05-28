import { Route, Routes } from 'react-router-dom';

import { Home } from './pages/Home';
import { History } from './pages/History';

export function Router() {
  return (
    <Routes>
      <Route element={<Home />} path="/" />
      <Route element={<History />} path="/history" />
    </Routes>
  );
}
