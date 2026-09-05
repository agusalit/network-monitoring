import {
  BrowserRouter,
  Routes,
  Route
} from 'react-router-dom';

import Dashboard from './pages/Dashboard';

import DeviceDetail from './pages/DeviceDetail.js';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={<Dashboard />}
        />

        <Route
          path="/dashboard"
          element={<Dashboard />}
        />

        <Route 
          path="/devices/:id"
          element={<DeviceDetail />}
        />
      </Routes>clear
    </BrowserRouter>
  );
}

export default App;