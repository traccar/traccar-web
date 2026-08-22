import { useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import { Table, TableBody, TableCell, TableHead, TableRow } from '@mui/material';
import ReportFilter from './components/ReportFilter';
import { useTranslation } from '../common/components/LocalizationProvider';
import PageLayout from '../common/components/PageLayout';
import ReportsMenu from './components/ReportsMenu';
import ResizeHandle from './components/ResizeHandle';
import { useCatchCallback } from '../reactHelper';
import MapView from '../map/core/MapView';
import useReportStyles from './common/useReportStyles';
import TableShimmer from '../common/components/TableShimmer';
import MapCamera from '../map/MapCamera';
import MapGeofence from '../map/MapGeofence';
import { formatTime } from '../common/util/formatter';
import { prefixString } from '../common/util/stringUtils';
import { useAttributePreference } from '../common/util/preferences';
import MapMarkers from '../map/MapMarkers';
import MapRouteCoordinates from '../map/MapRouteCoordinates';
import MapScale from '../map/MapScale';
import AddressValue from '../common/components/AddressValue';
import formatEventData from './common/formatEventData';
import fetchOrThrow from '../common/util/fetchOrThrow';
import { deviceEquality } from '../common/util/deviceEquality';

const CombinedReportPage = () => {
  const { classes } = useReportStyles();
  const t = useTranslation();

  const devices = useSelector(
    (state) => state.devices.items,
    deviceEquality(['id', 'name', 'uniqueId']),
  );

  const speedUnit = useAttributePreference('speedUnit');

  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);

  const itemsCoordinates = useMemo(() => items.flatMap((item) => item.route), [items]);

  const markers = items.flatMap((item) =>
    item.events
      .map((event) => item.positions.find((p) => event.positionId === p.id))
      .filter((position) => position != null)
      .map((position) => ({
        latitude: position.latitude,
        longitude: position.longitude,
      })),
  );

  const onShow = useCatchCallback(async ({ deviceIds, groupIds, from, to }) => {
    const query = new URLSearchParams({ from, to });
    deviceIds.forEach((deviceId) => query.append('deviceId', deviceId));
    groupIds.forEach((groupId) => query.append('groupId', groupId));
    setLoading(true);
    try {
      const response = await fetchOrThrow(`/api/reports/combined?${query.toString()}`);
      setItems(await response.json());
    } finally {
      setLoading(false);
    }
  }, []);

  return (
    <PageLayout menu={<ReportsMenu />} breadcrumbs={['reportTitle', 'reportCombined']}>
      <div className={classes.container}>
        {Boolean(items.length) && (
          <>
            <div className={classes.containerMap}>
              <MapView>
                <MapGeofence />
                {items.map((item) => (
                  <MapRouteCoordinates
                    key={item.deviceId}
                    name={devices[item.deviceId].name}
                    coordinates={item.route}
                    deviceId={item.deviceId}
                  />
                ))}
                <MapMarkers markers={markers} />
              </MapView>
              <MapScale />
              <MapCamera coordinates={itemsCoordinates} />
            </div>
            <ResizeHandle />
          </>
        )}
        <div className={classes.containerMain}>
          <div className={classes.header}>
            <ReportFilter onShow={onShow} deviceType="multiple" loading={loading} />
          </div>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>{t('sharedDevice')}</TableCell>
                <TableCell>{t('positionFixTime')}</TableCell>
                <TableCell>{t('sharedType')}</TableCell>
                <TableCell>{t('positionAddress')}</TableCell>
                <TableCell>{t('commandData')}</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {!loading ? (
                items.flatMap((item) =>
                  item.events.map((event, index) => {
                    const position = item.positions.find((p) => p.id === event.positionId);
                    return (
                      <TableRow key={event.id}>
                        <TableCell>{index ? '' : devices[item.deviceId].name}</TableCell>
                        <TableCell>{formatTime(event.eventTime, 'seconds')}</TableCell>
                        <TableCell>{t(prefixString('event', event.type))}</TableCell>
                        <TableCell>
                          {position && (
                            <AddressValue
                              latitude={position.latitude}
                              longitude={position.longitude}
                              originalAddress={position.address}
                            />
                          )}
                        </TableCell>
                        <TableCell>
                          {formatEventData(event, {
                            deviceUniqueId: devices[item.deviceId]?.uniqueId,
                            speedUnit,
                            t,
                          })}
                        </TableCell>
                      </TableRow>
                    );
                  }),
                )
              ) : (
                <TableShimmer columns={5} />
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </PageLayout>
  );
};

export default CombinedReportPage;
