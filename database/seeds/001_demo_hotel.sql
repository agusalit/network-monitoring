-- ============================================================
-- Network Monitoring System
-- Seed: 001_demo_hotel
-- Demo Property: Hotel ABC
-- ============================================================


-- ============================================================
-- 1. PROPERTY
-- ============================================================

INSERT INTO properties (
    id,
    name,
    description,
    address
)
VALUES (
    '10000000-0000-0000-0000-000000000001',
    'Hotel ABC',
    'Demo hotel property used for network monitoring development and presentation.',
    '123 Example Street'
);


-- ============================================================
-- 2. AREAS
-- ============================================================

INSERT INTO areas (
    id,
    property_id,
    name,
    type,
    description
)
VALUES
(
    '20000000-0000-0000-0000-000000000001',
    '10000000-0000-0000-0000-000000000001',
    'Guest Area',
    'GUEST',
    'Guest rooms and guest accommodation areas.'
),
(
    '20000000-0000-0000-0000-000000000002',
    '10000000-0000-0000-0000-000000000001',
    'Public Area',
    'PUBLIC',
    'Public facilities accessible to hotel guests.'
),
(
    '20000000-0000-0000-0000-000000000003',
    '10000000-0000-0000-0000-000000000001',
    'Office Area',
    'OFFICE',
    'Administrative and operational offices.'
),
(
    '20000000-0000-0000-0000-000000000004',
    '10000000-0000-0000-0000-000000000001',
    'Infrastructure',
    'INFRASTRUCTURE',
    'Network infrastructure and technical areas.'
);


-- ============================================================
-- 3. LOCATIONS
-- ============================================================

-- -------------------------
-- Guest Area
-- -------------------------

INSERT INTO locations (
    id,
    area_id,
    parent_location_id,
    name,
    type,
    floor_number
)
VALUES
(
    '30000000-0000-0000-0000-000000000001',
    '20000000-0000-0000-0000-000000000001',
    NULL,
    'Floor 1',
    'FLOOR',
    1
),
(
    '30000000-0000-0000-0000-000000000002',
    '20000000-0000-0000-0000-000000000001',
    NULL,
    'Floor 2',
    'FLOOR',
    2
);


-- Guest rooms - Floor 1

INSERT INTO locations (
    id,
    area_id,
    parent_location_id,
    name,
    type,
    floor_number
)
VALUES
(
    '30000000-0000-0000-0000-000000000101',
    '20000000-0000-0000-0000-000000000001',
    '30000000-0000-0000-0000-000000000001',
    'Room 101',
    'ROOM',
    1
),
(
    '30000000-0000-0000-0000-000000000102',
    '20000000-0000-0000-0000-000000000001',
    '30000000-0000-0000-0000-000000000001',
    'Room 102',
    'ROOM',
    1
),
(
    '30000000-0000-0000-0000-000000000103',
    '20000000-0000-0000-0000-000000000001',
    '30000000-0000-0000-0000-000000000001',
    'Room 103',
    'ROOM',
    1
);


-- Guest rooms - Floor 2

INSERT INTO locations (
    id,
    area_id,
    parent_location_id,
    name,
    type,
    floor_number
)
VALUES
(
    '30000000-0000-0000-0000-000000000201',
    '20000000-0000-0000-0000-000000000001',
    '30000000-0000-0000-0000-000000000002',
    'Room 201',
    'ROOM',
    2
),
(
    '30000000-0000-0000-0000-000000000202',
    '20000000-0000-0000-0000-000000000001',
    '30000000-0000-0000-0000-000000000002',
    'Room 202',
    'ROOM',
    2
),
(
    '30000000-0000-0000-0000-000000000203',
    '20000000-0000-0000-0000-000000000001',
    '30000000-0000-0000-0000-000000000002',
    'Room 203',
    'ROOM',
    2
);


-- -------------------------
-- Public Area
-- -------------------------

INSERT INTO locations (
    id,
    area_id,
    name,
    type
)
VALUES
(
    '30000000-0000-0000-0000-000000000301',
    '20000000-0000-0000-0000-000000000002',
    'Lobby',
    'PUBLIC_AREA'
),
(
    '30000000-0000-0000-0000-000000000302',
    '20000000-0000-0000-0000-000000000002',
    'Restaurant',
    'PUBLIC_AREA'
),
(
    '30000000-0000-0000-0000-000000000303',
    '20000000-0000-0000-0000-000000000002',
    'Gym',
    'PUBLIC_AREA'
);


