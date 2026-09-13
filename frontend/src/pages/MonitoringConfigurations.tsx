import { useEffect, useState } from 'react';

import {
  getMonitoringConfigs,
  updateMonitoringConfig
} from '../services/monitoringConfigApi';

import type {
  MonitoringConfig
} from '../types/monitoringConfig';

export default function MonitoringConfigurations() {
  const [configs, setConfigs] = useState<MonitoringConfig[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [savingId, setSavingId] = useState<string | null>(null);

  useEffect(() => {
    loadConfigs();
  }, []);

  async function loadConfigs() {
    try {
      setLoading(true);
      setError(null);

      const data = await getMonitoringConfigs();

      setConfigs(data);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Failed to load monitoring configurations'
      );
    } finally {
      setLoading(false);
    }
  }

  async function handleSave(config: MonitoringConfig) {
    try {
      setSavingId(config.id);
      setError(null);

      const updatedConfig = await updateMonitoringConfig(
        config.id,
        {
          enabled: config.enabled,
          interval_seconds: config.interval_seconds,
          timeout_seconds: config.timeout_seconds,
          retries: config.retries
        }
      );

      setConfigs((currentConfigs) =>
        currentConfigs.map((currentConfig) =>
          currentConfig.id === updatedConfig.id
            ? updatedConfig
            : currentConfig
        )
      );
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Failed to update monitoring configuration'
      );
    } finally {
      setSavingId(null);
    }
  }

  function updateLocalConfig(
    id: string,
    field: keyof MonitoringConfig,
    value: boolean | number
  ) {
    setConfigs((currentConfigs) =>
      currentConfigs.map((config) =>
        config.id === id
          ? {
              ...config,
              [field]: value
            }
          : config
      )
    );
  }

  if (loading) {
    return (
      <div className="p-6">
        <p>Loading monitoring configurations...</p>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">
          Monitoring Configurations
        </h1>

        <p className="mt-1 text-gray-600">
          Configure monitoring intervals, timeouts, and retries
          for each device.
        </p>
      </div>

      {error && (
        <div className="mb-4 rounded-md bg-red-100 p-3 text-red-700">
          {error}
        </div>
      )}

      <div className="overflow-x-auto rounded-lg border border-gray-200 bg-white">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-3 text-left">
                Device
              </th>

              <th className="px-4 py-3 text-left">
                Method
              </th>

              <th className="px-4 py-3 text-left">
                Enabled
              </th>

              <th className="px-4 py-3 text-left">
                Interval
              </th>

              <th className="px-4 py-3 text-left">
                Timeout
              </th>

              <th className="px-4 py-3 text-left">
                Retries
              </th>

              <th className="px-4 py-3 text-left">
                Action
              </th>
            </tr>
          </thead>

          <tbody>
            {configs.map((config) => (
              <tr
                key={config.id}
                className="border-t border-gray-200"
              >
                <td className="px-4 py-3">
                  <div className="font-medium">
                    {config.device?.name ?? 'Unknown device'}
                  </div>

                  <div className="text-xs text-gray-500">
                    {config.device?.ip_address ?? 'No IP address'}
                  </div>
                </td>

                <td className="px-4 py-3">
                  {config.method}
                </td>

                <td className="px-4 py-3">
                  <input
                    type="checkbox"
                    checked={config.enabled}
                    onChange={(event) =>
                      updateLocalConfig(
                        config.id,
                        'enabled',
                        event.target.checked
                      )
                    }
                  />
                </td>

                <td className="px-4 py-3">
                  <input
                    type="number"
                    min="1"
                    value={config.interval_seconds}
                    onChange={(event) =>
                      updateLocalConfig(
                        config.id,
                        'interval_seconds',
                        Number(event.target.value)
                      )
                    }
                    className="w-24 rounded border border-gray-300 px-2 py-1"
                  />

                  <span className="ml-1 text-gray-500">
                    sec
                  </span>
                </td>

                <td className="px-4 py-3">
                  <input
                    type="number"
                    min="1"
                    value={config.timeout_seconds}
                    onChange={(event) =>
                      updateLocalConfig(
                        config.id,
                        'timeout_seconds',
                        Number(event.target.value)
                      )
                    }
                    className="w-20 rounded border border-gray-300 px-2 py-1"
                  />

                  <span className="ml-1 text-gray-500">
                    sec
                  </span>
                </td>

                <td className="px-4 py-3">
                  <input
                    type="number"
                    min="0"
                    value={config.retries}
                    onChange={(event) =>
                      updateLocalConfig(
                        config.id,
                        'retries',
                        Number(event.target.value)
                      )
                    }
                    className="w-16 rounded border border-gray-300 px-2 py-1"
                  />
                </td>

                <td className="px-4 py-3">
                  <button
                    type="button"
                    onClick={() => handleSave(config)}
                    disabled={savingId === config.id}
                    className="rounded bg-blue-600 px-3 py-2 text-white disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {savingId === config.id
                      ? 'Saving...'
                      : 'Save'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}