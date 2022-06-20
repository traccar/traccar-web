import React from 'react';
import { Skeleton, TableCell, TableRow } from '@mui/material';

const TableShimmer = ({ columns, startAction, endAction }) => [...Array(3)].map(() => (
  <TableRow>
    {[...Array(columns)].map((_, i) => {
      const action = (startAction && i === 0) || (endAction && i === columns - 1);
      return (
        <TableCell padding={action ? 'none' : 'normal'}>
          {!action && <Skeleton />}
        </TableCell>
      );
    })}
  </TableRow>
));

export default TableShimmer;
