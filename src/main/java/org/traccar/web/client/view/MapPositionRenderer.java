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
package org.traccar.web.client.view;

import java.util.*;

import org.gwtopenmaps.openlayers.client.Icon;
import org.gwtopenmaps.openlayers.client.Marker;
import org.gwtopenmaps.openlayers.client.event.EventHandler;
import org.gwtopenmaps.openlayers.client.event.EventObject;
import org.gwtopenmaps.openlayers.client.feature.VectorFeature;
import org.gwtopenmaps.openlayers.client.geometry.LineString;
import org.gwtopenmaps.openlayers.client.geometry.Point;
import org.gwtopenmaps.openlayers.client.layer.Markers;
import org.gwtopenmaps.openlayers.client.layer.Vector;
import org.traccar.web.shared.model.Device;
import org.traccar.web.shared.model.Position;

import com.google.gwt.dom.client.Style;
import com.google.gwt.user.client.ui.RootPanel;


public class MapPositionRenderer {

    public interface SelectHandler {
        public void onSelected(Position position);
    }

    private final MapView mapView;
    private final MarkerIconFactory.IconType iconType;

    protected Vector getVectorLayer() {
        return mapView.getVectorLayer();
    }

    protected Markers getMarkerLayer() {
        return mapView.getMarkerLayer();
    }

    private SelectHandler selectHandler;

    public MapPositionRenderer(MapView mapView, MarkerIconFactory.IconType iconType, SelectHandler selectHandler) {
        this.mapView = mapView;
        this.iconType = iconType;
        this.selectHandler = selectHandler;
    }

    private void addSelectEvent(Marker marker, final Position position) {
        if (selectHandler != null) {
            marker.getEvents().register("click", marker, new EventHandler() {
                @Override
                public void onHandle(EventObject eventObject) {
                    selectHandler.onSelected(position);
                }
            });
            marker.getEvents().register("mouseover", marker, new EventHandler() {
                @Override
                public void onHandle(EventObject eventObject) {
                    RootPanel.get().getElement().getStyle().setCursor(Style.Cursor.SE_RESIZE);
                }
            });
            marker.getEvents().register("mouseout", marker, new EventHandler() {
                @Override
                public void onHandle(EventObject eventObject) {
                    RootPanel.get().getElement().getStyle().setCursor(Style.Cursor.AUTO);
                }
            });
        }
    }

    private void changeMarkerIcon(Long positionId, Icon icon) {
        Marker oldMarker = markerMap.get(positionId);
        Marker newMarker = new Marker(oldMarker.getLonLat(), icon);
        addSelectEvent(newMarker, positionMap.get(positionId));
        markerMap.put(positionId, newMarker);
        getMarkerLayer().addMarker(newMarker);
        getMarkerLayer().removeMarker(oldMarker);
    }

    private Map<Long, Marker> markerMap = new HashMap<Long, Marker>(); // Position.id -> Marker
    private Map<Long, Long> deviceMap = new HashMap<Long, Long>(); // Device.id -> Position.id
    private Map<Long, Position> positionMap = new HashMap<Long, Position>(); // Position.id -> Position

    private List<VectorFeature> tracks = new ArrayList<VectorFeature>();
    private List<VectorFeature> labels = new ArrayList<VectorFeature>();

    private Long selectedPositionId;
    private Long selectedDeviceId;

    public void showPositions(List<Position> positions) {
        for (Marker marker : markerMap.values()) {
            getMarkerLayer().removeMarker(marker);
        }
        markerMap.clear();
        deviceMap.clear();
        positionMap.clear();

        for (Position position : positions) {
            Marker marker = new Marker(
                    mapView.createLonLat(position.getLongitude(), position.getLatitude()),
                    MarkerIconFactory.getIcon(iconType, false));
            markerMap.put(position.getId(), marker);
            deviceMap.put(position.getDevice().getId(), position.getId());
            positionMap.put(position.getId(), position);
            addSelectEvent(marker, position);
            getMarkerLayer().addMarker(marker);
        }

        if (selectedPositionId != null) {
            if (!selectPosition(null, selectedPositionId, false)) {
                selectedPositionId = null;
            }
        }

        if (selectedDeviceId != null) {
            if (!selectPosition(null, deviceMap.get(selectedDeviceId), false)) {
                selectedDeviceId = null;
            }
        }
    }

