import React, { useState, useCallback, useEffect } from "react";
import { Paper } from "@mui/material";
import { makeStyles } from "@mui/styles";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
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

const useStyles = makeStyles((theme) => ({
  root: {
    height: "100vh",
    width: "100%",
    display: "flex",
    flexDirection: "row",
  },
  sidebar: {
    width: "35%",
    height: "100%",
    pointerEvents: "none",
    display: "flex",
    flexDirection: "column",
    overflowY: "auto",
    borderRight: "1px solid #ddd",
    backgroundColor: "#fff",
    [theme.breakpoints.down("md")]: {
      width: "100%",
      position: "absolute",
      zIndex: 10,
      backgroundColor: "#fff",
    },
  },
  mainContent: {
    width: "65%",
    height: "100%",
    position: "relative",
    marginLeft: "10px",
    [theme.breakpoints.down("md")]: {
      width: "100%",
      display: "none",
    },
  },
  header: {
    pointerEvents: "auto",
    zIndex: 6,
  },
  footer: {
    pointerEvents: "auto",
    zIndex: 5,
  },
  middle: {
    flex: 1,
    display: "grid",
  },
  contentMap: {
    pointerEvents: "auto",
    gridArea: "1 / 1",
  },
  contentList: {
    pointerEvents: "auto",
    gridArea: "1 / 1",
    zIndex: 4,
  },
}));

const MainPage = () => {
  const classes = useStyles();
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
      <div className={classes.sidebar}>
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
        <div className={classes.middle}>
          {!desktop && (
            <div className={classes.contentMap}>
              <MainMap
                filteredPositions={filteredPositions}
                selectedPosition={selectedPosition}
                onEventsClick={onEventsClick}
              />
            </div>
          )}
          <Paper
            square
            className={classes.contentList}
            style={devicesOpen ? {} : { visibility: "hidden" }}
          >
            <DeviceList devices={filteredDevices} />
          </Paper>
        </div>
        {desktop && (
          <div className={classes.footer}>
            <BottomMenu />
          </div>
        )}
      </div>
      <div className={classes.mainContent}>
        {desktop && (
          <MainMap
            filteredPositions={filteredPositions}
            selectedPosition={selectedPosition}
            onEventsClick={onEventsClick}
          />
        )}
      </div>
      <EventsDrawer open={eventsOpen} onClose={() => setEventsOpen(false)} />
      {/* {selectedDeviceId && (
        <StatusCard
          deviceId={selectedDeviceId}
          position={selectedPosition}
          onClose={() => dispatch(devicesActions.selectId(null))}
          desktopPadding={theme.dimensions.drawerWidthDesktop}
        />
      )} */}
    </div>
  );
};

export default MainPage;
