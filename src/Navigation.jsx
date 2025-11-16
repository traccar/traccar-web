import {
  Route, Routes,
  useSearchParams,
} from 'react-router-dom';
import { useDispatch } from 'react-redux';
import MainPage from './main/MainPage';
import CombinedReportPage from './reports/CombinedReportPage';
import PositionsReportPage from './reports/PositionsReportPage';
import ServerPage from './settings/ServerPage';
import UsersPage from './settings/UsersPage';
import DevicePage from './settings/DevicePage';
import UserPage from './settings/UserPage';
import NotificationsPage from './settings/NotificationsPage';
import NotificationPage from './settings/NotificationPage';
import GroupsPage from './settings/GroupsPage';
import GroupPage from './settings/GroupPage';
import PositionPage from './other/PositionPage';
import NetworkPage from './other/NetworkPage';
import EventReportPage from './reports/EventReportPage';
import ReplayPage from './other/ReplayPage';
import TripReportPage from './reports/TripReportPage';
import StopReportPage from './reports/StopReportPage';
import SummaryReportPage from './reports/SummaryReportPage';
import ChartReportPage from './reports/ChartReportPage';
import DriversPage from './settings/DriversPage';
import DriverPage from './settings/DriverPage';
import CalendarsPage from './settings/CalendarsPage';
import CalendarPage from './settings/CalendarPage';
import ComputedAttributesPage from './settings/ComputedAttributesPage';
import ComputedAttributePage from './settings/ComputedAttributePage';
import MaintenancesPage from './settings/MaintenancesPage';
import MaintenancePage from './settings/MaintenancePage';
import CommandsPage from './settings/CommandsPage';
import CommandPage from './settings/CommandPage';
import StatisticsPage from './reports/StatisticsPage';
import LoginPage from './login/LoginPage';
import RegisterPage from './login/RegisterPage';
import ResetPasswordPage from './login/ResetPasswordPage';
import GeofencesPage from './other/GeofencesPage';
import GeofencePage from './settings/GeofencePage';
import { useEffectAsync } from './reactHelper';
import { devicesActions } from './store';
import EventPage from './other/EventPage';
import PreferencesPage from './settings/PreferencesPage';
import AccumulatorsPage from './settings/AccumulatorsPage';
import CommandDevicePage from './settings/CommandDevicePage';
import CommandGroupPage from './settings/CommandGroupPage';
import App from './App';
import ChangeServerPage from './login/ChangeServerPage';
import DevicesPage from './settings/DevicesPage';
import ScheduledPage from './reports/ScheduledPage';
import DeviceConnectionsPage from './settings/DeviceConnectionsPage';
import GroupConnectionsPage from './settings/GroupConnectionsPage';
import UserConnectionsPage from './settings/UserConnectionsPage';
import LogsPage from './reports/LogsPage';
import SharePage from './settings/SharePage';
import AnnouncementPage from './settings/AnnouncementPage';
import EmulatorPage from './other/EmulatorPage';
import Loader from './common/components/Loader';
import { generateLoginToken } from './common/components/NativeInterface';
import { useLocalization } from './common/components/LocalizationProvider';
import fetchOrThrow from './common/util/fetchOrThrow';
import AuditPage from './reports/AuditPage';

