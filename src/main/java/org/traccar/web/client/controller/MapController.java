/*
 * Copyright 2013 Anton Tananaev (anton.tananaev@gmail.com)
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
package org.traccar.web.client.controller;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collections;
import java.util.Comparator;
import java.util.HashMap;
import java.util.LinkedList;
import java.util.List;
import java.util.Map;

import org.traccar.web.client.Application;
import org.traccar.web.client.ApplicationContext;
import org.traccar.web.client.view.MapView;
import org.traccar.web.client.view.MarkerIconFactory;
import org.traccar.web.shared.model.Device;
import org.traccar.web.shared.model.Position;

import com.google.gwt.user.client.Timer;
import com.google.gwt.user.client.rpc.AsyncCallback;
import com.sencha.gxt.widget.core.client.ContentPanel;
import org.traccar.web.shared.model.UserSettings;

public class MapController implements ContentController, MapView.MapHandler {

    public interface MapHandler {
        public void onDeviceSelected(Device device);
        public void onArchivePositionSelected(Position position);
    }

    private MapHandler mapHandler;

    private MapView mapView;

    public MapController(MapHandler mapHandler) {
        this.mapHandler = mapHandler;
        mapView = new MapView(this);
        loadMapSettings();
    }

    @Override
    public ContentPanel getView() {
        return mapView.getView();
    }

    public org.gwtopenmaps.openlayers.client.Map getMap() {
        return mapView.getMap();
    }

    private Timer updateTimer;

    @Override
    public void run() {
        latestNonIdlePositionMap.clear();
        updateTimer = new Timer() {
            @Override
            public void run() {
                update();
            }
        };
        Application.getDataService().getLatestNonIdlePositions(new AsyncCallback<List<Position>>() {
            @Override
            public void onFailure(Throwable throwable) {
                update();
            }

            @Override
            public void onSuccess(List<Position> positions) {
                for (Position position : positions) {
                    latestNonIdlePositionMap.put(position.getDevice().getId(), position);
                }
                update();
            }
        });
    }

    private Map<Long, Position> latestPositionMap = new HashMap<Long, Position>();

    private Map<Long, Position> latestNonIdlePositionMap = new HashMap<Long, Position>();

    private Map<Long, Position> timestampMap = new HashMap<Long, Position>();

    public void update() {
        updateTimer.cancel();
        Application.getDataService().getLatestPositions(new AsyncCallback<List<Position>>() {
            @Override
            public void onSuccess(List<Position> result) {
                /**
                 * Set up icon
                 */
                long currentTime = System.currentTimeMillis();
                for (Position position : result) {
                    boolean isOffline = currentTime - position.getTime().getTime() > position.getDevice().getTimeout() * 1000;
                    position.setStatus(isOffline ? Position.Status.OFFLINE : Position.Status.LATEST);
                }
                /**
                 * Draw positions
                 */
                mapView.showLatestPositions(result);
                mapView.showDeviceName(result);
                /**
                 * Follow positions and draw track if necessary
                 */
                for (Position position : result) {
                    Device device = position.getDevice();
                    Position prevPosition = latestPositionMap.get(device.getId());
                    if (prevPosition != null && prevPosition.getId() != position.getId()) {
                        if (ApplicationContext.getInstance().isFollowing(device)) {
                            mapView.catchPosition(position);
                        }
                        if (ApplicationContext.getInstance().isRecordingTrace(device)) {
                            mapView.showLatestTrackPositions(Arrays.asList(prevPosition));
                            mapView.showLatestTrack(Arrays.asList(prevPosition, position));
                        }
                    }
                    if (ApplicationContext.getInstance().isRecordingTrace(device)) {
                        Position prevTimestampPosition = timestampMap.get(device.getId());

                        if (prevTimestampPosition == null ||
                                (position.getTime().getTime() - prevTimestampPosition.getTime().getTime() >= ApplicationContext.getInstance().getUserSettings().getTimePrintInterval() * 60 * 1000)) {
                            mapView.showLatestTime(Arrays.asList(position));
                            timestampMap.put(device.getId(), position);
                        }
                    }
                    if (position.getSpeed() != null) {
                        if (position.getSpeed().doubleValue() > position.getDevice().getIdleSpeedThreshold()) {
                            latestNonIdlePositionMap.put(device.getId(), position);
                        } else {
                            Position latestNonIdlePosition = latestNonIdlePositionMap.get(device.getId());
                            if (latestNonIdlePosition != null) {
                                position.setIdleSince(latestNonIdlePosition.getTime());
                            }
                        }
                    }
                    latestPositionMap.put(device.getId(), position);
                }
                updateTimer.schedule(ApplicationContext.getInstance().getApplicationSettings().getUpdateInterval());
            }

            @Override
            public void onFailure(Throwable caught) {
                updateTimer.schedule(ApplicationContext.getInstance().getApplicationSettings().getUpdateInterval());
            }
        });
    }

    public void selectDevice(Device device) {
        mapView.selectDevice(device);
    }

    public void showArchivePositions(List<Position> positions) {
        List<Position> sortedPositions = new LinkedList<Position>(positions);
        Collections.sort(sortedPositions, new Comparator<Position>() {
            @Override
            public int compare(Position o1, Position o2) {
                return o1.getTime().compareTo(o2.getTime());
            }
        });
        mapView.showArchiveTrack(sortedPositions);
        mapView.showArchivePositions(sortedPositions);
        List<Position> withTime = new ArrayList<Position>();
        long prevTime = -1;
        for (Position position : positions) {
            if (prevTime < 0 ||
                (position.getTime().getTime() - prevTime >= ApplicationContext.getInstance().getUserSettings().getTimePrintInterval() * 60 * 1000)) {
                withTime.add(position);
                prevTime = position.getTime().getTime();
            }
        }
        mapView.showArchiveTime(withTime);
    }

    public void selectArchivePosition(Position position) {
        mapView.selectArchivePosition(position);
    }

    @Override
    public void onPositionSelected(Position position) {
        mapHandler.onDeviceSelected(position.getDevice());
    }

    @Override
    public void onArchivePositionSelected(Position position) {
        mapHandler.onArchivePositionSelected(position);
    }

    public void loadMapSettings() {
        UserSettings userSettings = ApplicationContext.getInstance().getUserSettings();
        mapView.getMap().setCenter(mapView.createLonLat(userSettings.getCenterLongitude(), userSettings.getCenterLatitude()), userSettings.getZoomLevel());
    }

    public Position getLatestPosition(Device device) {
        return latestPositionMap.get(device.getId());
    }
}