-- -------------------------
-- Office Area
-- -------------------------

INSERT INTO locations (
    id,
    area_id,
    name,
    type
)
VALUES
(
    '30000000-0000-0000-0000-000000000401',
    '20000000-0000-0000-0000-000000000003',
    'Front Office',
    'OFFICE'
),
(
    '30000000-0000-0000-0000-000000000402',
    '20000000-0000-0000-0000-000000000003',
    'Back Office',
    'OFFICE'
),
(
    '30000000-0000-0000-0000-000000000403',
    '20000000-0000-0000-0000-000000000003',
    'Manager Office',
    'OFFICE'
);


-- -------------------------
-- Infrastructure
-- -------------------------

INSERT INTO locations (
    id,
    area_id,
    name,
    type
)
VALUES
(
    '30000000-0000-0000-0000-000000000501',
    '20000000-0000-0000-0000-000000000004',
    'Main Network Room',
    'NETWORK_ROOM'
);


-- ============================================================
-- 4. DEVICES
-- ============================================================

-- -------------------------
-- Core infrastructure
-- -------------------------

INSERT INTO devices (
    id,
    location_id,
    name,
    hostname,
    device_type,
    vendor,
    model,
    ip_address,
    status,
    description
)
VALUES
(
    '40000000-0000-0000-0000-000000000001',
    '30000000-0000-0000-0000-000000000501',
    'Router-01',
    'router-01',
    'ROUTER',
    'Generic',
    'Demo Router',
    '10.10.0.1',
    'ONLINE',
    'Primary gateway router.'
),
(
    '40000000-0000-0000-0000-000000000002',
    '30000000-0000-0000-0000-000000000501',
    'Core-SW-01',
    'core-sw-01',
    'SWITCH',
    'Generic',
    'Demo Core Switch',
    '10.10.0.2',
    'ONLINE',
    'Core network switch.'
),
(
    '40000000-0000-0000-0000-000000000003',
    '30000000-0000-0000-0000-000000000001',
    'SW-F1-01',
    'sw-f1-01',
    'SWITCH',
    'Generic',
    'Demo Access Switch',
    '10.10.1.1',
    'ONLINE',
    'Floor 1 access switch.'
),
(
    '40000000-0000-0000-0000-000000000004',
    '30000000-0000-0000-0000-000000000002',
    'SW-F2-01',
    'sw-f2-01',
    'SWITCH',
    'Generic',
    'Demo Access Switch',
    '10.10.2.1',
    'ONLINE',
    'Floor 2 access switch.'
),
(
    '40000000-0000-0000-0000-000000000005',
    '30000000-0000-0000-0000-000000000501',
    'SW-PUBLIC-01',
    'sw-public-01',
    'SWITCH',
    'Generic',
    'Demo Access Switch',
    '10.10.3.1',
    'ONLINE',
    'Public area access switch.'
),
(
    '40000000-0000-0000-0000-000000000006',
    '30000000-0000-0000-0000-000000000501',
    'SW-OFFICE-01',
    'sw-office-01',
    'SWITCH',
    'Generic',
    'Demo Access Switch',
    '10.10.4.1',
    'ONLINE',
    'Office area access switch.'
);


-- ============================================================
-- 5. ACCESS POINTS
-- ============================================================

INSERT INTO devices (
    id,
    location_id,
    name,
    hostname,
    device_type,
    vendor,
    model,
    ip_address,
    status,
    description
)
VALUES

-- Floor 1
(
    '40000000-0000-0000-0000-000000000101',
    '30000000-0000-0000-0000-000000000101',
    'AP-101',
    'ap-101',
    'ACCESS_POINT',
    'Generic',
    'Demo Access Point',
    '10.10.1.101',
    'ONLINE',
    'Access point serving Room 101.'
),
(
    '40000000-0000-0000-0000-000000000102',
    '30000000-0000-0000-0000-000000000102',
    'AP-102',
    'ap-102',
    'ACCESS_POINT',
    'Generic',
    'Demo Access Point',
    '10.10.1.102',
    'ONLINE',
    'Access point serving Room 102.'
),
(
    '40000000-0000-0000-0000-000000000103',
    '30000000-0000-0000-0000-000000000103',
    'AP-103',
    'ap-103',
    'ACCESS_POINT',
    'Generic',
    'Demo Access Point',
    '10.10.1.103',
    'ONLINE',
    'Access point serving Room 103.'
),

