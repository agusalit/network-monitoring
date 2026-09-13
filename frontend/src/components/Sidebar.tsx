import {
  LayoutDashboard,
  Router,
  Map,
  AlertTriangle,
  SlidersHorizontal
} from 'lucide-react';

import { NavLink } from 'react-router-dom';

function Sidebar() {
  return (
    <aside className="sidebar">
      <div className="sidebar-brand">
        <div className="brand-icon">
          N
        </div>

        <div>
          <strong>NetMonitor</strong>
          <span>Network Administration</span>
        </div>
      </div>

      <nav className="sidebar-nav">
        <NavLink
          to="/dashboard"
          className={({ isActive }) =>
            `nav-item ${isActive ? 'active' : ''}`
          }
        >
          <LayoutDashboard size={18} />
          Dashboard
        </NavLink>

        <NavLink
          to="/devices"
          className={({ isActive }) =>
            `nav-item ${isActive ? 'active' : ''}`
          }
        >
          <Router size={18} />
          Devices
        </NavLink>

        <NavLink
          to="/locations"
          className={({ isActive }) =>
            `nav-item ${isActive ? 'active' : ''}`
          }
        >
          <Map size={18} />
          Locations
        </NavLink>

        <NavLink
          to="/incidents"
          className={({ isActive }) =>
            `nav-item ${isActive ? 'active' : ''}`
          }
        >
          <AlertTriangle size={18} />
          Incidents
        </NavLink>

        <NavLink
          to="/monitoring-configs"
          className={({ isActive }) =>
            `nav-item ${isActive ? 'active' : ''}`
          }
        >
          <SlidersHorizontal size={18} />
          Monitoring Configurations
        </NavLink>
      </nav>

      <div className="sidebar-footer">
        <span>Monitoring System</span>
        <small>v0.1.0</small>
      </div>
    </aside>
  );
}

export default Sidebar;