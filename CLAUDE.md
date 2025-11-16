# CLAUDE.md - Traccar Web Interface

> AI Assistant Guide for Contributing to Traccar Web

This document provides a comprehensive overview of the Traccar Web codebase structure, development workflows, and key conventions for AI assistants working on this project.

## Project Overview

**Traccar Web** is the modern web interface for the Traccar GPS tracking platform. It provides real-time tracking, reporting, and management capabilities for GPS tracking devices.

- **Repository**: https://github.com/tananaev/traccar-web
- **Version**: 6.6.0
- **License**: Apache License 2.0
- **Backend**: Separate Java-based server (https://github.com/tananaev/traccar)

## Technology Stack

### Core Framework
- **React**: 18.3.1 (functional components with hooks)
- **Language**: JavaScript (ES2020) - **No TypeScript**
- **Build Tool**: Vite 5.4.14
- **Bundler**: Vite (replaces Webpack)
- **Dev Server**: Vite dev server on port 3000

### UI Framework
- **Material-UI (MUI)**: v5.16.14
  - `@mui/material` - Core components
  - `@mui/icons-material` - Icons
  - `@mui/lab` - Experimental components
  - `@mui/styles` - Styling solution (JSS-based with `makeStyles`)
- **Emotion**: CSS-in-JS styling engine

### State Management
- **Redux Toolkit**: v2.5.0 (with createSlice pattern)
- **React Redux**: v9.2.0
- Custom throttle middleware for performance

### Routing
- **React Router**: v6.28.1 (with `react-router-dom`)

### Mapping & Geospatial
- **MapLibre GL**: v4.7.1 (primary mapping library)
- **Mapbox GL**: v1.13.3 (legacy support)
- **@mapbox/mapbox-gl-draw**: Drawing and editing tools
- **@maplibre/maplibre-gl-geocoder**: Geocoding/search
- **maplibre-google-maps**: Google Maps integration
- **@turf/turf**: Geospatial analysis and calculations
- **@tmcw/togeojson**: GeoJSON format conversion
- **wellknown**: WKT (Well-Known Text) parsing

### Utilities
- **dayjs**: Date/time manipulation (lightweight alternative to moment.js)
- **recharts**: Charts and data visualization
- **react-window**: Virtual scrolling for large lists
- **react-draggable**: Drag and drop functionality
- **react-virtualized-auto-sizer**: Auto-sizing for virtualized lists

### PWA Support
- **vite-plugin-pwa**: Progressive Web App configuration
- **workbox**: Service worker generation

### Development Tools
- **ESLint**: v8.57.1 with Airbnb config
- **vite-plugin-svgr**: Import SVGs as React components

## Directory Structure

```
traccar-web/
├── .github/                    # GitHub workflows and contribution docs
│   ├── workflows/
│   │   ├── modern.yml         # CI for modern app (lint on push/PR)
│   │   ├── legacy.yml         # CI for legacy app
│   │   └── translation.yml    # Translation workflow
│   ├── CONTRIBUTING.md        # Contribution guidelines
│   └── FUNDING.yml            # Funding information
│
├── .vscode/                   # VSCode editor settings
│
├── legacy/                    # Legacy web interface (older version)
│
├── public/                    # Static assets
│   ├── logo.svg              # App logo
│   ├── favicon.ico           # Favicon
│   ├── pwa-*.png            # PWA icons
│   └── apple-touch-icon-*.png
│
├── simple/                    # Simple HTML interface
│
├── src/                       # Main source code (167 JS/JSX files)
│   ├── common/               # Shared utilities and components
│   │   ├── attributes/       # Attribute hooks for various entities
│   │   ├── components/       # 17 reusable UI components
│   │   ├── theme/           # MUI theme configuration
│   │   └── util/            # Utility functions and custom hooks
│   │
│   ├── login/               # Authentication pages (6 pages)
│   │   ├── LoginPage.jsx
│   │   ├── RegisterPage.jsx
│   │   ├── ResetPasswordPage.jsx
│   │   └── ...
│   │
│   ├── main/                # Main dashboard and device list
│   │   ├── MainPage.jsx
│   │   ├── DeviceList.jsx
│   │   ├── MainMap.jsx
│   │   └── ...
│   │
│   ├── map/                 # Map-related components
│   │   ├── core/           # Core map utilities (MapView, mapUtil)
│   │   ├── draw/           # Drawing tools for geofences
│   │   ├── geocoder/       # Geocoding functionality
│   │   ├── legend/         # Map legends
│   │   ├── main/           # Map features (accuracy, routes, camera)
│   │   ├── notification/   # Map notifications
│   │   ├── overlay/        # Map overlays
│   │   └── switcher/       # Map style switcher
│   │
│   ├── other/              # Miscellaneous pages (7 pages)
│   │   ├── ReplayPage.jsx
│   │   ├── GeofencesPage.jsx
│   │   ├── EmulatorPage.jsx
│   │   └── ...
│   │
│   ├── reports/            # Reporting functionality
│   │   ├── common/        # Report utilities and styles
│   │   ├── components/    # Report UI components
│   │   └── [Report Pages] # Trip, Stop, Summary, Chart, etc.
│   │
│   ├── resources/          # Static resources
│   │   ├── images/        # Icons and images
│   │   └── l10n/          # 60+ language translation files
│   │
│   ├── settings/           # Settings and configuration (30+ pages)
│   │   ├── common/        # Settings styles
│   │   ├── components/    # Settings UI components
│   │   └── [Pages]        # User, Device, Server, Notifications, etc.
│   │
│   ├── store/              # Redux state management
│   │   ├── index.js       # Store configuration
│   │   ├── devices.js     # Device state slice
│   │   ├── session.js     # Session/auth state slice
│   │   ├── events.js      # Events state slice
│   │   ├── geofences.js   # Geofences state
│   │   ├── groups.js      # Device groups state
│   │   ├── drivers.js     # Drivers state
│   │   ├── maintenances.js
│   │   ├── calendars.js
│   │   ├── reports.js
│   │   ├── errors.js      # Error handling state
│   │   └── throttleMiddleware.js
│   │
│   ├── App.jsx             # Main app component
│   ├── Navigation.jsx      # Route configuration
│   ├── SocketController.jsx # WebSocket handler
│   ├── CachingController.js # Data prefetching
│   ├── UpdateController.jsx # PWA update checker
│   ├── ServerProvider.jsx  # Server context
│   ├── reactHelper.js      # Custom React hooks
│   └── index.jsx           # React app entry point
│
├── tools/                  # Build and translation tools
│   └── translate.py
│
├── .env                    # Environment variables
├── .eslintrc.json         # ESLint configuration
├── .gitignore             # Git ignore rules
├── .npmrc                 # NPM configuration
├── index.html             # Main HTML entry point
├── package.json           # Dependencies and scripts
├── package-lock.json      # Locked dependencies
├── vite.config.js         # Vite build configuration
├── LICENSE.txt            # Apache 2.0 license
└── README.md              # Project overview
```

## Architecture Patterns

### Component Architecture

The codebase follows a **feature-based organization** with clear separation of concerns:

1. **Page Components**: Top-level route components (e.g., `MainPage.jsx`, `DevicePage.jsx`)
2. **Feature Components**: Domain-specific components organized by feature/domain
3. **Common Components**: Shared/reusable components in `/src/common/components/`

### Component Patterns

**Functional Components with Hooks** (Arrow Functions):
```javascript
const MyComponent = ({ prop1, prop2 }) => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const data = useSelector((state) => state.some.data);

  return (
    <div className={classes.root}>
      {/* Component JSX */}
    </div>
  );
};

export default MyComponent;
```

**Key Conventions**:
- Use arrow functions for all components (enforced by ESLint)
- Export as default at the end of the file
- Use destructured props in function signature
- No PropTypes validation (disabled in ESLint)

### State Management Pattern

**Redux Toolkit Slice Pattern**:

```javascript
// src/store/devices.js
import { createSlice } from '@reduxjs/toolkit';

const { reducer, actions } = createSlice({
  name: 'devices',
  initialState: {
    items: {},           // Normalized by ID
    selectedId: null,    // Single selection
    selectedIds: [],     // Multiple selection
  },
  reducers: {
    refresh(state, action) {
      state.items = {};
      action.payload.forEach((item) => state.items[item.id] = item);
    },
    update(state, action) {
      action.payload.forEach((item) => state.items[item.id] = item);
    },
    selectId(state, action) {
      state.selectedId = action.payload;
      state.selectedIds = state.selectedId ? [state.selectedId] : [];
    },
    remove(state, action) {
      delete state.items[action.payload];
    },
  },
});

export { actions as devicesActions };
export { reducer as devicesReducer };
```

**Store Structure**:
- **Normalized state**: Items stored as objects keyed by ID
- **Standard actions**: `refresh`, `update`, `remove`, `selectId`
- **Named exports**: Actions and reducers exported separately

### Data Flow Architecture

```
User Interaction
       ↓
  Component
       ↓
  Dispatch Action
       ↓
  Redux Store
       ↓
  Component Re-render
```

**Real-time Updates**:
```
Backend (Traccar Server)
       ↓
  WebSocket Connection (SocketController)
       ↓
  Dispatch Redux Actions
       ↓
  Components Auto-update
```

## API & Data Layer

### REST API Pattern

**Base Configuration**:
- **Proxy**: `/api` → `http://localhost:8082` (configured in vite.config.js)
- **No API client library**: Direct `fetch()` usage throughout

**Standard Fetch Pattern**:
```javascript
const response = await fetch('/api/devices');
if (response.ok) {
  const data = await response.json();
  dispatch(devicesActions.update(data));
} else {
  throw Error(await response.text());
}
```

**Async Error Handling**:
```javascript
import { useEffectAsync, useCatch } from './reactHelper';

// In components:
useEffectAsync(async () => {
  const response = await fetch('/api/devices');
  if (response.ok) {
    // Handle success
  } else {
    throw Error(await response.text());
  }
}, [dependencies]);
```

### WebSocket (Real-time Updates)

**Controller**: `src/SocketController.jsx`
- **Connection**: `ws://localhost:8082/api/socket`
- **Auto-reconnect**: 60-second delay on disconnect
- **Message Types**:
  - `devices`: Device updates
  - `positions`: Position updates
  - `events`: Event notifications
  - `logRecords`: Log messages

**Pattern**:
```javascript
socket.addEventListener('message', (event) => {
  const data = JSON.parse(event.data);
  if (data.devices) {
    dispatch(devicesActions.update(data.devices));
  }
  if (data.positions) {
    dispatch(sessionActions.updatePositions(data.positions));
  }
  // ... handle other message types
});
```

### Data Caching Strategy

**CachingController** (`src/CachingController.js`):
- Prefetches reference data on authentication
- Loads: geofences, groups, drivers, maintenances, calendars
- Stores in Redux for application-wide access

## Custom Hooks & Utilities

### React Helper Hooks

Located in `/src/reactHelper.js`:

**useEffectAsync** - Async useEffect with error handling:
```javascript
useEffectAsync(async () => {
  const response = await fetch('/api/devices');
  if (response.ok) {
    setData(await response.json());
  } else {
    throw Error(await response.text());
  }
}, [dependencies]);
```

**useCatch** - Wraps async functions with error dispatching:
```javascript
const handleSave = useCatch(async () => {
  const response = await fetch('/api/devices', {
    method: 'POST',
    body: JSON.stringify(data),
  });
  if (!response.ok) throw Error(await response.text());
});
```

**usePrevious** - Access previous prop/state value:
```javascript
const prevValue = usePrevious(currentValue);
```

### Common Utilities

Located in `/src/common/util/`:

**Permission Hooks** (`permissions.js`):
- `useAdministrator()` - Check if user is admin
- `useManager()` - Check if user is admin or manager
- `useDeviceReadonly()` - Check if devices are read-only
- `useRestriction(key)` - Check specific restrictions

**Feature Hooks** (`useFeatures.js`):
- Check server feature availability

**Persisted State** (`usePersistedState.js`):
- Store state in localStorage

**Query Params** (`useQuery.js`):
- Parse URL query parameters

**Formatters** (`formatter.js`):
- Format dates, numbers, coordinates, speeds, distances

**Color Utilities** (`colors.js`):
- Generate colors for devices/geofences

**Converters** (`converter.js`):
- Unit conversions (speed, distance, volume, etc.)

## Styling Approach

### Material-UI makeStyles (JSS)

**Standard Pattern**:
```javascript
import makeStyles from '@mui/styles/makeStyles';

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
  },
  button: {
    marginTop: theme.spacing(2),
  },
}));

const MyComponent = () => {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <Button className={classes.button}>Click</Button>
    </div>
  );
};
```

### Theme Configuration

Located in `/src/common/theme/`:
- `palette.js` - Color palette definition
- `dimensions.js` - Spacing, sizing constants

### Responsive Design

**Use MUI breakpoints**:
```javascript
import { useMediaQuery, useTheme } from '@mui/material';

const MyComponent = () => {
  const theme = useTheme();
  const desktop = useMediaQuery(theme.breakpoints.up('md'));

  return desktop ? <DesktopView /> : <MobileView />;
};
```

## Code Conventions

### ESLint Configuration

Based on **Airbnb style guide** with modifications:

**Disabled Rules**:
- `max-len` - No line length limit
- `no-shadow` - Allow variable shadowing
- `no-return-assign` - Allow return assignments
- `no-param-reassign` - Allow param reassignment (for Redux Toolkit)
- `no-prototype-builtins` - Allow hasOwnProperty direct calls
- `react/prop-types` - PropTypes validation disabled
- `react/jsx-props-no-spreading` - Allow prop spreading
- `jsx-a11y/anchor-is-valid` - Relaxed anchor validation
- `jsx-a11y/label-has-associated-control` - Relaxed label validation

**Custom Rules**:
- **Function components**: Must use arrow functions
- **Object curly newline**: Min 8 properties before newline required
- **Import declarations**: Min 4 imports before newline required

### Naming Conventions

**Files**:
- Component files: PascalCase (e.g., `DevicePage.jsx`)
- Utility files: camelCase (e.g., `reactHelper.js`)
- Store slices: lowercase (e.g., `devices.js`)

**Components**:
- Component names: PascalCase (e.g., `DeviceList`)
- Prop names: camelCase (e.g., `deviceId`, `onSelect`)

**Variables & Functions**:
- camelCase (e.g., `selectedDevice`, `handleClick`)

**Constants**:
- UPPER_SNAKE_CASE for true constants
- camelCase for most configuration objects

**Redux**:
- Actions: `{domain}Actions` (e.g., `devicesActions`)
- Reducers: `{domain}Reducer` (e.g., `devicesReducer`)

### Import Order

Follow ESLint Airbnb import order:
1. Node built-ins (e.g., `events`)
2. External packages (e.g., `react`, `@mui/material`)
3. Internal modules (e.g., `./components`, `../utils`)

### File Structure

**Typical Component File**:
```javascript
// 1. Imports
import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Button, TextField } from '@mui/material';
import makeStyles from '@mui/styles/makeStyles';
import { useEffectAsync } from '../reactHelper';

// 2. Styles
const useStyles = makeStyles((theme) => ({
  root: {
    // styles
  },
}));

// 3. Component
const MyComponent = ({ prop1, prop2 }) => {
  // Hooks
  const classes = useStyles();
  const dispatch = useDispatch();
  const data = useSelector((state) => state.some.data);
  const [localState, setLocalState] = useState();

  // Effects
  useEffectAsync(async () => {
    // async logic
  }, []);

  // Event handlers
  const handleClick = () => {
    // handle click
  };

  // Render
  return (
    <div className={classes.root}>
      {/* JSX */}
    </div>
  );
};

// 4. Export
export default MyComponent;
```

## Development Workflow

### Initial Setup

```bash
# Clone repository
git clone https://github.com/tananaev/traccar-web.git
cd traccar-web

# Install dependencies
npm ci

# Start development server
npm start
```

**Prerequisites**:
- Node.js (version specified in package.json engines if present)
- Traccar server running on localhost:8082

### Available Scripts

Defined in `package.json`:

```bash
# Start development server (port 3000)
npm start

# Build for production
npm run build

# Run linter
npm run lint

# Fix linting issues automatically
npm run lint:fix

# Generate PWA assets
npm run generate-pwa-assets
```

### Development Server

**Vite Configuration** (`vite.config.js`):
- **Port**: 3000
- **API Proxy**: `/api` → `http://localhost:8082`
- **WebSocket Proxy**: `/api/socket` → `ws://localhost:8082`
- **Hot Module Replacement**: Enabled
- **React Fast Refresh**: Enabled

### Build Process

**Production Build**:
```bash
npm run build
```

**Output**:
- Directory: `/build`
- Includes: Minified JS, CSS, HTML, assets
- PWA: Service worker and manifest generated
- Source maps: Generated for debugging

### Linting

**Run ESLint**:
```bash
npm run lint        # Check for issues
npm run lint:fix    # Auto-fix issues
```

**ESLint runs automatically**:
- On GitHub push/PR to master branch
- Via GitHub Actions workflow (`.github/workflows/modern.yml`)

### CI/CD Pipeline

**GitHub Actions** (`.github/workflows/modern.yml`):

```yaml
Triggers: Push/PR to master
Steps:
  1. Checkout code
  2. Setup Node.js (with npm cache)
  3. Run npm ci
  4. Run npm run lint
```

**Status**: Must pass before merge

## Git Workflow

### Branch Strategy

- **Main Branch**: `master`
- **Feature Branches**: Create from master
- **PR Target**: Always merge to master

### Commit Messages

**Guidelines** (from CONTRIBUTING.md):
- Be descriptive and concise
- Follow existing commit message style
- Reference issues when applicable

**Examples from history**:
```
Add positionEngineTemp in resources
Update string
Merge pull request #1340 from paul-777/ConfigurableWidthAndOpacity
```

### Pull Request Process

**Before Creating PR**:
1. Discuss solution with maintainers (for significant changes)
2. Ensure code is high quality
3. Follow existing code patterns and styles
4. Test changes thoroughly

**PR Requirements**:
- Code must pass ESLint checks
- Follow existing patterns
- Be descriptive in PR description

### Contribution Guidelines

From `.github/CONTRIBUTING.md`:

**Before Contributing**:
- Search documentation: https://www.traccar.org/documentation/
- Check forums: https://www.traccar.org/forums/
- Search existing issues
- Use correct repository (this is web interface only)

**Issue Types**:
- Use GitHub issues ONLY for: feature requests, code discussions, bug reports
- Use forums for general discussions

**Bug Reports**:
- Test with latest official release
- Use default configuration
- Provide logs, OS info, hardware details

**Feature Requests**:
- Ensure feature doesn't already exist
- Search for existing feature requests
- Describe use case and benefits

## Internationalization (i18n)

### Translation Files

Located in `/src/resources/l10n/`:
- **60+ languages** supported
- **Format**: JSON key-value pairs
- **English**: `en.json` (primary language)

### Usage Pattern

```javascript
import { useTranslation } from '../common/components/LocalizationProvider';

const MyComponent = () => {
  const t = useTranslation();

  return <div>{t('sharedDevice')}</div>;
};
```

### Translation Workflow

**GitHub Actions** (`.github/workflows/translation.yml`):
- Manages translation updates
- Tool: `/tools/translate.py`

## Testing

**Current State**: No testing framework configured

**Missing**:
- No test files (`.test.js`, `.spec.js`)
- No testing dependencies (Jest, React Testing Library, etc.)
- No test scripts in package.json

**Recommendation for Contributors**:
- When adding tests, consider Jest + React Testing Library
- Follow React testing best practices
- Test user interactions, not implementation details

## Common Development Tasks

### Adding a New Page

1. Create page component in appropriate directory (e.g., `/src/settings/`)
2. Add route in `src/Navigation.jsx`
3. Add translations in `/src/resources/l10n/en.json`
4. Add navigation link if needed

### Adding a New Redux Slice

1. Create slice file in `/src/store/`
2. Follow existing slice pattern (see `devices.js`)
3. Export actions and reducer
4. Add reducer to store in `/src/store/index.js`

### Adding a New Component

1. Create component file in appropriate directory
2. Use arrow function pattern
3. Add styles with `makeStyles`
4. Export as default
5. Document props with JSDoc comments (optional but helpful)

### Working with Maps

**Key Files**:
- `/src/map/core/MapView.jsx` - Main map component
- `/src/map/core/mapUtil.js` - Map utilities
- `/src/map/core/useMapStyles.js` - Map styling

**MapLibre GL**:
- Primary mapping library
- See docs: https://maplibre.org/maplibre-gl-js/docs/

### Adding API Calls

```javascript
// Using useEffectAsync
import { useEffectAsync } from '../reactHelper';

useEffectAsync(async () => {
  const response = await fetch('/api/endpoint');
  if (response.ok) {
    const data = await response.json();
    // Handle data
  } else {
    throw Error(await response.text());
  }
}, [dependencies]);

// Using useCatch for event handlers
import { useCatch } from '../reactHelper';

const handleSave = useCatch(async () => {
  const response = await fetch('/api/endpoint', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (response.ok) {
    // Handle success
  } else {
    throw Error(await response.text());
  }
});
```

## Key Files to Understand

### Entry Points

1. **index.html** - HTML entry point, defines root div
2. **src/index.jsx** - React entry point, renders app
3. **src/App.jsx** - Main app component, authentication wrapper
4. **src/Navigation.jsx** - Route configuration

### Controllers

1. **src/SocketController.jsx** - WebSocket connection management
2. **src/CachingController.js** - Data prefetching on auth
3. **src/UpdateController.jsx** - PWA update checking

### State Management

1. **src/store/index.js** - Redux store configuration
2. **src/store/session.js** - Authentication and session state
3. **src/store/devices.js** - Device list and selection

### Utilities

1. **src/reactHelper.js** - Custom React hooks
2. **src/common/util/permissions.js** - Permission checking
3. **src/common/util/formatter.js** - Data formatting

### Configuration

1. **vite.config.js** - Build and dev server configuration
2. **.eslintrc.json** - Linting rules
3. **package.json** - Dependencies and scripts

## Performance Considerations

### Optimization Patterns Used

1. **Virtual Scrolling**: `react-window` for large device lists
2. **Throttle Middleware**: Custom Redux middleware to batch updates
3. **Normalized State**: Items stored by ID for O(1) lookups
4. **Memoization**: Used where appropriate with useMemo/useCallback
5. **Code Splitting**: Vite handles automatically

### Best Practices

- Use `react-window` for lists > 100 items
- Avoid inline function definitions in render
- Use Redux selectors efficiently (avoid creating new objects)
- Lazy load components with React.lazy() when appropriate

## Common Pitfalls & Solutions

### 1. Direct State Mutation

**Problem**: Mutating Redux state directly
```javascript
// ❌ Wrong
state.items[id].name = 'New Name';
```

**Solution**: Use Redux Toolkit's Immer integration
```javascript
// ✅ Correct (RTK handles immutability)
state.items[id] = { ...state.items[id], name: 'New Name' };
```

### 2. Async Error Handling

**Problem**: Unhandled async errors in useEffect
```javascript
// ❌ Wrong
useEffect(() => {
  fetch('/api/data').then(r => r.json()).then(setData);
}, []);
```

**Solution**: Use useEffectAsync
```javascript
// ✅ Correct
useEffectAsync(async () => {
  const response = await fetch('/api/data');
  if (response.ok) {
    setData(await response.json());
  } else {
    throw Error(await response.text());
  }
}, []);
```

### 3. Missing Dependencies in Hooks

**Problem**: ESLint warnings about missing dependencies
**Solution**: Include all dependencies or use exhaustive-deps ESLint rule

### 4. Backend Not Running

**Problem**: API calls fail in development
**Solution**: Ensure Traccar server is running on localhost:8082

### 5. PropTypes Warnings

**Note**: PropTypes are disabled in this project. Don't add them.

## Environment Variables

Located in `.env`:

```bash
VITE_APP_VERSION=$npm_package_version
```

**Usage in Code**:
```javascript
const version = import.meta.env.VITE_APP_VERSION;
```

**Custom Variables**:
- Must start with `VITE_` prefix
- Available via `import.meta.env`

## Debugging Tips

### Development Tools

1. **React DevTools**: Install browser extension
2. **Redux DevTools**: Install browser extension
3. **Vite DevTools**: Built into dev server

### Common Debug Scenarios

**WebSocket Issues**:
- Check browser console for connection errors
- Verify backend WebSocket endpoint
- Check SocketController.jsx for message handling

**Redux State Issues**:
- Use Redux DevTools to inspect state
- Check action dispatching
- Verify reducer logic

**Styling Issues**:
- Inspect with browser DevTools
- Check MUI theme overrides
- Verify makeStyles classes are applied

**API Issues**:
- Check Network tab in DevTools
- Verify proxy configuration in vite.config.js
- Check backend server logs

## Resources

### Official Documentation

- **Traccar Docs**: https://www.traccar.org/documentation/
- **Traccar Forums**: https://www.traccar.org/forums/
- **Traccar Server**: https://github.com/tananaev/traccar

### Technology Documentation

- **React**: https://react.dev/
- **Material-UI**: https://mui.com/
- **Redux Toolkit**: https://redux-toolkit.js.org/
- **React Router**: https://reactrouter.com/
- **MapLibre GL**: https://maplibre.org/maplibre-gl-js/docs/
- **Vite**: https://vitejs.dev/

### Community

- **Issues**: https://github.com/tananaev/traccar-web/issues
- **Discussions**: https://www.traccar.org/forums/

## Summary for AI Assistants

When working on this codebase:

1. **Language**: Write JavaScript (ES2020), not TypeScript
2. **Components**: Use functional components with arrow functions
3. **State**: Use Redux Toolkit with normalized state pattern
4. **Styling**: Use MUI's `makeStyles` with JSS
5. **Async**: Use `useEffectAsync` and `useCatch` helpers
6. **API**: Direct `fetch()` calls, no client library
7. **Real-time**: WebSocket via SocketController
8. **Linting**: Follow Airbnb style with custom rules
9. **Testing**: None currently configured
10. **Build**: Vite for dev and production

**File Organization**:
- Features in own directories (login/, reports/, settings/)
- Common code in common/ directory
- Redux slices in store/ directory
- One component per file, default export

**Key Patterns to Follow**:
- Arrow function components
- Destructured props
- useSelector/useDispatch hooks
- makeStyles for styling
- useEffectAsync for async effects
- useCatch for async handlers
- Normalized Redux state
- Material-UI components

**Before Making Changes**:
- Read CONTRIBUTING.md guidelines
- Check existing patterns in similar files
- Run `npm run lint` before committing
- Test with Traccar backend running
- Ensure changes don't break existing functionality

---

**Document Version**: 1.0
**Last Updated**: 2025-11-16
**Traccar Web Version**: 6.6.0
