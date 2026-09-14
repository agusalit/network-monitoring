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
  const [originalConfigs, setOriginalConfigs] = useState<
  MonitoringConfig[]
>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [savingId, setSavingId] = useState<string | null>(null);
  const [savedId, setSavedId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [methodFilter, setMethodFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');

  useEffect(() => {
    loadConfigs();
  }, []);

  async function loadConfigs() {
    try {
      setLoading(true);
      setError(null);

      const data = await getMonitoringConfigs();

      setConfigs(data);
      setOriginalConfigs(data);
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
  if (!hasChanges(config)) {
    return;
  }

  if (
    !Number.isInteger(config.interval_seconds) ||
    config.interval_seconds <= 0
  ) {
    setError('Interval must be a positive integer');
    return;
  }

  if (
    !Number.isInteger(config.timeout_seconds) ||
    config.timeout_seconds <= 0
  ) {
    setError('Timeout must be a positive integer');
    return;
  }

  if (
    !Number.isInteger(config.retries) ||
    config.retries < 0
  ) {
    setError('Retries must be a non-negative integer');
    return;
  }

  try {
    setSavingId(config.id);
    setSavedId(null);
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

    setOriginalConfigs((currentConfigs) =>
      currentConfigs.map((currentConfig) =>
        currentConfig.id === updatedConfig.id
          ? updatedConfig
          : currentConfig
      )
    );

    setSavedId(config.id);
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

  function hasChanges(config: MonitoringConfig): boolean {
  const original = originalConfigs.find(
    (item) => item.id === config.id
  );

  if (!original) {
    return false;
  }

  return (
    config.enabled !== original.enabled ||
    config.interval_seconds !== original.interval_seconds ||
    config.timeout_seconds !== original.timeout_seconds ||
    config.retries !== original.retries
  );
}

const filteredConfigs = configs.filter((config) => {
  const search = searchTerm.toLowerCase();

  const deviceName =
    config.device?.name?.toLowerCase() ?? '';

  const hostname =
    config.device?.hostname?.toLowerCase() ?? '';

  const ipAddress =
    config.device?.ip_address?.toLowerCase() ?? '';

  const matchesSearch =
    deviceName.includes(search) ||
    hostname.includes(search) ||
    ipAddress.includes(search);

  const matchesMethod =
    methodFilter === 'ALL' ||
    config.method === methodFilter;

  const matchesStatus =
    statusFilter === 'ALL' ||
    (statusFilter === 'ENABLED' && config.enabled) ||
    (statusFilter === 'DISABLED' && !config.enabled);

  return (
    matchesSearch &&
    matchesMethod &&
    matchesStatus
  );
});

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

      <div className="mb-4 grid gap-3 md:grid-cols-3">
        <input
          type="text"
          placeholder="Search device, hostname, or IP..."
          value={searchTerm}
          onChange={(event) =>
            setSearchTerm(event.target.value)
          }
          className="rounded-md border border-gray-300 px-3 py-2"
        />

        <select
          value={methodFilter}
          onChange={(event) =>
            setMethodFilter(event.target.value)
          }
          className="rounded-md border border-gray-300 px-3 py-2"
        >
          <option value="ALL">All methods</option>
          <option value="SIMULATION">Simulation</option>
          <option value="ICMP">ICMP</option>
          <option value="SNMP">SNMP</option>
          <option value="API">API</option>
        </select>

        <select
          value={statusFilter}
          onChange={(event) =>
            setStatusFilter(event.target.value)
          }
          className="rounded-md border border-gray-300 px-3 py-2"
        >
          <option value="ALL">All statuses</option>
          <option value="ENABLED">Enabled only</option>
          <option value="DISABLED">Disabled only</option>
        </select>
      </div>
      <p className="mb-3 text-sm text-gray-600">
        Showing {filteredConfigs.length} of {configs.length} configurations
      </p>
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
            {filteredConfigs.map((config) => (
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

                  <div className="mt-1 text-xs text-gray-500">
                    {config.device?.location?.area?.property?.name ?? 'Unknown property'}
                    {' / '}
                    {config.device?.location?.area?.name ?? 'Unknown area'}
                    {' / '}
                    {config.device?.location?.name ?? 'Unknown location'}
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
                  {hasChanges(config) && (
                    <div className="mb-1 text-xs text-amber-600">
                      Unsaved changes
                    </div>
                  )}
                  <button
                    type="button"
                    onClick={() => handleSave(config)}
                    disabled={
                      savingId === config.id ||
                      !hasChanges(config)
                    }
                    className="rounded bg-blue-600 px-3 py-2 text-white disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {savingId === config.id
                      ? 'Saving...'
                      : savedId === config.id
                        ? 'Saved'
                        : 'Save'}
                  </button>
                </td>
              </tr>
            ))}

            {filteredConfigs.length === 0 && (
              <tr>
                <td
                  colSpan={7}
                  className="px-4 py-6 text-center text-gray-500"
                >
                  No monitoring configurations match your filters.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}