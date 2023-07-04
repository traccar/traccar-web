import React, { Fragment, useCallback, useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
  IconButton, Skeleton,
} from '@mui/material';
import GpsFixedIcon from '@mui/icons-material/GpsFixed';
import LocationSearchingIcon from '@mui/icons-material/LocationSearching';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';
import AutoSizer from 'react-virtualized-auto-sizer';
import { FixedSizeGrid } from 'react-window';
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

const RouteReportPage = () => {
  const navigate = useNavigate();
  const classes = useReportStyles();
  const t = useTranslation();
  const theme = useTheme();

  const phone = useMediaQuery(theme.breakpoints.down('md'));
  const desktop = useMediaQuery(theme.breakpoints.up('lg'));

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
        <div className={classes.containerMain} style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
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
          <div style={{ flex: 1 }}>
            <AutoSizer>
              {({ height, width }) => (
                <FixedSizeGrid
                  height={height}
                  width={width}
                  columnCount={columns.length + 2}
                  columnWidth={(columns.length + 2) * (width * (phone ? 0.26 : desktop ? 0.1 : 0.18)) >= width ?
                    width * (phone ? 0.26 : desktop ? 0.1 : 0.18) : width / (columns.length + 2)}
                  rowCount={items.length > 0 ? items.length : 5}
                  rowHeight={52}
                  overscanRowCount={20}
                >
                  {({ columnIndex, rowIndex, style }) => {
                    const item = items[rowIndex];
                    const columnKey = columns[columnIndex - 2];
                    return (
                      rowIndex === 0 ?
                        columnIndex === 0 ?
                          (
                            <div className={classes.cellStyle} style={style} />
                          )
                          :
                          columnIndex === 1 ?
                            (
                              <div className={classes.cellStyle} style={style}>
                                <b>{t('sharedDevice')}</b>
                              </div>
                            ) :
                            columnIndex < columns.length + 2 ?
                              (
                                <div className={classes.cellStyle} style={style}>
                                  <b>{positionAttributes[columnKey]?.name || columnKey}</b>
                                </div>
                              )
                              :
                              null
                        :
                        !loading ?
                          item ?
                            columnIndex === 0 ?
                              (
                                <div className={`${classes.cellStyle} ${classes.columnAction}`} style={style}>
                                  {selectedItem === item ?
                                    (
                                      <IconButton size="small" onClick={() => setSelectedItem(null)}>
                                        <GpsFixedIcon fontSize="small" />
                                      </IconButton>
                                    )
                                    :
                                    (
                                      <IconButton size="small" onClick={() => setSelectedItem(item)}>
                                        <LocationSearchingIcon fontSize="small" />
                                      </IconButton>
                                    )}
                                </div>
                              )
                              :
                              columnIndex === 1 ?
                                (
                                  <div className={classes.cellStyle} style={style}>
                                    {devices[item.deviceId].name}
                                  </div>
                                )
                                :
                                (
                                  <div className={classes.cellStyle} style={style}>
                                    <PositionValue
                                      position={item}
                                      property={item.hasOwnProperty(columnKey) ? columnKey : null}
                                      attribute={item.hasOwnProperty(columnKey) ? null : columnKey}
                                    />
                                  </div>
                                )
                            :
                            null
                          :
                          (
                            <div className={classes.cellStyle} style={style}>
                              <Skeleton variant="text" width={width / (columns.length * 1.5)} />
                            </div>
                          )
                    );
                  }}
                </FixedSizeGrid>
              )}
            </AutoSizer>
          </div>
        </div>
      </div>
    </PageLayout>
  );
};

export default RouteReportPage;
