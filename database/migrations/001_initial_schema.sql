-- ============================================================
-- Network Monitoring System
-- Migration: 001_initial_schema
-- PostgreSQL / Supabase
-- ============================================================

-- ============================================================
-- 1. EXTENSIONS
-- ============================================================

CREATE EXTENSION IF NOT EXISTS pgcrypto;


-- ============================================================
-- 2. ENUM TYPES
-- ============================================================

CREATE TYPE area_type AS ENUM (
    'GUEST',
    'PUBLIC',
    'OFFICE',
    'INFRASTRUCTURE',
    'OTHER'
);

CREATE TYPE location_type AS ENUM (
    'BUILDING',
    'FLOOR',
    'ROOM',
    'PUBLIC_AREA',
    'OFFICE',
    'NETWORK_ROOM',
    'OTHER'
);

CREATE TYPE device_type AS ENUM (
    'ROUTER',
    'SWITCH',
    'ACCESS_POINT',
    'FIREWALL',
    'SERVER',
    'PRINTER',
    'OTHER'
);

CREATE TYPE device_status AS ENUM (
    'ONLINE',
    'WARNING',
    'OFFLINE',
    'UNKNOWN'
);

CREATE TYPE monitoring_method AS ENUM (
    'ICMP',
    'SNMP',
    'API',
    'SIMULATION'
);

CREATE TYPE monitoring_status AS ENUM (
    'ONLINE',
    'WARNING',
    'OFFLINE',
    'TIMEOUT',
    'UNKNOWN'
);

CREATE TYPE relationship_type AS ENUM (
    'CONNECTED_TO',
    'UPLINK_TO',
    'DOWNLINK_TO'
);

CREATE TYPE incident_severity AS ENUM (
    'INFO',
    'WARNING',
    'CRITICAL'
);

CREATE TYPE incident_status AS ENUM (
    'ACTIVE',
    'RESOLVED'
);


-- ============================================================
-- 3. PROPERTIES
-- ============================================================

CREATE TABLE properties (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    name VARCHAR(150) NOT NULL,
    description TEXT,

    address TEXT,

    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);


-- ============================================================
-- 4. AREAS
-- ============================================================

CREATE TABLE areas (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    property_id UUID NOT NULL
        REFERENCES properties(id)
        ON DELETE CASCADE,

    name VARCHAR(100) NOT NULL,
    type area_type NOT NULL DEFAULT 'OTHER',

    description TEXT,

    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    CONSTRAINT uq_area_property_name
        UNIQUE (property_id, name)
);


CREATE INDEX idx_areas_property_id
    ON areas(property_id);


-- ============================================================
-- 5. LOCATIONS
-- ============================================================

CREATE TABLE locations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    area_id UUID NOT NULL
        REFERENCES areas(id)
        ON DELETE CASCADE,

    parent_location_id UUID
        REFERENCES locations(id)
        ON DELETE CASCADE,

    name VARCHAR(150) NOT NULL,
    type location_type NOT NULL DEFAULT 'OTHER',

    floor_number INTEGER,

    description TEXT,

    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    CONSTRAINT uq_location_area_parent_name
        UNIQUE (area_id, parent_location_id, name)
);


CREATE INDEX idx_locations_area_id
    ON locations(area_id);

CREATE INDEX idx_locations_parent_location_id
    ON locations(parent_location_id);


-- ============================================================
-- 6. DEVICES
-- ============================================================

CREATE TABLE devices (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    location_id UUID
        REFERENCES locations(id)
        ON DELETE SET NULL,

    name VARCHAR(150) NOT NULL,
    hostname VARCHAR(150),

    device_type device_type NOT NULL,

    vendor VARCHAR(100),
    model VARCHAR(150),

    ip_address INET,
    mac_address MACADDR,

    status device_status NOT NULL DEFAULT 'UNKNOWN',

    description TEXT,

    enabled BOOLEAN NOT NULL DEFAULT TRUE,

    last_seen_at TIMESTAMPTZ,

    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    CONSTRAINT uq_device_name
        UNIQUE (name)
);


CREATE INDEX idx_devices_location_id
    ON devices(location_id);

CREATE INDEX idx_devices_status
    ON devices(status);

CREATE INDEX idx_devices_device_type
    ON devices(device_type);

CREATE INDEX idx_devices_ip_address
    ON devices(ip_address);


-- ============================================================
-- 7. DEVICE INTERFACES
-- ============================================================

CREATE TABLE interfaces (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    device_id UUID NOT NULL
        REFERENCES devices(id)
        ON DELETE CASCADE,

    name VARCHAR(100) NOT NULL,
    description TEXT,

    mac_address MACADDR,
    ip_address INET,

    speed_mbps INTEGER,

    is_up BOOLEAN,

    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    CONSTRAINT uq_interface_device_name
        UNIQUE (device_id, name)
);


CREATE INDEX idx_interfaces_device_id
    ON interfaces(device_id);


-- ============================================================
-- 8. MONITORING CONFIGURATIONS
-- ============================================================

CREATE TABLE monitoring_configs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    device_id UUID NOT NULL
        REFERENCES devices(id)
        ON DELETE CASCADE,

    method monitoring_method NOT NULL,

    enabled BOOLEAN NOT NULL DEFAULT TRUE,

    interval_seconds INTEGER NOT NULL DEFAULT 30,

    timeout_seconds INTEGER NOT NULL DEFAULT 5,

    retries INTEGER NOT NULL DEFAULT 1,

    configuration JSONB NOT NULL DEFAULT '{}'::JSONB,

    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    CONSTRAINT uq_monitoring_config_device_method
        UNIQUE (device_id, method),

    CONSTRAINT chk_monitoring_interval
        CHECK (interval_seconds > 0),

    CONSTRAINT chk_monitoring_timeout
        CHECK (timeout_seconds > 0),

    CONSTRAINT chk_monitoring_retries
        CHECK (retries >= 0)
);