const Navigation = () => {
  const dispatch = useDispatch();
  const { setLocalLanguage } = useLocalization();

  const [searchParams, setSearchParams] = useSearchParams();

  const hasQueryParams = ['locale', 'token', 'uniqueId', 'openid'].some(key => searchParams.has(key));

  useEffectAsync(async () => {
    if (!hasQueryParams) {
      return;
    }

    const newParams = new URLSearchParams(searchParams);

    if (searchParams.has('locale')) {
      setLocalLanguage(searchParams.get('locale'));
      newParams.delete('locale');
    }

    if (searchParams.has('token')) {
      const token = searchParams.get('token');
      await fetch(`/api/session?token=${encodeURIComponent(token)}`);
      newParams.delete('token');
    }

    if (searchParams.has('uniqueId')) {
      const response = await fetchOrThrow(`/api/devices?uniqueId=${searchParams.get('uniqueId')}`);
      const items = await response.json();
      if (items.length > 0) {
        dispatch(devicesActions.selectId(items[0].id));
      }
      newParams.delete('uniqueId');
    }

    if (searchParams.has('openid')) {
      if (searchParams.get('openid') === 'success') {
        generateLoginToken();
      }
      newParams.delete('openid');
    }

    setSearchParams(newParams, { replace: true });
  }, [hasQueryParams, searchParams, setSearchParams]);

  if (hasQueryParams) {
    return (<Loader />);
  }
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/reset-password" element={<ResetPasswordPage />} />
      <Route path="/change-server" element={<ChangeServerPage />} />
      <Route path="/" element={<App />}>
        <Route index element={<MainPage />} />

        <Route path="position/:id" element={<PositionPage />} />
        <Route path="network/:positionId" element={<NetworkPage />} />
        <Route path="event/:id" element={<EventPage />} />
        <Route path="replay" element={<ReplayPage />} />
        <Route path="geofences" element={<GeofencesPage />} />
        <Route path="emulator" element={<EmulatorPage />} />

        <Route path="settings">
          <Route path="accumulators/:deviceId" element={<AccumulatorsPage />} />
          <Route path="announcement" element={<AnnouncementPage />} />
          <Route path="calendars" element={<CalendarsPage />} />
          <Route path="calendar/:id" element={<CalendarPage />} />
          <Route path="calendar" element={<CalendarPage />} />
          <Route path="commands" element={<CommandsPage />} />
          <Route path="command/:id" element={<CommandPage />} />
          <Route path="command" element={<CommandPage />} />
          <Route path="attributes" element={<ComputedAttributesPage />} />
          <Route path="attribute/:id" element={<ComputedAttributePage />} />
          <Route path="attribute" element={<ComputedAttributePage />} />
          <Route path="devices" element={<DevicesPage />} />
          <Route path="device/:id/connections" element={<DeviceConnectionsPage />} />
          <Route path="device/:id/command" element={<CommandDevicePage />} />
          <Route path="device/:id/share" element={<SharePage />} />
          <Route path="device/:id" element={<DevicePage />} />
          <Route path="device" element={<DevicePage />} />
          <Route path="drivers" element={<DriversPage />} />
          <Route path="driver/:id" element={<DriverPage />} />
          <Route path="driver" element={<DriverPage />} />
          <Route path="geofence/:id" element={<GeofencePage />} />
          <Route path="geofence" element={<GeofencePage />} />
          <Route path="groups" element={<GroupsPage />} />
          <Route path="group/:id/connections" element={<GroupConnectionsPage />} />
          <Route path="group/:id/command" element={<CommandGroupPage />} />
          <Route path="group/:id" element={<GroupPage />} />
          <Route path="group" element={<GroupPage />} />
          <Route path="maintenances" element={<MaintenancesPage />} />
          <Route path="maintenance/:id" element={<MaintenancePage />} />
          <Route path="maintenance" element={<MaintenancePage />} />
          <Route path="notifications" element={<NotificationsPage />} />
          <Route path="notification/:id" element={<NotificationPage />} />
          <Route path="notification" element={<NotificationPage />} />
          <Route path="preferences" element={<PreferencesPage />} />
          <Route path="server" element={<ServerPage />} />
          <Route path="users" element={<UsersPage />} />
          <Route path="user/:id/connections" element={<UserConnectionsPage />} />
          <Route path="user/:id" element={<UserPage />} />
          <Route path="user" element={<UserPage />} />
        </Route>

        <Route path="reports">
          <Route path="combined" element={<CombinedReportPage />} />
          <Route path="chart" element={<ChartReportPage />} />
          <Route path="events" element={<EventReportPage />} />
          <Route path="route" element={<PositionsReportPage />} />
          <Route path="stops" element={<StopReportPage />} />
          <Route path="summary" element={<SummaryReportPage />} />
          <Route path="trips" element={<TripReportPage />} />
          <Route path="scheduled" element={<ScheduledPage />} />
          <Route path="statistics" element={<StatisticsPage />} />
          <Route path="audit" element={<AuditPage />} />
          <Route path="logs" element={<LogsPage />} />
        </Route>
      </Route>
    </Routes>
  );
};

export default Navigation;
