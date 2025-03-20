import React, { Fragment, useCallback, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
  IconButton, Table, TableBody, TableCell, TableHead, TableRow,
} from '@mui/material';
import { useDispatch } from 'react-redux';
import GpsFixedIcon from '@mui/icons-material/GpsFixed';
import LocationSearchingIcon from '@mui/icons-material/LocationSearching';
import CatchFilter from './components/CatchFilter';
import { useTranslation } from '../common/components/LocalizationProvider';
import PageLayout from '../common/components/PageLayout';
import ReportsMenu from './components/ReportsMenu';
import PositionValue from '../common/components/PositionValue';
import ColumnSelect from './components/ColumnSelect';
import usePositionAttributes from '../common/attributes/usePositionAttributes';
import { useCatch } from '../reactHelper';
import useReportStyles from './common/useReportStyles';
import TableShimmer from '../common/components/TableShimmer';
import { fishCatchData } from '../common/components/FishCatchMock';
import { catchActions} from '../store';

const CatchReportPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const classes = useReportStyles();
  const t = useTranslation();

  const catches = useSelector((state) => state.catch.items);

//   const [available, setAvailable] = useState([]);
//   const [columns, setColumns] = useState(['fixTime', 'latitude', 'longitude', 'speed', 'address']);
//   const [items, setItems] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [selectedItem, setSelectedItem] = useState(null);


    useEffect(() => {
    //This is to be added on success of get catches API call
        dispatch(catchActions.catchRecords(fishCatchData));
    }, []);

    return (
    <PageLayout menu={<ReportsMenu />} breadcrumbs={['reportTitle', 'reportRoute']}>
      <div className={classes.container}>
        <div className={classes.containerMain}>
        <>
        {'Catch Reports'}
        </>
          <div className={classes.header}>
             <CatchFilter handleSubmit={handleSubmit} handleSchedule={handleSchedule} multiDevice loading={loading}>
              <ColumnSelect
                columns={columns}
                setColumns={setColumns}
                columnsArray={available}
                rawValues
                disabled={!items.length}
              />
            </CatchFilter>
          </div>
          {/* <Table>
            <TableHead>
              <TableRow>
                <TableCell className={classes.columnAction} />
                <TableCell>{t('sharedDevice')}</TableCell>
                {columns.map((key) => (<TableCell key={key}>{positionAttributes[key]?.name || key}</TableCell>))}
              </TableRow>
            </TableHead>
            <TableBody>
              {!loading ? items.slice(0, 4000).map((item) => (
                <TableRow key={item.id}>
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
                </TableRow>
              )) : (<TableShimmer columns={columns.length + 2} startAction />)}
            </TableBody>
          </Table>  */}
        </div>
      </div>
    </PageLayout>
  );
};

export default CatchReportPage;
