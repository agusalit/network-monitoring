import {
  BrowserRouter,
  Routes,
  Route
} from 'react-router-dom';

import Dashboard from './pages/Dashboard';

import Devices from './pages/Devices.js';

import DeviceDetail from './pages/DeviceDetail.js';

import Locations from './pages/Locations.js';

import LocationDetail from './pages/LocationDetail.js';

import Incidents from './pages/Incidents.js';

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
          path="/devices"
          element={<Devices />}
        />

        <Route 
          path="/devices/:id"
          element={<DeviceDetail />}
        />

        <Route
          path="/locations"
          element={<Locations />}
        />

        <Route
          path="/locations/:id"
          element={<LocationDetail />}
        />

        <Route
          path="/incidents"
          element={<Incidents />}
        />
      </Routes>clear
    </BrowserRouter>
  );
}

export default App;