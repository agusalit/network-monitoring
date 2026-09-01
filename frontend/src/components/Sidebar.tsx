import {
  LayoutDashboard,
  Router,
  Map,
  AlertTriangle
} from 'lucide-react';

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
        <a
          href="/dashboard"
          className="nav-item active"
        >
          <LayoutDashboard size={18} />
          Dashboard
        </a>

        <a
          href="#"
          className="nav-item"
        >
          <Router size={18} />
          Devices
        </a>

        <a
          href="#"
          className="nav-item"
        >
          <Map size={18} />
          Locations
        </a>

        <a
          href="#"
          className="nav-item"
        >
          <AlertTriangle size={18} />
          Incidents
        </a>
      </nav>

      <div className="sidebar-footer">
        <span>Monitoring System</span>
        <small>v0.1.0</small>
      </div>
    </aside>
  );
}

export default Sidebar;