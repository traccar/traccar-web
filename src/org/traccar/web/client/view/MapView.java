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

import java.util.List;

import org.gwtopenmaps.openlayers.client.LonLat;
import org.gwtopenmaps.openlayers.client.Map;
import org.gwtopenmaps.openlayers.client.MapOptions;
import org.gwtopenmaps.openlayers.client.MapWidget;
import org.gwtopenmaps.openlayers.client.Projection;
import org.gwtopenmaps.openlayers.client.Style;
import org.gwtopenmaps.openlayers.client.control.LayerSwitcher;
import org.gwtopenmaps.openlayers.client.control.ScaleLine;
import org.gwtopenmaps.openlayers.client.geometry.Point;
import org.gwtopenmaps.openlayers.client.layer.Bing;
import org.gwtopenmaps.openlayers.client.layer.BingOptions;
import org.gwtopenmaps.openlayers.client.layer.BingType;
import org.gwtopenmaps.openlayers.client.layer.GoogleV3;
import org.gwtopenmaps.openlayers.client.layer.GoogleV3MapType;
import org.gwtopenmaps.openlayers.client.layer.GoogleV3Options;
import org.gwtopenmaps.openlayers.client.layer.Markers;
import org.gwtopenmaps.openlayers.client.layer.MarkersOptions;
import org.gwtopenmaps.openlayers.client.layer.OSM;
import org.gwtopenmaps.openlayers.client.layer.Vector;
import org.gwtopenmaps.openlayers.client.layer.VectorOptions;
import org.traccar.web.shared.model.Device;
import org.traccar.web.shared.model.Position;

import com.google.gwt.core.client.Scheduler;
import com.google.gwt.event.logical.shared.ResizeEvent;
import com.google.gwt.event.logical.shared.ResizeHandler;
import com.google.gwt.user.client.Command;
import com.sencha.gxt.widget.core.client.ContentPanel;

public class MapView {

    public interface MapHandler {
        public void onPositionSelected(Position position);
        public void onArchivePositionSelected(Position position);
    }

    private MapHandler mapHandler;

    private ContentPanel contentPanel;

    public ContentPanel getView() {
        return contentPanel;
    }

    private MapWidget mapWidget;
    private Map map;
    private Vector vectorLayer;
    private Markers markerLayer;

    public Map getMap() {
        return map;
    }

    public Vector getVectorLayer() {
        return vectorLayer;
    }

    public Markers getMarkerLayer() {
        return markerLayer;
    }

    public LonLat createLonLat(double longitude, double latitude) {
        LonLat lonLat = new LonLat(longitude, latitude);
        lonLat.transform(new Projection("EPSG:4326").getProjectionCode(), map.getProjection());
        return lonLat;
    }

    public Point createPoint(double x, double y) {
        Point point = new Point(x, y);
        point.transform(new Projection("EPSG:4326"), new Projection(map.getProjection()));
        return point;
    }

    private void initMapLayers(Map map) {
        map.addLayer(OSM.Mapnik("OpenStreetMap"));

        GoogleV3Options gHybridOptions = new GoogleV3Options();
        gHybridOptions.setNumZoomLevels(20);
        gHybridOptions.setType(GoogleV3MapType.G_HYBRID_MAP);
        map.addLayer(new GoogleV3("Google Hybrid", gHybridOptions));

        GoogleV3Options gNormalOptions = new GoogleV3Options();
        gNormalOptions.setNumZoomLevels(22);
        gNormalOptions.setType(GoogleV3MapType.G_NORMAL_MAP);
        map.addLayer(new GoogleV3("Google Normal", gNormalOptions));

        GoogleV3Options gSatelliteOptions = new GoogleV3Options();
        gSatelliteOptions.setNumZoomLevels(20);
        gSatelliteOptions.setType(GoogleV3MapType.G_SATELLITE_MAP);
        map.addLayer(new GoogleV3("Google Satellite", gSatelliteOptions));

        GoogleV3Options gTerrainOptions = new GoogleV3Options();
        gTerrainOptions.setNumZoomLevels(16);
        gTerrainOptions.setType(GoogleV3MapType.G_TERRAIN_MAP);
        map.addLayer(new GoogleV3("Google Terrain", gTerrainOptions));

        final String bingKey = "AseEs0DLJhLlTNoxbNXu7DGsnnH4UoWuGue7-irwKkE3fffaClwc9q_Mr6AyHY8F";
        map.addLayer(new Bing(new BingOptions("Bing Road", bingKey, BingType.ROAD)));
        map.addLayer(new Bing(new BingOptions("Bing Hybrid", bingKey, BingType.HYBRID)));
        map.addLayer(new Bing(new BingOptions("Bing Aerial", bingKey, BingType.AERIAL)));
    }

    public MapView(MapHandler mapHandler) {
        this.mapHandler = mapHandler;
        contentPanel = new ContentPanel();
        contentPanel.setHeadingText("Map");

        MapOptions defaultMapOptions = new MapOptions();

        mapWidget = new MapWidget("100%", "100%", defaultMapOptions);
        map = mapWidget.getMap();

        Style style = new Style();
        style.setStrokeColor("blue");
        style.setStrokeWidth(3);
        style.setFillOpacity(1);

        VectorOptions vectorOptions = new VectorOptions();
        vectorOptions.setStyle(style);
        vectorLayer = new Vector("Vector", vectorOptions);

        MarkersOptions markersOptions = new MarkersOptions();
        markerLayer = new Markers("Markers", markersOptions);

        initMapLayers(map);

        map.addLayer(vectorLayer);
        map.addLayer(markerLayer);

        map.addControl(new LayerSwitcher());
        map.addControl(new ScaleLine());
        map.setCenter(createLonLat(12.5, 41.9), 1);

        contentPanel.add(mapWidget);

        // Update map size
        contentPanel.addResizeHandler(new ResizeHandler() {
            @Override
            public void onResize(ResizeEvent event) {
                Scheduler.get().scheduleDeferred(new Command() {
                    @Override
                    public void execute() {
                        map.updateSize();
                    }
                });
            }
        });

        latestPositionRenderer = new MapPositionRenderer(this, MarkerIconFactory.IconType.iconLatest, latestPositionSelectHandler);
        archivePositionRenderer = new MapPositionRenderer(this, MarkerIconFactory.IconType.iconArchive, archivePositionSelectHandler);
    }

    private final MapPositionRenderer latestPositionRenderer;

    private final MapPositionRenderer archivePositionRenderer;

    public void showLatestPositions(List<Position> positions) {
        latestPositionRenderer.showPositions(positions);
    }

    public void showArchivePositions(List<Position> positions) {
        archivePositionRenderer.showTrack(positions);
        archivePositionRenderer.showPositions(positions);
    }

    public void selectDevice(Device device) {
        latestPositionRenderer.selectDevice(device, true);
    }

    public void selectArchivePosition(Position position) {
        archivePositionRenderer.selectPosition(position, true);
    }

    private MapPositionRenderer.SelectHandler latestPositionSelectHandler = new MapPositionRenderer.SelectHandler() {

        @Override
        public void onSelected(Position position) {
            mapHandler.onPositionSelected(position);
        }

    };

    private MapPositionRenderer.SelectHandler archivePositionSelectHandler = new MapPositionRenderer.SelectHandler() {

        @Override
        public void onSelected(Position position) {
            mapHandler.onArchivePositionSelected(position);
        }

    };

}