-- Floor 2
(
    '40000000-0000-0000-0000-000000000201',
    '30000000-0000-0000-0000-000000000201',
    'AP-201',
    'ap-201',
    'ACCESS_POINT',
    'Generic',
    'Demo Access Point',
    '10.10.2.201',
    'ONLINE',
    'Access point serving Room 201.'
),
(
    '40000000-0000-0000-0000-000000000202',
    '30000000-0000-0000-0000-000000000202',
    'AP-202',
    'ap-202',
    'ACCESS_POINT',
    'Generic',
    'Demo Access Point',
    '10.10.2.202',
    'ONLINE',
    'Access point serving Room 202.'
),
(
    '40000000-0000-0000-0000-000000000203',
    '30000000-0000-0000-0000-000000000203',
    'AP-203',
    'ap-203',
    'ACCESS_POINT',
    'Generic',
    'Demo Access Point',
    '10.10.2.203',
    'WARNING',
    'Access point intentionally configured for a simulated network issue.'
),

-- Public
(
    '40000000-0000-0000-0000-000000000301',
    '30000000-0000-0000-0000-000000000301',
    'AP-Lobby',
    'ap-lobby',
    'ACCESS_POINT',
    'Generic',
    'Demo Access Point',
    '10.10.3.101',
    'ONLINE',
    'Access point serving the lobby.'
),
(
    '40000000-0000-0000-0000-000000000302',
    '30000000-0000-0000-0000-000000000302',
    'AP-Restaurant',
    'ap-restaurant',
    'ACCESS_POINT',
    'Generic',
    'Demo Access Point',
    '10.10.3.102',
    'ONLINE',
    'Access point serving the restaurant.'
),
(
    '40000000-0000-0000-0000-000000000303',
    '30000000-0000-0000-0000-000000000303',
    'AP-Gym',
    'ap-gym',
    'ACCESS_POINT',
    'Generic',
    'Demo Access Point',
    '10.10.3.103',
    'ONLINE',
    'Access point serving the gym.'
),

-- Office
(
    '40000000-0000-0000-0000-000000000401',
    '30000000-0000-0000-0000-000000000401',
    'AP-FrontOffice',
    'ap-frontoffice',
    'ACCESS_POINT',
    'Generic',
    'Demo Access Point',
    '10.10.4.101',
    'ONLINE',
    'Access point serving the front office.'
),
(
    '40000000-0000-0000-0000-000000000402',
    '30000000-0000-0000-0000-000000000402',
    'AP-BackOffice',
    'ap-backoffice',
    'ACCESS_POINT',
    'Generic',
    'Demo Access Point',
    '10.10.4.102',
    'ONLINE',
    'Access point serving the back office.'
),
(
    '40000000-0000-0000-0000-000000000403',
    '30000000-0000-0000-0000-000000000403',
    'AP-ManagerOffice',
    'ap-manageroffice',
    'ACCESS_POINT',
    'Generic',
    'Demo Access Point',
    '10.10.4.103',
    'ONLINE',
    'Access point serving the manager office.'
);


-- ============================================================
-- 6. NETWORK TOPOLOGY
-- ============================================================

INSERT INTO device_relationships (
    source_device_id,
    target_device_id,
    relationship_type,
    description
)
VALUES

-- Router → Core
(
    '40000000-0000-0000-0000-000000000001',
    '40000000-0000-0000-0000-000000000002',
    'UPLINK_TO',
    'Router uplink to core switch.'
),

-- Core → Access switches
(
    '40000000-0000-0000-0000-000000000002',
    '40000000-0000-0000-0000-000000000003',
    'DOWNLINK_TO',
    'Core switch connection to Floor 1 switch.'
),
(
    '40000000-0000-0000-0000-000000000002',
    '40000000-0000-0000-0000-000000000004',
    'DOWNLINK_TO',
    'Core switch connection to Floor 2 switch.'
),
(
    '40000000-0000-0000-0000-000000000002',
    '40000000-0000-0000-0000-000000000005',
    'DOWNLINK_TO',
    'Core switch connection to Public Area switch.'
),
(
    '40000000-0000-0000-0000-000000000002',
    '40000000-0000-0000-0000-000000000006',
    'DOWNLINK_TO',
    'Core switch connection to Office switch.'
),

