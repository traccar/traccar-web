package org.traccar.web.client.view;

import java.util.AbstractMap;
import java.util.HashMap;
import java.util.List;

import org.gwtopenmaps.openlayers.client.Icon;
import org.gwtopenmaps.openlayers.client.LonLat;
import org.gwtopenmaps.openlayers.client.Map;
import org.gwtopenmaps.openlayers.client.MapOptions;
import org.gwtopenmaps.openlayers.client.MapWidget;
import org.gwtopenmaps.openlayers.client.Marker;
import org.gwtopenmaps.openlayers.client.Pixel;
import org.gwtopenmaps.openlayers.client.Projection;
import org.gwtopenmaps.openlayers.client.Size;
import org.gwtopenmaps.openlayers.client.control.ScaleLine;
import org.gwtopenmaps.openlayers.client.layer.Markers;
import org.gwtopenmaps.openlayers.client.layer.OSM;
import org.traccar.web.shared.model.Device;
import org.traccar.web.shared.model.Position;

import com.google.gwt.core.client.Scheduler;
import com.google.gwt.event.logical.shared.ResizeEvent;
import com.google.gwt.event.logical.shared.ResizeHandler;
import com.google.gwt.user.client.Command;
import com.sencha.gxt.widget.core.client.ContentPanel;

class MarkerIconFactory {

    private static final Size iconSize = new Size(21, 25);
    private static final Pixel iconOffset = new Pixel(-10.5f, -25.0f);

    private static final String iconUrl = "http://www.openlayers.org/api/img/";
    private static final String iconRed = iconUrl + "marker.png";
    private static final String iconBlue = iconUrl + "marker-blue.png";
    private static final String iconGreen = iconUrl + "marker-green.png";
    private static final String iconGold = iconUrl + "marker-gold.png";

    public static Icon getLocationIcon() {
        return new Icon(iconRed, iconSize, iconOffset);
    }

    public static Icon getSelectedLocationIcon() {
        return new Icon(iconGreen, iconSize, iconOffset);
    }

    public static Icon getArchiveIcon() {
        return new Icon(iconBlue, iconSize, iconOffset);
    }

    public static Icon getSelectedArchiveIcon() {
        return new Icon(iconGold, iconSize, iconOffset);
    }

}

public class MapView {

    private ContentPanel contentPanel;

    public ContentPanel getView() {
        return contentPanel;
    }

    private MapWidget mapWidget;
    private Map map;
    private Markers markerLayer;

    private LonLat createPoint(double longitude, double latitude) {
        LonLat point = new LonLat(longitude, latitude);
        point.transform(new Projection("EPSG:4326").getProjectionCode(), map.getProjection());
        return point;
    }

    public MapView() {
        contentPanel = new ContentPanel();
        contentPanel.setHeadingText("Map");

        MapOptions defaultMapOptions = new MapOptions();
        defaultMapOptions.setNumZoomLevels(16);

        mapWidget = new MapWidget("100%", "100%", defaultMapOptions);
        map = mapWidget.getMap();

        OSM mapLayer = OSM.Mapnik("Mapnik");
        mapLayer.setIsBaseLayer(true);

        markerLayer = new Markers("Markers");

        map.addLayer(mapLayer);
        map.addLayer(markerLayer);
        map.addControl(new ScaleLine());
        map.setCenter(createPoint(30, 60), 1);

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
    }

    private AbstractMap<Long, Marker> markerMap = new HashMap<Long, Marker>();
    private Device selectedDevice;

    public void showPositions(List<Position> positions) {
        markerMap.clear();
        markerLayer.clearMarkers();
        for (Position position : positions) {
            Marker marker = new Marker(
                    createPoint(position.getLongitude(), position.getLatitude()), MarkerIconFactory.getLocationIcon());
            markerMap.put(position.getDevice().getId(), marker);
            markerLayer.addMarker(marker);
        }
        if (selectedDevice != null) {
            select(selectedDevice, false);
        }
    }

    private void changeMarkerIcon(Marker marker, Icon icon) {
        Marker newMarker = new Marker(marker.getLonLat(), icon);
        markerLayer.removeMarker(marker);
        markerLayer.addMarker(newMarker);
    }

    public void select(Device device, boolean center) {
        if (selectedDevice != null) {
            changeMarkerIcon(markerMap.get(selectedDevice.getId()), MarkerIconFactory.getLocationIcon());
            selectedDevice = null;
        }
        if (device != null && markerMap.containsKey(device.getId())) {
            Marker marker = markerMap.get(device.getId());
            if (center) {
                map.panTo(marker.getLonLat());
            }
            changeMarkerIcon(marker, MarkerIconFactory.getSelectedLocationIcon());
            selectedDevice = device;
        }
    }

}
