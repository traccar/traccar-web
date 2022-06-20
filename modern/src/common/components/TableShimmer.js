import React from 'react';
import { Skeleton, TableCell, TableRow } from '@mui/material';

const TableShimmer = ({ columns }) => [...Array(3)].map(() => (
  <TableRow>
    {[...Array(columns)].map(() => (
      <TableCell>
        <Skeleton />
      </TableCell>
    ))}
  </TableRow>
));

export default TableShimmer;