-- Floor 1
(
    '40000000-0000-0000-0000-000000000003',
    '40000000-0000-0000-0000-000000000101',
    'DOWNLINK_TO',
    'Floor 1 switch connection to AP-101.'
),
(
    '40000000-0000-0000-0000-000000000003',
    '40000000-0000-0000-0000-000000000102',
    'DOWNLINK_TO',
    'Floor 1 switch connection to AP-102.'
),
(
    '40000000-0000-0000-0000-000000000003',
    '40000000-0000-0000-0000-000000000103',
    'DOWNLINK_TO',
    'Floor 1 switch connection to AP-103.'
),

-- Floor 2
(
    '40000000-0000-0000-0000-000000000004',
    '40000000-0000-0000-0000-000000000201',
    'DOWNLINK_TO',
    'Floor 2 switch connection to AP-201.'
),
(
    '40000000-0000-0000-0000-000000000004',
    '40000000-0000-0000-0000-000000000202',
    'DOWNLINK_TO',
    'Floor 2 switch connection to AP-202.'
),
(
    '40000000-0000-0000-0000-000000000004',
    '40000000-0000-0000-0000-000000000203',
    'DOWNLINK_TO',
    'Floor 2 switch connection to AP-203.'
),

-- Public
(
    '40000000-0000-0000-0000-000000000005',
    '40000000-0000-0000-0000-000000000301',
    'DOWNLINK_TO',
    'Public switch connection to lobby AP.'
),
(
    '40000000-0000-0000-0000-000000000005',
    '40000000-0000-0000-0000-000000000302',
    'DOWNLINK_TO',
    'Public switch connection to restaurant AP.'
),
(
    '40000000-0000-0000-0000-000000000005',
    '40000000-0000-0000-0000-000000000303',
    'DOWNLINK_TO',
    'Public switch connection to gym AP.'
),

-- Office
(
    '40000000-0000-0000-0000-000000000006',
    '40000000-0000-0000-0000-000000000401',
    'DOWNLINK_TO',
    'Office switch connection to Front Office AP.'
),
(
    '40000000-0000-0000-0000-000000000006',
    '40000000-0000-0000-0000-000000000402',
    'DOWNLINK_TO',
    'Office switch connection to Back Office AP.'
),
(
    '40000000-0000-0000-0000-000000000006',
    '40000000-0000-0000-0000-000000000403',
    'DOWNLINK_TO',
    'Office switch connection to Manager Office AP.'
);


-- ============================================================
-- 7. MONITORING CONFIGURATIONS
-- ============================================================

INSERT INTO monitoring_configs (
    device_id,
    method,
    enabled,
    interval_seconds,
    timeout_seconds,
    retries,
    configuration
)
SELECT
    id,
    'SIMULATION',
    TRUE,
    30,
    5,
    1,
    '{}'::JSONB
FROM devices;


-- ============================================================
-- 8. INITIAL MONITORING RECORDS
-- ============================================================

INSERT INTO monitoring_records (
    device_id,
    monitoring_config_id,
    checked_at,
    status,
    latency_ms,
    packet_loss_percent,
    cpu_usage_percent,
    memory_usage_percent
)
SELECT
    d.id,
    mc.id,
    NOW() - INTERVAL '2 minutes',
    CASE
        WHEN d.name = 'AP-203'
            THEN 'WARNING'::monitoring_status
        ELSE 'ONLINE'::monitoring_status
    END,
    CASE
        WHEN d.name = 'AP-203'
            THEN 180.00
        ELSE 12.00
    END,
    CASE
        WHEN d.name = 'AP-203'
            THEN 15.00
        ELSE 0.00
    END,
    25.00,
    45.00
FROM devices d
JOIN monitoring_configs mc
    ON mc.device_id = d.id
WHERE mc.method = 'SIMULATION';


-- ============================================================
-- 9. INITIAL INCIDENT
-- ============================================================

INSERT INTO incidents (
    device_id,
    severity,
    title,
    description,
    status,
    started_at
)
VALUES (
    '40000000-0000-0000-0000-000000000203',
    'WARNING',
    'High packet loss detected',
    'AP-203 is experiencing simulated packet loss above the configured threshold.',
    'ACTIVE',
    NOW() - INTERVAL '2 minutes'
);
