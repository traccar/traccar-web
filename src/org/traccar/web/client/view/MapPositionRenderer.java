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

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.gwtopenmaps.openlayers.client.Icon;
import org.gwtopenmaps.openlayers.client.Marker;
import org.gwtopenmaps.openlayers.client.feature.VectorFeature;
import org.gwtopenmaps.openlayers.client.geometry.LineString;
import org.gwtopenmaps.openlayers.client.geometry.Point;
import org.gwtopenmaps.openlayers.client.layer.Markers;
import org.gwtopenmaps.openlayers.client.layer.Vector;
import org.traccar.web.shared.model.Device;
import org.traccar.web.shared.model.Position;


public class MapPositionRenderer {

    private final MapView mapView;
    private final Vector vectorLayer;
    private final Markers markerLayer;
    private final MarkerIconFactory.IconType iconType;

    public MapPositionRenderer(MapView mapView, MarkerIconFactory.IconType iconType) {
        this.mapView = mapView;
        vectorLayer = mapView.getVectorLayer();
        markerLayer = mapView.getMarkerLayer();
        this.iconType = iconType;
    }

    /*
     * TODO: a lot of mess here
     * 1. changeMarkerIcon doesn't save new marker
     * 2. if device selected save device instead of position
     * 3. find way to change marker icon
     * 4. shorter cleaner methods
     * ... maybe something else
     */

    private void changeMarkerIcon(Marker marker, Icon icon) {
        Marker newMarker = new Marker(marker.getLonLat(), icon);
        markerLayer.removeMarker(marker);
        markerLayer.addMarker(newMarker);
    }

    private Map<Long, Marker> markerMap = new HashMap<Long, Marker>(); // Position.id -> Marker
    private Map<Long, Long> deviceMap = new HashMap<Long, Long>(); // Device.id -> Position.id

    private Long selectedPositionId;

    public void showPositions(List<Position> positions) {
        for (Marker marker : markerMap.values()) {
            markerLayer.removeMarker(marker);
        }
        markerMap.clear();
        deviceMap.clear();

        for (Position position : positions) {
            Marker marker = new Marker(
                    mapView.createLonLat(position.getLongitude(), position.getLatitude()),
                    MarkerIconFactory.getIcon(iconType, false));
            markerMap.put(position.getId(), marker);
            deviceMap.put(position.getDevice().getId(), position.getId());
            markerLayer.addMarker(marker);
        }

        if (selectedPositionId != null) {
            selectPosition(null, selectedPositionId, false);
        }
    }

    public void showTrack(List<Position> positions) {
        vectorLayer.destroyFeatures();

        if (!positions.isEmpty()) {
            Point[] linePoints = new Point[positions.size()];

            int i = 0;
            for (Position position : positions) {
                linePoints[i++] = mapView.createPoint(position.getLongitude(), position.getLatitude());
            }

            LineString lineString = new LineString(linePoints);
            vectorLayer.addFeature(new VectorFeature(lineString));
            //mapView.getMap().zoomToExtent(lineString.getBounds());
        }
    }

    public void selectPosition(Position position, boolean center) {
        selectPosition(selectedPositionId, position.getId(), center);
    }

    public void selectDevice(Device device, boolean center) {
        Long positionId = (device != null) ? deviceMap.get(device.getId()) : null;
        selectPosition(selectedPositionId, positionId, center);
    }

    private void selectPosition(Long oldPositionId, Long newPositionId, boolean center) {
        if (oldPositionId != null && markerMap.containsKey(oldPositionId)) {
            changeMarkerIcon(markerMap.get(oldPositionId), MarkerIconFactory.getIcon(iconType, false));
            selectedPositionId = null;
        }
        if (newPositionId != null && markerMap.containsKey(newPositionId)) {
            Marker marker = markerMap.get(newPositionId);
            changeMarkerIcon(marker, MarkerIconFactory.getIcon(iconType, true));
            if (center) {
                mapView.getMap().panTo(marker.getLonLat());
            }
            selectedPositionId = newPositionId;
        }
    }

}
