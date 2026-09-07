import 'dotenv/config';

import express from 'express';
import cors from 'cors';

import deviceRoutes from './routes/device.routes.js';
import topologyRoutes from './routes/topology.routes.js';
import monitoringRoutes from './routes/monitoring.routes.js';
import {
  startMonitoringScheduler
} from './monitoring/monitoring.scheduler.js';
import dashboardRoutes from './routes/dashboard.routes.js';
import locationRoutes from './routes/location.routes.js';

const app = express();

const PORT = Number(process.env.PORT) || 3000;

app.use(cors());
app.use(express.json());

app.get('/api/health', (_req, res) => {
  res.json({
    status: 'ok',
    service: 'network-monitoring-api',
    timestamp: new Date().toISOString()
  });
});

app.use('/api/devices', deviceRoutes);
app.use('/api/topology', topologyRoutes);
app.use('/api/monitoring', monitoringRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/locations', locationRoutes);

app.listen(PORT, () => {
  console.log(
    `Network Monitoring API running on http://localhost:${PORT}`
  );

  startMonitoringScheduler();
});
