import {
  BrowserRouter,
  Routes,
  Route
} from 'react-router-dom';

import Dashboard from './pages/Dashboard';

import DeviceDetail from './pages/DeviceDetail.js';

import LocationDetail from './pages/LocationDetail.js';

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

        <Route
          path="/locations/:id"
          element={<LocationDetail />}
        />
      </Routes>clear
    </BrowserRouter>
  );
}

export default App;