CREATE INDEX idx_monitoring_configs_device_id
    ON monitoring_configs(device_id);

CREATE INDEX idx_monitoring_configs_enabled
    ON monitoring_configs(enabled);


-- ============================================================
-- 9. DEVICE RELATIONSHIPS / NETWORK TOPOLOGY
-- ============================================================

CREATE TABLE device_relationships (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    source_device_id UUID NOT NULL
        REFERENCES devices(id)
        ON DELETE CASCADE,

    target_device_id UUID NOT NULL
        REFERENCES devices(id)
        ON DELETE CASCADE,

    relationship_type relationship_type NOT NULL,

    description TEXT,

    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    CONSTRAINT chk_device_relationship_self
        CHECK (source_device_id <> target_device_id),

    CONSTRAINT uq_device_relationship
        UNIQUE (
            source_device_id,
            target_device_id,
            relationship_type
        )
);


CREATE INDEX idx_device_relationships_source
    ON device_relationships(source_device_id);

CREATE INDEX idx_device_relationships_target
    ON device_relationships(target_device_id);


-- ============================================================
-- 10. MONITORING RECORDS
-- ============================================================

CREATE TABLE monitoring_records (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    device_id UUID NOT NULL
        REFERENCES devices(id)
        ON DELETE CASCADE,

    monitoring_config_id UUID
        REFERENCES monitoring_configs(id)
        ON DELETE SET NULL,

    checked_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    status monitoring_status NOT NULL,

    latency_ms NUMERIC(10,2),

    packet_loss_percent NUMERIC(5,2),

    cpu_usage_percent NUMERIC(5,2),

    memory_usage_percent NUMERIC(5,2),

    uptime_seconds BIGINT,

    error_message TEXT,

    raw_data JSONB,

    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    CONSTRAINT chk_latency
        CHECK (
            latency_ms IS NULL
            OR latency_ms >= 0
        ),

    CONSTRAINT chk_packet_loss
        CHECK (
            packet_loss_percent IS NULL
            OR (
                packet_loss_percent >= 0
                AND packet_loss_percent <= 100
            )
        ),

    CONSTRAINT chk_cpu_usage
        CHECK (
            cpu_usage_percent IS NULL
            OR (
                cpu_usage_percent >= 0
                AND cpu_usage_percent <= 100
            )
        ),

    CONSTRAINT chk_memory_usage
        CHECK (
            memory_usage_percent IS NULL
            OR (
                memory_usage_percent >= 0
                AND memory_usage_percent <= 100
            )
        )
);


CREATE INDEX idx_monitoring_records_device_time
    ON monitoring_records(device_id, checked_at DESC);

CREATE INDEX idx_monitoring_records_status
    ON monitoring_records(status);

CREATE INDEX idx_monitoring_records_checked_at
    ON monitoring_records(checked_at DESC);


-- ============================================================
-- 11. INCIDENTS
-- ============================================================

CREATE TABLE incidents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    device_id UUID NOT NULL
        REFERENCES devices(id)
        ON DELETE CASCADE,

    severity incident_severity NOT NULL,

    title VARCHAR(200) NOT NULL,

    description TEXT,

    status incident_status NOT NULL DEFAULT 'ACTIVE',

    started_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    resolved_at TIMESTAMPTZ,

    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    CONSTRAINT chk_incident_resolution
        CHECK (
            (status = 'ACTIVE' AND resolved_at IS NULL)
            OR
            (status = 'RESOLVED' AND resolved_at IS NOT NULL)
        )
);


CREATE INDEX idx_incidents_device_id
    ON incidents(device_id);

CREATE INDEX idx_incidents_status
    ON incidents(status);

CREATE INDEX idx_incidents_severity
    ON incidents(severity);

CREATE INDEX idx_incidents_started_at
    ON incidents(started_at DESC);


-- ============================================================
-- 12. UPDATED_AT TRIGGER
-- ============================================================

CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;


CREATE TRIGGER trg_properties_updated_at
BEFORE UPDATE ON properties
FOR EACH ROW
EXECUTE FUNCTION update_updated_at();


CREATE TRIGGER trg_areas_updated_at
BEFORE UPDATE ON areas
FOR EACH ROW
EXECUTE FUNCTION update_updated_at();


CREATE TRIGGER trg_locations_updated_at
BEFORE UPDATE ON locations
FOR EACH ROW
EXECUTE FUNCTION update_updated_at();


CREATE TRIGGER trg_devices_updated_at
BEFORE UPDATE ON devices
FOR EACH ROW
EXECUTE FUNCTION update_updated_at();


CREATE TRIGGER trg_interfaces_updated_at
BEFORE UPDATE ON interfaces
FOR EACH ROW
EXECUTE FUNCTION update_updated_at();


CREATE TRIGGER trg_monitoring_configs_updated_at
BEFORE UPDATE ON monitoring_configs
FOR EACH ROW
EXECUTE FUNCTION update_updated_at();


CREATE TRIGGER trg_incidents_updated_at
BEFORE UPDATE ON incidents
FOR EACH ROW
EXECUTE FUNCTION update_updated_at();