    public void showDeviceName(List<Position> positions) {
        for (VectorFeature label : labels) {
            getVectorLayer().removeFeature(label);
            label.destroy();
        }
        labels.clear();

        for (Position position : positions) {
            org.gwtopenmaps.openlayers.client.Style st = new org.gwtopenmaps.openlayers.client.Style();
            st.setLabel(position.getDevice().getName());
            st.setLabelXOffset(0);
            st.setLabelYOffset(-12);
            st.setLabelAlign("cb");
            st.setFontColor("#0000FF");
            st.setFontSize("12");
            st.setFill(false);
            st.setStroke(false);

            final VectorFeature point = new VectorFeature(mapView.createPoint(position.getLongitude(), position.getLatitude()), st);
            getVectorLayer().addFeature(point);
            labels.add(point);
        }
    }

    public void showTrack(List<Position> positions, boolean clearExisting) {
        if (clearExisting) {
            for (VectorFeature track : tracks) {
                getVectorLayer().removeFeature(track);
                track.destroy();
            }
            tracks.clear();
        }

        if (!positions.isEmpty()) {
            Point[] linePoints = new Point[positions.size()];

            int i = 0;
            for (Position position : positions) {
                linePoints[i++] = mapView.createPoint(position.getLongitude(), position.getLatitude());
            }

            LineString lineString = new LineString(linePoints);
            VectorFeature track = new VectorFeature(lineString);
            getVectorLayer().addFeature(track);
            tracks.add(track);
            //mapView.getMap().zoomToExtent(lineString.getBounds());
        }
    }

    public void selectPosition(Position position, boolean center) {
        Long oldPositionId = selectedPositionId;
        Long newPositionId = (position != null) ? position.getId() : null;
        if (selectPosition(oldPositionId, newPositionId, center)) {
            selectedPositionId = position.getId();
        } else {
            selectedPositionId = null;
        }
    }

    public void selectDevice(Device device, boolean center) {
        Long oldPositionId = (selectedDeviceId != null) ? deviceMap.get(selectedDeviceId) : null;
        Long newPositionId = (device != null) ? deviceMap.get(device.getId()) : null;
        if (selectPosition(oldPositionId, newPositionId, center)) {
            selectedDeviceId = device.getId();
        } else {
            selectedDeviceId = null;
        }
    }

    private boolean selectPosition(Long oldPositionId, Long newPositionId, boolean center) {
        if (oldPositionId != null && markerMap.containsKey(oldPositionId)) {
            changeMarkerIcon(oldPositionId, MarkerIconFactory.getIcon(iconType, false));
        }
        if (newPositionId != null && markerMap.containsKey(newPositionId)) {
            changeMarkerIcon(newPositionId, MarkerIconFactory.getIcon(iconType, true));
            if (center) {
                mapView.getMap().panTo(markerMap.get(newPositionId).getLonLat());
            }
            return true;
        }
        return false;
    }

    public void catchPosition(Position position) {
        if (!mapView.getMap().getExtent().containsLonLat(mapView.createLonLat(position.getLongitude(), position.getLatitude()), true)) {
            selectPosition(position, true);
        }
    }

    public void drawLatestPositionTrack(Position position) {
        if (deviceMap.containsKey(position.getDevice().getId())) {
            Position prevPosition = positionMap.get(deviceMap.get(position.getDevice().getId()));
            showTrack(Arrays.asList(prevPosition, position), false);

            VectorFeature point = new VectorFeature(mapView.createPoint(prevPosition.getLongitude(), prevPosition.getLatitude()), getTrackPointStyle());
            getVectorLayer().addFeature(point);
            tracks.add(point);
        }
        deviceMap.put(position.getDevice().getId(), position.getId());
        positionMap.put(position.getId(), position);
    }

    org.gwtopenmaps.openlayers.client.Style trackPointStyle;

    private org.gwtopenmaps.openlayers.client.Style getTrackPointStyle() {
        if (trackPointStyle == null) {
            trackPointStyle = new org.gwtopenmaps.openlayers.client.Style();
            trackPointStyle.setPointRadius(5d);
            trackPointStyle.setFillOpacity(1d);
        }
        return trackPointStyle;
    }
}
