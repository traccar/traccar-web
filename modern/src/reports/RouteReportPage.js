import React, { useState } from 'react';
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
} from '@material-ui/core';
import ReportFilter from './components/ReportFilter';
import { useTranslation } from '../common/components/LocalizationProvider';
import PageLayout from '../common/components/PageLayout';
import ReportsMenu from './components/ReportsMenu';
import usePersistedState from '../common/util/usePersistedState';
import PositionValue from '../common/components/PositionValue';
import ColumnSelect from './components/ColumnSelect';
import usePositionAttributes from '../common/attributes/usePositionAttributes';
import { useCatch } from '../reactHelper';

const RouteReportPage = () => {
  const t = useTranslation();

  const positionAttributes = usePositionAttributes(t);

  const [columns, setColumns] = usePersistedState('routeColumns', ['fixTime', 'latitude', 'longitude', 'speed', 'address']);
  const [items, setItems] = useState([]);

  const handleSubmit = useCatch(async (deviceId, from, to, mail, headers) => {
    const query = new URLSearchParams({
      deviceId, from, to, mail,
    });
    const response = await fetch(`/api/reports/route?${query.toString()}`, { headers });
    if (response.ok) {
      const contentType = response.headers.get('content-type');
      if (contentType) {
        if (contentType === 'application/json') {
          setItems(await response.json());
        } else {
          window.location.assign(window.URL.createObjectURL(await response.blob()));
        }
      }
    } else {
      throw Error(await response.text());
    }
  });

  return (
    <PageLayout menu={<ReportsMenu />} breadcrumbs={['reportTitle', 'reportRoute']}>
      <ReportFilter handleSubmit={handleSubmit}>
        <ColumnSelect
          columns={columns}
          setColumns={setColumns}
          columnsObject={positionAttributes}
        />
      </ReportFilter>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              {columns.map((key) => (<TableCell>{positionAttributes[key].name}</TableCell>))}
            </TableRow>
          </TableHead>
          <TableBody>
            {items.map((item) => (
              <TableRow key={item.id}>
                {columns.map((key) => (
                  <TableCell>
                    <PositionValue
                      position={item}
                      property={item.hasOwnProperty(key) ? key : null}
                      attribute={item.hasOwnProperty(key) ? null : key}
                    />
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </PageLayout>
  );
};

export default RouteReportPage;
