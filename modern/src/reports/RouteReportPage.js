import React, { Fragment, useCallback, useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
  IconButton, Table, TableBody, TableCell, TableHead, TableRow,
} from '@mui/material';
import GpsFixedIcon from '@mui/icons-material/GpsFixed';
import LocationSearchingIcon from '@mui/icons-material/LocationSearching';
// eslint-disable-next-line import/no-extraneous-dependencies
import { TableVirtuoso } from 'react-virtuoso';
import TableContainer from '@mui/material/TableContainer';
import ReportFilter from './components/ReportFilter';
import { useTranslation } from '../common/components/LocalizationProvider';
import PageLayout from '../common/components/PageLayout';
import ReportsMenu from './components/ReportsMenu';
import PositionValue from '../common/components/PositionValue';
import ColumnSelect from './components/ColumnSelect';
import usePositionAttributes from '../common/attributes/usePositionAttributes';
import { useCatch } from '../reactHelper';
import MapView from '../map/core/MapView';
import MapRoutePath from '../map/MapRoutePath';
import MapRoutePoints from '../map/MapRoutePoints';
import MapPositions from '../map/MapPositions';
import useReportStyles from './common/useReportStyles';
import MapCamera from '../map/MapCamera';
import MapGeofence from '../map/MapGeofence';
import scheduleReport from './common/scheduleReport';

const VirtuosoTableComponents = {
  Scroller: React.forwardRef((props, ref) => (
    <TableContainer {...props} ref={ref} />
  )),
  Table: (props) => (
    <Table {...props} />
  ),
  TableHead,
  TableRow: ({ item: _item, ...props }) => <TableRow {...props} />,
  TableBody: React.forwardRef((props, ref) => <TableBody {...props} ref={ref} />),
};

const RouteReportPage = () => {
  const navigate = useNavigate();
  const classes = useReportStyles();
  const t = useTranslation();

  const positionAttributes = usePositionAttributes(t);

  const devices = useSelector((state) => state.devices.items);

  const [available, setAvailable] = useState([]);
  const [columns, setColumns] = useState(['fixTime', 'latitude', 'longitude', 'speed', 'address']);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  const onMapPointClick = useCallback((positionId) => {
    setSelectedItem(items.find((it) => it.id === positionId));
  }, [items, setSelectedItem]);

  const handleSubmit = useCatch(async ({ deviceIds, from, to, type }) => {
    const query = new URLSearchParams({ from, to });
    deviceIds.forEach((deviceId) => query.append('deviceId', deviceId));
    if (type === 'export') {
      window.location.assign(`/api/reports/route/xlsx?${query.toString()}`);
    } else if (type === 'mail') {
      const response = await fetch(`/api/reports/route/mail?${query.toString()}`);
      if (!response.ok) {
        throw Error(await response.text());
      }
    } else {
      setLoading(true);
      try {
        const response = await fetch(`/api/reports/route?${query.toString()}`, {
          headers: { Accept: 'application/json' },
        });
        if (response.ok) {
          const data = await response.json();
          const keySet = new Set();
          const keyList = [];
          data.forEach((position) => {
            Object.keys(position).forEach((it) => keySet.add(it));
            Object.keys(position.attributes).forEach((it) => keySet.add(it));
          });
          ['id', 'deviceId', 'outdated', 'network', 'attributes'].forEach((key) => keySet.delete(key));
          Object.keys(positionAttributes).forEach((key) => {
            if (keySet.has(key)) {
              keyList.push(key);
              keySet.delete(key);
            }
          });
          setAvailable([...keyList, ...keySet].map((key) => [key, positionAttributes[key]?.name || key]));
          setItems(data);
        } else {
          throw Error(await response.text());
        }
      } finally {
        setLoading(false);
      }
    }
  });

  const handleSchedule = useCatch(async (deviceIds, groupIds, report) => {
    report.type = 'route';
    const error = await scheduleReport(deviceIds, groupIds, report);
    if (error) {
      throw Error(error);
    } else {
      navigate('/reports/scheduled');
    }
  });

  const fixedHeaderContent = () => (
    <TableRow style={{ backgroundColor: 'white' }}>
      <TableCell className={classes.columnAction} />
      <TableCell>{t('sharedDevice')}</TableCell>
      {columns.map((key) => (
        <TableCell
          key={key}
          variant="head"
          align={key.numeric || false ? 'right' : 'left'}
        >
          {positionAttributes[key]?.name || key}
        </TableCell>
      ))}
    </TableRow>
  );

  const rowContent = (_index, item) => (
    <>
      <TableCell className={classes.columnAction} padding="none">
        {selectedItem === item ? (
          <IconButton size="small" onClick={() => setSelectedItem(null)}>
            <GpsFixedIcon fontSize="small" />
          </IconButton>
        ) : (
          <IconButton size="small" onClick={() => setSelectedItem(item)}>
            <LocationSearchingIcon fontSize="small" />
          </IconButton>
        )}
      </TableCell>
      <TableCell>{devices[item.deviceId].name}</TableCell>
      {columns.map((key) => (
        <TableCell key={key}>
          <PositionValue
            position={item}
            property={item.hasOwnProperty(key) ? key : null}
            attribute={item.hasOwnProperty(key) ? null : key}
          />
        </TableCell>
      ))}
    </>
  );

  return (
    <PageLayout menu={<ReportsMenu />} breadcrumbs={['reportTitle', 'reportRoute']}>
      <div className={classes.container}>
        {selectedItem && (
          <div className={classes.containerMap}>
            <MapView>
              <MapGeofence />
              {[...new Set(items.map((it) => it.deviceId))].map((deviceId) => {
                const positions = items.filter((position) => position.deviceId === deviceId);
                return (
                  <Fragment key={deviceId}>
                    <MapRoutePath positions={positions} />
                    <MapRoutePoints positions={positions} onClick={onMapPointClick} />
                  </Fragment>
                );
              })}
              <MapPositions positions={[selectedItem]} titleField="fixTime" />
            </MapView>
            <MapCamera positions={items} />
          </div>
        )}
        <div>
          <div className={classes.header}>
            <ReportFilter handleSubmit={handleSubmit} handleSchedule={handleSchedule} multiDevice>
              <ColumnSelect
                columns={columns}
                setColumns={setColumns}
                columnsArray={available}
                rawValues
                disabled={!items.length}
              />
            </ReportFilter>
          </div>
        </div>
        {!loading && (
          <TableVirtuoso
            data={items}
            components={VirtuosoTableComponents}
            fixedHeaderContent={fixedHeaderContent}
            itemContent={rowContent}
          />
        )}
      </div>
    </PageLayout>
  );
};

export default RouteReportPage;
