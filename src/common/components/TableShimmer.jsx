import { Skeleton, TableCell, TableRow } from '@mui/material';

const TableShimmer = ({ columns, startAction, endAction, ref }) =>
  [...Array(3)].map((_, i) => (
    <TableRow key={-i} ref={i === 0 ? ref : null}>
      {[...Array(columns)].map((_, j) => {
        const action = (startAction && j === 0) || (endAction && j === columns - 1);
        return (
          <TableCell key={-j} padding={action ? 'none' : 'normal'}>
            {!action && <Skeleton />}
          </TableCell>
        );
      })}
    </TableRow>
  ));

export default TableShimmer;
