import AccessTimeIcon from '@mui/icons-material/AccessTime';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import SpeedIcon from '@mui/icons-material/Speed';
import RouteIcon from '@mui/icons-material/Route';
import GpsFixedIcon from '@mui/icons-material/GpsFixed';
import TerrainIcon from '@mui/icons-material/Terrain';
import ExploreIcon from '@mui/icons-material/Explore';
import BatteryFullIcon from '@mui/icons-material/BatteryFull';
import MyLocationIcon from '@mui/icons-material/MyLocation';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import DirectionsWalkIcon from '@mui/icons-material/DirectionsWalk';
import SignalCellularAltIcon from '@mui/icons-material/SignalCellularAlt';
import LayersIcon from '@mui/icons-material/Layers';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import SatelliteAltIcon from '@mui/icons-material/SatelliteAlt';
import PowerSettingsNewIcon from '@mui/icons-material/PowerSettingsNew';
import UpdateIcon from '@mui/icons-material/Update';
import StraightenIcon from '@mui/icons-material/Straighten';

const positionFieldIcons = {
  fixTime: { Icon: AccessTimeIcon, color: '#3b82f6' },
  deviceTime: { Icon: AccessTimeIcon, color: '#3b82f6' },
  serverTime: { Icon: AccessTimeIcon, color: '#6366f1' },
  address: { Icon: LocationOnIcon, color: '#e11d48' },
  speed: { Icon: SpeedIcon, color: '#f59e0b' },
  totalDistance: { Icon: RouteIcon, color: '#8b5cf6' },
  distance: { Icon: RouteIcon, color: '#8b5cf6' },
  odometer: { Icon: RouteIcon, color: '#8b5cf6' },
  tripOdometer: { Icon: RouteIcon, color: '#8b5cf6' },
  serviceOdometer: { Icon: RouteIcon, color: '#8b5cf6' },
  latitude: { Icon: GpsFixedIcon, color: '#10b981' },
  longitude: { Icon: GpsFixedIcon, color: '#10b981' },
  altitude: { Icon: TerrainIcon, color: '#14b8a6' },
  course: { Icon: ExploreIcon, color: '#6366f1' },
  batteryLevel: { Icon: BatteryFullIcon, color: '#22c55e' },
  accuracy: { Icon: MyLocationIcon, color: '#64748b' },
  valid: { Icon: CheckCircleOutlineIcon, color: '#10b981' },
  outdated: { Icon: UpdateIcon, color: '#94a3b8' },
  motion: { Icon: DirectionsWalkIcon, color: '#0ea5e9' },
  ignition: { Icon: PowerSettingsNewIcon, color: '#f97316' },
  network: { Icon: SignalCellularAltIcon, color: '#64748b' },
  rssi: { Icon: SignalCellularAltIcon, color: '#64748b' },
  geofenceIds: { Icon: LayersIcon, color: '#e11d48' },
  alarm: { Icon: WarningAmberIcon, color: '#ef4444' },
  status: { Icon: InfoOutlinedIcon, color: '#64748b' },
  sat: { Icon: SatelliteAltIcon, color: '#3b82f6' },
  satVisible: { Icon: SatelliteAltIcon, color: '#3b82f6' },
  hdop: { Icon: SatelliteAltIcon, color: '#64748b' },
  steps: { Icon: DirectionsWalkIcon, color: '#0ea5e9' },
  hours: { Icon: AccessTimeIcon, color: '#6366f1' },
  event: { Icon: InfoOutlinedIcon, color: '#8b5cf6' },
  protocol: { Icon: InfoOutlinedIcon, color: '#94a3b8' },
  index: { Icon: StraightenIcon, color: '#94a3b8' },
};

export const getPositionFieldIcon = (fieldKey) => positionFieldIcons[fieldKey] || null;

export default positionFieldIcons;
