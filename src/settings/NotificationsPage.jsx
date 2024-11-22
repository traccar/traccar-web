import React, { useState, useMemo } from "react";
import {
  Table,
  TableRow,
  TableCell,
  TableHead,
  TableBody,
  Button,
  FormControlLabel,
  Switch,
  TableContainer,
  TablePagination,
  Paper,
  Checkbox,
  Box,
  TableSortLabel,
  Toolbar,
  Typography,
  IconButton,
  Tooltip,
  TextField,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import FilterListIcon from "@mui/icons-material/FilterList";
import { visuallyHidden } from "@mui/utils";
import { useEffectAsync } from "../reactHelper";
import { prefixString } from "../common/util/stringUtils";
import { formatBoolean } from "../common/util/formatter";
import { useTranslation } from "../common/components/LocalizationProvider";
import PageLayout from "../common/components/PageLayout";
import SettingsMenu from "./components/SettingsMenu";
import TableShimmer from "../common/components/TableShimmer";
import SearchHeader, { filterByKeyword } from "./components/SearchHeader";
import useSettingsStyles from "./common/useSettingsStyles";
import { Add, Search } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
const NotificationsPage = () => {
  const classes = useSettingsStyles();
  const t = useTranslation();
  const navigate = useNavigate();
  const [timestamp, setTimestamp] = useState(Date.now());
  const [items, setItems] = useState([]);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [loading, setLoading] = useState(false);
  const [order, setOrder] = useState("asc");
  const [orderBy, setOrderBy] = useState("description");
  const [selected, setSelected] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  useEffectAsync(async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/notifications");
      if (response.ok) {
        setItems(await response.json());
      } else {
        throw Error(await response.text());
      }
    } finally {
      setLoading(false);
    }
  }, [timestamp]);

  const formatList = (prefix, value) => {
    if (value) {
      return value
        .split(/[, ]+/)
        .filter(Boolean)
        .map((it) => t(prefixString(prefix, it)))
        .join(", ");
    }
    return "";
  };

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelected = items.map((item) => item.id);
      setSelected(newSelected);
      return;
    }
    setSelected([]);
  };

  const handleClick = (event, id) => {
    const selectedIndex = selected.indexOf(id);
    let newSelected = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, id);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1)
      );
    }
    setSelected(newSelected);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const headCells = [
    { id: "description", label: t("sharedDescription"), numeric: false },
    { id: "type", label: t("notificationType"), numeric: false },
    { id: "always", label: t("notificationAlways"), numeric: false },
    { id: "alarms", label: t("sharedAlarms"), numeric: false },
    { id: "notificators", label: t("notificationNotificators"), numeric: false },
  ];

  const sortedItems = useMemo(
    () =>
      items
        .slice()
        .sort((a, b) =>
          order === "asc"
            ? a[orderBy]?.localeCompare?.(b[orderBy])
            : b[orderBy]?.localeCompare?.(a[orderBy])
        ),
    [items, order, orderBy]
  );

  const visibleItems = useMemo(
    () => sortedItems.filter(filterByKeyword(searchKeyword)),
    [sortedItems, searchKeyword]
  );

  const displayedItems = useMemo(
    () =>
      visibleItems.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage),
    [visibleItems, page, rowsPerPage]
  );

  const handleNavigate=()=>{
    console.log("sadsadasdasdasdasdasdasdas")
    navigate('/settings/notification')
      }

  return (
    <Box sx={{ marginTop: "20px" }}>
      <PageLayout
        menu={<SettingsMenu />}
        breadcrumbs={["settingsTitle", "sharedNotifications"]}
      >
        <Box m="30px" display="flex" alignItems="center" mb={5}>
          <Typography variant="h5" sx={{ flex: 1 }}>
            {t("sharedNotifications")}
          </Typography>
          <Button  variant="contained" startIcon={<Add />} onClick={handleNavigate}>
            {t("newNotification")} New Notification
          </Button>
        </Box>

        <Paper
          sx={{
            m: "30px",
            borderRadius: "10px",
          }}
        >
          <Toolbar>
            <Box
              sx={{
                flex: 1,
                mt: 2,
                mb: 2,
              }}
            >
              <TextField
                variant="outlined"
                placeholder="Search Notification..."
                size="small"
                value={searchKeyword}
                onChange={(e) => setSearchKeyword(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <IconButton edge="start" size="small" sx={{ mr: 1 }}>
                      <Search />
                    </IconButton>
                  ),
                }}
                sx={{
                  flex: 1,
                  maxWidth: "400px",
                  backgroundColor: "white",
                  padding: "10px",
                  borderRadius: "8px",
                  "& .MuiOutlinedInput-root": {
                    backgroundColor: "white",
                  },
                }}
              />
            </Box>
            {selected.length > 0 ? (
              <Tooltip title={t("delete")}>
                <IconButton>
                  <DeleteIcon
                    sx={{
                      color: "red",
                    }}
                  />
                </IconButton>
              </Tooltip>
            ) : (
              <Tooltip title={t("filter")}>
                <IconButton>
                  <FilterListIcon />
                </IconButton>
              </Tooltip>
            )}
          </Toolbar>
          <TableContainer>
            <Table>
              <TableHead
                sx={{
                  backgroundColor: "#F4F6F8",
                }}
              >
                <TableRow>
                  <TableCell padding="checkbox">
                    <Checkbox
                      color="primary"
                      indeterminate={
                        selected.length > 0 && selected.length < items.length
                      }
                      checked={
                        items.length > 0 && selected.length === items.length
                      }
                      onChange={handleSelectAllClick}
                    />
                  </TableCell>
                  {headCells.map((cell) => (
                    <TableCell key={cell.id}>
                      <TableSortLabel
                        active={orderBy === cell.id}
                        direction={orderBy === cell.id ? order : "asc"}
                        onClick={(e) => handleRequestSort(e, cell.id)}
                      >
                        {cell.label}
                        {orderBy === cell.id && (
                          <Box component="span" sx={visuallyHidden}>
                            {order === "desc"
                              ? "sorted descending"
                              : "sorted ascending"}
                          </Box>
                        )}
                      </TableSortLabel>
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {!loading ? (
                  displayedItems.map((item) => {
                    const isSelected = selected.includes(item.id);
                    return (
                      <TableRow
                        key={item.id}
                        onClick={(e) => handleClick(e, item.id)}
                        selected={isSelected}
                      >
                        <TableCell padding="checkbox">
                          <Checkbox checked={isSelected} />
                        </TableCell>
                        <TableCell>{item.description}</TableCell>
                        <TableCell>{t(prefixString("event", item.type))}</TableCell>
                        <TableCell>
                          {formatBoolean(item.always, t)}
                        </TableCell>
                        <TableCell>
                          {formatList("alarm", item.attributes?.alarms)}
                        </TableCell>
                        <TableCell>
                          {formatList("notificator", item.notificators)}
                        </TableCell>
                      </TableRow>
                    );
                  })
                ) : (
                  <TableShimmer columns={headCells.length + 1} />
                )}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            rowsPerPageOptions={[5, 10, 20]}
            component="div"
            count={visibleItems.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Paper>
      </PageLayout>
    </Box>
  );
};

export default NotificationsPage;
