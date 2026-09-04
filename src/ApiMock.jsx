import { useEffect } from 'react';

const API_URL = 'http://localhost:3000/api';

// Mock session data
const mockSession = {
  id: 1,
  name: 'Usuário Demo',
  login: 'demo@traccar.org',
  email: 'demo@traccar.org',
  administrator: true,
  attributes: {
    termsAccepted: true,
    theme: 'light',
  },
};

// Mock server data
const mockServer = {
  id: 1,
  newServer: false,
  attributes: {
    title: 'Rastreamento de Frotas',
    description: 'Sistema de Rastreamento GPS Traccar',
    colorPrimary: '#1976d2',
    colorAccent: '#ff9800',
    colorBackground: '#fafafa',
    termsUrl: '',
    latitude: -16.102852,  // Cidade Ocidental, GO (centro)
    longitude: -47.9481186,
    zoom: 13,
  },
};

// Mock devices with locations in Cidade Ocidental, GO
const mockDevices = [
  {
    id: 1,
    name: 'Bota fora',
    uniqueId: 'ABC1234',
    status: 'online',
    lastUpdate: new Date().toISOString(),
    positionId: 1,
    groupId: 0,
    attributes: {
      color: '#F44336',
    },
  },
];

// Mock positions for devices
const mockPositions = [
  {
    id: 1,
    deviceId: 1,
    protocol: 'traccar',
    deviceTime: new Date().toISOString(),
    fixTime: new Date().toISOString(),
    serverTime: new Date().toISOString(),
    latitude: -16.102852,
    longitude: -47.9481186,
    altitude: 0,
    speed: 45.2,
    course: 180,
    accuracy: 10,
    attributes: {
      ignition: true,
      motion: true,
    },
  },
];

// Mock geofences
const mockGeofences = [
  {
    id: 1,
    name: 'Centro da Cidade',
    description: 'Região central de Cidade Ocidental',
    area: 'POLYGON ((-47.9550 -16.1050, -47.9450 -16.1050, -47.9450 -16.1150, -47.9550 -16.1150, -47.9550 -16.1050))',
    calendarId: 0,
    attributes: {},
  },
];

// Mock groups
const mockGroups = [];

// Mock drivers
const mockDrivers = [];

// Mock maintenance
const mockMaintenance = [];

// Mock calendars
const mockCalendars = [];

// Intercept fetch calls
const originalFetch = window.fetch;

window.fetch = function(...args) {
  const [resource, config] = args;
  const url = typeof resource === 'string' ? resource : resource.url;

  console.log('🔵 Mock API Call:', url, config?.method || 'GET');

  // Handle all /api/* requests with appropriate responses
  if (url.startsWith('/api/')) {
    // Session endpoints
    if (url === '/api/session') {
      return Promise.resolve(
        new Response(JSON.stringify(mockSession), {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        })
      );
    }

    // User endpoints
    if (url.startsWith('/api/users/') && (config?.method === 'PUT' || config?.method === 'GET')) {
      return Promise.resolve(
        new Response(JSON.stringify(mockSession), {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        })
      );
    }

    if (url === '/api/users') {
      return Promise.resolve(
        new Response(JSON.stringify([mockSession]), {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        })
      );
    }

    // Server endpoints
    if (url === '/api/server') {
      return Promise.resolve(
        new Response(JSON.stringify(mockServer), {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        })
      );
    }

    // Device endpoints
    if (url === '/api/devices' || url.startsWith('/api/devices?')) {
      return Promise.resolve(
        new Response(JSON.stringify(mockDevices), {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        })
      );
    }

    if (url.startsWith('/api/devices/')) {
      return Promise.resolve(
        new Response(JSON.stringify({}), {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        })
      );
    }

    // Position endpoints
    if (url === '/api/positions' || url.startsWith('/api/positions?')) {
      return Promise.resolve(
        new Response(JSON.stringify(mockPositions), {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        })
      );
    }

    // Geofence endpoints
    if (url === '/api/geofences' || url.startsWith('/api/geofences?')) {
      return Promise.resolve(
        new Response(JSON.stringify(mockGeofences), {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        })
      );
    }

    if (url.startsWith('/api/geofences/')) {
      return Promise.resolve(
        new Response(JSON.stringify({}), {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        })
      );
    }

    // Group endpoints
    if (url === '/api/groups' || url.startsWith('/api/groups?')) {
      return Promise.resolve(
        new Response(JSON.stringify(mockGroups), {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        })
      );
    }

    if (url.startsWith('/api/groups/')) {
      return Promise.resolve(
        new Response(JSON.stringify({}), {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        })
      );
    }

    // Driver endpoints
    if (url === '/api/drivers' || url.startsWith('/api/drivers?')) {
      return Promise.resolve(
        new Response(JSON.stringify(mockDrivers), {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        })
      );
    }

    if (url.startsWith('/api/drivers/')) {
      return Promise.resolve(
        new Response(JSON.stringify({}), {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        })
      );
    }

    // Maintenance endpoints
    if (url === '/api/maintenance' || url.startsWith('/api/maintenance?')) {
      return Promise.resolve(
        new Response(JSON.stringify(mockMaintenance), {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        })
      );
    }

    if (url.startsWith('/api/maintenance/')) {
      return Promise.resolve(
        new Response(JSON.stringify({}), {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        })
      );
    }

    // Calendar endpoints
    if (url === '/api/calendars' || url.startsWith('/api/calendars?')) {
      return Promise.resolve(
        new Response(JSON.stringify(mockCalendars), {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        })
      );
    }

    if (url.startsWith('/api/calendars/')) {
      return Promise.resolve(
        new Response(JSON.stringify({}), {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        })
      );
    }

    // Generic catch-all for other /api/ endpoints
    console.warn('⚠️ Unmocked API endpoint:', url);
    return Promise.resolve(
      new Response(JSON.stringify({}), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      })
    );
  }

  return originalFetch.apply(this, args);
};

export default function ApiMockProvider({ children }) {
  return children;
}
