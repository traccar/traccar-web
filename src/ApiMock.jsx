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
    category: 'truck',
    attributes: {
      color: '#F44336',
    },
  },
];

// Mock positions for devices - Simulating a route on Avenida Eixo 1
// Route: Down Eixo 1 → U-turn → Up Eixo 1 → Guarda Civil Municipal → Delegacia de Polícia → Bosque
const mockPositions = [
  // Start - Centro de Cidade Ocidental (initial position)
  {
    id: 1,
    deviceId: 1,
    protocol: 'traccar',
    deviceTime: new Date(Date.now() - 600000).toISOString(),
    fixTime: new Date(Date.now() - 600000).toISOString(),
    serverTime: new Date(Date.now() - 600000).toISOString(),
    latitude: -16.102852,
    longitude: -47.9481186,
    altitude: 0,
    speed: 35.0,
    course: 180,
    accuracy: 10,
    attributes: { ignition: true, motion: true },
  },
  // Descending Avenida Eixo 1 (going south)
  {
    id: 2,
    deviceId: 1,
    protocol: 'traccar',
    deviceTime: new Date(Date.now() - 480000).toISOString(),
    fixTime: new Date(Date.now() - 480000).toISOString(),
    serverTime: new Date(Date.now() - 480000).toISOString(),
    latitude: -16.105500,
    longitude: -47.9481186,
    altitude: 0,
    speed: 42.0,
    course: 180,
    accuracy: 10,
    attributes: { ignition: true, motion: true },
  },
  // Further down Eixo 1
  {
    id: 3,
    deviceId: 1,
    protocol: 'traccar',
    deviceTime: new Date(Date.now() - 360000).toISOString(),
    fixTime: new Date(Date.now() - 360000).toISOString(),
    serverTime: new Date(Date.now() - 360000).toISOString(),
    latitude: -16.109000,
    longitude: -47.9481186,
    altitude: 0,
    speed: 45.0,
    course: 180,
    accuracy: 10,
    attributes: { ignition: true, motion: true },
  },
  // U-turn point at the end of Eixo 1
  {
    id: 4,
    deviceId: 1,
    protocol: 'traccar',
    deviceTime: new Date(Date.now() - 300000).toISOString(),
    fixTime: new Date(Date.now() - 300000).toISOString(),
    serverTime: new Date(Date.now() - 300000).toISOString(),
    latitude: -16.110500,
    longitude: -47.9481186,
    altitude: 0,
    speed: 5.0,
    course: 0,
    accuracy: 10,
    attributes: { ignition: true, motion: true },
  },
  // Turning around (U-turn) - transitioning to northbound
  {
    id: 5,
    deviceId: 1,
    protocol: 'traccar',
    deviceTime: new Date(Date.now() - 240000).toISOString(),
    fixTime: new Date(Date.now() - 240000).toISOString(),
    serverTime: new Date(Date.now() - 240000).toISOString(),
    latitude: -16.110300,
    longitude: -47.9481186,
    altitude: 0,
    speed: 15.0,
    course: 0,
    accuracy: 10,
    attributes: { ignition: true, motion: true },
  },
  // Ascending Avenida Eixo 1 (going north)
  {
    id: 6,
    deviceId: 1,
    protocol: 'traccar',
    deviceTime: new Date(Date.now() - 180000).toISOString(),
    fixTime: new Date(Date.now() - 180000).toISOString(),
    serverTime: new Date(Date.now() - 180000).toISOString(),
    latitude: -16.107200,
    longitude: -47.9481186,
    altitude: 0,
    speed: 42.0,
    course: 0,
    accuracy: 10,
    attributes: { ignition: true, motion: true },
  },
  // Passing by Guarda Civil Municipal
  {
    id: 7,
    deviceId: 1,
    protocol: 'traccar',
    deviceTime: new Date(Date.now() - 120000).toISOString(),
    fixTime: new Date(Date.now() - 120000).toISOString(),
    serverTime: new Date(Date.now() - 120000).toISOString(),
    latitude: -16.104500,
    longitude: -47.9481186,
    altitude: 0,
    speed: 40.0,
    course: 0,
    accuracy: 10,
    attributes: { ignition: true, motion: true },
  },
  // Passing by Delegacia de Polícia (Police Station)
  {
    id: 8,
    deviceId: 1,
    protocol: 'traccar',
    deviceTime: new Date(Date.now() - 60000).toISOString(),
    fixTime: new Date(Date.now() - 60000).toISOString(),
    serverTime: new Date(Date.now() - 60000).toISOString(),
    latitude: -16.101800,
    longitude: -47.9481186,
    altitude: 0,
    speed: 38.0,
    course: 0,
    accuracy: 10,
    attributes: { ignition: true, motion: true },
  },
  // Arriving at Bosque (Forest Park) - Final destination
  {
    id: 9,
    deviceId: 1,
    protocol: 'traccar',
    deviceTime: new Date().toISOString(),
    fixTime: new Date().toISOString(),
    serverTime: new Date().toISOString(),
    latitude: -16.099800,
    longitude: -47.9481186,
    altitude: 0,
    speed: 0.0,
    course: 0,
    accuracy: 10,
    attributes: { ignition: false, motion: false },
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
      // Return all positions for route history display
      return Promise.resolve(
        new Response(JSON.stringify(mockPositions), {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        })
      );
    }
    
    // Position by ID endpoint (returns the current/last position)
    if (url.startsWith('/api/positions/') && url.includes('?')) {
      // Return the last position (current location)
      const lastPosition = mockPositions[mockPositions.length - 1];
      return Promise.resolve(
        new Response(JSON.stringify([lastPosition]), {
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
