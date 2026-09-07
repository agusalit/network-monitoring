interface MonitoringRecord {
  id: string;
  checked_at: string;
  status: 'ONLINE' | 'WARNING' | 'OFFLINE';
  latency_ms: number | null;
  packet_loss_percent: number | null;
}

interface Props {
  records: MonitoringRecord[];
}

function PerformanceChart({ records }: Props) {
  if (records.length === 0) {
    return (
      <section className="dashboard-section">
        <div className="section-header">
          <div>
            <h2>Performance Trend</h2>
            <p>Recent network performance</p>
          </div>
        </div>

        <p>No monitoring data available.</p>
      </section>
    );
  }

  const orderedRecords = [...records].reverse();

  const latencyValues = orderedRecords
    .map(record => record.latency_ms)
    .filter(
      (value): value is number =>
        value !== null
    );

  const packetLossValues = orderedRecords
    .map(record => record.packet_loss_percent)
    .filter(
      (value): value is number =>
        value !== null
    );

  const createPoints = (
    values: number[],
    width: number,
    height: number,
    padding: number
  ) => {
    if (values.length === 1) {
      return `${width / 2},${height / 2}`;
    }

    const max = Math.max(...values, 1);
    const min = Math.min(...values, 0);

    const range = max - min || 1;

    return values
      .map((value, index) => {
        const x =
          padding +
          (index / (values.length - 1)) *
            (width - padding * 2);

        const y =
          height -
          padding -
          ((value - min) / range) *
            (height - padding * 2);

        return `${x},${y}`;
      })
      .join(' ');
  };

  const width = 700;
  const height = 220;
  const padding = 30;

  const latencyPoints = createPoints(
    latencyValues,
    width,
    height,
    padding
  );

  const packetLossPoints = createPoints(
    packetLossValues,
    width,
    height,
    padding
  );

  return (
    <section className="dashboard-section">
      <div className="section-header">
        <div>
          <h2>Performance Trend</h2>
          <p>Recent network performance</p>
        </div>
      </div>

      <div className="performance-chart">
        <h3>Latency (ms)</h3>

        {latencyValues.length > 0 ? (
          <svg
            viewBox={`0 0 ${width} ${height}`}
            className="chart-svg"
          >
            <line
              x1={padding}
              y1={height - padding}
              x2={width - padding}
              y2={height - padding}
              className="chart-axis"
            />

            <polyline
              points={latencyPoints}
              fill="none"
              className="chart-line"
            />

            {latencyValues.map(
              (value, index) => {
                const points =
                  latencyPoints.split(' ');

                const [x, y] =
                  points[index]
                    .split(',')
                    .map(Number);

                return (
                  <circle
                    key={`${value}-${index}`}
                    cx={x}
                    cy={y}
                    r="3"
                    className="chart-point"
                  />
                );
              }
            )}
          </svg>
        ) : (
          <p>No latency data available.</p>
        )}
      </div>

      <div className="performance-chart">
        <h3>Packet Loss (%)</h3>

        {packetLossValues.length > 0 ? (
          <svg
            viewBox={`0 0 ${width} ${height}`}
            className="chart-svg"
          >
            <line
              x1={padding}
              y1={height - padding}
              x2={width - padding}
              y2={height - padding}
              className="chart-axis"
            />

            <polyline
              points={packetLossPoints}
              fill="none"
              className="chart-line"
            />

            {packetLossValues.map(
              (value, index) => {
                const points =
                  packetLossPoints.split(' ');

                const [x, y] =
                  points[index]
                    .split(',')
                    .map(Number);

                return (
                  <circle
                    key={`${value}-${index}`}
                    cx={x}
                    cy={y}
                    r="3"
                    className="chart-point"
                  />
                );
              }
            )}
          </svg>
        ) : (
          <p>No packet loss data available.</p>
        )}
      </div>
    </section>
  );
}

export default PerformanceChart;