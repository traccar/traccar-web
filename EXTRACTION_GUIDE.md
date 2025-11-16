# Traccar Web to Next.js TypeScript Migration Guide

**Target Stack:** Next.js 15 + TypeScript + Zustand + React Map GL
**Source:** Traccar Web (React + Redux + MapLibre GL)
**Backend:** Traccar Server (keeping existing)

---

## Table of Contents

1. [Project Overview](#project-overview)
2. [Architecture Analysis](#architecture-analysis)
3. [API Client Layer](#api-client-layer)
4. [Real-Time WebSocket Integration](#real-time-websocket-integration)
5. [State Management (Redux → Zustand)](#state-management-redux--zustand)
6. [Authentication Bridge](#authentication-bridge)
7. [TypeScript Data Models](#typescript-data-models)
8. [Map Integration (MapLibre → React Map GL)](#map-integration-maplibre--react-map-gl)
9. [Core Features Extraction](#core-features-extraction)
10. [Utility Functions](#utility-functions)
11. [Implementation Roadmap](#implementation-roadmap)

---

## Project Overview

### Traccar Web Structure

```
traccar-web/
├── src/
│   ├── common/          # ✅ EXTRACT: Utilities, formatters, converters
│   ├── login/           # ⚠️  ADAPT: Auth pages (you have own auth)
│   ├── main/            # ⚠️  REDESIGN: Device list, map layout (boring UI)
│   ├── map/             # ✅ EXTRACT: Map components, geometry utils
│   ├── other/           # ✅ EXTRACT: Geofence editor, replay player
│   ├── reports/         # ✅ EXTRACT: Trip/route reports
│   ├── settings/        # ⚠️  REDESIGN: CRUD pages (too technical)
│   ├── store/           # 🔄 TRANSLATE: Redux → Zustand
│   └── resources/       # ✅ EXTRACT: Icons, images
```

### What to Extract

| Component | Priority | Action |
|-----------|----------|--------|
| API Client (fetch patterns) | 🔴 Critical | Create TypeScript wrapper |
| WebSocket connection | 🔴 Critical | Custom hook for Zustand |
| Device/Position data models | 🔴 Critical | Define TypeScript types |
| Unit converters | 🔴 Critical | Copy & type |
| Formatters (date, distance, speed) | 🔴 Critical | Copy & type |
| Geofence WKT↔GeoJSON conversion | 🟡 High | Copy & adapt |
| Icon generation system | 🟡 High | Port to Next.js static/runtime |
| Map layer rendering logic | 🟡 High | Adapt for React Map GL |
| Trip/Route report fetching | 🟡 High | API client methods |
| Redux state patterns | 🟡 High | Translate to Zustand |
| Public share token flow | 🟢 Medium | API + auth integration |
| Replay player logic | 🟢 Medium | React component |
| Color utilities (speed gradient) | 🟢 Medium | Copy |
| UI components (Material-UI) | ⚫ Skip | Redesign with your UI |

---

## Architecture Analysis

### Current Stack (Traccar Web)
- **Framework:** React 18.3 (Create React App)
- **State:** Redux Toolkit
- **Map:** MapLibre GL JS 4.7.1 (also supports Mapbox, Google Maps)
- **UI:** Material-UI v5
- **Routing:** React Router 6
- **API:** Native `fetch()` (no axios)
- **i18n:** i18next

### Your Target Stack
- **Framework:** Next.js 15 (App Router)
- **State:** Zustand + React Context
- **Map:** React Map GL
- **UI:** Your custom UI system
- **Routing:** Next.js App Router
- **API:** Typed fetch wrapper (or tRPC/React Query)
- **i18n:** Next.js built-in

### Key Differences to Handle

| Aspect | Traccar Web | Your App | Migration Strategy |
|--------|-------------|----------|-------------------|
| State | Redux Toolkit | Zustand | 1:1 store mapping |
| Map | MapLibre GL | React Map GL | Layer/Source patterns translate directly |
| Auth | Traccar session only | Your auth + Traccar | Dual auth bridge |
| Routing | Client-side SPA | Server + Client | API routes for Traccar proxy |
| API Calls | Component-level fetch | Centralized client | Create typed API class |

---

## API Client Layer

### Current Implementation (Traccar Web)

**No dedicated API client** - scattered fetch calls throughout components.

**Example pattern:**
```javascript
// settings/DevicePage.jsx
const handleSave = async () => {
  const response = await fetch('/api/devices', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(item),
  });
  if (response.ok) {
    // success
  }
};
```

### Recommended Next.js Implementation

**File:** `lib/traccar/api.ts`

```typescript
// Base client with error handling
class TraccarAPIClient {
  private baseUrl: string;

  constructor(baseUrl = '/api/traccar') {
    this.baseUrl = baseUrl;
  }

  private async request<T>(
    endpoint: string,
    options?: RequestInit
  ): Promise<T> {
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      ...options,
      credentials: 'include', // Important for session cookies
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(error || `HTTP ${response.status}`);
    }

    if (response.status === 204) return null as T;
    return response.json();
  }

  // Authentication
  async login(email: string, password: string): Promise<User> {
    const response = await fetch(`${this.baseUrl}/session`, {
      method: 'POST',
      credentials: 'include',
      body: new URLSearchParams({ email, password }),
    });
    if (!response.ok) throw new Error('Login failed');
    return response.json();
  }

  async logout(): Promise<void> {
    await fetch(`${this.baseUrl}/session`, {
      method: 'DELETE',
      credentials: 'include',
    });
  }

  async getSession(): Promise<User | null> {
    try {
      return await this.request<User>('/session');
    } catch {
      return null;
    }
  }

  async loginWithToken(token: string): Promise<User> {
    return this.request<User>(`/session?token=${token}`);
  }

  // Devices
  async getDevices(): Promise<Device[]> {
    return this.request<Device[]>('/devices');
  }

  async getDevice(id: number): Promise<Device> {
    return this.request<Device>(`/devices/${id}`);
  }

  async createDevice(device: Partial<Device>): Promise<Device> {
    return this.request<Device>('/devices', {
      method: 'POST',
      body: JSON.stringify(device),
    });
  }

  async updateDevice(id: number, device: Partial<Device>): Promise<Device> {
    return this.request<Device>(`/devices/${id}`, {
      method: 'PUT',
      body: JSON.stringify(device),
    });
  }

  async deleteDevice(id: number): Promise<void> {
    return this.request<void>(`/devices/${id}`, { method: 'DELETE' });
  }

  async shareDevice(deviceId: number, expirationTime: string): Promise<string> {
    const response = await fetch(`${this.baseUrl}/devices/share`, {
      method: 'POST',
      credentials: 'include',
      body: new URLSearchParams({ deviceId: String(deviceId), expiration: expirationTime }),
    });
    return response.text(); // Returns token string
  }

  // Positions
  async getPositions(params?: {
    deviceId?: number;
    from?: string;
    to?: string;
  }): Promise<Position[]> {
    const query = new URLSearchParams();
    if (params?.deviceId) query.set('deviceId', String(params.deviceId));
    if (params?.from) query.set('from', params.from);
    if (params?.to) query.set('to', params.to);

    const queryString = query.toString();
    return this.request<Position[]>(`/positions${queryString ? `?${queryString}` : ''}`);
  }

  // Geofences
  async getGeofences(): Promise<Geofence[]> {
    return this.request<Geofence[]>('/geofences');
  }

  async createGeofence(geofence: Partial<Geofence>): Promise<Geofence> {
    return this.request<Geofence>('/geofences', {
      method: 'POST',
      body: JSON.stringify(geofence),
    });
  }

  async updateGeofence(id: number, geofence: Partial<Geofence>): Promise<Geofence> {
    return this.request<Geofence>(`/geofences/${id}`, {
      method: 'PUT',
      body: JSON.stringify(geofence),
    });
  }

  async deleteGeofence(id: number): Promise<void> {
    return this.request<void>(`/geofences/${id}`, { method: 'DELETE' });
  }

  // Reports
  async getTripReport(params: {
    deviceId: number;
    from: string;
    to: string;
  }): Promise<Trip[]> {
    const query = new URLSearchParams({
      deviceId: String(params.deviceId),
      from: params.from,
      to: params.to,
    });
    return this.request<Trip[]>(`/reports/trips?${query}`);
  }

  async getRouteReport(params: {
    deviceId: number | number[];
    from: string;
    to: string;
  }): Promise<Position[]> {
    const query = new URLSearchParams({
      from: params.from,
      to: params.to,
    });

    const deviceIds = Array.isArray(params.deviceId)
      ? params.deviceId
      : [params.deviceId];

    deviceIds.forEach(id => query.append('deviceId', String(id)));

    return this.request<Position[]>(`/reports/route?${query}`);
  }

  // Groups
  async getGroups(): Promise<Group[]> {
    return this.request<Group[]>('/groups');
  }

  // Events
  async getEvents(params?: {
    deviceId?: number;
    from?: string;
    to?: string;
    type?: string;
  }): Promise<Event[]> {
    const query = new URLSearchParams();
    if (params?.deviceId) query.set('deviceId', String(params.deviceId));
    if (params?.from) query.set('from', params.from);
    if (params?.to) query.set('to', params.to);
    if (params?.type) query.set('type', params.type);

    const queryString = query.toString();
    return this.request<Event[]>(`/events${queryString ? `?${queryString}` : ''}`);
  }
}

// Singleton instance
export const traccarAPI = new TraccarAPIClient();
```

### Next.js API Proxy (Optional but Recommended)

If Traccar server is on different domain, create proxy routes:

**File:** `app/api/traccar/[...path]/route.ts`

```typescript
import { NextRequest, NextResponse } from 'next/server';

const TRACCAR_SERVER = process.env.TRACCAR_SERVER_URL || 'http://localhost:8082';

export async function GET(
  request: NextRequest,
  { params }: { params: { path: string[] } }
) {
  return proxyToTraccar(request, params.path);
}

export async function POST(
  request: NextRequest,
  { params }: { params: { path: string[] } }
) {
  return proxyToTraccar(request, params.path);
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { path: string[] } }
) {
  return proxyToTraccar(request, params.path);
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { path: string[] } }
) {
  return proxyToTraccar(request, params.path);
}

async function proxyToTraccar(request: NextRequest, path: string[]) {
  const url = new URL(request.url);
  const targetUrl = `${TRACCAR_SERVER}/api/${path.join('/')}${url.search}`;

  // Forward cookies (for Traccar session)
  const cookies = request.headers.get('cookie');

  const response = await fetch(targetUrl, {
    method: request.method,
    headers: {
      'Content-Type': request.headers.get('content-type') || 'application/json',
      ...(cookies && { Cookie: cookies }),
    },
    body: request.method !== 'GET' ? await request.text() : undefined,
  });

  // Forward set-cookie headers back to client
  const responseHeaders = new Headers();
  response.headers.forEach((value, key) => {
    responseHeaders.set(key, value);
  });

  return new NextResponse(response.body, {
    status: response.status,
    headers: responseHeaders,
  });
}
```

---

## Real-Time WebSocket Integration

### Current Implementation (Traccar Web)

**File:** `SocketController.jsx:1-69`

```javascript
const SocketController = () => {
  const dispatch = useDispatch();
  const authenticated = useSelector((state) => !!state.session.user);

  const connectSocket = () => {
    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const socket = new WebSocket(`${protocol}//${window.location.host}/api/socket`);

    socket.onopen = () => {
      dispatch(sessionActions.updateSocket(true));
    };

    socket.onclose = () => {
      dispatch(sessionActions.updateSocket(false));
      setTimeout(() => connectSocket(), 60000); // Reconnect after 1 minute
    };

    socket.onmessage = (event) => {
      const data = JSON.parse(event.data);

      if (data.devices) {
        dispatch(devicesActions.update(data.devices));
      }
      if (data.positions) {
        dispatch(sessionActions.updatePositions(data.positions));
      }
      if (data.events) {
        dispatch(eventsActions.add(data.events));
      }
    };

    return socket;
  };

  useEffect(() => {
    if (authenticated) {
      const socket = connectSocket();
      return () => socket.close();
    }
  }, [authenticated]);

  return null;
};
```

### Recommended Next.js Implementation

**File:** `hooks/useTraccarWebSocket.ts`

```typescript
import { useEffect, useRef } from 'react';
import { useTraccarStore } from '@/store/traccar';

interface WebSocketMessage {
  devices?: Device[];
  positions?: Position[];
  events?: Event[];
  logs?: any[];
}

export const useTraccarWebSocket = (enabled: boolean = true) => {
  const socketRef = useRef<WebSocket | null>(null);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout>();

  const updateDevices = useTraccarStore(state => state.updateDevices);
  const updatePositions = useTraccarStore(state => state.updatePositions);
  const addEvents = useTraccarStore(state => state.addEvents);
  const setSocketConnected = useTraccarStore(state => state.setSocketConnected);

  useEffect(() => {
    if (!enabled) return;

    const connectSocket = () => {
      // Determine WebSocket URL
      const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
      const wsUrl = `${protocol}//${window.location.host}/api/traccar/socket`;

      const socket = new WebSocket(wsUrl);
      socketRef.current = socket;

      socket.onopen = () => {
        console.log('[TraccarWS] Connected');
        setSocketConnected(true);

        // Optional: Request logs (for debugging)
        // socket.send(JSON.stringify({ logs: true }));
      };

      socket.onclose = (event) => {
        console.log('[TraccarWS] Disconnected', event.code, event.reason);
        setSocketConnected(false);

        // Attempt reconnection after delay
        reconnectTimeoutRef.current = setTimeout(() => {
          console.log('[TraccarWS] Reconnecting...');
          connectSocket();
        }, 60000); // 1 minute
      };

      socket.onerror = (error) => {
        console.error('[TraccarWS] Error:', error);
      };

      socket.onmessage = (event) => {
        try {
          const data: WebSocketMessage = JSON.parse(event.data);

          if (data.devices) {
            updateDevices(data.devices);
          }

          if (data.positions) {
            updatePositions(data.positions);
          }

          if (data.events) {
            addEvents(data.events);
          }

          // Handle logs if enabled
          if (data.logs) {
            console.log('[TraccarWS] Server logs:', data.logs);
          }
        } catch (error) {
          console.error('[TraccarWS] Failed to parse message:', error);
        }
      };

      return socket;
    };

    const socket = connectSocket();

    // Cleanup
    return () => {
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }
      if (socket) {
        socket.close();
      }
    };
  }, [enabled, updateDevices, updatePositions, addEvents, setSocketConnected]);

  return {
    socket: socketRef.current,
    isConnected: useTraccarStore(state => state.socketConnected),
  };
};
```

**Usage in layout/page:**

```typescript
// app/tracking/layout.tsx
'use client';

import { useTraccarWebSocket } from '@/hooks/useTraccarWebSocket';

export default function TrackingLayout({ children }) {
  const { isConnected } = useTraccarWebSocket(true);

  return (
    <div>
      {/* Connection indicator */}
      <div className={isConnected ? 'bg-green-500' : 'bg-red-500'}>
        {isConnected ? 'Live' : 'Disconnected'}
      </div>

      {children}
    </div>
  );
}
```

---

## State Management (Redux → Zustand)

### Current Redux Structure (Traccar Web)

**File:** `store/index.js:1-41`

```javascript
// Redux Toolkit store with slices:
{
  errors: string[],
  session: {
    server: Server,
    user: User | null,
    socket: boolean,
    positions: { [deviceId: number]: Position },
    history: { [deviceId: number]: [number, number][] },
  },
  devices: {
    items: { [id: number]: Device },
    selectedId: number | null,
    selectedIds: number[],
  },
  geofences: {
    items: { [id: number]: Geofence },
  },
  events: {
    items: Event[], // Max 50, newest first
  },
  // ... groups, drivers, calendars, etc.
}
```

### Recommended Zustand Implementation

**File:** `store/traccar.ts`

```typescript
import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';

interface TraccarState {
  // Connection
  socketConnected: boolean;
  setSocketConnected: (connected: boolean) => void;

  // Devices
  devices: Record<number, Device>;
  selectedDeviceId: number | null;
  selectedDeviceIds: number[];
  setDevices: (devices: Device[]) => void;
  updateDevices: (devices: Device[]) => void;
  updateDevice: (device: Device) => void;
  removeDevice: (id: number) => void;
  selectDevice: (id: number | null) => void;
  selectDevices: (ids: number[]) => void;

  // Positions
  positions: Record<number, Position>; // keyed by deviceId
  liveRouteHistory: Record<number, [number, number][]>; // last N coords per device
  updatePositions: (positions: Position[]) => void;
  clearPositions: () => void;

  // Geofences
  geofences: Record<number, Geofence>;
  setGeofences: (geofences: Geofence[]) => void;
  updateGeofence: (geofence: Geofence) => void;
  removeGeofence: (id: number) => void;

  // Events
  events: Event[]; // Max 50, newest first
  addEvents: (events: Event[]) => void;
  clearEvents: () => void;

  // Groups
  groups: Record<number, Group>;
  setGroups: (groups: Group[]) => void;

  // Errors
  errors: string[];
  addError: (error: string) => void;
  clearErrors: () => void;
}

export const useTraccarStore = create<TraccarState>()(
  devtools(
    immer((set) => ({
      // Initial state
      socketConnected: false,
      devices: {},
      selectedDeviceId: null,
      selectedDeviceIds: [],
      positions: {},
      liveRouteHistory: {},
      geofences: {},
      events: [],
      groups: {},
      errors: [],

      // Actions
      setSocketConnected: (connected) => set({ socketConnected: connected }),

      // Devices
      setDevices: (devices) => set((state) => {
        state.devices = {};
        devices.forEach(device => {
          state.devices[device.id] = device;
        });
      }),

      updateDevices: (devices) => set((state) => {
        devices.forEach(device => {
          state.devices[device.id] = device;
        });
      }),

      updateDevice: (device) => set((state) => {
        state.devices[device.id] = device;
      }),

      removeDevice: (id) => set((state) => {
        delete state.devices[id];
        if (state.selectedDeviceId === id) {
          state.selectedDeviceId = null;
        }
        state.selectedDeviceIds = state.selectedDeviceIds.filter(x => x !== id);
      }),

      selectDevice: (id) => set({
        selectedDeviceId: id,
        selectedDeviceIds: id !== null ? [id] : [],
      }),

      selectDevices: (ids) => set({
        selectedDeviceIds: ids,
        selectedDeviceId: ids.length === 1 ? ids[0] : null,
      }),

      // Positions
      updatePositions: (positions) => set((state) => {
        const liveRoutesLimit = 10; // Configurable

        positions.forEach(position => {
          // Update current position
          state.positions[position.deviceId] = position;

          // Update live route history
          const route = state.liveRouteHistory[position.deviceId] || [];
          const last = route[route.length - 1];
          const coord: [number, number] = [position.longitude, position.latitude];

          // Only add if different from last position
          if (!last || (last[0] !== coord[0] || last[1] !== coord[1])) {
            const newRoute = [...route, coord];
            // Keep only last N positions
            state.liveRouteHistory[position.deviceId] = newRoute.slice(-liveRoutesLimit);
          }
        });
      }),

      clearPositions: () => set({
        positions: {},
        liveRouteHistory: {},
      }),

      // Geofences
      setGeofences: (geofences) => set((state) => {
        state.geofences = {};
        geofences.forEach(geofence => {
          state.geofences[geofence.id] = geofence;
        });
      }),

      updateGeofence: (geofence) => set((state) => {
        state.geofences[geofence.id] = geofence;
      }),

      removeGeofence: (id) => set((state) => {
        delete state.geofences[id];
      }),

      // Events
      addEvents: (events) => set((state) => {
        // Prepend new events, keep max 50, newest first
        state.events = [...events, ...state.events].slice(0, 50);
      }),

      clearEvents: () => set({ events: [] }),

      // Groups
      setGroups: (groups) => set((state) => {
        state.groups = {};
        groups.forEach(group => {
          state.groups[group.id] = group;
        });
      }),

      // Errors
      addError: (error) => set((state) => {
        state.errors.push(error);
      }),

      clearErrors: () => set({ errors: [] }),
    }))
  )
);
```

**Selectors (for derived state):**

```typescript
// store/traccar-selectors.ts
import { useTraccarStore } from './traccar';

// Get all devices as array
export const useDevices = () =>
  useTraccarStore(state => Object.values(state.devices));

// Get selected device
export const useSelectedDevice = () =>
  useTraccarStore(state =>
    state.selectedDeviceId ? state.devices[state.selectedDeviceId] : null
  );

// Get device position with device info
export const useDevicePosition = (deviceId: number) =>
  useTraccarStore(state => ({
    device: state.devices[deviceId],
    position: state.positions[deviceId],
  }));

// Get all positions with devices
export const useDevicePositions = () =>
  useTraccarStore(state =>
    Object.values(state.positions).map(position => ({
      position,
      device: state.devices[position.deviceId],
    }))
  );

// Get online devices count
export const useOnlineDevicesCount = () =>
  useTraccarStore(state =>
    Object.values(state.devices).filter(d => d.status === 'online').length
  );

// Get geofences as GeoJSON FeatureCollection
export const useGeofencesGeoJSON = () =>
  useTraccarStore(state => ({
    type: 'FeatureCollection' as const,
    features: Object.values(state.geofences).map(geofenceToFeature),
  }));
```

---

## Authentication Bridge

### Challenge: Dual Authentication System

You have:
1. **Your own auth** (Next.js, NextAuth, etc.)
2. **Traccar auth** (session-based, required for backend API)

### Recommended Approach: Server-Side Session Bridging

**Flow:**
1. User logs into YOUR app
2. Server-side: Use stored Traccar credentials to obtain Traccar session
3. Proxy Traccar API calls with session cookie

**File:** `lib/traccar/auth.ts`

```typescript
import { cookies } from 'next/headers';
import { traccarAPI } from './api';

// Server-side function to establish Traccar session
export async function establishTraccarSession(
  traccarEmail: string,
  traccarPassword: string
): Promise<User | null> {
  try {
    // Login to Traccar
    const response = await fetch(`${process.env.TRACCAR_SERVER_URL}/api/session`, {
      method: 'POST',
      body: new URLSearchParams({
        email: traccarEmail,
        password: traccarPassword,
      }),
    });

    if (!response.ok) return null;

    // Extract session cookie
    const setCookie = response.headers.get('set-cookie');
    if (setCookie) {
      // Store Traccar session in Next.js cookie
      cookies().set('traccar-session', setCookie, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
      });
    }

    return response.json();
  } catch (error) {
    console.error('Failed to establish Traccar session:', error);
    return null;
  }
}

// Middleware to check/refresh Traccar session
export async function ensureTraccarSession(userId: string): Promise<boolean> {
  // 1. Check if Traccar session cookie exists
  const traccarCookie = cookies().get('traccar-session');

  if (traccarCookie) {
    // Validate session
    const response = await fetch(`${process.env.TRACCAR_SERVER_URL}/api/session`, {
      headers: { Cookie: traccarCookie.value },
    });

    if (response.ok) return true;
  }

  // 2. Session invalid/expired - re-establish
  // Get Traccar credentials from your database
  const userCredentials = await getUserTraccarCredentials(userId);

  if (!userCredentials) return false;

  const user = await establishTraccarSession(
    userCredentials.traccarEmail,
    userCredentials.traccarPassword
  );

  return !!user;
}

// Helper to get user's Traccar credentials (implement based on your DB)
async function getUserTraccarCredentials(userId: string) {
  // Example: Query your database
  // return prisma.user.findUnique({
  //   where: { id: userId },
  //   select: { traccarEmail: true, traccarPassword: true }
  // });
  return null;
}
```

**File:** `middleware.ts` (Next.js middleware)

```typescript
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  // Check if user is authenticated in YOUR system
  const session = await getYourAuthSession(request);

  if (!session) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // For Traccar API routes, ensure Traccar session
  if (request.nextUrl.pathname.startsWith('/api/traccar')) {
    const hasTraccarSession = await ensureTraccarSession(session.userId);

    if (!hasTraccarSession) {
      return NextResponse.json(
        { error: 'Traccar session unavailable' },
        { status: 401 }
      );
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/tracking/:path*', '/api/traccar/:path*'],
};
```

### Alternative: Client-Side Token Storage

If users provide their own Traccar credentials:

```typescript
// hooks/useTraccarAuth.ts
export const useTraccarAuth = () => {
  const [traccarUser, setTraccarUser] = useState<User | null>(null);

  const login = async (email: string, password: string) => {
    const user = await traccarAPI.login(email, password);
    setTraccarUser(user);
  };

  const logout = async () => {
    await traccarAPI.logout();
    setTraccarUser(null);
  };

  useEffect(() => {
    // Check session on mount
    traccarAPI.getSession().then(setTraccarUser);
  }, []);

  return { traccarUser, login, logout };
};
```

---

## TypeScript Data Models

### Core Types

**File:** `types/traccar.ts`

```typescript
// ============================================================================
// ENTITIES
// ============================================================================

export interface Device {
  id: number;
  name: string;
  uniqueId: string;
  status: 'online' | 'offline' | 'unknown';
  disabled: boolean;
  lastUpdate: string; // ISO 8601 timestamp
  positionId: number;
  groupId?: number;
  phone?: string;
  model?: string;
  contact?: string;
  category?: DeviceCategory;
  geofenceIds?: number[];
  attributes: DeviceAttributes;
}

export type DeviceCategory =
  | 'default'
  | 'car'
  | 'truck'
  | 'bus'
  | 'motorcycle'
  | 'bicycle'
  | 'person'
  | 'boat'
  | 'ship'
  | 'plane'
  | 'helicopter'
  | 'animal'
  | 'crane'
  | 'tractor'
  | 'trolleybus'
  | 'tram'
  | 'train'
  | 'scooter'
  | 'offroad'
  | 'camper'
  | 'pickup';

export interface DeviceAttributes {
  deviceImage?: string;
  'web.reportColor'?: string;
  color?: string;
  speedLimit?: number;
  [key: string]: any;
}

export interface Position {
  id: number;
  deviceId: number;
  protocol: string;
  deviceTime: string; // ISO 8601
  fixTime: string; // ISO 8601
  serverTime: string; // ISO 8601
  outdated: boolean;
  valid: boolean;
  latitude: number;
  longitude: number;
  altitude: number; // meters
  speed: number; // knots
  course: number; // degrees (0-360)
  address?: string;
  accuracy: number;
  network?: any;
  attributes: PositionAttributes;
}

export interface PositionAttributes {
  // Core
  odometer?: number; // meters
  totalDistance?: number; // meters
  motion?: boolean;
  ignition?: boolean;
  hours?: number;

  // Power
  power?: number; // voltage
  battery?: number; // voltage
  batteryLevel?: number; // 0-100
  charge?: boolean;

  // Vehicle
  fuel?: number; // liters
  fuelConsumption?: number;
  rpm?: number;
  throttle?: number;
  coolantTemp?: number;
  engineTemp?: number;

  // GPS
  sat?: number; // satellite count
  satVisible?: number;
  rssi?: number;
  hdop?: number;

  // I/O
  input?: number;
  output?: number;
  in1?: boolean;
  in2?: boolean;
  in3?: boolean;
  in4?: boolean;
  out1?: boolean;
  out2?: boolean;

  // Alarms
  alarm?: AlarmType;
  event?: string;

  // Driver
  driverUniqueId?: string;

  // Custom
  color?: string;
  [key: string]: any;
}

export type AlarmType =
  | 'general'
  | 'sos'
  | 'vibration'
  | 'movement'
  | 'lowspeed'
  | 'overspeed'
  | 'fallDown'
  | 'lowPower'
  | 'lowBattery'
  | 'fault'
  | 'powerOff'
  | 'powerOn'
  | 'door'
  | 'lock'
  | 'unlock'
  | 'geofence'
  | 'geofenceEnter'
  | 'geofenceExit'
  | 'gpsAntennaCut'
  | 'accident'
  | 'tow'
  | 'idle'
  | 'highRpm'
  | 'hardAcceleration'
  | 'hardBraking'
  | 'hardCornering'
  | 'laneChange'
  | 'fatigueDriving'
  | 'powerCut'
  | 'powerRestored'
  | 'jamming'
  | 'temperature'
  | 'parking'
  | 'bonnet'
  | 'footBrake'
  | 'fuelLeak'
  | 'tampering'
  | 'removing';

export interface Geofence {
  id: number;
  name: string;
  description?: string;
  area: string; // WKT format: "POLYGON((...))" or "CIRCLE(lat lon radius)"
  calendarId?: number;
  attributes: GeofenceAttributes;
}

export interface GeofenceAttributes {
  color?: string;
  hide?: boolean;
  mapLineWidth?: number;
  mapLineOpacity?: number;
  speedLimit?: number;
  [key: string]: any;
}

export interface Event {
  id: number;
  type: EventType;
  eventTime: string; // ISO 8601
  deviceId: number;
  positionId: number;
  geofenceId?: number;
  maintenanceId?: number;
  attributes: {
    alarm?: AlarmType;
    message?: string;
    [key: string]: any;
  };
}

export type EventType =
  | 'deviceOnline'
  | 'deviceUnknown'
  | 'deviceOffline'
  | 'deviceInactive'
  | 'deviceMoving'
  | 'deviceStopped'
  | 'deviceOverspeed'
  | 'deviceFuelDrop'
  | 'commandResult'
  | 'geofenceEnter'
  | 'geofenceExit'
  | 'alarm'
  | 'ignitionOn'
  | 'ignitionOff'
  | 'maintenance'
  | 'textMessage'
  | 'driverChanged'
  | 'media';

export interface Group {
  id: number;
  name: string;
  groupId?: number; // Parent group
  attributes: Record<string, any>;
}

export interface User {
  id: number;
  name: string;
  email: string;
  phone?: string;
  readonly: boolean;
  administrator: boolean;
  disabled: boolean;
  deviceReadonly: boolean;
  limitCommands: boolean;
  poiLayer?: string;
  attributes: UserAttributes;
}

export interface UserAttributes {
  coordinateFormat?: 'dd' | 'ddm' | 'dms';
  speedUnit?: 'kn' | 'kmh' | 'mph';
  distanceUnit?: 'km' | 'mi' | 'nmi';
  volumeUnit?: 'ltr' | 'usGal' | 'impGal';
  timezone?: string;
  'web.liveRouteLength'?: number;
  [key: string]: any;
}

export interface Server {
  id: number;
  registration: boolean;
  readonly: boolean;
  deviceReadonly: boolean;
  limitCommands: boolean;
  map?: string;
  bingKey?: string;
  mapUrl?: string;
  latitude: number;
  longitude: number;
  zoom: number;
  twelveHourFormat: boolean;
  version?: string;
  attributes: ServerAttributes;
}

export interface ServerAttributes {
  [key: string]: any;
}

// ============================================================================
// REPORTS
// ============================================================================

export interface Trip {
  deviceId: number;
  deviceName: string;
  maxSpeed: number; // knots
  averageSpeed: number; // knots
  distance: number; // meters
  duration: number; // milliseconds
  startOdometer?: number;
  endOdometer?: number;
  startTime: string; // ISO 8601
  endTime: string; // ISO 8601
  startPositionId: number;
  endPositionId: number;
  startLat: number;
  startLon: number;
  endLat: number;
  endLon: number;
  startAddress?: string;
  endAddress?: string;
  driverUniqueId?: string;
  driverName?: string;
}

// ============================================================================
// GEOMETRY (GeoJSON interop)
// ============================================================================

export interface GeofenceFeature {
  type: 'Feature';
  geometry: GeoJSON.Polygon | GeoJSON.LineString | GeoJSON.Point;
  properties: {
    id: number;
    name: string;
    color?: string;
    hide?: boolean;
  };
}

// ============================================================================
// API QUERY PARAMS
// ============================================================================

export interface PositionQuery {
  deviceId?: number;
  from?: string; // ISO 8601
  to?: string; // ISO 8601
}

export interface ReportQuery {
  deviceId: number | number[];
  from: string; // ISO 8601
  to: string; // ISO 8601
}
```

---

## Map Integration (MapLibre → React Map GL)

### Current Implementation (MapLibre GL)

**File:** `map/core/MapView.jsx:1-152`

Uses MapLibre GL JS directly:
```javascript
import maplibregl from 'maplibre-gl';

const map = new maplibregl.Map({
  container: element,
  style: mapStyles[0],
});
```

### Recommended React Map GL Implementation

**File:** `components/map/TraccarMap.tsx`

```typescript
'use client';

import { useRef } from 'react';
import Map, { MapRef, NavigationControl, ScaleControl } from 'react-map-gl';
import type { ViewState } from 'react-map-gl';
import 'maplibre-gl/dist/maplibre-gl.css';

import { DeviceMarkers } from './DeviceMarkers';
import { GeofenceLayer } from './GeofenceLayer';
import { LiveRouteLayer } from './LiveRouteLayer';

interface TraccarMapProps {
  initialViewState?: Partial<ViewState>;
  showGeofences?: boolean;
  showLiveRoutes?: boolean;
}

export default function TraccarMap({
  initialViewState = {
    longitude: -98.5795,
    latitude: 39.8283,
    zoom: 4,
  },
  showGeofences = true,
  showLiveRoutes = true,
}: TraccarMapProps) {
  const mapRef = useRef<MapRef>(null);

  return (
    <div className="relative w-full h-full">
      <Map
        ref={mapRef}
        mapLib={import('maplibre-gl')}
        initialViewState={initialViewState}
        mapStyle="https://api.maptiler.com/maps/streets-v2/style.json?key=YOUR_KEY"
        reuseMaps
      >
        {/* Controls */}
        <NavigationControl position="top-left" />
        <ScaleControl position="bottom-left" />

        {/* Geofences */}
        {showGeofences && <GeofenceLayer />}

        {/* Live routes (breadcrumb trails) */}
        {showLiveRoutes && <LiveRouteLayer />}

        {/* Device markers */}
        <DeviceMarkers />
      </Map>
    </div>
  );
}
```

### Device Markers Component

**File:** `components/map/DeviceMarkers.tsx`

```typescript
'use client';

import { Marker } from 'react-map-gl';
import { useDevicePositions } from '@/store/traccar-selectors';
import { DeviceIcon } from './DeviceIcon';

export function DeviceMarkers() {
  const devicePositions = useDevicePositions();

  return (
    <>
      {devicePositions.map(({ device, position }) => {
        if (!position || !device) return null;

        return (
          <Marker
            key={device.id}
            longitude={position.longitude}
            latitude={position.latitude}
            anchor="center"
            rotation={position.course}
          >
            <DeviceIcon
              category={device.category || 'default'}
              status={device.status}
              showDirection={position.speed > 0}
            />
          </Marker>
        );
      })}
    </>
  );
}
```

### Device Icon Component

**File:** `components/map/DeviceIcon.tsx`

```typescript
'use client';

import Image from 'next/image';
import { DeviceCategory } from '@/types/traccar';

interface DeviceIconProps {
  category: DeviceCategory;
  status: 'online' | 'offline' | 'unknown';
  showDirection?: boolean;
}

export function DeviceIcon({ category, status, showDirection }: DeviceIconProps) {
  const colorMap = {
    online: 'success',
    offline: 'error',
    unknown: 'neutral',
  };

  const color = colorMap[status];

  // In Traccar, they preload all icon combinations
  // You can either:
  // 1. Use SVG icons and apply CSS filters for colors
  // 2. Pre-generate all combinations as static images
  // 3. Use inline SVG with dynamic fill

  return (
    <div className="relative">
      {/* Device icon */}
      <Image
        src={`/icons/devices/${category}-${color}.svg`}
        alt={category}
        width={32}
        height={32}
      />

      {/* Direction arrow (if moving) */}
      {showDirection && (
        <div className="absolute -bottom-2 left-1/2 -translate-x-1/2">
          <div className="w-0 h-0 border-l-4 border-r-4 border-t-8 border-transparent border-t-blue-500" />
        </div>
      )}
    </div>
  );
}
```

### Geofence Layer

**File:** `components/map/GeofenceLayer.tsx`

```typescript
'use client';

import { Source, Layer } from 'react-map-gl';
import type { FillLayer, LineLayer } from 'react-map-gl';
import { useGeofencesGeoJSON } from '@/store/traccar-selectors';

const fillLayer: FillLayer = {
  id: 'geofences-fill',
  type: 'fill',
  paint: {
    'fill-color': ['get', 'color'],
    'fill-opacity': 0.1,
  },
};

const lineLayer: LineLayer = {
  id: 'geofences-line',
  type: 'line',
  paint: {
    'line-color': ['get', 'color'],
    'line-width': 2,
    'line-opacity': 0.8,
  },
};

export function GeofenceLayer() {
  const geojson = useGeofencesGeoJSON();

  return (
    <Source id="geofences" type="geojson" data={geojson}>
      <Layer {...fillLayer} />
      <Layer {...lineLayer} />
    </Source>
  );
}
```

### Live Route Layer

**File:** `components/map/LiveRouteLayer.tsx`

```typescript
'use client';

import { Source, Layer } from 'react-map-gl';
import type { LineLayer } from 'react-map-gl';
import { useTraccarStore } from '@/store/traccar';

const routeLayer: LineLayer = {
  id: 'live-routes',
  type: 'line',
  paint: {
    'line-color': '#3b82f6',
    'line-width': 2,
    'line-opacity': 0.6,
  },
};

export function LiveRouteLayer() {
  const history = useTraccarStore(state => state.liveRouteHistory);
  const devices = useTraccarStore(state => state.devices);

  // Convert history to GeoJSON LineStrings
  const geojson = {
    type: 'FeatureCollection' as const,
    features: Object.entries(history).map(([deviceId, coords]) => ({
      type: 'Feature' as const,
      geometry: {
        type: 'LineString' as const,
        coordinates: coords,
      },
      properties: {
        deviceId: Number(deviceId),
        color: devices[Number(deviceId)]?.attributes?.color || '#3b82f6',
      },
    })),
  };

  return (
    <Source id="live-routes" type="geojson" data={geojson}>
      <Layer {...routeLayer} />
    </Source>
  );
}
```

---

## Core Features Extraction

### 1. Device Management

**List Component:**

```typescript
// components/devices/DeviceList.tsx
'use client';

import { useDevices } from '@/store/traccar-selectors';

export function DeviceList() {
  const devices = useDevices();

  return (
    <div className="space-y-2">
      {devices.map(device => (
        <DeviceCard key={device.id} device={device} />
      ))}
    </div>
  );
}
```

### 2. Geofence Drawing

**Use `@mapbox/mapbox-gl-draw` with React Map GL:**

```bash
npm install @mapbox/mapbox-gl-draw
```

```typescript
// components/map/GeofenceDraw.tsx
'use client';

import { useControl } from 'react-map-gl';
import MapboxDraw from '@mapbox/mapbox-gl-draw';
import type { ControlPosition } from 'react-map-gl';

interface GeofenceDrawProps {
  position?: ControlPosition;
  onCreate?: (feature: any) => void;
  onUpdate?: (feature: any) => void;
  onDelete?: (featureId: string) => void;
}

export function GeofenceDraw({
  position = 'top-left',
  onCreate,
  onUpdate,
  onDelete,
}: GeofenceDrawProps) {
  const draw = useControl<MapboxDraw>(
    () => new MapboxDraw({
      displayControlsDefault: false,
      controls: {
        polygon: true,
        line_string: true,
        trash: true,
      },
      defaultMode: 'simple_select',
    }),
    ({ map }) => {
      map.on('draw.create', (e) => onCreate?.(e.features[0]));
      map.on('draw.update', (e) => onUpdate?.(e.features[0]));
      map.on('draw.delete', (e) => onDelete?.(e.features[0].id));
    },
    ({ map }) => {
      map.off('draw.create', onCreate);
      map.off('draw.update', onUpdate);
      map.off('draw.delete', onDelete);
    },
    { position }
  );

  return null;
}
```

**Convert GeoJSON to WKT (for Traccar API):**

```typescript
// lib/geometry.ts
import { stringify } from 'wellknown';

export function geometryToWKT(geometry: GeoJSON.Geometry): string {
  // Reverse coordinates (GeoJSON is [lon, lat], WKT is [lat, lon])
  const reversed = reverseCoordinates(geometry);
  return stringify(reversed);
}

function reverseCoordinates(geom: any): any {
  if (Array.isArray(geom) && geom.length === 2 && typeof geom[0] === 'number') {
    return [geom[1], geom[0]];
  }
  if (Array.isArray(geom)) {
    return geom.map(reverseCoordinates);
  }
  if (geom.coordinates) {
    return {
      ...geom,
      coordinates: reverseCoordinates(geom.coordinates),
    };
  }
  return geom;
}
```

### 3. Trip Reports

```typescript
// app/reports/trips/page.tsx
'use client';

import { useState } from 'react';
import { traccarAPI } from '@/lib/traccar/api';
import type { Trip } from '@/types/traccar';

export default function TripReportPage() {
  const [trips, setTrips] = useState<Trip[]>([]);

  const fetchTrips = async (deviceId: number, from: string, to: string) => {
    const data = await traccarAPI.getTripReport({ deviceId, from, to });
    setTrips(data);
  };

  return (
    <div>
      {/* Date range picker, device selector */}

      <table>
        <thead>
          <tr>
            <th>Start Time</th>
            <th>End Time</th>
            <th>Duration</th>
            <th>Distance</th>
            <th>Max Speed</th>
          </tr>
        </thead>
        <tbody>
          {trips.map((trip, idx) => (
            <tr key={idx}>
              <td>{new Date(trip.startTime).toLocaleString()}</td>
              <td>{new Date(trip.endTime).toLocaleString()}</td>
              <td>{formatDuration(trip.duration)}</td>
              <td>{formatDistance(trip.distance)}</td>
              <td>{formatSpeed(trip.maxSpeed)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
```

### 4. Public Sharing

**Generate share link:**

```typescript
// app/share/[deviceId]/page.tsx
'use client';

import { useState } from 'react';
import { traccarAPI } from '@/lib/traccar/api';

export default function ShareDevicePage({ params }: { params: { deviceId: string } }) {
  const [shareLink, setShareLink] = useState('');

  const generateShareLink = async () => {
    const expirationTime = new Date();
    expirationTime.setDate(expirationTime.getDate() + 7); // 7 days

    const token = await traccarAPI.shareDevice(
      Number(params.deviceId),
      expirationTime.toISOString()
    );

    const link = `${window.location.origin}/public?token=${token}`;
    setShareLink(link);
  };

  return (
    <div>
      <button onClick={generateShareLink}>Generate Share Link</button>
      {shareLink && <input readOnly value={shareLink} />}
    </div>
  );
}
```

**Public tracking page:**

```typescript
// app/public/page.tsx
import { redirect } from 'next/navigation';
import { traccarAPI } from '@/lib/traccar/api';
import PublicMap from '@/components/PublicMap';

export default async function PublicTrackingPage({
  searchParams,
}: {
  searchParams: { token?: string };
}) {
  if (!searchParams.token) {
    redirect('/');
  }

  // Server-side: Login with token
  const user = await traccarAPI.loginWithToken(searchParams.token);

  return <PublicMap />;
}
```

---

## Utility Functions

### Unit Converters

**File:** `lib/units.ts`

```typescript
// Speed units
export type SpeedUnit = 'kn' | 'kmh' | 'mph';

const speedFactors: Record<SpeedUnit, number> = {
  kn: 1,
  kmh: 1.852,
  mph: 1.15078,
};

export function convertSpeed(valueInKnots: number, toUnit: SpeedUnit): number {
  return valueInKnots * speedFactors[toUnit];
}

// Distance units
export type DistanceUnit = 'km' | 'mi' | 'nmi';

const distanceFactors: Record<DistanceUnit, number> = {
  km: 0.001,
  mi: 0.000621371,
  nmi: 0.000539957,
};

export function convertDistance(valueInMeters: number, toUnit: DistanceUnit): number {
  return valueInMeters * distanceFactors[toUnit];
}

// Altitude units
export type AltitudeUnit = 'm' | 'ft';

const altitudeFactors: Record<AltitudeUnit, number> = {
  m: 1,
  ft: 3.28084,
};

export function convertAltitude(valueInMeters: number, toUnit: AltitudeUnit): number {
  return valueInMeters * altitudeFactors[toUnit];
}

// Volume units
export type VolumeUnit = 'ltr' | 'usGal' | 'impGal';

const volumeFactors: Record<VolumeUnit, number> = {
  ltr: 1,
  usGal: 3.785,
  impGal: 4.546,
};

export function convertVolume(valueInLiters: number, toUnit: VolumeUnit): number {
  return valueInLiters / volumeFactors[toUnit];
}
```

### Formatters

**File:** `lib/format.ts`

```typescript
import { convertSpeed, convertDistance, convertAltitude, convertVolume } from './units';
import type { SpeedUnit, DistanceUnit, AltitudeUnit, VolumeUnit } from './units';

export function formatSpeed(
  valueInKnots: number,
  unit: SpeedUnit = 'kmh',
  decimals: number = 2
): string {
  const converted = convertSpeed(valueInKnots, unit);
  const unitLabels = { kn: 'kn', kmh: 'km/h', mph: 'mph' };
  return `${converted.toFixed(decimals)} ${unitLabels[unit]}`;
}

export function formatDistance(
  valueInMeters: number,
  unit: DistanceUnit = 'km',
  decimals: number = 2
): string {
  const converted = convertDistance(valueInMeters, unit);
  const unitLabels = { km: 'km', mi: 'mi', nmi: 'nmi' };
  return `${converted.toFixed(decimals)} ${unitLabels[unit]}`;
}

export function formatAltitude(
  valueInMeters: number,
  unit: AltitudeUnit = 'm',
  decimals: number = 0
): string {
  const converted = convertAltitude(valueInMeters, unit);
  return `${converted.toFixed(decimals)} ${unit}`;
}

export function formatVolume(
  valueInLiters: number,
  unit: VolumeUnit = 'ltr',
  decimals: number = 2
): string {
  const converted = convertVolume(valueInLiters, unit);
  const unitLabels = { ltr: 'L', usGal: 'gal', impGal: 'gal' };
  return `${converted.toFixed(decimals)} ${unitLabels[unit]}`;
}

export function formatDuration(milliseconds: number): string {
  const seconds = Math.floor(milliseconds / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (days > 0) {
    return `${days}d ${hours % 24}h ${minutes % 60}m`;
  }
  if (hours > 0) {
    return `${hours}h ${minutes % 60}m`;
  }
  if (minutes > 0) {
    return `${minutes}m ${seconds % 60}s`;
  }
  return `${seconds}s`;
}

export function formatCoordinate(
  value: number,
  type: 'latitude' | 'longitude',
  format: 'dd' | 'ddm' | 'dms' = 'dd'
): string {
  const hemisphere = type === 'latitude'
    ? (value >= 0 ? 'N' : 'S')
    : (value >= 0 ? 'E' : 'W');

  const absValue = Math.abs(value);

  switch (format) {
    case 'dd':
      return `${absValue.toFixed(6)}° ${hemisphere}`;

    case 'ddm': {
      const degrees = Math.floor(absValue);
      const minutes = (absValue - degrees) * 60;
      return `${degrees}° ${minutes.toFixed(4)}' ${hemisphere}`;
    }

    case 'dms': {
      const degrees = Math.floor(absValue);
      const minutesDecimal = (absValue - degrees) * 60;
      const minutes = Math.floor(minutesDecimal);
      const seconds = (minutesDecimal - minutes) * 60;
      return `${degrees}° ${minutes}' ${seconds.toFixed(2)}" ${hemisphere}`;
    }
  }
}

export function getStatusColor(status: 'online' | 'offline' | 'unknown'): string {
  const colors = {
    online: 'text-green-600 bg-green-100',
    offline: 'text-red-600 bg-red-100',
    unknown: 'text-gray-600 bg-gray-100',
  };
  return colors[status];
}
```

### Geometry Utilities

**File:** `lib/geometry.ts`

```typescript
import { parse, stringify } from 'wellknown';
import circle from '@turf/circle';

// Reverse coordinate order for WKT ↔ GeoJSON conversion
export function reverseCoordinates(geom: any): any {
  if (Array.isArray(geom) && geom.length === 2 && typeof geom[0] === 'number') {
    return [geom[1], geom[0]];
  }
  if (Array.isArray(geom)) {
    return geom.map(reverseCoordinates);
  }
  if (geom.coordinates) {
    return {
      ...geom,
      coordinates: reverseCoordinates(geom.coordinates),
    };
  }
  return geom;
}

// Convert Traccar WKT to GeoJSON Feature
export function geofenceToFeature(geofence: Geofence): GeofenceFeature {
  let geometry: GeoJSON.Geometry;

  // Handle CIRCLE format (non-standard WKT)
  if (geofence.area.startsWith('CIRCLE')) {
    const coords = geofence.area
      .replace(/CIRCLE|\(|\)|,/g, ' ')
      .trim()
      .split(/\s+/)
      .map(Number);

    const [lat, lon, radiusMeters] = coords;
    const circleFeature = circle([lon, lat], radiusMeters, {
      steps: 32,
      units: 'meters',
    });
    geometry = circleFeature.geometry;
  } else {
    // Standard WKT (POLYGON, LINESTRING)
    geometry = reverseCoordinates(parse(geofence.area));
  }

  return {
    type: 'Feature',
    geometry,
    properties: {
      id: geofence.id,
      name: geofence.name,
      color: geofence.attributes.color || '#3b82f6',
      hide: geofence.attributes.hide || false,
    },
  };
}

// Convert GeoJSON Geometry to Traccar WKT
export function geometryToWKT(geometry: GeoJSON.Geometry): string {
  const reversed = reverseCoordinates(geometry);
  return stringify(reversed);
}
```

---

## Implementation Roadmap

### Phase 1: Foundation (Week 1)
- [ ] Set up TypeScript types (`types/traccar.ts`)
- [ ] Create API client (`lib/traccar/api.ts`)
- [ ] Create Zustand store (`store/traccar.ts`)
- [ ] Implement authentication bridge
- [ ] Set up Next.js API proxy routes

### Phase 2: Real-Time Core (Week 2)
- [ ] Implement WebSocket hook (`hooks/useTraccarWebSocket.ts`)
- [ ] Test real-time position updates
- [ ] Implement device list component
- [ ] Test with actual Traccar backend

### Phase 3: Map Integration (Week 3)
- [ ] Set up React Map GL base map
- [ ] Implement device markers
- [ ] Implement geofence rendering
- [ ] Implement live route trails
- [ ] Add map controls

### Phase 4: Advanced Features (Week 4)
- [ ] Geofence drawing tool
- [ ] Trip/route reports
- [ ] Route playback
- [ ] Public sharing functionality

### Phase 5: Polish & UX (Week 5)
- [ ] Design custom UI for device list
- [ ] Redesign device detail pages
- [ ] Implement search/filters
- [ ] Add notifications/alerts
- [ ] Mobile responsiveness

### Phase 6: Use Case Implementations (Week 6+)
- [ ] **Tour operator scenario**: Multi-day trip tracking, public share link with branding
- [ ] **Taxi dispatch**: Real-time driver map, fare calculator integration
- [ ] **Security tracking**: Geofence alerts, panic button, route history

---

## Key Files to Extract

### Must Copy (with TypeScript conversion):
1. **`common/util/converter.js`** → `lib/units.ts` ✅
2. **`common/util/formatter.js`** → `lib/format.ts` ✅
3. **`map/core/mapUtil.js`** → `lib/geometry.ts` ✅
4. **`common/util/colors.js`** → `lib/colormap.ts`
5. **Icon assets** from `resources/images/` → `public/icons/`

### Use as Reference:
1. **`SocketController.jsx`** - for WebSocket implementation
2. **`store/*.js`** - for state structure
3. **`map/MapPositions.js`** - for device rendering logic
4. **`map/MapGeofence.js`** - for geofence rendering
5. **`other/ReplayPage.jsx`** - for playback UI

---

## Additional Recommendations

### Performance Optimization
- Use React Query for API caching
- Implement virtual scrolling for large device lists
- Debounce map updates during rapid position changes

### TypeScript Strictness
```json
// tsconfig.json
{
  "compilerOptions": {
    "strict": true,
    "noUncheckedIndexedAccess": true,
    "noImplicitAny": true
  }
}
```

### Testing Strategy
- Unit tests for utility functions
- Integration tests for API client
- E2E tests for critical flows (device tracking, geofence creation)

### Documentation
- Document Traccar API endpoints you use
- Create developer guide for adding new device types
- Document authentication flow clearly

---

## Conclusion

Traccar Web is remarkably clean and extraction-friendly. The lack of heavy abstractions makes it ideal for adapting to a modern stack. Focus on:

1. **Core extractions**: API client, WebSocket, utilities
2. **State translation**: Redux → Zustand is straightforward
3. **Map adaptation**: MapLibre → React Map GL is nearly 1:1
4. **UX redesign**: Where you'll add the most value

Your use cases (tour operators, taxi drivers, security) will benefit from:
- Simplified, task-focused UI
- Mobile-first design
- Branded public sharing
- Industry-specific terminology

Good luck with your implementation! 🚀
