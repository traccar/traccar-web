import { useState, useCallback, useEffect } from "react";
import { Paper, IconButton, Drawer } from "@mui/material";
import { makeStyles } from "tss-react/mui";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";

import { useDispatch, useSelector } from "react-redux";
import DeviceList from "./DeviceList";
import BottomMenu from "../common/components/BottomMenu";
import StatusCard from "../common/components/StatusCard";
import { devicesActions } from "../store";
import usePersistedState from "../common/util/usePersistedState";
import EventsDrawer from "./EventsDrawer";
import useFilter from "./useFilter";
import MainToolbar from "./MainToolbar";
import MainMap from "./MainMap";
import { useAttributePreference } from "../common/util/preferences";

const useStyles = makeStyles()((theme) => ({
  root: {
    height: "100%",
  },
  topbar: {
    pointerEvents: "none",
    display: "flex",
    flexDirection: "column",
    [theme.breakpoints.up("md")]: {
      alignItems: "stretch",
      display: "flex",
      flexDirection: "row",
      justifyItems: "center",

      position: "fixed",
      top: 0,
      left: "50%",
      transform: "translateX(-50%)",
      zIndex: 3,
    },
    [theme.breakpoints.down("md")]: {
      height: "100%",
      width: "100%",
    },
  },
  header: {
    pointerEvents: "auto",
    zIndex: 6,
    [theme.breakpoints.up("md")]: {
      height: "fit-content",
      // borderTopLeftRadius: "20px",
    },
  },
  navMenu: {
    pointerEvents: "auto",
    zIndex: 5,
    [theme.breakpoints.up("md")]: {
      display: "flex",
      overflow: "visible",
      position: "relative",
    },
  },
  middleList: {
    // flex: 1,
    height: "100%",
    display: "grid",
    [theme.breakpoints.up("md")]: {},
  },
  contentMap: {
    pointerEvents: "auto",
    gridArea: "1 / 1",
  },
  contentList: {
    pointerEvents: "auto",
    gridArea: "1 / 1",
    zIndex: 4,
    backgroundColor: "none",
    [theme.breakpoints.up("md")]: {
      height: "100%",
    },
  },
}));

const MainPage = () => {
  const { classes } = useStyles();
  const dispatch = useDispatch();
  const theme = useTheme();

  const desktop = useMediaQuery(theme.breakpoints.up("md"));

  const mapOnSelect = useAttributePreference("mapOnSelect", true);

  const selectedDeviceId = useSelector((state) => state.devices.selectedId);
  const positions = useSelector((state) => state.session.positions);
  const [filteredPositions, setFilteredPositions] = useState([]);
  const selectedPosition = filteredPositions.find(
    (position) => selectedDeviceId && position.deviceId === selectedDeviceId
  );

  const [filteredDevices, setFilteredDevices] = useState([]);

  const [keyword, setKeyword] = useState("");
  const [filter, setFilter] = usePersistedState("filter", {
    statuses: [],
    groups: [],
  });
  const [filterSort, setFilterSort] = usePersistedState("filterSort", "");
  const [filterMap, setFilterMap] = usePersistedState("filterMap", false);

  const [devicesOpen, setDevicesOpen] = useState(desktop);
  const [eventsOpen, setEventsOpen] = useState(false);

  const onEventsClick = useCallback(() => setEventsOpen(true), [setEventsOpen]);

  useEffect(() => {
    if (!desktop && mapOnSelect && selectedDeviceId) {
      setDevicesOpen(false);
    }
  }, [desktop, mapOnSelect, selectedDeviceId]);

  useFilter(
    keyword,
    filter,
    filterSort,
    filterMap,
    positions,
    setFilteredDevices,
    setFilteredPositions
  );

  return (
    <div className={classes.root}>
      {desktop && (
        <>
          <MainMap
            filteredPositions={filteredPositions}
            selectedPosition={selectedPosition}
            onEventsClick={onEventsClick}
          />
          <IconButton
            onClick={() => setDevicesOpen(!devicesOpen)}
            sx={{
              position: "absolute",
              left: devicesOpen ? 400 : 0, // Btn moves with List
              top: "50%",
              transform: "translateY(-50%)",
              padding: theme.spacing(7, 0.5),
              backgroundColor: theme.palette.background.paper,
              borderRadius: "0 15px 15px 0",
              boxShadow: 1,
              zIndex: 1301, // Upper than drawer
              transition: "left 0.2s ease-out", // animation - smooth
            }}>
            {devicesOpen ? <CloseIcon /> : <MenuIcon />}
          </IconButton>
          <Drawer
            variant="persistent"
            anchor="left"
            open={devicesOpen}
            sx={{
              width: 400,
              flexShrink: 0,
              "& .MuiDrawer-paper": {
                width: 400,
                boxSizing: "border-box",
              },
            }}>
            <div className={classes.middleList}>
              <DeviceList devices={filteredDevices} />
            </div>
          </Drawer>
        </>
      )}
      <div className={classes.topbar}>
        {desktop && (
          <div className={classes.navMenu}>
            <Paper
              elevation={3}
              style={{
                borderRadius: "0 0 15px 15px",
                display: "flex",
                padding: ".5rem",
              }}>
              <BottomMenu
                setDevicesOpen={setDevicesOpen}
                devicesOpen={devicesOpen}
              />
              <MainToolbar
                filteredDevices={filteredDevices}
                devicesOpen={devicesOpen}
                setDevicesOpen={setDevicesOpen}
                keyword={keyword}
                setKeyword={setKeyword}
                filter={filter}
                setFilter={setFilter}
                filterSort={filterSort}
                setFilterSort={setFilterSort}
                filterMap={filterMap}
                setFilterMap={setFilterMap}
              />
            </Paper>
          </div>
        )}
        {!desktop && (
          <Paper square elevation={3} className={classes.header}>
            <MainToolbar
              filteredDevices={filteredDevices}
              devicesOpen={devicesOpen}
              setDevicesOpen={setDevicesOpen}
              keyword={keyword}
              setKeyword={setKeyword}
              filter={filter}
              setFilter={setFilter}
              filterSort={filterSort}
              setFilterSort={setFilterSort}
              filterMap={filterMap}
              setFilterMap={setFilterMap}
            />
          </Paper>
        )}
        {!desktop && (
          <div className={classes.middleList}>
            <div className={classes.contentMap}>
              <MainMap
                filteredPositions={filteredPositions}
                selectedPosition={selectedPosition}
                onEventsClick={onEventsClick}
              />
            </div>

            <Paper
              square
              className={classes.contentList}
              style={devicesOpen ? {} : { display: "none" }}>
              <DeviceList devices={filteredDevices} />
            </Paper>
          </div>
        )}
      </div>
      <EventsDrawer open={eventsOpen} onClose={() => setEventsOpen(false)} />
      {selectedDeviceId && (
        <StatusCard
          deviceId={selectedDeviceId}
          position={selectedPosition}
          onClose={() => dispatch(devicesActions.selectId(null))}
          desktopPadding={theme.dimensions.drawerWidthDesktop}
        />
      )}
    </div>
  );
};

export default MainPage;
